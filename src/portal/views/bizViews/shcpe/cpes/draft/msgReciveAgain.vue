<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div class="clearfix">
          <h-panel class="h-main-search h-form-search clearfix">
            <h-form :model="draftInfoForm" :label-width="115" ref="draftInfoForm" cols="1" class="h-form-search">
              <div class="h-search-form-row">
                <h-form-item label="报文内容:" prop="message" class="h-form-height-auto" required>
                  <h-input v-model="draftInfoForm.message" type="textarea" :autosize="{minRows: 20,maxRows: 40}"></h-input>
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
    </h-row>
  </div>
</template>

<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";
  export default {
    name: "msgReciveAgain",
    data() {
      let options = {};
      options.submitFlag = false;
      options.draftInfoForm = {
        message: ""
      };
      return options;
    },
    methods: {
      formAdd() {
        this.$refs["draftInfoForm"].validate(valid => {
          if (valid) {
            this.submitFlag = true;
            let msg = this.draftInfoForm.message;
            // msg = msg.replace(/[\r\n]/g,"\\n");
            post({message:msg}, "/shcpe/cpes/draft/addSubMessage").then(res => {
              this.submitFlag = false;
              if (res) {
                let msg = res.data.retMsg;
                let retData = res.data.retData;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this, { info: this.$t('m.i.common.actionSuccess') });
                  this.$refs["draftInfoForm"].resetFields();
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
    }
  };
</script>

<style scoped>

</style>
