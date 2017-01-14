import {fetch} from '../../util';
import {Item} from '../../types';
import {Query, Result} from '../../routers/query/setopt';

/**
 * 查询物品列表
 */
export function setopt(param: Query){
    return fetch<Result>('/node/query/setopt', param);
}