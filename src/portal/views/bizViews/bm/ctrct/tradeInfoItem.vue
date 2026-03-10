<!-- 客户信息展示列 -->
<template>
  <div>
    <!--票据号码-->
    <common-input v-model="tradeForm.billNo" :label="$t('m.i.billInfo.billPackageNo')" prop="billNo" :readonly="true"></common-input>
    <!--子票区间-->
    <common-input v-if="tradeForm.billOrigin!=='CS01'" v-model="tradeForm.billRange" :label="$t('m.i.billInfo.billRange')" prop="billRange" :readonly="true"></common-input>
    <!--票据包金额-->
    <common-input v-model="tradeForm.billMoney" :label="$t('m.i.billInfo.billPackageMoney')" prop="billMoney" :readonly="true"></common-input>
    <!--贸易金额-->
    <common-input v-model="tradeForm.tradeAmt" :label="$t('m.i.bm.tradeMoney')" prop="tradeAmt" :required="true" :readonly="this.batchParams.isManageOpen=='1'" :validRules="tradeAmtRule"></common-input>
    <!--贸易模式-->
    <common-select v-model="tradeForm.tradeModel" :label="$t('m.i.bm.ctrctTradeModel')" prop="tradeModel" :dictList="this.batchParams.tradeModelList" :required="true" :readonly="this.batchParams.isManageOpen=='1'"></common-select>
    <!--票据行为-->
    <common-select v-model="tradeForm.endorType" :label="$t('m.i.bm.endorType')" prop="endorType" :dictList="this.batchParams.endorTypeList" :readonly="true"></common-select>
    <!--票据行为流水号-->
    <common-input v-if="tradeForm.endorType==='BB02'" v-model="tradeForm.histFlowNo" :label="$t('m.i.bm.histFlowNo')" prop="histFlowNo" :readonly="true"></common-input>
    <!--购买方名称-->
    <common-input v-model="tradeForm.buyerName" :label="$t('m.i.bm.tradeBuyerName')" prop="buyerName" :readonly="true"></common-input>
    <!--购买方社会信用代码 -->
    <common-input  v-model="tradeForm.buyerSocCode" :label="$t('m.i.bm.tradeBuyerSocCode')" class="h-form-long-label"
                   prop="buyerSocCode" :readonly="true"></common-input>
    <!--购买方识别类型 -->
    <common-select v-model="tradeForm.buyerDistType" :label="$t('m.i.bm.tradeBuyerDistTp')"
                   prop="buyerDistType" :dictList="batchParams.distTypeList"  :readonly="true"></common-select>
    <!--购买方账号名称 -->
    <common-input v-if="tradeForm.buyerDistType==='DT02'" v-model="tradeForm.buyerAcctName" :label="$t('m.i.bm.tradeBuyerAcctName')"
                  prop="buyerAcctName" :readonly="true"></common-input>

    <!-- 购买方账号 -->
    <common-input v-model="tradeForm.buyAcctNo" :label="$t('m.i.bm.tradeBuyerAcctNo')"
                  prop="buyAcctNo" :readonly="true"></common-input>

    <!--购买方机构代码 -->
    <common-input v-if="tradeForm.buyerDistType==='DT02'" v-model="tradeForm.buyerBrchCode" :label="$t('m.i.bm.tradeBuyerBrchCode')"
                  prop="buyerBrchCode" :readonly="true"></common-input>

    <!--销售方名称-->
    <common-input v-model="tradeForm.sellerName" :label="$t('m.i.bm.tradeSellerName')" prop="sellerName" :readonly="true"></common-input>
    <!--销售方社会信用代码 -->
    <common-input  v-model="tradeForm.sellerSocCode"  :label="$t('m.i.bm.tradeSellerSocCode')" class="h-form-long-label"
                   prop="sellerSocCode" :readonly="true" ></common-input>

    <!--销售方识别类型 -->
    <common-select v-model="tradeForm.sellerDistType" :label="$t('m.i.bm.tradeSellerDistTp')"
                   prop="sellerDistType" :dictList="batchParams.distTypeList"  :readonly="true"></common-select>
    <!--销售方账号名称 -->
    <common-input v-if="tradeForm.sellerDistType==='DT02'" v-model="tradeForm.sellerAcctName" :label="$t('m.i.bm.tradeSellerAcctName')"
                  prop="sellerAcctName" :readonly="true"></common-input>

    <!-- 销售方账号 -->
    <common-input v-model="tradeForm.sellerAcctNo" :label="$t('m.i.bm.tradeSellerAcctNo')"
                  prop="sellerAcctNo" :readonly="true"></common-input>

    <!--销售方机构代码 -->
    <common-input v-if="tradeForm.sellerDistType==='DT02'" v-model="tradeForm.sellerBrchCode" :label="$t('m.i.bm.tradeSellerBrchCode')"
                  prop="sellerBrchCode" :readonly="true"></common-input>

    <h-col span="24"><hr></h-col>
    <!--发票数量-->
    <common-input v-model="tradeForm.invoiceNum" :label="$t('m.i.bm.invoiceNum')" prop="invoiceNum" :readonly="true"></common-input>

    <!--合同数量-->
    <common-input v-model="tradeForm.ctrctNum" :label="$t('m.i.bm.ctrctNum')" prop="ctrctNum"  :readonly="true" ></common-input>

    <!--其他凭证数量-->
    <common-input v-model="tradeForm.otherVoucherNum" :label="$t('m.i.bm.otherVoucherNum')" prop="otherVoucherNum" :readonly="true"></common-input>


  </div>
</template>

<script>
import { post, on, off } from "@/api/bizApi/commonUtil";
export default {
  name: "tradeInfoItem",
  data() {
    let _this = this;
    return {
      tradeAmtRule:[{
        test: /^(?:[1-9]\d{0,15}|0)(?:\.\d{1,2})?$/,
        trigger: "blur",
        message: "贸易金额(元)必须是大于等于0的数字，最多16位整数且小数位不超过两位"
      }],
    }
  },
  props: {
    tradeForm: {
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
