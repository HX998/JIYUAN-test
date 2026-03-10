<template>
  <h-form-item :label="$t('m.i.ce.partyBName')" prop="partyBName"  :required="isRequired">
    <h-input  v-model="formItem.partyBName" :maxlength=60 :readonly="onlyRead"></h-input>
  </h-form-item>
</template>

<script>
  export default {
    name : "partyBName",
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
