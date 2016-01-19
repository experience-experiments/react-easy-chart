/* eslint-env node */
const path = require('path');

module.exports = (config) => {
  config.set({
    basePath: '.',
    frameworks: ['mocha', 'chai', 'phantomjs-shim'],
    files: [
      './tests/index.js'
    ],
    preprocessors: {
      './tests/index.js': ['webpack', 'sourcemap']
    },
    webpack: {
      resolve: {
        alias: {
          'react-easy-chart': path.join(__dirname, 'modules')
        }
      },
      module: {
        loaders: [
          { test: /\.js$/, loader: 'babel', exclude: /node_modules/ }
        ]
      },
      devtool: 'inline-source-map'
    },
    webpackServer: {
      noInfo: true
    },
    browsers: ['Chrome'],
    singleRun: false,
    reporters: ['progress'],
    plugins: [
      require('karma-mocha'),
      require('karma-chai'),
      require('karma-webpack'),
      require('karma-sourcemap-loader'),
      require('karma-chrome-launcher'),
      require('karma-phantomjs-shim')
    ]
  });
};
