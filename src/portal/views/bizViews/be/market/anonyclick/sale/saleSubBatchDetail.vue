<!--匿名点击正回购-查看弹出框-->
<template>
  <div>
    <h-msg-box v-model="tempSaleSubBatchDetailWin" :maximize="true" :mask-closable="false" @on-close="handleClose"
               width="1000" class="h-form-search-layer" top="10" >
      <p slot="header">
        <span>查看报价</span>
      </p>
      <div class="text-body">
        <anony-apply-detail :anonyApplyDetailWin="saleSubBatchDetailWin" :viewDatailForm="saleSubBatchDetailForm" :batchParams="batchParams" ></anony-apply-detail>
      </div>
      <!--数据展示表格-->
      <h-datagrid
        :columns="columns"
        highlight-row
        :auto-load="false"
        :url="dataGridUrl"
        :bindForm="dataGridFormItem"
        :onCurrentChange="handleCurrentChange"
        :onCurrentChangeCancel="handleCurrentChangeCancel"
        ref="datagrid">
        <div slot="toolbar" class="pull-left">
          <!--<h-button type="primary" @click="exportBill()" v-if="batchParams.batchType!=='show'"-->
          <!--:disabled="exportBillCommit">-->
          <!--{{$t("m.i.common.exportExcel")}}-->
          <!--</h-button>-->
        </div>
      </h-datagrid>
      <div slot="footer">
      </div>
    </h-msg-box>
    <!--子批详情页面-->
    <sale-sub-detail :saleSubDetailWin="saleSubDetailWin" :batchParams="batchParams"
                     @saleSubDetailWinClose="saleSubDetailWinClose" ref="saleSubDetail"></sale-sub-detail>
  </div>
</template>

