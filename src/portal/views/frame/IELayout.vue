<template>
	<div class="app-wrapper" :class="{hideSidebar : !sidebar.opened}">
    <!-- 页面顶部 -->
    <div class="h-topbar-wrapper" >
      <topbar ></topbar>
    </div>
    <div class="main-wrapper" :class="{hideSidebar : !sidebar.opened}">
      <!--最左侧固定菜单栏-->
      <!-- <fixed-sidebar></fixed-sidebar> -->
      <div class="h-modal-mask-top" style="z-index: 1000;" :class="{'none': !openMask}"></div>
      <div class="h-modal-mask-left" style="z-index: 1000;" :class="{'none': !openMask}"></div>
      <!-- 侧边栏 -->
      <sidebar class="h-sidebar-wrapper"></sidebar>  
      <!-- 中间区域 -->
      <div class="main-container">
        <!-- 面包屑导航栏 -->
        <navbar></navbar>
        <!-- 内容 -->
        <section class="app-main frame" id="appMain">
          <template v-if="isIE">
            <div v-for="(item, index) in iframeList" v-show="item.isActive" :id="'id' + item.id">
              <!--<iframe :id="item.id"  frameborder=0 name="showHere" scrolling=auto :src="'./' + item.path.substr(1).replace(/\//g, '-') + '.html'" :height="deviceHeight" width="100%" marginwidth="0" marginheight="0" style="display:block;"></iframe>-->
              <iframe :id="item.id"  frameborder=0 name="showHere" scrolling=auto :src="item.path.indexOf('http') >=0 ? item.path : './index.html#' + item.path " :height="deviceHeight" width="100%" marginwidth="0" marginheight="0" style="display:block;"></iframe>
            </div>
          </template>
        </section>
		  </div>
    </div>
	</div>
</template>
<script>
  import { Navbar, Sidebar, AppMain, Topbar ,FixedSidebar} from './index'
  import { mapGetters } from 'vuex'
  export default {
    name: 'ielayout',
    data () {
      return {
        curUrl: '',
        deviceHeight: 500,
        openMask: false,
        openNum: 0

      }
    },
    components: {
      Navbar,
      Sidebar,
      AppMain,
      Topbar,
      FixedSidebar
    },
    computed: {
      sidebar () {
        return this.$store.state.app.sidebar
      },
      ...mapGetters([
        'activeIndex',
        'iframeList',
        "isIE"
      ])
    },
    mounted() {
      this.curUrl = window.location.href.split('#')[0] + '#'
      // this.curUrl = 'http://localhost:8091/#'
      // let deviceHeight = document.documentElement.clientHeight -  document.getElementsByClassName('h-topbar-wrapper')[0].clientHeight - document.getElementsByClassName('h-navbar-wrapper')[0].clientHeight - 14
      // app-main margin-left
      let deviceHeight = document.documentElement.clientHeight -  100
      this.deviceHeight = deviceHeight
      deviceHeight = undefined
      window.addEventListener('resize', () => {
        // let deviceHeight = document.documentElement.clientHeight -  document.getElementsByClassName('h-topbar-wrapper')[0].clientHeight - document.getElementsByClassName('h-navbar-wrapper')[0].clientHeight - 14
        let deviceHeight = document.documentElement.clientHeight -  100
        this.deviceHeight = deviceHeight
        deviceHeight = undefined
      })
      window.addEventListener('message', (e) => {
        this.$nextTick(() => {
          if (e.data.type == "openMask") {
            // 针对处理中展开2层
            if (e.data.value) {
              this.openNum += 1
            } else {
              this.openNum -= 1
            }
            this.openMask = this.openNum > 0 ? true : false
          } else if (e.data.type == "reLogin") {
            this.$store.dispatch('Logout').then(() => {
              // router.push({ path: '/login' })
              location.reload()
            })
          }
        })
      })
    },
    beforeDestroy() {
      window.removeEventListener('resize', () => {
        // let deviceHeight = document.documentElement.clientHeight -  document.getElementsByClassName('h-topbar-wrapper')[0].clientHeight - document.getElementsByClassName('h-navbar-wrapper')[0].clientHeight - 14
        let deviceHeight = document.documentElement.clientHeight -  100
        this.deviceHeight = deviceHeight
        deviceHeight = undefined
      })
      window.removeEventListener('message', (e) => {
        this.$nextTick(() => {
          if (e.data.type == "openMask") {
            this.openMask = e.data.value
          } else if (e.data.type == "reLogin") {
            this.$store.dispatch('Logout').then(() => {
              // router.push({ path: '/login' })
              location.reload()
            })
          }
        })
      })
    },
  }
</script>
<style>
  .h-modal-mask-left {
    position: fixed;
    top: 100px;
    bottom: 0;
    left: 0;
    width: 250px;
    background-color: rgba(55, 55, 55, 0.6);
    height: 100%;
  }
  .hideSidebar .h-modal-mask-left{
    width: 50px;
  }
  .h-modal-mask-top {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background-color: rgba(55, 55, 55, 0.6);
    height: 100px;
  }
  .none{
    display: none
  }
</style>
