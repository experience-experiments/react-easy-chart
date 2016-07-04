/* eslint-env node */
const path = require('path');
var browsers = ['Chrome'];
const isparta = require('isparta');

if (process.env.NODE_ENV === 'test') {
  browsers = ['PhantomJS'];
}

module.exports = (config) => {
  config.set({
    basePath: '.',
    frameworks: ['mocha', 'chai', 'phantomjs-shim', 'es6-shim'],
    files: [
      './tests/index.js'
    ],
    preprocessors: {
      './tests/index.js': ['webpack', 'sourcemap']
    },
    webpack: {
      resolve: {
        alias: {
          'react-easy-chart': path.resolve(__dirname, 'modules/')
        }
      },
      module: {
        preLoaders: [
          {
            test: /\.js$/,
            loader: 'babel',
            exclude: [
              path.resolve(__dirname, 'modules/'),
              path.resolve(__dirname, 'node_modules/')
            ]
          },
          {
            test: /\.js$/,
            include: [
              path.resolve(__dirname, 'modules/')
            ],
            loader: 'isparta'
          }
        ],
        loaders: [
          {
            test: /\.js$/,
            loader: 'babel',
            exclude: /node_modules/
          }
        ]
      },
      devtool: 'inline-source-map'
    },
    webpackServer: {
      noInfo: true
    },
    browsers: browsers,
    singleRun: true,
    reporters: ['progress', 'coverage'],
    coverageReporter: {
      instrumenters: {
        isparta: isparta
      },
      instrumenter: {
        '**/*.js': 'isparta'
      },
      instrumenterOptions: {
        isparta: {
          babel: {
            presets: ['es2015', 'react']
          }
        }
      }
    },
    plugins: [
      require('karma-mocha'),
      require('karma-coverage'),
      require('karma-chai'),
      require('karma-webpack'),
      require('karma-sourcemap-loader'),
      require('karma-chrome-launcher'),
      require('karma-phantomjs-launcher'),
      require('karma-phantomjs-shim'),
      require('karma-es6-shim')
    ]
  });
};
