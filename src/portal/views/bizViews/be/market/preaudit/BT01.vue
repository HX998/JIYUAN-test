<template>
  <div class ="out-side">
    <div>
      <h-form-item :label="$t('m.i.be.firstSettleDt')" prop="firstSettleDt" required class="h-form-three">
        <h-date-picker v-model="formItem.firstSettleDt" placeholder="" type="date"  format="yyyy-MM-dd" :showFormat="true" :editable="false"></h-date-picker>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.tradRate')" prop="ratePct" required class="h-form-three" :validRules="ratePctRule">
        <h-input v-model="formItem.ratePct" placeholder="利率范围0~100，且小数位不超过四位" ></h-input>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.prodNo')" prop="prodNo" :required="true"  class="h-form-three">
        <h-select v-if="formItem.prodNo=='00101001'||formItem.prodNo=='00102001'" v-model="formItem.prodNo" placeholder="" readonly showTitle>
          <h-option v-for="(value,key) in formItem.productMapDict" :value="key" :key="key" >{{value}}</h-option>
        </h-select>
        <h-select v-else v-model="formItem.prodNo" placeholder="" showTitle >
          <h-option v-for="(value,key) in formItem.productMapDict" :value="key" :key="key" >{{value}}</h-option>
        </h-select>
      </h-form-item>
    </div>
    <div>
      <h-form-item :label="$t('m.i.common.totalAmtBillPackage ')" prop="totalAmt"  class="h-form-three">
        <h-input v-model="formItem.totalAmt" placeholder="" readonly></h-input>
      </h-form-item>
      <h-form-item :label="$t('m.i.common.totalNumBillPackage')" prop="totalNum"  class="h-form-three">
        <h-input v-model="formItem.totalNum" placeholder="" readonly></h-input>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.firstPayInterest')" prop="firstPayInterest"  class="h-form-three">
        <h-input v-model="formItem.firstPayInterest" placeholder="" readonly></h-input>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.firstSettleAmt')" prop="firstSettleAmt"  class="h-form-three">
        <h-input v-model="formItem.firstSettleAmt" placeholder="" readonly></h-input>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.tenorDays')" prop="tenorDays"  class="h-form-three h-form-long-label">
        <h-input v-model="formItem.tenorDays" placeholder="" readonly></h-input>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.yieldRate')" prop="yieldRatePct"  class="h-form-three">
        <h-input v-model="formItem.yieldRatePct" placeholder="" readonly></h-input>
      </h-form-item>
    </div>
  </div>
</template>
<script>
  export default {
    name: "BT01",
    data(){
      return {
        ratePctRule :[{
          test: /^(\d{1,2}(\.\d{1,4})?|100|100\.0|100\.00|100\.000|100\.0000)$/,
          trigger: "blur",
          message: "利率范围0~100，且小数位不超过四位"
        }]
      }
    },
    props:{
      formItem:{
        type: Object,
        default() {
          return {};
        }
      },
      dictMap:{
        type:Object
      }
    }
  }
</script>

