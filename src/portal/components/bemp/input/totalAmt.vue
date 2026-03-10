<!-- 票据总额 -->
<template>
  <h-form-item :label="$t('m.i.be.totalAmtByYUAN')" prop="totalAmt" :required="true" :validRules="validRules">
    <h-typefield v-model="itemValue" type="money"  :bigTips="false" placeholder=""></h-typefield>
  </h-form-item>
</template>

<script>
export default {
  name : "totalAmt",
  props:{
    value: {
      type: [String, Number],
      default: ""
    },
    validRules: {
          type: [Array, String]
    }
  },
  computed: {
    itemValue: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    }
  }
}
</script>
