/**
 * Created by cyrilluce on 2016/8/7.
 */
export type Table = "item" | "monster" | "setopt"

export interface Tables{
    item?: any;
    monster?: any;
}
// export enum ServerId{
//     cn,
//     tw2,
//     us
// }
export type ServerId = "cn" | "tw2" | "us";
// 目前这个支持得不好... 据说typescript 2.1.3中会支持
// interface Servers{
//     [key in ServerId]: any;
// }
interface Servers{
    // [key: string]: Tables;
    cn : Tables;
    tw2 : Tables;
    us : Tables;
}


// 默认数据库
export const mainDb: ServerId = "tw2";

// 服务器列表
export const dbs:Servers = {
    "cn" : {
        item : 1,
        monster : 1
    },
    "us" : {
        item : 1
    },
    "tw2" : {
        item : 1
    }
}

export * from './localConfig';
export * from './securityConfig';