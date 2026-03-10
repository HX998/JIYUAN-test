<template>
    <div>
      <h-input  v-model="custAcctNoStr" :placeholder="''" readonly
                icon="android-search" @on-click="queryCustAcctNo"></h-input>

      <show-cust-acct :showCustAcctWin="showCustAcctWin" :selectCustNo="custNo" :title="'查询客户账号信息'" :selectType="'select'"
                      :ifClearBtn="isFalse" :discFlag="discFlag" :busiOwnBrchNo="busiOwnBrchNo"
                      @showCustAcctWinClose="showCustAcctWinClose"  @custAcctSelect="custAcctSelect"></show-cust-acct>
    </div>
</template>

<script>

  export default {
    name: "selectCustAcct",
    data() {
      return {
        showCustAcctWin : false,
        isFalse : false,
        custAcctNoStr:""
      }
    },
    components:{
      ShowCustAcct:()=>import(/* webpackChunkName: "bm/cust/acct/showCustAcct" */`@/views/bizViews/bm/cust/acct/showCustAcct`),
    },

    props:{
      busiOwnBrchNo:"",
      discFlag:"",
      custAcctNo: {
        type: String,
        default() {
          return '';
        }
      },
      custNo: {
        type: String,
        default() {
          return '';
        }
      },
      ifCustNeed: {
        type: Boolean,
        default() {
          return true;
        }
      },
      isAllBankAcct: {
        type: Boolean,
        default() {
          return false;
        }
      },
      isSubAcctCompose: {
        type: Boolean,
        default() {
          return true;
        }
      },
    },

    watch:{
      custAcctNo(val) {
        this.custAcctNo = val;
        this.custAcctNoStr = val;
      },
      custNo(val, oldVal){
        if(val !== oldVal && oldVal != null && oldVal !== "" && (typeof ifCustNeed === "boolean" && ifCustNeed)) {
          this.custAcctNo = "";
          this.custAcctNoStr = "";
        }
        this.$emit('update:value',this.custAcctNo);
      }
    },

    methods :{
      queryCustAcctNo(){
        if(this.ifCustNeed && (this.custNo == null || this.custNo == "") ){
          this.$msgTip.info(this, { info:"请先选择客户"});
          return;
        }
        this.showCustAcctWin = true;
      },
      showCustAcctWinClose(){
        this.showCustAcctWin = false;
      },
      custAcctSelect(info){
        this.custAcctNoStr = info.custAcctNo;
        // this.addForm.custName = info.custName;
        // this.addForm.custId = info.id;
        let custAcctKind = info.custAcctKind;
        let subAcctSrlNo = info.subAcctSrlNo;
        let subCustAcctNo = this.custAcctNoStr;
        if(custAcctKind == '2' && this.isSubAcctCompose){
          subCustAcctNo += "@"+subAcctSrlNo;
        }
        this.$emit('update:subCustAcctNo',subCustAcctNo);
        this.$emit('update:value',this.custAcctNoStr);
        this.$emit('update:openBankNo',info.openBankNo);
        this.showCustAcctWin = false;
      },
    },
  };
</script>

<style scoped>

</style>
