/** 物品类型 */
export enum ItemType {
    /** 普通物品 */
    NORMAL = 0,
    /** 恢复药品 */
    FOOD = 1,
    /** 特殊物品 */
    SPECIAL = 3,
    /** 单手剑 */
    WEAPON_KNIGHT = 4,
    /** 时光 */
    TIME = 5,
    /** 双手剑 */
    WEAPON_WARRIOR = 6,
    /** 匕首 */
    WEAPON_JESTER = 7,
    /** 双手槌 */
    WEAPON_CRAFTSMAN = 8,
    /** 锤 */
    WEAPON_PRIEST = 9,
    /** 法杖 */
    WEAPON_MAGE = 11,
    /** 道具套装 */
    ITEM_VIP = 13,
    /** 盾 */
    ITEM_SHEILD = 14,
    /** 上衣 */
    ITEM_CLOTH_KNIGHT = 15,
    /** 上衣 */
    ITEM_CLOTH = 16,
    /** 帽子 */
    ITEM_HAT = 17,
    /** 鞋子 */
    ITEM_SHOES_KNIGHT = 19,
    /** 鞋子 */
    ITEM_SHOES = 20,
    /** 饰品类 */
    ITEM_SPECIL = 21,
    /** 宠物 */
    ITEM_PET = 22,
    /** 宝石类 */
    PRE_PRECIOUS = 23,
    /** 任务物品 */
    TASK = 24,
    /** 骑士裤子 */
    ITEM_TROUSERS_KNIGHT = 25,
    /** 裤子 */
    ITEM_TROUSERS = 26,
    /** 合成/制作书 */
    BOOK = 27,
    /** *魔剑士武器 */
    WEAPON_BERSERKER = 29,
    /** *狂剑士武器 */
    WEAPON_SWORDMASTER = 30,
    /** 暗骑士武器 */
    WEAPON_RENEGADE = 31,
    /** 圣骑士武器 */
    WEAPON_DEFENDER = 32,
    /** 刺客武器 */
    WEAPON_ASSASSIN = 33,
    /** 艺者武器 */
    WEAPON_GAMBLER = 34,
    /** 冰魔导武器 */
    WEAPON_ICEWIZARD = 35,
    /** 炎魔导武器 */
    WEAPON_FIREWIZARD = 36,
    /** 审判者武器 */
    WEAPON_TEMPLAR = 37,
    /** 圣贤者武器 */
    WEAPON_APOSTLE = 38,
    /** 爆破士武器 */
    WEAPON_DEMOLITIONIST = 39,
    /** 匠师武器 */
    WEAPON_ARTISAN = 40,
    /** 宝箱 */
    CHEST = 41,
    /** 钥匙 */
    CHEST_KEY = 42,
    /** 魔法锁 */
    CHEST_VIP = 43,
    /** 绑定饰品 */
    SPECIAL_BIND = 44,
    /** 一次性投掷物 */
    THROWABLE = 45,
    /** 猎人武器 */
    WEAPON_HUNTER = 46,
    /** 弓箭手武器 */
    WEAPON_ARCHER = 47,
    /** 枪手武器 */
    WEAPON_GAUNNER = 48,
    /** 战宠 */
    BATTLE_PET = 49,
    /** 战宠装备 */
    BATTLE_PET_EQUIPMENT = 50,
}

/** G化类型 */
export enum GType {

}

/** 装备位置 */
export enum EquipPosition {
    /** 头 */
    HEAD=0,
    /** 上衣 */
    TOP=1,
    /** 裤子 */
    BOTTOM=2,
    /** 鞋子 */
    SHOE=3,
    /** 主武器 */
    MAIN_HAND=4,
    /** 副手 */
    SUB_HAND=5,
    /** 饰品 */
    APPEND=6,
    /** 宠物 */
    PET=7
}

/** 职业 */
export enum Job {
    /** 初学者 */
    BEGINNER=0,
    /** 剑士 */
    WARRIOR=1,
    /** 骑士 */
    KNIGHT=2,
    /** 小丑 */
    JESTER=3,
    /** 法师 */
    MAGE=4,
    /** 祭司 */
    PRIEST=5,
    /** 铁匠 */
    CRAFTSMAN=6,
    /** GM */
    GAME_MASTER=7,
    /** 所有职业 */
    ALL=8,
    /** 狂剑士 */
    BERSERKER=9,
    /** 魔剑士 */
    SWORD_MASTER=10,
    /** 暗骑士 */
    RENEGADE=11,
    /** 圣骑士 */
    DEFENDER=12,
    /** 刺客 */
    ASSASSIN=13,
    /** 艺者 */
    GAMBLER=14,
    /** 冰魔导 */
    ICE_WIZARD=15,
    /** 炎魔导 */
    FIRE_WIZARD=16,
    /** 审判者 */
    TEMPLAR=17,
    /** 圣贤者 */
    APOSTLE=18,
    /** 爆破士 */
    DEMOLITIONIST=19,
    /** 匠师 */
    ARTISAN=20,
    /** 獵人 */
    HUNTER=21,
    /** 弓箭手 */
    ARCHER=22,
    /** 槍手 */
    GUNNER=23
}

