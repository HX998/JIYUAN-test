<template>
  <div>
    <h-msg-box v-model="tempStdCreationDetail" maximize width="1000" :mask-closable="false" @on-close="handleClose">
      <p slot="header">
        <span>查看交易详情</span>
      </p>
      <div class="text-body">
        <h-row :gutter="16">
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t("m.i.common.batchNo") }}:</h-col>
              <h-col span="15" class="val">{{ formItem.batchNo }}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t('m.i.bs.collectMode') }}:</h-col>
              <h-col span="15" class="val">{{ format("CollectMode", formItem.collectMode) }}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t('m.i.bs.baseAssetType') }}:</h-col>
              <h-col span="15" class="val">{{ format("BaseAssetType", formItem.baseAssetType) }}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t('m.i.bs.stdProductName') }}:</h-col>
              <h-col span="15" class="val">{{ formItem.stdProductName }}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <br>
        <h-row :gutter="16">
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t('m.i.bs.stdProductShortName') }}:</h-col>
              <h-col span="15" class="val">{{ formItem.stdProductShortName }}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t('m.i.bs.stdProductNo') }}:</h-col>
              <h-col span="15" class="val">{{ formItem.stdProductNo }}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t('m.i.bs.ecdsAcctNo') }}:</h-col>
              <h-col span="15" class="val">{{ formItem.ecdsAcctNo }}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t("m.i.bs.ecdsAcctName") }}:</h-col>
              <h-col span="15" class="val">{{ formItem.ecdsAcctName }}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <br>
        <h-row :gutter="16">
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t('m.i.bs.dpstBrchName') }}:</h-col>
              <h-col span="15" class="val">{{ formItem.dpstBrchName }}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t('m.i.bs.dpstBrchCode') }}:</h-col>
              <h-col span="15" class="val">{{ formItem.dpstBrchCode }}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t('m.i.bs.sellBrchName') }}:</h-col>
              <h-col span="15" class="val">{{ formItem.sellBrchName }}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t('m.i.bs.financeMaxRatePct') }}:</h-col>
              <h-col span="15" class="val">{{ formItem.financeMaxRatePct }}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <br>
        <h-row :gutter="16">
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t('m.i.bs.financeMinRatePct') }}:</h-col>
              <h-col span="15" class="val">{{ formItem.financeMinRatePct }}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t('m.i.bs.publishDt') }}:</h-col>
              <h-col span="15" class="val">{{ formatDate(formItem.publishDt) }}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t('m.i.bs.declareEndDtTm') }}:</h-col>
              <h-col span="15" class="val">{{ formatDateTime(formItem.declareEndDtTm) }}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t('m.i.bs.purchaseDt') }}:</h-col>
              <h-col span="15" class="val">{{ formatDate(formItem.purchaseDt) }}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <br>
        <h-row :gutter="16">
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t('m.i.bs.raiseDt') }}:</h-col>
              <h-col span="15" class="val">{{ formatDate(formItem.raiseDt) }}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t('m.i.bs.paymentDt') }}:</h-col>
              <h-col span="15" class="val">{{ formatDate(formItem.paymentDt) }}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t('m.i.bs.transPlace') }}:</h-col>
              <h-col span="15" class="val">{{ format("TransPlace", formItem.transPlace) }}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <br>
        <hr>
        <br>
        <h-row :gutter="16">
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t('m.i.bs.creationMaxAmt') }}:</h-col>
              <h-col span="15" class="val">{{ formatNumber(formItem.creationMaxAmt) }}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t('m.i.bs.creationMaxTerm') }}:</h-col>
              <h-col span="15" class="val">{{ formItem.creationMaxTerm }}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t('m.i.bs.preBeginDueDt') }}:</h-col>
              <h-col span="15" class="val">{{ formatDate(formItem.preBeginDueDt) }}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t('m.i.bs.preEndDueDt') }}:</h-col>
              <h-col span="15" class="val">{{ formatDate(formItem.preEndDueDt) }}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <br>
        <hr>
        <br>
        <div v-if="formItem.isSelfSell==='1'">
          <h-row :gutter="16">
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{ $t('m.i.bs.calFeeType') }}:</h-col>
                <h-col span="15" class="val">{{ format("CalFeeType", formItem.calFeeType) }}</h-col>
              </h-row>
            </h-col>
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{ $t('m.i.bs.feeRate') }}:</h-col>
                <h-col span="15" class="val">{{ formItem.feeRatePct }}</h-col>
              </h-row>
            </h-col>
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{ $t('m.i.bs.totalFeeAmt') }}:</h-col>
                <h-col span="15" class="val">{{ formatNumber(formItem.totalFeeAmt) }}</h-col>
              </h-row>
            </h-col>
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{ $t('m.i.bs.sellCalFeeType') }}:</h-col>
                <h-col span="15" class="val">{{ format("CalFeeType", formItem.sellCalFeeType) }}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <br>
          <h-row :gutter="16">
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{ $t('m.i.bs.sellFeeRate') }}:</h-col>
                <h-col span="15" class="val">{{ formItem.sellFeeRatePct }}</h-col>
              </h-row>
            </h-col>
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{ $t('m.i.bs.totalSellFeeAmt') }}:</h-col>
                <h-col span="15" class="val">{{ formatNumber(formItem.totalSellFeeAmt) }}</h-col>
              </h-row>
            </h-col>
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{ $t('m.i.bs.totalSettleAmt') }}:</h-col>
                <h-col span="15" class="val">{{ formatNumber(formItem.totalSettleAmt) }}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <br>
        </div>
        <div v-else>
          <h-row :gutter="16">
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{ $t('m.i.bs.calFeeType') }}:</h-col>
                <h-col span="15" class="val">{{ format("CalFeeType", formItem.calFeeType) }}</h-col>
              </h-row>
            </h-col>
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{ $t('m.i.bs.feeRate') }}:</h-col>
                <h-col span="15" class="val">{{ formItem.feeRatePct }}</h-col>
              </h-row>
            </h-col>
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{ $t('m.i.bs.totalFeeAmt') }}:</h-col>
                <h-col span="15" class="val">{{ formatNumber(formItem.totalFeeAmt) }}</h-col>
              </h-row>
            </h-col>
            <h-col span="6">
              <h-row>
                <h-col span="9" class="label">{{ $t('m.i.bs.totalSettleAmt') }}:</h-col>
                <h-col span="15" class="val">{{ formatNumber(formItem.totalSettleAmt) }}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <br>
        </div>
        <hr>
        <br>
        <h-row :gutter="16">
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t('m.i.bs.beginDueDt') }}:</h-col>
              <h-col span="15" class="val">{{ formatDate(formItem.beginDueDt) }}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t('m.i.bs.endDueDt') }}:</h-col>
              <h-col span="15" class="val">{{ formatDate(formItem.endDueDt) }}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t('m.i.bs.creationAmt') }}:</h-col>
              <h-col span="15" class="val">{{ formatNumber(formItem.creationAmt) }}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t('m.i.bs.creationTerm') }}:</h-col>
              <h-col span="15" class="val">{{ formItem.creationTerm }}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <br>
        <hr>
        <br>
        <h-row :gutter="16">
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t('m.i.bs.purchaseResult') }}:</h-col>
              <h-col span="15" class="val">{{ format("PurchaseResult", formItem.purchaseResult) }}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t('m.i.bs.financeRatePct') }}:</h-col>
              <h-col span="15" class="val">{{ formItem.financeRatePct }}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t('m.i.bs.totalCollectAmt') }}:</h-col>
              <h-col span="15" class="val">{{ formatNumber(formItem.totalCollectAmt) }}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <br>
        <hr>
        <br>
        <h-row :gutter="16">
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t('m.i.bs.hisPaymentAmt') }}:</h-col>
              <h-col span="15" class="val">{{ formatNumber(formItem.hisPaymentAmt) }}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t('m.i.bs.dueRecoverSumAmt') }}:</h-col>
              <h-col span="15" class="val">{{ formatNumber(formItem.dueRecoverSumAmt) }}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t('m.i.bs.notRecoverSumAmt') }}:</h-col>
              <h-col span="15" class="val">{{ accSubWithFormat(formItem.creationAmt, formItem.dueRecoverSumAmt) }}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t('m.i.bs.paymentStatus') }}:</h-col>
              <h-col span="15" class="val">{{ format("StdCashStatus", formItem.cashStatus) }}</h-col>
            </h-row>
          </h-col>
        </h-row>
      </div>
      <h-datagrid
        :columns="billColumns"
        highlight-row
        :bindForm="billFormItem"
        :url="dataGridUrl"
        ref="billDatagrid">
        <div slot="toolbar" class="pull-left">
          <h-button type="primary" @click="listExport()" v-if="!isNotShowExport">{{$t("m.i.common.exportData")}}</h-button>
          <h-button type="primary" @click="showCreditMain()">{{ $t('m.i.bs.showCreditMain') }}</h-button>
          <h-button type="primary" @click="showOrgHolder()" v-if="formItem.collectMode === 'CM02'">
            {{ $t('m.i.bs.showOrgHolder') }}
          </h-button>
          <h-button type="primary" @click="custFeeList"  v-if="formItem.interestStatus === '1'">{{$t("m.i.bs.custFeeList")}}</h-button>
        </div>
      </h-datagrid>
      <div slot="footer" style="text-align:left">

      </div>
    </h-msg-box>

    <show-org-holder :showOrgHolderWin="showOrgHolderWin" :creationId="batchId" :dictMap="dictMap" :batchParams="holderParams"
                     :title="$t('m.i.bs.showOrgHolder')" @showOrgHolderWinClose="showOrgHolderWinClose"
                     :isShow="true"></show-org-holder>
    <show-credit-main :showCreditMainWin="showCreditMainWin" :creationId="batchId"
                      :baseAssetType="this.formItem.baseAssetType" :dictMap="dictMap" :batchParams="creditParams"
                      :title="$t('m.i.bs.showCreditMain')" :isShow="true"
                      @showCreditMainClose="showCreditMainClose"></show-credit-main>
    <!-- 客户费用明细 -->
    <std-creation-fee-detail :stdCreationFeeDetailWin="stdCreationFeeDetailWin" :feeDetailParams="feeDetailParams" :dictMap="dictMap"
                             @stdCreationFeeDetailWinClose="stdCreationFeeDetailWinClose" ref="stdCreationFeeDetail"></std-creation-fee-detail>


    <common-excel-download @handleSubmit="exportTable" @showExcelTemplateWinClose="showExcelTemplateWinClose" :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.excelParam" :rows="this.rows"></common-excel-download>
    <bill-info-main-std @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="billId" :billNo="billNo" :listId="listId"></bill-info-main-std>
  </div>
