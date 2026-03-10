<template>
  <div v-if="tempIsShow">
    <div class="text-wrap mb-10">
      <div class="text-header"><span class="tit">{{$t('m.i.ce.detailInfo')}}</span></div>
      <div class="text-body">
        <h-row :gutter="8">
          <h-col span="8">
            <h-row>
              <h-col span="10" class="label">{{$t('m.i.billInfo.drwrCustNo')}}：</h-col>
              <h-col span="14" class="val">{{ viewDetailForm.drwrCustNo }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="10" class="label">{{$t('m.i.billInfo.drwrName')}}：</h-col>
              <h-col span="14" class="val">{{ viewDetailForm.drwrName }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="10" class="label">{{$t('m.i.billInfo.drwrAcctNo')}}：</h-col>
              <h-col span="14" class="val">{{  viewDetailForm.drwrAcctNo }}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <h-row :gutter="8">
          <h-col span="8">
            <h-row>
              <h-col span="10" class="label">{{$t('m.i.billInfo.acptProtocalNo')}}：</h-col>
              <h-col span="14" class="val">{{ viewDetailForm.acptProtocalNo }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="10" class="label">{{$t('m.i.billInfo.remitDt')}}：</h-col>
              <h-col span="14" class="val">{{ viewDetailForm.remitDt == null ? "" : this.$moment(viewDetailForm.remitDt,
                "YYYY-MM-DD").format("YYYY-MM-DD") }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="10" class="label">{{$t('m.i.ce.acptType')}}：</h-col>
              <h-col span="14" class="val">{{ getDictValueFromMap(this.dictMap,"AcptType",viewDetailForm.acptType) }}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <h-row :gutter="8">
          <h-col span="8">
            <h-row>
              <h-col span="10" class="label">{{$t('m.i.billInfo.drwrSocCode')}}：</h-col>
              <h-col span="14" class="val">{{ viewDetailForm.drwrSocCode }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="10" class="label">{{$t('m.i.billInfo.drwrIndustry')}}：</h-col>
              <h-col span="14" class="val">{{ getDictValueFromMap(this.dictMap,"Industry",this.viewDetailForm.drwrIndustry) }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="10" class="label">{{$t('m.i.billInfo.drwrCorpScale')}}：</h-col>
              <h-col span="14" class="val">{{ getDictValueFromMap(this.dictMap,"CorpScale",this.viewDetailForm.drwrCorpScale) }}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <h-row :gutter="8">
          <h-col span="8">
            <h-row>
              <h-col span="10" class="label">{{$t('m.i.billInfo.isDrwrArc')}}：</h-col>
              <h-col span="14" class="val">{{ getDictValueFromMap(this.dictMap,"Yon",this.viewDetailForm.isDrwrArc) }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="10" class="label">{{$t('m.i.billInfo.drwrArea')}}：</h-col>
              <h-col span="14" class="val">{{ getDictValueFromMap(this.dictMap,"Province",this.viewDetailForm.drwrArea) }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="10" class="label">{{$t('m.i.billInfo.isDrwrGrn')}}：</h-col>
              <h-col span="14" class="val">{{ getDictValueFromMap(this.dictMap,"Yon",this.viewDetailForm.isDrwrGrn) }}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <h-row :gutter="8">
          <h-col span="8">
            <h-row>
              <h-col span="10" class="label">{{$t('m.i.ce.totalCount')}}：</h-col>
              <h-col span="14" class="val">{{ viewDetailForm.totalCount }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="10" class="label">{{$t('m.i.ce.totalAmt')}}：</h-col>
              <h-col span="14" class="val">{{ viewDetailForm.totalAmt }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="10" class="label">{{$t('m.i.ce.totalFee')}}：</h-col>
              <h-col span="14" class="val">{{ viewDetailForm.totalFee }}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <h-row :gutter="8">
          <h-col span="8">
            <h-row>
              <h-col span="10" class="label">{{$t('m.i.ce.totalCommitFee')}}：</h-col>
              <h-col span="14" class="val">{{ viewDetailForm.totalCommitFee }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="10" class="label">{{$t('m.i.ce.guarntrType')}}：</h-col>
              <h-col span="14" class="val">{{ getDictValueFromMap(this.dictMap,"GuarntrType",viewDetailForm.guarntrType) }}</h-col>
            </h-row>
          </h-col>
        </h-row>
      </div>
    </div>
  </div>
</template>

<script>
  import {post, formatNumber,getDictValueFromMap,getDictListByGroups} from "@/api/bizApi/commonUtil";

  export default {
    name: "acptRegisterBatchInfoDetail",
    data() {
      return {
        tempIsShow: false,
        dictMap: new Map(),
        viewDetailForm: {
          drwrCustNo: '',
          drwrName: '',
          drwrAcctNo: '',
          acptProtocalNo: '',
          remitDt: '',
          acptType: '',
          totalCount: '',
          totalAmt: '',
          totalFee: '',
          totalCommitFee: '',
          drwrSocCode: '',
          drwrIndustry: '',
          drwrCorpScale: '',
          isDrwrArc: '',
          drwrArea: '',
          isDrwrGrn: '',
          guarntrType: ''
        }
      }
    },
    watch:{
      isShow(val) {
        if(val === true) {
          this.getDictInfo();
          this.getBatchInfo();
          this.tempIsShow = true;
        }
        if(val === false) {
          this.resetViewDetailForm;
          this.tempIsShow = false;
        }
      },
    },
    props: {
      isShow: "",
      params: Object,
      custNo: "",
      batchUrl : '',
      custUrl : {
        type : String,
        default (){
          return "/bm/cust/corp/getCustCorpByCustNo";
        }
      }
    },
    mounted() {
    },
    methods: {
      getDictInfo() {
        getDictListByGroups("AcptType,Industry,CorpScale,Yon,Province,GuarntrType").then(res => {
          this.dictMap = res.get("map");
        });
      },
      resetViewDetailForm() {
        this.viewDetailForm.drwrCustNo = '';
        this.viewDetailForm.drwrName = '';
        this.viewDetailForm.drwrAcctNo = '';
        this.viewDetailForm.acptProtocalNo = '';
        this.viewDetailForm.remitDt = '';
        this.viewDetailForm.acptType = '';
        this.viewDetailForm.totalCount = '';
        this.viewDetailForm.totalAmt = '';
        this.viewDetailForm.totalFee = '';
        this.viewDetailForm.totalCommitFee = '';
        this.viewDetailForm.drwrSocCode = '';
        this.viewDetailForm.drwrIndustry = '';
        this.viewDetailForm.drwrCorpScale = '';
        this.viewDetailForm.isDrwrArc = '';
        this.viewDetailForm.drwrArea = '';
        this.viewDetailForm.isDrwrGrn = '';
        this.viewDetailForm.guarntrType = '';
      },
      //获取批次详细信息
      getBatchInfo() {
        let params = this.params;
        post(params, this.batchUrl).then(res => {
          if(res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              if(res.data.retData !== null) {
                this.viewDetailForm.drwrCustNo = res.data.retData.drwrCustNo;
                this.viewDetailForm.drwrName = res.data.retData.drwrName;
                this.viewDetailForm.drwrAcctNo = res.data.retData.drwrAcctNo;
                this.viewDetailForm.acptProtocalNo = res.data.retData.acptProtocalNo;
                this.viewDetailForm.remitDt = res.data.retData.remitDt;
                this.viewDetailForm.acptType = res.data.retData.acptType;
                this.viewDetailForm.guarntrType = res.data.retData.guarntrType;
                this.viewDetailForm.totalCount = res.data.retData.totalCount;
                this.viewDetailForm.totalAmt = res.data.retData.totalAmt;
                this.viewDetailForm.totalFee = res.data.retData.totalFee;
                this.viewDetailForm.totalCommitFee = res.data.retData.totalCommitFee;
                if(this.viewDetailForm.totalAmt !== null && this.viewDetailForm.totalAmt !== ""){
                  this.viewDetailForm.totalAmt = formatNumber(this.viewDetailForm.totalAmt, 2, ',')
                }
                if(this.viewDetailForm.totalFee !== null && this.viewDetailForm.totalFee !== ""){
                  this.viewDetailForm.totalFee = formatNumber(this.viewDetailForm.totalFee, 2, ',')
                }
                if(this.viewDetailForm.totalCommitFee !== null && this.viewDetailForm.totalCommitFee !== ""){
                  this.viewDetailForm.totalCommitFee = formatNumber(this.viewDetailForm.totalCommitFee, 2, ',')
                }
              }else {
                this.viewDetailForm.totalCount = "0";
                this.viewDetailForm.totalAmt = "0";
                this.viewDetailForm.totalFee = "0";
                this.viewDetailForm.totalCommitFee = "0";
              }
              this.getCustCorpInfo();
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      },
      //获取客户信息
      getCustCorpInfo() {
        post({code: this.custNo}, this.custUrl).then(res => {
          if(res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              if(res.data.retData !== null) {
                this.viewDetailForm.drwrSocCode = res.data.retData.socCode;
                this.viewDetailForm.drwrIndustry = res.data.retData.industryCategory;
                this.viewDetailForm.drwrCorpScale = res.data.retData.corpScale;
                this.viewDetailForm.isDrwrArc = res.data.retData.isArc;
                this.viewDetailForm.drwrArea = res.data.retData.area;
                this.viewDetailForm.isDrwrGrn = res.data.retData.isGreenCorp;
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
