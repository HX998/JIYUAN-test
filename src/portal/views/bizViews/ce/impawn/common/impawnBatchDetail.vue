<!--质押/解质押批次明细-->
<template>
  <div>
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
          <h-col span="8" v-if="viewDetailForm.prodNo.substring(0,4) === '0104'">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.common.custNo')}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.custNo }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8" v-if="viewDetailForm.prodNo.substring(0,4) === '0104'">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.common.custName')}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.custName }}</h-col>
            </h-row>
          </h-col>
          <!--审批 质押申请 解质押申请-->
          <h-col span="8" v-if="viewDetailForm.prodNo === '00401001' || viewDetailForm.prodNo === '00402002'">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.be.pawneeName')}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.custName }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8" v-if="viewDetailForm.prodNo === '00401001' || viewDetailForm.prodNo === '00402002'">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.be.pawneeBrchCode')}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.custBrchCode }}</h-col>
            </h-row>
          </h-col>
          <!--审批 质押确认 解质押确认-->
          <h-col span="8" v-if="viewDetailForm.prodNo === '00401002' || viewDetailForm.prodNo === '00402001'">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.be.pledgorName')}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.custName }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8" v-if="viewDetailForm.prodNo === '00401002' || viewDetailForm.prodNo === '00402001'">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.be.pledgorBrchCode')}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.custBrchCode }}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <h-row :gutter="8">
          <h-col span="8" v-if="viewDetailForm.prodNo === '01040121'">
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
          <h-col span="8" v-if="batchDetailParams.accountType === 'impawn'">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.ce.impawnDt')}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.impawnDt }}
              </h-col>
            </h-row>
          </h-col>
          <h-col span="8" v-if="batchDetailParams.accountType === 'unImpawn'">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.common.unImpawnDt')}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.unimpawnDt }}
              </h-col>
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
              <h-col span="15" class="val">{{ viewDetailForm.sumMoney}}</h-col>
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
    name: "impawnBatchDetail",
    data() {
      return {
        viewDetailForm: {
          batchNo: "",
          custNo: "",
          custName: "",
          custAcctNo: "",
          billType: "",
          impawnDt: "",
          unimpawnDt: "",
          sumCount: "",
          sumMoney: "",
          custBrchCode: "",
          prodNo: "",
        }
      }
    },
    watch: {},
    props: {
      batchDetailParams: {
        type: Object,
        default: {
          dictMap: new Map(),
          batchId: "",
          funcNo: "",
          billClass: "",
          accountType:"",    //区分质押记账和解质押
          detailType: "",     //区分批次明细展现字段
          id: "",             //用于审批
          impawnIds: "",       //用于审批
        }
      }
    },
    computed: {
      formatBillType() {
        let dictValue = this.getDictValueFromMap(this.batchDetailParams.dictMap, "DraftTypeCode", this.viewDetailForm.billType);
        return dictValue;
      }
    },
    methods: {
      //获取批次详细信息,optType-区分质押和解质押，isAudit-是否为审批明细界面
      getImpawnBatchInfo(optType,isAudit, url) {
        let params = {
          id: this.batchDetailParams.batchId,
          billClass: this.batchDetailParams.billClass,
        };
        if (!!this.batchDetailParams.impawnRgstStatusList) {
          params.impawnRgstStatusList = this.batchDetailParams.impawnRgstStatusList;
        }
        if (isAudit === "audit") {
          if (optType === "unImpawn") {
            params = {
              id: this.batchDetailParams.id,
              unImpawnIds: this.batchDetailParams.unImpawnIds
            };
          }else {
            params = {
              id: this.batchDetailParams.id,
              impawnIds: this.batchDetailParams.impawnIds
            };
          }
        }
        if (typeof url === 'undefined' || !url) {
          url = optType === "unImpawn" ? "/ce/unImpawn/batch/info" : "/ce/impawn/batch/queryImpawnBatch";
        }
        post(params, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.viewDetailForm.batchNo = res.data.retData.batchNo;
              this.viewDetailForm.custNo = res.data.retData.custNo;
              this.viewDetailForm.custName = res.data.retData.custName;
              this.viewDetailForm.custAcctNo = res.data.retData.custAcctNo;
              this.viewDetailForm.custBrchCode = res.data.retData.custBrchCode;
              this.viewDetailForm.billType = res.data.retData.billType;
              this.viewDetailForm.impawnDt = res.data.retData.impawnDt;
              //新加的
              this.viewDetailForm.prodNo = res.data.retData.prodNo;
              if (this.viewDetailForm.impawnDt !== null && this.viewDetailForm.impawnDt !== "") {
                this.viewDetailForm.impawnDt = this.$moment(this.viewDetailForm.impawnDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              }
              this.viewDetailForm.unimpawnDt = res.data.retData.unimpawnDt;
              if (this.viewDetailForm.unimpawnDt !== null && this.viewDetailForm.unimpawnDt !== "") {
                this.viewDetailForm.unimpawnDt = this.$moment(this.viewDetailForm.unimpawnDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              }
              this.viewDetailForm.sumCount = res.data.retData.sumCount;
              this.viewDetailForm.sumMoney = res.data.retData.sumMoney;
              if (this.viewDetailForm.sumMoney !== null && this.viewDetailForm.sumMoney !== "") {
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
    }
  };
</script>

<style scoped>

</style>
