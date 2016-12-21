module.exports = require('./CommonData').extend({
    path : 'etc',
    file : 'monster.edt',
    table : 'monster',
    name : '怪物&NPC',
    indexAsId : true,
    headerProperties : [
        {
            name : "name",
            type : "fixedstring",
            length : 0x40
        },
        "count",
        "res0"
    ],
    propertiesMap : {
        "Seal Online MonsterDataFile v8" : [
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
            "res6",
            "evade",
            "accuracy",
            "attack",
            "defense",
            "exp",
            "res12",
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
            "res24"
        ],
        "Seal Online MonsterDataFile v9" : [
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
            "res6",
            "evade",
            "accuracy",

            "attack",
            "defense",
            "exp",
            "res12",

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
        ]
    },
});
