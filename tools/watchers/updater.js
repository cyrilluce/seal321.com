/**
 * Created by cyrilluce on 2016/8/7.
 */
var download = require('../updater');
var path = require('path');
var config = require('../config');

config.getWatchingServers().forEach(server=>{
    download(server.url,  path.join(config.samplesDir, `${server.id}/update/`), {
        name : server.id,
        recently : 100,
        types : {
            etc : 2,
            root : 2,
            interface : 2,
            item : 2
        }
    });
});