<!--商票承兑发生查询-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{ 'h-form-overhd': !ifShowMore }">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <common-select v-model="formItem.billOrigin" prop="billOrigin" :label="$t('m.i.billInfo.billOrigin')"
                               required
                               :dictList="billOriginList" @on-change="billRangeRead"
                               clearValTag="billOrigin"></common-select>
                <common-input v-model="formItem.drwrName" :label="$t('m.i.billInfo.drwrName')" prop="drwrName"
                              showIcon clearable readonly :clearVal="clearVal" clearValTag="drwrName"
                              @on-click="queryCustCorp('drwrName')"></common-input>
                <common-input v-model="formItem.drwrAcctNo" :label="$t('m.i.billInfo.drwrAcctNo')" prop="drwrAcctNo"
                              showIcon clearable readonly @on-click="queryCustAcctNo('drwrAcctNo')"></common-input>

                <common-input v-model="formItem.acptName" :label="$t('m.i.billInfo.acptName')" prop="acptName"
                              showIcon clearable readonly :clearVal="clearVal" clearValTag="acptName"
                              @on-click="queryCustCorp('acptName')"></common-input>
                <common-input v-model="formItem.acptAcctNo" :label="$t('m.i.billInfo.acptAcctNo')" prop="acptAcctNo"
                              showIcon clearable readonly @on-click="queryCustAcctNo('acptAcctNo')"></common-input>
                <common-input v-model="formItem.pyeeName" :label="$t('m.i.billInfo.pyeeName')"
                              prop="pyeeName"></common-input>

                <h-form-item :label="$t('m.i.billInfo.billPackageNo')" prop="billNoLike">
                  <h-input v-model="formItem.billNoLike" placeholder=""></h-input>
                </h-form-item>
                <bill-range :formItem="formItem" :rangeProps="['minBillRangeStart','maxBillRangeEnd']"
                            :readonly="billRangeReadOnly"></bill-range>
                <common-date-picker v-model="remitDt" :label="$t('m.i.billInfo.remitDt')"
                                    type="daterange" :rangeValue="['minRemitDt','maxRemitDt']"
                                    :minRemitDt.sync="formItem.minRemitDt" :maxRemitDt.sync="formItem.maxRemitDt">
                </common-date-picker>
                <common-date-picker v-model="dueDate" :label="$t('m.i.billInfo.dueDt')"
                                    type="daterange" :rangeValue="['minDueDt','maxDueDt']"
                                    :minDueDt.sync="formItem.minDueDt" :maxDueDt.sync="formItem.maxDueDt">
                </common-date-picker>
                <h-form-item :label="$t('m.i.billInfo.billPackageMoney')" prop="billMoneyItem"
                             class="h-form-long-label">
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
                <show-branch v-model="formItem.acptBrchNoList" :label="$t('m.i.billInfo.acptOpenBrchName')"
                             prop="acptBrchNoList" isNeedChecked
                             title="承兑人开户机构" :showCheckBox="true" :brchNo.sync="formItem.acptBrchNoList"
                             class="h-form-long-label"
                             :brchName.sync="formItem.acptBrchNameList"></show-branch>
                <common-select v-model="formItem.isSettle" :dictList="isSettleList" :label="$t('m.i.ce.isSettle')"
                               prop="isSettle"></common-select>
                <!--                <common-select v-model="formItem.billStatus" :label="$t('m.i.ce.billStatus')" prop="billStatus"
                                               :dictList="billStatusList"></common-select>-->
                <query-btn :formSearch="handleSearch" :formSearchReset="resetSearch" @showChange="showChange">
                </query-btn>
              </h-form>
            </h-panel>
          </div>
          <div class="h-form-search-box">
            <h-panel class="clearfix">
              <h-form :label-width="90" class="h-form-search" cols="4">
                <common-input v-model="sumMoney" :label="$t('m.i.ce.billMoneyPackageTotalAmt')" readonly
                              class="h-form-long-label"></common-input>
                <common-input v-model="sumCount" :label="$t('m.i.pe.total')" readonly></common-input>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid :columns="columns"
                      url="/pe/busiqry/businessAcptOccurQuery/func_pagingQueryBusinessBillList"
                      :bindForm="formItem"
                      :row-select="true"
                      @getSumMoneyAndTotal="getSumMoneyAndTotal"
                      :auto-load="false"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="tempShowExcelTemplateWinOpen()">{{ $t("m.i.common.exportDetail") }}
              </h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!-- 查看票面 -->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin"
                    :billId="this.billId" :billNo="this.billNo" :billRangeStart="this.billRangeStart"
                    :billRangeEnd="this.billRangeEnd"></bill-info-main>
    <!-- 查询企业客户 -->
    <cust-corp-msg-box :showCustCorpWin="showCustCorpWin" @custCorpWinClose="custCorpWinClose"
                       @custCorpChange="custCorpChange" :isQueryCustAcct="true"
                       ref="custCorpMsgBox"></cust-corp-msg-box>
    <!-- 查询客户账号信息弹窗 -->
    <show-cust-acct-no :showCustAcctNoWin="showCustAcctNoWin" :custNo="this.custNo"
                       @showCustAcctNoWinClose="showCustAcctNoWinClose"
                       @custAcctNoSelectSubmit="custAcctNoSelectSubmit"></show-cust-acct-no>
    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param" :rows="this.rows">
    </common-excel-download>
  </div>
