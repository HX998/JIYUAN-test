<template>
  <div v-if="tempIsShow">
    <div class="text-wrap mb-10">
      <div class="text-header"><span class="tit">{{$t('m.i.ce.detailInfo')}}</span></div>
      <div class="text-body">
        <h-row :gutter="8">
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.common.batchNo')}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.batchNo }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.common.custNo')}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.custNo }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.common.custName')}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.custName }}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <h-row :gutter="8">
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.common.custAcctNo')}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.custAcctNo }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.billInfo.billType')}}：</h-col>
              <h-col span="15" class="val">{{ formatBillType }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.common.unImpawnDt')}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.unimpawnDt == null ? "" : this.$moment(viewDetailForm.unimpawnDt,
                "YYYY-MM-DD").format("YYYY-MM-DD") }}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <h-row :gutter="8">
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.ce.totalCount')}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.totalCount }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.ce.totalAmt')}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.totalAmt }}</h-col>
            </h-row>
          </h-col>
        </h-row>
      </div>
    </div>
  </div>
</template>

<script>
  import {post, formatNumber} from "@/api/bizApi/commonUtil";

  export default {
    name: "pUnImpawnRgstApplyBatchInfoDetail",
    data() {
      return {
        tempIsShow: false,
        viewDetailForm: {
          batchNo: '',
          custNo: '',
          custName: '',
          custAcctNo: '',
          billType: "",
          unimpawnDt: '',
          totalAmt: '',
          totalCount: '',
        }
      }
    },
    watch:{
      isShow(val) {
        if(val === true) {
          this.getBatchInfo();
          this.tempIsShow = true;
        }
        if(val === false) {
          this.tempIsShow = false;
        }
      },
    },
    props : {
      isShow: "",
      params: Object,
    },
    computed: {
      formatBillType() {
        let dictValue = this.getDictValueFromMap(this.params.dictMap, "DraftTypeCode", this.viewDetailForm.billType);
        return dictValue;
      }
    },
    methods: {
      //获取批次详细信息
      getBatchInfo() {
        let params = this.params;
        post(params, "/ce/impawn/paper/paperUnImpawn/pUnImpawnRgstApplyMain/func_queryBatchInfo").then(res => {
          if(res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              if(res.data.retData !== null) {
                this.viewDetailForm.batchNo = res.data.retData.batchNo;
                this.viewDetailForm.custNo = res.data.retData.custNo;
                this.viewDetailForm.custName = res.data.retData.custName;
                this.viewDetailForm.custAcctNo = res.data.retData.custAcctNo;
                this.viewDetailForm.billType = res.data.retData.billType;
                this.viewDetailForm.unimpawnDt = res.data.retData.unimpawnDt;
                this.viewDetailForm.totalAmt = res.data.retData.totalAmt;
                this.viewDetailForm.totalCount = res.data.retData.totalCount;
                if(this.viewDetailForm.totalAmt !== null && this.viewDetailForm.totalAmt !== ""){
                  this.viewDetailForm.totalAmt = formatNumber(this.viewDetailForm.totalAmt, 2, ',')
                }
              }
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      },
    }
  };
</script>

<style scoped>

</style>
