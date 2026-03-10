<template>
  <div>
    <h-form v-if="params.isMultiPool==='1'" :model="params" :label-width="115"
            :cols="params.isSubAcctWorks==='1'?3:2" class="h-form-search">
      <div v-for="(item,index) in params.signPoolInfoList" :key="index">
        <h-form-item prop="poolName" :label="$t('m.i.pl.poolName')" :required="isContainInPool" onlyBlurRequire>
          <h-input v-model="item.poolName" placeholder="" disabled></h-input>
        </h-form-item>
        <h-form-item prop="billBailAcctNo" :label="$t('m.i.pl.poolBillBailAcctNo')" :required="isContainInPool" onlyBlurRequire>
          <h-input v-model="item.billBailAcctNo" placeholder="" disabled
                   :icon="params.optType!=='renew' ? 'android-search' : ''"
                   @on-click="queryBillBailAcctNo(index)"></h-input>
        </h-form-item>
        <h-form-item prop="poolBailSubAcctNo" :label="$t('m.i.pl.poolBailSubAcctNo')"
                     v-if="params.isSubAcctWorks==='1'" key="poolBailSubAcctNo">
          <h-input v-model="item.poolBailSubAcctNo" placeholder="" disabled>
          </h-input>
        </h-form-item>
      </div>
    </h-form>
    <!--查询池保证金账户-->
    <show-cust-acct :showCustAcctWin="showCustAcctWin" :selectCustNo="params.custNo" :title="'查看保证金账户'"
                    :selectType="'select'" :custAcctKind="2" @showCustAcctWinClose="showCustAcctWinClose"
                    @custAcctSelect="custAcctSelect"></show-cust-acct>
  </div>
</template>

<script>
export default {
  name: "multiPoolBailAcctNo",
  components: {
    ShowCustAcct: () => import(/* webpackChunkName: "bm/cust/acct/showCustAcct" */`@/views/bizViews/bm/cust/acct/showCustAcct`),
  },
  props: {
    params: {
      isContainInPool: false,
      isMultiPool: '',
      signPoolInfoList: [],
      isSubAcctWorks: "",
      optType: "",
      custNo: "",
      legalNo: "",
    }
  },
  data(){
    return{
      isContainInPool: false,
      showCustAcctWin : false,
    }
  },
  methods:{
    queryBillBailAcctNo(index) {
      if (this.params.custNo === "") {
        this.$msgTip.info(this, { info: "请先选择客户" });
        return;
      }
      this.billBailAcctNoIndex= index;
      if(this.currentSelectRow.isCollect !== '0' && this.optType === "modify" ) {
        this.showCustAcctWin = false;
      } else {
        this.showCustAcctWin = true;
      }
    },
    //客户保证金查询框关闭
    showCustAcctWinClose() {
      this.showCustAcctWin = false;
    },
    custAcctSelect(info) {
      let index = this.billBailAcctNoIndex;
      this.params.signPoolInfoList[index].billBailAcctNo = info.custAcctNo;
      this.params.signPoolInfoList[index].poolBailSubAcctNo = info.subAcctSrlNo; //子账号
      this.showCustAcctWin = false;
    },
  }
}
</script>

<style scoped>

</style>
