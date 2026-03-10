<!--额度批次详情栏-->
<template>
  <div>
    <div class="text-wrap mb-10">
      <div class="text-header"><span class="tit">详细信息</span></div>
      <div class="text-body" v-if="isShowPoolBailPcet">
        <h-row :gutter="8">
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.common.custName")}}:</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.custName }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="10" class="label">{{$t("m.i.pl.bailPcet")}}:</h-col>
              <h-col span="14" class="val">{{ formatBailPcet }}</h-col>
            </h-row>
          </h-col>
<!--          <h-col span="8">-->
<!--            <h-row>-->
<!--              <h-col span="9" class="label">{{$t("m.i.pl.poolBailPcet")}}:</h-col>-->
<!--              <h-col span="15" class="val">{{ formatPoolBailPcet }}</h-col>-->
<!--            </h-row>-->
<!--          </h-col>-->
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.pc.creditLimitAmt")}}:</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.creditLimitAmt }}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <h-row :gutter="8">
          <h-col span="8">
            <h-row>
              <h-col span="10" class="label">{{$t("m.i.pl.inPoolAmt")}}:</h-col>
              <h-col span="14" class="val">{{ viewDetailForm.inPoolAmt }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.pc.usedCreditAmt")}}:</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.usedCreditAmt }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="10" class="label">{{$t("m.i.pc.doAmt")}}:</h-col>
              <h-col span="14" class="val">{{ viewDetailForm.doAmt }}</h-col>
            </h-row>
          </h-col>
        </h-row>
      </div>
      <div class="text-body" v-else>
        <h-row :gutter="8">
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.common.custName")}}:</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.custName }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="10" class="label">{{$t("m.i.pl.bailPcet")}}:</h-col>
              <h-col span="14" class="val">{{ formatBailPcet }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.pc.creditLimitAmt")}}:</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.creditLimitAmt }}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <h-row :gutter="8">
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.pl.inPoolAmt")}}:</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.inPoolAmt }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="10" class="label">{{$t("m.i.pl.usedCreditAmt")}}:</h-col>
              <h-col span="14" class="val">{{ viewDetailForm.bailBalance }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.pc.usedCreditAmt")}}:</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.usedCreditAmt }}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <h-row :gutter="8">
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.pc.doAmt")}}:</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.doAmt }}</h-col>
            </h-row>
          </h-col>
        </h-row>
      </div>
    </div>
  </div>
</template>

<script>
  import { accMul, formatNumber, post } from "@/api/bizApi/commonUtil";

  export default {
    name: "custCreditDetail",
    data() {
      return {
        viewDetailForm : {
          custName: "",
          bailPcet: "",
          poolBailPcet: "",
          creditLimitAmt: "",
          inPoolAmt: "",
          bailBalance: "",
          usedCreditAmt: "",
          agreementNo: "",
          doAmt: ""
        },
      };
    },
    watch: {},
    props: {
      batchDetailParams: {
        type: Object,
        default: {
          custNo: "",
          poolNo: "",
          batchInfoUrl: ""   //查询批次信息对应Url
        }
      },
      isShowPoolBailPcet: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      formatBailPcet() {
        let bailPcet = this.viewDetailForm.bailPcet;
        if (!isNaN(parseFloat(bailPcet)) && isFinite(bailPcet)) {
          bailPcet = bailPcet == null ? "0.00" : accMul(bailPcet, 100);
        }
        return bailPcet;
      },
      formatPoolBailPcet() {
        let poolBailPcet = this.viewDetailForm.poolBailPcet;
        if (!isNaN(parseFloat(poolBailPcet)) && isFinite(poolBailPcet)) {
          poolBailPcet = poolBailPcet == null ? "0.00" : accMul(poolBailPcet, 100);
        }
        return poolBailPcet;
      }
    },
    methods: {
      //获取批次详细信息
      getCreditBatchInfo() {
        let params = {
          custNo: this.batchDetailParams.custNo,
          poolNo: this.batchDetailParams.poolNo
        }
        post(params, this.batchDetailParams.batchInfoUrl).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.viewDetailForm.custName = res.data.retData.custName;
              this.viewDetailForm.bailPcet = res.data.retData.bailPcet;
              this.viewDetailForm.poolBailPcet = res.data.retData.poolBailPcet;
              this.viewDetailForm.creditLimitAmt = res.data.retData.creditLimitAmt;
              this.viewDetailForm.agreementNo = res.data.retData.agreementNo;
              if (this.viewDetailForm.creditLimitAmt != null) {
                this.viewDetailForm.creditLimitAmt = formatNumber(this.viewDetailForm.creditLimitAmt, 2, ",");
              }
              this.viewDetailForm.inPoolAmt = res.data.retData.inPoolAmt;
              if (this.viewDetailForm.inPoolAmt  != null) {
                this.viewDetailForm.inPoolAmt = formatNumber(this.viewDetailForm.inPoolAmt, 2, ",");
              }
              this.viewDetailForm.bailBalance = res.data.retData.bailBalance;
              if (this.viewDetailForm.bailBalance != null) {
                this.viewDetailForm.bailBalance = formatNumber(this.viewDetailForm.bailBalance, 2, ",");
              }
              this.viewDetailForm.usedCreditAmt = res.data.retData.usedCreditAmt;
              if (this.viewDetailForm.usedCreditAmt != null) {
                this.viewDetailForm.usedCreditAmt = formatNumber(this.viewDetailForm.usedCreditAmt, 2, ",");
              }
              this.viewDetailForm.doAmt = res.data.retData.doAmt;
              if (this.viewDetailForm.doAmt != null) {
                this.viewDetailForm.doAmt = formatNumber(this.viewDetailForm.doAmt, 2, ",");
              }
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          }
        });
      }
    }
  };
</script>

<style scoped>

</style>
