<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <show-branch v-model="formItem.transBrchNos" :label="$t('m.i.common.brchName')" prop="transBrchNos" isNeedChecked
                             title="机构名称" :showCheckBox="true" :brchNo.sync="formItem.transBrchNos"    :brchName.sync="formItem.transBrchNameList"></show-branch>
                <h-form-item :label="$t('m.i.billInfo.billOrigin')"  prop="billOrigin">
                  <h-select v-model="formItem.billOrigin" placeholder="">
                    <h-option v-for="item in billOriginList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billPackageNo')" prop="billNo">
                  <h-input v-model="formItem.billNo"></h-input>
                </h-form-item>
                <!--子票区间-->
                <bill-range :form-item="formItem" :range-props="['minBillRangeStart','maxBillRangeEnd']"></bill-range>
                <h-form-item :label="$t('m.i.billInfo.dueDt')" prop="dueDt">
                  <h-date-picker :value="dueDt" type="daterange" autoPlacement showFormat :editable=false
                                 @on-change="handleDueDtChange" placeholder="" :options="dtOptions"></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.busiType')" prop="busiType">
                  <h-select v-model="formItem.busiType" placeholder="" showTitle>
                    <h-option v-for="item in busiTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item label="转卖日期" prop="firstSettleDt">
                  <h-date-picker type="daterange" autoPlacement placeholder="" v-model="formItem.firstSettleDt" format="yyyy-MM-dd" showFormat @on-change="firstSettleDtChange"></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billPackageMoney')" prop="billMoney" class="h-form-long-label">
                  <h-row>
                    <h-col span="11">
                      <h-typefield  v-model="formItem.minBillMoney"  integerNum="10" placeholder="" type="money" bigTips ></h-typefield>
                    </h-col>
                    <h-col span="2" style="text-align: center">至</h-col>
                    <h-col span="11">
                      <h-typefield  v-model="formItem.maxBillMoney"  integerNum="10" placeholder="" type="money" bigTips ></h-typefield>
                    </h-col>
                  </h-row>
                </h-form-item>

                  <h-form-item :label="$t('m.i.billInfo.acptName')" prop="acptName">
                    <h-input v-model="formItem.acptName" placeholder=""></h-input>
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
                  <h-form-item :label="$t('m.i.pe.sumBillPackageMoney')" class="h-form-long-label">
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
            :columns="columns"
            hasPage
            :url="queryUrl"
            @getSumMoneyAndTotal="getSumMoneyAndTotal"
            :bindForm="formItem"
            showListCkeckBox
            :hasSelect=false
            :rowSelect=true
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="tempShowExcelTemplateWinOpen()">{{$t("m.i.common.listExport")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="billId"
                    :billNo="billNo" :billRangeStart="billRangeStart" :billRangeEnd="billRangeEnd"></bill-info-main>
    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param"
                           :rows="this.rows"></common-excel-download>

  </div>
</template>

<script>
  import { post, formatNumber, on, off,exportList,accMul} from "@/api/bizApi/commonUtil";

  export default {
    name: "unDueSale",
    components: {
      //BrchCodeSearch: () => import(/* webpackChunkName: "sm/auth/branch/cpesBrchCodeSearch" */ "@/views/bizViews/sm/auth/branch/cpesBrchCodeSearch"),
      //ShowBranch: () => import(/* webpackChunkName: "be/market/rediscount/common/showBranch" */ "@/views/bizViews/be/market/rediscount/common/showBranch")
    },
    data() {
      let _this = this;
      return {
        dtOptions: {
          disabledDate(date) {
            return date && date.valueOf() < _this.$moment(window.sessionStorage.getItem("workDate"), "YYYYMMDD");
          }
        },
        columns: [
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
            title: this.$t('m.i.billInfo.billOrigin'),
            key: 'billOrigin',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = (!params.row.billOrigin || params.row.billOrigin === 'CS00') ? '-' : this.getDictValueFromMap(this.dictMap, 'BillOrigin', params.row.billOrigin);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.billInfo.billPackageNo"),
            key: "billNo",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params.row.billId, params.row.billNo,params.row.billRangeStart,params.row.billRangeEnd);
                  }
                }
              }, params.row.billNo);
            }
          },
          {
            title: this.$t('m.i.billInfo.billRange'),
            key: 'billRange',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = !params.row.billRange ? '-' : params.row.billRange;
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.common.busiType"),
            key: "busiType",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "BusiType", params.row.busiType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.billInfo.billClass"),
            key: "billClass",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "CDMedia", params.row.billClass);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
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
            title: this.$t("m.i.billInfo.billPackageMoney"),
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
            title: this.$t("m.i.billInfo.remitDt"),
            key: "remitDt",
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
            title: "转卖日期",
            key: "firstSettleDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let dt = this.$moment(params.row.firstSettleDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", dt);
            }
          },
          {
            title: "卖出方机构名称",
            key: "saleBrchName",
            hiddenCol: false
          },
          {
            title:"买入方机构名称",
            key:"buyBrchName",
            hiddenCol:false
          },
          {
            title: this.$t('m.i.billInfo.drwrName'),
            key: "drwrName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.acptName'),
            key: "acptName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.acptBankNo"),
            key: "acptBankNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.acptBankName'),
            key: "acptBankName",
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.billInfo.discDt'),
            key: "discDt",
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.discDt == null || params.row.discDt === "") {
                return "";
              }
              let discDt = this.$moment(params.row.discDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", discDt);
            }
          },
          {
            title: this.$t('m.i.billInfo.discBrchCode'),
            key: "discBrchCode",
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.billInfo.discBankName'),
            key: "discBankName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.billInfo.creditMainBrchCode'),
            key: "creditMainBrchCode",
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.billInfo.creditMainBankName'),
            key: "creditMainBankName",
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.billInfo.creditMainBankType'),
            key: "creditMainBankType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue =this.getDictValueFromMap(this.dictMap, 'CreditMajor', params.row.creditMainBankType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.billInfo.lastOppName'),
            key: "oppName",
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.billInfo.lastRebuyRate'),
            key: "buyRate",
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.buyRate != null && params.row.buyRate !== "") {
                let rate = accMul(params.row.buyRate, 100);
                rate = formatNumber(rate,4, '');
                return h("span", rate);
              }
            }
          },
        ],
        formItem: {
          transBrchNos: JSON.parse(window.sessionStorage.getItem('userInfo')).brchNo,
          transBrchNameList:JSON.parse(window.sessionStorage.getItem('userInfo')).brchName,
          billType: "",
          billClass: "",
          billOrigin:"",
          billNo: "",
          billMoney: "",
          minBillMoney: "",
          maxBillMoney: "",
          maxDueDt: "",
          minDueDt:"",
          busiType: "",
          minFirstSettleDt: "",
          maxFirstSettleDt: "",
          firstSettleDt: "",
          acptName: "",
          minBillRangeStart:'',
          maxBillRangeEnd:''
        },
        billTypeList: [],
        busiTypeList:[],
        billClassList: [],
        billStatusList: [],
        billOriginList: [],
        respFlagList: [
          {
            key: "SU00",
            value: "同意"
          },
          {
            key: "SU01",
            value: "拒绝"
          }
        ],
        acctStatusList: [],
        firstSettleDt: [],
        maxDueDt: "",
        remitDt: [],
        dueDt: [],
        currentSelectList: [],
        readonly: false,
        ifShowMore: false,
        brchCodeWinBrch: false,
        //brchCodeWinCust: false,
        showBillInfoWin: false,
        billId: null,
        billNo:"",
        billRangeStart:'',
        billRangeEnd:'',
        dictMap: new Map(),
        tempShowExcelTemplateWin: false,
        param: null,
        rows: null,
        sumMoney: "",
        total: "",
        queryUrl: "/be/market/quote/unDueSale/func_findUnDueSale",
        billList: {
          list: [],
          pageInfo: {
            count: 0,
            pageNo: 1,
            pageSize: 10
          }
        },
        batchId: null
      };
    },
    watch: {
      "formItem.billStatus": {
        handler(newVal, oldVal) {
          if (newVal !== "") {
            this.formItem.respFlag = "";
          }
        },
        deep: true,
        immediate: true
      },
      "formItem.respFlag": {
        handler(newVal, oldVal) {
          if (newVal !== "") {
            this.formItem.billStatus = "";
          }
        },
        deep: true,
        immediate: true
      }
    },
    methods: {
      handleDateChange(value) {
        this.formItem.maxDueDt = value.replace(/-/g, "");
      },
      getSumMoneyAndTotal(params) {
        this.total = params.total;
        if(params.sumMoney){
          this.sumMoney = formatNumber(params.sumMoney, 2, ",");
        }else{
          this.sumMoney ="0.00"
        }
      },
      formSearch() {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
        this.formItem.minBillMoney = "";
        this.formItem.maxBillMoney = "";
        this.formItem.minFirstSettleDt = "";
        this.formItem.maxFirstSettleDt = "";
        this.formItem.billNo = "";
        this.formItem.billType = "";
        this.formItem.billClass = "";
        this.formItem.brchName = "";
        this.formItem.acptBrchName = "";
        this.firstSettleDt = [];
        this.dueDt = [];
        this.formItem.transBrchNameList = JSON.parse(window.sessionStorage.getItem('userInfo')).brchName;
        this.formItem.minDueDt="";
        this.formItem.maxDueDt="";
        this.formItem.minBillRangeStart="";
        this.formItem.maxBillRangeEnd="";
      },
      firstSettleDtChange(arr) {
        if(arr && arr.length == 2){
          this.formItem.minFirstSettleDt = arr[0].replace(/-/g, "");
          this.formItem.maxFirstSettleDt = arr[1].replace(/-/g, "");
        }else{
          this.formItem.minFirstSettleDt = "";
          this.formItem.maxFirstSettleDt = "";
        }
      },

      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },
      //清单导出
      tempShowExcelTemplateWinOpen() {
        this.param = "unDueSaleReportInfo";
        if (this.$refs.datagrid.selectIds.length != 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        } else {
          this.rows = this.$refs.datagrid.total;
        }
        this.tempShowExcelTemplateWin = true;
      },

      billInfoWinClose() {
        this.billId = null;
        this.billNo = null;
        this.billRangeStart = null;
        this.billRangeEnd = null;
        this.showBillInfoWin = false;
      },
      showBillInfo(billId, billNo,billRangeStart,billRangeEnd) {
        this.billId = billId;
        this.billNo = billNo;
        this.billRangeStart=billRangeStart;
        this.billRangeEnd=billRangeEnd;
        this.showBillInfoWin = true;
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

      //清单导出
      exportList(field, exportType) {
        let exportUrl = window.LOCAL_CONFIG.API_HOME + "/be/market/quote/unDueSale/func_exportUnDueSaleExcel";
        let options = {};
        if (this.$refs.datagrid.selectIds.length !== 0) {
          options.params = Object.assign({
            ids: this.$refs.datagrid.selectIds
          }, this.formItem);
          options.pageSize = this.$refs.datagrid.selectIds.length;
        } else {
          options.params = this.formItem;
          options.pageSize = this.$refs.datagrid.total;
        }
        exportList(this, this.param, field, exportType, exportUrl, options);
      },


    },
    mounted() {
      this.getDictListByGroups("DraftTypeCode,CDMedia,AcctFlag,BarterTrustStatus,BusiType,CreditMajor,BillOrigin").then(res => {
        this.billClassList = res.get("CDMedia");
        this.billTypeList = res.get("DraftTypeCode");
        this.acctStatusList = res.get("AcctFlag");
        this.billStatusList = res.get("BarterTrustStatus");
        this.billOriginList = res.get("BillOrigin");
        this.busiTypeList = res.get("BusiType").filter(item =>item.key==="BT01"||item.key==="BT03"||item.key==="RBT01");
        this.dictMap = res.get("map");
      });
    }
  };
</script>

<style scoped>

</style>
