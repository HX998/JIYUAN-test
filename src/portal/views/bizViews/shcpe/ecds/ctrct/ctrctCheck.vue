<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <h-field-panel collapse key="1">
          <span slot="title">每月合同信息汇总申请221</span>
          <h-form :model="addForm" :label-width="135" ref="addForm" cols="2" class="h-form-search">
            <div>
              <h-form-item prop="summryDt" :label="$t('m.i.common.checkDt')" required>
                <h-date-picker v-model="addForm.summryDt" type="date" placeholder="" showFormat :editable=false></h-date-picker>
              </h-form-item>
              <h-form-item prop="accssPtCd" :label="$t('m.i.shcpe.accssPtCd')" required>
                <h-input v-model="addForm.accssPtCd" placeholder=""></h-input>
              </h-form-item>
            </div>
            <div style="text-align: right">
              <h-button type="primary" @click="formSave">{{$t("m.i.shcpe.sendTotalCheckApply")}}</h-button>
            </div>
          </h-form>
        </h-field-panel>
        <h-field-panel collapse key="2" style="height: 300px;">
          <span slot="title">每月合同信息明细申请223</span>
          <h-form :model="addForm2" :label-width="135" ref="addForm2" cols="2" class="h-form-search">
            <div>
              <h-form-item prop="summryDt" :label="$t('m.i.common.checkDt')" required>
                <h-date-picker v-model="addForm2.summryDt" type="date" placeholder="" showFormat :editable=false></h-date-picker>
              </h-form-item>
              <h-form-item prop="acctSvcr" :label="$t('m.i.shcpe.acctSvcr')" required>
                <h-input v-model="addForm2.acctSvcr" placeholder="用竖线分隔多个要约方开户行行号"></h-input>
              </h-form-item>
              <h-form-item prop="ctrctNb" :label="$t('m.i.shcpe.ctrctNb')" required>
                <h-input v-model="addForm2.ctrctNb" placeholder="用竖线分隔多个合同编号"></h-input>
              </h-form-item>
            </div>
            <div style="text-align: right">
              <h-button type="primary" @click="formSave2">{{$t("m.i.shcpe.sendDetailCheckApply")}}</h-button>
            </div>
          </h-form>

        </h-field-panel>
      </h-col>
    </h-row>
  </div>
</template>

<script>
  import { post } from "@/api/bizApi/commonUtil";

  export default {
    name: "ctrctCheck",
    components: {
    },
    data() {
      return {
        dictMap: {
          type: Map
        },
        addForm: {
          accssPtCd: "",
          summryDt: ""
        },
        addForm2: {
          summryDt: "",
          acctSvcr: "",
          ctrctNb: ""
        }
      };
    },
    computed: {},
    mounted() {
    },
    beforeDestroy() {
    },
    watch: {},
    methods: {
      formSave() {
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            post(this.addForm, "/shcpe/ecds/ctrct/ctrctCheck/sendCtrct221").then(res => {
              if (res) {
                if (res.data.retCode === "000000") {
                  this.addForm2.orgnlMsgId = res.data.retData.orgnlMsgId;
                  this.addForm2.orgnlCreDtTm = res.data.retData.orgnlCreDtTm;
                  this.addForm2.receiverBankNo = res.data.retData.receiverBankNo;
                  this.$msgTip.success(this, { info: res.data.retMsg });
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      formSave2() {
        this.$refs["addForm2"].validate(valid => {
          if (valid) {
            post(this.addForm2, "/shcpe/ecds/ctrct/ctrctCheck/sendCtrct223").then(res => {
              if (res) {
                if (res.data.retCode === "000000") {
                  this.$msgTip.success(this, { info: res.data.retMsg });
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
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
