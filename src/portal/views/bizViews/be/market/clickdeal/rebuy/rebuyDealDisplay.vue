<!--点击成交-买入点击成交展示-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search" onlyBlurRequire>
                <common-input v-model="formItem.saleBranchName" :label="$t('m.i.be.reqBranch')"
                              prop="saleBranchName"></common-input>
                <common-input v-model="formItem.quoteNo" :label="$t('m.i.be.quoteNo')" prop="quoteNo"></common-input>
                <bill-type v-model="formItem.billType" :dictList="billTypeList"></bill-type>
                <bill-class v-model="formItem.billClass" :dictList="billClassList"></bill-class>
                <common-rate-range v-model="formItem" :label="$t('m.i.pe.dealRate')"  :integerNum="2"
                                   :suffixNum="4" :rangeProps="['minRate','maxRate']"
                                   :validRules="rateRule"></common-rate-range>
                <bill-money-range :label="$t('m.i.billInfo.billPackageMoney')" v-model="formItem" :rangeProps="['minSumAmt','maxSumAmt']" className="h-form-long-label"></bill-money-range>
                <common-select v-model="formItem.tradeRange" :label="$t('m.i.be.tradeRange')" prop="tradeRange"
                               :dictList="tradeRangeList"></common-select>
                <common-select v-model="formItem.creditBranchClass"
                               :label="$t('m.i.billInfo.creditMainBankType')" prop="creditBranchClass"
                               :dictList="creditMajorList"></common-select>
                <query-btn @showChange="showChange" :formSearch="handleSearch"
                           :formSearchReset="resetSearch"></query-btn>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格-->
          <h-datagrid
            :columns="columns"
            highlightRow
            url="/be/market/clickdeal/rebuy/rebuyDealDisplay/func_getClickDealRebuyRcvBatch"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="rebuyDealAccept()">{{$t("m.i.common.acceptance")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--受理-->
    <rebuy-deal-display-acpt :saleOrRebuyDealDisplayAcptWin="rebuyDealDisplayAcptWin" :batchParams="batchParams"
                             displayType="rebuy" @saleOrRebuyDealAcptWinClose="rebuyDealDisplayAcptWinClose"
                             dataGridUrl="/be/market/clickdeal/rebuy/rebuyDealDisplay/func_getClickDealRebuyBillList"></rebuy-deal-display-acpt>
    <!--交易对手类型查看-->
    <show-trans-brch-type :transBrchTypeWin="showTransBrchTypeWin" displayType="show"
                          :transBrchTypeParams="showTransBrchTypeParams"
                          @transBrchTypeWinClose="showTransBrchTypeWinClose"
                          datagridUrl="/be/market/clickdeal/rebuy/rebuyDealDisplay/func_queryBranchClass"></show-trans-brch-type>
    <!--批次链接详细展示框-->
    <rebuy-deal-display-detail :saleOrRebuyDetailWin="rebuyDetailWin" :detailParams="detailParams"
                               @rebuyDetailWinClose="rebuyDetailWinClose"></rebuy-deal-display-detail>
  </div>
</template>

<script>
  import { post, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "rebuyDealDisplay",
    components: {
      RebuyDealDisplayAcpt: () => import(/* webpackChunkName: "be/market/clickdeal/common/saleOrRebuyDealDisplayAcpt" */`@/views/bizViews/be/market/clickdeal/common/saleOrRebuyDealDisplayAcpt`),
      RebuyDealDisplayDetail: () => import(/* webpackChunkName: "be/market/clickdeal/rebuy/rebuyDealDisplayDetail" */`@/views/bizViews/be/market/clickdeal/rebuy/rebuyDealDisplayDetail`),
      ShowTransBrchType: () => import(/* webpackChunkName: "be/market/common/showTransBrchType" */`@/views/bizViews/be/market/common/showTransBrchType`)
    },
    data() {
      return {
        rateRule: [{ test: this.validRate, trigger: "blur" }],
        formItem: {
          saleBranchName: "",
          quoteNo: "",
          billType: "",
          billClass: "",
          minRate: "",
          maxRate: "",
          minSumAmt: "",
          maxSumAmt: "",
          tradeRange: "",
          creditBranchClass: ""
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
              return h("a", {
                on: {
                  click: () => {
                    this.showRebuyDetil(params.row.id);
                  }
                }
              }, params.row.batchNo);
            }
          },
          {
            title: this.$t("m.i.be.quoteStatus"),
            key: "quoteStatus",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "QuoteStatus", params.row.quoteStatus);
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
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.be.quoteRelationNo"),
            key: "quoteRelationNo",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.be.forwardNum"),
            key: "forwardNum",
            hiddenCol: false
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
            title: this.$t("m.i.be.tradDir"),
            key: "trDir",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "TrDir", params.row.trDir);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.be.isAnony"),
            key: "isAnony",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "Yon", params.row.isAnony);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.be.tradeRange"),
            key: "tradeRange",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "TradeRange", params.row.tradeRange);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.be.reqBranch"),
            key: "saleBrchName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.be.reqProductId"),
            key: "saleProductName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.be.reqUser"),
            key: "saleTraderNo",
            hiddenCol: false
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
            sortable: true
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
            key: "settleDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let settleDt = this.$moment(params.row.settleDt, "YYYYMMDD").format("YYYY-MM-DD");
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
            title: this.$t("m.i.be.transClearMode"),
            key: "transClearMode",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "ClearMode", params.row.transClearMode);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
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
            title: this.$t("m.i.be.undealTotalAmt"),
            key: "undealTotalAmt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h("p", formatNumber(params.row.undealTotalAmt, 2, ","));
            }
          },
          {
            title: this.$t("m.i.common.totalNumBillPackage"),
            key: "totalNum",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.be.undealTotalNum"),
            key: "undealTotalNum",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.be.payInterestByUnit"),
            key: "interest",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h("p", formatNumber(params.row.interest, 2, ","));
            }
          },
          {
            title: this.$t("m.i.be.settleAmtByUnit"),
            key: "settleAmt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h("span", formatNumber(params.row.settleAmt, 2, ","));
            }
          },
          {
            title: this.$t("m.i.be.tenorDays"),
            key: "tenorDays",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.be.yieldRate"),
            key: "yieldRatePct",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.be.transCustType"),
            key: "transCustType",
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.transCustType == null || params.row.transCustType === "") {
                return "-"
              }
              return h("a", {
                on: {
                  click: () => {
                    this.showTransBrchType(params.row.id,"tradeClass");
                  }
                }
              }, "查看");
            }
          },
        ],
        currentSelectRow: [],
        //是否显示更多查询项
        ifShowMore: false,
        dictMap: new Map(),
        billTypeList: [],
        billClassList: [],
        isList: [],
        tradeRangeList: [],
        clearSpeedList: [],
        settleTypeList: [],
        clearTypeList: [],
        creditMajorList: [],
        brchClassList: [],
        assetIndustryList:[],
        brchClassMap: new Map(),
        rebuyDealDisplayAcptWin: false,
        batchParams: {},
        showTransBrchTypeWin: false,
        showTransBrchTypeParams: {},
        rebuyDetailWin: false,
        detailParams: {}
      };
    },
    mounted() {
      this.getDictListByGroups("BusiType,AssetIndustry,TrDir,Yon,TradeRange,DraftTypeCode,CDMedia,ClearSpeed,SettleType,ClearType,CreditMajor,BrchClass,PreRelationFlag,QuoteStatus,ClearMode,BillOrigin").then(res => {
        this.busiTypeList = res.get("BusiType");
        this.billTypeList = res.get("DraftTypeCode");
        this.billClassList = res.get("CDMedia");
        this.isList = res.get("Yon");
        this.tradeRangeList = res.get("TradeRange");
        this.clearSpeedList = res.get("ClearSpeed");
        this.settleTypeList = res.get("SettleType");
        this.clearTypeList = res.get("ClearType");
        this.creditMajorList = res.get("CreditMajor");
        this.brchClassList = res.get("BrchClass");
        this.assetIndustryList = res.get("AssetIndustry");
        this.brchClassList.forEach(x => {
          return this.brchClassMap.set(x.key, x.value);
        });
        this.dictMap = res.get("map");
      });
    },
    methods: {
      validRate(rule, val, callback) {
        if (this.formItem.minRate === "" || this.formItem.maxRate === "") {
          callback();
          return;
        }
        if (this.formItem.minRate > this.formItem.maxRate) {
          callback(new Error("最大交易利率不能小于最小交易利率"));
        } else {
          callback();
        }
      },
      showChange(val) {
        this.ifShowMore = val;
      },
      //表单查询
      handleSearch(pageNo) {
        this.$refs["formItem"].validate(valid => {
          if (valid) {
            this.currentSelectRow = [];
            this.$refs.datagrid.dataChange(!!pageNo ? pageNo : 1);
          }
        });
      },
      //重置表单查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      //受理
      rebuyDealAccept() {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          post({ batchId: this.currentSelectRow.id }, "/be/market/clickdeal/rebuy/rebuyDealDisplay/func_checkIsRepeatSign").then(res => {
            if (res) {
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.addSubRebuyBatch();
              } else {
                this.$msgTip.error(this, { info: res.data.retMsg });
              }
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      addSubRebuyBatch(){
        post({ batchId: this.currentSelectRow.id }, "/be/market/clickdeal/rebuy/rebuyDealDisplay/func_signRcvRebuyBatch").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.batchParams.batchId = this.currentSelectRow.id;
              this.batchParams.subBatchId = res.data.retData.id;
              this.batchParams.isInner = res.data.retData.isInner;
              this.assembleParams("accept");
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      assembleParams(optType) {
        this.batchParams.batchType = optType;
        this.batchParams.busiType = "BT01";
        this.batchParams.dictMap = this.dictMap;
        this.batchParams.busiTypeList = this.busiTypeList;
        this.batchParams.billTypeList = this.billTypeList;
        this.batchParams.billClassList = this.billClassList;
        this.batchParams.isList = this.isList;
        this.batchParams.tradeRangeList = this.tradeRangeList;
        this.batchParams.clearSpeedList = this.clearSpeedList;
        this.batchParams.settleTypeList = this.settleTypeList;
        this.batchParams.clearTypeList = this.clearTypeList;
        this.batchParams.creditMajorList = this.creditMajorList;
        this.batchParams.clearModeList = this.clearModeList;
        this.batchParams.brchClassList = this.brchClassList;
        this.batchParams.brchClassMap = this.brchClassMap;
        this.batchParams.queryBatchIdUrl = "/be/market/clickdeal/rebuy/rebuyDealDisplay/func_getRcvRebuyBatchSub";
        this.batchParams.pickBillSubmitUrl = "/be/market/clickdeal/rebuy/rebuyDealDisplay/func_addClickDealRebuyBill";
        this.batchParams.pickDataGridUrl = "/be/market/clickdeal/rebuy/rebuyDealDisplay/func_queryClickDealRebuyBill";
        this.batchParams.importPickBillUploadUrl = "/be/market/clickdeal/rebuy/rebuyDealDisplay/func_batchPickBillStock";
        this.batchParams.calcInterestUrl = "/be/market/clickdeal/rebuy/rebuyDealDisplay/func_calcInterestSub";
        this.batchParams.applySubmitUrl = "/be/market/clickdeal/rebuy/rebuyDealDisplay/func_clickDealSubCommitApply";
        this.batchParams.deleteBillUrl = "/be/market/clickdeal/rebuy/rebuyDealDisplay/func_deleteBillSub";
        this.batchParams.importTemplateUrl = "/be/market/clickdeal/rebuy/rebuyDealDisplay/func_downloadSaleBill";
        this.batchParams.exportBillUrl = "/be/market/clickdeal/rebuy/rebuyDealDisplay/func_downloadRebuyInfo";
        this.batchParams.saveBatchFuncUrl = "/be/market/clickdeal/rebuy/rebuyDealDisplay/func_editClickDealRebuySub";
        this.rebuyDealDisplayAcptWin = true;
      },
      //关闭新增、修改弹窗
      rebuyDealDisplayAcptWinClose() {
        this.rebuyDealDisplayAcptWin = false;
        this.handleSearch(this.$refs.datagrid.pageInfo.pageNo);
        this.batchParams = {};
      },
      showTransBrchType(batchId, operate) {
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
        this.detailParams.batchId = batchId;
        this.detailParams.dictMap = this.dictMap;
        this.detailParams.brchClassMap = this.brchClassMap;
        this.detailParams.batchUrl = "/be/market/clickdeal/rebuy/rebuyDealDisplay/func_getClickDealRebuyBatchDetail";
        this.detailParams.billsUrl = "/be/market/clickdeal/rebuy/rebuyDealDisplay/func_getClickRebuyBillList";
        this.detailParams.exportUrl = "/be/market/clickdeal/rebuy/rebuyDealDisplay/func_downloadSaleInfo";
        this.rebuyDetailWin = true;
      },
      rebuyDetailWinClose() {
        this.detailParams = {};
        this.rebuyDetailWin = false;
      }
    }
  };
</script>

<style scoped>

</style>
