<template>
  <!--电票赎回记账-->
  <div class="layout">
    <div v-if="discBackAccountBatchMain" key="1">
      <h-row name="flex" class="layout-menu-wrapper">
        <h-col span="24">
          <div>
            <!--查询表单-->
            <div class="h-form-search-box">
              <h-panel class="clearfix">
                <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                  <h-form-item :label="$t('m.i.common.custName')" prop="custName" >
                    <h-input v-model="formItem.custName" icon="android-search"
                             @on-click="queryCustMessage()" clearable @on-clear="clearVal('custName')" readonly></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.common.custAcctNo')" prop="custAcctNo" >
                    <h-input v-model="formItem.custAcctNo" icon="android-search"
                             @on-click="queryCustAcctNo()" clearable @on-clear="clearVal('custAcctNo')" readonly></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.ce.orgnlBatchNo')" prop="orgnlBatchNo">
                    <h-input v-model="formItem.orgnlBatchNo" placeholder=""></h-input>
                  </h-form-item>
                  <h-form-item class="h-form-operate">
                    <h-button type="primary" @click="handleSearch()">{{$t('m.i.common.search')}}</h-button>
                    <h-button type="ghost" @click="resetSearch()">{{$t('m.i.common.reset')}}</h-button>
                  </h-form-item>
                </h-form>
              </h-panel>
              <!-- 数据展示表格 -->
              <h-datagrid
                :columns="columns"
                highlightRow
                :bindForm="formItem"
                url="/ce/disc/elec/discBack/discBackAccountBatchMain/func_pageQueryDiscBackBatchList"
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
        </h-col>
      </h-row>
    </div>
    <div v-if="discBackAccountBillMain" key="2">
      <!--查询表单-->
      <div class="h-form-search-box">
        <h-panel class="clearfix">
          <h-form :model="billFormItem" :label-width="90" ref="billFormItem" cols="4" class="h-form-search">
            <h-form-item :label="$t('m.i.billInfo.billOrigin')" prop="billOrigin">
              <h-select v-model="billFormItem.billOrigin" placeholder="">
                <h-option v-for="item in billOriginList" :value="item.key" :key="item.key">{{item.value }}</h-option>
              </h-select>
            </h-form-item>
            <h-form-item :label="$t('m.i.billInfo.billPackageNo')" prop="billNo">
              <h-input v-model="billFormItem.billNo" placeholder=""></h-input>
            </h-form-item>
            <bill-range :formItem="billFormItem" :rangeProps="['billRangeStart','billRangeEnd']"></bill-range>
            <h-form-item class="h-form-operate">
              <h-button type="primary" @click="billManagerHandleSearch()">{{$t("m.i.common.search")}}</h-button>
              <h-button type="ghost" @click="billManagerResetSearch()">{{$t("m.i.common.reset")}}</h-button>
            </h-form-item>
          </h-form>
        </h-panel>
      </div>
    </div>
    <e-disc-back-info-detail :isQuery="isQuery" :is-show="discBackAccountBillMain"
                             :batchUrl="'/ce/disc/elec/discBack/discBackAccountBatchMain/func_queryDiscBackBatch'"
                             :batchId="this.batchId" funcNo="PICE021202" ref="eDiscBackInfoDetail"></e-disc-back-info-detail>
    <!-- 数据展示表格 -->
    <div v-if="discBackAccountBillMain" key="3">
      <h-datagrid
        :columns="billColumns"
        highlight-row
        :auto-load="true"
        :bindForm="billFormItem"
        url="/ce/disc/elec/discBack/discBackAccountBatchMain/func_pageQueryDiscBackBillList"
        :row-select="true"
        :has-select="hasSelect"
        ref="discBackAccountDatagrid">
        <div slot="toolbar">
          <h-dropdown placement="bottom-start" trigger="click" @on-click="accountList">
            <h-button type="primary">{{$t("m.i.ce.account")}}<h-icon name="unfold"></h-icon></h-button>
            <h-dropdown-menu slot="list"  >
              <h-dropdown-item name="select">{{$t("m.i.ce.selectAccount")}}</h-dropdown-item>
              <h-dropdown-item name="batch">{{$t("m.i.ce.batchAccount")}}</h-dropdown-item>
            </h-dropdown-menu>
          </h-dropdown>
          <h-button type="ghost" @click="returnBack()">{{$t("m.i.common.goBack")}}</h-button>
        </div>
      </h-datagrid>
    </div>
    <!-- 分录弹框 -->
    <acct-record :param="this.acctRecordParam" :url="this.acctRecordUrl" :submitFlag="this.acctSubmitFlag" :showPrintButton="this.showPrintButton"
                      :show-acct-record-win="this.showAcctRecordWin" @acctSubmitSure="acctSubmitSure" @showAcctRecordWinClose="showAcctRecordWinClose"
                      @printSuccessCallback="printSuccessCallback" ref="acctRecord"></acct-record>
    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billRangeEnd = "this.billRangeEnd" :billRangeStart = "this.billRangeStart"
                    :billId="this.billId"></bill-info-main>

  </div>
