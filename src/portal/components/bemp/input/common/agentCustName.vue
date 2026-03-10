<template>
  <h-form-item :label="$t('m.i.ce.agentCustName')" prop="agentCustName" v-show="agencyShow">
    <h-input v-model="formItem.agentCustName" :maxlength=60 :readonly="onlyRead"></h-input>
  </h-form-item>
</template>

<script>
    export default {
        name: "agentCustName",
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
