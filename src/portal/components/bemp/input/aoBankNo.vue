<template>
  <h-form-item :label="this.$t('m.i.ebank.aoBankNo')" prop="aoBankNo" required>
    <h-input v-model="formItem['aoBankNo']" :maxlength="12"></h-input>
  </h-form-item>
</template>

<script>
    export default {
        name: "aoBankNo",
      data() {
        return {

        }
      },
      props:{
        formItem : Object || {}
      }
    }
</script>
