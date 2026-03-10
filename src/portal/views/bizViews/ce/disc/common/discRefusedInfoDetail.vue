<template>
  <div v-if="tempIsShow">
    <div class="text-wrap mb-10">
      <div class="text-header"><span class="tit">{{$t('m.i.ce.detailInfo')}}</span></div>
      <div class="text-body">
        <h-row :gutter="8">
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.ce.discountType')}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.transName }}</h-col>
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
             <h-col span="9" class="label">{{$t('m.i.ce.clearMark')}}：</h-col>
              <h-col span="15" class="val">{{ getDictValueFromMap(this.dictMap,"SettlementMarkCode",viewDetailForm.clearMark) }}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <h-row :gutter="8">
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.billInfo.discDt')}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.discDt == null ? "" : this.$moment(viewDetailForm.discDt, "YYYY-MM-DD").format("YYYY-MM-DD") }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.billInfo.discInterestRate')}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.ratePct}}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
             <h-col span="9" class="label">{{$t('m.i.ce.redeemOpenDt')}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.redeemOpenDt == null ? "" : this.$moment(viewDetailForm.redeemOpenDt, "YYYY-MM-DD").format("YYYY-MM-DD")}}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <h-row :gutter="8">
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t('m.i.ce.redeemDueDt')}}：</h-col>
              <h-col span="15" class="val">{{ viewDetailForm.redeemDueDt == null ? "" : this.$moment(viewDetailForm.redeemDueDt, "YYYY-MM-DD").format("YYYY-MM-DD") }}</h-col>
            </h-row>
          </h-col>
        </h-row>
      </div>
    </div>
  </div>
</template>

<script>
  import { post,on,off,getDictValueFromMap,getDictListByGroups} from "@/api/bizApi/commonUtil";
  export default {
    name: "discRefusedInfoDetail",
    data() {
      return {
        tempIsShow : false,
      };
    },
    watch:{
      prodNo(val) {
        if(val === "222") {
          this.tempIsShow = true;
        }
      },
      isShow(val) {
        if(val === true) {
          this.tempIsShow = true;
        }
        if(val === false) {
          this.tempIsShow = false;
        }
      }
    },
    props : {
      viewDetailForm: Object,
      batchId:"",
      prodNo: "",
      isShow: ""
    },
    mounted() {
      getDictListByGroups("DraftTypeCode,SettleType,SettlementMarkCode").then(res => {
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
  };
</script>

<style scoped>

</style>
