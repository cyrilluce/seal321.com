/**
 * 简单抽象一个基类，有以下通用功能
 *  * 加载器，通过loc+id来加载数据，涉及属性： id, data, err, dataLoading
 * 
 */
import { Base } from './Base';
import { observable, computed, action, reaction } from 'mobx';
import { delay } from '../util';

export abstract class Loadable<TParam, TData> extends Base{
    /**
     * 初始化Reactions
     */
    protected initReactions() {
        super.initReactions();
        this.reactionLoad();
    }
    /** 直接设置数据，如果相符就不需要加载了 */
    @action setData(data: TData){
        this.data = data;
    }
    // ------------------ 基础属性 --------------------
    /** 是否处于查询状态 */
    @observable dataLoading: boolean = false;
    /** 加载失败信息 */
    @observable.ref err: any = null;
    /** 数据 */
    @observable data: TData = null;
    // ------------------- 高级属性 -----------------
    protected abstract get param(): TParam;
    @computed get loading(): boolean{
        return this.dataLoading;
    }
    // ------------------- 响应 --------------------
    /** 响应查询 */
    reactionLoad() {
        let token = 1;
        reaction(
            () => this.param,
            async params => {
                const myToken = ++token;
                let curData = this.data;
                let data: TData;

                if (!this.isParamValid(params) || curData && this.isDataMatch(params, curData)) {
                    return;
                }

                // 搜索
                this.dataLoading = true;

                // 缓冲
                await delay();

                // 如果重复执行了，本次取消，类似于debounce？
                if (myToken !== token) {
                    return;
                }
                try {
                    data = await this.query(params);
                    if (myToken !== token) {
                        return;
                    }
                } catch (err) {
                    this.err = err;
                    data = null;
                    //this.message = err.message || JSON.stringify(err);
                }
                // 搜索结束
                this.data = data;
                this.dataLoading = false;
            }
        )
    }
    // ------------------- 等扩展 ---------------------
    /** 查询接口 */
    protected abstract async query(param: TParam): Promise<TData>
    /** 查询参数是否齐全 */
    protected abstract isParamValid(param: TParam): boolean;
    /** 数据是否是当前参数的 */
    protected abstract isDataMatch(param: TParam, data: TData): boolean

}