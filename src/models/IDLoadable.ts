import { Loadable } from './Loadable';

/**
 * 简单抽象一个基类，有以下通用功能
 *  * 加载器，通过loc+id来加载数据，涉及属性： id, data, err, dataLoading
 * 
 */
import { ServerId, mainDb } from '../config'
import { observable, computed, action, reaction } from 'mobx';
import { delay } from '../util';

type ID = number;
export interface Param{
    loc: ServerId;
    id: ID
}

export abstract class IDLoadable<TData> extends Loadable<Param, TData>{
    protected isParamValid(param: Param): boolean{
        return param.loc && param.id>0;
    }
    // ------------------ 基础属性 --------------------
    @observable loc: ServerId = mainDb;
    /** 套装id */
    @observable id: number = 0;
    // ------------------- 高级属性 -----------------
    @computed get param(): Param{
        return {
            loc: this.loc,
            id: this.id
        }
    }
    // ------------------- 动作 --------------------
    @action setId(id: number) {
        this.err = null;
        this.dataLoading = false;
        this.id = id;
        if (!id) {
            this.data = null;
        }
    }
}