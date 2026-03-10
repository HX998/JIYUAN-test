<!-- 回购到期-修改单申请-批次明细回显 -->
<template>
  <div>
    <!--输入表单-->
    <h-form :model="editForm" :label-width="115" ref="editForm" cols="3" class="h-form-search" onlyBlurRequire>
      <h-form-item :label="$t('m.i.common.busiType')" prop="busiType" >
        <h-select v-model="editForm.busiType" readonly showTitle>
          <h-option v-for="item in dictList.busiTypeList" :value="item.key" :key="item.value">{{ item.value }}
          </h-option>
        </h-select>
      </h-form-item>
      <h-form-item :label="$t('m.i.common.batchNo')" prop="batchNo">
        <h-input v-model="editForm.batchNo" readonly></h-input>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.dealNo')" prop="dealNo">
        <h-input v-model="editForm.dealNo" readonly></h-input>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.brchName')" prop="saleBrchName">
        <h-input v-model="editForm.saleBrchName" readonly></h-input>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.custBrchCode')" prop="buyBrchCode">
        <h-input v-model="editForm.buyBrchCode" readonly></h-input>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.otherBrchName')" prop="buyBrchName">
        <h-input v-model="editForm.buyBrchName" readonly></h-input>
      </h-form-item>
      <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType">
        <h-select v-model="editForm.billType" readonly showTitle>
          <h-option v-for="item in dictList.billTypeList" :value="item.key" :key="item.key">{{item.value }}</h-option>
        </h-select>
      </h-form-item>
      <h-form-item :label="$t('m.i.billInfo.billClass')" prop="billClass" >
        <h-select v-model="editForm.billClass" readonly showTitle>
          <h-option v-for="item in dictList.billClassList" :value="item.key" :key="item.key">{{item.value }}</h-option>
        </h-select>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.settleMode')" prop="settleMode" required class="h-form-three">
        <h-select v-model="editForm.settleMode" readonly placeholder=""  showTitle>
          <h-option v-for="item in dictList.settleTypeList" :value="item.key" :key="item.key">{{item.value }}</h-option>
        </h-select>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.orginDueSettleDt')" prop="dueSettleDt">
        <h-date-picker v-model="editForm.dueSettleDt" showFormat readonly></h-date-picker>
      </h-form-item>
      <h-form-item :label="$t('m.i.common.applDt')" prop="applDt">
        <h-date-picker v-model="editForm.applDt" showFormat readonly></h-date-picker>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.redeemType')" prop="redeemType">
        <h-select v-model="editForm.redeemType" readonly showTitle>
          <h-option v-for="item in dictList.redeemTypeList" :value="item.key" :key="item.key">{{item.value }}</h-option>
        </h-select>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.orginRate')" prop="ratePct">
        <h-input v-model="editForm.ratePct" readonly></h-input>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.redeemRate')" prop="dueRatePct" :required="true" :validRules="dueRateRule" >
        <h-input v-model="editForm.dueRatePct" :placeholder="dueRatePlace" @on-change="changeDueRate" :readonly="editForm.settleMode=='ST01'"></h-input>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.redeemReason')" prop="redeemReason" v-if="editForm.redeemType === 'BBT01' && editForm.busiType === 'BT02'">
        <h-select v-model="editForm.redeemReason" readonly showTitle>
          <h-option v-for="item in dictList.redeemReasonList" :value="item.key" :key="item.key">{{item.value }}</h-option>
        </h-select>
      </h-form-item>
      <h-form-item :label="$t('m.i.billInfo.pyeeAcctNo')" prop="pyeeAcctNo" v-if="isShowPyeeInfo==='1'">
        <h-input v-model="editForm.pyeeAcctNo" readonly icon="android-search" @on-click="queryPyeeAcctNoName"></h-input>
      </h-form-item>
      <h-form-item :label="$t('m.i.billInfo.pyeeName')" prop="pyeeName" v-if="isShowPyeeInfo==='1'">
        <h-input v-model="editForm.pyeeName" readonly></h-input>
      </h-form-item>
      <h-form-item :label="$t('m.i.billInfo.pyeeBankNo')" prop="pyeeBankNo" v-if="isShowPyeeInfo==='1'">
        <h-input v-model="editForm.pyeeBankNo" readonly></h-input>
      </h-form-item>
      <h-form-item :label="$t('m.i.billInfo.pyeeBankName')" prop="pyeeBankName" v-if="isShowPyeeInfo==='1'">
        <h-input v-model="editForm.pyeeBankName" readonly></h-input>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.orginTotalAmt')" prop="totalAmt">
        <h-typefield v-model="editForm.totalAmt" placeholder="" readonly></h-typefield>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.orginBuyBackTotalAmt')" prop="buyBackTotalAmt">
        <h-typefield v-model="editForm.buyBackTotalAmt" placeholder="" readonly></h-typefield>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.orginTotalNum')" prop="totalNum">
        <h-input v-model="editForm.totalNum" readonly></h-input>
      </h-form-item>
      <h-form-item :label="$t('m.i.common.totalAmtBillPackage')" prop="redeemSumAmt">
        <h-typefield v-model="editForm.redeemSumAmt" placeholder="" readonly></h-typefield>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.redeemSumBuyTotalAmt')" prop="redeemSumBuyTotalAmt">
        <h-typefield v-model="editForm.redeemSumBuyTotalAmt" placeholder="" readonly></h-typefield>
      </h-form-item>
      <h-form-item :label="$t('m.i.common.totalNumBillPackage')" prop="redeemSumNum">
        <h-input v-model="editForm.redeemSumNum" readonly></h-input>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.trialInterest')" prop="dueInterest">
        <h-typefield v-model="editForm.dueInterest" placeholder="" readonly></h-typefield>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.trialDueInterest')" prop="dueSettleAmt">
        <h-typefield v-model="editForm.dueSettleAmt" placeholder="" readonly></h-typefield>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.duePayInterest')" prop="duePayInterest">
        <h-typefield v-model="editForm.duePayInterest" placeholder="" readonly></h-typefield>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.duePayAmt')" prop="duePayAmt">
        <h-typefield v-model="editForm.duePayAmt" placeholder="" readonly></h-typefield>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.reqDealOpin')" prop="reqDealOpin" class="h-form-height-auto">
        <h-input type="textarea" :rows=2 v-model="editForm.reqDealOpin" readonly :canResize="false"></h-input>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.reqRemark')" prop="reqRemark" class="h-form-height-auto">
        <h-input type="textarea" :rows=2 v-model="editForm.reqRemark" readonly :canResize="false"></h-input>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.sgnOpin')" prop="sgnOpin" class="h-form-height-auto" :required="true" :validRules="sgnOpinRule">
        <h-input type="textarea" :rows=2 v-model="editForm.sgnOpin" :canResize="false" :maxlength="300"></h-input>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.respRemark')" prop="respRemark" class="h-form-height-auto" :validRules="respRemarkRule">
        <h-input type="textarea" :rows=2 v-model="editForm.respRemark" :canResize="false" :maxlength="300"></h-input>
      </h-form-item>
      <h-form-item>
        <h-button type="primary" @click="formSave()">{{$t('m.i.common.save')}}</h-button>
      </h-form-item>
    </h-form>
    <show-bank-cust-acct :showBankCustAcctWin="showBankCustAcctWin" @getBankCustAcct="getBankCustAcct"
      @showBankCustAcctWinClose="showBankCustAcctWinClose" :rcvBranchCode="editForm.buyBrchCode" accountType="2"></show-bank-cust-acct>
  </div>
