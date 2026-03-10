<template>
  <h-form-item :label="this.$t('m.i.ebank.applyBankNo')" prop="transFromBankNo" >
    <h-input v-model="formItem['transFromBankNo']" placeholder="" readonly></h-input>
  </h-form-item>
</template>

<script>
    export default {
        name: "transFromBankNo",
      data() {
        return {

        }
      },
      props:{
        formItem : Object || {}
      }
    }
</script>

<style scoped>

</style>
