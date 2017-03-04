import { Item as IItem, ItemInstance, ItemType, GType, Job, BattlePetJob, EquipPosition, TypeRes1 } from '../types';
import { observable, computed, action, reaction, autorun } from 'mobx';
import { ServerId, mainDb } from '../config';
import * as query from '../stores/query';
import { delay } from '../util';
import { SetOptionModel } from './SetOption';
import { IDLoadable, Param } from './IDLoadable';

/** 
 * 分类 
 * 武器类
 * 盾牌类
 * 配件类
 * 配件类（头部）
 * 帽子类
 * 上衣类
 * 下衣类
 * 鞋子类
 * 
 */

/** 不可以装备的 */
const UnEquipable = [
    /** 普通物品 */
    ItemType.NORMAL,
    /** 恢复药品 */
    ItemType.FOOD,
    /** 无数据 */
    ItemType.UNKNOW2,
    /** 特殊物品（药水、经验+） */
    ItemType.SPECIAL,
    /** 单手剑 */
    // ItemType.WEAPON_KNIGHT,
    /** 时光 */
    ItemType.TIME,
    /** 双手剑 */
    // ItemType.WEAPON_WARRIOR,
    /** 匕首 */
    // ItemType.WEAPON_JESTER,
    /** 双手槌 */
    // ItemType.WEAPON_CRAFTSMAN,
    /** 锤 */
    // ItemType.WEAPON_PRIEST,
    /** 法杖 */
    // ItemType.WEAPON_MAGE,
    /** 商城装备 */
    // ItemType.CASH_EQUIPMENT,
    /** 商城套装 */
    // ItemType.CASH_SET,
    /** 盾 */
    // ItemType.ITEM_SHEILD,
    /** 上衣 */
    // ItemType.ITEM_CLOTH_KNIGHT,
    /** 上衣 */
    // ItemType.ITEM_CLOTH,
    /** 帽子 */
    // ItemType.ITEM_HAT,
    /** 也是帽子 */
    // ItemType.ITEM_HAT_2,
    /** 鞋子 */
    // ItemType.ITEM_SHOES_KNIGHT,
    /** 鞋子 */
    // ItemType.ITEM_SHOES,
    /** 饰品类 */
    // ItemType.ITEM_SPECIL,
    /** 宠物 */
    // ItemType.ITEM_PET,
    /** 宝石类 */
    ItemType.GEM,
    /** 任务物品 */
    ItemType.TASK,
    /** 骑士裤子 */
    // ItemType.ITEM_TROUSERS_KNIGHT,
    /** 裤子 */
    // ItemType.ITEM_TROUSERS,
    /** 合成/制作书 */
    ItemType.BOOK,
    /** 无数据 */
    ItemType.UNKNOW28,
    /** *魔剑士武器 */
    // ItemType.WEAPON_BERSERKER,
    /** *狂剑士武器 */
    // ItemType.WEAPON_SWORDMASTER,
    /** 暗骑士武器 */
    // ItemType.WEAPON_RENEGADE,
    /** 圣骑士武器 */
    // ItemType.WEAPON_DEFENDER,
    /** 刺客武器 */
    // ItemType.WEAPON_ASSASSIN,
    /** 艺者武器 */
    // ItemType.WEAPON_GAMBLER,
    /** 冰魔导武器 */
    // ItemType.WEAPON_ICEWIZARD,
    /** 炎魔导武器 */
    // ItemType.WEAPON_FIREWIZARD,
    /** 审判者武器 */
    // ItemType.WEAPON_TEMPLAR,
    /** 圣贤者武器 */
    // ItemType.WEAPON_APOSTLE,
    /** 爆破士武器 */
    // ItemType.WEAPON_DEMOLITIONIST,
    /** 匠师武器 */
    // ItemType.WEAPON_ARTISAN,
    /** 宝箱 */
    ItemType.CHEST,
    /** 钥匙 */
    ItemType.CHEST_KEY,
    /** 魔法锁 */
    ItemType.CHEST_VIP,
    /** 绑定饰品 */
    // ItemType.ACCESSORY_BIND,
    /** 一次性投掷物 */
    // ItemType.THROWABLE,
    /** 猎人武器 */
    // ItemType.WEAPON_HUNTER,
    /** 弓箭手武器 */
    // ItemType.WEAPON_ARCHER,
    /** 枪手武器 */
    // ItemType.WEAPON_GAUNNER,
    /** 战宠 */
    // ItemType.BATTLE_PET,
    /** 战宠装备 */
    // ItemType.BATTLE_PET_EQUIPMENT,
    /** 饕客武器 */
    // ItemType.WEAPON_COOK,
    /** 食神武器 */
    // ItemType.WEAPON_CHEF,
    /** 美食家武器 */
    // ItemType.WEAPON_FOOD_FIGHTER,
];

