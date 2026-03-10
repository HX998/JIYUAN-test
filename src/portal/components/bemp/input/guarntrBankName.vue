<template>
  <h-form-item :label="this.$t('m.i.ebank.guarntrBankName')" prop="guarntrBankName" required>
    <h-input v-model="formItem['guarntrBankName']" placeholder="" :maxlength=125></h-input>
  </h-form-item>
</template>

<script>
  export default {
    name : "guarntrBankName",
    data() {
      return {

      }
    },
    props:{
      formItem : Object || {}
    }
  }
</script>
