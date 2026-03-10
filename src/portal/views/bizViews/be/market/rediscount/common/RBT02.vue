<template>
  <div class ="out-side">
    <div>
      <h-form-item :label="$t('m.i.be.firstSettleDate')"  v-if="formItem.busiType==='RBT02'" required prop="firstSettleDt"  class="h-form-three">
        <h-date-picker  v-model="formItem.firstSettleDt" format="yyyy-MM-dd" placeholder="" @on-change='firstDtChange' showFormat :options="optionsT02"></h-date-picker>
      </h-form-item>
      <h-form-item label="回购期限"  v-if="formItem.busiType==='RBT02'" prop="tenorDays" required class="h-form-three" :validRules="tenorDaysRule">
        <h-input v-model="formItem.tenorDays" placeholder=""   @on-blur="changeSettleDate" ></h-input>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.dueSettleDt')" v-if="formItem.busiType==='RBT02'" prop="dueSettleDt" required class="h-form-three">
        <h-date-picker v-model="formItem.dueSettleDt" format="yyyy-MM-dd" showFormat @on-change='dueDtChange' :options="optionsDueDt"></h-date-picker>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.termRangeType')" prop="termType" required class="h-form-three" >
        <h-select v-model="formItem.termType" placeholder="请选择" @on-change="checkRates()" showTitle readonly>
          <h-option v-for="item in dictMap['termTypeList']" :value="item.key" :key="item.key">{{item.value }}</h-option>
        </h-select>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.repurchaseRate')"  v-if="formItem.busiType==='RBT02'" prop="ratePct" required class="h-form-three" :validRules="ratePctRule" >
        <h-input v-model="formItem.ratePct" placeholder="" readonly></h-input>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.buyBackTotalAmt')"  v-if="formItem.busiType==='RBT02'" prop="buyBackTotalAmt" required class="h-form-three" :validRules="buyBackTotalAmtRule">
        <h-typefield v-model="formItem.buyBackTotalAmt" placeholder=""></h-typefield>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.prodNo')" prop="prodNo" :required="true"  class="h-form-three">
        <h-select v-model="formItem.prodNo" placeholder=""  readonly showTitle>
          <h-option v-for="(value,key) in formItem.productMapDict" :value="key" :key="key" >{{value}}</h-option>
        </h-select>
      </h-form-item>
    </div>
    <div>
      <h-form-item :label="$t('m.i.common.totalAmtBillPackage')" prop="totalAmt"  class="h-form-three">
        <h-typefield v-model="formItem.totalAmt" placeholder="" readonly></h-typefield>
      </h-form-item>
      <h-form-item :label="$t('m.i.common.totalNumBillPackage')" prop="totalNum"  class="h-form-three">
        <h-input v-model="formItem.totalNum" placeholder="" readonly></h-input>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.settleAmtFirst')" prop="firstSettleAmt"  class="h-form-three h-form-long-label">
        <h-typefield v-model="formItem.firstSettleAmt" placeholder="" readonly></h-typefield>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.dueSettleAmt')" prop="dueSettleAmt"  class="h-form-three h-form-long-label">
        <h-typefield v-model="formItem.dueSettleAmt" placeholder="" readonly></h-typefield>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.firstPayInterest')" prop="firstPayInterest"  class="h-form-three">
        <h-typefield v-model="formItem.firstPayInterest" placeholder="" readonly></h-typefield>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.buyBackEarningRate')" prop="yieldRatePct"  class="h-form-three">
        <h-input v-model="formItem.yieldRatePct" placeholder="" readonly></h-input>
      </h-form-item>
    </div>
    <h-form-item :label="$t('m.i.be.pedTraderName')" prop="buyTraderName" class="h-form-three" v-if="preDeleteBill" >
      <h-input v-model="formItem.buyTraderName" placeholder="" readonly></h-input>
    </h-form-item>
    <h-form-item :label="$t('m.i.be.pedCheckTraderName')" prop="buyCheckTraderName" class="h-form-three" v-if="preDeleteBill" >
      <h-input v-model="formItem.buyCheckTraderName" placeholder="" readonly></h-input>
    </h-form-item>
    <h-form-item :label="$t('m.i.be.pedApproveTraderName')" prop="buyApproveTraderName" class="h-form-three" v-if="preDeleteBill" >
      <h-input v-model="formItem.buyApproveTraderName" placeholder="" readonly></h-input>
    </h-form-item>
    <h-form-item :label="$t('m.i.be.pedTraderNote')" prop="buyTraderNote" class="h-form-three" v-if="preDeleteBill" >
      <h-input v-model="formItem.buyTraderNote" placeholder="" readonly></h-input>
    </h-form-item>
    <h-form-item :label="$t('m.i.be.pedCheckTraderNote')" prop="buyCheckTraderNote" class="h-form-three" v-if="preDeleteBill" >
      <h-input v-model="formItem.buyCheckTraderNote" placeholder="" readonly></h-input>
    </h-form-item>
    <h-form-item :label="$t('m.i.be.pedApproveTraderNote')" prop="buyApproveTraderNote" class="h-form-three" v-if="preDeleteBill" >
      <h-input v-model="formItem.buyApproveTraderNote" placeholder="" readonly></h-input>
    </h-form-item>
    <h-form-item :label="$t('m.i.be.diffMsg')" prop="preChangeInfo"   cols="3" class="h-form-height-auto" style="width:80%">
      <h-input v-model="formItem.preChangeInfo" placeholder="" type="textarea" readonly :autosize="{minRows: 2, maxRows: 4}"></h-input>
    </h-form-item>
  </div>
