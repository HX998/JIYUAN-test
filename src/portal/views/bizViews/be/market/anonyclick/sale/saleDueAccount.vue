<!--付款确认申请-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="saleAccountQueryItem" :label-width="90" ref="saleAccountQueryItem" cols="4" class="h-form-search">
                <!--<h-form-item :label="$t('m.i.common.ownedBrchNo')" prop="ownedBrchNos" v-if="this.licenseFlag">
                  <h-input v-model="saleAccountQueryItem.ownedBrchNames" icon="android-search" @on-click="brchNoWinOpen"
                           readonly clearable @on-clear="clearVal1('license')" :title="saleAccountQueryItem.ownedBrchNames" ></h-input>
                </h-form-item>-->
                <h-form-item :label="$t('m.i.common.batchNo')" prop="batchNo">
                  <h-input v-model="saleAccountQueryItem.batchNo" ></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.be.quoteNo')" prop="quoteNo">
                  <h-input v-model="saleAccountQueryItem.quoteNo" ></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.be.dealNo')" prop="dealNo">
                  <h-input v-model="saleAccountQueryItem.dealNo"></h-input>
                </h-form-item>
                <!--<h-form-item :label="$t('m.i.be.otherBrchName')" prop="buyBrchName">
                  <h-input @on-click="showbrch = true" v-model="saleAccountQueryItem.buyBrchName"  icon="search" readonly
                           clearable @on-clear="clearVal('buyBrchName')">
                  </h-input>
                </h-form-item>-->
                <show-cpes-branch  :label="$t('m.i.be.otherBrchName')"
                                   :brchCode.sync="saleAccountQueryItem.buyBrchCode"  :cpesBrchName.sync="saleAccountQueryItem.buyBrchName"
                                   datagridUrl="/cpes/branch/queryBranchList" prop="buyBrchName"
                                   queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>

                <h-form-item :label="$t('m.i.be.custTraderName')" prop="buyTraderName" class="h-form-long-label">
                  <h-input @on-click="showtrader = true" v-model="saleAccountQueryItem.buyTraderName"
                           clearable @on-clear="clearVal('buyTraderName')" icon="search"  readonly>
                  </h-input>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"  :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-row>
            <h-col span="24">
              <h-datagrid :columns="dataColumns" hasPage highlight-row url="/be/market/anonyclick/sale/saleDueAccount/func_findDueAccountBatchList"
                :bindForm="saleAccountQueryItem" :onCurrentChange="onCurrentChange" :onCurrentChangeCancel="onCurrentChangeCancel" showListCkeckBox ref="datagrid">
                <div slot="toolbar" class='pull-left'>
                  <h-button type="primary" @click="dueAccount()">{{$t('m.i.be.dueAccount')}}</h-button>
                </div>
              </h-datagrid>
            </h-col>
          </h-row>
        </div>
      </h-col>
    </h-row>

    <!--<brch-code-search :brchCodeWin="showbrch" optType="2" @brchCodeWinClose="closeBranch" @brchCodeChange="brchCodeChange"></brch-code-search>-->
    <trader-id-search :traderIdWin="showtrader" :brchCode="saleAccountQueryItem.buyBrchCode" @traderIdWinClose="traderIdWinClose" @traderIdChange="traderIdChange"></trader-id-search>
    <acct-record title="分录信息" :param="param" :showAcctRecordWin="showAcctRecordWin" @showAcctRecordWinClose="showAcctRecordWinClose"
                 :submitFlag="acctSubmitFlag"
                 :showPrintButton="showPrintButton"
                 @printSuccessCallback="printSuccessCallback"
                :url="url" @acctSubmitSure="acctSubmitSure"></acct-record>
    <!--<sale-detail :batchId="batchId" :dictMap="dictMap" :busiType="busiType" :saleDetailWin="showDetilBox"  @closeMsgBox="closeDetil"></sale-detail>-->
    <!--子批详情页面-->
    <sale-sub-detail :saleSubDetailWin="saleSubDetailWin" :batchParams="batchParams"
                     @saleSubDetailWinClose="saleSubDetailWinClose" ref="saleSubDetail"></sale-sub-detail>
    <!--<show-license-branch :showBranchWin="brchNoWin" title="机构查询" @brchNoChange="brchNoChange" :authPath="authPath"
                         @showBranchWinClose="brchNoWinClose" :ifcheck="true" :checkStrictly="true"></show-license-branch>-->

  </div>
</template>

