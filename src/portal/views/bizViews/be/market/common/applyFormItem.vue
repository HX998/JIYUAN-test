<!--买入/卖出 新增/修改弹窗共用字段-->
<template>
  <div>

    <common-select v-model="addForm.trDir" :label="$t('m.i.be.tradDir')" prop="trDir" :dictList="batchParams.trDirList"
                   :readonly="true" :required="true"></common-select>
    <common-select v-model="addForm.isAnony" :label="$t('m.i.be.isAnony')" prop="isAnony" :dictList="batchParams.isList"
                   :required="true" :readonly="batchParams.batchType === 'show' || batchParams.batchType === 'accept'"></common-select>
    <bill-type v-model="addForm.billType" :dictList="batchParams.billTypeList" :required="true"
               :readonly="batchParams.batchType === 'show' || batchParams.batchType === 'accept'"></bill-type>
    <bill-class v-model="addForm.billClass" :dictList="batchParams.billClassList" :required="true"
                :readonly="batchParams.batchType === 'show' || batchParams.batchType === 'accept'"></bill-class>
    <common-select v-model="addForm.tradeRange" :label="$t('m.i.be.tradeRange')" prop="tradeRange"
                   :dictList="batchParams.tradeRangeList"
                   :required="true" :readonly="batchParams.batchType === 'show' || batchParams.batchType === 'accept'"></common-select>
    <common-rate v-model="addForm.ratePct" :label="$t('m.i.pe.dealRate')" prop="ratePct" integerNum="2" suffixNum="4"
                  :required="true" :readonly="batchParams.batchType === 'show' || batchParams.batchType === 'accept'"></common-rate>
    <common-select v-model="addForm.subDeal" :label="$t('m.i.be.subDeal')" prop="subDeal" :dictList="batchParams.isList"
                   :required="true" :readonly="batchParams.batchType === 'show' || batchParams.batchType === 'accept'"></common-select>
    <common-select v-model="addForm.clearType" :label="$t('m.i.be.clearType')" prop="clearType"
                   :dictList="batchParams.clearTypeList"
                   :required="true" :readonly="batchParams.batchType === 'show' || batchParams.batchType === 'accept'"></common-select>
    <common-select v-model="addForm.settleMode" :label="$t('m.i.be.settleMode')" prop="settleMode"
                   :dictList="batchParams.settleTypeList"
                   :required="true" :readonly="batchParams.batchType === 'show' || batchParams.batchType === 'accept'"></common-select>

  </div>
</template>

<script>
  export default {
    name: "applyFormItem",
    data() {
      return {
        ratePctRule: [{
          test: /^(\d{1,2}(\.\d{1,4})?|100)$/,
          trigger: "blur",
          message: "利率范围0~100，且小数位不超过四位"
        }]
      };
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
      },
    }
  };
</script>

<style scoped>

</style>
