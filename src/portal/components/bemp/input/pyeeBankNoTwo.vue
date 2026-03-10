<template>
  <h-form-item prop="pyeeBankNo" required :validRules="bankNoRule">
    <h-input v-model="formItem['pyeeBankNo']" placeholder="" @on-blur="showBankName()" :maxlength=12
             :icon="androidSearchWin?'android-search':''" clearable
             @on-click="queryBankInfoForPyee"
             @on-clear="clearPyeeBankInfo" :readonly="isReadonly"></h-input>
  </h-form-item>
</template>

<script>
  export default {
    name : "pyeeBankNoTwo",
    data() {
      return {
        bankNoRule: [{ test: /^[0-9]{12}$/, trigger: "blur", message: this.$t('m.i.ruleTip.formItemRule2') }]
      }
    },
    props:{
      formItem : Object || {},
      androidSearchWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      isReadonly:{
        type:Boolean,
        default:false
      }
    },
    methods:{
      showBankName(){
        this.$emit('showBankName','');
      },
      queryBankInfoForPyee() {
        this.$emit('queryBankInfoForPyee', '');
      },
      clearPyeeBankInfo() {
        this.$emit('clearPyeeBankInfo', '');
      },
    }
  }
</script>
