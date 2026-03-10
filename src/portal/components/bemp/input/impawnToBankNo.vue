<template>
  <h-form-item :label="applType === 'impawn' ? this.$t('m.i.ebank.impawnToBankNo'):this.$t('m.i.ebank.transToBankNo')" prop="toBankNo" required :label-width="130">
    <h-input v-model="formItem['toBankNo']" :maxlength="125"></h-input>
  </h-form-item>
</template>

<script>
    export default {
        name: "impawnToBankNo",
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