/** 属性 */
export enum Property {
    /** 无 */
    NONE = 0,
    /** 火 */
    FIRE = 1,
    /** 水 */
    WATER = 2,
    /** 木 */
    WOOD = 3,
    /** 金 */
    METAL = 4,
    /** 土 */
    MUD = 5,
    /** 光 */
    LIGHT = 6,
    /** 暗 */
    DARK = 7,
    /** 魔法 */
    MAGIC = 8,
    /** 物理 */
    PHYSIC = 9
}

/** 物品定义 */
export interface Item {
    /** 物品ID */
    id: number;
    /** 物品名称 */
    name: string;
    /** 物品描述 */
    description: string;
    /** 物品类型 */
    type: ItemType;
    /** 需求等级 */
    level: number;
    /** 等级增长系数 */
    level_step: number;
    /** 需求声望 */
    fame: number;
    /** 攻击 */
    attack: number;
    /** 未知-任务相关 */
    task_res1: number;
    /** 攻击增长系数 */
    attack_step: number;
    /** 增加伤害 */
    demageinc: number;
    /** 任务完成后增加的声望？ */
    task_fame: number;
    /** 未知-宠物相关 */
    pet_res1: number;
    /** 魔法 */
    magic: number;
    /** 未知-任务相关2 */
    task_res2: number;
    /** 魔法增长系统 */
    magic_step: number;
    /** 未知 */
    res8: number;
    /** 未知-武器相关 */
    weapon_res1: number;
    /** 防御 */
    defense: number;
    /** 未知 */
    res10: number;
    /** 防御增长系统 */
    defense_step: number;
    /** 减少所受的伤害 */
    demagedec: number;
    /** 未知-装备相关 */
    equip_res1: number;
    /** 未知-宠物相关 */
    pet_res2: number;
    /** 攻击速度 */
    attackspeed: number;
    /** 未知-类型相关 */
    type_res1: number;
    /** 命中 */
    accuracy: number;
    /** 未知 */
    res16: number;
    /** 必杀 */
    critical: number;
    res18: number;
    /** 闪避 */
    evade: number;
    /** 移动速度 */
    movespeed: number;
    /** 套装ID */
    setid: number;
    /** ???  */
    propid: number;
    /** 购买体系 */
    buyprice: number;
    /** 出售价格 */
    sellprice: number;
    /** 恢复HP */
    cure_hp: number;
    /** 恢复AP */
    cure_ap: number;
    /** 冷却 */
    cd: number;
    /** 喂养值 */
    petpoint: number;
    /** 辅助值 */
    pt: number;
    /** G化类型 */
    g_type: GType;
    /** G化需要辅助值 */
    needpt: number;
    /** 料理产物 */
    convertid: number;
    /** 钓鱼结果 */
    fishingid: number;
    /** G化产物 */
    g_item: number;
    /** T化产物 */
    t_item: number;
    /** S化产物 */
    s_item: number;
    /** C化产物 */
    c_item: number;
    /** 攻击范围 */
    attackrange: number;
    /** 需要力量 */
    needstrength: number;
    /** 需要力量增长系数 */
    needstrength_step: number;
    /** 需要敏捷 */
    needagile: number;
    /** 需要敏捷增长系数 */
    needagile_step: number;
    /** 需要精力 */
    needint: number;
    needint_step: number;
    /** 需要体质 */
    needvit: number;
    needvit_step: number;
    /** 智力 */
    needwisdom: number;
    needwisdom_step: number;
    /** 幸运 */
    needluck: number;
    needluck_step: number;
    /** 装备位置 */
    posid: EquipPosition;
    /** 需求职业 按位 */
    jobid: number;
    /** 物品图标id */
    displayid: number;
    /** g化分类？ */
    glevel: number;
    /** ？？？持续时间？ */
    minutes: number;
    /** 未知-套装相关 */
    setid2: number;
    /** vip物品类别 */
    vip_type: number;
    /** ？？价值？ */
    vip_value: number;
    /** 持续时间？ */
    vip_time: number;
}