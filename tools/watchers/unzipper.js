/**
 * Created by cyrilluce on 2016/8/7.
 */

var path = require('path');
var unpack = require('../unzipper');

var config = require('../config');
var watchingServers = require('./servers');

watchingServers.forEach(server=>{
    unpack({
        name : server.id,
        src : path.join(config.samplesDir, server.id, 'update/'),
        dest : path.join(config.samplesDir, server.id, 'source/'),
        watches : {
            etc : {
                "item.edp":1,
                "monster.edt":1,
                "set_opt.edt":1,
                "craft.edt":1,
                "mix.edt":1,
                "usa.edt":1,
                "taiwan.edt":1,
                "china.edt":1
            },
            root : {
                "sealres.dll":1
            },
            item : /^itemicon\d+[ab]?\.tex$/
        },
        recently : 2
    });
});