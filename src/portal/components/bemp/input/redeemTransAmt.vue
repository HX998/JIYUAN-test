<template>
  <h-form-item v-if="isShow" :label="this.$t('m.i.ebank.clearReolyMoney')" prop="redeemTransAmt" >
    <h-input v-model="formItem['redeemTransAmt']" placeholder="" readonly></h-input>
  </h-form-item>
</template>

<script>
    export default {
        name: "redeemTransAmt",
      data() {
        return {

        }
      },
      props:{
        formItem : Object || {},
        isShow:{
          type:Boolean,
          default:false
        }
      }
    }
</script>

<style scoped>

</style>
