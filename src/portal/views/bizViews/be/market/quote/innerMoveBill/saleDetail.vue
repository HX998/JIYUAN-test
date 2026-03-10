<template>
  <div>
    <h-msg-box maximize v-model="tempImageWin" width="1000" @on-close="handleClose">
      <p slot="header">
        <span>查看票据明细</span>
      </p>
      <div class="text-body">
        <h-row :gutter="16">
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.common.busiType")}}：</h-col>
              <h-col span="15" class="val">{{format("QuoteBusiType",viewDatailForm.outBusiType)}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">批次号:</h-col>
              <h-col span="15" class="val">{{viewDatailForm.batchNo}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.outQuoteNo")}}:</h-col>
              <h-col span="15" class="val">{{viewDatailForm.outQuoteNo}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.brchName")}}：</h-col>
              <h-col span="15" class="val">{{viewDatailForm.saleBrchName}}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <br>
        <h-row :gutter="16">
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.traderName")}}：</h-col>
              <h-col span="15" class="val">{{viewDatailForm.saleTraderName}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.outBuyBrchName")}}：</h-col>
              <h-col span="15" class="val">{{viewDatailForm.outBuyBrchName}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.outBuyBrchCode")}}：</h-col>
              <h-col span="15" class="val">{{viewDatailForm.outBuyBrchCode}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.outBuyTraderName")}}：</h-col>
              <h-col span="15" class="val">{{viewDatailForm.outBuyTraderName}}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <br>
        <h-row :gutter="16">
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.outBuyTraderNo")}}：</h-col>
              <h-col span="15" class="val">{{viewDatailForm.outBuyTraderNo}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.subDeal")}}：</h-col>
              <h-col span="15" class="val">{{format("Yon",viewDatailForm.subDeal)}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.billInfo.billType")}}：</h-col>
              <h-col span="15" class="val">{{format("DraftTypeCode",viewDatailForm.billType)}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.billInfo.billClass")}}：</h-col>
              <h-col span="15" class="val">{{format("CDMedia",viewDatailForm.billClass)}}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <br>
        <h-row :gutter="16">
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.outClearType")}}:</h-col>
              <h-col span="15" class="val">{{format("ClearType",viewDatailForm.outClearType)}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.outSettleMode")}}:</h-col>
              <h-col span="15" class="val">{{format("SettleType",viewDatailForm.outSettleMode)}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.outClearSpeed")}}:</h-col>
              <h-col span="15" class="val">{{format("ClearSpeed",viewDatailForm.outClearSpeed)}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.outFirstSettleDt")}}:</h-col>
              <h-col span="15" class="val">{{formatDate(viewDatailForm.outFirstSettleDt)}}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <br>
        <h-row :gutter="16">
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.outRate")}}:</h-col>
              <h-col span="15" class="val">{{viewDatailForm.outRatePct}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.outSetTm")}}:</h-col>
              <h-col span="15" class="val">{{viewDatailForm.outSetTm}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.outQuoteTm")}}:</h-col>
              <h-col span="15" class="val">{{viewDatailForm.outQuoteTm}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.prodNo")}}:</h-col>
              <h-col span="15" class="val">{{viewDatailForm.prodName}}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <br>
        <h-row :gutter="16">
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.totalAmtByYUAN")}}:</h-col>
              <h-col span="15" class="val">{{formatMoney(viewDatailForm.totalAmt)}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.totalNum")}}:</h-col>
              <h-col span="15" class="val">{{viewDatailForm.totalNum}}</h-col>
            </h-row>
          </h-col>
           <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.outFirstInterest")}}:</h-col>
              <h-col span="15" class="val">{{formatMoney(viewDatailForm.outFirstInterest)}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.outFirstSettleAmt")}}:</h-col>
              <h-col span="15" class="val">{{formatMoney(viewDatailForm.outFirstSettleAmt)}}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <br>
        <h-row :gutter="16">
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.outTenorDays")}}:</h-col>
              <h-col span="15" class="val">{{viewDatailForm.outTenorDays}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.outYieldRate")}}:</h-col>
              <h-col span="15" class="val">{{viewDatailForm.outYieldRatePct}}</h-col>
            </h-row>
          </h-col>
        </h-row>
      </div>
      <h-datagrid :columns="billsColumns" :autoLoad="autoLoad" :url="billsUrl" :bindForm="formItem" ref="bills">
        <div slot="toolbar" class="pull-left">
          <h-button type="primary" @click="exportTable">{{$t("m.i.common.exportData")}}</h-button>
        </div>
      </h-datagrid>
      <div slot="footer">
      </div>
    </h-msg-box>
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="billId"
                    :billNo="billNo"></bill-info-main>
  </div>
</template>
<script>
  import { post, formatNumber,getDictValueFromMap,accMul,formatBillRange } from "@/api/bizApi/commonUtil";

  export default {
    name: "saleDetail",
    data() {
      return {
        batchUrl: "/be/market/quote/innerMoveBill/saleQuoteApply/findIMBBatchById",
        billsUrl: "/be/market/quote/innerMoveBill/saleQuoteApply/queryIMBBillList",
        billsColumns: [
          {
            type: "index",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center"
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
            title: this.$t('m.i.billInfo.billPackageNo'),
            key: 'billNo',
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('a', {
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
              return h("span",formatBillRange(params.row.billOrigin,params.row.billRangeStart,params.row.billRangeEnd));
            }
          },
          {
            title: this.$t('m.i.billInfo.billPackageMoney'),
            key: 'billMoney',
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', formatNumber(params.row.billMoney, 2, ','))
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
            title: this.$t("m.i.billInfo.drwrName"),
            key: "drwrName",
            hiddenCol: false,
            sortable: true
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
            sortable: true,
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
            hiddenCol: false,
            sortable: true
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
            title: this.$t("m.i.billInfo.creditMainBrchCode"),
            key: "creditMainBrchCode",
            hiddenCol: false

          },
          {
            title: this.$t("m.i.billInfo.creditMainBankName"),
            key: "creditMainBankName",
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
            title: this.$t('m.i.be.assetIndustry'),
            key: 'assetIndustry',
            hiddenCol:window.sessionStorage.getItem("isOpenI9")=="1"?false:true,
            render: (h, params) => {
              let dictValue =this.getDictValueFromMap(this.dictMap, 'AssetIndustry', params.row.assetIndustry);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.innerTenorDays'),
            key: "innerRemainDays",
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.be.outTenorDays'),
            key: "outRemainDays",
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.be.innerFirstInterest'),
            key: "innerFirstPayInterest",
            hiddenCol: false,
            align: "right",
            render: (h, params) => {
              return h('span', formatNumber(params.row.innerFirstPayInterest, 2, ','))
            }
          },
          {
            title: this.$t('m.i.be.innerFirstSettleAmt'),
            key: "innerFirstSettleAmtv",
            sortable: true,
            hiddenCol: false,
            align: "right",
            render: (h, params) => {
              return h('span', formatNumber(params.row.innerFirstSettleAmt, 2, ','))
            }
          },
          {
            title: this.$t('m.i.be.outFirstInterest'),
            key: "outFirstInterest",
            hiddenCol: false,
            align: "right",
            render: (h, params) => {
              return h('span', formatNumber(params.row.outFirstInterest, 2, ','))
            }
          },
          {
            title: this.$t('m.i.be.outFirstSettleAmt'),
            key: "outFirstSettleAmt",
            sortable: true,
            hiddenCol: false,
            align: "right",
            render: (h, params) => {
              return h('span', formatNumber(params.row.outFirstSettleAmt, 2, ','))
            }
          },
        ],
        viewDatailForm: {
          batchNo: "",
          quoteNo: "",
          outQuoteNo: "",
          busiType: "",
          quoteTm: "",
          ratePct: "",
          subDeal: "",
          clearSpeed: "",
          firstSettleDt: "",
          dueSettleDt: "",
          settleMode: "",
          clearType: "",
          setTm: "",
          innerSetTm: "",
          outSetTm: "",
          buyBrchName: "",
          buyTraderName: "",
          billType: "",
          billClass: "",
          totalAmt: "",
          firstPayInterest: "",
          firstSettleAmt: "",
          tenorDays: "",
          yieldRatePct: "",
          outYieldRate: "",
          outYieldRatePct: "",
          totalNum: "",
          creditMainBrchCode: "",
          creditMainBankName: "",
          creditMainBankType: "",
          sumInterestMargin: "",
          innerBuyBrchName:"",
          innerBuyBrchCode:"",
          innerBuyTraderName:"",
          innerBuyTraderNo:"",
          innerSettleMode:"",
          innerClearType:"",
          innerClearSpeed:"",
          innerFirstSettleDt:"",
          innerRate:"",
          innerQuoteTm:"",
          innerFirstSettleAmt:"",
          innerFirstInterest:"",

          outBuyBrchNameoutBuyBrchName:"",
          outBuyBrchCode:"",
          outBuyTraderName:"",
          outBuyTraderNo:"",
          outSettleMode:"",
          outClearType:"",
          outClearSpeed:"",
          outFirstSettleDt:"",
          outRate:"",
          outDueRate:"",
          outQuoteTm:"",
          outFirstSettleAmt:"",
          outFirstInterest:"",
          outTenorDays:""
        },
        autoLoad: false,
        formItem: {
          batchId: ""
        },
        showBillInfoWin: false,
        billId: "",
        billNo: ""
      };
    },
    components: {},
    props: {
      batchId: {
        type: [String, Number],
        default() {
          return "";
        }
      },
      saleDetailWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      busiType: {
        type: String,
        default() {
          return "";
        }
      },
      dictMap: {
        type: Map
      }
    },
    methods: {
      billInfoWinClose() {
        this.billId = null;
        this.billNo = null;
        this.showBillInfoWin = false;
      },
      billInfoWinOpen(billId, billNo) {
        this.billId = billId;
        this.billNo = billNo;
        this.showBillInfoWin = true;
      },
      format(groupcode, key) {
        return this.getDictValueFromMap(this.dictMap, groupcode, key);
      },
      formatDate(value) {
        return value ? this.$moment(value, "YYYY-MM-DD").format("YYYY-MM-DD") : "";
      },
      formatMoney(value) {
        return formatNumber(value, 2, ',');
      },
      exportTable() {
        let url = window.LOCAL_CONFIG.API_HOME + "/be/market/quote/innerMoveBill/saleQuoteApply/downloadSaleInfo";
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
      handleClose() {
        this.$emit("closeMsgBox", "");
      },
    },
    watch: {
      saleDetailWin(i) {
        if (i == true) {
          post({ id: this.batchId }, this.batchUrl).then(res => {
            if (res.data.retCode === "000000") {
              if (res.data.retData != null) {
                this.viewDatailForm = res.data.retData;
              }
            }
          }).catch(error => {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
          });
          this.$nextTick(() => {
            this.formItem.batchId = this.batchId;
            this.$refs.bills.dataChange(1);
          });
        }
      }
    },
    computed: {
      tempImageWin: {
        get() {
          return this.saleDetailWin;
        },
        set() {
        }
      }
    }
  };

</script>
