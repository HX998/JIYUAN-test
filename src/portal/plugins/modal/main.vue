<template>
  <div>
    <h-msg-box v-model="isShow"
                :width="width"
                :mask-closable="false"
                :scrollable="false" 
                :canDrag="false"
                :maximize="true"
                :footerHide="true"
                class="h-form-search-layer"
                @on-close="handleAction"
                @on-maximize="onMaximize">
          <div slot="header" class="h-modal-setUser-header"></div>
          <!--<div slot="close" class="h-modal-setUser-close"></div>-->
          <div class="modal-body">
            <h-dialog-body ref="body"
                           :title="title"
                           @handleAction="handleAction">
            </h-dialog-body>  
          </div>     
          <div slot="footer" class="h-modal-setUser-footer"></div>
      </h-msg-box>
  </div>
</template>

<script>

export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      loading: false,
      isShow: false,
      width: 1100,
      height:420,
    }
  },

  methods: {
    handleAction(button) {
      this.$emit('action', button)
    },
    onMaximize(button) {
      this.$emit('onMaximize', button)
    },
    open(width, height) {
      if(width != null && width != "" && width != undefined && width != "0"){
        this.width = width;
      }
      if(height != null && height != "" && height != undefined && height != "0"){
        this.height = height;
      }
      this.isShow = !this.isShow;
    },

    close() {
      this.isShow = !this.isShow
    }
  }
}
</script>

<style scoped>
.h-modal-setUser-header {
  height: 21px;
}
.overlay {
  text-align: center;
  height: 30px;
  line-height: 30px;
}

.overlay .glyphicon-refresh {
  animation: spin 2s infinite linear;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(359deg);
  }
}
</style>
