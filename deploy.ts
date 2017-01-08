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
var fs = require('fs');
var config = require('./src/config');
var deployUtil = require('./src/util/deploy');
var recursive = require('recursive-readdir');
import promisify from './src/util/promisify';

var deployer = module.exports = {
    deploy : function(data, cb){
        var req = http.request({
            hostname : process.env.NODE_ENV === 'development' ? '127.0.0.1' : config.deployServer,
            port : config.deployPort,
            path : '/',
            method : 'POST'
        }, res=>{
            var bufs = [];
            res.on('data', function(d){ bufs.push(d); });
            res.on('end', function() {
                var buf = Buffer.concat(bufs);
                var body = buf.toString();

                cb(body === 'success' ? null : '服务器返回错误：'+body);
            });
        });

        deployUtil.pack(Object.assign({
            timestamp : Date.now()
        }, data)).pipe(req);

        req.on('error', cb);
    }
};

// node deploy file server/test.js
// node deploy db tw2 item 0.654
var type = process.argv[2];

let recursiveDir = promisify(recursive);

async function resolveFile(file){
    if(/\/\*$/.test(file)){
        let path = file.split('/*')[0];
        let files = await recursiveDir(path);
        return files.map(file => {
            return file.replace(/\\/g, '/');
        })
    }
    return [file];
}

async function resolveAll(files){
    let results = await Promise.all(files.map(file=>resolveFile(file)));
    let fileList = [];
    results.forEach(file=>{
         fileList = fileList.concat(file);
    });
    return fileList;
}

var types = {
    // 文件发布
    file : function(files, callback){
        // 开始分发
        var blackLists = {
            'localConfig.js' : 1,
            'deploy.js' : 1
        };
        resolveAll(files).then(fileList=>{
            var tasks = fileList.filter(file=>!(file in blackLists)).map(file=>{
                return (callback)=>{
                    fs.readFile(path.resolve(__dirname, file), (err, data)=>{
                        callback(err, data && {
                            title : '文件 '+file,
                            data : {
                                type: 'file',
                                filePath: file,
                                content: data.toString('hex')
                            }
                        });
                    });
                };
            });
            asyncLib.parallel(tasks, callback);
        })
    },
    // 重启
    restart : function(argv, cb){
        cb(null, [{
            title : '重启',
            data : {
                type : 'restart'
            }
        }]);
    },
    db : function(argv, cb){
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
        fs.readFile(path.join('F:\\seal-samples', `${name}.json`), (err, buff)=>{
            if(err){
                return cb(err);
            }
            let data;
            try{
                data = JSON.parse(buff.toString());
            }catch(e){
                return cb(e);
            }

            cb(null, [{
                title : `数据库 ${name}`,
                data : {
                    type : 'db',
                    db,
                    table,
                    version,
                    data
                }
            }]);
        });
    }
};

if(!(type in types)){
    console.log('无法识别指令', process.argv.slice(2));
    console.log(`示例：
            node deploy file server/test.js frontend/js/main.js
            node deploy db tw2 item 0.654
            node deploy restart`);
    process.exit(0);
}

types[type](process.argv.slice(3), (err, deployMetas)=>{
    if(err){
        console.log('发布任务生成失败', err);
        return;
    }
    var done = 0;
    asyncLib.parallelLimit(deployMetas.map(deployMeta=>{
        return cb=>deployer.deploy(deployMeta.data, err=>{
            done++;
            console.log(err ? 'X ' : 'OK', deployMeta.title, ''+done+'/'+deployMetas.length, err || '');
            cb(err);
        });
    }), 3, err=>{
        if(err){
            console.log('---------失败中止----------');
            return;
        }
        console.log('-------- 发布完成 ---------');
    })
});