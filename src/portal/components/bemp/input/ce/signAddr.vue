<template>
  <h-form-item :label="$t('m.i.ce.signAddr')" prop="signAddr">
    <h-input  v-model="formItem.signAddr" :maxlength=60 :readonly="onlyRead"></h-input>
  </h-form-item>
</template>

<script>
    export default {
        name: "signAddr",
      data() {
        return {
        }
      },
      props:{
        operType: String,
        formItem : Object || {},
        onlyRead:{
          type: Boolean,
          default: true
        },
      },
      methods:{
      }
    }
</script>
