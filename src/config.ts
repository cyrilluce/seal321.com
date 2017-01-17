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
export type ServerId = "cn" | "tw2" | "tw" | "us";
// 目前这个支持得不好... 据说typescript 2.1.3中会支持
// interface Servers{
//     [key in ServerId]: any;
// }
interface Servers{
    // [key: string]: Tables;
    // cn : Tables;
    tw2 : Tables;
    tw : Tables;
    us : Tables;
}


// 默认数据库
export const mainDb: ServerId = "tw2";

// 服务器列表
export const dbs:Servers = {
    "tw2" : {
        item : 1
    },
    "tw" : {
        item: 1
    },
    // "cn" : {
    //     item : 1,
    //     monster : 1
    // },
    "us" : {
        item : 1
    },
}