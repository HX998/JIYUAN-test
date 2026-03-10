<template>
  <section class="app-main" id="appMain">
    <keep-alive  :include="needKeepAlive" :max="limit">
      <router-view v-if="$route.meta.isKeepAlive" ref="$route.meta.path"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.isKeepAlive" :key="key"></router-view>
  </section>
</template>
<script>
  import { mapGetters } from 'vuex'
  import { on, off } from "@/api/bizApi/commonUtil";

  export default {
    name: 'AppMain',
    data () {
      return {
        limit: window.LOCAL_CONFIG.TABS_VIEW_LIMIT,
      }
    },
    computed: {
      ...mapGetters([
        'needKeepAliveList',
      ]),
      needKeepAlive () {
        return this.needKeepAliveList.join(',')
      },
      key () {
        return this.$route.name !== undefined ? this.$route.name + new Date() : this.$route + new Date()
      }
    },
    watch: {
      needKeepAlive (val, old) {
        if (val.length < old.length) {
          if(window.sessionStorage.getItem("isTransfer") === "0") {
            this.$hMsgBox.remove();
          }
          let delArr = val.length > 0 ? old.substring(val.length + 1, old.length).split(',') :  old.substring(val.length, old.length).split(',')
          if (delArr && delArr.length && this.$children && this.$children.length > 0 && this.$children[0] && this.$children[0].$vnode.parent.componentInstance && this.$children[0].$vnode.parent.componentInstance.cache) {
            let cache = this.$children[0].$vnode.parent.componentInstance.cache
            let keys = this.$children[0].$vnode.parent.componentInstance.keys
            delArr.forEach(item => {
              this.$children.some((child, index) => {
                if (child && child.$options.name == item) {
                  let key = child.$vnode.key == null ? child.$vnode.componentOptions.Ctor.cid + (child.$vnode.componentOptions.tag ? `::${child.$vnode.componentOptions.tag}` : '') : child.$vnode.key
                  if (cache[key]) {
                    if (keys.length) {
                      let index = keys.indexOf(key)
                      if (index > -1) {
                        keys.splice(index, 1)
                      }
                    }
                    delete cache[key]
                  }
                  this.$children[index] = null
                  child = null
                }
              })
            })
            cache = keys = null
          }
          delArr = null
        } else {
          this.$nextTick(() => {
            if(this.$el.children && this.$el.children.length > 0 && !this.$el.querySelector("#mainIndex")) {
              this.$el.children[0].style.minHeight = (window.innerHeight - this.$el.offsetTop) + "px";
            }
          });
        }
      },
      "$route": {
        handler(val, old) {
          if (Object.keys(val.query).length > 0 && !!val.query.isNeedKeepAlive) {//通过bbsp对接登录
            let curMenu = {
              title: val.meta.title,
              id: val.meta.findId,
              parentId: val.meta.parentId,
              path: val.meta.path
            };
            window.sessionStorage.setItem("curMenu", JSON.stringify(curMenu));
            setTimeout(() => {
              if (window.document.getElementById("appMain") != null) {
                window.document.getElementById("appMain").style.visibility = "";
              }
            }, 200);
          }
          this.$nextTick(() => {
            if(this.$el.children && this.$el.children.length > 0 && !this.$el.querySelector("#mainIndex")) {
              this.$el.children[0].style.minHeight = (window.innerHeight - this.$el.offsetTop) + "px";
            }
          });
        },
        deep: true,
        immediate: true
      }
    },
    methods: {
      handleResize() {
        if(this.$el.children && this.$el.children.length > 0) {
          this.$el.children[0].style.minHeight = (window.innerHeight - this.$el.offsetTop) + "px";
        }
      }
    },
    mounted() {
      on(window, "resize", this.handleResize);
    },
    beforeDestroy() {
      off(window, "resize", this.handleResize);
    }
  }
</script>
