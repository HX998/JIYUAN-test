<!--创设业务 费用收取--->
<template>
  <div>
    <h-msg-box v-model="tempStdPaymentConfirmApplyWin" :maximize="true" :mask-closable="false" @on-close="handleClose"
               width="1000" class="h-form-search-layer" >
      <p slot="header">
        <span>兑付申请详情</span>
      </p>
      <div>
        <h-form :model="paymentApplyForm" :label-width="115" ref="paymentApplyForm" cols="3" class="h-form-search">
          <std-creation-payment-form-item :paymentForm="paymentApplyForm" :batchParams="batchParams"></std-creation-payment-form-item>
        </h-form>

        <!--数据展示表格-->
        <h-datagrid
          :columns="columns"
          highlight-row
          :auto-load="false"
          url="/bs/corpstdbill/payment/stdPayment/func_queryStdCreationBillChangePayStatus"
          :bindForm="dataGridFormItem"
          :has-select="false"
          ref="datagrid">
          <div slot="toolbar" class="pull-left">
            <h-button type="primary"  @click="commit()"  >{{$t('m.i.common.submit')}}</h-button>
          </div>
        </h-datagrid>
      </div>
      <div slot="footer">
      </div>
    </h-msg-box>
    <bill-info-main-std @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="billId" :billNo="billNo" :listId="listId"></bill-info-main-std>
  </div>
</template>

