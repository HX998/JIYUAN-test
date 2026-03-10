<!--业务查询-流水查询-票据池额度流水查询-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper" v-if="mainVue">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.common.custName')" prop="custName">
                  <h-input v-model="formItem.custName" readonly icon="android-search"
                           @on-click="queryCustNo" clearable @on-clear="clearVal('custName')"></h-input>
                </h-form-item>
                <h-form-item class="h-form-operate one-form">
                  <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            highlight-row
            url="/pl/credit/CreditManager/creditControlLogForPool/func_pagingQueryPoolCreditBatch"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="queryDetail()">{{$t("m.i.pl.queryDetail")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <credit-log-detail-for-pool :billManagerVue="billManagerVue" :logDetailParams="logDetailParams"
                                @returnMain="returnMain"></credit-log-detail-for-pool>
    <!-- 查询客户信息弹窗 -->
    <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose"
                       @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>
   </div>
</template>

<script>
  import { on, off, post, formatNumber, accMul ,getSingleParamValuesByKeys} from "@/api/bizApi/commonUtil";

  export default {
    name: "creditControlLogForPool",
    data() {
      let columns = [
        {
          type: "radio",
          title: " ",
          width: 60,
          align: "center",
          hiddenCol: false
        },
        {
          type: "index",
          title: this.$t("m.i.common.index"),
          width: 60,
          align: "center"
        },
        {
         title:this.$t("m.i.common.custNo"),
          key: "custNo",
          hiddenCol: false,
          ellipsis: false,
          sortable: true
        },
        {
          title:this.$t("m.i.common.custName"),
          key: "custName",
          hiddenCol: false,
          ellipsis: false,
          sortable: true
        },
        {
         title:this.$t("m.i.common.custAcctNo"),
          key: "custAcctNo",
          hiddenCol: false,
          ellipsis: false
        },
        {
          title:this.$t("m.i.pl.agreementNo"),
          key: "agreementNo",
          hiddenCol: false,
          ellipsis: false,
          sortable: true
        },
        {
          title:this.$t("m.i.pl.billBailAcctNo"),
          key: "billBailAcctNo",
          hiddenCol: false,
          ellipsis: false
        },
        {
          title: this.$t('m.i.pl.poolBailSubAcctNo'),
          key: "poolBailSubAcctNo",
          hiddenCol: false,
          ellipsis: false
        },
        {
         title:this.$t("m.i.pl.bailPcet"),
          key: "bailPcet",
          hiddenCol: false,
          render: (h, params) => {
            let bailPcet = params.row.bailPcet;
            if (bailPcet != null && bailPcet !== "") {
              bailPcet = accMul(bailPcet, 100);
            }
            return h("span", bailPcet);
          }
        },
        {
         title:this.$t("m.i.pc.creditLimitAmt"),
          key: "creditLimitAmt",
          hiddenCol: false,
          ellipsis: false,
          render: (h, params) => {
            let creditLimitAmt = formatNumber(params.row.creditLimitAmt, 2, ",");
            return h("span", {
              domProps: {
                title: creditLimitAmt
              }
            }, creditLimitAmt);
          }
        },
        {
         title:this.$t("m.i.pl.inPoolAmt"),
          key: "inPoolAmt",
          ellipsis: false,
          hiddenCol: false,
          render: (h, params) => {
            let inPoolAmt = formatNumber(params.row.inPoolAmt, 2, ",");
            return h("span", {
              domProps: {
                title: inPoolAmt
              }
            }, inPoolAmt);
          }
        },
        {
          title:this.$t("m.i.pl.bailLimit"),
          key: "bailBalance",
          ellipsis: false,
          hiddenCol: false,
          render: (h, params) => {
            let bailBalance = formatNumber(params.row.bailBalance, 2, ",");
            return h("span", {
              domProps: {
                title: bailBalance
              }
            }, bailBalance);
          }
        },
        {
         title:this.$t("m.i.pl.usedCreditAmt"),
          key: "usedCreditAmt",
          ellipsis: false,
          hiddenCol: false,
          render: (h, params) => {
            let usedCreditAmt = formatNumber(params.row.usedCreditAmt, 2, ",");
            return h("span", {
              domProps: {
                title: usedCreditAmt
              }
            }, usedCreditAmt);
          }
        },
        {
         title:this.$t("m.i.pl.doPoolAmt"),
          key: "doAmt",
          ellipsis: false,
          hiddenCol: false,
          render: (h, params) => {
            let doAmt = formatNumber(params.row.doAmt, 2, ",");
            return h("span", {
              domProps: {
                title: doAmt
              }
            }, doAmt);
          }
        },
      ];
      return {
        isSubAcctWorks:"",
        currentSelectRow : [],
        columns : columns,
        cloneColumns : this.deepClone(columns),
        formItem : {
          custNo: "",
          custName: "",
        },
        dictMap : new Map(),
        creditAdjustTypeList : [],
        showCustMessageWin : false,
        mainVue : true,
        billManagerVue : false,
        logDetailParams : {},
      };
    },
    components: {
      CreditLogDetailForPool :() => import(/* webpackChunkName: "pl/credit/creditManager/creditLogDetailForPool" */`@/views/bizViews/pl/credit/creditManager/creditLogDetailForPool`)
    },
    methods: {
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      //查询客户信息
      queryCustNo() {
        this.showCustMessageWin = true;
      },
      //赋值
      custCorpSelectSubmit(info) {
        this.formItem.custNo = info.custNo;
        this.formItem.custName = info.custName;
        this.showCustMessageWin = false;
      },
      //关闭
      custCorpWinClose() {
        this.showCustMessageWin = false;
      },
      //搜索选择框清空事件
      clearVal(optType){
        if(optType === "custName"){
          this.formItem.custName = "";
          this.formItem.custNo = "";
        }
      },
      formSearch() {
        this.currentSelectRow = [];
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.formItem.custNo = "";
        this.formItem.custName = "";
      },
      //查询明细
      queryDetail() {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          this.logDetailParams.dictMap = this.dictMap;
          this.logDetailParams.creditAdjustTypeList = this.creditAdjustTypeList;
          this.logDetailParams.batchId = this.currentSelectRow.batchId;
          this.logDetailParams.custNo = this.currentSelectRow.custNo;
          this.logDetailParams.poolNo = this.currentSelectRow.poolNo;
          this.logDetailParams.poolName = this.currentSelectRow.poolName;
          this.logDetailParams.batchUrl = "/pl/credit/CreditManager/creditControlLogForPool/func_pagingQueryPoolCreditInfo";
          this.logDetailParams.batchInfoUrl = "/pl/credit/CreditManager/creditControlLogForPool/func_pagingQueryPoolCreditInfoByPoolNo";
          this.logDetailParams.isQueryLog = true;
          this.logDetailParams.showSubBillBailAcctNo = this.isSubAcctWorks==='1';
          this.mainVue = false;
          this.billManagerVue = true;
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return false;
        }
      },
      returnMain() {
        this.currentSelectRow = [];
        this.mainVue = true;
        this.billManagerVue = false;
        this.logDetailParams = {};
        this.$nextTick(() => {
          if (this.isSubAcctWorks==='0'){
            this.cloneColumns.forEach((value, index) => {
              if (value.key === 'poolBailSubAcctNo') {
                value.hiddenCol = true;
              }
            });
          }
          this.columns = this.deepClone(this.cloneColumns);
          this.$refs.datagrid.createShowCol(this.cloneColumns);
        });
      }
    },
    mounted() {
      this.getDictListByGroups("PoolCreditAdjustType,BillOrigin").then(res => {
        this.creditAdjustTypeList = res.get("PoolCreditAdjustType");
        this.dictMap = res.get("map");
      });
      getSingleParamValuesByKeys("bm.cust.is_sub_acct_works").then(res => {
          this.isSubAcctWorks = res["bm.cust.is_sub_acct_works"];
          if (this.isSubAcctWorks==='0'){
            this.$refs.datagrid.controlColumnsHidden("poolBailSubAcctNo",true);  //不显示保证金子账号
          }
        })
    }
  };
</script>

<style scoped>

</style>
