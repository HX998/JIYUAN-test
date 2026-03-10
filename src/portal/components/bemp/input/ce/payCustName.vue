<template>
  <h-form-item :label="$t('m.i.ce.buyerPayInterName')" prop="payCustName" :required="formItem.payType === '1' ||formItem.payType === '3' " v-if="formItem.payType === '1' ||formItem.payType === '3'">
    <h-input  v-model="formItem.payCustName" :maxlength=60 :readonly="onlyRead" :icon="onlyRead ? '' : 'android-search'" @on-click="queryPayCustName" @on-change="payCustNameChange"></h-input>
  </h-form-item>
</template>

<script>
    export default {
        name: "payCustName",
      data() {
        return {

        }
      },
      props:{
        formItem : Object || {},
        showIcon :{type: Boolean,
          default: true},
        onlyRead:{
          type: Boolean,
          default: true
        },
        required :{
          type: Boolean,
          default: false
        },
      },
      methods:{
        payCustNameChange(){
          this.$emit('payCustNameChange','');
        },
        queryPayCustName(){
          this.$emit('queryPayCustName','');
        },

      }
    }
</script>
