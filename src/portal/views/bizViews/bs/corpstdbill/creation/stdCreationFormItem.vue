<!--创设业务 新增/修改弹窗共用字段-->
<template>
  <div>
    <!--批次号-->
    <common-input v-model="addForm.batchNo" :label="$t('m.i.common.batchNo')" prop="batchNo" :readonly="true"></common-input>
    <!--归集方式-->
    <common-select v-model="addForm.collectMode" :label="$t('m.i.bs.collectMode')"
                   prop="collectMode" :dictList="batchParams.collectModeList"  :required="true"></common-select>
    <!--基础资产种类-->
    <common-select v-model="addForm.baseAssetType" :label="$t('m.i.bs.baseAssetType')"
                   prop="baseAssetType" :dictList="batchParams.baseAssetTypeList"  :required="true"></common-select>
    <!--标票产品名称-->
    <common-input v-model="addForm.stdProductName" :label="$t('m.i.bs.stdProductName')"
                  prop="stdProductName" showIcon :required="true" @on-click="queryProductName" :maxlength="60" ></common-input>
    <!--标票产品简称-->
    <common-input v-model="addForm.stdProductShortName" :label="$t('m.i.bs.stdProductShortName')" prop="stdProductShortName" :required="true" :maxlength="60" lengthByByte></common-input>
    <!--标票产品代码-->
    <common-input v-model="addForm.stdProductNo" :label="$t('m.i.bs.stdProductNo')" prop="stdProductNo"  :required="true" :validRules="stdProductNoRule" :maxlength="9"></common-input>
    <!--电票账号-->
    <common-input v-model="addForm.ecdsAcctNo" :label="$t('m.i.bs.ecdsAcctNo')" prop="ecdsAcctNo"  :required="true" :showIcon="true" @on-click="queryEcdsAcctNo" :maxlength="32" :validRules="validAcctNoRules" readonly></common-input>
    <!--电票账户户名-->
    <common-input v-model="addForm.ecdsAcctName" :label="$t('m.i.bs.ecdsAcctName')" prop="ecdsAcctName" :required="true" :maxlength="60" lengthByByte :validRules="ecdsAcctNameRule" readonly></common-input>
    <!--存托机构名称-->
    <common-input v-model="addForm.dpstBrchName" :label="$t('m.i.bs.dpstBrchName')" prop="dpstBrchName"  :required="true"
                  :readonly="true"></common-input>
    <!--存托机构代码-->
    <common-input v-model="addForm.dpstBrchCode" :label="$t('m.i.bs.dpstBrchCode')" prop="dpstBrchCode"  :required="true"
                  :readonly="true"></common-input>
    <!--承销机构名称-->
    <common-input v-model="addForm.sellBrchName" :label="$t('m.i.bs.sellBrchName')" prop="sellBrchName"  :required="true"
                  :readonly="true"></common-input>
    <!--"融资利率上限(%)-->
    <common-input v-model="addForm.financeMaxRatePct" :label="$t('m.i.bs.financeMaxRatePct')" prop="financeMaxRatePct"
                  :validRules="ratePctRule" :required="true"></common-input>
    <!--融资利率下限(%)-->
    <common-input v-model="addForm.financeMinRatePct" :label="$t('m.i.bs.financeMinRatePct')" prop="financeMinRatePct"
                  :validRules="ratePctRule" :required="true"></common-input>
    <!--披露日期-->
    <common-date-picker v-model="addForm.publishDt" :label="$t('m.i.bs.publishDt')" prop="publishDt"
                        :options="publishDtFilter" :required="true"  @on-change="changePublishDt"></common-date-picker>
    <!--申报截止时间-->
    <common-date-picker v-model="addForm.declareEndDtTm" :label="$t('m.i.bs.declareEndDtTm')" prop="declareEndDtTm" type="datetime"
                        :options="declareEndDtFilter" :required="true" @on-change="changeDeclareEndDtTm"></common-date-picker>
    <!--申购日期-->
    <common-date-picker v-model="addForm.purchaseDt" :label="$t('m.i.bs.purchaseDt')" prop="purchaseDt"
                        :options="purchaseDtFilter" :required="true" @on-change="changePurchaseDt"></common-date-picker>
    <!--缴款日期-->
    <common-date-picker v-model="addForm.raiseDt" :label="$t('m.i.bs.raiseDt')" prop="raiseDt"
                        :options="raiseDtFilter" :required="true" @on-change="changeRaiseDt"></common-date-picker>
    <!--兑付日期-->
    <common-date-picker v-model="addForm.paymentDt" :label="$t('m.i.bs.paymentDt')" prop="paymentDt"
                        :options="paymentDtFilter" :required="true" @on-change="changePaymentDt"></common-date-picker>
    <!--流通场所-->
    <common-select v-model="addForm.transPlace" :label="$t('m.i.bs.transPlace')"
                   prop="transPlace" :dictList="batchParams.transPlaceList"
                   :required="true" readonly></common-select>
    <h-col span="24"><hr></h-col>
    <!--回创设规模上限(万元)-->
    <common-type-field v-model="addForm.creationMaxAmt" :label="$t('m.i.bs.creationMaxAmt')" prop="creationMaxAmt" class="h-form-long-label"
                  :validRules="creationMaxAmtRule" :required="true" :bigTips="false"></common-type-field>
    <!--创设期限上限(天)-->
    <common-input v-model="addForm.creationMaxTerm" :label="$t('m.i.bs.creationMaxTerm')" prop="creationMaxTerm"
                  :required="true"  type="int" :maxlength="3" readonly></common-input>
    <!--基础资产起始到期日(准入)-->
    <common-date-picker v-model="addForm.preBeginDueDt" :label="$t('m.i.bs.preBeginDueDt')" prop="preBeginDueDt" class="h-form-long-label"
                        :options="preBeginDueDtFilter" :required="true" ></common-date-picker>
    <!--基础资产截止到期日(准入)-->
    <common-date-picker v-model="addForm.preEndDueDt" :label="$t('m.i.bs.preEndDueDt')" prop="preEndDueDt" class="h-form-long-label"
                        :options="preEndDueDtFilter" :required="true" ></common-date-picker>
    <h-col span="24"><hr></h-col>
    <!--计费类型-->
    <common-select v-model="addForm.calFeeType" :label="$t('m.i.bs.calFeeType')"
                   prop="calFeeType" :dictList="batchParams.calFeeTypeList" :readonly="addForm.feeControlMode === '1'" :required="true"></common-select>
    <!--费率-->
    <common-input v-model="addForm.feeRatePct" :label="$t('m.i.bs.feeRate')" prop="feeRatePct"
                  :validRules="ratePctRule" v-if="addForm.calFeeType" :readonly="addForm.feeControlMode === '1'" :required="true"></common-input>
    <!--计费类型-->
    <common-select v-model="addForm.sellCalFeeType" :label="$t('m.i.bs.sellCalFeeType')"
                   prop="sellCalFeeType" :dictList="batchParams.calFeeTypeList" v-if="addForm.isSelfSell==='1'" :readonly="addForm.sellFeeControlMode === '1'"  :required="true"></common-select>
    <!--费率-->
    <common-input v-model="addForm.sellFeeRatePct" :label="$t('m.i.bs.sellFeeRate')" prop="sellFeeRatePct"
                  :validRules="ratePctRule" v-if="addForm.sellCalFeeType&&addForm.isSelfSell==='1'" :readonly="addForm.sellFeeControlMode === '1'" :required="true"></common-input>

    <show-cpes-branch :showCpesBranch="cpesProductBranch" @showCpesBranchClose="cpesProductBranchClose"
                      :showMemberId="false" :memberId="memberId" :brchType="productBrchType"
                      @showCpesBranchSubmit="cpesProductBranchSubmit"></show-cpes-branch>
    <!-- 查询客户账号信息弹窗 -->
    <show-std-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" @showCustAcctNoWinClose="showCustAcctNoWinClose"
                       @custAcctNoSelectSubmit="custAcctNoSelectSubmit" :isAllBankAcct=true :isSearch="true"></show-std-cust-acct-no>
  </div>
