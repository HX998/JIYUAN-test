<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <batch-no v-model="formItem.batchNo" :maxlength="30"></batch-no>
                <common-input v-model="formItem.discCustName" :label="$t('m.i.ce.discountApplyName')"
                              class="h-form-long-label" prop="discCustName"></common-input>
                <common-input v-model="formItem.discCustSocCode" class="h-form-long-label" prop="discCustSocCode"
                              :label="$t('m.i.ce.discountApplySocCode')" :maxlength="18"></common-input>
                <common-select v-model="formItem.isAllowBargain" :label="$t('m.i.be.isAllowBargain')"
                               prop="isAllowBargain"
                               :dictList="yonList"></common-select>
                <bill-type v-model="formItem.billType" :dictList="billTypeList"></bill-type>
                <bill-money-range v-model="formItem" :rangeProps="['minTotalAmt','maxTotalAmt']" class="h-form-long-label"
                                  :bigTips="false" :label="$t('m.i.be.totalAmtBillPackage')"></bill-money-range>
                <common-type-field-range v-model="formItem" :rangeProps="['minRatePct','maxRatePct']"
                                         :label="$t('m.i.pe.discRate')" prop="ratePct" :bigTips="false"
                                         :validRules="discRateValidRules" :integerNum="2" :suffixNum="4"></common-type-field-range>
                <common-input-range v-model="formItem" :rangeProps="['minRemainDaysLess','maxRemainDaysLess']"
                                    :label="$t('m.i.be.remainingPeriod')" prop="remainingPeriod"
                                    :bigTips="false" type="int" :maxlength="3"></common-input-range>
                <query-btn :advanceShow="true" @showChange="showChange" :formSearch="handleSearch"
                           :formSearchReset="resetSearch"></query-btn>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid
              :columns="columns"
              highlightRow
              url="/be/discquote/disc/delist/delistTrackQuery/func_getDiscQueryDelistingList"
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
    <listing-detail :listingDetailWin="listingDetailWin" :detailParams="detailParams"
                    @listingDetailWinClose="listingDetailWinClose" showType="trackQuery"
                    :billsUrl="billsUrl" :exportUrl="exportUrl"></listing-detail>
    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param"
                           :rows="this.rows"></common-excel-download>
  </div>
</template>

