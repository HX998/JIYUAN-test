<template>
  <h-form-item :label="$t('m.i.ce.sumSellerInterest')" prop="sumSalerInterest">
    <h-input  v-model="formItem.sumSalerInterest" disabled></h-input>
  </h-form-item>
</template>

<script>
  export default {
    name : "sumSalerInterest",
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
        default: true
      },
      operType: String,
      formItem : Object || {},
    },
    methods:{
    }
  }
</script>
