<template>
  <h-form-item :label="this.$t('m.i.ebank.discAmt')" prop="discAmt" required>
    <h-typefield type="money" v-model="formItem['discAmt']" :maxlength=10 readonly
                 placeholder="" bigTips divided></h-typefield>
  </h-form-item>
</template>

<script>
    export default {
        name: "discAmt",
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
