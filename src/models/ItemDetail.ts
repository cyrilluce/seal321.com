import { Item, ItemType, GType, Job, BattlePetJob, EquipPosition, TypeRes1 } from '../types';
import { observable, computed, action, reaction, autorun } from 'mobx';
import { ServerId, mainDb } from '../config';
import * as query from '../stores/query';
import { delay } from '../util';
import { SetOptionModel } from './SetOption';
import { IDLoadable, Param } from './IDLoadable';
import { Item as ItemModel } from './Item';
import { HowGetModel } from './HowGet';

export class ItemDetail extends ItemModel{
    /** 套装属性 */
    @observable.ref setOptionModel: SetOptionModel = null;
    /** G/T/S/C */
    gItem: ItemModel = null;
    tItem: ItemModel = null;
    sItem: ItemModel = null;
    cItem: ItemModel = null;
    /** 掉落 */
    drop: HowGetModel = null;
    protected initOptions(options: any = {}, restoreFromData = false){
        this.setOptionModel = new SetOptionModel();
        this.setOptionModel.init(options.setOptionModel, restoreFromData);
        delete options.setOptionModel;

        this.gItem = new ItemModel().init(options.gItem, restoreFromData);
        delete options.gItem;
        this.tItem = new ItemModel().init(options.tItem, restoreFromData);
        delete options.tItem;
        this.sItem = new ItemModel().init(options.sItem, restoreFromData);
        delete options.sItem;
        this.cItem = new ItemModel().init(options.cItem, restoreFromData);
        delete options.cItem;
        this.drop = new HowGetModel().init(options.drop, restoreFromData);
        delete options.drop;

        super.initOptions(options, restoreFromData);

        autorun(() => {
            const item = this.data;
            this.setOptionModel.loc = this.loc;
            this.setOptionModel.setId(item ? item.setid : 0);
            const validEquipment = item && this.equipable;
            this.gItem.loc = this.loc;
            this.gItem.setId(validEquipment || item && this.cookable ? item.g_item : 0);
            this.tItem.loc = this.loc;
            this.tItem.setId(validEquipment ? item.t_item : 0);
            this.sItem.loc = this.loc;
            this.sItem.setId(validEquipment ? item.s_item : 0);
            this.cItem.loc = this.loc;
            this.cItem.setId(validEquipment ? item.c_item : 0);
            this.drop.loc = this.loc;
            this.drop.setId(item ? item.id : 0);
        })
    }
    // ------------- 以下为扩展计算属性 ---------------
    @computed get loading(): boolean{
        return this.dataLoading || this.setOptionModel && this.setOptionModel.loading ||
            this.gItem && this.gItem.loading ||
            this.tItem && this.tItem.loading ||
            this.sItem && this.sItem.loading ||
            this.cItem && this.cItem.loading ||
            this.drop && this.drop.loading;
    }
}