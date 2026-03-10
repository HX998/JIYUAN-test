<template>
  <h-form-item :label="this.$t('m.i.ebank.toAcctNo')" prop="toAcctNo" required>
    <h-input v-model="formItem['toAcctNo']" :maxlength="35"></h-input>
  </h-form-item>
</template>

<script>
    export default {
        name: "toAcctNo",
      data() {
        return {

        }
      },
      props:{
        formItem : Object || {}
      }
    }
</script>
