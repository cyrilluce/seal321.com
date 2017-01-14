import * as fs from 'mz/fs';
import * as path from 'path';
import mysqlPool from '../lib/mysql';
import * as mysql from 'mysql';
import * as config from '../config';
import logger from '../logger';
import * as  deployUtil from '../util/deploy';
import * as asyncLib from 'async';

async function backupFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(fs.createWriteStream(filePath + '.bak'))
            .on('close', () => { resolve() })
            .on('error', reject);
    });
}

async function processFile(data) {
    let content = new Buffer(data.content, 'hex');
    let filePath = path.resolve(__dirname, '../..', data.filePath);

    let stat = await fs.stat(filePath);

    if (stat.isFile()) {
        logger.info('发布工具', '备份文件', filePath);
        await backupFile(filePath);
    }

    logger.info('发布工具', '写入文件', filePath);
    await fs.writeFile(filePath, content);
}

async function processRestart(data) {
    // 怎么重启自身？可能需要新开进程？
    // 或可考虑直接process.exit？
    logger.info('发布工具', '即将重启');
    setTimeout(() => {
        process.exit(0);
    }, 3000);
}

async function processDb(data) {
    if (!(data.db in config.dbs) || !data.table || data.table === 'base' || !/^[a-z]+$/.test(data.table)) {
        logger.error('发布工具', '错误', '没有数据或类型不在白名单内');
        throw new Error('没有数据或类型不在白名单内');
    }

    let model;
    try {
        model = require('../dbs/' + data.table);
    } catch (e) {
        model = null;
    }

    if (!model) {
        logger.error('发布工具', '错误', '没有找到对应数据类型', data.table);
        throw new Error('没有找到对应数据类型' + data.table);
    }

    let db = data.db;
    let table = data.table;
    let version = data.version;
    // 创建
    let tableName = `seal_${db}_${table}`;
    let tmpTableName = `${tableName}_${version}`;
    tableName = mysql['escapeId'](tableName, true);
    tmpTableName = mysql['escapeId'](tmpTableName, true);
    await new Promise((resolve, reject) => {
        asyncLib.waterfall([
            cb => mysqlPool.getConnection(cb),
            // 确保没有脏数据
            (conn: mysql.IConnection, cb) => {
                conn.query(`DROP TABLE IF EXISTS ${tmpTableName}`,
                    err => cb(err, conn));
            },
            // 创建表
            (conn: mysql.IConnection, cb) => {
                let fieldsSql = model.getFieldsSql();
                conn.query(`CREATE TABLE ${tmpTableName} ( ${fieldsSql} ) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci`,
                    err => cb(err, conn));
            },
            // 写入数据
            (conn: mysql.IConnection, cb) => {
                let fields = model.getFields();
                // 数据量比较大，最好分批？
                const batch = 100;
                let list = data.data;
                let size = Math.ceil(list.length / batch);
                let tasks = [];
                for (let i = 0; i < size; i++) {
                    tasks.push(cb => {
                        let values = list.slice(i * batch, (i + 1) * batch).map(row => fields.map(field => row[field]));
                        conn.query(`INSERT INTO ${tmpTableName} (??) VALUES ?`,
                            [fields, values], cb);
                    })
                }
                asyncLib.parallelLimit(tasks, 1, err => {
                    cb(err, conn);
                })
            },
            // 添加索引、主键
            (conn: mysql.IConnection, cb) => {
                let indexesSql = model.getIndexesSql();
                conn.query(`ALTER TABLE ${tmpTableName} ${indexesSql}`,
                    err => cb(err, conn));
            },
            // 删除旧表
            (conn: mysql.IConnection, cb) => {
                conn.query(`DROP TABLE IF EXISTS ${tableName}`,
                    err => cb(err, conn));
            },
            // 改名新表
            (conn: mysql.IConnection, cb) => {
                conn.query(`RENAME TABLE ${tmpTableName} TO ${tableName}`,
                    err => cb(err, conn));
            },
            // TODO 更新版本，用mysql或mongo？

        ], err => {
            if (err) {
                logger.error('发布工具', 'db', db, table, version, '失败', err);
                return reject(err);
            }
            logger.info('发布工具', 'db', db, table, version, '成功');
            resolve();
        });
    })
}

export default async function (ctx, next) {
    try {
        let data = await deployUtil.unpackAsync(ctx.req);
        // 可能会被重放攻击。。。先加上timestamp临时顶一下，如果换ssl可能会好不好，双方校验。
        // 当然也可以自己设计一个协议，连接后返回一个随机数，用随机数当salt生成密钥？
        if (!data || !data.type || Math.abs(Date.now() - (parseInt(data.timestamp, 10) || 0)) > 5 * 60 * 1000) {
            logger.error('发布工具', '错误', data);
            throw new Error('数据解析失败');
        }
        switch (data.type) {
            case 'file':
                await processFile(data);
                break;
            case 'restart':
                await processRestart(data);
                break;
            case 'db': {
                await processDb(data);
                break;
            }
            default:
                logger.error('发布工具', '未能识别的操作');
                throw new Error('未能识别的操作');
        }
        ctx.body = "success";
    } catch (err) {
        ctx.body = "error " + err && err.message;
    }
};
