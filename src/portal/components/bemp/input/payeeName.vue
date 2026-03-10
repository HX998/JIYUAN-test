<template>
  <h-form-item prop="pyeeName" required>
    <h-input v-model="formItem['pyeeName']" placeholder="" :maxlength=125></h-input>
  </h-form-item>
</template>

<script>
  export default {
    name : "payeeName",
    data() {
      return {

      }
    },
    props:{
      formItem : Object || {}
    }
  }
</script>
