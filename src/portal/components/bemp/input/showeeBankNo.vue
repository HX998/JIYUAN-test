<template>
  <h-form-item :label="this.$t('m.i.shcpe.showeeBankNo')" prop="showeeBankNo" :validRules="this.bankNoRule" :required="required" v-if="isShow">
    <h-input v-model="formItem['showeeBankNo']" placeholder="" :maxlength=12 :readonly="readonly"
             :filterRE="filterRep"></h-input>
  </h-form-item>
</template>

<script>
  export default {
    name : "showeeBankNo",
    data() {
      return {
        bankNoRule: [{ test: /^[0-9]{12}$/, trigger: "blur", message: "行号由12位数字组成" }],
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
      filterRep :{
        type: [Object, RegExp],
        default() {
          return /[^0-9]/g
        }
      },
    }
  }
</script>
