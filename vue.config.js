const AutoImport = require('unplugin-auto-import/webpack');
const Components = require('unplugin-vue-components/webpack');
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers');

module.exports = {
  // 按需自动引入ElementPlus
  configureWebpack: {
    plugins: [
      AutoImport({
        resolvers: [ElementPlusResolver()]
      }),
      Components({
        resolvers: [ElementPlusResolver()]
      })
    ]
  },
  chainWebpack: (config) => {
    config.plugin('html').tap((args) => {
      args[0].title = '物流管理系统';
      return args;
    });
    config.plugin('define').tap((args) => {
      args[0]['process.env'].VERSION = (function () {
        const now = new Date();
        return (
          now.getFullYear() +
          format(now.getMonth() + 1) +
          format(now.getDate()) +
          format(now.getHours()) +
          format(now.getMinutes())
        );
      })();
      return args;
    });
  },
  //配置代理
  devServer: {
    proxy: {
      '/api': {
        target: 'http://lis.test.heymenology.cn/api/',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        },
        cookieDomainRewrite: {
          '.test.heymenology.cn': 'localhost'
        }
      }
    }
  }
};

const format = (num) => {
  return num < 10 ? `0${num}` : `${num}`;
};
