const { defineConfig } = require('@vue/cli-service')
const path = require('path')

module.exports = defineConfig({
  lintOnSave: false,
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      alias: {
        // '@': path.resolve(__dirname, 'src/portal/'),
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
        // allow url() references to be processed by webpack so background images
        // written in global styles (e.g. frame_login.scss) are correctly
        // resolved. 以前为了避免某些 URL 被处理关闭了这个选项，导致
        // 登录选项图标的背景图路径保持为 "~@/assets/..."，浏览器无法
        // 访问，从而图标不显示。
        url: true
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
