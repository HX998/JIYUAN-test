<template>
  <h-form-item prop="drwrBankNo" required :validRules="bankNoRule">
    <h-input v-model="formItem['drwrBankNo']" placeholder="" @on-blur="showBankName()" :maxlength=12
             :icon="androidSearchWin?'android-search':''" clearable
             @on-click="queryBankInfoForDrwr"
             @on-clear="clearDrwrBankInfo" :readonly="isReadonly"></h-input>
  </h-form-item>
</template>

<script>
  export default {
    name : "drwrBankNoTwo",
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
      queryBankInfoForDrwr() {
        this.$emit('queryBankInfoForDrwr', '');
      },
      clearDrwrBankInfo() {
        this.$emit('clearDrwrBankInfo', '');
      },
    }
  }
</script>
