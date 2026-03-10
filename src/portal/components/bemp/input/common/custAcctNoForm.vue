<template>
  <h-form-item :label="$t('m.i.common.custAcctNo')" prop="custAcctNo" required>
    <h-input v-model="formItem['custAcctNo']" :disabled="formItem['prodNo'].indexOf('010611') === -1" readonly :icon="formItem['prodNo'].indexOf('010611') === 0 ? 'android-search' : ''" @on-click="queryCustAcctNo()" ></h-input>
  </h-form-item>
</template>

<script>
    export default {
        name: "custAcctNoForm",
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
        }

      }
    }
</script>
