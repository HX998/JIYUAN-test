<template>
  <h-form-item :label="this.$t('m.i.ebank.guarntrAcctNo')" prop="guarntrAcctNo" required>
    <h-input v-model="formItem['guarntrAcctNo']" placeholder="" :maxlength=35></h-input>
  </h-form-item>
</template>

<script>
  export default {
    name : "guarntrAcctNo",
    data() {
      return {

      }
    },
    props:{
      formItem : Object || {}
    }
  }
</script>
