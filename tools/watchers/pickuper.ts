/**
 * TODO 自动监听source文件，并进行提取
 * 还有下一步，自动更新到服务器（deployer）
 * Created by cyrilluce on 2016/8/8.
 */
import * as Rx from 'rx';
import { readdir, watch as fsWatch } from 'fs';
import { stat, writeFile } from 'mz/fs'
import { join } from 'path'
import * as semver from 'semver';
import * as config from '../config';

/** 自动提取哪些类型 */
const types = config.watchTypes;

const logger = require('../logger').delegate('自动提取');

interface INewest{
    /** 版本，如0.677 */
    version: string;
    /** 文件名，如 item.edp.0.677 */
    file: string;
}

function delay(ms: number = 0){
    return new Promise(resolve=>{
        setTimeout(resolve, ms);
    })
}

/** 目标目录更改时完成 */
function watchUntilChange(dir: string, match: RegExp){
    return new Promise(resolve=>{
        // 30分钟强制检查一次？
        const timer = setTimeout(resolve, 30*60*1000);
        const watcher = fsWatch(dir, (event, file)=>{
            if(match.test(file)){
                watcher.close();
                clearTimeout(timer);
                resolve();
            }
        });
    })
}

/** 监听指定类型 */
async function watchType(serverId: string, type: string){
    const Packer = require(`../filePackers/${type}`);
    const { path, file, table, name } = Packer.getPacker().prototype;

    // 目录及文件名
    const src = join(config.samplesDir, serverId, 'source', path);
    const regex = new RegExp(`^${file.replace('.', '\\.')}`);

    // 当源文件有变化时，判断最新的版本
    const findNewest = (): INewest=>{
        const version = config.findNewestVersion(serverId, path, file)
        if(!version){
            return;
        }
        return {
            version,
            file: `${file}.${version}`
        }
    }

    let last: INewest;

    while(true){
        try{
            const newest = findNewest();
            if(!newest || last && newest.version === last.version){
                await watchUntilChange(src, regex)
                continue;
            }
            last = newest;
            // 延时，有可能文件还在写入
            await delay(10000);
            // 判断最新版提取过没
            const pickedFile = join(config.samplesDir, `${serverId}_${table}_${newest.version}.json`)
            let pickedStat;
            try{
                pickedStat = await stat(pickedFile);
            }catch(e){}
            
            if(pickedStat && pickedStat.isFile() && pickedStat.size>0){
                continue;
            }
            logger.info(serverId, name, `新版本 ${newest.version}`);
            // 如果最新版本没有提取出来的文件，则提取之
            const elements = await new Promise<any[]>((resolve, reject)=>{
                const picker = new Packer(serverId, newest.version);
                picker.unpackFromFile((err, elements)=>{
                    if(err){
                        reject(err)
                        return;
                    }
                    resolve(elements);
                });
            })
            await writeFile(pickedFile, JSON.stringify(elements))
            logger.info(serverId, name, newest.version, '成功', `共${elements.length}条数据`);
        }catch(e){
            logger.error(e);
            last = null;
        }
    }
}

config.getWatchingServers().forEach(server=>{
    types.forEach(type=>{
        watchType(server.id, type)
    })
})

logger.info(`开始监听 ${types.join(' ')}`);