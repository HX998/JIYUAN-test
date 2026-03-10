<template>
  <transition name="fade">
    <!-- <div class="layer-mask" @click="handleClose"></div> -->
    <div class="window-layer-win"
         :class="{'h-window-min':!fullScreen}"
         @mousedown.capture="layerClick"
         v-show="visible"
         :style="{width: width + 'px', height: height + 'px', left: left + 'px', top: top + 'px'}">
      <div class="window-layer-header" @mousedown="moveHandleMousedown($event)">
        <p>{{title}}</p>
        <div class="window-layer-fn-btns">
          <!--       <i class="h-icon iconfont icon-biaoqian-danchuxianshi" @mousedown.stop="handleIn" v-if="layerOut"></i>-->
          <i class="h-icon iconfont icon-max" @mousedown.stop="handleFullScreen(1)" v-if="fullScreen"></i>
          <i class="h-icon iconfont icon-min" @mousedown.stop="handleFullScreen(2)" v-if="!fullScreen"></i>
          <i class="h-icon iconfont icon-close h-icon-close" @mousedown.stop="handleClose($event)"
             @mouseover.stop="closeMouseOver($event)"></i>
        </div>
      </div>
      <div class="window-layer-content" style="overflow:auto;">
        <!-- <div class="window-layer-content-mask" v-if="acType > 0"></div> -->
        <!-- 防止在内部存在iframe，在拖动或者缩放时鼠标在iframe上时脱离原网页坐标而无法监听鼠标位置 -->
        <slot></slot>
      </div>
      <div class="window-scale-btn" @mousedown="scaleHandleMousedown($event)">
      </div>
    </div>
  </transition>
