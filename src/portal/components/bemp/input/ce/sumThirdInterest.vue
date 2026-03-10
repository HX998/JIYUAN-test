<template>
  <h-form-item :label="$t('m.i.ce.sumThirdInterest')" prop="sumInterest">
    <h-input  v-model="formItem.sumInterest" disabled></h-input>
  </h-form-item>
</template>

<script>
  export default {
    name : "sumThirdInterest",
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
