<template>
  <h-form-item prop="pyeeAcctName" required>
    <h-input v-model="formItem['pyeeAcctName']" placeholder="" :maxlength="150" :lengthByByte="false"></h-input>
  </h-form-item>
</template>

<script>
  export default {
    name: "pyeeAcctName",
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
