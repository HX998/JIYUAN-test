<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
<!--                <h-form-item :label="$t('m.i.common.brchName')" prop="transBrchNoList">
                  <h-input v-model="formItem.transBrchNoList" readonly v-show="false" placeholder=""></h-input>
                  <h-input v-model="formItem.transBrchNameList" readonly icon="android-search"
                           @on-click="queryBrchNo()" :title="formItem.transBrchNameList"></h-input>
                </h-form-item>-->
                <show-branch v-model="formItem.transBrchNoList" :label="$t('m.i.common.brchName')" prop="transBrchNoList"
                             title="机构名称" :showCheckBox="true"  isNeedChecked :brchNo.sync="formItem.transBrchNoList" :brchName.sync="formItem.transBrchNameList"></show-branch>
                <h-form-item :label="$t('m.i.pe.prsttnType')" prop="prsttnType">
                  <h-radio-group v-model="formItem.prsttnType">
                    <h-radio label="ST01" @on-click="hldrTypeChange">
                      <span>持票</span>
                    </h-radio>
                    <h-radio label="ST02" @on-click="custTypeChange">
                      <span>代客</span>
                    </h-radio>
                  </h-radio-group>
                </h-form-item>
                <h-form-item prop="minPrsttnDt" :label="$t('m.i.pe.prsttnDt')">
                  <h-date-picker :value="prsttnDt" format="yyyy-MM-dd" type="daterange" autoPlacement placeholder="" showFormat :editable=false @on-change="handlePrsttnDtChange"></h-date-picker>
                </h-form-item>
                <h-form-item prop="minPrsttnAcctDt" :label="$t('m.i.pe.prsttnAcctDt')">
                  <h-date-picker :value="prsttnAcctDt" format="yyyy-MM-dd" type="daterange" autoPlacement placeholder="" showFormat :editable=false @on-change="handlePrsttnAcctDtChange"></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billNo')" prop="billNoLike">
                  <h-input v-model="formItem.billNoLike" placeholder=""></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.drweBankName')" prop="drweBankNameLike" class="h-form-long-label">
                  <h-input v-model="formItem.drweBankNameLike" placeholder=""></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.drweBankNo')" prop="drweBankNoLike" class="h-form-long-label">
                  <h-input v-model="formItem.drweBankNoLike" placeholder=""></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.pe.hldrName')" prop="hldrNameLike">
                  <h-input v-model="formItem.hldrNameLike" placeholder=""></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.pe.hldrAcctNo')" prop="hldrAcctNoLike">
                  <h-input v-model="formItem.hldrAcctNoLike" placeholder=""></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.remitDt')" prop="minRemitDt">
                  <h-date-picker :value="remitDt" type="daterange" autoPlacement showFormat :editable=false @on-change="handleRemitDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.dueDt')" prop="minDueDt">
                  <h-date-picker :value="dueDt" type="daterange" autoPlacement showFormat :editable=false @on-change="handleDueDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billMoney')" prop="billMoneyItem">
                  <h-row>
                    <h-col span="11">
                      <h-typefield v-model="formItem.minBillMoney" integerNum="10" placeholder="" type="money"
                                   bigTips></h-typefield>
                    </h-col>
                    <h-col span="2" style="text-align: center">至</h-col>
                    <h-col span="11">
                      <h-typefield v-model="formItem.maxBillMoney" integerNum="10" placeholder="" type="money"
                                   bigTips></h-typefield>
                    </h-col>
                  </h-row>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                                  :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
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
          <!--数据展示表格-->
          <h-datagrid
            :columns="showColumns"
            getDataFunc
            @get-data="getOccurData"
            :gridData="occurData"
            :bindForm="formItem"
            :auto-load="false"
            :hasSelect=false
            rowSelect
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="queryPrsnttnOccurBatch()">{{$t("m.i.pe.queryAcptOccurBatch")}}</h-button>
              <h-button type="primary" @click="queryPrsnttnOccurBill">{{$t("m.i.pe.queryAcptOccurBill")}}</h-button>
              <h-button type="primary" @click="tempShowExcelTemplateWinOpen('batch')" :disabled="this.ifDisabledExport">
                {{$t("m.i.pe.arrayExport")}}
              </h-button>
              <h-button type="primary" @click="tempShowExcelTemplateWinOpen('bill')" :disabled="!this.ifDisabledExport">
                {{$t("m.i.pe.flowExport")}}
              </h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <!-- 机构名称选择弹窗框 -->
    <!--<show-branch :showBranchWin="showBranchWin" title="查询机构树多选" @brchNoChange="brchNoChange" ifcheck="true"
                 :checkStrictly="false" @showBranchWinClose="showBranchWinClose"></show-branch>-->

    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin"
                    :billId="this.billId"></bill-info-main>

    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param"
                           :rows="this.rows"></common-excel-download>
  </div>
