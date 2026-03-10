<!--创设业务 新增/修改弹窗共用字段-->
<template>
  <div>
    <!--批次号-->
    <common-input v-model="addForm.batchNo" :label="$t('m.i.common.batchNo')" prop="batchNo" readonly></common-input>
    <!--基础资产种类-->
    <common-select v-model="addForm.baseAssetType" :label="$t('m.i.bs.baseAssetType')" prop="baseAssetType"
                   :dictList="batchParams.baseAssetTypeList"  readonly></common-select>
    <!--标票产品名称-->
    <common-input v-model="addForm.stdProductName" :label="$t('m.i.bs.stdProductName')" prop="stdProductName" readonly></common-input>
    <!--标票产品简称-->
    <common-input v-model="addForm.stdProductShortName" :label="$t('m.i.bs.stdProductShortName')" prop="stdProductShortName" readonly></common-input>
    <!--标票产品代码-->
    <common-input v-model="addForm.stdProductNo" :label="$t('m.i.bs.stdProductNo')" prop="stdProductNo" readonly></common-input>
    <!--"融资利率上限(%)-->
    <common-rate v-model="addForm.financeMaxRatePct" :label="$t('m.i.bs.financeMaxRatePct')" prop="financeMaxRatePct" readonly :validRules="ratePctRule"></common-rate>
    <!--"融资利率下限(%)-->
    <common-rate v-model="addForm.financeMinRatePct" :label="$t('m.i.bs.financeMinRatePct')" prop="financeMinRatePct"  readonly :validRules="ratePctRule"></common-rate>
    <!--产品规模(元)-->
    <common-type-field v-model="addForm.creationAmt" :label="$t('m.i.bs.creationAmt')" prop="creationAmt" :bigTips="false" readonly></common-type-field>
    <!--产品期限(天)-->
    <common-input v-model="addForm.creationTerm" :label="$t('m.i.bs.creationTerm')" prop="creationTerm" readonly ></common-input>
    <!--创设结果-->
    <common-select v-model="addForm.purchaseResult" :label="$t('m.i.bs.purchaseResult')" prop="purchaseResult" :required="true"
                   :readonly="batchParams.flowStatus!='STD040'" :dictList="batchParams.purchaseResultList" @on-change="purchaseResultChange()"></common-select>
    <!--"融资利率(%)-->
    <common-rate v-model="addForm.financeRatePct" :label="$t('m.i.bs.financeRatePct')" prop="financeRatePct" :required="true" readonly
                  :validRules="ratePctRule"></common-rate>
    <!--收款总额(元)-->
    <common-type-field v-model="addForm.totalCollectAmt" :label="$t('m.i.bs.totalCollectAmt')" prop="totalCollectAmt" :validRules="totalCollectAmtRule"
                       :readonly="batchParams.flowStatus!='STD040'" :required="true" :integerNum="16" :suffixNum="2" :bigTips="false"
                       @on-blur="calculateFinanceRatePct()"></common-type-field>

  </div>
</template>

<script>
  import { post, on, off, accMul, accDiv, formatNumber } from "@/api/bizApi/commonUtil";
  export default {
    name: "stdUnderwriteResultDetailFormItem",
    components: {

    },
    data() {
      return {
        ratePctRule: [{
          test: /^(\d{1,2}(\.\d{1,4})?|100|100\.0|100\.00|100\.000|100\.0000)$/,
          trigger: "blur",
          message: "范围0~100，且小数位不超过四位"
        }],
        totalCollectAmtRule:[{
          test: /^(?:[1-9]\d{0,15}|0)(?:\.\d{1,2})?$/,
          trigger: "blur",
          message: "收款总额(元)必须是大于等于0的数字，最多16位整数且小数位不超过两位"
        }],
        purchaseResultList:[]
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
        default() {
          return {};
        }
      }
    },
    methods:{
      //控制 融资利率(%)与收款总额(元) 是否显示
      purchaseResultChange() {
        //认购失败时，融资利率默认为0，输入收款金额后，不自动计算融资利率
        if(this.addForm.purchaseResult === "PR02"){
          this.addForm.financeRatePct = 0;
        }else {
          if(this.addForm.financeRatePct ==="0"){
            this.addForm.financeRatePct = " ";
          }
        }
      },
      //计算融资利率: 融资利率(%) = (( 收款总额(元) * 360 ) / ( 创设规模(元) * 创设期限(天) ))  * 100
      calculateFinanceRatePct(){
        //认购失败时，融资利率默认为0，输入收款金额后，不自动计算融资利率
        if(this.addForm.purchaseResult === "PR02"){
          return;
        }
        if(this.addForm.totalCollectAmt == null){
          this.$msgTip.info(this, { info: "请输入收款总额(元)" });
          return;
        }
        //收款总额
        let totalCollectAmt = this.addForm.totalCollectAmt;
        //创设期限(天)
        let creationTerm =  this.addForm.creationTerm;
        //创设规模(元)
        let creationAmt =  this.addForm.creationAmt;
        if(creationAmt-totalCollectAmt <= 0){
          this.$msgTip.error(this, { info: "收款总额(元)必须小于产品规模(元)"});
          return;
        }
        let params = { totalCollectAmt: totalCollectAmt, creationTerm: creationTerm, creationAmt: creationAmt};
        let url = "/bs/corpstdbill/underwrite/stdUnderwriteResultReg/func_calculateFinanceRatePct";
        post(params, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let financeRatePct = res.data.retData;
              this.addForm.financeRatePct = financeRatePct === null ? "" : accMul(financeRatePct,100);
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      }
    }
  };
</script>

<style scoped>

</style>
