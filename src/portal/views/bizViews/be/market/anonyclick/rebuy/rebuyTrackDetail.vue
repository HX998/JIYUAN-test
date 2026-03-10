<!--匿名点击-买入申请-查看弹出框-->
<template>
  <div>
    <h-msg-box v-model="tempRebuyTrackDetailWin" :maximize="true" :mask-closable="false" @on-close="handleClose"
               width="1000" class="h-form-search-layer" top="10" >
      <p slot="header">
        <span>查看报价</span>
      </p>
      <div class="text-body">
        <anony-apply-detail :anonyApplyDetailWin="rebuyTrackDetailWin":viewDatailForm="rebuyTrackDetailForm" :batchParams="batchParams" ></anony-apply-detail>
      </div>
      <!--数据展示表格-->
      <h-datagrid
        :columns="columns"
        highlight-row
        :auto-load="false"
        :url="dataGridUrl"
        :bindForm="dataGridFormItem"
        :has-select="false"
        :rowSelect="true"
        ref="datagrid">
        <div slot="toolbar" class="pull-left">
          <h-button type="primary" @click="exportTable()" v-if="batchParams.batchType!=='show'"
          :disabled="exportBillCommit">
          {{$t("m.i.common.exportExcel")}}
          </h-button>
        </div>
      </h-datagrid>
      <div slot="footer">
      </div>
    </h-msg-box>
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="billId"
                    :billNo="billNo" :billRangeStart="billRangeStart" :billRangeEnd="billRangeEnd"></bill-info-main>
  </div>
</template>

