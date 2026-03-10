<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <batch-no v-model="formItem.batchNo" :maxlength="20"></batch-no>
                <common-input v-model="formItem.brokerBrchName" :label="$t('m.i.be.otherBrchName')" prop="brokerBrchName" :showIcon="true" @on-click="brchCodeWinOpen()"
                              clearable :clearVal="clearVal" clearValTag="brokerBrchName" readonly></common-input>
                <common-input v-model="formItem.brokerBrchCode" prop="brokerBrchCode" v-if="false"></common-input>
                <common-input v-model="formItem.brokerTraderName" :label="$t('m.i.be.custTraderName')" prop="brokerTraderName" :showIcon="true"
                              @on-click="showtrader = true" clearable :clearVal="clearVal" clearValTag="brokerTraderName" class="h-form-long-label" readonly></common-input>
                <common-input v-model="formItem.brokerTraderNo" prop="brokerTraderNo" v-if="false"></common-input>
                <common-input v-model="formItem.quoteNo" :label="$t('m.i.be.quoteNo')" prop="quoteNo" :maxlength="20"></common-input>
                <common-select v-model="formItem.tradeMode" :label="$t('m.i.be.sourceTransMode')" prop="tradeMode" :dictList="sourceTransModeList"></common-select>
                <common-input v-model="formItem.busiNo" :label="$t('m.i.be.sourceBusiNo')" prop="busiNo" :maxlength="20" class="h-form-long-label"></common-input>
                <query-btn :advanceShow="true" @showChange="showChange" :formSearch="handleSearch"
                           :formSearchReset="resetSearch"></query-btn>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid
              :columns="columns"
              highlightRow
              url="/be/discquote/disc/quote/quoteApplyMain/func_getDiscQuoteApplyList"
              :bindForm="formItem"
              :onCurrentChange="handleCurrentChange"
              :onCurrentChangeCancel="handleCurrentChangeCancel"
              ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="modify">{{$t("m.i.common.modify")}}</h-button>
              <h-button type="primary" @click="cancelChangeToQuot">{{$t("m.i.be.cancelChangeToQuot")}}</h-button>
              <h-button type="primary" @click="stopQuoteAppl">{{$t("m.i.be.stopQuoteAppl")}}</h-button>
              <h-button type="primary" @click="findQuoteHist">{{$t("m.i.be.findQuoteHist")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <quote-apply-main-add :quoteApplyMainAddWin="quoteApplyMainAddWin" :batchParams="batchParams" @quoteApplyMainAddWinClose="quoteApplyMainAddWinClose"></quote-apply-main-add>
    <brch-code-search :brchCodeWin="brchCodeWinBrch" @brchCodeWinClose="brchCodeWinClose"
                      @brchCodeChange="brchCodeChange" optType="2"></brch-code-search>
    <trader-id-search :traderIdWin="showtrader" :brchCode="formItem.brokerBrchCode" @traderIdWinClose="userTraderWinClose" @traderIdChange="userTraderChange"></trader-id-search>
    <quote-apply-detail :quoteApplyDetailWin="quoteApplyDetailWin" :detailParams="detailParams" :billsUrl="billsUrl" :batchUrl="batchUrl"
                        @quoteApplyDetailWinClose="quoteApplyDetailWinClose" :exportUrl="exportUrl"></quote-apply-detail>
    <quote-hist-change trDir="TDD01" :quoteNo="quoteHisParams.quoteNo" :isQuoteNew="quoteHisParams.isQuoteNew" :reqNum="quoteHisParams.reqNum"
                       :initURL="quoteHisParams.initURL" :billListURL="quoteHisParams.billListURL" :quoteHistChangeWin="quoteHistChangeWin"
                       :dictMap="quoteHisParams.dictMap" @quoteHistChangeWinClose="quoteHistChangeWinClose"></quote-hist-change>
  </div>
</template>

<script>
  import { post, formatNumber, getDictValueFromMap } from "@/api/bizApi/commonUtil";

  export default {
    name: "quoteApplyMain",
    components:{
      QuoteApplyMainAdd: () => import(/* webpackChunkName: "be/discquote/disc/quote/quoteApplyMainAdd" */`@/views/bizViews/be/discquote/disc/quote/quoteApplyMainAdd`),
      BrchCodeSearch: () => import(/* webpackChunkName: "sm/auth/branch/cpesBrchCodeSearch" */`@/views/bizViews/sm/auth/branch/cpesBrchCodeSearch`),
      QuoteApplyDetail: () => import(/* webpackChunkName: "be/discquote/disc/quote/quoteApplyDetail" */`@/views/bizViews/be/discquote/disc/quote/quoteApplyDetail`),
      QuoteHistChange: () => import(/* webpackChunkName: "be/discquote/hist/quoteHistChange" */`@/views/bizViews/be/discquote/hist/quoteHistChange`),
      TraderIdSearch:()=>import(/* webpackChunkName: "shcpe/cpes/trader/traderIdSearch" */`@/views/bizViews/shcpe/cpes/trader/traderIdSearch`),
    },
    data(){
      return {
        formItem: {
          brokerBrchName:"",
          brokerBrchCode:"",
          brokerTraderName:"",
          brokerTraderNo:"",
          quoteNo:"",
          tradeMode:"",
          busiNo:"",
        },
        batchParams: {},
        detailParams: {},
        quoteHisParams: {
          dictMap: {},
          quoteNo: "",
          isQuoteNew: "",
          reqNum: "",
          initURL: "/be/discquote/disc/quote/quoteApplyMain/func_findQuoteHist",
          billListURL: "/be/discquote/disc/quote/quoteApplyMain/func_findQuoteHistBill",
        },
        columns:[
          {
            type: "radio",
            title: " ",
            key: "multiSelect",
            width: 60,
            hiddenCol: false
          },
          {
            type: "index",
            key: "numOrder",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.batchNo"),
            key: "batchNo",
            hiddenCol: false,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showDetail(params.row.id);
                  }
                }
              }, params.row.batchNo);
            }
          },
          {
            title: this.$t('m.i.be.quoteMode'),
            key: 'quoteMode',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, 'QuoteMode', params.row.quoteMode);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.common.status'),
            key: 'quoteStatus',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue =getDictValueFromMap(this.dictMap, 'DCQuoteStatus', params.row.quoteStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.common.operateFlag'),
            key: 'quoteOp',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue =getDictValueFromMap(this.dictMap, 'QuoteOp', params.row.quoteOp);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.be.quoteNo"),
            key: "quoteNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.be.sourceBusiNo"),
            key: "busiNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.busiType'),
            key: 'busiType',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue =getDictValueFromMap(this.dictMap, 'DCBusiType', params.row.busiType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.be.otherBrchName"),
            key: "brokerBrchName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.be.custTraderName"),
            key: "brokerTraderName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.discountApplyName"),
            key: "discCustName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.discountApplySocCode"),
            key: "discOutSocCode",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.be.discCorpScale"),
            key: "discCorpScale",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "CorpScale", params.row.discCorpScale);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.be.discIndustry"),
            key: "discIndustry",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "Industry", params.row.discIndustry);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.be.isDiscArc"),
            key: "isDiscArc",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "Yon", params.row.isDiscArc);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.be.isDiscGreen"),
            key: "isDiscGreenCorp",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "Yon", params.row.isDiscGreenCorp);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.be.isDiscTechnologyCorp"),
            key: "isDiscTechnologyCorp",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "Yon", params.row.isDiscTechnologyCorp);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.be.isDiscPrivateCorp"),
            key: "isDiscPrivateCorp",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "Yon", params.row.isDiscPrivateCorp);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.be.discProv"),
            key: "area",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "Province", params.row.area);
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
              let dictValue = this.getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.billInfo.billClass"),
            key: "billClass",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "CDMedia", params.row.billClass);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.be.totalNum"),
            key: "totalNum",
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t("m.i.be.totalAmtByYUAN"),
            key: "totalAmt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("p", formatNumber(params.row.totalAmt, 2, ","));
            }
          },
          {
            title: this.$t("m.i.pe.discRate"),
            key: "ratePct",
            hiddenCol: false,
            sortable: true,
            sortMethod:(a,b,type)=>{
              if (type==="asc") {
                let a1=parseFloat(a);
                let a2=parseFloat(b);
                if (isNaN(a1)) return -1;
                if (isNaN(a2)) return 1;
                return a1-a2;
              }else if (type==="desc") {
                let a1=parseFloat(a);
                let a2=parseFloat(b);
                if (isNaN(a1)) return 1;
                if (isNaN(a2)) return -1;
                return a2-a1;
              }
            }
          },
          {
            title: this.$t("m.i.be.remainingPeriod"),
            key: "remainDays",
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t("m.i.be.settleDt"),
            key: "firstSettleDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let settleDt = this.$moment(params.row.firstSettleDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", settleDt);
            }
          },
          {
            title: this.$t('m.i.be.quoteTm'),
            key: 'quoteTm',
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.isSubDeal'),
            key: 'subDeal',
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
            title: this.$t("m.i.be.clearSpeed"),
            key: "clearSpeed",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "ClearSpeed", params.row.clearSpeed);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.be.settleMode"),
            key: "clearMode",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "DiscClearMode", params.row.clearMode);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.be.payInterestByUnit"),
            key: "firstPayInterest",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("p", formatNumber(params.row.firstPayInterest, 2, ","));
            }
          },
          {
            title: this.$t("m.i.be.settleAmtByUnit"),
            key: "firstSettleAmt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("p", formatNumber(params.row.firstSettleAmt, 2, ","));
            }
          },
          {
            title: this.$t("m.i.be.sourceTransMode"),
            key: "tradeMode",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "SourceTransMode", params.row.tradeMode);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.be.discOutBankNo"),
            key: "discOutBankNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.be.fileNum"),
            key: "fileNum",
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t("m.i.common.dealPrcMsg"),
            key: "dealPrcMsg",
            hiddenCol: false
          }
        ],
        sourceTransModeList: [],
        quoteModeList: [],
        billTypeList: [],
        billClassList: [],
        corpScaleList: [],
        industryList: [],
        yonList: [],
        clearSpeedList: [],
        discClearModeList: [],
        DCBusiTypeList: [],
        dictMap: new Map(),
        ifShowMore: false,
        quoteApplyMainAddWin: false,
        brchCodeWinBrch: false,
        quoteApplyDetailWin: false,
        quoteHistChangeWin: false,
        brokerBrchCode: "",
        showtrader : false,
        billsUrl: "/be/discquote/disc/quote/quoteApplyMain/func_getQuoteBillList",
        batchUrl: "/be/discquote/disc/quote/quoteApplyMain/func_getQuoteBatch",
        exportUrl: "/be/discquote/disc/quote/quoteApplyMain/func_downloadDiscDelistBill",
        filePathUrl: "/be/discquote/disc/quote/quoteApplyMain/"
      }
    },
    mounted() {
      this.getDictListByGroups("SourceTransMode,QuoteMode,DraftTypeCode,CDMedia,CorpScale,Industry,Yon,Province,ClearSpeed,DiscClearMode,PreRelationFlag,DCQuoteStatus,QuoteOp,DiscStlResult,DCBusiType").then(res => {
        this.sourceTransModeList = res.get("SourceTransMode");
        this.quoteModeList = res.get("QuoteMode");
        this.billTypeList = res.get("DraftTypeCode");
        this.billClassList = res.get("CDMedia");
        this.corpScaleList = res.get("CorpScale");
        this.industryList = res.get("Industry");
        this.yonList = res.get("Yon");
        this.provinceList = res.get("Province");
        this.clearSpeedList = res.get("ClearSpeed");
        this.discClearModeList = res.get("DiscClearMode");
        this.DCBusiTypeList = res.get("DCBusiType");
        this.dictMap = res.get("map");
      });
    },
    methods:{
      showChange(val) {
        this.ifShowMore = val;
      },
      //查询
      handleSearch(pageNo) {
        this.currentSelectRow = null;
        this.$refs.datagrid.dataChange(!!pageNo ? pageNo : 1);
      },
      //重置表单查询结果
      resetSearch() {
        this.formItem.brokerBrchCode = '';
        this.formItem.brokerTraderNo = '';
        this.$refs.formItem.resetFields();
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = null;
      },
      brchCodeWinOpen() {
        this.brchCodeWinBrch = true;
      },
      brchCodeWinClose() {
        this.brchCodeWinBrch = false;
      },
      brchCodeChange(info) {
        this.formItem.brokerBrchName = info.brchFullNameZh;
        this.formItem.brokerBrchCode = info.brchCode;
        this.formItem.brokerTraderNo = "";
        this.formItem.brokerTraderName = "";
        this.brchCodeWinBrch = false;
      },
      userTraderChange(info) {
        if (info === null) {
          this.$msgTip.error(this, { info: "请先选择记录！" });
          return;
        }
        this.formItem.brokerTraderNo = info.traderId;
        this.formItem.brokerTraderName = info.traderName;
        this.formItem.brokerBrchCode = info.brchCode;
        this.formItem.brokerBrchName = info.brchFullNameZh;
        this.showtrader = false;
      },
      userTraderWinClose() {
        this.showtrader = false;
      },
      clearVal(type){
        if(type == 'brokerBrchName'){
          this.formItem.brokerBrchName = '';
          this.formItem.brokerBrchCode = '';
        }
        if(type == 'brokerTraderName'){
          this.formItem.brokerTraderNo = '';
          this.formItem.brokerTraderName = '';
        }
      },
      modify(){
        if (this.currentSelectRow) {
          this.batchParams.batchId = this.currentSelectRow.id;
          this.batchParams.sourceTransModeList = this.sourceTransModeList;
          this.batchParams.quoteModeList = this.quoteModeList;
          this.batchParams.billTypeList = this.billTypeList;
          this.batchParams.billClassList = this.billClassList;
          this.batchParams.corpScaleList = this.corpScaleList;
          this.batchParams.industryList = this.industryList;
          this.batchParams.yonList = this.yonList;
          this.batchParams.provinceList = this.provinceList;
          this.batchParams.clearSpeedList = this.clearSpeedList;
          this.batchParams.discClearModeList = this.discClearModeList;
          this.batchParams.DCBusiTypeList = this.DCBusiTypeList;
          this.batchParams.dictListMap = this.dictMap;
          this.quoteApplyMainAddWin = true;
        }else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      quoteApplyMainAddWinClose(){
        this.currentSelectRow = null;
        this.handleSearch(1);
        this.quoteApplyMainAddWin = false;
      },
      cancelChangeToQuot(){
        if (this.currentSelectRow) {
          this.$hMsgBox.confirm({
            title: "撤销信息",
            content: "确定要撤销转对话报价吗？",
            onOk: () => {
              let params = {batchId: this.currentSelectRow.id};
              let url = "/be/discquote/disc/quote/quoteApplyMain/func_cancelChangeQuote";
              this.sendPost(params, url);
            }
          });
        }else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      stopQuoteAppl(){
        if (this.currentSelectRow) {
          this.$hMsgBox.confirm({
            title: "终止报价信息",
            content: "确定要终止报价吗？",
            onOk: () => {
              let params = {batchId: this.currentSelectRow.id, answerFlag: "1"};
              let url = "/be/discquote/disc/quote/quoteApplyMain/func_sendQuoteMsg";
              this.sendPost(params, url);
            }
          });
        }else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      findQuoteHist(){
        if (this.currentSelectRow) {
          post({ quoteNo: this.currentSelectRow.quoteNo}, "/be/discquote/disc/quote/quoteApplyMain/func_quoteHist").then(res => {
            if (res) {
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.quoteHisParams.quoteNo = this.currentSelectRow.quoteNo;
                this.quoteHisParams.isQuoteNew = "1";

                this.quoteHisParams.dictMap.dcBusiTypeList = this.DCBusiTypeList;
                this.quoteHisParams.dictMap.billTypeList = this.billTypeList;
                this.quoteHisParams.dictMap.billClassList = this.billClassList;
                this.quoteHisParams.dictMap.corpScaleList = this.corpScaleList;
                this.quoteHisParams.dictMap.industryList = this.industryList;
                this.quoteHisParams.dictMap.yonList = this.yonList;
                this.quoteHisParams.dictMap.provinceList = this.provinceList;
                this.quoteHisParams.dictMap.clearSpeedList = this.clearSpeedList;
                this.quoteHisParams.dictMap.discClearModeList = this.discClearModeList;

                this.quoteHistChangeWin = true;
              } else {
                this.$msgTip.error(this, { info: res.data.retMsg });
              }
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            }
          });
        }else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      quoteHistChangeWinClose(){
        this.handleSearch(1);
        this.currentSelectRow = null;
        this.quoteHistChangeWin = false;
      },
      showDetail(id){
        this.detailParams.dictMap = this.dictMap;
        this.detailParams.batchId = id;
        this.detailParams.filePathUrl = this.filePathUrl;
        this.quoteApplyDetailWin = true;
      },
      quoteApplyDetailWinClose(){
        this.handleSearch(1);
        this.currentSelectRow = null;
        this.quoteApplyDetailWin = false;
      },
      sendPost(params, url) {
        post(params, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.currentSelectRow = null;
              this.handleSearch(1);
              this.$msgTip.success(this);
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      }
    }
  };
</script>

<style scoped>

</style>
