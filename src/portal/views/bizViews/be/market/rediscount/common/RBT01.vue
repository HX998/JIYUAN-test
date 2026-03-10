<template>
  <div class ="out-side">
    <div>
      <h-form-item :label="$t('m.i.be.termRangeType')" prop="termType" required class="h-form-three">
        <h-select v-model="formItem.termType" placeholder="请选择" @on-change="checkRates()" showTitle>
          <h-option v-for="item in dictMap['termTypeList']" :value="item.key" :key="item.key">{{item.value }}</h-option>
        </h-select>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.firstSettleDt')" prop="firstSettleDt" required class="h-form-three">
        <h-date-picker v-model="formItem.firstSettleDt" type="date"  format="yyyy-MM-dd" :showFormat="true" :options="optionsT01"></h-date-picker>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.tradRate')" prop="ratePct" required class="h-form-three" :validRules="ratePctRule" >
        <h-input v-model="formItem.ratePct" placeholder="" readonly></h-input>
      </h-form-item>
    </div>
    <h-form-item :label="$t('m.i.be.prodNo')" prop="prodNo" :required="true"  class="h-form-three">
      <h-select v-model="formItem.prodNo" placeholder=""  readonly>
        <h-option v-for="(value,key) in formItem.productMapDict" :value="key" :key="key" >{{value}}</h-option>
      </h-select>
    </h-form-item>


    <div>
      <h-form-item :label="$t('m.i.common.totalAmtBillPackage')" prop="totalAmt"  class="h-form-three">
        <h-typefield v-model="formItem.totalAmt" placeholder="" readonly></h-typefield>
      </h-form-item>
      <h-form-item :label="$t('m.i.common.totalNumBillPackage')" prop="totalNum"  class="h-form-three">
        <h-input v-model="formItem.totalNum" placeholder="" readonly></h-input>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.firstPayInterest')" prop="firstPayInterest"  class="h-form-three">
        <h-typefield v-model="formItem.firstPayInterest" placeholder="" readonly></h-typefield>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.firstSettleAmt')" prop="firstSettleAmt"  class="h-form-three">
        <h-typefield v-model="formItem.firstSettleAmt" placeholder="" readonly></h-typefield>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.tenorDays')" prop="tenorDays"  class="h-form-long-label" >
        <h-input v-model="formItem.tenorDays" placeholder="" readonly></h-input>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.yieldRate')" prop="yieldRatePct"  class="h-form-three">
        <h-input v-model="formItem.yieldRatePct" placeholder="" readonly></h-input>
      </h-form-item>
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
  </div>
</template>
<script>
  import { post, on, off, getDictListByGroups } from "@/api/bizApi/commonUtil";
  export default {
	name :'RBT01',
    data(){
      let _this = this;
      return {
        optionsT01: {
          disabledDate (date) {
            return  _this.$moment(window.sessionStorage.getItem("workDate"), "YYYYMMDD") > date && date.valueOf() ;
          }
        },
        ratePctRule :[{
          test: /^(\d{1,2}(\.\d{1,4})?|100)$/,
          trigger: "blur",
          message: "利率范围0~100，且小数位不超过四位"
        }]
      }
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
    methods:{
      checkRates(){
        let busiType= this.formItem.busiType;
        let billType =this.formItem.billType;
        let termType =this.formItem.termType;
        post({busiType:busiType,billType:billType,termType:termType},'/be/market/rediscount/redSaleApplyMain/func_checkRates').then(res=>{
          if(res && res.data.retCode==='000000'){
            this.formItem.ratePct=res.data.retData;
          }
        });
      }
    },
    watch:{

    },
  }
</script>

