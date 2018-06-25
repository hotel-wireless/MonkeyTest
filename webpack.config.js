const path = require('path');
const webpack = require('webpack');

const PATHS = {
    client: path.join(__dirname, 'client'),
    build: path.join(__dirname, 'server', 'public')
};

const common = {
    entry: {
        client: PATHS.client,
    },
    output: {
        path: PATHS.build,
        filename: '[name].js'
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loaders: [ 'babel?cacheDirectory' ],
                include: PATHS.client
            },
            {
                test: /\.css$/,
                loaders: [ 'style', 'css' ]
            }
        ]
    },
    debug: true,
    devtool: "#eval-source-map"
};

module.exports = common;