</template>

<script>
import {formatNumber, exportList, formatBillRange} from "@/api/bizApi/commonUtil";

export default {
  name: "businessAcptOccurQuery",
  data() {
    return {
      ifShowMore: false,
      param: null,
      rows: null,
      formItem: {
        acptBrchNoList: JSON.parse(window.sessionStorage.getItem('userInfo')).brchNo,
        acptBrchNameList: JSON.parse(window.sessionStorage.getItem('userInfo')).brchName,
        drwrName: "",
        drwrAcctNo: "",
        acptAcctNo: "",
        acptName: "",
        minRemitDt: "",
        maxRemitDt: "",
        minDueDt: "",
        maxDueDt: "",
        minBillMoney: "",
        maxBillMoney: "",
        pyeeName: "",
        isSettle: "",
        billOrigin: "",
        billNoLike: "",
        minBillRangeStart: "",
        maxBillRangeEnd: "",
        acptAcctName: "",
      },
      dictMap: new Map(),
      tempShowExcelTemplateWin: false,
      remitDt: [],
      dueDate: [],
      billOriginList: [],
      billStatusList: [],
      billRangeReadOnly: false,
      isSettleList: [{key: "1", value: "是"}, {key: "0", value: "否"}],
      sumMoney: "",
      sumCount: "",
      showBillInfoWin: false,
      billId: "",
      billNo: "",
      showCustCorpWin: false,
      showCustAcctNoWin: false,
      optTypeCorp: "",
      optTypeAcct: "",
      custNo: "",
      drwrCustNo: "",
      acptAcctCustNo: "",
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center",
        },
        {
          type: "index",
          title: this.$t("m.i.common.index"),
          width: 60,
          align: "center",
        },
        {
          title: this.$t('m.i.billInfo.billOrigin'),
          align: 'center',
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
                  this.showBillInfo(params.row);
                }
              }
            }, billNo);
          }
        },
        {
          title: this.$t("m.i.billInfo.billRange"),
          align: 'center',
          key: "billRange",
          hiddenCol: false,
          render: (h, params) => {
            let billOrigin = params.row.billOrigin;
            let billRangeStart = params.row.billRangeStart;
            let billRangeEnd = params.row.billRangeEnd;
            return h("span", formatBillRange(billOrigin, billRangeStart, billRangeEnd));
          }
        },
        {
          title: this.$t("m.i.billInfo.billType"),
          key: "billType",
          render: (h, params) => {
            let dictValue = this.getDictValueFromMap(
              this.dictMap,
              "DraftTypeCode",
              params.row.billType
            );
            return h(
              "span",
              {
                domProps: {
                  title: dictValue,
                },
              },
              dictValue
            );
          },
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
          sortable: true,
          render: (h, params) => {
            let date = params.row.remitDt ? this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "";
            return h("span", date);
          }
        },
        {
          title: this.$t("m.i.billInfo.dueDt"),
          key: "dueDt",
          sortable: true,
          render: (h, params) => {
            let date = params.row.dueDt ? this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "";
            return h("span", date);
          }
        },
        {
          title: this.$t('m.i.billInfo.drwrName'),
          sortable: true,
          key: "drwrName"
        },
        {
          title: this.$t('m.i.billInfo.drwrAcctNo'),
          sortable: true,
          key: "drwrAcctNo"
        },
        {
          title: this.$t('m.i.billInfo.drwrBankNo'),
          key: "drwrBankNo"
        },
        {
          title: this.$t('m.i.billInfo.drwrBankName'),
          key: "drwrBankName"
        },
        {
          title: this.$t('m.i.billInfo.pyeeName'),
          sortable: true,
          key: "pyeeName"
        },
        {
          title: this.$t('m.i.billInfo.pyeeAcctNo'),
          key: "pyeeAcctNo"
        },
        {
          title: this.$t('m.i.billInfo.pyeeBankNo'),
          key: "pyeeBankNo"
        },
        {
          title: this.$t('m.i.billInfo.pyeeBankName'),
          key: "pyeeBankName"
        },
        {
          title: this.$t('m.i.billInfo.acptName'),
          sortable: true,
          key: "acptName"
        },
        {
          title: this.$t('m.i.billInfo.acptAcctNo'),
          sortable: true,
          key: "acptAcctNo"
        },
        {
          title: this.$t('m.i.billInfo.acptBankNo'),
          key: "acptBankNo"
        },
        {
          title: this.$t('m.i.billInfo.acptBankName'),
          key: "acptBankName"
        },
        {
          title: this.$t('m.i.ce.isSettle'),
          key: "isSettle",
          sortable: true,
          render: (h, params) => {
            let dictValue = this.formatIsSettle(params.row.isSettle);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        /*          {
                    title: this.$t('m.i.ce.billStatus'),
                    key: "billStatus",
                    sortable: true,
                    render: (h, params) => {
                      let dictValue = this.getDictValueFromMap(
                        this.dictMap,
                        "BillStatusCode",
                        params.row.billStatus
                      );
                      return h(
                        "span",
                        {
                          domProps: {
                            title: dictValue,
                          },
                        },
                        dictValue
                      );
                    },
                  },*/
      ],
    };
  },
  methods: {
    //查询客户信息
    queryCustCorp(optTypeCorp) {
      this.optTypeCorp = optTypeCorp;
      this.showCustCorpWin = true;
    },
    custCorpWinClose() {
      this.showCustCorpWin = false;
      this.optTypeCorp = "";
    },
    custCorpChange(info) {
      if (this.optTypeCorp === "drwrName") {
        this.formItem.drwrName = info.custName;
        this.drwrCustNo = info.custNo;
        if (info.custAcctNo !== "") {
          this.formItem.drwrAcctNo = info.custAcctNo;
        }
      } else if (this.optTypeCorp === "acptName") {
        this.formItem.acptName = info.custName;
        this.acptAcctCustNo = info.custNo;
        if (info.custAcctNo !== "") {
          this.formItem.acptAcctNo = info.custAcctNo;
        }
      }
      this.showCustCorpWin = false;
      this.optTypeCorp = ""
    },
    //查询客户账号信息
    queryCustAcctNo(optTypeAcct) {
      if (optTypeAcct === "drwrAcctNo" && this.drwrCustNo === "") {
        this.$msgTip.info(this, {info: "请先选择客户！"});
        return;
      }
      if (optTypeAcct === "acptAcctNo" && this.acptAcctCustNo === "") {
        this.$msgTip.info(this, {info: "请先选择客户！"});
        return;
      }
      if (optTypeAcct === "drwrAcctNo") {
        this.custNo = this.drwrCustNo;
      } else if (optTypeAcct === "acptAcctNo") {
        this.custNo = this.acptAcctCustNo;
      }
      this.optTypeAcct = optTypeAcct;
      this.showCustAcctNoWin = true;
    },
    //关闭弹窗
    showCustAcctNoWinClose() {
      this.showCustAcctNoWin = false;
      this.optTypeAcct = "";
    },
    //赋值
    custAcctNoSelectSubmit(info) {
      if (this.optTypeAcct === "drwrAcctNo") {
        this.formItem.drwrAcctNo = info.custAcctNo;
      } else if (this.optTypeAcct === "acptAcctNo") {
        this.formItem.acptAcctNo = info.custAcctNo;
      }
      this.showCustAcctNoWin = false;
      this.optTypeAcct = "";
    },
    formatIsSettle(key) {
      let value = ""
      this.isSettleList.some((item) => {
        if (key === item.key) {
          value = item.value
        }
      })
      return value
    },
    handleSearch() {
      this.$refs["formItem"].validate(valid => {
        if (valid) {
          this.$refs.datagrid.dataChange(1);
        }
      });
    },
    resetSearch() {
      this.$refs.formItem.resetFields();
      this.dueDate = [];
      this.remitDt = [];
      this.formItem.acptBrchNoList = JSON.parse(window.sessionStorage.getItem('userInfo')).brchNo;
      this.formItem.acptBrchNameList = JSON.parse(window.sessionStorage.getItem('userInfo')).brchName;
      this.drwrCustNo = "";
      this.acptAcctCustNo = "";
      this.formItem.minBillMoney = "";
      this.formItem.maxBillMoney = "";
      this.$refs.datagrid.tData = [];
      this.$refs.datagrid.selects = [];
      this.$refs.datagrid.selectIds = [];
      this.sumMoney ="";
      this.sumCount ="";
    },
    billInfoWinClose() {
      this.showBillInfoWin = false;
    },
    showChange(val) {
      this.ifShowMore = val;
    },
    getSumMoneyAndTotal(params) {
      this.sumCount = params.total;
      this.sumMoney = formatNumber(params.sumMoney, 2, ",");
    },
    showExcelTemplateWinClose() {
      this.tempShowExcelTemplateWin = false;
    },
    //清单导出
    tempShowExcelTemplateWinOpen() {
      if (this.formItem.billOrigin == "" || this.formItem.billOrigin == null) {
        this.$msgTip.info(this, {info: "请先输入必输查询条件"});
        return;
      }
      this.param = "businessAcptBillOccurExportInfo";
      if (this.$refs.datagrid.selectIds.length != 0) {
        this.rows = this.$refs.datagrid.selectIds.length;
      } else {
        this.rows = this.$refs.datagrid.total;
      }
      this.tempShowExcelTemplateWin = true;
    },
    //清单导出
    exportList(field, exportType) {
      let exportUrl =
        window.LOCAL_CONFIG.API_HOME +
        "/pe/busiqry/businessAcptOccurQuery/func_exportBusinessAcptBillOccurExcel";
      //let options = {downloadByHttpReq: true};
      let options = {
        params: {}
      };
      if (this.$refs.datagrid.selectIds.length !== 0) {
        /*options.params = Object.assign(
          {
            ids: this.$refs.datagrid.selectIds,
          },
          this.formItem
        );*/
        options.params.ids = this.$refs.datagrid.selectIds;
        options.params.billOrigin = this.formItem.billOrigin;
        options.pageSize = this.$refs.datagrid.selectIds.length;
      } else {
        options.params = this.formItem;
        options.pageSize = this.$refs.datagrid.total;
      }
      exportList(this, this.param, field, exportType, exportUrl, options);
    },
    clearVal(optType) {
      debugger
      if (optType === "drwrName") {
        this.formItem.drwrName = "";
        this.drwrCustNo = "";
        this.formItem.drwrAcctNo = "";
      } else if (optType === "acptName") {
        this.formItem.acptName = "";
        this.formItem.acptAcctNo = "";
        this.acptAcctCustNo = "";
      }
    },
    showBillInfo(row) {
      this.billId = row.billId;
      this.billRangeStart = row.billRangeStart;
      this.billRangeEnd = row.billRangeEnd;
      this.showBillInfoWin = true;
    },
    //根据票据来源控制 子票区间查询条件的显示隐藏
    billRangeRead() {
      if (this.formItem.billOrigin === "CS01") {
        this.billRangeReadOnly = true;
        this.formItem.minBillRangeStart = "";
        this.formItem.maxBillRangeEnd = "";
      } else {
        this.billRangeReadOnly = false;
      }
    },
  },
  mounted() {
    this.getDictListByGroups("DraftTypeCode,BillOrigin,BillStatusCode").then((res) => {
      this.dictMap = res.get("map");
      this.billOriginList = res.get("BillOrigin");
      this.billStatusList = res.get("BillStatusCode");
    });
    this.billRangeRead();
  },
};
</script>
