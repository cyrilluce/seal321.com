// 物品数据库store
// TODO 如何解决reaction进行中的判断？用于服务端判断是否加载完成
import { observable, computed, action, reaction, useStrict, IObservableArray, untracked, autorun } from 'mobx';
import { Item } from '../types';
import * as query from './query';
import { delay } from '../util';
import { ServerId, mainDb } from '../config';
import { ItemModel } from '../models';

export default class ItemDbStore {
    constructor(options: any = {}, restoreFromData: boolean = false) {
        if (!restoreFromData) {
            this.initReactions();
        }

        this.itemModel = new ItemModel();
        this.itemModel.init(options.itemModel, restoreFromData);
        delete options.itemModel;

        Object.keys(options).forEach(key => {
            if (key in this) {
                this[key] = options[key];
            }
        });

        autorun(() => {
            this.itemModel.loc = this.loc;
        })

        if (restoreFromData) {
            this.initReactions();
        }
    }
    /**
     * 初始化Reactions
     */
    initReactions() {
        this.reactionSearch();

    }
    // ------------------- 原始属性 --------------------
    /**
     * 当前查询的服务器
     */
    @observable loc: ServerId = mainDb;
    /**
     * 错误信息
     */
    @observable message: string = "";
    /**
     * 是否处于搜索状态
     */
    @observable searching: boolean = false;
    /**
     * 搜索出的物品列表
     */
    @observable.shallow list: Item[] = [];
    /**
     * 搜索出的物品总数
     */
    @observable totalCount: number = 0;
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


    /**
     * 当前查看的物品
     */
    // @observable.ref item: Item = null;
    /** 当前查看的物品的模拟等级 */
    // @observable itemLevel: number = 0;
    @observable.ref itemModel: ItemModel = null;

    // ------------------- 高级属性 ----------------
    /** 物品详情面板 */
    // @computed get itemModel(): ItemModel {
    //     return new ItemModel(this.item);
    // }
    /**
     * 是否初始化结束（用于服务端渲染判断）
     */
    @computed get initialized(): boolean {
        return !this.searching && !this.itemModel.loading;
    }
    /**
     * 总页数
     */
    @computed get pageCount(): number {
        return Math.ceil(this.totalCount / this.pageSize) || 1;
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

    // ------------------ 响应 Reactions ---------------------
    /**
     * 响应搜索
     */
    reactionSearch() {
        let token = 1;
        reaction(
            () => ({
                loc: this.loc,
                keyword: this.keyword,
                offset: this.offset,
                limit: this.limit
            }),
            async params => {
                let list: Item[], totalCount: number;

                const myToken = ++token;

                if (params.keyword) {
                    // 搜索
                    this.searching = true;

                    // 缓冲
                    await delay();

                    // 如果重复执行了，本次取消，类似于debounce？
                    if (myToken !== token) {
                        return;
                    }
                    try {
                        let data = await query.list(params);
                        if (myToken !== token) {
                            return;
                        }
                        list = data.list;
                        totalCount = data.count;
                    } catch (err) {
                        list = [];
                        totalCount = 0;
                        this.message = err.message || JSON.stringify(err);
                    }

                } else { // 空关键字，清空列表
                    list = [];
                    totalCount = 0;
                }

                // 搜索结束
                this.list = list;
                this.totalCount = totalCount;
                this.searching = false;
            }
        )
    }

    // reactItemDetail(){
    //     reaction(
    //         () => ({
    //             item: this.item,
    //             itemLevel: this.itemLevel
    //         }),
    //         async params => {
    //             const {item, itemLevel} = params;
    //             if(item){
    //                 this.itemModel = new ItemModel(item, itemLevel);
    //             }else{
    //                 this.itemModel = null;
    //             }
    //         }
    //     )
    // }
}