/**
 *
 * Created by cyrilluce on 2016/8/8.
 */
import reactRouter from './react';
import * as express from 'express';
import * as path from 'path';
import * as fs from 'fs';
import * as config from '../config';
import logger from '../logger';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import query from './query';


let app = express(),
    nodeRouter = express.Router();

// 本地调试
if(process.env.NODE_ENV === 'development'){
    let webpack = require('webpack');
    let webpackConfig = require('../../webpack/webpack.dev');
    let compiler = webpack(webpackConfig);

    app.use(require("webpack-dev-middleware")(compiler, {
        //noInfo: true,
        publicPath: webpackConfig.output.publicPath,
        //quite : true
    }));

    app.use(require("webpack-hot-middleware")(compiler));
    logger.info('热替换功能启用');

    // app.use('/', express.static(path.resolve(__dirname, '../www/')))
    // app.use('/static/', express.static(path.resolve(__dirname, '../www/static/')))

    // app.listen(config.localHotLoadPort, 'localhost', function (err, result) {
    //     if (err) {
    //         return logger.error(err);
    //     }

    //     logger.info(`Listening at http://localhost:${config.localHotLoadPort}/`);
    // });
}


app.set('view engine', 'pug');
app.set('views', __dirname+'/../views');

app.use(compression());
app.enable('trust proxy');


// // ------------ 数据库后台 TODO 低优先吧。。。 预备全新改写
nodeRouter.use(cookieParser());
nodeRouter.use(bodyParser.urlencoded({ extended: true, limit: '20mb' }));
nodeRouter.use(bodyParser.json({limit: '20mb'}));
//
// const ENCRYPT_A = 12345;
// const ENCRYPT_B = 15881;
// const ENCRYPT_C = 0x64fb;
// const ENCRYPT_D = 0x1bb0;
// const ENCRYPT_M = 0x7FFF;
// const ENCRYPT_O = 4179;
// function decryptId(id){
//     return ( ( ((id + ENCRYPT_O ) ^ ENCRYPT_D )*ENCRYPT_B ) ^ ENCRYPT_C) & ENCRYPT_M;
// }
// function encryptId(id){
//     return ( ( ( (id ^ ENCRYPT_C )*ENCRYPT_A ) ^ ENCRYPT_D) - ENCRYPT_O) & ENCRYPT_M;
// }
//
// nodeRouter.use(function(req, res, next){
//     let start = Date.now();
//     let serverId = req.query.loc;
//     let actions = {
//         getItemById : ()=>{},
//         getItemsByName : ()=>{
//
//         },
//         getSetOptionById : ()=>{},
//         getMonsterById : ()=>{},
//         getDropFromById : ()=>{}
//     }
// });

// nodeRouter.use('/query/list', function(req, res){
//     res.json({
//         success : true,
//         data : {
//             list : [
//                 {
//                     name : 'test'
//                 }
//             ],
//             totalCount : 100
//         }
//     });
// })

nodeRouter.use('/query', query);

// cgi请求
app.use('/node', nodeRouter);

// 静态文件
// if(process.env.NODE_ENV === 'production'){
    app.use('/', express['static'](path.join(__dirname, '../../www')));
// }

// 单页应用，只有一个入口....
app.use('/', reactRouter);

app.use(function(err, req, res, next) {
    logger.error(err, err.stack);
});

export default app;