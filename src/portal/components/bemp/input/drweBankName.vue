<template>
  <h-form-item :label="this.$t('m.i.ebank.drweBankName')" prop="drweBankName">
    <h-input v-model="formItem['drweBankName']" placeholder=""></h-input>
  </h-form-item>
</template>

<script>
  export default {
    name : "drweBankName",
    data() {
      return {

      }
    },
    props:{
      formItem : Object || {}
    }
  }
</script>
