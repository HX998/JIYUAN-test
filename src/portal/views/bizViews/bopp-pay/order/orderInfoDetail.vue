<template>
  <h-msg-box v-model="tempOrderInfoDetailWin" width="800" :mask-closable="false" @on-close="handleClose" top="10"
             class="h-form-search-layer" :maximize="true">
    <p slot="header">
      <span>订单信息维护</span>
    </p>
    <h-panel>
      <h-form :model="formItem" :label-width="115" ref="formItem" cols="2" class="h-form-search">
        <bopp-show-platform-input :label="$t('s.i.pay.platformName')" v-model="formItem.platformName"
                             prop="platformName" :readonly="true" :required="true"
                             @platformChange="platformChange" :clearVal="clearVal"
                             v-if="this.paramForm.type === 'new'"></bopp-show-platform-input>
        <common-input v-model="formItem.platformName" :label="$t('s.i.pay.platformName')"
                      prop="platformName" readonly :required="true" v-else></common-input>
        <common-input v-model="formItem.payOrderNo" :label="$t('s.i.pay.payOrderNo')"
                      prop="payOrderNo" :validRules="payOrderNoRule" :maxlength="35"
                      :readonly="this.paramForm.type !== 'new'" :required="true"></common-input>
        <common-input v-model="formItem.payOrderDesc" :label="$t('s.i.pay.payOrderDesc')"
                      prop="payOrderDesc" :lengthByByte="false" :maxlength="128"
                      :readonly="readonly" :required="true"></common-input>
        <common-type-field v-model="formItem.payOrderAmt" :label="$t('s.i.pay.payOrderAmt')" prop="payOrderAmt"
                           :readonly="readonly" :required="true" :validRules="payOrderAmtRule"
                           :bigTips="false" :integerNum="16"></common-type-field>
        <common-input v-model="formItem.drweEnterpriseName" :label="$t('s.i.pay.drweEnterpriseName')"
                      prop="drweEnterpriseName" :readonly="readonly" :lengthByByte="false" :maxlength="60"
                      :required="true"></common-input>
        <common-input v-model="formItem.drweEnterpriseSocCode" :label="$t('s.i.pay.drweEnterpriseSocCode')"
                      prop="drweEnterpriseSocCode" :readonly="readonly" className="h-form-long-label"
                      :validRules="socCodeRule" :maxlength="18" :required="true"></common-input>
        <common-input v-model="formItem.drweAcctNo" :label="$t('s.i.pay.drweAcctNo')" prop="drweAcctNo"
                      :readonly="readonly" :validRules="acctNoRule" :maxlength="32" :required="true"></common-input>
        <common-input v-model="formItem.drweBankNo" :label="$t('s.i.pay.drweBankNo')" prop="drweBankNo"
                      :readonly="readonly" :validRules="bankNoRule" :maxlength="12" :required="true"></common-input>
        <common-input v-model="formItem.pyeeEnterpriseName" :label="$t('s.i.pay.pyeeEnterpriseName')"
                      prop="pyeeEnterpriseName" :readonly="readonly" :lengthByByte="false" :maxlength="60"
                      :required="true"></common-input>
        <common-input v-model="formItem.pyeeEnterpriseSocCode" :label="$t('s.i.pay.pyeeEnterpriseSocCode')"
                      prop="pyeeEnterpriseSocCode" :readonly="readonly" className="h-form-long-label"
                      :validRules="socCodeRule" :maxlength="18" :required="true"></common-input>
        <common-input v-model="formItem.pyeeAcctNo" :label="$t('s.i.pay.pyeeAcctNo')" prop="pyeeAcctNo"
                      :readonly="readonly" :validRules="acctNoRule" :maxlength="32" :required="true"></common-input>
        <common-input v-model="formItem.pyeeBankNo" :label="$t('s.i.pay.pyeeBankNo')" prop="pyeeBankNo"
                      :readonly="readonly" :validRules="bankNoRule" :maxlength="12" :required="true"></common-input>
        <common-input v-model="formItem.remark" :label="$t('s.i.pay.remark')" prop="remark"
                      :readonly="readonly" :lengthByByte="false" :maxlength="256"></common-input>
      </h-form>
    </h-panel>
    <!-- 弹出框模式底部按钮 -->
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{ $t("m.i.common.cancle") }}</h-button>
      <h-button type="primary" v-if="submitFlag" disabled>{{ $t("m.i.common.submiting") }}</h-button>
      <h-button type="primary" v-else @click="formAdd()">{{ $t("m.i.common.commit") }}</h-button>
    </div>
  </h-msg-box>
</template>

<script>
import {post} from "@/api/bizApi/commonUtil";

