<template>
  <h-form-item :label="$t('m.i.ce.arbitrationCommissionAddr')" prop="arbitrationCommissionAddr"  v-if="formItem.arbitrateMode==='2'" >
    <h-input  v-model="formItem.arbitrationCommissionAddr" :maxlength=60 :readonly="onlyRead"></h-input>
  </h-form-item>
</template>

<script>
  export default {
    name : "arbitrationCommissionAddr",
    data() {
      return {
      }
    },
    props:{
      onlyRead :{
        type: Boolean,
        default: false
      },
      operType: String,
      formItem : Object || {},
    },
    methods:{
    }
  }
</script>
