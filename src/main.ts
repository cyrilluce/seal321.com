/**
 * Created by cyrilluce on 2016/8/7.
 */
import logger from './logger';
import * as http from 'http';
import * as net from 'net';
import * as fs from 'fs';
import * as Koa from 'koa';
import web from './routers/web';
import deploy from './routers/deploy';
import * as config from './config';

process.on('unhandledrejection', (reason, p)=>{
    logger.error("Unhandled Rejection at: Promise ", p, " reason: ", reason);
    throw reason;
});

process.on('uncaughtException', function(e){
    logger.error(e);
    logger.error(e.stack);
});
// 发布工具
new Koa().use(deploy).listen(config.deployPort, '0.0.0.0', function(){
    logger.info('远程发布服务监听于 ', config.deployPort);
});

// web服务
new Koa().use(web).listen(config.nginxWebPort, '0.0.0.0', ()=>{
    logger.info('Web服务监听于', config.nginxWebPort);
});