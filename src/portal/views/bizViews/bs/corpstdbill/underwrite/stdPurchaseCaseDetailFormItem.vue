<!--创设业务 新增/修改弹窗共用字段-->
<template>
  <div>
    <!--认购价格(元)-->
    <common-type-field v-model="addDetailForm.purchasePrice" :label="$t('m.i.bs.purchasePrice')" prop="purchasePrice"
                       :validRules="purchasePriceRule" :required="true" :suffixNum="4"
                       :bigTips="false"></common-type-field>
    <!--认购金额(元)-->
    <common-type-field v-model="addDetailForm.purchaseAmt" :label="$t('m.i.bs.purchaseAmt')" prop="purchaseAmt"
                        :validRules="purchaseAmtRule" :required="true"
                       :bigTips="false"></common-type-field>

  </div>
</template>

<script>

  export default {
    name: "stdPurchaseCaseDetailFormItem",
    components: {},
    data() {
      let _this = this;
      return {
        purchaseAmtRule: [{
          test: /^(?:[1-9]\d{0,15}|0)(?:\.\d{1,2})?$/,
          trigger: "blur",
          message: "认购金额(元)必须是大于等于0的数字，最多16位整数且小数位不超过两位"
        }],
        purchasePriceRule: [{
          test: /^(\d{1,2}(\.\d{1,4})?|100|100\.0|100\.00|100\.000|100\.0000)$/,
          trigger: "blur",
          message: "认购价格(元)0~100，且小数位不超过四位"
        }],
      }
    },
    props: {
      addDetailForm: {
        type: Object,
        default() {
          return {};
        }
      },
      detailParams: {
        type: Object,
        default: {}
      }
    },
    methods: {}
  };
</script>

<style scoped>

</style>
