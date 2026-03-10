<!--点击成交-买入应答审批-->
<template>
  <div>
    <!-- 批次信息 -->
    <div v-if="isShow">
      <div class="text-wrap mb-10">
        <div class="text-header"><span class="tit">详细信息 买入应答审批</span></div>
        <div class="text-body">
          <h-row :gutter="8">
            <!--业务类型-->
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.common.busiType")}}:</h-col>
                <h-col span="15" class="val">{{formatDict("QuoteBusiType",viewDetailForm.busiType)}}</h-col>
              </h-row>
            </h-col>
            <!--批次号-->
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.batchNo")}}:</h-col>
                <h-col span="15" class="val">{{viewDetailForm.batchNo}}</h-col>
              </h-row>
            </h-col>
            <!--报价单编号-->
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.quoteNo")}}:</h-col>
                <h-col span="15" class="val">{{viewDetailForm.quoteNo}}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <h-row :gutter="8">
            <!--本方机构名称-->
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.brchName")}}:</h-col>
                <h-col span="15" class="val">{{viewDetailForm.buyBrchName}}</h-col>
              </h-row>
            </h-col>
            <!--本方交易员名称-->
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.traderName")}}:</h-col>
                <h-col span="15" class="val">{{viewDetailForm.buyTraderName}}</h-col>
              </h-row>
            </h-col>
            <!--对方机构名称-->
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.be.otherBrchName')}}:</h-col>
                <h-col span="15" class="val">{{viewDetailForm.saleBrchName}}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <h-row :gutter="8">
            <!--对方机构代码-->
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.be.custBrchCode')}}:</h-col>
                <h-col span="15" class="val">{{viewDetailForm.saleBrchCode}}</h-col>
              </h-row>
            </h-col>
            <!--对方非法人产品-->
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.custProductNo")}}:</h-col>
                <h-col span="15" class="val">{{viewDetailForm.saleProductName}}</h-col>
              </h-row>
            </h-col>
            <!--对方交易员名称-->
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.custTraderName")}}:</h-col>
                <h-col span="15" class="val">{{viewDetailForm.saleTraderName}}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <h-row :gutter="8">
            <!--对方交易员编号-->
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.be.custTraderNo')}}:</h-col>
                <h-col span="15" class="val">{{viewDetailForm.saleTraderNo}}</h-col>
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
            <!--交易利率-->
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.tradRate")}}:</h-col>
                <h-col span="15" class="val">{{formatRate(viewDetailForm.ratePct)}}</h-col>
              </h-row>
            </h-col>
            <!--部分成交-->
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.subDeal")}}:</h-col>
                <h-col span="15" class="val">{{formatDict("Yon",viewDetailForm.subDeal)}}</h-col>
              </h-row>
            </h-col>
            <!--清算类型-->
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.clearType")}}:</h-col>
                <h-col span="15" class="val">{{formatDict("ClearType",viewDetailForm.clearType)}}</h-col>
              </h-row>
            </h-col>

          </h-row>
          <h-row :gutter="8">
            <!--结算方式-->
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.settleMode")}}:</h-col>
                <h-col span="15" class="val">{{formatDict("SettleType",viewDetailForm.settleMode)}}</h-col>
              </h-row>
            </h-col>
            <!--清算速度-->
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.clearSpeed")}}:</h-col>
                <h-col span="15" class="val">{{formatDict("ClearSpeed",viewDetailForm.clearSpeed)}}</h-col>
              </h-row>
            </h-col>
            <!--结算日-->
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.settleDt")}}:</h-col>
                <h-col span="15" class="val">{{formatDate(viewDetailForm.firstSettleDt)}}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <h-row :gutter="8">
            <!--最晚结算时间-->
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.setTm")}}:</h-col>
                <h-col span="15" class="val">{{viewDetailForm.setTm}}</h-col>
              </h-row>
            </h-col>
            <!--报价有效截止时间-->
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.quoteTm")}}:</h-col>
                <h-col span="15" class="val">{{viewDetailForm.quoteTm}}</h-col>
              </h-row>
            </h-col>
            <!--产品类型-->
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.prodNo")}}:</h-col>
                <h-col span="15" class="val">{{viewDetailForm.prodName}}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <h-row :gutter="8">
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
            <!--应付利息(元)-->
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.payInterestByUnit")}}:</h-col>
                <h-col span="15" class="val">{{formatMoney(viewDetailForm.firstPayInterest)}}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <h-row :gutter="8">
            <!--结算金额-->
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.settleAmtByUnit")}}:</h-col>
                <h-col span="15" class="val">{{formatMoney(viewDetailForm.firstSettleAmt)}}</h-col>
              </h-row>
            </h-col>
            <!--加权平均剩余期限-->
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.tenorDays")}}:</h-col>
                <h-col span="15" class="val">{{viewDetailForm.tenorDays}}</h-col>
              </h-row>
            </h-col>
            <!--收益率-->
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.yieldRate")}}:</h-col>
                <h-col span="15" class="val">{{formatRate(viewDetailForm.yieldRatePct)}}</h-col>
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
        url="/be/market/clickdeal/rebuy/rebuyReplyAudit/func_getClickDealRebuyBillList"
        ref="billDatagrid">
        <div slot="toolbar">
        </div>
      </h-datagrid>
    </div>
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="billId"
                    :billNo="billNo"></bill-info-main>
  </div>
