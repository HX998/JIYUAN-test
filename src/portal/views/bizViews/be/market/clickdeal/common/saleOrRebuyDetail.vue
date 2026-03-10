<!--买入/卖出 批次链接详细展示框-->
<template>
  <div>
    <h-msg-box v-model="tempSaleOrRebuyDetailWin" maximize width="1000" :mask-closable="false" @on-close="handleClose" top="10"
               @on-maximize="onMaximize" :footerHide="true">
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
          <div v-if="viewDatailForm.trDir === 'TDD01'">
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
                <h-col span="9" class="label">{{$t("m.i.be.otherBrchName")}}:</h-col>
                <h-col span="15" class="val">{{viewDatailForm.saleBrchName}}</h-col>
              </h-row>
            </h-col>
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.custTraderName")}}：</h-col>
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
        <slot name="customDetail">
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
                <h-col span="9" class="label" style="padding-right: 2px;">{{$t("m.i.be.isNeedConfirm")}}:</h-col>
                <h-col span="15" class="val">{{formatDictValue("Yon",viewDatailForm.isNeedConfirm)}}</h-col>
              </h-row>
            </h-col>
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.minResidualTermDay")}}:</h-col>
                <h-col span="15" class="val">{{viewDatailForm.minResidualTerm}}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <br>
          <h-row :gutter="16">
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.maxResidualTermDay")}}:</h-col>
                <h-col span="15" class="val">{{viewDatailForm.maxResidualTerm}}</h-col>
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
                <h-col span="9" class="label">{{$t("m.i.be.minDueDt")}}:</h-col>
                <h-col span="15" class="val">{{formatDate(viewDatailForm.minDueDt)}}</h-col>
              </h-row>
            </h-col>
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.maxDueDt")}}:</h-col>
                <h-col span="15" class="val">{{formatDate(viewDatailForm.maxDueDt)}}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <br>
          <h-row :gutter="16">
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.undealTotalAmt")}}：</h-col>
                <h-col span="15" class="val">{{formatMoney(viewDatailForm.undealTotalAmt)}}</h-col>
              </h-row>
            </h-col>
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.minBillAmt")}}:</h-col>
                <h-col span="15" class="val">{{formatMoney(viewDatailForm.minBillAmt)}}</h-col>
              </h-row>
            </h-col>
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label" style="padding-right: 2px;">{{$t("m.i.common.totalAmtBillPackage")}}：</h-col>
                <h-col span="15" class="val">{{formatMoney(viewDatailForm.totalAmt)}}</h-col>
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
          </h-row>
        </slot>
        <br>
        <slot name="collapse">
          <h-collapse v-model="currentCollapse" class="h-custom-collapse">
            <h-collapse-panel name="creditBrchNames" v-if="!!viewDatailForm.creditBrchNames">
              {{$t("m.i.be.creditBrchName")}}
              <p slot="content">{{viewDatailForm.creditBrchNames}}</p>
            </h-collapse-panel>
            <h-collapse-panel name="transBrchTypesName" v-if="!!viewDatailForm.transBrchTypesName">
              {{$t("m.i.be.transCustType")}}
              <p slot="content">{{viewDatailForm.transBrchTypesName}}</p>
            </h-collapse-panel>
            <h-collapse-panel name="acptBrchTypesName" v-if="!!viewDatailForm.acptBrchTypesName">
              {{$t("m.i.billInfo.acptBankType")}}
              <p slot="content">{{viewDatailForm.acptBrchTypesName}}</p>
            </h-collapse-panel>
            <h-collapse-panel name="acptBrchNames" v-if="!!viewDatailForm.acptBrchNames">
              {{$t("m.i.billInfo.acptBankName")}}
              <p slot="content">{{viewDatailForm.acptBrchNames}}</p>
            </h-collapse-panel>
            <h-collapse-panel name="discBrchTypesName" v-if="!!viewDatailForm.discBrchTypesName">
              {{$t("m.i.billInfo.discBankType")}}
              <p slot="content">{{viewDatailForm.discBrchTypesName}}</p>
            </h-collapse-panel>
            <h-collapse-panel name="discBrchNames" v-if="!!viewDatailForm.discBrchNames">
              {{$t("m.i.billInfo.discBankName")}}
              <p slot="content">{{viewDatailForm.discBrchNames}}</p>
            </h-collapse-panel>
            <h-collapse-panel name="trustBrchTypesName" v-if="!!viewDatailForm.trustBrchTypesName">
              {{$t("m.i.billInfo.trustBankType")}}
              <p slot="content">{{viewDatailForm.trustBrchTypesName}}</p>
            </h-collapse-panel>
            <h-collapse-panel name="trustBrchNames" v-if="!!viewDatailForm.trustBrchNames">
              {{$t("m.i.billInfo.trustBankName")}}
              <p slot="content">{{viewDatailForm.trustBrchNames}}</p>
            </h-collapse-panel>
          </h-collapse>
        </slot>
      </div>
      <slot name="billDatagrid">
        <h-datagrid :columns="billsColumns" :autoLoad="autoLoad" :url="billsUrl" :bindForm="formItem" ref="bills" v-if="isShowBill">
          <div slot="toolbar" class="pull-left">
            <h-button type="primary" @click="exportTable">{{$t("m.i.common.exportData")}}
            </h-button>
          </div>
        </h-datagrid>
      </slot>
    </h-msg-box>
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="billId"
                    :billNo="billNo" :billRangeStart="billRangeStart" :billRangeEnd="billRangeEnd"></bill-info-main>
    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="showExcelTemplateWin" :param="exportParam"
                           :rows="this.rows"></common-excel-download>
  </div>
