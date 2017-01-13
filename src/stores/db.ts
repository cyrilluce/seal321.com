// 物品数据库store
// TODO 如何解决reaction进行中的判断？用于服务端判断是否加载完成
import { observable, computed, action, reaction, useStrict, IObservableArray } from 'mobx';
import {Item} from '../types';
import * as query from './query';
import {delay} from '../util';

interface InitableProperties{
    keyword?: string;
    page?: number;
    pageSize?: number;
}

export default class ItemDbStore{
    constructor(options: InitableProperties = {}, skipReaction: boolean = false){
        if(!skipReaction){
            this.initReactions();
        }
        
        const {keyword="", page, pageSize} = options;
        if(keyword){
            this.search(keyword);
        }
        if(page){
            this.paginate(+page, +pageSize);
        }
    }
    /**
     * 初始化Reactions
     */
    initReactions(){
        this.reactionSearch();
    }
    /**
     * 用于前端进行store复原
     */
    static fromJS(data): ItemDbStore{
        const store = new ItemDbStore(undefined, true);
        Object.keys(data).forEach(key=>{
            if(key in store){
                store[key] = data[key];
            }
        });
        store.initReactions();
        return store;
    }
    // ------------------- 原始属性 --------------------
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
    @observable list: Item[] = [];
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
    @observable item: Item;
    /** 当前查看的物品的模拟等级 */
    @observable itemLevel: number = 0;

    // ------------------- 高级属性 ----------------
    /**
     * 是否初始化结束（用于服务端渲染判断）
     */
    @computed get initialized(): boolean{
        return !this.searching;
    }
    /**
     * 总页数
     */
    @computed get pageCount(): number{
        return Math.ceil(this.totalCount/this.pageSize) || 1;
    }
    /**
     * 起始位置
     */
    @computed get offset(): number{
        return (this.page - 1) * this.pageSize;
    }
    /**
     * 拉取数量
     */
    @computed get limit(): number{
        return this.pageSize;
    }
    // ------------------- 动作 --------------------
    /**
     * 搜索
     */
    @action search(keyword: string){
        this.keyword = keyword;
        this.page=1; // 搜索时，重置页码
    }
    /**
     * 翻页
     */
    @action paginate(page: number, pageSize?: number){
        this.page = page;
        if(pageSize){
            this.pageSize = pageSize;
        }
    }
    /**
     * 查看物品
     */
    @action viewItem(item?: Item, level: number = 0){
        this.item = item;
        this.itemLevel = level;
    }
    /** 设置精炼等级 */
    @action setItemLevel(level: number){
        // 装备、宠物才可以精练
        level = Math.max(0, level);
        level = Math.min(12, level);
        this.itemLevel = level;
    }

    // ------------------ 响应 Reactions ---------------------
    /**
     * 响应搜索
     */
    reactionSearch(){
        let token = 1;
        reaction(
            '搜索',
            ()=>({
                keyword: this.keyword,
                offset: this.offset,
                limit: this.limit
            }),
            async params => {
                let list: Item[], totalCount: number;

                const myToken = ++token;

                if(params.keyword){
                    // 搜索
                    this.searching = true;

                    // 缓冲
                    await delay();

                    // 如果重复执行了，本次取消，类似于debounce？
                    if(myToken !== token){
                        return;
                    }
                    try{
                        let data = await query.list(params);
                        if(myToken !== token){
                            return;
                        }
                        list = data.list;
                        totalCount = data.count;
                    }catch(err){
                        list = [];
                        totalCount = 0;
                        this.message = err.message || JSON.stringify(err);
                    }
                    
                }else{ // 空关键字，清空列表
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

}