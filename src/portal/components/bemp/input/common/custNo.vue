<template>
  <h-form-item :label="$t('m.i.common.custNo')" prop="custNo" required>
    <select-cust-corp v-model="addForm['custNo']" :custNo="addForm['custNo']" :value.sync="addForm['custNo']" :corpScale.sync="addForm['corpScale']" :isGreenCorp.sync="addForm['isGreenCorp']" :custName.sync="addForm['custName']" :aoAcctNo.sync="addForm['aoAcctNo']" :custAcctNo.sync="addForm['custAcctNo']" v-if="operType==='add'"
    :ifSelectCustAcctNo="true"></select-cust-corp>
    <h-input v-model="addForm['custNo']" :placeholder="''" readonly v-if="operType==='modify'"></h-input>
  </h-form-item>
</template>

<script>
    export default {
        name: "custNo",
      data() {
        return {
        }
      },
      props:{
        addForm : Object || {},
        operType: String,
      },
      methods:{
        brchNoWinOpen(){
          this.$emit('brchNoWinOpen','');
        }

      }
    }
</script>
