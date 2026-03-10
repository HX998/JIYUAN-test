// portal/config.js 或 mf.config.js
const { defineConfig } = require('@era/mf');

module.exports = defineConfig({
  name: 'portal',

  // 全局 shared，强烈建议写在这里
  autoShareDependencies: false,
  shared: {
    vue: {
      singleton: true,
      requiredVersion: '^2.6.14',
      eager: false,
      import: 'vue/dist/vue.esm.js'           // host 加 eager
    },
    'vue-router': {
      singleton: true,
      requiredVersion: '^3.5.1',
      eager: false,
    },
    vuex: {
      singleton: true,
      requiredVersion: '^3.6.2',
      eager: false,
    },
  },

  // 必须有 modules 字段
  modules: {
    innermanage: {
      path: '../modules/innermanage',  // 调整为你的实际相对路径
      // 可选：在这里覆盖 remote 的 shared（版本必须一致）
      // shared: { vue: { ... } }
    }
  }
});
