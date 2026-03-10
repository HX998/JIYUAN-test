<!--买入/卖出 新增/修改弹窗共用字段-->
<template>
  <div>
    <!--业务类型-->
    <common-select v-model="addForm.busiType" :label="$t('m.i.common.busiType')"
                   prop="busiType" :dictList="batchParams.busiTypeList" :readonly="true"></common-select>
    <!--本方机构名称-->
    <common-input v-model="addForm.buyBrchName" :label="$t('m.i.be.ownBrchName')" prop="buyBrchName"
                  :readonly="true"></common-input>
    <!--本方交易员名称-->
    <common-input v-model="addForm.buyTraderName" :label="$t('m.i.be.traderName')" prop="buyTraderName"
                  :readonly="true"></common-input>
    <!--票据种类-->
    <common-select v-model="addForm.billType" :label="$t('m.i.billInfo.billType')"
                   prop="billType" :dictList="batchParams.billTypeList"
                   :required="true"></common-select>
    <!--票据介质-->
    <common-select v-model="addForm.billClass" :label="$t('m.i.billInfo.billClass')"
                   prop="billClass" :dictList="batchParams.billClassList"
                   :required="true"></common-select>
    <!--回购利率-->
    <common-type-field v-model="addForm.ratePct" :label="$t('m.i.be.repurchaseRate')" prop="ratePct" :validRules="ratePctRule"
                  :required="true" :integerNum="3" :suffixNum="4" :bigTips="false"></common-type-field>
    <!--回购金额-->
    <common-type-field v-model="addForm.buyBackTotalAmt" :label="$t('m.i.pe.buyBackTotalAmt')" prop="buyBackTotalAmt" :validRules="buyBackTotalAmtRule"
                  :required="true" :integerNum="16" :suffixNum="2" nonNegative :bigTips="false"></common-type-field>
    <!--回购期限-->
    <common-input v-model="addForm.tenorDays" :label="$t('m.i.be.repoTerm')" prop="tenorDays" :validRules="tenorDaysRule"
                  :required="true" :readonly="true"></common-input>
    <!--期限品种-->
    <common-select v-model="addForm.tenorVarieties" :label="$t('m.i.be.tenorVarieties')"
                   prop="tenorVarieties" :dictList="batchParams.tenorVarietiesList"  @on-change="changeTenorVarieties"
                   :required="true"></common-select>
    <!--清算类型-->
    <common-select v-model="addForm.clearType" :label="$t('m.i.be.clearType')"
                   prop="clearType" :dictList="batchParams.clearTypeList"
                   :required="true"></common-select>
    <!--结算方式-->
    <common-select v-model="addForm.settleMode" :label="$t('m.i.be.settleMode')"
                   prop="settleMode" :dictList="batchParams.settleTypeList"
                   :required="true" :readonly="true"></common-select>
    <!--清算速度-->
    <common-select v-model="addForm.clearSpeed" :label="$t('m.i.be.clearSpeed')"
                   prop="clearSpeed" :dictList="batchParams.clearSpeedList" @on-change="changeSpeed"
                   :required="true" :readonly="true"></common-select>
    <!--首期结算日-->
    <common-date-picker v-model="addForm.settleDt" :label="$t('m.i.be.firstSettleDate')" prop="settleDt" :options="options2"
                         :required="true"  @on-change="firstDtChange"></common-date-picker>
    <!--到期结算日-->
    <common-date-picker v-model="addForm.dueSettleDt" :label="$t('m.i.be.dueSettleDt')" prop="dueSettleDt"  :options="optionsDueDt"
                         :required="true" readonly></common-date-picker>
    <!--信用主体类型-->
    <common-select v-model="addForm.creditMainBrchClass" :label="$t('m.i.billInfo.creditMainBankType')"
                   prop="creditMainBrchClass" :dictList="batchParams.creditMajorList"
                   :required="true"></common-select>
  </div>
</template>

