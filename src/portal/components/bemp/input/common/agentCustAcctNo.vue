<template>
  <h-form-item :label="$t('m.i.ce.agentCustAcctNo')" prop="agentCustAcctNo" v-show="agencyShow">
    <h-input v-model="formItem.agentCustAcctNo" :maxlength=30 :readonly="onlyRead"></h-input>
  </h-form-item>
</template>

<script>
    export default {
        name: "agentCustAcctNo",
      data() {
        return {
        }
      },
      props:{
        formItem : Object || {},
        operType: String,
        onlyRead:{
          type: Boolean,
          default: false
        },
        agencyShow:{
          type: Boolean,
          default: false
        },
      },
      methods:{
        queryCustManager(){
          this.$emit('queryCustManager','');
        }
      }
    }
</script>
