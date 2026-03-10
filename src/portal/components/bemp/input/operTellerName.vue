<template>
  <h-form-item :label="this.$t('m.i.ebank.operTellerName')" prop="userName">
    <h-input v-model="formItem['userName']" placeholder=""></h-input>
  </h-form-item>
</template>

<script>
  export default {
    name : "operTellerName",
    data() {
      return {

      }
    },
    props:{
      formItem : Object || {}
    }
  }
</script>
