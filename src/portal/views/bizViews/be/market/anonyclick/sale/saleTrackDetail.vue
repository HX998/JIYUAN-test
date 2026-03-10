<!--匿名点击正回购-查看弹出框-->
<template>
  <div>
    <h-msg-box v-model="tempSaleApplyDetailWin" :maximize="true" :mask-closable="false" @on-close="handleClose"
               width="1000" class="h-form-search-layer" top="10" >
      <p slot="header">
        <span>查看报价</span>
      </p>
      <div class="text-body">
        <anony-apply-detail :anonyApplyDetailWin="saleApplyDetailWin" :viewDatailForm="saleApplyDetailForm" :batchParams="batchParams" ></anony-apply-detail>
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
    name: "saleTrackDetail",
    components: {
      AnonyApplyDetail: () => import(/* webpackChunkName: "be/market/anonyclick/sale/anonyApplyDetail"*/"@/views/bizViews/be/market/anonyclick/sale/anonyApplyDetail")
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
        exportBillCommit: false,
        saleApplyDetailForm: {
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
          // {
          //   type: "selection",
          //   width: 50,
          //   hiddenCol: false,
          //   align: "center"
          // },
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
            sortable: true,
            hiddenCol: false,
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
            title: this.$t("m.i.billInfo.remitDt"),
            key: "remitDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h("span", params.row.remitDt ? this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
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
            hiddenCol: false,
            sortable: true,
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
            title: this.$t("m.i.billInfo.drwrName"),
            key: "drwrName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.acptName"),
            key: "acptName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.acptBrchCode"),
            key: "acptBrchCode",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.acptBankName"),
            key: "acptBankName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.cfmAppBrchCode"),
            key: "cfmAppBrchCode",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.cfmAppBankName"),
            key: "cfmAppBankName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.acptGuarntrBrchCode"),
            key: "acptGuarntrBrchCode",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.acptGuarntrBankName"),
            key: "acptGuarntrBankName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.discBrchCode"),
            key: "discBrchCode",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.discBankName"),
            key: "discBankName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.discGuarntrBrchCode"),
            key: "discGuarntrBrchCode",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.discGuarntrBankName"),
            key: "discGuarntrBankName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.guarntrTrustBrchCode"),
            key: "guarntrTrustBrchCode",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.guarntrTrustBankName"),
            key: "guarntrTrustBankName",
            hiddenCol: false
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
      saleApplyDetailWin: {
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
      tempSaleApplyDetailWin: {
        get() {
          return this.saleApplyDetailWin;
        },
        set() {
        }
      }
    },
    watch: {
      saleApplyDetailWin(val) {
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
        let url = this.batchParams.batchUrl;
        post(params, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let obj = res.data.retData;
              this.saleApplyDetailForm.id = obj.id;
              this.saleApplyDetailForm.busiType = obj.busiType;
              this.saleApplyDetailForm.batchNo = obj.batchNo;
              this.saleApplyDetailForm.quoteNo = obj.quoteNo;
              this.saleApplyDetailForm.saleBrchName = obj.saleBrchName;
              this.saleApplyDetailForm.saleTraderName = obj.saleTraderName;
              this.saleApplyDetailForm.billType = obj.billType;
              this.saleApplyDetailForm.billClass = obj.billClass;
              this.saleApplyDetailForm.ratePct = obj.ratePct;
              this.saleApplyDetailForm.buyBackTotalAmt = obj.buyBackTotalAmt=== null ?"":obj.buyBackTotalAmt.toString();
              this.saleApplyDetailForm.tenorDays = obj.tenorDays;
              this.saleApplyDetailForm.tenorVarieties = obj.tenorVarieties;
              this.saleApplyDetailForm.clearType = obj.clearType;
              this.saleApplyDetailForm.settleMode = obj.settleMode;
              this.saleApplyDetailForm.clearSpeed = obj.clearSpeed;
              this.saleApplyDetailForm.settleDt = obj.settleDt === null ? "" : obj.settleDt.toString();
              this.saleApplyDetailForm.dueSettleDt = obj.dueSettleDt === null ? "" : obj.dueSettleDt.toString();
              this.saleApplyDetailForm.creditMainBrchClass = obj.creditMainBrchClass;
              this.saleApplyDetailForm.dealTotalAmt = obj.dealTotalAmt;
              this.saleApplyDetailForm.dealTotalNum = obj.dealTotalNum;
              this.saleApplyDetailForm.totalAmt = obj.totalAmt;
              this.saleApplyDetailForm.totalNum = obj.totalNum;

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
        this.saleApplyDetailForm.id = "";
        this.dataGridFormItem.batchId = "";
        this.dataGridUrl="";
        this.$emit("saleApplyDetailWinClose", "");
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
        let input2 = document.createElement("input");
        input2.type = "text";
        input2.name = "exportName";
        input2.value = "anonySaleTrackBillInfo";
        form.appendChild(input);
        form.appendChild(input2);
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
      },
    }
  };
</script>

<style scoped>

</style>
