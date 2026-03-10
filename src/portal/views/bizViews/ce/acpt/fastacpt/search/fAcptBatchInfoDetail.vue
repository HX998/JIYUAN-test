<template>
  <div v-if="tempIsShow">
    <div class="text-wrap mb-10">
      <div class="text-header"><span class="tit">{{$t('m.i.ce.detailInfo')}}</span></div>
      <div class="text-body">
        <h-row :gutter="8">
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.billInfo.drwrCustNo')}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.drwrCustNo }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.billInfo.drwrName')}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.drwrName }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.billInfo.drwrAcctNo')}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.drwrAcctNo }}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <h-row :gutter="8">
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.billInfo.acptProtocalNo')}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.acptProtocalNo }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.billInfo.remitDt')}}：</h-col>
              <h-col span="15" class="val">{{ (viewDetailForm.remitDt == null || viewDetailForm.remitDt === "") ? "" : this.$moment(viewDetailForm.remitDt,
                "YYYY-MM-DD").format("YYYY-MM-DD") }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.ce.totalCount')}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.totalCount }}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <h-row :gutter="8">
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.ce.totalAmt')}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.totalAmt }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.ce.totalFee')}}：</h-col>
              <h-col span="15" class="val">{{viewDetailForm.totalFee}}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.ce.bailPcetStr')}}：</h-col>
              <h-col span="15" class="val">{{viewDetailForm.bailPcet}}</h-col>

            </h-row>
          </h-col>
        </h-row>
        <h-row :gutter="8">
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.ce.guarntrNo')}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.guarntrNo }}</h-col>
            </h-row>
          </h-col>
        </h-row>
      </div>
    </div>
  </div>
</template>

<script>
  import {post, formatNumber,getDictValueFromMap,getDictListByGroups,accMul} from "@/api/bizApi/commonUtil";

  export default {
    name: "fAcptBatchInfoDetail",
    data() {
      return {
        dictMap: new Map(),
        viewDetailForm: {
          drwrCustNo: '',
          drwrName: '',
          drwrAcctNo: '',
          acptProtocalNo: '',
          remitDt: '',
          totalCount: '',
          totalAmt: '',
          totalFee: '',
          totalCommitFee: '',
          guarntrType: '',
          feeRatio:"",
          commitFeeRatio:"",
          guarntrNo:"",
          bailPcetStr:"",
          bailPcet:""
        }
      }
    },
    watch:{
      isShow(val) {
        if(val === true) {
          this.getBatchInfo();
          this.getDictInfo();
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
      batchUrl : ''
    },
    computed: {
      tempIsShow: {
        get() {
          return this.isShow;
        },
        set() {
        }
      }
    },
    methods: {
      //获取字典表信息
      getDictInfo() {
        getDictListByGroups("AcptType,GuarntrType").then(res => {
          this.dictMap = res.get("map");
        });
      },
      //获取批次详细信息
      getBatchInfo() {
        let params = this.params;
        post(params, this.batchUrl).then(res => {

          if(res) {
            let msg = res.data.retMsg
            let retCode = res.data.retCode
            let retData =res.data.retData;
            if (retCode == "000000") {
              if(res.data.retData!== null) {
                this.viewDetailForm.guarntrNo = retData.guarntrNo;
                this.viewDetailForm.bailPcet = retData.bailPcet;
                this.viewDetailForm.drwrCustNo = retData.drwrCustNo;
                this.viewDetailForm.drwrName = retData.drwrName;
                this.viewDetailForm.drwrAcctNo = retData.drwrAcctNo;
                this.viewDetailForm.acptProtocalNo = retData.acptProtocalNo;
                this.viewDetailForm.remitDt = retData.remitDt;
                this.viewDetailForm.guarntrType = retData.guarntrType;
                this.viewDetailForm.totalCount = retData.totalCount;
                this.viewDetailForm.totalAmt = retData.totalAmt;
                this.viewDetailForm.totalFee = retData.totalFee;
                this.viewDetailForm.totalCommitFee = retData.totalCommitFee;
                this.viewDetailForm.feeRatio = retData.feeRatio;
                this.viewDetailForm.commitFeeRatio = retData.commitFeeRatio;
                if(this.viewDetailForm.totalAmt !== null && this.viewDetailForm.totalAmt !== ""){
                  this.viewDetailForm.totalAmt = formatNumber(this.viewDetailForm.totalAmt, 2, ',')
                }
                if(this.viewDetailForm.totalFee !== null && this.viewDetailForm.totalFee !== ""){
                  this.viewDetailForm.totalFee = formatNumber(this.viewDetailForm.totalFee, 2, ',')
                }
                if(this.viewDetailForm.totalCommitFee !== null && this.viewDetailForm.totalCommitFee !== ""){
                  this.viewDetailForm.totalCommitFee = formatNumber(this.viewDetailForm.totalCommitFee, 2, ',')
                }
                if (this.viewDetailForm.bailPcet !== null && this.viewDetailForm.bailPcet !== "") {
                  this.viewDetailForm.bailPcet = accMul(this.viewDetailForm.bailPcet,100);
                }
              }else {
                this.viewDetailForm.totalCount = "0";
                this.viewDetailForm.totalAmt = "0";
                this.viewDetailForm.totalFee = "0";
                this.viewDetailForm.totalCommitFee = "0";
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
