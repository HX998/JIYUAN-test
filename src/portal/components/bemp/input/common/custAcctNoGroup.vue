<template>
  <h-form-item :label="$t('m.i.common.custAcctNo')" prop="custAcctNo" :required="isRequired">
    <h-input v-model="formItem.custAcctNo" :placeholder="''" readonly :maxlength=85 icon="android-search" @on-click="selectCustAcctByCustNo" v-if="operType==='add'"></h-input>
    <h-input v-model="formItem.custAcctNo" :placeholder="''" readonly :maxlength=85 v-if="operType==='modify'"></h-input>
  </h-form-item>
</template>

<script>
    export default {
        name: "custAcctNoGroup",
      data() {
        return {

        }
      },
      props:{
        formItem : Object || {},
        operType:String,
        isRequired:{
          type: Boolean,
          default: true
        },
      },
      methods:{
        selectCustAcctByCustNo(){
          this.$emit('selectCustAcctByCustNo','');
        }

      }
    }
</script>
