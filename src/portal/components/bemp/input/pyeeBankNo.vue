<template>
  <h-form-item prop="pyeeBankNo" required>
    <h-input v-model="formItem['pyeeBankNo']" placeholder="" :maxlength=12></h-input>
  </h-form-item>
</template>

<script>
  export default {
    name : "pyeeBankNo",
    data() {
      return {

      }
    },
    props:{
      formItem : Object || {}
    }
  }
</script>
