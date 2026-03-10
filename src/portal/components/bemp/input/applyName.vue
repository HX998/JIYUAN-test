<template>
  <h-form-item :label="this.$t('m.i.ebank.applyName')" prop="otherName">
    <h-input v-model="formItem['otherName']" placeholder=""></h-input>
  </h-form-item>
</template>

<script>
  export default {
    name: "applyName",
    data() {
      return {

      }
    },
    props:{
      formItem : Object || {}
    }
  }
</script>