</template>

<script>
import {getDictListByGroups, getDictValueFromMap, post, formatNumber, accSub,exportList} from "@/api/bizApi/commonUtil";
export default {
  name: "stdCreationDetail",
  data() {
    return {
      billFormItem: {
        batchId: ""
      },
      feeDetailParams:{},
        //清单导出
      excelParam:null,
      rows: null,
      tempShowExcelTemplateWin: false,
      formItem: {},
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
          title: this.$t("m.i.bs.flowStatus"),
          key: "flowStatus",
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = this.getDictValueFromMap(this.dictMap, "DpstBillFlowStatus", params.row.flowStatus);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t('m.i.common.custName'),
          key: 'custName',
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.custAcctNo'),
          key: 'custAcctNo',
          hiddenCol: false
        },
        {
          title: this.$t('m.i.bs.endrsmtApplDt'),
          key: 'endrsmtApplDt',
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            return h('span', params.row.endrsmtApplDt ? this.$moment(params.row.endrsmtApplDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
          }
        },
        {
          title: this.$t('m.i.billInfo.billNo'),
          key: 'billNo',
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            return h('a', {
              on: {
                click: () => {
                  this.billInfoWinOpen(params.row.billId, params.row.billNo,params.row.id)
                }
              }
            }, params.row.billNo)
          }
        },
        {
          title: this.$t('m.i.billInfo.billType'),
          key: 'billType',
          hiddenCol: false,
          render: (h, params) => {
            let dictValue =this.getDictValueFromMap(this.dictMap, 'DraftTypeCode', params.row.billType);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t('m.i.billInfo.drwrName'),
          key: 'drwrName',
          hiddenCol: false
        },
        {
          title: this.$t('m.i.billInfo.acptName'),
          key: 'acptName',
          hiddenCol: false
        },
        {
          title: this.$t('m.i.billInfo.remitDt'),
          key: 'remitDt',
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            return h('span', params.row.remitDt ? this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
          }
        },
        {
          title: this.$t('m.i.billInfo.dueDt'),
          key: 'dueDt',
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            return h('span', params.row.dueDt ? this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
          }
        },
        {
          title: this.$t("m.i.billInfo.billMoneyByUnit"),
          key: "billMoney",
          hiddenCol: false,
          align: "right",
          sortable: true,
          render: (h, params) => {
            return h("p", formatNumber(params.row.billMoney, 2, ","));
          }
        },
        {
          title: this.$t('m.i.bs.custPyeeAcctNo'),
          key: 'custPyeeAcctNo',
          hiddenCol: false,
          sortable: true
        },
        {
          title: this.$t('m.i.bs.custPyeeBankNo'),
          key: 'custPyeeBankNo',
          hiddenCol: false,
          sortable: true
        },
        {
          title: this.$t("m.i.bs.feeAmt"),
          key: "feeAmt",
          hiddenCol: false,
          align: "right",
          sortable: true,
          render: (h, params) => {
            return h("p", formatNumber(params.row.feeAmt, 2, ","));
          }
        },
        {
          title: this.$t("m.i.bs.sellFeeAmt"),
          key: "sellFeeAmt",
          hiddenCol: false,
          align: "right",
          sortable: true,
          render: (h, params) => {
            return h("p", formatNumber(params.row.sellFeeAmt, 2, ","));
          }
        },
        {
          title: this.$t("m.i.bs.settleAmt"),
          key: "settleAmt",
          hiddenCol: false,
          align: "right",
          sortable: true,
          render: (h, params) => {
            return h("p", formatNumber(params.row.settleAmt, 2, ","));
          }
        },
        {
          title: this.$t('m.i.be.cashStatus'),
          key: 'payStatus',
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let payStatusValue =this.getPayStatusValueFrom(params.row.payStatus);
            return h("span", {
              domProps: {
                title: payStatusValue
              }
            }, payStatusValue);
          }
        },
        {
          title: this.$t("m.i.bs.dueRecoverSumAmt"),
          key: "dueRecoverAmt",
          hiddenCol: false,
          align: "right",
          sortable: true,
          render: (h, params) => {
            return h("p", formatNumber(params.row.dueRecoverAmt, 2, ","));
          }
        }

      ],
      dictMap: new Map(),
      showOrgHolderWin: false,
      showCreditMainWin: false,
      stdCreationFeeDetailWin: false,
      isNotShowExport:false,
      isNotShowFee:false,
      dataGridUrl:"/bs/corpstdbill/dpst/stdCorpDpstApply/func_queryStdCorpDpstBillPage",
      creditParams:{},
      holderParams:{},
      showBillInfoWin: false,
      billId: "",
      billNo: "",
      listId:""

    };
  },
  components: {
    ShowCreditMain: () => import(/* webpackChunkName: "bs/corpstdbill/creation/showCreditMain" */"@/views/bizViews/bs/corpstdbill/creation/showCreditMain"),
    ShowOrgHolder: () => import(/* webpackChunkName: "bs/corpstdbill/creation/showOrgHolder" */"@/views/bizViews/bs/corpstdbill/creation/showOrgHolder"),
    stdCreationFeeDetail: () => import(/* webpackChunkName: "bs/corpstdbill/creation/stdCreationFeeDetail" */"@/views/bizViews/bs/corpstdbill/creation/stdCreationFeeDetail"),

  },
  watch: {
    stdCreationDetail(val) {
      if (val) {
        this.billFormItem.batchId = this.batchId;
        if(this.batchParams.isNotShowExport){
          this.isNotShowExport = true;
        }
        if(this.batchParams.isNotShowFee){
          this.isNotShowFee = true;
        }
        if(this.batchParams.dataGridUrl){
          this.dataGridUrl= this.batchParams.dataGridUrl;
        }
        this.$nextTick(() => {
          this.init();
          this.$refs.billDatagrid.selects = [];
          this.$refs.billDatagrid.selectIds = [];
          this.$refs.billDatagrid.dataChange( 1);
        });
      }
    }
  },
  computed: {
    tempStdCreationDetail: {
      get() {
        return this.stdCreationDetail;
      },
      set() {
      }
    }
  },
  props: {
    batchId: "",
    stdCreationDetail: false,
    batchParams: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  created() {
    this.billFormItem.batchId = this.batchId;

    if(this.batchParams.dataGridUrl){
      this.dataGridUrl= this.batchParams.dataGridUrl;
    }
  },
  mounted() {
    getDictListByGroups("BaseAssetType,Yon,DraftTypeCode,CDMedia,TransPlace,CollectMode,CorpScale,Industry,partnerType,CalFeeType,PurchaseResult,CreditRating,RatingExpectationType,DpstBillFlowStatus,MemberType,StdCashStatus").then(res => {
      this.dictMap = res.get("map");
    });
  },
  methods: {

    format(groupCode, key) {
      return getDictValueFromMap(this.dictMap, groupCode, key);
    },
    formatDate(value) {
      return value ? this.$moment(value, "YYYY-MM-DD").format("YYYY-MM-DD") : "";
    },
    formatDateTime(value) {
      return value ? this.$moment(value, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss") : "";
    },
    formatNumber(value){
      return formatNumber(value, 2, ",");
    },
    accSubWithFormat(value1, value2){
      if(value1 && value2){
        return formatNumber(accSub(value1, value2), 2, ",");
      }
      return "-";
    },
    getPayStatusValueFrom(value){
      if (value) {
        switch (value) {
          case "0":
            return "未兑付";
            break;
          case "1":
            return "兑付中";
            break;
          case "2":
            return "已兑付";
            break;
          default:
            return value;
        }
      }else{
        return "";
      }
    },
    //  初始化页面
    init() {
      let batchId = this.batchId;
      let url = "";
      if (batchId) {
        url = "/bs/corpstdbill/creation/stdCreationApply/func_jumpEditStdCreation";
        if(this.batchParams.batchUrl){
          url = this.batchParams.batchUrl;
        }
      } else {
        this.$msgTip.error(this, {info: "批次ID不能为空"});
      }
      post({id: batchId}, url).then(res => {
        if (res && res.data) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.$nextTick(() => {
              this.formItem = res.data.retData;
            });
          } else {
            this.$msgTip.error(this, {info: res.data.retMsg});
          }
        }
      }).catch(error => {
        this.$msgTip.error(this, {info: this.$t("m.i.common.netError") + error});
      });
    },
    showCreditMain() {
      this.creditParams = this.batchParams;
      this.showCreditMainWin = true;
    },
    showCreditMainClose() {
      this.creditParams ={};
      this.showCreditMainWin = false;
    },
    showOrgHolder() {
      this.holderParams= this.batchParams;
      this.showOrgHolderWin = true;
    },
    showOrgHolderWinClose() {
      this.holderParams={};
      this.showOrgHolderWin = false;
    },
    handleClose() {
      this.$emit("stdCreationDetailClose", "");
    },
   listExport() {
          this.excelParam = 'stdCreationBillExport';
          this.rows = this.$refs.billDatagrid.total;
          this.tempShowExcelTemplateWin = true;
      },
      showExcelTemplateWinClose() {
          this.tempShowExcelTemplateWin = false;
      },
      tempShowExcelTemplateWinOpen() {
          this.excelParam = 'stdCreationBillExport';
          this.rows = this.$refs.billDatagrid.total;
          this.tempShowExcelTemplateWin = true;
      },
      exportTable(field, exportType) {
          let url = window.LOCAL_CONFIG.API_HOME + "/bs/corpstdbill/creation/stdCreationTrackQuery/func_exportStdBillExcle";
          let options = {};
          if (this.$refs.billDatagrid.selectIds.length !== 0) {
              options.params = {
                  ids: this.$refs.billDatagrid.selectIds,
                  batchId: this.batchId
              };
              options.pageSize = this.$refs.billDatagrid.selectIds.length;
          } else {
              options.params ={batchId: this.batchId};
              options.pageSize = this.$refs.billDatagrid.total;
          }
          exportList(this, this.excelParam, field, exportType, url, options);
      },
    custFeeList(){
      this.feeDetailParams.batchId = this.batchId
      this.stdCreationFeeDetailWin = true;
    },

    stdCreationFeeDetailWinClose() {
      this.stdCreationFeeDetailWin = false;
      let pageNo = this.$refs.datagrid.pageInfo.pageNo;
      this.handleSearch(pageNo);
      this.feeDetailParams = {};
    },
    billInfoWinClose(){
      this.billId=null;
      this.billNo=null;
      this.listId=null;
      this.showBillInfoWin=false;
    },
    billInfoWinOpen(billId,billNo,listId){
      this.billId=billId;
      this.billNo=billNo;
      this.listId=listId;
      this.showBillInfoWin=true;
    },
  }
};
</script>

<style scoped>

</style>
