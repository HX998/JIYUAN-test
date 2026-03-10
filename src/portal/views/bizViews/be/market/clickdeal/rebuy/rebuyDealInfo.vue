<template>
  <div>
    <h-msg-box v-model="tempRebuyDealInfoWin" :maximize="true" :mask-closable="false" @on-close="handleClose"
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
    <rebuy-detail :batchId="batchId" :dictMap="dictMap" :busiType="busiType" :rebuyDetailWin="showDetilBox"
                  @closeMsgBox="closeDetil" :rootUrl="rootUrl"></rebuy-detail>
  </div>
</template>

<script>
  import { getDictListByGroups, getDictValueFromMap, post, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "rebuyDealInfo",
    data() {
      return {
        batchsUrl: "/be/market/clickdeal/rebuy/rebuyTrackQuery/func_queryClickRebuySubBatch",
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
            hiddenCol: false
          },
          {
            title: this.$t("m.i.be.quoteRelationNo"),
            key: "quoteRelationNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.be.dealNo"),
            key: "dealNo",
            hiddenCol: false
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
            key: "saleBrchName",
            sortable: true,
            hiddenCol: false
          }, {
            title: this.$t("m.i.be.custTraderName"),
            key: "saleTraderName",
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
          saleBrchName: "",
          saleBrchCode: "",
          saleTraderName: "",
          saleTraderNo: ""
        },
        ifShowMore: false,
        busiTypeList: [],
        selectData: [],
        showDetilBox: false,
        param: {}
      };
    },
    props: {
      rootUrl:{
        type: String,
        default() {
          return "";
        }
      },
      rebuyDealInfoWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      quoteNo: {
        type: String,
        required: true,
      }
    },
    computed: {
      tempRebuyDealInfoWin: {
        get() {
          return this.rebuyDealInfoWin;
        },
        set() {
        }
      }
    },
    watch: {
      rebuyDealInfoWin(val) {
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
      RebuyDetail: () => import(/* webpackChunkName: "be/market/clickdeal/rebuy/quoteRebuyDetail" */`@/views/bizViews/be/market/clickdeal/rebuy/quoteRebuyDetail`)
    },
    mounted() {
      getDictListByGroups("BookType,AssetIndustry,CreditDeductRule,Yon,CdSelectMode,QuoteStatus,QuoteBusiType,SettleType,ClearType,ClearSpeed,CDMedia,DraftTypeCode,CreditMajor,PreRelationFlag,AcctFlag,BillOrigin").then(res => {
        this.busiTypeList = res.get("QuoteBusiType");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      handleClose(){
        this.formSearchReset();
        this.$emit("rebuyDealInfoWinClose", "");
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
        this.formItem.saleBrchCode = info.brchCode;
        this.formItem.saleBrchName = info.brchFullNameZh;
        this.showbrch = false;
      },
      traderIdChange(info) {
        if (info === null) {
          this.$msgTip.info(this, { info: "请先选择记录！" });
          return;
        }
        this.formItem.saleTraderNo = info.traderId;
        this.formItem.saleTraderName = info.traderName;
        this.showtrader = false;
      },
      formSearch() {
        this.$refs.datagrid.dataChange(1);
        this.selectData = [];
      },
      formSearchReset() {
        //this.$refs.formItem.resetFields();
        this.formItem.saleBrchCode = "";
        this.formItem.saleTraderNo = "";
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
        if (type == "saleBrchName") {
          this.formItem.saleBrchCode = "";
          this.formItem.saleBrchName = "";
        }
        if (type == "saleTraderName") {
          this.formItem.saleTraderNo = "";
          this.formItem.saleTraderName = "";
        }
      }
    }
  };
</script>

<style scoped>

</style>
