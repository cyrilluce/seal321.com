module.exports = [
     {
        test : /\.tpl$/,
        use : 'raw-loader'
    },
    {
        test : /\.css$/,
        use : 'style-loader!css-loader'
    },
    {
        test : /\.pug$/,
        use : 'pug-loader'
    },
    {
        test : /\.json$/,
        use : 'json-loader'
    }
];