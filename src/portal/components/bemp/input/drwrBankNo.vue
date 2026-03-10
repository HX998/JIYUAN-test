<template>
  <h-form-item prop="drwrBankNo" required>
    <h-input v-model="formItem['drwrBankNo']" :readonly="isReadonly" placeholder="" :maxlength=12></h-input>
  </h-form-item>
</template>

<script>
  export default {
    name : "drwrBankNo",
    data() {
      return {

      }
    },
    props:{
      formItem : Object || {},
      isReadonly:{
        type:Boolean,
        default:false
      }
    }
  }
</script>
