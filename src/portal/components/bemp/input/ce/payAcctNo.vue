<template>
  <h-form-item :label="$t('m.i.ce.buyerPayInterAcctNo')" prop="payAcctNo" :validRules="payAcctNoRule" :required="formItem.payType === '1' ||formItem.payType === '3'" v-if="formItem.payType === '1' ||formItem.payType === '3'">
    <h-input  v-model="formItem.payAcctNo" :maxlength="maxlength" :readonly="onlyRead" :icon="onlyRead ? '' : 'android-search'" @on-click="queryPayAcctNo()"></h-input>
  </h-form-item>
</template>

<script>
    export default {
        name: "payAcctNo",
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
        payAcctNoRule: Array,
      },
      methods:{
        queryPayAcctNo(){
          this.$emit('queryPayAcctNo','');
        }

      }
    }
</script>
