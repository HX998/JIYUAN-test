<template>
  <h-form-item :label="this.$t('m.i.shcpe.showeeAcctNo')" prop="showeeAcctNo" :validRules="this.acctNoRule" :required="required" v-if="isShow">
    <h-input v-model="formItem['showeeAcctNo']" placeholder="" :readonly="readonly" :maxlength=32></h-input>
  </h-form-item>
</template>

<script>
  export default {
    name : "showeeAcctNo",
    data() {
      return {
        acctNoRule: [{ test: /^[0-9a-zA-Z]{1,32}$/, trigger: "blur", message: "账号由不超过32位的数字或字母组成" }],
      }
    },
    props:{
      formItem : Object || {},
      required:{
        type: Boolean,
        default: false
      },
      readonly: {
        type: Boolean,
        default: false
      },
      isShow : {
        type: Boolean,
        default: true
      },
    }
  }
</script>
