<!--纸票出入池-出池跟踪查询-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper" v-if="mainVue">
      <h-col span="24">
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
                           @on-click="queryCustAcctNo()" readonly clearable @on-clear="clearVal('custAcctNo')"></h-input>
                </h-form-item>
                <h-form-item prop="likeBillNo" :label="$t('m.i.billInfo.billNo')">
                  <h-input v-model="formItem.likeBillNo" placeholder="" :maxLength="30"></h-input>
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
            url="/pl/iopool/outpool/paper/pOutPoolTrackSearch/func_pagingQueryOutPoolBatchList"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="billDetail()">{{$t('m.i.pl.billMainManager')}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <io-pool-track-search :billManagerVue="billManagerVue" :ioPoolBillParams="ioPoolBillParams" :batchInfoShowVue=true
                          @returnTrackSearchMain="returnTrackSearchMain"></io-pool-track-search>
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
    name: "pOutPoolTrackSearch",
    components: {
      IoPoolTrackSearch: () => import( /* webpackChunkName: "pl/iopool/common/ioPoolTrackSearch" */ '@/views/bizViews/pl/iopool/common/ioPoolTrackSearch')
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
                        this.openOutPoolEditWin(params.row);
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
              title: this.$t("m.i.billInfo.billType"),
              key: "billType",
              ellipsis: false,
              hiddenCol: false,
              render: (h, params) => {
                let dictValue = this.getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
                return h("span", {
                  domProps: {
                    title: dictValue
                  }
                }, dictValue);
              }
            },
            {
              title: this.$t("m.i.pl.getWay"),
              key: "getWay",
              ellipsis: false,
              hiddenCol: false,
              render: (h, params) => {
                let dictValue = this.getDictValueFromMap(this.dictMap, "GetWay", params.row.getWay);
                return h("span", {
                  domProps: {
                    title: dictValue
                  }
                }, dictValue);
              }
            },
            {
              title: this.$t("m.i.pl.outPoolDt"),
              key: "outPoolDt",
              ellipsis: false,
              hiddenCol: false,
              sortable: true,
              render: (h, params) => {
                if (params.row.outPoolDt == null || params.row.outPoolDt === "") {
                  return "";
                }
                let date = this.$moment(params.row.outPoolDt, "YYYY-MM-DD").format("YYYY-MM-DD");
                return h("span", date);
              }
            },
            {
              title: this.$t("m.i.pl.outPoolTm"),
              key: "outPoolTm",
              hiddenCol: false,
              ellipsis: false,
              sortable: true,
              render: (h, params) => {
                if (params.row.outPoolTm == null || params.row.outPoolTm === "") {
                  return "";
                }
                let outPoolTm = params.row.outPoolTm.toString();
                if (params.row.outPoolTm.toString().length < 6) {
                  for (let i = 0; i < (6 - params.row.outPoolTm.toString().length); i++) {
                    outPoolTm = "0" + outPoolTm;
                  }
                }
                let date = this.$moment(outPoolTm, "HH:mm:ss").format("HH:mm:ss");
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
        //是否显示更多查询项
        ifShowMore : false,
        formItem : {
          billClass: "ME01",
          custNo: "",
          custName: "",
          custAcctNo: "",
          likeBillNo:""
        },
        columns: columns,
        cloneColumns : this.deepClone(columns),
        currentSelectRow : [],
        mainVue : true,
        billManagerVue : false,
        showCustMessageWin : false,
        showCustAcctNoWin : false,
        dictMap : new Map(),
        ioPoolBillParams : {},
      }
    },
    mounted() {
      this.getDictListByGroups("DraftTypeCode,Yon,ImpawnRgstStatus,UpbsQueryAnswerStatus,GetWay").then(res => {
        this.dictMap = res.get("map");
      });
    },
    methods: {
      clearVal(type){
        if (type === 'custName') {
          this.formItem.custNo = "";
          this.formItem.custName = "";
          this.formItem.custAcctNo = "";
        } else {
          this.formItem.custAcctNo = "";
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
        this.formItem.likeBillNo = "";
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
      billDetail() {
        if (this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.ioPoolBillParams.batchId = this.currentSelectRow.id;
        this.assembleParams();
      },
      //返回主页面
      returnTrackSearchMain() {
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
      openOutPoolEditWin(info) {
        this.currentSelectRow = info;
        this.ioPoolBillParams.batchId = info.id;
        this.assembleParams();
      },
      assembleParams() {
        this.ioPoolBillParams.dictMap = this.dictMap;
        this.ioPoolBillParams.billClass = this.formItem.billClass;
        this.ioPoolBillParams.accountType = "outPool";
        this.ioPoolBillParams.custName = this.currentSelectRow.custName;
        this.ioPoolBillParams.custAcctNo = this.currentSelectRow.custAcctNo;
        this.ioPoolBillParams.dataUrl = "/pl/iopool/outpool/paper/pOutPoolTrackSearch/func_pagingQueryOutPoolBill";
        this.ioPoolBillParams.batchInfoUrl = "/pl/iopool/outpool/paper/pOutPoolTrackSearch/func_queryBatchInfo";
        this.mainVue = false;
        this.billManagerVue = true;
      }
    }
  };
</script>

<style scoped>

</style>
