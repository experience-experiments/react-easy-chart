/*eslint-disable*/
var fs = require('fs');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var path = require('path');
var webpack = require('webpack');

module.exports = {
  cache: true,
  debug: true,

  entry: fs.readdirSync(__dirname).reduce(function (entries, dir) {
    if (fs.statSync(path.join(__dirname, dir)).isDirectory() && dir !== 'images') {
      entries[dir] = path.join(__dirname, dir, 'app.js');
    }
    return entries
  }, {}),

  output: {
    path: path.resolve(__dirname, '..', 'lib'),
    filename: '[name].js'
  },

  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel' }
    ]
  },

  resolve: {
    alias: {
      'react-easy-chart': path.join(__dirname, '../../', 'modules')
    }
  },

  plugins: [
    new CopyWebpackPlugin([{
      from: path.join(__dirname, '/root-styles.css'),
      to: path.resolve(__dirname, '..', '/root-styles.css')
    },{
      from: path.join(__dirname, 'images'),
      to: path.resolve(__dirname, '..', '/images')
    }]),
    new webpack.NoErrorsPlugin(),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.DefinePlugin({
      'process.env': {
        // This has effect on the react lib size
        'NODE_ENV': JSON.stringify('production'),
      }
    }),
    new webpack.optimize.UglifyJsPlugin({minimize: true}),
    new webpack.optimize.CommonsChunkPlugin('shared_commons.js')
  ]


}
