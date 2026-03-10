<template>
  <transition name="fade">
		<div class="h-modal-mask h-pj-modal h-custom-msg-box" :class="{'h-pj-autohide':message.autoHide}" v-if="visible" @click.self="cancel" :style="maskStyle">
      <div class="h-modal-wrap" :style="wrapStyles">
				<div class="h-modal-content">
					<a class="h-modal-close" @click="cancel"><i class="h-icon iconfont icon-close h-icon-close"></i></a>
					<div class="h-modal-header" v-if="!message.noHead">
						<p><span>{{message.title}}</span></p>
					</div>
					<div class="h-modal-body" :style="bodyStyles">
            <div class="h-prompt-content">
							<div class="h-prompt-top" :class="{'mat0':message.autoHide}" v-if="message.icon">
								<i class="icon iconfont icon-right" v-if="message.stateType === 'success'"></i>
								<i class="icon iconfont icon-remind" v-else-if="message.stateType === 'warn'"></i>
								<i class="icon iconfont icon-wrong" v-else-if="message.stateType === 'failure'"></i>
								<span>{{message.stateTitle}}</span>
							</div>
							<p v-html="message.info" v-if="message.info !==''"></p>
						</div>
					</div>
					<div class="h-modal-footer" v-if="!message.noFoot">
						<div v-if="message.btnType === 'confirm'">
							<button type="button" class="h-btn h-btn-ghost" @click="cancel"><span>取消</span></button>
							<button type="button" class="h-btn h-btn-primary" @click="sure"><span>确定</span></button>
						</div>
						<div v-else-if="message.btnType === 'inform'">
							<button type="button" class="h-btn h-btn-primary" @click="cancel"><span>我知道了</span></button>
						</div>
					</div>
				</div>
			</div>
		</div>
  </transition>
</template>
<script>
export default {
	name:'messagelayer',
  data() {
		return{
			message: {
				noHead: false,
				noFoot: false,
        title: '',
        icon: true,
				stateType: 'success',
        stateTitle: '提交成功',
        info:'',
        btnType: 'confirm',
				width: '1000',
				height: '200',
				autoHide: false,
				time: 2000
      },
      options: {
        hsure: ()=>{}
      },
      visible: false,
      modalStyle: {}
		}
	},
  computed: {
    maskStyle() {
      let style = {}
      let isIE = navigator.userAgent.indexOf("MSIE") >= 0 || navigator.userAgent.indexOf("Trident") >= 0;
      let isTransfer = window.sessionStorage.getItem("isTransfer") === "0";
      if (isTransfer && isIE) {
        style.position = "absolute";
      }
      return style
    },
    wrapStyles() {
      return this.modalStyle.wrapStyle
    },
    bodyStyles() {
      return this.modalStyle.bodyStyle
    }
  },
	watch: {
		visible (val) {
			if(window.isIE) {
				val ? this.PageCommonUtils.openMask() : this.PageCommonUtils.closeMask()
			}
			if (val) {
			  this.modalStyle = this.initStyle();
      } else {
        this.modalStyle = {}
      }
		}
	},
	methods: {
		cancel() {
			this.$messagebox['cancel']();
		},
		sure() {
			this.$messagebox['sure']();
		},
    initStyle() {
      let wrapStyle = {}
      let bodyStyle = {}
      let isIE = navigator.userAgent.indexOf("MSIE") >= 0 || navigator.userAgent.indexOf("Trident") >= 0;
      let appObj = document.getElementsByClassName("app-main");
      let isTransfer = window.sessionStorage.getItem("isTransfer") === "0";
      if (isTransfer && isIE) {
        wrapStyle.position = "absolute";
      }
      if (this.message.width) {
        let maxWidth = window.innerWidth - 200;
        if (isTransfer) {
          maxWidth = appObj.length === 0 ? 300 : appObj[0].offsetWidth - 200;
        }
        if (maxWidth < this.message.width) {
          wrapStyle.marginLeft = `${-(maxWidth / 2)}px`
          wrapStyle.width = `${maxWidth}px`
          bodyStyle.width = `${maxWidth}px`
        } else {
          wrapStyle.marginLeft = `${-(this.message.width / 2)}px`
          wrapStyle.width = `${this.message.width}px`
          bodyStyle.width = `${this.message.width}px`
        }
      }
      if (this.message.height) {
        wrapStyle.display = "flex"
        wrapStyle.alignItems = "center"
        wrapStyle.top = "0px"
        wrapStyle.marginTop = "0px"
        let maxHeight = window.innerHeight - 150
        if (isTransfer) {
          maxHeight = appObj.length === 0 ? 150 : appObj[0].offsetHeight - 150;
        }
        bodyStyle.maxHeight = `${maxHeight}px`
        if (maxHeight < this.message.height) {
          bodyStyle.height = `${maxHeight}px`
        } else {
          bodyStyle.height = `${this.message.height}px`
        }
      }
      return {wrapStyle: wrapStyle, bodyStyle: bodyStyle}
    }
	},
	mounted() {
	}
}
</script>
<style scoped lang="scss">
</style>
