<template>
  <h-form-item :label="this.$t('m.i.ebank.applyBrchCode')" prop="transFromOrgCode" :label-width="130">
    <h-input v-model="formItem['transFromOrgCode']" placeholder="" readonly></h-input>
  </h-form-item>
</template>

<script>
    export default {
        name: "transFromOrgCode",
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
