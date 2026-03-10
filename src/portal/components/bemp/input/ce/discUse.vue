<template>

  <h-form-item :label="$t('m.i.ce.discUse')" prop="discUse">
    <h-input  v-model="formItem.discUse" :maxlength=25 :readonly="onlyRead"></h-input>
  </h-form-item>
</template>

<script>
    export default {
        name: "discUse",
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
