/**
 * Created by cyrilluce on 2016/8/7.
 */
"use strict";
var path = require('path');
var config = require("../config");
var logger = require('../logger').delegate('数据提取器');

let [serverId, table, version] = process.argv.slice(2);

var FilePacker = require('../filePackers/'+table);
var filePacker = new FilePacker(serverId, version);

filePacker.unpackFromFile((err, elements)=>{
    var server = filePacker.server;
    require('fs').writeFile(
        path.join(config.samplesDir, `${server.id}_${filePacker.table}_${filePacker.version}.json`),
        JSON.stringify(elements),
        err=>{
            if(err){
                return logger.error(filePacker.name, '出错', err);
            }
            logger.info(filePacker.name, '成功', `共${elements.length}条数据`);
        }
    )
});