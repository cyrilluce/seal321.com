import {fetch} from '../../util';
import {Item} from '../../types';
import {Query, Result} from '../../routers/query/craft';

/**
 * 查询制作书
 */
export function craft(param: Query){
    return fetch<Result>('/node/query/craft', param);
}