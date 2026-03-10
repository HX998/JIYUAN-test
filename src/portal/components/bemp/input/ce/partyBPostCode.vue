<template>
  <h-form-item :label="$t('m.i.ce.partyBPostCode')" prop="partyBPostCode"  :validRules="postCodeRule" :required="isRequired">
    <h-input  v-model="formItem.partyBPostCode" :readonly="onlyRead"></h-input>
  </h-form-item>
</template>

<script>
  export default {
    name : "partyBPostCode",
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
      postCodeRule: Array,
    },
    methods:{
    }
  }
</script>
