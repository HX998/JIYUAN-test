<template>
  <h-form-item :label="$t('m.i.ce.partyAAddr')" prop="partyAAddr"  :required="isRequired">
    <h-input  v-model="formItem.partyAAddr" :maxlength=60 :readonly="onlyRead"></h-input>
  </h-form-item>
</template>

<script>
  export default {
    name : "partyAAddr",
    data() {
      return {
      }
    },
    props:{
      onlyRead :{
        type: Boolean,
        default: false
      },
      isRequired :{
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
