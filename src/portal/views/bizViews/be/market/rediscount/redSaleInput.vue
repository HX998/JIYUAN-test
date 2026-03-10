<template>
    <div>
      <h-form-item :label="$t('m.i.common.busiType')" prop="busiType" required class="h-form-three">
        <h-select v-model="formItem.busiType" placeholder="" readonly showTitle>
          <h-option v-for="item in dictMap['rediscBusiTypeList']" :value="item.key" :key="item.key">{{item.value }}</h-option>
        </h-select>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.rediscountApplNo')" prop="rediscountApplNo"  >
        <h-input v-model="formItem.rediscountApplNo" placeholder="" readonly></h-input>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.applBrchName')" prop="saleBrchName" required class="h-form-long-label" >
        <h-input v-model="formItem.saleBrchName" placeholder="" readonly></h-input>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.traderName')" prop="saleTraderName"  class="h-form-long-label" >
        <h-input v-model="formItem.saleTraderName" placeholder="" readonly></h-input>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.ownReviewsTrader')" prop="saleCheckTraderName"  required class="h-form-three h-form-long-label" >
        <h-input v-model="formItem.saleCheckTraderName" placeholder="" readonly icon="android-search" @on-click="queryTrader"></h-input>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.pedBrchName')" prop="buyBrchName"  class="h-form-three">
        <h-input v-model="formItem.buyBrchName" placeholder="" readonly></h-input>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.pedBrchCode')" prop="buyBrchCode"  class="h-form-three">
        <h-input v-model="formItem.buyBrchCode" placeholder="" readonly></h-input>
      </h-form-item>
      <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType" required class="h-form-three">
        <h-select v-model="formItem.billType" placeholder="" @on-change="checkRates()" :readonly="preDeleteBill" showTitle>
          <h-option v-for="item in dictMap['billTypeList']" :value="item.key" :key="item.key">{{item.value }}</h-option>
        </h-select>
      </h-form-item>
      <h-form-item :label="$t('m.i.billInfo.billClass')" prop="billClass" required class="h-form-three">
        <h-select v-model="formItem.billClass" placeholder=""  :readonly="preDeleteBill" showTitle>
          <h-option v-for="item in dictMap['billClassList']" :value="item.key" :key="item.key">{{item.value }}</h-option>
        </h-select>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.clearType')" prop="clearType" required class="h-form-three">
        <h-select v-model="formItem.clearType" placeholder="" readonly showTitle>
          <h-option v-for="item in dictMap['clearTypeList']" :value="item.key" :key="item.key" >{{item.value }}</h-option>
        </h-select>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.settleMode')" prop="settleMode" required class="h-form-three">
        <h-select v-model="formItem.settleMode" placeholder=""  showTitle>
          <h-option v-for="item in dictMap['settleTypeList']" :value="item.key" :key="item.key">{{item.value }}</h-option>
        </h-select>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.clearSpeed')" prop="clearSpeed" required class="h-form-three">
        <h-select v-model="formItem.clearSpeed" placeholder=""  @on-change="changeSpeed" :readonly="preDeleteBill" showTitle>
          <h-option v-for="item in dictMap['clearSpeedList']" :value="item.key" :key="item.key">{{item.value }}</h-option>
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
        <component :is="busiType" :formItem ="formItem" :dictMap="dictMap" :preDeleteBill="preDeleteBill">
        </component>
      </keep-alive>
      <slot name="save"></slot>
      <trader-user :userTraderWin="userTraderWin" :brchCode="saleBrchCode" :defaultClose="false" @userTraderChange="userTraderChange" @userTraderWinClose="userTraderWinClose" >
      </trader-user>
      <show-pass-pre-audit :showPassPreAuditWin="showPassPreAuditWin" :batchURL="auditBatchURL" :prodNo="formItem.prodNo" :brchCode="formItem.saleBrchCode"
                           @showPassPreAuditWinClose="showPassPreAuditWinClose" @pickPassPreAudit="pickPassPreAudit" :busiType="formItem.busiType"
                           :billClass="formItem.billClass" :billType="formItem.billType"></show-pass-pre-audit>
    </div>
</template>
<script>
import RBT01 from "@/views/bizViews/be/market/rediscount/common/RBT01";
import RBT02 from "@/views/bizViews/be/market/rediscount/common/RBT02";
import { post, on, off, getDictListByGroups,getSingleParamValuesByKeys } from "@/api/bizApi/commonUtil";
    export default {
        name :"redSaleInput",
        data(){
            return {
              isCurChange:this.isChange,
              userTraderWin:false,
              rediscBusiTypeList:[],
              YonList:[],
              termTypeList:[],
              billTypeList:[],
              showPassPreAuditWin:false,
              auditBatchURL:"/be/market/rediscount/redSaleApplyMain/func_findPassBatchByPage",
            }
        },
        components:{
          RBT01,
          RBT02,
           traderUser:()=>import(/* webpackChunkName: "sm/auth/branch/userTraderByBrchNoSearch" */`@/views/bizViews/sm/auth/branch/userTraderByBrchNoSearch`),
          ShowPassPreAudit:()=>import(/* webpackChunkName: "be/market/preaudit/showPassPreAudit" */`@/views/bizViews/be/market/preaudit/showPassPreAudit`)
        },
      props:{
        busiType:String,
        formItem:{
          type: Object
        },
        dictMap:{
          type:Object
        },
        preDeleteBill:Boolean,
        saleBrchCode:String,
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
         //查询利率
        checkRates(){
          let busiType= this.formItem.busiType;
          let billType =this.formItem.billType;
          let termType =this.formItem.termType;
          post({busiType:busiType,billType:billType,termType:termType},'/be/market/rediscount/redSaleApplyMain/func_checkRates').then(res=>{
            if(res && res.data.retCode==='000000'){
              this.formItem.ratePct=res.data.retData;
            }
          });
        },
        // 挑选交易员
        queryTrader() {
          this.userTraderWin = true;
        },

        userTraderChange(info) {
          if (info === null) {
            this.$msgTip.error(this,{info:"请先选择记录！"});
            return;
          } else {
            post({code:info.traderId}, "/sm/auth/branchUser/func_validateBranchTraders").then(res => {
              if (res) {
                if (null !== res.data.retData && "0" === res.data.retData) {
                  this.formItem.saleCheckTraderNo = info.traderId;
                  this.formItem.saleCheckTraderName = info.traderName;
                  this.$parent.validateField('saleCheckTraderName');
                  this.userTraderWinClose();
                } else {
                  this.userTraderWinClose();
                  this.$msgTip.info(this, { info: "您所选择的交易柜员绑定的柜员与当前登录柜员的机构不一致，请重新选择！！！" });
                }
              }
            }).catch(error => {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
            });
          }
        },

        userTraderWinClose() {
          this.userTraderWin = false;
        },

        //选择清算速度， 在清算速度改变后修改结算日期
        changeSpeed(currVal){
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
                if(this.formItem.busiType !== 'RBT01' && dueSettleDt){
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
            if(this.formItem.busiType !== 'RBT01' && dueSettleDt){
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

      },
      mounted(){
      },
    }
</script>