</template>

<script>
  export default {
    name: "saleMatureBatchDetail",
    components: {
      ShowBankCustAcct:()=>import(/* webpackChunkName: "bm/cust/bankCustAcct/showBankCustAcct" */`@/views/bizViews/bm/cust/bankCustAcct/showBankCustAcct`)
    },
    data() {
      return {
      dueRateRule : [{ test: this.validateDueRate, trigger: "blur" }],
      showBankCustAcctWin : false,
      sgnOpinRule: [{ test: this.validateSgnOpin, trigger: "blur" }],
      respRemarkRule: [{ test: this.validateRespRemark, trigger: "blur" }],
      }
    },
    props: {
      isShowPyeeInfo:{
        type:String,
        default:"1",
      },
      editForm: {
        type: Object,
        default: {}
      },
      dictList: {
        type: Object,
        default: {
          busiTypeList: "",
          billTypeList: "",
          billClassList: "",
          redeemTypeList: ""
        }
      }
    },
    computed: {
      dueRatePlace() {
        return "利率范围:[" + this.editForm.minDueRate + "~" + this.editForm.maxDueRate + "]";
      }
    },
    methods: {
      validateSgnOpin(rule, value, callback) {
        if(value){
          if(value.length>150){
            callback(new Error("应答方处理意见长度不能超过150个字符"));
          }else{
            callback();
          }
        }else{
          callback();
        }
      },
      validateRespRemark(rule, value, callback) {
        if(value){
          if(value.length>150){
            callback(new Error("应答备注长度不能超过150个字符"));
          }else{
            callback();
          }
        }else{
          callback();
        }
      },
      validateDueRate(rule, val, callback) {
        let re = /^(0|([1-9]{1}[0-9]{0,1})|(100))(\.\d{0,4})?$/;
        let msg = "利率范围:[" + this.editForm.minDueRate + "~" + this.editForm.maxDueRate + "]";
        if (re.test(val)) {
          if (Number(val) < Number(this.editForm.minDueRate) || Number(val) > Number(this.editForm.maxDueRate)) {
            callback(new Error(msg));
          } else {
            callback();
          }
        } else {
         callback(new Error(msg));
        }
      },
      formSave() {
        this.$hMsgBox.confirm({
          title: "保存",
          content: "确定要保存吗？",
          onOk: () => {
            this.$refs["editForm"].validate(valid => {
              if (valid) {
                this.$emit("batchDetailSubmit", this.editForm, "save");
              }
            });
          }
        });
      },
      queryPyeeAcctNoName(){
        this.showBankCustAcctWin = true;
      },
      getBankCustAcct(info){
        this.editForm.pyeeAcctNo = info.acctNo;
        this.editForm.pyeeName = info.acctName;
        this.editForm.pyeeBankNo = info.openBankNo;
        this.editForm.pyeeBankName = info.openBankName;
        this.showBankCustAcctWin = false;
      },
      showBankCustAcctWinClose(){
        this.showBankCustAcctWin = false;
      },
      changeDueRate(){
        this.$emit("changeDueRate", this.editForm.dueRatePct);
      }
    }
  };
</script>

<style scoped>

</style>
