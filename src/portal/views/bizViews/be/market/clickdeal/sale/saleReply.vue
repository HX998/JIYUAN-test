<!--点击成交-卖出应答-->
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
                <h-form-item class="h-form-operate one-form">
                  <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid
              :columns="columns"
              highlightRow
              url="/be/market/clickdeal/sale/saleReply/func_getClickSaleBatchSub"
              :bindForm="formItem"
              :onCurrentChange="handleCurrentChange"
              :onCurrentChangeCancel="handleCurrentChangeCancel"
              ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="modify()">{{$t("m.i.common.modify")}}</h-button>
              <h-button type="primary" @click="deleteTo()">{{$t("m.i.common.delete")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--交易对手类型查看-->
    <show-trans-brch-type :transBrchTypeWin="showTransBrchTypeWin" displayType="show"
                          :transBrchTypeParams="showTransBrchTypeParams"
                          @transBrchTypeWinClose="showTransBrchTypeWinClose"
                          datagridUrl="/be/market/clickdeal/sale/saleDealDisplay/func_queryBranchClass"></show-trans-brch-type>

    <quote-sale-detail :batchId="batchId" :dictMap="dictMap" busiType="BT01" :saleDetailWin="saleDetailWin" :rootUrl="rootUrl"
                 @closeMsgBox="saleDetailWinClose"></quote-sale-detail>
    <!--受理-->
    <sale-deal-display-acpt :saleOrRebuyDealDisplayAcptWin="saleDealDisplayAcptWin" :batchParams="batchParams"
                            @saleOrRebuyDealAcptWinClose="saleDealDisplayAcptWinClose" displayType="sale"
                            dataGridUrl="/be/market/clickdeal/sale/saleReply/func_getClickDealSaleBillList"></sale-deal-display-acpt>
  </div>
</template>

<script>
  import { post, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "saleReply",
    components: {
      QuoteSaleDetail: () => import(/* webpackChunkName: "be/market/clickdeal/sale/quoteSaleDetail" */`@/views/bizViews/be/market/clickdeal/sale/quoteSaleDetail`),
      ShowTransBrchType: () => import(/* webpackChunkName: "be/market/common/showTransBrchType" */`@/views/bizViews/be/market/common/showTransBrchType`),
      SaleDealDisplayAcpt: () => import(/* webpackChunkName: "be/market/clickdeal/common/saleOrRebuyDealDisplayAcpt" */`@/views/bizViews/be/market/clickdeal/common/saleOrRebuyDealDisplayAcpt`),
    },
    data() {
      return {
        formItem: {
          batchNo: ""
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
                    this.showSaleDetil(params.row.id);
                  }
                }
              }, params.row.batchNo);
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
            key: "buyBrchName",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.be.custProductNo"),
            key: "buyProductName",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.be.custTraderName"),
            key: "buyTraderName",
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
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h("p", formatNumber(params.row.firstPayInterest, 2, ","));
            }
          },
          {
            title: this.$t("m.i.be.settleAmtByUnit"),
            key: "firstSettleAmt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h("p", formatNumber(params.row.firstSettleAmt, 2, ","));
            }
          },
          {
            title: this.$t("m.i.be.tenorDays"),
            key: "tenorDays",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.totalNumBillPackage"),
            key: "totalNum",
            hiddenCol: false
          }
        ],
        dictList: {},
        batchId: null,
        title: "",
        currentSelectRow: null,
        //是否显示更多查询项
        ifShowMore: false,
        dictMap: new Map(),
        billTypeList: [],
        billClassList: [],
        busiTypeList: [],
        assetIndustryList: [],
        trDirList: [],
        isList: [],
        tradeRangeList: [],
        clearSpeedList: [],
        settleTypeList: [],
        clearTypeList: [],
        creditMajorList: [],
        clearModeList: [],
        brchClassList: [],
        billOriginList: [],
        tenorCodeList: [],
        bankLevelList: [],
        batchParams: {},
        showTransBrchTypeWin: false,
        showTransBrchTypeParams: {},
        saleDetailWin: false,
        detailParams: {},
        brchClassMap: new Map(),
        saleDealDisplayAcptWin: false,
        rootUrl: "/be/market/clickdeal/sale/saleReply"
      };
    },
    mounted() {
      this.getDictListByGroups("BusiType,TrDir,Yon,TradeRange,AssetIndustry,DraftTypeCode,CDMedia,ClearSpeed,SettleType,ClearType,CreditMajor,BrchClass,PreRelationFlag,QuoteStatus,ClearMode,PreTradeBhvr,BillOrigin,bankLevel,TenorCode,TrDir").then(res => {
        this.busiTypeList = res.get("BusiType");
        this.assetIndustryList = res.get("AssetIndustry");
        this.billTypeList = res.get("DraftTypeCode");
        this.billClassList = res.get("CDMedia");
        this.isList = res.get("Yon");
        this.tradeRangeList = res.get("TradeRange");
        this.clearSpeedList = res.get("ClearSpeed");
        this.settleTypeList = res.get("SettleType");
        this.clearTypeList = res.get("ClearType");
        this.creditMajorList = res.get("CreditMajor");
        this.brchClassList = res.get("BrchClass");
        this.billOriginList = res.get("BillOrigin");
        this.bankLevelList = res.get("bankLevel");
        this.tenorCodeList = res.get("TenorCode");
        this.trDirList = res.get("TrDir");
        this.brchClassList.forEach(x => {
          return this.brchClassMap.set(x.key, x.value);
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
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = null;
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
      //删除
      deleteTo() {
        if (this.currentSelectRow != null) {
          this.$hMsgBox.confirm({
            title: "删除信息",
            content: "确定要删除吗？",
            onOk: () => {
              this.handleOperate();
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      handleOperate() {
        post({ subBatchId: this.currentSelectRow.id }, "/be/market/clickdeal/sale/saleReply/func_deleteSaleSubBatch").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.currentSelectRow = null;
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      modify() {
        let list = this.currentSelectRow;
        if (list == null || list.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        this.batchParams.flag="1";
        this.batchParams.subBatchId = this.currentSelectRow.id;
        this.batchParams.batchType = "accept";
        this.batchParams.busiType = "BT01";
        this.batchParams.busiTypeList = this.busiTypeList;
        this.batchParams.dictMap = this.dictMap;
        this.batchParams.billTypeList = this.billTypeList;
        this.batchParams.billClassList = this.billClassList;
        this.batchParams.isList = this.isList;
        this.batchParams.tradeRangeList = this.tradeRangeList;
        this.batchParams.clearSpeedList = this.clearSpeedList;
        this.batchParams.settleTypeList = this.settleTypeList;
        this.batchParams.clearTypeList = this.clearTypeList;
        this.batchParams.creditMajorList = this.creditMajorList;
        this.batchParams.clearModeList = this.clearModeList;
        this.batchParams.assetIndustryList = this.assetIndustryList;
        this.batchParams.brchClassList = this.brchClassList;
        this.batchParams.brchClassMap = this.brchClassMap;
        this.batchParams.bankLevelList = this.bankLevelList;
        this.batchParams.tenorCodeList = this.tenorCodeList;
        this.batchParams.trDirList = this.trDirList;
        this.batchParams.billOriginList= this.billOriginList;
        this.batchParams.queryBatchIdUrl = "/be/market/clickdeal/sale/saleReply/func_getRcvSaleBatchSub";
        this.batchParams.pickBillSubmitUrl = "/be/market/clickdeal/sale/saleReply/func_addClickSaleBillSub";
        this.batchParams.pickDataGridUrl = "/be/market/clickdeal/sale/saleReply/func_pagingQueryHldrBillInfo";
        this.batchParams.importPickBillUploadUrl = "/be/market/clickdeal/sale/saleApply/func_batchPickBillStock";
        this.batchParams.calcInterestUrl = "/be/market/clickdeal/sale/saleReply/func_calcInterestSub";
        this.batchParams.applySubmitUrl = "/be/market/clickdeal/sale/saleReply/func_commitApplySub";
        this.batchParams.deleteBillUrl = "/be/market/clickdeal/sale/saleReply/func_deleteBillSub";
        this.batchParams.importTemplateUrl = "/be/market/clickdeal/sale/saleReply/func_downloadSaleBill";
        this.batchParams.exportBillUrl = "/be/market/clickdeal/sale/saleReply/func_exportClickSaleSubBillDetail";
        this.batchParams.saveBatchFuncUrl = "/be/market/clickdeal/sale/saleReply/func_editClickDealSaleBatchSub";
        this.saleDealDisplayAcptWin = true;

      },
      showSaleDetil(batchId) {
        this.batchId = batchId;
        this.saleDetailWin = true;
      },
      saleDetailWinClose() {
        this.batchId = "";
        this.saleDetailWin = false;
      },
      // 关闭卖出报价新增、修改框
      saleDealDisplayAcptWinClose() {
        this.saleDealDisplayAcptWin = false;
        this.$refs.datagrid.dataChange(1);
      }
    }
  };
</script>

<style scoped>

</style>
