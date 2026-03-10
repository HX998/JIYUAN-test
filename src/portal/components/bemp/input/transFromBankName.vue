<template>
  <h-form-item :label="this.$t('m.i.ebank.applyBankName')" prop="transFromBankName" >
    <h-input v-model="formItem['transFromBankName']" placeholder="" readonly></h-input>
  </h-form-item>
</template>

<script>
    export default {
        name: "transFromBankName",
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
