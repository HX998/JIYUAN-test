<!--点击成交-卖出申请-->
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
                <bill-type v-model="formItem.billType" :dictList="billTypeList"></bill-type>
                <bill-class v-model="formItem.billClass" :dictList="billClassList"></bill-class>
                <query-btn :advanceShow="false" @showChange="showChange" :formSearch="handleSearch"
                           :formSearchReset="resetSearch"></query-btn>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid
            :columns="columns"
            highlightRow
            url="/be/market/clickdeal/sale/saleApply/func_querySaleBatchList"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="saleApplyOperate('add')">{{$t("m.i.common.add")}}</h-button>
              <h-button type="primary" @click="saleApplyOperate('modify')">{{$t("m.i.common.modify")}}</h-button>
              <h-button type="primary" @click="saleApplyDelete()">{{$t("m.i.common.delete")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!-- 新增修改弹窗 -->
    <sale-apply-add :saleApplyAddOrEditWin="saleApplyAddOrEditWin" :batchParams="batchParams"
                    @saleApplyAddOrEditWinClose="saleApplyAddOrEditWinClose" ref="saleApplyAdd"></sale-apply-add>
    <!--交易对手类型查看-->
    <show-trans-brch-type :transBrchTypeWin="showTransBrchTypeWin" displayType="show"
                          :transBrchTypeParams="showTransBrchTypeParams" @transBrchTypeWinClose="showTransBrchTypeWinClose"
                          datagridUrl="/be/market/clickdeal/sale/saleApply/func_queryBranchClass"></show-trans-brch-type>
    <!--批次链接详细展示框-->
    <sale-detail :saleDetailWin="saleDetailWin" :detailParams="detailParams" @saleDetailWinClose="saleDetailWinClose" exportParam="clickDealSaleBillInfo"></sale-detail>
  </div>
</template>

<script>
  import { post, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "saleApply",
    components: {
      SaleDetail: () => import(/* webpackChunkName: "be/market/clickdeal/sale/saleDetail" */`@/views/bizViews/be/market/clickdeal/sale/saleDetail`),
      SaleApplyAdd: () => import(/* webpackChunkName: "be/market/clickdeal/sale/saleApplyAdd" */`@/views/bizViews/be/market/clickdeal/sale/saleApplyAdd`),
      ShowTransBrchType: () => import(/* webpackChunkName: "be/market/common/showTransBrchType" */`@/views/bizViews/be/market/common/showTransBrchType`)
    },
    data() {
      return {
        formItem: {
          batchNo: "",
          billType: "",
          billClass: ""
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
                    this.showSaleDetil(params.row.id)
                  }
                }
              }, params.row.batchNo)
            }
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
                    this.showTransBrchType(params.row.id);
                  }
                }
              }, "查看");
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
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h("p", formatNumber(params.row.totalAmt, 2, ","));
            }
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
            title: this.$t("m.i.common.totalNumBillPackage"),
            key: "totalNum",
            hiddenCol: false
          }
        ],
        currentSelectRow: [],
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
        bankLevelList: [],
        tenorCodeList: [],
        billOriginList: [],
        brchClassMap: new Map(),
        saleApplyAddOrEditWin: false,
        batchParams: {},
        showTransBrchTypeWin: false,
        showTransBrchTypeParams: {},
        saleDetailWin: false,
        detailParams: {}
      };
    },
    mounted() {
      this.getDictListByGroups("BusiType,TrDir,Yon,TradeRange,AssetIndustry,DraftTypeCode,CDMedia,ClearSpeed,SettleType,ClearType,CreditMajor,ClearMode,BrchClass,PreRelationFlag,bankLevel,TenorCode,BillOrigin").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.billClassList = res.get("CDMedia");
        this.busiTypeList = res.get("BusiType");
        this.assetIndustryList = res.get("AssetIndustry");
        this.trDirList = res.get("TrDir");
        this.isList = res.get("Yon");
        this.tradeRangeList = res.get("TradeRange");
        this.clearSpeedList = res.get("ClearSpeed");
        this.settleTypeList = res.get("SettleType");
        this.clearTypeList = res.get("ClearType");
        this.creditMajorList = res.get("CreditMajor");
        this.clearModeList = res.get("ClearMode");
        this.brchClassList = res.get("BrchClass");
        this.bankLevelList = res.get("bankLevel");
        this.tenorCodeList = res.get("TenorCode");
        this.billOriginList = res.get("BillOrigin");
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
        this.currentSelectRow = [];
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
        this.currentSelectRow = [];
      },
      //新增、修改
      saleApplyOperate(str) {
        if (str === "modify") {
          if (this.currentSelectRow.length === 0) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
            return;
          }
          this.batchParams.batchId = this.currentSelectRow.id;
        } else {
          this.batchParams.batchId = "";
        }
        this.assembleParams(str);
      },
      assembleParams(optType) {
        this.batchParams.batchType = optType;
        this.batchParams.dictMap = this.dictMap;
        this.batchParams.billTypeList = this.billTypeList;
        this.batchParams.billClassList = this.billClassList;
        this.batchParams.busiTypeList = this.busiTypeList;
        this.batchParams.trDirList = this.trDirList;
        this.batchParams.isList = this.isList;
        this.batchParams.tradeRangeList = this.tradeRangeList;
        this.batchParams.clearSpeedList = this.clearSpeedList;
        this.batchParams.settleTypeList = this.settleTypeList;
        this.batchParams.clearTypeList = this.clearTypeList;
        this.batchParams.creditMajorList = this.creditMajorList;
        this.batchParams.assetIndustryList = this.assetIndustryList;
        this.batchParams.clearModeList = this.clearModeList;
        this.batchParams.brchClassList = this.brchClassList;
        this.batchParams.bankLevelList = this.bankLevelList;
        this.batchParams.tenorCodeList = this.tenorCodeList;
        this.batchParams.brchClassMap = this.brchClassMap;
        this.batchParams.billOriginList= this.billOriginList;
        this.saleApplyAddOrEditWin = true;
      },
      //关闭新增、修改弹窗
      saleApplyAddOrEditWinClose() {
        this.saleApplyAddOrEditWin = false;
        let pageNo = this.batchParams.batchType === "add" ? 1 : this.$refs.datagrid.pageInfo.pageNo;
        this.handleSearch(pageNo);
        this.batchParams = {};
      },
      //删除
      saleApplyDelete(optType) {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
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
        post({ batchId: this.currentSelectRow.id }, "/be/market/clickdeal/sale/saleApply/func_deleteSaleBatch").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.currentSelectRow = [];
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      showTransBrchType(batchId) {
        this.showTransBrchTypeParams = {
          batchId: batchId,
          operate: "tradeClass"
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
        this.detailParams.exportUrl = "/be/market/clickdeal/sale/saleApply/func_exportClickSaleBillDetail";
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
