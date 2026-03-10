<template>
  <h-form-item prop="acptAcctNo" required>
    <h-input v-model="formItem['acptAcctNo']" :readonly="isReadonly"></h-input>
  </h-form-item>
</template>

<script>
    export default {
        name: "acptAcctNo",
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

