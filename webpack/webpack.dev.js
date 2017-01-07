/**
 * Created by cluezhang on 2016/8/3.
 */
var path = require('path');

var webpack = require('webpack');

var externals = require('./externals'),
    loaders = require('./loaders'),
    webpackCommonConfig = require('./config');

var publicPath = webpackCommonConfig.publicPath;

module.exports = {
    devtool: 'inline-source-map',
    debug: true,
    resolve : webpackCommonConfig.resolve,
    module : {
        loaders : [
            ...loaders,
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                //include: path.join(__dirname, '../src'),
                loaders: ['react-hot', 'babel']
            },
            {
                test : /\.tsx?$/,
                exclude: /node_modules/,
                //include: path.join(__dirname, '../src'),
                loaders : ['react-hot', 'babel', 'ts']
            }
        ]
    },
    entry : [
        //`webpack-hot-middleware/client?path=http://localhost:${config.localHotLoadPort}`,
        `webpack-hot-middleware/client`, // WebpackDevServer host and port
        // 'webpack/hot/only-dev-server',
        './src/entries/db.ts'
    ],
    output : {
        filename : 'index.js',
        path : webpackCommonConfig.path,
        // publicPath : `http://127.0.0.1:${config.localHotLoadPort}${publicPath}`
        publicPath: publicPath
    },
    plugins : [
        //new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
       // new webpack.optimize.DedupePlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development'),
            "global.IS_BROWSER" : true // webpack仅用于前端代码生成，所以一定是在浏览器端
        })//,
        // new webpack.ProgressPlugin(function(percentage, msg){
        //     console.log(`Processing ${msg}\t ${Math.floor(percentage * 100)}%`);
        // })
    ],
    externals : externals
};
