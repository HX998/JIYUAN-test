<template>
  <h-form-item :label="this.$t('m.i.ebank.drwrName')" prop="drwrName">
    <h-input v-model="formItem['drwrName']" placeholder=""></h-input>
  </h-form-item>
</template>

<script>
  export default {
    name : "drwrName",
    data() {
      return {

      }
    },
    props:{
      formItem : Object || {}
    }
  }
</script>
