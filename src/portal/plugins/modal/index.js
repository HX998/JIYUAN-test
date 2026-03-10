import Vue from 'vue'
import mainVue from './main.vue'


const Box = Vue.extend(mainVue)

export default {
  open(name, id, options = {}) {
    const defaultOptions = {}
    options = Object.assign({}, defaultOptions, options)
    return new Promise((resolve) => {
      const box = new Box({
        el: document.createElement('div'),
        components: {
          /*HDialogBody:  import('@/views/bizViews' + name + '.vue').then((components) => {
            components.default._Ctor = {}
            // const dialogOptions = components.default.data().dialogOptions || {}
            if (!components.default.attached) {
              components.default.backupCreated = components.default.created
              components.default.backupMounted = components.default.mounted
            }

            components.default.created = function() {
              // 子组件已经实例化完毕
              if (components.default.backupCreated) {
                components.default.backupCreated.call(this)
              }
            }

            components.default.mounted = function() {
              if (components.default.backupMounted) {
                components.default.backupMounted.call(this)
              }
            }

            box.loading = true

            box.title = id

            components.default.attached = true

            return components
          })*/
        }
      })

      box.$on('action', function(button) {
        const instance = this.$refs.body

        if (!instance) {
          return
        }

        if (!instance.dialogClickButton) {
          box.close()
          setTimeout(() => {
            box.$destroy()
          },1000)
          

          resolve('close')

          return
        }

        const result = instance.dialogClickButton(button)

        if (result && result.then) {
          result.then((result) => {
            if (result === true || typeof result === 'undefined') {
              box.close()
              box.$destroy()

              resolve(button)
            }
          })
        }
        else {
          if (result === true || typeof result === 'undefined') {
            box.close()
            box.$destroy()

            resolve(button)
          }
        }
      })

      box.$on('onMaximize', function(button) {
        const instance = this.$refs.body

        if (!instance) {
          return
        }
        if (typeof instance.onMaximize === "function") {
          instance.onMaximize();
        }
      })

      box.loading = false
      box.title = '正在加载...'
      box.open(options.width, options.height)
    })
  }
}