</template>
<script>
  import { post, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "saleOrRebuyDetail",
    data() {
      return {
        batchUrl: "/be/market/clickdeal/rebuy/rebuyApply/func_editClickDealRebuy",
        billsUrl: "/be/market/clickdeal/rebuy/rebuyApply/func_getClickRebuyBillList",
        exportUrl: "/be/market/clickdeal/rebuy/rebuyApply/func_downloadRebuyInfo",
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
              let dictValue = (!params.row.billOrigin || params.row.billOrigin === 'CS00') ? '-' : getDictValueFromMap(this.detailParams.dictMap, 'BillOrigin', params.row.billOrigin);
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
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params.row.billId, params.row.billNo,params.row.billRangeStart,params.row.billRangeEnd);
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
            hiddenCol: false,
            render: (h, params) => {
              return h("span", params.row.remitDt ? this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          },
          {
            title: this.$t("m.i.billInfo.dueDt"),
            key: "dueDt",
            hiddenCol: false,
            render: (h, params) => {
              return h("span", params.row.dueDt ? this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
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
            let dictValue =this.getDictValueFromMap(this.detailParams.dictMap, 'AssetIndustry', params.row.assetIndustry);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
          },
        ],
        viewDatailForm: {
          batchNo: "",
          id: "",
          busiType: "",
          buyBrchName: "",
          buyTraderName: "",
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

          isNeedConfirm: "",
          minResidualTerm: "",
          maxResidualTerm: "",
          minDueDt: "",
          maxDueDt: "",
          undealTotalAmt: "",
          minBillAmt: "",
          transCustType: "",
          acptBrchClasses: "",
          discBrchClasses: "",
          trustBrchClasses: "",

          transBrchTypesName: "",
          acptBrchTypesName: "",
          discBrchTypesName: "",
          trustBrchTypesName: "",

          creditBrchNames: "",
          acptBrchNames: "",
          discBrchNames: "",
          trustBrchNames: ""
        },
        currentCollapse: "",
        autoLoad: false,
        formItem: {
          batchId: ""
        },
        showBillInfoWin: false,
        billId: "",
        billNo: "",
        billRangeStart:'',
        billRangeEnd:'',
        showExcelTemplateWin: false,
        rows: null,
        billDataRef: "",
        batchId:"",
      };
    },
    components: {},
    props: {
      saleOrRebuyDetailWin: {
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
            batchUrl: "",
            billsUrl: "",
            exportUrl: ""
          };
        }
      },
      isShowBill: {
        type: Boolean,
        default() {
          return true;
        }
      },
      exportParam: {
        type:String,
        default(){
          return "clickDealRebuyExport";
        }
      },
    },
    methods: {
      handleClose() {
        this.viewDatailForm = {};
        this.currentCollapse = "";
        this.$emit("saleOrRebuyDetailWinClose", "");
      },
      onMaximize() {
        setTimeout(() => {
          this.billDataRef.$refs.gridContent.handleResize();
        }, 100);
      },
      billInfoWinClose() {
        this.billId = null;
        this.billNo = null;
        this.billRangeStart = null;
        this.billRangeEnd = null;
        this.showBillInfoWin = false;
      },
      showBillInfo(billId, billNo,billRangeStart,billRangeEnd) {
        this.billId = billId;
        this.billNo = billNo;
        this.billRangeStart=billRangeStart;
        this.billRangeEnd=billRangeEnd;
        this.showBillInfoWin = true;
      },
      formatDictValue(groupCode, key) {
        if (!!key) {
          return this.getDictValueFromMap(this.detailParams.dictMap, groupCode, key);
        }
      },
      formatMoney(value) {
        return formatNumber(value, 2, ',');
      },
      formatRate(value){
        return formatNumber(value, 4, ',');
      },
      formatDate(value) {
        if (!!value) {
          return value ? this.$moment(value, "YYYY-MM-DD").format("YYYY-MM-DD") : "";
        }
      },
      exportTable() {
        if (this.billDataRef.selectIds.length !== 0) {
          this.rows = this.billDataRef.selectIds.length;
        } else {
          this.rows = this.billDataRef.total;
        }
        this.showExcelTemplateWin = true;
      },
      //清单导出
      exportList(field, exportType) {
        //exportType: 0-同步 1-异步
        let url;
        url = window.LOCAL_CONFIG.API_HOME + this.exportUrl;
        if (exportType === "1") {
          let params = null;
          params = {
            ids: this.billDataRef.selectIds,
            batchId: this.batchId,
            pageSize: this.billDataRef.selectIds.length,
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
          input1.value = this.billDataRef.selectIds;
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
          input6.value = this.batchId;
          form.appendChild(input6);

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
      saleOrRebuyDetailWin(val) {
        if (val) {
          if (!!this.detailParams.batchUrl) {
            this.batchUrl = this.detailParams.batchUrl;
          }
          if (!!this.detailParams.billsUrl) {
            this.billsUrl = this.detailParams.billsUrl;
          }
          if (!!this.detailParams.exportUrl) {
            this.exportUrl = this.detailParams.exportUrl;
          }
          post({ batchId: this.detailParams.batchId }, this.batchUrl).then(res => {
            if (res.data.retCode === "000000") {
              if (res.data.retData != null)
                this.viewDatailForm = res.data.retData;
              if (null != res.data.retData.transCustType) {
                let brchClassNameList = [];
                res.data.retData.transCustType.split(",").forEach(x => brchClassNameList.push(this.detailParams.brchClassMap.get(x)));
                this.viewDatailForm.transBrchTypesName = brchClassNameList.join("┃");
              }
              if (null != res.data.retData.acptBrchClasses) {
                let brchClassNameList = [];
                res.data.retData.acptBrchClasses.split(",").forEach(x => brchClassNameList.push(this.detailParams.brchClassMap.get(x)));
                this.viewDatailForm.acptBrchTypesName = brchClassNameList.join("┃");
              }
              if (null != res.data.retData.discBrchClasses) {
                let brchClassNameList = [];
                res.data.retData.discBrchClasses.split(",").forEach(x => brchClassNameList.push(this.detailParams.brchClassMap.get(x)));
                this.viewDatailForm.discBrchTypesName = brchClassNameList.join("┃");
              }
              if (null != res.data.retData.trustBrchClasses) {
                let brchClassNameList = [];
                res.data.retData.trustBrchClasses.split(",").forEach(x => brchClassNameList.push(this.detailParams.brchClassMap.get(x)));
                this.viewDatailForm.trustBrchTypesName = brchClassNameList.join("┃");
              }
              if (res.data.retData.creditMainBrchNames) {
                this.viewDatailForm.creditBrchNames = res.data.retData.creditMainBrchNames.replace(/,/g, "┃");
              }
              if (res.data.retData.acptBrchNames) {
                this.viewDatailForm.acptBrchNames = res.data.retData.acptBrchNames.replace(/,/g, "┃");
              }
              if (res.data.retData.discBrchNames) {
                this.viewDatailForm.discBrchNames = res.data.retData.discBrchNames.replace(/,/g, "┃");
              }
              if (res.data.retData.trustBrchNames) {
                this.viewDatailForm.trustBrchNames = res.data.retData.trustBrchNames.replace(/,/g, "┃");
              }
              this.$emit("queryViewDatailForm",this.viewDatailForm);
            }
          }).catch(error => {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
          });
          this.$nextTick(() => {
            if (this.isShowBill && this.$slots.billDatagrid === undefined) {
              this.formItem.batchId = this.detailParams.batchId;
              this.batchId=this.detailParams.batchId;
              this.$refs.bills.dataChange(1);
              this.billDataRef=this.$refs.bills
            }
            if (this.isShowBill && !!this.$slots.billDatagrid) {
              // this.$slots.billDatagrid[0].componentOptions.propsData.bindForm.batchId = this.detailParams.batchId;
              this.$parent.$data.formItem.batchId = this.detailParams.batchId;
              this.batchId=this.detailParams.batchId
              this.$parent.$refs[this.$slots.billDatagrid[0].data.ref].dataChange(1);
              this.billDataRef=this.$parent.$refs[this.$slots.billDatagrid[0].data.ref];
            }
          });
        }
      }
    },
    computed: {
      tempSaleOrRebuyDetailWin: {
        get() {
          return this.saleOrRebuyDetailWin;
        },
        set() {
        }
      }
    }
  };
</script>
