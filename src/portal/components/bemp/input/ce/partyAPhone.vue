<template>
  <h-form-item :label="$t('m.i.ce.partyAPhone')" prop="partyAPhone" :validRules="phoneNoRule" :required="isRequired">
    <h-input  v-model="formItem.partyAPhone"  :readonly="onlyRead"></h-input>
  </h-form-item>
</template>

<script>
  export default {
    name : "partyAPhone",
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
      phoneNoRule: Array,
    },
    methods:{
    }
  }
</script>
