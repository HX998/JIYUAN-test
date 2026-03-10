<template>
  <h-form-item :label="this.$t('m.i.ebank.guarntrBankNo')" prop="guarntrBankNo" required>
    <h-input v-model="formItem['guarntrBankNo']" placeholder="" :maxlength=12></h-input>
  </h-form-item>
</template>

<script>
  export default {
    name : "guarntrBankNo",
    data() {
      return {

      }
    },
    props:{
      formItem : Object || {}
    }
  }
</script>
