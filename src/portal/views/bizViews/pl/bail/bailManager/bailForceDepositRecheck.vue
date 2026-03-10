<!--保证金强制转结算复核-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
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
                <h-form-item :label="$t('m.i.common.applDt')" prop="minOperDt">
                  <h-date-picker :value="operDt" type="daterange" autoPlacement showFormat :editable=false
                                 @on-change="handleApplDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-row>
            <h-col span="24">
              <h-datagrid
                :columns="columns"
                highlightRow
                url="/pl/bail/bailManager/bailDeposit/func_pagingQueryBailTransBook"
                :bindForm="formItem"
                :rowSelect="true"
                :has-select="false"
                ref="datagrid">
                <div slot="toolbar" class="pull-left">
                  <h-button type="primary" @click="depositOpt('pass')">{{$t("m.i.common.pass")}}</h-button>
                  <h-button type="primary" @click="depositOpt('refuse')">{{$t("m.i.pl.refuse")}}</h-button>
                </div>
              </h-datagrid>
            </h-col>
          </h-row>
        </div>
      </h-col>
    </h-row>
    <!-- 查询客户信息弹窗 -->
    <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose"
                       @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>
    <!-- 查询客户账号信息弹窗 -->
    <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" :cust-no="this.formItem.custNo"
                       @showCustAcctNoWinClose="showCustAcctNoWinClose"
                       @custAcctNoSelectSubmit="custAcctNoSelectSubmit"></show-cust-acct-no>
  </div>
</template>

<script>
  import {post, on, off, formatNumber} from "@/api/bizApi/commonUtil";


  export default {
    name: "bailForceDepositRecheck",
    data() {
      return {
        operDt: [],
        formItem: {
          custNo: "",
          custName: "",
          custAcctNo: "",
          minOperDt: "",
          maxOperDt: ""
        },
        columns: [
          {
            type: "selection",
            align: "center",
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
            title: this.$t("m.i.common.applDt"),
            key: "operDt",
            hiddenCol: false,
            ellipsis: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.operDt == null || params.row.operDt === "") {
                return "";
              }
              let date = this.$moment(params.row.operDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.pl.applTm"),
            key: "operTm",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.operTm == null || params.row.operTm === "") {
                return "";
              }
              let operTm = params.row.operTm.toString();
              if (params.row.operTm.toString().length < 6) {
                for (let i = 0; i < (6 - params.row.operTm.toString().length); i++) {
                  operTm = "0" + operTm;
                }
              }
              let date = this.$moment(operTm, "HH:mm:ss").format("HH:mm:ss");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.pl.transOutAmt"),
            key: "changeAmt",
            ellipsis: false,
            hiddenCol: false,
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
            title: this.$t("m.i.pl.subTeller"),
            key: "operTellerNo",
            ellipsis: false,
            hiddenCol: false
          }
        ],
        currentSelectList: [],
        showCustMessageWin: false,
        showCustAcctNoWin: false,
      };
    },
    components: {},
    methods: {
      handleApplDtChange(arr) {
        if (arr && arr.length == 2) {
          this.formItem.minOperDt = arr[0].replace(/-/g, "");
          this.formItem.maxOperDt = arr[1].replace(/-/g, "");
          this.operDt = [arr[0], arr[1]];
        } else {
          this.formItem.minOperDt = "";
          this.formItem.maxOperDt = "";
          this.operDt = [];
        }
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
      //表格自适应
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
        this.currentSelectList = [];
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.formItem.custNo = "";
        this.formItem.minOperDt = "";
        this.formItem.maxOperDt = "";
        this.operDt = [];
        this.$refs.formItem.resetFields();
      },
      depositOpt(optType) {
        this.currentSelectList = this.$refs.datagrid.selects;
        if (this.currentSelectList.length === 0) {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseAtLeastOneRecord")});
          return;
        }
        let content = optType === "pass" ? "确定通过复核吗？" : "确定拒绝复核吗？";
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: content,
          onOk: () => {
            this.handleDeposit(optType);
          }
        });
      },
      handleDeposit(optType) {
        let isPass = optType === "pass" ? "1" : "0";
        let params = {ids: this.$refs.datagrid.selectIds, isPass: isPass};
        let url = "/pl/bail/bailManager/bailForceDeposit/func_forceDepositCheck";
        post(params, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.currentSelectList = [];
              this.$refs.datagrid.selects = [];
              this.$refs.datagrid.selectIds = [];
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
      },
      // 打印保证金转结算记账凭证
      printAcctVoucher(data, vochIds) {
        this.$print.vouchTemplatePrint(this, {
          data: data,
          vochIds: vochIds,
          callback: () => {
            this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
            this.currentSelectList = [];
            this.$refs.datagrid.selects = [];
            this.$refs.datagrid.selectIds = [];
          },
          errorCallback: () => {

          }
        });
      },
    }
  };
</script>

<style scoped>

</style>
