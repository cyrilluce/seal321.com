import {fetch} from '../../util';
import {Item} from '../../types';
import {Query, Result} from '../../routers/query/item';

/**
 * 查询物品列表
 * 添加缓存机制？
 */
// const cache = {};
export async function item(param: Query){
    // // 如果是浏览器端，做个缓存？ 日后再说吧。。。懒了
    // if(global.IS_BROWSER){

    // }
    return fetch<Result>('/node/query/item', param);
}