</template>

<script>
  import { formatNumber, post } from "@/api/bizApi/commonUtil";

  export default {
    name: "rebuyReplyAudit",
    data() {
      return {
        viewDetailForm: {},
        billFormItem: {
          subBatchId: "",
          listIds: ""
        },
        billColumns: [
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
            sortable: true,
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
              return h('span', formatNumber(params.row.billMoney, 2, ','))
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
            title: this.$t("m.i.billInfo.dueMatDt"),
            key: "dueMatDt",
            hiddenCol: false,
            render: (h, params) => {
              return h("span", params.row.dueMatDt ? this.$moment(params.row.dueMatDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          },
          {
            title: this.$t("m.i.be.creditOccType"),
            key: "creditOccupyType",
            hiddenCol: true,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "CreditDeductRule", params.row.creditOccupyType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },

          {
            title: this.$t("m.i.be.bookType"),
            key: "bookType",
            hiddenCol: true,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "BookType", params.row.bookType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
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
            title: this.$t("m.i.be.assetIndustry"),
            key: "assetIndustry",
            hiddenCol: window.sessionStorage.getItem("isOpenI9")=="1"?false:true,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "AssetIndustry", params.row.assetIndustry);
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
        dictMap: new Map(),
        showBillInfoWin: false,
        billId: "",
        billNo: ""
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
      this.billFormItem.subBatchId = this.batchId;
      this.billFormItem.listIds = this.listIds;
    },
    mounted() {
      this.getDictListByGroups("DraftTypeCode,CDMedia,ClearType,SettleType,ClearSpeed,CreditMajor,QuoteBusiType,PreRelationFlag,Yon,CreditDeductRule,AssetIndustry,BookType,BillOrigin").then(res => {
        this.dictMap = res.get("map");
        this.init();
      });
    },
    methods: {
      billInfoWinClose() {
        this.billId = "";
        this.billNo = "";
        this.showBillInfoWin = false;
      },
      billInfoWinOpen(info, type) {
        this.billId = "";
        this.billNo = "";
        if (type === "billId") {
          this.billId = info;
        } else {
          this.billNo = info;
        }
        this.showBillInfoWin = true;
      },
      formatDict(groupcode, key) {
        if (!!key) {
          return this.getDictValueFromMap(this.dictMap, groupcode, key);
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
      //  初始化页面
      init() {
        let batchId = this.batchId;
        let url = "";
        if (batchId) {
          url = "/be/market/clickdeal/rebuy/rebuyAudit/func_getClickDealRebuySubBatchDetail";
        } else {
          this.$msgTip.error(this, { info: "批次ID不能为空" });
        }
        post({ batchId: batchId,listIds: this.listIds }, url).then(res => {
          if (res && res.data) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.viewDetailForm = res.data.retData;
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      }
    }
  };
</script>

<style scoped>

</style>
