<!--最小单张到期起始日(万元) -->
<template>
  <h-form-item :label="$t('m.i.be.minBillAmt')" prop="minBillAmt" :valid="formItem" :validRules="validRules">
    <h-typefield v-model="itemValue" type="money" placeholder=""></h-typefield>
  </h-form-item>
</template>

<script>
export default {
  name: "minBillAmtByMillion",
  props: {
    validRules: {
      type: [Array, String]
    },
    value: {
      type: [String, Number],
      default: ""
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
