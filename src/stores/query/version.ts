import {fetch} from '../../util';
import {Item} from '../../types';
import {Query, Result} from '../../routers/query/version';

/**
 * 查询数据库版本与最后更新时间
 */
export function version(param: Query){
    return fetch<Result>('/node/query/version', param);
}