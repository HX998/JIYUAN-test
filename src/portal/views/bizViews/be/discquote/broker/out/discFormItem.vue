<!--匿名点击正回购 新增/修改弹窗共用字段-->
<template>
  <div>
    <!--业务类型-->
    <common-select v-model="addForm.busiType" :label="$t('m.i.common.busiType')"
                   prop="busiType" :dictList="batchParams.busiTypeList" readonly></common-select>
    <!--来源交易方式-->
    <common-select v-model="addForm.tradeMode" :label="$t('m.i.be.sourceTransMode')"
                   prop="tradeMode" :dictList="batchParams.sourceTransModeList" readonly></common-select>
    <!--来源业务单编号-->
    <common-input v-model="addForm.busiNo" :label="$t('m.i.be.sourceBusiNo')" prop="busiNo"
                  readonly></common-input>
    <!--报价单编号-->
    <common-input v-model="addForm.quoteNo" :label="$t('m.i.be.quoteNo')" prop="quoteNo"
                  readonly></common-input>
    <!--报价模式-->
    <common-select v-model="addForm.quoteMode" :label="$t('m.i.be.quoteMode')"
                   prop="quoteMode" :dictList="batchParams.quoteModeList" :required="true"></common-select>
    <!--本方机构名称-->
    <common-input v-model="addForm.brokerBrchName" :label="$t('m.i.be.ownBrchName')" prop="brokerBrchName"
                  readonly></common-input>
    <!--本方交易员名称-->
    <common-input v-model="addForm.brokerTraderName" :label="$t('m.i.be.traderName')" prop="brokerTraderName" class="h-form-long-label"
                  readonly></common-input>
    <!--对方机构名称-->
    <common-input v-model="addForm.discBrchName" :label="$t('m.i.be.otherBrchName')" prop="discBrchName"
                  readonly></common-input>
    <!--对方交易员名称-->
    <common-input v-model="addForm.discTraderName" :label="$t('m.i.be.custTraderName')" prop="discTraderName" class="h-form-long-label"
                  readonly></common-input>
    <!--贴现申请人名称-->
    <common-input v-model="addForm.discCustName" :label="$t('m.i.ce.discountApplyName')" prop="discCustName" class="h-form-long-label"
    readonly></common-input>
    <!--社会信用代码-->
    <common-input v-model="addForm.discOutSocCode" :label="$t('m.i.ce.discountApplySocCode')" prop="discOutSocCode" class="h-form-long-label"
                  readonly></common-input>
    <!--企业规模-->
    <common-select v-model="addForm.discCorpScale" :label="$t('m.i.be.discCorpScale')" class="h-form-long-label"
                   prop="discCorpScale" :dictList="batchParams.corpScaleList"
                   readonly></common-select>
    <!--行业分类-->
    <common-select v-model="addForm.discIndustry" :label="$t('m.i.be.discIndustry')" class="h-form-long-label"
                   prop="discIndustry" :dictList="batchParams.industryList"
                   readonly></common-select>
    <!--是否涉农企业-->
    <common-select v-model="addForm.isDiscArc" :label="$t('m.i.be.isDiscArc')" class="h-form-long-label"
                   prop="isDiscArc" :dictList="batchParams.isList"
                   readonly></common-select>
    <!--是否绿色企业-->
    <common-select v-model="addForm.isDiscGreenCorp" :label="$t('m.i.be.isDiscGreen')" class="h-form-long-label"
                   prop="isDiscGreenCorp" :dictList="batchParams.isList"
                   readonly></common-select>
    <!--是否科技企业-->
    <common-select v-model="addForm.isDiscTechnologyCorp" :label="$t('m.i.be.isDiscTechnologyCorp')" class="h-form-long-label"
                   prop="isDiscTechnologyCorp" :dictList="batchParams.isList"
                   readonly></common-select>
    <!--是否民营企业-->
    <common-select v-model="addForm.isDiscPrivateCorp" :label="$t('m.i.be.isDiscPrivateCorp')" class="h-form-long-label"
                   prop="isDiscPrivateCorp" :dictList="batchParams.isList"
                   readonly></common-select>
    <!--省份-->
    <common-select v-model="addForm.area" :label="$t('m.i.be.discProv')" class="h-form-long-label"
                   prop="area" :dictList="batchParams.provinceList"
                   readonly></common-select>
    <!--票据种类-->
    <common-select v-model="addForm.billType" :label="$t('m.i.billInfo.billType')"
                   prop="billType" :dictList="batchParams.billTypeList"
                   readonly></common-select>
    <!--票据介质-->
    <common-select v-model="addForm.billClass" :label="$t('m.i.billInfo.billClass')"
                   prop="billClass" :dictList="batchParams.billClassList"
                   readonly></common-select>
    <!--部分成交选项-->
    <common-select v-model="addForm.subDeal" :label="$t('m.i.be.subDeal')"
                   prop="subDeal" :dictList="batchParams.isList"
                   :required="true" ></common-select>
    <!--清算方式-->
    <common-select v-model="addForm.clearMode" :label="$t('m.i.be.clearMode')"
                   prop="clearMode" :dictList="batchParams.clearModeList"
                   :required="true" ></common-select>
    <!--清算速度-->
    <common-select v-model="addForm.clearSpeed" :label="$t('m.i.be.clearSpeed')"
                   prop="clearSpeed" :dictList="batchParams.clearSpeedList" @on-change="changeSpeed"
                   :required="true" ></common-select>
    <!--结算日-->
    <common-date-picker v-model="addForm.firstSettleDt" :label="$t('m.i.be.settleDt')" prop="firstSettleDt" :options="options2"
                        :required="true" readonly></common-date-picker>
    <!--贴现利率-->
    <common-type-field v-model="addForm.ratePct" :label="$t('m.i.pe.discRate')" prop="ratePct" :validRules="ratePctRule"
                  :required="true" :integerNum="3" :suffixNum="4" :bigTips="false"></common-type-field>
    <!--贴现申请人开户行行号-->
    <common-input v-model="addForm.discOutBankNo" :label="$t('m.i.be.discOutBankNo')" prop="discOutBankNo" :validRules="bankNoRule"
                  readonly class="h-form-long-label"></common-input>
    <!--报价有效时间-->
    <common-time-picker v-model="addForm.quoteTm" :label="$t('m.i.be.quoteTm')" prop="quoteTm"
                        :required="true"></common-time-picker>

    <!--票据总额-->
    <common-input v-model="addForm.totalAmt" :label="$t('m.i.be.totalAmtByYUAN')" prop="totalAmt" readonly></common-input>
    <!--票据张数-->
    <common-input v-model="addForm.totalNum" :label="$t('m.i.be.totalNum')" prop="totalNum" readonly></common-input>
    <common-input v-model="addForm.firstPayInterest" :label="$t('m.i.be.payInterestByUnit')" prop="firstPayInterest" readonly></common-input>
    <common-input v-model="addForm.firstSettleAmt" :label="$t('m.i.be.settleAmtByUnit')" prop="firstSettleAmt" readonly></common-input>
    <common-input v-model="addForm.remainDays" :label="$t('m.i.be.remainingPeriod')" prop="remainDays" readonly></common-input>
    <common-input v-model="addForm.fileNum" :label="$t('m.i.be.fileNum')" prop="fileNum" readonly></common-input>
    <common-input v-model="addForm.quoteRemark" :label="$t('m.i.common.remark')" prop="quoteRemark" type="textarea"
                  :autosize="{minRows: 2, maxRows: 4}" class="h-form-height-auto" style="width:80%" :maxlength="300"></common-input>
    <common-input v-model="addForm.preChangeInfo" :label="$t('m.i.be.diffMsg')" prop="preChangeInfo" type="textarea"
                  readonly :autosize="{minRows: 2, maxRows: 4}"  class="h-form-height-auto" style="width:80%"></common-input>


  </div>
