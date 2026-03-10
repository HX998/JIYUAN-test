<template>
  <h-form-item :label="this.$t('m.i.ebank.operTellerNum')" prop="operTellerNum">
    <h-input v-model="formItem['operTellerNum']" placeholder="" ></h-input>
  </h-form-item>

</template>

<script>
  export default {
    name : "operTellerNum",
    data() {
      return {

      }
    },
    props:{
      formItem : Object || {}
    }
  }
</script>
