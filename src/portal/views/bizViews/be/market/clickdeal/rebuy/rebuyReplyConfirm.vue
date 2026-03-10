<!--点击成交-买入应答交易确认-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <batch-no v-model="formItem.batchNo"></batch-no>
                <common-input v-model="formItem.quoteNo" :label="$t('m.i.be.quoteNo')" prop="quoteNo"></common-input>
                <bill-type v-model="formItem.billType" :dictList="billTypeList"></bill-type>
                <bill-class v-model="formItem.billClass" :dictList="billClassList"></bill-class>
                <show-cpes-branch  :label="$t('m.i.be.otherBrchName')"
                                   :brchCode.sync="formItem.saleBrchCode"  :cpesBrchName.sync="formItem.saleBrchName"
                                   datagridUrl="/cpes/branch/queryBranchList" prop="saleBrchName"
                                   queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>

                <h-form-item :label="$t('m.i.be.custTraderName')" prop="saleTraderName" :label-width="110">
                  <h-input v-model="formItem.saleTraderName" readonly
                           icon="android-search" @on-click="queryTraderId()"></h-input>
                </h-form-item>
                <query-btn :advanceShow="true" @showChange="showChange" :formSearch="handleSearch"
                           :formSearchReset="resetSearch"></query-btn>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid
            :columns="columns"
            highlightRow
            url="/be/market/clickdeal/rebuy/rebuyReplyConfirm/func_getClickDealRebuySubCheckBatch"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="quoteDeal">{{$t('m.i.be.quoteDeal')}}</h-button>
              <h-button type="primary" @click="returnApply">{{$t('m.i.be.returnApply')}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--交易对手类型查看-->
    <show-trans-brch-type :transBrchTypeWin="showTransBrchTypeWin" displayType="show"
                          :transBrchTypeParams="showTransBrchTypeParams" @transBrchTypeWinClose="showTransBrchTypeWinClose"
                          datagridUrl="/be/market/clickdeal/rebuy/rebuyReplyConfirm/func_queryBranchClass"></show-trans-brch-type>
    <rebuy-detail :batchId="batchId" :dictMap="dictMap" busiType="BT01" :rebuyDetailWin="rebuyDetailWin"
                  @closeMsgBox="rebuyDetailWinClose" :rootUrl="rootUrl"></rebuy-detail>
    <!-- 交易员查询弹出框 -->
    <trader-id-search :traderIdWin="traderIdWin" @traderIdWinClose="traderIdWinClose"
                      @traderIdChange="traderIdChange"></trader-id-search>
  </div>
</template>

<script>
  import { post, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "rebuyReplyConfirm",
    components: {
      RebuyDetail: () => import(/* webpackChunkName: "be/market/clickdeal/rebuy/quoteRebuyDetail" */`@/views/bizViews/be/market/clickdeal/rebuy/quoteRebuyDetail`),
      ShowTransBrchType: () => import(/* webpackChunkName: "be/market/common/showTransBrchType" */`@/views/bizViews/be/market/common/showTransBrchType`),
      //BrchCodeSearch: () => import(/* webpackChunkName: "sm/auth/branch/cpesBrchCodeSearch" */`@/views/bizViews/sm/auth/branch/cpesBrchCodeSearch`),
      TraderIdSearch: () => import(/* webpackChunkName: "shcpe/cpes/trader/traderIdSearch" */`@/views/bizViews/shcpe/cpes/trader/traderIdSearch`)
    },
    data() {
      return {
        formItem: {
          batchNo: "",
          quoteNo:"",
          billType: "",
          billClass: "",
          saleBrchCode: "",
          saleBrchName: "",
          saleTraderNo: "",
          saleTraderName: "",
        },
        columns: [
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
            sortable: true,
            render: (h, params) => {
              return h('a', {
                on: {
                  click: () => {
                    this.showRebuyDetil(params.row.id)
                  }
                }
              }, params.row.batchNo)
            }
          },
          {
            title: this.$t("m.i.be.quoteNo"),
            key: "quoteNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.be.quoteRelationNo"),
            key: "quoteRelationNo",
            sortable: true,
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.common.busiType"),
            key: "busiType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "BusiType", params.row.busiType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.common.dealStatus"),
            key: "dealStatus",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "QuoteStatus", params.row.dealStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.be.preTradeBhvr"),
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
          },
          {
            title: this.$t("m.i.common.dealDtTm"),
            key: "dealDtTm",
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.dealDtTm == null || params.row.dealDtTm === "") {
                return "";
              }
              let dealDtTm = params.row.dealDtTm.toString();
              if (params.row.dealDtTm.toString().length < 6) {
                for (let i = 0; i < (6 - params.row.dealDtTm.toString().length); i++) {
                  dealDtTm = "0" + dealDtTm;
                }
              }
              let date = this.$moment(dealDtTm, "HH:mm:ss").format("HH:mm:ss");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.be.otherBrchName"),
            key: "saleBrchName",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.be.custProductNo"),
            key: "saleProductName",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.be.custTraderName"),
            key: "saleTraderName",
            hiddenCol: false,
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
              let list = this.getDictValueFromMap(this.dictMap, "CDMedia", params.row.billClass);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.pe.dealRate"),
            key: "ratePct",
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t("m.i.be.subDeal"),
            key: "subDeal",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "Yon", params.row.subDeal);
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
            title: this.$t("m.i.be.settleMode"),
            key: "settleMode",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "SettleType", params.row.settleMode);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.be.clearType"),
            key: "clearType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "ClearType", params.row.clearType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.be.quoteTm"),
            key: "quoteTm",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.quoteTm == null || params.row.quoteTm === "") {
                return "";
              }
              let quoteTm = params.row.quoteTm.toString();
              if (params.row.quoteTm.toString().length < 6) {
                for (let i = 0; i < (6 - params.row.quoteTm.toString().length); i++) {
                  quoteTm = "0" + quoteTm;
                }
              }
              let date = this.$moment(quoteTm, "HH:mm:ss").format("HH:mm:ss");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.be.setTm"),
            key: "setTm",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.setTm == null || params.row.setTm === "") {
                return "";
              }
              let setTm = params.row.setTm.toString();
              if (params.row.setTm.toString().length < 6) {
                for (let i = 0; i < (6 - params.row.setTm.toString().length); i++) {
                  setTm = "0" + setTm;
                }
              }
              let date = this.$moment(setTm, "HH:mm:ss").format("HH:mm:ss");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.common.totalAmtBillPackage"),
            key: "totalAmt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("p", formatNumber(params.row.totalAmt, 2, ","));
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
            title: this.$t("m.i.be.tenorDays"),
            key: "tenorDays",
            sortable: true,
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.common.totalNumBillPackage"),
            key: "totalNum",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.common.dealPrcMsg"),
            key: "dealPrcMsg",
            hiddenCol: false,
          },
        ],
        currentSelectRow: null,
        //是否显示更多查询项
        ifShowMore: false,
        dictMap: new Map(),
        billTypeList: [],
        billClassList: [],
        assetIndustryList: [],
        busiTypeList: [],
        trDirList: [],
        isList: [],
        tradeRangeList: [],
        clearSpeedList: [],
        settleTypeList: [],
        clearTypeList: [],
        creditMajorList: [],
        clearModeList: [],
        brchClassList: [],
        saleApplyAddOrEditWin: false,
        batchParams: {},
        showTransBrchTypeWin: false,
        showTransBrchTypeParams: {},
        rebuyDetailWin: false,
        rootUrl:"/be/market/clickdeal/rebuy/rebuyReplyConfirm",
        detailParams: {},
        brchClassMap: new Map(),
        //brchCodeWin:false,
        traderIdWin:false,
        optType:"",
        batchId: "",
      };
    },
    mounted() {
      this.getDictListByGroups("QuoteBusiType,BusiType,AssetIndustry,TrDir,Yon,TradeRange,DraftTypeCode,CDMedia,ClearSpeed,SettleType,ClearType,CreditMajor,ClearMode,BrchClass,QuoteStatus,PreRelationFlag,PreTradeBhvr,BillOrigin").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.billClassList = res.get("CDMedia");
        this.assetIndustryList = res.get("AssetIndustry");
        this.busiTypeList = res.get("BusiType");
        this.trDirList = res.get("TrDir");
        this.isList = res.get("Yon");
        this.tradeRangeList = res.get("TradeRange");
        this.clearSpeedList = res.get("ClearSpeed");
        this.settleTypeList = res.get("SettleType");
        this.clearTypeList = res.get("ClearType");
        this.creditMajorList = res.get("CreditMajor");
        this.clearModeList = res.get("ClearMode");
        this.brchClassList = res.get("BrchClass");
        this.brchClassList.forEach(x => {
          return this.brchClassMap.set(x.key, x.value)
        });
        this.dictMap = res.get("map");
      });
    },
    methods: {
      showChange(val) {
        this.ifShowMore = val;
      },
      //表单查询
      handleSearch(pageNo) {
        this.currentSelectRow = null;
        this.$refs.datagrid.dataChange(!!pageNo ? pageNo : 1);
      },
      //重置表单查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
        this.formItem.saleBrchCode = "";
        this.formItem.saleTraderNo = "";
        this.formItem.saleBrchName = "";
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = null;
      },
      //根据弹框所选数据进行赋值
      /*brchCodeChange(info) {
        if (info === null) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.formItem.saleBrchCode = info.brchCode;
        this.formItem.saleBrchName = info.brchFullNameZh;
        this.brchCodeWin = false;
      },*/
      //关闭查询票交机构窗口
      /*brchCodeWinClose() {
        this.brchCodeWin = false;
      },*/
      //根据弹框所选数据进行赋值
      traderIdChange(info) {
        if (info === null) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.formItem.saleTraderNo = info.traderId;
        this.formItem.saleTraderName = info.traderName;
        this.traderIdWin = false;
      },
      //关闭查询交易员窗口
      traderIdWinClose() {
        this.traderIdWin = false;
      },
      //票交机构弹出框
      /*queryCpesBrchCode() {
        this.optType = "2";
        this.brchCodeWin = true;
      },*/
      //交易员弹出框
      queryTraderId() {
        this.traderIdWin = true;
      },
      quoteDeal(){
        if (this.currentSelectRow != null) {
          this.$hMsgBox.confirm({
            title: "成交确认",
            content: "确定要报价成交吗？",
            onOk: () => {
              let params={batchId:this.currentSelectRow.id};
              this.sendPost(params, "/be/market/clickdeal/rebuy/rebuyReplyConfirm/func_sendClickSubQuoteApply");
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      returnApply(){
        if (this.currentSelectRow != null) {
          this.$hMsgBox.confirm({
            title: "退回信息",
            content: "确定要退回申请吗？",
            onOk: () => {
              let params={batchId:this.currentSelectRow.id};
              this.sendPost(params, "/be/market/clickdeal/rebuy/rebuyReplyConfirm/func_replyCancelClickSubApply");
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      sendPost(params, url) {
        post(params, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.handleSearch(this.$refs.datagrid.pageInfo.pageNo);
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      showTransBrchType(batchId,operate) {
        this.showTransBrchTypeParams = {
          batchId: batchId,
          operate: operate
        };
        this.showTransBrchTypeWin = true;
      },
      showTransBrchTypeWinClose() {
        this.showTransBrchTypeParams = {};
        this.showTransBrchTypeWin = false;
      },
      showRebuyDetil(batchId) {
        this.batchId = batchId;
        this.rebuyDetailWin = true;
      },
      rebuyDetailWinClose() {
        this.batchId = "";
        this.rebuyDetailWin = false;
      }
    }
  };
</script>

<style scoped>

</style>
