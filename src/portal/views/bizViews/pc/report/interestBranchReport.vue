<template>
  <div id="interestBranchReport">
    <div class="h-form-search-box">
      <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
        <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
          <h-form-item :label="$t('m.i.common.brchName')" prop="brchName">
            <h-input v-model="formItem.brchNos" readonly v-show="false" placeholder=""></h-input>
            <h-input v-model="formItem.brchNames" readonly icon="android-search" @on-click="queryBrchNo()"
                     clearable @on-clear="clearVal()" :title="formItem.brchNames"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.pc.reportDt')" prop="reportDt">
            <h-date-picker :value="formItem.reportDt" type="date" placeholder="" v-model="formItem.reportDt"
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
    <show-branch :showBranchWin="showBranchWin" title="机构查询" @brchNoChange="brchNoChange"
                 ifcheck="true" :checkStrictly="true" @showBranchWinClose="showBranchWinClose"></show-branch>
  </div>
</template>

<script>
  import { reportFunc } from "@/api/bizApi/commonUtil";

  export default {
    name: "interestBranchReport",
    components: {
      SpreadSheet: () => import(/* webpackChunkName: "report/spread-sheet/SpreadSheet" */`@/plugins/report/spread-sheet/SpreadSheet`),
      ShowBranch: () => import(/* webpackChunkName: "sm/auth/branch/showBranch" */`@/views/bizViews/sm/auth/branch/showBranch`)
    },
    data() {
      return {
        formItem: {
          reportDt: "",
          reportCnName: "",
          brchNo: "",
          brchNos: "",
          brchNames: "",
          reportName: "interestBranchReport",
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
        //机构查询弹出框
        showBranchWin: false
      };
    },
    computed: {
      getHeight() {
        return reportFunc.getSpreadSheetHeight();
      }
    },
    methods: {
      createReport() {
        let reportDt = this.formItem.reportDt == "" ? window.sessionStorage.getItem("workDate") : this.formItem.reportDt;
        let params = { creatorNo: window.sessionStorage.getItem("userName"), reportDt: reportDt };
        reportFunc.createReport(this, "/pc/report/interestBranchReport/func_sendQueryReport", params);
      },
      handleDateChange(value) {
        this.formItem.reportDt = value.replace(/-/g, "");
      },
      formSearch() {
        this.$refs.datagrid.dataChange(1);
      },
      clearVal() {
        this.formItem.brchNos = "";
        this.formItem.brchNames = "";
      },
      //查询机构弹出框
      queryBrchNo() {
        this.showBranchWin = true;
      },
      //根据弹框所选数据进行赋值
      brchNoChange(info) {
        this.formItem.brchNos = "";
        this.formItem.brchNames = "";
        for (let i = 0; i < info.length; i++) {
          this.formItem.brchNos += info[i].id;
          this.formItem.brchNames += info[i].title;
          if (i < info.length - 1) {
            this.formItem.brchNos += ",";
            this.formItem.brchNames += ",";
          }
        }
        this.showBranchWin = false;
      },
      showBranchWinClose() {
        this.showBranchWin = false;
      },
      downReport(id, status) {
        reportFunc.downReport(this, {
          status: status,
          downReportUrl: "/pc/report/interestBranchReport/func_report",
          urlSuffix: "reportId=" + id + "&userNo=" + window.sessionStorage.getItem("userName"),
          downReportTitle: "按机构利润统计表"
        });
      }
    }
  };
</script>

