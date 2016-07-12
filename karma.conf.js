/* eslint-env node */
const path = require('path');
const isparta = require('isparta');
const processCwd = process.cwd();
const modulesPath = path.resolve(processCwd, 'modules');
const browsers =
  (process.env.NODE_ENV === 'test')
    ? ['PhantomJS']
    : ['Chrome'];

module.exports = (config) => {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: processCwd,


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai', 'sinon', 'phantomjs-shim', 'es6-shim'],


    plugins: [
      'karma-chai',
      'karma-chrome-launcher',
      'karma-coverage',
      'karma-es6-shim',
      'karma-mocha',
      'karma-phantomjs-launcher',
      'karma-phantomjs-shim',
      'karma-sourcemap-loader',
      'karma-spec-reporter',
      'karma-webpack'
    ],


    // list of files / patterns to load in the browser
    files: [
      'node_modules/phantomjs-polyfill/bind-polyfill.js',
      'tests/index.js'
    ],


    // list of files to exclude
    exclude: ['node_modules', 'bower_components'],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'tests/index.js': ['webpack', 'sourcemap']
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['spec', 'coverage'], // , 'progress', 'coverage'],


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: browsers,


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,


    coverageReporter: {
      instrumenters: {
        isparta: isparta
      },
      instrumenter: {
        '**/*.js': 'isparta'
      }
    },


    webpack: {
      devtool: 'sourcemap',
      resolve: {
        alias: {
          'react-easy-chart': modulesPath
        }
      },
      module: {
        devtool: 'sourcemap',
        preLoaders: [
          {
            test: /\.js$/,
            loader: 'babel',
            exclude: [
              modulesPath,
              /node_modules/
            ]
          }, {
            test: /\.js$/,
            include: [
              modulesPath
            ],
            loader: 'isparta',
            exclude: /node_modules/
          }
        ],
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
