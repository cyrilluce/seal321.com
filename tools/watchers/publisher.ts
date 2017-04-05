/**
 * 自动发布
 * 对比现网版本，如果本地更新，则自动更新之（deploy db server type）
 */
import * as Rx from 'rx';
import { watch as fsWatch } from 'fs';
import { readdir, stat, writeFile } from 'mz/fs'
import { join } from 'path'
import * as semver from 'semver';
import * as isomorphicFetch from 'isomorphic-fetch';
import * as config from '../config';
import { deployServer } from '../../config';
import { Result } from '../../src/routers/query/version'
import * as deployer from '../../deploy'

/** 自动提取哪些类型 */
const types = config.watchTypes;

const logger = require('../logger').delegate('自动发布');

interface INewest{
    /** 版本，如0.677 */
    version: string;
    /** 文件名，如 tw2_craft_0.637.json */
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
    // 目录
    const src = config.samplesDir;
    const regex = new RegExp(`^${serverId}_${type}_([0-9.]+)\\.json$`)

    // 当源文件有变化时，判断最新的版本
    const findNewest = async (): Promise<INewest> =>{
        const files = await readdir(src);
        const version = files.filter(file=>regex.test(file)).map(file=>file.match(regex)[1]).sort((a, b)=>{
            return -semver.compare('0.'+a, '0.'+b)
        })[0];
        if(!version){
            return;
        }
        return {
            version,
            file: `${serverId}_${type}_${version}.json`
        }
    }

    let last: INewest;

    while(true){
        try{
            const newest = await findNewest();
            if(!newest || last && newest.version === last.version){
                await watchUntilChange(src, regex)
                continue;
            }
            last = newest;
            // 延时，有可能文件还在写入
            await delay(10000);
            // 判断最新版发布过没
            const response = await isomorphicFetch(`https://${deployServer}/node/query/version`, {
                method: 'POST',
                headers : {
                    "Content-Type": "application/json"
                },
                body : JSON.stringify({
                    loc : serverId
                })
            })
            const result = await response.json();
            const versions: Result = result.data;
            const serverVersion = versions[type].version;

            // 如果版本比服务器上的低，无视
            if(semver.lte('0.'+newest.version, '0.'+serverVersion)){
                // console.log(serverId, type, newest.version, serverVersion)
                continue;
            }

            logger.info(serverId, type, `新版本 ${newest.version}`);
            
            // 发布
            const metas = await deployer.types.db([serverId, type]);
            await Promise.all(metas.map(meta=>deployer.deployAsync(meta.data)));
            logger.info(serverId, type, `${newest.version} 发布完成`);
        }catch(e){
            logger.error(e);
            last = null;
        }
    }
}

config.getWatchingServers().forEach(server=>{
    types.forEach(type=>{
        watchType(server.id, type).catch(err=>{
            console.error(err);
        })
    })
})

logger.info(`开始监听 ${types.join(' ')}`);