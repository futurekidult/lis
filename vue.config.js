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
  },
  //配置代理
  devServer: {
    proxy: {
      '/api': {
        target:
          'https://8ff8dda4-13ca-499d-bfad-64024f50a527.mock.pstmn.io/api/',
        // target: 'http://lis.test.heymenology.cn/api/',
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
