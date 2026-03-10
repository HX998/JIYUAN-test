<template>
  <transition name="fade">
    <div class="h-modal-mask h-pj-modal">
      <div class="pj-loading">
        <svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg>
        <span class="loading-title">{{message.title}}</span>
      </div>
    </div>
  </transition>
</template>
<script>
  export default {
    name:'loading',
    data() {
      return{
        message: {
          title: '加载中，请稍后...'
        },
        visible:false
      }
    },
    watch: {
      visible (val) {
        if(window.isIE) {
          val ? this.PageCommonUtils.openMask() : this.PageCommonUtils.closeMask()
        }
      }
    },
    methods: {
    }
  }
</script>
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
