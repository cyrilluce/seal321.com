module.exports = [
     {
        test : /\.tpl$/,
        loader : 'raw-loader'
    },
    {
        test : /\.css$/,
        loader : 'style-loader!css-loader'
    },
    {
        test : /\.pug$/,
        loader : 'pug-loader'
    },
    {
        test : /\.json$/,
        loader : 'json-loader'
    }
];