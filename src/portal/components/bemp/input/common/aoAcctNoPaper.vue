<template>
  <h-form-item :label="$t('m.i.ce.recvAcctNo')" prop="aoAcctNo" :required="isRequired">
    <select-cust-acct v-model="formItem.aoAcctNo" :discFlag="discFlag" :busiOwnBrchNo="busiOwnBrchNo" :custNo="formItem.custNo" :custAcctNo="formItem.aoAcctNo" :subCustAcctNo.sync="formItem.aoAcctNo" :openBankNo.sync="formItem.aoAcctBankNo" v-if="onlyRead===false"></select-cust-acct>
    <h-input v-model="formItem.aoAcctNo" readonly v-if="onlyRead===true"></h-input>
  </h-form-item>
</template>

<script>
    export default {
        name: "aoAcctNoPaper",
      data() {
        return {
        }
      },
      props:{
        busiOwnBrchNo:"",
        discFlag:"",
        operType: String,
        formItem : Object || {},
        isRequired:{
          type: Boolean,
          default: true
        },
        onlyRead:{
          type: Boolean,
          default: true
        },
      },
      methods:{
        importBatch(){
          this.$emit('importBatch','');
        }

      }
    }
</script>
