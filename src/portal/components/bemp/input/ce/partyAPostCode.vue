<template>
  <h-form-item :label="$t('m.i.ce.partyAPostCode')" prop="partyAPostCode" :validRules="postCodeRule" :required="isRequired">
    <h-input  v-model="formItem.partyAPostCode"  :readonly="onlyRead"></h-input>
  </h-form-item>
</template>

<script>
  export default {
    name : "partyAPostCode",
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
