<template>
  <h-form-item :label="this.$t('m.i.ebank.checkRemark')" prop="checkRemark">
    <h-input v-model="formItem['checkRemark']" placeholder="" :rows="6" type="textarea" :maxlength="800"></h-input>
  </h-form-item>
</template>

<script>
  export default {
    name : "checkRemark",
    data() {
      return {

      }
    },
    props:{
      formItem : Object || {}
    }
  }
</script>
