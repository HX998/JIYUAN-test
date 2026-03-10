<template>
  <div>
    <h-msg-box v-model="showFeeAdjustWin" width="460" :mask-closable="false" @on-close="handleClose" top="150"
               class="h-form-search-layer" :maximize="true">
      <p slot="header">
        <span>{{ $t("m.i.ce.feeAdjust") }}</span>
      </p>
      <h-form :model="feeForm" ref="feeForm" :label-width="150" class="h-form-search" cols="1">
        <h-form-item prop="feeRate" :label="$t('m.i.ce.feeRate')" required :validRules="ratePctRule">
          <h-typefield  placeholder="费率范围0~10000" type="money" v-model="feeForm.feeRate" @on-blur="feeRateChange"></h-typefield>
        </h-form-item>
        <h-form-item prop="feeAmt" required  :label="$t('m.i.ce.feeAmt')" v-show="!isBatch">
          <h-typefield type="money" v-model="feeForm.feeAmt"  placeholder="" @on-blur="feeAmtChange"></h-typefield>
        </h-form-item>
        <h-form-item prop="minFeeLimit" :label="$t('m.i.ce.minFeeLimit')+'：'" v-if="isBatch">
          <h-radio-group v-model="feeForm.minFeeLimit">
            <h-radio label="1">
              <span>是</span>
            </h-radio>
            <h-radio label="0">
              <span>否</span>
            </h-radio>
          </h-radio-group>
        </h-form-item>
        <h-form-item prop="minFeeAmt" v-if="isBatch">
          <span>{{ this.minFeeAmtStr }}</span>
        </h-form-item>
      </h-form>
      <div slot="footer">
        <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" @click="submitForm">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>
  </div>
</template>

<script>
  import { post, on, off, accMul, accDiv, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "acptFeeAdjustWin",
    data() {
      return {
        minFeeAmtStr : "",
        ratePctRule :[{
          test: /^(\d{1,4}(\.\d{1,2})?|10000)$/,
          trigger: "blur",
          message: "利率范围0~10000，且小数位不超过两位"
        }],
      };
    },
    props: {
      feeAdjustWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      feeForm : {
        billMoney : "",
        feeRate : "",
        feeAmt : "",
        minFeeLimit : '0',
        minFeeAmt : "",
        billClass: 'ME02',
        curFuncNo: 'PICE010302',
      },
      isBatch : {
        type: Boolean,
        default() {
          return false;
        }
      }
    },
    watch: {
     feeAdjustWin(val) {
        if (val === true && this.isBatch) {
          this.findBUsinessParameter();
        }
      },
     /* 'feeForm.feeRate'(val){
        if (!this.isBatch && !isNaN(parseFloat(this.feeForm.feeRate)) && isFinite(this.feeForm.feeRate)) {
          this.feeAmt = accMul(this.feeForm.billMoney,accDiv(this.feeForm.feeRate, 10000));
          this.feeForm.feeAmt = this.feeAmt;
        }
      },
      'feeForm.feeAmt' (val){
       if (!this.isBatch && !isNaN(parseFloat(this.feeForm.feeAmt)) && isFinite(this.feeForm.feeAmt)) {
         this.feeRate = accMul(accDiv(this.feeForm.feeAmt,this.feeForm.billMoney),10000);
         console.log(this.feeRate);
         this.feeForm.feeRate = this.feeRate;
       }
     },*/
  },
    computed: {
      showFeeAdjustWin: {
        get() {
          return this.feeAdjustWin;
        },
        set() {
        }
      },
    },
    created() {
    },
    methods: {
      feeRateChange(){
        if (!isNaN(parseFloat(this.feeForm.feeRate)) && isFinite(this.feeForm.feeRate)) {
          this.feeForm.feeAmt = accMul(this.feeForm.billMoney,accDiv(this.feeForm.feeRate, 10000)).toFixed(2);
        }
      },
      feeAmtChange(){
        if (!isNaN(parseFloat(this.feeForm.feeAmt)) && isFinite(this.feeForm.feeAmt)) {
          this.feeForm.feeRate = accMul(accDiv(this.feeForm.feeAmt,this.feeForm.billMoney),10000).toFixed(2);
        }
      },
      findBUsinessParameter(){
        //查询业务参数
        post({ paramKey: "ce.acpt.acpt_acct_min_fee_amt" }, "/sm/auth/findArraySystemParameter").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let minFeeAmt = res.data.retData[0];
              this.feeForm.minFeeAmt = (minFeeAmt === "" || minFeeAmt === null || minFeeAmt === undefined) ? "0" : minFeeAmt;
              this.minFeeAmtStr = "(最低手续费金额："+ this.feeForm.minFeeAmt + "元)";
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      handleClose() {
        this.$refs.feeForm.resetFields();
        this.$emit("feeAdjustWinClose", "");
      },
      submitForm (){
        this.$refs["feeForm"].validate(valid => {
          if (!valid) {
            return;
          }
          this.$emit("feeAdjustWinSubmit", "");
          this.$refs.feeForm.resetFields();
        })
      },
    },
  };
</script>

<style scoped>

</style>
