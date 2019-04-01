let serverId = 'http://192.168.29.11:8080';
module.exports = {
  contentBase: './build/',
  host: 'local.happyeasygo.com',
  port: 8083,
  noInfo: true,
  // inline: true, // 可以监控js变化
  hot: true, // 热启动
  compress: true,
  watchContentBase: false,
  stats: 'errors-only',
  historyApiFallback: {rewrites: [
      {
        from: /^\/flights\/([A-Za-z]{3})-([A-Za-z]{3})\/(20[0-9]{2})-?([0-9]{2})-?([0-9]{2})$/,
        to: '/flights/index.html'
      },
      {
        from: /^\/flights\/([A-Za-z]{3})-([A-Za-z]{3})\/(20[0-9]{2})-?([0-9]{2})-?([0-9]{2})-(20[0-9]{2})-?([0-9]{2})-?([0-9]{2})$/,
        to: '/flights/index.html'
      }
    ]},
  proxy: {
    '/heg_logs': {
      target: serverId,
      changeOrigin: true,
      secure: false
    },
    '/api': {
      target: 'http://web.staging.johnable.net',
      changeOrigin: true,
      secure: false
      //http://web.staging.johnable.net/api/web/pay/
    },
    '/heg_api': {
      target: serverId,
      // target: 'http://192.168.1.11:8080',
      // target: '192.168.1.8:8080',
      // target: 'http://27.115.108.230:9988',
      changeOrigin: true,
      secure: false,
    },
    '/message_api': {
      target: serverId,
      changeOrigin: true,
      secure: false
    },
    '/offer_api': {
      target: serverId,
      changeOrigin: true,
      secure: false
    },
    '/flight_api': {
      target: serverId,
      // target: 'http://192.168.1.155:8090',
      changeOrigin: true,
      secure: false
    },
  }
};
