<template>
  <div style="display:inline">
    <h-button type="primary" @click="showPaymentFlowInfo()">{{$t("s.i.pay.details")}}</h-button>
    <payment-flow-detail :paymentFlowDetailWin="paymentFlowDetailWin" :isView="isView"
                         :showFullBillInfo="showFullBillInfo" :showBill="showBill"
                         @paymentFlowDetailWinClose="paymentFlowDetailWinClose" :param="param"></payment-flow-detail>
  </div>
</template>

<script>
  export default {
    name: "showPaymentFlow",
    components: {
      PaymentFlowDetail: () => import(/* webpackChunkName: "bopp-pay/common/paymentFlowDetail" */`@/views/bizViews/bopp-pay/common/paymentFlowDetail`)
    },
    data() {
      return {
        paymentFlowDetailWin: false,
        param:{
          payInfoId: "",
          queryUrl: "",
        }
      }
    },
    props: {
      isView: {
        type: Boolean,
        default() {
          return false;
        }
      },
      showFullBillInfo: {
        type: Boolean,
        default() {
          return false;
        }
      },
      showBill: {
        type: Boolean,
        default() {
          return false;
        }
      },
    },
    methods: {
      showPaymentFlowInfo(){
        this.$emit("showPaymentFlowInfo","");
      },
      openWindow(payInfoId, url){
        if(payInfoId){
          this.param.queryUrl = url;
          this.param.payInfoId = payInfoId;
          this.paymentFlowDetailWin = true;
        }else{
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
        }
      },
      paymentFlowDetailWinClose(){
        this.paymentFlowDetailWin = false;
      }
    }
  }
</script>

<style scoped>

</style>
