<template>
  <h-form-item :label="$t('m.i.ce.partyBPhone')" prop="partyBPhone" :validRules="phoneNoRule" :required="isRequired">
    <h-input  v-model="formItem.partyBPhone"  :readonly="onlyRead"></h-input>
  </h-form-item>
</template>

<script>
  export default {
    name : "partyBPhone",
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
