<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!-- 查询表单 -->
          <div class="h-form-search-box">
            <h-panel class="h-form-search-box clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form ref="formItem" :model="formItem" :label-width="90" class="h-form-search" cols="4">
                <div class="h-search-form-row">
                  <show-branch v-model="formItem.transBrchNoList" :label="$t('m.i.common.brchName')" prop="transBrchNoList"
                               title="机构名称" :showCheckBox="true" :brchNo.sync="formItem.transBrchNoList" isNeedChecked  :brchName.sync="formItem.transBrchNames"></show-branch>
                  <!-- 票据类型 -->
                  <bill-type v-model="formItem.billType" :dictList="BillTypeList"></bill-type>
                  <!-- 票据类型 -->
                  <bill-class v-model="formItem.billClass" :dictList="BillClassList"></bill-class>
                  <!-- 风险标识 -->
                  <common-select v-model="formItem.riskStatus" :label="$t('m.i.billInfo.riskStatus')" prop="riskStatus"
                                 :dictList="RiskStatusList"></common-select>
                  <!-- 票据来源 -->
                  <common-select :label="$t('m.i.billInfo.billOrigin')" prop="billOrigin"
                                 v-model="formItem.billOrigin" :dictList="billOriginList"></common-select>
                  <!-- 票据号码 -->
                  <bill-no :label="$t('m.i.billInfo.billPackageNo')" v-model="formItem.reverseBillNo" prop="reverseBillNo"></bill-no>
                  <!-- 子票区间 -->
                  <bill-range :formItem="formItem" :rangeProps="['minBillRangeStart','maxBillRangeEnd']"></bill-range>
                  <!-- 票据金额 -->
                  <bill-money-range :label="$t('m.i.billInfo.billPackageMoney')" v-model="formItem" :bigTips="false"
                                    :rangeProps="['minBillMoney','maxBillMoney']" class="h-form-long-label"></bill-money-range>
                  <!-- 承兑行名称 -->
                  <common-input prop="acptBankNameTem" :label="$t('m.i.billInfo.acptBankName')" class="h-form-long-label"
                                v-model="formItem.acptBankNameTem" readonly :showIcon="true"
                                @on-click="queryBranchName()" placeholder=""
                                clearable :clearVal="clearVal" clearValTag="acptBankNameTem"></common-input>
                  <!-- 出票日 -->
                  <remit-dt-range v-model="remitDt" :minRemitDt.sync="formItem.minRemitDt" :maxRemitDt.sync="formItem.maxRemitDt"></remit-dt-range>
                  <!-- 汇票到期日 -->
                  <due-dt-range v-model="dueDate" :minDueDt.sync="formItem.minDueDt" :maxDueDt.sync="formItem.maxDueDt"></due-dt-range>
                  <!-- 提示付款日期 -->
                  <common-date-picker :label="$t('m.i.pe.prsttnApplyDt')" prop="applDate" v-model="applDate" :rangeValue="['minPrsttnDt','maxPrsttnDt']"
                                      :minPrsttnDt.sync="formItem.minPrsttnDt" :maxPrsttnDt.sync="formItem.maxPrsttnDt" type="daterange"></common-date-picker>
                  <h-form-item class="h-form-operate">
                    <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                                    :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                    <h-button type="primary" @click="handleSearch">{{$t("m.i.common.search")}}</h-button>
                    <h-button type="ghost" @click="resetSearch">{{$t("m.i.common.reset")}}</h-button>
                  </h-form-item>
                </div>
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
          <!-- 数据展示表格 -->
          <h-datagrid
            :columns="columns"
            highlight-row
            hasPage
            url="/pe/busiqry/prsttnOccurQuery/func_prsttnOccurQuery"
            :bindForm="formItem"
            @getSumMoneyAndTotal="getSumMoneyAndTotal"
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
    <!-- 查询票交机构代码 -->
    <show-cpes-branch :showCpesBranch="showCpesBranch" @showCpesBranchClose="showCpesBranchClose"
                      @showCpesBranchSubmit="showCpesBranchSubmit"></show-cpes-branch>
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin"
                    :billId="this.billId" :billRangeStart="this.billRangeStart" :billRangeEnd="this.billRangeEnd"></bill-info-main>
    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param"
                           :rows="this.rows"></common-excel-download>
  </div>
</template>

