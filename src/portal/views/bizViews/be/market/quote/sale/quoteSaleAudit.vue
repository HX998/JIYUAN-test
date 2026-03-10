<template>
  <div>
    <!-- 批次信息 -->
    <div v-if="isShow">
      <div class="text-wrap mb-10">
        <div class="text-header"><span class="tit">详细信息</span></div>
        <div class="text-body">
          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.common.busiType')}}：</h-col>
                <h-col span="15" class="val">{{format("QuoteBusiType",formItem.busiType)}}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.be.quoteNo')}}:</h-col>
                <h-col span="15" class="val">{{formItem.quoteNo}}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.be.brchName')}}：</h-col>
                <h-col span="15" class="val">{{formItem.saleBrchName}}</h-col>
              </h-row>
            </h-col>
          </h-row>

          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.be.traderName')}}：</h-col>
                <h-col span="15" class="val">{{formItem.saleTraderName}}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.be.otherBrchName')}}：</h-col>
                <h-col span="15" class="val">{{formItem.buyBrchName}}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.be.custBrchCode')}}：</h-col>
                <h-col span="15" class="val">{{formItem.buyBrchCode}}</h-col>
              </h-row>
            </h-col>
          </h-row>

          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.be.custProductNo')}}：</h-col>
                <h-col span="15" class="val">{{formItem.buyProductName}}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.be.custTraderName')}}：</h-col>
                <h-col span="15" class="val">{{formItem.buyTraderName}}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.be.custTraderNo')}}：</h-col>
                <h-col span="15" class="val">{{formItem.buyTraderNo}}</h-col>
              </h-row>
            </h-col>
          </h-row>

          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.be.subDeal')}}：</h-col>
                <h-col span="15" class="val">{{format("Yon",formItem.subDeal)}}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.billInfo.billType')}}：</h-col>
                <h-col span="15" class="val">{{format("DraftTypeCode",formItem.billType)}}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.billInfo.billClass')}}：</h-col>
                <h-col span="15" class="val">{{format('CDMedia',formItem.billClass)}}</h-col>
              </h-row>
            </h-col>
          </h-row>

          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.be.clearType')}}：</h-col>
                <h-col span="15" class="val">{{format("ClearType",formItem.clearType)}}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.be.settleMode')}}：</h-col>
                <h-col span="15" class="val">{{format("SettleType",formItem.settleMode)}}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.be.clearSpeed')}}：</h-col>
                <h-col span="15" class="val">{{format('ClearSpeed',formItem.clearSpeed)}}</h-col>
              </h-row>
            </h-col>
          </h-row>

          <div v-if="formItem.busiType=='BT01'">
            <h-row :gutter="8">
              <h-col span="8">
                <h-row>
                  <h-col span="9" class="label">{{$t('m.i.be.firstSettleDt')}}：</h-col>
                  <h-col span="15" class="val">{{formatDate(formItem.firstSettleDt)}}</h-col>
                </h-row>
              </h-col>
              <h-col span="8">
                <h-row>
                  <h-col span="9" class="label">{{$t('m.i.be.tradRate')}}：</h-col>
                  <h-col span="15" class="val">{{formatRate(formItem.ratePct)}}</h-col>
                </h-row>
              </h-col>
              <h-col span="8">
                <h-row>
                  <h-col span="9" class="label">{{$t('m.i.be.setTm')}}：</h-col>
                  <h-col span="15" class="val">{{formItem.setTm}}</h-col>
                </h-row>
              </h-col>
            </h-row>

            <h-row :gutter="8">
              <h-col span="8">
                <h-row>
                  <h-col span="9" class="label">{{$t('m.i.be.quoteTm')}}:</h-col>
                  <h-col span="15" class="val">{{formItem.quoteTm}}</h-col>
                </h-row>
              </h-col>
              <h-col span="8">
                <h-row>
                  <h-col span="9" class="label">{{$t('m.i.be.prodNo')}}：</h-col>
                  <h-col span="15" class="val">{{formItem.prodName}}</h-col>
                </h-row>
              </h-col>
              <h-col span="8">
                <h-row>
                  <h-col span="9" class="label">{{$t('m.i.common.totalAmtBillPackage')}}：</h-col>
                  <h-col span="15" class="val">{{formatMoney(formItem.totalAmt)}}</h-col>
                </h-row>
              </h-col>
            </h-row>

            <h-row :gutter="8">
              <h-col span="8">
                <h-row>
                  <h-col span="9" class="label">{{$t('m.i.common.totalNumBillPackage')}}：</h-col>
                  <h-col span="15" class="val">{{formItem.totalNum}}</h-col>
                </h-row>
              </h-col>
              <h-col span="8">
                <h-row>
                  <h-col span="9" class="label">{{$t('m.i.be.firstPayInterest')}}：</h-col>
                  <h-col span="15" class="val">{{formatMoney(formItem.firstPayInterest)}}</h-col>
                </h-row>
              </h-col>
              <h-col span="8">
                <h-row>
                  <h-col span="9" class="label">{{$t('m.i.be.settleAmtByUnit')}}：</h-col>
                  <h-col span="15" class="val">{{formatMoney(formItem.firstSettleAmt)}}</h-col>
                </h-row>
              </h-col>
            </h-row>

            <h-row :gutter="8">
              <h-col span="8">
                <h-row>
                  <h-col span="9" class="label">{{$t('m.i.be.tenorDays')}}：</h-col>
                  <h-col span="15" class="val">{{formItem.tenorDays}}</h-col>
                </h-row>
              </h-col>
              <h-col span="8">
                <h-row>
                  <h-col span="9" class="label">{{$t('m.i.be.yieldRate')}}：</h-col>
                  <h-col span="15" class="val">{{formatRate(formItem.yieldRatePct)}}</h-col>
                </h-row>
              </h-col>
              <h-col span="8">
                <h-row>
                  <h-col span="9" class="label">{{$t("m.i.be.totalInterestDiff")}}:</h-col>
                  <h-col span="15" class="val">{{formatMoney(formItem.sumInterestMargin)}}</h-col>
                </h-row>
              </h-col>
            </h-row>
          </div>
          <div v-if="formItem.busiType=='BT02'">
            <h-row :gutter="8">
              <h-col span="8">
                <h-row>
                  <h-col span="9" class="label">{{$t('m.i.be.firstSettleDate')}}：</h-col>
                  <h-col span="15" class="val">{{formatDate(formItem.firstSettleDt)}}</h-col>
                </h-row>
              </h-col>
              <h-col span="8">
                <h-row>
                  <h-col span="9" class="label">{{$t('m.i.be.repoTerm')}}：</h-col>
                  <h-col span="15" class="val">{{formItem.tenorDays}}</h-col>
                </h-row>
              </h-col>
              <h-col span="8">
                <h-row>
                  <h-col span="9" class="label">{{$t('m.i.be.dueSettleDt')}}：</h-col>
                  <h-col span="15" class="val">{{formatDate(formItem.dueSettleDt)}}</h-col>
                </h-row>
              </h-col>
            </h-row>

            <h-row :gutter="8">
              <h-col span="8">
                <h-row>
                  <h-col span="9" class="label">{{$t('m.i.be.repurchaseRate')}}：</h-col>
                  <h-col span="15" class="val">{{formatRate(formItem.ratePct)}}</h-col>
                </h-row>
              </h-col>
              <h-col span="8">
                <h-row>
                  <h-col span="9" class="label">{{$t('m.i.be.buyBackTotalAmt')}}：</h-col>
                  <h-col span="15" class="val">{{formatMoney(formItem.buyBackTotalAmt)}}</h-col>
                </h-row>
              </h-col>
              <h-col span="8">
                <h-row>
                  <h-col span="9" class="label">{{$t('m.i.be.setTm')}}：</h-col>
                  <h-col span="15" class="val">{{formItem.setTm}}</h-col>
                </h-row>
              </h-col>
            </h-row>

            <h-row :gutter="8">
              <h-col span="8">
                <h-row>
                  <h-col span="9" class="label">{{$t('m.i.be.quoteTm')}}：</h-col>
                  <h-col span="15" class="val">{{formItem.quoteTm}}</h-col>
                </h-row>
              </h-col>
              <h-col span="8">
                <h-row>
                  <h-col span="9" class="label">{{$t('m.i.be.billSelectType')}}：</h-col>
                  <h-col span="15" class="val">{{format('CdSelectMode',formItem.selectType)}}</h-col>
                </h-row>
              </h-col>
              <h-col span="8">
                <h-row>
                  <h-col span="9" class="label">{{$t('m.i.be.packetSeq')}}：</h-col>
                  <h-col span="15" class="val">{{formItem.packetSeq}}</h-col>
                </h-row>
              </h-col>
            </h-row>

            <h-row :gutter="8">
              <h-col span="8">
                <h-row>
                  <h-col span="9" class="label">{{$t('m.i.be.prodNo')}}：</h-col>
                  <h-col span="15" class="val">{{formItem.prodName}}</h-col>
                </h-row>
              </h-col>
              <h-col span="8">
                <h-row>
                  <h-col span="9" class="label">{{$t('m.i.common.totalAmtBillPackage')}}：</h-col>
                  <h-col span="15" class="val">{{formatMoney(formItem.totalAmt)}}</h-col>
                </h-row>
              </h-col>
              <h-col span="8">
                <h-row>
                  <h-col span="9" class="label">{{$t('m.i.common.totalNumBillPackage')}}：</h-col>
                  <h-col span="15" class="val">{{formItem.totalNum}}</h-col>
                </h-row>
              </h-col>
            </h-row>

            <h-row :gutter="8">
              <h-col span="8">
                <h-row>
                  <h-col span="9" class="label">{{$t('m.i.be.firstSettleAmtByUnit')}}：</h-col>
                  <h-col span="15" class="val">{{formatMoney(formItem.firstSettleAmt)}}</h-col>
                </h-row>
              </h-col>
              <h-col span="8">
                <h-row>
                  <h-col span="9" class="label">{{$t('m.i.be.dueSettleAmtByUnit')}}：</h-col>
                  <h-col span="15" class="val">{{formatMoney(formItem.dueSettleAmt)}}</h-col>
                </h-row>
              </h-col>
              <h-col span="8">
                <h-row>
                  <h-col span="9" class="label">{{$t('m.i.be.payInterestByUnit')}}：</h-col>
                  <h-col span="15" class="val">{{formatMoney(formItem.firstPayInterest)}}</h-col>
                </h-row>
              </h-col>
            </h-row>

            <h-row :gutter="8">
              <h-col span="8">
                <h-row>
                  <h-col span="9" class="label">{{$t('m.i.be.buyBackEarningRate')}}：</h-col>
                  <h-col span="15" class="val">{{formatRate(formItem.yieldRatePct)}}</h-col>
                </h-row>
              </h-col>
              <h-col span="8">
                <h-row>
                  <h-col span="9" class="label">{{$t("m.i.be.totalInterestDiff")}}:</h-col>
                  <h-col span="15" class="val">{{formatMoney(formItem.sumInterestMargin)}}</h-col>
                </h-row>
              </h-col>
            </h-row>
          </div>
          <div v-if="formItem.busiType=='BT03'">
            <h-row :gutter="8">
              <h-col span="8">
                <h-row>
                  <h-col span="9" class="label">{{$t('m.i.be.firstSettleDate')}}：</h-col>
                  <h-col span="15" class="val">{{formatDate(formItem.firstSettleDt)}}</h-col>
                </h-row>
              </h-col>
              <h-col span="8">
                <h-row>
                  <h-col span="9" class="label">{{$t('m.i.be.repoTerm')}}：</h-col>
                  <h-col span="15" class="val">{{formItem.tenorDays}}</h-col>
                </h-row>
              </h-col>
              <h-col span="8">
                <h-row>
                  <h-col span="9" class="label">{{$t('m.i.be.dueSettleDt')}}：</h-col>
                  <h-col span="15" class="val">{{formatDate(formItem.dueSettleDt)}}</h-col>
                </h-row>
              </h-col>
            </h-row>

            <h-row :gutter="8">
              <h-col span="8">
                <h-row>
                  <h-col span="9" class="label">{{$t('m.i.be.firstTransRate')}}：</h-col>
                  <h-col span="15" class="val">{{formatRate(formItem.ratePct)}}</h-col>
                </h-row>
              </h-col>
              <h-col span="8">
                <h-row>
                  <h-col span="9" class="label">{{$t('m.i.be.dueTradRate')}}：</h-col>
                  <h-col span="15" class="val">{{formatRate(formItem.dueRatePct)}}</h-col>
                </h-row>
              </h-col>
              <h-col span="8">
                <h-row>
                  <h-col span="9" class="label">{{$t('m.i.be.setTm')}}：</h-col>
                  <h-col span="15" class="val">{{formItem.setTm}}</h-col>
                </h-row>
              </h-col>
            </h-row>

            <h-row :gutter="8">
              <h-col span="8">
                <h-row>
                  <h-col span="9" class="label">{{$t('m.i.be.quoteTm')}}：</h-col>
                  <h-col span="15" class="val">{{formItem.quoteTm}}</h-col>
                </h-row>
              </h-col>
              <h-col span="8">
                <h-row>
                  <h-col span="9" class="label">{{$t('m.i.be.prodNo')}}：</h-col>
                  <h-col span="15" class="val">{{formItem.prodName}}</h-col>
                </h-row>
              </h-col>
              <h-col span="8">
                <h-row>
                  <h-col span="9" class="label">{{$t('m.i.common.totalAmtBillPackage')}}：</h-col>
                  <h-col span="15" class="val">{{formatMoney(formItem.totalAmt)}}</h-col>
                </h-row>
              </h-col>
            </h-row>

            <h-row :gutter="8">
              <h-col span="8">
                <h-row>
                  <h-col span="9" class="label">{{$t('m.i.common.totalNumBillPackage')}}：</h-col>
                  <h-col span="15" class="val">{{formItem.totalNum}}</h-col>
                </h-row>
              </h-col>
              <h-col span="8">
                <h-row>
                  <h-col span="9" class="label">{{$t('m.i.be.firstSettleAmtByUnit')}}：</h-col>
                  <h-col span="15" class="val">{{formatMoney(formItem.firstSettleAmt)}}</h-col>
                </h-row>
              </h-col>
              <h-col span="8">
                <h-row>
                  <h-col span="9" class="label">{{$t('m.i.be.dueSettleAmtByUnit')}}：</h-col>
                  <h-col span="15" class="val">{{formatMoney(formItem.dueSettleAmt)}}</h-col>
                </h-row>
              </h-col>
            </h-row>

            <h-row :gutter="8">
              <h-col span="8">
                <h-row>
                  <h-col span="9" class="label">{{$t('m.i.be.firstPayInterestByUnit')}}：</h-col>
                  <h-col span="15" class="val">{{formatMoney(formItem.firstPayInterest)}}</h-col>
                </h-row>
              </h-col>
              <h-col span="8">
                <h-row>
                  <h-col span="9" class="label">{{$t('m.i.be.dueInterestByUnit')}}：</h-col>
                  <h-col span="15" class="val">{{formatMoney(formItem.dueInterest)}}</h-col>
                </h-row>
              </h-col>
              <h-col span="8">
                <h-row>
                  <h-col span="9" class="label">{{$t('m.i.be.buyBackEarningRate')}}：</h-col>
                  <h-col span="15" class="val">{{formatRate(formItem.yieldRatePct)}}</h-col>
                </h-row>
              </h-col>
            </h-row>
            <h-row :gutter="8">
              <h-col span="8">
                <h-row>
                  <h-col span="9" class="label">{{$t("m.i.be.totalInterestDiff")}}:</h-col>
                  <h-col span="15" class="val">{{formatMoney(formItem.sumInterestMargin)}}</h-col>
                </h-row>
              </h-col>
            </h-row>
          </div>

          <h-row :gutter="8" style="margin-left: -10px; margin-right: 6px;">
            <h-col span="24" style="padding-left: 10px; padding-right: 10px;">
              <h-row>
                <h-col span="3" class="label">{{$t('m.i.be.diffMsg')}}：</h-col>
                <h-col span="13" class="val">{{formItem.preChangeInfo}}</h-col>
              </h-row>
            </h-col>
          </h-row>
        </div>

      </div>
    </div>
    <!-- 数据展示表格 -->
    <div v-if="isShow">
      <h-row>
        <h-col span="24">
          <h-datagrid
            :columns="billColumns"
            highlight-row
            :height="350"
            :notSetWidth="true"
            :bindForm="billFormItem"
            url="/be/market/quote/quoteManager/querySaleBillList"
            ref="billDatagrid">
            <div slot="toolbar">
            </div>
          </h-datagrid>
        </h-col>
      </h-row>
    </div>
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="billId"
                    :billNo="billNo" :billRangeStart="billRangeStart" :billRangeEnd="billRangeEnd"></bill-info-main>
  </div>
