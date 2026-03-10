<template>
  <h-form-item :label="this.$t('m.i.ebank.recouName')" prop="rcvgName">
    <h-input v-model="formItem['rcvgName']" placeholder=""></h-input>
  </h-form-item>
</template>

<script>
  export default {
    name : "recouName",
    data() {
      return {

      }
    },
    props:{
      formItem : Object || {}
    }
  }
</script>
