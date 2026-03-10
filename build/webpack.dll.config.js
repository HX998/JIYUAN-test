const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

let vendors = [
  ['moment'],
  [
    'vue/dist/vue.esm.js',
    'vue-router',
    'vuex',
    'js-cookie',
    'vue-i18n',
  ],
  // 其他注释掉的 vendor 可以按需打开
];

module.exports = {
  mode: 'production',

  entry: {
    vendor0: vendors[0],
    vendor1: vendors[1],
    // vendor2: vendors[2],
    // ...
  },

  output: {
    path: path.join(__dirname, '../static/dll'),
    filename: '[name].[contenthash:8].dll.js',  // 这个可以保留 contenthash，用于文件缓存
    library: '[name]',                          // 必须是 '[name]' 或固定字符串，不能带 contenthash
    libraryTarget: 'var',
  },

  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, '../dllManifest', '[name]-manifest.json'),
      name: '[name]',                           // 关键：改成 '[name]'，Webpack 5 只支持这个 + [fullhash]
      context: path.resolve(__dirname, '../'),
    }),
  ],

  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          compress: {
            warnings: false,
            drop_console: true,  // 生产环境去掉 console，可选
          },
        },
      }),
    ],
  },
};
