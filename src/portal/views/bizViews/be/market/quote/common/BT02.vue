<template>
  <!-- 质押式回购-->
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
            <h-form-item :label="$t('m.i.be.firstSettleDate')+':'">
              {{formatDate(formItem.firstSettleDt)}}
            </h-form-item>
          </h-col>
        </h-row>
        <h-row :gutter="16">
          <h-col span="6" style="height: 30px">
            <h-form-item :label="$t('m.i.be.repoTerm')+':'">
              {{formItem.tenorDays}}
            </h-form-item>
          </h-col>
          <h-col span="6" style="height: 30px">
            <h-form-item :label="$t('m.i.be.dueSettleDt')+':'">
              {{formatDate(formItem.dueSettleDt)}}
            </h-form-item>
          </h-col>
          <h-col span="6" style="height: 30px">
            <h-form-item :label="$t('m.i.be.repurchaseRate')+':'">
              {{formItem.ratePct}}
            </h-form-item>
          </h-col>
          <h-col span="6" style="height: 30px">
            <h-form-item :label="$t('m.i.be.buyBackTotalAmt')+':'">
              {{formItem.buyBackTotalAmt}}
            </h-form-item>
          </h-col>
        </h-row>

        <h-row :gutter="16">
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
            <h-form-item :label="$t('m.i.be.billSelectType')+':'">
              {{format('CdSelectMode',formItem.selectType)}}
            </h-form-item>
          </h-col>
          <h-col span="6" style="height: 30px">
            <h-form-item :label="$t('m.i.be.packetSeq')+':'">
              {{formItem.packetSeq}}
            </h-form-item>
          </h-col>
        </h-row>

        <h-row :gutter="16">
          <h-col span="6" style="height: 30px">
            <h-form-item :label="$t('m.i.be.prodNo')+':'">
              {{formItem.prodNo}}
            </h-form-item>
          </h-col>
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
            <h-form-item :label="$t('m.i.be.settleAmtFirst')+':'">
              {{formItem.firstSettleAmt}}
            </h-form-item>
          </h-col>
        </h-row>
        <h-row :gutter="16">
          <h-col span="6" style="height: 30px">
            <h-form-item :label="$t('m.i.be.dueSettleAmt')+':'">
              {{formItem.dueSettleAmt}}
            </h-form-item>
          </h-col>
          <h-col span="6" style="height: 30px">
            <h-form-item :label="$t('m.i.be.firstPayInterest')+':'">
              {{formItem.firstPayInterest}}
            </h-form-item>
          </h-col>
          <h-col span="6" style="height: 30px">
            <h-form-item :label="$t('m.i.be.buyBackEarningRate')+':'">
              {{formItem.yieldRatePct}}
            </h-form-item>
          </h-col>
        </h-row>
    </div>
</template>
<script>
import { post, on, off } from "@/api/bizApi/commonUtil";
export default {
  name: "BT02",
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

    },
    methods:{

    }
}
</script>
