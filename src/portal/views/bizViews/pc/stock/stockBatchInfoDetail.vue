<template>
  <div v-if="tempIsShow">
    <div class="text-wrap mb-10">
      <div class="text-header"><span class="tit">{{$t('m.i.ce.detailInfo')}}</span></div>
      <div class="text-body">
        <h-row :gutter="8">
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">客户名称：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.custName }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">客户号：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.custNo }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.common.batchNo')}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.batchNo }}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <h-row :gutter="8">
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">实物机构：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.brchName }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">申请日期：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.applDt  == null ? "" : this.$moment(viewDetailForm.applDt, "YYYY-MM-DD").format("YYYY-MM-DD")}}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.billInfo.billType')}}：</h-col>
              <h-col span="15" class="val">{{ getDictValueFromMap(this.dictMap,"DraftTypeCode",viewDetailForm.billType) }}</h-col>
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
        </h-row>
      </div>
    </div>
  </div>
</template>

<script>
  import { post,on,off ,getDictListByGroups ,formatNumber ,getDictValueFromMap,accMul} from "@/api/bizApi/commonUtil";
  export default {
    name: "stockBatchInfoDetail",
    data() {
      return {
        tempIsShow : false,
        viewDetailForm : {
          custName:"",
          custNo:"",
          batchNo:"",
          brchName:"",
          outInDt:"",
          applDt:"",
          billType:"",
          sumCount:"",
          sumMoney:"",
        },
      };
    },
    watch:{
      isShow(val) {
        if(val === true) {
          this.viewDetailForm = {};
          this.getBatchInfo();
          this.tempIsShow = true;
        }
        if(val === false) {
          this.tempIsShow = false;
        }
      },
    },
    props : {
      batchId: "",
      isShow: "",
      params: Object,
      batchUrl : {
        type : String,
        default (){
          return "/pc/stock/inStockBatchMain/func_findStockBatchInfo";
        }
      },
      dictMap:{
        type:Map,
        default(){
          return new Map();
        }
      }
    },
    mounted() {
    },
    methods: {
      getBatchInfo() {
        //获取批次详细信息
        post(this.params, this.batchUrl).then(res => {
          if(res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.viewDetailForm = res.data.retData;
              if(this.viewDetailForm.sumMoney !== null && this.viewDetailForm.sumMoney !== ""){
                this.viewDetailForm.sumMoney = formatNumber(this.viewDetailForm.sumMoney, 2, ',');
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