<script>
  import { post, formatNumber,getDictValueFromMap} from "@/api/bizApi/commonUtil";

  export default {
    name: "saleSubBatchDetail",
    components: {
      AnonyApplyDetail: () => import(/* webpackChunkName: "be/market/anonyclick/sale/anonyApplyDetail"*/"@/views/bizViews/be/market/anonyclick/sale/anonyApplyDetail"),
      SaleSubDetail: () => import(/* webpackChunkName: "be/market/anonyclick/sale/saleSubDetail" */`@/views/bizViews/be/market/anonyclick/sale/saleSubDetail`)
    },
    data() {
      return {
        dataGridUrl: "",
        batchId: "",
        saleBatchId:"",
        busiType:"",
        dictMap: new Map(),
        saleSubDetailWin:false,
        saleSubBatchDetailForm: {
          id: "",
          busiType: "",
          batchNo: "",
          quoteNo: "",
          saleBrchName: "",
          saleTraderName: "",
          billType: "",
          billClass: "",
          rate: "",
          buyBackTotalAmt: "",
          tenorDays:"",
          tenorVarieties:"",
          clearType: "",
          settleMode: "",
          clearSpeed: "",
          settleDt: "",
          dueSettleDt:"",
          creditMainBrchClass: "",
          dealTotalAmt: "",
          dealTotalNum: "",
          totalAmt: "",
          totalNum: "",

        },
        columns: [
          {
            type: "radio",
            width: 50,
            title: " ",
            key: "multiSelect",
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
            title: this.$t('m.i.common.batchNo'),
            key: "batchNo",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('a', {
                on: {
                  click: () => {
                    this.batchDetail(params.row.id, params.row.busiType)
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
            title: this.$t('m.i.common.dealStatus'),
            key: "dealStatus",
            hiddenCol: false,
            render: (h, params) =>{
              let dictValue =getDictValueFromMap(this.dictMap, 'QuoteStatus', params.row.dealStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.firstClearStatus'),
            key: 'clearStatus',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue =this.getDictValueFromMap(this.dictMap, 'StlResult', params.row.clearStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.dueClearStatus'),
            key: 'dueClearStatus',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue =this.getDictValueFromMap(this.dictMap, 'StlResult', params.row.dueClearStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.firstAcctStatus'),
            key: 'acctStatus',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue =this.getDictValueFromMap(this.dictMap, 'AcctFlag', params.row.acctStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.dueAcctStatus'),
            key: 'dueAcctFlag',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue =this.getDictValueFromMap(this.dictMap, 'AcctFlag', params.row.dueAcctFlag);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.quoteNo'),
            key: "quoteNo",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.dealNo'),
            key: "dealNo",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.dealDtTm'),
            key: "dealDtTm",
            hiddenCol: false,
            render: (h, params) => {
              return h('span', params.row.dealDtTm ? this.$moment(params.row.dealDtTm, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss") : "")
            }
          },
          {
            title: this.$t('m.i.be.ownBrchName'),
            key: 'saleBrchName',
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.traderName'),
            key: 'saleTraderName',
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.otherBrchName'),
            key: "buyBrchName",
            sortable: true,
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.be.custTraderName'),
            key: "buyTraderName",
            sortable: true,
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.billInfo.billType'),
            key: "billType",
            hiddenCol: false,
            render: (h, params) =>{
              let dictValue =getDictValueFromMap(this.dictMap, 'DraftTypeCode', params.row.billType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.billInfo.billClass'),
            key: "billClass",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue =getDictValueFromMap(this.dictMap, 'CDMedia', params.row.billClass);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.repurchaseRate'),
            key: "ratePct",
            sortable: true,
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.be.firstSettleDate'),
            key: "firstSettleDt",
            hiddenCol: false,
            sortable: true,
            render:(h, params) => {
              let firstSettleDt= params.row.firstSettleDt ? this.$moment(params.row.firstSettleDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "";
              return h('span',  firstSettleDt)
            }
          },
          {
            title: this.$t('m.i.be.dueSettleDt'),
            key: "dueSettleDt",
            sortable: true,
            hiddenCol: false,
            render:(h, params)  => {
              let dueSettle = params.row.dueSettleDt ? this.$moment(params.row.dueSettleDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "";
              return h('span', dueSettle)
            }
          },
          {
            title: this.$t('m.i.common.totalAmtBillPackage'),
            key: "totalAmt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', formatNumber(params.row.totalAmt, 2, ','))
            },
          },
          {
            title: this.$t('m.i.be.firstPayInterestByUnit'),
            key: "firstPayInterest",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', formatNumber(params.row.firstPayInterest, 2, ','))
            },
          },
          {
            title: this.$t('m.i.be.firstSettleAmtByUnit'),
            key: "firstSettleAmt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', formatNumber(params.row.firstSettleAmt, 2, ','))
            },
          },
          {
            title: this.$t('m.i.be.dueSettleAmtByUnit'),
            key: "dueSettleAmt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', formatNumber(params.row.dueSettleAmt, 2, ','))
            },
          },
          {
            title: this.$t('m.i.be.repoTerm'),
            key: "tenorDays",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.totalNumBillPackage'),
            key: "totalNum",
            hiddenCol: false
          }
        ],
        dataGridFormItem: {
          quoteNo: ""
        },
        currentSelectRow: [],
      };
    },
    props: {
      saleSubBatchDetailWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      batchParams: {
        type: Object,
        default: {}
      }
    },
    computed: {
      tempSaleSubBatchDetailWin: {
        get() {
          return this.saleSubBatchDetailWin;
        },
        set() {
        }
      }
    },
    watch: {
      saleSubBatchDetailWin(val) {
        if (val) {
          this.dataGridUrl = this.batchParams.billsUrl;
          this.dictMap = this.batchParams.dictMap;
          this.$nextTick(() => {
            this.batchId = this.batchParams.batchId;
            this.dataGridFormItem.quoteNo = this.batchParams.quoteNo;
            this.queryObjById();
            this.handleSearch();
          });
        }
      }
    },
    methods: {
      //根据批次Id查询批次信息
      queryObjById() {
        let params = { id: this.batchId };
        let url = this.batchParams.batchUrl;
        post(params, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let obj = res.data.retData;
              this.saleSubBatchDetailForm.id = obj.id;
              this.saleSubBatchDetailForm.busiType = obj.busiType;
              this.saleSubBatchDetailForm.batchNo = obj.batchNo;
              this.saleSubBatchDetailForm.quoteNo = obj.quoteNo;
              this.saleSubBatchDetailForm.saleBrchName = obj.saleBrchName;
              this.saleSubBatchDetailForm.saleTraderName = obj.saleTraderName;
              this.saleSubBatchDetailForm.billType = obj.billType;
              this.saleSubBatchDetailForm.billClass = obj.billClass;
              this.saleSubBatchDetailForm.ratePct = obj.ratePct;
              this.saleSubBatchDetailForm.buyBackTotalAmt = obj.buyBackTotalAmt=== null ?"":obj.buyBackTotalAmt.toString();
              this.saleSubBatchDetailForm.tenorDays = obj.tenorDays;
              this.saleSubBatchDetailForm.tenorVarieties = obj.tenorVarieties;
              this.saleSubBatchDetailForm.clearType = obj.clearType;
              this.saleSubBatchDetailForm.settleMode = obj.settleMode;
              this.saleSubBatchDetailForm.clearSpeed = obj.clearSpeed;
              this.saleSubBatchDetailForm.settleDt = obj.settleDt === null ? "" : obj.settleDt.toString();
              this.saleSubBatchDetailForm.dueSettleDt = obj.dueSettleDt === null ? "" : obj.dueSettleDt.toString();
              this.saleSubBatchDetailForm.creditMainBrchClass = obj.creditMainBrchClass;
              this.saleSubBatchDetailForm.dealTotalAmt = obj.dealTotalAmt;
              this.saleSubBatchDetailForm.dealTotalNum = obj.dealTotalNum;
              this.saleSubBatchDetailForm.totalAmt = obj.totalAmt;
              this.saleSubBatchDetailForm.totalNum = obj.totalNum;

            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      //关闭弹窗
      handleClose() {
        this.batchId="";
        this.saleSubBatchDetailForm.id = "";
        this.dataGridFormItem.quoteNo = "";
        this.dataGridUrl ="";
        this.currentSelectRow = [];
        this.$emit("saleSubBatchDetailWinClose", "");
      },
      handleSearch(pageNo) {
        this.currentSelectRow = [];
        // this.$refs.datagrid.selects = [];
        // this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.dataChange(!!pageNo ? pageNo : 1);
      },
      //跳转详情页面
      batchDetail(id) {
        this.batchParams.batchId = id;
        this.batchParams.dictMap = this.dictMap;
        this.saleSubDetailWin = true;
      },
      //关闭详情弹窗
      saleSubDetailWinClose() {
        this.saleSubDetailWin = false;
        let pageNo = this.$refs.datagrid.pageInfo.pageNo;
        this.handleSearch(pageNo);
      },
    },

  };
</script>

<style scoped>

</style>
