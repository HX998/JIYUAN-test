<template>
  <h-form-item :label="this.$t('m.i.ebank.aoAcctNo')" prop="aoAcctNo" required>
    <h-input v-model="formItem['aoAcctNo']" :maxlength="35"></h-input>
  </h-form-item>
</template>

<script>
    export default {
        name: "aoAcctNo",
      data() {
        return {

        }
      },
      props:{
        formItem : Object || {}
      }
    }
</script>
