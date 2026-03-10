<template>
  <h-form-item :label="$t('m.i.ce.sumRealPayAmt')" prop="sumRealPayAmt" class="h-form-long-label">
    <h-input  v-model="formItem.sumRealPayAmt" disabled></h-input>
  </h-form-item>
</template>

<script>
  export default {
    name : "sumRealPayAmt",
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