<script>
  import { post, on, off, formatNumber,exportList,formatBillRange } from "@/api/bizApi/commonUtil";

  export default {
    name: "prsttnOccurQuery",
    components: {
      ShowCpesBranch:()=>import(/* webpackChunkName: "shcpe/cpes/branch/showCpesBranch" */`@/views/bizViews/shcpe/cpes/branch/showCpesBranch`),
    },
    data() {
      return {
        formItem: {
          settleBusiType: "",
          reverseBillNo: "",
          acptBankNo: "",
          acptBankNameTem: "",
          maxBillMoney: "",
          minBillMoney: "",
          acptDt: "",
          dueDt: "",
          minRemitDt: "",
          maxRemitDt: "",
          minDueDt: "",
          maxDueDt: "",
          minPrsttnDt:"",
          maxPrsttnDt:"",
          billOrigin: "",
          minBillRangeStart: "",
          maxBillRangeEnd: "",
          inOutFlag: "2",
          orderByClause: "PRSTTN_DT DESC, DUE_DT DESC, ID DESC",
          transBrchNoList:JSON.parse(window.sessionStorage.getItem('userInfo')).brchNo,
          transBrchNames:JSON.parse(window.sessionStorage.getItem('userInfo')).brchName,
          billType: "",
          billClass: "",
          riskStatus: "",
          billMoney: "",
          acctFlag : "1"
        },
        remitDt:[],
        dueDate:[],
        applDate:[],
        columns: [
          {
            type: "selection",
            hiddenCol: false,
            width: 60,
            align: "center"
          },
          {
            type: "index",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.pe.prsttnApplyDt"),
            key: "prsttnDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (null != params.row.prsttnDt && "" !== params.row.prsttnDt) {
                let dttm = this.$moment(params.row.prsttnDt, "YYYY-MM-DD").format("YYYY-MM-DD");
                return h("span", dttm);
              }
            }
          },
          {
            title: this.$t('m.i.common.brchName'),
            key: "transBrchName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
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
              let list = this.getDictValueFromMap(this.dictMap, "CDMedia", params.row.billClass);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.billInfo.billOrigin"),
            key:'billOrigin',
            hiddenCol: false,
            render:(h,params) => {
              if (!params.row.billOrigin || "CS00" === params.row.billOrigin){
                return h("span", "-");
              }
              let dictValue = this.getDictValueFromMap(this.dictMap,"BillOrigin",params.row.billOrigin);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.billInfo.billPackageNo'),
            key: "billNo",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params.row);
                  }
                }
              }, params.row.billNo);
            }
          },
          {
            title: this.$t("m.i.billInfo.billRange"),
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
            title: this.$t('m.i.billInfo.billPackageMoney'),
            key: "billMoney",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("p", formatNumber(params.row.billMoney, 2, ","));
            }
          },
          {
            title: this.$t("m.i.billInfo.riskStatus"),
            key: "riskStatus",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "RiskStatus", params.row.riskStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.billInfo.pyeeName"),
            key: "pyeeName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.drwrName"),
            key: "drwrName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.drwrAcctNo"),
            key: "drwrAcctNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.remitDt"),
            key: "remitDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (null != params.row.remitDt && "" !== params.row.remitDt) {
                let dttm = this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD");
                return h("span", dttm);
              }
            }
          },
          {
            title: this.$t("m.i.billInfo.dueDt"),
            key: "dueDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (null != params.row.dueDt && "" !== params.row.dueDt) {
                let dttm = this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
                return h("span", dttm);
              }
            }
          },
          {
            title: this.$t("m.i.billInfo.acptName"),
            key: "acptName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.acptBankNo"),
            key: "acptBankNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.acptBankName"),
            key: "acptBankName",
            sortable: true,
            hiddenCol: false
          }
        ],
        ifShowMore: false,
        showCpesBranch: false,
        showBillInfoWin: false,
        billId: "",
        tempShowExcelTemplateWin: false,
        param: null,
        rows: null,
        billRangeStart: "",
        billRangeEnd: "",
        sumMoney: "",
        total: "",
        //brchNoWin: false,
        BillTypeList: [],
        BillClassList: [],
        RiskStatusList: [],
        billOriginList: [],
        currentSelectRow: [],
        dictMap: null
      };
    },
    mounted() {
      this.getDictListByGroups("CDMedia,DraftTypeCode,RiskStatus,BarterTrustStatus,AcctFlag,BillOrigin").then(res => {
        this.BillClassList = res.get("CDMedia");
        this.BillTypeList = res.get("DraftTypeCode");
        this.RiskStatusList = res.get("RiskStatus");
        this.billOriginList = res.get("BillOrigin");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      handleSearch() {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.dataChange(1);
      },
      handleRowClick(arr) {
        this.currentSelectRow = arr;
      },
      //重置查询结果
      resetSearch() {
        this.formItem.acptBankNameTem = "";
        this.formItem.acptBankNo = "";
        this.formItem.transBrchNames = JSON.parse(window.sessionStorage.getItem('userInfo')).brchName;
	      this.formItem.transBrchNoList =JSON.parse(window.sessionStorage.getItem('userInfo')).brchNo;
        this.remitDt = [];
        this.dueDate = [];
        this.applDate = [];
        this.$refs.formItem.resetFields();
      },
      queryBranchName() {
        this.showCpesBranch = true;
      },
      showCpesBranchClose() {
        this.showCpesBranch = false;
      },
      showCpesBranchSubmit(info) {
        if (info === null) {
          this.$msgTip.error(this, { info: "请先选择记录！" });
          return;
        }
        this.formItem.acptBankNo = info.transBrchBankNo;
        this.formItem.acptBankNameTem = info.brchFullNameZh;
        this.showCpesBranch = false;
      },
      billInfoWinClose() {
        this.showBillInfoWin = false;
      },
      showBillInfo(row) {
        this.billId = row.billId;
        this.billRangeStart=row.billRangeStart;
        this.billRangeEnd=row.billRangeEnd;
        this.showBillInfoWin = true;
      },
      getSumMoneyAndTotal(params) {
        this.total = params.total;
        this.sumMoney = formatNumber(params.sumMoney, 2, ",");
      },
      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },
      //清单导出
      tempShowExcelTemplateWinOpen() {
        this.param = "prsttnOccurQueryReportInfo";
        if (this.$refs.datagrid.selectIds.length != 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        } else {
          this.rows = this.$refs.datagrid.total;
        }
        this.tempShowExcelTemplateWin = true;
      },

      //清单导出
      exportList(field, exportType) {
        let exportUrl = window.LOCAL_CONFIG.API_HOME + "/pe/busiqry/prsttnOccurQuery/func_exportPay";
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
        exportList(this,this.param, field, exportType, exportUrl, options);
      },
      clearVal(optType) {
        if (optType === "acptBankNameTem") {
          this.formItem.acptBankNo = "";
          this.formItem.acptBankNameTem = "";
        }
      }
    }
  };
</script>

<style scoped>

</style>