/** 不可以精炼的（不可装备的天然排除，不在此处定义） */
const UnGemable = UnEquipable.concat([
    /** 商城装备 */
    ItemType.CASH_EQUIPMENT,
    /** 商城套装 */
    ItemType.CASH_SET,
    /** 宠物 */
    ItemType.ITEM_PET,
    ItemType.THROWABLE,
    ItemType.BATTLE_PET,
]);

/** 可以使用的 药水/状态/锻造书  */
const Usable = [
    /** 特殊物品（药水、经验+） */
    ItemType.SPECIAL,
    /** 时光 */
    ItemType.TIME,
    /** 合成/制作书 */
    ItemType.BOOK,
]

const res = [
    /** 普通物品 */
    ItemType.NORMAL,
    /** 恢复药品 */
    ItemType.FOOD,
    /** 无数据 */
    ItemType.UNKNOW2,
    /** 特殊物品（药水、经验+） */
    ItemType.SPECIAL,
    /** 单手剑 */
    ItemType.WEAPON_KNIGHT,
    /** 时光 */
    ItemType.TIME,
    /** 双手剑 */
    ItemType.WEAPON_WARRIOR,
    /** 匕首 */
    ItemType.WEAPON_JESTER,
    /** 双手槌 */
    ItemType.WEAPON_CRAFTSMAN,
    /** 锤 */
    ItemType.WEAPON_PRIEST,
    /** 法杖 */
    ItemType.WEAPON_MAGE,
    /** 商城装备 */
    ItemType.CASH_EQUIPMENT,
    /** 商城套装 */
    ItemType.CASH_SET,
    /** 盾 */
    ItemType.ITEM_SHEILD,
    /** 上衣 */
    ItemType.ITEM_CLOTH_KNIGHT,
    /** 上衣 */
    ItemType.ITEM_CLOTH,
    /** 帽子 */
    ItemType.ITEM_HAT,
    /** 也是帽子 */
    ItemType.ITEM_HAT_2,
    /** 鞋子 */
    ItemType.ITEM_SHOES_KNIGHT,
    /** 鞋子 */
    ItemType.ITEM_SHOES,
    /** 饰品类 */
    ItemType.ITEM_ACCESSORY,
    /** 宠物 */
    ItemType.ITEM_PET,
    /** 宝石类 */
    ItemType.GEM,
    /** 任务物品 */
    ItemType.TASK,
    /** 骑士裤子 */
    ItemType.ITEM_TROUSERS_KNIGHT,
    /** 裤子 */
    ItemType.ITEM_TROUSERS,
    /** 合成/制作书 */
    ItemType.BOOK,
    /** 无数据 */
    ItemType.UNKNOW28,
    /** *魔剑士武器 */
    ItemType.WEAPON_BERSERKER,
    /** *狂剑士武器 */
    ItemType.WEAPON_SWORDMASTER,
    /** 暗骑士武器 */
    ItemType.WEAPON_RENEGADE,
    /** 圣骑士武器 */
    ItemType.WEAPON_DEFENDER,
    /** 刺客武器 */
    ItemType.WEAPON_ASSASSIN,
    /** 艺者武器 */
    ItemType.WEAPON_GAMBLER,
    /** 冰魔导武器 */
    ItemType.WEAPON_ICEWIZARD,
    /** 炎魔导武器 */
    ItemType.WEAPON_FIREWIZARD,
    /** 审判者武器 */
    ItemType.WEAPON_TEMPLAR,
    /** 圣贤者武器 */
    ItemType.WEAPON_APOSTLE,
    /** 爆破士武器 */
    ItemType.WEAPON_DEMOLITIONIST,
    /** 匠师武器 */
    ItemType.WEAPON_ARTISAN,
    /** 宝箱 */
    ItemType.CHEST,
    /** 钥匙 */
    ItemType.CHEST_KEY,
    /** 魔法锁 */
    ItemType.CHEST_VIP,
    /** 绑定饰品 */
    ItemType.ACCESSORY_BIND,
    /** 一次性投掷物 */
    ItemType.THROWABLE,
    /** 猎人武器 */
    ItemType.WEAPON_HUNTER,
    /** 弓箭手武器 */
    ItemType.WEAPON_ARCHER,
    /** 枪手武器 */
    ItemType.WEAPON_GAUNNER,
    /** 战宠 */
    ItemType.BATTLE_PET,
    /** 战宠装备 */
    ItemType.BATTLE_PET_EQUIPMENT,
    /** 饕客武器 */
    ItemType.WEAPON_COOK,
    /** 食神武器 */
    ItemType.WEAPON_CHEF,
    /** 美食家武器 */
    ItemType.WEAPON_FOOD_FIGHTER,
];

