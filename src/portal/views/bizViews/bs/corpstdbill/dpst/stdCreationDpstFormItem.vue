<!--创设业务 新增/修改弹窗共用字段-->
<template>
  <div>
    <!--批次号-->
    <common-input v-model="addForm.batchNo" :label="$t('m.i.common.batchNo')" prop="batchNo" readonly></common-input>
    <!--归集方式-->
    <common-select v-model="addForm.collectMode" :label="$t('m.i.bs.collectMode')"
                   prop="collectMode" :dictList="batchParams.collectModeList"  readonly></common-select>
    <!--基础资产种类-->
    <common-select v-model="addForm.baseAssetType" :label="$t('m.i.bs.baseAssetType')"
                   prop="baseAssetType" :dictList="batchParams.baseAssetTypeList"  readonly></common-select>
    <!--标票产品名称-->
    <common-input v-model="addForm.stdProductName" :label="$t('m.i.bs.stdProductName')" prop="stdProductName"  readonly></common-input>
    <!--标票产品简称-->
    <common-input v-model="addForm.stdProductShortName" :label="$t('m.i.bs.stdProductShortName')" prop="stdProductShortName"  readonly></common-input>
    <!--标票产品代码-->
    <common-input v-model="addForm.stdProductNo" :label="$t('m.i.bs.stdProductNo')" prop="stdProductNo"  readonly></common-input>
    <!--电票账号-->
    <common-input v-model="addForm.ecdsAcctNo" :label="$t('m.i.bs.ecdsAcctNo')" prop="ecdsAcctNo"  readonly></common-input>
    <!--电票账户户名-->
    <common-input v-model="addForm.ecdsAcctName" :label="$t('m.i.bs.ecdsAcctName')" prop="ecdsAcctName"  readonly></common-input>
    <!--存托机构名称-->
    <common-input v-model="addForm.dpstBrchName" :label="$t('m.i.bs.dpstBrchName')" prop="dpstBrchName"  readonly></common-input>
    <!--存托机构代码-->
    <common-input v-model="addForm.dpstBrchCode" :label="$t('m.i.bs.dpstBrchCode')" prop="dpstBrchCode"  readonly></common-input>
    <!--承销机构名称-->
    <common-input v-model="addForm.sellBrchName" :label="$t('m.i.bs.sellBrchName')" prop="sellBrchName" readonly></common-input>
    <!--创设规模上限(万元)-->
    <common-type-field v-model="addForm.creationMaxAmt" :label="$t('m.i.bs.creationMaxAmt')" prop="creationMaxAmt" readonly :bigTips="false"></common-type-field>
    <!--创设期限上限(天)-->
    <common-input v-model="addForm.creationMaxTerm" :label="$t('m.i.bs.creationMaxTerm')" prop="creationMaxTerm"  readonly ></common-input>
    <!--"融资利率上限(%)-->
    <common-input v-model="addForm.financeMaxRatePct" :label="$t('m.i.bs.financeMaxRatePct')" prop="financeMaxRatePct"  readonly></common-input>
    <!--融资利率下限(%)-->
    <common-input v-model="addForm.financeMinRatePct" :label="$t('m.i.bs.financeMinRatePct')" prop="financeMinRatePct" readonly></common-input>
    <!--披露日期-->
    <common-date-picker v-model="addForm.publishDt" :label="$t('m.i.bs.publishDt')" prop="publishDt" readonly ></common-date-picker>
    <!--申报截止时间-->
    <common-date-picker v-model="addForm.declareEndDtTm" :label="$t('m.i.bs.declareEndDtTm')" prop="declareEndDtTm" type="datetime" readonly ></common-date-picker>
    <!--申购日期-->
    <common-date-picker v-model="addForm.purchaseDt" :label="$t('m.i.bs.purchaseDt')" prop="purchaseDt"readonly ></common-date-picker>
    <!--缴款日期-->
    <common-date-picker v-model="addForm.raiseDt" :label="$t('m.i.bs.raiseDt')" prop="raiseDt" readonly ></common-date-picker>
    <!--流通场所-->
    <common-select v-model="addForm.transPlace" :label="$t('m.i.bs.transPlace')" prop="transPlace" :dictList="batchParams.transPlaceList" readonly></common-select>
    <!--基础资产起始到期日(准入)-->
    <common-date-picker v-model="addForm.preBeginDueDt" :label="$t('m.i.bs.preBeginDueDt')" prop="preBeginDueDt" class="h-form-long-label" readonly ></common-date-picker>
    <!--基础资产截止到期日(准入)-->
    <common-date-picker v-model="addForm.preEndDueDt" :label="$t('m.i.bs.preEndDueDt')" prop="preEndDueDt" class="h-form-long-label"  readonly ></common-date-picker>
    <h-col span="24"><hr></h-col>
    <!--基础资产起始到期日-->
    <common-date-picker v-model="addForm.beginDueDt" :label="$t('m.i.bs.beginDueDt')" prop="beginDueDt" class="h-form-long-label" readonly ></common-date-picker>
    <!--基础资产截止到期日-->
    <common-date-picker v-model="addForm.endDueDt" :label="$t('m.i.bs.endDueDt')" prop="endDueDt" class="h-form-long-label" readonly ></common-date-picker>
    <!--产品规模(元)-->
    <common-type-field v-model="addForm.creationAmt" :label="$t('m.i.bs.creationAmt')" prop="creationAmt" readonly :bigTips="false"></common-type-field>
    <!--产品期限(天)-->
    <common-input v-model="addForm.creationTerm" :label="$t('m.i.bs.creationTerm')" prop="creationTerm" readonly ></common-input>
    <!--兑付日期-->
    <common-date-picker v-model="addForm.paymentDt" :label="$t('m.i.bs.paymentDt')" prop="paymentDt"
                        :options="paymentDtFilter" :required="batchParams.batchType==='modify'" @on-change="changePaymentDt" :readonly="batchParams.batchType!=='modify'"></common-date-picker>
    <h-col span="24"><hr></h-col>
    <!--计费类型-->
    <common-select v-model="addForm.calFeeType" :label="$t('m.i.bs.calFeeType')"
                   prop="calFeeType" :dictList="batchParams.calFeeTypeList" readonly></common-select>
    <!--费率-->
    <common-input v-model="addForm.feeRatePct" :label="$t('m.i.bs.feeRate')" prop="feeRatePct" readonly></common-input>
    <!--计费类型-->
    <common-select v-model="addForm.sellCalFeeType" :label="$t('m.i.bs.sellCalFeeType')"
                   prop="sellCalFeeType" :dictList="batchParams.calFeeTypeList" v-if="addForm.isSelfSell==='1'" readonly></common-select>
    <!--费率-->
    <common-input v-model="addForm.sellFeeRatePct" :label="$t('m.i.bs.sellFeeRate')" prop="sellFeeRatePct" v-if="addForm.isSelfSell==='1'" readonly></common-input>
  </div>
