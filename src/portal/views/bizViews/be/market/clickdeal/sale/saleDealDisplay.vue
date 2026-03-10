<!--点击成交-卖出点击成交展示-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search" onlyBlurRequire>
                <common-input v-model="formItem.buyBrchName" :label="$t('m.i.be.reqBranch')"
                              prop="buyBrchName"></common-input>
                <common-input v-model="formItem.quoteNo" :label="$t('m.i.be.quoteNo')" prop="quoteNo"></common-input>
                <bill-type v-model="formItem.billType" :dictList="billTypeList"></bill-type>
                <bill-class v-model="formItem.billClass" :dictList="billClassList"></bill-class>
                <common-type-field-range v-model="formItem" :label="$t('m.i.pe.dealRate')" :integerNum="2"
                                         :suffixNum="4" :rangeProps="['minRate','maxRate']"
                                         :validRules="rateRule"></common-type-field-range>
                <bill-money-range :label="$t('m.i.billInfo.billPackageMoney')" v-model="formItem" :rangeProps="['minSumAmt','maxSumAmt']" className="h-form-long-label"></bill-money-range>
                <common-select v-model="formItem.tradeRange" :label="$t('m.i.be.tradeRange')" prop="tradeRange"
                               :dictList="tradeRangeList"></common-select>
                <common-select v-model="formItem.creditMainBrchClass"
                               :label="$t('m.i.billInfo.creditMainBankType')" prop="creditMainBrchClass"
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
            url="/be/market/clickdeal/sale/saleDealDisplay/func_getClickSaleBatchRcv"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="saleDealAccept()">{{$t("m.i.common.acceptance")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--受理-->
    <sale-deal-display-acpt :saleOrRebuyDealDisplayAcptWin="saleDealDisplayAcptWin" :batchParams="batchParams"
                            @saleOrRebuyDealAcptWinClose="saleDealDisplayAcptWinClose" displayType="sale"
                            dataGridUrl="/be/market/clickdeal/sale/saleDealDisplay/func_getClickDealSaleBillList"></sale-deal-display-acpt>
    <!--交易对手类型查看-->
    <show-trans-brch-type :transBrchTypeWin="showTransBrchTypeWin" displayType="show"
                          :transBrchTypeParams="showTransBrchTypeParams"
                          @transBrchTypeWinClose="showTransBrchTypeWinClose"
                          datagridUrl="/be/market/clickdeal/sale/saleDealDisplay/func_queryBranchClass"></show-trans-brch-type>
    <!--批次链接详细展示框-->
    <sale-or-rebuy-detail :saleOrRebuyDetailWin="saleDetailWin" :detailParams="detailParams" :isShowBill="false" exportParam="clickDealSaleBillInfo"
                          @saleOrRebuyDetailWinClose="saleDetailWinClose"></sale-or-rebuy-detail>
  </div>
</template>

<script>
  import { post, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "saleDealDisplay",
    components: {
      SaleDealDisplayAcpt: () => import(/* webpackChunkName: "be/market/clickdeal/common/saleOrRebuyDealDisplayAcpt" */`@/views/bizViews/be/market/clickdeal/common/saleOrRebuyDealDisplayAcpt`),
      SaleOrRebuyDetail: () => import(/* webpackChunkName: "be/market/clickdeal/common/saleOrRebuyDetail" */`@/views/bizViews/be/market/clickdeal/common/saleOrRebuyDetail`),
      ShowTransBrchType: () => import(/* webpackChunkName: "be/market/common/showTransBrchType" */`@/views/bizViews/be/market/common/showTransBrchType`)
    },
    data() {
      return {
        rateRule: [{ test: this.validRate, trigger: "blur" }],
        formItem: {
          buyBrchName: "",
          quoteNo: "",
          billType: "",
          billClass: "",
          minRate: "",
          maxRate: "",
          minSumAmt: "",
          maxSumAmt: "",
          tradeRange: "",
          creditMainBrchClass: ""
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
            key: "buyBrchName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.be.reqProductId"),
            key: "buyProductNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.be.reqUser"),
            key: "buyTraderName",
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
            title: this.$t("m.i.be.isNeedConfirm"),
            key: "isNeedConfirm",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "Yon", params.row.isNeedConfirm);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.be.minResidualTermDay"),
            key: "minResidualTerm",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.be.maxResidualTermDay"),
            key: "maxResidualTerm",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.be.minDueDt"),
            key: "minDueDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let dt = this.$moment(params.row.minDueDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", dt);
            }
          },
          {
            title: this.$t("m.i.be.maxDueDt"),
            key: "maxDueDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let dt = this.$moment(params.row.maxDueDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", dt);
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
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("p", formatNumber(params.row.undealTotalAmt, 2, ","));
            }
          },
          {
            title: this.$t("m.i.be.minBillAmt"),
            key: "minBillAmt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h("p", formatNumber(params.row.minBillAmt, 2, ","));
            }
          },
          {
            title: this.$t("m.i.billInfo.creditMainBankType"),
            key: "creditMainBrchClass",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "CreditMajor", params.row.creditMainBrchClass);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.billInfo.acptBankType"),
            key: "acptBrchClasses",
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.acptBrchClasses == null || params.row.acptBrchClasses === "") {
                return "-";
              }
              return h("a", {
                on: {
                  click: () => {
                    this.showTransBrchType(params.row.id, "acptClass");
                  }
                }
              }, "查看");
            }
          },
          {
            title: this.$t("m.i.billInfo.discBankType"),
            key: "discBrchClasses",
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.discBrchClasses == null || params.row.discBrchClasses === "") {
                return "-";
              }
              return h("a", {
                on: {
                  click: () => {
                    this.showTransBrchType(params.row.id, "discClass");
                  }
                }
              }, "查看");
            }
          },
          {
            title: this.$t("m.i.billInfo.trustBankType"),
            key: "trustBrchClasses",
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.trustBrchClasses == null || params.row.trustBrchClasses === "") {
                return "-";
              }
              return h("a", {
                on: {
                  click: () => {
                    this.showTransBrchType(params.row.id, "trustClass");
                  }
                }
              }, "查看");
            }
          }
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
        busiTypeList: [],
        bankLevelList: [],
        tenorCodeList:[],
        assetIndustryList: [],
        billOriginList: [],
        brchClassMap: new Map(),
        saleDealDisplayAcptWin: false,
        batchParams: {},
        showTransBrchTypeWin: false,
        showTransBrchTypeParams: {},
        saleDetailWin: false,
        detailParams: {}
      };
    },
    mounted() {
      this.getDictListByGroups("BusiType,TrDir,Yon,AssetIndustry,TradeRange,DraftTypeCode,CDMedia,ClearSpeed,SettleType,ClearType,CreditMajor,BrchClass,PreRelationFlag,QuoteStatus,bankLevel,TenorCode,BillOrigin").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.billClassList = res.get("CDMedia");
        this.isList = res.get("Yon");
        this.tradeRangeList = res.get("TradeRange");
        this.clearSpeedList = res.get("ClearSpeed");
        this.settleTypeList = res.get("SettleType");
        this.clearTypeList = res.get("ClearType");
        this.creditMajorList = res.get("CreditMajor");
        this.brchClassList = res.get("BrchClass");
        this.busiTypeList = res.get("BusiType");
        this.assetIndustryList = res.get("AssetIndustry");
        this.bankLevelList = res.get("bankLevel");
        this.tenorCodeList = res.get("TenorCode");
        this.billOriginList = res.get("BillOrigin");
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
        if (this.formItem.minRate >= this.formItem.maxRate) {
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
      saleDealAccept() {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          post({ batchId: this.currentSelectRow.id }, "/be/market/clickdeal/sale/saleDealDisplay/func_checkIsRepeatSign").then(res => {
            if (res) {
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.addSubSaleBatch();
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
      addSubSaleBatch(){
        post({ batchId: this.currentSelectRow.id }, "/be/market/clickdeal/sale/saleDealDisplay/func_signClickDealSale").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.batchParams.batchId = this.currentSelectRow.id;
              this.batchParams.subBatchId = res.data.retData.id;
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
        this.batchParams.flag="1";
        this.batchParams.busiType = "BT01";
        this.batchParams.dictMap = this.dictMap;
        this.batchParams.billTypeList = this.billTypeList;
        this.batchParams.billClassList = this.billClassList;
        this.batchParams.bankLevelList = this.bankLevelList;
        this.batchParams.tenorCodeList = this.tenorCodeList;
        this.batchParams.isList = this.isList;
        this.batchParams.tradeRangeList = this.tradeRangeList;
        this.batchParams.clearSpeedList = this.clearSpeedList;
        this.batchParams.settleTypeList = this.settleTypeList;
        this.batchParams.clearTypeList = this.clearTypeList;
        this.batchParams.creditMajorList = this.creditMajorList;
        this.batchParams.clearModeList = this.clearModeList;
        this.batchParams.brchClassList = this.brchClassList;
        this.batchParams.busiTypeList = this.busiTypeList;
        this.batchParams.brchClassMap = this.brchClassMap;
        this.batchParams.billOriginList= this.billOriginList;
        this.batchParams.queryBatchIdUrl = "/be/market/clickdeal/sale/saleDealDisplay/func_getRcvSaleBatchSub";
        this.batchParams.pickBillSubmitUrl = "/be/market/clickdeal/sale/saleDealDisplay/func_addClickSaleBillSub";
        this.batchParams.pickDataGridUrl = "/be/market/clickdeal/sale/saleDealDisplay/func_pagingQueryHldrBillInfo";
        this.batchParams.importPickBillUploadUrl = "/be/market/clickdeal/sale/saleApply/func_batchPickBillStock";
        this.batchParams.calcInterestUrl = "/be/market/clickdeal/sale/saleDealDisplay/func_calcInterestSub";
        this.batchParams.applySubmitUrl = "/be/market/clickdeal/sale/saleDealDisplay/func_commitApplySub";
        this.batchParams.deleteBillUrl = "/be/market/clickdeal/sale/saleDealDisplay/func_deleteBillSub";
        this.batchParams.importTemplateUrl = "/be/market/clickdeal/sale/saleDealDisplay/func_downloadSaleBill";
        this.batchParams.exportBillUrl = "/be/market/clickdeal/sale/saleDealDisplay/func_exportClickSaleSubBillDetail";
        this.batchParams.saveBatchFuncUrl = "/be/market/clickdeal/sale/saleDealDisplay/func_editClickDealSaleBatchSub";
        this.saleDealDisplayAcptWin = true;
      },
      //关闭新增、修改弹窗
      saleDealDisplayAcptWinClose() {
        this.saleDealDisplayAcptWin = false;
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
      showSaleDetil(batchId) {
        this.detailParams.batchId = batchId;
        this.detailParams.dictMap = this.dictMap;
        this.detailParams.brchClassMap = this.brchClassMap;
        this.detailParams.batchUrl = "/be/market/clickdeal/sale/saleDealDisplay/func_findClickSaleBatchById";
        this.detailParams.billsUrl = "/be/market/clickdeal/sale/saleDealDisplay/func_getClickSaleBillList";
        this.detailParams.exportUrl = "/be/market/clickdeal/sale/saleDealDisplay/func_exportClickSaleBillDetail";
        this.saleDetailWin = true;
      },
      saleDetailWinClose() {
        this.detailParams = {};
        this.saleDetailWin = false;
      }
    }
  };
</script>

<style scoped>

</style>
