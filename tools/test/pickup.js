/**
 * Created by cyrilluce on 2016/8/7.
 */
"use strict";
var path = require('path');
var config = require("../config");
var logger = require('../logger').delegate('数据提取器');

const pickup = module.exports = (serverId, table, version)=>{
    var FilePacker = require('../filePackers/'+table);
    var filePacker = new FilePacker(serverId, version);

    filePacker.unpackFromFile((err, elements)=>{
        if(err){
            logger.error(err);
            return;
        }
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
}

// 如果是直接调用，则提取
if(require.main === module){
    pickup.apply(null, process.argv.slice(2))
}