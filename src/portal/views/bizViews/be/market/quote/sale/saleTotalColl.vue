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
                <h-form-item :label="$t('m.i.be.quoteNo')" prop="quoteNo">
                  <h-input v-model="formItem.quoteNo">
                  </h-input>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <h-button type="primary"  @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-row>
            <h-col span="24">
              <h-datagrid :columns="columns" highlight-row url="/be/market/quote/sale/saleTotalColl/func_querySaleTotalCollBatch"
                          :bindForm="formItem"
                          :onCurrentChangeCancel="onCurrentChangeCancel"
                          :onCurrentChange="onCurrentChange"
                          ref="datagrid">
                <div slot="toolbar" class="pull-left">
                  <h-button type="primary" @click="createQuote()">{{$t('m.i.common.add')}}</h-button>
                  <h-button type="primary" @click="editQuote()">{{$t('m.i.common.modify')}}</h-button>
                  <h-button type="primary" @click="delQuoteAppl()">{{$t('m.i.common.delete')}}</h-button>
                  <h-button type="primary" @click="refuseQuote()">{{$t('m.i.be.stopQuoteAppl')}}</h-button>
                  <h-button type="primary" @click="findQuoteHist()">{{$t('m.i.be.findQuoteHist')}}</h-button>
                </div>
              </h-datagrid>
            </h-col>
          </h-row>
        </div>
      </h-col>
    </h-row>
    <sale-detail :batchId="batchId" :dictMap="dictMap" :busiType="busiType" :saleDetailWin="showProvisionDetil"  @closeMsgBox="closeDetil" :rootUrl="rootUrl"></sale-detail>
    <!-- 卖出报价单新增、修改 -->
    <sale-total-change :dictMap="dictList" :trDir="trDir" :bt="busiType" :batchId="batchId" :title="title"
                       @saleTotalChangeWinClose="saleTotalChangeWinClose"
                       ref="saleTotalChange" :saleTotalChangeWin="saleTotalChangeWin">
    </sale-total-change>
    <!--报价历史查看-->
    <quote-hist-change :dictMap="dictList" :trDir="trDir" :bt="busiType" :quoteNo="quoteNo" :isQuoteNew="isQuoteNew" :reqNum="reqNum" :initURL="initURL" :billListURL="billListURL"
                       :title="title" @quoteHistChangeWinClose="quoteHistChangeWinClose" ref="quoteHistChage" :quoteHistChangeWin="quoteHistChangeWin">
    </quote-hist-change>
  </div>