<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";
  export default {
    name: "anonyApplyFormItem",
    data() {
      let _this = this;
      return {
        options2: {
          disabledDate (date) {
            return  _this.$moment(window.sessionStorage.getItem("workDate"), "YYYYMMDD") > date && date.valueOf() ;
          }
        },
        optionsDueDt : {
          disabledDate(date) {
            let start = _this.$moment(_this.addForm.settleDt).format("YYYY/MM/DD");
            let end = date.valueOf() - new Date(start).getTime();
            return end < 0;
          }
        },
        ratePctRule :[{
          test: /^(\d{1,2}(\.\d{1,4})?|100|100\.0|100\.00|100\.000|100\.0000)$/,
          trigger: "blur",
          message: "利率范围0~100，且小数位不超过四位"
        }],
        buyBackTotalAmtRule:[{
          test: /^(?:[1-9]\d{0,15}|0)(?:\.\d{1,2})?$/,
          trigger: "blur",
          message: "回购金额必须是大于等于0的数字，最多16位整数且小数位不超过两位"
        }],
        tenorDaysRule :[{
          test: /^[1-9]\d*$/,
          trigger: "blur",
          message: "回购期限必须是大于0的正整数"
        }]
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
        let tenorVarieties =this.addForm.tenorVarieties;
        if(currVal === "CS01"){
          let workDate = this.$moment(this.addForm.workDate, "YYYYMMDD").format("YYYY/MM/DD");
          workDate = new Date(workDate);
          let workDatePlus = workDate.valueOf() + (1 * 24 * 60 * 60 * 1000);
          workDatePlus = this.$moment(workDatePlus, "YYYYMMDD").format("YYYYMMDD");
          post({ code: workDatePlus }, "/sm/oper/holiday/getWorkDate").then(res => {
            if (res && res.data.retCode === "000000") {
              this.addForm.settleDt = this.$moment(res.data.retData, "YYYYMMDD").format("YYYYMMDD");
              this.changeTenorVarieties(tenorVarieties);
            }
          });
        }else if(currVal === "CS00"){
          this.addForm.settleDt = this.$moment(this.addForm.workDate, "YYYYMMDD").format("YYYYMMDD");
          let settleDate = this.$moment(this.addForm.settleDt).format('YYYY/MM/DD');
          settleDate=new Date(settleDate);
          post({code:this.$moment(settleDate).format('YYYYMMDD')},'/sm/oper/holiday/isHoliday').then(res=>{
            if(res && res.data.retCode==='000000'){
              if(res.data.retData === true){
                this.$msgTip.info(this,{info:'您选择的是节假日，请重新选择！'});
                this.addForm.settleDt='';
              }else{
                this.changeTenorVarieties(tenorVarieties);
              }
            }
          });
        }else{
        }
      },
      // 首期结算日 选择，判断所选日期是否为节假日，当选择为节假日，清空所选日期；当是交易日，修改期限天数
      firstDtChange(){
        if(this.addForm.settleDt){
          let days=this.addForm.tenorDays
          let tenorVarieties =this.addForm.tenorVarieties;
          if(tenorVarieties){
            days=this.getDays(tenorVarieties);
          }
          let settleDt = this.$moment(this.addForm.settleDt).format('YYYY/MM/DD');
          settleDt=new Date(settleDt);
          post({code:this.$moment(settleDt).format('YYYYMMDD')},'/sm/oper/holiday/isHoliday').then(res=>{
            if(res && res.data.retCode==='000000'){
              if(res.data.retData === true){
                this.$msgTip.info(this,{info:'您选择的是节假日，请重新选择！'});
                this.addForm.settleDt='';
              }else{
                if(days){
                  let dueSettleDt = settleDt.valueOf() + (days * 24 * 60 * 60 * 1000);
                  dueSettleDt = new Date(dueSettleDt);
                  dueSettleDt = this.$moment(dueSettleDt, "YYYYMMDD").format("YYYYMMDD");
                  post({ code: dueSettleDt }, "/sm/oper/holiday/getWorkDate").then(res => {
                    if (res && res.data.retCode === "000000") {
                      dueSettleDt = this.$moment(res.data.retData, "YYYYMMDD").format("YYYYMMDD");
                      this.addForm.dueSettleDt = dueSettleDt;
                      dueSettleDt = this.$moment(dueSettleDt, "YYYYMMDD").format("YYYY/MM/DD");
                      dueSettleDt = new Date(dueSettleDt);
                      days = (dueSettleDt.getTime() - settleDt.getTime()) / (24 * 60 * 60 * 1000);
                      this.addForm.tenorDays = days;
                    }
                  });
                }
              }
            }
          });
        }
      },
      changeTenorVarieties(currVal){
        if (!this.batchParams.isTenorVarietiesChange) {
          this.batchParams.isTenorVarietiesChange = true;
          return;
        }
        if(currVal){
          let days=this.getDays(currVal);
          let settleDt = this.addForm.settleDt;
          if(settleDt){
            settleDt = this.$moment(settleDt, "YYYYMMDD").format("YYYY/MM/DD");
            settleDt = new Date(settleDt);
            let dueSettleDt = settleDt.valueOf() + (days * 24 * 60 * 60 * 1000);
            dueSettleDt = new Date(dueSettleDt);
            dueSettleDt = this.$moment(dueSettleDt, "YYYYMMDD").format("YYYYMMDD");
            post({ code: dueSettleDt }, "/sm/oper/holiday/getWorkDate").then(res => {
              if (res && res.data.retCode === "000000") {
                dueSettleDt = this.$moment(res.data.retData, "YYYYMMDD").format("YYYYMMDD");
                this.addForm.dueSettleDt = dueSettleDt;
                dueSettleDt = this.$moment(dueSettleDt, "YYYYMMDD").format("YYYY/MM/DD");
                dueSettleDt = new Date(dueSettleDt);
                days = (dueSettleDt.getTime() - settleDt.getTime()) / (24 * 60 * 60 * 1000);
                this.addForm.tenorDays = days;
              }
            });
          }
        }
      },
      getDays(tenorVarieties) {
        if(tenorVarieties=="TM001"){
          return 1;
        }else if(tenorVarieties=="TM007"){
          return 7;
        }else if(tenorVarieties=="TM014"){
          return 14;
        }else if(tenorVarieties=="TM030"){
          return 30;
        }else if(tenorVarieties=="TM090"){
          return 90;
        }else if(tenorVarieties=="TM180"){
          return 180;
        }else if(tenorVarieties=="TM270"){
          return 270;
        }else if(tenorVarieties=="TM360"){
          return 360;
        }
      }
    }
  };
</script>

<style scoped>

</style>
