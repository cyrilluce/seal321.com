import { ServerId } from '../config'

/** 物品类型 */
export enum ItemType {
    /** 普通物品 */
    NORMAL = 0,
    /** 恢复药品 */
    FOOD = 1,
    /** 无数据 */
    UNKNOW2 = 2,
    /** 特殊物品（药水、经验+） */
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
    /** 商城装备 */
    CASH_EQUIPMENT = 12,
    /** 商城套装 */
    CASH_SET = 13,
    /** 盾 */
    ITEM_SHEILD = 14,
    /** 上衣 */
    ITEM_CLOTH_KNIGHT = 15,
    /** 上衣 */
    ITEM_CLOTH = 16,
    /** 帽子 */
    ITEM_HAT = 17,
    /** 也是帽子 */
    ITEM_HAT_2 = 18,
    /** 鞋子 */
    ITEM_SHOES_KNIGHT = 19,
    /** 鞋子 */
    ITEM_SHOES = 20,
    /** 饰品类 */
    ITEM_ACCESSORY = 21,
    /** 宠物 */
    ITEM_PET = 22,
    /** 宝石类 */
    GEM = 23,
    /** 任务物品 */
    TASK = 24,
    /** 骑士裤子 */
    ITEM_TROUSERS_KNIGHT = 25,
    /** 裤子 */
    ITEM_TROUSERS = 26,
    /** 合成/制作书 */
    BOOK = 27,
    /** 无数据 */
    UNKNOW28 = 28,
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
    ACCESSORY_BIND = 44,
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
    /** 饕客武器 */
    WEAPON_COOK = 51,
    /** 食神武器 */
    WEAPON_CHEF = 52,
    /** 美食家武器 */
    WEAPON_FOOD_FIGHTER = 53,
}

/** G化类型 */
export enum GType {
    /** 其它物品 */
    NORMAL = 0,
    /** 武器制作书 */
    WEAPON_BOOK = 1,
    /** 武器 */
    WEAPON = 2, 
    /** 防具制作书 */
    ARMOUR_BOOK = 3,
    /** 防具 */
    ARMOUR = 4,
    /** 饰品制作书 */
    ACCESSORY_BOOK = 5,
    /** 饰品 */
    ACCESSORY = 6,
    /** 未知7 */
    UNKNOW7 = 7,
    /** 未知8 */
    UNKNOW8 = 8,
    /** 炼金（炸弹、车）制作书 */
    ALCHEMY_BOOK = 9,
    /** 未知10 */
    UNKNOW10 = 10,
    /** 战宠、其它特殊装备制作书 */
    BATTLE_PET_EQUIPMENT_BOOK = 11,
    /** 伦石制作书 */
    RUNE_STONE_BOOK = 12,
    /** 未知13 */
    UNKNOW13 = 13,
    /** 自然石制作书 */
    NATURAL_STONE_BOOK = 14,
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
    PET=7,
    /** 耳环 */
    EARRING = 8,
    /** 项链 */
    NECKLACE = 9,
    /** 手镯 */
    BRACELET = 10,
    /** 戒指 */
    RING = 11,
    /** 战宠 */
    BATTLE_PET = 12,
    /** 无法装备 */
    NONE = 100,
}

/** 未知类型1 */
export enum TypeRes1{
    /** 未知（普通物品、装备、车等） */
    UNKNOW0 = 0,
    /** 饰品头、配件、手镯、戒指等，无法作为G辅 */
    ACCESSORY = 1,
    /** 未知（各种装备） */
    UNKNOW2 = 2,
    /** 宠物、各种特殊武器 */
    SPECIAL_UNKNOW3 = 3,
    /** 未知 几件套装上衣 */
    SPECIAL_SET = 4,
    /** 未知 西斯帽 */
    SPECIAL_PUI_HAT = 5,
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
    GUNNER=23,
    /** 饕客 */
    COOK=24,
    /** 食神 */
    CHEF=25,
    /** 美食家 */
    FOOD_FIGHTER=26
}

export enum BattlePetJob{
    /** 无 */
    NONE = 0,
    /** 光精灵 */
    LIGHT = 1,
    /** 暗精灵 */
    DARK = 2,
    /** 火精灵 */
    FIRE = 3,
    /** 水精灵 */
    WATER = 4,
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
    /** 攻击  任务-提交NPC*/
    attack: number;
    /** 未知-任务相关 0: 普通 1: 任务相关 2: */
    task_res1: number;
    /** 攻击增长系数 */
    attack_step: number;
    /** 增加伤害 */
    demageinc: number;
    /** 任务完成后增加的声望？ */
    task_fame: number;
    /** 未知-宠物相关 0: 普通 1:宠物相关 >6 宝箱相关 */
    pet_res1: number;
    /** 魔法  任务经验 */
    magic: number;
    /** 任务奖励金钱 */
    task_money: number;
    /** 魔法增长系统 */
    magic_step: number;
    /** 未知 */
    res8: number;
    /** 未知-武器相关 */
    weapon_res1: number;
    /** 防御 */
    defense: number;
    /** 未知 0:普通 1:特殊道具 2:战宠装备及G书 >2:宝箱  */
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
    /** 料理产物 或 制作书ID */
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

/** 物品实例 */
export interface ItemInstance{
    loc: ServerId;
	data: Item;
	addLevel: number;
}
