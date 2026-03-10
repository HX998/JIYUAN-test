<!--保证金转结算-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper" v-if="mainVue">
      <!--右侧数据展示表格-->
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item prop="custName" :label="$t('m.i.common.custName')">
                  <h-input v-model="formItem.custName" placeholder="" icon="android-search"
                           @on-click="queryCustNo()" clearable @on-clear="clearVal('custName')" readonly></h-input>
                </h-form-item>
                <h-form-item prop="custAcctNo" :label="$t('m.i.common.custAcctNo')">
                  <h-input v-model="formItem.custAcctNo" placeholder="" icon="android-search"
                           @on-click="queryCustAcctNo()" clearable @on-clear="clearVal('custAcctNo')"
                           readonly></h-input>
                </h-form-item>
                <h-form-item class="h-form-operate two-form">
                  <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            highlightRow
            url="/pl/bail/bailManager/bailDeposit/func_pagingQueryCustCredit"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="editBail()">{{$t("m.i.pl.editBail")}}</h-button>
              <h-button type="primary" @click="queryDetail()">{{$t("m.i.pl.queryDetail")}}</h-button>
              <h-button type="primary" @click="queryBailTransHis()">{{$t("m.i.pc.transHisQuery")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--转结算弹出窗-->
    <h-msg-box v-model="addOrEditWin" width="800" :mask-closable="false" @on-close="handleWinClose"
               class="h-form-search-layer" :maximize="true">
      <p slot="header">
        <span>保证金转结算</span>
      </p>
      <div>
        <h-form :model="addOrEditForm" :label-width="115" ref="addOrEditForm" cols="2" class="h-form-search">
          <h-form-item :label="$t('m.i.pl.billBailAcctNo')" prop="billBailAcctNo" required>
            <h-input v-model="addOrEditForm.billBailAcctNo" :maxlength="35" readonly placeholder=""
                     :icon="this.showIcon ? 'android-search' : ''" @on-click="queryBillBailAcctNo()"></h-input>
          </h-form-item>
          <h-form-item>
            <h-button type="primary" :disabled="!addOrEditForm.billBailAcctNo" @click="syncBailBalance()">
              {{$t("m.i.pl.syncBailBalance")}}
            </h-button>
          </h-form-item>
          <h-form-item prop="poolBailSubAcctNo" :label="$t('m.i.pl.poolBailSubAcctNo')" v-if="isSubAcctWorks==='1'">
            <h-input v-model="addOrEditForm.poolBailSubAcctNo" placeholder="" readonly>
            </h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.pl.doAmt')" prop="doAmt" required>
            <h-typefield type="money" v-model="addOrEditForm.doAmt" :maxlength="20" readonly bigTips
                         divided placeholder=""></h-typefield>
          </h-form-item>
          <h-form-item :label="$t('m.i.pl.bailBalance')" prop="bailBalance" required>
            <h-typefield type="money" v-model="addOrEditForm.bailBalance" :maxlength="20" readonly bigTips
                         divided placeholder=""></h-typefield>
          </h-form-item>
          <h-form-item prop="custAcctNo" :label="$t('m.i.pl.settleAcctNo')" required>
            <h-input v-model="addOrEditForm.custAcctNo" placeholder="" :maxlength="35" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.pl.changeAmt')" prop="changeAmt" required :validRules="changeAmtRule">
            <h-typefield type="money" v-model="addOrEditForm.changeAmt" :maxlength="20" bigTips divided
                         placeholder=""></h-typefield>
          </h-form-item>
        </h-form>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="handleWinClose">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="submitForm">{{$t("m.i.common.submit")}}</h-button>

      </div>
    </h-msg-box>

    <!--查询交易历史弹出窗-->
    <h-msg-box v-model="bailTransHisQueryWin" width="1000" :mask-closable="false" @on-close="bailTransHisQueryWinClose"
               class="h-form-search-layer" :maximize="true">
      <p slot="header">
        <span>保证金交易历史</span>
      </p>
      <div>
        <h-datagrid
          :columns="bailTransHisColumns"
          highlightRow
          :auto-load="false"
          :bindForm="bailTransHisFormItem"
          url="/pl/bail/bailManager/bailDeposit/func_pagingQueryBailTransBookHis"
          ref="bailTransHisDatagrid">
          <div slot="toolbar" class="pull-left">
          </div>
        </h-datagrid>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="bailTransHisQueryWinClose">{{$t("m.i.common.close")}}</h-button>
      </div>
    </h-msg-box>

    <credit-log-detail-for-pool :billManagerVue="billManagerVue" :logDetailParams="logDetailParams"
                                @returnMain="returnMain"></credit-log-detail-for-pool>
    <!-- 查询客户信息弹窗 -->
    <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose"
                       @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>
    <!-- 查询客户账号信息弹窗 -->
    <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" :cust-no="this.formItem.custNo"
                       @showCustAcctNoWinClose="showCustAcctNoWinClose"
                       @custAcctNoSelectSubmit="custAcctNoSelectSubmit"></show-cust-acct-no>
    <show-pool-credit-info :pool-credit-info-win="poolCreditInfoWin" :poolCreditInfoParams="poolCreditInfoParams"
                           @poolCreditInfoChange="poolCreditInfoChange"
                           @poolCreditInfoWinClose="poolCreditInfoWinClose"></show-pool-credit-info>

  </div>
</template>

<script>
  import {post, on, off, formatNumber, accMul, getSingleParamValuesByKeys} from "@/api/bizApi/commonUtil";

  export default {
    name: "bailDeposit",
    data() {
      let columns = [
        {
          type: "radio",
          title: " ",
          key: "multiSelect",
          width: 60,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.index"),
          type: "index",
          width: 60,
          align: "center",
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
          hiddenCol: false,
          ellipsis: false,
          sortable: true
        },
        {
          title: this.$t("m.i.pl.agreementNo"),
          key: "agreementNo",
          hiddenCol: false,
          ellipsis: false
        },
        {
          title: this.$t("m.i.pl.billBailAcctNo"),
          key: "billBailAcctNo",
          hiddenCol: false,
          ellipsis: false
        },
        {
          title: this.$t('m.i.pl.poolBailSubAcctNo'),
          key: "poolBailSubAcctNo",
          hiddenCol: false,
          ellipsis: false
        },
        {
          title: this.$t("m.i.pl.bailPcet"),
          key: "bailPcet",
          hiddenCol: false,
          render: (h, params) => {
            let bailPcet = params.row.bailPcet;
            if (bailPcet != null && bailPcet !== "") {
              bailPcet = accMul(bailPcet, 100);
            }
            return h("span", bailPcet);
          }
        },
        {
          title: this.$t("m.i.pc.creditLimitAmt"),
          key: "creditLimitAmt",
          ellipsis: false,
          hiddenCol: false,
          render: (h, params) => {
            let creditLimitAmt = formatNumber(params.row.creditLimitAmt, 2, ",");
            return h("span", {
              domProps: {
                title: creditLimitAmt
              }
            }, creditLimitAmt);
          }
        },
        {
          title: this.$t("m.i.pl.inPoolAmt"),
          key: "inPoolAmt",
          ellipsis: false,
          hiddenCol: false,
          render: (h, params) => {
            let inPoolAmt = formatNumber(params.row.inPoolAmt, 2, ",");
            return h("span", {
              domProps: {
                title: inPoolAmt
              }
            }, inPoolAmt);
          }
        },
        {
          title: this.$t("m.i.pl.usedCreditAmt"),
          key: "usedCreditAmt",
          hiddenCol: false,
          ellipsis: false,
          render: (h, params) => {
            let usedCreditAmt = formatNumber(params.row.usedCreditAmt, 2, ",");
            return h("span", {
              domProps: {
                title: usedCreditAmt
              }
            }, usedCreditAmt);
          }
        },
        {
          title: this.$t("m.i.pl.doPoolAmt"),
          key: "doAmt",
          hiddenCol: false,
          ellipsis: false,
          render: (h, params) => {
            let doAmt = formatNumber(params.row.doAmt, 2, ",");
            return h("span", {
              domProps: {
                title: doAmt
              }
            }, doAmt);
          }
        },
        {
          title: this.$t("m.i.pl.currentBailBalance"),
          key: "bailBalance",
          hiddenCol: false,
          ellipsis: false,
          render: (h, params) => {
            let bailBalance = formatNumber(params.row.bailBalance, 2, ",");
            return h("span", {
              domProps: {
                title: bailBalance
              }
            }, bailBalance);
          }
        }
      ];
      let bailTransHisColumns = [
        {
          title: this.$t("m.i.common.index"),
          type: "index",
          width: 60,
          align: "center",
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
          title: this.$t("m.i.pl.custSettleAcct"),
          key: "custAcctNo",
          hiddenCol: false,
          ellipsis: false,
          sortable: true
        },
        {
          title: this.$t("m.i.pl.poolBailAcctNo"),
          key: "bailAcctNo",
          hiddenCol: false,
          ellipsis: false
        },
        {
          title: this.$t("m.i.common.operType"),
          key: "operType",
          ellipsis: false,
          hiddenCol: false,
          sortable: false,
          render: (h, params) => {
            let dictValue = this.getDictValueFromMap(this.dictMap, "BailDepositOperType", params.row.operType);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t("m.i.pl.transMoney"),
          key: "changeAmt",
          ellipsis: false,
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let changeAmt = formatNumber(params.row.changeAmt, 2, ",");
            return h("span", {
              domProps: {
                title: changeAmt
              }
            }, changeAmt);
          }
        },
        {
          title: this.$t("m.i.pl.bailAcctBalance"),
          key: "bailBalance",
          ellipsis: false,
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let currentBailBalanceAmt = formatNumber(params.row.currentBailBalanceAmt, 2, ",");
            return h("span", {
              domProps: {
                title: currentBailBalanceAmt
              }
            }, currentBailBalanceAmt);
          }
        },
        {
          title: this.$t("m.i.pl.bailLimit"),
          key: "doAmt",
          ellipsis: false,
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let currentDoAmt = formatNumber(params.row.currentDoAmt, 2, ",");
            return h("span", {
              domProps: {
                title: currentDoAmt
              }
            }, currentDoAmt);
          }
        },
        {
          title: this.$t("m.i.common.operStatus"),
          key: "flowStatus",
          ellipsis: false,
          hiddenCol: false,
          sortable: false,
          render: (h, params) => {
            let dictValue = this.getDictValueFromMap(this.dictMap, "BailDepositOperStatus", params.row.flowStatus);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t("m.i.common.transDt"),
          key: "operDtTm",
          ellipsis: false,
          hiddenCol: false,
          sortable: false
        },
      ];
      return {
        isSubAcctWorks: "",
        showSubBillBailAcctNo: false,
        formItem: {
          custNo: "",
          custName: "",
          custAcctNo: ""
        },
        bailTransHisFormItem : {
          custNo: ""
        },
        columns: columns,
        bailTransHisColumns: bailTransHisColumns,
        cloneColumns: this.deepClone(columns),
        currentSelectRow: [],
        addOrEditWin: false,
        bailTransHisQueryWin: false,
        submitFlag: false,
        addOrEditForm: {
          id: "",
          legalNo: "",
          billBailAcctNo: "",
          doAmt: "",
          bailBalance: "",
          custNo: "",
          custAcctNo: "",
          changeAmt: "",
          poolBailSubAcctNo: "",
          poolNo: ""
        },
        showCustMessageWin: false,
        showCustAcctNoWin: false,
        changeAmtRule: [{test: this.validChangeAmt, trigger: "blur"}],
        dictMap: new Map(),
        creditAdjustTypeList: [],
        mainVue: true,
        billManagerVue: false,
        logDetailParams: {},
        //多池时根据弹出框选择
        showIcon: false,
        poolCreditInfoWin: false,
        poolCreditInfoParams: {},
      };
    },
    components: {
      CreditLogDetailForPool: () => import(/* webpackChunkName: "pl/credit/creditManager/creditLogDetailForPool" */`@/views/bizViews/pl/credit/creditManager/creditLogDetailForPool`)
    },
    methods: {
      validChangeAmt(rule, val, callback) {
        let maxChangeAmt = Number(this.addOrEditForm.doAmt) > Number(this.addOrEditForm.bailBalance) ? this.addOrEditForm.bailBalance : this.addOrEditForm.doAmt;
        if (Number(this.addOrEditForm.changeAmt) > Number(maxChangeAmt)) {
          callback(new Error("最大转账金额为" + maxChangeAmt));
          return;
        }
        if (Number(this.addOrEditForm.changeAmt) === Number(0)) {
          callback(new Error("转账金额不能为0"));
          return;
        }
        callback();
      },
      //查询池信息
      queryBillBailAcctNo() {
        this.poolCreditInfoWin = true;
      },
      //赋值
      poolCreditInfoChange(info) {
        this.addOrEditForm.legalNo = info.legalNo;
        this.addOrEditForm.billBailAcctNo = info.billBailAcctNo;
        this.addOrEditForm.poolBailSubAcctNo = info.poolBailSubAcctNo;
        this.addOrEditForm.doAmt = info.doAmt;
        this.addOrEditForm.bailBalance = info.bailBalance;
        this.addOrEditForm.custAcctNo = info.custAcctNo;
        this.addOrEditForm.custNo = info.custNo;
        this.addOrEditForm.poolNo = info.poolNo;
        this.poolCreditInfoWin = false;
      },
      //关闭弹出框
      poolCreditInfoWinClose() {
        this.poolCreditInfoWin = false;
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
          this.$msgTip.info(this, {info: "请先选择客户"});
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
      //搜索选择框清空事件
      clearVal(optType) {
        if (optType === "custName") {
          this.formItem.custName = "";
          this.formItem.custNo = "";
        }
        if (optType === "custAcctNo") {
          this.formItem.custAcctNo = "";
        }
      },
      formSearch() {
        this.currentSelectRow = [];
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.formItem.custNo = "";
        this.$refs.formItem.resetFields();
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      handleWinClose() {
        this.addOrEditWin = false;
        this.addOrEditForm.id = "";
        this.addOrEditForm.legalNo = "";
        this.addOrEditForm.custNo = "";
        this.addOrEditForm.poolNo = "";
        this.$refs.addOrEditForm.resetFields();
        this.formSearch();
      },
      bailTransHisQueryWinClose() {
        this.currentSelectRow = [];
        this.bailTransHisFormItem.custNo = "";
        this.bailTransHisQueryWin = false;
        this.formSearch();
      },
      editBail() {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          this.queryCustCreditInfo();
        } else {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseDataFirst")});
          this.addOrEditWin = false;
          return;
        }
        this.addOrEditWin = true;
      },
      queryCustCreditInfo() {
        let params = {custNo: this.currentSelectRow.custNo, batchId: this.currentSelectRow.batchId};
        post(params, "/pl/bail/bailManager/bailDeposit/func_pagingQueryCustCreditInfo").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            let list = res.data.retData.list;
            if (retCode === "000000") {
              if (list.length === 1) {
                let params = {custNo: this.currentSelectRow.custNo};
                this.queryCreditInfo(params);
              } else {
                this.showIcon = true;
                this.poolCreditInfoParams.batchId = this.currentSelectRow.batchId;
                this.poolCreditInfoParams.custNo = this.currentSelectRow.custNo;
                this.poolCreditInfoParams.dataUrl = "/pl/bail/bailManager/bailDeposit/func_pagingQueryCustCreditInfo";
              }
            } else {
              this.$msgTip.error(this, {info: res.data.retMsg});
            }
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
          }
        });
      },
      queryCreditInfo(params) {
        post(params, "/pl/bail/bailManager/bailDeposit/func_queryCustCreditInfo").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.addOrEditForm.id = res.data.retData.batchId;
              this.addOrEditForm.legalNo = res.data.retData.legalNo;
              this.addOrEditForm.billBailAcctNo = res.data.retData.billBailAcctNo;
              this.addOrEditForm.poolBailSubAcctNo = res.data.retData.poolBailSubAcctNo;
              this.addOrEditForm.doAmt = res.data.retData.doAmt;
              this.addOrEditForm.bailBalance = res.data.retData.bailBalance;
              this.addOrEditForm.custAcctNo = res.data.retData.custAcctNo;
              this.addOrEditForm.custNo = res.data.retData.custNo;
            } else {
              this.$msgTip.error(this, {info: res.data.retMsg});
            }
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
          }
        });
      },
      submitForm() {
        this.$refs["addOrEditForm"].validate(valid => {
          if (valid) {
            this.addOrEditForm.doAmt = this.addOrEditForm.doAmt.toString().replace(/,/g, "");
            this.addOrEditForm.bailBalance = this.addOrEditForm.bailBalance.toString().replace(/,/g, "");
            this.addOrEditForm.changeAmt = this.addOrEditForm.changeAmt.toString().replace(/,/g, "");
            this.submitFlag = true;
            let url = "/pl/bail/bailManager/bailDeposit/func_bailToSettle";
            post(this.addOrEditForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.handleWinClose();
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                  this.currentSelectRow = [];
                  if (null !== res.data.retData && undefined !== res.data.retData) {
                    let responsePrintInfos = res.data.retData.printInfos;
                    let responseVochIds = res.data.retData.vochIds;
                    this.$hMsgBox.confirm({
                      title: this.$t("m.i.common.confirm"),
                      content: "是否打印记账凭证?",
                      onOk: () => {
                        this.printAcctVoucher(responsePrintInfos, responseVochIds);
                      }
                    });
                  }
                } else {
                  this.$msgTip.error(this, {info: res.data.retMsg});
                }
              } else {
                this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
              }
            });
          }
        });
      },
      // 打印保证金转结算记账凭证
      printAcctVoucher(data, vochIds) {
        this.$print.vouchTemplatePrint(this, {
          data: data,
          vochIds: vochIds,
          callback: () => {
            this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
            this.currentSelectRow = [];
          },
          errorCallback: () => {

          }
        });
      },
      //余额同步
      syncBailBalance() {
        let params = {
          custNo: this.currentSelectRow.custNo,
          bailAcctNo: this.currentSelectRow.billBailAcctNo,
          subBailAcctNo: this.currentSelectRow.poolBailSubAcctNo
        };
        post(params, "/pl/bail/bailManager/bailDeposit/func_syncBailAcctNo").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let params = {custNo: this.currentSelectRow.custNo, poolNo: this.addOrEditForm.poolNo};
              this.queryCreditPoolInfo(params);
            } else {
              this.$msgTip.error(this, {info: res.data.retMsg});
            }
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
          }
        });
      },
      //查询池信息
      queryCreditPoolInfo(params) {
        post(params, "/pl/bail/bailManager/bailDeposit/func_pagingQueryCustCreditInfo").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            let list = res.data.retData.list[0];
            if (retCode === "000000") {
              this.addOrEditForm.id = list.batchId;
              this.addOrEditForm.legalNo = list.legalNo;
              this.addOrEditForm.billBailAcctNo = list.billBailAcctNo;
              this.addOrEditForm.poolBailSubAcctNo = list.poolBailSubAcctNo;
              this.addOrEditForm.doAmt = list.doAmt;
              this.addOrEditForm.bailBalance = list.bailBalance;
              this.addOrEditForm.custAcctNo = list.custAcctNo;
              this.addOrEditForm.custNo = list.custNo;
              this.addOrEditForm.poolNo = list.poolNo;
            } else {
              this.$msgTip.error(this, {info: res.data.retMsg});
            }
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
          }
        });
      },
      // 查询保证金交易历史
      queryBailTransHis() {
        if (this.currentSelectRow === null || this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.bailTransHisFormItem.custNo = this.currentSelectRow.custNo;
        this.bailTransHisQueryWin = true;
        this.$nextTick(() => {
          this.$refs.bailTransHisDatagrid.dataChange(1);
        });
      },
      //查询明细
      queryDetail() {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          this.logDetailParams.dictMap = this.dictMap;
          this.logDetailParams.creditAdjustTypeList = this.creditAdjustTypeList;
          this.logDetailParams.batchId = this.currentSelectRow.batchId;
          this.logDetailParams.custNo = this.currentSelectRow.custNo;
          this.logDetailParams.batchUrl = "/pl/bail/bailManager/bailDeposit/func_pagingQueryCustCreditInfo";
          this.logDetailParams.isQueryLog = false;
          this.logDetailParams.showSubBillBailAcctNo = this.isSubAcctWorks === '1';
          this.mainVue = false;
          this.billManagerVue = true;
        } else {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseDataFirst")});
          return false;
        }
      },
      returnMain() {
        this.currentSelectRow = [];
        this.mainVue = true;
        this.billManagerVue = false;
        this.logDetailParams = {};
        this.$nextTick(() => {
          if (this.isSubAcctWorks === '0') {
            this.cloneColumns.forEach((value, index) => {
              if (value.key === 'poolBailSubAcctNo') {
                value.hiddenCol = true;
              }
            });
          }
          this.columns = this.deepClone(this.cloneColumns);
          this.$refs.datagrid.createShowCol(this.cloneColumns);
        });
      }
    },
    mounted() {
      this.getDictListByGroups("BailDepositOperType,BailDepositOperStatus").then(res => {
        this.dictMap = res.get("map");
      });
      getSingleParamValuesByKeys("bm.cust.is_sub_acct_works").then(res => {
        this.isSubAcctWorks = res["bm.cust.is_sub_acct_works"];
        if (this.isSubAcctWorks === '0') {
          this.$refs.datagrid.controlColumnsHidden("poolBailSubAcctNo", true);  //不显示保证金子账号
        }
      });
    }
  };
</script>

<style scoped>

</style>
