/**
 * 发布工具，需支持：
 * 1. 静态文件发布
 * 2. 后台数据更新（server+type+version？）
 * 3. 重启后台
 * Created by cyrilluce on 2016/8/6.
 */

var path = require('path');
var asyncLib = require('async');
var crypto = require('crypto');
var fs = require('mz/fs');
import * as deployUtil from './src/util/deploy';
import request from 'request'
var recursive = require('recursive-readdir');
import { promisify, delay, timeout } from './src/util';
import * as localConfig from './src/localConfig';
import semver from 'semver';
import { RelationUpdates } from './src/routers/deploy';

let args: any = {_:[]};

export function deploy(data, cb) {
    request(`http://${args.D ? '127.0.0.1' : localConfig.deployServer}:${localConfig.deployPort}/`, {
        method: 'POST',
        timeout: 30000,
        body: deployUtil.pack(Object.assign({
            timestamp: Date.now()
        }, data))
    }, (err, response, body) => {
        if(err){
            return cb(err)
        }
        cb(body === 'success' ? null : '服务器返回错误：' + body);
    });
}

export const deployAsync = promisify<any>(deploy, null);
export const deployAsyncRetry = async (data, times = 3) => {
    let error;
    for (; times > 0; times--) {
        try {
            await timeout(deployAsync(data), 30000);
        } catch (err) {
            error = err;
            console.log(`失败重试，还有${times - 1}次`, err.message || err);
            continue;
        }
        return;
    }
    throw new Error('3次重试失败')
}


let recursiveDir = promisify<string[]>(recursive);

async function resolveFile(file) {
    if (/\/\*$/.test(file)) {
        let path = file.split('/*')[0];
        let files = await recursiveDir(path);
        return files.map(file => {
            return file.replace(/\\/g, '/');
        })
    }
    return [file];
}

async function resolveAll(files) {
    let results = await Promise.all(files.map(file => resolveFile(file)));
    let fileList = [];
    results.forEach(file => {
        fileList = fileList.concat(file);
    });
    return fileList;
}

