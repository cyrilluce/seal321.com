/**
 *
 * Created by cyrilluce on 2016/8/8.
 */
import reactRouter from './react';
import Koa from "koa";
import {koaLogger} from "./util";
import * as favicon from "koa-favicon";
import * as serve from "koa-static";
import * as Router from "koa-router";
import * as compose from "koa-compose";
import * as compress from "koa-compress";
import * as bodyParser from "koa-bodyparser";
import * as path from 'path';
import * as fs from 'fs';
import * as config from '../config';
import logger from '../logger';
import * as cookieParser from 'cookie-parser';
import query from './query';
import react from './react';

let router = new Router();

// 本地调试
let webpack = async(ctx, next)=>{
    return next();
};
if(process.env.NODE_ENV === 'development'){
    webpack = require('./webpack').default;
}

let debug = (str)=> async (ctx, next)=>{
    console.log(str, 'start', ctx.respond);
    await next();
    console.log(str, 'end', ctx.respond);
}

router.use(bodyParser());
router.use('/node/query', query);
router.get(['/', '/:loc', '/:loc/db'], react);
router.get('(.*)', serve(path.join(__dirname, '../../www')), {
    maxage : 7 * 24 * 60 * 60 * 1000
});

export default compose([
    webpack,
    koaLogger(logger),
    compress(),
    favicon(path.join(__dirname, '../../www/favicon.ico')),
    router.routes()
])