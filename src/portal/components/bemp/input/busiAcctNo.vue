<template>
  <h-form-item :label="this.$t('m.i.ebank.busiAcctNo')" prop="busiAcctNo" class="h-form-long-label">
    <h-input v-model="formItem['busiAcctNo']" placeholder=""></h-input>
  </h-form-item>
</template>

<script>
    export default {
      name: "busiAcctNo",
      data() {
        return {

        }
      },
      props:{
        formItem : Object || {}
      }
    }
</script>
