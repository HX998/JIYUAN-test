<template>
  <h-msg-box v-model="tempOrderAppendInfoDetailWin" width="800" :mask-closable="false" @on-close="handleClose" top="10"
             class="h-form-search-layer" :maximize="true">
    <p slot="header">
      <span v-if="this.paramForm.type=='new'">新增附加信息</span>
      <span v-if="this.paramForm.type=='edit'">修改附加信息</span>
    </p>
    <h-panel>
      <h-form :model="formItem" :label-width="115" ref="formItem" cols="2" class="h-form-search">
        <common-select v-model="formItem.appOrderType" :dictList="this.dictMap.appOrderTypeList"
                       :label="$t('s.i.pay.appOrderType')" prop="appOrderType"
                       :readonly="appOrderTypeReadonly" required @on-change="appOrderTypeChange"></common-select>
        <div v-if="contactFlag">
          <common-select v-model="formItem.tradeMode" :dictList="this.dictMap.tradeModeList"
                         :label="$t('s.i.pay.tradeMode')" prop="tradeMode"
                         :required="contactFlag"></common-select>
          <common-input v-model="formItem.ctrctNo" :label="$t('s.i.pay.ctrctNo')"
                        prop="ctrctNo" :lengthByByte="false" :maxlength="32"
                        :required="contactFlag" :validRules="ctrctNoRule"></common-input>
          <common-date-picker v-model="formItem.occurDate" :label="$t('s.i.pay.occurDate')"
                              prop="occurDate" :required="contactFlag"></common-date-picker>
          <common-type-field v-model="formItem.ctrctAmt" :label="$t('s.i.pay.ctrctAmt')"
                             prop="ctrctAmt" :integerNum="16" :suffixNum="2" :bigTips="false"
                             :required="contactFlag"></common-type-field>
        </div>
        <div v-if="invoiceFlag">
          <common-input v-model="formItem.invoiceNo" :label="$t('s.i.pay.invoiceNo')"
                        prop="invoiceNo" :lengthByByte="false" :maxlength="100"
                        :required="invoiceFlag" type="int"></common-input>
          <common-input v-model="formItem.invoiceCode" :label="$t('s.i.pay.invoiceCode')"
                        prop="invoiceCode" :lengthByByte="false" :maxlength="100"
                        :required="invoiceFlag" type="int"></common-input>
          <common-type-field v-model="formItem.invoiceAmt" :label="$t('s.i.pay.invoiceAmt')"
                             prop="invoiceAmt" :integerNum="16" :suffixNum="2" :bigTips="false"></common-type-field>
          <common-select v-model="formItem.invoiceType" :dictList="this.dictMap.invoiceTypeList"
                         :label="$t('s.i.pay.invoiceType')" prop="invoiceType"></common-select>
          <common-select v-model="formItem.suspiciousOrderFlag" :dictList="this.dictMap.suspiciousOrderFlagList"
                         :label="$t('s.i.pay.suspiciousOrderFlag')" prop="suspiciousOrderFlag" required></common-select>
          <common-input v-model="formItem.suspiciousContent" :label="$t('s.i.pay.suspiciousContent')"
                        prop="suspiciousContent" :lengthByByte="false" :maxlength="256"
                        v-if="suspiciousContentShowFlag" :required="suspiciousContentShowFlag"></common-input>
          <common-input v-model="formItem.remark" :label="$t('s.i.pay.remark')"
                        prop="remark" :lengthByByte="false" :maxlength="256"></common-input>
        </div>
        <div v-if="voucherFlag">
          <common-input v-model="formItem.otherVoucherNo" :label="$t('s.i.pay.otherVoucherNo')"
                        prop="otherVoucherNo" :lengthByByte="false" :maxlength="32"
                        :required="voucherFlag" :validRules="otherVoucherNoRule"></common-input>
          <common-input v-model="formItem.otherVoucherUse" :label="$t('s.i.pay.otherVoucherUse')"
                        prop="otherVoucherUse" :lengthByByte="false" :maxlength="500"></common-input>
        </div>
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
  name: "appendInfoDetail",
  data() {
    return {
      formItem: {
        id: "",
        legalNo: "",
        orderInfoId: "",
        //默认合同
        appOrderType: "AT001",
        tradeMode: "",
        ctrctNo: "",
        occurDate: "",
        ctrctAmt: "",
        invoiceNo: "",
        invoiceCode: "",
        invoiceAmt: "",
        invoiceType: "",
        suspiciousOrderFlag: "",
        suspiciousContent: "",
        remark: "",
        otherVoucherNo: "",
        otherVoucherUse: "",
        optUser: "",
      },
      appOrderTypeReadonly: false,
      submitFlag: false,
      firstOpen: true,
      contactFlag: false,
      invoiceFlag: false,
      voucherFlag: false,
      userInfo: null,
      suspiciousContentShowFlag: false,
      ctrctNoRule: [{test: /^[0-9a-zA-Z]{1,32}$/, trigger: "blur", message: "合同编号由小于32位数字或字母组成"}],
      otherVoucherNoRule: [{test: /^[0-9a-zA-Z]{1,32}$/, trigger: "blur", message: "其他凭证编号由小于32位数字或字母组成"}],
    };
  },
  props: {
    orderAppendInfoDetailWin: {
      type: Boolean,
      default() {
        return false;
      }
    },
    paramForm: {
      id: "",
      payOrderNo: "",
      orderInfoId: "",
      type: ""//new-新增，edit-修改，view-查看
    },
    dictMap: {
      type: Map
    }
  },
  computed: {
    tempOrderAppendInfoDetailWin: {
      get() {
        return this.orderAppendInfoDetailWin;
      },
      set() {
      }
    }
  },
  watch: {
    orderAppendInfoDetailWin(val) {
      if (val === true) {
        if (this.paramForm.type === "edit") {
          this.appOrderTypeReadonly = true;
          this.initFormItem();
        } else {
          this.formItem.orderInfoId = this.paramForm.orderInfoId;
        }
        this.changeFlag();
        this.formItem.optUser = this.userInfo.userId;
        this.formItem.legalNo = this.userInfo.legalNo;
      }
    },
    "formItem.suspiciousOrderFlag": {
      handler(newVal,oldVal) {
        //隐藏可疑内容字段
        if(newVal == 'SM00' || newVal == '') {
          this.suspiciousContentShowFlag = false;
          this.formItem.suspiciousContent = ""
        }
        if(newVal == 'SM01') {
          this.suspiciousContentShowFlag = true;
        }
      },
      immediate: true
    }
  },
  methods: {
    handleClose() {
      this.appOrderTypeReadonly = false;
      this.$refs.formItem.resetFields();
      this.formItem.id = null;
      this.invoiceFlag= false;
      this.contactFlag = false;
      this.voucherFlag = false;
      this.$emit("orderAppendInfoDetailWinClose", "");
    },
    appOrderTypeChange(newVal) {
      if(newVal === 'AT001') {
        this.contactFlag = true;
        this.invoiceFlag = false;
        this.voucherFlag = false;
        this.$nextTick(()=> {
          //其他的字段为空
          // this.$refs['formItem'].resetValidateField("invoiceNo");
          // this.$refs['formItem'].resetValidateField("invoiceCode");
          this.formItem.invoiceNo = "";
          this.formItem.invoiceCode = "";
          this.formItem.invoiceAmt = "";
          this.formItem.invoiceType = "";
          this.formItem.suspiciousOrderFlag = "";
          this.formItem.suspiciousContent = "";
          this.formItem.remark = "";
          this.formItem.otherVoucherNo = "";
          this.formItem.otherVoucherUse = "";
        })
      }else if(newVal === 'AT002') {
        this.contactFlag = false;
        this.invoiceFlag = true;
        this.voucherFlag = false;
        this.$nextTick(()=>{
          this.formItem.tradeMode = "";
          this.formItem.ctrctNo = "";
          this.formItem.occurDate = "";
          this.formItem.ctrctAmt = "";
          //其他的字段为空
          //this.$refs['formItem'].resetValidateField("otherVoucherNo")
          this.formItem.otherVoucherNo = "";
          this.formItem.otherVoucherUse = "";
        })

      }else if(newVal === 'AT003') {
        this.voucherFlag= true;
        this.contactFlag = false;
        this.invoiceFlag = false;
        this.$nextTick(()=>{
          //其他的字段为空
          // this.$refs['formItem'].resetValidateField("invoiceNo");
          // this.$refs['formItem'].resetValidateField("invoiceCode");
          this.formItem.tradeMode = "";
          this.formItem.ctrctNo = "";
          this.formItem.occurDate = "";
          this.formItem.ctrctAmt = "";
          this.formItem.invoiceAmt = "";
          this.formItem.invoiceType = "";
          this.formItem.suspiciousOrderFlag = "";
          this.formItem.suspiciousContent = "";
          this.formItem.remark = "";
        })
      }
    },
    changeFlag() {
      if(this.formItem.appOrderType == "AT001") {
        this.invoiceFlag= false;
        this.contactFlag = true;
        this.voucherFlag = false;
      }else if(this.formItem.appOrderType == "AT002") {
        this.invoiceFlag= true;
        this.contactFlag = false;
        this.voucherFlag = false;
      }else if(this.formItem.appOrderType == "AT003"){
        this.invoiceFlag= false;
        this.contactFlag = false;
        this.voucherFlag = true;
      }
    },
    initFormItem() {
      let params = {id: this.paramForm.id};
      let url = "/pay/order/orderInfoMain/func_getOrderAppendInfo";
      post(params, url).then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.formItem = res.data.retData;
            // this.formItem.occurDate 后端返回的是number
            // console.log(typeof this.formItem.occurDate)
            this.changeFlag();
            this.formItem.occurDate = this.formItem.occurDate + ''
            // if(this.formItem.suspiciousOrderFlag == 'SM00') {
            //   this.suspiciousContentShowFlag = false;
            // }else if(this.formItem.suspiciousOrderFlag == 'SM01') {
            //   this.suspiciousContentShowFlag = true;
            // }
            // if(this.formItem.occurDate != "" && this.formItem.occurDate != null){
            //   this.formItem.occurDate = this.$mount(this.formItem.occurDate,'YYYYMMDD').format("YYYYMMDD")
            // }
          } else {
            this.$msgTip.error(this, {info: res.data.retMsg});
          }
        } else {
          this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
        }
      });
    },
    formAdd() {
      if (this.paramForm.type === "new") {
        this.addAppendInfo();
      } else if (this.paramForm.type === "edit") {
        this.editAppendInfo();
      } else {
        this.handleClose();
      }
    },
    addAppendInfo() {
      this.$refs["formItem"].validate(valid => {
        if (valid) {
          let url = "/pay/order/orderInfoMain/func_addOrderAppendInfo";
          this.formItem.optUser = this.userInfo.userId;
          this.formItem.legalNo = this.userInfo.legalNo;
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
    editAppendInfo() {
      this.$refs["formItem"].validate(valid => {
        if (valid) {
          let url = "/pay/order/orderInfoMain/func_updateOrderAppendInfo";
          this.formItem.optUser = this.userInfo.userId;
          this.formItem.legalNo = this.userInfo.legalNo;
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
  created() {
    this.userInfo = this.$store.getters.userInfo
  }
};
</script>

<style scoped>
.h-import-td {
  padding: 20px 20px 10px 20px;
  border-bottom: 1px solid;
}
</style>