<script>
  import { post, on, off, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "saleDueAccount",
    data() {
      return {
        showPrintButton:false,
        acctSubmitFlag:false,
        saleAccountQueryItem : {
          batchNo: "",
          quoteNo: "",
          dealNo:"",
          busiType: "",
          buyBrchCode:"",
          buyBrchName: "",
          buyTraderNo: "",
          buyTraderName:"",
          ownedBrchName:"",
          ownedBrchNo:"",
          ownedBrchNames:"",
          ownedBrchNos:"",
          authPath:this.$route.path ,
          licenseFlag:this.licenseFlag,
        },
        //showbrch : false,
        showtrader : false,
        batchNo : "",
        billTypeList : [],
        billClassList : [],
        busiTypeList : [],
        type : "",
        ifShowMore : false,
        currentSelectList : [],
        currentSelectRowInx : [],
        showAcctRecordWin : false,
        //集中授权管理
        ownedBrchName:"",
        ownedBrchNo:"",
        ownedBrchNames:"",
        ownedBrchNos:"",
        licenseFlag:false,
        authPath: this.$route.path ,
        //brchNoWin : false,
        param : {
          id: ''
        },
        batchId : "",
        url : "/be/market/anonyclick/sale/saleDueAccount/func_getDueAcctRecord",

        busiType : '',
        saleSubDetailWin : false,
        batchUrl : "/be/market/quote/sale/saleDueAccount/func_findByBatchId",
        billsUrl : "/be/market/quote/sale/saleDueAccount/func_queryBills",
         dataColumns : [
          {
            type: "radio",
            width: 50,
            align: "center",
            title: ' ',
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          },
           {
             title: this.$t("m.i.common.ownedBrchNo"),
             key: "ownedBrchName",
             hiddenCol: false
           },
          {
            title: this.$t('m.i.common.batchNo'),
            key: "batchNo",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('a', {
                on: {
                  click: () => {
                    this.showDetil(params.row.id, params.row.busiType)
                  }
                }
              }, params.row.batchNo)
            }
          },
          {
            title: this.$t('m.i.be.quoteNo'),
            key: "quoteNo",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.busiType'),
            key: "busiType",
            hiddenCol: false,
            render: (h, params) => {
          let dictValue =this.getDictValueFromMap(this.dictMap, 'QuoteBusiType', params.row.busiType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            },
          },
          {
            title: this.$t('m.i.be.dealNo'),
            key: "dealNo",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.dealStatus'),
            key: "dealStatus",
            hiddenCol: false,
            render: (h, params) => {
          let dictValue =this.getDictValueFromMap(this.dictMap, 'QuoteStatus', params.row.dealStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            },
          },
          {
            title: this.$t('m.i.common.dealDtTm'),
            key: "dealDtTm",
            hiddenCol: false,
            render: (h, params) => {
              return h('span', params.row.dealDtTm ? this.$moment(params.row.dealDtTm, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss") : "")
            }
          },
          {
            title: this.$t('m.i.be.otherBrchName'),
            key: "buyBrchName",
            sortable: true,
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.be.custTraderName'),
            key: "buyTraderName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.billType'),
            key: "billType",
            hiddenCol: false,
            render: (h, params) => {
          let dictValue =this.getDictValueFromMap(this.dictMap, 'DraftTypeCode', params.row.billType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          }, {
            title: this.$t('m.i.billInfo.billClass'),
            key: "billClass",
            hiddenCol: false,
            render: (h, params) => {
          let dictValue =this.getDictValueFromMap(this.dictMap, 'CDMedia', params.row.billClass);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.firstTransRate'),
            key: "ratePct",
            sortable: true,
            hiddenCol: false
          }, {
            title: this.$t('m.i.be.dueTransRate'),
            key: "dueRatePct",
           sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.subDeal'),
            key: "subDeal",
            hiddenCol: false,
            render: (h, params) => {
          let dictValue =this.getDictValueFromMap(this.dictMap, 'Yon', params.row.subDeal);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.clearSpeed'),
            key: "clearSpeed",
            hiddenCol: false,
            render: (h, params) => {
          let dictValue =this.getDictValueFromMap(this.dictMap, 'ClearSpeed', params.row.clearSpeed);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          }, {
            title: this.$t('m.i.be.firstSettleDate'),
            key: "firstSettleDt",
            hiddenCol: false,
             sortable: true,
            render: (h, params) => {
              return h('span', params.row.firstSettleDt ? this.$moment(params.row.firstSettleDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
            }
          }, {
            title: this.$t('m.i.be.dueSettleDt'),
            key: "dueSettleDt",
           sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', params.row.dueSettleDt ? this.$moment(params.row.dueSettleDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
            }
          },
          {
            title: this.$t('m.i.be.settleMode'),
            key: "settleMode",
            hiddenCol: false,
            render: (h, params) => {
          let dictValue =this.getDictValueFromMap(this.dictMap, 'SettleType', params.row.settleMode);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          }, {
            title: this.$t('m.i.be.clearType'),
            key: "clearType",
            hiddenCol: false,
            render: (h, params) => {
          let dictValue =this.getDictValueFromMap(this.dictMap, 'ClearType', params.row.clearType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          }, {
            title: this.$t('m.i.common.totalAmtBillPackage'),
            key: "totalAmt",
           sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('p', formatNumber(params.row.totalAmt, 2, ','))
            },
          }, {
            title: this.$t('m.i.be.firstPayInterestByUnit'),
            key: "firstPayInterest",
           sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('p', formatNumber(params.row.firstPayInterest, 2, ','))
            },
          }, {
            title: this.$t('m.i.be.dueInterestByUnit'),
            key: "dueInterest",
           sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', formatNumber(params.row.dueInterest, 2, ','))
            },
          },
          {
            title: this.$t('m.i.be.firstSettleAmtByUnit'),
            key: "firstSettleAmt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('p', formatNumber(params.row.firstSettleAmt, 2, ','))
            },
          }, {
            title: this.$t('m.i.be.dueSettleAmtByUnit'),
            key: "dueSettleAmt",
           sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('p', formatNumber(params.row.dueSettleAmt, 2, ','))
            },
          }, {
            title: this.$t('m.i.be.tenorDays'),
            key: "tenorDays",
             sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.totalNumBillPackage'),
            key: "totalNum",
            hiddenCol: false
          }, {
            title: this.$t('m.i.be.firstClearStatus'),
            key: "clearStatus",
            hiddenCol: false,
            render: (h, params) => {
          let dictValue =this.getDictValueFromMap(this.dictMap, 'StlResult', params.row.clearStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.dueClearStatus'),
            key: "dueClearStatus",
            hiddenCol: false,
            render: (h, params) => {
          let dictValue =this.getDictValueFromMap(this.dictMap, 'StlResult', params.row.dueClearStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.firstAcctStatus'),
            key: "acctStatus",
            hiddenCol: false,
            render: (h, params) => {
          let dictValue =this.getDictValueFromMap(this.dictMap, 'AcctFlag', params.row.acctStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.dueAcctStatus'),
            key: "dueAcctFlag",
            hiddenCol: false,
            render: (h, params) => {
          let dictValue =this.getDictValueFromMap(this.dictMap, 'AcctFlag', params.row.dueAcctFlag);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.otherNoLegalProd'),
            key: "buyProductName",
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.common.dealPrcMsg'),
            key: "dealPrcMsg",
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.be.brchName'),
            key: "saleBrchName",
            sortable: true,
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.be.traderName'),
            key: "saleTraderName",
            sortable: true,
            hiddenCol: false,
          }
        ],
        dictMap : new Map(),
        batchParams:{}
      }
    },
    components: {
      //BrchCodeSearch:()=>import(/* webpackChunkName: "sm/auth/branch/cpesBrchCodeSearch" */`@/views/bizViews/sm/auth/branch/cpesBrchCodeSearch`),
      TraderIdSearch:()=>import(/* webpackChunkName: "shcpe/cpes/trader/traderIdSearch" */`@/views/bizViews/shcpe/cpes/trader/traderIdSearch`),
      // SaleDetail:()=>import(/* webpackChunkName: "be/market/quote/sale/saleDetail" */`@/views/bizViews/be/market/quote/sale/saleDetail`),
      SaleSubDetail: () => import(/* webpackChunkName: "be/market/anonyclick/sale/saleSubDetail" */`@/views/bizViews/be/market/anonyclick/sale/saleSubDetail`)
      //ShowLicenseBranch: () => import(/* webpackChunkName: "sm/auth/branch/showLicenseBranch" */`@/views/bizViews/sm/auth/branch/showLicenseBranch`),

    },
    methods: {
      onCurrentChange(data){
        this.currentSelectList[0]=data
      },
      onCurrentChangeCancel(){
        this.currentSelectList=[]
      },
      //记账弹窗
      dueAccount() {
        if (this.currentSelectList.length == 1) {
          let list = this.currentSelectList;
          this.param = {id:list[0].id,licenseFlag:this.licenseFlag,ownedBrchNo:list[0].ownedBrchNo,
            ownedBrchName:list[0].ownedBrchName};
          this.showAcctRecordWin = true;
        } else if (this.currentSelectList.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return
        } else if (this.currentSelectList == null || this.currentSelectList.length <= 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return
        }
      },
      //确定记账，发送记账请求
      acctSubmitSure(obj) {
        let url = "/be/market/anonyclick/sale/saleDueAccount/func_dueAccount";
        let id = obj.id;
        this.acctSubmitFlag = true;
        post({ id: id ,licenseFlag:this.licenseFlag,ownedBrchNo:obj.ownedBrchNo,
          ownedBrchName:obj.ownedBrchName }, url).then(res => {
          this.acctSubmitFlag = false;
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.showPrintButton = true;
              if(!obj.isHasPrint) {
                this.showAcctRecordWinClose();
              }
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
              this.showAcctRecordWinClose();
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      printSuccessCallback(){
        this.showAcctRecordWinClose();
      },
      // 关闭记账窗口
      showAcctRecordWinClose() {
        this.showAcctRecordWin = false;
        this.showPrintButton = false;
        this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
        this.currentSelectList = [];
      },
      //根据弹框所选数据进行赋值
      /*brchCodeChange(info) {
        if (info === null) {
          this.$msgTip.info(this, { info: "请先选择记录！" });
          return;
        }
        this.saleAccountQueryItem.buyBrchCode = info.brchCode;
        this.saleAccountQueryItem.buyBrchName = info.brchFullNameZh;
        this.showbrch = false;
      },*/
      traderIdChange(info) {
        if (info === null) {
          this.$msgTip.info(this, { info: "请先选择记录！" });
          return;
        }
        this.saleAccountQueryItem.buyTraderNo = info.traderId;
        this.saleAccountQueryItem.buyTraderName = info.traderName;
        this.showtrader = false;
      },
      traderIdWinClose() {
        this.showtrader = false;
      },
      /*closeBranch() {
        this.showbrch = false;
      },*/
      /**
       * 列表搜索
       * */
      formSearch() {
        this.currentSelectList = [];
        this.currentSelectRowInx = [];
        this.$refs.datagrid.dataChange(1);
      },
      /**
       * 查询区域重置
       * */
      formSearchReset() {
        this.saleAccountQueryItem.ownedBrchNo = "";
        this.saleAccountQueryItem.ownedBrchName = "";
        this.saleAccountQueryItem.ownedBrchNos = "";
        this.saleAccountQueryItem.ownedBrchNames = "";
        this.$refs.saleAccountQueryItem.resetFields();
        this.saleAccountQueryItem.buyBrchCode = "";
        this.saleAccountQueryItem.buyTraderNo = '';
        this.saleAccountQueryItem.buyBrchName = "";

      },
      saleSubDetailWinClose() {
        this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
        this.currentSelectList = [];
        this.saleSubDetailWin = false;
      },
      showDetil(i, busiType) {
        this.batchParams.batchId = i;
        this.batchParams.dictMap = this.dictMap;
        this.batchParams.subBatchUrl="/be/market/anonyclick/sale/saleDueAccount/func_findSaleBatchById";
        this.batchParams.subBillsUrl="/be/market/anonyclick/sale/saleDueAccount/func_querySaleBillList";
        this.batchParams.subExportUrl="/be/market/anonyclick/sale/saleDueAccount/func_downloadSubSaleInfo";
        this.saleSubDetailWin = true
      },
      clearVal(type){
        if(type == 'buyBrchName'){
          this.saleAccountQueryItem.buyBrchCode = '';
          this.saleAccountQueryItem.buyBrchName = '';
        }
        if(type == 'buyTraderName'){
          this.saleAccountQueryItem.buyTraderNo = '';
          this.saleAccountQueryItem.buyTraderName = '';
        }
      },

      //根据弹框所选数据进行赋值
     /* brchNoChange(info) {
        let objs = [];
        if(info instanceof Array){
          objs = info;
        } else {
          objs[0] = info;
        }
        let brchNos = "";
        let brchNames = "";
        for(var i=0;i<objs.length; i++){
          brchNos += objs[i].id + ',';
          brchNames += objs[i].title + ',';
        }
        this.saleAccountQueryItem.ownedBrchNos = brchNos.substring(0,brchNos.length - 1);
        this.saleAccountQueryItem.ownedBrchNames = brchNames.substring(0,brchNames.length - 1);
        this.brchNoWin = false;
      },
      brchNoWinOpen() {
        this.brchNoWin = true;},
      brchNoWinClose() {
        this.brchNoWin = false;
      },*/
    },
    mounted() {
      this.getDictListByGroups("BusiType,TenorVarieties,PreRelationFlag,Yon,CdSelectMode,QuoteStatus,DraftTypeCode,AcctFlag,ClearType,QuoteBusiType,SettleType,StlResult,PreTradeBhvr,CDMedia,DealStatus,MmbStlStatus,ClearSpeed,CreditMajor,BillOrigin").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.billClassList = res.get("CDMedia");
        this.busiTypeList = res.get('QuoteBusiType');
        this.dictMap = res.get("map");
      });

      post({authPath:this.$route.path}, "sm/auth/licenseBrch/focusOper/func_checkLicenseAuth").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.licenseFlag = res.data.retData.licenseFlag;
            if (this.licenseFlag) {
              this.$refs.datagrid.controlColumnsHidden("ownedBrchName", false);
            }else {
              this.$refs.datagrid.controlColumnsHidden("ownedBrchName", true);
            }
          } else {
            this.$msgTip.error(this, { info: res.data.retMsg });
          }
        }else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });
    }
  }

</script>

<style scoped>

</style>
