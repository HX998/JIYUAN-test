<template>
  <div>
    <h-msg-box v-model="tempEditDiscEntrustQueryWin" :maximize="true" :mask-closable="false" @on-close="handleClose"
               width="800" class="h-form-search-layer" @on-maximize="onMaximize">
      <p slot="header">
        <span>查询申请</span>
      </p>
      <div>
        <h-form :model="addOrEditForm" :label-width="115" ref="addOrEditForm" cols="2" class="h-form-search" onlyBlurRequire>
          <bill-no v-model="addOrEditForm.billNo" :validRules="billNoRule" required :maxlength="30"></bill-no>
          <common-select v-model="addOrEditForm.billType" :label="$t('m.i.billInfo.billType')" prop="billType" :dictList="batchParams.billTypeList" required></common-select>
          <common-select v-model="addOrEditForm.billClass" :label="$t('m.i.billInfo.billClass')" prop="billClass" :dictList="batchParams.billClassList" readonly required></common-select>
          <common-type-field v-model="addOrEditForm.billMoney" :label="$t('m.i.billInfo.billMoneyByUnit')" prop="billMoney" required></common-type-field>
          <common-date-picker v-model="addOrEditForm.remitDt" :label="$t('m.i.billInfo.remitDt')" prop="remitDt" required></common-date-picker>
          <common-date-picker v-model="addOrEditForm.dueDt" :label="$t('m.i.billInfo.dueDt')" prop="dueDt" required></common-date-picker>
        </h-form>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="handleClose()">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="formAdd()">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>
  </div>
</template>

<script>
  import { post, formatNumber, getDictValueFromMap } from "@/api/bizApi/commonUtil";

  export default {
    name: "editDiscEntrustQuery",
    data() {
      return {
        addOrEditForm: {
          id: "",
          billNo: "",
          billType: "",
          billClass: "",
          billMoney: "",
          remitDt: "",
          dueDt: "",
        },
        submitFlag: false,
        billNoRule: [{ test: /^[1|2][0-9]{29}$/, trigger: "blur", message: "电票号码为30位数字,银票首位为1,商票首位为2" }],
      }
    },
    props: {
      editDiscEntrustQueryWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      batchParams: {
        type: Object,
        default() {
          return {};
        }
      }
    },
    computed: {
      tempEditDiscEntrustQueryWin: {
        get() {
          return this.editDiscEntrustQueryWin;
        },
        set() {
        }
      }
    },
    watch: {
      editDiscEntrustQueryWin(val) {
        if (val) {
          post({batchId: this.batchParams.batchId}, "/be/discquote/entrust/discEntrustQueryApplyMain/func_getDiscEntrustQuery").then(res => {
            if (res) {
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.addOrEditForm = res.data.retData;
                if(this.addOrEditForm.remitDt){
                  this.addOrEditForm.remitDt = this.$moment(this.addOrEditForm.remitDt, "YYYYMMDD").format("YYYY-MM-DD");
                }
                if(this.addOrEditForm.dueDt){
                  this.addOrEditForm.dueDt = this.$moment(this.addOrEditForm.dueDt, "YYYYMMDD").format("YYYY-MM-DD");
                }
              } else {
                this.$msgTip.error(this, { info: res.data.retMsg });
              }
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            }
          });
        }
      },
    },
    methods: {
      onMaximize() {
        setTimeout(() => {
          this.$refs.datagrid.$refs.gridContent.handleResize();
        }, 100);
      },
      handleClose(){
        this.$refs.addOrEditForm.resetFields();
        this.addOrEditForm.id = "";
        this.$emit("editDiscEntrustQueryWinClose", "");
      },
      formAdd(){
        this.$refs["addOrEditForm"].validate(valid => {
          if (valid) {
            this.addOrEditForm.remitDt = this.addOrEditForm.remitDt.replace(/-/g, "");
            this.addOrEditForm.dueDt = this.addOrEditForm.dueDt.replace(/-/g, "");
            let url = "/be/discquote/entrust/discEntrustQueryApplyMain/func_addDiscEntrustQuery";
            this.submitFlag = true;
            post(this.addOrEditForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.handleClose();
                } else {
                  this.$msgTip.error(this, { info: msg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
    }
  };
</script>

<style scoped>

</style>
