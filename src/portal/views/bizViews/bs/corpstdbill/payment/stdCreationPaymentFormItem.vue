<!-- 创设业务 记账明细弹出窗口-->
<template>
  <div>
    <!--批次号-->
    <common-input v-model="paymentForm.batchNo" :label="$t('m.i.common.batchNo')" prop="batchNo" :readonly="true"></common-input>
    <!--基础资产种类-->
    <common-select v-model="paymentForm.baseAssetType" :label="$t('m.i.bs.baseAssetType')"
                   prop="baseAssetType" :dictList="batchParams.baseAssetTypeList"  :readonly="true"></common-select>
    <!--标票产品名称-->
    <common-input v-model="paymentForm.stdProductName" :label="$t('m.i.bs.stdProductName')" prop="stdProductName" :readonly="true"></common-input>
    <!--标票产品简称-->
    <common-input v-model="paymentForm.stdProductShortName" :label="$t('m.i.bs.stdProductShortName')" prop="stdProductShortName" :readonly="true"></common-input>
    <!--标票产品代码-->
    <common-input v-model="paymentForm.stdProductNo" :label="$t('m.i.bs.stdProductNo')" prop="stdProductNo"  :readonly="true"></common-input>
    <!--产品规模（元）-->
    <common-input v-model="paymentForm.creationAmt" :label="$t('m.i.bs.creationAmt')" prop="creationAmt"
                  :readonly="true"></common-input>
    <!--票据张数-->
    <common-input v-model="paymentForm.creationNum" :label="$t('m.i.bs.creationNum')" prop="creationNum"
                  :readonly="true"></common-input>
    <!--产品期限-->
    <common-input v-model="paymentForm.creationTerm" :label="$t('m.i.bs.creationTerm')" prop="creationTerm" :readonly="true"></common-input>
    <!--产品兑付日期-->
    <common-date-picker v-model="paymentForm.paymentDt" :label="$t('m.i.bs.prodPaymentDt')" prop="paymentDt"
                        :readonly="true"></common-date-picker>
    <!--本次兑付金额（元）-->
    <common-input v-model="paymentForm.currPaymentAmtStr" :label="$t('m.i.bs.currPaymentAmt')" prop="currPaymentAmt"
                  :readonly="true"></common-input>

    <!--历史兑付金额（元）-->
    <common-input v-model="paymentForm.hisPaymentAmt" :label="$t('m.i.bs.hisPaymentAmt')" prop="hisPaymentAmt"
                  :readonly="true"></common-input>

    <!--兑付日期-->
    <common-date-picker v-model="paymentForm.currPaymentDt" :label="$t('m.i.bs.paymentDt')" prop="currPaymentDt"
                        :readonly="true"></common-date-picker>

    <!--已收回金额（元）-->
    <common-input v-model="paymentForm.dueRecoverSumAmtStr" :label="$t('m.i.bs.dueRecoverSumAmt')" prop="dueRecoverSumAmt"
                  :readonly="true"></common-input>

    <!--未收回金额（元）-->
    <common-input v-model="paymentForm.notRecoverSumAmt" :label="$t('m.i.bs.notRecoverSumAmt')" prop="notRecoverSumAmt"
                  :readonly="true"></common-input>

    <!--兑付状态-->
    <common-select v-model="paymentForm.cashStatus" :label="$t('m.i.be.cashStatus')"
                   prop="cashStatus" :dictList="batchParams.stdCashStatusList" :readonly="true" ></common-select>

  </div>
</template>

<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";
  export default {
    name: "stdCreationPaymentFormItem",
    data() {
      let _this = this;
      return {

      }
    },
    props: {
      paymentForm: {
        type: Object,
        default() {
          return {};
        }
      },
      batchParams: {
        type: Object,
        default: {}
      }
    }
  };
</script>

<style scoped>

</style>
