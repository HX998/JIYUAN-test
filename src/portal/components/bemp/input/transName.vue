<template>
  <h-form-item :label="this.$t('m.i.ebank.transName')" prop="transName">
    <h-input v-model="formItem['transName']" placeholder="" :maxlength="60" readonly></h-input>
  </h-form-item>

</template>

<script>
  export default {
    name : "transName",
    data() {
      return {

      }
    },
    props:{
      formItem : Object || {}
    }
  }
</script>
