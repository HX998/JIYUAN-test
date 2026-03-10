<!--额度批复-票据池额度批复-->
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
            url="/pl/credit/CreditManager/creditGrantBatchForPool/func_pagingQueryCreditBatch"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="handleCreditGrantInfo">{{$t("m.i.pc.creditGrantInfo")}}
              </h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <credit-grant-info-for-pool :billManagerVue="billManagerVue" :creditGrantInfoParams="creditGrantInfoParams"
                                @returnMain="returnMain"></credit-grant-info-for-pool>
    <!-- 查询客户信息弹窗 -->
    <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose"
                       @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>
  </div>
</template>

<script>
  import { on, off, post, formatNumber, accMul ,getSingleParamValuesByKeys} from "@/api/bizApi/commonUtil";

  export default {
    name: "creditGrantBatchForPool",
    data() {
      let columns = [
        {
          type: "radio",
          width: 60,
          title: " ",
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
          title: this.$t("m.i.pl.isGroupCus"),
          key: "isGroupCus",
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = this.getDictValueFromMap(this.dictMap, "Yon", params.row.isGroupCus);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title:this.$t("m.i.pl.agreementNo"),
          key: "agreementNo",
          hiddenCol: false,
          ellipsis: false,
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
          title: this.$t("m.i.pl.creditDt"),
          key: "creditDt",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let date = params.row.creditDt == null ? "" : this.$moment(params.row.creditDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
          title: this.$t("m.i.pl.totalCount"),
          key: "totalCount",
          hiddenCol: false
        }
      ];
      return {
        currentSelectRow : [],
        columns : columns,
        cloneColumns : this.deepClone(columns),
        formItem : {
          custNo: "",
          custName: "",
        },
        dictMap : new Map(),
        showCustMessageWin : false,
        mainVue : true,
        billManagerVue : false,
        creditGrantInfoParams : {},
        isSubAcctWorks:"",
      };
    },
    components: {
      CreditGrantInfoForPool:() => import(/* webpackChunkName: "pl/credit/creditManager/creditGrantInfoForPool" */`@/views/bizViews/pl/credit/creditManager/creditGrantInfoForPool`)
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
      //批复明细
      handleCreditGrantInfo() {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          this.creditGrantInfoParams.batchId = this.currentSelectRow.batchId;
          this.creditGrantInfoParams.isMainGroupCus = this.currentSelectRow.isMainGroupCus;
          this.creditGrantInfoParams.agreementNo = this.currentSelectRow.agreementNo;
          this.creditGrantInfoParams.isGroupCus = this.currentSelectRow.isGroupCus;
          this.creditGrantInfoParams.custNo = this.currentSelectRow.custNo;
          this.creditGrantInfoParams.custName = this.currentSelectRow.custName;
          this.creditGrantInfoParams.poolNo = this.currentSelectRow.poolNo;
          this.creditGrantInfoParams.poolName = this.currentSelectRow.poolName;
          this.creditGrantInfoParams.batchInfoUrl = "/pl/credit/CreditManager/creditGrantBatchForPool/func_pagingQueryPoolCreditInfoByPoolNo";
          this.creditGrantInfoParams.showSubBillBailAcctNo= this.isSubAcctWorks==='1';
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
        this.creditGrantInfoParams = {};
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
      this.getDictListByGroups("Yon").then(res => {
        this.dictMap = res.get("map");
      });
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
