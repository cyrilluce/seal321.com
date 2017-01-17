/**
 * 版本信息
 * server|type|version
 * ---------------------
 * tw2    item 0.777
 */

module.exports = require('./base').extend({
    // key : ['id'], // 主键
    indexes : [ ['time'], ['type'] ],
    properties : [
        // 自增id
        {
            name: "id",
            type : 'int',
            autoIncrement: true // 默认就是主键
        },
        // 公告时间
        "time",
        // 公告类型
        {
            name : "type",
            type : "string",
            max : 64
        },
        // 公告内容
        {
            name : "content",
            type : "string",
            max : 1024
        }
    ]
});