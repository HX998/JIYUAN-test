<template>
  <h-form-item :label="$t('m.i.ce.arbitrationCommissionName')" prop="arbitrationCommissionName" v-if="formItem.arbitrateMode==='2'" >
    <h-input  v-model="formItem.arbitrationCommissionName" :maxlength=60 :readonly="onlyRead"></h-input>
  </h-form-item>
</template>

<script>
  export default {
    name : "arbitrationCommissionName",
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
