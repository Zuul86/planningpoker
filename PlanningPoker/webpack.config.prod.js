import * as devConfig from './webpack.config.dev';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

const GLOBALS = {
    'process.env.NODE_ENV': JSON.stringify('production')
};

const config = devConfig.default;

config.devtool = 'source-map';
config.entry.splice(0, 2);
config.output.publicPath = '/dist/';
config.devServer.contentBase = './dist';
config.plugins = [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin(GLOBALS),
    new ExtractTextPlugin('styles.css'),
    new webpack.optimize.UglifyJsPlugin({ sourceMap: true })
];

delete config.module.rules[2].loaders;
config.module.rules[2].use= ExtractTextPlugin.extract({
          fallback: "style-loader?sourceMap",
          use: "css-loader?sourceMap"
        });

export default devConfig;