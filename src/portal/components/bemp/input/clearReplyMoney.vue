<template>
  <h-form-item :label="this.$t('m.i.ebank.clearReolyMoney')" prop="rcrsAmt" required>
    <h-input v-model="formItem['rcrsAmt']" placeholder=""></h-input>
  </h-form-item>
</template>

<script>
  export default {
    name : "clearReplyMoney",
    data() {
      return {

      }
    },
    props:{
      formItem : Object || {}
    }
  }
</script>
