// 自行复制到localConfig.ts，并进行配置
// 服务端需要上传同样的配置，才能正常通信

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
// MySQL配置
export const mysql: MySQLConfig = {
    host : 'localhost',
    user : 'root',
    password : '123456',
    database : 'seal-v2'
}
/** 更新包监控等，工作目录 */
export const sampleDir: string = "D:\\seal-samples";

/** oauth接入 */
export const grantConfig = {
    "server": {
        "protocol": "https",
        "host": "beta.seal321.com",
        "transport": "session",
        "state": true
    }
};