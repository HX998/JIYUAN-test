<template>
  <h-form-item :label="$t('m.i.ce.totalAmt')" prop="sumMoney">
    <h-input  v-model="formItem.sumMoney" disabled></h-input>
  </h-form-item>
</template>

<script>
  export default {
    name : "sumMoney",
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
