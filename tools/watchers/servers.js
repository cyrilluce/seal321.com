/**
 * Created by cyrilluce on 2016/8/7.
 */
var config = require('../config');
module.exports = Object.keys(config.servers)
    .map(serverId=>config.servers[serverId])
    .filter(server=>server.watching);