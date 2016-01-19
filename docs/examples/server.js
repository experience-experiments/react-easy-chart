/*eslint-disable*/
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.config');
const open = require('open');
const port = 8080;

const app = new WebpackDevServer(webpack(config), {
  publicPath: '/__build__/',
  contentBase: 'examples/',
  stats: {
    colors: true
  }
});

app.listen(port, 'localhost', function(err) {
    if (err) {
      console.log(err);
    }
    console.log('Listening at localhost:' + port);
    console.log('Opening your system browser...');
    open('http://localhost:' + port + '/webpack-dev-server/');
  });
