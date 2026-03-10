<!--点击成交-买入申请-->
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
              url="/be/market/clickdeal/rebuy/rebuyApply/func_getClickDealRebuyBatch"
              :bindForm="formItem"
              :onCurrentChange="handleCurrentChange"
              :onCurrentChangeCancel="handleCurrentChangeCancel"
              ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="rebuyApplyOperate('add')">{{$t("m.i.common.add")}}</h-button>
              <h-button type="primary" @click="rebuyApplyOperate('modify')">{{$t("m.i.common.modify")}}</h-button>
              <h-button type="primary" @click="rebuyApplyDelete()">{{$t("m.i.common.delete")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!-- 新增修改弹窗 -->
    <rebuy-apply-add :rebuyApplyAddOrEditWin="rebuyApplyAddOrEditWin" :batchParams="batchParams"
                    @rebuyApplyAddOrEditWinClose="rebuyApplyAddOrEditWinClose" ref="rebuyApplyAdd"></rebuy-apply-add>
    <!--交易对手类型查看-->
    <show-trans-brch-type :transBrchTypeWin="showTransBrchTypeWin" displayType="show"
                          :transBrchTypeParams="showTransBrchTypeParams" @transBrchTypeWinClose="showTransBrchTypeWinClose"
                          datagridUrl="/be/market/clickdeal/rebuy/rebuyApply/func_queryBranchClass"></show-trans-brch-type>
    <rebuy-detail :rebuyDetailWin="rebuyDetailWin" :detailParams="detailParams" @rebuyDetailWinClose="rebuyDetailWinClose" :isShowBill="false"></rebuy-detail>
  </div>
</template>

<script>
  import { post, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "rebuyApply",
    components: {
      RebuyDetail: () => import(/* webpackChunkName: "be/market/clickdeal/rebuy/rebuyDetail" */`@/views/bizViews/be/market/clickdeal/rebuy/rebuyDetail`),
      rebuyApplyAdd: () => import(/* webpackChunkName: "be/market/clickdeal/rebuy/rebuyApplyAdd" */`@/views/bizViews/be/market/clickdeal/rebuy/rebuyApplyAdd`),
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
                    this.showRebuyDetil(params.row.id)
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
            title: this.$t("m.i.be.isNeedConfirm"),
            key: "isNeedConfirm",
            hiddenCol: false,
            sortable: true,
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
            sortable: true,
          },
          {
            title: this.$t("m.i.be.maxResidualTermDay"),
            key: "maxResidualTerm",
            hiddenCol: false,
            sortable: true,
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
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h("p", formatNumber(params.row.totalAmt, 2, ","));
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
                    this.showTransBrchType(params.row.id, "tradeClass");
                  }
                }
              }, "查看");
            }
          },
          {
            title: this.$t("m.i.billInfo.acptBankType"),
            key: "acptBrchClasses",
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.acptBrchClasses == null || params.row.acptBrchClasses === "") {
                return "-"
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
                return "-"
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
                return "-"
              }
              return h("a", {
                on: {
                  click: () => {
                    this.showTransBrchType(params.row.id, "trustClass");
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
        rebuyApplyAddOrEditWin: false,
        batchParams: {},
        showTransBrchTypeWin: false,
        showTransBrchTypeParams: {},
        datagridUrl:"",
        rebuyDetailWin: false,
        detailParams: {},
        brchClassMap: new Map(),
      };
    },
    mounted() {
      this.getDictListByGroups("BusiType,TrDir,Yon,TradeRange,DraftTypeCode,CDMedia,ClearSpeed,SettleType,ClearType,CreditMajor,ClearMode,BrchClass,PreRelationFlag,CreditDeductRule,BillOrigin").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.billClassList = res.get("CDMedia");
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
        this.creditDeductRuleList = res.get("CreditDeductRule");
        this.creditDeductRuleList = this.creditDeductRuleList.filter(item => item.key === "A" || item.key === "C" || item.key === "E");
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
      rebuyApplyOperate(str) {
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
        this.batchParams.clearModeList = this.clearModeList;
        this.batchParams.brchClassList = this.brchClassList;
        this.batchParams.creditDeductRuleList = this.creditDeductRuleList;

        let brchClassMap = new Map();
        this.brchClassList.forEach(x => brchClassMap.set(x.key,x.value));
        this.batchParams.brchClassMap = brchClassMap;
        this.rebuyApplyAddOrEditWin = true;
      },
      //关闭新增、修改弹窗
      rebuyApplyAddOrEditWinClose() {
        this.rebuyApplyAddOrEditWin = false;
        let pageNo = this.batchParams.batchType === "add" ? 1 : this.$refs.datagrid.pageInfo.pageNo;
        this.handleSearch(pageNo);
        this.batchParams = {};
      },
      //删除
      rebuyApplyDelete(optType) {
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
        post({ id: this.currentSelectRow.id }, "/be/market/clickdeal/rebuy/rebuyApply/func_deleteClickDealRebuyBatch").then(res => {
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
        this.detailParams.batchId = batchId;
        this.detailParams.dictMap = this.dictMap;
        this.detailParams.brchClassMap = this.brchClassMap;
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
