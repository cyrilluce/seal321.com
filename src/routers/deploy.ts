import * as fs from 'mz/fs';
import * as mkdirp from 'mkdirp';
import * as path from 'path';
import mysqlPool from '../lib/mysql';
import * as mysql from 'mysql';
import * as config from '../config';
import logger from '../logger';
import * as  deployUtil from '../util/deploy';
import * as asyncLib from 'async';
import { promiseCall, promisify } from '../util';
import { ServerNames, DbNames } from '../lang'
import { Relation } from '../types'

/** 公告 */
interface Notice{
    time?: number;
    content: string;
    type: string;
}

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

    // 保证目录存在
    await promiseCall(mkdirp, null, path.dirname(filePath));

    let stat;
    try {
        stat = await fs.stat(filePath);
    } catch (err) {

    }

    if (stat && stat.isFile()) {
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

async function recursiveRemove(dirPath, skipRoot = false) {
    const files = await fs.readdir(dirPath);
    await Promise.all(files.map(async file => {
        // 防止误删本地文件和配置文件？
        if (/\.tsx?$/.test(file) || file === 'localConfig.js') {
            return;
        }
        let stat, filePath = path.resolve(dirPath, file);
        try {
            stat = await fs.stat(filePath);
        } catch (err) { }
        if (!stat) {
            return;
        }
        if (stat.isDirectory()) {
            await recursiveRemove(filePath);
        } else {
            await fs.unlink(filePath);
        }
    }));
    if (!skipRoot) {
        await fs.rmdir(dirPath);
    }
}

async function processReset(data) {
    logger.info('清空服务端js文件');
    try {
        await recursiveRemove(path.resolve(__dirname, '../'), true);
    } catch (err) {
        logger.error('发布工具', '清空文件出错', err);
        throw err;
    }
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

    if (!model || !model.isFullReplacable) {
        logger.error('发布工具', '错误', '没有找到对应数据类型', data.table);
        throw new Error('没有找到对应数据类型' + data.table);
    }

    let db = data.db;
    let table = data.table;
    let version:string = data.version + '';
    // 创建
    let tableName = `seal_${db}_${table}`;
    let tmpTableName = `${tableName}_${version}`;
    tableName = mysql['escapeId'](tableName, true);
    tmpTableName = mysql['escapeId'](tmpTableName, true);
    let conn: mysql.IConnection;

    try {
        let versionTableName = `seal_version`;
        let versionModel = require('../dbs/version');

        conn = await promiseCall<mysql.IConnection>(mysqlPool.getConnection, mysqlPool);
        const query = promisify<any[]>(conn.query, conn);

        // 如果版本表没有，自动新建
        {
            try {
                await query(`SELECT count(*) from ${versionTableName}`);
            } catch (err) {
                let fieldsSql = versionModel.getFieldsSql();
                let indexesSql = versionModel.getIndexesSql();
                await query(`CREATE TABLE IF NOT EXISTS ${versionTableName} ( ${fieldsSql} ) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci`);
                await query(`ALTER TABLE ${versionTableName} ${indexesSql}`);
            }
            let [row] = await query(`SELECT * FROM ${versionTableName} WHERE loc=? and type=?`, [db, table]);
            if(row && row.version === version && !data.force){
                throw new Error('版本重复')
            }
        }

        // 确保没有脏数据
        await query(`DROP TABLE IF EXISTS ${tmpTableName}`);
        // 创建表
        let fieldsSql = model.getFieldsSql();
        await query(`CREATE TABLE ${tmpTableName} ( ${fieldsSql} ) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci`);
        // 写入数据
        {
            let fields = model.getFields();
            // 数据量比较大，最好分批？
            const batch = 100;
            let list = data.data;
            let size = Math.ceil(list.length / batch);
            let tasks = [];
            for (let i = 0; i < size; i++) {
                let values = list.slice(i * batch, (i + 1) * batch).map(row => fields.map(field => row[field]));
                await query(`INSERT INTO ${tmpTableName} (??) VALUES ?`, [fields, values]);
            }
        }
        // 添加索引、主键
        let indexesSql = model.getIndexesSql();
        await query(`ALTER TABLE ${tmpTableName} ${indexesSql}`);
        // 删除旧表
        await query(`DROP TABLE IF EXISTS ${tableName}`);
        // 改名新表
        await query(`RENAME TABLE ${tmpTableName} TO ${tableName}`);

        // 更新版本
        {
            let fields = versionModel.getFields();
            const time = Math.round(Date.now() / 1000);
            const values = [db, table, version, time];
            await query(`INSERT INTO ${versionTableName} (??) VALUES ? ON DUPLICATE KEY UPDATE version=?, time=? `,
                [fields, [values], version, time]);
        }

        // 更新公告
        {
            await addNotices([{
                time: Math.round(Date.now() / 1000),
                type: 'db',
                content: `${ServerNames[db]}${DbNames[table]}数据库已更新至${version}`
            }])
        }

        // 额外映射维护
        if(db === 'tw2' && table === 'monster'){
            await processMonsterIndexRelation();
        }

        // 完成
        logger.info('发布工具', 'db', db, table, version, '成功');
    } catch (err) {
        logger.error('发布工具', 'db', db, table, version, '失败', err);
        throw err;
    } finally {
        if (conn) {
            conn.release();
        }
    }
}

async function addNotices(notices: Notice[]){
    let conn: mysql.IConnection;
    let noticeTableName = `seal_notice`;
    let noticeModel = require('../dbs/notice');

    try{
        conn = await promiseCall<mysql.IConnection>(mysqlPool.getConnection, mysqlPool);
        const query = promisify<any[]>(conn.query, conn);

        // 保证表存在
        try {
            await query(`SELECT count(*) from ${noticeTableName}`);
        } catch (err) {
            let fieldsSql = noticeModel.getFieldsSql();
            let indexesSql = noticeModel.getIndexesSql();
            await query(`CREATE TABLE IF NOT EXISTS ${noticeTableName} ( ${fieldsSql} ) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci`);
            await query(`ALTER TABLE ${noticeTableName} ${indexesSql}`);
        }

        // 写入
        let fields = noticeModel.getFields().slice(1); // 排除id字段
        await Promise.all(notices.map(async notice=>{
            logger.info('发布工具', '公告', notice.type, notice.content);
            const time = notice.time || Math.round(Date.now() / 1000);
            const values = [time, notice.type, notice.content];
            await query(`INSERT INTO ${noticeTableName} (??) VALUES ?`,
                [fields, [values]]);
        }))
    } catch (err) {
        logger.error('发布工具', '公告', '失败', err);
        throw err;
    } finally {
        if (conn) {
            conn.release();
        }
    }
}

async function processNotice(data: Notice){
    await addNotices([data]);
}

export interface RelationUpdates{
    /** 关系类型 */
    relType: string;
    /** 是否清空旧数据，如果为true，则旧数据会先删除，否则会合并更新 */
    isFullReplace?: boolean;
    /** 关系数据 */
    list: Relation[];
}
/**
 * relation表更新发布
 */
async function processRelation(data: RelationUpdates){
    let conn: mysql.IConnection;
    let tableName = `seal_relation`;
    let model = require('../dbs/relation');

    try{
        conn = await promiseCall<mysql.IConnection>(mysqlPool.getConnection, mysqlPool);
        const query = promisify<any[]>(conn.query, conn);

        // 保证表存在
        try {
            await query(`SELECT count(*) from ${tableName}`);
        } catch (err) {
            const fieldsSql = model.getFieldsSql();
            const indexesSql = model.getIndexesSql();
            await query(`CREATE TABLE IF NOT EXISTS ${tableName} ( ${fieldsSql} ) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci`);
            await query(`ALTER TABLE ${tableName} ${indexesSql}`);
        }

        // 是否需要清空
        if(data.isFullReplace){
            await query(`DELETE FROM ${tableName} WHERE type=?`, [data.relType]);
        }

        // 写入
        {
            let fields = model.getFields();
            for(let i=0; i<data.list.length; i++){
                const relation = data.list[i];
                const values = [data.relType, relation.a, relation.b, relation.value, relation.desc];
                await query(`INSERT INTO ${tableName} (??) VALUES ? ON DUPLICATE KEY UPDATE \`value\`=?, \`desc\`=? `,
                    [fields, [values], relation.value, relation.desc]);
            }
            
        }

        // 完成
        logger.info('发布工具', 'rel', data.relType, '成功');
    } catch (err) {
        logger.error('发布工具', 'rel', data.relType, '失败');
        throw err;
    } finally {
        if (conn) {
            conn.release();
        }
    }
}
/**
 * dropid => monster 自動映射生成
 */
async function processMonsterIndexRelation(){
    let conn: mysql.IConnection;

    try{
        conn = await promiseCall<mysql.IConnection>(mysqlPool.getConnection, mysqlPool);
        const query = promisify<any[]>(conn.query, conn);

        // 获取
        const list: {a:number, b:number}[] = await query(`select dropid as a,min(id) as b from seal_tw2_monster where dropid>0 and level>0 and level<10000 group by dropid`);

        // 写入
        await processRelation({
            relType: 'drop_monster',
            isFullReplace: true,
            list
        })

        // 完成
        logger.info('发布工具', 'rel', '自动drop_monster', '成功');
    } catch (err) {
        logger.error('发布工具', 'rel', '自动drop_monster', '失败');
        throw err;
    } finally {
        if (conn) {
            conn.release();
        }
    }
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
            case 'reset':
                await processReset(data);
                break;
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
            case 'notice':{
                await processNotice(data);
                break;
            }
            case 'rel':{
                await processRelation(data);
                break;
            }
            default:
                logger.error('发布工具', '未能识别的操作');
                throw new Error('未能识别的操作');
        }
        ctx.body = "success";
    } catch (err) {
        logger.error('发布工具', '错误', err);
        ctx.body = "error " + err && err.message;
    }
};