</template>

<script>
  import { formatNumber, getDictValueFromMap, post, on, off ,getDictListByGroups,accMul } from "@/api/bizApi/commonUtil";

  export default {
    name: "quoteSaleAudit",
    data(){
      return {
        billFormItem:{
          batchId:""
        },
        formItem:{
          id:'',
          busiType:'',
          quoteNo:'',
          saleBrchCode:'',
          saleBrchName:'',
          saleTraderNo:'',
          saleTraderName:'',
          saleProductNo:'',
          saleProductName:'',
          buyBrchCode:'',
          buyBrchName:'',
          buyTraderNo:'',
          buyTraderName:'',
          buyProductNo:'',
          buyProductName:'',
          subDeal:'',
          billClass:'',
          billType:'',
          clearSpeed:'',
          clearType:'',
          settleMode:'',
          selectType:'',
          packetSeq:'',
          quoteTm:'',
          setTm:'',
          firstSettleDt:'',
          dueSettleDt:'',
          prodNo:'',
          ratePct:'',
          dueRatePct:'',
          totalNum:'',
          totalAmt:'',
          buyBackTotalAmt:null,
          tenorDays:'',
          yieldRatePct:'',
          firstSettleAmt:'',
          dueSettleAmt:'',
          firstPayInterest:'',
          dueInterest:'',
          productMapDict:'',
          sumInterestMargin:''
        },
        billColumns:[
          {
            type: 'selection',
            width: 50,
            hiddenCol: false,
            align: 'center'
          },
          {
            type: 'index',
            title: this.$t("m.i.common.index"),
            width: 60,
            align: 'center'
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
            title: this.$t('m.i.billInfo.billPackageNo'),
            key: 'billNo',
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
              let dictValue = !params.row.billRange  ? '-' :params.row.billRange;
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.billInfo.billPackageMoney'),
            key: 'billMoney',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('p',formatNumber(params.row.billMoney, 2, ','))
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
            hiddenCol: false,
            render: (h, params) => {
              return h('span', formatNumber(params.row.interestMargin, 2, ','))
            }
          },
          {
            title: this.$t('m.i.billInfo.remitDt'),
            key: 'remitDt',
            hiddenCol: false,
             render: (h, params) => {
              return h('span', params.row.remitDt?this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD"):"")
            }
          },
          {
            title: this.$t('m.i.billInfo.dueDt'),
            key: 'dueDt',
            hiddenCol: false,
             render: (h, params) => {
              return h('span', params.row.dueDt?this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD"):"")
            }
          },
          {
            title: this.$t('m.i.billInfo.dueMatDt'),
            key: 'dueMatDt',
            hiddenCol: false,
             render: (h, params) => {
              return h('span', params.row.dueMatDt?this.$moment(params.row.dueMatDt, "YYYY-MM-DD").format("YYYY-MM-DD"):"")
            }
          },
          {
            title: this.$t('m.i.billInfo.drwrName'),
            key: "drwrName",
            sortable: true,
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.billInfo.acptName'),
            key: "acptName",
            hiddenCol: false,

          },
          {
            title: this.$t('m.i.billInfo.acptBrchCode'),
            key: "acptBrchCode",
            hiddenCol: false,

          },
          {
            title: this.$t('m.i.billInfo.acptBankName'),
            key: "acptBankName",
            sortable: true,
            hiddenCol: false,

          },
          {
            title: this.$t('m.i.billInfo.cfmAppBrchCode'),
            key: "cfmAppBrchCode",
            hiddenCol: false,

          },
          {
            title: this.$t('m.i.billInfo.cfmAppBankName'),
            key: "cfmAppBankName",
            sortable: true,
            hiddenCol: false,

          },
          {
            title: this.$t('m.i.billInfo.acptGuarntrBrchCode'),
            key: "acptGuarntrBrchCode",
            hiddenCol: false,

          },
          {
            title: this.$t('m.i.billInfo.acptGuarntrBankName'),
            key: "acptGuarntrBankName",
            sortable: true,
            hiddenCol: false,

          },
          {
            title: this.$t('m.i.billInfo.discBrchCode'),
            key: "discBrchCode",
            hiddenCol: false,

          },
          {
            title: this.$t('m.i.billInfo.discBankName'),
            key: "discBankName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.billInfo.discGuarntrBrchCode'),
            key: "discGuarntrBrchCode",
            hiddenCol: false,

          },
          {
            title: this.$t('m.i.billInfo.discGuarntrBankName'),
            key: "discGuarntrBankName",
            sortable: true,
            hiddenCol: false,

          },
          {
            title: this.$t('m.i.billInfo.guarntrTrustBrchCode'),
            key: "guarntrTrustBrchCode",
            hiddenCol: false,

          },
          {
            title: this.$t('m.i.billInfo.guarntrTrustBankName'),
            key: "guarntrTrustBankName",
            sortable: true,
            hiddenCol: false,

          },
          {
            title: this.$t("m.i.be.assetIndustry"),
            key: "assetIndustry",
            hiddenCol: window.sessionStorage.getItem("isOpenI9")=="1"?false:true,
            render:(h,params) => {
              let dictValue = getDictValueFromMap(this.dictMap,"AssetIndustry",params.row.assetIndustry);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.remainDays'),
            key: "remainDays",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.dueRemainDays'),
            key: "dueRemainDays",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.firstPayInterestByUnit'),
            key: "firstPayInterest",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', formatNumber(params.row.firstPayInterest, 2, ','))
            }
          },
          {
            title: this.$t('m.i.be.dueInterestByUnit'),
            key: "dueInterest",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', formatNumber(params.row.dueInterest, 2, ','))
            }
          },
          {
            title: this.$t('m.i.be.firstSettleAmtByUnit'),
            key: "firstSettleAmt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', formatNumber(params.row.firstSettleAmt, 2, ','))
            }
          },
          {
            title: this.$t('m.i.be.dueSettleAmtByUnit'),
            key: "dueSettleAmt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', formatNumber(params.row.dueSettleAmt, 2, ','))
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
        // 分页切换配置
        pageSizeOpts : [10, 20, 50, 200],
        dictMap:new Map(),
        busiType:"",
        showBillInfoWin:false,
        billId:"",
        billNo:"",
        billRangeStart:'',
        billRangeEnd:'',
      };
    },
    components:{
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
      getDictListByGroups("QuoteBatchStatus,PreRelationFlag,PreTradeBhvr,CdSelectMode,ClearSpeed,SettleType,ClearType,Yon,QuoteBusiType,TrDir,CDMedia,DraftTypeCode,AcctFlag,QuoteStatus,StlResult,AssetIndustry,BillOrigin").then(res => {
        this.dictMap = res.get("map");
      });
      this.init();
    },
    methods: {
      turnForm(formItem,obj){
        formItem.id=obj.id;
        formItem.busiType=obj.busiType;
        formItem.quoteNo=obj.quoteNo;
        formItem.saleBrchCode=obj.saleBrchCode;
        formItem.saleBrchName=obj.saleBrchName;
        formItem.saleTraderNo=obj.saleTraderNo;
        formItem.saleTraderName=obj.saleTraderName;
        formItem.saleProductNo=obj.saleProductNo;
        formItem.saleProductName=obj.saleProductName;
        formItem.buyBrchCode=obj.buyBrchCode;
        formItem.buyBrchName=obj.buyBrchName;
        formItem.buyTraderNo=obj.buyTraderNo;
        formItem.buyTraderName=obj.buyTraderName;
        formItem.buyProductNo=obj.buyProductNo;
        formItem.buyProductName=obj.buyProductName;
        formItem.subDeal=obj.subDeal;
        formItem.billClass=obj.billClass;
        formItem.billType=obj.billType;
        formItem.clearSpeed=obj.clearSpeed;
        formItem.clearType=obj.clearType;
        formItem.settleMode=obj.settleMode;
        formItem.selectType=obj.selectType;
        formItem.packetSeq=obj.packetSeq;
        formItem.quoteTm=obj.quoteTm;
        formItem.setTm=obj.setTm;
        formItem.firstSettleDt=obj.firstSettleDt;
        formItem.dueSettleDt=obj.dueSettleDt;
        formItem.prodNo=obj.prodNo;
        formItem.prodName=obj.prodName;
        formItem.ratePct=obj.ratePct;
        formItem.dueRatePct=obj.dueRatePct;
        formItem.totalNum=obj.totalNum;
        formItem.totalAmt=obj.totalAmt;
        formItem.buyBackTotalAmt=obj.buyBackTotalAmt;
        formItem.tenorDays=obj.tenorDays;
        formItem.yieldRatePct=obj.yieldRatePct;
        formItem.firstSettleAmt=obj.firstSettleAmt;
        formItem.dueSettleAmt=obj.dueSettleAmt;
        formItem.firstPayInterest=obj.firstPayInterest;
        formItem.dueInterest=obj.dueInterest;
        formItem.preChangeInfo=obj.preChangeInfo;
        formItem.productMapDict=obj.productMap;
        formItem.sumInterestMargin=obj.sumInterestMargin;
      },
      billInfoWinClose(){
        this.billId=null;
        this.billNo=null;
        this.billRangeStart = null;
        this.billRangeEnd = null;
        this.showBillInfoWin=false;
      },
      billInfoWinOpen(billId,billNo,billRangeStart,billRangeEnd){
        this.billId=billId;
        this.billNo=billNo;
        this.billRangeStart=billRangeStart;
        this.billRangeEnd=billRangeEnd;
        this.showBillInfoWin=true;
      },
      format(groupcode, key) {
        return getDictValueFromMap(this.dictMap, groupcode, key)
      },
      formatDate(value) {
        return value ? this.$moment(value, "YYYY-MM-DD").format("YYYY-MM-DD") : ""
      },
      formatMoney(value) {
        return formatNumber(value, 2, ',');
      },
      formatRate(value){
        return formatNumber(value, 4, ',');
      },
      //  初始化页面
      init(){
        let batchId= this.batchId;
        let url ='';
        if(batchId){
          url='/be/market/quote/quoteManager/findSaleBatchById';
        }else{
          this.$msgTip.error(this, { info:"批次ID不能为空"});
        }
        post({id:batchId},url).then(res => {
          if (res && res.data) {
            let retCode = res.data.retCode
            if (retCode == "000000") {
              this.$nextTick(() => {
                let obj = res.data.retData;
                this.turnForm(this.formItem, obj);
                this.busiType=obj.busiType;
                if(this.formItem.firstSettleDt){
                  this.formItem.firstSettleDt= this.$moment(this.formItem.firstSettleDt,'YYYYMMDD').format('YYYY-MM-DD');
                }else {
                  this.formItem.firstSettleDt= this.$moment(obj.workDate,'YYYYMMDD').format('YYYY-MM-DD');
                }
                if(this.formItem.dueSettleDt){
                  this.formItem.dueSettleDt= this.$moment(this.formItem.dueSettleDt,'YYYYMMDD').format('YYYY-MM-DD');
                }
              });
            }else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t('m.i.common.netError') + error });
        })
      }

    }
  };
</script>

<style scoped>

</style>
