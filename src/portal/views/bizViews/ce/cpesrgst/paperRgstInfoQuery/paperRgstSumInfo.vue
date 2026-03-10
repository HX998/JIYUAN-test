<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.ce.rgstApplDt')" prop="minRgstApplDt">
                  <h-date-picker :value="rgstApplDt" type="daterange" autoPlacement showFormat :editable=false
                                 @on-change="handleRgstDtChange" placeholder=""></h-date-picker>
                </h-form-item>
            <!--    <h-form-item :label="$t('m.i.ce.ownBrch')" prop="brchName">
                  <h-input v-model="formItem.brchName" icon="android-search" @on-click="brchNoWinOpen"
                           readonly clearable @on-clear="clearVal()" :title="formItem.brchName"></h-input>
                </h-form-item>-->
                <show-branch v-model="formItem.rgstBrchNoList" :label="$t('m.i.ce.ownBrch')" prop="rgstBrchNoList"
                             title="机构名称" :showCheckBox="true" :brchNo.sync="formItem.rgstBrchNoList" :brchName.sync="formItem.brchName"></show-branch>

                <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType">
                  <h-select v-model="formItem.billType" placeholder="">
                    <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.ce.rgstBusiType')" prop="rgstClass">
                  <h-select v-model="formItem.rgstClass" placeholder="">
                    <h-option value="RI00">承兑登记</h-option>
                    <h-option value="RI04">贴现登记</h-option>
                    <h-option value="RI03">承兑保证登记</h-option>
                    <h-option value="RI01">质押登记</h-option>
                    <h-option value="RI02">质押解除登记</h-option>
                    <h-option value="RI06">结清登记</h-option>
                    <h-option value="RI07">止付登记</h-option>
                    <h-option value="RI08">解止付登记</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.ce.rgstStatus')" prop="rgstStatus">
                  <h-select v-model="formItem.rgstStatus" placeholder="">
                    <h-option v-for="item in rgstStatusList" :value="item.key" :key="item.key">{{item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t("m.i.common.searchAdvanced")}}<i
                    class="icon iconfont"
                    :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            url="/ce/cpesrgst/paperRgstInfoQuery/paperRgstSumInfo/func_pagingQueryPaperRgstSumInfo"
            :bindForm="formItem"
            :hasSelect="false"
            :paramId="'rowNo'"
            :rowSelect="true"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="tempShowExcelTemplateWinOpen()">{{$t("m.i.common.exportExcel")}}
              </h-button>
            </div>
          </h-datagrid>
          <!-- 查看票面 -->
          <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"
                          :billNo="this.billNo"></bill-info-main>
        </div>
      </h-col>
    </h-row>

    <!--明细弹出框-->
    <h-msg-box v-model="showDetilWin" width="800" :mask-closable="false" class="h-form-search-layer"
               @on-close="detailClose" :maximize="true">
      <p slot="header">
        <span>{{"汇总明细信息"}}</span>
      </p>
      <!--数据展示表格-->
      <h-datagrid
        highlight-row
        url="/ce/cpesrgst/paperRgstInfoQuery/paperRgstSumInfo/func_pagingQueryPaperRgstDetail"
        :columns="detailColumns"
        :bindForm="detailFormItem"
        :notSetWidth="true"
        :autoLoad="false"
        ref="datagridbill">
      </h-datagrid>
      <div slot="footer">
        <h-button type="ghost" @click="detailClose">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" @click="detailClose">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>

   <!-- <show-branch :showBranchWin="brchNoWin" title="机构名称" @brchNoChange="brchNoChange" ifcheck="isTrue"
                 :checkStrictly="true" @showBranchWinClose="brchNoWinClose"></show-branch>-->

    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param"
                           :rows="this.rows"></common-excel-download>
  </div>
</template>

