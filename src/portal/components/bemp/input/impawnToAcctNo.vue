<template>
  <h-form-item :label="applType === 'impawn' ? this.$t('m.i.ebank.impawnToAcctNo'): this.$t('m.i.ebank.transToAcctNo')" prop="toAcctNo" required>
    <h-input v-model="formItem['toAcctNo']" :maxlength="125"></h-input>
  </h-form-item>
</template>

<script>
    export default {
        name: "impawnToAcctNo",
      data() {
        return {

        }
      },
      props:{
        formItem : Object || {},
        applType:{
          type:String,
          default:''
        }
      }
    }
</script>

<style scoped>

</style>
