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
    /** 页面标题 */
    @computed get pageTitle(): string {
        return '希尔特国家地理';
    }
    /** 页面URL search */
    @computed get pagePath(): string {
        let params = [];
        const {keyword, page, itemModel} = this;
        const {id: itemId, addLevel} = itemModel;
        if (keyword) {
            params.push(['keyword', keyword]);
        }
        if (page > 1) {
            params.push(['page', page]);
        }
        if (itemId > 0) {
            params.push(['id', itemId]);
        }
        if (addLevel > 0) {
            params.push(['level', addLevel]);
        }
        return '?' + params.map(pair => `${encodeURIComponent(pair[0])}=${encodeURIComponent(pair[1])}`).join('&');
    }
    // ------------------- 动作 --------------------
    /** 从页面URL中读取数据 */
    @action navigatePath(search: string) {
        search.replace(/^\?/, '').split('&').map(part => {
            let [key, value] = part.split('=');
            key = decodeURIComponent(key);
            value = decodeURIComponent(value);
            switch (key) {
                case 'keyword':
                    this.keyword = value;
                    break;
                case 'page':
                    this.page = +value || 1;
                    break;
                case 'id':
                    this.itemId = +value || 0;
                    break;
                case 'level':
                    this.itemLevel = +value || 0;
                    break;
            }
        });
    }
    /**
     * 搜索
     */
    @action search(keyword: string) {
        this.keyword = keyword;
        this.page = 1; // 搜索时，重置页码
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
    set itemLevel(itemLevel) {
        this.itemModel.addLevel = itemLevel;
    }
    @action setItemLevel(level: number) {
        // 装备、宠物才可以精练
        level = Math.max(0, level);
        level = Math.min(12, level);
        this.itemLevel = level;
    }
}