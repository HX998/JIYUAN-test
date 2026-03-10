<template>
  <div>
    <h-input  v-model="showMsg" readonly icon="android-search" @on-click="queryCustNo" clearable @on-clear="clearCustNo"></h-input>
    <show-cust-corp :showCustCorpWin="showCustCorpWin" :title="title" @showCustCorpWinClose="showCustCorpWinClose" @custSelect="custSelect"
                    :ifClearBtn="isFalse"></show-cust-corp>
  </div>
</template>

<script>
  import { post } from "@/api/bizApi/commonUtil";

  export default {
    name: "selectCustCorp",
    data() {
      return {
        showCustCorpWin : false,
        isFalse : false
      }
    },
    components:{
      ShowCustCorp:()=>import(/* webpackChunkName: "bm/cust/corp/showCustCorp"*/"@/views/bizViews/bm/cust/corp/showCustCorp.vue"),
    },
    props:{
      title: {
        type: String,
        default: '查看企业客户'
      },
      custNo: {
        type: String,
        default() {
          return '';
        }
      },
      custName: {
        type: String,
        default() {
          return '';
        }
      },
      ifSelectCustAcctNo:{
        type: Boolean,
        default() {
          return false;
        }
      }
    },
    computed: {
      showMsg: {
        get() {
          return this.custNo;
        },
        set() {
        }
      }
    },
    watch:{
      // custNo(val, oldVal) {
      //   this.custNo = val;
      // }
    },
    methods :{
      queryCustNo(){
        this.showCustCorpWin = true;
      },
      clearCustNo(){
        this.$emit('update:custAcctNo',"");
        this.$emit('update:value',"");
        this.$emit('update:custName',"");
        this.$emit('update:corpScale',"");
        this.$emit('update:isGreenCorp',"");
        this.$emit('update:aoAcctNo',"");
        this.$emit('update:socCode',"");
      },
      showCustCorpWinClose(){
        this.showCustCorpWin = false;
      },
      async custSelect(info){
        let custAcctNoForCorp = "";
        if(this.ifSelectCustAcctNo){
          // 根据客户号查询客户账户，若仅有一条账户，则直接反显账户
          custAcctNoForCorp = await this.getCustAcctList(info.custNo);
        }
        this.$emit('update:custAcctNo',custAcctNoForCorp);
        this.$emit('update:value',info.custNo);
        this.$emit('update:custName',info.custName);
        this.$emit('update:corpScale',info.corpScale);
        this.$emit('update:isGreenCorp',info.isGreenCorp);
        this.$emit('update:aoAcctNo',"");
        this.$emit('update:socCode',info.socCode);
        this.showCustCorpWin = false;
      },

      getCustAcctList (custNo) {
        let url = '/bm/cust/acct/pageQueryCustAcctList';
        let isOtherBank = '0';
        return post({"custNo":custNo, activeFlag:"1",custAcctKind:"1", isOtherBank: isOtherBank,
          "pageNo":1,"pageSize":10},url).then(res => {
            if(res){
              let retCode = res.data.retCode;
              if(retCode == "000000" ){
                let list = res.data.retData.list;
                if(list.length == 1){
                  return list[0].custAcctNo;
                }else{
                  return "";
                }
              } else {
                // 查询失败
                this.$msgTip.error(this,{info:res.data.retMsg});
              }
            } else {
              this.$msgTip.error(this,{info:this.$t('m.i.common.netError')});
            }
          }
        )
      },

    },
  };
</script>

<style scoped>

</style>
