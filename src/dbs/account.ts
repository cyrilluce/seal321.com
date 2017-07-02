/**
 * 帐号体系
 * id | rol | name | email | google | facebook
 */

module.exports = require('./base').extend({
    /** 不能覆盖，只能定制化操作 */
    isFullReplacable : false,
    // key : [], // 主键
    indexes : [ ['weibo'], ['google'], ['facebook'] ],
    properties : [
        // 本站点的唯一ID
        {
            name: "id",
            type: 'int',
            autoIncrement: true
        },
        // 角色，可以为 master, maintaner, guest(空)？
        {
            name: "role",
            type: "string",
            max: 64
        },
        // 昵称，以第一次登录的第三方帐号为准，也可以修改
        {
            name : "name",
            type : 'string',
            max : 64
        },
        // 邮箱
        {
            name : "email",
            type : "string",
            max : 255
        },
        // 头像
        {
            name : "avator",
            type : "string",
            max : 255
        },
        {
            name : "weibo",
            type : "string",
            max : 255
        },
        {
            name : "google",
            type : "string",
            max : 255
        },
        {
            name : "facebook",
            type : "string",
            max : 255
        }
    ]
});