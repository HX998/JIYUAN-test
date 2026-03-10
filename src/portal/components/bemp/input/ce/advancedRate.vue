<template>
  <h-form-item :label="$t('m.i.ce.advancedRate')" prop="advancedRate" :validRules="rateRule">
    <h-input  v-model="formItem.advancedRate" :maxlength=60 :style="{width:'160px'}" :readonly="onlyRead"></h-input><span>(‱)</span>
  </h-form-item>
</template>

<script>
    export default {
        name: "advancedRate",
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
        rateRule : Array,

      },
      methods:{
      }
    }
</script>