</template>

<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";
  export default {
    name: "stdCreationFormItem",
    components: {
    },
    data() {
      let _this = this;
      return {
        paymentDtFilter: {
          disabledDate (date) {
            let start = _this.$moment(_this.addForm.endDueDt).format("YYYY/MM/DD");
            let end = date.valueOf() - new Date(start).getTime();
            return end <= 0;
          }
        },
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
        default(){
          return {};
        }
      }
    },
    methods:{
      changePaymentDt(currVal){
        if (this.batchParams.batchType==='signReply') {
          return;
        }
        if(currVal){
          post({code:this.$moment(currVal, "YYYYMMDD").format('YYYYMMDD')},'/sm/oper/holiday/isHoliday').then(res=>{
            if(res && res.data.retCode==='000000'){
              if(res.data.retData === true){
                this.$msgTip.info(this,{info:'您选择的是节假日，请重新选择！'});
                this.addForm.paymentDt='';
              }else{
                this.paymentDtAlter(currVal);
              }
            }
          });
        }
      },
      paymentDtAlter(currVal){
        let paymentDt= this.$moment(currVal, "YYYYMMDD").format("YYYY/MM/DD");
        paymentDt = new Date(paymentDt);
        let raiseDt = this.$moment(this.addForm.raiseDt).format('YYYY/MM/DD');
        raiseDt=new Date(raiseDt);
        let days=(paymentDt.getTime()-raiseDt.getTime())/(24 * 60 * 60 *1000);
        if(days > 0){
          this.addForm.creationTerm = days;
        }else{
          this.addForm.creationTerm = '';
        }
      }
    }
  };
</script>

<style scoped>

</style>
