<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <common-select v-model="formItem.quoteStatus" :label="$t('m.i.be.quoteStatus')" prop="quoteStatus"
                               :dictList="discQuoteStatusList"></common-select>
                <common-select v-model="formItem.isAllowBargain" :label="$t('m.i.be.isAllowBargain')"
                               prop="isAllowBargain"
                               :dictList="yonList"></common-select>
                <bill-type v-model="formItem.billType" :dictList="billTypeList"></bill-type>
                <bill-money-range v-model="formItem" :rangeProps="['minTotalAmt','maxTotalAmt']" class="h-form-long-label"
                                  :bigTips="false" :label="$t('m.i.billInfo.billPackageMoney')" ></bill-money-range>
                <common-type-field-range v-model="formItem" :rangeProps="['minRatePct','maxRatePct']"
                                         :label="$t('m.i.pe.discRate')" prop="ratePct" :bigTips="false"
                                         :validRules="discRateValidRules" :integerNum="2" :suffixNum="4"></common-type-field-range>
                <common-input-range v-model="formItem" :rangeProps="['minRemainDaysLess','maxRemainDaysLess']"
                                    :label="$t('m.i.be.remainingPeriod')" prop="remainingPeriod"
                                    :bigTips="false" type="int" :maxlength="3"></common-input-range>
                <common-date-picker v-model="formItem.transDtStr" :label="$t('m.i.be.listingDt')" prop="transDtStr" readonly></common-date-picker>
                <query-btn :advanceShow="true" @showChange="showChange" :formSearch="handleSearch"
                           :formSearchReset="resetSearch"></query-btn>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid
              :columns="columns"
              highlightRow
              url="/be/discquote/disc/delist/listingMain/func_getDiscListingList"
              :bindForm="formItem"
              :onCurrentChange="handleCurrentChange"
              :onCurrentChangeCancel="handleCurrentChangeCancel"
              ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="delist">{{$t("m.i.be.delisting")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <listing-detail :listingDetailWin="listingDetailWin" :detailParams="detailParams"
                    @listingDetailWinClose="listingDetailWinClose" showType="delist" :billsUrl="billsUrl"
                    :batchUrl="batchUrl" :exportUrl="exportUrl"></listing-detail>
  </div>
</template>

<script>
  import { post, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "listingMain",
    components: {
      ListingDetail: () => import(/* webpackChunkName: "be/discquote/disc/delist/listingDetail" */`@/views/bizViews/be/discquote/disc/delist/listingDetail`)
    },
    data() {
      return {
        formItem: {
          quoteStatus: "",
          isAllowBargain: "",
          billType: "",
          minTotalAmt: "",
          maxTotalAmt: "",
          minRatePct: "",
          maxRatePct: "",
          minRemainDaysLess: "",
          maxRemainDaysLess: "",
          transDt: "",
          transDtStr: "",
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
            hiddenCol: false,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showDetail(params.row.id);
                  }
                }
              }, params.row.busiNo);
            }
          },
          {
            title: this.$t("m.i.be.listingDt"),
            key: "transDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let settleDt = this.$moment(params.row.transDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", settleDt);
            }
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
        discQuoteStatusList: [],
        yonList: [],
        billTypeList: [],
        fileDetailStatusList: [],
        attTypeCodeList: [],
        currentSelectRow: null,
        ifShowMore: false,
        listingDetailWin: false,
        billsUrl: "/be/discquote/disc/delist/listingMain/func_getListingBillList",
        batchUrl: "/be/discquote/disc/delist/listingMain/func_getDelistingBatch",
        exportUrl: "/be/discquote/disc/delist/listingMain/func_downloadDiscDelistBill",
        filePathUrl: "/be/discquote/disc/delist/listingMain/"
      };
    },
    mounted() {
      this.getDictListByGroups("DiscQuoteStatus,Yon,DraftTypeCode,CorpScale,Industry,Province,CDMedia,DCBusiType,ClearSpeed,BillOrigin,SettleType,DistTypeCode,FileDetailStatus,AttTypeCode,PreRelationFlag").then(res => {
        this.fileDetailStatusList = res.get("FileDetailStatus");
        this.attTypeCodeList = res.get("AttTypeCode");
        this.discQuoteStatusList = res.get("DiscQuoteStatus");
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
        this.currentSelectRow = null;
        this.$refs.datagrid.dataChange(!!pageNo ? pageNo : 1);
      },
      //重置表单查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
        this.formItem.transDtStr = window.sessionStorage.getItem("workDate");
        this.formItem.transDt = this.formItem.transDtStr.replace(/-/g, "");
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = null;
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
        this.detailParams = {};
        this.listingDetailWin = false;
        this.handleSearch(1);
      },
      delist() {
        if (this.currentSelectRow) {
          this.$hMsgBox.confirm({
            title: "摘牌信息",
            content: "确定要摘牌吗？",
            onOk: () => {
              this.delistFunc();
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      delistFunc() {
        post({
          batchId: this.currentSelectRow.id,
          sgnupMk: "0"
        }, "/be/discquote/disc/delist/listingMain/func_delistingAnswer").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.handleSearch(1);
              this.currentSelectRow = null;
              this.$msgTip.success(this);
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
    },
    created() {
      this.formItem.transDtStr = window.sessionStorage.getItem("workDate");
      this.formItem.transDt = this.formItem.transDtStr.replace(/-/g, "");
    },
  };
</script>

<style scoped>

</style>
