<template>
  <div v-if="tempIsShow">
    <div class="text-wrap mb-10">
      <div class="text-header"><span class="tit">{{$t('m.i.ce.detailInfo')}}</span></div>
      <div class="text-body">
        <h-row :gutter="8">
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.common.busiType')}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.prodName }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.billInfo.billType')}}：</h-col>
              <h-col span="15" class="val">{{ getDictValueFromMap(this.dictMap,"DraftTypeCode",viewDetailForm.billType) }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.common.custNo')}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.custNo }}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <h-row :gutter="8">
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.common.custName')}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.custName }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.common.custAcctNo')}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.custAcctNo }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.ce.recvAcctNo')}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.aoAcctNo }}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <h-row :gutter="8">
          <h-col span="8">
            <h-row>
             <h-col span="9" class="label">{{$t('m.i.ce.redeemOpenDt')}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.redeemOpenDt == null ? "" : this.$moment(viewDetailForm.redeemOpenDt,
                "YYYY-MM-DD").format("YYYY-MM-DD") }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.ce.redeemDueDt')}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.redeemDueDt == null ? "" : this.$moment(viewDetailForm.redeemDueDt,
                "YYYY-MM-DD").format("YYYY-MM-DD") }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.ce.actulRedeemDueDt')}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.realRedeemDt == null ? "" : this.$moment(viewDetailForm.realRedeemDt,
                "YYYY-MM-DD").format("YYYY-MM-DD") }}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <h-row :gutter="8">
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.billInfo.discDt')}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.discDt == null ? "" : this.$moment(viewDetailForm.discDt,
                "YYYY-MM-DD").format("YYYY-MM-DD") }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.billInfo.discInterestRate')}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.ratePct }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.ce.redeemRate')}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.redeemRatePct }}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <h-row :gutter="8">
          <h-col span="8">
            <h-row>
             <h-col span="9" class="label">{{$t('m.i.ce.clearMark')}}：</h-col>
              <h-col span="15" class="val">{{ getDictValueFromMap(this.dictMap,"SettlementMarkCode",viewDetailForm.clearMark) }}</h-col>
            </h-row>
          </h-col>

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
        <h-row :gutter="8">
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.ce.totalPayInterest')}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.totalInterest }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.ce.totalSaleReceiveAmt')}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.totalSaleReceiveAmt  }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.ce.orgnlBatchNo')}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.orgnlBatchNo}}</h-col>
            </h-row>
          </h-col>
        </h-row>
      </div>
    </div>
  </div>
</template>

<script>
  import { post,on,off ,getDictListByGroups ,formatNumber ,getDictValueFromMap,accMul} from "@/api/bizApi/commonUtil";
  export default {
    name: "eDiscBackInfoDetail",
    data() {
      return {
        tempIsShow : false,
        viewDetailForm : {
          prodName:"",
          billType:"",
          custNo:"",
          custName:"",
          custAcctNo:"",
          aoAcctNo:"",
          redeemOpenDt:"",
          redeemDueDt:"",
          realRedeemDt:"",
          clearMark:"",
          discDt:"",
          rate:"",
          sumCount:"",
          sumMoney:"",
          totalInterest:"",
          orgnlBatchNo:"",
          totalSaleReceiveAmt:""
        },
        dictMap : new Map(),
      };
    },
    watch:{
      isShow(val) {
        if(val === true) {
          this.tempIsShow = true;
        }
        if(val === false) {
          this.tempIsShow = false;
        }
      },
      isQuery(val) {
        if (val === true && this.batchId !== "") {
          this.viewDetailForm = {};
          this.getBatchInfo();
        }
      }
    },
    props : {
      batchId: "",
      isShow: "",
      funcNo:"",
      isQuery:"",
      batchUrl : {
        type : String,
        default (){
          return "/ce/discBack/batch/queryDiscBackBatch";
        }
      },
    },
    mounted() {
      getDictListByGroups("DraftTypeCode,PayType,SettleType,SettlementMarkCode").then(res => {

        let dictList = [];
        let settlementMarkCodeList = res.get("SettlementMarkCode");
        let settleTypeList =res.get("SettleType");
        for (let i = 0; i < settlementMarkCodeList.length+settleTypeList.length; i++) {
          if(i< settlementMarkCodeList.length){
            dictList[i]=settlementMarkCodeList[i];
          }
          if(settlementMarkCodeList.length<=i){
            let obj = settleTypeList[i-settlementMarkCodeList.length];
            obj.dictGroupCode="SettlementMarkCode";
            res.get("map").get(obj.dictGroupCode).set(obj.key,obj.value);
            dictList[i]= obj;
          }
        }
        res.set("SettlementMarkCode",dictList);
        this.dictMap = res.get("map");
      });
    },
    methods: {
      getBatchInfo() {
        //获取批次详细信息
        post({id: this.batchId , funcNo:this.funcNo}, this.batchUrl).then(res => {
          if(res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.viewDetailForm = res.data.retData;
              if(this.viewDetailForm.redeemRate != null && this.viewDetailForm.redeemRate !== ""){
                this.$emit("getRedeemRate", this.viewDetailForm.redeemRate);
              }
              if(this.viewDetailForm.sumMoney !== null && this.viewDetailForm.sumMoney !== ""){
                this.viewDetailForm.sumMoney = formatNumber(this.viewDetailForm.sumMoney, 2, ',');
                this.viewDetailForm.totalInterest = formatNumber(this.viewDetailForm.totalInterest, 2, ',');
                this.viewDetailForm.totalSaleReceiveAmt = formatNumber(this.viewDetailForm.totalSaleReceiveAmt, 2, ',');
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
