<template>
  <h-form-item :label="$t('m.i.ce.partyBReceAddr')" prop="partyBReceAddr" >
    <h-input  v-model="formItem.partyBReceAddr" :maxlength=60 :readonly="onlyRead"></h-input>
  </h-form-item>
</template>

<script>
  export default {
    name : "partyBReceAddr",
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
