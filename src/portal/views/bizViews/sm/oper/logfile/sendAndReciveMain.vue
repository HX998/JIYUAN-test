<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="12">
        <div class="clearfix">
          <h-panel class="h-main-search h-form-search clearfix">
            <h-form :model="draftInfoReqForm" :label-width="115" ref="draftInfoReqForm" cols="1" class="h-form-search">
              <div class="h-search-form-row">
                <h-form-item label="请求报文内容" prop="draftContent" class="h-form-height-auto" required>
                  <h-input v-model="draftInfoReqForm.draftContent" type="textarea" :autosize="{minRows: 20,maxRows: 40}"></h-input>
                </h-form-item>
                <h-form-item class="no-label">
                  <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
                  <h-button type="primary" v-else @click="formAdd()">{{$t("m.i.common.commit")}}</h-button>
                </h-form-item>
              </div>
            </h-form>
          </h-panel>
        </div>
      </h-col>
      <h-col span="12">
        <div class="clearfix">
          <h-panel class="h-main-search h-form-search clearfix">
            <h-form :model="draftInfoResForm" :label-width="115" ref="draftInfoResForm" cols="1" class="h-form-search">
              <div class="h-search-form-row">
                <h-form-item label="响应报文内容" prop="draftContent" class="h-form-height-auto">
                  <h-input v-model="draftInfoResForm.draftContent" type="textarea" :autosize="{minRows: 20,maxRows: 40}"></h-input>
                </h-form-item>
              </div>
            </h-form>
          </h-panel>
        </div>
      </h-col>
    </h-row>
  </div>
</template>

<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";

  export default {
    name: "SendAndReciveMain",
    data() {
      return {
        submitFlag: false,
        draftInfoReqForm:{
          draftContent:"",
        },
        draftInfoResForm:{
          draftContent:"",
        },
      };
    },
    methods: {
      formAdd() {
        this.$refs["draftInfoReqForm"].validate(valid => {
          if (valid) {
            this.submitFlag = true;
            let draftContent = this.draftInfoReqForm.draftContent;
            draftContent = draftContent.replace(/[\r\n]/g,"\\n");
            let url = "/ce/channel/ebank/request";
            post({requestMessage:draftContent}, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let msg = res.data.retMsg;
                let retData = res.data.retData;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this, { info: this.$t("m.i.common.actionSuccess") });
                  this.$refs["draftInfoReqForm"].resetFields();
                  this.draftInfoResForm.draftContent = retData;
                } else {
                  this.$msgTip.error(this,{info:msg});
                }
              } else {
                this.$msgTip.error(this,{info:this.$t("m.i.common.netError")});
              }
            });
          }
        });
      }
    },
  };
</script>

<style scoped>

</style>
