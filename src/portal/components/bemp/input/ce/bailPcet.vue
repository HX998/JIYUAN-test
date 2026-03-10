<template>
  <h-form-item :label="$t('m.i.ce.bailPcet')" prop="bailPcet" :required="isRequired" :validRules="rateRule">
    <h-input  v-model="formItem.bailPcet" :maxlength=60 :style="{width:'160px'}"></h-input>
    <span >(%)</span>
  </h-form-item>
</template>

<script>
  export default {
    name : "bailPcet",
    data() {
      return {
      }
    },
    props:{
      formItem : Object || {},
      isRequired :{
        type: Boolean,
        default: false
      },
      rateRule : Array,
    },
    methods:{

    }
  }
</script>
