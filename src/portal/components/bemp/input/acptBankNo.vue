<template>
  <h-form-item prop="acptBankNo" required class="h-form-long-label">
    <h-input v-model="formItem['acptBankNo']" placeholder="" :maxlength=12 :readonly="isReadonly"
             @on-click="queryBankInfoForAcpt"
             @on-blur="showBankName()"></h-input>
  </h-form-item>
</template>

<script>
    export default {
      name: "acptBankNo",
      data() {
        return {

        }
      },
      props:{
        formItem : Object || {},
        isReadonly:{
          type:Boolean,
          default:false
        },
        showBankName(){
          this.$emit('showBankName','');
        },
        queryBankInfoForAcpt() {
          this.$emit('queryBankInfoForAcpt', '');
        },

      }
    }
</script>
