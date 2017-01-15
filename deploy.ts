/**
 * 发布工具，需支持：
 * 1. 静态文件发布
 * 2. 后台数据更新（server+type+version？）
 * 3. 重启后台
 * Created by cyrilluce on 2016/8/6.
 */

var http = require('http');
var path = require('path');
var asyncLib = require('async');
var fs = require('mz/fs');
var deployUtil = require('./src/util/deploy');
var recursive = require('recursive-readdir');
import {promisify} from './src/util';
import * as localConfig from './src/localConfig';

const args = require('minimist')(process.argv.slice(2));

var deployer = module.exports = {
    deploy: function (data, cb) {
        var req = http.request({
            hostname: args.D ? '127.0.0.1' : localConfig.deployServer,
            port: localConfig.deployPort,
            path: '/',
            method: 'POST'
        }, res => {
            var bufs = [];
            res.on('data', function (d) { bufs.push(d); });
            res.on('end', function () {
                var buf = Buffer.concat(bufs);
                var body = buf.toString();

                cb(body === 'success' ? null : '服务器返回错误：' + body);
            });
        });

        deployUtil.pack(Object.assign({
            timestamp: Date.now()
        }, data)).pipe(req);

        req.on('error', cb);
    }
};


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

var types = {
    // 文件发布
    file: async function (files, callback) {
        // 开始分发
        var blackLists = {
            'src/localConfig.ts': 1,
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
            // 如果是src目录的*.tsx?文件，则自动发布ts-build/src/下的*.js文件
            if(/^src\/.*\.(jsx?|tsx?)$/.test(file)){
                file = file.replace(/\.(jsx?|tsx?)$/, '.js');
                realFile = 'ts-build/'+file;
            }
            let data = await fs.readFile(path.resolve(__dirname, realFile));
            if(!data){
                throw new Error(`文件不存在 ${file}`)
            }
            return {
                title: '文件 ' + file,
                data: {
                    type: 'file',
                    filePath: file,
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
    db: async function (argv) {
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
        let version = argv[2];
        // TODO 可以不传version，自动识别
        // TODO 发布成功后，删除文件
        let name = `${db}_${table}_${version}`;
        let buff = await fs.readFile(path.join('F:\\seal-samples', `${name}.json`))

        let data = JSON.parse(buff.toString());


        return [{
            title: `数据库 ${name}`,
            data: {
                type: 'db',
                db,
                table,
                version,
                data
            }
        }];
    }
};

const type = args._[0];

if (!(type in types)) {
    console.log('无法识别指令', type);
    console.log(`示例：
            ts-node deploy file src/*
            ts-node deploy db tw2 item 0.654
            ts-node deploy restart`);
    process.exit(0);
}

types[type](args._.slice(1)).then(deployMetas => {
    var done = 0;
    asyncLib.parallelLimit(deployMetas.map(deployMeta => {
        return cb => deployer.deploy(deployMeta.data, err => {
            done++;
            console.log(err ? 'X ' : 'OK', deployMeta.title, '' + done + '/' + deployMetas.length, err || '');
            cb(err);
        });
    }), 3, err => {
        if (err) {
            console.log('---------失败中止----------');
            return;
        }
        console.log('-------- 发布完成 ---------');
    })
}, err => {
    console.log('发布任务生成失败', err);
});