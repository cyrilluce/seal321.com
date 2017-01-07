import fetch from '../util/fetch';
import {Item} from '../types';

interface ListParam{
    keyword: string;
    offset: number;
    limit: number;
}
interface ListResult{
    list : Item[];
    count: number;
}
/**
 * 查询物品列表
 */
export function list(param: ListParam): Promise<ListResult>{
    return fetch<ListResult>('/node/query/list', param);
}