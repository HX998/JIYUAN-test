<!--退汇管理-退汇详情展示字段-->
<template>
  <div>
    <!--批次号-->
    <common-input v-model="viewDetailForm.batchNo" :label="$t('m.i.common.batchNo')" prop="batchNo" readonly></common-input>
    <!--基础资产种类-->
    <common-select v-model="viewDetailForm.baseAssetType" :label="$t('m.i.bs.baseAssetType')" prop="baseAssetType"
                   :dictList="batchParams.baseAssetTypeList"  readonly></common-select>
    <!--标票产品名称-->
    <common-input v-model="viewDetailForm.stdProductName" :label="$t('m.i.bs.stdProductName')" prop="stdProductName" readonly></common-input>
    <!--标票产品简称-->
    <common-input v-model="viewDetailForm.stdProductShortName" :label="$t('m.i.bs.stdProductShortName')" prop="stdProductShortName" readonly></common-input>
    <!--标票产品代码-->
    <common-input v-model="viewDetailForm.stdProductNo" :label="$t('m.i.bs.stdProductNo')" prop="stdProductNo" readonly></common-input>
    <!--产品规模(元)-->
    <common-type-field v-model="viewDetailForm.creationAmt" :label="$t('m.i.bs.creationAmt')" prop="creationAmt" readonly></common-type-field>
    <!--产品期限(天)-->
    <common-input v-model="viewDetailForm.creationTerm" :label="$t('m.i.bs.creationTerm')" prop="creationTerm" readonly ></common-input>
    <!--"融资利率(%)-->
    <common-rate v-model="viewDetailForm.financeRatePct" :label="$t('m.i.bs.financeRatePct')" prop="financeRatePct" readonly></common-rate>
    <!--收款总额(元)-->
    <common-type-field v-model="viewDetailForm.totalCollectAmt" :label="$t('m.i.bs.totalCollectAmt')" prop="totalCollectAmt" readonly></common-type-field>

  </div>
</template>

<script>
  export default {
    name: "stdCreationReexchangeViewDetail",
    props: {
      viewDetailForm: {
        type: Object,
        default() {
          return {};
        }
      },
      batchParams: {
        type: Object,
        default() {
          return {};
        }
      }
    }
  };
</script>

<style scoped>

</style>
