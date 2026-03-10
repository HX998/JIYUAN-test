<template>
  <div>
    <h-msg-box maximize v-model="tempRebuyDetailWin" width="1000" :mask-closable="false" @on-close="handleClose">
      <p slot="header">
        <span>查看票据明细</span>
      </p>
      <div class="text-body">
        <h-row :gutter="16">
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.common.busiType")}}：</h-col>
              <h-col span="15" class="val">{{format("BusiType",viewDatailForm.busiType)}}</h-col>
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
              <h-col span="9" class="label">{{$t("m.i.be.quoteNo")}}:</h-col>
              <h-col span="15" class="val">{{viewDatailForm.quoteNo}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.dealNo")}}：</h-col>
              <h-col span="15" class="val">{{viewDatailForm.dealNo}}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <br>
        <h-row :gutter="16">
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.pe.dealDtTm")}}：</h-col>
              <h-col span="15" class="val">{{formatDateTime(viewDatailForm.dealDtTm)}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.brchName")}}：</h-col>
              <h-col span="15" class="val">{{viewDatailForm.buyBrchName}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.traderName")}}：</h-col>
              <h-col span="15" class="val">{{viewDatailForm.buyTraderName}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.otherBrchName")}}：</h-col>
              <h-col span="15" class="val">{{viewDatailForm.saleBrchName}}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <br>
        <h-row :gutter="16">
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.custBrchCode")}}：</h-col>
              <h-col span="15" class="val">{{viewDatailForm.saleBrchCode}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.custProductNo")}}：</h-col>
              <h-col span="15" class="val">{{viewDatailForm.saleProductName}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.custTraderName")}}：</h-col>
              <h-col span="15" class="val">{{viewDatailForm.saleTraderName}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.custTraderNo")}}：</h-col>
              <h-col span="15" class="val">{{viewDatailForm.saleTraderNo}}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <br>
        <h-row :gutter="16">
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
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.subDeal")}}：</h-col>
              <h-col span="15" class="val">{{format("Yon",viewDatailForm.subDeal)}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.clearType")}}:</h-col>
              <h-col span="15" class="val">{{format("ClearType",viewDatailForm.clearType)}}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <br>
        <h-row :gutter="16">
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.settleMode")}}:</h-col>
                <h-col span="15" class="val">{{format("SettleType",viewDatailForm.settleMode)}}</h-col>
              </h-row>
            </h-col>
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.clearSpeed")}}:</h-col>
                <h-col span="15" class="val">{{format("ClearSpeed",viewDatailForm.clearSpeed)}}</h-col>
              </h-row>
            </h-col>
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.firstSettleDate")}}:</h-col>
                <h-col span="15" class="val">{{formatDate(viewDatailForm.firstSettleDt)}}</h-col>
              </h-row>
            </h-col>
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.repoTerm")}}:</h-col>
                <h-col span="15" class="val">{{viewDatailForm.tenorDays}}</h-col>
              </h-row>
            </h-col>
          </h-row>
        <br>
        <h-row :gutter="16">
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.dueSettleDt")}}:</h-col>
              <h-col span="15" class="val">{{formatDate(viewDatailForm.dueSettleDt)}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.repurchaseRate")}}:</h-col>
              <h-col span="15" class="val">{{formatRate(viewDatailForm.ratePct)}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.pe.buyBackTotalAmt")}}:</h-col>
              <h-col span="15" class="val">{{formatMoney(viewDatailForm.buyBackTotalAmt)}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.setTm")}}:</h-col>
              <h-col span="15" class="val">{{viewDatailForm.setTm}}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <br>
        <h-row :gutter="16">
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.prodNo")}}:</h-col>
              <h-col span="15" class="val">{{viewDatailForm.prodName}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.common.totalAmtBillPackage")}}:</h-col>
              <h-col span="15" class="val">{{formatMoney(viewDatailForm.totalAmt)}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.common.totalNumBillPackage")}}:</h-col>
              <h-col span="15" class="val">{{viewDatailForm.totalNum}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.firstSettleAmtByUnit")}}:</h-col>
              <h-col span="15" class="val">{{formatMoney(viewDatailForm.firstSettleAmt)}}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <br>
        <h-row :gutter="16">
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.dueSettleAmtByUnit")}}:</h-col>
              <h-col span="15" class="val">{{formatMoney(viewDatailForm.dueSettleAmt)}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.firstPayInterest")}}:</h-col>
              <h-col span="15" class="val">{{formatMoney(viewDatailForm.firstPayInterest)}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.buyBackEarningRate")}}:</h-col>
              <h-col span="15" class="val">{{formatRate(viewDatailForm.yieldRatePct)}}</h-col>
            </h-row>
          </h-col>
        </h-row>
      </div>
      <h-datagrid :columns="billsColumns" :autoLoad="autoLoad" :url="billsUrl" :bindForm="billFormItem"
                  ref="billsDatagrid">
        <div slot="toolbar" class="pull-left">
          <h-button type="primary" @click="exportTable">{{$t("m.i.common.exportExcel")}}</h-button>
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
    name: "rebuyDetail",
    data() {
      return {
        batchUrl: "",
        billsUrl: "",
        billsColumns: [
          {
            type: "index",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center"
          },
          {
            title: this.$t('m.i.common.status'),
            key: 'preRelationFlag',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue =getDictValueFromMap(this.dictMap, 'PreRelationFlag', params.row.preRelationFlag);
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
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if(this.viewDatailForm.clearStatus !== "R20"){
                return h("span",params.row.billNo);
              }
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
              return h('span', formatNumber(params.row.billMoney, 2, ','))
            }
          },
          {
            title: this.$t("m.i.billInfo.remitDt"),
            key: "remitDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("span", params.row.remitDt ? this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          },
          {
            title: this.$t("m.i.billInfo.dueDt"),
            key: "dueDt",
            hiddenCol: false,
            sortable: true,
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
            title: this.$t("m.i.be.firstPayInterest"),
            key: "firstPayInterest",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h("span", formatNumber(params.row.firstPayInterest, 2, ","));
            }
          },
          {
            title: this.$t("m.i.be.firstSettleAmtByUnit"),
            key: "firstSettleAmt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h("span", formatNumber(params.row.firstSettleAmt, 2, ","));
            }
          },
          {
            title: this.$t("m.i.be.dueSettleAmtByUnit"),
            key: "dueSettleAmt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h("span", formatNumber(params.row.dueSettleAmt, 2, ","));
            }
          },
          {
            title: this.$t("m.i.billInfo.drwrName"),
            key: "drwrName",
            sortable: true,
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

          },
        ],
        viewDatailForm: {
          busiType: "",
          batchNo:"",
          quoteNo: "",
          dealNo:"",
          dealDtTm:"",
          buyBrchName:"",
          buyTraderName:"",
          saleBrchName:"",
          saleBrchCode:"",
          saleProductNo:"",
          saleTraderName:"",
          saleTraderNo:"",
          billType: "",
          billClass: "",
          subDeal: "",
          clearType: "",
          settleMode: "",
          clearSpeed: "",
          firstSettleDt: "",
          tenorDays: "",
          dueSettleDt: "",
          ratePct: "",
          buyBackTotalAmt:"",
          setTm: "",
          prodName:"",
          totalAmt: "",
          totalNum: "",
          firstSettleAmt: "",
          dueSettleAmt:"",
          firstPayInterest: "",
          yieldRatePct: "",
        },
        autoLoad: false,
        billFormItem: {
          batchId: ""
        },
        showBillInfoWin: false,
        billId: "",
        billNo: "",
        billRangeStart:'',
        billRangeEnd:'',
      };
    },
    components: {},
    props: {
      batchId: {
        type: [Number, String],
        default() {
          return "";
        }
      },
      rebuyDetailWin: {
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
      },
      batchParams: {
        type: Object,
        default: {}
      }
    },
    computed: {
      tempRebuyDetailWin: {
        get() {
          return this.rebuyDetailWin;
        },
        set() {
        }
      }
    },
    watch: {
      rebuyDetailWin(i) {
        this.batchUrl=this.batchParams.subBatchUrl;
        this.billsUrl=this.batchParams.subBillsUrl;
        if (i == true) {
          post({ id: this.batchId }, this.batchUrl).then(res => {
            if (res.data.retCode === "000000") {
              if (res.data.retData != null) {
                this.$nextTick(() => {
                  this.viewDatailForm = res.data.retData;
                  this.billsColumns.forEach(element => {
                    if (element.key === "creditOccupyType") {
                      element.hiddenCol = (this.viewDatailForm.isSelectCreditOccupy == "1" ? false : true);
                    } else if (element.key === "assetIndustry") {
                      element.hiddenCol = (this.viewDatailForm.isNeedAssetIndustry == "1" ? false : true);
                    } else if (element.key === "bookType") {
                      element.hiddenCol = (this.viewDatailForm.isNeedBookType == "1" ? false : true);
                    }
                  });
                });
              }
            }
          }).catch(error => {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
          });
          this.$nextTick(() => {
            this.billFormItem.batchId = this.batchId;
            this.$refs.billsDatagrid.dataChange(1);
          });
        }
      }
    },
    methods: {
      handleClose() {
        this.$emit("closeMsgBox", "");
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
      format(groupcode, key) {
        return this.getDictValueFromMap(this.dictMap, groupcode, key);
      },
      formatDate(value) {
        return value ? this.$moment(value, "YYYY-MM-DD").format("YYYY-MM-DD") : "";
      },
      formatDateTime(value) {
        return value ? this.$moment(value, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss") : "";
      },
      formatMoney(value) {
        return formatNumber(value, 2, ',');
      },
      formatRate(value){
        return formatNumber(value, 4, ',');
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

    },


  };

</script>
