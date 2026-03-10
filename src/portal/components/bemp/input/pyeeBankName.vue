<template>
  <h-form-item prop="pyeeBankName" required>
    <h-input v-model="formItem['pyeeBankName']" placeholder="" :maxlength=125 :title="formItem.pyeeBankName" :readonly="isReadonly"></h-input>
  </h-form-item>
</template>

<script>
  export default {
    name : "pyeeBankName",
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
