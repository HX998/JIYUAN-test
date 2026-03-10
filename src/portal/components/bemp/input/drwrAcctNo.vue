<template>
  <h-form-item prop="drwrAcctNo" required>
    <h-input v-model="formItem['drwrAcctNo']" :readonly="isReadonly" placeholder="" :maxlength=35></h-input>
  </h-form-item>
</template>

<script>
  export default {
    name : "drwrAcctNo",
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
