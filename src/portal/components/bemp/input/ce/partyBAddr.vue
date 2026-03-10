<template>
  <h-form-item :label="$t('m.i.ce.partyBAddr')" prop="partyBAddr"  :required="isRequired">
    <h-input  v-model="formItem.partyBAddr" :maxlength=60 :readonly="onlyRead"></h-input>
  </h-form-item>
</template>

<script>
  export default {
    name : "partyBAddr",
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
