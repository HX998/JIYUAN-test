<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.common.batchNo')" prop="batchNo" >
                  <h-input v-model="formItem.batchNo"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.be.quoteNo')" prop="quoteNo">
                  <h-input v-model="formItem.quoteNo"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.be.dealNo')" prop="dealNo" >
                  <h-input v-model="formItem.dealNo"></h-input>
                </h-form-item>
                  <show-cpes-branch v-model="formItem.buyBrchCode" :label="$t('m.i.be.otherBrchName')" prop="buyBrchName"
                                    :brchCode.sync="formItem.buyBrchCode"  :cpesBrchName.sync="formItem.buyBrchName"
                                    datagridUrl="/cpes/branch/queryBranchList"
                                    queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>

                <h-form-item :label="$t('m.i.be.custTraderName')" prop="buyTraderName" class="h-form-long-label">
                  <h-input @on-click="showtrader = true" v-model="formItem.buyTraderName" icon="search"
                           clearable @on-clear="clearVal('buyTraderName')" readonly>
                  </h-input>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont" :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary"  @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-row>
            <h-col span="24">
              <h-datagrid :columns="columns" highlight-row :url="batchsUrl" :bindForm="formItem" :onCurrentChange="onCurrentChange" :onCurrentChangeCancel="onCurrentChangeCancel" ref="datagrid">
                <div slot="toolbar" class="pull-left">
                  <h-button type="primary" @click="account">{{$t('m.i.be.acct')}}</h-button>
                </div>
              </h-datagrid>
            </h-col>
          </h-row>
        </div>
      </h-col>
    </h-row>
    <trader-id-search :traderIdWin="showtrader" :brchCode="formItem.buyBrchCode" @traderIdWinClose="traderIdWinClose" @traderIdChange="traderIdChange"></trader-id-search>
    <acct-record :param="param"  :showAcctRecordWin="showAcctRecordWin" @showAcctRecordWinClose="showAcctRecordWinClose"
                 :submitFlag="acctSubmitFlag"
                 :showPrintButton="showPrintButton"
                 @printSuccessCallback="printSuccessCallback"
                 :url="acctRecord" @acctSubmitSure="acctSubmitSure"></acct-record>
    <!--子批详情页面-->
    <sale-sub-detail :saleSubDetailWin="saleSubDetailWin" :batchParams="batchParams"
                     @saleSubDetailWinClose="saleSubDetailWinClose" ref="saleSubDetail"></sale-sub-detail>

  </div>
