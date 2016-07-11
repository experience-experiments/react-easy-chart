/* eslint-env node */
const path = require('path');
var browsers = ['Chrome'];

if (process.env.NODE_ENV === 'test') {
  browsers = ['PhantomJS'];
}

module.exports = (config) => {
  config.set({
    basePath: '.',
    frameworks: ['mocha', 'chai', 'sinon', 'phantomjs-shim', 'es6-shim'],
    files: [
      'node_modules/phantomjs-polyfill/bind-polyfill.js',
      'tests/index.js'
    ],
    preprocessors: {
      'tests/index.js': ['webpack', 'sourcemap']
    },
    webpack: {
      devtool: 'sourcemap',
      resolve: {
        alias: {
          'react-easy-chart': path.join(__dirname, 'modules')
        }
      },
      module: {
        devtool: 'sourcemap',
        loaders: [
          {
            test: /\.js$/,
            loader: 'babel',
            exclude: /node_modules/
          }
        ]
      }
    },
    webpackServer: {
      noInfo: true
    },
    autoWatch: true,
    browsers: browsers,
    singleRun: false,
    reporters: ['spec'], // ['progress'],
    plugins: [
      'karma-chai',
      'karma-chrome-launcher',
      'karma-es6-shim',
      'karma-mocha',
      'karma-phantomjs-launcher',
      'karma-phantomjs-shim',
      'karma-sinon',
      'karma-sourcemap-loader',
      'karma-spec-reporter',
      'karma-webpack'
    ]
  });
};
