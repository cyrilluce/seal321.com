/**
 * Created by cyrilluce on 2016/8/7.
 */
import logger from './logger';
import * as http from 'http';
import * as net from 'net';
import * as fs from 'fs';
import app from './routers/web';
import * as config from './config';

process.on('unhandledrejection', (reason, p)=>{
    logger.error("Unhandled Rejection at: Promise ", p, " reason: ", reason);
    throw reason;
});

// process.on('uncaughtException', function(e){
//     logger.error(e);
//     logger.error(e.stack);
// });
// 发布工具
let deployRouter = require('./routers/deploy');

http.createServer(deployRouter).listen(config.deployPort, '0.0.0.0', function(){
    logger.info('远程发布服务监听于 ', config.deployPort);
});

app.listen(config.nginxWebPort, '0.0.0.0', ()=>{
    logger.info('Web服务监听于', config.nginxWebPort);
});

export default app;