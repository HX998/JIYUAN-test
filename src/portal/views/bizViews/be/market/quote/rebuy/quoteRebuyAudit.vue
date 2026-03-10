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
                <h-col span="9" class="label">{{$t('m.i.be.quoteNo')}}：</h-col>
                <h-col span="15" class="val">{{formItem.quoteNo}}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.be.brchName')}}：</h-col>
                <h-col span="15" class="val">{{formItem.buyBrchName}}</h-col>
              </h-row>
            </h-col>
          </h-row>

          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.be.traderName')}}：</h-col>
                <h-col span="15" class="val">{{formItem.buyTraderName}}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.be.otherBrchName')}}：</h-col>
                <h-col span="15" class="val">{{formItem.saleBrchName}}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.be.custBrchCode')}}：</h-col>
                <h-col span="15" class="val">{{formItem.saleBrchCode}}</h-col>
              </h-row>
            </h-col>
          </h-row>

          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.be.custProductNo')}}：</h-col>
                <h-col span="15" class="val">{{formItem.saleProductName}}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.be.custTraderName')}}：</h-col>
                <h-col span="15" class="val">{{formItem.saleTraderName}}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.be.custTraderNo')}}：</h-col>
                <h-col span="15" class="val">{{formItem.saleTraderNo}}</h-col>
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
                  <h-col span="9" class="label">{{$t('m.i.be.dueTransRate')}}：</h-col>
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
          <h-datagrid
            :columns="billColumns"
            highlight-row
            :height="350"
            :bindForm="billFormItem"
            :notSetWidth="true"
            :auto-load="false"
            url="/be/market/quote/quoteManager/queryRebuyBillList"
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
  import { formatNumber, post, on, off ,accMul} from "@/api/bizApi/commonUtil";

  export default {
    name: "quoteRebuyAudit",
    data(){
      return {
        billFormItem:{
          batchId:"",
          ids:""
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
          productMapDict:''
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
          let dictValue = this.getDictValueFromMap(this.dictMap, 'PreRelationFlag', params.row.preRelationFlag);
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
            title: this.$t('m.i.billInfo.billPackageNo'),
            key: 'billNo',
            hiddenCol: false,
            /*render: (h, params) => {
              return h('a', {
                on: {
                  click: () => {
                    this.billInfoWinOpen(params.row.billId, params.row.billNo,params.row.billRangeStart,params.row.billRangeEnd);
                  }
                }
              }, params.row.billNo);
            }*/
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
            title:this.$t("m.i.be.guideRate"),
            key:"guideRate",
            hiddenCol:true,
            render: (h, params) => {
              if (params.row.guideRate != null && params.row.guideRate !== "") {
                let rate = accMul(params.row.guideRate, 100);
                return h("span", formatNumber(rate, 4, ','));
              }
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
            title: this.$t('m.i.be.creditOccType'),
            key: 'creditOccupyType',
            hiddenCol:false,
            render: (h, params) => {
          let dictValue = this.getDictValueFromMap(this.dictMap, 'CreditDeductRule', params.row.creditOccupyType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },

          {
            title: this.$t('m.i.be.bookType'),
            key: 'bookType',
            hiddenCol:false,
            render: (h, params) => {
          let dictValue = this.getDictValueFromMap(this.dictMap, 'BookType', params.row.bookType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
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
            sortable: true,
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
            hiddenCol: false
          },
          {
            title: this.$t("m.i.be.assetIndustry"),
            key: "assetIndustry",
            hiddenCol: window.sessionStorage.getItem("isOpenI9")=="1"?false:true,
            render:(h,params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap,"AssetIndustry",params.row.assetIndustry);
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
            },
            exportRender: (cellData) => {
              return formatNumber(cellData, 2, '，')
            }
          },
          {
            title: this.$t('m.i.be.dueInterestByUnit'),
            key: "dueInterest",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', formatNumber(params.row.dueInterest, 2, ','))
            },
            exportRender: (cellData) => {
              return formatNumber(cellData, 2, '，')
            }
          },
          {
            title: this.$t('m.i.be.firstSettleAmtByUnit'),
            key: "firstSettleAmt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', formatNumber(params.row.firstSettleAmt, 2, ','))
            },
            exportRender: (cellData) => {
              return formatNumber(cellData, 2, '，')
            }
          },
          {
            title: this.$t('m.i.be.dueSettleAmtByUnit'),
            key: "dueSettleAmt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', formatNumber(params.row.dueSettleAmt, 2, ','))
            },
            exportRender: (cellData) => {
              return formatNumber(cellData, 2, '，')
            }
          }
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
        isCheckGuideRate:false
      };
    },
    components:{
      BT01:()=>import(/* webpackChunkName: "be/market/quote/common/BT01" */`@/views/bizViews/be/market/quote/common/BT01`),
      BT02:()=>import(/* webpackChunkName: "be/market/quote/common/BT02" */`@/views/bizViews/be/market/quote/common/BT02`),
      BT03:()=>import(/* webpackChunkName: "be/market/quote/common/BT03" */`@/views/bizViews/be/market/quote/common/BT03`)
    },
    props: {
      isShow: {
        type: Boolean,
        default: false
      },
      listIds: "",
      batchId: "",
      auditRouteId:""
    },
    created() {
      this.billFormItem.batchId = this.batchId;
      this.billFormItem.ids = this.listIds;
      this.init();
      this.showCheckGuide();
    },

    watch:{
      isShow(val){
        if(val){


        }
      }
    },
    methods: {
      //显示指导利率展示列的显影
      showCheckGuide() {
        if (this.auditRouteId==null||this.auditRouteId==undefined||this.auditRouteId=="") {
          return;
        }
        post({ id: this.auditRouteId }, "/bm/audit/auditRoute/func_getAuditRouteById").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              if (res.data.retData.isCheckGuideRate==="1"){
                this.isCheckGuideRate=true;
              }
              this.$refs.billDatagrid.controlColumnsHidden("guideRate",!this.isCheckGuideRate);
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      },
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
        return this.getDictValueFromMap(this.dictMap, groupcode, key)
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
          url='/be/market/quote/quoteManager/findRebuyBatchById';
        }else{
          this.$msgTip.error(this, { info:"批次ID不能为空"});
        }
        post({id:batchId},url).then(res => {
          if (res && res.data) {
            let retCode = res.data.retCode
            if (retCode == "000000") {
              this.$nextTick(() => {
                let obj = res.data.retData;
                //控制某列显隐
                const billColumns = this.billColumns;
                let creditOccupyTypeCol = null;
                let assetIndustryCol = null;
                let bookTypeCol = null;
                for (let column of billColumns) {
                  if (column.key === 'creditOccupyType') {
                    creditOccupyTypeCol = column;
                    continue;
                  }else if(column.key === 'assetIndustry'){
                    assetIndustryCol = column;
                    continue;
                  }else if(column.key === 'bookType'){
                    bookTypeCol = column;
                    continue;
                  } ;
                }
                if (creditOccupyTypeCol != null&&obj.isSelectCreditOccupy) {
                  creditOccupyTypeCol.hiddenCol=(obj.isSelectCreditOccupy=="1"?false:true);
                }else{
                  creditOccupyTypeCol.hiddenCol=true;
                }
                if (assetIndustryCol != null&&obj.isNeedAssetIndustry) {
                  assetIndustryCol.hiddenCol=(obj.isNeedAssetIndustry=="1"?false:true);
                }else{
                  assetIndustryCol.hiddenCol=true;
                }
                if (bookTypeCol != null&&obj.isNeedBookType) {
                  bookTypeCol.hiddenCol=(obj.isNeedBookType=="1"?false:true);
                }else{
                  bookTypeCol.hiddenCol=true;
                }
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
                this.$refs.billDatagrid.dataChange(1);
              });
            }else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t('m.i.common.netError') + error });
        })
      }

    },
    mounted() {
      this.getDictListByGroups("CreditDeductRule,AssetIndustry,BookType,QuoteBatchStatus,PreRelationFlag,PreTradeBhvr,CdSelectMode,ClearSpeed,SettleType,ClearType,Yon,QuoteBusiType,TrDir,CDMedia,DraftTypeCode,AcctFlag,QuoteStatus,StlResult,BillOrigin").then(res => {
        this.dictMap = res.get("map");
      });

    },
  };
</script>

<style scoped>

</style>
