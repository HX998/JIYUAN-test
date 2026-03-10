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
    <h-form-item :label="$t('m.i.be.brchName')" prop="buyBrchName" class="h-form-three">
      <h-input v-model="formItem.buyBrchName" placeholder="" readonly></h-input>
    </h-form-item>
    <h-form-item :label="$t('m.i.be.traderName')" prop="buyTraderName" class="h-form-three">
      <h-input v-model="formItem.buyTraderName" placeholder="" readonly></h-input>
    </h-form-item>
    <h-form-item :label="$t('m.i.be.otherBrchName')" prop="saleBrchName"  class="h-form-three" >
      <h-input v-model="formItem.saleBrchName" placeholder="" readonly ></h-input>
    </h-form-item>
    <h-form-item :label="$t('m.i.be.custBrchCode')" prop="saleBrchCode"   class="h-form-three" >
      <h-input v-model="formItem.saleBrchCode" placeholder="" readonly></h-input>
    </h-form-item>
    <h-form-item :label="$t('m.i.be.custProductNo')" prop="saleProductName"  class="h-form-three">
      <h-input  v-model="formItem.saleProductName" placeholder="" readonly></h-input>
    </h-form-item>
    <h-form-item :label="$t('m.i.be.custTraderName')" prop="saleTraderName"   class="h-form-three" >
      <h-input v-model="formItem.saleTraderName" placeholder="" readonly ></h-input>
    </h-form-item>
    <h-form-item :label="$t('m.i.be.custTraderNo')" prop="saleTraderNo"   class="h-form-three" >
      <h-input v-model="formItem.saleTraderNo" placeholder="" readonly></h-input>
    </h-form-item>
    <h-form-item :label="$t('m.i.be.subDeal')" prop="subDeal"  class="h-form-three">
      <h-select v-model="formItem.subDeal" placeholder=""  readonly>
        <h-option v-for="item in dictMap['YonList']" :value="item.key" :key="item.key">{{item.value }}</h-option>
      </h-select>
    </h-form-item>
    <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType" class="h-form-three">
      <h-select v-model="formItem.billType" placeholder=""   readonly>
        <h-option v-for="item in dictMap['billTypeList']" :value="item.key" :key="item.key">{{item.value }}</h-option>
      </h-select>
    </h-form-item>
    <h-form-item :label="$t('m.i.billInfo.billClass')" prop="billClass" class="h-form-three">
      <h-select v-model="formItem.billClass" placeholder=""  readonly>
        <h-option v-for="item in dictMap['billClassList']" :value="item.key" :key="item.key">{{item.value }}</h-option>
      </h-select>
    </h-form-item>
    <h-form-item :label="$t('m.i.be.clearType')" prop="clearType" required class="h-form-three">
      <h-select v-model="formItem.clearType" placeholder="" >
        <h-option v-for="item in dictMap['ClearTypeList']" :value="item.key" :key="item.key">{{item.value }}</h-option>
      </h-select>
    </h-form-item>
    <h-form-item :label="$t('m.i.be.settleMode')" prop="settleMode" required class="h-form-three">
      <h-select v-model="formItem.settleMode" placeholder="" >
        <h-option v-for="item in dictMap['SettleType']" :value="item.key" :key="item.key">{{item.value }}</h-option>
      </h-select>
    </h-form-item>
    <h-form-item :label="$t('m.i.be.clearSpeed')" prop="clearSpeed" required class="h-form-three">
      <h-select v-model="formItem.clearSpeed" placeholder="" @on-change="changeSpeed" >
        <h-option v-for="item in dictMap['clearSpeed']" :value="item.key" :key="item.key">{{item.value }}</h-option>
      </h-select>
    </h-form-item>
    <h-form-item :label="$t('m.i.be.preAuditNo')" prop="auditNo" class="h-form-three" v-if="formItem.isPreAudit==='1'">
      <h-input v-model="formItem.auditNo" placeholder="" readonly icon="android-search" @on-click="queryPreAudit"></h-input>
    </h-form-item>
    <h-form-item prop="isNoticeFirstAudit" label="是否通知审批第一岗" required class="h-form-long-label" v-if="formItem.showNoticeFirstStationItem">
      <h-select v-model="formItem.isNoticeFirstAudit" :label-in-value="true" placeholder="">
        <h-option value="1">是</h-option>
        <h-option value="0">否</h-option>
      </h-select>
    </h-form-item>
    <keep-alive>
      <component :is="rebuyBusiType"  :formItem ="formItem" :dictMap="dictMap">
      </component>
    </keep-alive>
    <slot name="save"></slot>
    <show-pass-pre-audit :showPassPreAuditWin="showPassPreAuditWin" :batchURL="auditBatchURL" :prodNo="formItem.prodNo" :brchCode="formItem.buyBrchCode"
                         @showPassPreAuditWinClose="showPassPreAuditWinClose" @pickPassPreAudit="pickPassPreAudit" :busiType="formItem.busiType"
                         :billClass="formItem.billClass" :billType="formItem.billType"></show-pass-pre-audit>
  </div>
