import {fetch} from '../../util';
import {Item} from '../../types';
import {Query, Result} from '../../routers/query/list';

/**
 * 查询物品列表
 */
export function list(param: Query){
    return fetch<Result>('/node/query/list', param);
}