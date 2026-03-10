<template>
  <div v-if="tempIsShow">
    <div class="text-wrap mb-10">
      <div class="text-header"><span class="tit">详细信息</span></div>
      <div class="text-body">
        <h-row>
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.common.custName")}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.custName }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.common.custNo")}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.custNo }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.common.custAcctNo")}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.custAcctNo }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.common.createDt')}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.saveBatchDt == null ? "" : this.$moment(viewDetailForm.saveBatchDt,
                "YYYY-MM-DD").format("YYYY-MM-DD") }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.billInfo.billType")}}：</h-col>
              <h-col span="15" class="val">{{ getDictValueFromMap(this.dictMap,"DraftTypeCode",viewDetailForm.billType)}}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.common.batchNo")}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.batchNo }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.pe.totalAmt")}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.totalAmt }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.pe.total")}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.totalCount }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8" v-show="this.params.billClass === 'ME01'">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.pl.checkType")}}：</h-col>
              <h-col span="15" class="val">{{ getDictValueFromMap(this.dictMap,"CheckType",viewDetailForm.checkType) }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.pl.saveBrchName")}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.saveBrchName }}</h-col>
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
    name: "saveBillBatchInfoDetail",
    data() {
      return {
        tempIsShow : false,
        dictMap : new Map(),
        viewDetailForm : {
          custName: '',
          custNo: '',
          custAcctNo: '',
          saveBatchDt: '',
          billType: '',
          batchNo: '',
          totalAmt: '',
          totalCount: '',
          checkType: '',
          saveBrchName: ''
        },
      };
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
      batchInfoUrl: ""
    },
    methods: {
      //获取字典表信息
      getDictInfo() {
        getDictListByGroups("DraftTypeCode,CheckType").then(res => {
          this.dictMap = res.get("map");
        });
      },
      //获取批次详细信息
      getBatchInfo() {
        let params = this.params;
        post(params, this.batchInfoUrl).then(res => {
          if(res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              if(res.data.retData !== null && res.data.retData.list.length > 0) {
                this.viewDetailForm.custName = res.data.retData.list[0].custName;
                this.viewDetailForm.custNo = res.data.retData.list[0].custNo;
                this.viewDetailForm.custAcctNo = res.data.retData.list[0].custAcctNo;
                this.viewDetailForm.saveBatchDt = res.data.retData.list[0].saveBatchDt;
                this.viewDetailForm.billType = res.data.retData.list[0].billType;
                this.viewDetailForm.batchNo = res.data.retData.list[0].batchNo;
                this.viewDetailForm.totalAmt = res.data.retData.list[0].totalAmt;
                this.viewDetailForm.totalCount = res.data.retData.list[0].totalCount;
                this.viewDetailForm.checkType = res.data.retData.list[0].checkType;
                this.viewDetailForm.saveBrchName = res.data.retData.list[0].saveBrchName;
                if(this.viewDetailForm.totalAmt !== null && this.viewDetailForm.totalAmt !== ""){
                  this.viewDetailForm.totalAmt = formatNumber(this.viewDetailForm.totalAmt, 2, ',')
                }
              }else {
                this.viewDetailForm.totalCount = "0";
                this.viewDetailForm.totalAmt = "0";
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
