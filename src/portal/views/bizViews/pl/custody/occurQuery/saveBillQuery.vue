<!--业务查询-发生查询-存票发生查询-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <show-branch v-model="formItem.transBrchNoList" :label="$t('m.i.pl.transBrchName')" prop="transBrchNo" :showCheckBox="true"
                             title="机构名称" :brchNo.sync="formItem.transBrchNoList" :brchName.sync="formItem.transBrchNameList">
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
                <h-form-item :label="$t('m.i.pl.occurDt')" prop="acctDt">
                  <h-date-picker :value="acctDt" type="daterange" showFormat :editable=false
                                 @on-change="handleAcctDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <common-select v-model="formItem.billOrigin" :label="$t('m.i.billInfo.billOrigin')" prop="billOrigin"
                               :dictList="billOriginArray"></common-select>
                <bill-no :label="$t('m.i.billInfo.billPackageNo')" prop="likeBillNo" v-model="formItem.likeBillNo"></bill-no>
                <bill-range :form-item="formItem" :range-props="['minBillRangeStart','maxBillRangeEnd']" ></bill-range>
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
          <!-- 数据展示表格 -->
          <h-datagrid
            :columns="columns"
            :url="dataUrl"
            :bindForm="formItem"
            :has-select="hasSelect"
            :auto-load="false"
            highlightRow
            rowSelect
            :hasSelect = false
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="queryBatch()">{{$t('m.i.pe.queryAcptOccurBatch')}}</h-button>
              <h-button type="primary" @click="queryBill()">{{$t('m.i.pe.queryAcptOccurBill')}}</h-button>
              <h-button type="primary" @click="batchExport()" :disabled="!this.ifDisabledExport">{{$t('m.i.pe.arrayExport')}}</h-button>
              <h-button type="primary" @click="billExport()" :disabled="this.ifDisabledExport">{{$t('m.i.pe.flowExport')}}</h-button>
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
    name: "saveBillQuery",
    components: {

    },
    data() {
      return {
        tempShowExcelTemplateWin : false,
        param : null,
        rows : null,
        ifShowMore : false,
        hasSelect : false,
        dataUrl : "/pl/custody/occurQuery/saveBillQuery/func_pageOccurQuerySaveBatchList",
        billOriginArray: [],
        formItem : {
          transBrchNoList: JSON.parse(window.sessionStorage.getItem('userInfo')).brchNo,
          transBrchNameList: JSON.parse(window.sessionStorage.getItem('userInfo')).brchName,
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
        },
        acctDt : [],
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
            sortable: true,
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
            title: this.$t("m.i.pl.checkType"),
            key: "checkType",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "CheckType", params.row.checkType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.common.createDt'),
            key: "saveBatchDt",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.saveBatchDt == null || params.row.saveBatchDt === "") {
                return "";
              }
              let date = this.$moment(params.row.saveBatchDt, "YYYY-MM-DD").format("YYYY-MM-DD");
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
            title: this.$t("m.i.billInfo.billOrigin"),
            key: "billOrigin",
            align: "center",
            hiddenCol: false,
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
            title: this.$t("m.i.billInfo.stockStatus"),
            key: "stockStatus",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let value =  this.getDictValueFromMap(this.dictMap, "PoolBillStockStatus", params.row.stockStatus);
              return h("span", {
                domProps: {
                  title: value
                }
              }, value);
            }
          },
          {
            title: this.$t("m.i.pl.transBrchName"),
            key: "transBrchName",
            sortable: true,
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
        ifDisabledExport : true,
      };
    },
    created() {
      this.formItem.transBrchNo = JSON.parse(window.sessionStorage.getItem('userInfo')).brchNo;
      this.formItem.transBrchName = JSON.parse(window.sessionStorage.getItem('userInfo')).brchName;
      this.$nextTick(() => {
        this.columns = this.deepClone(this.batchColumns);
        this.$refs.datagrid.createShowCol(this.batchColumns);
        this.$refs.datagrid.dataChange(1);
      });
    },
    mounted() {
      this.getDictListByGroups("DraftTypeCode,PoolBillStockStatus,CheckType,BillOrigin").then(res => {
        this.stockStatusList = res.get("PoolBillStockStatus");
        this.billOriginArray = res.get("BillOrigin");
        this.billTypeList = res.get("DraftTypeCode");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      //表单查询
      handleSearch() {
        this.$nextTick(() => {
          this.$refs.datagrid.dataChange(1);
          this.$refs.datagrid.selectIds = [];
          this.$refs.datagrid.selects = [];
        });
      },
      clearVal(type){
        if(type === 'custName'){
          this.formItem.custNo = '';
          this.formItem.custName = '';
        }
        if(type === 'custAcctNo'){
          this.formItem.custAcctNo = '';
        }
      },
      //重置表单查询结果
      resetSearch() {
        this.formItem.transBrchNoList = JSON.parse(window.sessionStorage.getItem('userInfo')).brchNo;
        this.formItem.transBrchNameList = JSON.parse(window.sessionStorage.getItem('userInfo')).brchName;
        this.formItem.custNo = "";
        this.formItem.minAcctDt = "";
        this.formItem.maxAcctDt = "";
        this.acctDt = [];
        this.$refs.formItem.resetFields();
      },
      handleAcctDtChange(arr) {
        if (arr&&arr.length==2){
          this.formItem.minAcctDt = arr[0].replace(/-/g, "");
          this.formItem.maxAcctDt = arr[1].replace(/-/g, "");
          this.acctDt = [arr[0], arr[1]];
        } else {
          this.formItem.minAcctDt = "";
          this.formItem.maxAcctDt = "";
          this.acctDt = [];
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
        this.$refs.datagrid.tData = [];
        this.ifDisabledExport = true;
        this.dataUrl = "/pl/custody/occurQuery/saveBillQuery/func_pageOccurQuerySaveBatchList";
        this.$nextTick(() => {
          this.columns = this.deepClone(this.batchColumns);
          this.$refs.datagrid.createShowCol(this.batchColumns);
        });
        this.handleSearch();
      },
      //查询明细
      queryBill(batchId) {
        if (!!batchId) {
          this.formItem.batchId = batchId;
        } else {
          this.formItem.batchId = "";
        }
        this.$refs.datagrid.tData = [];
        this.ifDisabledExport = false;
        this.dataUrl = "/pl/custody/occurQuery/saveBillQuery/func_pageOccurQuerySaveBillList";
        this.$nextTick(() => {
          this.columns = this.deepClone(this.billColumns);
          this.$refs.datagrid.createShowCol(this.billColumns);
        });
        this.handleSearch();
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
      },

      //清单导出
      billExport() {
        this.param = 'saveBillOccurExportInfo';
        if (this.$refs.datagrid.selectIds.length !== 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        }else {
          this.rows = this.$refs.datagrid.total;
        }
        this.tempShowExcelTemplateWin = true;
      },
      batchExport() {
        this.param = 'saveBatchOccurExportInfo';
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

      //清单导出
      exportList(field, exportType){
        //exportType: 0-同步 1-异步
        if(exportType === "1"){
          let pageSize = this.$refs.datagrid.total;
          if(this.$refs.datagrid.total === 0){
            pageSize = 1;
          }
          let url = '';
          let billIds = null;
          let batchIds= null;
          if ('saveBillOccurExportInfo' === this.param) {
            url = window.LOCAL_CONFIG.API_HOME + "/pl/custody/occurQuery/saveBillQuery/func_exportSaveBillOccurExcel";
            billIds = this.$refs.datagrid.selectIds;
          }else if ('saveBatchOccurExportInfo' === this.param) {
            url = window.LOCAL_CONFIG.API_HOME + "/pl/custody/occurQuery/saveBillQuery/func_exportSaveBatchOccurExcel";
            batchIds = this.$refs.datagrid.selectIds;
          }
          let params = null;
          if (this.$refs.datagrid.selectIds.length !== 0) {
            params = {
              billIds: billIds,
              batchIds: batchIds,
              pageSize: this.$refs.datagrid.selectIds.length,
              field: field,
              exportType: exportType,
              excelName: this.param
            };
          }else {
            params = { transBrchNoList:this.formItem.transBrchNoList, acptName:this.formItem.acptName,
              stockStatus:this.formItem.stockStatus,billType:this.formItem.billType,
              minAcctDt:this.formItem.minAcctDt,maxAcctDt:this.formItem.maxAcctDt,likeBillNo:this.formItem.likeBillNo,
              custNo:this.formItem.custNo,custAcctNo:this.formItem.custAcctNo,
              field: field, exportType: exportType, excelName: this.param, pageSize:pageSize};
          }
          post(params, url).then(res => {
            if(res.status === 200 && res.data === null){
              this.$msgTip.info(this, { info:"异步导出成功，请进入公共管理》导出下载页面，进行下载"});
            }else if(res.status === 200 && res.data === ""){
              this.$msgTip.info(this, { info:"异步导出成功，请进入公共管理》导出下载页面，进行下载"});
            } else{
              this.$msgTip.error(this, { info: "异步导出失败" });
            }
          });
        }else {
          if (this.$refs.datagrid.selectIds.length !== 0) {
            let url = '';
            if ('saveBillOccurExportInfo' === this.param) {
              url = window.LOCAL_CONFIG.API_HOME + "/pl/custody/occurQuery/saveBillQuery/func_exportSaveBillOccurExcel";
            }else if ('saveBatchOccurExportInfo' === this.param) {
              url = window.LOCAL_CONFIG.API_HOME + "/pl/custody/occurQuery/saveBillQuery/func_exportSaveBatchOccurExcel";
            }
            let form = document.createElement("form");
            form.setAttribute("id", "formId");
            form.setAttribute("action", url);
            form.setAttribute("method", "post");
            if ('saveBillOccurExportInfo' === this.param) {
              let input1 = document.createElement('input')
              input1.type = 'text'
              input1.name = 'billIds';
              input1.value = this.$refs.datagrid.selectIds;
              form.appendChild(input1)
            }else if ('saveBatchOccurExportInfo' === this.param) {
              let input1 = document.createElement('input')
              input1.type = 'text'
              input1.name = 'batchIds';
              input1.value = this.$refs.datagrid.selectIds;
              form.appendChild(input1)
            }
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
            if ('saveBillOccurExportInfo' === this.param) {
              url = window.LOCAL_CONFIG.API_HOME + "/pl/custody/occurQuery/saveBillQuery/func_exportSaveBillOccurExcel";
            }else if ('saveBatchOccurExportInfo' === this.param) {
              url = window.LOCAL_CONFIG.API_HOME + "/pl/custody/occurQuery/saveBillQuery/func_exportSaveBatchOccurExcel";
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
    }
  };
</script>

<style scoped>

</style>
