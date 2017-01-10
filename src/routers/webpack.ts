import * as compose from 'koa-compose';
import { koaConnect } from './util';
import logger from '../logger';

let webpack = require('webpack');
let webpackConfig = require('../../webpack/webpack.dev');
let compiler = webpack(webpackConfig);

logger.info('热替换功能启用');

export default compose([
    koaConnect(require("webpack-dev-middleware")(compiler, {
        //noInfo: true,
        publicPath: webpackConfig.output.publicPath,
        //quite : true
    })),
    koaConnect(require("webpack-hot-middleware")(compiler))
]);