<script>
  import { post, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "stdPaymentConfirmApply",
    components: {
      StdCreationPaymentFormItem: () => import(/* webpackChunkName: "bs/corpstdbill/payment/stdCreationPaymentFormItem" */"@/views/bizViews/bs/corpstdbill/payment/stdCreationPaymentFormItem")
    },
    data() {
      return {
        batchId: "",
        paymentApplyForm: {
          id:"",
          legalNo:"",
          memberId:"",
          batchNo:"",
          dpstId:"",
          flowStatus:"",
          prodNo:"",
          prodName:"",
          collectMode: "",
          calFeeType: "",
          feeControlMode: "",
          feeRate: "",
          totalFeeAmt:"",
          totalSettleAmt:"",
          baseAssetType:"",
          billType:"",
          billClass:"",
          stdProductName:"",
          stdProductShortName:"",
          stdProductNo:"",
          ecdsAcctNo:"",
          ecdsAcctName:"",
          dpstOrgCode:"",
          dpstBrchName:"",
          dpstBankNo:"",
          dpstBrchCode:"",
          sellBrchName:"",
          preBeginDueDt:"",
          preEndDueDt:"",
          publishDt:"",
          declareEndDt:"",
          declareEndTm:"",
          purchaseDt:"",
          raiseDt:"",
          paymentDt:"",
          transPlace:"",
          declareEndDtTm:"",
          feeAcctBrchNo:"",
          interestStatus:"",
          purchaseResult:"",
          financeRatePct:"",
          creationAmt:"",
          creationTerm:"",
          creationNum:"",
          currPaymentAmt:"",
          currPaymentAmtStr:"",
          hisPaymentAmt:"",
          dueRecoverSumAmt:"",
          dueRecoverSumAmtStr:"",
          notRecoverSumAmt:"",
          paymentStatus:"",
          cashStatus:"",
          currPaymentDt:"",
          isAllPayment:""
        },
        dataGridFormItem: {
          id: ""
        },
        param : {},
        columns: [
          {
            type: "index",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center"
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
            title: this.$t('m.i.bs.paymentStatus'),
            key: 'payStatus',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.formatPayStatus(params.row.payStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
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
          }
        ],
        showBillInfoWin: false,
        billId: "",
        billNo: "",
        listId:""
      };
    },
    props: {
      stdPaymentConfirmApplyWin: {
        type: Boolean,
        default: false
      },
      batchParams: {
        type: Object,
        default: {}
      },
      dictMap: { //CorpScale,Industry,partnerType,Yon
        type: Map
      },
    },
    watch: {
      stdPaymentConfirmApplyWin(val) {
        if (val) {
          this.$nextTick(() => {
            this.batchId = this.batchParams.batchId;
            this.dataGridFormItem.id = this.batchParams.batchId;
            this.queryObjById();
            this.$refs.datagrid.dataChange(1);
          });
        }
      },
      batchId(val) {
        this.batchId = val;
      }
    },
    computed: {
      tempStdPaymentConfirmApplyWin: {
        get() {
          return this.stdPaymentConfirmApplyWin;
        },
        set() {
        }
      }
    },
    methods: {
      //根据批次Id查询批次信息
      queryObjById() {
        let params = { id: this.batchId };
        let url = "/bs/corpstdbill/payment/stdPayment/func_jumpStdPaymentConfirm";
        post(params, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let obj = res.data.retData;
              this.paymentApplyForm.id = obj.id;
              this.paymentApplyForm.legalNo = obj.legalNo;
              this.paymentApplyForm.memberId = obj.memberId;
              this.paymentApplyForm.batchNo = obj.batchNo;
              this.paymentApplyForm.dpstId = obj.dpstId;
              this.paymentApplyForm.flowStatus = obj.flowStatus;
              this.paymentApplyForm.prodNo = obj.prodNo;
              this.paymentApplyForm.prodName = obj.prodName;
              this.paymentApplyForm.collectMode = obj.collectMode;
              this.paymentApplyForm.calFeeType = obj.calFeeType;
              this.paymentApplyForm.feeControlMode = obj.feeControlMode;
              this.paymentApplyForm.feeRate = obj.feeRate;
              this.paymentApplyForm.baseAssetType = obj.baseAssetType;
              this.paymentApplyForm.billType = obj.billType;
              this.paymentApplyForm.billClass = obj.billClass;
              this.paymentApplyForm.totalFeeAmt = formatNumber(obj.totalFeeAmt, 2, ',');
              this.paymentApplyForm.totalSettleAmt = formatNumber(obj.totalSettleAmt, 2, ',');
              this.paymentApplyForm.isAllPayment = obj.isAllPayment;
              this.paymentApplyForm.feeAcctBrchNo = obj.feeAcctBrchNo;
              this.paymentApplyForm.interestStatus = obj.interestStatus;
              this.paymentApplyForm.financeRatePct = obj.financeRatePct;
              this.paymentApplyForm.creationAmt = formatNumber(obj.creationAmt, 2, ',');
              this.paymentApplyForm.creationTerm = obj.creationTerm;
              this.paymentApplyForm.creationNum = obj.creationNum;
              this.paymentApplyForm.purchaseResult = obj.purchaseResult;
              this.paymentApplyForm.currPaymentAmtStr = formatNumber(obj.currPaymentAmt, 2, ',');
              this.paymentApplyForm.currPaymentAmt = obj.currPaymentAmt;
              this.paymentApplyForm.currPaymentDt = obj.currPaymentDt=== null ? "" : obj.currPaymentDt.toString();
              this.paymentApplyForm.hisPaymentAmt = formatNumber(obj.hisPaymentAmt, 2, ',');
              this.paymentApplyForm.dueRecoverSumAmtStr = formatNumber(obj.dueRecoverSumAmt, 2, ',');
              this.paymentApplyForm.dueRecoverSumAmt = obj.dueRecoverSumAmt;
              this.paymentApplyForm.notRecoverSumAmt = formatNumber(obj.notRecoverSumAmt, 2, ',');
              this.paymentApplyForm.cashStatus = obj.cashStatus;
              if (obj.stdProductName){
                this.paymentApplyForm.stdProductName = obj.stdProductName;
              }
              if (obj.stdProductShortName){
                this.paymentApplyForm.stdProductShortName = obj.stdProductShortName;
              }
              if (obj.stdProductNo){
                this.paymentApplyForm.stdProductNo = obj.stdProductNo;
              }
              if (obj.ecdsAcctNo){
                this.paymentApplyForm.ecdsAcctNo = obj.ecdsAcctNo;
              }
              this.paymentApplyForm.ecdsAcctName = obj.ecdsAcctName;
              this.paymentApplyForm.dpstOrgCode = obj.dpstOrgCode;
              this.paymentApplyForm.dpstBrchName = obj.dpstBrchName;
              this.paymentApplyForm.dpstBankNo = obj.dpstBankNo;
              this.paymentApplyForm.dpstBrchCode = obj.dpstBrchCode;
              this.paymentApplyForm.sellBrchName = obj.sellBrchName;
              if (obj.creationMaxAmt){
                this.paymentApplyForm.creationMaxAmt = obj.creationMaxAmt===null?"":obj.creationMaxAmt.toString();
              }
              if(obj.creationMaxTerm){
                this.paymentApplyForm.creationMaxTerm = obj.creationMaxTerm;
              }
              this.paymentApplyForm.financeMaxRate = obj.financeMaxRate;
              this.paymentApplyForm.financeMinRate = obj.financeMinRate;
              this.paymentApplyForm.financeMaxRatePct = obj.financeMaxRatePct;
              this.paymentApplyForm.financeMinRatePct = obj.financeMinRatePct;
              this.paymentApplyForm.preBeginDueDt = obj.preBeginDueDt=== null ? "" : obj.preBeginDueDt.toString();
              this.paymentApplyForm.preEndDueDt = obj.preEndDueDt=== null ? "" : obj.preEndDueDt.toString();
              this.paymentApplyForm.publishDt = obj.publishDt=== null ? "" : obj.publishDt.toString();
              this.paymentApplyForm.declareEndDt = obj.declareEndDt=== null ? "" : obj.declareEndDt.toString();
              this.paymentApplyForm.declareEndTm = obj.declareEndTm;
              if(this.paymentApplyForm.declareEndDt){
                if(this.paymentApplyForm.declareEndTm){
                  let declareEndTm= new String(this.paymentApplyForm.declareEndTm);
                  while (declareEndTm.length<6){
                    declareEndTm="0"+declareEndTm;
                  }
                  this.paymentApplyForm.declareEndDtTm=this.paymentApplyForm.declareEndDt+declareEndTm;
                }else{
                  this.paymentApplyForm.declareEndDtTm=this.paymentApplyForm.declareEndDt+"000000";
                }
              };
              this.paymentApplyForm.purchaseDt = obj.purchaseDt=== null ? "" : obj.purchaseDt.toString();
              this.paymentApplyForm.raiseDt = obj.raiseDt=== null ? "" : obj.raiseDt.toString();
              this.paymentApplyForm.paymentDt = obj.paymentDt=== null ? "" : obj.paymentDt.toString();
              this.paymentApplyForm.transPlace = obj.transPlace;
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //提交
      commit(){
        if (this.paymentApplyForm.isAllPayment === "0") {
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: this.$t("当前标票基础资产仍有部分未到期，是否仅兑付部分金额") + "?",
            onOk: () => {
              if(this.batchId) {
                let id = this.batchId;
                let currPaymentAmt = this.paymentApplyForm.currPaymentAmt;
                let dueRecoverSumAmt = this.paymentApplyForm.dueRecoverSumAmt;
                let cashStatus = this.paymentApplyForm.cashStatus;
                let url = "/bs/corpstdbill/payment/stdPayment/func_commitStdPaymentConfirm";
                post({ id: id, currPaymentAmt:currPaymentAmt,dueRecoverSumAmt:dueRecoverSumAmt,cashStatus:cashStatus}, url).then(res => {
                  if (res) {
                    let retCode = res.data.retCode
                    if (retCode == "000000") {
                      this.$msgTip.success(this);
                      this.handleClose();
                    } else {
                      this.$msgTip.error(this, { info: res.data.retMsg });
                    }
                  } else {
                    this.$msgTip.error(this, { info: this.$t('m.i.common.netError') });
                  }
                });
              }
            }
          });
        }else{
          if(this.batchId) {
            let id = this.batchId;
            let currPaymentAmt = this.paymentApplyForm.currPaymentAmt;
            let dueRecoverSumAmt = this.paymentApplyForm.dueRecoverSumAmt;
            let cashStatus = this.paymentApplyForm.cashStatus;
            let url = "/bs/corpstdbill/payment/stdPayment/func_commitStdPaymentConfirm";
            post({ id: id, currPaymentAmt:currPaymentAmt,dueRecoverSumAmt:dueRecoverSumAmt,cashStatus:cashStatus}, url).then(res => {
              if (res) {
                let retCode = res.data.retCode
                if (retCode == "000000") {
                  this.$msgTip.success(this);
                  this.handleClose();
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t('m.i.common.netError') });
              }
            });
          }
        }
      },
      //关闭弹窗
      handleClose() {
        this.$refs.paymentApplyForm.resetFields();
        this.paymentApplyForm.id = "";
        this.batchId="";
        this.$emit("stdPaymentConfirmApplyWinClose", "");
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
      //格式化标票明细兑付状态
      formatPayStatus(payStatus){
        let payStatusValue = "未兑付";
        if("1" == payStatus){
          payStatusValue = "兑付中";
        }else if("2" == payStatus){
          payStatusValue = "已兑付";
        }
        return payStatusValue;
      }
    }
  };
</script>

<style scoped>

</style>
