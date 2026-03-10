<!--业务查询-发生查询-入池发生查询-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <show-branch v-model="formItem.brchNoList" :label="$t('m.i.pl.transBrchName')" prop="brchNoList"
                             title="机构名称" :brchNo.sync="formItem.brchNoList" :brchName.sync="formItem.brchNameList">
                </show-branch>
                <h-form-item prop="acptName" :label="$t('m.i.billInfo.acptName')">
                  <h-input v-model="formItem.acptName" placeholder="" :maxlength="125"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.stockStatus')" prop="stockStatus">
                  <h-select v-model="formItem.stockStatus" placeholder="">
                    <h-option v-for="item in stockStatusList" :value="item.key" :key="item.key">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType">
                  <h-select v-model="formItem.billType" placeholder="">
                    <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.pl.occurDt')">
                  <h-date-picker :value="remitDt" type="daterange" showFormat :editable=false
                                 @on-change="handleRemitDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <common-select v-model="formItem.billOrigin" :label="$t('m.i.billInfo.billOrigin')" prop="billOrigin"
                               :dictList="billOriginArray"></common-select>
                <bill-no :label="$t('m.i.billInfo.billPackageNo')" prop="likeBillNo" v-model="formItem.likeBillNo"></bill-no>
                <bill-range :form-item="formItem" :range-props="['minBillRangeStart','maxBillRangeEnd']" ></bill-range>
                <h-form-item :label="$t('m.i.billInfo.dueDt')" prop="minDueDt">
                <h-date-picker :value="dueDt" type="daterange" autoPlacement showFormat :editable=false
                @on-change="handleDueDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item prop="custName" :label="$t('m.i.common.custName')">
                  <h-input v-model="formItem.custName" placeholder="" icon="android-search" @on-click="queryCustNo()"
                           readonly clearable @on-clear="clearVal('custName')"></h-input>
                </h-form-item>
                <h-form-item prop="custAcctNo" :label="$t('m.i.common.custAcctNo')">
                  <h-input v-model="formItem.custAcctNo" placeholder="" readonly icon="android-search"
                           @on-click="queryCustAcctNo()" clearable @on-clear="clearVal('custAcctNo')"></h-input>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                                  :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <div class="h-form-search-box">
            <h-panel class="h-form-search-box clearfix">
              <h-form :label-width="90" class="h-form-search" cols="4">
                <div class="h-search-form-row">
                  <h-form-item :label="$t('m.i.pe.sumMoney')" class="h-form-long-label">
                    <h-input v-model="sumMoney" placeholder="" readonly></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.pe.total')">
                    <h-input v-model="total" placeholder="" readonly></h-input>
                  </h-form-item>
                </div>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid
            :columns="columns"
            highlightRow
            rowSelect
            :hasSelect = false
            :url="dataUrl"
            @getSumMoneyAndTotal="getSumMoneyAndTotal"
            :auto-load="false"
            :bindForm="formItem"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="queryBatch()">{{$t('m.i.pe.queryAcptOccurBatch')}}</h-button>
              <h-button type="primary" @click="queryBill()">{{$t('m.i.pe.queryAcptOccurBill')}}</h-button>
              <h-button type="primary" @click="batchExport()" :disabled="this.ifDisabledExport">{{$t('m.i.pe.arrayExport')}}</h-button>
              <h-button type="primary" @click="billExport()" :disabled="!this.ifDisabledExport">{{$t('m.i.pe.flowExport')}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!-- 查询客户信息弹窗 -->
    <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose"
                       @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>
    <!-- 查询客户账号信息弹窗 -->
    <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" :cust-no="this.formItem.custNo"
                       @showCustAcctNoWinClose="showCustAcctNoWinClose"
                       @custAcctNoSelectSubmit="custAcctNoSelectSubmit"></show-cust-acct-no>
    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin"
                    :bill-range-start="this.billRangeStart" :bill-range-end="this.billRangeEnd"
                    :billId="this.billId" :billNo="this.billNo"></bill-info-main>
    <!-- 明细导出 -->
    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param" :rows="this.rows"></common-excel-download>

  </div>
</template>

<script>
  import { post, on, off, formatNumber ,formatBillRange} from "@/api/bizApi/commonUtil";

  export default {
    name: "inPoolQuery",
    components: {

    },
    data() {
      return {
        ifShowMore : false,
        ifDisabledExport: false,
        dataUrl : "pl/iopool/inpool/occurQuery/batch/func_pagingQueryInPoolBatchList",
        billOriginArray: [],
        formItem : {
          brchNoList: JSON.parse(window.sessionStorage.getItem('userInfo')).brchNo,
          brchNameList:JSON.parse(window.sessionStorage.getItem('userInfo')).brchName,
          acptName: "",
          stockStatus: "",
          billType: "",
          minAcctDt: "",
          maxAcctDt: "",
          likeBillNo: "",
          minBillRangeStart: "",
          maxBillRangeEnd: "",
          custNo: "",
          custName: "",
          custAcctNo: "",
          batchId: "",
          billOrigin: "",
          minDueDt: "",
          maxDueDt: "",
        },
        remitDt : [],
        columns : [],
        batchColumns : [
          {
            type: "selection",
            width: 60,
            align: "center",
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
            width: 150,
            render: (h, params) => {
              return h("div", [
                h("a", {
                  on: {
                    click: () => {
                      this.queryBill(params.row.id);
                    }
                  }
                }, params.row.batchNo)
              ]);
            }
          },
          {
            title: this.$t("m.i.pl.transBrchName"),
            key: "transBrchName",
            ellipsis: false,
            hiddenCol: false
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
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
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
            title: this.$t('m.i.common.createDt'),
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
        ],
        billColumns : [
          {
            type: "selection",
            width: 60,
            align: "center",
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
            title: this.$t("m.i.billInfo.stockStatus"),
            key: "stockStatus",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "PoolBillStockStatus", params.row.stockStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.billInfo.billOrigin"),
            key: "billOrigin",
            hiddenCol: false,
            align: "center",
            render: (h, params) => {
              let bOrigin = params.row.billOrigin;
              let list = "-";
              if (bOrigin === "CS01" || bOrigin === "CS02" || bOrigin === "CS03") {
                list = this.getDictValueFromMap(this.dictMap, "BillOrigin", bOrigin);
              }
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.billInfo.billPackageNo"),
            key: "billNo",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let type = "";
              if (!!params.row.billId) {
                type = "billId";
              } else {
                type = "billNo";
              }
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params.row, type);
                  }
                }
              }, params.row.billNo);
            }
          },
          {
            title: this.$t("m.i.billInfo.billRange"),
            align:'center',
            key:"billRange",
            hiddenCol: false,
            render:(h,params) => {
              let billOrigin = params.row.billOrigin;
              let billRangeStart = params.row.billRangeStart;
              let billRangeEnd = params.row.billRangeEnd;
              return h("span", formatBillRange(billOrigin, billRangeStart, billRangeEnd))
            }
          },
          {
            title: this.$t("m.i.pl.transBrchName"),
            key: "transBrchName",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.pl.occurDt"),
            key: "acctDt",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.acctDt == null || params.row.acctDt === "") {
                return "";
              }
              let date = this.$moment(params.row.acctDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
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
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
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
            title: this.$t("m.i.billInfo.flowStatus"),
            key: "flowStatusName",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.billPackageMoney"),
            key: "billMoney",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let billMoney = formatNumber(params.row.billMoney, 2, ",");
              return h("span", {
                domProps: {
                  title: billMoney
                }
              }, billMoney);
            }
          },
          {
            title: this.$t("m.i.billInfo.remitDt"),
            key: "remitDt",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.remitDt == null || params.row.remitDt === "") {
                return "";
              }
              let date = this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.billInfo.dueDt"),
            key: "dueDt",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.dueDt == null || params.row.dueDt === "") {
                return "";
              }
              let date = this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.billInfo.drwrName"),
            key: "drwrName",
            sortable: true,
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.drwrAcctNo"),
            key: "drwrAcctNo",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.drwrBankNo"),
            key: "drwrBankNo",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.pyeeName"),
            key: "pyeeName",
            sortable: true,
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.pyeeAcctNo"),
            key: "pyeeAcctNo",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.acptName"),
            key: "acptName",
            ellipsis: false,
            hiddenCol: false,
            sortable: true
          }
        ],
        showCustMessageWin : false,
        showCustAcctNoWin : false,
        showBillInfoWin : false,
        billId : "",
        billNo : "",
        billRangeStart: "",
        billRangeEnd: "",
        dictMap : new Map(),
        stockStatusList : [],
        billTypeList : [],
        tempShowExcelTemplateWin:false,
        param : null,
        rows : null,
        sumMoney: "",
        total: "",
      };
    },
    created() {
      this.$nextTick(() => {
        this.columns = this.deepClone(this.batchColumns);
        this.$refs.datagrid.createShowCol(this.batchColumns);
        this.$refs.datagrid.dataChange(1);
      });
    },
    mounted() {
      this.getDictListByGroups("DraftTypeCode,PoolBillStockStatus,BillOrigin").then(res => {
        this.stockStatusList = res.get("PoolBillStockStatus");
        this.billOriginArray = res.get("BillOrigin");
        this.billTypeList = res.get("DraftTypeCode");
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
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.dataChange(1);
      },
      //重置表单查询结果
      resetSearch() {
        this.formItem.brchNoList = JSON.parse(window.sessionStorage.getItem('userInfo')).brchNo;
        this.formItem.brchNameList = JSON.parse(window.sessionStorage.getItem('userInfo')).brchName;
        this.formItem.acptName = "";
        this.formItem.custNo = "";
        this.formItem.minAcctDt = "";
        this.formItem.maxAcctDt = "";
        this.formItem.stockStatus = "";
        this.formItem.billType = "";
        this.formItem.likeBillNo="";
        this.formItem.minDueDt = "";
        this.formItem.maxDueDt = "";
        this.remitDt = [];
        this.dueDt = [];
        this.$refs.formItem.resetFields();
      },
      handleRemitDtChange(arr) {
        if (arr&&arr.length==2){
          this.formItem.minAcctDt = arr[0].replace(/-/g, "");
          this.formItem.maxAcctDt = arr[1].replace(/-/g, "");
          this.remitDt = [arr[0], arr[1]];
        } else {
          this.formItem.minAcctDt = "";
          this.formItem.maxAcctDt = "";
          this.remitDt = [];
        }
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
      //查询批次
      queryBatch() {
        this.ifDisabledExport = false;
        this.dataUrl = "/pl/iopool/inpool/occurQuery/batch/func_pagingQueryInPoolBatchList";
        this.$nextTick(() => {
          this.columns = this.deepClone(this.batchColumns);
          this.$refs.datagrid.createShowCol(this.batchColumns);
          this.$refs.datagrid.dataChange(1);
          this.$refs.datagrid.selects = [];
          this.$refs.datagrid.selectIds = [];
        });
      },
      //查询明细
      queryBill(batchId) {
        if (!!batchId) {
          this.formItem.batchId = batchId;
        } else {
          this.formItem.batchId = "";
        }
        this.ifDisabledExport = true;
        this.dataUrl = "/pl/iopool/inpool/occurQuery/bill/func_pagingQueryInPoolBillList";
        this.$nextTick(() => {
          this.columns = this.deepClone(this.billColumns);
          this.$refs.datagrid.createShowCol(this.billColumns);
          this.$refs.datagrid.dataChange(1);
          this.$refs.datagrid.selects = [];
          this.$refs.datagrid.selectIds = [];
        });
      },
      //清单导出
      billExport() {
        this.param = 'getInPoolQueryExportInfo';
        if (this.$refs.datagrid.selectIds.length !== 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        }else {
          this.rows = this.$refs.datagrid.total;
        }
        this.tempShowExcelTemplateWin = true;
      },
      batchExport() {
        this.param = 'getInPoolQueryBatchExportInfo';
        if (this.$refs.datagrid.selectIds.length !== 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        }else {
          this.rows = this.$refs.datagrid.total;
        }
        this.tempShowExcelTemplateWin = true;
      },
      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },
      handleDueDtChange(arr) {
        if (arr && arr.length == 2) {
          this.formItem.minDueDt = arr[0].replace(/-/g, "");
          this.formItem.maxDueDt = arr[1].replace(/-/g, "");
          this.dueDt = [arr[0], arr[1]];
        } else {
          this.formItem.minDueDt = "";
          this.formItem.maxDueDt = "";
          this.dueDt = [];
        }
      },
      getSumMoneyAndTotal(params) {
        this.total = params.total;
        this.sumMoney = formatNumber(params.sumMoney, 2, ",");
      },
      //清单导出
      exportList(field, exportType) {
        //exportType: 0-同步 1-异步
        if (exportType === "1") {
          let pageSize = this.$refs.datagrid.total;
          if (this.$refs.datagrid.total === 0) {
            pageSize = 1;
          }
          let url = '';
          if ('getInPoolQueryExportInfo' === this.param) {
            url = window.LOCAL_CONFIG.API_HOME + "/pl/iopool/inpool/occurQuery/bill/func_exportData";
          }else if ('getInPoolQueryBatchExportInfo' === this.param) {
            url = window.LOCAL_CONFIG.API_HOME + "/pl/iopool/inpool/occurQuery/bill/func_exportBatchData";
          }
          let params = null;
          if (this.$refs.datagrid.selectIds.length !== 0) {
            params = {
              ids: this.$refs.datagrid.selectIds,
              pageSize: this.$refs.datagrid.selectIds.length,
              field: field,
              exportType: exportType,
              excelName: this.param
            };
          } else {
            params = {
              brchNoList: this.formItem.brchNoList,
              brchNameList: this.formItem.brchNameList,
              acptName: this.formItem.acptName,
              stockStatus: this.formItem.stockStatus,
              billType: this.formItem.billType,
              minAcctDt: this.formItem.minAcctDt,
              maxAcctDt: this.formItem.maxAcctDt,
              likeBillNo: this.formItem.likeBillNo,
              custNo: this.formItem.custNo,
              custName: this.formItem.custName,
              custAcctNo: this.formItem.custAcctNo,
              batchId: this.formItem.batchId,
              field: field,
              exportType: exportType,
              excelName: this.param,
              pageSize: pageSize
            };
          }
          post(params, url).then(res => {
            if (res.status === 200 && res.data === null) {
              this.$msgTip.info(this, {info: "异步导出成功，请进入公共管理》导出下载页面，进行下载"});
            } else if (res.status === 200 && res.data === "") {
              this.$msgTip.info(this, {info: "异步导出成功，请进入公共管理》导出下载页面，进行下载"});
            } else {
              this.$msgTip.error(this, {info: "异步导出失败"});
            }
          });
        } else {
          if (this.$refs.datagrid.selectIds.length !== 0) {
            let url = '';
            if ('getInPoolQueryExportInfo' === this.param) {
              url = window.LOCAL_CONFIG.API_HOME + "/pl/iopool/inpool/occurQuery/bill/func_exportData";
            }else if ('getInPoolQueryBatchExportInfo' === this.param) {
              url = window.LOCAL_CONFIG.API_HOME + "/pl/iopool/inpool/occurQuery/bill/func_exportBatchData";
            }
            let form = document.createElement("form");
            form.setAttribute("id", "formId");
            form.setAttribute("action", url);
            form.setAttribute("method", "post");

            let input1 = document.createElement('input')
            input1.type = 'text'
            input1.name = 'ids';
            input1.value = this.$refs.datagrid.selectIds;
            form.appendChild(input1)
            let input2 = document.createElement('input')
            input2.type = 'text'
            input2.name = 'pageSize';
            input2.value = this.$refs.datagrid.selectIds.length;
            form.appendChild(input2)
            let input3 = document.createElement('input')
            input3.type = 'text'
            input3.name = 'field';
            input3.value = field;
            form.appendChild(input3)
            let input4 = document.createElement('input')
            input4.type = 'text'
            input4.name = 'exportType';
            input4.value = exportType;
            form.appendChild(input4)
            let input5 = document.createElement('input')
            input5.type = 'text'
            input5.name = 'excelName';
            input5.value = this.param;
            form.appendChild(input5)

            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
          } else {
            let url = '';
            if ('getInPoolQueryExportInfo' === this.param) {
              url = window.LOCAL_CONFIG.API_HOME + "/pl/iopool/inpool/occurQuery/bill/func_exportData";
            }else if ('getInPoolQueryBatchExportInfo' === this.param) {
              url = window.LOCAL_CONFIG.API_HOME + "/pl/iopool/inpool/occurQuery/bill/func_exportBatchData";
            }
            let form = document.createElement("form");
            for (let obj in this.formItem) {
              if (this.formItem.hasOwnProperty(obj)) {
                let input = document.createElement('input')
                input.type = 'text'
                input.name = obj;
                input.value = this.formItem[obj];
                form.appendChild(input)
              }
            }
            form.setAttribute("id", "formId");
            form.setAttribute("action", url);
            form.setAttribute("method", "post");
            if (this.$refs.datagrid.total > 0) {
              let input1 = document.createElement('input')
              input1.type = 'text'
              input1.name = 'pageSize';
              input1.value = this.$refs.datagrid.total;
              form.appendChild(input1)
            }
            let input3 = document.createElement('input')
            input3.type = 'text'
            input3.name = 'field';
            input3.value = field;
            form.appendChild(input3)
            let input4 = document.createElement('input')
            input4.type = 'text'
            input4.name = 'exportType';
            input4.value = exportType;
            form.appendChild(input4)
            let input5 = document.createElement('input')
            input5.type = 'text'
            input5.name = 'excelName';
            input5.value = this.param;
            form.appendChild(input5)

            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
          }
        }
      },
      billInfoWinClose() {
        this.showBillInfoWin = false;
      },
      showBillInfo(info, type) {
        if (type === "billId") {
          this.billId = info.billId;
        } else {
          this.billNo = info.billNo;
        }
        this.billRangeStart = info.billRangeStart;
        this.billRangeEnd = info.billRangeEnd;
        this.showBillInfoWin = true;
      }
    }
  };
</script>

<style scoped>

</style>
