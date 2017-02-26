import { Item, ItemType, GType, Job, BattlePetJob, EquipPosition, TypeRes1, CraftType } from '../types';
import { observable, computed, action, reaction, autorun } from 'mobx';
import { ServerId, mainDb, dbs } from '../config';
import * as query from '../stores/query';
import { delay } from '../util';
import { Item as ItemModel, CraftModel, Base, SetOptionModel, IDLoadable, Param } from '.';

/** 最大辅助位 */
const maxAssist = 5;
/** 最大需求物品种类数 */
const maxNeed = 5;
export class GSimulate extends Base {
    /** 数据库 */
    @observable loc: ServerId;
    /** 制作书物品 */
    @observable.ref book: ItemModel = null;
    /** 制作书属性 */
    @observable.ref craft: CraftModel = null;
    /** 被强化装备 */
    @observable.ref target: ItemModel = null;
    /** 辅助列表 */
    @observable.shallow assists: ItemModel[] = [];
    /** 强化产物 */
    @observable.ref result: ItemModel = null;
    /** 需求物品 */
    @observable.shallow needs: ItemModel[] = [];
    /** 上限成功率，比如台服恋曲只有0.9 TODO */
    @observable maxRate: number = 1;
    /** 技能增加成功率 */
    @observable skillRate: number = 0.25;
    /** 被G化装备是否合法 */
    @observable targetInvalid: string;
    /** 辅助是否合法 */
    @observable assistInvalids: string[] = [];

