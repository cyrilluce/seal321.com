/**
 * Created by cyrilluce on 2016/8/7.
 */
var parseVersionNo = require('./parsers/versionNo');
var path = require("path");
var fs = require('fs');

var servers = {
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

var config = module.exports = {
    samplesDir : 'F:\\seal-samples',
    servers : servers,
    getResourcePath : (serverId, version, type, file)=>
        path.join(config.samplesDir, serverId, 'source', type, file+'.'+version),
    findNewestVersion : (serverId, type, file)=>{
        var dir = path.dirname(config.getResourcePath(serverId, 'x', type, file));
        var files = fs.readdirSync(dir);
        var versions = files.filter(name=>name.indexOf(file)===0)
            .map(name=>name.slice(file.length+1))
            .sort((a,b)=>parseVersionNo(b)-parseVersionNo(a));

        return versions[0];
    },
    getEncodingById : function(serverId){
        var server = servers[serverId];
        return server && server.encoding;
    },
    getUrlById : function(serverId){
        var server = servers[serverId];
        return server && server.url;
    },
    getTextFile : function(serverId){
        var server = servers[serverId];
        return server && server.name + '.edt';
    }
};