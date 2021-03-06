import merge from 'webpack-merge';
import common from './webpack.config.common.babel';
import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CleanWebpackPlugin from 'clean-webpack-plugin';

const devConfig = merge(common,
    {
        entry: [
            'webpack-hot-middleware/client?reyload=true',
            'react-hot-loader/patch'
        ],
        mode: 'development',
        devtool: 'inline-source-map',
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new webpack.DefinePlugin({
                DEVELOPMENT: JSON.stringify(true),
                DEV_CORRECTION: JSON.stringify({lat:0, lon: 0})
            })
        ]
    }
);


module.exports = devConfig;