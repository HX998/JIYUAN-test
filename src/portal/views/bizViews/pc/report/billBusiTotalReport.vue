<template>
  <div id="billBusiTotalReport">
    <div class="h-form-search-box">
      <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
        <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
          <h-form-item :label="$t('m.i.pc.countEndDt')" prop="countEndDt">
            <h-date-picker :value="formItem.countEndDt" type="date" placeholder="" v-model="formItem.countEndDt"
                           :editable=false :showFormat=true @on-change="handleDateChange1"></h-date-picker>
          </h-form-item>
          <h-form-item :label="$t('m.i.pc.counStartDt')" prop="counStartDt">
            <h-date-picker :value="formItem.counStartDt" type="date" placeholder="" v-model="formItem.counStartDt"
                           :editable=false :showFormat=true @on-change="handleDateChange2"></h-date-picker>
          </h-form-item>
          <h-form-item :label="$t('m.i.pc.ftp')" prop="ftp">
            <h-typefield :value="formItem.ftp" type="money" v-model="formItem.ftp" integerNum="2" suffixNum="4" placeholder="最多2位整数,4位小数"
                         :editable=true :showFormat=true ></h-typefield>
          </h-form-item>
          <h-form-item :label="$t('m.i.pc.buyBackFtp')" prop="buyBackFtp">
            <h-typefield :value="formItem.buyBackFtp" type="money" v-model="formItem.buyBackFtp" integerNum="2" suffixNum="4" placeholder="最多2位整数,4位小数"
                         :editable=true :showFormat=true ></h-typefield>
          </h-form-item>
          <h-form-item class="h-form-operate">
            <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                                                             :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
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
    name: "billBusiTotalReport",
    components: {
      SpreadSheet: () => import(/* webpackChunkName: "report/spread-sheet/SpreadSheet" */`@/plugins/report/spread-sheet/SpreadSheet`)
    },
    data() {
      return {
        formItem: {
          reportDt: "",
          countEndDt: "",
          counStartDt: "",
          ftp: "",
          buyBackFtp: "",
          reportCnName: "",
          brchNo: "",
          reportName: "billBusiTotalReport",
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
        ifShowMore: false
      };
    },
    computed: {
      getHeight() {
        return reportFunc.getSpreadSheetHeight();
      }
    },
    methods: {
      createReport() {
        let reportDt = this.formItem.countEndDt == "" ? window.sessionStorage.getItem("workDate") : this.formItem.countEndDt;
        let counStartDt = this.formItem.counStartDt;
        let countEndDt = this.formItem.countEndDt;
        let ftp = this.formItem.ftp;
        let buyBackFtp = this.formItem.buyBackFtp;
        let params = { creatorNo: window.sessionStorage.getItem("userName"), reportDt: reportDt,
          counStartDt: counStartDt, countEndDt: countEndDt, ftp: ftp, buyBackFtp: buyBackFtp};
        reportFunc.createReport(this, "/pc/report/billBusiTotalReport/func_sendBillBusiTotalQuery", params);
      },
      handleDateChange(value) {
        this.formItem.reportDt = value.replace(/-/g, "");
      },
      handleDateChange1(value) {
        this.formItem.countEndDt = value.replace(/-/g, "");
      },
      handleDateChange2(value) {
        this.formItem.counStartDt = value.replace(/-/g, "");
      },
      formSearch() {
        this.$refs.datagrid.dataChange(1);
      },
      downReport(id, status) {
        reportFunc.downReport(this, {
          status: status,
          downReportUrl: "/pc/report/billBusiTotalReport/func_billBusiTotalReport",
          urlSuffix: "reportId=" + id + "&userNo=" + window.sessionStorage.getItem("userName"),
          downReportTitle: "票据自营业务总表"
        });
      }
    }
  };
</script>

