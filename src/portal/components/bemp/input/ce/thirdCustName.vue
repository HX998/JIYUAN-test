<template>
  <h-form-item :label="$t('m.i.ce.thirdCustName')" prop="thirdCustName" :required="formItem.payType === '4'" v-if="formItem.payType === '4'">
    <h-input  v-model="formItem.thirdCustName" :maxlength=60 :readonly="onlyRead" :icon="onlyRead ? '' : 'android-search'" @on-click="queryThirdCustName" @on-change="thirdCustNameChange"></h-input>
  </h-form-item>
</template>

<script>
    export default {
        name: "thirdCustName",
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
      },
      methods:{
        queryThirdCustName(){
          this.$emit('queryThirdCustName','');
        },
        thirdCustNameChange(){
          this.$emit('thirdCustNameChange','');
        },
      }
    }
</script>
