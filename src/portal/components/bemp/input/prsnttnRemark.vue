<template>
  <h-form-item :label="this.$t('m.i.ebank.prsnttnRemark')" prop="prsnttnRemark"  class="h-form-height-auto">
    <h-input type="textarea" :rows=2 v-model="formItem['prsnttnRemark']" :canResize="false"
             :maxlength="60"></h-input>
  </h-form-item>
</template>

<script>
  export default {
    name : "prsnttnRemark",
    data() {
      return {

      }
    },
    props:{
      formItem : Object || {}
    }
  }
</script>
