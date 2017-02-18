// 物品数据库store
// TODO 如何解决reaction进行中的判断？用于服务端判断是否加载完成
import { observable, computed, action, reaction, useStrict, IObservableArray, untracked, autorun } from 'mobx';
import { Item } from '../types';
import * as query from './query';
import { delay } from '../util';
import { ServerId, mainDb } from '../config';
import { ItemDetail, Loadable } from '../models';

interface Param{
    loc: ServerId;
    keyword: string;
    offset: number;
    limit: number;
}
interface Result{
    list: Item[];
    count: number;
}

interface ParamConfig<T>{
    /** 默认值，如果为默认，则不显示在url中 */
    defaults: T;
    /** url的参数名 */
    query: string;
    /** 是否位于path中（而非query中） */
    inPath?: boolean;
    /** 是否需要history记录（算成pv） */
    history?: boolean;
    /** 格式化值 */
    formula: (v: string)=>T;
    /** 设置值到model */
    setter: (o: ItemDbStore, v: T)=>void;
    /** 从model读取值 */
    getter: (o: ItemDbStore)=>T;
}
const paramConfigs: ParamConfig<any>[] = [
    /** 当前查询的服务器 */
    {
        query: "loc",
        inPath: true,
        history: true,
        defaults: mainDb,
        formula: (v)=>{
            return <ServerId>v;
        },
        getter: (o)=>{
            return o.loc;
        },
        setter: (model, v)=>{
            model.loc = v;
        }
    } as ParamConfig<ServerId>,
    /** 搜索关键字 */
    {
        query: "keyword",
        history: true,
        defaults: "",
        formula: v=>v,
        getter: (o)=>{
            return o.keyword;
        },
        setter: (model, v)=>{
            model.keyword = v;
        }
    } as ParamConfig<string>,
    /** 当前页码 */
    {
        query: "page",
        defaults: 1,
        formula: v=>(+v || 1),
        getter: (o)=>{
            return o.page;
        },
        setter: (model, v)=>{
            model.page = v;
        }
    } as ParamConfig<number>,
    /** 当前页面大小 */
    {
        query: "count",
        defaults: 15,
        formula: v=>(+v || 15),
        getter: (o)=>{
            return o.pageSize;
        },
        setter: (model, v)=>{
            model.pageSize = v;
        }
    } as ParamConfig<number>,
    /** 查看的物品id */
    {
        query: "id",
        history: true,
        defaults: 0,
        formula: v=>+v||0,
        getter: (o)=>{
            return o.itemModel && o.itemModel.id;
        },
        setter: (model, v)=>{
            model.itemId = v;
        }
    } as ParamConfig<number>,
    {
        query: "level",
        defaults: 0,
        formula: v=>+v||0,
        getter: (o)=>{
            return o.itemModel && o.itemModel.addLevel;
        },
        setter: (model, v)=>{
            model.itemLevel = v;
        }
    } as ParamConfig<number>
];

export default class ItemDbStore extends Loadable<Param, Result> {
    protected initOptions(options?: any, restoreFromData = false){
        this.itemModel = new ItemDetail();
        this.itemModel.init(options.itemModel, restoreFromData);
        delete options.itemModel;

        super.initOptions(options, restoreFromData);

        autorun(() => {
            this.itemModel.loc = this.loc;
        })
    }
    protected isParamValid(param: Param): boolean{
        return param.loc && param.keyword && param.limit>0 && param.offset>=0;
    }
    protected isDataMatch(param: Param, data: Result): boolean{
        return false; // 始终查询
    }
    @computed protected get param(): Param{
        return {
            loc: this.loc,
            keyword: this.keyword,
            offset: this.offset,
            limit: this.limit
        }
    }
    protected query(param: Param){
        return query.list(param);
    }
    // ------------------- 原始属性 --------------------
    /**
     * 当前查询的服务器
     */
    @observable loc: ServerId = mainDb;
    /**
     * 搜索关键字
     */
    @observable keyword: string = "";
    /**
     * 当前页码
     */
    @observable page: number = 1;
    /**
     * 当前页面大小
     */
    @observable pageSize: number = 15;
    /** 不需要详情 */
    @observable.ref data: Result = null;
    /** 物品详情Model */
    @observable.ref itemModel: ItemDetail = null;