export default {
  name: "orderInfoDetail",
  data() {
    return {
      formItem: {
        legalNo: "",
        id: "",
        orderInfoId: "",
        payOrderNo: "",
        platformNo: "",
        platformName: "",
        payOrderDesc: "",
        payOrderAmt: "",
        billLimitType: "",
        billPayAmt: "",
        cashPayAmt: "",
        cashPayAcctName: "",
        cashPayAcctNo: "",
        cashPayBankNo: "",
        drweEnterpriseName: "",
        drweEnterpriseSocCode: "",
        drweAcctNo: "",
        drweBankNo: "",
        pyeeEnterpriseName: "",
        pyeeEnterpriseSocCode: "",
        pyeeAcctNo: "",
        pyeeBankNo: "",
        remark: "",
        optUser: "",
      },
      payOrderDueDtTm: "",
      readonly: false,
      submitFlag: false,
      payOrderNoRule: [{test: /^[0-9a-zA-Z]{1,35}$/, trigger: "blur", message: "订单编号由小于35位数字或字母组成"}],
      bankNoRule: [{test: /^[0-9]{12}$/, trigger: "blur", message: "行号由12位数字组成"}],
      acctNoRule: [{test: /^[0-9a-zA-Z]{1,32}$/, trigger: "blur", message: "账号由小于32位数字或字母组成"}],
      socCodeRule: [{
        test: /^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/,
        trigger: "blur",
        message: "统一社会信用代码由18位数字或大写字母组成"
      }],
      payOrderAmtRule: [{test: validPayOrderAmt, trigger: "blur"}],
    };

    function validPayOrderAmt(rule, val, callback) {
      let value = val.toString().replace(/,/g, "");
      let re = /^([1-9]\d{0,16}|0)([.]?|(\.\d{1,2})?)$/;
      if (re.test(value)) {
        if (value > 0) {
          callback();
        } else {
          callback(new Error("订单交易金额应小于等于100,000,000.00、大于0.00"));
        }
      } else {
        callback(new Error("订单交易金额为大于0的不超过16位的数字，且小数位不超过两位"));
      }
    }
  },
  props: {
    orderInfoDetailWin: {
      type: Boolean,
      default() {
        return false;
      }
    },
    paramForm: {
      id: "",
      type: ""//new-新增，edit-修改，view-查看
    },
    dictMap: {
      type: Map
    }
  },
  computed: {
    tempOrderInfoDetailWin: {
      get() {
        return this.orderInfoDetailWin;
      },
      set() {
      }
    }
  },
  watch: {
    orderInfoDetailWin(val) {
      if (val === true) {
        if (this.paramForm.type === "edit" || this.paramForm.type === "view") {
          this.initFormItem();
        } else {
          this.formItem.payOrderNo = this.paramForm.payOrderNo;
          this.formItem.orderInfoId = this.paramForm.orderInfoId;
        }
      }
    }
  },
  methods: {
    handleClose() {
      this.readonly = false;
      this.$refs.formItem.resetFields();
      this.payOrderDueDtTm = "";
      this.formItem.id = null;
      this.$emit("orderInfoDetailWinClose", "");
    },
    platformChange(info) {
      this.formItem.platformNo = info.memberId;
      this.formItem.platformName = info.memberName;
    },
    clearVal() {
      this.formItem.platformNo = "";
      this.formItem.platformName = "";
    },
    initFormItem() {
      let params = {id: this.paramForm.id};
      let url = "/pay/order/orderInfoMain/func_getOrderInfo";
      post(params, url).then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.formItem = res.data.retData;
            //操作员编号
            this.formItem.optUser = this.$store.getters.userInfo.userId
            if (this.formItem.payOrderDueDtTm) {
              let timStr = this.formItem.payOrderDueDtTm + "";
              if (timStr.length < 6) {
                timStr = "0" + timStr;
              }
              this.payOrderDueDtTm = this.$moment(timStr, "HH:mm:ss").format("HH:mm:ss");
            }
            this.readonly = (this.paramForm.type === "view");
          } else {
            this.$msgTip.error(this, {info: res.data.retMsg});
          }
        } else {
          this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
        }
      });
    },
    formAdd() {
      if (this.paramForm.type === "edit" || this.paramForm.type === "new") {
        this.addInfo();
      } else {
        this.handleClose();
      }
    },
    addInfo() {
      this.$refs["formItem"].validate(valid => {
        if (valid) {
          let url =  "/pay/order/orderInfoMain/func_addOrderInfo";
          if(this.paramForm.type === 'edit') {
            url =  "/pay/order/orderInfoMain/func_updateOrderInfo";
          }
          //this.formItem.payOrderDueDtTm = this.payOrderDueDtTm ? this.payOrderDueDtTm.replaceAll(":", "") : "";
          post(this.formItem, url).then(res => {
            if (res) {
              let msg = res.data.retMsg;
              let retCode = res.data.retCode;
              if (retCode == "000000") {
                this.handleClose();
              } else {
                this.$msgTip.error(this, {info: msg});
              }
            } else {
              this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
            }
          });
        }
      });
    },
  },
  mounted() {

  },
  created() {
    this.formItem.legalNo = this.$store.getters.userInfo.legalNo
    this.formItem.optUser = this.$store.getters.userInfo.userId
  }
}
</script>

<style scoped>

</style>
