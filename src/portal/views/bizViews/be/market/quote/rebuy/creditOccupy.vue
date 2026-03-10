<template>
    <div>
      <h-msg-box title="修改额度占用对象" v-model="tempCreditOccupyWin" @on-close="handleClose" height="300" :footerHide="true" :mask-closable="false">
        <div>
          <h-form :model="creditFormItem" :label-width="100" ref="creditFormItem"  class="h-form-search">
            <h-form-item :label="$t('m.i.be.creditOccType')" prop="creditOccType" >
              <h-select v-model="creditFormItem.creditOccType"  required placeholder="">
                <h-option v-for="item in dictMap['creditDeductRuleList']" :value="item.key" :key="item.key" :label="item.value">{{item.value }}</h-option>
              </h-select>
            </h-form-item>
            <div align="center">
              <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
              <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
              <h-button type="primary" v-else @click="commitCredit">{{$t("m.i.common.commit")}}</h-button>
            </div>
          </h-form>
        </div>

      </h-msg-box>
    </div>
</template>

<script>
  import { post, on, off} from "@/api/bizApi/commonUtil";
  export default {
    name: "creditOccupy",
    data(){
      return {
        creditFormItem:{
            batchId:'',
            ids:{},
          creditOccType:''
        },
        submitFlag:false
      }
    },
    components:{
    },
    props:{
      billIds:{},
      batchId:Number,
      creditOcc:'',
      dictMap:{
        type:Object
      },
      creditOccupyWin: {
        type: Boolean,
        default() {
          return false;
        }
      }
    },
    computed: {
      tempCreditOccupyWin: {
        get() {
          return this.creditOccupyWin;
        },
        set(){

        }
      }
    },
    watch:{
      creditOccupyWin(val){
        if(val){
          this.creditFormItem.batchId=this.batchId;
          this.creditFormItem.ids=this.billIds;
          if(this.creditOcc){
            this.creditFormItem.creditOccType=this.creditOcc;
          }
        }
      }
    },
    methods:{
      handleClose() {
        this.creditFormItem.batchId=null;
        this.creditFormItem.ids=null;
        this.creditFormItem.creditOccType=null;
        this.submitFlag=false;
        this.$emit("creditOccupyClose", "");
      },
      commitCredit(){
       if(this.creditFormItem.batchId){
          if (!this.creditFormItem.ids) {
            this.$msgTip.error(this, { info: "选择的明细ID不能为空" });
          };
         this.$refs["creditFormItem"].validate(valid => {
           if (valid) {
             this.submitFlag=true
             let url = '/be/market/quote/quoteManager/func_editRebuyCreditOccType';
             post(this.creditFormItem,url).then(res => {
               if(res){
                 let msg = res.data.retMsg;
                 let retCode = res.data.retCode;
                 if(retCode=="000000") {
                   this.$msgTip.success(this);
                   this.handleClose();
                 }else{
                   this.$msgTip.error(this, { info: msg });
                   this.submitFlag=false;
                 }
               }else{
                 this.$msgTip.error(this, { info: this.$t('m.i.common.netError')});
                 this.submitFlag=false;
               }
             });
           }
         });
       }else{
         this.$msgTip.error(this, { info: "批次ID不能为空" });
       }

      }
    }
  };
</script>

<style scoped>

</style>
