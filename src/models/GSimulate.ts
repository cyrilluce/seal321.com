import { Item, ItemType, GType, Job, BattlePetJob, EquipPosition, TypeRes1 } from '../types';
import { observable, computed, action, reaction, autorun } from 'mobx';
import { ServerId, mainDb, dbs } from '../config';
import * as query from '../stores/query';
import { delay } from '../util';
import { Item as ItemModel, CraftModel, Base, SetOptionModel, IDLoadable, Param } from '.';

/** 最大辅助位 */
const maxAssist = 5;
/** 最大需求物品种类数 */
const maxNeed = 5;
export class GSimulate extends Base{
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

    protected initOptions(options: any = {}, restoreFromData = false){
        this.book = new ItemModel().init(options.book, restoreFromData);
        delete options.book;

        this.craft = new CraftModel().init(options.craft, restoreFromData);
        delete options.craft;

        this.target = new ItemModel().init(options.target, restoreFromData);
        delete options.target;

        const assists = options.assists || [];
        for(let i=0; i<maxAssist; i++){
            this.assists[i] = new ItemModel().init(assists[i], restoreFromData);
        }
        delete options.assists;

        const needs = options.needs || [];
        for(let i=0; i<maxNeed; i++){
            this.needs[i] = new ItemModel().init(needs[i], restoreFromData);
        }
        delete options.needs;

        this.result = new ItemModel().init(options.result, restoreFromData);
        delete options.result;

        super.initOptions(options, restoreFromData);

        // 根据制作书物品加载制作书信息
        autorun(() => {
            const { loc, book } = this;
            if(dbs[loc]){
                this.maxRate = dbs[loc].maxRate || 1;
            }
            
            if(!book.data){
                return;
            }
            this.craft.loc = loc;
            this.craft.setId(book.data.convertid);
        })

        // 根据制作书信息加载物品需求，以及各种限定
        autorun(() => {
            const { loc, craft } = this;
            const data = craft.data;
            if(!data){
                return;
            }
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

            // 限定物品精练等级
            if(this.target.addLevel<data.needitemlevel){
                this.target.addLevel = data.needitemlevel;
            }
        })
    }
    // ------------- 以下为扩展计算属性 ---------------
    /** 判断被G化装备是否合法 */
    @computed get targetInvalid(): string{
        const target = this.target;
        const craft = this.craft.data;

        if(!target || !craft){
            return '请放置制作书与待制作物品';
        }
        // 精练等级是否符合
        if(target.addLevel < craft.needitemlevel){
            return `精练等级不符合G书要求，要求最低+${craft.needitemlevel}`;
        }
        // 物品等级
        if(target.data.level + target.additional.level > craft.level){
            return `物品等级超出G书范围，要求不能高于${craft.level}级`
        }
    }
    @computed get loading(): boolean{
        return this.book && this.book.loading ||
            this.craft && this.craft.loading ||
            this.target && this.target.loading ||
            this.assists.some(assist=>assist.loading) ||
            this.needs.some(need=>need.loading) ||
            this.result && this.result.loading;
    }
    /** 需要PT，不计算基础成功率 */
    @computed get needPt(): number{
        const { craft, target } = this;
        if(!target.ptNeedTable){
            return;
        }
        return target.ptNeedTable[target.addLevel];
    }
    /** 已有PT */
    @computed get hasPt(): number{
        let pt = 0;
        const craft = this.craft;
        if(!craft || !craft.data){
            return;
        }

        this.assists.forEach((assist, index)=>{
            if(index<craft.data.fieldnum && assist.ptTable){
                pt += assist.ptTable[assist.addLevel];
            }
        })
        return pt;
    }
    /** 成功率 0~1 */
    @computed get percentage(): number{
        const { craft, target } = this;
        if(!craft || !craft.data || !target || !target.data){
            return;
        }
        const { needPt, hasPt } = this;
        
        return craft.data.rate + 100*hasPt/needPt;
    }
    /** 算上技能后的成功率 */
    @computed get skillPercentage(): number{
        const target = this.target;
        if(!target || !target.data){
            return;
        }
        // 匠师技能对饰品无效
        const addRate = target.accessory ? this.skillRate : 0;
        return (1 + addRate) * this.percentage;
    }
    /** 再算上服务器成功率上限后的成功率（技能已计算） */
    @computed get finalPercentage(): number{
        return this.skillPercentage * this.maxRate
    }
    // ---------------- 以下为方法 ------------------
    /** 设置制作书物品 */
    @action setBookItem(item?: Item): string{
        this.book.data = item;
        this.book.id = item ? item.id : 0;
        return;
    }
    /** 设置被强化装备 */
    @action setTargetItem(item: Item): string{
        const craft = this.craft.data;
        if(!craft){
            return '未设置制作书';
        }
        // 免加载
        this.target.data = item;
        this.target.id = item.id;

        this.target.addLevel = craft.needitemlevel;
    }
    /** 设置辅助 */
    @action setAssistItem(index: number, item: Item): string{
        const craft = this.craft.data;
        if(index>=craft.fieldnum){
            return `此制作书只能使用${craft.fieldnum}个辅助`;
        }
        const itemModel = this.assists[index];
        itemModel.data = item;
        itemModel.id = item.id;
        if(!itemModel.gAssistable){
            itemModel.data = null;
            itemModel.id = 0;
            return `此物品不能作为辅助`;
        }
        for(let level=0; level < itemModel.maxAddLevel; level++){
            if(itemModel.ptTable[level]>0){
                itemModel.addLevel = level;
                break;
            }
        }
        if(itemModel.ptTable[itemModel.addLevel] <= 0){
            itemModel.data = null;
            itemModel.id = 0;
            return `此物品不能作为辅助`;
        }
    }
}