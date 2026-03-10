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
                                <h-col span="15" class="val">{{format("BusiType",formItem.busiType)}}</h-col>
                            </h-row>
                        </h-col>
                        <h-col span="8">
                            <h-row>
                                <h-col span="9" class="label">{{$t('m.i.be.tradDir')}}：</h-col>
                                <h-col span="15" class="val">{{format("TrDir",formItem.trDir)}}</h-col>
                            </h-row>
                        </h-col>
                        <h-col span="8">
                            <h-row>
                                <h-col span="9" class="label">{{$t('m.i.be.preAuditNo')}}:</h-col>
                                <h-col span="15" class="val">{{formItem.preAuditNo}}</h-col>
                            </h-row>
                        </h-col>
                    </h-row>

                    <h-row :gutter="8">
                        <h-col span="8">
                            <h-row>
                                <h-col span="9" class="label">{{$t('m.i.be.brchName')}}：</h-col>
                                <h-col span="15" class="val">{{formItem.brchName}}</h-col>
                            </h-row>
                        </h-col>
                        <h-col span="8">
                            <h-row>
                                <h-col span="9" class="label">{{$t('m.i.be.traderName')}}：</h-col>
                                <h-col span="15" class="val">{{formItem.traderName}}</h-col>
                            </h-row>
                        </h-col>
                        <h-col span="8">
                            <h-row>
                                <h-col span="9" class="label">{{$t('m.i.be.otherBrchName')}}：</h-col>
                                <h-col span="15" class="val">{{formItem.custBrchName}}</h-col>
                            </h-row>
                        </h-col>
                    </h-row>

                    <h-row :gutter="8">
                        <h-col span="8">
                            <h-row>
                                <h-col span="9" class="label">{{$t('m.i.be.custBrchCode')}}：</h-col>
                                <h-col span="15" class="val">{{formItem.custBrchCode}}</h-col>
                            </h-row>
                        </h-col>
                        <h-col span="8">
                            <h-row>
                                <h-col span="9" class="label">{{$t('m.i.be.custProductNo')}}：</h-col>
                                <h-col span="15" class="val">{{formItem.custProductName}}</h-col>
                            </h-row>
                        </h-col>
                        <h-col span="8">
                            <h-row>
                                <h-col span="9" class="label">{{$t('m.i.be.custTraderName')}}：</h-col>
                                <h-col span="15" class="val">{{formItem.custTraderName}}</h-col>
                            </h-row>
                        </h-col>
                    </h-row>

                    <h-row :gutter="8">
                        <h-col span="8">
                            <h-row>
                                <h-col span="9" class="label">{{$t('m.i.be.custTraderNo')}}：</h-col>
                                <h-col span="15" class="val">{{formItem.custTraderNo}}</h-col>
                            </h-row>
                        </h-col>
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
                    </h-row>

                    <h-row :gutter="8">
                        <h-col span="8">
                            <h-row>
                                <h-col span="9" class="label">{{$t('m.i.billInfo.billClass')}}：</h-col>
                                <h-col span="15" class="val">{{format("CDMedia",formItem.billClass)}}</h-col>
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
                                <h-col span="15" class="val">{{format("ClearSpeed",formItem.clearSpeed)}}</h-col>
                            </h-row>
                        </h-col>
                    </h-row>

                    <div v-if="formItem.busiType==='BT01'">
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
                              <h-col span="9" class="label">{{$t('m.i.be.prodNo')}}：</h-col>
                              <h-col span="15" class="val">{{formItem.productName}}</h-col>
                            </h-row>
                          </h-col>
                        </h-row>
                        <h-row :gutter="8">
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
                            <h-col span="8">
                                <h-row>
                                    <h-col span="9" class="label">{{$t('m.i.be.firstPayInterest')}}：</h-col>
                                    <h-col span="15" class="val">{{formatMoney(formItem.firstPayInterest)}}</h-col>
                                </h-row>
                            </h-col>
                        </h-row>
                        <h-row :gutter="8">
                            <h-col span="8">
                                <h-row>
                                    <h-col span="9" class="label">{{$t('m.i.be.settleAmtByUnit')}}：</h-col>
                                    <h-col span="15" class="val">{{formatMoney(formItem.firstSettleAmt)}}</h-col>
                                </h-row>
                            </h-col>
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
                    <div v-if="formItem.busiType==='BT02'">
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
                                    <h-col span="9" class="label">{{$t('m.i.be.billSelectType')}}：</h-col>
                                    <h-col span="15" class="val">{{format("CdSelectMode",formItem.selectType)}}</h-col>
                                </h-row>
                            </h-col>
                        </h-row>
                        <h-row :gutter="8">
                            <h-col span="8">
                                <h-row>
                                    <h-col span="9" class="label">{{$t('m.i.be.packetSeq')}}：</h-col>
                                    <h-col span="15" class="val">{{formItem.packetSeq}}</h-col>
                                </h-row>
                            </h-col>
                            <h-col span="8">
                                <h-row>
                                    <h-col span="9" class="label">{{$t('m.i.be.prodNo')}}：</h-col>
                                    <h-col span="15" class="val">{{formItem.productName}}</h-col>
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
                                    <h-col span="9" class="label">{{$t('m.i.be.payInterestByUnit')}}：</h-col>
                                    <h-col span="15" class="val">{{formatMoney(formItem.firstPayInterest)}}</h-col>
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
                    <div v-if="formItem.busiType==='BT03'">
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
                                    <h-col span="9" class="label">{{$t('m.i.be.prodNo')}}：</h-col>
                                    <h-col span="15" class="val">{{formItem.productName}}</h-col>
                                </h-row>
                            </h-col>
                        </h-row>

                        <h-row :gutter="8">
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
                            <h-col span="8">
                                <h-row>
                                    <h-col span="9" class="label">{{$t('m.i.be.firstSettleAmtByUnit')}}：</h-col>
                                    <h-col span="15" class="val">{{formatMoney(formItem.firstSettleAmt)}}</h-col>
                                </h-row>
                            </h-col>
                        </h-row>

                        <h-row :gutter="8">
                            <h-col span="8">
                                <h-row>
                                    <h-col span="9" class="label">{{$t('m.i.be.dueSettleAmtByUnit')}}：</h-col>
                                    <h-col span="15" class="val">{{formatMoney(formItem.dueSettleAmt)}}</h-col>
                                </h-row>
                            </h-col>
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
                </div>
            </div>
        </div>
        <!-- 数据展示表格 -->
        <div v-if="isShow">
                    <h-datagrid
                            :columns="billColumns"
                            highlight-row
                            :height="350"
                            :notSetWidth="true"
                            :bindForm="billFormItem"
                            url="/be/market/preaudit/preAuditBatchAudit/func_findBillByBatchIdByPage"
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
  import { formatNumber, getDictValueFromMap, post, formatBillRange, getDictListByGroups } from "@/api/bizApi/commonUtil";
  export default {
    name: "preAuditBatchAudit",
    data() {
      return  {
            billFormItem:{
                batchId:""
            },
          formItem:{
            id:'',
            busiType:'',
            trDir:'',
            preAuditNo:'',
            brchCode:'',
            brchName:'',
            traderNo:'',
            traderName:'',
            productNo:'',
            productName:'',
            custBrchCode:'',
            custBrchName:'',
            custTraderNo:'',
            custTraderName:'',
            custProductNo:'',
            custProductName:'',
            subDeal:'',
            billClass:'',
            billType:'',
            clearSpeed:'',
            clearType:'',
            settleMode:'',
            selectType:'',
            packetSeq:'',
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
              sortable: true,
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
              title: this.$t("m.i.billInfo.billRange"),
              align:'center',
              key:"billRange",
              hiddenCol: false,
              render:(h,params) => {
                let billOrigin = params.row.billOrigin;
                let billRangeStart = params.row.billRangeStart;
                let billRangeEnd = params.row.billRangeEnd;
                return h("span", formatBillRange(billOrigin, billRangeStart, billRangeEnd))
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
              sortable: true,
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
              title: this.$t('m.i.be.assetIndustry'),
              key: 'assetIndustry',
              hiddenCol:window.sessionStorage.getItem("isOpenI9")=="1"?false:true,
              render: (h, params) => {
                let dictValue =getDictValueFromMap(this.dictMap, 'AssetIndustry', params.row.assetIndustry);
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
          pageSizeOpts :[10, 20, 50, 200],
        dictMap: new Map(),
        busiType: "",
        showBillInfoWin: false,
        billId: "",
        billNo: "",
        billRangeStart:'',
        billRangeEnd:'',
      };
    },
    components: {
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
      getDictListByGroups("PreRelationFlag,CdSelectMode,AssetIndustry,ClearSpeed,SettleType,ClearType,Yon,BusiType,TrDir,CDMedia,DraftTypeCode,BillOrigin").then(res => {
        this.dictMap = res.get("map");
      });
      this.init();
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
        return getDictValueFromMap(this.dictMap, groupcode, key);
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
      //  初始化页面
      init() {
        let batchId = this.batchId;
        let url = "";
        if (batchId) {
          url = "/be/market/preaudit/preAuditBatchAudit/func_findPreAuditById";
        } else {
          this.$msgTip.error(this, { info: "批次ID不能为空" });
        }
        post({ id: batchId }, url).then(res => {
          if (res && res.data) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$nextTick(() => {
                let obj = res.data.retData;
                this.turnForm(this.formItem, obj,this);
              });
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      },
      turnForm(formItem, obj,_this) {
        formItem.id = obj.id;
        formItem.memberId = obj.memberId;
        formItem.busiType = obj.busiType;
        formItem.trDir = obj.trDir;
        formItem.preAuditNo = obj.preAuditNo;
        formItem.brchCode = obj.brchCode;
        formItem.brchName = obj.brchName;
        formItem.traderNo = obj.traderNo;
        formItem.traderName = obj.traderName;
        formItem.productNo = obj.prodNo;
        formItem.productName = obj.prodName;
        formItem.custBrchCode = obj.custBrchCode;
        formItem.custBrchName = obj.custBrchName;
        formItem.custTraderNo = obj.custTraderNo;
        formItem.custTraderName = obj.custTraderName;
        formItem.custProductNo = obj.custProductNo;
        formItem.custProductName = obj.custProductName;
        formItem.subDeal = obj.subDeal;
        formItem.billClass = obj.billClass;
        formItem.billType = obj.billType;
        formItem.clearSpeed = obj.clearSpeed;
        formItem.clearType = obj.clearType;
        formItem.settleMode = obj.settleMode;
        formItem.selectType = obj.selectType;
        formItem.packetSeq = obj.packetSeq;
        formItem.firstSettleDt = obj.firstSettleDt;
        formItem.dueSettleDt = obj.dueSettleDt;
        formItem.prodNo = obj.prodNo;
        formItem.ratePct = obj.ratePct;
        formItem.dueRatePct = obj.dueRatePct;
        formItem.totalNum = obj.totalNum;
        formItem.totalAmt = obj.totalAmt;
        formItem.buyBackTotalAmt = obj.buyBackTotalAmt + "";
        formItem.tenorDays = obj.tenorDays;
        formItem.yieldRatePct = obj.yieldRatePct;
        formItem.firstSettleAmt = obj.firstSettleAmt;
        formItem.dueSettleAmt = obj.dueSettleAmt;
        formItem.firstPayInterest = obj.firstPayInterest;
        formItem.dueInterest = obj.dueInterest;
        formItem.productMapDict = obj.productMap;
        if (formItem.firstSettleDt) {
          formItem.firstSettleDt = _this.$moment(formItem.firstSettleDt, "YYYYMMDD").format("YYYY-MM-DD");
        }
        if (formItem.dueSettleDt) {
          formItem.dueSettleDt = _this.$moment(formItem.dueSettleDt, "YYYYMMDD").format("YYYY-MM-DD");
        }
      }
    }
  };
</script>

<style scoped>

</style>
