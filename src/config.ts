/**
 * Created by cyrilluce on 2016/8/7.
 */
export type Table = "item" | "monster" | "setopt" | "craft"

export interface ServerConfig{
    item?: any;
    monster?: any;
    /** 最高制作成功率 */
    maxRate: number;
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
    cn : ServerConfig;
    tw2 : ServerConfig;
    tw : ServerConfig;
    us : ServerConfig;
}


// 默认数据库
export const mainDb: ServerId = "tw2";

// 服务器列表
export const dbs:Servers = {
    "tw2" : {
        item : 1,
        maxRate : 0.9
    },
    "tw" : {
        item: 1,
        maxRate : 1
    },
    "cn" : {
        item : 1,
        maxRate : 1
    },
    "us" : {
        item : 1,
        maxRate : 1
    },
}