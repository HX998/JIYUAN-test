<template>
  <div id="fundPositionReport">
    <div class="h-form-search-box">
      <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
        <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
          <h-form-item :label="$t('m.i.pc.reportDt')" prop="reportDt">
            <h-date-picker :value="formItem.reportDt" type="date" placeholder="" v-model="formItem.reportDt" :options="reportDtOptions"
                           :editable=false :showFormat=true @on-change="handleDateChange"></h-date-picker>
          </h-form-item>
          <h-form-item class="h-form-operate one-form">
            <h-button type="ghost" @click="createReport()">{{$t("m.i.common.search")}}</h-button>
            <h-button type="primary" @click="formSearch()">{{$t("m.i.config.refreshCache")}}</h-button>
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
import { reportFunc } from "@/api/bizApi/commonUtil";

export default {
  name: "fundPositionReport",
  components: {
    SpreadSheet: () => import(/* webpackChunkName: "report/spread-sheet/SpreadSheet" */`@/plugins/report/spread-sheet/SpreadSheet`)
  },
  data() {
    let _this = this;
    return {
      formItem: {
        reportDt: window.sessionStorage.getItem("workDate"),
        reportCnName: "",
        brchNo: "",
        reportName: "fundPositionReport",
        creatorNo: window.sessionStorage.getItem("userName"),
        status: "",
        operDt: ""
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
      ifShowMore: false,
      reportDtOptions: {
        disabledDate (date) {
          return date && date.valueOf() > _this.$moment(window.sessionStorage.getItem("workDate"), "YYYYMMDD");
        }
      }
    };
  },
  computed: {
    getHeight() {
      return reportFunc.getSpreadSheetHeight();
    }
  },
  methods: {
    createReport() {
      this.formItem.reportDt = this.formItem.reportDt.replace(/-/g, "");
      let params = { creatorNo: window.sessionStorage.getItem("userName"), reportDt: this.formItem.reportDt };
      reportFunc.createReport(this, "/pc/report/fundPositionReport/func_sendQueryReport", params);
    },
    handleDateChange(value) {
      this.formItem.reportDt = value.replace(/-/g, "");
    },
    formSearch() {
      this.formItem.reportDt = this.formItem.reportDt.replace(/-/g, "");
      this.$refs.datagrid.dataChange(1);
    },
    downReport(id, status) {
      reportFunc.downReport(this, {
        status: status,
        downReportUrl: "/pc/report/fundPositionReport/func_fundReport",
        urlSuffix: "reportId=" + id + "&userNo=" + window.sessionStorage.getItem("userName"),
        downReportTitle: "头寸流量表"
      });
    }
  }
};
</script>

