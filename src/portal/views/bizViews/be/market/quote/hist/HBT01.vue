<template>
    <div class ="out-side">
        <div>
            <h-form-item :label="$t('m.i.be.firstSettleDt')" prop="firstSettleDt"  class="h-form-three">
                <h-date-picker :value="formItem.firstSettleDt" type="date"  format="yyyy-MM-dd" :showFormat="true" :readonly="true"></h-date-picker>
            </h-form-item>
            <h-form-item :label="$t('m.i.be.tradRate')" prop="ratePct"  class="h-form-three">
                <h-input v-model="formItem.ratePct" placeholder="" readonly></h-input>
            </h-form-item>
            <h-form-item :label="$t('m.i.be.setTm')" prop="setTm" class="h-form-three">
                <h-time-picker v-model="formItem.setTm" placement="bottom-end" placeholder=""  readonly></h-time-picker>
            </h-form-item>
            <h-form-item :label="$t('m.i.be.quoteTm')" prop="quoteTm" class="h-form-three h-form-long-label">
                <h-time-picker   v-model="formItem.quoteTm" placement="bottom-end" placeholder="" readonly ></h-time-picker>
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
            <h-form-item :label="$t('m.i.be.tenorDays')" prop="tenorDays"  class="h-form-three h-form-long-label">
                <h-input v-model="formItem.tenorDays" placeholder="" readonly></h-input>
            </h-form-item>
            <h-form-item :label="$t('m.i.be.yieldRate')" prop="yieldRatePct"  class="h-form-three">
                <h-input v-model="formItem.yieldRatePct" placeholder="" readonly></h-input>
            </h-form-item>
          <h-form-item :label="$t('m.i.be.diffMsg')" prop="diffMsg"  cols="3" class="h-form-height-auto" style="width:80%">
            <h-input v-model="formItem.diffMsg" placeholder="" type="textarea" readonly :autosize="{minRows: 2, maxRows: 4}"></h-input>
          </h-form-item>
        </div>
    </div>
</template>
<script>
export default {
  name: "HBT01",
    data(){
        return {

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

