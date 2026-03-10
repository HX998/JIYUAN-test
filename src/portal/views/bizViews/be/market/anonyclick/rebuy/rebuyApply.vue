<!--匿名点击逆回购-申请管理-->
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
                <common-type-field-range v-model="formItem" :label="$t('m.i.pe.buyBackTotalAmt')" :integerNum="16" :suffixNum="2" :validRules="buyBackTotalAmtRule" :bigTips="false"
                                         :rangeProps="['minBuyBackTotalAmt','maxBuyBackTotalAmt']"></common-type-field-range>
                <common-type-field-range v-model="formItem" :label="$t('m.i.be.repurchaseRate')" :integerNum="3" :suffixNum="4" :validRules="ratePctRule" :bigTips="false"
                                         :rangeProps="['minRatePct','maxRatePct']"></common-type-field-range>
                <common-select v-model="formItem.tenorVarieties" :label="$t('m.i.be.tenorVarieties')" prop="tenorVarieties"
                               :dictList="tenorVarietiesList"></common-select>
                <common-select v-model="formItem.creditMainBrchClass" :label="$t('m.i.billInfo.creditMainBankType')" prop="creditMainBrchClass"
                               :dictList="creditMajorList"></common-select>
                <query-btn :advanceShow="true" @showChange="showChange" :formSearch="handleSearch"
                           :formSearchReset="resetSearch"></query-btn>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid
            :columns="columns"
            highlightRow
            url="/be/market/anonyclick/rebuy/rebuyApply/func_queryAnonyRebuyApply"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="rebuyApplyOperate('add')">{{$t("m.i.common.add")}}</h-button>
              <h-button type="primary" @click="rebuyApplyOperate('modify')">{{$t("m.i.common.modify")}}</h-button>
              <h-button type="primary" @click="rebuyApplyDelete()">{{$t("m.i.common.delete")}}</h-button>
              <h-button type="primary" @click="rebuyApplyCommit()">{{$t("m.i.common.submit")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!-- 新增修改弹窗 -->
    <rebuy-apply-add :rebuyApplyAddOrEditWin="rebuyApplyAddOrEditWin" :batchParams="batchParams"
                    @rebuyApplyAddOrEditWinClose="rebuyApplyAddOrEditWinClose" ref="rebuyApplyAdd"></rebuy-apply-add>
    <!-- 详情页面 -->
    <rebuy-apply-detail :rebuyApplyDetailWin="rebuyApplyDetailWin" :batchParams="batchParams"
                    @rebuyApplyDetailWinClose="rebuyApplyDetailWinClose" ref="rebuyApplyDetail"></rebuy-apply-detail>

  </div>
</template>

<script>
  import { post, accMul, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "rebuyApply",
    components: {
      RebuyApplyAdd: () => import(/* webpackChunkName: "be/market/anonyclick/rebuy/rebuyApplyAdd" */`@/views/bizViews/be/market/anonyclick/rebuy/rebuyApplyAdd`),
      RebuyApplyDetail: () => import(/* webpackChunkName: "be/market/anonyclick/rebuy/rebuyApplyDetail" */`@/views/bizViews/be/market/anonyclick/rebuy/rebuyApplyDetail`)
    },
    data() {
      return {
        ratePctRule :[{
          test: /^(\d{1,2}(\.\d{1,4})?|100\.0000)$/,
          trigger: "blur",
          message: "利率范围0~100，且小数位不超过四位"
        }],
        buyBackTotalAmtRule:[{
          test: /^(?:[1-9]\d{0,15}|0)(?:\.\d{1,2})?$/,
          trigger: "blur",
          message: "回购金额必须是大于等于0的数字，最多16位整数且小数位不超过两位"
        }],
        formItem: {
          batchNo: "",
          billType: "",
          billClass: "",
          minBuyBackTotalAmt:"",
          maxBuyBackTotalAmt:"",
          minRatePct:"",
          maxRatePct:"",
          tenorVarieties:"",
          creditMainBrchClass:""
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
                    this.billDetail(params.row.id)
                  }
                }
              }, params.row.batchNo)
            }
          },
          {
            title: this.$t('m.i.billInfo.flowStatus'),
            key: 'batchStatus',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue =this.getDictValueFromMap(this.dictMap, 'AnonyClickBatchStatus', params.row.batchStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
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
            title: this.$t('m.i.be.ownBrchName'),
            key: 'buyBrchName',
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.traderName'),
            key: 'buyTraderName',
            sortable: true,
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
            title: this.$t("m.i.be.repurchaseRate"),
            key: "ratePct",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.pe.buyBackTotalAmt"),
            key: "buyBackTotalAmt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h("p", formatNumber(params.row.buyBackTotalAmt, 2, ","));
            }
          },
          {
            title: this.$t("m.i.be.repoTerm"),
            key: "tenorDays",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.be.tenorVarieties"),
            key: "tenorVarieties",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "TenorVarieties", params.row.tenorVarieties);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.be.firstSettleDate'),
            key: 'settleDt',
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', params.row.settleDt ? this.$moment(params.row.settleDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
            }
          },
          {
            title: this.$t('m.i.be.dueSettleDt'),
            key: 'dueSettleDt',
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', params.row.dueSettleDt ? this.$moment(params.row.dueSettleDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
            }
          },
          {
            title: this.$t('m.i.be.clearSpeed'),
            key: 'clearSpeed',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue =this.getDictValueFromMap(this.dictMap, 'ClearSpeed', params.row.clearSpeed);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.settleMode'),
            key: 'settleMode',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue =this.getDictValueFromMap(this.dictMap, 'SettleType', params.row.settleMode);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.clearType'),
            key: 'clearType',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue =this.getDictValueFromMap(this.dictMap, 'ClearType', params.row.clearType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.billInfo.creditMainBankType'),
            key: 'creditMainBrchClass',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue =this.getDictValueFromMap(this.dictMap, 'CreditMajor', params.row.creditMainBrchClass);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          }
        ],
        currentSelectRow: [],
        //是否显示更多查询项
        ifShowMore: false,
        dictMap: new Map(),
        billTypeList:[],
        billClassList: [],
        busiTypeList: [],
        isList:[],
        clearSpeedList:[],
        settleTypeList:[],
        clearTypeList:[],
        creditMajorList:[],
        clearModeList:[],
        tenorVarietiesList:[],
        rebuyApplyAddOrEditWin:false,
        rebuyApplyDetailWin:false,
        batchParams: {},
      };
    },
    mounted() {
      this.getDictListByGroups("AnonyClickBatchStatus,BusiType,TrDir,Yon,TradeRange,DraftTypeCode,CDMedia,ClearSpeed,SettleType,ClearType,CreditMajor,ClearMode,TenorVarieties,QuoteStatus").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.billClassList = res.get("CDMedia");
        this.busiTypeList = res.get("BusiType");
        this.isList = res.get("Yon");
        this.clearSpeedList = res.get("ClearSpeed");
        this.settleTypeList = res.get("SettleType");
        this.clearTypeList = res.get("ClearType");
        this.creditMajorList = res.get("CreditMajor");
        this.clearModeList = res.get("ClearMode");
        this.tenorVarietiesList = res.get("TenorVarieties");
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
      //打开新增和修改页面
      rebuyApplyOperate(str){
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
        this.batchParams.isList = this.isList;
        this.batchParams.clearSpeedList = this.clearSpeedList;
        this.batchParams.settleTypeList = this.settleTypeList;
        this.batchParams.clearTypeList = this.clearTypeList;
        this.batchParams.creditMajorList = this.creditMajorList;
        this.batchParams.clearModeList = this.clearModeList;
        this.batchParams.tenorVarietiesList = this.tenorVarietiesList;
        this.rebuyApplyAddOrEditWin = true;
      },
      //关闭新增、修改弹窗
      rebuyApplyAddOrEditWinClose() {
        this.rebuyApplyAddOrEditWin = false;
        let pageNo = this.batchParams.batchType === "add" ? 1 : this.$refs.datagrid.pageInfo.pageNo;
        this.handleSearch(pageNo);
        this.batchParams = {};
      },
      //删除批次
      rebuyApplyDelete(){
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          this.$hMsgBox.confirm({
            title: "删除信息",
            content: "确定要删除吗？",
            onOk: () => {
              let params={ id: this.currentSelectRow.id };
              let url="/be/market/anonyclick/rebuy/rebuyApply/func_deleteAnonyRebuyBatch";
              this.sendPost(params,url);
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      rebuyApplyCommit(){
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          this.$hMsgBox.confirm({
            title: "提交信息",
            content: "确定要提交申请吗？",
            onOk: () => {
              let params={ id: this.currentSelectRow.id };
              let url="/be/market/anonyclick/rebuy/rebuyApply/func_commitAnonyRebuyApply";
              this.sendPost(params,url);
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
      //跳转详情页面
      billDetail(id) {
        this.batchParams.batchId = id;
        this.batchParams.dictMap = this.dictMap;
        this.batchParams.batchUrl="/be/market/anonyclick/rebuy/rebuyApply/func_findAnonyRebuyBatchById";
        this.rebuyApplyDetailWin = true;
      },
      //关闭详情弹窗
      rebuyApplyDetailWinClose() {
        this.rebuyApplyDetailWin = false;
        let pageNo = this.$refs.datagrid.pageInfo.pageNo;
        this.handleSearch(pageNo);
        this.batchParams = {};
      },
    }
  };
</script>

<style scoped>

</style>
