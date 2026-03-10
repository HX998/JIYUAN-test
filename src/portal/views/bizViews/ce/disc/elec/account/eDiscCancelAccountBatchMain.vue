<template>
  <!--电票贴现撤销记账-->
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div v-if="eDiscCancelAccountBatchMain" key="1">
          <div>
            <!--查询表单-->
            <div class="h-form-search-box">
              <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
                <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                  <h-form-item :label="$t('m.i.common.custName')" prop="custName" >
                    <h-input v-model="formItem.custName" icon="android-search"
                             @on-click="queryCustMessage()" clearable @on-clear="clearVal('custName')"></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.common.custAcctNo')" prop="custAcctNo" >
                    <h-input v-model="formItem.custAcctNo" icon="android-search"
                             @on-click="queryCustAcctNo()" clearable @on-clear="clearVal('custAcctNo')" readonly></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.common.batchNo')" prop="batchNo">
                    <h-input v-model="formItem.batchNo" placeholder=""></h-input>
                  </h-form-item>
                  <h-form-item class="h-form-operate">
                    <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                    <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
                  </h-form-item>
                </h-form>
              </h-panel>
              <!-- 数据展示表格 -->
              <h-datagrid
                :columns="columns"
                highlight-row
                :bindForm="formItem"
                url=""
                :on-current-change="handleSelectClick"
                :on-current-change-cancel="handleSelectClickCancel"
                ref="datagrid">
                <div slot="toolbar" class="pull-left">
                  <h-button type="primary" @click="handleForm()">{{$t("m.i.ce.billManage")}}</h-button>
                </div>
              </h-datagrid>
              <!-- 查询客户信息弹窗 -->
              <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose" @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>
              <!-- 查询客户账号信息弹窗 -->
              <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" :cust-no="this.formItem.custNo" :isAllBankAcct=true
                                 @showCustAcctNoWinClose="showCustAcctNoWinClose" @custAcctNoSelectSubmit="custAcctNoSelectSubmit"></show-cust-acct-no>
            </div>
          </div>
        </div>
        <e-disc-batch-info-detail :is-show="discAccountBillMain" :batchId="this.discBatchId"
                                  :isQuery="isQuery" funcNo=""></e-disc-batch-info-detail>
        <div v-if="eDiscCancelAccountBillMain" key="3">
          <!--查询表单-->
          <h-datagrid
            :columns="billManageColumns"
            highlight-row
            :bindForm="billManageFormItem"
            url=""
            :row-select="true"
            :has-select="hasSelect"
            ref="discCancelAccountBillDatagrid">
            <div slot="toolbar">
              <h-dropdown placement="bottom-start" trigger="click" @on-click="cancelAccountList">
                <h-button type="primary">{{$t('m.i.ce.cancelAccount')}}<h-icon name="unfold"></h-icon></h-button>
                <h-dropdown-menu slot="list"  >
                  <h-dropdown-item name="select">{{$t('m.i.ce.selectCancelAccount')}}</h-dropdown-item>
                  <h-dropdown-item name="batch">{{$t('m.i.ce.batchCancelAccount')}}</h-dropdown-item>
                </h-dropdown-menu>
              </h-dropdown>
              <!--<h-button type="primary" @click="cancelAccountBatch()">撤销记账</h-button>-->
              <h-button type="primary" @click="accountBillDetail()">{{$t('m.i.ce.detailBill')}}</h-button>
              <h-button type="ghost" @click="returnBack()">{{$t("m.i.common.goBack")}}</h-button>
            </div>
          </h-datagrid>
          <!--显示票据明细界面-->
          <h-msg-box v-model="billDetailSearchWin" width="800"  class="h-form-table-layer">
            <p slot="header">
              <span>{{$t('m.i.ce.detailBill')}}</span>
            </p>
            <h-row>
              <h-col span="24">
                <h-datagrid
                  :columns="billDetailColumns"
                  highlight-row
                  ref="legalNoDatagrid">
                </h-datagrid>
              </h-col>
            </h-row>
            <!-- 弹出框模式底部按钮 -->
            <div slot="footer">
              <h-button type="ghost" @click="billDetailClose">{{$t("m.i.common.close")}}</h-button>

            </div>
          </h-msg-box>
        </div>
        <!--票面信息-->
        <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"
                        :billRangeEnd = "this.billRangeEnd" :billRangeStart = "this.billRangeStart"></bill-info-main>
      </h-col>
    </h-row>
  </div>
</template>

