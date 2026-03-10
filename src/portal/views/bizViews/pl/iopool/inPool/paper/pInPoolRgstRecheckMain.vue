<!--纸票出入池-入池登记复核-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper" >
      <h-col span="24">
        <div v-if="mainVue">
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item prop="custNo" :label="$t('m.i.common.custNo')">
                  <h-input v-model="formItem.custNo" placeholder="" icon="android-search"
                           @on-click="queryCustNo()" clearable @on-clear="clearVal('custNo')" readonly></h-input>
                </h-form-item>
                <h-form-item prop="batchNo" :label="$t('m.i.common.batchNo')">
                  <h-input v-model="formItem.batchNo" placeholder="" ></h-input>
                </h-form-item>
                <h-form-item prop="inPoolDt" :label="$t('m.i.pl.inPoolDt')">
                  <h-date-picker type="date" v-model="formItem.inPoolDt" placeholder=""
                                 @on-change="handleDateChange" showFormat :editable=false></h-date-picker>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid
            :columns="columns"
            highlightRow
            url="/pl/iopool/inpool/paper/pInPoolRgstRecheckMain/func_pagingQueryInPoolBatchList"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="submitRecheck()">{{$t('m.i.common.submitCheck')}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <io-pool-rgst-recheck-bill :billManagerVue="billManagerVue" :ioPoolBillParams="ioPoolBillParams" ioFlag="1"
                          @returnRgstRecheckMain="returnRgstRecheckMain"></io-pool-rgst-recheck-bill>
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
  import { post, on, off, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "pInPoolRgstRecheckMain",
    components: {
      IoPoolRgstRecheckBill: () => import(/* webpackChunkName: "pl/iopool/common/ioPoolRgstRecheckBill" */ '@/views/bizViews/pl/iopool/common/ioPoolRgstRecheckBill')
    },
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
          type: "index",
          key: "numOrder",
          title: this.$t("m.i.common.index"),
          width: 60,
          align: "center",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.batchNo"),
          key: "batchNo",
          ellipsis: false,
          hiddenCol: false,
          render: (h, params) => {
            return h("div", [
              h("a", {
                on: {
                  click: () => {
                    this.openInPoolEditWin(params.row.id);
                  }
                }
              }, params.row.batchNo)
            ]);
          }
        },
        {
          title: this.$t("m.i.common.custNo"),
          key: "custNo",
          ellipsis: false,
          hiddenCol: false,
          sortable: true
        },
        {
          title: this.$t("m.i.common.custName"),
          key: "custName",
          ellipsis: false,
          hiddenCol: false,
          sortable: true
        },
        {
          title: this.$t("m.i.common.custAcctNo"),
          key: "custAcctNo",
          ellipsis: false,
          hiddenCol: false
        },
        {
         title: this.$t("m.i.pl.isCheckBeforeInPool"),
          key: "isCheckBeforeInPool",
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = this.getDictValueFromMap(this.dictMap, "Yon", params.row.isCheckBeforeInPool);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t("m.i.pl.inPoolDt"),
          key: "inPoolDt",
          ellipsis: false,
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            if (params.row.inPoolDt == null || params.row.inPoolDt === "") {
              return "";
            }
            let date = this.$moment(params.row.inPoolDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
          title: this.$t("m.i.pl.inPoolTm"),
          key: "inPoolTm",
          hiddenCol: false,
          ellipsis: false,
          sortable: true,
          render: (h, params) => {
            if (params.row.inPoolTm == null || params.row.inPoolTm === "") {
              return "";
            }
            let inPoolTm = params.row.inPoolTm.toString();
            if (params.row.inPoolTm.toString().length < 6) {
              for (let i = 0; i < (6 - params.row.inPoolTm.toString().length); i++) {
                inPoolTm = "0" + inPoolTm;
              }
            }
            let date = this.$moment(inPoolTm, "HH:mm:ss").format("HH:mm:ss");
            return h("span", date);
          }
        },
        {
          title: this.$t("m.i.pe.total"),
          key: "totalCount",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.pe.totalAmt"),
          key: "totalAmt",
          sortable: true,
          ellipsis: false,
          hiddenCol: false,
          render: (h, params) => {
            let totalAmt = formatNumber(params.row.totalAmt, 2, ",");
            return h("span", {
              domProps: {
                title: totalAmt
              }
            }, totalAmt);
          }
        }
      ];
      return {
        ifShowMore : false,
        formItem : {
          billClass: "ME01",
          custNo: "",
          custName: "",
          custAcctNo: "",
          batchNo:"",
          inPoolDt:"",
          impawnRgstStatusList: ["BTC02", "BTC05"],
          impawnRgstApplTellerNoNotEqual : JSON.parse(window.sessionStorage.getItem("userInfo")).userNo,
          auditModeKey : 'ce.impawn.is_rgst_check_exclude',
        },
        columns : columns,
        cloneColumns : this.deepClone(columns),
        currentSelectRow : [],
        mainVue : true,
        billManagerVue : false,
        showCustMessageWin : false,
        showCustAcctNoWin : false,
        dictMap : new Map(),
        ioPoolBillParams : {},
      };
    },
    mounted() {
      this.getDictListByGroups("DraftTypeCode,ImpawnRgstStatus,Yon").then(res => {
        this.dictMap = res.get("map");
      });
    },
    methods: {
      handleDateChange(value) {
        this.formItem.inPoolDt = value.replace(/-/g, "");
      },
      clearVal(type){
        if(type === 'custNo'){
          this.formItem.custNo = '';
        }
      },
      //表单查询
      handleSearch() {
        this.currentSelectRow = [];
        this.$refs.datagrid.dataChange(1);
      },
      //重置表单查询结果
      resetSearch() {
        this.formItem.custNo = "";
        this.formItem.custName = "";
        this.formItem.custAcctNo = "";
        this.formItem.batchNo = "";
        this.formItem.inPoolDt = "";
      },
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
      //提交复核
      submitRecheck() {
        if (this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.ioPoolBillParams.batchId = this.currentSelectRow.id;
        this.assembleParams();
      },
      //返回主页面
      returnRgstRecheckMain() {
        this.formItem.inPoolDt = this.formItem.inPoolDt.replace(/-/g, "");
        this.currentSelectRow = [];
        this.mainVue = true;
        this.billManagerVue = false;
        this.ioPoolBillParams = {};
        this.resetSearch();
        this.$nextTick(() => {
          this.columns = this.deepClone(this.cloneColumns);
          this.$refs.datagrid.createShowCol(this.cloneColumns);
        });
      },
      //点击批次编号超链接
      openInPoolEditWin(batchId) {
        this.ioPoolBillParams.batchId = batchId;
        this.assembleParams();
      },
      assembleParams() {
        this.ioPoolBillParams.dictMap = this.dictMap;
        this.ioPoolBillParams.billClass = this.formItem.billClass;
        this.ioPoolBillParams.impawnRgstStatusList =  this.formItem.impawnRgstStatusList;
        this.ioPoolBillParams.accountType = "inPool";
        this.ioPoolBillParams.dataUrl = "/pl/iopool/inpool/paper/pInPoolRgstRecheckMain/func_pagingQueryInPoolBill";
        this.ioPoolBillParams.batchInfoUrl = "/pl/iopool/inpool/paper/pInPoolRgstRecheckMain/func_getInPoolBatchDtoByConditon";
        this.mainVue = false;
        this.billManagerVue = true;
      }
    }
  };
</script>

<style scoped>

</style>
