<template>
  <h-msg-box v-model="tempChangePaymentFlowWin" width="800" :mask-closable="false" @on-close="handleClose"
             class="h-form-search-layer" :maximize="true">
    <p slot="header">
      <span>支付流水变更</span>
    </p>
    <h-panel>
      <h-form :model="formItem" :label-width="115" ref="formItem" cols="2" class="h-form-search">
        <common-input v-model="formItem.platformName" :label="$t('s.i.pay.platformName')" prop="platformName"
                      readonly></common-input>
        <common-input v-model="formItem.payOrderNo" :label="$t('s.i.pay.payOrderNo')" prop="payOrderNo"
                      readonly></common-input>
        <common-input v-model="formItem.payOrderDesc" :label="$t('s.i.pay.payOrderDesc')" prop="payOrderDesc"
                      readonly></common-input>
        <common-type-field v-model="formItem.payOrderAmt" :label="$t('s.i.pay.payOrderAmt')" prop="payOrderAmt"
                           readonly></common-type-field>
        <common-input v-model="formItem.payFlowNo" :label="$t('s.i.pay.payFlowNo')" prop="payFlowNo"
                      readonly></common-input>
        <common-select v-model="formItem.changeType" :label="$t('s.i.pay.changeType')" prop="changeType"
                       :dictList="this.dictMap.ordrNtfyMaCodeList" required @on-change="changeChangeType"></common-select>
        <common-select v-model="formItem.payFlowStatus" :label="$t('s.i.pay.payFlowStatus')" prop="payFlowStatus"
                       :dictList="this.tempPymnIdStsCodeList"
                       :required="changeStatus" :readonly="!changeStatus"></common-select>
        <common-select v-model="formItem.billLimitType" :label="$t('s.i.pay.billLimitType')"
                       prop="billLimitType" :dictList="this.dictMap.dftTypeCodeList" readonly></common-select>
        <common-type-field v-model="formItem.billPayAmt" :label="$t('s.i.pay.billPayAmt')" prop="billPayAmt"
                           readonly></common-type-field>
        <common-type-field v-model="formItem.cashPayAmt" :label="$t('s.i.pay.cashPayAmt')" prop="cashPayAmt"
                           readonly></common-type-field>
        <common-input v-model="formItem.cashPayAcctName" :label="$t('s.i.pay.cashPayAcctName')"
                      prop="cashPayAcctName" readonly></common-input>
        <common-input v-model="formItem.cashPayAcctNo" :label="$t('s.i.pay.cashPayAcctNo')" prop="cashPayAcctNo"
                      readonly></common-input>
        <common-input v-model="formItem.cashPayBankNo" :label="$t('s.i.pay.cashPayBankNo')" prop="cashPayBankNo"
                      readonly className="h-form-long-label"></common-input>
        <common-input v-model="formItem.drweEnterpriseName" :label="$t('s.i.pay.drweEnterpriseName')"
                      prop="drweEnterpriseName" readonly></common-input>
        <common-input v-model="formItem.drweEnterpriseSocCode" :label="$t('s.i.pay.drweEnterpriseSocCode')"
                      prop="drweEnterpriseSocCode" readonly className="h-form-long-label"></common-input>
        <common-input v-model="formItem.drweAcctNo" :label="$t('s.i.pay.drweAcctNo')" prop="drweAcctNo"
                      :required="changeInfo" :readonly="!changeInfo" :maxlength="32"></common-input>
        <common-input v-model="formItem.drweBankNo" :label="$t('s.i.pay.drweBankNo')" prop="drweBankNo"
                      :required="changeInfo" :readonly="!changeInfo" :maxlength="12"></common-input>
        <common-input v-model="formItem.drweBranchName" :label="$t('s.i.pay.drweBranchName')" prop="drweBranchName"
                      readonly className="h-form-long-label"></common-input>
        <common-input v-model="formItem.pyeeEnterpriseName" :label="$t('s.i.pay.pyeeEnterpriseName')"
                      prop="pyeeEnterpriseName" readonly :lengthByByte="false"></common-input>
        <common-input v-model="formItem.pyeeEnterpriseSocCode" :label="$t('s.i.pay.pyeeEnterpriseSocCode')"
                      prop="pyeeEnterpriseSocCode" className="h-form-long-label" readonly></common-input>
        <common-input v-model="formItem.pyeeAcctNo" :label="$t('s.i.pay.pyeeAcctNo')" prop="pyeeAcctNo"
                      :required="changeInfo" :readonly="!changeInfo" :maxlength="32"></common-input>
        <common-input v-model="formItem.pyeeBankNo" :label="$t('s.i.pay.pyeeBankNo')" prop="pyeeBankNo"
                      :required="changeInfo" :readonly="!changeInfo" :maxlength="12"></common-input>
        <common-input v-model="formItem.pyeeBranchName" :label="$t('s.i.pay.pyeeBranchName')" prop="pyeeBranchName"
                      readonly className="h-form-long-label"></common-input>
        <common-input v-model="formItem.remark" :label="$t('s.i.pay.remark')" prop="remark"
                      readonly></common-input>
      </h-form>
    </h-panel>
    <!-- 弹出框模式底部按钮 -->
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{ $t("m.i.common.close") }}</h-button>
      <h-button type="primary" v-if="submitFlag" disabled>{{ $t("m.i.common.submiting") }}</h-button>
      <h-button type="primary" v-else @click="formAdd()">{{ $t("m.i.common.commit") }}</h-button>
    </div>
  </h-msg-box>
