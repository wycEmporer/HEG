var webpack = require('webpack');
var pluginsConfig = require('./inherit/plugins.config.js');

pluginsConfig.push(
  new webpack.DefinePlugin({
     'process.env': {NODE_ENV: '"development"'},
     'IS_UAT': process.env.MY_ENV == 'uat' ? true : false
  })
);

pluginsConfig.push(new webpack.HotModuleReplacementPlugin());

module.exports = pluginsConfig;
