<!--匿名点击-卖出主批-挑票-->
<template>
  <div>
    <h-msg-box v-model="tempPickBillWin" :mask-closable="false" @on-close="pickBillClose" :maximize="true" width="1000"
               class="h-form-table-layer" top="10" @on-maximize="onMaximize">
      <p slot="header">
        <span>{{title}}</span>
      </p>
      <div :class="{'h-form-overhd':!ifShowMore}">
        <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
          <!--票据介质-->
          <!--<bill-class v-model="formItem.billClass" :dictList="pickBillParams.billClassList" :readonly="true"></bill-class>-->
          <!--票据种类-->
          <!-- <bill-type v-model="formItem.billType" :dictList="pickBillParams.billTypeList" ></bill-type>-->
          <!--批次号-->
          <batch-no v-model="formItem.batchNo"></batch-no>
          <!--客户名称-->
          <cust-name :formItem = "formItem"  @queryCustMessage="queryCustMessage"></cust-name>
          <cust-acct-no :formItem = "formItem" @queryCustAcctNo="queryCustAcctNo"></cust-acct-no>
          <!--票号模糊-->
          <h-form-item prop="billNo" :label="$t('m.i.billInfo.billPackageNo')">
            <h-input v-model="formItem.billNo"></h-input>
          </h-form-item>
          <bill-range :formItem="formItem" :rangeProps="['minBillRangeStart','maxBillRangeEnd']"></bill-range>
          <!--票面到期日-->
          <due-dt-range v-model="dueDt" @on-change="handleDueDtChange"></due-dt-range>
          <!--票面金额-->
          <!--<bill-money-range :label="$t('m.i.billInfo.billPackageMoney')" v-model="formItem" :rangeProps="['minBillMoney','maxBillMoney']" className="h-form-long-label"></bill-money-range>-->
          <!--票据期限-->
          <!--<common-select v-model="formItem.billTerm" :label="$t('m.i.be.residualTerm')" prop="billTerm"
                         :dictList="pickBillParams.tenorCodeList"></common-select>-->
          <!--承兑人名称-->
          <!-- <acpt-name v-model="formItem.acptName"></acpt-name>-->
          <!--承兑行级别-->
          <!-- <common-select v-model="formItem.acptTopBankLevel" :label="$t('m.i.billInfo.acptTopBankLevel')" prop="acptTopBankLevel"
                          :dictList="pickBillParams.bankLevelList"></common-select>-->
          <!--承兑行类型-->
          <!-- <common-select v-model="formItem.acptBankType" :label="$t('m.i.billInfo.acptBankType')" prop="acptBankType"
                          :dictList="pickBillParams.creditMajorList"></common-select>-->
          <!--买入日期-->
          <!--  <common-date-picker v-model="buyDt" :label="$t('m.i.be.buyDt')" type="daterange"
                                :autoPlacement="true" @on-change="handleBuyDtChange"></common-date-picker>-->
          <query-btn @showChange="showChange" :formSearch="handleSearch" :formSearchReset="resetSearch"></query-btn>
        </h-form>
        <h-datagrid
          :columns="pickColumns"
          url="/ce/disc/elec/banEndor/discBanEndorBill/func_pagingQueryHldrBillInfo"
          :auto-load="false"
          rowSelect
          :bindForm="formItem"
          :hasSelect="false"
          ref="pickBillDatagrid">
        </h-datagrid>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="pickBillClose()">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="pickBillSubmit()">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="billId"
                    :billNo="billNo" :billRangeStart="billRangeStart" :billRangeEnd="billRangeEnd"></bill-info-main>
    <brch-code-search :brchCodeWin="showBrchWin" optType="2" @brchCodeWinClose="closeBranch"
                      @brchCodeChange="brchCodeChange"></brch-code-search>
    <!-- 查询客户信息弹窗 -->
    <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose" @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>
    <!-- 查询客户账号信息弹窗 -->
    <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" :cust-no="this.formItem.oppCustNo" @showCustAcctNoWinClose="showCustAcctNoWinClose"
                       :isAllBankAcct=true
                       @custAcctNoSelectSubmit="custAcctNoSelectSubmit"></show-cust-acct-no>
  </div>
</template>

