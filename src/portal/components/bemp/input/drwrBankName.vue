<template>
  <h-form-item prop="drwrBankName" required>
    <h-input v-model="formItem['drwrBankName']" :readonly="isReadonly" placeholder="" :maxlength=125 :title="formItem.drwrBankName"></h-input>
  </h-form-item>
</template>

<script>
  export default {
    name : "drwrBankName",
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
