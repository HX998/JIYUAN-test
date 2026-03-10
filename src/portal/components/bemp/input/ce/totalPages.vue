<template>
  <h-form-item :label="$t('m.i.ce.totalPages')" prop="totalPages" :validRules="intRule" :required="isRequired">
    <h-input  v-model="formItem.totalPages" :maxlength=maxLength :readonly="onlyRead"></h-input>
  </h-form-item>
</template>

<script>
  export default {
    name : "totalPages",
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
      intRule: Array,
      maxLength :{
        type: Number,
        default: 60
      },
    },
    methods:{
    }
  }
</script>
