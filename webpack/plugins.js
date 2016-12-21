var webpack = require('webpack');
module.exports = [
    new webpack.optimize.CommonsChunkPlugin('common', 'common.js'),
    new webpack.DefinePlugin({
        'process.env':{
            'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        },
        "global.IS_BROWSER" : true // webpack仅用于前端代码生成，所以一定是在浏览器端
    })
];