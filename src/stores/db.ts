// 物品数据库store
// TODO 如何解决reaction进行中的判断？用于服务端判断是否加载完成
import { observable, computed, action, reaction, useStrict, IObservableArray } from 'mobx';
import * as query from './query';
import delay from '../util/delay';

interface InitableProperties{
    keyword?: string;
    page?: number;
    pageSize?: number;
}

export default class ItemDbStore{
    constructor(options: InitableProperties = {}){
        this.reactionSearch();
        
        const {keyword="", page=1, pageSize=20} = options;
        if(keyword){
            this.search(keyword);
        }
        if(page){
            this.paginate(page, pageSize);
        }
    }
    /**
     * 用于前端进行store复原
     */
    static fromJs(): ItemDbStore{
        const store = new ItemDbStore();
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
    @observable list: Item[];
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
    @observable pageSize: number = 20;

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

    // ------------------- 动作 --------------------
    /**
     * 搜索
     */
    @action search(keyword: string){
        this.keyword = keyword;
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
                page: this.page,
                size: this.pageSize
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
                        list = data.list;
                        totalCount = data.count;
                    }catch(err){
                        list = [];
                        totalCount = 0;
                        this.message = err.message;
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