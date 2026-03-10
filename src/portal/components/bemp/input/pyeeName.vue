<template>
  <h-form-item :label="this.$t('m.i.ebank.pyeeName')" prop="pyeeName">
    <h-input v-model="formItem['pyeeName']" placeholder=""></h-input>
  </h-form-item>
</template>

<script>
  export default {
    name : "pyeeName",
    data() {
      return {

      }
    },
    props:{
      formItem : Object || {}
    }
  }
</script>