interface CookInfo {
    /** 料理产物 */
    target: number;
    /** 辅助格数 */
    slot: number;
    /** 辅助价格 */
    fee: number;
    /** 料理等级 */
    skill: number;
}

interface PtTable {
    [level: number]: number;
}

interface IDescription {
    properties: string[];
    description: string;
}

interface IAdditionalFactors {
    [level: number]: number;
}

/** 装备属性在各精练等级下的加成系数 1234 */
const propertyFactors: IAdditionalFactors = {
    0: 0,
    1: 1,
    2: 2,
    3: 3,
    4: 5,
    5: 7,
    6: 9,
    7: 12,
    8: 15,
    9: 18,
    10: 22,
    11: 26,
    12: 30
};

/** 武器属性在各精练等级下的加成系数 1246 */
const weaponPropertyFactors: IAdditionalFactors = {
    0: 0,
    1: 1,
    2: 2,
    3: 3,
    4: 5,
    5: 7,
    6: 9,
    7: 13,
    8: 17,
    9: 21,
    10: 27,
    11: 33,
    12: 39
};

/** 装备需求在各精练等级下的加成系数 */
const limitFactors: IAdditionalFactors = {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 1,
    5: 2,
    6: 3,
    7: 4,
    8: 5,
    9: 6,
    10: 7,
    11: 8,
    12: 9
};

/** 武器增减伤在各精练等级下的加成系数 */
const weaponPercentFactors: IAdditionalFactors = {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 1,
    5: 2,
    6: 3,
    7: 4,
    8: 5,
    9: 6,
    10: 7,
    11: 8,
    12: 9
};

/** 飾品增减伤在各精练等级下的加成系数 */
const percentFactors: IAdditionalFactors = {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 1,
    5: 1,
    6: 1,
    7: 2,
    8: 2,
    9: 2,
    10: 3,
    11: 3,
    12: 3
};

/** 价格在各精练等级下的增加面分比 */
const priceFactors: IAdditionalFactors = {
    0: 0,
    1: 0.2,
    2: 0.4,
    3: 0.6,
    4: 0.8,
    5: 1,
    6: 1.2,
    7: 1.4,
    8: 1.6,
    9: 1.8,
    10: 2,
    11: 2.2,
    12: 2.4
}

/** 所需喂养值在各等级下的增加面分比 */
const feedFactors: IAdditionalFactors = {
    0: 0,
    1: 0.1,
    2: 0.2,
    3: 0.3,
    4: 0.4,
    5: 0.5,
    6: 0.6,
    7: 0.7,
    8: 0.8,
    9: 0.9
}

interface IAdditionals {
    "level": number;
    "attack": number;
    "magic": number;
    "defense": number;
    "needstrength": number;
    "needagile": number;
    "needint": number;
    "needvit": number;
    "needwisdom": number;
    "needluck": number;
    "demageinc": number;
    "demagedec": number;
    sellprice: number;
    buyprice: number;
    petpoint: number;
}

