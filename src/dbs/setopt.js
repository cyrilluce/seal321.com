/**
 * 物品信息
 * Created by cyrilluce on 2016/8/7.
 */

module.exports = require('./base').extend({
    key : ['id', 'count'], // 主键
    indexes : [['id']],
    properties : [
        "id",
        "count",

        // 0-3
        "attack",
        "magic",
        "defense",
        "attackspeed",

        // 4-7
        "accuracy",
        "critical",
        "evade",
        "movespeed",

        // 8-b
        "hp",
        "ap",
        "res10",
        "res11"
    ]
});