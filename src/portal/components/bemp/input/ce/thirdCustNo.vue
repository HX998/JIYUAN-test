<template>
  <h-form-item :label="$t('m.i.ce.thirdAcctNo')" prop="thirdAcctNo" :validRules="thirdAcctNoRule" :required="formItem.payType === '4'" v-if="formItem.payType === '4'">
    <h-input  v-model="formItem.thirdAcctNo" :maxlength="maxlength" :readonly="onlyRead" :icon="onlyRead ? '' : 'android-search'" @on-click="queryThirdAcctNo()"></h-input>
  </h-form-item>
</template>

<script>
    export default {
        name: "thirdCustNo",
      data() {
        return {
        }
      },
      props:{
        operType: String,
        formItem : Object || {},
        onlyRead:{
          type: Boolean,
          default: true
        },
        maxlength: {
          type: Number,
          default: 60
        },
        thirdAcctNoRule: Array,
      },
      methods:{
        queryThirdAcctNo(){
          this.$emit('queryThirdAcctNo','');
        },
      }
    }
</script>
