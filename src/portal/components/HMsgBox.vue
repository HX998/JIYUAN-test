<template>
  <msg-box v-model="itemValue" :closable="closable" :mask-closable="maskClosable" :title="title" :width="width"
           :okText="okText" :cancelText="cancelText" :loading="loading" :styles="styles" :className="className"
           :footerHide="footerHide" :scrollable="scrollable" :transitionNames="transitionNames" :transfer="transfer"
           :top="top" :escClose="escClose" :canDrag="canDrag" :zIndex="zIndex" :isBeyond="isBeyond"
           :isOriginal="isOriginal" :height="height" :maximize="maximize" :left="left" :closeDrop="closeDrop"
           :disableTabEvent="disableTabEvent" :maskTop="maskTop" :maskLeft="maskLeft" :beforeEscClose="beforeEscClose"
           :lazyload="lazyload" :isOkLeft="isOkLeft" :allowCopy="allowCopy" :targetNode="targetNode"
           @on-ok="onOk" @on-cancel="onCancel" @on-close="onClose" @on-maximize="onMaximize" @on-open="onOpen"
           ref="msgbox">
    <slot name="close" slot="close"></slot>
    <slot name="header" slot="header"></slot>
    <slot></slot>
    <slot name="footer" slot="footer"></slot>
  </msg-box>
</template>

<script>

  export default {
    name: "HMsgBox",
    props: {
      value: {
        type: Boolean,
        default: false
      },
      closable: {
        type: Boolean,
        default: true
      },
      maskClosable: {
        type: Boolean,
        default: false
      },
      title: {
        type: String
      },
      width: {
        type: [Number, String],
        default: 520
      },
      okText: {
        type: String
      },
      cancelText: {
        type: String
      },
      loading: {
        type: Boolean,
        default: false
      },
      styles: {
        type: Object
      },
      className: {
        type: String
      },
      // for instance
      footerHide: {
        type: Boolean,
        default: false
      },
      scrollable: {
        type: Boolean,
        default: false
      },
      transitionNames: {
        type: Array,
        default() {
          return ["ease", "fade"];
        }
      },
      transfer: {
        type: Boolean,
        default: true
      },
      top: {
        top: [String, Number],
        default: 100
      },
      escClose: {
        type: Boolean,
        default: false
      },
      canDrag: {
        type: Boolean,
        default: true
      },
      zIndex: {
        type: Number,
        default: 1000
      },
      isBeyond: {
        type: Boolean,
        default: false
      },
      isOriginal: {
        type: Boolean,
        default: false
      },
      height: [String, Number],
      maxHeight: [String, Number],
      maximize: {
        type: Boolean,
        default: true
      },
      left: [String, Number],
      closeDrop: {
        type: Boolean,
        default: false
      },
      disableTabEvent: {
        type: Boolean, //禁止tab点击事件
        default: false
      },
      maskTop: {
        top: [String, Number],
        default: null
      },
      maskLeft: {
        top: [String, Number],
        default: null
      },
      // escClose 触发前调用的函数，其返回结果影响弹窗关闭与否
      beforeEscClose: {
        type: Function,
        default: () => true
      },
      /* 是否开启内容懒加载 */
      lazyload: {
        type: Boolean,
        default: true
      },
      isOkLeft: {
        type: Boolean,
        default: false
      },
      // 是否能够对msgbox里的文本进行复制
      allowCopy: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        targetNode: undefined,
        isFirstOpen: true,
        switchSizeLocation: { //记录拖动后的位置，用于最大化后的还原
          top: 0,
          left: 0
        }
      };
    },
    computed: {
      itemValue: {
        get(){
          return this.value;
        },
        set(val){
          this.$emit('input', val);
        }
      }
    },
    watch: {
      value: {
        immediate: true,
        handler(val) {
          if (val) {
            let isIE = navigator.userAgent.indexOf("MSIE") >= 0 || navigator.userAgent.indexOf("Trident") >= 0;
            if(!this.$refs.msgbox.$props.transfer && isIE) {
              this.$nextTick(() => {
                this.$refs.msgbox.$el.querySelector('.h-modal-wrap').style.position = "absolute";
                // if(this.isFirstOpen) {
                //   this.isFirstOpen = false;
                //   let sidebarObj = document.getElementsByClassName("h-sidebar-wrapper");
                //   let sidebarOffsetWidth = sidebarObj.length === 0 ? 0 : sidebarObj[0].offsetWidth;
                //   let contentLeft = this.$refs.msgbox.$refs.content.style.left;
                //   this.$refs.msgbox.$refs.content.style.left = (Number(contentLeft.substring(0,contentLeft.length-2)) + sidebarOffsetWidth) + "px";
                //   let appObj = document.getElementsByClassName("app-main");
                //   let appOffsetTop = appObj.length === 0 ? 0 : appObj[0].offsetTop;
                //   let contentTop = this.$refs.msgbox.$refs.content.style.top;
                //   this.$refs.msgbox.$refs.content.style.top = (Number(contentTop.substring(0,contentTop.length-2)) + appOffsetTop) + "px";
                // }
              });
            }
          }
        }
      }
    },
    methods: {
      onOk() {
        this.$emit("on-ok");
      },
      onCancel() {
        this.$emit("on-cancel");
      },
      onClose() {
        this.$emit("on-close");
      },
      onMaximize(isMax) {
        let isIE = navigator.userAgent.indexOf("MSIE") >= 0 || navigator.userAgent.indexOf("Trident") >= 0;
        if(!this.$refs.msgbox.$props.transfer && isIE) {
          if(isMax) {
            this.switchSizeLocation = {
              left: this.$refs.msgbox.$refs.content.style.left,
              top: this.$refs.msgbox.$refs.content.style.top
            }
          }
          this.$nextTick(() => {
            if(!isMax) {
              this.$refs.msgbox.$refs.content.style.left = this.switchSizeLocation.left;
              this.$refs.msgbox.$refs.content.style.top = this.switchSizeLocation.top;
            }
          });
          // this.$nextTick(() => {
          //   if(isMax) {
          //     let sidebarObj = document.getElementsByClassName("h-sidebar-wrapper");
          //     let sidebarOffsetWidth = sidebarObj.length == 0 ? 0 : sidebarObj[0].offsetWidth;
          //     this.$refs.msgbox.$refs.content.style.left = sidebarOffsetWidth +  "px";
          //     let appObj = document.getElementsByClassName("app-main");
          //     let appOffsetTop = appObj.length === 0 ? 0 : appObj[0].offsetTop;
          //     this.$refs.msgbox.$refs.content.style.top = appOffsetTop + "px";
          //   } else {
          //     this.$refs.msgbox.$refs.content.style.left = this.switchSizeLocation.left;
          //     this.$refs.msgbox.$refs.content.style.top = this.switchSizeLocation.top;
          //   }
          // });
        }
        this.$emit("on-maximize", isMax);
      },
      onOpen() {
        this.$emit("on-open");
      }
    },
    created() {
      this.$nextTick(() => {
        this.$refs.msgbox.$data.isRealVisible = false;
      });
    },
    beforeDestroy() {
      this.isFirstOpen = true;
    }
  };
</script>

<style scoped>

</style>
