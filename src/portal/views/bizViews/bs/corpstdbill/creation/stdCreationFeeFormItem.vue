<!-- 创设业务 记账明细弹出窗口-->
<template>
  <div>
    <!--批次号-->
    <common-input v-model="feeForm.batchNo" :label="$t('m.i.common.batchNo')" prop="batchNo" :readonly="true"></common-input>
    <!--基础资产种类-->
    <common-select v-model="feeForm.baseAssetType" :label="$t('m.i.bs.baseAssetType')"
                   prop="baseAssetType" :dictList="batchParams.baseAssetTypeList"  :readonly="true"></common-select>
    <!--标票产品名称-->
    <common-input v-model="feeForm.stdProductName" :label="$t('m.i.bs.stdProductName')" prop="stdProductName" :readonly="true"></common-input>
    <!--标票产品简称-->
    <common-input v-model="feeForm.stdProductShortName" :label="$t('m.i.bs.stdProductShortName')" prop="stdProductShortName" :readonly="true"></common-input>
    <!--标票产品代码-->
    <common-input v-model="feeForm.stdProductNo" :label="$t('m.i.bs.stdProductNo')" prop="stdProductNo"  :readonly="true"></common-input>
    <!--电票账号-->
    <common-input v-model="feeForm.ecdsAcctNo" :label="$t('m.i.bs.ecdsAcctNo')" prop="ecdsAcctNo"  :readonly="true"></common-input>
    <!--电票账户户名-->
    <common-input v-model="feeForm.ecdsAcctName" :label="$t('m.i.bs.ecdsAcctName')" prop="ecdsAcctName" readonly></common-input>
    <!--存托机构名称-->
    <common-input v-model="feeForm.dpstBrchName" :label="$t('m.i.bs.dpstBrchName')" prop="dpstBrchName"
                  :readonly="true"></common-input>
    <!--存托机构代码-->
    <common-input v-model="feeForm.dpstBrchCode" :label="$t('m.i.bs.dpstBrchCode')" prop="dpstBrchCode"
                  :readonly="true"></common-input>
    <!--承销机构名称-->
    <common-input v-model="feeForm.sellBrchName" :label="$t('m.i.bs.sellBrchName')" prop="sellBrchName" :readonly="true"></common-input>
    <!--"融资利率(%)-->
    <common-input v-model="feeForm.financeRatePct" :label="$t('m.i.bs.financeRatePct')" prop="financeRatePct"
                  :readonly="true"></common-input>
    <!--基础资产起始到期日-->
    <common-date-picker v-model="feeForm.beginDueDt" :label="$t('m.i.bs.beginDueDt')" prop="beginDueDt" class="h-form-long-label"
                        :readonly="true" ></common-date-picker>
    <!--基础资产截止到期日-->
    <common-date-picker v-model="feeForm.endDueDt" :label="$t('m.i.bs.endDueDt')" prop="endDueDt" class="h-form-long-label"
                        :readonly="true" ></common-date-picker>
    <!--产品规模（元）-->
    <common-input v-model="feeForm.creationAmt" :label="$t('m.i.bs.creationAmt')" prop="creationAmt"
                  :readonly="true"></common-input>
    <!--票据张数-->
    <common-input v-model="feeForm.creationNum" :label="$t('m.i.bs.creationNum')" prop="creationNum"
                  :readonly="true"></common-input>
    <!--产品期限-->
    <common-input v-model="feeForm.creationTerm" :label="$t('m.i.bs.creationTerm')" prop="creationTerm" :readonly="true"></common-input>
    <!--费用总额-->
    <common-input v-model="feeForm.totalFeeAmt" :label="$t('m.i.bs.totalFeeAmt')" prop="totalFeeAmt" :readonly="true"></common-input>
    <!--费用总额-->
    <common-input v-model="feeForm.totalSellFeeAmt" :label="$t('m.i.bs.totalSellFeeAmt')" prop="totalSellFeeAmt" :readonly="true"></common-input>
    <!--结算总额-->
    <common-input v-model="feeForm.totalSettleAmt" :label="$t('m.i.bs.totalSettleAmt')" prop="totalSettleAmt" :readonly="true"></common-input>
    <!--披露日期-->
    <common-date-picker v-model="feeForm.publishDt" :label="$t('m.i.bs.publishDt')" prop="publishDt"
                        :readonly="true"></common-date-picker>
    <!--申报截止时间-->
    <common-date-picker v-model="feeForm.declareEndDtTm" :label="$t('m.i.bs.declareEndDtTm')" prop="declareEndDtTm" type="datetime"
                        :readonly="true"></common-date-picker>
    <!--申购日期-->
    <common-date-picker v-model="feeForm.purchaseDt" :label="$t('m.i.bs.purchaseDt')" prop="purchaseDt"
                        :readonly="true"></common-date-picker>
    <!--缴款日期-->
    <common-date-picker v-model="feeForm.raiseDt" :label="$t('m.i.bs.raiseDt')" prop="raiseDt"
                        :readonly="true"></common-date-picker>
    <!--兑付日期-->
    <common-date-picker v-model="feeForm.paymentDt" :label="$t('m.i.bs.paymentDt')" prop="paymentDt"
                        :readonly="true"></common-date-picker>
    <!--创设结果-->
    <common-select v-model="feeForm.purchaseResult" :label="$t('m.i.bs.purchaseResult')"
                   prop="purchaseResult" :dictList="batchParams.purchaseResultList" :readonly="true"></common-select>
    <!--流通场所-->
    <common-select v-model="feeForm.transPlace" :label="$t('m.i.bs.transPlace')"
                   prop="transPlace" :dictList="batchParams.transPlaceList" :readonly="true"></common-select>


  </div>
</template>

<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";
  export default {
    name: "feeFormItem",
    data() {
      let _this = this;
      return {

      }
    },
    props: {
      feeForm: {
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
