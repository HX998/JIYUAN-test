const { defineConfig } = require('@vue/cli-service')
const path = require('path')

module.exports = defineConfig({
  lintOnSave: false,
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      alias: {
        '@portal': path.resolve(__dirname, 'src/portal/'),
        'common': path.resolve(__dirname, 'src/common/'),
        // 如果有其他别名，也可以加在这里
      }
    }
  },
  pluginOptions: {
    mock: { debug: false, disable: process.env.VUE_APP_OPEN_MOCK !== 'true' },
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [
        path.resolve(__dirname, 'inject/_variables.scss')
      ]
    }
  },
  chainWebpack: config => {
    config.devtool(process.env.NODE_ENV === 'production' ? false : 'eval-source-map')
    config.resolve.alias.set('@', path.resolve(__dirname, 'src/portal/'))
  },
  css: {
    loaderOptions: {
      css: {
        url: false  // 完全关闭所有 url() 的模块解析
      }
    }
  },
  devServer: {
    proxy: {
      '.do': {
        target: 'http://20.15.69.7:8080',
        changeOrigin: true
      },
      '/uploadFile': {
        target: 'http://20.15.69.7:8080',
        changeOrigin: true
      }
    }
  }
})
