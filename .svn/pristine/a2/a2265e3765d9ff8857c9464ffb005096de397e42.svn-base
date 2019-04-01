var dirVars = require('./base/dir-vars.config.js');
const moduleConfig = require('./inherit/module.config.js');
moduleConfig.rules.push({
  test: /\.css$/,
  exclude: /node_modules|bootstrap/,
  // loader: 'style!css?minimize&-autoprefixer!postcss',
  use: [
    {
      loader: 'style-loader',
    },
    {
      loader: 'css-loader',
      // options: {
      //   minimize: true,
      //   '-autoprefixer': true,
      // },
    },
    // {
    //   loader: 'postcss-loader',
    // },
  ],
});

moduleConfig.rules.push({
  test: /\.css$/,
  include: /bootstrap/,
  // loader: 'style!css',
  use: [
    'style-loader', 'css-loader',
  ],
});

moduleConfig.rules.push({
  test: /\.less$/,
  include: dirVars.srcRootDir,
  // loader: 'style!css?minimize&-autoprefixer!postcss!less',
  use: [
    {
      loader: 'style-loader',
    },
    {
      loader: 'css-loader',
      // options: {
      //   minimize: true,
      //   '-autoprefixer': true,
      // },
    },
    // {
    //   loader: 'postcss-loader',
    // },
    {
      loader: 'less-loader',
    },
  ],
});
module.exports = moduleConfig;