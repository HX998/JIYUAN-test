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
              <h-col span="15" class="val">{{format("QuoteBusiType",viewDatailForm.busiType)}}</h-col>
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
              <h-col span="9" class="label">{{$t('m.i.be.subDeal')}}：</h-col>
              <h-col span="15" class="val">{{format("Yon",viewDatailForm.subDeal)}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.billInfo.billType")}}：</h-col>
              <h-col span="15" class="val">{{format("DraftTypeCode",viewDatailForm.billType)}}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <br>
        <h-row :gutter="16">
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.billInfo.billClass")}}：</h-col>
              <h-col span="15" class="val">{{format("CDMedia",viewDatailForm.billClass)}}</h-col>
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
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.clearSpeed")}}:</h-col>
              <h-col span="15" class="val">{{format("ClearSpeed",viewDatailForm.clearSpeed)}}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <br>
        <!-- 质押式回购-->
        <div v-if="busiType=='BT02'">
          <h-row :gutter="16">
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
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.dueSettleDt")}}:</h-col>
                <h-col span="15" class="val">{{formatDate(viewDatailForm.dueSettleDt)}}</h-col>
              </h-row>
            </h-col>
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.repurchaseRate")}}:</h-col>
                <h-col span="15" class="val">{{viewDatailForm.ratePct}}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <br>
          <h-row :gutter="16">
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.be.buyBackTotalAmt')}}:</h-col>
                <h-col span="15" class="val">{{formatMoney(viewDatailForm.buyBackTotalAmt)}}</h-col>
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
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.be.billSelectType')}}:</h-col>
                <h-col span="15" class="val">{{format("CdSelectMode",viewDatailForm.selectType)}}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <br>
          <h-row :gutter="16">
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.be.packetSeq')}}:</h-col>
                <h-col span="15" class="val">{{viewDatailForm.packetSeq}}</h-col>
              </h-row>
            </h-col>
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.prodNo")}}:</h-col>
                <h-col span="15" class="val">{{viewDatailForm.prodName}}</h-col>
              </h-row>
            </h-col>
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.common.totalAmtBillPackage")}}</h-col>
                <h-col span="15" class="val">{{formatMoney(viewDatailForm.totalAmt)}}</h-col>
              </h-row>
            </h-col>
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.common.totalNumBillPackage")}}:</h-col>
                <h-col span="15" class="val">{{viewDatailForm.totalNum}}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <br>
          <h-row :gutter="16">
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.be.firstSettleAmtByUnit')}}:</h-col>
                <h-col span="15" class="val">{{formatMoney(viewDatailForm.firstSettleAmt)}}</h-col>
              </h-row>
            </h-col>
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.be.dueSettleAmtByUnit')}}:</h-col>
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
                <h-col span="15" class="val">{{viewDatailForm.yieldRatePct}}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <br>
          <h-row :gutter="16">
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.totalInterestDiff")}}:</h-col>
                <h-col span="15" class="val">{{formatMoney(viewDatailForm.sumInterestMargin)}}</h-col>
              </h-row>
            </h-col>
          </h-row>
        </div>
        <!--买断式回购-->
        <div v-if="busiType=='BT03'">
          <h-row :gutter="16">
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
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.dueSettleDt")}}:</h-col>
                <h-col span="15" class="val">{{formatDate(viewDatailForm.dueSettleDt)}}</h-col>
              </h-row>
            </h-col>
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.firstTransRate")}}:</h-col>
                <h-col span="15" class="val">{{viewDatailForm.ratePct}}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <br>
          <h-row :gutter="16">
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.dueTradRate")}}:</h-col>
                <h-col span="15" class="val">{{viewDatailForm.dueRatePct}}</h-col>
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
                <h-col span="9" class="label">{{$t('m.i.be.firstSettleAmtByUnit')}}:</h-col>
                <h-col span="15" class="val">{{formatMoney(viewDatailForm.firstSettleAmt)}}</h-col>
              </h-row>
            </h-col>
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.be.dueSettleAmtByUnit')}}:</h-col>
                <h-col span="15" class="val">{{formatMoney(viewDatailForm.dueSettleAmt)}}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <br>
          <h-row :gutter="16">
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.be.firstPayInterestByUnit')}}:</h-col>
                <h-col span="15" class="val">{{formatMoney(viewDatailForm.firstPayInterest)}}</h-col>
              </h-row>
            </h-col>
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.be.dueInterestByUnit')}}:</h-col>
                <h-col span="15" class="val">{{formatMoney(viewDatailForm.dueInterest)}}</h-col>
              </h-row>
            </h-col>
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.buyBackEarningRate")}}:</h-col>
                <h-col span="15" class="val">{{viewDatailForm.yieldRatePct}}</h-col>
              </h-row>
            </h-col>
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.totalInterestDiff")}}:</h-col>
                <h-col span="15" class="val">{{formatMoney(viewDatailForm.sumInterestMargin)}}</h-col>
              </h-row>
            </h-col>
          </h-row>
        </div>
        <!--转贴现-->
        <div v-if="busiType=='BT01'">
          <h-row :gutter="16">
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.firstSettleDt")}}:</h-col>
                <h-col span="15" class="val">{{formatDate(viewDatailForm.firstSettleDt)}}</h-col>
              </h-row>
            </h-col>
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.tradRate")}}:</h-col>
                <h-col span="15" class="val">{{viewDatailForm.ratePct}}</h-col>
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
                <h-col span="15" class="val">{{viewDatailForm.totalAmt}}</h-col>
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
                <h-col span="15" class="val">{{viewDatailForm.yieldRatePct}}</h-col>
              </h-row>
            </h-col>
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.totalInterestDiff")}}:</h-col>
                <h-col span="15" class="val">{{formatMoney(viewDatailForm.sumInterestMargin)}}</h-col>
              </h-row>
            </h-col>
          </h-row>
        </div>
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
            title: this.$t("m.i.be.remainDays"),
            key: "remainDays",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.be.dueRemainDays"),
            key: "dueRemainDays",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.be.firstPayInterestByUnit"),
            key: "firstPayInterest",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h("span", formatNumber(params.row.firstPayInterest, 2, ","));
            }
          },
          {
            title: this.$t("m.i.be.dueInterestByUnit"),
            key: "dueInterest",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h("span", formatNumber(params.row.dueInterest, 2, ","));
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
            title: this.$t('m.i.billInfo.rateMargin'),
            key: 'rateMargin',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if(params.row.rateMargin != null && params.row.rateMargin !== ""){
                let rateMargin = accMul(params.row.rateMargin, 100);
                return h("span", formatNumber(rateMargin, 4, ','));
              }
              else {
                return h("span", "-");
              }
            }
          },
          {
            title: this.$t('m.i.be.interestMargin'),
            key: "interestMargin",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', formatNumber(params.row.interestMargin, 2, ','))
            }
          },
          {
            title: this.$t('m.i.billInfo.lastOppName'),
            key: "oppName",
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.billInfo.lastRebuyRate'),
            key: "buyRate",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.buyRate != null && params.row.buyRate !== "") {
                let rate = accMul(params.row.buyRate, 100);
                rate = formatNumber(rate,4, '');
                return h("span", rate);
              }
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
      exportTable() {
        let url = window.LOCAL_CONFIG.API_HOME + "/be/market/quote/quoteManager/func_downloadSaleInfo";
        if (this.rootUrl) {
          url = window.LOCAL_CONFIG.API_HOME + this.rootUrl + "/func_downloadSaleInfo";
        }
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
          if (this.rootUrl) {
            this.batchUrl = this.rootUrl + "/func_findSaleBatchById";
            this.billsUrl = this.rootUrl + "/func_querySaleBillList";
          } else {
            this.batchUrl = "/be/market/quote/quoteManager/func_findSaleBatchById";
            this.billsUrl = "/be/market/quote/quoteManager/func_querySaleBillList";
          }
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
