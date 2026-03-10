<!--匿名点击正回购-提票页面-->
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
                <common-type-field-range v-model="formItem" :label="$t('m.i.pe.buyBackTotalAmt')" :integerNum="16" :suffixNum="2" :validRules="buyBackTotalAmtRule"
                                         :rangeProps="['minSumBuyAmt','maxSumBuyAmt']" :bigTips="false"></common-type-field-range>
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
            url="/be/market/anonyclick/sale/extractBill/func_queryAnonySaleExtractApply"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="extractBillAdd()">{{$t("m.i.be.ticket")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!-- 提票弹窗 -->
    <extract-bill-add :extractBillAddWin="extractBillAddWin" :batchParams="batchParams"
                    @extractBillAddWinClose="extractBillAddWinClose" ref="extractBillAdd"></extract-bill-add>
    <!--子批详情页面-->
    <sale-sub-detail :saleSubDetailWin="saleSubDetailWin" :batchParams="batchParams"
                           @saleSubDetailWinClose="saleSubDetailWinClose" ref="saleSubDetail"></sale-sub-detail>
  </div>
</template>

<script>
  import { post, accMul, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "extractBill",
    components: {
      ExtractBillAdd: () => import(/* webpackChunkName: "be/market/anonyclick/sale/extractBillAdd" */`@/views/bizViews/be/market/anonyclick/sale/extractBillAdd`),
      SaleSubDetail: () => import(/* webpackChunkName: "be/market/anonyclick/sale/saleSubDetail" */`@/views/bizViews/be/market/anonyclick/sale/saleSubDetail`)
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
          minSumBuyAmt:"",
          maxSumBuyAmt:"",
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
            sortable: true,
            hiddenCol: false,
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
              let dictValue =this.getDictValueFromMap(this.dictMap, 'QuoteBatchStatus', params.row.batchStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.ticketOverTime'),
            key: 'respTm',
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.quoteNo'),
            key: 'quoteNo',
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
            title: this.$t('m.i.be.dealNo'),
            key: 'dealNo',
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.dealStatus'),
            key: 'dealStatus',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue =this.getDictValueFromMap(this.dictMap, 'QuoteStatus', params.row.dealStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.common.dealDtTm'),
            key: "dealDtTm",
            hiddenCol: false,
            render:(h, params) =>{
              return h('span', params.row.dealDtTm?this.$moment(params.row.dealDtTm, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss"):"")
            }
          },
          {
            title: this.$t('m.i.be.otherBrchName'),
            key: "buyBrchName",
            sortable: true,
            hiddenCol: false
          }, {
            title: this.$t('m.i.be.custTraderName'),
            key: "buyTraderName",
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
            title: this.$t('m.i.be.firstSettleDate'),
            key: 'firstSettleDt',
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', params.row.firstSettleDt ? this.$moment(params.row.firstSettleDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
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
            title: this.$t("m.i.be.repoTerm"),
            key: "tenorDays",
            sortable: true,
            hiddenCol: false
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
            title: this.$t('m.i.common.totalAmtBillPackage'),
            key: "totalAmt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('p', formatNumber(params.row.totalAmt, 2, ','))
            }
          },
          {
            title: this.$t('m.i.be.firstPayInterestByUnit'),
            key: "firstPayInterest",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('p', formatNumber(params.row.firstPayInterest, 2, ','))
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
          },
          {
            title: this.$t('m.i.common.totalNumBillPackage'),
            key: "totalNum",
            hiddenCol: false
          },
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
        bankLevelList:[],
        quoteStatusList:[],
        billOriginList:[],
        extractBillAddWin:false,
        saleSubDetailWin:false,
        batchParams: {},
      };
    },
    mounted() {
      this.getDictListByGroups("QuoteBatchStatus,BusiType,TrDir,Yon,TradeRange,DraftTypeCode,CDMedia,ClearSpeed,SettleType,ClearType,CreditMajor,ClearMode,TenorVarieties,QuoteStatus,PreRelationFlag,bankLevel,BillOrigin").then(res => {
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
        this.bankLevelList = res.get("bankLevel");
        this.quoteStatusList = res.get("QuoteStatus");
        this.billOriginList = res.get("BillOrigin");
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
      extractBillAdd(){
        if (this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.batchParams.batchId = this.currentSelectRow.id;
        this.assembleParams();
      },
      assembleParams() {
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
        this.batchParams.bankLevelList =this.bankLevelList;
        this.batchParams.tenorCodeList = this.tenorVarietiesList;
        this.batchParams.billOriginList = this.billOriginList;
        this.extractBillAddWin = true;
      },
      extractBillAddWinClose(){
        this.extractBillAddWin = false;
        let pageNo = this.$refs.datagrid.pageInfo.pageNo;
        this.handleSearch(pageNo);
        this.batchParams = {};
      },
      //跳转详情页面
      billDetail(id) {
        this.batchParams.batchId = id;
        this.batchParams.dictMap = this.dictMap;
        this.batchParams.subBatchUrl="/be/market/anonyclick/sale/extractBill/func_findSaleBatchById";
        this.batchParams.subBillsUrl="/be/market/anonyclick/sale/extractBill/func_querySaleBillList";
        this.batchParams.subExportUrl="/be/market/anonyclick/sale/extractBill/func_downloadSubSaleInfo";
        this.saleSubDetailWin = true;
      },
      //关闭详情弹窗
      saleSubDetailWinClose() {
        this.saleSubDetailWin = false;
        let pageNo = this.$refs.datagrid.pageInfo.pageNo;
        this.handleSearch(pageNo);
        this.batchParams = {};
      },
    }
  };
</script>

<style scoped>

</style>
