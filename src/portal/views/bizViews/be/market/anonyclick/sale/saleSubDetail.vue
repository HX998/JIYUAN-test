<!--匿名点击正回购-查看弹出框-->
<template>
  <div>
    <h-msg-box v-model="tempSaleSubDetailWin" :maximize="true" :mask-closable="false" @on-close="handleClose"
               width="1000" class="h-form-search-layer" top="10" >
      <p slot="header">
        <span>查看报价</span>
      </p>
      <div class="text-body">
        <anony-sale-detail :anonySaleDetailWin="saleSubDetailWin" :viewDatailForm="saleSubDetailForm" :batchParams="batchParams" ></anony-sale-detail>
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
    name: "saleSubDetail",
    components: {
      AnonySaleDetail: () => import(/* webpackChunkName: "be/market/anonyclick/sale/anonySaleDetail"*/"@/views/bizViews/be/market/anonyclick/sale/anonySaleDetail")
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
        dictMap: new Map(),
        exportBillCommit: false,
        saleSubDetailForm: {
          id: "",
          batchNo:"",
          busiType: "",
          quoteNo: "",
          dealNo: "",
          dealDtTm: "",
          saleBrchName: "",
          saleBrchCode: "",
          saleTraderName: "",
          saleTraderNo: "",
          buyBrchName: "",
          buyBrchCode: "",
          buyProductName: "",
          buyProductNo: "",
          buyTraderName: "",
          buyTraderNo: "",
          billType: "",
          billClass: "",
          subDeal:"",
          clearType: "",
          settleMode: "",
          clearSpeed: "",
          firstSettleDt: "",
          tenorDays:"",
          tenorVarieties:"",
          dueSettleDt:"",
          ratePct: "",
          buyBackTotalAmt: "",
          firstSettleAmt: "",
          dueSettleAmt: "",
          firstPayInterest: "",
          creditMainBrchClass: "",
          setTm: "",
          respTm: "",
          totalAmt: "",
          totalNum: ""
        },
        columns: [
          {
            type: "selection",
            width: 50,
            hiddenCol: false,
            align: "center"
          },
          {
            type: "index",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center"
          },
          {
            title: this.$t("m.i.common.status"),
            key: "preRelationFlag",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "PreRelationFlag", params.row.preRelationFlag);
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
              let dictValue = (!params.row.billOrigin || params.row.billOrigin === 'CS00') ? '-' : this.getDictValueFromMap(this.dictMap, 'BillOrigin', params.row.billOrigin);
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
            sortable: true,
            hiddenCol: false,
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
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h("span", params.row.dueMatDt ? this.$moment(params.row.dueMatDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          },
          {
            title: this.$t("m.i.be.payInterestByUnit"),
            key: "firstPayInterest",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let interest = formatNumber(params.row.firstPayInterest, 2, ",");
              return h("span", {
                domProps: {
                  title: interest
                }
              }, interest);
            }
          },
          {
            title: this.$t("m.i.be.firstSettleAmtByUnit"),
            key: "firstSettleAmt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let settleAmt = formatNumber(params.row.firstSettleAmt, 2, ",");
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
            key: "creditMainBankType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "CreditMajor", params.row.creditMainBankType);
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
      saleSubDetailWin: {
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
      tempSaleSubDetailWin: {
        get() {
          return this.saleSubDetailWin;
        },
        set() {
        }
      }
    },
    watch: {
      saleSubDetailWin(val) {
        if (val) {
          this.dataGridUrl = this.batchParams.subBillsUrl;
          this.dictMap = this.batchParams.dictMap;
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
        let url = this.batchParams.subBatchUrl
        post(params, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let obj = res.data.retData;
              this.saleSubDetailForm.id = obj.id;
              this.saleSubDetailForm.batchNo = obj.batchNo;
              this.saleSubDetailForm.busiType = obj.busiType;
              this.saleSubDetailForm.quoteNo = obj.quoteNo;
              this.saleSubDetailForm.dealNo = obj.dealNo;
              this.saleSubDetailForm.dealDtTm = obj.dealDtTm=== null ?"":obj.dealDtTm.toString();
              this.saleSubDetailForm.saleBrchName = obj.saleBrchName;
              this.saleSubDetailForm.saleBrchCode = obj.saleBrchCode;
              this.saleSubDetailForm.saleTraderName = obj.saleTraderName;
              this.saleSubDetailForm.saleTraderNo = obj.saleTraderNo;
              this.saleSubDetailForm.buyBrchName = obj.buyBrchName;
              this.saleSubDetailForm.buyBrchCode = obj.buyBrchCode;
              this.saleSubDetailForm.buyProductName = obj.buyProductName;
              this.saleSubDetailForm.buyProductNo = obj.buyProductNo;
              this.saleSubDetailForm.buyTraderName = obj.buyTraderName;
              this.saleSubDetailForm.buyTraderNo = obj.buyTraderNo;
              this.saleSubDetailForm.billType = obj.billType;
              this.saleSubDetailForm.billClass = obj.billClass;
              this.saleSubDetailForm.subDeal = obj.subDeal;
              this.saleSubDetailForm.clearType = obj.clearType;
              this.saleSubDetailForm.settleMode = obj.settleMode;
              this.saleSubDetailForm.clearSpeed = obj.clearSpeed;
              this.saleSubDetailForm.firstSettleDt = obj.firstSettleDt === null ? "" : obj.firstSettleDt.toString();
              this.saleSubDetailForm.tenorDays = obj.tenorDays;
              this.saleSubDetailForm.tenorVarieties = obj.tenorVarieties;
              this.saleSubDetailForm.dueSettleDt = obj.dueSettleDt === null ? "" : obj.dueSettleDt.toString();
              this.saleSubDetailForm.ratePct = obj.ratePct;
              this.saleSubDetailForm.buyBackTotalAmt = obj.buyBackTotalAmt=== null ?"":obj.buyBackTotalAmt.toString();
              this.saleSubDetailForm.firstSettleAmt = obj.firstSettleAmt=== null ?"":obj.firstSettleAmt.toString();
              this.saleSubDetailForm.dueSettleAmt = obj.dueSettleAmt=== null ?"":obj.dueSettleAmt.toString();
              this.saleSubDetailForm.firstPayInterest = obj.firstPayInterest=== null ?"":obj.firstPayInterest.toString();
              this.saleSubDetailForm.creditMainBrchClass = obj.creditMainBrchClass;
              this.saleSubDetailForm.setTm = obj.setTm;
              this.saleSubDetailForm.respTm = obj.respTm;
              this.saleSubDetailForm.totalAmt = obj.totalAmt;
              this.saleSubDetailForm.totalNum = obj.totalNum;
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
        this.saleSubDetailForm.id = "";
        this.dataGridFormItem.batchId = "";
        this.dataGridUrl="";
        this.$emit("saleSubDetailWinClose", "");
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
        let url = window.LOCAL_CONFIG.API_HOME + this.batchParams.subExportUrl;
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
