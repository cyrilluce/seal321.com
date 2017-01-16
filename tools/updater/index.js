/**
 * 更新包下载器
 * Created by cyrilluce on 2016/5/29.
 */
var path = require('path');
var url = require('url');
var fs = require('fs');
var async = require('async');
var request = require('request');
var Rx = require('rx');
var mkdirp = require('mkdirp');

var mtDownloader = require('mt-downloader');

var parseVersionContent = require('../parsers/versionConfig');
var parseVersionNo = require('../parsers/versionNo');

var defaultOptions = {
    versionFile : 'version.ini',
    versionCheckInterval : 60*60*1000, // 1小时检查一次版本
    recently : 5, // 下载最近多少个版本
    types : {
        etc : 10,
        root : 1,
        interface : 1,
        item : 1
    }
};


// 定时检查version.ini的内容，并和本地结果进行对比
module.exports = function(updateUrl, toPath, o){
    var options = Object.assign({}, defaultOptions);
    Object.assign(options, o);

    var logger = require('../logger').delegate('更新器', options.name);

    mkdirp(toPath, ()=>{});

    // ------------------- 通用方法
    var files = {};
    var doDownload = (file, forceOverwrite, cb) => {
        var fileUrl = url.resolve(updateUrl, file),
            filePath = path.join(toPath, file),
            unFinishFilePath = filePath+'.mtd';

        if(files[file]){
            return files[file];
        }
        //return files[file] = new Promise((resolve, reject)=>{
            async.auto({
                ifPending : cb => {
                    if(forceOverwrite){
                        return cb();
                    }
                    fs.stat(unFinishFilePath, (err, stat)=>{
                        cb(null, err ? false : stat && stat.isFile() && stat.size>0);
                    });
                },
                ifExists : cb => {
                    if(forceOverwrite){
                        return cb();
                    }
                    fs.stat(filePath, (err, stat)=>{
                        cb(null, err ? false : stat && stat.isFile() && stat.size>0);
                    });
                },
                need : ['ifPending', 'ifExists', (cb, results)=>{
                    cb(null, forceOverwrite || results.ifPending || !results.ifExists);
                }],
                //markPending : ['need', (cb, results)=>{
                //    if(results.need){
                //        return fs.writeFile(unFinishFilePath, '', cb);
                //    }
                //    cb();
                //}],
                download : ['need', (cb, results)=>{
                    if(results.need){
                        logger.info(file, '开始下载');
                        var dl;
                        if(results.ifPending){
                            dl = mtDownloader.createDownload({path:filePath});
                            dl = dl.download();
                            //logger.info(file, 'resume');
                        }
                        if(!dl){
                            dl = mtDownloader.createDownload({
                                path : filePath,
                                url : fileUrl
                            });
                            dl = dl.start();
                        }
                        return dl.toPromise().then((data)=>{
                            cb(null, file);
                            //logger.info(file, 'done');
                        }, err=>{
                            cb(err);
                        });
                    }
                    cb();
                }]
            }, (err, results)=>{
                delete files[file];
                if(err){
                    logger.error(file, 'error',err);
                    //return reject(err);
                    return cb(err);
                }
                return cb(null, results.download);
                //resolve(results.download);
            });
        //});
    };

    // 下载器，限并发
    var rxDoDownload = Rx.Observable.fromNodeCallback(doDownload);
    var downloader = new Rx.Subject();
    //downloader.flatMapWithMaxConcurrent(3, file=>rxDoDownload(file))
    downloader.map(file=>Rx.Observable.defer(
            ()=>rxDoDownload(file, false)
                .retry(3)
                .tapOnError(e=>logger.error('下载失败，重试无效', e))
                .onErrorResumeNext(Rx.Observable.empty())
        )).merge(3)
        .subscribe(
            x=> {
                if (x) {
                    logger.info(x, '下载完成')
                }
            },
            e=>logger.error('下载队列出错', e),
            ()=>logger.info('下载队列结束')
        );

    // ------------------- 请求version.ini
    //var downloadVersionIni = ()=>doDownload(options.versionFile, true);
    var parseVersionContentAndNext = content => {
        logger.info('get version.ini ok');
        content = content.toString();

        var data = parseVersionContent(content);

        // 找出最新的N个版本，并下载
        // 从大到小排序
        // 补充另一种算法，按文件来指定最近N个版本
        data.versions.sort( (a, b) => parseVersionNo(b.version) - parseVersionNo(a.version) );
        var recentlyUpdateFiles = {};
        var typeCountMap = {};

        data.versions.forEach((o, index)=>{
            // 0.01
            var version = o.version;
            // { etc:'etc_0.02.zip' }
            var properties = o.properties;
            Object.keys(properties).forEach(type=>{
                const typeCount = typeCountMap[type] || 0;
                if(type in options.types && (index < options.recently || typeCount < options.types[type])){
                    //doDownload(properties[type]);
                    recentlyUpdateFiles[properties[type]] = true;
                    typeCountMap[type] = typeCount+1;
                    downloader.onNext(properties[type]);
                }
            })
        });

        // 同时，删除不在这些版本内的旧文件
        fs.readdir(toPath, (err, files)=>{
            if(err){
                logger.error('获取文件列表失败');
                return;
            }
            files.forEach(file=>{
                if(/\.zip$/i.test(file) && !(file in recentlyUpdateFiles)){
                    logger.info('移除过期文件', file);
                    fs.unlink(path.join(toPath, file), err=>{
                        if(err){
                            return logger.error('过期文件删除', file, err);
                        }
                        logger.info('过期文件已删除', file);
                    })
                }
            });

        });
    };
    var downloadVersionIni = ()=>{
        var retry = 3;
        var task = ()=>request.get({
            url : url.resolve(updateUrl, options.versionFile),
            //proxy : 'http://127.0.0.1:8888',
            timeout : 60*1000
        }, (err, response, content)=>{
            if(err){
                logger.error('request version.ini fail', err);
                retry--;
                if(retry>=0){
                    logger.warn('retry');
                    process.nextTick(task);
                }
                return;
            }
            parseVersionContentAndNext(content);
        });
        task();
    };

    downloadVersionIni();
    setInterval(downloadVersionIni, options.versionCheckInterval);
    //
    //// ------------------- 监听version.ini变动
    //fs.watch(toPath, (event, filename) => {
    //    if(filename === options.versionFile){
    //        fs.readFile(path.join(toPath, filename), (err, buff)=>{
    //            if(err){
    //                return logger.error(err);
    //            }
    //            var content = buff.toString();
    //
    //            var data = parseVersionContent(content);
    //
    //            // 找出最新的N个版本，并下载
    //            // 从大到小排序
    //            data.versions.sort( (a, b) => parseVersionNo(b.version) - parseVersionNo(a.version) );
    //            var needDownloadVersions = data.versions.slice(0, options.recently);
    //
    //            needDownloadVersions.forEach(o=>{
    //                // 0.01
    //                var version = o.version;
    //                // { etc:'etc_0.02.zip' }
    //                var properties = o.properties;
    //                Object.keys(properties).forEach(type=>{
    //                    if(type in options.types){
    //                        doDownload(properties[type]);
    //                    }
    //                })
    //            })
    //        });
    //    }
    //});
};