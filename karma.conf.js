/* eslint-env node */
const path = require('path');

module.exports = (config) => {
  config.set({
    basePath: '.',
    browsers: ['PhantomJS'],
    files: [
      './tests/index.js'
    ],
    port: 9000,
    captureTimeout: 60000,
    frameworks: ['mocha', 'chai'],
    singleRun: true,
    reporters: ['progress'],
    preprocessors: {
      './tests/index.js': ['webpack', 'sourcemap']
    },
    webpack: {
      resolve: {
        alias: {
          'rc-d3': path.join(__dirname, 'modules')
        }
      },
      module: {
        loaders: [
          { test: /\.js$/, loader: 'babel', include: [path.join(__dirname, 'modules'), path.join(__dirname, 'tests')]}
        ]
      },
      devtool: 'inline-source-map'
    },
    webpackServer: {
      noInfo: true
    },
    plugins: [
      require('karma-mocha'),
      require('karma-chai'),
      require('karma-webpack'),
      require('karma-sourcemap-loader'),
      require('karma-phantomjs-launcher')
    ]
  });
};
