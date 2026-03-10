<template>
    <!--转贴现-->
    <div class ="out-side">
        <h-row :gutter="16">
          <h-col span="6" style="height: 30px">
            <h-form-item :label="$t('m.i.be.clearType')+':'">
              {{format('ClearType',formItem.clearType)}}
            </h-form-item>
          </h-col>
          <h-col span="6" style="height: 30px">
            <h-form-item :label="$t('m.i.be.settleMode')+':'">
              {{format('SettleType',formItem.settleMode)}}
            </h-form-item>
          </h-col>
          <h-col span="6" style="height: 30px">
            <h-form-item :label="$t('m.i.be.clearSpeed')+':'">
              {{format('ClearSpeed',formItem.clearSpeed)}}
            </h-form-item>
          </h-col>
          <h-col span="6" style="height: 30px">
            <h-form-item :label="$t('m.i.be.firstSettleDt')+':'">
              {{formatDate(formItem.firstSettleDt)}}
            </h-form-item>
          </h-col>
        </h-row>
        <h-row :gutter="16">
          <h-col span="6" style="height: 30px">
            <h-form-item :label="$t('m.i.be.tradRate')+':'">
              {{formItem.ratePct}}
            </h-form-item>
          </h-col>
          <h-col span="6" style="height: 30px">
            <h-form-item :label="$t('m.i.be.setTm')+':'">
              {{formItem.setTm}}
            </h-form-item>
          </h-col>
          <h-col span="6" style="height: 30px">
            <h-form-item :label="$t('m.i.be.quoteTm')+':'">
              {{formItem.quoteTm}}
            </h-form-item>
          </h-col>
          <h-col span="6" style="height: 30px">
            <h-form-item :label="$t('m.i.be.prodNo')+':'">
              {{formItem.prodNo}}
            </h-form-item>
          </h-col>
        </h-row>
        <h-row :gutter="16">
          <h-col span="6" style="height: 30px">
            <h-form-item :label="$t('m.i.common.totalAmtBillPackage')+':'">
              {{formItem.totalAmt}}
            </h-form-item>
          </h-col>
          <h-col span="6" style="height: 30px">
            <h-form-item :label="$t('m.i.common.totalNumBillPackage')+':'">
              {{formItem.totalNum}}
            </h-form-item>
          </h-col>
          <h-col span="6" style="height: 30px">
            <h-form-item :label="$t('m.i.be.firstPayInterest')+':'">
              {{formItem.firstPayInterest}}
            </h-form-item>
          </h-col>
          <h-col span="6" style="height: 30px">
            <h-form-item :label="$t('m.i.be.firstSettleAmt')+':'">
              {{formItem.firstSettleAmt}}
            </h-form-item>
          </h-col>
        </h-row>
        <h-row :gutter="16">
          <h-col span="6" style="height: 30px">
            <h-form-item :label="$t('m.i.be.tenorDays')+':'">
              {{formItem.tenorDays}}
            </h-form-item>
          </h-col>
          <h-col span="6" style="height: 30px">
            <h-form-item :label="$t('m.i.be.yieldRate')+':'">
              {{formItem.yieldRatePct}}
            </h-form-item>
          </h-col>
        </h-row>
    </div>
</template>
<script>
export default {
  name: "BT01",
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

