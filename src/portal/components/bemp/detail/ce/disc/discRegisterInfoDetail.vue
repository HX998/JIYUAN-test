  <template>
  <div v-if="tempIsShow">
    <div class="text-wrap mb-10">
      <div class="text-header"><span class="tit">{{$t('m.i.ce.detailInfo')}}</span></div>
      <div class="text-body">
        <h-row :gutter="8">
          <h-col span="8">
            <h-row>
              <h-col span="10" class="label">{{$t('m.i.common.busiType')}}：</h-col>
              <h-col span="14" class="val">{{ viewDetailForm.prodName }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="10" class="label">{{$t('m.i.billInfo.billType')}}：</h-col>
              <h-col span="14" class="val">{{ getDictValueFromMap(this.dictMap,"DraftTypeCode",viewDetailForm.billType) }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="10" class="label">{{$t('m.i.common.custNo')}}：</h-col>
              <h-col span="14" class="val">{{ viewDetailForm.custNo }}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <h-row :gutter="8">
          <h-col span="8">
            <h-row>
              <h-col span="10" class="label">{{$t('m.i.common.custName')}}：</h-col>
              <h-col span="14" class="val">{{ viewDetailForm.custName }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="10" class="label">{{$t('m.i.common.custAcctNo')}}：</h-col>
              <h-col span="14" class="val">{{ viewDetailForm.custAcctNo }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="10" class="label">{{$t('m.i.ce.recvAcctNo')}}：</h-col>
              <h-col span="14" class="val">{{ viewDetailForm.aoAcctNo }}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <h-row :gutter="8">
          <h-col span="8">
            <h-row>
              <h-col span="10" class="label">{{$t('m.i.ce.discountSocCode')}}：</h-col>
              <h-col span="14" class="val">{{ viewDetailForm.dsctOutInfSocCode}}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="10" class="label">{{$t('m.i.ce.discountIndustry')}}：</h-col>
              <h-col span="14" class="val">{{industryCategoryName }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="10" class="label">{{$t('m.i.ce.discountCorpScale')}}：</h-col>
              <h-col span="14" class="val">{{ getDictValueFromMap(this.dictMap,"CorpScale",viewDetailForm.dsctOutInfCorpScale) }}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <h-row :gutter="8">
          <h-col span="8">
            <h-row>
              <h-col span="10" class="label">{{$t('m.i.ce.discountIsArc')}}：</h-col>
              <h-col span="14" class="val">{{ getDictValueFromMap(this.dictMap,"Yon",viewDetailForm.dsctOutInfArcFlag) }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="10" class="label">{{$t('m.i.ce.discountArea')}}：</h-col>
              <h-col span="14" class="val">{{ getDictValueFromMap(this.dictMap,"Province",viewDetailForm.dsctOutInfArea) }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="10" class="label">{{$t('m.i.ce.discountiIsGreenCorp')}}：</h-col>
              <h-col span="14" class="val">{{ getDictValueFromMap(this.dictMap,"Yon",viewDetailForm.dsctOutInfGrnFlag) }}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <h-row :gutter="8">
          <h-col span="8">
            <h-row>
              <h-col span="10" class="label">{{$t('m.i.billInfo.discDt')}}：</h-col>
              <h-col span="14" class="val">{{ viewDetailForm.discDt == null ? "" : this.$moment(viewDetailForm.discDt,
                "YYYY-MM-DD").format("YYYY-MM-DD") }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="10" class="label">{{$t('m.i.billInfo.discInterestRate')}}：</h-col>
              <h-col span="14" class="val">{{ viewDetailForm.ratePct }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="10" class="label">{{$t('m.i.ce.interestMethod')}}：</h-col>
              <h-col span="14" class="val">{{ getDictValueFromMap(this.dictMap,"PayType",viewDetailForm.payType) }}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <h-row :gutter="8" v-if="viewDetailForm.payType == '1'">
          <h-col span="8">
            <h-row>
              <h-col span="10" class="label">{{$t('m.i.ce.buyerPayInterName')}}：</h-col>
              <h-col span="14" class="val">{{ viewDetailForm.payCustName }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="10" class="label">{{$t('m.i.ce.buyerPayInterAcctNo')}}：</h-col>
              <h-col span="14" class="val">{{ viewDetailForm.payAcctNo }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="10" class="label">{{$t('m.i.ce.buyPayPcetByUnit')}}：</h-col>
              <h-col span="14" class="val">{{ viewDetailForm.buyPayPcet }}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <h-row :gutter="8" v-if="viewDetailForm.payType == '2'">
          <h-col span="8">
            <h-row>
              <h-col span="10" class="label">{{$t('m.i.ce.salerCustName')}}：</h-col>
              <h-col span="14" class="val">{{ viewDetailForm.custName }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="10" class="label">{{$t('m.i.ce.salerAcctNo')}}：</h-col>
              <h-col span="14" class="val">{{ viewDetailForm.custAcctNo }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="10" class="label">{{$t('m.i.ce.salerPayPcet')}}：</h-col>
              <h-col span="14" class="val">{{ viewDetailForm.salerPayPcet }}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <h-row :gutter="8" v-if="viewDetailForm.payType == '4'">
          <h-col span="8">
            <h-row>
              <h-col span="10" class="label">{{$t('m.i.ce.thirdCustName')}}：</h-col>
              <h-col span="14" class="val">{{ viewDetailForm.thirdCustName }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="10" class="label">{{$t('m.i.ce.thirdAcctNo')}}：</h-col>
              <h-col span="14" class="val">{{ viewDetailForm.thirdAcctNo }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="10" class="label">{{$t('m.i.ce.thirdPayPcet')}}：</h-col>
              <h-col span="14" class="val">{{ viewDetailForm.thirdPayPcet }}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <h-row :gutter="8" v-if="viewDetailForm.payType == '3'">
          <h-col span="8">
            <h-row>
              <h-col span="10" class="label">{{$t('m.i.ce.buyerPayInterName')}}：</h-col>
              <h-col span="14" class="val">{{ viewDetailForm.payCustName }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="10" class="label">{{$t('m.i.ce.buyerPayInterAcctNo')}}：</h-col>
              <h-col span="14" class="val">{{ viewDetailForm.payAcctNo }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="10" class="label">{{$t('m.i.ce.buyPayPcetByUnit')}}：</h-col>
              <h-col span="14" class="val">{{ viewDetailForm.buyPayPcet }}</h-col>
            </h-row>
          </h-col>


          <h-col span="8">
            <h-row>
              <h-col span="10" class="label">{{$t('m.i.ce.salerCustName')}}：</h-col>
              <h-col span="14" class="val">{{ viewDetailForm.custName }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="10" class="label">{{$t('m.i.ce.salerAcctNo')}}：</h-col>
              <h-col span="14" class="val">{{ viewDetailForm.custAcctNo }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="10" class="label">{{$t('m.i.ce.salerPayPcet')}}：</h-col>
              <h-col span="14" class="val">{{ viewDetailForm.salerPayPcet }}</h-col>
            </h-row>
          </h-col>
        </h-row>

        <h-row :gutter="8">
          <h-col span="8">
            <h-row>
              <h-col span="10" class="label">{{$t('m.i.ce.totalCount')}}：</h-col>
              <h-col span="14" class="val">{{ viewDetailForm.sumCount }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="10" class="label">{{$t('m.i.ce.totalAmt')}}：</h-col>
              <h-col span="14" class="val">{{ viewDetailForm.sumMoney }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8" v-if="viewDetailForm.payType == '1' || viewDetailForm.payType == '3'">
            <h-row>
              <h-col span="10" class="label">{{$t('m.i.ce.sumBuyerInterest')}}：</h-col>
              <h-col span="14" class="val">{{ viewDetailForm.sumBuyerInterest }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8" v-if="viewDetailForm.payType == '2' || viewDetailForm.payType == '3'">
            <h-row>
              <h-col span="10" class="label">{{$t('m.i.ce.sumSellerInterest')}}：</h-col>
              <h-col span="14" class="val">{{ viewDetailForm.sumSalerInterest }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8" v-if="viewDetailForm.payType == '4'">
            <h-row>
              <h-col span="10" class="label">{{$t('m.i.ce.sumThirdInterest')}}：</h-col>
              <h-col span="14" class="val">{{ viewDetailForm.sumThirdInterest }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="10" class="label">{{$t('m.i.ce.sumInterest')}}：</h-col>
              <h-col span="14" class="val">{{ viewDetailForm.sumInterest }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="10" class="label">{{$t('m.i.ce.sumRealPayAmt')}}：</h-col>
              <h-col span="14" class="val">{{ viewDetailForm.sumRealPayAmt }}</h-col>
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
    name: "discRegisterInfoDetail",
    data() {
      return {
        tempIsShow : false,
        viewDetailForm : {
          prodName: "",
          billType: "",
          custNo: "",
          custName: "",
          custAcctNo: "",
          aoAcctNo: "",
          dsctOutInfSocCode:"",
          industryCategory:"",
          dsctOutInfCorpScale:"",
          dsctOutInfArcFlag:"",
          dsctOutInfArea:"",
          dsctOutInfGrnFlag:"",
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
          sumRealPayAmt:"",
        },
        industryCategoryName : "",
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
          this.industryCategoryName = "";
          this.getBatchInfo(this.queryType);
        }
      }
    },
    props : {
      // viewDetailForm: Object,
      batchNo: "",
      prodNo: "",
      isShow: "",
      isQuery:"",
      batchId:"",
      funcNo:"",
      discRgstStatusList:"",
      queryBatchUrl:{
        type : String,
        default(){
          return "/ce/disc/batch/queryDiscBatch";
        }
      },
      queryType:""
    },
    mounted() {
      getDictListByGroups("DraftTypeCode,PayType,Industry,CorpScale,Yon,Province").then(res => {
        this.dictMap = res.get("map");
      });

    },
    methods: {
      //获取批次详细信息,queryType-区分申请与复核
      getBatchInfo(queryType) {
        let params = {};
        if (queryType === 'reCheck') {
          params = {
            id: this.batchId,
            funcNo: this.funcNo,
            discRgstStatusList: this.discRgstStatusList,
            applTellerNoNotEqual: this.$store.getters.userInfo.userNo,
            auditModeKey: 'ce.disc.is_rgst_check_exclude'
          };
        } else {
          params = {
            id: this.batchId,
            funcNo: this.funcNo,
            discRgstStatusList: this.discRgstStatusList
          };
        }
        //获取批次详细信息
        post(params, this.queryBatchUrl).then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.viewDetailForm = res.data.retData;
              if (this.viewDetailForm.buyPayPcet === null || this.viewDetailForm.buyPayPcet === "") {
                if (this.viewDetailForm.payType === "1") {
                  this.viewDetailForm.buyPayPcet = "100";
                } else if (this.viewDetailForm.payType === "2") {
                  this.viewDetailForm.buyPayPcet = "0";
                }
              }
              if (this.viewDetailForm.payType === "1") {
                this.viewDetailForm.buyPayPcet = "100";
              } else if (this.viewDetailForm.payType === "2") {
                this.viewDetailForm.buyPayPcet = "0";
                this.viewDetailForm.salerPayPcet = "100";
              } else if (this.viewDetailForm.payType === "3") {
                console.log();
                this.viewDetailForm.salerPayPcet = 100 - this.viewDetailForm.buyPayPcet;
              } else if (this.viewDetailForm.payType === "4") {
                this.viewDetailForm.thirdPayPcet = "100";
              }
              if (this.viewDetailForm.buyPayPcet !== null && this.viewDetailForm.buyPayPcet !== "") {
                this.viewDetailForm.buyPayPcet = this.viewDetailForm.buyPayPcet;
              }
              if (this.viewDetailForm.salerPayPcet !== null && this.viewDetailForm.salerPayPcet !== "") {
                this.viewDetailForm.salerPayPcet = this.viewDetailForm.salerPayPcet;
              }
              if (this.viewDetailForm.thirdPayPcet !== null && this.viewDetailForm.thirdPayPcet !== "") {
                this.viewDetailForm.thirdPayPcet = this.viewDetailForm.thirdPayPcet;
              }
              if (this.viewDetailForm.sumMoney !== null && this.viewDetailForm.sumMoney !== "") {
                this.viewDetailForm.sumMoney = formatNumber(this.viewDetailForm.sumMoney, 2, ',');
                this.viewDetailForm.sumBuyerInterest = formatNumber(this.viewDetailForm.sumBuyerInterest, 2, ',');
                this.viewDetailForm.sumSalerInterest = formatNumber(this.viewDetailForm.sumSalerInterest, 2, ',');
                this.viewDetailForm.sumInterest = formatNumber(this.viewDetailForm.sumInterest, 2, ',');
                this.viewDetailForm.sumThirdInterest = formatNumber(this.viewDetailForm.sumInterest, 2, ',');
                this.viewDetailForm.sumRealPayAmt = formatNumber(this.viewDetailForm.sumRealPayAmt, 2, ',');
              }
              this.$nextTick(() => {
                this.getDictValue();
              });
            } else {
              this.$msgTip.error(this, {info: msg});
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, {info: this.$t("m.i.common.netError") + error});
        });
      },
      getDictValue(){
        post({dictGroupCode : "IndustryCategoryDetail", key :this.viewDetailForm.industryCategory }, "/sm/config/dictionary/getDictValue").then(res => {
          if (res) {
            debugger;
            let dictValue = res.data.retMsg;
            if(dictValue == null || dictValue == "" || dictValue == undefined){
              dictValue = this.viewDetailForm.industryCategory;
            }
            this.industryCategoryName = dictValue;
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
