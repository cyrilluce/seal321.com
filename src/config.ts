/**
 * Created by cyrilluce on 2016/8/7.
 */
export type Table = "item" | "monster"

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

interface MySQLConfig{
    host: string;
    user: string;
    password: string;
    database: string;
}

// 本地开发，动态加载端口
export const localHotLoadPort = 3000;
// 远端服务器地址
export const deployServer = "beta.seal321.com";
// 远端服务器 发布管理端口
export const deployPort = 7001;
// 远端服务器 web服务端口
export const nginxWebPort = 80;
// 默认数据库
export const mainDb: ServerId = "tw2";
// MySQL配置
export const mysql: MySQLConfig = {
    host : 'localhost',
    user : 'root',
    password : '123456',
    database : 'seal-v2'
}
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