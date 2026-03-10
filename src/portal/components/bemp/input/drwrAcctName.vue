<template>
  <h-form-item prop="drwrAcctName" :required="required">
    <h-input v-model="formItem['drwrAcctName']" placeholder="" :readonly="isReadonly" :maxlength="150" :lengthByByte="false" ></h-input>
  </h-form-item>
</template>

<script>
    export default {
      name: "drwrAcctName",
      data() {
        return {
        }
      },
      props:{
        formItem : Object || {},
        isReadonly:{
          type:Boolean,
          default:false
        },
        required:{
          type: Boolean,
          default: false
        },
      }
    }
</script>

<style scoped>

</style>