/** 物品信息Mobx类 */
export class Item extends IDLoadable<IItem> {
    /** 精炼等级 */
    @observable addLevel: number = 0;
    @action setAddLevel(level: number) {
        level = Math.min(this.maxAddLevel, level);
        level = Math.max(0, level);
        this.addLevel = level;
    }
    // 实现父类
    protected isDataMatch(param: Param, data: IItem) {
        return data && data.id === param.id && super.isDataMatch(param, data);
    }
    protected async query(param: Param) {
        const map = await query.item(param);
        return map[param.id];
    }
    // ------------- 以下为扩展计算属性 ---------------
    /** 生成纯对象 */
    @computed get plain(): ItemInstance {
        return this.data ? {
            loc: this.loc,
            data: this.data,
            addLevel: this.addLevel
        } : null;
    }
    /** 最高精炼等级 */
    @computed get maxAddLevel(): number {
        const item = this.data;
        const { type, g_type } = item;
        // 宠物 +9
        if (type === ItemType.ITEM_PET) {
            return 9;
        }
        // 装备类+12
        if (type !== ItemType.BOOK && (g_type === GType.ACCESSORY || g_type === GType.ARMOUR || g_type === GType.WEAPON)) {
            return 12;
        }

        // 其它的不能精练
        return 0;
    }
    @computed get additional(): IAdditionals {
        const { data: item, addLevel } = this;
        const { type, type_res1, g_type,
            level_step, attack_step, magic_step, defense_step,
            demagedec, demageinc, buyprice, sellprice, petpoint,
            needstrength_step, needagile_step, needint_step, needvit_step, needwisdom_step, needluck_step } = item;
        // 属性成长通常是1234，但武器类的属性成长是1246
        const propertyFactor = this.weapon ? weaponPropertyFactors[addLevel] : propertyFactors[addLevel];
        const limitFactor = limitFactors[addLevel];
        // 武器类、战宠装备、宠物的增减伤增长快，其它的4 7 10才+1
        const percentFactor = (this.weapon || type === ItemType.BATTLE_PET_EQUIPMENT || type === ItemType.ITEM_PET) ? weaponPercentFactors[addLevel] : percentFactors[addLevel];
        // 价格是比例加的
        const priceFactor = priceFactors[addLevel];
        // 所需喂养值也是按比例加的
        const feedFactor = type === ItemType.ITEM_PET ? feedFactors[addLevel] : 0;
        return {
            // 1-3 +1N 4-6 +2N 7-9 +3N 10-12 +4N
            attack: attack_step * propertyFactor,
            magic: magic_step * propertyFactor,
            defense: defense_step * propertyFactor,
            // 1-3不加 4-12每级+1
            level: level_step * limitFactor,
            needstrength: needstrength_step * limitFactor,
            needagile: needagile_step * limitFactor,
            needint: needint_step * limitFactor,
            needvit: needvit_step * limitFactor,
            needwisdom: needwisdom_step * limitFactor,
            needluck: needluck_step * limitFactor,
            // 增减伤特殊算
            demagedec: demagedec ? percentFactor : 0,
            demageinc: demageinc ? percentFactor : 0,
            // 价格
            buyprice: Math.floor(buyprice * priceFactor),
            sellprice: Math.floor(sellprice * priceFactor),
            // 喂养值
            petpoint: Math.floor(petpoint * feedFactor),
        };
    }
    /** 高级描述信息 */
    @computed get description() {
        // #B# 起始 #X#结束 #N#换行
        const item = this.data;
        const description = item.description;
        const match = description.match(/^#B#(.*?)#X#/);
        if (match) {
            return {
                properties: match[1].split('#N#'),
                description: description.slice(match[0].length)
            }
        }
    }
    /** 是否為特別道具 */
    @computed get specialClass(): boolean {
        return this.data.res10 === 1;
    }
    /** 是否为战宠道具 */
    @computed get battlePetClass(): boolean {
        return this.data.res10 === 2;
    }
    /** 初级料理信息 */
    @computed get cookInfo():CookInfo {
        const item = this.data;
        if(item.type === ItemType.NORMAL && item.g_item>0){
            return {
                target: item.g_item,
                fee: item.t_item,
                slot: item.s_item,
                skill: item.c_item
            }
        }
    }
    /** 是否是武器 TODO 以后改为按type判断？ */
    @computed get weapon() {
        // 武器G书也在此类里
        return this.data.g_type === GType.WEAPON && this.data.type !== ItemType.BOOK;
    }
    /** 是否是防具 */
    @computed get armour() {
        return this.data.g_type === GType.ARMOUR && this.data.type !== ItemType.BOOK;
    }
    /** 是否为饰品 */
    @computed get accessory() {
        return this.data.g_type === GType.ACCESSORY && this.data.type !== ItemType.BOOK;
    }
    /** 是否为装备（强化） */
    @computed get equipment(): boolean {
        return this.weapon || this.armour || this.accessory;
    }
    /** 是否可以佩戴，装备+宠物 */
    @computed get equipable() {
        return UnEquipable.indexOf(this.data.type) < 0;
    }
    /** 是否可以使用，例如 锻造书 */
    @computed get usable() {
        return Usable.indexOf(this.data.type) >= 0;
    }
    /** 是否可以料理 */
    @computed get cookable(): boolean {
        return this.data.type === ItemType.NORMAL && this.data.g_item > 0;
    }
    /** 是否可以高级料理 */
    @computed get advanceCookable(): boolean {
        return this.data.type === ItemType.FOOD && this.data.convertid>0;
    }
    /** 职业 */
    @computed get jobs(): (Job | BattlePetJob)[] {
        const item = this.data;
        let jobid = item.jobid;
        if (item.type === ItemType.BATTLE_PET_EQUIPMENT) {
            return [jobid];
        }
        let job = 0, jobs: Job[] = [];
        while (jobid > 0) {
            if (jobid & 0x1) {
                jobs.push(job);
            }
            job++;
            jobid >>= 1;
        }
        // if(jobid === 1<<Job.GAME_MASTER){
        //     return ['禁止任何职业使用'];
        // }else if(jobid === 1<< Job.ALL){
        //     return ['适合所有职业使用'];
        // }else{

        // }
        return jobs;
    }
    /** 是否有PT（不一定是作为辅助，也可能是G化时用来计算费用） */
    @computed get ptAvailable(): boolean{
        const item = this.data;
        return item.type !== ItemType.BOOK && // 不能是合成书
            (item.type === ItemType.GEM || item.g_type === GType.ACCESSORY || item.g_type === GType.ARMOUR || item.g_type === GType.WEAPON); // 可以是宝石及装备
    }
    /** 是否可以作为G辅助 */
    @computed get gAssistable(): boolean {
        const item = this.data;
        return item.type_res1 !== TypeRes1.ACCESSORY && // 不能是特殊配件
            this.ptAvailable // 可以有PT

    }
    /** PT表 */
    @computed get ptTable(): PtTable {
        const item = this.data;
        if (!item || item.pt <= 0 || !this.ptAvailable) {
            return;
        }
        const ptTable = {};
        if (item.type === ItemType.GEM) {
            for (let i = 0; i <= 12; i++) {
                ptTable[i] = item.pt;
            }
        } else {
            let pt = item.pt;
            let mul = 1, increase = 1;
            let a, b;

            a = pt * 0.2;
            b = pt * 0.4;

            switch (item.glevel % 100) {
                case 2:
                    mul = 4;
                    increase = 1;
                    break;
                case 1:
                    mul = 2;
                    increase = 1;
                    break;
                default: // 异常情况，PT不变化
                    mul = 1;
                    increase = 0;
                    break;
            }
            ptTable[5] = pt * mul;
            ptTable[6] = ptTable[5] + a * increase;
            ptTable[7] = ptTable[5] + b * increase;
            ptTable[8] = ptTable[5] + pt * increase;
            ptTable[9] = ptTable[5] + pt * 2 * increase;
            ptTable[10] = ptTable[5] + pt * 3 * increase;
            ptTable[11] = ptTable[5] + pt * 4 * increase;
            ptTable[12] = ptTable[5] + pt * 5 * increase;
        }
        return ptTable;
    }
    /** 当前物品的PT值 */
    @computed get pt(): number {
        const {ptTable, addLevel} = this;
        if (ptTable && (addLevel in ptTable)) {
            return ptTable[addLevel];
        }
        return 0;
    }
    /** 强化所需PT表 */
    @computed get ptNeedTable(): PtTable {
        const item = this.data;
        if (item.g_item || item.t_item || item.s_item || item.c_item) {
            let needPtTable = {};
            let npt = item.needpt;

            let _p7, _p8, _p9, _p10, _p11, _p12;

            // 2010.2.24 经测试发现国服180防具合成系数计算有所不同，算是一个bug
            switch (item.glevel % 100) {
                case 2:
                    _p7 = npt;
                    _p8 = _p7 + 5;
                    _p9 = _p8 + 10;
                    _p10 = _p9 + 10;
                    _p11 = _p10 + 10;
                    _p12 = _p11 + 10;
                    break;
                case 1:
                    _p7 = npt;
                    _p8 = _p7 + 5;
                    _p9 = _p8 + 15;
                    _p10 = _p9 + 15;
                    _p11 = _p10 + 15;
                    _p12 = _p11 + 15;
                    break;
                default:// 异常情况，需求PT也不变化
                    _p12 = _p11 = _p10 = _p9 = _p8 = _p7 = npt;
                    break;
            }

            needPtTable[7] = 10000.0 / _p7;
            needPtTable[8] = 10000.0 / _p8;
            needPtTable[9] = 10000.0 / _p9;
            needPtTable[10] = 10000.0 / _p10;
            needPtTable[11] = 10000.0 / _p11;
            needPtTable[12] = 10000.0 / _p12;

            return needPtTable;
        }
    }
}