</template>

<script>
import {post} from "@/api/bizApi/commonUtil";

export default {
  name: "changePaymentFlow",
  data() {
    return {
      formItem: {
        legalNo: "",
        memberId: "",
        branchCode: "",
        platformName: "",
        payOrderNo: "",
        payOrderDesc: "",
        payOrderAmt: "",
        payFlowNo: "",
        changeType: "",
        payFlowStatus: "",
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
        drweBranchName: "",
        pyeeEnterpriseName: "",
        pyeeEnterpriseSocCode: "",
        pyeeAcctNo: "",
        pyeeBankNo: "",
        pyeeBranchName: "",
        remark: "",
      },
      tempPymnIdStsCodeList: [],
      pymnIdStsCodeList: [],
      commitItem: {},
      addItem: {
        platformName: "",
        payOrderNo: "",
        payOrderDesc: "",
        payOrderAmt: "",
        payFlowNo: "",
        changeType: "",
        payFlowStatus: "",
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
        drweBranchName: "",
        pyeeEnterpriseName: "",
        pyeeEnterpriseSocCode: "",
        pyeeAcctNo: "",
        pyeeBankNo: "",
        pyeeBranchName: "",
        remark: "",
      },
      changeStatus: false,
      changeInfo: false,
      submitFlag: false,
      changeTypeList: [],
      userInfo: null,
    }
  },
  props: {
    changePaymentFlowWin: {
      type: Boolean,
      default() {
        return false;
      }
    },
    param: {
      payInfoId: "",
    },
    dictMap: {
      type: Map
    }
  },
  computed: {
    tempChangePaymentFlowWin: {
      get() {
        return this.changePaymentFlowWin;
      },
      set() {
      }
    }
  },
  watch: {
    changePaymentFlowWin(val) {
      if (val === true) {
        this.initFormItem();
      }
    }
  },
  methods: {
    handleClose() {
      this.$refs.formItem.resetFields();
      this.$emit("changePaymentFlowWinClose", "");
    },
    changeChangeType(val) {
      if (val === "ONT02") {
        this.changeStatus = true;
        this.changeInfo = false;
        this.formItem.pyeeAcctNo = this.addItem.pyeeAcctNo;
        this.formItem.pyeeBankNo = this.addItem.pyeeBankNo;
        this.formItem.drweAcctNo = this.addItem.drweAcctNo;
        this.formItem.drweBankNo = this.addItem.drweBankNo;
        this.tempPymnIdStsCodeList= this.pymnIdStsCodeList
      } else if (val === "ONT03") {
        this.changeStatus = false;
        this.changeInfo = true;
        this.formItem.payFlowStatus = this.addItem.payFlowStatus;
        this.tempPymnIdStsCodeList= this.dictMap.pymnIdStsCodeList
      } else {
        this.changeStatus = false;
        this.changeInfo = false;
      }
    },
    initFormItem() {
      let params = {id: this.param.payInfoId};
      let url = "/pay/order/orderInfoMain/func_queryOrderPayInfoDtoById";
      post(params, url).then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.addItem = res.data.retData;
            this.formItem = Object.assign({},this.formItem,this.addItem)
            this.userInfo = this.$store.getters.userInfo
            this.formItem.legalNo = this.userInfo.legalNo
            this.formItem.memberId = this.userInfo.memberId
            this.formItem.branchCode = this.userInfo.cepsBrchCode
            //this.tempPymnIdStsCodeList=this.dictMap.pymnIdStsCodeList
            this.tempPymnIdStsCodeList = this.dictMap.pymnIdStsCodeList;
            this.pymnIdStsCodeList = this.dictMap.pymnIdStsCodeList;
            this.pymnIdStsCodeList = this.pymnIdStsCodeList.filter(item=> {
              return item.key !== 'PIS02'
            })
          } else {
            this.$msgTip.error(this, {info: res.data.retMsg});
          }
        } else {
          this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
        }
      });
    },
    formAdd() {
      this.$refs["formItem"].validate(valid => {
        if (valid) {
          if (this.formItem.changeType === 'ONT02' && this.formItem.payFlowStatus === 'PIS02') {
            this.$msgTip.error(this, {info: "支付流水变更类型为状态变更时，支付流水状态不能选择已发起"});
            return;
          }
          this.commitItem = Object.assign({},this.commitItem,this.formItem)
          //信息变更的时候 支付流水状态不传
          if (this.formItem.changeType === 'ONT03') {
            this.commitItem.payFlowStatus = "";
          }
          let url = "/pay/order/orderInfoMain/func_changePaymentInfo";
          post(this.commitItem , url).then(res => {
            if (res) {
              let msg = res.data.retMsg;
              let retCode = res.data.retCode;
              if (retCode === "000000") {
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
    }
  },
}
</script>

<style scoped>

</style>
