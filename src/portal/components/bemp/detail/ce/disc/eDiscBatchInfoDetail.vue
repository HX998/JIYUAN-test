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
              <h-col span="15" class="val">{{ getDictValueFromMap(this.dictMap,"DraftTypeCode",viewDetailForm.billType) }}
              </h-col>
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
              <h-col span="15" class="val">{{ viewDetailForm.redeemOpenDt == null ? "" :
                this.$moment(viewDetailForm.redeemOpenDt, "YYYY-MM-DD").format("YYYY-MM-DD") }}
              </h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.ce.redeemDueDt')}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.redeemDueDt == null ? "" :
                this.$moment(viewDetailForm.redeemDueDt, "YYYY-MM-DD").format("YYYY-MM-DD") }}
              </h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
             <h-col span="9" class="label">{{$t('m.i.ce.clearMark')}}：</h-col>
              <h-col span="15" class="val">{{ getDictValueFromMap(this.dictMap,"SettlementMarkCode",viewDetailForm.clearMark) }}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <h-row :gutter="8">
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.billInfo.discDt')}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.discDt == null ? "" : this.$moment(viewDetailForm.discDt,
                "YYYY-MM-DD").format("YYYY-MM-DD") }}
              </h-col>
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
              <h-col span="9" class="label">{{$t('m.i.ce.interestMethod')}}：</h-col>
              <h-col span="15" class="val">{{ getDictValueFromMap(this.dictMap,"PayType",viewDetailForm.payType) }}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <h-row :gutter="8" v-if="viewDetailForm.payType == '1'">
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.ce.buyerPayInterName')}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.payCustName }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.ce.buyerPayInterAcctNo')}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.payAcctNo }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.ce.buyPayPcetByUnit')}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.buyPayPcet }}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <h-row :gutter="8" v-if="viewDetailForm.payType == '2'">
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.ce.salerCustName')}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.custName }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.ce.salerAcctNo')}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.custAcctNo }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.ce.salerPayPcet')}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.salerPayPcet }}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <h-row :gutter="8" v-if="viewDetailForm.payType == '4'">
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.ce.thirdCustName')}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.thirdCustName }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.ce.thirdAcctNo')}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.thirdAcctNo }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.ce.thirdPayPcet')}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.thirdPayPcet }}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <h-row :gutter="8" v-if="viewDetailForm.payType == '3'">
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.ce.buyerPayInterName')}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.payCustName }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.ce.buyerPayInterAcctNo')}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.payAcctNo }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.ce.buyPayPcetByUnit')}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.buyPayPcet }}</h-col>
            </h-row>
          </h-col>


          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.ce.salerCustName')}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.custName }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.ce.salerAcctNo')}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.custAcctNo }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.ce.salerPayPcet')}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.salerPayPcet }}</h-col>
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
          <h-col span="8" v-if="viewDetailForm.payType == '1' || viewDetailForm.payType == '3'">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.ce.sumBuyerInterest')}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.sumBuyerInterest }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8" v-if="viewDetailForm.payType == '4'">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.ce.sumThirdInterest')}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.sumThirdInterest }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8" v-if="viewDetailForm.payType == '2' || viewDetailForm.payType == '3'">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.ce.sumSellerInterest')}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.sumSalerInterest }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.ce.sumInterest')}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.sumInterest }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.ce.sumRealPayAmt')}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.sumRealPayAmt }}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <h-row :gutter="8">
          <h-col span="8">
            <h-row v-if="viewDetailForm.payAcctType">
              <h-col span="9" class="label">{{$t('m.i.ce.payAcctType')}}：</h-col>
              <h-col span="15" class="val">{{ getDictValueFromMap(this.dictMap,"PayAcctTypeCode",viewDetailForm.payAcctType) }}</h-col>
            </h-row>
          </h-col>
        </h-row>
      </div>
    </div>
  </div>
</template>

