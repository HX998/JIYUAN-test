<template>
  <h-form-item :label="this.$t('m.i.ebank.applyAcctNo')" prop="otherAcctNo">
    <h-input v-model="formItem['otherAcctNo']" placeholder=""></h-input>
  </h-form-item>
</template>

<script>
  export default {
    name: "applyAcctNo",
    data() {
      return {

      }
    },
    props:{
      formItem : Object || {}
    }
  }
</script>
