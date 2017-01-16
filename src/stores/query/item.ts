import { fetch, delay } from '../../util';
import { Item } from '../../types';
import { Query, Result } from '../../routers/query/item';

/**
 * 查询物品列表
 * 添加缓存机制？
 * 以及合并查询机制
 */



let queue = [];
let waiting, fetching;
export async function item(param: Query) {
    let ids: number[] = [].concat(param.id);
    const loc = param.loc;
    let delayTask = delay(global.IS_BROWSER ? 100 : 0);

    queue.push(...ids);

    // 如果正在请求，等上次的完成
    if (fetching) {
        await fetching;
    }
    // 如果是空闲状态了，进入等待
    if (!waiting) {
        waiting = delayTask;
        await waiting;
        waiting = null;
    }else{ // 如果别人已经先排好队了，坐等开车
        await waiting;
    }
    

    let map;
    // 等待结束后，开始查询，其它人没查，就自己开车
    if (!fetching) {
        fetching = fetch<Result>('/node/query/item', {
            loc,
            id: queue
        });
        queue = [];
        map = await fetching;
        fetching = null;
    }else{
        // 如果别人已经开始查询了，坐等快递
        map = await fetching;
    }

    return map;
}