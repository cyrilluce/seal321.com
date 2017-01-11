import * as compose from 'koa-compose';
import * as koaConnect from 'koa2-connect';
import logger from '../logger';

let webpack = require('webpack');
let webpackConfig = require('../../webpack/webpack.dev');
let compiler = webpack(webpackConfig);

logger.info('热替换功能启用');

let devMiddleware = require("webpack-dev-middleware")(compiler, {
    //noInfo: true,
    publicPath: webpackConfig.output.publicPath,
    //quite : true
});

let hmrMiddleware = require("webpack-hot-middleware")(compiler);

export default compose([
    koaConnect(devMiddleware),
    koaConnect(hmrMiddleware)
]);