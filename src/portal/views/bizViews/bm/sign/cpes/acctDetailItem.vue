<!-- 客户信息展示列 -->
<template>
  <div>
    <!--企业全称-->
    <common-input v-model="custForm.custName" :label="$t('m.i.common.corpName')" prop="custName" :readonly="true"></common-input>
    <!--统一社会信用代码-->
    <common-input v-model="custForm.socCode" :label="$t('m.i.common.socCode')" prop="socCode" :readonly="true"></common-input>
    <!--中征码-->
    <common-input v-model="custForm.lccCode" :label="$t('m.i.bm.lccCode')" prop="lccCode" :readonly="true"></common-input>
    <!--LEI码-->
    <common-input v-model="custForm.leiCode" :label="$t('m.i.bm.leiCode')" prop="leiCode" :readonly="true"></common-input>
    <!--联系邮箱-->
    <common-input v-model="custForm.custEmail" :label="$t('m.i.bm.custEmail')" prop="custEmail" :readonly="true"></common-input>
    <!--注册地址-->
    <common-input v-model="custForm.custAddr" :label="$t('m.i.bm.custAddr')" prop="custAddr" :readonly="true"></common-input>
    <!--主要经营地址-->
    <common-input v-model="custForm.mainBusiAddr" :label="$t('m.i.bm.mainBusiAddr')" prop="mainBusiAddr" :readonly="true"></common-input>
    <!-- 客户规模 -->
    <common-select v-model="custForm.corpScale" :label="$t('m.i.bm.corpScale')"
                   prop="corpScale" :dictList="batchParams.corpScaleList"  :readonly=!this.batchParams.isCanChangeCustPartInfo :required=this.batchParams.isCanChangeCustPartInfo></common-select>
    <!-- 是否绿色 -->
    <common-select v-model="custForm.isGreenCorp" :label="$t('m.i.common.isGreenCorpFdisc')"
                   prop="isGreenCorp" :dictList="batchParams.yonList"  :readonly=!this.batchParams.isCanChangeCustPartInfo :required=this.batchParams.isCanChangeCustPartInfo></common-select>

    <!-- 是否涉农 -->
    <common-select v-model="custForm.isArc" :label="$t('m.i.common.isArcFdisc')"
                   prop="isArc" :dictList="batchParams.yonList"  :readonly=!this.batchParams.isCanChangeCustPartInfo :required=this.batchParams.isCanChangeCustPartInfo></common-select>

    <!-- 客户性质 -->
    <common-select v-model="custForm.corpNature" :label="$t('m.i.bm.corpNature')"
                   prop="corpNature" :dictList="batchParams.corpNatureList"  :readonly=!this.batchParams.isCanChangeCustPartInfo :required=this.batchParams.isCanChangeCustPartInfo></common-select>

    <!-- 行业分类 -->
    <common-select v-model="custForm.industryCategory" :label="$t('m.i.common.industryCategory')"
                   prop="industryCategory" :dictList="batchParams.industryCategoryList"  :readonly=!this.batchParams.isCanChangeCustPartInfo :required=this.batchParams.isCanChangeCustPartInfo></common-select>
    <!-- 是否科技 -->
    <common-select v-model="custForm.isTechnologyCorp" :label="$t('m.i.common.isSciCorpFdisc')"
                   prop="isTechnologyCorp" :dictList="batchParams.yonList"  :readonly=!this.batchParams.isCanChangeCustPartInfo :required=this.batchParams.isCanChangeCustPartInfo></common-select>
    <!--信用评级-->
    <common-input v-model="custForm.creditRating" :label="$t('m.i.bs.creditRating')" prop="creditRating" :validRules="creditRatingRule" :readonly=!this.batchParams.isCanChangeCustPartInfo :maxlength=6></common-input>

    <!--评级主体-->
    <common-input v-model="custForm.creditRatingMain" :label="$t('m.i.billInfo.cdtRatgAgcy')" prop="creditRatingMain" :maxlength=60 :lengthByByte="false"
                  :readonly=!this.batchParams.isCanChangeCustPartInfo ></common-input>

    <!-- 评级到期日 -->
    <common-date-picker v-model="custForm.creditRatgDueDt" :label="$t('m.i.billInfo.cdtRatgDueDt')" prop="creditRatgDueDt"
                        :readonly=!this.batchParams.isCanChangeCustPartInfo ></common-date-picker>
    <!--法人姓名-->
    <common-input v-model="custForm.corpLegalName" :label="$t('m.i.bm.corpLegalName')" prop="corpLegalName" :readonly="true"></common-input>

    <!-- 法人证件类型 -->
    <common-select v-model="custForm.corpLegalCertType" :label="$t('m.i.bm.corpLegalCertType')"
                   prop="corpLegalCertType" :dictList="batchParams.certTypeList"  :readonly="true"></common-select>

    <!--法人证件号码 -->
    <common-input v-model="custForm.corpLegalCertNo" :label="$t('m.i.bm.corpLegalCertNo')" prop="corpLegalCertNo" :readonly="true"></common-input>


    <common-select v-if="custForm.custRgstStatus==='1'" v-model="custForm.isChangeCustInfo" :label="$t('m.i.bm.isChangeCustInfo')"
                   prop="isChangeCustInfo" :dictList="batchParams.yonList"  :required="true" :readonly="!custForm.isCanEdit" ></common-select>

  </div>
</template>

<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";
  import CommonSelect from "../../../../../components/bemp/select/commonSelect";
  export default {
    name: "acctDetailItem",
    components: {CommonSelect},
    data() {
      let _this = this;
      function validCreditRating(rule,val,callback){
        let re = /^[a-zA-Z0-9-/+]{1,6}$/;
        if(val == null || val == ''){
          callback()
        }
        if(re.test(val)){
          callback()
        }else{
          callback(new Error("非法输入，信用评级为小于等于6位的数字、字母或-、+组成"))
        }
      }
      return {
        creditRatingRule: [{ test: validCreditRating, trigger: "blur" }],
      }
    },
    props: {
      custForm: {
        type: Object,
        default() {
          return {};
        }
      },
      batchParams: {
        type: Object,
        default: {}
      }
    }
  };
</script>

<style scoped>

</style>
