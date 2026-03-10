<template>
  <h-form-item :label="$t('m.i.ce.feeAcctNo')" prop="feeAcctNo" :required="isRequired">
    <select-cust-acct v-model="formItem.feeAcctNo"  :ifCustNeed="false" :custAcctNo="formItem.feeAcctNo" :subCustAcctNo.sync="formItem.feeAcctNo"  v-if="onlyRead===false"></select-cust-acct>
    <h-input v-model="formItem.feeAcctNo" readonly v-if="onlyRead===true"></h-input>
  </h-form-item>
</template>

<script>
  export default {
    name: "feeAcctNo",
    data() {
      return {
      }
    },
    props:{
      operType: String,
      formItem : Object || {},
      isRequired:{
        type: Boolean,
        default: false
      },
      onlyRead:{
        type: Boolean,
        default: true
      },
    },
    methods:{

    }
  }
</script>