</template>
<script>
  import { post ,formatNumber } from '@/api/bizApi/commonUtil'

  export default {
    name: "saleAccount",
    data() {
      return {
        filename : "卖出票据明细",
        batchUrl : "/be/market/quote/sale/saleAccount/func_findByBatchId",
        billsUrl : "/be/market/quote/sale/saleAccount/func_queryBills",
        batchsUrl : "/be/market/anonyclick/sale/saleAccount/func_queryBatch",
        acctRecord : "/be/market/anonyclick/sale/saleAccount/func_queryAcctRecord",
        accountUrl : "/be/market/anonyclick/sale/saleAccount/func_saleAccount",
        showPrintButton:false,
        acctSubmitFlag:false,
        dictMap : new Map(),
        columns : [
          {
            type: "radio",
            width: 50,
            title: " ",
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
            title: this.$t("m.i.common.ownedBrchNo"),
            key: "ownedBrchName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.batchNo'),
            key: "batchNo",
            hiddenCol: false,
            sortable: true,
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
          let dictValue = this.getDictValueFromMap(this.dictMap, 'QuoteBusiType', params.row.busiType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            },
          }, {
            title: this.$t('m.i.be.dealNo'),
            key: "dealNo",
            sortable: true,
            hiddenCol: false
          }, {
            title: this.$t('m.i.common.dealStatus'),
            key: "dealStatus",
            hiddenCol: false,
            render: (h, params) => {
          let dictValue = this.getDictValueFromMap(this.dictMap, 'QuoteStatus', params.row.dealStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          }, {
            title: this.$t('m.i.common.dealDtTm'),
            key: "dealDtTm",
            hiddenCol: false,
            render: (h, params) => {
              return h('span', params.row.dealDtTm ? this.$moment(params.row.dealDtTm, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss") : "")
            }
          }, {
            title: this.$t('m.i.be.otherBrchName'),
            key: "buyBrchName",
            sortable: true,
            hiddenCol: false
          }, {
            title: this.$t('m.i.be.custTraderName'),
            key: "buyTraderName",
            sortable: true,
            hiddenCol: false
          }, {
            title: this.$t('m.i.billInfo.billType'),
            key: "billType",
            hiddenCol: false,
            render: (h, params) => {
          let dictValue = this.getDictValueFromMap(this.dictMap, 'DraftTypeCode', params.row.billType);
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
          let dictValue = this.getDictValueFromMap(this.dictMap, 'CDMedia', params.row.billClass);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          }, {
            title: this.$t('m.i.be.firstTransRate'),
            key: "ratePct",
            hiddenCol: false
          }, {
            title: this.$t('m.i.be.dueTransRate'),
            key: "dueRatePct",
            hiddenCol: false
          }, {
            title: this.$t('m.i.be.subDeal'),
            key: "subDeal",
            hiddenCol: false,
            render: (h, params) => {
          let dictValue = this.getDictValueFromMap(this.dictMap, 'Yon', params.row.subDeal);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          }, {
            title: this.$t('m.i.be.clearSpeed'),
            key: "clearSpeed",
            hiddenCol: false,
            render: (h, params) => {
          let dictValue = this.getDictValueFromMap(this.dictMap, 'ClearSpeed', params.row.clearSpeed);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          }, {
            title: this.$t('m.i.be.firstSettleDate'),
            key: "firstSettleDt",
            sortable: true,
            hiddenCol: false,
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
          }, {
            title: this.$t('m.i.be.settleMode'),
            key: "settleMode",
            hiddenCol: false,
            render: (h, params) => {
          let dictValue = this.getDictValueFromMap(this.dictMap, 'SettleType', params.row.settleMode);
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
          let dictValue = this.getDictValueFromMap(this.dictMap, 'ClearType', params.row.clearType);
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
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('span', formatNumber(params.row.dueInterest, 2, ','))
            },
          }, {
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
          }, {
            title: this.$t('m.i.common.totalNumBillPackage'),
            key: "totalNum",
            hiddenCol: false
          }
        ],
        formItem : {
          batchNo:"",
          quoteNo: "",
          dealNo:"",
          busiType: "",
          buyBrchName: "",
          buyBrchCode: "",
          buyTraderName: "",
          buyTraderNo: "",
          ownedBrchName:"",
          ownedBrchNo:"",
          ownedBrchNames:"",
          ownedBrchNos:"",
          authPath:this.$route.path ,
          licenseFlag:this.licenseFlag,
        },
        ifShowMore : false,
       // showbrch : false,
        showtrader : false,
        busiTypeList : [],
        selectData : [],
        saleSubDetailWin : false,
        param : {},
        showAcctRecordWin : false,
        busiType : "",
        batchId:'',
        //集中授权管理
        ownedBrchName:"",
        ownedBrchNo:"",
        ownedBrchNames:"",
        ownedBrchNos:"",
        licenseFlag:false,
        authPath: this.$route.path ,
        batchParams:{}
      }
    },
    components: {
      TraderIdSearch:()=>import(/* webpackChunkName: "shcpe/cpes/trader/traderIdSearch" */`@/views/bizViews/shcpe/cpes/trader/traderIdSearch`),
      SaleSubDetail: () => import(/* webpackChunkName: "be/market/anonyclick/sale/saleSubDetail" */`@/views/bizViews/be/market/anonyclick/sale/saleSubDetail`)

    },
    mounted() {
      this.getDictListByGroups('BusiType,TenorVarieties,PreRelationFlag,Yon,CdSelectMode,QuoteStatus,QuoteBusiType,SettleType,ClearType,ClearSpeed,CDMedia,DraftTypeCode,CreditMajor,BillOrigin').then(res => {
        this.busiTypeList = res.get('QuoteBusiType');
        this.dictMap = res.get('map')
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
    },
    methods: {
      onCurrentChange(data){
        this.selectData[0]=data
      },
      onCurrentChangeCancel(){
        this.selectData=[]
      },
      //根据弹框所选数据进行赋值
    /*  brchCodeChange(info) {
        if (info === null) {
          this.$msgTip.info(this, { info: "请先选择记录！" });
          return;
        }
        this.formItem.buyBrchCode = info.brchCode;
        this.formItem.buyBrchName = info.brchFullNameZh;
        this.showbrch = false;
      },*/
      traderIdChange(info) {
        if (info === null) {
          this.$msgTip.info(this, { info: "请先选择记录！" });
          return;
        }
        this.formItem.buyTraderNo = info.traderId;
        this.formItem.buyTraderName = info.traderName;
        this.showtrader = false;
      },
      traderIdWinClose() {
        this.showtrader = false;
      },
    /*  closeBranch() {
        this.showbrch = false;
      },*/
      formSearch() {
        this.$refs.datagrid.dataChange(1);
        this.selectData = [];
      },
      formSearchReset() {
        this.formItem.ownedBrchNo = "";
        this.formItem.ownedBrchName = "";
        this.formItem.ownedBrchNos = "";
        this.formItem.ownedBrchNames = "";
        this.$refs.formItem.resetFields();
        this.formItem.buyBrchCode = ''
        this.formItem.buyTraderNo = ''
      },
      acctSubmitSure(info) {
        this.acctSubmitFlag = true;
        post({ id: info.id ,licenseFlag:this.licenseFlag,ownedBrchNo:info.ownedBrchNo,
          ownedBrchName:info.ownedBrchName }, this.accountUrl).then(res => {
          this.acctSubmitFlag = false;
          if (res) {
            let retCode = res.data.retCode
            if (retCode == "000000") {
              this.$msgTip.success(this);
              this.showPrintButton = true;
              if(!info.isHasPrint) {
                this.showAcctRecordWinClose();
              }
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
              this.showAcctRecordWinClose();
            }
          } else {
            this.$msgTip.error(this, { info: this.$t('m.i.common.netError') });
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
        this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
        this.selectData = [];
      },
      account() {
        let list = this.selectData;
        if (list.length == 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        if (list.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return;
        }
        this.param = {id:list[0].id,licenseFlag:this.licenseFlag,ownedBrchNo:list[0].ownedBrchNo,
          ownedBrchName:list[0].ownedBrchName};
        this.showAcctRecordWin = true;
      },
      showDetil(i,busiType) {
        this.batchParams.batchId = i;
        this.batchParams.dictMap = this.dictMap;
        this.batchParams.subBatchUrl="/be/market/anonyclick/sale/saleAccount/func_findSaleBatchById";
        this.batchParams.subBillsUrl="/be/market/anonyclick/sale/saleAccount/func_querySaleBillList";
        this.batchParams.subExportUrl="/be/market/anonyclick/sale/saleAccount/func_downloadSubSaleInfo";
        this.saleSubDetailWin = true
      },
      saleSubDetailWinClose() {
        this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
        this.currentSelectList = [];
        this.saleSubDetailWin = false
      },
      clearVal(type){
 /*       if(type == 'buyBrchName'){
          this.formItem.buyBrchCode = '';
          this.formItem.buyBrchName = '';
        }*/
        if(type == 'buyTraderName'){
          this.formItem.buyTraderNo = '';
          this.formItem.buyTraderName = '';
        }
      },

      //根据弹框所选数据进行赋值
      /*brchNoChange(info) {
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
        this.formItem.ownedBrchNos = brchNos.substring(0,brchNos.length - 1);
        this.formItem.ownedBrchNames = brchNames.substring(0,brchNames.length - 1);
        this.brchNoWin = false;
      },
      brchNoWinOpen() {
        this.brchNoWin = true;},
      brchNoWinClose() {
        this.brchNoWin = false;
      },*/
    }
  }

</script>