    protected initOptions(options: any = {}, restoreFromData = false) {
        this.book = new ItemModel().init(options.book, restoreFromData);
        delete options.book;

        this.craft = new CraftModel().init(options.craft, restoreFromData);
        delete options.craft;

        this.target = new ItemModel().init(options.target, restoreFromData);
        delete options.target;

        const assists = options.assists || [];
        for (let i = 0; i < maxAssist; i++) {
            this.assists[i] = new ItemModel().init(assists[i], restoreFromData);
            this.assistInvalids[i] = '';
        }
        delete options.assists;

        const needs = options.needs || [];
        for (let i = 0; i < maxNeed; i++) {
            this.needs[i] = new ItemModel().init(needs[i], restoreFromData);
        }
        delete options.needs;

        this.result = new ItemModel().init(options.result, restoreFromData);
        delete options.result;

        super.initOptions(options, restoreFromData);

        // 根据制作书物品加载制作书信息
        autorun(() => {
            const { loc, book } = this;
            if (dbs[loc]) {
                this.maxRate = dbs[loc].maxRate || 1;
                this.skillRate = dbs[loc].skillRate || 0.25;
            }
            book.loc = loc;
            this.result.loc = loc;
            this.craft.loc = loc;

            this.craft.setId(book.data ? book.data.convertid : 0);
        })

        // 根据制作书信息加载物品需求，以及各种限定
        autorun(() => {
            const { loc, craft } = this;
            const data = craft.data;
            if (!data || this.loading) {
                return;
            }

            // 更新必需材料信息
            this.needs[0].loc = loc;
            this.needs[0].setId(craft.data.need1);

            this.needs[1].loc = loc;
            this.needs[1].setId(craft.data.need2);

            this.needs[2].loc = loc;
            this.needs[2].setId(craft.data.need3);

            this.needs[3].loc = loc;
            this.needs[3].setId(craft.data.need4);

            this.needs[4].loc = loc;
            this.needs[4].setId(craft.data.need5);

            this.target.loc = loc;
            // G书限定物品精练等级
            if (craft.isGTSC) {
                if (!this.targetInvalid && this.target.addLevel < data.needitemlevel) {
                    this.target.addLevel = data.needitemlevel;
                }
            } else {
                // 其它书，限定材料或無材料
                this.target.setId(data.needitem);
                this.target.addLevel = 0;
                // 此时data.needitemlevel代表数量限定
            }

            // 如果限定辅助，直接清空
            this.assists.forEach((assist, index) => {
                if (index >= data.fieldnum) {
                    assist.loc = loc;
                    assist.setId(0);
                }
            })
        })

        // 合成产物显示
        autorun(() => {
            const { craft: craftModel, target: targetModel } = this;
            const craft = craftModel.data;
            const target = targetModel.data;

            let resultId: number = 0;

            if (this.invalid || !craft) {
                // 不合法或没有加载完成
            } else if (craft.type === CraftType.NORMAL) {
                if (this.advanceCook) {
                    resultId = craft.mix;
                }
            } else if (!target) {
                // 没有待制作的装备，无视
            } else if (craft.type === CraftType.G) {
                resultId = target.g_item;
            } else if (craft.type === CraftType.T) {
                resultId = target.t_item;
            } else if (craft.type === CraftType.S) {
                resultId = target.s_item;
            } else if (craft.type === CraftType.C) {
                resultId = target.c_item;
            }
            this.result.setId(resultId);
        });

        // 计算错误信息
        autorun(() => {
            if (this.loading) {
                return;
            }
            const target = this.target.data;
            this.targetInvalid = target ? this.tryTargetItem(target) : '';
            for (let i = 0; i < maxAssist; i++) {
                const assist = this.assists[i].data;
                this.assistInvalids[i] = assist ? this.tryAssistItem(i, assist) : '';
            }
        })
    }
    // ------------- 以下为扩展计算属性 ---------------
    /** 是否是高級料理 */
    @computed get advanceCook(): boolean {
        const book = this.book.data;
        const craft = this.craft.data;
        return !!book && !!craft && book.type === ItemType.FOOD && craft.type === CraftType.NORMAL;
    }
    /** 书本错误 */
    @computed get bookInvalid(): string {
        if (!this.book.data) {
            return '请放置制作书';
        }
    }
    /** 最近的错误信息 */
    @computed get invalid(): string {
        return this.bookInvalid || this.targetInvalid || this.assistInvalids.filter(err => err)[0];
    }
    @computed get loading(): boolean {
        return this.book && this.book.loading ||
            this.craft && this.craft.loading ||
            this.target && this.target.loading ||
            this.assists.some(assist => assist.loading) ||
            this.needs.some(need => need.loading) ||
            this.result && this.result.loading;
    }
    /** 需要PT，不计算基础成功率 */
    @computed get needPt(): number {
        const { craft, target } = this;

        if (!craft.data) {
            return Number.MAX_VALUE;
        }

        // G化的，看对象
        if (craft.isGTSC) {
            if (!target.data || !target.ptNeedTable) {
                return Number.MAX_VALUE;
            }
            return target.ptNeedTable[target.addLevel] || Number.MAX_VALUE;
        } else { // 其它的，看craft的rate定义
            return craft.data.rate || Number.MAX_VALUE;
        }
        // TODO 需确认美服版本机率是否有误
        // // 非G化的，需求PT直接在书上定义
        // // TODO 药水没有定义
        // if (craft.data.type === CraftType.NORMAL) {
        //     return this.book.data.needpt;
        // }
        // return target.ptNeedTable[target.addLevel];
    }
    /** 已有PT */
    @computed get hasPt(): number {
        let pt = 0;
        const craft = this.craft;
        if (!craft || !craft.data) {
            return 0;
        }

        this.assists.forEach((assist, index) => {
            if (index < craft.data.fieldnum && assist.ptTable) {
                pt += assist.ptTable[assist.addLevel];
            }
        })
        return pt;
    }
    /** 成功率限定系数 */
    @computed get limitRate(): number {
        // 只有装备制作才有最高成功率限制
        return this.craft.isGTSC ? this.maxRate : 1;
    }
    /** 基础成功率 */
    @computed get basePercentage(): number {
        // 好像制作书不是用的craft中的rate？而是pt字段
        return this.book.data ? this.book.data.pt : 0;
    }
    /** 成功率 0~100 (已计算服务器总系数) */
    @computed get percentage(): number {
        const { craft, book } = this;
        if (!craft.data || !book.data || this.invalid) {
            return 0;
        }

        // 药水的无成功率
        if (this.advanceCook) {
            return 0;
        }

        return this.limitRate * (this.basePercentage + 100 * this.hasPt / this.needPt) || 0;
    }
    /** 匠师技能是否有效 */
    @computed get skillWork(): boolean {
        const { craft, target } = this;
        if (!craft.data || this.invalid) {
            return false;
        }
        return craft.isGTSC && (!target.data || !target.accessory);
    }
    /** 算上技能后的成功率 */
    @computed get skillPercentage(): number {
        if (this.invalid) {
            return 0;
        }
        // 匠师技能对饰品无效
        const addRate = this.skillWork ? this.skillRate : 0;
        return (1 + addRate) * this.percentage || 0;
    }
    /** 制作费用 */
    @computed get cost(): number {
        const craft = this.craft;
        if (!craft.data) {
            return 0;
        }
        // G化的费用很简单，needPt^2 * 5000
        if (craft.isGTSC) {
            const pt = this.target.pt;
            return pt * pt * 5000;
        } else {
            return craft.data.fee;
        }
    }
    // ---------------- 以下为方法 ------------------
    /** 能否设置制作书物品 */
    tryBookItem(item?: Item): string {
        if (!item) {
            return '请放置制作书';
        }
        // BOOK为制作书，FOOD为高级料理
        // if(item.type === ItemType.BOOK) {
        //     if(item.convertid <= 0){
        //         return '无法制作';
        //     }
        //     return ;
        // }
        // if( item.type === ItemType.FOOD){
        //     if(item.convertid <= 0){
        //         return '不是高级料理材料';
        //     }
        //     return;
        // }
        if (item.convertid <= 0) {
            return '不是制作书或高级料理材料';
        }
    }
    /** 设置制作书物品 */
    @action setBookItem(item?: Item): string {
        if (!item) {
            this.book.setId(0);
            return;
        }
        this.book.setData(item.id, item);
    }
    /** 能否设置被强化装备 */
    tryTargetItem(item: Item): string {
        const craftModel = this.craft;
        const craft = craftModel.data;
        if (!craft) {
            return '未设置制作书';
        }


        // 如果是G书，判断类型，以及等级是否超了
        if (craftModel.isGTSC) {
            if(this.book.data && item.res10 !== this.book.data.res10){
                return '制作书类型不符，特别道具只能使用特别篇，战宠装备只能使用精灵篇';
            }
            const itemModel = new ItemModel();//.init();
            itemModel.setData(item.id, item);
            if (!itemModel.equipment) {
                return '只能强化装备';
            }
            itemModel.addLevel = craft.needitemlevel;
            if (item.level + itemModel.additional.level > craft.level) {
                return `物品等级超出G书范围，要求不能高于${craft.level}级`;
            }
            // 如果没有强化产物？
            if (
                craft.type === CraftType.G && item.g_item <= 0 ||
                craft.type === CraftType.T && item.t_item <= 0 ||
                craft.type === CraftType.S && item.s_item <= 0 ||
                craft.type === CraftType.C && item.c_item <= 0
            ) {
                return '没有强化产物';
            }
        } else if (item.id !== craft.needitem) { // 如果是其它制作书，直接限定了材料
            return '制作书已限定主要材料';
        }

    }
    /** 设置被强化装备 */
    @action setTargetItem(item?: Item): string {
        if (!item) {
            this.target.setId(0);
            return;
        }
        const err = this.targetInvalid = this.tryTargetItem(item);
        if (err) {
            return err;
        }
        const craft = this.craft.data;
        // 免加载
        this.target.setData(item.id, item);
        this.target.addLevel = craft.needitemlevel;
    }
    /** 能否设置辅助 */
    tryAssistItem(index: number, item: Item): string {
        const craft = this.craft.data;
        if (!craft) {
            return '未设置制作书';
        }
        if (index >= craft.fieldnum) {
            return `此制作书只能使用${craft.fieldnum}个辅助`;
        }
        const itemModel = new ItemModel();//.init();
        itemModel.setData(item.id, item);
        if (!itemModel.gAssistable) {
            return `此物品不能作为辅助`;
        }
        if (itemModel.ptTable) {
            for (let level = 0; level < itemModel.maxAddLevel; level++) {
                if (itemModel.ptTable[level] > 0) {
                    itemModel.addLevel = level;
                    break;
                }
            }
            if (itemModel.ptTable[itemModel.addLevel] <= 0) {
                return `此物品不能作为辅助`;
            }
        }

    }
    /** 设置辅助 */
    @action setAssistItem(index: number, item?: Item): string {
        const itemModel = this.assists[index];
        if (!item) {
            itemModel.setId(0);
            return;
        }
        const err = this.tryAssistItem(index, item);
        if (err) {
            return err;
        }
        itemModel.setData(item.id, item);
        itemModel.addLevel = 0;
        if (itemModel.ptTable) {
            for (let level = 0; level < itemModel.maxAddLevel; level++) {
                if (itemModel.ptTable[level] > 0) {
                    itemModel.addLevel = level;
                    break;
                }
            }
        }

    }
}