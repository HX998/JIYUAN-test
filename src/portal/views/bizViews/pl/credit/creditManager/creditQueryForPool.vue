<!--业务查询-公共查询-票据池额度查询-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper" v-if="mainVue">
      <!--右侧数据展示表格-->
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item prop="custName" :label="$t('m.i.common.custName')">
                  <h-input v-model="formItem.custName" placeholder="" icon="android-search"
                           @on-click="queryCustNo()" clearable @on-clear="clearVal('custName')" readonly></h-input>
                </h-form-item>
                <h-form-item prop="custAcctNo" :label="$t('m.i.common.custAcctNo')">
                  <h-input v-model="formItem.custAcctNo" placeholder="" icon="android-search"
                           @on-click="queryCustAcctNo()" clearable @on-clear="clearVal('custAcctNo')" readonly></h-input>
                </h-form-item>
                <h-form-item class="h-form-operate two-form">
                  <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            highlightRow
            url="/pl/credit/CreditManager/creditQueryForPool/func_pagingQueryPoolCreditBatch"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="syncBailBalance()">{{$t("m.i.pl.syncBailBalance")}}</h-button>
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
    <!-- 查询客户账号信息弹窗 -->
    <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" :cust-no="this.formItem.custNo"
                       @showCustAcctNoWinClose="showCustAcctNoWinClose"
                       @custAcctNoSelectSubmit="custAcctNoSelectSubmit"></show-cust-acct-no>
  </div>
</template>

<script>
  import { post, on, off, formatNumber, accMul ,getSingleParamValuesByKeys} from "@/api/bizApi/commonUtil";
  export default {
    name: "creditQueryForPool",
    data() {
      let columns = [
        {
          type: "radio",
          title: " ",
          key: "multiSelect",
          width: 60,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.index"),
          type: "index",
          width: 60,
          align: "center",
          hiddenCol: false
        },
        {
         title:this.$t("m.i.common.custNo"),
          key: "custNo",
          ellipsis: false,
          hiddenCol: false,
          sortable: true
        },
        {
          title:this.$t("m.i.common.custName"),
          key: "custName",
          ellipsis: false,
          hiddenCol: false,
          sortable: true
        },
        {
         title:this.$t("m.i.common.custAcctNo"),
          key: "custAcctNo",
          hiddenCol: false,
          ellipsis: false,
          sortable: true
        },
        {
          title:this.$t("m.i.pl.agreementNo"),
          key: "agreementNo",
          hiddenCol: false,
          ellipsis: false
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
          ellipsis: false,
          hiddenCol: false,
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
          hiddenCol: false,
          ellipsis: false,
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
          hiddenCol: false,
          ellipsis: false,
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
          hiddenCol: false,
          ellipsis: false,
          render: (h, params) => {
            let doAmt = formatNumber(params.row.doAmt, 2, ",");
            return h("span", {
              domProps: {
                title: doAmt
              }
            }, doAmt);
          }
        }
      ];
      return {
        formItem : {
          custNo: "",
          custName: "",
          custAcctNo: ""
        },
        columns : columns,
        cloneColumns : this.deepClone(columns),
        currentSelectRow : [],
        showCustMessageWin : false,
        showCustAcctNoWin : false,
        mainVue : true,
        billManagerVue : false,
        logDetailParams : {},
        isSubAcctWorks:""
      };
    },
    components: {
      CreditLogDetailForPool:() => import(/* webpackChunkName: "pl/credit/creditManager/creditLogDetailForPool" */`@/views/bizViews/pl/credit/creditManager/creditLogDetailForPool`)
    },
    methods: {
      //查询客户信息
      queryCustNo() {
        this.showCustMessageWin = true;
      },
      //赋值
      custCorpSelectSubmit(info) {
        this.formItem.custNo = info.custNo;
        this.formItem.custName = info.custName;
        if (info.custAcctNo !== "") {
          this.formItem.custAcctNo = info.custAcctNo;
        } else {
          this.formItem.custAcctNo = "";
        }
        this.showCustMessageWin = false;
      },
      //关闭
      custCorpWinClose() {
        this.showCustMessageWin = false;
      },
      //查询客户账号信息
      queryCustAcctNo() {
        if (this.formItem.custNo === "") {
          this.$msgTip.info(this, { info: "请先选择客户" });
          return;
        }
        this.showCustAcctNoWin = true;
      },
      //赋值
      custAcctNoSelectSubmit(info) {
        this.formItem.custAcctNo = info.custAcctNo;
        this.showCustAcctNoWin = false;
      },
      //关闭弹窗
      showCustAcctNoWinClose() {
        this.showCustAcctNoWin = false;
      },
      //搜索选择框清空事件
      clearVal(optType){
        if(optType === "custName"){
          this.formItem.custName = "";
          this.formItem.custNo = "";
        }
        if(optType === "custAcctNo"){
          this.formItem.custAcctNo = "";
        }
      },
      formSearch() {
        this.currentSelectRow = [];
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        debugger;
        this.$refs.formItem.resetFields();
        this.formItem.custNo = "";
        this.formItem.custName = "";
        this.formItem.custAcctNo = "";
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      //余额同步
      syncBailBalance() {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          let params = { custNo: this.currentSelectRow.custNo, bailAcctNo: this.currentSelectRow.billBailAcctNo ,subBailAcctNo:this.currentSelectRow.poolBailSubAcctNo};
          post(params, "/pl/bail/bailManager/bailForceDeposit/func_syncBailAcctNo").then(res => {
            if (res) {
              let retCode = res.data.retCode;
              let bailPcet = this.currentSelectRow.bailPcet;
              if (retCode === "000000") {
                this.$msgTip.info(this, { info: "同步成功！</br>原余额：" + formatNumber(this.currentSelectRow.bailAmt, 2, ",") + "</br>新余额："
                    + formatNumber(res.data.retData.currentBalance , 2, "," ) });
                this.formSearch();
              } else {
                this.$msgTip.error(this, { info: res.data.retMsg });
              }
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      //查询明细
      queryDetail() {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          this.logDetailParams.batchId = this.currentSelectRow.batchId;
          this.logDetailParams.custNo = this.currentSelectRow.custNo;
          this.logDetailParams.poolNo = this.currentSelectRow.poolNo;
          this.logDetailParams.batchUrl = "/pl/credit/CreditManager/creditQueryForPool/func_pagingQueryPoolCreditInfo";
          this.logDetailParams.isQueryLog = false;
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
    mounted(){
      getSingleParamValuesByKeys("bm.cust.is_sub_acct_works").then(res => {
        this.isSubAcctWorks = res["bm.cust.is_sub_acct_works"];
        if (this.isSubAcctWorks==='0'){
          this.$refs.datagrid.controlColumnsHidden("poolBailSubAcctNo",true);  //不显示保证金子账号
        }
      });
    }
  };
</script>

<style scoped>

</style>
