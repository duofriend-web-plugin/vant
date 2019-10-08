const path = require('path');
const merge = require('webpack-merge');
const config = require('./webpack.site.dev');

module.exports = merge(config, {
  mode: 'production',
  output: {
    path: path.join(__dirname, '../../web-tools/docker/dist/static/vant'),
    publicPath: '/static/vant/',
    filename: '[name].[hash:8].js',
    chunkFilename: 'async_[name].[chunkhash:8].js'
  }
});