</template>

<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";
  export default {
    name: "discFormItem",
    data() {
      let _this = this;
      return {
        options2: {
          disabledDate (date) {
            return  _this.$moment(window.sessionStorage.getItem("workDate"), "YYYYMMDD") > date && date.valueOf() ;
          }
        },
        ratePctRule :[{
          test: /^(\d{1,2}(\.\d{1,4})?|100|100\.0|100\.00|100\.000|100\.0000)$/,
          trigger: "blur",
          message: "利率范围0~100，且小数位不超过四位"
        }],
        bankNoRule :[{
          test: /^(\d{12})$/,
          trigger: "blur",
          message: "行号必须是12位数字"
        }],
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
      //选择清算速度， 在清算速度改变后修改结算日期
      changeSpeed(currVal) {
        if (!this.batchParams.isSpeedChange) {
          this.batchParams.isSpeedChange = true;
          return;
        }
        if(currVal === "CS01"){
          let workDate = this.$moment(this.addForm.workDate, "YYYYMMDD").format("YYYY/MM/DD");
          workDate = new Date(workDate);
          let workDatePlus = workDate.valueOf() + (1 * 24 * 60 * 60 * 1000);
          workDatePlus = new Date(workDatePlus);
          workDatePlus = this.$moment(workDatePlus, "YYYYMMDD").format("YYYYMMDD");
          post({ code: workDatePlus }, "/sm/oper/holiday/getWorkDate").then(res => {
            if (res && res.data.retCode === "000000") {
              this.addForm.firstSettleDt = this.$moment(res.data.retData, "YYYYMMDD").format("YYYYMMDD");
            }
          });
        }else if(currVal === "CS00"){

          this.addForm.firstSettleDt = this.$moment(this.addForm.workDate, "YYYYMMDD").format("YYYYMMDD");
          let settleDate = this.$moment(this.addForm.firstSettleDt).format('YYYY/MM/DD');
          settleDate=new Date(settleDate);
          post({code:this.$moment(settleDate).format('YYYYMMDD')},'/sm/oper/holiday/isHoliday').then(res=>{
            if(res && res.data.retCode==='000000'){
              if(res.data.retData === true){
                this.$msgTip.info(this,{info:'您选择的是节假日，请重新选择！'});
                this.addForm.firstSettleDt='';
              }else{
                // this.changeTenorVarieties(tenorVarieties);
              }
            }
          });
        }else{
        }
      },

    }
  };
</script>

<style scoped>

</style>