<script>
  import { post, on, off ,getDictListByGroups,formatNumber, getDictValueFromMap,getSingleParamValuesByKeys,accMul,formatBillRange} from "@/api/bizApi/commonUtil";
  import {deepClone} from "@/utils/index";

  export default {
    name: "eDiscCancelAccountBatchMain",
    components: {
      // EDiscBatchInfoDetail:() => import(/* webpackChunkName: "ce/disc/common/eDiscBatchInfoDetail" */`@/views/bizViews/ce/disc/common/eDiscBatchInfoDetail`)
    },
    data() {
      let columns = [
        {
          title: ' ',
          type: 'radio',
          align: 'center',
          width : 50
        },
        {
          type: "selection",
          width: 60,
          align: "center",
          hiddenCol: true
        },
        {
          title: this.$t("m.i.common.index"),
          type: "index",
          width: 60,
          align: "center"
        },
        {
          title: this.$t("m.i.common.batchNo"),
          key: "batchNo",
          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.custName"),
          key: "drwrName",
          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.custAcctNo"),
          key: "drwrAcctNo",
          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.billType"),
          key: "billType",
          hiddenCol: false
        },
        {
           title: this.$t("m.i.billInfo.discDt"),
          key: "discDt",
          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.discInterestRate"),
          key: "dsctRt",
          hiddenCol: false,
          sortable: true,
        },
        {
          title: this.$t("m.i.ce.totalCount"),
          key: "totalNum",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.ce.totalAmt"),
          key: "totalAmt",
          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.busiType"),
          key: "busiType",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.ce.interestMethod"),
          key: "payType",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.ce.salerCustName"),
          key: "salePayName",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.ce.salerAcctNo"),
          key: "salePayNo",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.ce.buyPayPcetByUnit"),
          key: "buyPayDealPcet",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.ce.buyerPayInterName"),
          key: "buyPayName",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.ce.buyerPayInterAcctNo"),
          key: "buyPayNo",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.ce.thirdPayPcet"),
          key: "thirdPayPcet",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.ce.thirdCustName"),
          key: "thirdPayName",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.ce.thirdAcctNo"),
          key: "thirdPayNo",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.transCtrctNo"),
          key: "ctrctNb",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.ce.busiBrchName"),
          key: "busiBrchName",
          hiddenCol: false
        },
        {
            title: this.$t("m.i.common.corpScale"),
          key: "corpScale",
          hiddenCol: false
        },
        {
           title: this.$t("m.i.common.isGreenCorp"),
          key: "grnFlag",
          hiddenCol: false
        },
      ];
      let billManageColumns = [
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
          title: this.$t("m.i.common.foreFlowNo"),
          key: "orgForeFlowNo",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.backFlowNo"),
          key: "backFlowNo",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.transNametransName"),
          key: "transName",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.ce.sendAcctBrchName"),
          key: "sendAcctBrchName",
          hiddenCol: false
        },
        {
         title: this.$t("m.i.ce.sendAcctUserName"),
          key: "sendAcctUserName",
          hiddenCol: false
        },
        {
         title: this.$t("m.i.ce.acctBrchNo"),
          key: "acctBrchName",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.acctTellerNo"),
          key: "acctUserName",
          hiddenCol: false
        },
        {
         title: this.$t("m.i.common.acctDt"),
          key: "transDt",
          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.transTm"),
          key: "transTm",
          sortable: true,
          hiddenCol: false
        },
      ];
      return {
        formItem : {
          custName: "",
          custAcctNo: "",
          custNo:"",
          batchNo:""
        },
        billManageFormItem : {
          billNo:""
        },
        columns: columns,
        billManageColumns : billManageColumns,
        billDetailColumns : [
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: this.$t("m.i.billInfo.billOrigin"),
            align:'center',
            hiddenCol: false,
            render:(h,params) => {
              let dictValue = getDictValueFromMap(this.dictMap,"BillOrigin",params.row.billOrigin);
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
            width: 250,
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
            align:'center',
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
            title: this.$t("m.i.billInfo.billPackageMoney"),
            key: "billMoney",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let billMoney = formatNumber(params.row.billMoney, 2, ',');
              return h("span", {
                domProps: {
                  title: billMoney
                }
              }, billMoney);
            }
          },
          {
            title: this.$t("m.i.billInfo.flowStatus"),
            key: "flowStatusName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.discInterestRate"),
            key: "rate",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if(params.row.rate != null && params.row.rate !== ""){
                let rate = accMul(params.row.rate, 100) + "(%)";
                return h("span", rate);
              }
            }
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",
            hiddenCol: false,
            render:(h,params) => {
              let dictValue = getDictValueFromMap(this.dictMap,"DraftTypeCode",params.row.billType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.billInfo.drwrName"),
            key: "drwrName",
            hiddenCol: false,
          },
          {
             title: this.$t("m.i.billInfo.acptName"),
            key: "acptName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.remitDt"),
            key: "remitDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              if(params.row.remitDt == null || params.row.remitDt === ""){
                return "";
              }
              let date = this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.billInfo.dueDt"),
            key: "dueDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              if(params.row.dueDt == null || params.row.dueDt === ""){
                return "";
              }
              let date = this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.ce.isOwnBankAcpt"),
            key: "isAcpt",
            hiddenCol: false,
            render:(h,params) => {
              if (params.row.isAcpt == null || params.row.isAcpt === ""){
                return "";
              }
              if (params.row.isAcpt === '1') {
                return h("span", "是");
              } else {
                return h("span", "否");
              }
            }
          },
          {
            title: this.$t("m.i.be.assetIndustry"),
            key: "busiClassify",
            hiddenCol: window.sessionStorage.getItem("isOpenI9")=="1"?false:true,
            render:(h,params) => {
              let dictValue = getDictValueFromMap(this.dictMap,"AssetIndustry",params.row.busiClassify);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.ce.interestDueDt"),
            key: "galeDt",
            hiddenCol: false,
            render: (h, params) => {
              if(params.row.galeDt == null || params.row.galeDt === ""){
                return "";
              }
              let date = this.$moment(params.row.galeDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.ce.interestCalDays"),
            key: "interestCalDays",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.ce.delayDays"),
            key: "delayDays",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.ce.buyerInterest"),
            key: "buyerInterest",
            hiddenCol: false,
            render: (h, params) => {
              let buyerInterest = formatNumber(params.row.buyerInterest, 2, ',');
              return h("span", {
                domProps: {
                  title: buyerInterest
                }
              }, buyerInterest);
            }
          },
          {
            title: this.$t("m.i.ce.salerInterest"),
            key: "salerInterest",
            hiddenCol: false,
            render: (h, params) => {
              let salerInterest = formatNumber(params.row.salerInterest, 2, ',');
              return h("span", {
                domProps: {
                  title: salerInterest
                }
              }, salerInterest);
            }
          },
          {
            title: this.$t("m.i.ce.thirdInterest"),
            key: "thirdInterest",
            hiddenCol: false,
            render: (h, params) => {
              let thirdInterest = formatNumber(params.row.thirdInterest, 2, ',');
              return h("span", {
                domProps: {
                  title: thirdInterest
                }
              }, thirdInterest);
            }
          },
          {
            title: this.$t("m.i.ce.realPayAmt"),
            key: "realPayAmt",
            hiddenCol: false,
            render: (h, params) => {
              let realPayAmt = formatNumber(params.row.realPayAmt, 2, ',');
              return h("span", {
                domProps: {
                  title: realPayAmt
                }
              }, realPayAmt);
            }
          },
          {
            title: this.$t("m.i.ce.bankPayAmt"),
            key: "payAmt",
            hiddenCol: false,
            render: (h, params) => {
              let payAmt = formatNumber(params.row.payAmt, 2, ',');
              return h("span", {
                domProps: {
                  title: payAmt
                }
              }, payAmt);
            }
          },
          {
            title: this.$t("m.i.ce.buyerCustName"),
            key: "buyerCustName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.innerRate"),
            key: "innerRate",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.innerInterest"),
            key: "innerInterest",
            hiddenCol: false
          },
        ],
        eDiscCancelAccountBatchMain : true,
        eDiscCancelAccountBillMain : false,
        billDetailSearchWin : false,
        showCustAcctNoWin : false,
        showCustMessageWin : false,
        ifShowMore : false,
        currentSelectList : [],
        currentSelectRowInx : [],
        currentBillSelectList : [],
        currentBillSelectRowInx : [],
        acctAuthMode : false,
        //票面信息页面
        showBillInfoWin : false,
        billId : "",
        billRangeStart:"",
        billRangeEnd:"",
        hasSelect : false,
        temp:this.deepClone(columns),
        billTemp:this.deepClone(billManageColumns),
      }
    },
    mounted() {
      getDictListByGroups("QueryType,ArbitrateMode,ProtectType,RateType,PayType,DraftTypeCode,CorpScale,Yon,AssetIndustry,BillOrigin").then(res => {
        this.isList = res.get("Yon");
        this.billOriginList = res.get("BillOrigin");
        this.dictMap = res.get("map");
      });
      post({ code: "04" }, "pc/acct/authorize/judgeAcctAuthorizeBusi").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.acctAuthMode = res.data.retData;
          } else {
            this.$msgTip.error(this, { info: res.data.retMsg });
          }
        } else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });
    },
    methods: {
      //搜索选择框清空事件
      clearVal(optType){
        if(optType === "custName"){
          this.formItem.custName = "";
          this.formItem.custNo = "";
        }
        if(optType === "custAcctNo"){
          this.formItem.custAcctNo = "";
        }
      },
      //查询
      handleSearch() {
        this.$refs.datagrid.dataChange(1);
      },
      //重置查询结果
      resetSearch() {
        this.formItem.custNo = '';
        this.formItem.custName = '';
        this.formItem.custAcctNo = '';
        this.formItem.batchNo = '';
      },
      // 行选中
      handleSelectClick(arr, selectInx) {
        this.currentSelectList = arr;
        this.currentSelectRowInx = selectInx;
      },
      handleSelectClickCancel() {
        this.currentSelectList = [];
      },
      //票据管理界面查询
      billManagerHandleSearch(){
        this.$nextTick(() => {
          this.hasSelect = false;
          this.$refs.discCancelAccountBillDatagrid.selects = [];
          this.$refs.discCancelAccountBillDatagrid.selectIds = [];
          this.$refs.discCancelAccountBillDatagrid.dataChange(1);
        })
      },
      //查询客户信息
      queryCustMessage() {
        this.showCustMessageWin = true;
      },
      //根据客户信息查询框所选数据进行赋值
      custCorpSelectSubmit(info) {
        this.formItem.custAcctNo = "";
        this.formItem.custName = info.custName;
        this.formItem.custNo = info.custNo;
        if(info.custAcctNo !== ""){
          this.formItem.custAcctNo = info.custAcctNo;
        }
        this.showCustMessageWin = false;
      },
      //客户信息查询框关闭
      custCorpWinClose() {
        this.showCustMessageWin = false;
      },
      //查询客户账号
      queryCustAcctNo() {
        if (this.formItem.custNo === "") {
          this.$msgTip.info(this, { info: "请先选择客户" });
          return;
        }
        this.showCustAcctNoWin = true;
      },
      //根据客户账号查询框所选数据进行赋值
      custAcctNoSelectSubmit(info) {
        this.formItem.custAcctNo = info.custAcctNo;
        this.showCustAcctNoWin = false;
      },
      //客户账号查询框关闭
      showCustAcctNoWinClose() {
        this.showCustAcctNoWin = false;
      },
      //票据管理
      handleForm() {
        if (this.currentSelectList.length > 1) {
          this.$msgTip.info(this,{info:this.$t("m.i.common.onlyChooseOneData")});
          return;
        }
        if (this.currentSelectList.length === 0) {
          this.$msgTip.info(this,{info:this.$t("m.i.common.chooseDataFirst")});
          return;
        }
        this.eDiscCancelAccountBatchMain = false;
        this.discBatchId = this.currentSelectList.id;
        this.billFormItem.batchId = this.currentSelectList.id;
        this.isQuery = true;
        this.eDiscCancelAccountBillMain = true;
        this.billManagerHandleSearch();
        this.$nextTick(() => {
          this.billManageColumns = deepClone(this.billTemp);
          this.$refs.discCancelAccountBillDatagrid.createShowCol(this.billTemp);
          this.$refs.discCancelAccountBillDatagrid.selfAdaption();
        });
      },
      //返回
      returnBack() {
        this.resetSearch();
        this.eDiscCancelAccountBillMain = false;
        this.eDiscCancelAccountBatchMain = true;
        this.$nextTick(() => {
          this.columns = deepClone(this.temp);
          this.$refs.datagrid.createShowCol(this.temp);
          this.$refs.datagrid.selfAdaption();
        });
      },
      //撤销记账按钮下拉选择“选择撤销记账/批次撤销记账”
      cancelAccountList(str){
        if (this.acctAuthMode) {
          if(str === "batch") {
            this.batchAcctAuthorize();
          }
          if(str === "select") {
            this.selectAcctAuthorize();
          }
        }else{
          if(str === "select"){
            this.cancelAccountSelect();
          }
          if(str === "batch"){
            this.cancelAccountBatch();
          }
        }
      },
      //选择撤销记账
      cancelAccountSelect(){
        if(this.$refs.discCancelAccountBillDatagrid.selects.length === 0){
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
          return;
        }
        let ids = this.$refs.discCancelAccountBillDatagrid.selectIds.join(",");
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定选择撤销账吗?",
          onOk: () => {
            post({ids:ids}, "").then(res => {
              if(res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.$refs.discCancelAccountBillDatagrid.dataChange(this.$refs.discCancelAccountBillDatagrid.pageInfo.pageNo);
                  this.currentBillSelectList = [];
                } else {
                  this.$msgTip.error(this, { info: msg });
                  this.$refs.discCancelAccountBillDatagrid.dataChange(this.$refs.discCancelAccountBillDatagrid.pageInfo.pageNo);
                }
              }
            }).catch(error => {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
            });
          }
        });
      },
      //批次撤销记账
      cancelAccountBatch() {
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定批次撤销记账吗？",
          onOk: () => {
            this.handleAccountBatch();
          }
        });
      },
      handleAccountBatch() {
        let batchId = "";
        post({ batchId: batchId }, "").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this,{info:msg});
              this.$refs.discCancelAccountBillDatagrid.dataChange(this.$refs.discCancelAccountBillDatagrid.pageInfo.pageNo);
              this.currentBillSelectList = [];
            } else {
              this.$msgTip.error(this,{info:res.data.retMsg});
              this.$refs.discCancelAccountBillDatagrid.dataChange(this.$refs.discCancelAccountBillDatagrid.pageInfo.pageNo);
            }
          } else {
            this.$msgTip.error(this,{info:this.$t('m.i.common.netError')});
          }
        });
      },
      //票据明细界面
      accountBillDetail() {
        if (this.$refs.discCancelAccountBillDatagrid.selects.length > 1) {
          this.$msgTip.info(this,{info:this.$t("m.i.common.onlyChooseOneData")});
          return;
        }
        if (this.$refs.discCancelAccountBillDatagrid.selects.length === 0) {
          this.$msgTip.info(this,{info:this.$t("m.i.common.chooseOneData")});
          return;
        }
        this.billDetailSearchWin = true ;
      },
      //票据明细关闭按钮
      billDetailClose(){
        this.billDetailSearchWin = false ;
      },
      //票面信息关闭
      billInfoWinClose(){
        this.showBillInfoWin = false;
      },
      //票面信息
      showBillInfo(billId,billNo){
        this.billId = billId;
        this.showBillInfoWin = true;
      },
      //批次提交到记账授权
      batchAcctAuthorize(){
        let param = {};
        param = {batchId: this.batchId, operType: "1", funcNo: "PICE021307",acctType:"2"};
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定批次提交记账授权吗?",
          onOk: () => {
            this.$loadingbox.open({
              title: "记账授权中，请稍后..."
            });
            post(param, "/ce/disc/elec/account/eDiscAccountBatchMain/func_submitAcctAuthorize").then(res => {
              if(res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$loadingbox.close();
                  this.$msgTip.success(this);
                  this.returnMain();
                } else {
                  this.$msgTip.error(this, { info: msg });
                }
              }
            }).catch(error => {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
            });
          }
        });
      },
      //明细提交到记账授权
      selectAcctAuthorize(){
        let param = {};
        let list = this.$refs.discCancelAccountBillDatagrid.selects;
        if(list.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        let ids = this.$refs.discCancelAccountBillDatagrid.selectIds.join(",");
        param = {batchId: this.batchId, operType: "0", discIds: ids, funcNo: "PICE021307",acctType:"2"};
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定明细记账授权吗?",
          onOk: () => {
            this.$loadingbox.open({
              title: "记账授权中，请稍后..."
            });
            post(param, "/ce/disc/elec/account/eDiscAccountBatchMain/func_submitAcctAuthorize").then(res => {
              if(res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$loadingbox.close();
                  this.$msgTip.success(this);
                  if(this.$refs.discCancelAccountBillDatagrid.total === this.$refs.discCancelAccountBillDatagrid.selects.length) {
                    this.returnMain();
                  }else {
                    this.$refs.acptBatchInfoDetail.getBatchInfo();
                    this.$refs.discCancelAccountBillDatagrid.dataChange(this.$refs.discCancelAccountBillDatagrid.$refs.gridPage.currentPage);
                    this.$refs.discCancelAccountBillDatagrid.selects = [];
                  }
                } else {
                  this.$msgTip.error(this, { info: msg });
                }
              }
            }).catch(error => {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
            });
          }
        });
      },
    }
  };
</script>

<style scoped>

</style>
