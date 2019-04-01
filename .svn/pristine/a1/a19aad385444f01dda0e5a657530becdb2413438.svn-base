var dirVars = require('../base/dir-vars.config.js');
var eslintFormatter = require('eslint-friendly-formatter');

module.exports = {
  rules: [
    {
      test: /\.js$/,
      enforce: 'pre',
      loader: 'eslint-loader',
      include: dirVars.srcRootDir,
      exclude: /bootstrap/,
      options: {
        formatter: eslintFormatter,
        fix: true,
      }
    },
    {
      test: /\.js$/,
      include: dirVars.srcRootDir,
      loader: 'babel-loader',
      options: {
        presets: ['env'],
        cacheDirectory: true,
        compact: 'false',
        plugins: ['transform-runtime', 'syntax-dynamic-import'],
      }
    },
    {
      test: /\.html$/,
      include: dirVars.srcRootDir,
      loader: 'html-loader',
    },
    {
      test: /\.ejs$/,
      include: dirVars.srcRootDir,
      loader: 'ejs-loader',
    },
    {
      test: /\.(png|jpg|gif)$/,
      include: dirVars.srcRootDir,
      // loader: 'url-loader?limit=8192&name=./static/img/[hash].[ext]',
      loader: 'file-loader',
      options: {
        // limit: 8192,
        name: './static/img/[hash].[ext]',
      },
    },
    // {
    //   // 专供bootstrap方案使用的，忽略bootstrap自带的字体文件
    //   test: /\.(woff|woff2|svg|eot|ttf|otf)$/,
    //   include: /glyphicons/,
    //   loader: 'null-loader',
    // },
    {
      // 专供iconfont方案使用的，后面会带一串时间戳，需要特别匹配到
      test: /\.(woff|woff2|svg|eot|ttf|otf)\??.*$/,
      include: dirVars.srcRootDir,
      // exclude: /glyphicons/,
      // loader: 'file-loader?name=static/fonts/[name].[ext]',
      loader: 'file-loader',
      options: {
        name: 'static/fonts/[name].[hash].[ext]',
      },
    },
  ]
};