<!--匿名点击正回购 新增/修改弹窗共用字段-->
<template>
  <div>
    <!--业务类型-->
    <common-select v-model="addForm.busiType" :label="$t('m.i.common.busiType')" prop="busiType" :dictList="batchParams.busiTypeList"
                   :readonly="true"></common-select>
    <!--报价单编号-->
    <common-input v-model="addForm.quoteNo" :label="$t('m.i.be.quoteNo')" prop="quoteNo" :readonly="true"></common-input>
    <!--成交单编号-->
    <common-input v-model="addForm.dealNo" :label="$t('m.i.be.dealNo')" prop="dealNo" :readonly="true"></common-input>
    <!--本方机构名称-->
    <common-input v-model="addForm.saleBrchName" :label="$t('m.i.be.ownBrchName')" prop="saleBrchName" :readonly="true"></common-input>
    <!--本方交易员名称-->
    <common-input v-model="addForm.saleTraderName" :label="$t('m.i.be.traderName')" prop="saleTraderName" :readonly="true"></common-input>
    <!--对方机构名称-->
    <common-input v-model="addForm.buyBrchName" :label="$t('m.i.be.otherBrchName')" prop="buyBrchName" :readonly="true"></common-input>
    <!--对方机构代码-->
    <common-input v-model="addForm.buyBrchCode" :label="$t('m.i.be.custBrchCode')" prop="buyBrchCode" :readonly="true"></common-input>
    <!--对方非法人产品-->
    <common-input v-model="addForm.buyProductName" :label="$t('m.i.be.custProductNo')" prop="buyProductName" :readonly="true"></common-input>
    <!--对方交易员名称-->
    <common-input v-model="addForm.buyTraderName" :label="$t('m.i.be.custTraderName')" prop="buyTraderName" :readonly="true"></common-input>
    <!--对方交易员ID-->
    <common-input v-model="addForm.buyTraderNo" :label="$t('m.i.be.custTraderNo')" prop="buyTraderNo" :readonly="true"></common-input>
    <!--票据种类-->
    <common-select v-model="addForm.billType" :label="$t('m.i.billInfo.billType')" prop="billType" :dictList="batchParams.billTypeList"
                   :readonly="true"></common-select>
    <!--票据介质-->
    <common-select v-model="addForm.billClass" :label="$t('m.i.billInfo.billClass')" prop="billClass" :dictList="batchParams.billClassList"
                   :readonly="true"></common-select>
    <!--清算类型-->
    <common-select v-model="addForm.clearType" :label="$t('m.i.be.clearType')" prop="clearType" :dictList="batchParams.clearTypeList"
                   :readonly="true"></common-select>
    <!--结算方式-->
    <common-select v-model="addForm.settleMode" :label="$t('m.i.be.settleMode')" prop="settleMode" :dictList="batchParams.settleTypeList"
                   :readonly="true"></common-select>
    <!--清算速度-->
    <common-select v-model="addForm.clearSpeed" :label="$t('m.i.be.clearSpeed')"prop="clearSpeed" :dictList="batchParams.clearSpeedList"
                   :readonly="true"></common-select>
    <!--首期结算日-->
    <common-date-picker v-model="addForm.firstSettleDt" :label="$t('m.i.be.firstSettleDate')" prop="firstSettleDt" :readonly="true"></common-date-picker>
    <!--回购期限-->
    <common-input v-model="addForm.tenorDays" :label="$t('m.i.be.repoTerm')" prop="tenorDays" :readonly="true"></common-input>
    <!--期限品种-->
    <common-select v-model="addForm.tenorVarieties" :label="$t('m.i.be.tenorVarieties')" prop="tenorVarieties" :dictList="batchParams.tenorVarietiesList"
                   :readonly="true"></common-select>
    <!--到期结算日-->
    <common-date-picker v-model="addForm.dueSettleDt" :label="$t('m.i.be.dueSettleDt')" prop="dueSettleDt" :readonly="true"></common-date-picker>
    <!--回购利率-->
    <common-type-field v-model="addForm.ratePct" :label="$t('m.i.be.repurchaseRate')" prop="ratePct"  :suffixNum="4" :readonly="true"></common-type-field>
    <!--回购金额-->
    <common-type-field v-model="addForm.buyBackTotalAmt" :label="$t('m.i.pe.buyBackTotalAmt')" prop="buyBackTotalAmt"  :readonly="true"></common-type-field>
    <!--首期结算金额-->
    <common-type-field v-model="addForm.firstSettleAmt" :label="$t('m.i.be.firstSettleAmtByUnit')" prop="firstSettleAmt" :readonly="true"></common-type-field>
    <!--到期结算金额-->
    <common-type-field v-model="addForm.dueSettleAmt" :label="$t('m.i.be.dueSettleAmtByUnit')" prop="dueSettleAmt" :readonly="true"></common-type-field>
    <!--应付利息-->
    <common-type-field v-model="addForm.firstPayInterest" :label="$t('m.i.be.payInterestByUnit')" prop="firstPayInterest" :readonly="true"></common-type-field>
    <!--信用主体类型-->
    <common-select v-model="addForm.creditMainBrchClass" :label="$t('m.i.billInfo.creditMainBankType')"prop="creditMainBrchClass" :dictList="batchParams.creditMajorList"
                   :readonly="true"></common-select>
    <!--最晚结算时间-->
    <common-input v-model="addForm.setTm" :label="$t('m.i.be.setTm')" prop="setTm" :readonly="true"></common-input>
    <!--成交时间-->
    <common-date-picker v-model="addForm.dealDtTm" :label="$t('m.i.common.dealDtTm')" prop="dealDtTm" :readonly="true" format="yyyy-MM-dd HH:mm:ss"></common-date-picker>
    <!--提票超时时间-->
    <common-input v-model="addForm.respTm" :label="$t('m.i.be.ticketOverTime')" prop="respTm" :readonly="true"></common-input>
    <!--票据总额-->
    <common-type-field v-model="addForm.totalAmt" :label="$t('m.i.common.totalAmtBillPackage')" prop="totalAmt"  :readonly="true"></common-type-field>
    <!--票据张数-->
    <common-input v-model="addForm.totalNum" :label="$t('m.i.common.totalNumBillPackage')" prop="totalNum" :readonly="true"></common-input>
  </div>
</template>

<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";
  export default {
    name: "extrackBillFormItem",
    data() {
      let _this = this;
      return {
      }
    },
    props: {
      addForm: {
        type: Object,
        default() {
          return {};
        }
      },
      batchParams: {
        type: Object,
        default: {}
      }
    },
    methods:{

    }
  };
</script>

<style scoped>

</style>
