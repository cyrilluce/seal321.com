/**
 * Created by cyrilluce on 2016/8/7.
 */
import { sampleDir } from '../src/localConfig'
var parseVersionNo = require('./parsers/versionNo');
var path = require("path");
var fs = require('fs');

interface IServer{
    id? : string;
    serverId?: string;
    url : string;
    encoding: string;
    /** 语言文件名，如 china/taiwan (*.edt) */
    name?: string;
    watching?: boolean;
    textFile?: string;
}

export const servers: {[serverId: string]: IServer} = {
    // 昆仑
    // 配置 http://seal.download.kunlun.com/conf.kl  zip格式
    // http://seal.autopatch.kunlun.com/fullversions/200/etc/item.edp
    // 
    cn : {
        url : "http://patch-tc1.sealonline.com.cn/update/",
        encoding : "CP936",
        name : "china"
    },
    tw : {
        url : "http://patch.newseal.com.tw/patch/",
        encoding : "CP950",
        name : "taiwan",
        watching : true
    },
    tw2 : {
        url : "http://patch.sponline.com.tw/patch/",
        encoding : "CP950",
        name : "taiwan",
        watching : true
    },
    hk : {
        url : "http://patch.seal.gamecyber.net/Upload/Real/",
        encoding : "CP950"
    },
    jp : {
        url : "http://sealonline.nefficient.jp/sealonline/patch/real/",
        encoding : "CP932",
        name : "japan"
    },
    us : {
        url : "http://patch.sealonline.com/sealpatch/plus_real/",
        encoding : "CP437",
        name : "usa",
        watching : true
    }
};
Object.keys(servers).forEach(serverId=>{
    var server = servers[serverId];
    server.serverId = server.id = serverId;
    server.textFile = 'etc/'+server.name+'edt';
});

/** 各服务器所有更新包、解析数据的存放路径 */
export const samplesDir = sampleDir;
/** 更新包源文件子目录 */
export const sourceDir = 'source';
/** 获取资源文件的路径 */
export const getResourcePath = (serverId, version, type, file)=>
        path.join(samplesDir, serverId, 'source', type, file+'.'+version)
/** 获取指定类型文件的最新版本 */
export const findNewestVersion = (serverId, type, file)=>{
    var dir = path.dirname(getResourcePath(serverId, 'x', type, file));
    var files = fs.readdirSync(dir);
    var versions = files.filter(name=>name.indexOf(file)===0)
        .map(name=>name.slice(file.length+1))
        .sort((a,b)=>parseVersionNo(b)-parseVersionNo(a));

    return versions[0];
}
/** 获取指定服务器的编码 */
export const getEncodingById = function(serverId){
    var server = servers[serverId];
    return server && server.encoding;
}
export const getUrlById = function(serverId){
    var server = servers[serverId];
    return server && server.url;
}
export const getTextFile = function(serverId){
    var server = servers[serverId];
    return server && server.name + '.edt';
}

/** 获取开始了监听的服务器配置列表 */
export const getWatchingServers = (): IServer[]=>{
    return Object.keys(servers)
        .map(serverId=>servers[serverId])
        .filter(server=>server.watching)
}

/** 自动监听哪些类型的数据 */
export const watchTypes = [
    'item',
    'setopt',
    'craft',
    'monster'
];