<script>
  import { post, on, off, getDictValueFromMap, getDictListByGroups ,formatNumber,accMul} from "@/api/bizApi/commonUtil";

  export default {
    name: "eDiscBatchInfoDetail",
    data() {
      return {
        tempIsShow : false,
        viewDetailForm : {
          prodNo: "",
          billType: "",
          custNo: "",
          custName: "",
          custAcctNo: "",
          aoAcctNo: "",
          redeemOpenDt: "",
          redeemDueDt: "",
          clearMark: "",
          discDt: "",
          rate: "",
          payType: "",
          payCustName: "",
          payAcctNo: "",
          buyPayPcet: "",
          salerPayPcet: "",
          thirdPayPcet: "",
          sumCount: "",
          sumMoney: "",
          sumBuyerInterest: "",
          sumSalerInterest: "",
          sumThirdInterest: "",
          //总实收利息
          sumInterest:"",
          //支付贴现人总金额
          sumRealPayAmt:""
        },
        busiTypeList : [],
        dictMap : new Map(),
      };
    },
    watch: {
      operType(val) {
        if (this.operType === "add") {
          this.viewDetailForm = [];
          this.tempIsShow = true;
        }else if(this.operType === "modify"){
          this.tempIsShow = true;
          this.getBatchInfo();
        }
      },
      isShow(val) {
        if (val === true) {
          this.tempIsShow = true;
        }
        if (val === false) {
          this.tempIsShow = false;
        }
      },
      isQuery(val){
        if(val === true && this.batchId !== ""){
          this.getBatchInfo();
        }
      }
    },
    props: {
      batchId: "",
      operType: "",
      isShow: "",
      isQuery:"",
      funcNo:"",
      batchUrl : {
        type : String,
        default (){
          return "/ce/disc/batch/queryDiscBatch";
        }
      },
    },
    mounted() {
      getDictListByGroups("DraftTypeCode,PayType,SettleType,SettlementMarkCode,PayAcctTypeCode").then(res => {

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
        post({ id: this.batchId ,funcNo:this.funcNo }, this.batchUrl).then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.viewDetailForm = res.data.retData;
              if(this.viewDetailForm.buyPayPcet === null || this.viewDetailForm.buyPayPcet === ""){
                if(this.viewDetailForm.payType === "1") {
                  this.viewDetailForm.buyPayPcet = "100";
                }else if(this.viewDetailForm.payType === "2") {
                  this.viewDetailForm.buyPayPcet = "0";
                }
              }
              if(this.viewDetailForm.payType === "1") {
                this.viewDetailForm.buyPayPcet = "100";
              }else if(this.viewDetailForm.payType === "2") {
                this.viewDetailForm.buyPayPcet = "0";
                this.viewDetailForm.salerPayPcet = "100";
              } else if(this.viewDetailForm.payType === "3") {
                this.viewDetailForm.salerPayPcet = 100 - this.viewDetailForm.buyPayPcet;
              } else if(this.viewDetailForm.payType === "4") {
                this.viewDetailForm.thirdPayPcet = "100";
              }
              if(this.viewDetailForm.buyPayPcet !== null && this.viewDetailForm.buyPayPcet !== ""){
                this.viewDetailForm.buyPayPcet = this.viewDetailForm.buyPayPcet;
              }
              if(this.viewDetailForm.salerPayPcet !== null && this.viewDetailForm.salerPayPcet !== ""){
                this.viewDetailForm.salerPayPcet = this.viewDetailForm.salerPayPcet;
              }
              if(this.viewDetailForm.thirdPayPcet !== null && this.viewDetailForm.thirdPayPcet !== ""){
                this.viewDetailForm.thirdPayPcet = this.viewDetailForm.thirdPayPcet;
              }
              if(this.viewDetailForm.sumMoney !== null && this.viewDetailForm.sumMoney !== ""){
                this.viewDetailForm.sumMoney = formatNumber(this.viewDetailForm.sumMoney, 2, ',');
                this.viewDetailForm.sumBuyerInterest = formatNumber(this.viewDetailForm.sumBuyerInterest, 2, ',');
                this.viewDetailForm.sumSalerInterest = formatNumber(this.viewDetailForm.sumSalerInterest, 2, ',');
                this.viewDetailForm.sumThirdInterest = formatNumber(this.viewDetailForm.sumInterest, 2, ',');
                this.viewDetailForm.sumInterest = formatNumber(this.viewDetailForm.sumInterest, 2, ',');
                this.viewDetailForm.sumRealPayAmt = formatNumber(this.viewDetailForm.sumRealPayAmt, 2, ',');
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
