<template>
  <h-form-item :label="$t('m.i.ce.partyAReceAddr')" prop="partyAReceAddr" >
    <h-input  v-model="formItem.partyAReceAddr" :maxlength=60 :readonly="onlyRead"></h-input>
  </h-form-item>
</template>

<script>
  export default {
    name : "partyAReceAddr",
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
