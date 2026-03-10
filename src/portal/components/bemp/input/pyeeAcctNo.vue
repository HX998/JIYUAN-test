<template>
  <h-form-item prop="pyeeAcctNo" required>
    <h-input v-model="formItem['pyeeAcctNo']" placeholder="" :maxlength=35></h-input>
  </h-form-item>
</template>

<script>
  export default {
    name : "pyeeAcctNo",
    data() {
      return {

      }
    },
    props:{
      formItem : Object || {}
    }
  }
</script>
