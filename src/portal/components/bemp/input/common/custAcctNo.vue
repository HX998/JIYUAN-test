<template>
  <h-form-item :label="$t('m.i.common.custAcctNo')" prop="custAcctNo">
  <h-input v-model="formItem.custAcctNo" placeholder="" icon="android-search"
  @on-click="queryCustAcctNo()" clearable @on-clear="clearCustAcctNo()" readonly></h-input>
  </h-form-item>
</template>

<script>
    export default {
        name: "custAcctNo",
      data() {
        return {

        }
      },
      props:{
        formItem : Object || {}
      },
      methods:{
        queryCustAcctNo(){
          this.$emit('queryCustAcctNo','');
        },
        clearCustAcctNo(){
          this.formItem['custAcctNo']="";
        }
      }
    }
</script>
