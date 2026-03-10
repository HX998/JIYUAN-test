<template>
  <h-form-item :label="this.$t('m.i.ebank.guarntrRemark')" prop="guarntrRemark"  class="h-form-height-auto">
    <h-input type="textarea" :rows=2 v-model="formItem['guarntrRemark']" :canResize="false"
             :maxlength="60"></h-input>
  </h-form-item>
</template>

<script>
  export default {
    name : "guarntrRemark",
    data() {
      return {

      }
    },
    props:{
      formItem : Object || {}
    }
  }
</script>
