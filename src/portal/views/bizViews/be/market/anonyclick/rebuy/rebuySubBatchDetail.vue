<!--匿名点击-买入申请-查看弹出框-->
<template>
  <div>
    <h-msg-box v-model="tempRebuySubBatchDetailWin" :maximize="true" :mask-closable="false" @on-close="handleClose"
               width="1000" class="h-form-search-layer" top="10" >
      <p slot="header">
        <span>查看报价</span>
      </p>
      <div class="text-body">
        <anony-apply-detail :anonyApplyDetailWin="rebuySubBatchDetailWin" :viewDatailForm="rebuySubBatchDetailForm" :batchParams="batchParams" ></anony-apply-detail>
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
    <rebuy-detail :batchId="rebuyBatchId" :dictMap="batchParams.dictMap" :busiType="busiType"  :rebuyDetailWin="showDetilBox" :batchParams="batchParams"
    @closeMsgBox="closeMsgBox"></rebuy-detail>
  </div>
</template>

<script>
  import { post, formatNumber,getDictValueFromMap} from "@/api/bizApi/commonUtil";

  export default {
    name: "rebuySubBatchDetail",
    components: {
      AnonyApplyDetail: () => import(/* webpackChunkName: "be/market/anonyclick/rebuy/anonyApplyDetail"*/"@/views/bizViews/be/market/anonyclick/rebuy/anonyApplyDetail"),
      RebuyDetail:()=>import(/* webpackChunkName: "be/market/anonyclick/rebuy/rebuyDetail" */`@/views/bizViews/be/market/anonyclick/rebuy/rebuyDetail`),
    },
    data() {
      return {
        dataGridUrl: "",
        batchId: "",
        rebuyBatchId:"",
        busiType:"",
        showDetilBox:false,
        dictMap: new Map(),
        rebuySubBatchDetailForm: {
          id: "",
          busiType: "",
          batchNo: "",
          quoteNo: "",
          buyBrchName: "",
          buyTraderName: "",
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
          creditMainBrchClass: ""
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
            hiddenCol: false,
            sortable: true,
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
            key: 'buyBrchName',
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.traderName'),
            key: 'buyTraderName',
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.otherBrchName'),
            key: "saleBrchName",
            sortable: true,
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.be.custTraderName'),
            key: "saleTraderName",
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
      rebuySubBatchDetailWin: {
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
      tempRebuySubBatchDetailWin: {
        get() {
          return this.rebuySubBatchDetailWin;
        },
        set() {
        }
      }
    },
    watch: {
      rebuySubBatchDetailWin(val) {
        if (val) {
          this.dataGridUrl = this.batchParams.billsUrl;
          this.dictMap=this.batchParams.dictMap
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
              this.rebuySubBatchDetailForm.id = obj.id;
              this.rebuySubBatchDetailForm.busiType = obj.busiType;
              this.rebuySubBatchDetailForm.batchNo = obj.batchNo;
              this.rebuySubBatchDetailForm.quoteNo = obj.quoteNo;
              this.rebuySubBatchDetailForm.buyBrchName = obj.buyBrchName;
              this.rebuySubBatchDetailForm.buyTraderName = obj.buyTraderName;
              this.rebuySubBatchDetailForm.billType = obj.billType;
              this.rebuySubBatchDetailForm.billClass = obj.billClass;
              this.rebuySubBatchDetailForm.ratePct = obj.ratePct;
              this.rebuySubBatchDetailForm.buyBackTotalAmt = obj.buyBackTotalAmt=== null ?"":obj.buyBackTotalAmt.toString();
              this.rebuySubBatchDetailForm.tenorDays = obj.tenorDays;
              this.rebuySubBatchDetailForm.tenorVarieties = obj.tenorVarieties;
              this.rebuySubBatchDetailForm.clearType = obj.clearType;
              this.rebuySubBatchDetailForm.settleMode = obj.settleMode;
              this.rebuySubBatchDetailForm.clearSpeed = obj.clearSpeed;
              this.rebuySubBatchDetailForm.settleDt = obj.settleDt === null ? "" : obj.settleDt.toString();
              this.rebuySubBatchDetailForm.dueSettleDt = obj.dueSettleDt === null ? "" : obj.dueSettleDt.toString();
              this.rebuySubBatchDetailForm.creditMainBrchClass = obj.creditMainBrchClass;
              this.rebuySubBatchDetailForm.dealTotalAmt = obj.dealTotalAmt;
              this.rebuySubBatchDetailForm.dealTotalNum = obj.dealTotalNum;
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
        this.rebuySubBatchDetailForm.id = "";
        this.dataGridFormItem.quoteNo = "";
        this.dataGridUrl ="";
        this.currentSelectRow = [];
        this.$emit("rebuySubBatchDetailWinClose", "");
      },
      handleSearch(pageNo) {
        this.currentSelectRow = [];
        // this.$refs.datagrid.selects = [];
        // this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.dataChange(!!pageNo ? pageNo : 1);
      },
      batchDetail(id,busiType){
        this.rebuyBatchId=id;
        this.busiType=busiType;
        this.showDetilBox = true
      },
      closeMsgBox() {
        this.rebuyBatchId="";
        this.busiType="";
        this.showDetilBox = false;
      }
    },

  };
</script>

<style scoped>

</style>
