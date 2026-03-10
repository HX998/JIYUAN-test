<!--批次链接详细展示框-->
<template>
  <div>
    <h-msg-box v-model="tempSaleDetail" maximize width="1000" :mask-closable="false" @on-close="handleClose" top="10"
               @on-maximize="onMaximize">
      <p slot="header">
        <span>查看交易详情</span>
      </p>
      <div class="text-body">
        <h-row :gutter="16">
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.common.busiType")}}：</h-col>
              <h-col span="15" class="val">{{formatDictValue("BusiType",this.viewDatailForm.busiType)}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.common.batchNo")}}:</h-col>
              <h-col span="15" class="val">{{viewDatailForm.batchNo}}</h-col>
            </h-row>
          </h-col>
          <div v-if="sendRcvFlag==='1'">
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.otherBrchName")}}:</h-col>
                <h-col span="15" class="val">{{viewDatailForm.buyBrchName}}</h-col>
              </h-row>
            </h-col>
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.custTraderName")}}：</h-col>
                <h-col span="15" class="val">{{viewDatailForm.buyTraderName}}</h-col>
              </h-row>
            </h-col>
          </div>
          <div v-else>
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.brchName")}}:</h-col>
                <h-col span="15" class="val">{{viewDatailForm.saleBrchName}}</h-col>
              </h-row>
            </h-col>
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.traderName")}}：</h-col>
                <h-col span="15" class="val">{{viewDatailForm.saleTraderName}}</h-col>
              </h-row>
            </h-col>
          </div>

        </h-row>
        <br>
        <h-row :gutter="16">
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.tradDir")}}：</h-col>
              <h-col span="15" class="val">{{formatDictValue("TrDir",this.viewDatailForm.trDir)}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.isAnony")}}：</h-col>
              <h-col span="15" class="val">{{formatDictValue("Yon",this.viewDatailForm.isAnony)}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.billInfo.billType")}}：</h-col>
              <h-col span="15" class="val">{{formatDictValue("DraftTypeCode",this.viewDatailForm.billType)}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.billInfo.billClass")}}：</h-col>
              <h-col span="15" class="val">{{formatDictValue("CDMedia",this.viewDatailForm.billClass)}}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <br>
        <h-row :gutter="16">
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.tradeRange")}}：</h-col>
              <h-col span="15" class="val">{{formatDictValue("TradeRange",this.viewDatailForm.tradeRange)}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.pe.dealRate")}}：</h-col>
              <h-col span="15" class="val">{{formatRate(viewDatailForm.ratePct)}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.subDeal")}}：</h-col>
              <h-col span="15" class="val">{{formatDictValue("Yon",viewDatailForm.subDeal)}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.clearType")}}：</h-col>
              <h-col span="15" class="val">{{formatDictValue("ClearType",viewDatailForm.clearType)}}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <br>
        <h-row :gutter="16">
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.settleMode")}}:</h-col>
              <h-col span="15" class="val">{{formatDictValue("SettleType",viewDatailForm.settleMode)}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.clearSpeed")}}:</h-col>
              <h-col span="15" class="val">{{formatDictValue("ClearSpeed",viewDatailForm.clearSpeed)}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.settleDt")}}:</h-col>
              <h-col span="15" class="val">{{formatDate(viewDatailForm.settleDt)}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.setTm")}}：</h-col>
              <h-col span="15" class="val">{{viewDatailForm.setTm}}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <br>
        <h-row :gutter="16">
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label" style="padding-right: 2px;">{{$t("m.i.be.quoteTm")}}:</h-col>
              <h-col span="15" class="val">{{viewDatailForm.quoteTm}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.billInfo.creditMainBankType")}}:</h-col>
              <h-col span="15" class="val">{{formatDictValue("CreditMajor",viewDatailForm.creditMainBrchClass)}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label"  style="padding-right: 2px;">{{$t("m.i.be.transClearMode")}}:</h-col>
              <h-col span="15" class="val">{{formatDictValue("ClearMode",viewDatailForm.transClearMode)}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.common.totalAmtBillPackage")}}：</h-col>
              <h-col span="15" class="val">{{formatMoney(viewDatailForm.totalAmt)}}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <br>
        <h-row :gutter="16">
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.common.totalNumBillPackage")}}:</h-col>
              <h-col span="15" class="val">{{viewDatailForm.totalNum}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.payInterestByUnit")}}:</h-col>
              <h-col span="15" class="val">{{formatMoney(viewDatailForm.interest)}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.settleAmtByUnit")}}:</h-col>
              <h-col span="15" class="val">{{formatMoney(viewDatailForm.settleAmt)}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label" style="padding-right: 2px;">{{$t("m.i.be.tenorDays")}}：</h-col>
              <h-col span="15" class="val">{{viewDatailForm.tenorDays}}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <br>
        <h-row :gutter="16">
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.yieldRate")}}:</h-col>
              <h-col span="15" class="val">{{formatRate(viewDatailForm.yieldRatePct)}}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <br>
        <h-collapse v-model="currentCollapse" class="h-custom-collapse">
          <h-collapse-panel name="transBrchTypesName" v-if="!!viewDatailForm.transBrchTypesName">
            {{$t("m.i.be.transCustType")}}
            <p slot="content">{{viewDatailForm.transBrchTypesName}}</p>
          </h-collapse-panel>
        </h-collapse>
      </div>
      <h-datagrid :columns="billsColumns" :autoLoad="autoLoad" :url="billsUrl" :bindForm="formItem" ref="bills">
        <div slot="toolbar" class="pull-left">
          <h-button type="primary" @click="exportTable" :disabled="exportBillCommit">{{$t("m.i.common.exportData")}}</h-button>
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
  import { post, formatNumber ,getDictValueFromMap} from "@/api/bizApi/commonUtil";

  export default {
    name: "saleDetail",
    data() {
      return {
        batchUrl: "/be/market/clickdeal/sale/saleApply/func_editClickDealSale",
        billsUrl: "/be/market/clickdeal/sale/saleApply/func_getClickSaleBillList",
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
              let dictValue = (!params.row.billOrigin || params.row.billOrigin === 'CS00') ? '-' : this.getDictValueFromMap(this.detailParams.dictMap, 'BillOrigin', params.row.billOrigin);
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
            key: "trustBrchCode",
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
            key: "creditMainBrchClass",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.detailParams.dictMap, "CreditMajor", params.row.creditMainBrchClass);
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
              let dictValue =getDictValueFromMap(this.detailParams.dictMap, 'AssetIndustry', params.row.assetIndustry);
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
            key: "interest",
            hiddenCol: false,
            sortable: true,
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
            title: this.$t("m.i.be.settleAmtByUnit"),
            key: "settleAmt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let settleAmt = formatNumber(params.row.settleAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: settleAmt
                }
              }, settleAmt);
            }
          },
        ],
        viewDatailForm: {
          batchNo: "",
          id: "",
          busiType: "",
          saleBrchName: "",
          saleTraderName: "",
          trDir: "",
          isAnony: "",
          billType: "",
          billClass: "",
          tradeRange: "",
          ratePct: "",
          subDeal: "",
          clearType: "",
          settleMode: "",
          clearSpeed: "",
          settleDt: "",
          setTm: "",
          quoteTm: "",
          creditMainBrchClass: "",
          transClearMode: "",
          productNo: "",
          totalAmt: "",
          totalNum: "",
          interest: "",
          settleAmt: "",
          tenorDays: "",
          yieldRate: "",
          transBrchTypesName: "",
          sendRcvFlag: ""
        },
        currentCollapse: "",
        autoLoad: false,
        formItem: {
          batchId: "",
          sendRcvFlag: "2"
        },
        showBillInfoWin: false,
        billId: "",
        billNo: "",
        billRangeStart:'',
        billRangeEnd:'',
        exportBillCommit: false,
        showExcelTemplateWin: false,
        rows: null
      };
    },
    components: {},
    props: {
      saleDetailWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      detailParams: {
        type: Object,
        default() {
          return {
            batchId: "",
            dictMap: new Map(),
            brchClassMap: new Map(),
            exportUrl:""
          };
        }
      },
      sendRcvFlag:{
        type: String,
        default() {
          return "2";
        }
      },
      exportParam: "",
    },
    methods: {
      handleClose() {
        this.currentCollapse = "";
        this.$emit("saleDetailWinClose", "");
      },
      onMaximize() {
        setTimeout(() => {
          this.$refs.bills.$refs.gridContent.handleResize();
        }, 100);
      },
      billInfoWinClose(){
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
      formatDictValue(groupCode, key) {
        return this.getDictValueFromMap(this.detailParams.dictMap, groupCode, key);
      },
      formatMoney(value) {
        return formatNumber(value, 2, ',');
      },
      formatRate(value){
        return formatNumber(value, 4, ',');
      },
      formatDate(value) {
        return value ? this.$moment(value, "YYYY-MM-DD").format("YYYY-MM-DD") : "";
      },
      exportTable() {
        if (this.$refs.bills.selectIds.length !== 0) {
          this.rows = this.$refs.bills.selectIds.length;
        } else {
          this.rows = this.$refs.bills.total;
        }
        this.showExcelTemplateWin = true;
      },
      //清单导出
      exportList(field, exportType) {
        //exportType: 0-同步 1-异步
        let url = window.LOCAL_CONFIG.API_HOME + this.detailParams.exportUrl;
        if (exportType === "1") {
          let params = null;
          params = {
            ids: this.$refs.bills.selectIds,
            batchId: this.detailParams.batchId,
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
          input6.value = this.detailParams.batchId;
          form.appendChild(input6);
          let input7 = document.createElement("input");
          input7.type = "text";
          input7.name = "sendRcvFlag";
          input7.value = this.viewDatailForm.sendRcvFlag;
          form.appendChild(input7);

          document.body.appendChild(form);
          form.submit();
          document.body.removeChild(form);
        }
      },
      showExcelTemplateWinClose(){
        this.showExcelTemplateWin = false;
      }
    },
    watch: {
      saleDetailWin(val) {
        if (val) {
          post({ batchId: this.detailParams.batchId }, this.batchUrl).then(res => {
            if (res.data.retCode === "000000") {
              if (res.data.retData != null)
                this.viewDatailForm = res.data.retData;
              this.formItem.sendRcvFlag = this.viewDatailForm.sendRcvFlag;
              this.formItem.batchId = this.detailParams.batchId;
              this.$refs.bills.dataChange(1);
              if(null != res.data.retData.transCustType){
                let transCustNameList = [];
                res.data.retData.transCustType.split(",").forEach(x => transCustNameList.push(this.detailParams.brchClassMap.get(x)));
                this.viewDatailForm.transBrchTypesName = transCustNameList.join(",");
              }
            }
          }).catch(error => {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
          });
        }
      }
    },
    computed: {
      tempSaleDetail: {
        get() {
          return this.saleDetailWin;
        },
        set() {
        }
      }
    }
  };

</script>
