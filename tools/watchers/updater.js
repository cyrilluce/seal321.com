/**
 * Created by cyrilluce on 2016/8/7.
 */
var download = require('../updater');
var path = require('path');
var config = require('../config');

var watchingServers = Object.keys(config.servers)
    .map(serverId=>config.servers[serverId])
    .filter(server=>server.watching);

watchingServers.forEach(server=>{
    download(server.url,  path.join(config.samplesDir, `${server.id}/update/`), {
        name : server.id,
        recently : 5
    });
});