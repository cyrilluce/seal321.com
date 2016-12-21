module.exports = require('./CommonData').extend({
    path : 'etc',
    file : 'item.edp',
    table : 'item',
    name : '物品信息',
    splittedFile : true,
    propertiesMap : {
        "Seal Online ItemFile v12" : [
            "id",
            {
                name : "name",
                type : "string"
            },
//			{
//				name : "res",
//				type : "dwords",
//				length : 82*4
//			},

            //0-4
            "type",
            "level",
            "level_step",
            "fame",
            "attack",

            //5-9
            "task_res1",
            "attack_step",
            "demageinc",
            "task_fame",
            "pet_res1",

            //10-14
            "magic",
            "task_res2",
            "magic_step",
            "res8",
            "weapon_res1",

            //15-19
            "defense",
            "res10",
            "defense_step",
            "demagedec",
            "equip_res1",

            //20-24
            "pet_res2",
            "attackspeed",
            "type_res1",
            "accuracy",
            "res16",

            //25-29
            "critical",
            "res18",
            "evade",
            "res20",
            "movespeed",

            //30-34
            "res22",
            "setid",
            "propid",
            "buyprice",
            "sellprice",

            //35-39
            "cure_hp",
            "res26",
            "cure_ap",
            "res28",
            "res29",

            //40-44
            "cd",
            "petpoint",
            "res32",
            "pt",
            "g_type",

            //45-49
            "needpt",
            "convertid",
            "fishingid",
            "res38",
            "g_item",

            //50-54
            "t_item",
            "s_item",
            "c_item",
            "res43",
            "res44",

            //55-59
            "attackrange",
            "needstrength",
            //"needstrength_step", //57   i>56 && i<68 && i%2==1
            {name : "needstrength_step", type : "float"},
            "needagile",
            //"needagile_step",
            {name : "needagile_step", type : "float"},

            //60-64
            "needint",
            //"needint_step",
            {name : "needint_step", type : "float"},
            "needvit",
            //"needvit_step",
            {name : "needvit_step", type : "float"},
            "needwisdom",

            //65-69
            //"needwisdom_step",
            {name : "needwisdom_step", type : "float"},
            "needluck",
            //"needluck_step", //67
            {name : "needluck_step", type : "float"},
            "posid", // if(item.res[68]==0x64)item.res[68]=0x8;
            "jobid", // 511:256, 128:128, 	>0 ? -=0x80

            //70-74
            "res56",
            "displayid",
            "glevel",
            "type_res2",
            "minutes",

            //75-79
            "setid2",
            "res62",
            "res63",
            "res64",
            "vip_type",

            //80-83
            "vip_value",
            "vip_time",
            "res82",
            "res83",

            {
                name : "description",
                type : "string"
            }
        ]
    },
});
