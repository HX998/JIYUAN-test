<template>
    <div class ="out-side">
        <div>
            <h-form-item :label="$t('m.i.be.firstSettleDate')" prop="firstSettleDt" class="h-form-three">
                 <h-date-picker readonly v-model="formItem.firstSettleDt" format="yyyy-MM-dd" placeholder=""  showFormat :editable=false></h-date-picker>
            </h-form-item>
            <h-form-item :label="$t('m.i.be.repoTerm')" prop="tenorDays"  class="h-form-three">
                <h-input v-model="formItem.tenorDays" placeholder="" readonly></h-input>
            </h-form-item>
            <h-form-item :label="$t('m.i.be.dueSettleDt')" prop="dueSettleDt" class="h-form-three">
                 <h-date-picker v-model="formItem.dueSettleDt" format="yyyy-MM-dd" placeholder="" showFormat readonly></h-date-picker>
            </h-form-item>
            <h-form-item :label="$t('m.i.be.repurchaseRate')" prop="ratePct" class="h-form-three">
                <h-input v-model="formItem.ratePct" placeholder="" readonly></h-input>
            </h-form-item>
            <h-form-item :label="$t('m.i.be.buyBackTotalAmt')" prop="buyBackTotalAmt" class="h-form-three">
                <h-typefield v-model="formItem.buyBackTotalAmt" placeholder="" readonly></h-typefield>
            </h-form-item>
            <h-form-item :label="$t('m.i.be.setTm')" prop="setTm" class="h-form-three">
                <h-time-picker   v-model="formItem.setTm" placement="bottom-end" placeholder="" readonly></h-time-picker>
            </h-form-item>
            <h-form-item :label="$t('m.i.be.quoteTm')" prop="quoteTm" class="h-form-three h-form-long-label">
                <h-time-picker   v-model="formItem.quoteTm" placement="bottom-end" placeholder="" readonly></h-time-picker>
            </h-form-item>
            <h-form-item :label="$t('m.i.be.billSelectType')" prop="selectType" class="h-form-three">
                <h-select v-model="formItem.selectType" placeholder="" readonly>
                    <h-option v-for="item in dictMap['CdSelectMode']" :value="item.key" :key="item.key">{{item.value }}</h-option>
                </h-select>
            </h-form-item>
            <h-form-item :label="$t('m.i.be.packetSeq')" prop="packetSeq"  class="h-form-three">
                <h-input v-model="formItem.packetSeq" placeholder="" readonly></h-input>
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
            <h-form-item :label="$t('m.i.be.firstPayInterest')" prop="firstPayInterest"  class="h-form-three h-form-long-label">
                <h-typefield v-model="formItem.firstPayInterest" placeholder="" readonly></h-typefield>
            </h-form-item>
            <h-form-item :label="$t('m.i.be.buyBackEarningRate')" prop="yieldRatePct"  class="h-form-three">
                <h-input v-model="formItem.yieldRatePct" placeholder="" readonly></h-input>
            </h-form-item>
            <h-form-item :label="$t('m.i.be.diffMsg')" prop="diffMsg"   cols="3" class="h-form-height-auto" style="width:80%">
                <h-input v-model="formItem.diffMsg" placeholder=""  type="textarea"  readonly :autosize="{minRows: 2, maxRows: 4}"></h-input>
            </h-form-item>
        </div>
    </div>
</template>
<script>
import { post, on, off, getDictListByGroups } from "@/api/bizApi/commonUtil";
export default {
  name: "HBT02",
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

    },
    methods:{
        // 期限天数改变， 判断结算首日加上期限天数后是否为交易日，
        // 不是交易：提示顺延，并获取交易日期
        changeSettleDate(){
            let tenorDays = this.formItem.tenorDays;
            if(tenorDays === 0 || tenorDays ===''){
                return ;
            }
            let settleDate = Date.parse(this.formItem.firstSettleDt.replace(/-/g, "/"));
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
            let dueSettleDate = Date.parse(this.formItem.dueSettleDt.replace(/-/g, "/"));
            dueSettleDate=new Date(dueSettleDate);
            let settleDate = Date.parse(this.formItem.firstSettleDt.replace(/-/g, "/"));
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
        }
    }
}
</script>
