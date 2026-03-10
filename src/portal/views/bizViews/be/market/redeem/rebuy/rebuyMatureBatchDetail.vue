                                          <!-- 返售申请-修改单申请-批次明细回显 -->
<template>
  <div>
    <!--输入表单-->
    <h-form :model="editForm" :label-width="115" ref="editForm" cols="3" class="h-form-search" onlyBlurRequire>
      <h-form-item :label="$t('m.i.common.busiType')" prop="busiType">
        <h-select v-model="editForm.busiType" readonly>
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
      <h-form-item :label="$t('m.i.be.brchName')" prop="buyBrchName">
        <h-input v-model="editForm.buyBrchName" readonly></h-input>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.custBrchCode')" prop="saleBrchCode">
        <h-input v-model="editForm.saleBrchCode" readonly></h-input>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.otherBrchName')" prop="saleBrchName">
        <h-input v-model="editForm.saleBrchName" readonly></h-input>
      </h-form-item>
      <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType">
        <h-select v-model="editForm.billType" readonly>
          <h-option v-for="item in dictList.billTypeList" :value="item.key" :key="item.key">{{item.value }}</h-option>
        </h-select>
      </h-form-item>
      <h-form-item :label="$t('m.i.billInfo.billClass')" prop="billClass">
        <h-select v-model="editForm.billClass" readonly>
          <h-option v-for="item in dictList.billClassList" :value="item.key" :key="item.key">{{item.value }}</h-option>
        </h-select>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.orginDueSettleDt')" prop="dueSettleDt" >
        <h-date-picker v-model="editForm.dueSettleDt" showFormat readonly></h-date-picker>
      </h-form-item>
      <h-form-item :label="$t('m.i.common.applDt')" prop="applDt" >
        <h-date-picker v-model="editForm.applDt" showFormat readonly></h-date-picker>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.redeemType')" prop="redeemType" >
        <h-select v-model="editForm.redeemType" readonly>
          <h-option v-for="item in dictList.redeemTypeList" :value="item.key" :key="item.key">{{item.value }}</h-option>
        </h-select>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.orginRate')" prop="ratePct">
        <h-input v-model="editForm.ratePct" readonly></h-input>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.redeemRate')" prop="dueRatePct" :required="true" :validRules="dueRateRule" >
        <h-input v-model="editForm.dueRatePct" placeholder="利率范围0~100，且小数位不超过四位" @on-change="changeDueRate"></h-input>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.redeemReason')" prop="redeemReason" :required="true" v-if="editForm.redeemType === 'BBT01'">
        <h-select v-model="editForm.redeemReason">
          <h-option v-for="item in dictList.redeemReasonList" :value="item.key" :key="item.key">{{item.value }}</h-option>
        </h-select>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.orginTotalAmt')" prop="totalAmt">
        <h-typefield v-model="editForm.totalAmt" readonly></h-typefield>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.orginBuyBackTotalAmt')" prop="buyBackTotalAmt">
        <h-typefield v-model="editForm.buyBackTotalAmt" readonly></h-typefield>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.orginTotalNum')" prop="totalNum">
        <h-input v-model="editForm.totalNum" readonly></h-input>
      </h-form-item>
      <h-form-item :label="$t('m.i.common.totalAmtBillPackage')" prop="redeemSumAmt">
        <h-typefield v-model="editForm.redeemSumAmt" readonly></h-typefield>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.redeemSumBuyTotalAmt')" prop="redeemSumBuyTotalAmt">
        <h-typefield v-model="editForm.redeemSumBuyTotalAmt" readonly></h-typefield>
      </h-form-item>
      <h-form-item :label="$t('m.i.common.totalNumBillPackage')" prop="redeemSumNum">
        <h-input v-model="editForm.redeemSumNum" readonly></h-input>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.trialInterest')" prop="dueInterest">
        <h-typefield v-model="editForm.dueInterest" readonly></h-typefield>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.trialDueInterest')" prop="dueSettleAmt">
        <h-typefield v-model="editForm.dueSettleAmt" readonly></h-typefield>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.duePayInterest')" prop="duePayInterest">
        <h-typefield v-model="editForm.duePayInterest" readonly></h-typefield>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.duePayAmt')" prop="duePayAmt">
        <h-typefield v-model="editForm.duePayAmt" readonly></h-typefield>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.reqDealOpin')" :required="true" prop="reqDealOpin" :validRules="reqDealOpinRule">
        <h-input type="textarea" :rows=3 v-model="editForm.reqDealOpin"  :canResize="false" :maxlength="300"></h-input>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.reqRemark')" prop="reqRemark" class="h-form-height-auto" :validRules="reqRemarkRule">
        <h-input type="textarea" :rows=3 v-model="editForm.reqRemark"  :canResize="false" :maxlength="300"></h-input>
      </h-form-item>
      <h-form-item>
        <h-button type="primary" @click="formSave()">{{$t('m.i.common.save')}}</h-button>
      </h-form-item>
    </h-form>
    <show-bank-cust-acct :showBankCustAcctWin="showBankCustAcctWin" @getBankCustAcct="getBankCustAcct"
                         @showBankCustAcctWinClose="showBankCustAcctWinClose" :rcvBranchCode="editForm.saleBrchCode" accountType="2"></show-bank-cust-acct>
  </div>
</template>

<script>
  export default {
    name: "rebuyMatureBatchDetail",
    components: {
      ShowBankCustAcct:()=>import(/* webpackChunkName: "bm/cust/bankCustAcct/showBankCustAcct" */`@/views/bizViews/bm/cust/bankCustAcct/showBankCustAcct`)
    },
    data() {
      return {
        dueRateRule : [{ test: this.validateDueRate, trigger: "blur" }],
        showBankCustAcctWin : false,
        reqDealOpinRule: [{ test: this.validateReqDealOpin, trigger: "blur" }],
        reqRemarkRule: [{ test: this.validateReqRemark, trigger: "blur" }],
      }
    },
    props: {
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
      validateReqDealOpin(rule, value, callback) {
        if(value){
          if(value.length>150){
            callback(new Error("发起方处理意见长度不能超过150个字符"));
          }else{
            callback();
          }
        }else{
          callback();
        }
      },
      validateReqRemark(rule, value, callback) {
        if(value){
          if(value.length>150){
            callback(new Error("申请备注长度不能超过150个字符"));
          }else{
            callback();
          }
        }else{
          callback();
        }
      },
      validateDueRate(rule, val, callback) {
        let re = /^(0|([1-9]{1}[0-9]{0,1})|(100))(\.\d{0,4})?$/;
        if (re.test(val)) {
          callback();
        } else {
          let msg = "利率范围:[" + this.editForm.minDueRate + "~" + this.editForm.maxDueRate + "]";
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
      queryDrweAcctName(){
        this.showBankCustAcctWin = true;
      },
      getBankCustAcct(info){
        this.editForm.drweAcctNo = info.acctNo;
        this.editForm.drweName = info.acctName;
        this.editForm.drweBankNo = info.openBankNo;
        this.editForm.drweBankName = info.openBrchName;
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
