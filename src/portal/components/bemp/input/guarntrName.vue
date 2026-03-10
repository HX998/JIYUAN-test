<template>
  <h-form-item :label="this.$t('m.i.ebank.guarntrName')" prop="guarntrName" required>
    <h-input v-model="formItem['guarntrName']" placeholder="" :maxlength=125></h-input>
  </h-form-item>
</template>

<script>
  export default {
    name : "guarntrName",
    data() {
      return {

      }
    },
    props:{
      formItem : Object || {}
    }
  }
</script>
