<template>
  <h-form-item :label="this.$t('m.i.ebank.recouMoney')" prop="reqAmt" required>
    <h-input v-model="formItem['reqAmt']" placeholder="" :readonly="isReadOnly"></h-input>
  </h-form-item>
</template>

<script>
  export default {
    name : "recouMoney",
    data() {
      return {

      }
    },
    props:{
      formItem : Object || {},
      isReadOnly : {
        type:Boolean,
        default:false
      }
    }
  }
</script>
