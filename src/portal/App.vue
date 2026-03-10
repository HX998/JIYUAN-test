<template>
  <div id="app">
    <router-view></router-view>
    <template v-if="isShow">
      <div v-show="this.$store.getters.isLoading"  class="demo-spin-col" style="z-index:99999;">
         <!-- <h-spin fix  style="z-index:99999;">
            <div class="loader">
              <h-icon name="load-c" size=18 class="demo-spin-icon-load"></h-icon>
                <div>处理中...</div>
             </div>       
          </h-spin>-->
        <transition name="fade">
          <div class="h-modal-mask h-pj-modal">
            <div class="pj-loading">
              <svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg>
              <span class="loading-title">处理中...</span>
            </div>
          </div>
        </transition>
      </div>
    </template>
  </div>
</template>
<style scoped lang="scss">
  @keyframes loading-rotate {
    to {
      transform: rotate(1turn)
    }
  }
  @keyframes loading-dash {
    0% {
      stroke-dasharray: 1,200;
      stroke-dashoffset: 0
    }

    50% {
      stroke-dasharray: 90,150;
      stroke-dashoffset: -40px
    }

    to {
      stroke-dasharray: 90,150;
      stroke-dashoffset: -120px
    }
  }
  .pj-loading{
    background: #fff;
    position: absolute;
    left: 50%;
    top: 50%;
    min-width: 200px;
    height: 40px;
    border: 1px solid #dddddd;
    border-radius: 4px;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    padding: 4px 10px;
    z-index: 1001;
    .circular {
      height: 28px;
      width: 28px;
      animation: loading-rotate 2s linear infinite;
    }
    .path {
      animation: loading-dash 1.5s ease-in-out infinite;
      stroke-dasharray: 90,150;
      stroke-dashoffset: 0;
      stroke-width: 2;
      stroke: #409eff;
      stroke-linecap: round;
    }
    .loading-title{
      line-height: 32px;
      margin-left: 10px;
      display: inline-block;
      vertical-align: top;
      font-size: 12px;
    }
  }
</style>
<script>
export default {
  name: 'app',
  data(){
   return {  loading:false};
  },
  computed: {
    isShow () {
      return !(window.isIE && window.parent)
    }
  },
  mounted(){
    // function checkIE(){
    //   return window.navigator.userAgent.indexOf("MSIE")>=1 || window.navigator.userAgent.indexOf('Trident') >= 1;
    // }
    
    // if (checkIE()) {
    //   window.addEventListener('hashchange', () => {
    //     var currentPath = window.location.hash.slice(1);
    //     if (this.$route.path !== currentPath) {
    //     this.$router.push(currentPath)
    //   }
    // }, false)
    // }
  }
}
</script>

