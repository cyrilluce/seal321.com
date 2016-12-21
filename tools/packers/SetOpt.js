module.exports = require('./CommonData').extend({
    path : 'etc',
    file : 'set_opt.edt',
    table : 'setopt',
    name : '套装属性',
    propertiesMap : {
        "Seal Online ItemSetOption File v2" : [
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
    },
});
