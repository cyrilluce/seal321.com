/**
 * Created by cyrilluce on 2016/8/7.
 */
export type Table = "item" | "monster" | "setopt" | "craft" | "relation"

/** 玩家总结的是水晶=1PT，但实际上水晶的价值为2 */
export const crystalPoint = 2;

export interface ServerConfig{
    item?: any;
    monster?: any;
    /** 最高制作成功率 */
    maxRate: number;
    /** 匠师技能加成 */
    skillRate: number;
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
        maxRate : 0.9,
        skillRate : 0.3
    },
    "tw" : {
        item: 1,
        maxRate : 1,
        skillRate : 0.25
    },
    "cn" : {
        item : 1,
        maxRate : 1,
        skillRate : 0.25
    },
    "us" : {
        item : 1,
        maxRate : 1,
        skillRate : 0.3
    },
}