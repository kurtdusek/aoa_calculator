var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

var BUILD_DIR = path.resolve(__dirname, 'src/client/public');
var APP_DIR = path.resolve(__dirname, 'src');

var config = {
    entry: APP_DIR + '/server/index.js',
    output: {
        path: APP_DIR,
        filename: 'server/server.js'
    },
    watch: true,
    node: {
        __dirname: false
    },
    target: "node",
    module : {
        rules: [
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
        ],
        loaders : [
            {
                test : /\.js?/,
                include : APP_DIR,
                loader : 'babel-loader'
            }
        ]
    }
};

module.exports = config;