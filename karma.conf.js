/* eslint-env node */
const path = require('path');
var browsers = ['Chrome'];

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
    browsers: browsers,
    singleRun: true,
    reporters: ['progress'],
    plugins: [
      require('karma-mocha'),
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