</template>

<script>
  import { post, on, off ,getDictListByGroups,getDictValueFromMap ,formatNumber,accMul,formatBillRange} from "@/api/bizApi/commonUtil";
  import {deepClone} from "@/utils/index";

  export default {
    name: "discBackAccountBatchMain",
    components: {
      EDiscBackInfoDetail:() => import(/* webpackChunkName: "ce/disc/common/eDiscBackInfoDetail" */`@/views/bizViews/ce/disc/common/eDiscBackInfoDetail`)
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
          title: this.$t("m.i.common.index"),
          type: "index",
          width: 60,
          key:"xuhao",
          align: "center"
        },
        {
          title: this.$t("m.i.common.batchNo"),
          key: "batchNo",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            return h('div', [
              h('a', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.batchNoMain(params.row.id)
                  }
                }
              }, params.row.batchNo)
            ]);
          }
        },
        {
          title: this.$t("m.i.common.custName"),
          key: "custName",
          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.custAcctNo"),
          key: "custAcctNo",
          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.billType"),
          key: "billType",
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = getDictValueFromMap(this.dictMap,"DraftTypeCode",params.row.billType);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          },
        },
        {
           title: this.$t("m.i.billInfo.discDt"),
          key: "discDt",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            if(params.row.discDt == null || params.row.discDt === ""){
              return "";
            }
            let discDt = this.$moment(params.row.discDt, "YYYYMMDD").format("YYYY-MM-DD");
            return h("span", discDt);
          }
        },
        {
          title: this.$t("m.i.billInfo.discInterestRate"),
          key: "ratePct",
          hiddenCol: false,
          sortable: true,
        },
        {
          title: this.$t("m.i.common.busiType"),
          key: "prodName",
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.ce.redeemOpenDt"),
          key: "redeemOpenDt",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            if(params.row.redeemOpenDt == null || params.row.redeemOpenDt === ""){
              return "";
            }
            let redeemOpenDt = this.$moment(params.row.redeemOpenDt, "YYYYMMDD").format("YYYY-MM-DD");
            return h("span", redeemOpenDt);
          }
        },
        {
          title: this.$t("m.i.ce.redeemDueDt"),
          key: "redeemDueDt",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            if(params.row.redeemDueDt == null || params.row.redeemDueDt === ""){
              return "";
            }
            let redeemDueDt = this.$moment(params.row.redeemDueDt, "YYYYMMDD").format("YYYY-MM-DD");
            return h("span", redeemDueDt);
          }
        },
        {
          title: this.$t("m.i.ce.actulRedeemDueDt"),
          key: "realRedeemDt",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            if(params.row.realRedeemDt == null || params.row.realRedeemDt === ""){
              return "";
            }
            let realRedeemDt = this.$moment(params.row.realRedeemDt, "YYYYMMDD").format("YYYY-MM-DD");
            return h("span", realRedeemDt);
          }
        },
        {
          title: this.$t("m.i.ce.redeemRate"),
          key: "redeemRatePct",
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.ce.clearMark"),
          key: "clearMark",
          hiddenCol: false,
          render:(h,params) => {
            return h("span",getDictValueFromMap(this.dictMap,"SettlementMarkCode",params.row.clearMark));
          }
        },
        {
          title: this.$t("m.i.ce.totalCount"),
          key: "sumCount",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.ce.totalAmt"),
          key: "sumMoney",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            let sumMoney = formatNumber(params.row.sumMoney, 2, ',');
            return h("span", {
              domProps: {
                title: sumMoney
              }
            }, sumMoney);
          }
        },
        {
          title: this.$t("m.i.ce.totalPayInterest"),
          key: "totalInterest",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let totalInterest = formatNumber(params.row.totalInterest, 2, ',');
            return h("span", {
              domProps: {
                title: totalInterest
              }
            }, totalInterest);
          }
        },
        {
          title: this.$t("m.i.ce.totalSaleReceiveAmt"),
          key: "totalSaleReceiveAmt",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let totalSaleReceiveAmt = formatNumber(params.row.totalSaleReceiveAmt, 2, ',');
            return h("span", {
              domProps: {
                title: totalSaleReceiveAmt
              }
            }, totalSaleReceiveAmt);
          }
        },
        {
          title: this.$t("m.i.ce.orgnlBatchNo"),
          key: "orgnlBatchNo",
          hiddenCol: false
        },
        {
            title: this.$t("m.i.common.corpScale"),
          key: "corpScale",
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = getDictValueFromMap(this.dictMap,"CorpScale",params.row.corpScale);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          },
        },
        {
           title: this.$t("m.i.common.isGreenCorp"),
          key: "isGreenCorp",
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = getDictValueFromMap(this.dictMap,"Yon",params.row.isGreenCorp);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          },
        },
      ];
      let billColumns = [
        {
          type: "selection",
          width: 60,
          align: "center",
          key:"duoxuan",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.index"),
          type: "index",
          width: 60,
          key:"xuhao",
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
          sortable: true,
          hiddenCol: false,
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
          title: this.$t("m.i.billInfo.billType"),
          key: "billType",
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = getDictValueFromMap(this.dictMap,"DraftTypeCode",params.row.billType);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          },
        },
        {
          title: this.$t("m.i.billInfo.drwrName"),
          key: "drwrName",
          sortable: true,
          hiddenCol: false
        },
        {
           title: this.$t("m.i.billInfo.acptName"),
          key: "acptName",
          sortable: true,
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
            let remitDt = this.$moment(params.row.remitDt, "YYYYMMDD").format("YYYY-MM-DD");
            return h("span", remitDt);
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
            let dueDt = this.$moment(params.row.dueDt, "YYYYMMDD").format("YYYY-MM-DD");
            return h("span", dueDt);
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
          title: this.$t("m.i.ce.interestDueDt"),
          key: "galeDt",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            if(params.row.galeDt == null || params.row.galeDt === ""){
              return "";
            }
            let galeDt = this.$moment(params.row.galeDt, "YYYYMMDD").format("YYYY-MM-DD");
            return h("span", galeDt);
          }
        },
        {
          title: this.$t("m.i.ce.interestCalDays"),
          key: "interestCalDays",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.ce.delayDays"),
          key: "delayDays",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.ce.orgnlInterest"),
          key: "orgnlInterest",
          hiddenCol: false,
          render: (h, params) => {
            let orgnlInterest = formatNumber(params.row.orgnlInterest, 2, ',');
            return h("span", {
              domProps: {
                title: orgnlInterest
              }
            }, orgnlInterest);
          }
        },
        {
          title: this.$t("m.i.ce.payInterest"),
          key: "interest",
          hiddenCol: false,
          render: (h, params) => {
            let interest = formatNumber(params.row.interest, 2, ',');
            return h("span", {
              domProps: {
                title: interest
              }
            }, interest);
          }
        },
        {
          title: this.$t("m.i.ce.saleReceiveAmt"),
          key: "saleReceiveAmt",
          hiddenCol: false,
          render: (h, params) => {
            let saleReceiveAmt = formatNumber(params.row.saleReceiveAmt, 2, ',');
            return h("span", {
              domProps: {
                title: saleReceiveAmt
              }
            }, saleReceiveAmt);
          }
        },
      ];
      return {
        showPrintButton : false,
        acctSubmitFlag : false,
        formItem : {
          custName: "",
          custAcctNo: "",
          custNo:"",
          orgnlBatchNo:"",
          isCommit:"noCommit",
          billClass:"ME02",
          funcNo:"PICE021202",
        },
        columns : columns,
        billColumns : billColumns,
        billFormItem : {
          billNo:"",
          batchId:"",
          billRangeStart:"",
          billRangeEnd:"",
          billOrigin:"",
          funcNo:"PICE021202",
        },
        dictMap : new Map(),
        billOriginList : [],
        showCustMessageWin : false,
        showCustAcctNoWin : false,
        discBackAccountBatchMain : true,
        discBackAccountBillMain : false,
        currentSelectList : [],
        currentSelectRowInx : [],
        currentBillSelectList : [],
        currentBillSelectRowInx : [],
        isQuery : false,
        batchId : "",
        //分录
        acctRecordUrl : "",
        acctRecordParam : {},
        showAcctRecordWin : false,
        discBackAcctIds : "",
        //票面信息页面
        showBillInfoWin : false,
        billId : "",
        billRangeStart:"",
        billRangeEnd:"",
        hasSelect : false,
        temp:this.deepClone(columns),
        billTemp:this.deepClone(billColumns),
      };
    },
    created(){
      this.getProductList();
    },
    mounted() {
      getDictListByGroups("Yon,SettlementMarkCode,SettleType,DraftTypeCode,CorpScale,RateType,BillOrigin").then(res => {
        this.rateTypeList = res.get("RateType");
        this.billOriginList = res.get("BillOrigin");
        let dictList = [];
        let settlementMarkCodeList = res.get("SettlementMarkCode");
        let settleTypeList =res.get("SettleType");
        for (let i = 0; i < settlementMarkCodeList.length+settleTypeList.length; i++) {
          if(i< settlementMarkCodeList.length){
            dictList[i]=settlementMarkCodeList[i];
          }
          if(settlementMarkCodeList.length<=i){
            let obj = settleTypeList[i-settlementMarkCodeList.length];
            obj.dictGroupCode="SettlementMarkCode";
            res.get("map").get(obj.dictGroupCode).set(obj.key,obj.value);
            dictList[i]= obj;
          }
        }
        res.set("SettlementMarkCode",dictList);
        this.clearMarkList = res.get("SettlementMarkCode");
        this.dictMap = res.get("map");
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
        this.currentSelectList = [];
        this.$refs.datagrid.dataChange(1);
      },
      //重置查询结果
      resetSearch() {
        this.formItem.custNo = '';
        this.formItem.custName = '';
        this.formItem.custAcctNo = '';
        this.formItem.orgnlBatchNo = '';
        this.billFormItem.billOrigin = '';
        this.billFormItem.billNo = '';
        this.billFormItem.billRangeStart = '';
        this.billFormItem.billRangeEnd = '';
      },
      // 行选中
      handleSelectClick(arr, selectInx) {
        this.currentSelectList = arr;
        this.currentSelectRowInx = selectInx;
      },
      handleSelectClickCancel() {
        this.currentSelectList = [];
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
        if(this.formItem.custNo === "") {
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
      //票据管理界面查询
      billManagerHandleSearch() {
        this.currentBillSelectList = [];
        this.$nextTick(() => {
          this.hasSelect = false;
          this.$refs.discBackAccountDatagrid.selects = [];
          this.$refs.discBackAccountDatagrid.selectIds = [];
          this.$refs.discBackAccountDatagrid.dataChange(1);
        });
      },
      //票据管理界面重置
      billManagerResetSearch() {
        this.$refs.billFormItem.resetFields();
      },
      //票据管理界面行选中
      discBackAccountHandleSelectClick(arr, selectInx) {
        this.currentBillSelectList = arr;
        this.currentBillSelectRowInx = selectInx;
      },
      //票据管理
      handleForm() {
        if (this.currentSelectList.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        if (this.currentSelectList.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return;
        }
        this.discBackAccountBatchMain = false;
        this.billFormItem.batchId = this.currentSelectList.id;
        this.batchId = this.currentSelectList.id;
        this.isQuery = true;
        this.discBackAccountBillMain = true;
        this.$nextTick(() => {
          this.billColumns = deepClone(this.billTemp);
          this.$refs.discBackAccountDatagrid.selfAdaption();
          this.$refs.discBackAccountDatagrid.createShowCol(this.billTemp);
        });
      },
      //记账按钮下拉选择“选择记账/批次记账”
      accountList(str){
        this.acctType = str;
        if(str === "select"){
          this.accountSelect();
        }
        if(str === "batch"){
          this.accountBatch();
        }
      },
      //选择记账
      accountSelect(){
        if(this.$refs.discBackAccountDatagrid.selects .length === 0){
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
          return;
        }
        this.discBackAcctIds = this.$refs.discBackAccountDatagrid.selectIds.join(",");
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定选择记账吗?",
          onOk: () => {
            this.getEntryInfo("select");
          }
        });
      },
      //批次记账
      accountBatch() {
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定批次记账吗？",
          onOk: () => {
            this.getEntryInfo("batch");
          }
        });
      },
      //获取分录信息
      getEntryInfo(str) {
        this.acctRecordUrl = "/ce/disc/elec/discBack/discBackAccountBatchMain/func_gcreateDiscBackAccRecord";
        if(str === "batch") {
          this.acctRecordParam = {batchId: this.batchId, operType: "1" ,funcNo: "PICE021202"}
        }else if(str === "select") {
          this.acctRecordParam = {batchId: this.batchId, operType: "0", discIds: this.discBackAcctIds ,funcNo: "PICE021202"}
        }
        this.showAcctRecordWin = true;
      },
      //关闭分录弹窗
      showAcctRecordWinClose() {
        this.acctRecordParam = {};
        this.acctRecordUrl = "";
        this.showPrintButton = false;
        this.showAcctRecordWin = false;
        this.currentBillSelectList = [];
        this.$refs.discBackAccountDatagrid.selects = [];
        this.$refs.discBackAccountDatagrid.selectIds = [];
        this.$refs.eDiscBackInfoDetail.getBatchInfo();
        this.$refs.discBackAccountDatagrid.dataChange(1,(data)=>{
          if(data.length === 0) {
            this.returnBack();
          }
        })
      },
      //打印成功回调
      printSuccessCallback() {
        this.showAcctRecordWinClose();
      },
      //确定记账
      acctSubmitSure(info) {
        let param = {};
        if(this.acctType === "batch") {
          param = {batchId: this.batchId, operType: "1", funcNo: "PICE021202"};
        }else if (this.acctType === "select") {
          param = {batchId: this.batchId, operType: "0", discIds: this.discBackAcctIds, funcNo: "PICE021202"};
        }
        this.acctSubmitFlag = true;
        post(param, "/ce/disc/elec/discBack/discBackAccountBatchMain/func_submmitDiscBackAccount").then(res => {
          this.acctSubmitFlag = false;
          if(res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.showPrintButton = true;
              if(!info.isHasPrint) {
                this.showAcctRecordWinClose();
              }
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      },
      //返回
      returnBack() {
        this.currentSelectList = [];
        this.currentBillSelectList = [];
        this.$refs.discBackAccountDatagrid.selects = [];
        this.$refs.discBackAccountDatagrid.selectIds = [];
        this.batchId = "";
        this.resetSearch();
        this.isQuery = false;
        this.discBackAccountBillMain = false;
        this.discBackAccountBatchMain = true;
        this.billManagerResetSearch();
        this.$nextTick(() => {
          this.columns = deepClone(this.temp);
          this.$refs.datagrid.createShowCol(this.temp);
          this.$refs.datagrid.selfAdaption();
        });
      },
      //批次编号超链接
      batchNoMain(str) {
        this.batchId = str;
        this.billFormItem.batchId = this.batchId;
        this.isQuery = true;
        this.discBackAccountBatchMain = false;
        this.discBackAccountBillMain = true;
        this.$nextTick(() => {
          this.billColumns = deepClone(this.billTemp);
          this.$refs.discBackAccountDatagrid.selfAdaption();
          this.$refs.discBackAccountDatagrid.createShowCol(this.billTemp);
        });
        this.billManagerHandleSearch();
      },
      billInfoWinClose(){
        this.showBillInfoWin = false;
      },
      //票面信息
      showBillInfo(row) {
        this.billId = row.billId;
        this.billRangeStart=row.billRangeStart;
        this.billRangeEnd=row.billRangeEnd;
        this.showBillInfoWin = true;
      },
    }
  };
</script>

<style scoped>

</style>
