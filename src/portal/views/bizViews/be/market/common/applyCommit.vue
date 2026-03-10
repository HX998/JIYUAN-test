<template>
  <h-msg-box v-model="tempApplyCommitWin" :maximize="false" width="400" :footerHide="true" :closable="false" :z-index="2010">
    <div class="modal-body">
      <div class="h-modal-confirm">
        <div class="h-modal-confirm-head">
          <div class="h-modal-confirm-head-icon h-modal-confirm-head-icon-confirm">
            <i class="h-icon iconfont icon-feedback"></i>
          </div>
          <div class="h-modal-confirm-head-title">确认要继续提交申请吗?</div>
        </div>
        <div class="h-modal-confirm-body">
          <div>{{applyTitle}}</div>
        </div>
        <div class="h-modal-confirm-footer">
          <button type="button"  @click="applyClose()" class="h-btn h-btn-text h-btn-large"><span>取消</span></button>
          <button type="button"  @click="applyCommit()" class="h-btn h-btn-primary h-btn-large"><span>确定</span></button>
        </div>
      </div>
    </div>
  </h-msg-box>
</template>

<script>
  export default {
    name: "applyCommit",
    props:{
      applyWin: false,
      applyTitle: ""
    },
    computed: {
      tempApplyCommitWin: {
        get() {
          return this.applyWin;
        },
        set(){

        }
      }
    },
    methods:{
      applyClose(){
        this.$emit("applyClose", "");
      },
      applyCommit(){
        this.$emit("applyCommit", "");
      }
    }
  };
</script>

<style scoped>

</style>