/**
 * 物品信息
 * Created by cyrilluce on 2016/8/7.
 */

module.exports = require('./base').extend({
    key : ['id'], // 主键
    indexes : [],
    properties : [
        "id",
        {
            name : "name",
            type : "fixedstring",
            length : 0x40
        },
        "level",
        "hp",
        "res3",
        "distance",
        "property",
        "sight",
        "evade",
        "accuracy",
        "attack",
        "defense",
        "exp",
        "dropid",
        "res13",
        "res14",
        "res15",
        "displayid",
        "questid",
        "sellid",
        "res19",
        "res20",
        "res21",
        "res22",
        "res23",
        "res24",
        "res25",
        "res26"
    ]
});