<template>
  <h-form-item :label="this.$t('m.i.ebank.applyAcctNo')" prop="transFromAcctNo" >
    <h-input v-model="formItem['transFromAcctNo']" placeholder="" readonly></h-input>
  </h-form-item>
</template>

<script>
    export default {
        name: "transFromAcctNo",
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
