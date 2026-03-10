<!--商票保贴到期扣款批次明细-->
<template>
  <div>
    <div class="text-wrap mb-10">
      <div class="text-header"><span class="tit">{{$t('m.i.ce.detailInfo')}}</span></div>
      <div class="text-body">
        <h-row :gutter="8">
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.ce.discountCustName')}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.custName }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.ce.discountCustAcctNo')}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.custAcctNo }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.ce.protectType')}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.protectType }}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <h-row :gutter="8">
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.ce.totalCount')}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.sumCount }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.ce.totalAmt')}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.sumMoney }}</h-col>
            </h-row>
          </h-col>
        </h-row>
      </div>
    </div>
  </div>
</template>

<script>
  import { post, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "discBatchDetail",
    data() {
      return {
        viewDetailForm : {
          custName: "",
          custAcctNo: "",
          protectType: "",
          sumCount: "",
          sumMoney: ""
        },
      };
    },
    watch: {},
    props: {
      batchDetailParams: {
        type: Object,
        default: {
          dictMap: new Map(),
          applFlag: "",
          custName: "",
          custAcctNo: "",
          drwrName: "",
          drwrAcctNo: "",
          protectType: "",
          billClass: "",
          discDt: "",
          rate: ""
        }
      }
    },
    methods: {
      //获取批次详细信息
      getDiscBatchInfo() {
        let params = {
          applFlag: this.batchDetailParams.applFlag,
          custName: this.batchDetailParams.custName,
          custAcctNo: this.batchDetailParams.custAcctNo,
          drwrName: this.batchDetailParams.drwrName,
          drwrAcctNo: this.batchDetailParams.drwrAcctNo,
          protectType: this.batchDetailParams.protectType,
          billClass: this.batchDetailParams.billClass,
          discDt: this.batchDetailParams.discDt,
          rate: this.batchDetailParams.rate
        };
        let url = "/ce/disc/corp/discexpire/discBatchDetail/func_getDiscBillExpireBatch";
        post(params, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.viewDetailForm.custName = res.data.retData.custName;
              this.viewDetailForm.custAcctNo = res.data.retData.custAcctNo;
              this.viewDetailForm.protectType = this.getDictValueFromMap(this.batchDetailParams.dictMap, "ProtectType", res.data.retData.protectType);
              this.viewDetailForm.sumCount = res.data.retData.sumCount;
              this.viewDetailForm.sumMoney = res.data.retData.sumMoney;
              if (!!this.viewDetailForm.sumMoney) {
                this.viewDetailForm.sumMoney = formatNumber(this.viewDetailForm.sumMoney, 2, ",");
              }
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      }
    },
    mounted() {
      this.getDiscBatchInfo();
    }
  };
</script>

<style scoped>

</style>