</template>

<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";
  export default {
    name: "stdCreationFormItem",
    components: {
      ShowCpesBranch:()=>import(/* webpackChunkName: "shcpe/cpes/branch/showCpesBranch" */`@/views/bizViews/shcpe/cpes/branch/showCpesBranch`),
    },
    data() {
      let _this = this;
      return {
        preBeginDueDtFilter: {
          disabledDate (date) {
            let start = _this.$moment(_this.addForm.raiseDt).format("YYYY/MM/DD");
            let end = date.valueOf() - new Date(start).getTime();
            return end <= 0;
          }
        },
        preEndDueDtFilter:{
          disabledDate(date) {
            let start = _this.$moment(_this.addForm.preBeginDueDt).format("YYYY/MM/DD");
            let end = date.valueOf() - new Date(start).getTime();
            let end_2 = _this.$moment(_this.addForm.paymentDt).format("YYYY/MM/DD");
            let start_2 = new Date(end_2).getTime() - date.valueOf();
            return end <= 0 || start_2 < 2;
          }
        },
        publishDtFilter: {
          disabledDate (date) {
            return  _this.$moment(window.sessionStorage.getItem("workDate"), "YYYYMMDD") > date && date.valueOf() ;
          }
        },
        declareEndDtFilter: {
          disabledDate (date) {
            let start = _this.$moment(_this.addForm.publishDt).format("YYYY/MM/DD");
            let end = date.valueOf() - new Date(start).getTime();
            return end <= 0;
          }
        },
        purchaseDtFilter: {
          disabledDate (date) {
            let start = _this.$moment(_this.addForm.declareEndDt).format("YYYY/MM/DD");
            let end = date.valueOf() - new Date(start).getTime();
            return end <= 0;
          }
        },
        raiseDtFilter: {
          disabledDate (date) {
            let start = _this.$moment(_this.addForm.purchaseDt).format("YYYY/MM/DD");
            let end = date.valueOf() - new Date(start).getTime();
            return end <= 0;
          }
        },
        paymentDtFilter: {
          disabledDate (date) {
            let start = _this.$moment(_this.addForm.raiseDt).format("YYYY/MM/DD");
            let end = date.valueOf() - new Date(start).getTime();
            return end <= 0;
          }
        },
        validAcctNoRules: [{
          test: /^[0-9a-zA-Z]{1,32}$/,
          trigger: "blur",
          message: "只能输入数字和字母,且长度最大为32位"
        }],
        ratePctRule: [{
          test: /^(\d{1,2}(\.\d{1,4})?)$/,
          trigger: "blur",
          message: "费率范围0~100(不包括100)，且小数位不超过四位"
        }],
        creationMaxAmtRule:[{
          test: /^(?:[1-9]\d{0,11}|0)(?:\.\d{1,2})?$/,
          trigger: "blur",
          message: "创设规模上限(万元)必须是大于等于0的数字，最多12位整数且小数位不超过两位"
        }],
        ecdsAcctNameRule: [{ test: this.validateEcdsAcctName, trigger: "blur" }],
        sellBrchNameRule: [{ test: this.validateSellBrchNameRule, trigger: "blur" }],
        stdProductNoRule : [{ test: this.validateStdProductNo, trigger: "blur" }],
        memberId: JSON.parse(window.sessionStorage.getItem('userInfo')).memberId,
        productBrchType: "4",//资管非法人产品机构类型
        cpesProductBranch: false,
        showCustAcctNoWin: false,
        isDpst:"1"
      }
    },
    props: {
      addForm: {
        type: Object,
        default() {
          return {};
        }
      },
      batchParams: {
        type: Object,
        default: {}
      }
    },
    methods:{
      validateEcdsAcctName(rule, value, callback) {
        if(value){
          let leg=this.getLength(value);
          if(leg>250){
            callback(new Error("电票账户户名长度不能超过250个字节"));
          }else{
            callback();
          }
        }else{
          callback();
        }
      },
      validateSellBrchNameRule(rule, value, callback){
        if(value){
          let leg=this.getLength(value);
          if(leg>250){
            callback(new Error("承销机构名称长度不能超过250个字节"));
          }else{
            callback();
          }
        }else{
          callback();
        }
      },
      validateStdProductNo(rule, value, callback){
        if(value){
          let leg=this.getLength(value);
          if(leg !== 9){
            callback(new Error("标票产品代码必须是9位数字"));
          }else{
            callback();
          }
        }else{
          callback();
        }
      },
      getLength(val) {
        var str = new String(val);
        var bytesCount = 0;
        for (var i = 0 ,n = str.length; i < n; i++) {
          var c = str.charCodeAt(i);
          if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {
            bytesCount += 1;
          } else {
            bytesCount += 2;
          }
        }
        return bytesCount;
      },
      queryProductName() {
        this.cpesProductBranch = true;
      },
      cpesProductBranchClose() {
        this.cpesProductBranch = false;
      },
      cpesProductBranchSubmit(info) {
        if (info === null) {
          this.$msgTip.error(this, { info: "请先选择记录！" });
          return;
        }
        this.addForm.stdProductNo = info.brchCode;
        this.addForm.stdProductName = info.brchFullNameZh;
        this.addForm.stdProductShortName = info.brchShortNameZh;
        this.cpesProductBranch = false;
      },
      queryEcdsAcctNo(){
        this.showCustAcctNoWin = true;
      },
      showCustAcctNoWinClose(){
        this.showCustAcctNoWin = false;
      },
      custAcctNoSelectSubmit(info) {
        this.addForm.ecdsAcctNo = info.custAcctNo;
        this.addForm.ecdsAcctName = info.acctName;
        this.addForm.ecdsCustNo = info.custNo;
        this.showCustAcctNoWin = false;
      },
      changePublishDt(currVal){
        if (!this.batchParams.isPublishDt) {
          this.batchParams.isPublishDt = true;
          return;
        }
        post({code:this.$moment(currVal, "YYYYMMDD").format('YYYYMMDD')},'/sm/oper/holiday/isHoliday').then(res=>{
          if(res && res.data.retCode==='000000'){
            if(res.data.retData === true){
              this.$msgTip.info(this,{info:'您选择的是节假日，请重新选择！'});
              this.addForm.publishDt='';
            }else{
              this.publishDtAlter(currVal);
            }
          }
        });
      },
      publishDtAlter(currVal){
        let publishDt= this.$moment(currVal, "YYYYMMDD").format("YYYY/MM/DD");
        publishDt = new Date(publishDt);
        let declareEndDTPlus = publishDt.valueOf() + (1 * 24 * 60 * 60 * 1000);
        declareEndDTPlus = new Date(declareEndDTPlus);
        declareEndDTPlus = this.$moment(declareEndDTPlus, "YYYYMMDD").format("YYYYMMDD");
        post({ code: declareEndDTPlus }, "/sm/oper/holiday/getWorkDate").then(res => {
          if (res && res.data.retCode === "000000") {
            let declareEndDT= this.$moment(res.data.retData, "YYYYMMDD").format("YYYY-MM-DD");
            let declareEndDtTm=this.addForm.declareEndDtTm.replace(/-/g, "").replace(/:/g,"").replace(" ","");//申报截止时间
            let orgDeclareEndDT=declareEndDtTm.substring(0, 8);
            if(orgDeclareEndDT<res.data.retData){
              this.addForm.declareEndDtTm = declareEndDT + " 12:00:00";
            }
          }
        });
      },
      changeDeclareEndDtTm(currVal){
        if (!this.batchParams.isDeclareEndDtTm) {
          this.batchParams.isDeclareEndDtTm = true;
          return;
        }
        post({code:this.$moment(currVal, "YYYYMMDD").format('YYYYMMDD')},'/sm/oper/holiday/isHoliday').then(res=>{
          if(res && res.data.retCode==='000000'){
            if(res.data.retData === true){
              this.$msgTip.info(this,{info:'您选择的是节假日，请重新选择！'});
              this.addForm.declareEndDtTm='';
              this.addForm.declareEndDt = '';
            }else{
              let declareEndDtTmArr=this.addForm.declareEndDtTm.split(" ");
              this.addForm.declareEndDt = declareEndDtTmArr[0];
              this.addForm.declareEndTm = declareEndDtTmArr[1];
              this.declareEndDtTmAlter(currVal);
            }
          }
        });
      },
      declareEndDtTmAlter(currVal){
        let declareEndDT= this.$moment(currVal, "YYYYMMDD").format("YYYY/MM/DD");
        declareEndDT = new Date(declareEndDT);
        let purchaseDtPlus = declareEndDT.valueOf() + (1 * 24 * 60 * 60 * 1000);
        purchaseDtPlus = new Date(purchaseDtPlus);
        purchaseDtPlus = this.$moment(purchaseDtPlus, "YYYYMMDD").format("YYYYMMDD");
        post({ code: purchaseDtPlus }, "/sm/oper/holiday/getWorkDate").then(res => {
          if (res && res.data.retCode === "000000") {
            let purchaseDt= this.$moment(res.data.retData, "YYYYMMDD").format("YYYY-MM-DD");
            if(this.addForm.purchaseDt<res.data.retData){
              this.addForm.purchaseDt=purchaseDt;
            }
          }
        });
      },
      changePurchaseDt(currVal){
        if (!this.batchParams.isPurchaseDt) {
          this.batchParams.isPurchaseDt = true;
          return;
        }
        post({code:this.$moment(currVal, "YYYYMMDD").format('YYYYMMDD')},'/sm/oper/holiday/isHoliday').then(res=>{
          if(res && res.data.retCode==='000000'){
            if(res.data.retData === true){
              this.$msgTip.info(this,{info:'您选择的是节假日，请重新选择！'});
              this.addForm.purchaseDt='';
            }else{
              this.purchaseDtAlter(currVal);
            }
          }
        });
      },
      purchaseDtAlter(currVal){
        let purchaseDt= this.$moment(currVal, "YYYYMMDD").format("YYYY/MM/DD");
        purchaseDt = new Date(purchaseDt);
        let raiseDtPlus = purchaseDt.valueOf() + (1 * 24 * 60 * 60 * 1000);
        raiseDtPlus = new Date(raiseDtPlus);
        raiseDtPlus = this.$moment(raiseDtPlus, "YYYYMMDD").format("YYYYMMDD");
        post({ code: raiseDtPlus }, "/sm/oper/holiday/getWorkDate").then(res => {
          if (res && res.data.retCode === "000000") {
            let raiseDt= this.$moment(res.data.retData, "YYYYMMDD").format("YYYY-MM-DD");
            if(this.addForm.raiseDt<res.data.retData){
              this.addForm.raiseDt=raiseDt;
            }
          }
        });
      },
      changeRaiseDt(currVal){
        if (!this.batchParams.isRaiseDt) {
          this.batchParams.isRaiseDt = true;
          return;
        }
        post({code:this.$moment(currVal, "YYYYMMDD").format('YYYYMMDD')},'/sm/oper/holiday/isHoliday').then(res=>{
          if(res && res.data.retCode==='000000'){
            if(res.data.retData === true){
              this.$msgTip.info(this,{info:'您选择的是节假日，请重新选择！'});
              this.addForm.raiseDt='';
            }else{
              //联动修改创设期限上限
              this.changeCreationMaxTerm();
            }
          }
        });
      },
      changePaymentDt(currVal){
        if (!this.batchParams.isPaymentDt) {
          this.batchParams.isPaymentDt = true;
          return;
        }
        post({code:this.$moment(currVal, "YYYYMMDD").format('YYYYMMDD')},'/sm/oper/holiday/isHoliday').then(res=>{
          if(res && res.data.retCode==='000000'){
            if(res.data.retData === true){
              this.$msgTip.info(this,{info:'您选择的是节假日，请重新选择！'});
              this.addForm.paymentDt='';
            }else{
              if(this.addForm.paymentDt<this.addForm.raiseDt){
                this.$msgTip.error(this, { info: "兑付日期必须大于缴款日期"});
                return;
              }
              //联动修改创设期限上限
              this.changeCreationMaxTerm();
            }
          }
        });
      },
      changeCreationMaxTerm(){
        if(this.addForm.raiseDt&&this.addForm.paymentDt){
          let raiseDt= this.$moment(this.addForm.raiseDt, "YYYYMMDD").format("YYYY/MM/DD");
          raiseDt = new Date(raiseDt);
          let paymentDt= this.$moment(this.addForm.paymentDt, "YYYYMMDD").format("YYYY/MM/DD");
          paymentDt = new Date(paymentDt);
          let dateSpan = paymentDt - raiseDt;
          if(dateSpan < 0){
            this.addForm.creationMaxTerm = 0;
          }else{
            this.addForm.creationMaxTerm = Math.floor(dateSpan / (24 * 3600 * 1000));
          }
        }
      }
    }
  };
</script>

<style scoped>

</style>
