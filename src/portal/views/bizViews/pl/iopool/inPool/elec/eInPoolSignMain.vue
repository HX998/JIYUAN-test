<!--电票出入池-入池签收-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper" v-if="mainVue">
      <h-col span="24">
        <!-- 主页面 -->
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item prop="custName" :label="$t('m.i.common.custName')">
                  <h-input v-model="formItem.custName" placeholder="" icon="android-search" @on-click="queryCustNo()"
                           readonly clearable @on-clear="clearVal('custName')"></h-input>
                </h-form-item>
                <h-form-item prop="custAcctNo" :label="$t('m.i.common.custAcctNo')">
                  <h-input v-model="formItem.custAcctNo" placeholder="" icon="android-search"
                           @on-click="queryCustAcctNo()" clearable @on-clear="clearVal('custAcctNo')" readonly></h-input>
                </h-form-item>
                <h-form-item class="h-form-operate two-form">
                  <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-row>
            <h-col span="24">
              <h-datagrid :columns="columns"
                          highlightRow
                          url="/pl/iopool/inpool/elec/eInPoolSignMain/func_pagingQueryInPoolBatchList"
                          :bindForm="formItem"
                          :onCurrentChange="handleCurrentChange"
                          :onCurrentChangeCancel="handleCurrentChangeCancel"
                          ref="datagrid">
                <div slot="toolbar" class="pull-left">
                  <h-button type="primary" @click="elecSign()">{{$t('m.i.pl.sign')}}</h-button>
                </div>
              </h-datagrid>
            </h-col>
          </h-row>
        </div>
      </h-col>
    </h-row>
    <e-in-pool-sign-bill :billManagerVue="billManagerVue" :inPoolBillParams="inPoolBillParams"
                        @returnSignMain="returnSignMain"></e-in-pool-sign-bill>
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
    name: "eInPoolSignMain",
    components: {
      EInPoolSignBill : () => import(/* webpackChunkName: "pl/iopool/inPool/elec/eInPoolSignBill" */ '@/views/bizViews/pl/iopool/inPool/elec/eInPoolSignBill')
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
            return h('div', [
              h('a', {
                on: {
                  click: () => {
                    this.openInPoolEditWin(params.row.id)
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
        formItem : {
          billClass: "ME02",
          funcNo: "PIPL030209",
          custNo: "",
          custName: "",
          custAcctNo: ""
        },
        columns : columns,
        cloneColumns : this.deepClone(columns),
        dictMap : new Map(),
        currentSelectRow : [],
        mainVue : true,
        billManagerVue : false,
        showCustMessageWin : false,
        showCustAcctNoWin : false,
        //是否显示更多查询项
        ifShowMore : false,
        inPoolBillParams : {},
      };
    },
    mounted() {
      this.getDictListByGroups("DraftTypeCode,Yon,BillOrigin").then(res => {
        this.dictMap = res.get("map");
      });
    },
    methods: {
      clearVal(type){
        if(type === 'custName'){
          this.formItem.custNo = '';
          this.formItem.custName = '';
        }
        if(type === 'custAcctNo'){
          this.formItem.custAcctNo = '';
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
      //签收
      elecSign() {
        if (this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.inPoolBillParams.batchId = this.currentSelectRow.id;
        this.assembleParams();
      },
      //返回主页面
      returnSignMain() {
        this.currentSelectRow = [];
        this.mainVue = true;
        this.billManagerVue = false;
        this.inPoolBillParams = {};
        this.resetSearch();
        this.$nextTick(() => {
          this.columns = this.deepClone(this.cloneColumns);
          this.$refs.datagrid.createShowCol(this.cloneColumns);
        });
      },
      //点击批次编号超链接
      openInPoolEditWin(batchId) {
        this.inPoolBillParams.batchId = batchId;
        this.assembleParams();
      },
      assembleParams() {
        this.inPoolBillParams.dictMap = this.dictMap;
        this.inPoolBillParams.funcNo = this.formItem.funcNo;
        this.inPoolBillParams.billClass = this.formItem.billClass;
        this.inPoolBillParams.accountType = "inPool";
        this.inPoolBillParams.batchInfoUrl = "/pl/iopool/inpool/elec/eInPoolSignMain/func_getInPoolBatchDtoByConditon";
        this.mainVue = false;
        this.billManagerVue = true;
      }
    }
  };
</script>

<style scoped>

</style>
