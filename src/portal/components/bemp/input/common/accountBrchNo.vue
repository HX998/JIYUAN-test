<template>
  <h-form-item :label="$t('m.i.common.accountBrchNo')" prop="accountBrchNo" v-show="false">
    <h-input  v-model="formItem.accountBrchNo" readonly></h-input>
  </h-form-item>
</template>

<script>
    export default {
        name: "accountBrchNo",
      data() {
        return {
        }
      },
      props:{
        formItem : Object || {},
        operType: String,
      },
      methods:{

      }
    }
</script>