</template>

<script>
  import { post, on, off, formatNumber,exportList} from "@/api/bizApi/commonUtil";

  export default {
    name: "cePaperPrsttnOccurQuery",
    components: {
      //ShowBranch: () => import(/* webpackChunkName: "sm/auth/branch/showBranch" */ "@/views/bizViews/sm/auth/branch/showBranch")
    },
    data() {
      let batchColumns = [
        {
          type: "selection",
          width: 60,
          align: "center",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.index"),
          type: "index",
          width: 60,
          align: "center"
        },
        {
          title: this.$t('m.i.common.brchName'),
          key: "transBrchName",
          hiddenCol: false
        },
        {
          title:this.$t('m.i.pe.hldrAcctNo'),
          key: "hldrAcctNo",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.pe.hldrName'),
          key: "hldrName",
          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.billInfo.drweBankNo'),
          key: "drweBankNo",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.billInfo.drweBankName'),
          key: "drweBankName",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.pe.drweAddr'),
          key: "drweAddr",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.pe.drwePostCode'),
          key: "drwePostCode",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.pe.emsNo'),
          key: "emsNo",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.pe.total"),
          key: "totalCount",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.pe.totalAmt"),
          key: "totalAmt",
          hiddenCol: false,
          sortable: true,
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
        formItem: {
          transBrchNoList: JSON.parse(window.sessionStorage.getItem('userInfo')).brchNo,
          transBrchNameList: JSON.parse(window.sessionStorage.getItem('userInfo')).brchName,
          prsttnType: "ST01",
          minRemitDt: "",
          maxRemitDt: "",
          minPrsttnDt: "",
          maxPrsttnDt: "",
          minPrsttnAcctDt: "",
          maxPrsttnAcctDt: "",
          minDueDt: "",
          maxDueDt: "",
          billNoLike: "",
          drweBankNameLike: "",
          drweBankNoLike: "",
          hldrNameLike: "",
          hldrAcctNoLike: "",
          minBillMoney: "",
          maxBillMoney: ""
        },
        batchColumns: batchColumns,
        billColumns: [
          {
            type: "selection",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: this.$t("m.i.billInfo.billNo"),
            key: "billNo",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let billNo = "";
              if (params.row.billNo === null || params.row.billNo === "") {
                billNo = "查看票面";
              } else {
                billNo = params.row.billNo;
              }
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params.row.billId);
                  }
                }
              }, billNo);
            }
          },
          {
            title: this.$t("m.i.pe.hldrAcctNo"),
            key: "hldrAcctNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.pe.hldrName"),
            key: "hldrName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.drweBankNo'),
            key: "drweBankNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.drweBankName'),
            key: "drweBankName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.pe.prsttnStatus"),
            key: "prsttnStatus",
            hiddenCol: false,
            render: (h, params) => {
              let title = "";
              if (params.row.prsttnStatus === "1") {
                title = "发托结清";
              }
              ;
              return h("span", title);
            }
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",
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
            title: this.$t("m.i.billInfo.billMoneyByUnit"),
            key: "billMoney",
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
            title: this.$t("m.i.pe.prsttnDt"),
            key: "prsttnDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.prsttnDt == null || params.row.prsttnDt === "" || params.row.prsttnDt === 0) {
                return "";
              }
              let date = this.$moment(params.row.prsttnDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title:  this.$t("m.i.pe.prsttnAcctDt"),
            key: "prsttnAcctDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.prsttnAcctDt == null || params.row.prsttnAcctDt === "" || params.row.prsttnAcctDt === 0) {
                return "";
              }
              let date = this.$moment(params.row.prsttnAcctDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.billInfo.remitDt"),
            key: "remitDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.remitDt == null || params.row.remitDt === ""||params.row.remitDt ===0) {
                return "";
              }
              let date = this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.billInfo.dueDt"),
            key: "dueDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.dueDt == null || params.row.dueDt === "" || params.row.dueDt===0) {
                return "";
              }
              let date = this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.billInfo.acptName"),
            key: "acptName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.drwrName"),
            key: "drwrName",
            hiddenCol: false
          }
        ],
        remitDt: [],
        dueDt: [],
        prsttnDt: [],
        prsttnAcctDt: [],
        dictMap: new Map(),
        billId: "",
        //是否显示更多查询项
        ifShowMore: false,
        showBillInfoWin: false,
        tempShowExcelTemplateWin: false,
        //showBranchWin: false,
        queryUrl: "/pe/busiqry/cePaperPrsttnOccurQuery/func_listPrsnttnOccurBatch",
        ifDisabledExport: false,
        showColumns: this.deepClone(batchColumns),
        param: null,
        rows: null,
        sumMoney: "",
        total: "",
        selectExportType: "",
        occurData: { rows: [], total: 1 }
      };
    },
    mounted() {
      this.getOccurData();
      this.getDictListByGroups("DraftTypeCode").then(res => {
        this.dictMap = res.get("map");
      });
    },
    methods: {
      getOccurData() {
        let obj = Object.assign({}, this.formItem, {
          "pageNo": this.$refs.datagrid.pageInfo.pageNo,
          "pageSize": this.$refs.datagrid.pageInfo.pageSize
        });
        let url = this.queryUrl;
        post(obj, url).then(res => {
            if (res) {
              let msg = res.data.retMsg;
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.occurData = res.data.retData;
                this.total = res.data.retData.pageInfo.count;
                this.sumMoney = formatNumber(res.data.retData.pageInfo.sumMoney, 2, ",");
              } else {
                this.$msgTip.error(this, { info: msg });
              }
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            }
          }
        );
      },
      //查询
      formSearch() {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.getOccurData();
      },
      //重置
      formSearchReset() {
        this.$refs.formItem.resetFields();
        this.formItem.minBillMoney = "";
        this.formItem.maxBillMoney = "";
        this.formItem.minRemitDt = "";
        this.formItem.maxRemitDt = "";
        this.formItem.minDueDt = "";
        this.formItem.maxDueDt = "";
        this.formItem.minPrsttnDt = "";
        this.formItem.maxPrsttnDt = "";
        this.formItem.minPrsttnAcctDt = "";
        this.formItem.maxPrsttnAcctDt = "";
        this.formItem.transBrchNameList = JSON.parse(window.sessionStorage.getItem('userInfo')).brchName;
        this.remitDt = [];
        this.dueDt = [];
        this.prsttnDt = [];
        this.prsttnAcctDt = [];
      },

      /*//查询机构弹出框
      queryBrchNo() {
        this.showBranchWin = true;
      },
      showBranchWinClose() {
        this.showBranchWin = false;
      },
      //根据弹框所选数据进行赋值
      brchNoChange(info) {
        let objs = [];
        if (info instanceof Array) {
          objs = info;
        } else {
          objs[0] = info;
        }
        let transBrchNoList = "";
        let transBrchNameList = "";
        for (var i = 0; i < objs.length; i++) {
          transBrchNoList += objs[i].id + ",";
          transBrchNameList += objs[i].title + ",";
        }
        this.formItem.transBrchNoList = transBrchNoList.substring(0, transBrchNoList.length - 1);
        this.formItem.transBrchNameList = transBrchNameList.substring(0, transBrchNameList.length - 1);
        this.showBranchWin = false;
      },*/
      //日期选择框
      handleRemitDtChange(arr) {
        if(arr && arr.length == 2){
          this.formItem.minRemitDt = arr[0].replace(/-/g, "");
          this.formItem.maxRemitDt = arr[1].replace(/-/g, "");
          this.remitDt = [arr[0], arr[1]];
        }else{
          this.formItem.minRemitDt = "";
          this.formItem.maxRemitDt = "";
          this.remitDt = [];
        }

      },

      handlePrsttnDtChange(arr) {
        if(arr && arr.length == 2){
          this.formItem.minPrsttnDt = arr[0].replace(/-/g, "");
          this.formItem.maxPrsttnDt = arr[1].replace(/-/g, "");
          this.prsttnDt = [arr[0], arr[1]];
        }else{
          this.formItem.minPrsttnDt = "";
          this.formItem.maxPrsttnDt = "";
          this.prsttnDt = [];
        }

      },
      handlePrsttnAcctDtChange(arr) {
        if(arr && arr.length == 2){
          this.formItem.minPrsttnAcctDt = arr[0].replace(/-/g, "");
          this.formItem.maxPrsttnAcctDt = arr[1].replace(/-/g, "");
          this.prsttnAcctDt = [arr[0], arr[1]];
        }else{
          this.formItem.minPrsttnAcctDt = "";
          this.formItem.maxPrsttnAcctDt = "";
          this.prsttnAcctDt = [];
        }

      },
      handleDueDtChange(arr) {
        if(arr && arr.length == 2){
          this.formItem.minDueDt = arr[0].replace(/-/g, "");
          this.formItem.maxDueDt = arr[1].replace(/-/g, "");
          this.dueDt = [arr[0], arr[1]];
        }else{
          this.formItem.minDueDt = "";
          this.formItem.maxDueDt = "";
          this.dueDt = [];
        }

      },
      billInfoWinClose() {
        this.showBillInfoWin = false;
      },
      showBillInfo(billId) {
        this.billId = billId;
        this.showBillInfoWin = true;
      },
      showPrsttnOccurBill(batchNo) {
        this.$refs.datagrid.tData = [];
        this.$refs.datagrid.pageInfo.pageNo = 1;
        this.formItem.batchNo = batchNo;
        this.queryUrl = "/pe/busiqry/acptOccurQuery/func_pagingQueryBillList";
        this.ifDisabledExport = true;
        this.$nextTick(() => {
          this.showColumns = this.deepClone(this.billColumns);
          this.$refs.datagrid.createShowCol(this.billColumns);
        });
        this.formSearch();
      },
      queryPrsnttnOccurBatch() {
        this.$refs.datagrid.tData = [];
        this.$refs.datagrid.pageInfo.pageNo = 1;
        this.queryUrl = "/pe/busiqry/cePaperPrsttnOccurQuery/func_listPrsnttnOccurBatch";
        this.ifDisabledExport = false;
        this.showColumns = this.deepClone(this.batchColumns);
        this.formSearch();
      },
      queryPrsnttnOccurBill() {
        this.$refs.datagrid.tData = [];
        this.$refs.datagrid.pageInfo.pageNo = 1;
        this.queryUrl = "/pe/busiqry/cePaperPrsttnOccurQuery/func_listPrsnttnOccurBill";
        this.ifDisabledExport = true;
        this.$nextTick(() => {
          this.showColumns = this.deepClone(this.billColumns);
          this.$refs.datagrid.createShowCol(this.billColumns);
        });
        this.formSearch();
      },
      hldrTypeChange() {
        this.formItem.prsttnType = "ST01";
        if (!this.ifDisabledExport) {
          this.queryPrsnttnOccurBatch();
        } else {
          this.queryPrsnttnOccurBill();
        }
      },
      custTypeChange() {
        this.formItem.prsttnType = "ST02";
        if (!this.ifDisabledExport) {
          this.queryPrsnttnOccurBatch();
        } else {
          this.queryPrsnttnOccurBill();
        }
      },
      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },
      //清单导出
      tempShowExcelTemplateWinOpen(type) {
        this.selectExportType = type;
        if (type === "batch") {
          this.param = "cePaperBatchPrsnttnOccurExportInfo";
        } else {
          this.param = "cePaperBillPrsnttnOccurExportInfo";
        }
        if (this.$refs.datagrid.selectIds.length != 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        } else {
          this.rows = this.$refs.datagrid.total;
        }
        this.tempShowExcelTemplateWin = true;
      },

      //清单导出
      exportList(field, exportType) {
        let exportUrl;
        if (this.selectExportType === "batch") {
          exportUrl = window.LOCAL_CONFIG.API_HOME + "/pe/busiqry/cePaperPrsttnOccurQuery/func_exportPaperPrsnttnBatchOccurExcel";
        } else {
          exportUrl = window.LOCAL_CONFIG.API_HOME + "/pe/busiqry/cePaperPrsttnOccurQuery/func_exportPaperPrsnttnBillOccurExcel";
        }
        let options = {};
        if (this.$refs.datagrid.selectIds.length !== 0) {
          options.params = {
            ids: this.$refs.datagrid.selectIds
          };
          options.pageSize = this.$refs.datagrid.selectIds.length;
        } else {
          options.params = this.formItem;
          options.pageSize = this.$refs.datagrid.total;
        }
        exportList(this, this.param, field, exportType, exportUrl, options);
      },

    }
  };
</script>

<style scoped>

</style>
