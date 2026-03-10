<template>
  <h-form-item :label="this.$t('m.i.ebank.applyName')" prop="transFromName" >
    <h-input v-model="formItem['transFromName']" placeholder="" readonly></h-input>
  </h-form-item>
</template>

<script>
    export default {
        name: "transFromName",
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