</template>
<script>
  export default {
    name: "dragscalelayer",
    props: {
      index: {
        type: Number,
        default: 1
      },
      visible: {
        type: Boolean,
        default: false
      }, //定义弹窗显示状态属性 默认false
      title: {
        type: String,
        default: "标题"
      }, //定义弹窗显标题
      miniW: {
        type: Number,
        default: 200
      }, //缩放最小宽度 默认200px
      miniH: {
        type: Number,
        default: 200
      }, //缩放最小高度 默认200px
      wrapId: {
        type: String,
        default: "h-window-container1"
      },
      windowId: {
        type: String,
        default: "h-window"
      },
      windowListLength: {//当前界面弹窗个数
        type: Number,
        default: 2
      }
    },
    data() {
      return {
        acType: -1, //定义操作弹窗动作类型 1为缩放 2为拖动
        visWidth: 1000, //保存页面文档宽度
        visHeight: 1000, //保存页面文档高度
        width: 1000, //弹窗实际操作宽度
        height: 346, //弹窗实际操作高度
        left: 0, //弹窗距文档左边实际操作距离
        top: 0, //弹窗距顶部实际操作距离
        scale: {  //定义缩放临时参数
          stX: 0,
          stY: 0,
          currW: 0,
          currH: 0
        },
        move: { //定义拖动临时参数
          stX: 0,
          stY: 0,
          currL: 0,
          currT: 0
        },
        fullScreen: false, //定义全屏弹窗状态
        fsWidth: 0,
        fsHeight: 0, //全屏显示时保存弹窗非全屏显示时的大小与状态
        fsLeft: 0,
        fsTop: 0,
        loadWidth: 0,
        loadHeight: 346,
        loadLeft: 0,
        loadTop: 0,
        layerOut: false,
        windowLayerWrap: null,
        windowLayer: null
      };
    },
    mounted() {
      this.windowLayerWrap = document.getElementById(this.wrapId);
      this.windowLayer = document.getElementById(this.windowId);
      this.loadWidth = this.width = this.windowLayer.clientWidth - 10;
      let appObj = document.getElementsByClassName("app-main");
      let appOffsetTop = appObj.length == 0 ? 0 : appObj[0].offsetTop;
      let count = Math.ceil(this.windowListLength / 2);
      this.height = (window.innerHeight - appOffsetTop) / count - 15;
      if ((this.index % 2) != 0) {
        this.left = 5;
      } else {
        this.left = this.width + 15;
      }
      this.loadLeft = this.left;
      this.top = Math.ceil(this.index / 2 - 1) * (this.height + 10);
      this.loadTop = this.top;
      let self = this;
      self.getDocSize(); //初始获取文档宽高
      // window.addEventListener("resize", function() {
      //     self.getDocSize(); //监听window 宽高发生变化时 重新获取宽高
      //     if (self.fullScreen) { //全屏状态下更新弹窗宽高
      //         self.width = self.visWidth;
      //         self.height = self.visHeight;
      //     }
      // }, false)
      document.documentElement.addEventListener("mousemove", function(event) {
        self.handleMousemove(event);
      }, true);
      document.documentElement.addEventListener("mouseup", function(event) {
        self.handleMouseup(event);
      }, true);
    },
    methods: {
      getDocSize() {
        // this.visWidth = document.documentElement.clientWidth || document.body.clientWidth;
        // this.visHeight = document.documentElement.clientHeight || document.body.clientHeight;
        let appObj = document.getElementsByClassName("app-main");
        let appOffsetTop = appObj.length == 0 ? 0 : appObj[0].offsetTop;
        this.visWidth = this.windowLayerWrap.clientWidth;
        this.visHeight = document.documentElement.clientHeight - appOffsetTop || document.body.clientHeight - appOffsetTop;
      },
      scaleHandleMousedown(e) { //缩放弹窗 开始
        if (this.fullScreen) return; //全屏时禁止缩放
        this.acType = 1;
        this.scale.stX = e.clientX;
        this.scale.stY = e.clientY;
        this.scale.currW = this.width;
        this.scale.currH = this.height;
      },
      moveHandleMousedown(e) { //拖动弹窗 开始
        if (this.fullScreen) return;
        this.acType = 2;
        this.move.stX = e.clientX;
        this.move.stY = e.clientY;
        this.move.currL = this.left;
        this.move.currT = this.top;
      },
      handleMouseup(e) { //结束操作
        this.acType = -1;
      },
      handleMousemove(e) {
        if (this.acType === 1) { //缩放
          this.layerOut = true;
          let crW = 0,
            crH = 0;
          crW = this.scale.currW + (e.clientX - this.scale.stX);
          crH = this.scale.currH + (e.clientY - this.scale.stY);
          if (crW <= this.miniW) {
            this.width = this.miniW;
          } else if (crW > this.windowLayerWrap.clientWidth - this.left) {
            this.width = this.windowLayerWrap.clientWidth - this.left;
          } else {
            this.width = crW;
          }
          if (crH <= this.miniH) {
            this.height = this.miniH;
          } else {
            this.height = crH;
          }
        }
        if (this.acType === 2) { //移动
          this.layerOut = true;
          this.left = this.move.currL + (e.clientX - this.move.stX);
          if (this.left < 0) {
            this.left = 0;
          } else if (this.left > this.windowLayerWrap.clientWidth - this.width) {
            this.left = this.windowLayerWrap.clientWidth - this.width;
          }
          this.top = this.move.currT + (e.clientY - this.move.stY);
          if (this.top < 0) {
            this.top = 0;
          }
        }
      },
      handleClose(e) { //关闭弹窗
        this.$emit("close", e);
      },
      layerClick() {
        this.$emit("changePosition");
      },
      handleFullScreen(type) { //全屏
        this.$emit("changePosition");
        if (type == 1) {//缩小
          this.layerOut = true;
          if (!this.fullScreen) return;
          this.fullScreen = false;

          this.width = this.fsWidth;
          this.height = this.fsHeight;
          this.left = this.fsLeft;
          this.top = this.fsTop;
        } else {//放大
          this.layerOut = false;
          if (this.fullScreen) return;
          this.fullScreen = true;

          this.fsWidth = this.width;
          this.fsHeight = this.height;
          this.fsLeft = this.left;
          this.fsTop = this.top;
          this.getDocSize();
          this.width = this.visWidth;
          this.height = this.visHeight;
          this.left = 0;
          this.top = 0;
        }
      },
      handleIn() {
        this.layerOut = false;
        this.width = this.loadWidth = this.windowLayer.clientWidth - 10;
        this.height = this.loadHeight;
        if ((this.index % 2) != 0) {
          this.left = 5;
        } else {
          this.left = this.width + 15;
        }
        this.loadLeft = this.left;
        this.left = this.loadLeft;
        this.top = this.loadTop;
      },
      closeMouseOver(e) {
        this.$emit("flyPosition", e);
      }
    }
  };
</script>
<style scoped lang="scss">
</style>
