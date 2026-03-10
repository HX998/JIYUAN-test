<!--出池/入池批次明细-->
<template>
  <div>
    <div class="text-wrap mb-10">
      <div class="text-header"><span class="tit">详细信息</span></div>
      <div class="text-body">
        <h-row :gutter="8">
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.common.batchNo")}}:</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.batchNo }}</h-col>
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
              <h-col span="9" class="label">{{$t("m.i.common.custName")}}:</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.custName }}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <h-row :gutter="8">
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.common.custAcctNo")}}:</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.custAcctNo }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row v-if="batchDetailParams.accountType === 'inPool'">
              <h-col span="9" class="label">{{$t("m.i.pl.inPoolDt")}}:</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.inPoolDt }}
              </h-col>
            </h-row>
            <h-row v-if="batchDetailParams.accountType === 'outPool'">
              <h-col span="9" class="label">{{$t("m.i.pl.outPoolDt")}}:</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.outPoolDt }}
              </h-col>
            </h-row>
          </h-col>
          <h-col span="8" v-if="batchDetailParams.accountType === 'inPool' && batchDetailParams.billClass ==='ME01'">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.pl.isCheckBeforeInPool")}}:</h-col>
              <h-col span="15" class="val">{{ formatIsCheck }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8" v-if="batchDetailParams.accountType === 'outPool'">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.pe.total")}}:</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.sumCount }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8" v-if="batchDetailParams.accountType === 'inPool'">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.pl.discountPcet")}}:</h-col>
              <h-col span="15" class="val">{{ formatDiscountPcet }}</h-col>
            </h-row>
          </h-col>

          <h-col span="8" v-if="batchDetailParams.accountType === 'inPool'">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.pl.saveBrchName")}}:</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.saveBrchName }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8" v-if="batchDetailParams.accountType === 'inPool'">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.pe.total")}}:</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.sumCount }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8" v-if="batchDetailParams.accountType === 'outPool'">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.pe.totalAmt")}}:</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.sumMoney}}</h-col>
            </h-row>
          </h-col>
          <h-col span="8" v-if="batchDetailParams.accountType === 'inPool'">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.pe.totalAmt")}}:</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.sumMoney}}</h-col>
            </h-row>
          </h-col>
        </h-row>
      </div>
    </div>
  </div>
</template>

<script>
  import { post, formatNumber, accMul } from "@/api/bizApi/commonUtil";

  export default {
    name: "ioPoolBatchDetail",
    data() {
      return {
        viewDetailForm : {
          batchNo: "",
          custNo: "",
          custName: "",
          custAcctNo: "",
          inPoolDt: "",
          outPoolDt: "",
          isCheckBeforeInPool: "",
          discountPcet: "",
          saveBrchName: "",
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
          batchId: "",
          funcNo: "",
          billClass: "",
          accountType:"",    //区分入池和出池记账
          id: "",             //用于审批
          listIds: "",       //用于审批
          batchInfoUrl: ""   //查询批次信息对应Url
        }
      }
    },
    computed: {
      formatIsCheck() {
        let isCheckBeforeInPool = this.viewDetailForm.isCheckBeforeInPool ? this.viewDetailForm.isCheckBeforeInPool : "0";
        return this.getDictValueFromMap(this.batchDetailParams.dictMap, "Yon", isCheckBeforeInPool);
      },
      formatDiscountPcet() {
        let discountPcet = this.viewDetailForm.discountPcet;
        if (!isNaN(parseFloat(discountPcet)) && isFinite(discountPcet)) {
          discountPcet = discountPcet == null ? "0.00" : accMul(discountPcet, 100);
        }
        return discountPcet;
      }
    },
    methods: {
      //获取批次详细信息,isAudit-是否为审批明细界面
      getIoPoolBatchInfo(isAudit) {
        let params = {
          batchId:this.batchDetailParams.batchId,
          billClass: this.batchDetailParams.billClass,
          funcNo: this.batchDetailParams.funcNo
        };
        if (!!this.batchDetailParams.impawnRgstStatusList) {
          params.impawnRgstStatusList = this.batchDetailParams.impawnRgstStatusList;
        }
        if (!!this.batchDetailParams.unImpawnRgstStatusList) {
          params.unImpawnRgstStatusList = this.batchDetailParams.unImpawnRgstStatusList;
        }
        if (isAudit === "audit") {
          params = {
            batchId: this.batchDetailParams.id,
            listIds: this.batchDetailParams.listIds
          };
        }
        post(params, this.batchDetailParams.batchInfoUrl).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.viewDetailForm.batchNo = res.data.retData.batchNo;
              this.viewDetailForm.custNo = res.data.retData.custNo;
              this.viewDetailForm.custName = res.data.retData.custName;
              this.viewDetailForm.custAcctNo = res.data.retData.custAcctNo;
              if (this.batchDetailParams.accountType === "inPool") {
                this.viewDetailForm.inPoolDt = res.data.retData.inPoolDt;
                if (this.viewDetailForm.inPoolDt !== null && this.viewDetailForm.inPoolDt !== "") {
                  this.viewDetailForm.inPoolDt = this.$moment(this.viewDetailForm.inPoolDt, "YYYY-MM-DD").format("YYYY-MM-DD");
                }
                this.viewDetailForm.isCheckBeforeInPool = res.data.retData.isCheckBeforeInPool;
                this.viewDetailForm.discountPcet = res.data.retData.discountPcet;
                this.viewDetailForm.saveBrchName = res.data.retData.saveBrchName;
              } else if (this.batchDetailParams.accountType === "outPool") {
                this.viewDetailForm.outPoolDt = res.data.retData.outPoolDt;
                if (this.viewDetailForm.outPoolDt !== null && this.viewDetailForm.outPoolDt !== "") {
                  this.viewDetailForm.outPoolDt = this.$moment(this.viewDetailForm.outPoolDt, "YYYY-MM-DD").format("YYYY-MM-DD");
                }
              }
              this.viewDetailForm.sumCount = res.data.retData.totalCount;
              this.viewDetailForm.sumMoney = res.data.retData.totalAmt;
              if (this.viewDetailForm.sumMoney !== null && this.viewDetailForm.sumMoney !== "") {
                this.viewDetailForm.sumMoney = formatNumber(this.viewDetailForm.sumMoney, 2, ",");
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
