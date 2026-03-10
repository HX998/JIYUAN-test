<template>
  <h-form-item :label="$t('m.i.common.accountBrchName')" prop="accountBrchName" :required="isRequired" >
    <h-input v-model="formItem.accountBrchName" placeholder="" :title="formItem.accountBrchName"
             readonly :icon="isAllowChoiceOtherAcctBranch ? 'android-search' : ''" @on-click="queryBrchNo()"></h-input>
  </h-form-item>
</template>

<script>
    export default {
        name: "accountBrchName",
      data() {
        return {
        }
      },
      props:{
        formItem : Object || {},
        operType: String,
        isRequired :{
          type: Boolean,
          default: true
        },
        isAllowChoiceOtherAcctBranch:{
          type: Boolean,
          default: false
        }
      },
      methods:{
        queryBrchNo(){
          this.$emit('queryBrchNo','');
        }

      }
    }
</script>
