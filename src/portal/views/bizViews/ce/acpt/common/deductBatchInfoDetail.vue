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
              <h-col span="15" class="val">{{ viewDetailForm.remitDt == null ? "" : this.$moment(viewDetailForm.remitDt,
                "YYYY-MM-DD").format("YYYY-MM-DD") }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.ce.acptType')}}：</h-col>
              <h-col span="15" class="val">{{ getDictValueFromMap(this.dictMap,"AcptType",viewDetailForm.acptType) }}</h-col>
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
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.ce.totalFee')}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.totalFee }}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <h-row :gutter="8">
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.ce.totalCommitFee')}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.totalCommitFee }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.ce.guarntrType')}}：</h-col>
              <h-col span="15" class="val">{{ getDictValueFromMap(this.dictMap,"GuarntrType",viewDetailForm.guarntrType) }}</h-col>
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
    name: "deductBatchInfoDetail",
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
          guarntrType: ''
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
      url:"",
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
        post(params, this.url).then(res => {
          if(res) {
            let msg = res.data.retMsg
            let retCode = res.data.retCode
            if (retCode === "000000") {
              if(res.data.retData !== null && res.data.retData.list.length > 0 ) {
                this.viewDetailForm.drwrCustNo = res.data.retData.list[0].drwrCustNo;
                this.viewDetailForm.drwrName = res.data.retData.list[0].drwrName;
                this.viewDetailForm.drwrAcctNo = res.data.retData.list[0].drwrAcctNo;
                this.viewDetailForm.acptProtocalNo = res.data.retData.list[0].acptProtocalNo;
                this.viewDetailForm.remitDt = res.data.retData.list[0].remitDt;
                this.viewDetailForm.acptType = res.data.retData.list[0].acptType;
                this.viewDetailForm.totalCount = res.data.retData.list[0].totalCount;
                this.viewDetailForm.totalAmt = res.data.retData.list[0].totalAmt;
                this.viewDetailForm.totalFee = res.data.retData.list[0].totalFee;
                this.viewDetailForm.guarntrType = res.data.retData.list[0].guarntrType;
                this.viewDetailForm.totalCommitFee = res.data.retData.list[0].totalCommitFee;
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
