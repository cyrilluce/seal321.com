var path = require('path');
module.exports = {
    path : path.resolve(__dirname, '../www/static'),
    publicPath : '/static/',
    resolve : {
        extensions: [
            '',
            '.js',
            '.jsx',
            '.es6',
            '.ts',
            '.tsx',
            '.json'
        ]
    }
};