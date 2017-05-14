import {fetch} from '../../util';
import {Item} from '../../types';
import {Query, Result} from '../../routers/query/howget';

/**
 * 查询物品来源
 */
export function howget(param: Query){
    return fetch<Result>('/node/query/howget', param);
}