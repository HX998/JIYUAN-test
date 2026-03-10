<template>
  <div>
    <h-form :model="formItem" :label-width="115" ref="formItem" cols="2" class="h-form-search" onlyBlurRequire>
      <bill-no v-model="formItem.billNo" :label="$t('m.i.billInfo.billPackageNo')"
               prop="billNo" billClass="ME02"
               required :validRules="billNoRule"></bill-no>
      <bill-range :formItem="formItem" :rangeProps="['tempBillRangeStart','tempBillRangeEnd']"></bill-range>
      <common-type-field v-model="formItem.billMoney" :label="$t('m.i.billInfo.billPackageMoney')"
                         :validRules="billMoneyRule"
                         prop="billMoney" :bigTips="false" :integerNum="9" required></common-type-field>
      <common-type-field v-model="formItem.stdAmt" :label="$t('m.i.billInfo.stdAmt')"
                         prop="stdAmt" :bigTips="false" :integerNum="16" :suffixNum="2"></common-type-field>
      <bopp-common-form-btn :title="$t('m.i.common.addition')" @click="addition"></bopp-common-form-btn>
    </h-form>
    <bopp-show-bill-info-list :params="params" ref="billInfoList"></bopp-show-bill-info-list>
  </div>
</template>

<script>
import {post} from "@/api/bizApi/commonUtil";

export default {
  name: "billImportSignalTab",
  data() {
    return {
      formItem: {
        billNo: "",
        tempBillRangeStart: "",
        tempBillRangeEnd: "",
        billMoney: "",
        stdAmt: "",
        //实际上给后端的字段
        billRange: "",
        id: "",
      },
      params: {
        payInfoId: "",
      },
      billMoneyRule: [{test: validBillMoney, trigger: "blur"}],
      billNoRule: [{test: validBillNo, trigger: "blur"}]
    };
    function validBillNo(rule, val, callback) {
      let valLen = val.toString().length
      if(valLen<30) {
        callback(new Error("请输入30位的数字"));
      }else {
        callback()
      }
    }
    function validBillMoney(rule, val, callback) {
      let value = val.toString().replace(/,/g, "");
      let re = /^([1-9]\d{0,8}|0)([.]?|(\.\d{1,2})?)$/;
      if (re.test(value)) {
        if (value > 0 && value <= 100000000) {
          callback();
        } else {
          callback(new Error("票面金额应小于等于100,000,000.00、大于0.00"));
        }
      } else {
        callback(new Error("票据金额为大于0的不超过9位的数字，且小数位不超过两位"));
      }
    }
  },
    props:{
      payInfoId: "",
    },
    methods: {
      handleSearch(){
        this.params.payInfoId = this.payInfoId;
        this.$refs.billInfoList.handleSearch();
      },
      formItemReset(){
        this.$refs.formItem.resetFields();
      },
      //前置位补0
      fixZeroStart(str, n) {
        return (Array(n).join(0) + str).slice(-n);
      },
      addition(){
        this.formItem.id = this.payInfoId;
        //转化 ES2017 ie不支持
        //this.formItem.billRangeStart = this.formItem.tempBillRangeStart.padStart(12, '0') + ',' + this.formItem.tempBillRangeEnd.padStart(12, '0')
        if(this.formItem.tempBillRangeStart == '0') {
          this.$msgTip.info(this,{info: '子票区间起始值不能为0'})
          return
        }
        if((this.formItem.tempBillRangeStart === '' && this.formItem.tempBillRangeEnd !== '') ||
          (this.formItem.tempBillRangeEnd === '' && this.formItem.tempBillRangeStart !== '')) {
          this.$msgTip.info(this,{info: '子票区间起始值和结束值要么都为空，要么都不为空'})
          return
        }
        if(this.formItem.tempBillRangeStart != '' && this.formItem.tempBillRangeStart != '') {
          this.formItem.billRange = this.fixZeroStart(this.formItem.tempBillRangeStart,12) + ',' + this.fixZeroStart(this.formItem.tempBillRangeEnd,12)
        }else{
          this.formItem.billRange = ""
        }

        this.$refs["formItem"].validate(valid => {
          if (valid) {
            let url = "/pay/payment/billPaymentMain/func_addBill";
            post(this.formItem, url).then(res => {
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  //清空数据
                  this.formItem.billNo = "";
                  this.formItem.billMoney = "";
                  this.formItem.billRangeStart = "";
                  this.formItem.tempBillRangeStart = "";
                  this.formItem.tempBillRangeEnd = "";
                  this.formItem.billRange = "";
                  this.formItem.stdAmt = "";

                  this.handleSearch();
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
    }
  }
</script>

<style scoped>

</style>
