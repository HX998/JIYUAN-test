<template>
  <h-form-item :label="this.$t('m.i.shcpe.showeeSocCode')" prop="showeeSocCode" :validRules="this.socCodeRule" :required="required" v-if="isShow">
    <h-input v-model="formItem['showeeSocCode']" placeholder="" :readonly="readonly" :maxlength=18></h-input>
  </h-form-item>
</template>

<script>
  export default {
    name : "showeeSocCode",
    data() {
      return {
        socCodeRule: [{ test: /^[A-Z0-9]{18}$/, trigger: "blur", message: "统一社会信用代码由18位数字或大写字母组成" }],
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