</template>
<script>
  import { post, on, off, getDictListByGroups } from "@/api/bizApi/commonUtil";
  export default {
    name:'RBT02',
    data(){
      let _this = this;
      return {
        optionsT02: {
          disabledDate (date) {
            return  _this.$moment(window.sessionStorage.getItem("workDate"), "YYYYMMDD") > date && date.valueOf() ;
          }
        },
        optionsDueDt : {
          disabledDate(date) {
            let start = _this.$moment(_this.formItem.firstSettleDt).format("YYYY/MM/DD");
            let end = date.valueOf() - new Date(start).getTime();
            return end < 0;
          }
        },
        ratePctRule :[{
          test: /^(\d{1,2}(\.\d{1,4})?|100)$/,
          trigger: "blur",
          message: "利率范围0~100，且小数位不超过四位"
        }],
        buyBackTotalAmtRule:[{
          test: /^(?:[1-9]\d{0,14}|0)(?:\.\d{1,2})?$/,
          trigger: "blur",
          message: "回购金额必须是大于等于0的数字，最多14位整数且小数位不超过两位"
        }],
        tenorDaysRule :[{
          test: /^[1-9]\d*$/,
          trigger: "blur",
          message: "回购期限必须是大于0的正整数"
        }]
      };
    },

    props:{
      preDeleteBill:Boolean,
      formItem:{
        type: Object,
        default() {
          return {};
        }
      },
      dictMap:{
        type:Object
      }
    },
    watch: {
      "formItem.tenorDays"(val) {
        if(val === "" || val ===undefined || val == null){
          this.formItem.termType = 'RTT01';
        }else{
          if(val < 91){
            this.formItem.termType = 'RTT01';
          }else if(val > 90 && val < 181){
            this.formItem.termType = 'RTT02';
          }else if(val > 180 && val < 271){
            this.formItem.termType = 'RTT03';
          }else if(val > 270){
            this.formItem.termType = 'RTT04';
          }
        }

      }
    },
    methods:{

      // 期限天数改变， 判断结算首日加上期限天数后是否为交易日，
      // 不是交易：提示顺延，并获取交易日期
      changeSettleDate(){
        let tenorDays = this.formItem.tenorDays;
        if(tenorDays === 0 || tenorDays ===''){
          return ;
        }
        let settleDate = this.$moment(this.formItem.firstSettleDt).format('YYYY/MM/DD');
        settleDate = new Date(settleDate);
        settleDate = settleDate.valueOf();
        settleDate = settleDate + tenorDays* 24 * 60 * 60 * 1000;
        settleDate = new Date(settleDate);
        settleDate=this.$moment(settleDate).format('YYYYMMDD');
        post({code:settleDate},'/sm/oper/holiday/isHoliday').then(res=>{
          if(res && res.data.retCode==='000000'){
            if(res.data.retData === true){
              this.$msgTip.info(this,{info:'回购期限填写遇节假日请顺延天数'});
              this.formItem.tenorDays='';
            }else{
              post({code:settleDate},'/sm/oper/holiday/getWorkDate').then(rest=>{
                if(rest && rest.data.retCode==='000000'){
                  this.formItem.dueSettleDt = this.$moment( rest.data.retData,'YYYYMMDD').format('YYYY-MM-DD');
                }
              });
            }
          }
        });
      },
      // 到期结算日 选择，判断所选日期是否为节假日，当选择为节假日，清空所选日期；当是交易日，修改期限天数
      dueDtChange(){
        let dueSettleDate = this.$moment(this.formItem.dueSettleDt).format('YYYY/MM/DD');
        dueSettleDate=new Date(dueSettleDate);
        let settleDate = this.$moment(this.formItem.firstSettleDt).format('YYYY/MM/DD');
        settleDate=new Date(settleDate);
        post({code:this.$moment(dueSettleDate).format('YYYYMMDD')},'/sm/oper/holiday/isHoliday').then(res=>{
          if(res && res.data.retCode==='000000'){
            if(res.data.retData === true){
              this.$msgTip.info(this,{info:'您选择的是节假日，请重新选择！'});
              this.formItem.dueSettleDt='';
            }else{
              let days=(dueSettleDate.getTime()-settleDate.getTime())/(24 * 60 * 60 *1000);
              if(days > 0){
                this.formItem.tenorDays = days;
              }else{
                this.formItem.tenorDays = '';
              }
            }
          }
        });
      },

      firstDtChange(){
        let dueSettleDate = this.$moment(this.formItem.dueSettleDt).format('YYYY/MM/DD');
        dueSettleDate=new Date(dueSettleDate);
        let settleDate = this.$moment(this.formItem.firstSettleDt).format('YYYY/MM/DD');
        settleDate=new Date(settleDate);
        post({code:this.$moment(settleDate).format('YYYYMMDD')},'/sm/oper/holiday/isHoliday').then(res=>{
          if(res && res.data.retCode==='000000'){
            if(res.data.retData === true){
              this.$msgTip.info(this,{info:'您选择的是节假日，请重新选择！'});
              this.formItem.firstSettleDt='';
            }else{
              let days=(dueSettleDate.getTime()-settleDate.getTime())/(24 * 60 * 60 *1000);
              if(days > 0){
                this.formItem.tenorDays = days;
              }else{
                this.formItem.tenorDays = '';
              }
            }
          }
        });
      },

      checkRates(){
        let busiType= this.formItem.busiType;
        let billType =this.formItem.billType;
        let termType =this.formItem.termType;
        post({busiType:busiType,billType:billType,termType:termType},'/be/market/rediscount/redSaleApplyMain/func_checkRates').then(res=>{
          if(res && res.data.retCode==='000000'){
            this.formItem.ratePct=res.data.retData;
          }
        });
      },
    }
  }
</script>
