<!--点击成交-买入点击成交展示-批次链接详细展示框-->
<template>
  <!--批次链接详细展示框-->
  <sale-or-rebuy-detail :saleOrRebuyDetailWin="saleOrRebuyDetailWin" :detailParams="detailParams"
                        :isShowBill="isShowBill" @saleOrRebuyDetailWinClose="rebuyDetailWinClose"
                        ref="saleOrRebuyDetail" @queryViewDatailForm="queryViewDatailForm">
    <div slot="customDetail">
      <h-row :gutter="16">
        <h-col span="6">
          <h-row>
            <h-col span="9" class="label">{{$t("m.i.be.settleMode")}}:</h-col>
            <h-col span="15" class="val">
              {{formatDictValue("SettleType",viewDatailForm.settleMode)}}
            </h-col>
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
            <h-col span="9" class="label" style="padding-right: 2px;">{{$t("m.i.be.transClearMode")}}:</h-col>
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
            <h-col span="9" class="label">{{$t("m.i.be.undealTotalAmt")}}：</h-col>
            <h-col span="15" class="val">{{formatMoney(viewDatailForm.undealTotalAmt)}}</h-col>
          </h-row>
        </h-col>
        <h-col span="6">
          <h-row>
            <h-col span="9" class="label">{{$t("m.i.be.undealTotalNum")}}:</h-col>
            <h-col span="15" class="val">{{viewDatailForm.undealTotalNum}}</h-col>
          </h-row>
        </h-col>
        <h-col span="6">
          <h-row>
            <h-col span="9" class="label">{{$t("m.i.be.payInterestByUnit")}}:</h-col>
            <h-col span="15" class="val">{{formatMoney(viewDatailForm.interest)}}</h-col>
          </h-row>
        </h-col>
      </h-row>
      <br>
      <h-row :gutter="16">
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
        <h-col span="6">
          <h-row>
            <h-col span="9" class="label">{{$t("m.i.be.yieldRate")}}:</h-col>
            <h-col span="15" class="val">{{viewDatailForm.yieldRatePct}}</h-col>
          </h-row>
        </h-col>
      </h-row>
    </div>
    <h-collapse v-model="currentCollapse" class="h-custom-collapse" slot="collapse">
      <h-collapse-panel name="transBrchTypesName" v-if="!!viewDatailForm.transBrchTypesName">
        {{$t("m.i.be.transCustType")}}
        <p slot="content">{{viewDatailForm.transBrchTypesName}}</p>
      </h-collapse-panel>
    </h-collapse>
    <h-datagrid :columns="billsColumns" :autoLoad="false" :url="detailParams.billsUrl" :bindForm="formItem" ref="rebuyBills"
                v-if="isShowBill" slot="billDatagrid">
      <div slot="toolbar" class="pull-left">
        <h-button type="primary" @click="exportTable" :disabled="exportBillCommit">{{$t("m.i.common.exportData")}}
        </h-button>
      </div>
    </h-datagrid>
  </sale-or-rebuy-detail>
</template>

<script>
  import { formatNumber,getDictValueFromMap } from "@/api/bizApi/commonUtil";

  export default {
    name: "rebuyDealDisplayDetail",
    components: {
      SaleOrRebuyDetail: () => import(/* webpackChunkName: "be/market/clickdeal/common/saleOrRebuyDetail" */`@/views/bizViews/be/market/clickdeal/common/saleOrRebuyDetail`)
    },
    data() {
      return {
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
            key: "acptCfmBrchCode",
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
              let dictValue =this.getDictValueFromMap(this.detailParams.dictMap, 'AssetIndustry', params.row.assetIndustry);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
        ],
        viewDatailForm: {},
        currentCollapse: "",
        formItem: {
          batchId: ""
        },
        exportBillCommit: false
      };
    },
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
      }
    },
    methods: {
      formatMoney(value) {
        return formatNumber(value, 2, ',');
      },
      formatRate(value){
        return formatNumber(value, 4, ',');
      },
      queryViewDatailForm(viewDatailForm) {
        this.viewDatailForm = viewDatailForm;
      },
      rebuyDetailWinClose() {
        this.$emit("rebuyDetailWinClose", "");
      },
      billInfoWinClose() {
        if (!!this.$refs.saleOrRebuyDetail) {
          this.$refs.saleOrRebuyDetail.billInfoWinClose();
        }
      },
      billInfoWinOpen(billId, billNo,billRangeStart,billRangeEnd) {
        if (!!this.$refs.saleOrRebuyDetail) {
          this.$refs.saleOrRebuyDetail.showBillInfo(billId, billNo,billRangeStart,billRangeEnd);
        }
      },
      formatDictValue(groupCode, key) {
        if (!!this.$refs.saleOrRebuyDetail) {
          return this.$refs.saleOrRebuyDetail.formatDictValue(groupCode, key);
        }
      },
      formatDate(value) {
        if (!!this.$refs.saleOrRebuyDetail) {
          return this.$refs.saleOrRebuyDetail.formatDate(value);
        }
      },
      exportTable() {
        if (!!this.$refs.saleOrRebuyDetail) {
          this.$refs.saleOrRebuyDetail.exportTable();
        }
      }
    }
  };
</script>

<style scoped>

</style>
