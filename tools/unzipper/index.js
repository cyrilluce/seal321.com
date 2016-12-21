/**
 * 输入参数：
 * 更新包目录 src
 *      例如： F:\webwork\node-seal-updater\samples\us\update
 * 输出目录 dest
 *      例如： F:\webwork\node-seal-updater\samples\us\source
 * 监听的文件 watches
 *      例如： {
 *                  etc : {
 *                      item.edp : 1,
 *                      monster.edt : 1,
 *                      craft.edt : 1,
 *                      set_opt.edt : 1
 *                  },
 *                  root : {
 *                      sealres.dll
 *                  }
 *             }
 * 保留最近多少个版本 recently
 *      例如： 2
 * Created by cyrilluce on 2016/6/5.
 */
var Rx = require('rx'),
    path = require('path'),
    mkdirp = require('mkdirp'),
    asyncLib = require('async'),
    fs = require('fs'),
    yauzl = require('yauzl'),
    parseVersionNo = require('../parsers/versionNo');
const fileRegex = /^[a-z]+_[0-9.]+\.zip$/i;

function addVersionToFile(fileName, version){
    const o = path.parse(fileName);
    return path.join(o.root, o.dir, o.name + o.ext + "." + version);
}

module.exports = options => {
    options = options || {};

    var logger = require('../logger').delegate('解压器', options.name);

    var deleter = new Rx.Subject();
    deleter
        .flatMap(
            filePath=>Rx.Observable.fromNodeCallback(fs.unlink, fs)(filePath),
            filePath=>filePath
        ).tapOnError(e=>logger.error(e, '删除失败'))
        .subscribe(
            o=> logger.info(o, '删除完成'),
            e=>logger.error('删除队列出错', e),
            ()=>logger.info('删除队列结束')
        );

    // 从旧版开始处理，直到新版？或者应该反过来，从新版开始处理。（diff旧版的功能先不考虑，先只更新最新的）
    // 也可以全部解压，反正不会冲突（文件名带版本号），然后再专门弄watcher维持，只保存最近N个版本的文件
    var unpacker = new Rx.Subject();

    unpacker
        // 先过滤非zip文件
        .filter(file=>fileRegex.test(file))
        // 再过滤非监听文件
        .map(file=>{
            // file示例： etc_0.01.zip
            // 先解析为 type:etc, version:0.01
            const parts = path.basename(file, '.zip').split('_');
            const type = parts[0],
                version = parts[1];
            return {
                type : type,
                version : version,
                file : file,
                zipPath : path.join(options.src, file),
                dest : path.join(options.dest, type)
            };
        })
        .filter(o=>o.type in options.watches)
        // 过滤不存在的文件
        .flatMap(
            o=>Rx.Observable.fromNodeCallback(fs.stat, fs)(o.zipPath).onErrorResumeNext(Rx.Observable.return(false)),
            (o, stat)=>Object.assign({stat}, o)
        )
        .filter(o=>o.stat && o.stat.isFile() && o.stat.size>0)
        // 解压zip
        .map(o=>{
            // 读取zip信息
            return Rx.Observable.defer(()=>Rx.Observable.create(observer => {
                    // logger.info('开始读取压缩文件', o.zipPath);
                    yauzl.open(o.zipPath, {lazyEntries:true}, (err, zipFile)=>{
                        if(err){
                            observer.onError({
                                err,
                                o
                            });
                            return;
                        }
                        zipFile.readEntry();
                        zipFile
                            .on("entry", function(entry) {
                                observer.onNext(Object.assign({
                                    zipFile,
                                    entry
                                }, o));
                            })
                            .on('end', ()=>observer.onCompleted())
                            .on('error', err=>observer.onError({
                                err,
                                o
                            }));
                    });
                })
                // 过滤非监听entry
                .filter(o => {
                    const match = options.watches[o.type];
                    const name = o.entry.fileName.toLowerCase();
                    if(match.test && match.test(name) || name in match) {
                        return true;
                    }
                    o.zipFile.readEntry();
                    return false;
                })
                // 过滤非最新entry
                // 获取已有文件列表
                .flatMap(
                    o=>Rx.Observable.fromNodeCallback(fs.readdir, fs)(o.dest),
                    (o, existsFiles)=>Object.assign({existsFiles}, o)
                )
                // 如果不是最新的recently个，则无视之。另外，如果文件多于recently，需要放入移除列表
                .filter(
                    o=>{
                        // 如果已经解压过了，跳过
                        if(o.existsFiles.indexOf(addVersionToFile(o.entry.fileName, o.version))>=0){
                            o.zipFile.readEntry();
                            return false;
                        }
                        var versionNo = parseVersionNo(o.version);
                        var my = {version:o.version, versionNo};
                        var existsFiles = o.existsFiles.filter(file=>file.indexOf(o.entry.fileName)===0)
                            .map(file=>{
                                var version = file.slice(o.entry.fileName.length+1),
                                    versionNo = parseVersionNo(version);
                                return {version,versionNo,file};
                            }).concat(my);
                        // 按从新到旧排序
                        existsFiles.sort((a,b)=>{
                            return b.versionNo - a.versionNo;
                        });
                        // 如果在前recently，则解压，并删除其它的文件。
                        // 否则，则无视，不做任何处理
                        var myRank = existsFiles.indexOf(my);
                        if(myRank<options.recently){
                            existsFiles.slice(options.recently).forEach(e=>deleter.onNext(path.join(o.dest, e.file)));
                            return true;
                        }
                        o.zipFile.readEntry();
                        return false;
                    }
                )
                // 读取entry
                .flatMap(
                    o=>Rx.Observable.fromNodeCallback(o.zipFile.openReadStream, o.zipFile)(o.entry),
                    (o, readStream)=>Object.assign({readStream}, o)
                )
                // 写入文件
                .flatMap(o=>Rx.Observable.create(observer => {
                    var toFile = path.join(o.dest, addVersionToFile(o.entry.fileName, o.version));
                    o.readStream.pipe(fs.createWriteStream(toFile));
                    o.readStream.on('end', ()=> {
                        observer.onNext(Object.assign({
                            toFile
                        }, o));
                        observer.onCompleted();
                        o.zipFile.readEntry();
                    });
                })));
        }).merge(1).subscribe(
            o=> {
                if (o) {
                    logger.info(o.version, o.entry.fileName, '解压完成')
                }
            },
            e=>logger.error('解压队列出错', e, e.stack),
            ()=>logger.info('解压队列结束')
        );

    // 目录确保存在
    let tasks = {};
    Object.keys(options.watches).forEach(type=>{
        tasks[type] = callback=>{
            mkdirp(path.join(options.dest, type), callback);
        };
    });

    asyncLib.auto(tasks, ()=>{
        // 初始解压
        fs.readdir(options.src, (err, files)=>{
            if(!err){
                files.sort((a,b)=>a>b?-1:1).forEach(file=>{
                    unpacker.onNext(file);
                })
            }
        });
        // 后续监听
        fs.watch(options.src, (event, filename) => {
            setTimeout(()=>{
                unpacker.onNext(filename);
            }, 1000);
        });
    });

    return unpacker;
};