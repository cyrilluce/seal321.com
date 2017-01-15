import { SetOption } from '../types';
import { observable, computed, action, reaction } from 'mobx';
import { ServerId, mainDb } from '../config';
import * as query from '../stores/query';
import { delay } from '../util';

export interface SetOptions{
    [count: number]: SetOption;
}

export class SetOptionModel{
    constructor(options = {}, skipReaction = false) {
        if (!skipReaction) {
            this.initReactions();
        }

        Object.keys(options).forEach(key => {
            if (key in this) {
                this[key] = options[key];
            }
        });

        if (skipReaction) {
            this.initReactions();
        }
    }
    /**
     * 初始化Reactions
     */
    initReactions() {
        this.reactionLoad();
    }
    @observable loc: ServerId = mainDb;
    /** 套装id */
    @observable id: number = 0;
    /** 是否处于查询状态 */
    @observable loading: boolean = false;
    /** 加载失败信息 */
    @observable.ref err: any = null;
    /** 套装属性map（件数:属性） */
    @observable.ref data: SetOptions = null;
    // ------------------- 动作 --------------------
    @action setId(id: number){
        this.err = null;
        this.id = id;
    }
    // ------------------- 响应 --------------------
    /** 响应查询 */
    reactionLoad() {
        let token = 1;
        reaction(
            () => ({
                loc: this.loc,
                id: this.id
            }),
            async params => {
                const myToken = ++token;
                const {loc, id} = params;
                let curItem = this.data;
                let data: SetOptions;

                if (!id || curItem && curItem[Object.keys(curItem)[0]].id === id || this.err) {
                    return;
                }

                // 搜索
                this.loading = true;

                // 缓冲
                await delay();

                // 如果重复执行了，本次取消，类似于debounce？
                if (myToken !== token) {
                    return;
                }
                try {
                    let result = await query.setopt({
                        loc,
                        id: id
                    });
                    if (myToken !== token) {
                        return;
                    }
                    data = result[id];
                } catch (err) {
                    this.err = err;
                    data = null;
                    //this.message = err.message || JSON.stringify(err);
                }
                // 搜索结束
                this.data = data;
                this.loading = false;
            }
        )
    }
}