</template>
<script>
  import { post, formatNumber} from '@/api/bizApi/commonUtil'

  export default {
    name: "saleTotalColl",
    data() {
      return {
        trDir: '',
        url: null,
        quoteNo: null,
        isQuoteNew: null,
        reqNum: null,
        quoteHistChangeWin:false,
        title:'',
        batchId:null,
        ifShowMore : false,
        saleTotalChangeWin:false,
        showProvisionDetil : false,
        busiType : "",
        selectData : [],
        dictMap : new Map(),
        dictList:{},

        formItem : {
          batchNo: "",
          quoteNo: "",
          busiType: ""
        },
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
            title: this.$t('m.i.be.quoteNo'),
            key: "quoteNo",
            sortable: true,
            hiddenCol: false
          }, {
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
            }
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
            title: this.$t('m.i.be.preTradeBhvr'),
            key: "preTradeBhvr",
            hiddenCol: false,
            render: (h, params) => {
          let dictValue = this.getDictValueFromMap(this.dictMap, 'PreTradeBhvr', params.row.preTradeBhvr);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          }, {
            title: this.$t('m.i.be.otherBrchName'),
            key: "saleBrchName",
            sortable: true,
            hiddenCol: false
          }, {
            title: this.$t('m.i.be.custTraderName'),
            key: "saleTraderName",
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
            sortable: true,
            hiddenCol: false
          }, {
            title: this.$t('m.i.be.dueTransRate'),
            key: "dueRatePct",
            sortable: true,
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
            title: this.$t('m.i.be.quoteTm'),
            key: "quoteTm",
            hiddenCol: false
          }, {
            title: this.$t('m.i.be.setTm'),
            key: "setTm",
            hiddenCol: false
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
              return h('p', formatNumber(params.row.dueInterest, 2, ','))
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
        // 分页切换配置
        pageSizeOpts : [10, 20, 50, 200],
        initURL : "/be/market/quote/sale/saleTotalColl/func_findQuoteApplHist",
        billListURL : "/be/market/quote/sale/saleTotalColl/func_queryQuoteBillHistByPage",
        rootUrl:"/be/market/quote/sale/saleTotalColl",
      };
    },
    components: {
      SaleTotalChange:()=>import(/* webpackChunkName: "be/market/quote/sale/saleTotalChange" */`@/views/bizViews/be/market/quote/sale/saleTotalChange`),
      QuoteHistChange:()=>import(/* webpackChunkName: "be/market/quote/hist/quoteHistChange" */`@/views/bizViews/be/market/quote/hist/quoteHistChange`),
      SaleDetail:()=>import(/* webpackChunkName: "be/market/quote/sale/saleTotalCollDetail" */`@/views/bizViews/be/market/quote/sale/saleTotalCollDetail`)
    },
    methods: {
      //关闭报价历史页面
      quoteHistChangeWinClose() {
        this.trDir = null;
        this.quoteNo = null;
        this.isQuoteNew = null;
        this.reqNum = null;
        this.busiType = '';
        this.quoteHistChangeWin = false;
        this.selectData = [];
        this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
      },
      // 关闭卖出报价新增、修改框
      saleTotalChangeWinClose() {
        this.saleTotalChangeWin = false;
        this.busiType = '';
        this.batchId = null;
        this.trDir = '';
        this.selectData = [];
        this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
      },
      //查询
      formSearch() {
        this.selectData = []
        this.$refs.datagrid.dataChange(1);
      },
      //重置
      formSearchReset() {
        this.$refs.formItem.resetFields();
      },
      //选择记录
      handleSelectClick(arr) {
        this.selectData[0] = arr[0];
      },
      onCurrentChange(arr, selectInx){
        let tmpArr = [];
        tmpArr.push(arr);
        this.selectData = tmpArr;
      },
      onCurrentChangeCancel(){
        this.selectData = [];
      },
      //新增报价
      createQuote() {
        this.busiType = "BT01";
        this.saleTotalChangeWin = true;
        this.title="报价新增";
      },
      //修改
      editQuote(){
        let list = this.selectData;
        if (list.length == 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        if (list.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return;
        }
        //进入卖出修改报价页面
        this.batchId = list[0].id;
        this.busiType = list[0].busiType;
        this.saleTotalChangeWin = true;
        this.title = "报价修改";
      },
      //删除报价
      delQuoteAppl(){
        let list = this.selectData;
        if (list.length == 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        if (list.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return;
        }
        //卖出和正回购
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("m.i.common.isConfirmDelete") + "?",
          onOk: () => {
            let id = list[0].id;
            post({ id: id }, '/be/market/quote/sale/saleTotalColl/func_deleteSaleBatch').then(res => {
              if (res) {
                let retCode = res.data.retCode
                if (retCode == "000000") {
                  this.$msgTip.success(this);
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
                  this.quoteApplySelectList = [];
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
                  this.selectData = [];
                }
              } else {
                this.$msgTip.error(this, { info: this.$t('m.i.common.netError') });
              }
            });
          }
        });
      },
      //终止报价
      refuseQuote(){
        let list = this.selectData;
        if (list.length == 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        if (list.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return;
        }
        //卖出终止报价地址
        let url = '/be/market/quote/sale/saleTotalColl/func_refuseSaleQuote';
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("确认要终止报价吗") + "?",
          onOk: () => {
            let id = list[0].id;
            post({ id: id }, url).then(res => {
              if (res) {
                let retCode = res.data.retCode
                if (retCode == "000000") {
                  this.$msgTip.success(this);
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                  this.quoteApplySelectList = [];
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo)
                }
              } else {
                this.$msgTip.error(this, { info: this.$t('m.i.common.netError') });
              }
            });
          }
        });
      },
      //报价历史查看
      findQuoteHist(){
        let list = this.selectData;
        if (list.length == 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        if (list.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return;
        }
        let obj = list[0];
        this.quoteNo = obj.quoteNo;
        this.busiType = obj.busiType;
        if("BT01"==this.busiType) {
          this.trDir = "TDD02";
        }else{
          this.trDir = "CRD02";
        }
        this.isQuoteNew = '1';
        this.reqNum = null;
        if (this.quoteNo) {
          this.quoteHistChangeWin = true;
          this.title = "报价历史查看"
        } else {
          this.$msgTip.info(this, { info: this.$t("首次报价无修改历史数据") });
        }
      },
      billDetail(id,busiType) {
        this.batchId = id
        this.busiType=busiType
        this.showProvisionDetil = true
      },
      closeDetil() {
        this.showProvisionDetil=false
        this.batchId = null
      },
      //打印清单
      printing(){}

    },

    mounted() {
      this.getDictListByGroups("CreditMajor,AssetIndustry,CreditDeductRule,QuoteBatchStatus,PreRelationFlag,PreTradeBhvr,CdSelectMode,ClearSpeed,SettleType,ClearType,Yon,QuoteBusiType,TrDir,CDMedia,DraftTypeCode,AcctFlag,QuoteStatus,StlResult,bankLevel,TenorCode,bankType,CreditMajor,billSource,BillOrigin").then(res => {
        this.dictList = {
          busiTypeList:  res.get("QuoteBusiType"),
          trDirList: res.get("TrDir"),
          billClassList: res.get("CDMedia"),
          billTypeList: res.get("DraftTypeCode"),
          acctStatusList: res.get("AcctFlag"),
          dealStatusList: res.get("QuoteStatus"),
          clearStatusList: res.get("StlResult"),
          preTradeBhvrList: res.get("PreTradeBhvr"),
          quoteBatchStatusList: res.get("QuoteBatchStatus"),
          YonList: res.get('Yon'),
          ClearTypeList: res.get('ClearType'),
          SettleType: res.get('SettleType'),
          clearSpeed: res.get('ClearSpeed'),
          CdSelectMode: res.get('CdSelectMode'),
          creditDeductRuleList: res.get("CreditDeductRule"),
          bankLevelList:res.get("bankLevel"),
          TenorCodeList:res.get("TenorCode"),
          bankTypeList:res.get("bankType"),
          assetIndustryList:res.get("AssetIndustry"),
          CreditMajorList:res.get("CreditMajor"),
          dictListMap: res.get("map"),
          billSourceList: res.get("billSource"),
          billOriginList: res.get("BillOrigin")
        }
        this.dictMap = res.get("map");
      });
    }
  }

</script>