<script>
  import {post,formatNumber, on, off} from "@/api/bizApi/commonUtil";

  export default {
    name: "salePickBill",
    components: {
      BrchCodeSearch: () => import(/* webpackChunkName: "sm/auth/branch/cpesBrchCodeSearch" */`@/views/bizViews/sm/auth/branch/cpesBrchCodeSearch`)
    },
    data() {
      return {
        submitFlag: false,
        ifShowMore: false,
        buyDt: [],
        dueDt: [],
        formItem: {
          billType: "",
          billClass: "",
          batchNo: "",
          minBillMoney: "",
          maxBillMoney: "",
          minDueDt: "",
          maxDueDt: "",
          acptName: "",
          minBuyDt: "",
          maxBuyDt: "",
          billNo: "",
          minBillRangeStart: "",
          maxBillRangeEnd: "",
          custName: "",
          transFromName: "",
          oppAcctNo: "",
          custAcctNo: "",
          oppCustNo: "",
          acptTopBankLevel: "",
          discTopBankLevel: "",
          billTerm: "",
          acptBankType: "",
          discBankType: "",
          discBankName: "",
          creditBranchClass: "",
          creditBranchName: "",
          creditBrchCode: ""
        },
        pickColumns: [
          {
            type: "selection",
            width: 50,
            hiddenCol: false,
            align: "center"
          },
          {
            type: "index",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center"
          },
          {
            title: this.$t("m.i.common.batchNo"),
            key: "batchNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.billOrigin'),
            key: 'billOrigin',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = (!params.row.billOrigin || params.row.billOrigin === 'CS00') ? '-' : this.getDictValueFromMap(this.pickBillParams.dictMap, 'BillOrigin', params.row.billOrigin);
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
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.billInfoWinOpen(params.row.billId, params.row.billNo, params.row.billRangeStart, params.row.billRangeEnd);
                  }
                }
              }, params.row.billNo);
            }
          },
          {
            title: this.$t('m.i.billInfo.billRange'),
            key: 'billRange',
            hiddenCol: false,
            align: "center",
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
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.pickBillParams.dictMap, "DraftTypeCode", params.row.billType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          /*  {
              title: this.$t("m.i.billInfo.billClass"),
              key: "billClass",
              hiddenCol: false,
              render: (h, params) => {
                let dictValue = this.getDictValueFromMap(this.pickBillParams.dictMap, "CDMedia", params.row.billClass);
                return h("span", {
                  domProps: {
                    title: dictValue
                  }
                }, dictValue);
              }
            },*/
          {
            title: this.$t('m.i.billInfo.remitDt'),
            key: 'remitDt',
            hiddenCol: false,
            render: (h, params) => {
              return h('span', params.row.remitDt ? this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
            }
          },
          {
            title: this.$t("m.i.billInfo.dueDt"),
            key: "dueDt",
            hiddenCol: false,
            render: (h, params) => {
              return h("span", params.row.dueDt ? this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          },
          {
            title: this.$t("m.i.billInfo.billPackageMoney"),
            key: "billMoney",
            align: "right",
            hiddenCol: false,
            render: (h, params) => {
              return h('span', formatNumber(params.row.billMoney, 2, ','))
            }
          },
          /*  {
              title: this.$t("m.i.be.buyDt"),
              key: "transDt",
              hiddenCol: false,
              sortable: true,
              render: (h, params) => {
                return h("span", params.row.transDt ? this.$moment(params.row.transDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
              }
            },*/
          {
            title: this.$t("m.i.common.custName"),
            key: "oppName",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.common.custAcctNo"),
            key: "oppAcctNo",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.drwrName"),
            key: "drwrName",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.drwrAcctNo"),
            key: "drwrAcctNo",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.pyeeName"),
            key: "pyeeName",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.pyeeAcctNo"),
            key: "pyeeAcctNo",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.acptName"),
            key: "acptName",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.acptBankName"),
            key: "acptBankName",
            hiddenCol: false,
          },
        ],
        showBillInfoWin: false,
        billId: "",
        billNo: "",
        billRangeStart: '',
        billRangeEnd: '',
        chooseType: "",
        showBrchWin: false,
        showCustMessageWin : false,
        showCustAcctNoWin : false,
      };
    },
    props: {
      title: {
        type: String,
        default: "挑票页面"
      },
      pickBillWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      url: "",
      pickBillParams: {
        type: Object,
        default: {}
      }
    },
    computed: {
      tempPickBillWin: {
        get() {
          return this.pickBillWin;
        },
        set() {

        }
      }
    },
    watch: {
      pickBillWin(val) {
        if (val) {
          this.$nextTick(() => {
            this.pickBillInit();
            this.$refs.pickBillDatagrid.dataChange(1);
          });
        }
      }
    },
    methods: {
      onMaximize() {
        setTimeout(() => {
          this.$refs.pickBillDatagrid.$refs.gridContent.handleResize();
        }, 100);
      },
      showChange(val) {
        this.ifShowMore = val;
      },
      clearVal(value) {
        if (value === "creditBrchCode") {
          this.formItem.creditBrchCode = '';
        } else if (value == "discBankName") {
          this.formItem.discBrchCode = '';
          this.formItem.discBankName = '';
        }
      },
      closeBranch() {
        this.showBrchWin = false
      },
      showChooseBrchWin(value) {
        this.chooseType = value;
        this.showBrchWin = true
      },
      //根据弹框所选数据进行赋值
      brchCodeChange(info) {
        if (info === null) {
          this.$msgTip.info(this, {info: "请先选择记录！"});
          return;
        }
        if (this.chooseType === 'creditBrchCode') {
          this.formItem.creditBrchCode = info.brchCode;
        } else if (this.chooseType === 'discBankName') {
          this.formItem.discBrchCode = info.brchCode;
          this.formItem.discBankName = info.brchFullNameZh;
        }
        this.showBrchWin = false;
      },
      billInfoWinClose() {
        this.billId = null;
        this.billNo = null;
        this.billRangeStart = null;
        this.billRangeEnd = null;
        this.showBillInfoWin = false;
      },
      billInfoWinOpen(billId, billNo, billRangeStart, billRangeEnd) {
        this.billId = billId;
        this.billNo = billNo;
        this.billRangeStart = billRangeStart;
        this.billRangeEnd = billRangeEnd;
        this.showBillInfoWin = true;
      },
      pickBillClose() {
        this.$refs.pickBillDatagrid.selects = [];
        this.$refs.pickBillDatagrid.selectIds = [];
        this.resetSearch();
        this.$emit("pickBillWinClose", "");
      },
      pickBillInit() {
        this.formItem.batchId = this.pickBillParams.batchId;
        this.formItem.billType = this.pickBillParams.billType;
        this.formItem.billClass = this.pickBillParams.billClass;
        this.formItem.creditBranchClass = this.pickBillParams.creditBranchClass;
      },
      //表单查询
      handleSearch(pageNo) {
        this.$refs.pickBillDatagrid.selects = [];
        this.$refs.pickBillDatagrid.selectIds = [];
        this.$refs.pickBillDatagrid.dataChange(!!pageNo ? pageNo : 1);
      },
      //重置表单查询结果
      resetSearch() {
        this.buyDt = [];
        this.dueDt = [];
        this.formItem.minBuyDt = "";
        this.formItem.maxBuyDt = "";
        this.formItem.minDueDt = "";
        this.formItem.maxDueDt = "";
        this.formItem.discBankName = '';
        this.formItem.discBrchCode = '';
        this.formItem.custName = '';
        this.formItem.transFromName = '';
        this.formItem.oppAcctNo = '';
        this.formItem.custAcctNo = '';
        this.formItem.oppCustNo = '';
        this.$refs.formItem.resetFields();
        this.formItem.batchId = this.pickBillParams.batchId;
        this.formItem.billType = this.pickBillParams.billType;
        this.formItem.billClass = this.pickBillParams.billClass;
        this.formItem.creditBranchClass = this.pickBillParams.creditBranchClass;
      },
      handleDueDtChange(arr) {
        if (arr && arr.length >= 2) {
          this.formItem.minDueDt = arr[0].replace(/-/g, "");
          this.formItem.maxDueDt = arr[1].replace(/-/g, "");
          this.dueDt = [arr[0], arr[1]];
        } else {
          this.formItem.minDueDt = "";
          this.formItem.maxDueDt = "";
          this.dueDt = [];
        }
      },
      handleBuyDtChange(arr) {
        if (arr && arr.length >= 2) {
          this.formItem.minBuyDt = arr[0].replace(/-/g, "");
          this.formItem.maxBuyDt = arr[1].replace(/-/g, "");
          this.buyDt = [arr[0], arr[1]];
        } else {
          this.formItem.minBuyDt = "";
          this.formItem.maxBuyDt = "";
          this.buyDt = [];
        }
      },
      pickBillSubmit() {
        let list = this.$refs.pickBillDatagrid.selects;
        if (list.length === 0) {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseAtLeastOneRecord")});
          return;
        }
        let data = {ids: this.$refs.pickBillDatagrid.selectIds};
        this.$hMsgBox.confirm({
          title: "确认",
          content: "确定发起不得转让撤销申请吗？",
          onOk: () => {
            post(data, this.pickBillParams.url).then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode == "000000") {
                  this.$msgTip.success(this);
                  this.pickBillClose();
                  this.submitFlag = false;
                } else {
                  this.submitFlag = false;
                  this.$msgTip.error(this, {info: res.data.retMsg});
                  this.handleSearch();
                }
              } else {
                this.submitFlag = false;
                this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
                this.$msgTip.error(this, {info: res.data.retMsg});
                this.handleSearch();
              }
            });
          }
        });
      },
      //查询客户信息
      queryCustMessage(){
        this.showCustMessageWin = true;
      },
      //根据客户信息查询框所选数据进行赋值
      custCorpSelectSubmit(info) {
        this.formItem.oppAcctNo = "";
        this.formItem.transFromName = info.custName;
        this.formItem.custName = info.custName;
        this.formItem.oppCustNo = info.custNo;
        if(info.oppAcctNo !== ""){
          this.formItem.oppAcctNo = info.custAcctNo;
        }
        this.showCustMessageWin = false;
      },
      //客户信息查询框关闭
      custCorpWinClose() {
        this.showCustMessageWin = false;
      },
      //查询客户账号
      queryCustAcctNo() {
        if (this.formItem.oppCustNo === "") {
          this.$msgTip.info(this, { info: "请先选择客户" });
          return;
        }
        this.showCustAcctNoWin = true;
      },
      //根据客户账号查询框所选数据进行赋值
      custAcctNoSelectSubmit(info) {
        this.formItem.oppAcctNo = info.custAcctNo;
        this.formItem.custAcctNo = info.custAcctNo;
        this.showCustAcctNoWin = false;
      },
      //客户账号查询框关闭
      showCustAcctNoWinClose() {
        this.showCustAcctNoWin = false;
      },
    }
  };
</script>

<style scoped>

</style>