<script>
  import { formatNumber, getDictListByGroups, getDictValueFromMap, off, on, post } from "@/api/bizApi/commonUtil";

  export default {
    name: "paperRegSumInfo",
    data() {
      return {
        formItem: {
          billType: "",
          scope: "",
          minRgstApplDt: "",
          maxRgstApplDt: "",
          rgstBrchNoList: "",
          rgstClass: "",
          rgstStatus: "",
          brchName: "",
          totalAmt: ""
        },
        detailFormItem: {
          minRgstApplDt: "",
          maxRgstApplDt: "",
          rgstClass: "",
          rgstStatus: "",
          rgstBrchNoList: ""
        },
        ifShowMore: false,
        rgstApplDt: [],
        rgstStatusList: [],
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
            title: this.$t("m.i.ce.rgstBusiType"),
            key: "rgstClass",
            hiddenCol: false,
            render: (h, params) => {
              return h("div", [
                h("span", this.formatRgstClass(params.row.rgstClass, params.row, params.row.index))
              ]);
            }
          },
          {
            title: this.$t("m.i.ce.registerStatus"),
            key: "rgstStatus",
            hiddenCol: false,
            render: (h, params) => {
              let dictMap = this.dictMap;
              let dictValue = getDictValueFromMap(this.dictMap, "AcptRgstStatus", params.row.rgstStatus);
              return h("span", { domProps: { title: dictValue } }, dictValue);
            }
          },
          {
            title: this.$t("m.i.ce.count"),
            key: "totalNum",
            hiddenCol: false,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showDetilBox(params.row.rgstClass, params.row.rgstStatus);
                  }
                }
              }, params.row.totalNum);
            }
          },
          {
            title: this.$t("m.i.ce.totalAmt"),
            key: "totalAmt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h("p", formatNumber(params.row.totalAmt, 2, ","));
            }
          }
        ],
        detailColumns: [
          {
            type: "radio",
            title: " ",
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
            /*render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params.row.billId, params.row.billNo);
                  }
                }
              }, params.row.billNo);
            }*/
          },
          {
            title: this.$t("m.i.billInfo.billMoney"),
            key: "billMoney",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("p", formatNumber(params.row.billMoney, 2, ","));
            }
          },
          {
            title: this.$t("m.i.billInfo.remitDt"),
            key: "remitDt",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.dueDt"),
            key: "dueDt",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.acptBankName"),
            key: "acptBankName",
            hiddenCol: false
          }
        ],
        //brchNoWin: false,
        showDetilWin: false,
        tempShowExcelTemplateWin: false,
        param: null,
        rows: null,
        showBillInfoWin: false,
        billId: "",
        billNo: "",
        dictMap: new Map(),
        billTypeList: []
      };
    },
    components: {
      //ShowBranch: () => import(/* webpackChunkName: "sm/auth/branch/showBranch" */`@/views/bizViews/sm/auth/branch/showBranch`)
    },
    created() {
      let userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
      this.formItem.rgstBrchNoList = userInfo.brchNo;
      this.formItem.brchName = userInfo.brchName;
      let workDate = this.$moment(window.sessionStorage.getItem("workDate"), "YYYYMMDD").format("YYYY-MM-DD");
      this.rgstApplDt = [workDate, workDate];
      this.formItem.minRgstApplDt = window.sessionStorage.getItem("workDate");
      this.formItem.maxRgstApplDt = window.sessionStorage.getItem("workDate");
    },
    methods: {
      formSearch() {
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
        let userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
        this.formItem.rgstBrchNoList = userInfo.brchNo;
        this.formItem.brchName = userInfo.brchName;
        this.formItem.minRgstApplDt = window.sessionStorage.getItem("workDate");
        this.formItem.maxRgstApplDt = window.sessionStorage.getItem("workDate");
        let workDate = this.$moment(window.sessionStorage.getItem("workDate"), "YYYYMMDD").format("YYYY-MM-DD");
        this.rgstApplDt = [workDate, workDate];
      },
      /*brchNoChange(info) {
        let objs = [];
        if (info instanceof Array) {
          objs = info;
        } else {
          objs[0] = info;
        }
        let brchNos = "";
        let brchNames = "";
        for (var i = 0; i < objs.length; i++) {
          brchNos += objs[i].id + ",";
          brchNames += objs[i].title + ",";
        }
        this.formItem.rgstBrchNoList = brchNos.substring(0, brchNos.length - 1);
        this.formItem.brchName = brchNames.substring(0, brchNames.length - 1);
        this.brchNoWin = false;
      },
      brchNoWinOpen() {
        this.brchNoWin = true;
      },
      brchNoWinClose() {
        this.brchNoWin = false;
      },*/
      showDetilBox(rgstClass, rgstStatus) {
        this.showDetilWin = true;
        this.$nextTick(() => {
          this.detailFormItem.rgstClass = rgstClass;
          this.detailFormItem.rgstStatus = rgstStatus;
          this.detailFormItem.maxRgstApplDt = this.formItem.maxRgstApplDt;
          this.detailFormItem.minRgstApplDt = this.formItem.minRgstApplDt;
          this.detailFormItem.rgstBrchNoList = this.formItem.rgstBrchNoList;
          this.detailFormItem.billType = this.formItem.billType;
          this.$refs.datagridbill.dataChange(1);
        });
      },
      detailClose() {
        this.detailFormItem.rgstClass = "";
        this.detailFormItem.rgstStatus = "";
        this.detailFormItem.maxRgstApplDt = "";
        this.detailFormItem.minRgstApplDt = "";
        this.detailFormItem.rgstBrchNoList = "";
        this.showDetilWin = false;
      },
      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },
      tempShowExcelTemplateWinOpen() {
        this.param = "paperRgstSumReportInfo";
        if (this.$refs.datagrid.selectIds.length != 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        } else {
          this.rows = this.$refs.datagrid.total;
        }
        this.tempShowExcelTemplateWin = true;
      },
      //票面
      showBillInfo(billId, billNo) {
        this.billId = billId;
        this.billNo = billNo;
        this.showBillInfoWin = true;
      },
      billInfoWinClose() {
        this.showBillInfoWin = false;
      },
      //清单导出
      exportList(field, exportType) {
        //exportType: 0-同步 1-异步
        if (exportType === "1") {
          let url = window.LOCAL_CONFIG.API_HOME + "/ce/cpesrgst/paperRgstInfoQuery/paperRgstSumInfo/func_exportPaperRegisterList";
          let pageSize = this.$refs.datagrid.total;
          if (this.$refs.datagrid.total == 0) {
            pageSize = 1;
          }
          let count = this.detailFormItem.totalNum;
          if(!this.detailFormItem.totalNum){
            count = 0;
          }
          let params = null;
          if (this.$refs.datagrid.selects.length != 0) {
            params = {
              json: JSON.stringify(this.$refs.datagrid.selects),
              pageSize: this.$refs.datagrid.selectIds.length,
              field: field,
              exportType: exportType,
              excelName: this.param
            };
          } else {
            params = {
              billType: this.formItem.billType,
              minRgstApplDt: this.formItem.minRgstApplDt,
              maxRgstApplDt: this.formItem.maxRgstApplDt,
              rgstBrchNoList: this.formItem.rgstBrchNoList,
              rgstClass: this.formItem.rgstClass, rgstStatus: this.formItem.rgstStatus,
              count: count, sumMoney: this.formItem.totalAmt,
              field: field, exportType: exportType, excelName: this.param, pageSize: pageSize
            };
          }
          post(params, url).then(res => {
            if (res.status === 200 && res.data === null) {
              this.$msgTip.info(this, { info: "异步导出成功，请进入公共管理》导出下载页面，进行下载" });
            } else if (res.status === 200 && res.data === "") {
              this.$msgTip.info(this, { info: "异步导出成功，请进入公共管理》导出下载页面，进行下载" });
            } else {
              this.$msgTip.error(this, { info: "异步导出失败" });
            }
          });
        } else {
          if (this.$refs.datagrid.selects.length != 0) {
            let url = window.LOCAL_CONFIG.API_HOME + "/ce/cpesrgst/paperRgstInfoQuery/paperRgstSumInfo/func_exportPaperRegisterList";
            let form = document.createElement("form");

            form.setAttribute("id", "formId");
            form.setAttribute("action", url);
            form.setAttribute("method", "post");
            let input1 = document.createElement("input");
            input1.type = "text";
            input1.name = "json";
            input1.value = JSON.stringify(this.$refs.datagrid.selects);
            form.appendChild(input1);
            let input3 = document.createElement("input");
            input3.type = "text";
            input3.name = "field";
            input3.value = field;
            form.appendChild(input3);
            let input4 = document.createElement("input");
            input4.type = "text";
            input4.name = "exportType";
            input4.value = exportType;
            form.appendChild(input4);
            let input5 = document.createElement("input");
            input5.type = "text";
            input5.name = "excelName";
            input5.value = this.param;
            form.appendChild(input5);

            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
          } else {
            let url = window.LOCAL_CONFIG.API_HOME + "/ce/cpesrgst/paperRgstInfoQuery/paperRgstSumInfo/func_exportPaperRegisterList";
            let form = document.createElement("form");
            for (let obj in this.formItem) {
              if (this.formItem.hasOwnProperty(obj)) {
                let input = document.createElement("input");
                input.type = "text";
                input.name = obj;
                input.value = this.formItem[obj];
                form.appendChild(input);
              }
            }
            form.setAttribute("id", "formId");
            form.setAttribute("action", url);
            form.setAttribute("method", "post");
            if (this.$refs.datagrid.total > 0) {
              let input1 = document.createElement("input");
              input1.type = "text";
              input1.name = "pageSize";
              input1.value = this.$refs.datagrid.total;
              form.appendChild(input1);
            }
            let input3 = document.createElement("input");
            input3.type = "text";
            input3.name = "field";
            input3.value = field;
            form.appendChild(input3);
            let input4 = document.createElement("input");
            input4.type = "text";
            input4.name = "exportType";
            input4.value = exportType;
            form.appendChild(input4);
            let input5 = document.createElement("input");
            input5.type = "text";
            input5.name = "excelName";
            input5.value = this.param;
            form.appendChild(input5);

            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
          }
        }
      },
 /*     clearVal() {
        this.addForm.rgstBrchNoList = "";
        this.addForm.brchName = "";
      },*/
      formatRgstClass(value, row, index) {
        if (value != null && value != "") {
          switch (value) {
            case "RI00":
              return "承兑登记";
            case "RI04":
              return "贴现登记";
            case "RI03":
              return "承兑保证登记";
            case "RI01":
              return "质押登记";
            case "RI02":
              return "质押解除登记";
            case "RI06":
              return "结清登记";
            case "RI07":
              return "止付登记";
            case "RI08":
              return "解止付登记";
          }
        } else {
          return "";
        }
      },
      handleRgstDtChange(arr) {
        if (arr && arr.length == 2) {
          this.formItem.minRgstApplDt = arr[0].replace(/-/g, "");
          this.formItem.maxRgstApplDt = arr[1].replace(/-/g, "");
          this.rgstApplDt = [arr[0], arr[1]];
        } else {
          this.formItem.minRgstApplDt = "";
          this.formItem.maxRgstApplDt = "";
          this.rgstApplDt = [];
        }
      }
    },
    mounted() {
      this.getDictListByGroups("DraftTypeCode,AcptRgstStatus").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.rgstStatusList = res.get("AcptRgstStatus");
        this.dictMap = res.get("map");
      });
    }
  };
</script>

<style scoped>

</style>
