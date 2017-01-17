/**
 * 版本信息
 * server|type|version
 * ---------------------
 * tw2    item 0.777
 */

module.exports = require('./base').extend({
    key : ['loc', 'type'], // 主键
    properties : [
        // 所属服务器，如tw2/tw/us
        {
            name : "loc",
            type : "string",
            max : 64
        },
        // 类型，如 item/monster/setopt/craft等
        {
            name : "type",
            type : "string",
            max : 64
        },
        // 版本，如0.746
        {
            name : "version",
            type : "string",
            max : 64
        },
        // 更新时间，秒
        "time"
    ]
});