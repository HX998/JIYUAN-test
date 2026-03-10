<!--额度批次详情栏-->
<template>
  <div>
    <div class="text-wrap mb-10">
      <div class="text-header" v-if="batchDetailParams.isAudit">
        <span class="tit">详细信息</span>
      </div>
      <div class="text-header" v-else>
        <span class="tit">客户额度批复详情</span>
      </div>
      <div class="text-body">
        <h-row :gutter="8">
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{ $t("m.i.common.custName") }}:</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.custName }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{ $t("m.i.common.custAcctNo") }}:</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.custAcctNo }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{ $t("m.i.pl.custInPoolLimitAmt") }}:</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.creditLimitAmt }}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <h-row :gutter="8">
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{ $t("m.i.pl.approvalStartDt") }}:</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.startDt }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{ $t("m.i.pl.approvalEndDt") }}:</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.endDt }}</h-col>
            </h-row>
          </h-col>
        </h-row>
      </div>
    </div>
  </div>
</template>

<script>
import {accMul, formatNumber, post} from "@/api/bizApi/commonUtil";

export default {
  name: "quoteControlBatchDetail",
  data() {
    return {
      viewDetailForm: {
        custName: "",
        custNo: "",
        custAcctNo: "",
        creditLimitAmt: "",
        startDt: "",
        endDt: ""
      },
    };
  },
  watch: {},
  props: {
    batchDetailParams: {
      type: Object,
      default: {
        batchId: "",
        isAudit: false
      }
    }
  },
  computed: {},
  methods: {
    //获取批次详细信息
    getBatchInfo() {
      let params = {
        batchId: this.batchDetailParams.batchId,
      }
      let url = "/pl/quoteControl/quoteControlManager/func_queryWhiteQuoteBatchByBatchId";
      post(params, url).then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode == "000000") {
            this.viewDetailForm.custName = res.data.retData.custName;
            this.viewDetailForm.custNo = res.data.retData.custNo;
            this.viewDetailForm.custAcctNo = res.data.retData.custAcctNo;
            this.viewDetailForm.creditLimitAmt = res.data.retData.creditLimitAmt;
            this.viewDetailForm.startDt = res.data.retData.startDt;
            this.viewDetailForm.endDt = res.data.retData.endDt;

            if (this.viewDetailForm.creditLimitAmt != null) {
              this.viewDetailForm.creditLimitAmt = formatNumber(this.viewDetailForm.creditLimitAmt, 2, ",");
            }
            if (this.viewDetailForm.startDt != null) {
              this.viewDetailForm.startDt = this.$moment(this.viewDetailForm.startDt, "YYYY-MM-DD").format("YYYY-MM-DD")
            }

            if (this.viewDetailForm.endDt != null) {
              this.viewDetailForm.endDt = this.$moment(this.viewDetailForm.endDt, "YYYY-MM-DD").format("YYYY-MM-DD")
            }


          } else {
            this.$msgTip.error(this, {info: res.data.retMsg});
          }
        }
      });
    }
  }
};
</script>

<style scoped>

</style>
