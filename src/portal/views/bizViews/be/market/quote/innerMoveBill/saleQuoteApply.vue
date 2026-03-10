<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">

                <h-form-item :label="$t('m.i.common.batchNo')" prop="batchNo">
                  <h-input v-model="formItem.batchNo">
                  </h-input>
                </h-form-item>

                <!--<h-form-item :label="$t('m.i.common.busiType')" prop="innerBusiType">
                  <h-select v-model="formItem.innerBusiType" showTitle>
                    <h-option v-for="item in busiTypeList" :value="item.key" :key="item.value">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>-->

                <h-form-item :label="$t('m.i.be.outBuyBrchName')" prop="outBuyBrchName">
                  <h-input @on-click="showbrch = true" v-model="formItem.outBuyBrchName" icon="search"
                           clearable @on-clear="clearVal('outBuyBrchName')" readonly :title="formItem.outBuyBrchName">
                  </h-input>
                </h-form-item>

                <h-form-item :label="this.$t('m.i.be.isCommit')" prop="isCommit" cols="2" >
                    <h-radio-group v-model="formItem.isCommit" >
                      <h-radio label="0" @on-click="noCommitButton">
                        <span>未提交</span>
                      </h-radio>
                      <h-radio label="1" @on-click="hasCommitButton">
                        <span>已提交</span>
                      </h-radio>
                    </h-radio-group>
                </h-form-item>

                <h-form-item :label="$t('m.i.be.outBuyTraderName')" prop="outBuyTraderName" class="h-form-long-label">
                  <h-input @on-click="showtrader = true" v-model="formItem.outBuyTraderName" icon="search"
                           clearable @on-clear="clearVal('outBuyTraderName')" readonly>
                  </h-input>
                </h-form-item>

                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont" :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary"  @click="formSearch()">{{$t('m.i.common.search')}}</h-button>
                  <h-button type="primary" @click="formSearchReset()">{{$t('m.i.common.reset')}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-row>
            <h-col span="24">
              <h-datagrid  :columns="columns"
                  url="/be/market/quote/innerMoveBill/saleQuoteApply/func_queryBatch"
                  :hasPage="true"
                  :highlight-row="true"
                  :bindForm="formItem"
                  showListCkeckBox :border="true" :auto-load="true"
                  size="default" stripe :showSizer="true" :showElevator="true"
                  :onCurrentChangeCancel="cancelQuoteAppSelectClick"
                  :onCurrentChange="quoteAppSelectClick"  ref="quoteAppDatagrid"
                  class="p-5" :customCalculateHeight="calculateHeight"
                  customCalculateParams="h-window1">
                  <div slot="toolbar" class="pull-left">
                    <h-button type="primary" @click="createInnerMoveBillApply()" :disabled="hasCommit">新增</h-button>
                    <h-button type="primary" @click="editInnerMoveBillApply()" :disabled="hasCommit">修改</h-button>
                    <h-button type="primary" @click="deleteInnerMoveBillApply()" :disabled="hasCommit">删除</h-button>
                    <h-button type="primary" @click="cancelAppl()" :disabled="noCommit">撤销</h-button>
                  </div>
                </h-datagrid>
            </h-col>
          </h-row>
        </div>
      </h-col>
    </h-row>
    <h-delay :delay='500'>
      <sale-detail :batchId="theBatchId" :dictMap="dictMap" :busiType="busiType" :saleDetailWin="showSaleDetil" @closeMsgBox="closeDetil('sale')"></sale-detail>
    </h-delay>
    <brch-code-search :brchCodeWin="showbrch" optType="2" @brchCodeWinClose="closeBranch" @brchCodeChange="brchCodeChange"></brch-code-search>
    <trader-id-search :traderIdWin="showtrader" @traderIdWinClose="traderIdWinClose" @traderIdChange="traderIdChange"></trader-id-search>

    <quote-sale-change :dictMap="dictList"  :bt="busiType" :batchId="batchId"  :title="title"  @quoteSaleChangeWinClose="quoteSaleChangeWinClose"
            ref="quoteSaleChage" :quoteSaleChangeWin="quoteSaleChangeWin" >
    </quote-sale-change>

  </div>
</template>
<script>
  import { post,formatNumber } from '@/api/bizApi/commonUtil'

  export default {
    name: "saleQuoteApply",
    data() {
      return {
        filename : "卖出票据明细",
        batchUrl : "/be/market/quote/sale/saleConfirmation/func_findByBatchId",
        billsUrl : "/be/market/quote/sale/saleConfirmation/func_queryBills",
        batchsUrl : "/be/market/quote/sale/saleConfirmation/func_queryBatch",
        isshow : false,
        busiType : "",
        batchId:'',
        bills : {
          batchId: '',
        },
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
            title: this.$t('m.i.common.batchNo'),
            key: "batchNo",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('a', {
                on: {
                  click: () => {
                    this.billDetail(params.row.id, params.row.busiType)
                  }
                }
              }, params.row.batchNo)
            }
          }, {
            title: this.$t('m.i.common.busiType'),
            key: "outBusiType",
            hiddenCol: false,
            render: (h, params) => {
          let dictValue = this.getDictValueFromMap(this.dictMap, 'QuoteBusiType', params.row.outBusiType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },  {
            title: this.$t('m.i.be.innerBuyBrchName'),
            key: "innerBuyBrchName",
            sortable: true,
            hiddenCol: false
          }, {
            title: this.$t('m.i.be.innerBuyTraderName'),
            key: "innerBuyTraderName",
            sortable: true,
            hiddenCol: false
          },{
            title: this.$t('m.i.be.outBuyBrchName'),
            key: "outBuyBrchName",
            sortable: true,
            hiddenCol: false
          }, {
            title: this.$t('m.i.be.outBuyTraderName'),
            key: "outBuyTraderName",
            sortable: true,
            hiddenCol: false
          },{
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
            title: this.$t('m.i.be.innerRate'),
            key: "innerRatePct",
            sortable: true,
            hiddenCol: false,
            align: "right",
            render: (h, params) => {
              return h('p', params.row.innerRatePct)
            },
          }, {
            title: this.$t('m.i.be.outRate'),
            key: "outRatePct",
            sortable: true,
            hiddenCol: false,
            align: "right",
            render: (h, params) => {
              return h('p', params.row.outRatePct)
            },
          },{
            title: this.$t('m.i.be.totalCount'),
            key: "totalNum",
            hiddenCol: false,
            align: "center"
          },{
            title: this.$t('m.i.be.totalAmtByYUAN'),
            key: "totalAmt",
            sortable: true,
            hiddenCol: false,
            align: "right",
            render: (h, params) => {
              return h('p', formatNumber(params.row.totalAmt, 2, ','))
            },
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
          },{
            title: this.$t('m.i.be.innerClearSpeed'),
            key: "innerClearSpeed",
            hiddenCol: false,
            render: (h, params) => {
          let dictValue = this.getDictValueFromMap(this.dictMap, 'ClearSpeed', params.row.innerClearSpeed);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },{
            title: this.$t('m.i.be.outClearSpeed'),
            key: "outClearSpeed",
            hiddenCol: false,
            render: (h, params) => {
          let dictValue = this.getDictValueFromMap(this.dictMap, 'ClearSpeed', params.row.outClearSpeed);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },{
            title: this.$t('m.i.be.innerFirstSettleDt'),
            key: "innerFirstSettleDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('span', params.row.innerFirstSettleDt ? this.$moment(params.row.innerFirstSettleDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
            }
          },{
            title: this.$t('m.i.be.outFirstSettleDt'),
            key: "outFirstSettleDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('span', params.row.outFirstSettleDt ? this.$moment(params.row.outFirstSettleDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
            }
          }, {
            title: this.$t('m.i.be.innerSettleMode'),
            key: "innerSettleMode",
            hiddenCol: false,
            render: (h, params) => {
          let dictValue = this.getDictValueFromMap(this.dictMap, 'SettleType', params.row.innerSettleMode);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          }, {
            title: this.$t('m.i.be.outSettleMode'),
            key: "outSettleMode",
            hiddenCol: false,
            render: (h, params) => {
          let dictValue = this.getDictValueFromMap(this.dictMap, 'SettleType', params.row.outSettleMode);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          }, {
            title: this.$t('m.i.be.innerClearType'),
            key: "innerClearType",
            hiddenCol: false,
            render: (h, params) => {
          let dictValue = this.getDictValueFromMap(this.dictMap, 'ClearType', params.row.innerClearType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          }, {
            title: this.$t('m.i.be.outClearType'),
            key: "outClearType",
            hiddenCol: false,
            render: (h, params) => {
          let dictValue = this.getDictValueFromMap(this.dictMap, 'ClearType', params.row.outClearType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          }, {
            title: this.$t('m.i.be.innerQuoteTm'),
            key: "innerQuoteTm",
            hiddenCol: false
          }, {
            title: this.$t('m.i.be.outQuoteTm'),
            key: "outQuoteTm",
            hiddenCol: false
          }, {
            title: this.$t('m.i.be.innerSetTm'),
            key: "innerSetTm",
            hiddenCol: false
          }, {
            title: this.$t('m.i.be.outSetTm'),
            key: "outSetTm",
            hiddenCol: false
          }
          , {
            title: this.$t('m.i.be.innerFirstInterest'),
            key: "innerFirstInterest",
            sortable: true,
            hiddenCol: false,
            align: "right",
            render: (h, params) => {
              return h('p', formatNumber(params.row.innerFirstInterest, 2, ','))
            },
          }, {
            title: this.$t('m.i.be.innerFirstSettleAmt'),
            key: "innerFirstSettleAmt",
            sortable: true,
            hiddenCol: false,
            align: "right",
            render: (h, params) => {
              return h('p', formatNumber(params.row.innerFirstSettleAmt, 2, ','))
            },
          },
          {
            title: this.$t('m.i.be.innerTenorDays'),
            key: "innerTenorDays",
            hiddenCol: false
          },
           {
            title: this.$t('m.i.be.outFirstInterest'),
            key: "outFirstInterest",
            sortable: true,
            hiddenCol: false,
            align: "right",
            render: (h, params) => {
              return h('p', formatNumber(params.row.outFirstInterest, 2, ','))
            },
          },
           {
            title: this.$t('m.i.be.outFirstSettleAmt'),
            key: "outFirstSettleAmt",
            sortable: true,
            hiddenCol: false,
            align: "right",
            render: (h, params) => {
              return h('p', formatNumber(params.row.outFirstSettleAmt, 2, ','))
            },
          },
           {
            title: this.$t('m.i.be.outTenorDays'),
            key: "outTenorDays",
            hiddenCol: false
          }
        ],
        formItem: {
          batchNo: "",
          quoteNo: "",
          busiType: "",
          innerBusiType: "",
          buyBrchName: "",
          buyBrchCode: "",
          buyTraderName: "",
          buyTraderNo: "",
          outBuyBrchName: "",
          outBuyTraderName: "",
          isCommit:'0'
        },
        selectData: [],
        ifShowMore: false,
        busiTypeList: [],
        showbrch: false,
        showtrader: false,
        showProvisionDetil: false,
        dictMap: new Map(),

        quoteSaleChangeWin: false,
        hasCommitDisabled : false,
        noCommitDisabled : false,
        dictList: {},
        showSaleDetil: false,
        theBatchId: '',
        IMBApplySelectList : [],
        title: '',
        hasCommit:false,
        noCommit:true,
      };
    },
    components: {
      BrchCodeSearch:()=>import(/* webpackChunkName: "sm/auth/branch/cpesBrchCodeSearch" */`@/views/bizViews/sm/auth/branch/cpesBrchCodeSearch`),
      TraderIdSearch:()=>import(/* webpackChunkName: "shcpe/cpes/trader/traderIdSearch" */`@/views/bizViews/shcpe/cpes/trader/traderIdSearch`),
      SaleDetail:()=>import(/* webpackChunkName: "be/market/quote/innerMoveBill/saleDetail" */`@/views/bizViews/be/market/quote/innerMoveBill/saleDetail`),
      QuoteSaleChange:()=>import(/* webpackChunkName: "be/market/quote/innerMoveBill/quoteSaleChange" */`@/views/bizViews/be/market/quote/innerMoveBill/quoteSaleChange`)
    },

    mounted() {
      this.getDictListByGroups('PreRelationFlag,Yon,CdSelectMode,QuoteStatus,PreTradeBhvr,QuoteBusiType,SettleType,ClearType,ClearSpeed,CDMedia,DraftTypeCode,CreditMajor,bankType,bankLevel,TenorCode,billSource,AssetIndustry,BillOrigin').then(res => {
        this.busiTypeList = res.get("QuoteBusiType");
        this.trDirList = res.get("TrDir");
        this.billClassList = res.get("CDMedia");
        this.billTypeList = res.get("DraftTypeCode");
        this.acctStatusList = res.get("AcctFlag");
        this.dealStatusList = res.get("QuoteStatus");
        this.clearStatusList = res.get("StlResult");
        this.preTradeBhvrList = res.get("PreTradeBhvr");
        this.preRelationFlagList = res.get("PreRelationFlag");
        this.quoteBatchStatusList = res.get("QuoteBatchStatus");
        this.bankTypeList = res.get("bankType");
        this.billSourceList = res.get("billSource");
        this.billOriginList = res.get("BillOrigin");
        this.dictList = {
          busiTypeList: this.busiTypeList,
          trDirList: this.trDirList,
          billClassList: this.billClassList,
          billTypeList: this.billTypeList,
          acctStatusList: this.acctStatusList,
          dealStatusList: this.dealStatusList,
          clearStatusList: this.clearStatusList,
          preTradeBhvrList: this.preTradeBhvrList,
          quoteBatchStatusList: this.quoteBatchStatusList,
          billSourceList:this.billSourceList,
          billOriginList:this.billOriginList,
          bankTypeList:this.bankTypeList,
          YonList: res.get('Yon'),
          ClearTypeList: res.get('ClearType'),
          SettleType: res.get('SettleType'),
          clearSpeed: res.get('ClearSpeed'),
          CdSelectMode: res.get('CdSelectMode'),
          creditDeductRuleList: res.get("CreditDeductRule"),
          assetIndustryListOne: res.get("AssetIndustryManage"),
          assetIndustryListAll: res.get("AssetIndustry"),
          bookTypeList: res.get("BookType"),
          bankLevelList:res.get("bankLevel"),
          TenorCodeList:res.get("TenorCode"),
          CreditMajorList:res.get("CreditMajor"),
          dictListMap: res.get("map")
        }
        this.dictMap = res.get("map");
        setTimeout(function(){
          this.moreComp = true;
        },3000)
      })
    },
    methods: {
      format(groupcode, key) {
        return this.getDictValueFromMap(this.dictMap, groupcode, key)
      },
      formatDate(value) {
        return this.$moment(value, "YYYY-MM-DD").format("YYYY-MM-DD")
      },
      //根据弹框所选数据进行赋值
      brchCodeChange(info) {
        if (info === null) {
          this.$msgTip.info(this, { info: "请先选择记录！" });
          return;
        }
        //this.formItem.buyBrchCode = info.brchCode;
        //this.formItem.buyBrchName = info.brchFullNameZh;
        this.formItem.outBuyBrchName = info.brchFullNameZh;
        this.showbrch = false;
      },
      traderIdChange(info) {
        if (info === null) {
          this.$msgTip.info(this, { info: "请先选择记录！" });
          return;
        }
        //this.formItem.buyTraderNo = info.traderId;
        //this.formItem.buyTraderName = info.traderName;
        this.formItem.outBuyTraderName = info.traderName;
        this.showtrader = false;
      },
      traderIdWinClose() {
        this.showtrader = false;
      },
      closeBranch() {
        this.showbrch = false;
      },
      formSearch() {
        this.selectData = [];
        this.$refs.quoteAppDatagrid.dataChange(1);
      },
      formSearchReset() {
        this.formItem.outBuyBrchName = '';
        this.formItem.outBuyTraderName = '';
        this.$refs.formItem.resetFields();
        this.noCommitButton();
      },
      handleSelectClick(arr) {
        let tmpArr = [];
        tmpArr.push(arr);
        this.IMBApplySelectList = tmpArr;
      },

      // 行选中
      quoteAppSelectClick(arr, selectInx) {
        let tmpArr = [];
        tmpArr.push(arr)
        this.IMBApplySelectList = tmpArr;
      },
      cancelQuoteAppSelectClick(){
        this.IMBApplySelectList=[]
      },
      //计算表格高度
      calculateHeight(windowId) {
        let appObj = document.getElementsByClassName("app-main");
        let appOffsetTop = appObj.length == 0 ? 0 : appObj[0].offsetTop;
        let objects = {
          formItemObj: this.$el.querySelector("#" + windowId + " .h-form"),
          titleObj: this.$el.querySelector("#" + windowId + " .h-datagrid-title"),
          toolbarObj: this.$el.querySelector("#" + windowId + " .h-datagrid-toolbar"),
          pageObj: this.$el.querySelector("#" + windowId + " .h-page")
        };
        let extralHeight = 0;
        Object.keys(objects).forEach(function(key, index) {
          if (objects[key] !== null) {
            extralHeight += objects[key].clientHeight;
          }
        });
        let windowHeight = window.innerHeight;
        let height = windowHeight - extralHeight - appOffsetTop - 76;
        objects = undefined;
        windowHeight = undefined;
        appObj = undefined;
        return height
      },
      billDetail(id,busiType) {
        this.theBatchId = id;
        this.busiType=busiType;
        this.showSaleDetil = true;
      },
      closeDetil() {
        this.showSaleDetil=false
      },
      clearVal(type){
        if(type == 'outBuyBrchName'){
          this.formItem.buyBrchCode = '';
          this.formItem.outBuyBrchName = '';
        }
        if(type == 'outBuyTraderName'){
          this.formItem.buyTraderNo = '';
          this.formItem.outBuyTraderName = '';
        }
      },




     //未提交
      noCommitButton(){
        this.noCommit = true;
        this.hasCommit = false;
        this.formItem.isCommit='0';
        this.formSearch();
      },
      //已提交
      hasCommitButton(){
        this.hasCommit = true;
        this.noCommit = false;
        this.formItem.isCommit='1';
        this.formSearch();
      },

      //新增批次
      createInnerMoveBillApply() {
        this.busiType = "BT01";
        this.quoteSaleChangeWin = true;
        this.title = "新增内部调票申请批次";
      },
      //修改批次信息
      editInnerMoveBillApply() {
        let list = this.IMBApplySelectList;
        if (list.length == 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        if (list.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return;
        }
        this.batchId = list[0].id;
        this.busiType = list[0].innerBusiType;
        this.quoteSaleChangeWin = true;
        this.title = "修改内部调票申请批次";

      },
      //删除批次
      deleteInnerMoveBillApply() {
        let list = this.IMBApplySelectList;
        if (list.length == 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        if (list.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return;
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("m.i.common.isConfirmDelete") + "?",
          onOk: () => {
            let id = list[0].id;
            post({ id: id ,deleteFlag:"0" }, '/be/market/quote/innerMoveBill/saleQuoteApply/func_deleteIMBBatch').then(res => {
              if (res) {
                let retCode = res.data.retCode;
                let retMsg = res.data.retMsg;
                if (retCode == "000000") {
                  this.$msgTip.success(this);
                  this.$refs.quoteAppDatagrid.dataChange(this.$refs.quoteAppDatagrid.$refs.gridPage.currentPage);
                  this.IMBApplySelectList = [];
                } else if(retCode === "000002" && retMsg === "100001"){
                  this.continueApply(id);
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                  this.$refs.quoteAppDatagrid.dataChange(this.$refs.quoteAppDatagrid.$refs.gridPage.currentPage);
                  this.IMBApplySelectList = [];
                }
              } else {
                this.$msgTip.error(this, { info: this.$t('m.i.common.netError') });
              }
            });
          }
        });
      },

      // 关闭卖出报价新增、修改框
      quoteSaleChangeWinClose() {
        this.quoteSaleChangeWin = false;
        this.title = "";
        this.busiType = '';
        this.batchId = null;
        this.IMBApplySelectList = [];
        this.$refs.quoteAppDatagrid.dataChange(this.$refs.quoteAppDatagrid.$refs.gridPage.currentPage);
      },
      cancelAppl(){
        let list = this.IMBApplySelectList;
        if (list.length == 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        if (list.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return;
        }
        let url = '/be/market/quote/innerMoveBill/saleQuoteApply/func_cancelInnerMoveApply';
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("确认要撤销申请吗") + "?",
          onOk: () => {
            let id = list[0].id;
            post({ id: id }, url).then(res => {
              if (res) {
                let retCode = res.data.retCode
                if (retCode == "000000") {
                  this.$msgTip.success(this);
                  this.$refs.quoteAppDatagrid.dataChange(this.$refs.quoteAppDatagrid.$refs.gridPage.currentPage);
                  this.IMBApplySelectList = [];
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                  this.$refs.quoteAppDatagrid.dataChange(this.$refs.quoteAppDatagrid.$refs.gridPage.currentPage);
                  this.IMBApplySelectList = [];
                }
              } else {
                this.$msgTip.error(this, { info: this.$t('m.i.common.netError') });
              }
            });
          }
        });
      }
    },
  }

</script>
