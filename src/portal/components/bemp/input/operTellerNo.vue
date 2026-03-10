<template>
  <h-form-item :label="this.$t('m.i.ebank.operTellerNo')" prop="userNo">
    <h-input v-model="formItem['userNo']" placeholder=""></h-input>
  </h-form-item>
</template>

<script>
  export default {
    name : "operTellerNo",
    data() {
      return {

      }
    },
    props:{
      formItem : Object || {}
    }
  }
</script>
