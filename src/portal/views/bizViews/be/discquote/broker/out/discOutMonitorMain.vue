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
                <common-select v-model="formItem.batchStatus" :label="$t('m.i.common.status')" prop="batchStatus"
                               :dictList="dOQBatchStatusList"></common-select>
                <common-input v-model="formItem.discBrchNameTem" :label="$t('m.i.be.otherBrchName')" prop="discBrchNameTem" :showIcon="true" @on-click="brchCodeWinOpen()"
                              clearable :clearVal="clearVal" clearValTag="discBrchNameTem" readonly></common-input>
                <common-input v-model="formItem.discTraderNameTem" :label="$t('m.i.be.custTraderName')" prop="discTraderNameTem" :showIcon="true"
                              @on-click="showtrader = true" clearable :clearVal="clearVal" clearValTag="discTraderNameTem" class="h-form-long-label" readonly></common-input>
                <common-input v-model="formItem.quoteNo" :label="$t('m.i.be.quoteNo')" prop="quoteNo" :maxlength="20"></common-input>
                <common-select v-model="formItem.tradeMode" :label="$t('m.i.be.sourceTransMode')" prop="tradeMode" :dictList="sourceTransModeList"></common-select>
                <common-input v-model="formItem.busiNo" :label="$t('m.i.be.sourceBusiNo')" prop="busiNo" :maxlength="20" class="h-form-long-label"></common-input>
                <common-input v-model="formItem.dealNo" :label="$t('m.i.be.dealNo')" prop="dealNo" :maxlength="20"></common-input>
                <query-btn :advanceShow="true" @showChange="showChange" :formSearch="handleSearch"
                           :formSearchReset="resetSearch"></query-btn>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid
            :columns="columns"
            highlightRow
            url="/be/discquote/broker/out/discOutMonitorMain/func_queryDiscOutBatchMonitorPage"
            :bindForm="formItem"
            :hasSelect="false"
            rowSelect
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="listExport">{{$t("m.i.common.listExport")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <brch-code-search :brchCodeWin="brchCodeWinBrch" @brchCodeWinClose="brchCodeWinClose"
                      @brchCodeChange="brchCodeChange" optType="2"></brch-code-search>
    <trader-id-search :traderIdWin="showtrader" :brchCode="formItem.discBrchCode" @traderIdWinClose="userTraderWinClose" @traderIdChange="userTraderChange"></trader-id-search>
    <disc-out-detail :discOutDetailWin="discOutDetailWin" :batchParams="batchParams"
                     @anonyApplyDetailWinClose="anonyApplyDetailWinClose" ref="discOutDetail"
                     :dataGridUrl="dataGridUrl" :exportUrl="exportUrl" :batchUrl="batchUrl"></disc-out-detail>
    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param"
                           :rows="this.rows"></common-excel-download>
  </div>
</template>

<script>
  import { post, formatNumber, exportList} from "@/api/bizApi/commonUtil";

  export default {
    name: "discOutMonitorMain",
    components: {
      BrchCodeSearch: () => import(/* webpackChunkName: "sm/auth/branch/cpesBrchCodeSearch" */`@/views/bizViews/sm/auth/branch/cpesBrchCodeSearch`),
      DiscOutDetail: () => import(/* webpackChunkName: "be/discquote/broker/out/discOutDetail" */`@/views/bizViews/be/discquote/broker/out/discOutDetail`),
      TraderIdSearch:()=>import(/* webpackChunkName: "shcpe/cpes/trader/traderIdSearch" */`@/views/bizViews/shcpe/cpes/trader/traderIdSearch`),
    },
    data() {
      return {
        formItem: {
          batchNo: "",
          discBrchCode:"",
          discBrchNameTem:"",
          discTraderNo:"",
          discTraderNameTem:"",
          quoteNo:"",
          tradeMode:"",
          busiNo:"",
          dealNo:"",
          batchStatus:""
        },
        columns: [
          {
            type: "selection",
            width: 50,
            align: "center",
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
              return h('a', {
                on: {
                  click: () => {
                    this.showDetail(params.row.id)
                  }
                }
              }, params.row.batchNo)
            }
          },
          {
            title: this.$t("m.i.be.quoteNo"),
            key: "quoteNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.status"),
            key: "batchStatus",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "DOQBatchStatus", params.row.batchStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.be.dealNo"),
            key: "dealNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.be.dealDt"),
            key: "dealDt",
            hiddenCol: false,
            render: (h, params) => {
              let dealDt = params.row.dealDt?this.$moment(params.row.dealDt, "YYYYMMDD").format("YYYY-MM-DD"):"";
              return h("span", dealDt);
            }
          },
          {
            title: this.$t('m.i.be.quoteMode'),
            key: 'quoteMode',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, 'QuoteMode', params.row.quoteMode);
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
              let dictValue =this.getDictValueFromMap(this.dictMap, 'QuoteOp', params.row.quoteOp);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.common.busiType'),
            key: 'busiType',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue =this.getDictValueFromMap(this.dictMap, 'DCBusiType', params.row.busiType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.tradDir'),
            key: 'trDir',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue =this.getDictValueFromMap(this.dictMap, 'DCTrdDir', params.row.trDir);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.be.otherBrchName"),
            key: "discBrchName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.be.custTraderName"),
            key: "discTraderName",
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
            title: this.$t("m.i.be.totalAmtByYUAN"),
            key: "totalAmt",
            hiddenCol: false,
            render: (h, params) => {
              return h("p", formatNumber(params.row.totalAmt, 2, ","));
            }
          },
          {
            title: this.$t("m.i.pe.discRate"),
            key: "ratePct",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.be.isSubDeal"),
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
            title: this.$t('m.i.be.quoteTm'),
            key: 'quoteTm',
            hiddenCol: false
          },
          {
            title: this.$t("m.i.be.payInterestByUnit"),
            key: "firstPayInterest",
            hiddenCol: false,
            render: (h, params) => {
              return h("p", formatNumber(params.row.firstPayInterest, 2, ","));
            }
          },
          {
            title: this.$t("m.i.be.settleAmtByUnit"),
            key: "firstSettleAmt",
            hiddenCol: false,
            render: (h, params) => {
              return h("p", formatNumber(params.row.firstSettleAmt, 2, ","));
            }
          },
          {
            title: this.$t("m.i.pc.tenorDays"),
            key: "remainDays",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.be.totalNum"),
            key: "totalNum",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.be.settleDt"),
            key: "firstSettleDt",
            hiddenCol: false,
            render: (h, params) => {
              let settleDt = this.$moment(params.row.firstSettleDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", settleDt);
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
            title: this.$t("m.i.be.clearMode"),
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
            title: this.$t("m.i.be.discOutBankNo"),
            key: "discOutBankNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.be.fileNum"),
            key: "fileNum",
            hiddenCol: false
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
            title: this.$t("m.i.be.sourceBusiNo"),
            key: "busiNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.dealPrcMsg"),
            key: "dealPrcMsg",
            hiddenCol: false
          }
        ],
        ifShowMore: false,
        dictMap: new Map(),
        billTypeList:[],
        billClassList: [],
        busiTypeList:[],
        isList:[],
        corpScaleList:[],
        industryList:[],
        provinceList:[],
        clearSpeedList:[],
        clearModeList:[],
        sourceTransModeList:[],
        quoteModeList:[],
        dOQBatchStatusList:[],
        batchParams: {},
        discOutDetailWin:false,
        brchCodeWinBrch:false,
        discBrchCode:"",
        tempShowExcelTemplateWin: false,
        param: "",
        rows: "",
        showtrader : false,
        dataGridUrl: "/be/discquote/broker/out/discOutMonitorMain/func_queryDiscOutBillPage",
        exportUrl: "/be/discquote/broker/out/discOutMonitorMain/func_exportDiscOutBill",
        batchUrl: "/be/discquote/broker/out/discOutMonitorMain/func_editDiscOut",
        filePathUrl: "/be/discquote/broker/out/discOutMonitorMain/"
      };
    },
    mounted() {
      this.getDictListByGroups("DiscStlResult,QuoteOp,DCTrdDir,DOQBatchStatus,DiscQuoteStatus,DraftTypeCode,CDMedia,DCBusiType,Yon,CorpScale,Industry,Province,ClearSpeed,DiscClearMode,EnType,SourceTransMode,QuoteMode,PreRelationFlag").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.billClassList = res.get("CDMedia");
        this.busiTypeList = res.get("DCBusiType");
        this.isList = res.get("Yon");
        this.corpScaleList = res.get("CorpScale");
        this.industryList = res.get("Industry");
        this.provinceList = res.get("Province");
        this.clearSpeedList = res.get("ClearSpeed");
        this.clearModeList = res.get("DiscClearMode");
        this.sourceTransModeList = res.get("SourceTransMode");
        this.quoteModeList = res.get("QuoteMode");
        this.dOQBatchStatusList = res.get("DOQBatchStatus");
        this.dOQBatchStatusList = this.dOQBatchStatusList.filter(item => item.key !== "DOQ001" && item.key !== "DOQ002");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      showChange(val) {
        this.ifShowMore = val;
      },
      //查询
      handleSearch(pageNo) {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.dataChange(!!pageNo ? pageNo : 1);
      },
      //重置表单查询结果
      resetSearch() {
        this.formItem.discBrchCode　=　"";
        this.formItem.discTraderNo　=　"";
        this.$refs.formItem.resetFields();
      },
      brchCodeWinOpen() {
        this.brchCodeWinBrch = true;
      },
      brchCodeWinClose() {
        this.brchCodeWinBrch = false;
      },
      brchCodeChange(info) {
        this.formItem.discBrchNameTem = info.brchFullNameZh;
        this.formItem.discBrchCode = info.brchCode;
        this.formItem.discTraderNo = "";
        this.formItem.discTraderNameTem = "";
        this.brchCodeWinBrch = false;
      },
      userTraderChange(info) {
        if (info === null) {
          this.$msgTip.error(this, { info: "请先选择记录！" });
          return;
        }
        this.formItem.discTraderNo = info.traderId;
        this.formItem.discTraderNameTem = info.traderName;
        this.formItem.discBrchCode = info.brchCode;
        this.formItem.discBrchNameTem = info.brchFullNameZh;
        this.showtrader = false;
      },
      userTraderWinClose() {
        this.showtrader = false;
      },
      clearVal(type){
        if(type == 'discBrchNameTem'){
          this.formItem.discBrchNameTem = '';
          this.formItem.discBrchCode = '';
        }
        if(type == 'discTraderNameTem'){
          this.formItem.discTraderNo = '';
          this.formItem.discTraderNameTem = '';
        }
      },
      showDetail(id){
        this.batchParams.batchId = id;
        this.batchParams.filePathUrl = this.filePathUrl;
        this.batchParams.dictMap = this.dictMap;
        this.batchParams.billTypeList = this.billTypeList;
        this.batchParams.billClassList = this.billClassList;
        this.batchParams.busiTypeList = this.busiTypeList;
        this.batchParams.isList = this.isList;
        this.batchParams.corpScaleList = this.corpScaleList;
        this.batchParams.industryList = this.industryList;
        this.batchParams.provinceList = this.provinceList;
        this.batchParams.clearSpeedList = this.clearSpeedList;
        this.batchParams.clearModeList = this.clearModeList;
        this.batchParams.quoteModeList = this.quoteModeList;
        this.batchParams.sourceTransModeList = this.sourceTransModeList;
        this.discOutDetailWin = true;
      },
      anonyApplyDetailWinClose(){
        this.discOutDetailWin = false;
        this.handleSearch(this.$refs.datagrid.pageInfo.pageNo);
        this.batchParams={};
      },
      listExport() {
        this.param = "discOutBatchExport";
        if (this.$refs.datagrid.selectIds.length != 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        } else {
          this.rows = this.$refs.datagrid.total;
        }
        this.tempShowExcelTemplateWin = true;
      },
      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },
      exportList(field, exportType) {
        let url = window.LOCAL_CONFIG.API_HOME + "/be/discquote/broker/out/discOutMonitorMain/func_exportDiscOutBatch";
        let options = {};
        if (this.$refs.datagrid.selectIds.length !== 0) {
          options.params = {
            ids: this.$refs.datagrid.selectIds,
          };
          options.pageSize = this.$refs.datagrid.selectIds.length;
        } else {
          options.params = this.formItem;
          options.pageSize = this.$refs.datagrid.total;
        }
        exportList(this, this.param, field, exportType, url, options);
      }
    }
  };
</script>

<style scoped>

</style>
