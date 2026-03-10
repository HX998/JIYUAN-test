<!--匿名点击正回购-申请管理审批-->
<template>
  <div>
    <!-- 批次信息 -->
    <div v-if="isShow">
      <div class="text-wrap mb-10">
        <div class="text-header"><span class="tit">详细信息</span></div>
        <div class="text-body">
          <h-row :gutter="8">
            <!--业务类型-->
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.common.busiType")}}:</h-col>
                <h-col span="15" class="val">{{formatDict("BusiType",viewDetailForm.busiType)}}</h-col>
              </h-row>
            </h-col>
            <!--批次号-->
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.batchNo")}}:</h-col>
                <h-col span="15" class="val">{{viewDetailForm.batchNo}}</h-col>
              </h-row>
            </h-col>
            <!--本方机构名称-->
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.ownBrchName")}}:</h-col>
                <h-col span="15" class="val">{{viewDetailForm.saleBrchName}}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <h-row :gutter="8">
            <!--本方交易员名称-->
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.traderName")}}:</h-col>
                <h-col span="15" class="val">{{viewDetailForm.saleTraderName}}</h-col>
              </h-row>
            </h-col>
            <!--票据种类-->
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.billInfo.billType")}}:</h-col>
                <h-col span="15" class="val">{{formatDict("DraftTypeCode",viewDetailForm.billType)}}</h-col>
              </h-row>
            </h-col>
            <!--票据介质-->
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.billInfo.billClass")}}:</h-col>
                <h-col span="15" class="val">{{formatDict("CDMedia",viewDetailForm.billClass)}}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <h-row :gutter="8">
            <!--回购利率-->
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.repurchaseRate")}}:</h-col>
                <h-col span="15" class="val">{{formatRate(viewDetailForm.ratePct)}}</h-col>
              </h-row>
            </h-col>
            <!--回购金额-->
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.pe.buyBackTotalAmt")}}:</h-col>
                <h-col span="15" class="val">{{formatMoney(viewDetailForm.buyBackTotalAmt)}}</h-col>
              </h-row>
            </h-col>
            <!--回购期限-->
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.repoTerm")}}:</h-col>
                <h-col span="15" class="val">{{viewDetailForm.tenorDays}}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <h-row :gutter="8">
            <!--期限品种-->
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.tenorVarieties")}}:</h-col>
                <h-col span="15" class="val">{{formatDict("TenorVarieties",viewDetailForm.tenorVarieties)}}</h-col>
              </h-row>
            </h-col>
            <!--清算类型-->
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.clearType")}}:</h-col>
                <h-col span="15" class="val">{{formatDict("ClearType",viewDetailForm.clearType)}}</h-col>
              </h-row>
            </h-col>
            <!--结算方式-->
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.settleMode")}}:</h-col>
                <h-col span="15" class="val">{{formatDict("SettleType",viewDetailForm.settleMode)}}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <h-row :gutter="8">
            <!--清算速度-->
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.clearSpeed")}}:</h-col>
                <h-col span="15" class="val">{{formatDict("ClearSpeed",viewDetailForm.clearSpeed)}}</h-col>
              </h-row>
            </h-col>
            <!--首期结算日-->
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.firstSettleDate")}}:</h-col>
                <h-col span="15" class="val">{{formatDate(viewDetailForm.settleDt)}}</h-col>
              </h-row>
            </h-col>
            <!--到期结算日-->
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.dueSettleDt")}}:</h-col>
                <h-col span="15" class="val">{{formatDate(viewDetailForm.dueSettleDt)}}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <h-row :gutter="8">
            <!--信用主体类型-->
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.billInfo.creditMainBankType")}}:</h-col>
                <h-col span="15" class="val">{{formatDict("CreditMajor",viewDetailForm.creditMainBrchClass)}}</h-col>
              </h-row>
            </h-col>
            <!--票据总额-->
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.common.totalAmtBillPackage")}}:</h-col>
                <h-col span="15" class="val">{{formatMoney(viewDetailForm.totalAmt)}}</h-col>
              </h-row>
            </h-col>
            <!--票据张数-->
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.common.totalNumBillPackage")}}:</h-col>
                <h-col span="15" class="val">{{viewDetailForm.totalNum}}</h-col>
              </h-row>
            </h-col>
          </h-row>
        </div>
      </div>
      <h-datagrid
        :columns="billColumns"
        highlight-row
        :notSetWidth="true"
        :bindForm="billFormItem"
        url="/be/market/anonyclick/sale/saleAudit/func_queryAnonySaleBillList"
        ref="billDatagrid">
        <div slot="toolbar">
        </div>
      </h-datagrid>
    </div>
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="billId"
                    :billNo="billNo" :billRangeStart="billRangeStart" :billRangeEnd="billRangeEnd"></bill-info-main>
  </div>
</template>

<script>
  import {formatNumber, post} from "@/api/bizApi/commonUtil";

  export default {
    name: "saleAudit",
    data() {
      return {
        viewDetailForm: {},
        billFormItem: {
          batchId: "",
          listIds: ""
        },
        billColumns: [
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
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.billInfoWinOpen(params.row.billId, params.row.billNo, params.row.billRangeStart, params.row.billRangeEnd);
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
            title: this.$t("m.i.billInfo.creditMainBankType"),
            key: "creditMainBrchClass",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "CreditMajor", params.row.creditMainBrchClass);
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
        dictMap: new Map(),
        showBillInfoWin: false,
        billId: "",
        billNo: "",
        billRangeStart: '',
        billRangeEnd: '',
      };
    },
    props: {
      isShow: {
        type: Boolean,
        default: false
      },
      listIds: "",
      batchId: ""
    },
    created() {
      this.billFormItem.batchId = this.batchId;
    },
    mounted() {
      this.getDictListByGroups("DraftTypeCode,CDMedia,TenorVarieties,ClearType,SettleType,ClearSpeed,CreditMajor,BusiType,PreRelationFlag,AnonyClickBillStatus,BillOrigin").then(res => {
        this.dictMap = res.get("map");
        this.init();
      });
    },
    methods: {
      billInfoWinClose() {
        this.billId = null;
        this.billNo = null;
        this.billRangeStart = null;
        this.billRangeEnd = null;
        this.showBillInfoWin = false;
      },
      billInfoWinOpen(billId, billNo, billRangeStart, billRangeEnd) {
        this.billId = billId;
        this.billNo = billNo;
        this.billRangeStart = billRangeStart;
        this.billRangeEnd = billRangeEnd;
        this.showBillInfoWin = true;
      },
      formatDict(groupcode, key) {
        if (!!key) {
          return this.getDictValueFromMap(this.dictMap, groupcode, key);
        }
      },
      formatDate(value) {
        if (!!value) {
          return value ? this.$moment(value, "YYYY-MM-DD").format("YYYY-MM-DD") : "";
        }
      },
      formatMoney(value) {
        return formatNumber(value, 2, ',');
      },
      formatRate(value) {
        return formatNumber(value, 4, ',');
      },
      //  初始化页面
      init() {
        let batchId = this.batchId;
        let url = "";
        if (batchId) {
          url = "/be/market/anonyclick/sale/saleAudit/func_findAnonySaleBatchById";
        } else {
          this.$msgTip.error(this, {info: "批次ID不能为空"});
        }
        post({id: batchId}, url).then(res => {
          if (res && res.data) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.viewDetailForm = res.data.retData;
            } else {
              this.$msgTip.error(this, {info: res.data.retMsg});
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, {info: this.$t("m.i.common.netError") + error});
        });
      }
    }
  };
</script>

<style scoped>

</style>
