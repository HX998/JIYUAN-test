<template>
    <div>
    <h-form-item :label="$t('m.i.common.busiType')" prop="busiType" class="h-form-three">
        <h-select v-model="formItem.busiType" placeholder="请选择" readonly>
            <h-option v-for="item in dictMap['busiTypeList']" :value="item.key" :key="item.key">{{item.value }}</h-option>
        </h-select>
    </h-form-item>
    <h-form-item :label="$t('m.i.be.quoteNo')" prop="quoteNo"  class="h-form-three">
        <h-input v-model="formItem.quoteNo" placeholder="" readonly></h-input>
    </h-form-item>
    <h-form-item :label="$t('m.i.be.reqNum')" prop="reqNum"  class="h-form-three">
      <h-select v-model="formItem.reqNum" placeholder="请选择"  @on-change='reqNumChange' :clearable="false">
        <h-option v-for="item in formItem.tradeCount" :value="item" :key="item">第{{item}}次</h-option>
      </h-select>
    </h-form-item>
    <h-form-item :label="$t('m.i.be.saleBrchName')" prop="saleBrchName"  class="h-form-three">
        <h-input v-model="formItem.saleBrchName" placeholder="" readonly></h-input>
    </h-form-item>
      <h-form-item :label="$t('m.i.be.saleProductName')" prop="saleProductName"  class="h-form-three" v-if="formItem.saleProductName">
        <h-input v-model="formItem.saleProductName" placeholder="" readonly></h-input>
      </h-form-item>
    <h-form-item :label="$t('m.i.be.saleTraderName')" prop="saleTraderName" class="h-form-three">
        <h-input v-model="formItem.saleTraderName" placeholder="" readonly></h-input>
    </h-form-item>
    <h-form-item :label="$t('m.i.be.buyBrchName')" prop="buyBrchName"  class="h-form-three" >
        <h-input v-model="formItem.buyBrchName" placeholder="" readonly :title="formItem.buyBrchName"></h-input>
    </h-form-item>
    <h-form-item :label="$t('m.i.be.buyProductName')" prop="buyProductName"  class="h-form-three" v-if="formItem.buyProductName">
        <h-input  v-model="formItem.buyProductName" placeholder="" readonly></h-input>
    </h-form-item>
    <h-form-item :label="$t('m.i.be.buyTraderName')" prop="buyTraderName"  class="h-form-three" >
        <h-input v-model="formItem.buyTraderName" placeholder="" readonly></h-input>
    </h-form-item>
    <h-form-item :label="$t('m.i.be.subDeal')" prop="subDeal" class="h-form-three" >
        <h-select v-model="formItem.subDeal" placeholder="" readonly>
            <h-option v-for="item in dictMap['YonList']" :value="item.key" :key="item.key">{{item.value }}</h-option>
        </h-select>
    </h-form-item>
    <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType" class="h-form-three">
        <h-select v-model="formItem.billType" placeholder=""  readonly>
            <h-option v-for="item in dictMap['billTypeList']" :value="item.key" :key="item.key">{{item.value }}</h-option>
        </h-select>
    </h-form-item>
    <h-form-item :label="$t('m.i.billInfo.billClass')" prop="billClass" class="h-form-three">
    <h-select v-model="formItem.billClass" placeholder="" readonly>
        <h-option v-for="item in dictMap['billClassList']" :value="item.key" :key="item.key">{{item.value }}</h-option>
    </h-select>
    </h-form-item>
    <h-form-item :label="$t('m.i.be.clearType')" prop="clearType" class="h-form-three">
    <h-select v-model="formItem.clearType" placeholder="" readonly>
        <h-option v-for="item in dictMap['ClearTypeList']" :value="item.key" :key="item.key">{{item.value }}</h-option>
    </h-select>
    </h-form-item>
    <h-form-item :label="$t('m.i.be.settleMode')" prop="settleMode" class="h-form-three">
    <h-select v-model="formItem.settleMode" placeholder="" readonly>
        <h-option v-for="item in dictMap['SettleType']" :value="item.key" :key="item.key">{{item.value }}</h-option>
    </h-select>
    </h-form-item>
    <h-form-item :label="$t('m.i.be.clearSpeed')" prop="clearSpeed" class="h-form-three">
        <h-select v-model="formItem.clearSpeed" placeholder="" readonly>
            <h-option v-for="item in dictMap['clearSpeed']" :value="item.key" :key="item.key">{{item.value }}</h-option>
        </h-select>
    </h-form-item>
    <keep-alive>
        <component :is="histBusiType" :formItem ="formItem" :dictMap="dictMap">
        </component>
    </keep-alive>
    </div>
</template>
<script>
import { post, on, off, getDictListByGroups } from "@/api/bizApi/commonUtil";
import HBT01 from "@/views/bizViews/be/market/quote/hist/HBT01";
import HBT02 from "@/views/bizViews/be/market/quote/hist/HBT02";
import HBT03 from "@/views/bizViews/be/market/quote/hist/HBT03";
    export default {
        name :"quoteHistInput",
        data(){
            return {
              YonList:[],
              acptBankTypesList:[],
              billTypeList:[],
              buyBrchCode : '',
              brchType:'',
              unLeagelForm:{
                qryUnincorporatedProductFlag:'1',
                memberId:""
              }

            }
        },
        components:{
            HBT01,
            HBT02,
            HBT03
        },
        props:{
          isQuoteNew:String,
          histBusiType:String,
          formItem:{
              type: Object
          },
          dictMap:{
              type:Object
          },
        },
        watch:{
            // busiType(val){
          //     this.formItem.busiType = val;
          // }
        },
        methods:{
          reqNumChange(){
            if(this.isQuoteNew){
              this.$emit("clearTemIsQuoteNew", "");
            }else{
              this.$emit("init", "");
            }
          }
        }


    }
</script>

