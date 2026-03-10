<template>
  <div>
    <h-msg-box maximize v-model="tempImageWin" width="1000" @on-close="handleClose">
      <p slot="header">
        <span>查看交易详情</span>
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
              <h-col span="9" class="label">{{$t('m.i.common.batchNo')}}:</h-col>
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
              <h-col span="9" class="label">{{$t('m.i.be.otherBrchName')}}：</h-col>
              <h-col span="15" class="val">{{viewDatailForm.buyBrchName}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.be.custBrchCode')}}：</h-col>
              <h-col span="15" class="val">{{viewDatailForm.buyBrchCode}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.custProductNo")}}：</h-col>
              <h-col span="15" class="val">{{viewDatailForm.buyProductName}}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <br>
        <h-row :gutter="16">
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.custTraderName")}}：</h-col>
              <h-col span="15" class="val">{{viewDatailForm.buyTraderName}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.be.custTraderNo')}}：</h-col>
              <h-col span="15" class="val">{{viewDatailForm.buyTraderNo}}</h-col>
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
              <h-col span="9" class="label">{{$t("m.i.be.tradRate")}}:</h-col>
              <h-col span="15" class="val">{{formatRate(viewDatailForm.ratePct)}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.be.subDeal')}}：</h-col>
              <h-col span="15" class="val">{{format("Yon",viewDatailForm.subDeal)}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.clearType")}}:</h-col>
              <h-col span="15" class="val">{{format("ClearType",viewDatailForm.clearType)}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.settleMode")}}:</h-col>
              <h-col span="15" class="val">{{format("SettleType",viewDatailForm.settleMode)}}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <br>
          <h-row :gutter="16">
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.clearSpeed")}}:</h-col>
                <h-col span="15" class="val">{{format("ClearSpeed",viewDatailForm.clearSpeed)}}</h-col>
              </h-row>
            </h-col>
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.settleDt")}}:</h-col>
                <h-col span="15" class="val">{{formatDate(viewDatailForm.firstSettleDt)}}</h-col>
              </h-row>
            </h-col>
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.setTm")}}:</h-col>
                <h-col span="15" class="val">{{viewDatailForm.setTm}}</h-col>
              </h-row>
            </h-col>
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.be.quoteTm')}}:</h-col>
                <h-col span="15" class="val">{{viewDatailForm.quoteTm}}</h-col>
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
                <h-col span="9" class="label">{{$t("m.i.be.firstPayInterest")}}:</h-col>
                <h-col span="15" class="val">{{formatMoney(viewDatailForm.firstPayInterest)}}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <br>
          <h-row :gutter="16">
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.be.settleAmtByUnit')}}:</h-col>
                <h-col span="15" class="val">{{formatMoney(viewDatailForm.firstSettleAmt)}}</h-col>
              </h-row>
            </h-col>
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.tenorDays")}}:</h-col>
                <h-col span="15" class="val">{{viewDatailForm.tenorDays}}</h-col>
              </h-row>
            </h-col>
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.yieldRate")}}:</h-col>
                <h-col span="15" class="val">{{formatRate(viewDatailForm.yieldRatePct)}}</h-col>
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
                    :billNo="billNo" :billRangeStart="billRangeStart" :billRangeEnd="billRangeEnd"></bill-info-main>

    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="showExcelTemplateWin" :param="exportParam"
                           :rows="this.rows"></common-excel-download>
  </div>
</template>
<script>
  import { post, formatNumber,getDictValueFromMap,accMul } from "@/api/bizApi/commonUtil";

  export default {
    name: "saleDetail",
    data() {
      return {
        batchUrl: "/be/market/quote/quoteManager/func_findSaleBatchById",
        billsUrl: "/be/market/quote/quoteManager/func_querySaleBillList",
        billsColumns: [
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
            title: this.$t('m.i.billInfo.billOrigin'),
            key: 'billOrigin',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = (!params.row.billOrigin || params.row.billOrigin === 'CS00') ? '-' : getDictValueFromMap(this.dictMap, 'BillOrigin', params.row.billOrigin);
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
              let dictValue = !params.row.billRange  ? '-' :params.row.billRange;
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
            title: this.$t("m.i.be.remainingPeriod"),
            key: "remainDays",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.be.payInterestByUnit"),
            key: "firstPayInterest",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h("span", formatNumber(params.row.firstPayInterest, 2, ","));
            }
          },
          {
            title: this.$t("m.i.be.settleAmtByUnit"),
            key: "firstSettleAmt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h("span", formatNumber(params.row.firstSettleAmt, 2, ","));
            }
          },
        ],
        viewDatailForm: {
          batchNo: "",
          quoteNo: "",
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
          buyBrchName: "",
          buyTraderName: "",
          billType: "",
          billClass: "",
          totalAmt: "",
          firstPayInterest: "",
          firstSettleAmt: "",
          tenorDays: "",
          yieldRatePct: "",
          totalNum: "",
          creditMainBrchCode: "",
          creditMainBankName: "",
          creditMainBankType: "",
          sumInterestMargin: ""
        },
        autoLoad: false,
        formItem: {
          subBatchId: ""
        },
        showBillInfoWin: false,
        billId: "",
        billNo: "",
        billRangeStart:'',
        billRangeEnd:'',
        superBatchId: "",
        subBatchId: "",
        showExcelTemplateWin: false,
        exportParam:null,
        rows: null,
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
      },
      rootUrl: {
        type: String,
        default() {
          return "";
        }
      },
    },
    methods: {
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
      formatMoney(value) {
        return formatNumber(value, 2, ',');
      },
      formatRate(value){
        return formatNumber(value, 4, ',');
      },
      exportTable() {
        this.exportParam="clickDealRebuyOrSaleDisplayExport";
        if (this.$refs.bills.selectIds.length !== 0) {
          this.rows = this.$refs.bills.selectIds.length;
        } else {
          this.rows = this.$refs.bills.total;
        }
        this.showExcelTemplateWin = true;
      },
      showExcelTemplateWinClose() {
        this.showExcelTemplateWin = false;
      },
      //清单导出
      exportList(field, exportType) {
        //exportType: 0-同步 1-异步
        let url = window.LOCAL_CONFIG.API_HOME + "/be/market/clickdeal/sale/saleDealDisplay/func_exportClickSaleSubBillDetail";
        if (this.rootUrl) {
          url = window.LOCAL_CONFIG.API_HOME + this.rootUrl + "/func_exportClickSaleSubBillDetail";
        }
        if (exportType === "1") {
          let params = null;
          params = {
            ids: this.$refs.bills.selectIds,
            batchId: this.subBatchId,
            pageSize: this.$refs.bills.selectIds.length,
            field: field,
            exportType: exportType,
            excelName: this.exportParam
          };
          post(params, url).then(res => {
            if(res.status === 200 && res.data === null){
              this.$msgTip.info(this, { info:"异步导出成功，请进入公共管理》导出下载页面，进行下载"});
            }else if(res.status === 200 && res.data === ""){
              this.$msgTip.info(this, { info:"异步导出成功，请进入公共管理》导出下载页面，进行下载"});
            } else{
              this.$msgTip.error(this, { info: "异步导出失败" });
            }
          });
        } else {
          let form = document.createElement("form");
          form.setAttribute("id", "formId");
          form.setAttribute("action", url);
          form.setAttribute("method", "post");

          let input1 = document.createElement("input");
          input1.type = "text";
          input1.name = "ids";
          input1.value = this.$refs.bills.selectIds;
          form.appendChild(input1);
          let input3 = document.createElement("input");
          input3.type = "text";
          input3.name = "field";
          input3.value = field;
          form.appendChild(input3);
          let input4 = document.createElement("input");
          input4.type = "text";
          input4.name = "exportType";
          input4.value = exportType;
          form.appendChild(input4);
          let input5 = document.createElement("input");
          input5.type = "text";
          input5.name = "excelName";
          input5.value = this.exportParam;
          form.appendChild(input5);
          let input6 = document.createElement("input");
          input6.type = "text";
          input6.name = "batchId";
          input6.value = this.subBatchId;
          form.appendChild(input6);

          document.body.appendChild(form);
          form.submit();
          document.body.removeChild(form);
        }
      },
      handleClose() {
        this.$emit("closeMsgBox", "");
      },
    },
    watch: {
      saleDetailWin(i) {
        if (i == true) {
          if (this.rootUrl) {
            this.batchUrl = this.rootUrl + "/func_getRcvSaleBatchSub";
            this.billsUrl = this.rootUrl + "/func_getClickDealSaleBillList";
          } else {
            this.batchUrl = "/be/market/clickdeal/sale/saleDealDisplay/func_getRcvSaleBatchSub";
            this.billsUrl = "/be/market/clickdeal/sale/saleDealDisplay/func_getClickDealSaleBillList";
          }
          this.subBatchId = this.batchId;
          post({ batchId: null, subBatchId: this.subBatchId  }, this.batchUrl).then(res => {
            if (res.data.retCode === "000000") {
              if (res.data.retData != null) {
                this.viewDatailForm = res.data.retData;
              }
            }
          }).catch(error => {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
          });
          this.$nextTick(() => {
            this.formItem.subBatchId = this.batchId;
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
