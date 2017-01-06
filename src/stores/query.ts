import fetch from '../util/fetch';
interface ListParam{
    keyword: string;
    page: number;
    size: number;
}
interface ListResult{
    list : Item[];
    count: number;
}
/**
 * 查询物品列表
 */
export async function list(param: ListParam): Promise<ListResult>{
    return fetch<ListResult>('/node/query/list', param);
}