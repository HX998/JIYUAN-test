<template>
  <div>
    <h-msg-box v-model="tempShowCopyBillWin" :maximize="true" :mask-closable="false" @on-close="handleClose"
               width="400" class="h-form-table-layer" :z-index=1202 @on-maximize="onMaximize">
      <p slot="header">
        <span>{{ title }}</span>
      </p>
      <div>
        <h-form :model="copyBillInfoForm" :label-width="115" ref="copyBillInfoForm" cols="1" class="h-form-search">
          <h-form-item :label="$t('m.i.ce.copyBillNum')" prop="batchCopyBillNumber" required
                       :validRules="copyBillNumRule" style="width:180%">
            <h-input v-model="copyBillInfoForm.batchCopyBillNumber" :maxlength="5"
                     placeholder="请输入3位及以下的正整数"></h-input>
          </h-form-item>
        </h-form>
      </div>

      <!-- 弹出框模式底部按钮 -->
      <div slot="footer">
        <h-button type="ghost" @click="handleClose">{{ $t("m.i.common.close") }}</h-button>
        <h-button type="primary" @click="submitForm">{{ $t("m.i.common.commit") }}</h-button>
      </div>
    </h-msg-box>
  </div>
</template>
<script>
import {getDictListByGroups, getDictValueFromMap, post} from "@/api/bizApi/commonUtil";

export default {
  name: "showCopyBill",
  data() {
    return {
      dictMap: new Map(),
      formItem: {},
      copyBillNumRule: [{test: /^(0{0}|\+?[1-9][0-9]{0,2})$/, trigger: "blur", message: "格式错误，只能输入3位及以下的正整数"}],
      copyBillInfoForm: {
        batchCopyBillNumber: ''
      },
    };
  },
  props: {
    title: {
      type: String,
      default: "复制票据信息"
    },
    showCopyBillWin: {
      type: Boolean,
      default: false
    },
    copyBillInfo: {
      type: Object,
      default: {
        billClass: "",
        billType: "",
        remitDt: "",
        drwrName: "",
        drwrAcctNo: "",
        drweBankName: "",
        pyeeName: "",
        pyeeAcctNo: "",
        pyeeBankName: "",
        billMoney: "",
        dueDt: "",
        drweBankNo: "",
        drweBankAddr: "",
        acptName: "",
        acptBankNo: "",
        batchId: "",
      }
    },

  },
  watch: {
    showCopyBillWin(val) {
      if (val) {


      }
    }
  },
  computed: {
    tempShowCopyBillWin: {
      get() {
        return this.showCopyBillWin;
      },
      set() {
      }
    }
  },
  methods: {

    onMaximize() {
      // setTimeout(() => {
      //
      // }, 10);
    },

    submitForm() {
      this.$refs["copyBillInfoForm"].validate(valid => {
        if (valid) {
          let param = {
            billClass: this.copyBillInfo.billClass,
            billType: this.copyBillInfo.billType,
            remitDt: this.copyBillInfo.remitDt,
            drwrName: this.copyBillInfo.drwrName,
            drwrAcctNo: this.copyBillInfo.drwrAcctNo,
            drweBankName: this.copyBillInfo.drweBankName,
            pyeeName: this.copyBillInfo.pyeeName,
            pyeeAcctNo: this.copyBillInfo.pyeeAcctNo,
            pyeeBankName: this.copyBillInfo.pyeeBankName,
            billMoney: this.copyBillInfo.billMoney,
            dueDt: this.copyBillInfo.dueDt,
            drweBankNo: this.copyBillInfo.drweBankNo,
            drweBankAddr: this.copyBillInfo.drweBankAddr,
            acptName: this.copyBillInfo.acptName,
            acptBankNo: this.copyBillInfo.acptBankNo,
            batchId: this.copyBillInfo.batchId,
            batchCopyBillNum: this.copyBillInfoForm.batchCopyBillNumber
          };
          post(param, "/ce/acpt/paper/apply/acptApplyMain/func_batchCopyPaperAcptBillInfo").then(res => {
            if (res) {
              let msg = res.data.retMsg;
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.$msgTip.success(this, {info: msg});
                this.handleClose();
              } else {
                this.$msgTip.error(this, {info: res.data.retMsg});
              }
            } else {
              this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
            }
          });
        }
      });
    },
    handleClose() {
      this.copyBillInfoForm.batchCopyBillNumber = '';
      this.$refs.copyBillInfoForm.resetFields();
      this.$emit("showCopyBillWinClose", "");
    }
  },
  mounted() {

  }
};
</script>
<style>

</style>
