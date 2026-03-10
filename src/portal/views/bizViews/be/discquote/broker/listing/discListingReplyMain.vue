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
                <common-input v-model="formItem.discCustName" :label="$t('m.i.ce.discountApplyName')"
                              prop="discCustName"class="h-form-long-label" :maxlength="150"></common-input>
                <common-input v-model="formItem.discOutSocCode" :label="$t('m.i.ce.discountApplySocCode')" prop="discOutSocCode"
                              class="h-form-long-label" :validRules="discOutSocCodeRule"></common-input>
                <bill-type v-model="formItem.billType" :dictList="billTypeList"></bill-type>
                <common-select v-model="formItem.isBargain" :label="$t('m.i.be.isAllowBargain')" prop="isBargain"
                               :dictList="isList"></common-select>
                <common-type-field-range v-model="formItem" :rangeProps="['minRatePct','maxRatePct']"
                                         :label="$t('m.i.pe.discRate')" prop="ratePct" :bigTips="false" :integerNum="3" :suffixNum="4"
                                         :validRules="discRateValidRules"></common-type-field-range>
                <common-type-field-range v-model="formItem" :rangeProps="['minRemainDays','maxRemainDays']" :integerNum="3":suffixNum="0"
                                         :label="$t('m.i.be.remainingPeriod')" prop="remainingPeriod"
                                         :bigTips="false"></common-type-field-range>
                <bill-money-range v-model="formItem" :rangeProps="['minTotalAmt','maxTotalAmt']" :integerNum="16" :suffixNum="2"></bill-money-range>
                <query-btn :advanceShow="true" @showChange="showChange" :formSearch="handleSearch"
                           :formSearchReset="resetSearch"></query-btn>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid
            :columns="columns"
            highlightRow
            url="/be/discquote/broker/listing/discListingReplyMain/func_queryDiscListingBatchReplyPage"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="sendApply">{{$t("m.i.common.send")}}</h-button>
              <h-button type="primary" @click="returnApply">{{$t("m.i.be.returnApply")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <disc-listing-detail :anonyApplyDetailWin="anonyApplyDetailWin" :batchParams="batchParams"
                         @anonyApplyDetailWinClose="anonyApplyDetailWinClose" ref="discListingDetail"
                         :dataGridUrl="dataGridUrl" :exportUrl="exportUrl" :batchUrl="batchUrl"></disc-listing-detail>
    <!--交易对手类型查看-->
    <show-trans-brch-type :transBrchTypeWin="showTransBrchTypeWin"
                          :transBrchTypeParams="showTransBrchTypeParams"
                          @transBrchTypeWinClose="showTransBrchTypeWinClose" :transDataGridUrl="transDataGridUrl"></show-trans-brch-type>
  </div>
</template>

<script>
  import { post, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "discListingReplyMain",
    components: {
      DiscListingDetail: () => import(/* webpackChunkName: "be/discquote/broker/listing/discListingDetail" */`@/views/bizViews/be/discquote/broker/listing/discListingDetail`),
      ShowTransBrchType: () => import(/* webpackChunkName: "be/discquote/broker/listing/showTransBrchType" */`@/views/bizViews/be/discquote/broker/listing/showTransBrchType`)
    },
    data() {
      return {
        discOutSocCodeRule:[{
          test: /^[A-Z0-9]{0,18}$/,
          trigger: "blur",
          message: "社会信用代码为18位数字或大写字母，请不要输入超过18位字符和不合法的字符"
        }],
        discRateValidRules: [{
          test: /^(\d{1,2}(\.\d{1,4})?|100\.0000)$/,
          trigger: "blur",
          message: "利率范围0~100，且小数位不超过四位"
        }],
        formItem: {
          batchNo: "",
          discCustName: "",
          discOutSocCode: "",
          isBargain: "",
          billType: "",
          minTotalAmt: "",
          maxTotalAmt: "",
          minRatePct: "",
          maxRatePct: "",
          minRemainDays: "",
          maxRemainDays: ""
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
            title: this.$t("m.i.common.status"),
            key: "batchStatus",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "DLBatchStatus", params.row.batchStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.be.quoteNo"),
            key: "busiNo",
            hiddenCol: false
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
            title: this.$t("m.i.be.brchName"),
            key: "brokerBrchName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.be.traderName"),
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
            title: this.$t("m.i.be.isAllowBargain"),
            key: "isBargain",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "Yon", params.row.isBargain);
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
            hiddenCol: false
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
            title: this.$t("m.i.be.respTm"),
            key: "respTm",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.be.remainingPeriod"),
            key: "remainDays",
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
                    this.showTransBrchType(params.row.transCustType,"BrchClass");
                  }
                }
              }, "查看");
            }
          },
          {
            title: this.$t("m.i.be.eliminateCpBrchType"),
            key: "eliminateCpBrchType",
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.eliminateCpBrchType == null || params.row.eliminateCpBrchType === "") {
                return "-"
              }
              return h("a", {
                on: {
                  click: () => {
                    this.showTransBrchType(params.row.eliminateCpBrchType,"BrchCode");
                  }
                }
              }, "查看");
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
            title: this.$t("m.i.common.dealPrcMsg"),
            key: "dealPrcMsg",
            hiddenCol: false
          },
        ],
        currentSelectRow: [],
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
        dLBatchStatusList:[],
        batchParams: {},
        addOrEditListingWin:false,
        anonyApplyDetailWin:false,
        showTransBrchTypeWin:false,
        showTransBrchTypeParams: {},
        dataGridUrl: "/be/discquote/broker/listing/discListingReplyMain/func_queryDiscListingBillPage",
        exportUrl: "/be/discquote/broker/listing/discListingReplyMain/func_exportDiscListingBill",
        batchUrl: "/be/discquote/broker/listing/discListingReplyMain/func_editDiscListing",
        transDataGridUrl: "/be/discquote/broker/listing/discListingReplyMain/func_queryBranchClassAndBranchCodePage",
        filePathUrl: "/be/discquote/broker/listing/discListingReplyMain/"
    };
    },
    mounted() {
      this.getDictListByGroups("DLBatchStatus,DiscQuoteStatus,DraftTypeCode,CDMedia,DCBusiType,Yon,CorpScale,Industry,Province,ClearSpeed,DiscClearMode,EnType").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.billClassList = res.get("CDMedia");
        this.busiTypeList = res.get("DCBusiType");
        this.isList = res.get("Yon");
        this.corpScaleList = res.get("CorpScale");
        this.industryList = res.get("Industry");
        this.provinceList = res.get("Province");
        this.clearSpeedList = res.get("ClearSpeed");
        this.clearModeList = res.get("DiscClearMode");
        this.dLBatchStatusList = res.get("DLBatchStatus");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      showChange(val) {
        this.ifShowMore = val;
      },
      //查询
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
        this.currentSelectRow = null;
      },
      //交易对手类型和剔除交易对手行别展示
      showTransBrchType(keys,type) {
        this.showTransBrchTypeParams ={
          keys:keys,
          operate:type,
          hasPage:true
        }
        this.showTransBrchTypeWin = true;
      },
      showTransBrchTypeWinClose() {
        this.showTransBrchTypeParams = {};
        this.showTransBrchTypeWin = false;
      },
      //发送
      sendApply(){
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          this.$hMsgBox.confirm({
            title: "发送信息",
            content: "确定要发送吗？",
            onOk: () => {
              let params={ id: this.currentSelectRow.id };
              let url="/be/discquote/broker/listing/discListingReplyMain/func_sendApply";
              this.sendPost(params,url);
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      //退回申请
      returnApply(){
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          this.$hMsgBox.confirm({
            title: "退回申请信息",
            content: "确定要退回申请吗？",
            onOk: () => {
              let params={ id: this.currentSelectRow.id };
              let url="/be/discquote/broker/listing/discListingReplyMain/func_rejectBack";
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
        this.batchParams.dLBatchStatusList = this.dLBatchStatusList;
        this.anonyApplyDetailWin = true;
      },
      anonyApplyDetailWinClose(){
        this.anonyApplyDetailWin = false;
        this.handleSearch(this.$refs.datagrid.pageInfo.pageNo);
        this.batchParams={};
      }
    }
  };
</script>

<style scoped>

</style>
