const { defineConfig } = require('@era/mf')

module.exports = defineConfig({
  autoShareDependencies: false,
  ignoreShareDependencies: [
    'vue',
    'vue-router',
    'vuex'
  ],
  shared: {
    'vue': {
      singleton: true,
      requiredVersion: '^2.6.14',
      import: 'vue/dist/vue.esm.js',
      eager: false,
    },
    'vue-router': {
      singleton: true,
      requiredVersion: '^3.5.1',
      eager: false,
    },
    vuex: {
      singleton: true,
      requiredVersion: '^3.6.2',
      eager: false
    }
  },
  singleton: [],
  commonExposesDirs: [
    'utils',
    'components',
    'decorators',
    'custom'
  ],
  modules: {
    portal: 'innermanage',
    systemManage: {
      name: 'systemManage',
      title: '系统管理'
    }
  },
  configCli: require('@era/vue-cli')
})
