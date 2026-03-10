<template>
  <h-form-item prop="drwrName" required>
    <h-input v-model="formItem['drwrName']" :readonly="isReadonly" placeholder="" :maxlength=125></h-input>
  </h-form-item>
</template>

<script>
  export default {
    name : "drawerName",
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
