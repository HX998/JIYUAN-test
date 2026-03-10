<template>
  <div class ="out-side">
    <div>
      <h-form-item :label="$t('m.i.be.innerFirstSettleDt')"  prop="innerFirstSettleDt" required class="h-form-three">
        <h-date-picker v-model="formItem.innerFirstSettleDt" format="yyyy-MM-dd" placeholder="内转结算日" :showFormat="true" :options="options1" readonly></h-date-picker>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.outFirstSettleDt')"  prop="outFirstSettleDt" required class="h-form-three">
        <h-date-picker v-model="formItem.outFirstSettleDt" format="yyyy-MM-dd" placeholder="外转结算日" :showFormat="true" :options="options1" readonly></h-date-picker>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.innerRate')"  prop="innerRatePct" required class="h-form-three h-form-long-label" :validRules="ratePctRule">
        <h-input v-model="formItem.innerRatePct" placeholder="利率范围0~100，且小数位不超过四位" ></h-input>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.outRate')"  prop="outRatePct" required class="h-form-three h-form-long-label" :validRules="ratePctRule">
        <h-input v-model="formItem.outRatePct" placeholder="利率范围0~100，且小数位不超过四位" ></h-input>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.innerSetTm')" prop="innerSetTm" required class="h-form-three h-form-long-label">
        <h-time-picker v-model="formItem.innerSetTm" placement="bottom-end" placeholder="选择时间" ></h-time-picker>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.outSetTm')" prop="outSetTm" required class="h-form-three h-form-long-label">
        <h-time-picker v-model="formItem.outSetTm" placement="bottom-end" placeholder="选择时间" ></h-time-picker>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.innerQuoteTm')" prop="innerQuoteTm" required  class="h-form-three h-form-long-label">
        <h-time-picker   v-model="formItem.innerQuoteTm" placement="bottom-end"  placeholder="选择时间" ></h-time-picker>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.outQuoteTm')" prop="outQuoteTm" required  class="h-form-three h-form-long-label">
        <h-time-picker   v-model="formItem.outQuoteTm" placement="bottom-end"  placeholder="选择时间" ></h-time-picker>
      </h-form-item>
    </div>
    <div>
      <h-form-item :label="$t('m.i.be.totalAmt')" prop="totalAmt"  class="h-form-three">
        <h-typefield v-model="formItem.totalAmt" placeholder="" readonly></h-typefield>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.totalBillNum')" prop="totalNum"  class="h-form-three">
        <h-input v-model="formItem.totalNum" placeholder="" readonly></h-input>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.innerFirstInterest')" prop="innerFirstInterest"  class="h-form-three h-form-long-label">
        <h-typefield v-model="formItem.innerFirstInterest" placeholder="" readonly></h-typefield>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.innerFirstSettleAmt')" prop="innerFirstSettleAmt"  class="h-form-three h-form-long-label">
        <h-typefield v-model="formItem.innerFirstSettleAmt" placeholder="" readonly></h-typefield>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.outFirstInterest')" prop="outFirstInterest"  class="h-form-three h-form-long-label">
        <h-typefield v-model="formItem.outFirstInterest" placeholder="" readonly></h-typefield>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.outFirstSettleAmt')" prop="outFirstSettleAmt"  class="h-form-three h-form-long-label">
        <h-typefield v-model="formItem.outFirstSettleAmt" placeholder="" readonly></h-typefield>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.innerTenorDays')" prop="innerTenorDays"  class="h-form-three h-form-long-label">
        <h-input v-model="formItem.innerTenorDays" placeholder="" readonly></h-input>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.outTenorDays')" prop="outTenorDays"  class="h-form-three h-form-long-label">
        <h-input v-model="formItem.outTenorDays" placeholder="" readonly></h-input>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.innerYieldRate')" prop="innerYieldRate"  class="h-form-three">
        <h-input v-model="formItem.innerYieldRatePct" placeholder="" readonly></h-input>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.outYieldRate')" prop="outYieldRatePct"  class="h-form-three">
        <h-input v-model="formItem.outYieldRatePct" placeholder="" readonly></h-input>
      </h-form-item>
    </div>
  </div>
</template>
<script>
import { post, on, off} from "@/api/bizApi/commonUtil";
  export default {
    name: "BT01",
    data(){
      let _this = this;
      return {
        options1: {
          disabledDate (date) {
            return  _this.$moment(window.sessionStorage.getItem("workDate"), "YYYYMMDD") > date && date.valueOf() ;
          }
        },
        ratePctRule :[{
          test: /^(\d{1,2}(\.\d{1,4})?|100|100\.0|100\.00|100\.000|100\.0000)$/,
          trigger: "blur",
          message: "利率范围0~100，且小数位不超过四位"
        }],
        tenorDaysRule :[{
          test: /^[1-9]\d*|0$/,
          trigger: "blur",
          message: "回购期限必须是大于0的正整数"
        }],
        optionsDueDt : {
          disabledDate(date) {
            let start = _this.$moment(_this.formItem.innerFirstSettleDt).format("YYYY/MM/DD");
            let end = date.valueOf() - new Date(start).getTime();
            return end < 0;
          }
        }
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
    },
    methods:{

    }
  }
</script>

