export interface Craft {
    /** id */
    id: number;
    /** 技能等級 */
    skilllevel: number;
    /** 裝備等級 */
    level: number;
    /** 制作费 */
    fee: number;
    /** 基础成功率 */
    rate: number;
    /** 辅助位 */
    fieldnum: number;
    /** 结果 */
    result: number;
    /** 结果数 */
    resultnum: number;
    /** mix.edt中指定的随机合成产品 */
    mix: number;
    /** G书类型 */
    type: number;
    /** HP */
    needitem: number;
    /** G化装备需要的等级 */
    needitemlevel: number;
    /** 需求物品1 */
    need1: number;
    /** 需求物品1数量 */
    num1: number;
    /** 需求物品2 */
    need2: number;
    /** 需求物品2数量 */
    num2: number;
    /** 需求物品3 */
    need3: number;
    /** 需求物品3数量 */
    num3: number;
    /** 需求物品4 */
    need4: number;
    /** 需求物品4数量 */
    num4: number;
    /** 需求物品5 */
    need5: number;
    /** 需求物品5数量 */
    num5: number;
}