/**
 * 数据关系，包括掉落、制作、过滤等等
 * type          |  a  |  b  | value | desc
 * ---------------------
 * drop            123    1    50             dropid为123的掉落物品1，概率是50/10000
 * index_monster    2     2                   dropid为2的代表怪物是 Lv.2 咕咕(id 2)
 * social_drop     123    1    
 */

module.exports = require('./base').extend({
    /** 不能覆盖，只能定制化操作 */
    isFullReplacable : false,
    key : ['type', 'a', 'b'], // 主键
    indexes : [ ['type', 'a'], ['type', 'b'] ],
    properties : [
        // 关系类型
        {
            name : "type",
            type : 'string',
            max : 64
        },
        // 对象a的id
        "a",
        // 对象b的id
        "b",
        // 额外数值，自行定义
        "value",
        // 额外描述，自行定义
        {
            name : "desc",
            type : "string",
            max : 1024
        }
    ]
});