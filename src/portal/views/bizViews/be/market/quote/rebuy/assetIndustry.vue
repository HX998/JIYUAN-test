<template>
    <h-msg-box title="设置资产分类" v-model="tempAssetIndustryWin" @on-close="handleClose" class="h-form-search-layer" :mask-closable="false">
        <h-form :model="assetFormItem" :label-width="100" ref="assetFormItem"  class="h-form-search">
          <h-form-item :label="$t('m.i.be.assetIndustry')" prop="assetIndustry" :required="isAssetIndustryRequired">
            <h-select v-model="assetFormItem.assetIndustry" placeholder=""  @on-change="changeAsset" :readonly="isAssetIndustryChooseBoolen">
              <h-option v-for="item in dictMap['assetIndustryList']" :value="item.key" :key="item.key">{{item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.bookType')" prop="bookType" v-if="isNeedBookTypeBoolen">
            <h-select v-model="assetFormItem.bookType"  required placeholder="请选择" readonly>
              <h-option v-for="item in dictMap['bookTypeList']" :value="item.key" :key="item.key">{{item.value }}</h-option>
            </h-select>
          </h-form-item>
        </h-form>
        <div slot="footer">
          <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
          <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
          <h-button type="primary" v-else @click="commitAsset">{{$t("m.i.common.commit")}}</h-button>
        </div>
    </h-msg-box>
</template>

<script>
  import { post, on, off} from "@/api/bizApi/commonUtil";
  export default {
    name: "assetIndustry",
    data(){
      return {
        assetFormItem:{
          batchId:'',
          ids:{},
          assetIndustry:'0',
          bookType:'1'
        },
        submitFlag:false
      }
    },
    components:{
    },
    props:{
      billIds:{},
      batchId:Number,
      assetInd:'',
      isAssetIndustryRequired:{
        type: Boolean,
        default: true
      },
      isAssetIndustryChooseBoolen:{
        type: Boolean,
        default: false
      },
      isNeedBookTypeBoolen:{
        type: Boolean,
        default: false
      },
      dictMap:{
        type:Object
      },
      assetIndustryWin: {
        type: Boolean,
        default: false
      },
      isProdTypeChoose: {
        type: Boolean,
        default: false
      },
      rootUrl: {
        type: String,
        default() {
          return "";
        }
      },
    },
    computed: {
      tempAssetIndustryWin: {
        get() {
          return this.assetIndustryWin;
        },
        set(){

        }
      }
    },
    watch:{
      assetIndustryWin(val){
        if(val){
          this.assetFormItem.batchId=this.batchId;
          this.assetFormItem.ids=this.billIds;
          if(this.assetInd){
            this.assetFormItem.assetIndustry=this.assetInd;
          }
        }
      }
    },
    methods:{
      handleClose() {
        this.assetFormItem.batchId=null;
        this.assetFormItem.ids=null;
        this.assetFormItem.assetIndustry="0";
        this.submitFlag=false;
        this.$refs.assetFormItem.resetFields();
        this.$emit("assetIndustryClose", "");
      },
      changeAsset(currVal){
        if(this.isNeedBookTypeBoolen){
          this.assetFormItem.bookType=(currVal?(currVal=='1'?"1":"2"):"");
        }
      },
      commitAsset(){
        if(this.isProdTypeChoose) {
          this.$emit("assetIndustryChange", "assetFormItem", this.assetFormItem.assetIndustry);
        } else {
          if(this.assetFormItem.batchId){
            this.$refs["assetFormItem"].validate(valid => {
              if (valid) {
                this.submitFlag=true
                let url = '/be/market/quote/quoteManager/func_saveRebuyAssetIndustry';
                if(this.rootUrl){
                  url = this.rootUrl+'/func_saveRebuyAssetIndustry';
                }
                post(this.assetFormItem,url).then(res => {
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
    }
  };
</script>

<style scoped>

</style>
