<template>
  <h-form-item :label="$t('m.i.ce.recvAcctNo')" prop="aoAcctNo" required >
    <h-row>
      <h-col span="18">
        <select-cust-acct v-model="formItem['aoAcctNo']" v-if="operType==='add'" :custNo="formItem['custNo']" :custAcctNo="formItem['aoAcctNo']" :subCustAcctNo.sync="formItem['aoAcctNo']" :discFlag="discFlag" :busiOwnBrchNo="busiOwnBrchNo" :openBankNo.sync="formItem['aoAcctBankNo']"
        :isSubAcctCompose="formItem['prodNo'].indexOf('010611') >= 0"></select-cust-acct>
        <h-input v-model="formItem['aoAcctNo']" v-if="operType==='modify'" readonly></h-input>
      </h-col>
      <h-col span="4" offset="1">
        <h-button type="primary" size="small" @click="importBatch()" :disabled="disabledButton" v-if="formItem['prodNo'].indexOf('010611') === -1">导入</h-button>
      </h-col>
    </h-row>
  </h-form-item>
</template>

<script>
    export default {
        name: "aoAcctNo",
      data() {
        return {
        }
      },
      props:{
        operType: String,
        discFlag:"",
        busiOwnBrchNo:"",
        formItem : Object || {},
        disabledButton:false
      },
      methods:{
        importBatch(){
          this.$emit('importBatch','');
        }

      }
    }
</script>
