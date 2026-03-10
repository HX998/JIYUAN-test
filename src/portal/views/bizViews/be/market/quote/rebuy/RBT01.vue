<template>
  <div class ="out-side">
    <div>
      <h-form-item :label="$t('m.i.be.firstSettleDt')" prop="firstSettleDt" required class="h-form-three">
        <h-date-picker :value="formItem.firstSettleDt" type="date"  format="yyyy-MM-dd" :showFormat="true" :readonly="true"></h-date-picker>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.tradRate')" prop="ratePct" required class="h-form-three" :validRules="ratePctRule">
        <h-input v-model="formItem.ratePct" placeholder="利率范围0~100，且小数位不超过四位" ></h-input>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.setTm')" prop="setTm" required class="h-form-three">
        <h-time-picker v-model="formItem.setTm" placement="bottom-end" placeholder="选择时间" ></h-time-picker>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.quoteTm')" prop="quoteTm" required  class="h-form-three h-form-long-label">
        <h-time-picker   v-model="formItem.quoteTm" placement="bottom-end" placeholder="选择时间" ></h-time-picker>
      </h-form-item>
    </div>
    <div>
      <h-form-item :label="$t('m.i.be.prodNo')" prop="prodNo" :required="true"  class="h-form-three">
        <h-select v-model="formItem.prodNo" placeholder="" v-if="formItem.auditNo" readonly>
          <h-option v-for="(value,key) in formItem.productMapDict" v-if="value !== null && value !== ''" :value="key" :key="key" >{{value}}</h-option>
        </h-select>
        <h-select v-model="formItem.prodNo" placeholder="" v-else>
          <h-option v-for="(value,key) in formItem.productMapDict" v-if="value !== null && value !== ''" :value="key" :key="key" >{{value}}</h-option>
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
      <h-form-item :label="$t('m.i.be.firstPayInterest')" prop="firstPayInterest"  class="h-form-three">
        <h-typefield v-model="formItem.firstPayInterest" placeholder="" readonly></h-typefield>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.firstSettleAmt')" prop="firstSettleAmt"  class="h-form-three">
        <h-typefield v-model="formItem.firstSettleAmt" placeholder="" readonly></h-typefield>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.tenorDays')" prop="tenorDays"  class="h-form-three h-form-long-label" >
        <h-input v-model="formItem.tenorDays" placeholder="" readonly></h-input>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.yieldRate')" prop="yieldRatePct"  class="h-form-three">
        <h-input v-model="formItem.yieldRatePct" placeholder="" readonly></h-input>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.creditOccType')" prop="creditOccupyType" class="h-form-three"  v-if="this.formItem.isSelectCreditOccupy=='1'">
        <h-select v-model="formItem.creditOccupyType" placeholder="" >
          <h-option v-for="item in dictMap['creditDeductRuleList']" :value="item.key" :key="item.key" :label="item.value">{{ item.value }}</h-option>
        </h-select>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.diffMsg')" prop="preChangeInfo"  cols="3" class="h-form-height-auto" style="width:80%">
        <h-input v-model="formItem.preChangeInfo"  placeholder="" type="textarea" readonly :autosize="{minRows: 2, maxRows: 4}"></h-input>
      </h-form-item>
    </div>
  </div>
</template>
<script>
  export default {
    name: "RBT01",
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

