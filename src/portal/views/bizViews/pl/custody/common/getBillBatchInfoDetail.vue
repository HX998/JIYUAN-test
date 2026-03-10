<template>
  <div v-if="tempIsShow">
    <div class="text-wrap mb-10">
      <div class="text-header"><span class="tit">详细信息</span></div>
      <div class="text-body">
        <h-row :gutter="8">
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.common.custName")}}:</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.custName }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.common.custNo")}}:</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.custNo }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.common.custAcctNo")}}:</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.custAcctNo }}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <h-row :gutter="8">
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.common.createDt')}}:</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.getBatchDt == null ? "" : this.$moment(viewDetailForm.getBatchDt,
                "YYYY-MM-DD").format("YYYY-MM-DD") }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.billInfo.billType")}}:</h-col>
              <h-col span="15" class="val">{{ getDictValueFromMap(this.dictMap,"DraftTypeCode",viewDetailForm.billType)}}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.common.batchNo")}}:</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.batchNo }}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <h-row :gutter="8">
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.pe.totalAmt")}}:</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.totalAmt }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.pe.total")}}:</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.totalCount }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.pl.getWay")}}:</h-col>
              <h-col span="15" class="val">{{ getDictValueFromMap(this.dictMap,"GetWay",viewDetailForm.getWay) }}</h-col>
            </h-row>
          </h-col>
        </h-row>
      </div>
    </div>
  </div>
</template>

<script>
import {formatNumber, getDictListByGroups, post} from "@/api/bizApi/commonUtil";

export default {
    name: "getBillBatchInfoDetail",
    data() {
      return {
        tempIsShow : false,
        dictMap : new Map(),
        viewDetailForm : {
          custName: '',
          custNo: '',
          custAcctNo: '',
          getBatchDt: '',
          billType: '',
          batchNo: '',
          totalAmt: '',
          totalCount: '',
          getWay: '',
          transBrchName: ''
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
        getDictListByGroups("DraftTypeCode,GetWay").then(res => {
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
                let list = res.data.retData.list;
                this.viewDetailForm.custName = list[0].custName;
                this.viewDetailForm.custNo = list[0].custNo;
                this.viewDetailForm.custAcctNo = list[0].custAcctNo;
                this.viewDetailForm.getBatchDt = list[0].getBatchDt;
                this.viewDetailForm.billType = list[0].billType;
                this.viewDetailForm.batchNo = list[0].batchNo;
                this.viewDetailForm.totalAmt = list[0].totalAmt;
                this.viewDetailForm.totalCount = list[0].totalCount;
                this.viewDetailForm.getWay = list[0].getWay;
                this.viewDetailForm.transBrchName = list[0].transBrchName;
                if(this.viewDetailForm.totalAmt !== null && this.viewDetailForm.totalAmt !== ""){
                  this.viewDetailForm.totalAmt = formatNumber(this.viewDetailForm.totalAmt, 2, ',')
                }
              }else {
                this.viewDetailForm.totalCount = "0";
                this.viewDetailForm.totalAmt = "0.00";
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
