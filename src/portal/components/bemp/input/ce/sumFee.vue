<template>
  <h-form-item :label="$t('m.i.ce.totalFee')" prop="sumFee">
    <h-input  v-model="formItem.sumFee" disabled></h-input>
  </h-form-item>
</template>

<script>
  export default {
    name : "sumFee",
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
