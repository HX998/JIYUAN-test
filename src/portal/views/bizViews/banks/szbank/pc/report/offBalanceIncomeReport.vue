<template>
  <div id="billDiscMonthReport">
    <div class="h-form-search-box">
      <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
        <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
          <show-branch v-model="formItem.brchNos" :label="'查询机构'" prop="brchNos"
                       isNeedChecked multiple
                       :showCheckBox="true"
                       :brchNo.sync="formItem.brchNos"
                       :brchName.sync="formItem.brchNames"></show-branch>
          <h-form-item label="客户经理" prop="custMgrName">
            <h-input v-model="formItem.custMgrName" :maxLength="20"></h-input>
          </h-form-item>
          <h-form-item label="客户经理号" prop="custMgrNo">
            <h-input v-model="formItem.custMgrNo" :maxLength="20"></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.pc.date')" prop="date">
            <h-date-picker type="daterange" autoPlacement placeholder="" v-model="formItem.date"
                           format="yyyy-MM-dd" showFormat @on-change="handleDtChange"></h-date-picker>
          </h-form-item>
          <h-form-item class="h-form-operate">
            <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{ $t('m.i.common.searchAdvanced') }}
              <i class="icon iconfont"
                 :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
            <h-button type="ghost" @click="createReport()">{{ $t("m.i.common.search") }}</h-button>
            <h-button type="primary" @click="formSearch()">{{ $t("m.i.config.refreshCache") }}</h-button>
          </h-form-item>
        </h-form>
      </h-panel>
    </div>
    <!--数据展示表格-->
    <h-datagrid
      :columns="columns"
      url="/pc/report/exportReport/func_queryExportReport"
      :bindForm="formItem"
      :hasSelect="false" rowSelect
      :notSetWidth="true"
      :height="100"
      :hasPage="false"
      showListCkeckBox
      ref="datagrid">
    </h-datagrid>
    <spread-sheet ref="excel" :isProtected="true" :host-style="{height:getHeight}"></spread-sheet>
  </div>
</template>

<script>
import {reportFunc} from "@/api/bizApi/commonUtil";

export default {
  name: "offBalanceIncomeReport",
  components: {
    SpreadSheet: () => import(/* webpackChunkName: "report/spread-sheet/SpreadSheet" */`@/plugins/report/spread-sheet/SpreadSheet`)
  },
  data() {
    return {
      formItem: {
        reportDt: window.sessionStorage.getItem("workDate"),
        reportCnName: "",
        brchNos: JSON.parse(window.sessionStorage.getItem('userInfo')).brchNo,
        brchNames: JSON.parse(window.sessionStorage.getItem('userInfo')).brchName,
        reportName: "offBalanceIncomeReport",
        creatorNo: window.sessionStorage.getItem("userName"),
        status: "",
        operDt: "",
        custMgrNo: "",
        custMgrName: "",
        date: [],
        minReportDt: "",
        maxReportDt: "",
      },
      columns: [
        {
          type: "radio",
          width: 50,
          align: "center",
          title: " ",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.index"),
          type: "index",
          width: 60,
          align: "center"
        },
        {
          title: this.$t("m.i.pc.reportCnName"),
          key: "reportCnName",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.pc.creatorName"),
          key: "creatorName",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.status"),
          key: "status",
          hiddenCol: false,
          render: (h, params) => {
            return h("div", [
              h("span", reportFunc.formatStatus(params.row.status))
            ]);
          }
        },
        {
          title: this.$t("m.i.pc.reportDt"),
          key: "reportDt",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.operDt"),
          key: "operDt",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.download"),
          key: "下载",
          hiddenCol: false,
          render: (h, params) => {
            return h("a", {
              on: {
                click: () => {
                  this.downReport(params.row.id, params.row.status);
                }
              }
            }, "下载");
          }
        }
      ],
      ifShowMore: false
    };
  },
  computed: {
    getHeight() {
      return reportFunc.getSpreadSheetHeight();
    }
  },
  methods: {
    handleDtChange(arr) {
      if (arr && arr.length == 2) {
        this.formItem.minReportDt = arr[0].replace(/-/g, "");
        this.formItem.maxReportDt = arr[1].replace(/-/g, "");
        this.date = [arr[0], arr[1]];
      } else {
        this.formItem.minReportDt = "";
        this.formItem.maxReportDt = "";
        this.date = [];
      }
    },
    createReport() {
      // let reportDt = this.formItem.reportDt == "" ? window.sessionStorage.getItem("workDate") : this.formItem.reportDt;
      // let params = {creatorNo: window.sessionStorage.getItem("userName"), reportDt: reportDt};
      reportFunc.createReport(this, "/banks/szbank/pc/report/offBalanceIncomeReport/func_sendQueryReport", this.formItem);
    },
    handleDateChange(value) {
      this.formItem.reportDt = value.replace(/-/g, "");
    },
    formSearch() {
      this.$refs.datagrid.dataChange(1);
    },
    downReport(id, status) {
      reportFunc.downReport(this, {
        status: status,
        downReportUrl: "/banks/szbank/pc/report/offBalanceIncomeReport/func_report",
        urlSuffix: "reportId=" + id + "&userNo=" + window.sessionStorage.getItem("userName"),
        downReportTitle: "中间业务收入表"
      });
    }
  }
};
</script>