    // ------------------- 高级属性 ----------------
    /** 物品详情面板 */
    // @computed get itemModel(): ItemModel {
    //     return new ItemModel(this.item);
    // }
    /**
     * 是否初始化结束（用于服务端渲染判断）
     */
    @computed get initialized(): boolean {
        return !this.loading && !this.itemModel.loading;
    }
    /**
     * 总页数
     */
    @computed get pageCount(): number {
        return Math.ceil((this.data && this.data.count || 0) / this.pageSize) || 1;
    }
    /**
     * 起始位置
     */
    @computed get offset(): number {
        return (this.page - 1) * this.pageSize;
    }
    /**
     * 拉取数量
     */
    @computed get limit(): number {
        return this.pageSize;
    }
    /**
     * 获取参数对象
     * @param inPath 如果为null，则获取所有；true获取path；false获取query；
     * @param historyOnly 如果为false，获取所有；如果为true，获取history:true的参数；
     */
    private getParams(inPath?: boolean, historyOnly: boolean = false){
        const params = {};
        paramConfigs.filter(o=>!o.inPath !== inPath)
        .filter(o=>!historyOnly || o.history)
        .forEach(o=>{
            const key = o.query;
            const value = o.getter(this);
            if(o.inPath || value !== o.defaults){
                params[key] = value;
            }
        })
        return params;
    }
    /** path中的参数对象 */
    @computed get pathParams(): any{
        return this.getParams(true);
    }
    /** query中的参数对象 */
    @computed get queryParams(): any{
        return this.getParams(false);
    }
    /** 主要参数，变动代表需要加入history */
    @computed get historyParams(): any{
        return this.getParams(null, true);
    }
    /** 页面标题 */
    @computed get pageTitle(): string {
        return '希尔特国家地理';
    }
    /** 页面URL search */
    @computed get pagePath(): string {
        const {pathParams, queryParams} = this;

        const path = `/${pathParams["loc"]}/db`;
        const query = Object.keys(queryParams).map(key=>{
            const value = queryParams[key];
            return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
        }).join('&');
  
        return path + (query ? '?' : '') + query;
    }
    // ------------------- 动作 --------------------
    /** 从页面URL中读取数据 */
    @action navigatePath(pathAndQuery: string) {
        const [path, search=""] = pathAndQuery.split('?');
        const [,loc,mod] = path.split('/');

        const pathParam: any = {},
            params = {};
        if(loc && /^\w+$/.test(loc)){
            pathParam.loc = loc;
        }

        search.replace(/^\?/, '').split('&').map(part => {
            let [key, value] = part.split('=');
            key = decodeURIComponent(key);
            value = decodeURIComponent(value);
            params[key] = value;
        });

        paramConfigs.forEach(o=>{
            const map = o.inPath ? pathParam : params;
            let value;
            if(o.query in map){
                value = map[o.query];
            }else{
                value = o.defaults;
            }
            o.setter(this, value);
        })
    }
    @action changeServer(loc: ServerId){
        this.loc = loc;
        this.err = null;
    }
    /**
     * 搜索
     */
    @action search(keyword: string) {
        this.keyword = keyword;
        this.page = 1; // 搜索时，重置页码
        // 清空之前的错误
        this.err = null;
    }
    /**
     * 翻页
     */
    @action paginate(page: number, pageSize?: number) {
        this.page = page;
        if (pageSize) {
            this.pageSize = pageSize;
        }
    }
    /**
     * 查看物品
     */
    @action viewItem(item?: Item, level: number = 0) {
        this.item = item;
        this.itemId = item ? item.id : 0;
        this.itemLevel = level;
    }
    set item(item: Item) {
        this.itemModel.data = item;
    }
    set itemId(id: number) {
        this.itemModel.setId(id);
    }
    /** 设置精炼等级 */
    set itemLevel(itemLevel: number) {
        this.itemModel.addLevel = itemLevel;
    }
    @action setItemLevel(level: number) {
        // 装备、宠物才可以精练
        level = Math.max(0, level);
        level = Math.min(12, level);
        this.itemLevel = level;
    }
}