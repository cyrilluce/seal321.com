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


// 同步密钥
// crypto.pbkdf2Sync('o2p13c8p9sflghw45va', 'megapolis-assistor', 10000, 256).toString('hex')
export const deployKey = new Buffer('7ba2efde31049fc53b75fe514edbf28510908c63097d55cdfa48852ddd26e0bc6d2438dfd8bbb981433cc8ab6ab1531b5641819460f7c16078713a8354db0f9f4d60cbebb6425f0f28e5b6d86876069024d9872fffc1b539b958ce62a82b9e7e2932584c63f6eda286f2867f384c727794f0712c588e9662e5a4600e4149cf1e25c48a18d2e36fb01cadde2bf17b1ba7cf966ba1bc407dd5d2dc214eb755ad15fc3b398718724083304a6ff8c639fd1ff51c1201df4aff09aea6de8b056c7acfde837efba27207d58a9e2936146278143ecd8b26fb8179e01ca7602910a429c81fdd760fcf79d0dd3a94a129dc59185295428e9fbeb4ecd8f412b7012852aff1', 'hex');