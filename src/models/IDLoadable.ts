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
    // 如果地域切换过，一定要重新加载
    protected isDataMatch(param: Param, data: TData): boolean{
        return this.lastParam && this.loc === this.lastParam.loc;
    }
    // ------------------ 基础属性 --------------------
    /** 所属数据库 */
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
    /** 设置ID，一般会触发加载 */
    @action setId(id: number) {
        this.err = null;
        this.dataLoading = false;
        this.id = id;
        if (!id) {
            this.data = null;
        }
    }
    /** 直接设置数据，如果相符就不需要加载了 */
    @action setData(id: number, data: TData){
        this.err = null;
        this.dataLoading = false;
        this.id = id;
        this.data = data;
        this.lastParam = this.param;
    }
}