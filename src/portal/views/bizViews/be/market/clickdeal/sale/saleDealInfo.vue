<template>
  <div>
    <h-msg-box v-model="tempSaleDealInfoWin" :maximize="true" :mask-closable="false" @on-close="handleClose"
               width="1000" class="h-form-search-layer" top="10">
      <p slot="header">
        <span>成交详情</span>
      </p>
      <div>
        <!--数据展示表格-->
        <h-datagrid :columns="columns" highlight-row :url="batchsUrl" :bindForm="formItem" ref="datagrid" :auto-load="false">
          <div slot="toolbar" class="pull-left">
          </div>
        </h-datagrid>
      </div>
      <div slot="footer">
      </div>
    </h-msg-box>
    <quote-sale-detail :batchId="batchId" :dictMap="dictMap" :busiType="busiType" :saleDetailWin="showDetilBox" :rootUrl="rootUrl"
                  @closeMsgBox="closeDetil"></quote-sale-detail>
  </div>
</template>

<script>
  import { getDictListByGroups, getDictValueFromMap, post, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "saleDealInfo",
    data() {
      return {
        batchsUrl: "/be/market/clickdeal/sale/saleTrackQuery/func_queryClickSaleSubBatch",
        dictMap: new Map(),
        busiType: "",
        batchId: "",
        columns: [
          {
            type: "radio",
            width: 50,
            title: "  ",
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
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
                    this.showDetil(params.row.id, params.row.busiType);
                  }
                }
              }, params.row.batchNo);
            }
          },
          {
            title: this.$t("m.i.be.quoteNo"),
            key: "quoteNo",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.be.quoteRelationNo"),
            key: "quoteRelationNo",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.be.dealNo"),
            key: "dealNo",
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t("m.i.common.dealStatus"),
            key: "dealStatus",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "QuoteStatus", params.row.dealStatus);
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
              return h("span", params.row.dealDtTm ? this.$moment(params.row.dealDtTm, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss") : "");
            }
          },
          {
            title: this.$t('m.i.common.acctStatus'),
            key: 'acctStatus',
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "AcctFlag", params.row.acctStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.be.otherBrchName"),
            key: "buyBrchName",
            sortable: true,
            hiddenCol: false
          }, {
            title: this.$t("m.i.be.custTraderName"),
            key: "buyTraderName",
            sortable: true,
            hiddenCol: false
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
            title: this.$t("m.i.common.totalNumBillPackage"),
            key: "totalNum",
            hiddenCol: false
          }
        ],
        formItem: {
          quoteNo: "",
          dealNo: "",
          buyBrchName: "",
          buyBrchCode: "",
          buyTraderName: "",
          buyTraderNo: ""
        },
        ifShowMore: false,
        busiTypeList: [],
        selectData: [],
        showDetilBox: false,
        param: {}
      };
    },
    props: {
      saleDealInfoWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      quoteNo: {
        type: String,
        required: true,
      },
      rootUrl: {
        type: String,
        required: true,
      },
    },
    computed: {
      tempSaleDealInfoWin: {
        get() {
          return this.saleDealInfoWin;
        },
        set() {
        }
      }
    },
    watch: {
      saleDealInfoWin(val) {
        if (val) {
          this.$nextTick(() => {
            this.formItem.quoteNo = this.quoteNo;
            this.formSearch();
          });
        }
      },
      batchId(val) {
        this.batchId = val;
      }
    },
    components: {
      QuoteSaleDetail: () => import(/* webpackChunkName: "be/market/clickdeal/sale/quoteSaleDetail" */`@/views/bizViews/be/market/clickdeal/sale/quoteSaleDetail`)
    },
    mounted() {
      getDictListByGroups("BusiType,BookType,AssetIndustry,CreditDeductRule,Yon,CdSelectMode,QuoteStatus,QuoteBusiType,SettleType,ClearType,ClearSpeed,CDMedia,DraftTypeCode,CreditMajor,PreRelationFlag,AcctFlag,BillOrigin").then(res => {
        this.busiTypeList = res.get("QuoteBusiType");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      handleClose(){
        this.formSearchReset();
        this.$emit("saleDealInfoWinClose", "");
      },
      showChange(val) {
        this.ifShowMore = val;
      },
      //根据弹框所选数据进行赋值
      brchCodeChange(info) {
        if (info === null) {
          this.$msgTip.info(this, { info: "请先选择记录！" });
          return;
        }
        this.formItem.buyBrchCode = info.brchCode;
        this.formItem.buyBrchName = info.brchFullNameZh;
        this.showbrch = false;
      },
      traderIdChange(info) {
        if (info === null) {
          this.$msgTip.info(this, { info: "请先选择记录！" });
          return;
        }
        this.formItem.buyTraderNo = info.traderId;
        this.formItem.buyTraderName = info.traderName;
        this.showtrader = false;
      },
      formSearch() {
        this.$refs.datagrid.dataChange(1);
        this.selectData = [];
      },
      formSearchReset() {
        //this.$refs.formItem.resetFields();
        this.formItem.buyBrchCode = "";
        this.formItem.buyTraderNo = "";
      },
      showDetil(id, busiType) {
        this.batchId = id;
        this.busiType = busiType;
        this.showDetilBox = true;
      },
      closeDetil() {
        this.showDetilBox = false;
      },
      clearVal(type) {
        if (type == "buyBrchName") {
          this.formItem.buyBrchCode = "";
          this.formItem.buyBrchName = "";
        }
        if (type == "buyTraderName") {
          this.formItem.buyTraderNo = "";
          this.formItem.buyTraderName = "";
        }
      }
    }
  };
</script>

<style scoped>

</style>
