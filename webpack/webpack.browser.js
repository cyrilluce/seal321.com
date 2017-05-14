/**
 * Created by cluezhang on 2016/8/3.
 */
var path = require('path');

var webpack = require('webpack');

var externals = require('./externals'),
    rules = require('./rules'),
    webpackCommonConfig = require('./config');

var publicPath = webpackCommonConfig.publicPath;

var Visualizer = require('webpack-visualizer-plugin');

module.exports = {
    resolve: webpackCommonConfig.resolve,
    module: {
        rules: [
            ...rules,
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader', 
                    {
                        loader : 'ts-loader',
                        // options : {
                        //     configFileName : 'tsconfig.2015.json'
                        // }
                    }
                ]
            }
        ]
    },
    entry: [
        // `webpack-hot-middleware/client?path=http://localhost:${config.localHotLoadPort}`, // WebpackDevServer host and port
        './src/entries/db'
    ],
    output: {
        filename: 'index.js',
        path: webpackCommonConfig.path,
        // publicPath : `http://127.0.0.1:${config.localHotLoadPort}${publicPath}`
        publicPath: publicPath
    },
    plugins: [
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
            "global.IS_BROWSER": true // webpack仅用于前端代码生成，所以一定是在浏览器端
        }),
        new webpack.optimize.UglifyJsPlugin({
            // compress: {
            //     warnings: true
            // },
            // output: {
            //     comments: false
            // },
            sourceMap: false
        }),
        new Visualizer({
            filename: './statistics.html'
        })
    ],
    externals: externals
};