<script>
  import { post, formatNumber, exportList } from "@/api/bizApi/commonUtil";

  export default {
    name: "delistTrackQuery",
    components: {
      ListingDetail: () => import(/* webpackChunkName: "be/discquote/disc/delist/listingDetail" */`@/views/bizViews/be/discquote/disc/delist/listingDetail`)
    },
    data() {
      return {
        formItem: {
          batchNo: "",
          discCustName: "",
          discCustSocCode: "",
          isAllowBargain: "",
          billType: "",
          minTotalAmt: "",
          maxTotalAmt: "",
          minRatePct: "",
          maxRatePct: "",
          minRemainDaysLess: "",
          maxRemainDaysLess: ""
        },
        detailParams: {
          batchId: "",
          dictMap: new Map()
        },
        dictMap: new Map(),
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
              return h("a", {
                on: {
                  click: () => {
                    this.showDetail(params.row.id);
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
              let dictValue = this.getDictValueFromMap(this.dictMap, "DiscQuoteStatus", params.row.quoteStatus);
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
            title: this.$t("m.i.be.respTm"),
            key: "respTm",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.be.brchName"),
            key: "discBrchName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.be.traderName"),
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
            title: this.$t("m.i.billInfo.billOrigin"),
            key: "billOrigin",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "BillOrigin", params.row.billOrigin);
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
            title: this.$t("m.i.be.totalAmtBillPackage"),
            key: "totalAmt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("p", formatNumber(params.row.totalAmt, 2, ","));
            }
          },
          {
            title: this.$t("m.i.be.totalNumBillPackage"),
            key: "totalNum",
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t("m.i.pe.discRate"),
            key: "ratePct",
            hiddenCol: false,
            sortable: true,
            sortMethod:(a,b,type)=>{
              if (type==="asc") {
                let a1=parseFloat(a);
                let a2=parseFloat(b);
                if (isNaN(a1)) return -1;
                if (isNaN(a2)) return 1;
                return a1-a2;
              }else if (type==="desc") {
                let a1=parseFloat(a);
                let a2=parseFloat(b);
                if (isNaN(a1)) return 1;
                if (isNaN(a2)) return -1;
                return a2-a1;
              }
            }
          },
          {
            title: this.$t("m.i.be.remainingPeriod"),
            key: "remainDays",
            hiddenCol: false,
            sortable: true,
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
            title: this.$t("m.i.be.settleMode"),
            key: "clearMode",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "SettleType", params.row.clearMode);
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
            title: this.$t("m.i.be.discApplMemberId"),
            key: "discApplMemberId",
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t("m.i.common.distType"),
            key: "discApplDistType",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "DistTypeCode", params.row.discApplDistType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.be.discApplAcctNo"),
            key: "discApplAcctNo",
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t("m.i.be.discApplAcctName"),
            key: "discApplAcctName",
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t("m.i.be.discOutBrchCode"),
            key: "discOutBrchCode",
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t("m.i.ce.aoAcctNo"),
            key: "discApplAoAcctNo",
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t("m.i.ce.aoAcctName"),
            key: "discApplAoAcctName",
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t("m.i.ce.aoAcctBrchCode"),
            key: "discApplAoAcctBrchCode",
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t("m.i.be.fileNum"),
            key: "fileNum",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.dealPrcMsg"),
            key: "dealPrcMsg",
            hiddenCol: false
          }
        ],
        discRateValidRules: [{
          test: /^(\d{1,2}(\.\d{1,4})?|100)$/,
          trigger: "blur",
          message: "利率范围0~100，且小数位不超过四位"
        }],
        yonList: [],
        billTypeList: [],
        fileDetailStatusList: [],
        attTypeCodeList: [],
        param: null,
        rows: null,
        ifShowMore: false,
        listingDetailWin: false,
        tempShowExcelTemplateWin: false,
        billsUrl: "/be/discquote/disc/delist/delistTrackQuery/func_getListingBillList",
        batchUrl: "/be/discquote/disc/delist/delistTrackQuery/func_getDelistingBatch",
        exportUrl: "/be/discquote/disc/delist/delistTrackQuery/func_downloadDiscDelistBill",
        filePathUrl: "/be/discquote/disc/delist/delistTrackQuery/"
      };
    },
    mounted() {
      this.getDictListByGroups("DiscQuoteStatus,Yon,DraftTypeCode,CorpScale,Industry,Province,CDMedia,DCBusiType,ClearSpeed,BillOrigin,SettleType,DistTypeCode,FileDetailStatus,AttTypeCode,PreRelationFlag").then(res => {
        this.fileDetailStatusList = res.get("FileDetailStatus");
        this.attTypeCodeList = res.get("AttTypeCode");
        this.yonList = res.get("Yon");
        this.billTypeList = res.get("DraftTypeCode");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      showChange(val) {
        this.ifShowMore = val;
      },
      //查询
      handleSearch(pageNo) {
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.dataChange(!!pageNo ? pageNo : 1);
      },
      //重置表单查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
      },
      showDetail(id) {
        this.detailParams.batchId = id;
        this.detailParams.filePathUrl = this.filePathUrl;
        this.detailParams.dictMap = this.dictMap;
        this.detailParams.fileDetailStatusList = this.fileDetailStatusList;
        this.detailParams.attTypeCodeList = this.attTypeCodeList;
        this.listingDetailWin = true;
      },
      listingDetailWinClose() {
        this.listingDetailWin = false;
      },
      listExport() {
        this.param = "discDelistBatchExport";
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
        let url = window.LOCAL_CONFIG.API_HOME + "/be/discquote/disc/delist/delistTrackQuery/func_downloadDiscDelistBatch";
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
