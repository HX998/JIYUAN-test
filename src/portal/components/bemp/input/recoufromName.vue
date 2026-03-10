<template>
  <h-form-item :label="this.$t('m.i.ebank.recountFromName')" prop="recouFromName">
    <h-input v-model="formItem['recouFromName']" placeholder=""></h-input>
  </h-form-item>
</template>

<script>
  export default {
    name : "recoufromName",
    data() {
      return {

      }
    },
    props:{
      formItem : Object || {}
    }
  }
</script>
