module.exports = require('./CommonData').extend({
    path : 'etc',
    file : 'craft.edt',
    table : 'craft',
    name : '制作书',
    propertiesMap : {
        "Seal Online CraftTable File v5" : [
            "id",
            {
                name : "description",
                type : "byte",
                length : 0x100
            },

            // 0-3
            "res0",
            "skilllevel", // 技能等級
            "level", // 裝備等級
            "fee", // 經驗？ 钱？

            // 4-7
            "rate", // 基础成功率
            "fieldnum", // 辅助位
            "result", // 结果
            "resultnum", // 结果数

            // 8-b
            "mix", // mix.edt中指定的随机合成产品
            "type", // G书类型？
            "needitem",
            "needitemlevel", // G化装备需要的等级

            // c-f
            "need1",
            "num1",
            "need2",
            "num2",

            // 10-13
            "need3",
            "num3",
            "need4",
            "num4",

            // 14-17
            "need5",
            "num5"
        ]
    },
});