export const types = {
    // 初始化建表
    init: async function () {
        return [{
            title: '初始建表',
            data: {
                type: 'init'
            }
        }]
    },
    // 文件发布
    file: async function (files) {
        // 开始分发
        var blackLists = {
            'src/localConfig.ts': 1,
            'src/localConfig.example.ts': 1,
            'src/securityConfig.example.ts': 1,
            'deploy.ts': 1
        };
        let fileList = await resolveAll(files);
        // 过滤黑名单
        fileList = fileList.filter(file => !(file in blackLists));
        // 过滤定义文件 *.d.ts .xxx文件
        fileList = fileList.filter(file => !/(\.d\.ts|(^|\/)\.\w+)$/.test(file))
        return await Promise.all(fileList.map(async file => {
            /** 真实文件 */
            let realFile = file;
            let writeFile = file;
            // 如果是src目录的*.tsx?文件，则自动发布ts-build/src/下的*.js文件
            if (/^src\/.*\.(jsx?|tsx?)$/.test(file)) {
                file = file.replace(/\.(jsx?|tsx?)$/, '.js');
                realFile = 'ts-build/' + file;
                writeFile = file.replace(/^src\//, 'build/');
            }
            let data = await fs.readFile(path.resolve(__dirname, realFile));
            if (!data) {
                throw new Error(`文件不存在 ${realFile}`)
            }
            return {
                title: '文件 ' + file,
                data: {
                    type: 'file',
                    filePath: writeFile,
                    content: data.toString('hex')
                }
            };
        }));
    },
    // 重启
    restart: async function () {
        return [{
            title: '重启',
            data: {
                type: 'restart'
            }
        }];
    },
    // 清空服务端build文件，全部重新上传
    reset: async function () {
        return [{
            title: '重置服务端文件',
            data: {
                type: 'reset'
            }
        }]
    },
    /** 更新关系数据 */
    rel: async function(args){
        const type = args[0];
        // 支持的类型，为1表示全覆盖型导入（即发布的数据本身是全量的）
        const types = {
            drop: 1, // 服务端收集的掉落
            social_drop: 0, // 人工收集的掉落
            collect: 1,
            social_collect: 1,
            craft: 1,
            cook: 1,
            g_craft: 1,
            t_craft: 1,
            s_craft: 1,
            c_craft: 1,
            index_monster: 1,
        }
        if(!(type in types)){
            throw new Error(`不支持的rel类型，目前仅支持${Object.keys(types).join(', ')}`)
        }
        const data = await fs.readFile(path.join(localConfig.sampleDir, `rel_${type}.json`))
        return [{
            title : '关系更新',
            data : {
                type: 'rel',
                relType: type,
                isFullReplace: types[type] === 1,
                list: JSON.parse(data.toString())
            } as RelationUpdates
        }]
    },
    // 发布公告
    notice: async function(args){
        let [noticeType, content] = args;
        if(!content){
            content = noticeType;
            noticeType = 'manual';
        }
        if(!content){
            throw new Error('公告内容不能为空');
        }
        return [{
            title: '发布公告',
            data: {
                type: 'notice',
                noticeType,
                content
            }
        }]
    },
    // 流程化： 清空文件、发布文件、重启
    publish: async function () {
        const resetTasks = await types.reset();
        const srcFileTasks = await types.file(['package.json', 'src/*', 'views/*', 'www/static/index.js', 'www/styles/*']);
        const versions = {};
        await Promise.all([
            {file: 'www/static/index.js', key:'js'},
            {file: 'www/styles/main.css', key:'css'}
        ].map(async ({file,key})=>{
            const data = await fs.readFile(path.resolve(__dirname, file));
            const hash = crypto.createHash('sha256');
            hash.update(data);
            versions[key] = hash.digest('hex');
        }))
        srcFileTasks.push({
            title: 'js&css版本号',
            data: {
                type: 'file',
                filePath: 'versions.js',
                content: Buffer.from(`module.exports=${JSON.stringify(versions)}`).toString('hex')
            }
        });
        const restartTasks = await types.restart();
        return [...resetTasks, ...srcFileTasks, ...restartTasks];
    },
    // 更新数据库
    db: async function (argv: string[]) {
        /*
        type : "db",
        db : 'tw2',
        table : 'item',
        version : '0.654',
        data : [{...}, {...}]
         */
        // let [db, table, version] = argv;
        let db = argv[0];
        let table = argv[1];
        // 可以不传version，自动识别
        let files: string[] = await fs.readdir(localConfig.sampleDir);
        const fileNameRegex = new RegExp(`^${db}_${table}_([0-9.]+)\.json$`);
        const getVer = file => file.match(fileNameRegex)[1];
        // 筛选 tw2_item_0.001.json 文件，并按版本排序
        // semver定义版本号要有3段 0.0.1， 这里只有两段，自动加上0.
        files = files.filter(file => fileNameRegex.test(file)).sort((a, b)=>{
            return semver.gt('0.'+getVer(a), '0.'+getVer(b)) ? -1 : 1;
        });
        // 取第一个文件
        const file = files[0];
        const version = getVer(file);
        if(!file){
            throw new Error('没有找到要发布的数据文件：'+fileNameRegex.source);
        }
        // 只保留最新的两个版本文件
        const toRemoveFiles: string[] = files.slice(2);
        let toRemoveFile;
        while((toRemoveFile = toRemoveFiles.pop())){
            await fs.unlink(path.join(localConfig.sampleDir, toRemoveFile));
        }

        let buff = await fs.readFile(path.join(localConfig.sampleDir, file))

        let data = JSON.parse(buff.toString());

        return [{
            title: `数据库 ${db} ${table} ${version}`,
            data: {
                type: 'db',
                db,
                table,
                version,
                data,
                force: args.F
            }
        }];
    }
};

// 任务并发数
const maxConcurrent = 3;
async function execute(type) {
    let tasks = await types[type](args._.slice(1));
    const total = tasks.length;
    tasks.forEach((task, index) => { task.no = index + 1; })
    while (tasks.length > 0) {
        let index = 0;
        if (!tasks.some((task, idx) => {
            if (idx > 0 && task.data.type !== tasks[idx - 1].data.type || idx >= maxConcurrent) {
                index = idx;
                return true;
            }
        })) {
            index = tasks.length;
        }
        let curTasks = tasks.splice(0, index);
        await Promise.all(curTasks.map(async meta => {
            await deployAsyncRetry(meta.data, 3);
            console.log('OK', meta.title, '' + meta.no + '/' + total);
        }));
    }
}



if(require.main === module){
    args = require('minimist')(process.argv.slice(2));
    const type = args._[0];
    if (!(type in types)) {
        console.log('无法识别指令', type);
        console.log(`示例：
                ts-node deploy file src/*
                ts-node deploy db tw2 item -D -F
                ts-node deploy rel drop
                ts-node deploy notice [manual] 测试公告
                ts-node deploy restart
                ts-node deploy reset
                ts-node deploy publish`);
        process.exit(0);
    }

    execute(type).then(() => {
        console.log('-------- 发布完成 ---------');
    }, err => {
        console.log('-------- 发布失败！ ---------', err);
    });
}



