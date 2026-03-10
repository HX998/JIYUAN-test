<template>
  <h-form-item :label="$t('m.i.ce.agentCustBankNo')" prop="agentCustBankNo" class="h-form-long-label" v-show="agencyShow" :validRules="bankNoRule">
    <h-input v-model="formItem.agentCustBankNo" :maxlength=12 :readonly="onlyRead"></h-input>
  </h-form-item>
</template>

<script>
    export default {
        name: "agentCustBankNo",
      data() {
        return {
        }
      },
      props:{
        formItem : Object || {},
        operType: String,
        agencyShow:{
          type: Boolean,
          default: false
        },
        onlyRead:{
          type: Boolean,
          default: false
        },
        bankNoRule: Array
      },
      methods:{
        queryCustManager(){
          this.$emit('queryCustManager','');
        }
      }
    }
</script>