</template>
<script>
  import { post, on, off} from "@/api/bizApi/commonUtil";
  import RBT01 from "@/views/bizViews/be/market/quote/rebuy/RBT01";
  import RBT02 from "@/views/bizViews/be/market/quote/rebuy/RBT02";
  import RBT03 from "@/views/bizViews/be/market/quote/rebuy/RBT03";

  export default {
    name :"quoteRebuyInput",
    data(){
      return {
        isCurChange:this.isChange,
        YonList:[],
        acptBankTypesList:[],
        billTypeList:[],
        buyBrchCode : '',
        brchType:'',
        auditBatchURL:'/be/market/quote/quoteManager/func_findPassBatchByPage',
        showPassPreAuditWin:false
      }
    },
    components:{
      RBT01,
      RBT02,
      RBT03,
      ShowPassPreAudit:()=>import(/* webpackChunkName: "be/market/preaudit/showPassPreAudit" */`@/views/bizViews/be/market/preaudit/showPassPreAudit`)
    },
    props:{
      busiType:String,
      rebuyBusiType:String,
      formItem:{
        type: Object
      },
      dictMap:{
        type:Object
      },
      isChange: {
        type: Boolean,
        default() {
          return false;
        }
      }
    },
    watch:{
      busiType(val){
        this.isCurChange=this.isChange;
        this.formItem.busiType = val;
      }
    },
    methods:{
      //选择清算速度， 在清算速度改变后修改结算日期
      changeSpeed(currVal){
        if(!this.isCurChange){
          this.isCurChange=true;
          return;
        }
        // T+1 情况
        let dueSettleDt = this.formItem.dueSettleDt;
        if(currVal === 'CS01'){
          let workDate =  this.$moment(this.formItem.workDate,'YYYYMMDD').format('YYYY/MM/DD');
          workDate=new Date(workDate);
          let workDatePlus =   workDate.valueOf()+ (1* 24 * 60 * 60 * 1000);
          workDatePlus = new Date(workDatePlus);
          workDatePlus=this.$moment(workDatePlus,'YYYYMMDD').format('YYYYMMDD');
          post({code:workDatePlus},'/sm/oper/holiday/getWorkDate').then(res=>{
            if(res && res.data.retCode==='000000'){
              this.formItem.firstSettleDt = this.$moment( res.data.retData,'YYYYMMDD').format('YYYY-MM-DD');
              if(this.formItem.busiType !== 'BT01' && dueSettleDt){
                dueSettleDt = Date.parse(dueSettleDt.replace(/-/g, "/"));
                let firstSettleDt = Date.parse(this.formItem.firstSettleDt.replace(/-/g, "/"));
                dueSettleDt=new Date(dueSettleDt);
                firstSettleDt=new Date(firstSettleDt);
                let days=(dueSettleDt.getTime()-firstSettleDt.getTime())/(24 * 60 * 60 *1000);
                this.formItem.tenorDays = days;
              }
            }
          });
        }else{
          this.formItem.firstSettleDt = this.$moment(this.formItem.workDate,'YYYYMMDD').format('YYYY-MM-DD');
          if(this.formItem.busiType !== 'BT01' && dueSettleDt){
            dueSettleDt = Date.parse(dueSettleDt.replace(/-/g, "/"));
            let firstSettleDt = Date.parse(this.formItem.firstSettleDt.replace(/-/g, "/"));
            dueSettleDt=new Date(dueSettleDt);
            firstSettleDt=new Date(firstSettleDt);
            let days=(dueSettleDt.getTime()-firstSettleDt.getTime())/(24 * 60 * 60 *1000);
            this.formItem.tenorDays = days;
          }
        }

      },
      queryPreAudit(){
        this.showPassPreAuditWin = true;
      },
      showPassPreAuditWinClose(){
        this.showPassPreAuditWin = false;
      },
      pickPassPreAudit(data){
        if(data){
          this.formItem.auditNo = data.preAuditNo;
        }else{
          this.formItem.auditNo = "";
        }
        this.showPassPreAuditWin = false;
      },
    }


  }
</script>