<script>
  import { post, formatNumber,getDictValueFromMap} from "@/api/bizApi/commonUtil";

  export default {
    name: "rebuyTrackDetail",
    components: {
      AnonyApplyDetail: () => import(/* webpackChunkName: "be/market/anonyclick/rebuy/anonyApplyDetail"*/"@/views/bizViews/be/market/anonyclick/rebuy/anonyApplyDetail")
    },
    data() {
      return {
        dataGridUrl: "",
        batchId: "",
        showBillInfoWin:false,
        billId:"",
        billNo:"",
        billRangeStart:'',
        billRangeEnd:'',
        rebuyTrackDetailForm: {
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
            type: "index",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center"
          },
          {
            title: this.$t("m.i.common.status"),
            key: "status",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.batchParams.dictMap, "AnonyClickBillStatus", params.row.status);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.billInfo.billOrigin'),
            key: 'billOrigin',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = (!params.row.billOrigin || params.row.billOrigin === 'CS00') ? '-' : this.getDictValueFromMap(this.batchParams.dictMap, 'BillOrigin', params.row.billOrigin);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.billInfo.billPackageNo"),
            key: "billNo",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.billInfoWinOpen(params.row.billId, params.row.billNo,params.row.billRangeStart,params.row.billRangeEnd);
                  }
                }
              }, params.row.billNo);
            }
          },
          {
            title: this.$t('m.i.billInfo.billRange'),
            key: 'billRange',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = !params.row.billRange ? '-' : params.row.billRange;
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.billInfo.billPackageMoney"),
            key: "billMoney",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let billMoney = formatNumber(params.row.billMoney, 2, ",");
              return h("span", {
                domProps: {
                  title: billMoney
                }
              }, billMoney);
            }
          },
          {
            title: this.$t("m.i.billInfo.dueDt"),
            key: "dueDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h("span", params.row.dueDt ? this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          },
          {
            title: this.$t("m.i.billInfo.dueMatDt"),
            key: "dueMatDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h("span", params.row.dueMatDt ? this.$moment(params.row.dueMatDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          },
          {
            title: this.$t("m.i.be.payInterestByUnit"),
            key: "interest",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let interest = formatNumber(params.row.interest, 2, ",");
              return h("span", {
                domProps: {
                  title: interest
                }
              }, interest);
            }
          },
          {
            title: this.$t("m.i.be.firstSettleAmtByUnit"),
            key: "settleAmt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let settleAmt = formatNumber(params.row.settleAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: settleAmt
                }
              }, settleAmt);
            }
          },
          {
            title: this.$t("m.i.be.dueSettleAmtByUnit"),
            key: "dueSettleAmt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let dueSettleAmt = formatNumber(params.row.dueSettleAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: dueSettleAmt
                }
              }, dueSettleAmt);
            }
          },
          {
            title: this.$t("m.i.billInfo.creditMainBankType"),
            key: "creditMainBrchClass",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.batchParams.dictMap, "CreditMajor", params.row.creditMainBrchClass);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.billInfo.creditMainBrchCode"),
            key: "creditMainBrchCode",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.creditMainBankName"),
            key: "creditMainBankName",
            hiddenCol: false
          }
        ],
        dataGridFormItem: {
          batchId: ""
        }
      };
    },
    props: {
      rebuyTrackDetailWin: {
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
      tempRebuyTrackDetailWin: {
        get() {
          return this.rebuyTrackDetailWin;
        },
        set() {
        }
      }
    },
    watch: {
      rebuyTrackDetailWin(val) {
        if (val) {
          this.dataGridUrl = this.batchParams.billsUrl;
          this.$nextTick(() => {
            this.batchId = this.batchParams.batchId;
            this.dataGridFormItem.batchId = this.batchId;
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
        let url =this.batchParams.batchUrl;
        post(params, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let obj = res.data.retData;
              this.rebuyTrackDetailForm.id = obj.id;
              this.rebuyTrackDetailForm.busiType = obj.busiType;
              this.rebuyTrackDetailForm.batchNo = obj.batchNo;
              this.rebuyTrackDetailForm.quoteNo = obj.quoteNo;
              this.rebuyTrackDetailForm.buyBrchName = obj.buyBrchName;
              this.rebuyTrackDetailForm.buyTraderName = obj.buyTraderName;
              this.rebuyTrackDetailForm.billType = obj.billType;
              this.rebuyTrackDetailForm.billClass = obj.billClass;
              this.rebuyTrackDetailForm.ratePct = obj.ratePct;
              this.rebuyTrackDetailForm.buyBackTotalAmt = obj.buyBackTotalAmt=== null ?"":obj.buyBackTotalAmt.toString();
              this.rebuyTrackDetailForm.tenorDays = obj.tenorDays;
              this.rebuyTrackDetailForm.tenorVarieties = obj.tenorVarieties;
              this.rebuyTrackDetailForm.clearType = obj.clearType;
              this.rebuyTrackDetailForm.settleMode = obj.settleMode;
              this.rebuyTrackDetailForm.clearSpeed = obj.clearSpeed;
              this.rebuyTrackDetailForm.settleDt = obj.settleDt === null ? "" : obj.settleDt.toString();
              this.rebuyTrackDetailForm.dueSettleDt = obj.dueSettleDt === null ? "" : obj.dueSettleDt.toString();
              this.rebuyTrackDetailForm.creditMainBrchClass = obj.creditMainBrchClass;
              this.rebuyTrackDetailForm.dealTotalAmt = obj.dealTotalAmt;
              this.rebuyTrackDetailForm.dealTotalNum = obj.dealTotalNum;
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //关闭弹窗
      handleClose() {
        this.batchId="";
        this.rebuyTrackDetailForm.id = "";
        this.dataGridFormItem.batchId = "";
        this.dataGridUrl ="";
        this.$emit("rebuyTrackDetailWinClose", "");
      },
      handleSearch(pageNo) {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.dataChange(!!pageNo ? pageNo : 1);
      },
      billInfoWinClose() {
        this.billId = null;
        this.billNo = null;
        this.billRangeStart = null;
        this.billRangeEnd = null;
        this.showBillInfoWin = false;
      },
      billInfoWinOpen(billId, billNo,billRangeStart,billRangeEnd) {
        this.billId = billId;
        this.billNo = billNo;
        this.billRangeStart=billRangeStart;
        this.billRangeEnd=billRangeEnd;
        this.showBillInfoWin = true;
      },
      exportTable() {
        let url = window.LOCAL_CONFIG.API_HOME + this.batchParams.exportUrl;
        let form = document.createElement("form");
        form.setAttribute("id", "formId");
        form.setAttribute("action", url);
        form.setAttribute("method", "post");
        let input = document.createElement("input");
        input.type = "text";
        input.name = "batchId";
        input.value = this.batchId;
        form.appendChild(input);
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
      },
    }
  };
</script>

<style scoped>

</style>
