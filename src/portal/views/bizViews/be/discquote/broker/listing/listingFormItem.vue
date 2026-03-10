<!--贴现通挂牌 新增/修改弹窗共用字段-->
<template>
  <div>
    <!--业务类型-->
    <common-select v-model="addForm.busiType" :label="$t('m.i.common.busiType')"
                   prop="busiType" :dictList="batchParams.busiTypeList" :readonly="true"></common-select>
    <!--报价单编号-->
    <common-input v-model="addForm.busiNo" :label="$t('m.i.be.quoteNo')" prop="busiNo"
                  :readonly="true"></common-input>
    <!--本方机构名称-->
    <common-input v-model="addForm.brokerBrchName" :label="$t('m.i.be.ownBrchName')" prop="brokerBrchName"
                  :readonly="true"></common-input>
    <!--本方交易员名称-->
    <common-input v-model="addForm.brokerTraderName" :label="$t('m.i.be.traderName')" prop="brokerTraderName"
                  :readonly="true"></common-input>
    <!--贴现申请人名称-->
    <h-form-item :label="$t('m.i.ce.discountApplyName')" prop="discCustName" required class="h-form-long-label">
      <h-input v-model="addForm.discCustName" placeholder="" readonly icon="android-search"
               @on-click="discCustSearchWinOpen"></h-input>
    </h-form-item>
    <!--社会信用代码-->
    <common-input v-model="addForm.discOutSocCode" :label="$t('m.i.ce.discountApplySocCode')" prop="discOutSocCode"  class="h-form-long-label"
                  :required="true"  :readonly="true"></common-input>
    <!--企业规模-->
    <common-select v-model="addForm.discCorpScale" :label="$t('m.i.be.discCorpScale')"  class="h-form-long-label"
                   prop="discCorpScale" :dictList="batchParams.corpScaleList"
                   :required="true" :readonly="true"></common-select>
    <!--行业分类-->
    <common-select v-model="addForm.discIndustry" :label="$t('m.i.be.discIndustry')"  class="h-form-long-label"
                   prop="discIndustry" :dictList="batchParams.industryList"
                   :required="true" :readonly="true"></common-select>
    <!--是否涉农企业-->
    <common-select v-model="addForm.isDiscArc" :label="$t('m.i.be.isDiscArc')"  class="h-form-long-label"
                   prop="isDiscArc" :dictList="batchParams.isList"
                   :required="true" :readonly="true"></common-select>
    <!--是否绿色企业-->
    <common-select v-model="addForm.isDiscGreenCorp" :label="$t('m.i.be.isDiscGreen')"  class="h-form-long-label"
                   prop="isDiscGreenCorp" :dictList="batchParams.isList"
                   :required="true" :readonly="true"></common-select>
    <!--是否科技企业-->
    <common-select v-model="addForm.isDiscTechnologyCorp" :label="$t('m.i.be.isDiscTechnologyCorp')"  class="h-form-long-label"
                   prop="isDiscTechnologyCorp" :dictList="batchParams.isList"
                   :required="true" :readonly="true"></common-select>
    <!--是否民营企业-->
    <common-select v-model="addForm.isDiscPrivateCorp" :label="$t('m.i.be.isDiscPrivateCorp')"  class="h-form-long-label"
                   prop="isDiscPrivateCorp" :dictList="batchParams.isList"
                   :required="true" :readonly="true"></common-select>
    <!--省份-->
    <common-select v-model="addForm.area" :label="$t('m.i.be.discProv')"  class="h-form-long-label"
                   prop="area" :dictList="batchParams.provinceList"
                   :required="true" :readonly="true"></common-select>
    <!--票据种类-->
    <common-select v-model="addForm.billType" :label="$t('m.i.billInfo.billType')"
                   prop="billType" :dictList="batchParams.billTypeList"
                   :required="true"></common-select>
    <!--票据介质-->
    <common-select v-model="addForm.billClass" :label="$t('m.i.billInfo.billClass')"
                   prop="billClass" :dictList="batchParams.billClassList"
                   :required="true" :readonly="true"></common-select>
    <!--是否允许议价-->
    <common-select v-model="addForm.isBargain" :label="$t('m.i.be.isAllowBargain')"
                   prop="isBargain" :dictList="batchParams.isList"
                   :required="true" ></common-select>
    <!--清算方式-->
    <common-select v-model="addForm.clearMode" :label="$t('m.i.be.clearMode')"
                   prop="clearMode" :dictList="batchParams.clearModeList"
                   :required="true" ></common-select>
    <!--清算速度-->
    <common-select v-model="addForm.clearSpeed" :label="$t('m.i.be.clearSpeed')"
                   prop="clearSpeed" :dictList="batchParams.clearSpeedList" @on-change="changeSpeed"
                   :required="true" ></common-select>
    <!--结算日-->
    <common-date-picker v-model="addForm.firstSettleDt" :label="$t('m.i.be.settleDt')" prop="firstSettleDt" :options="options2"
                        :required="true" :readonly="true"></common-date-picker>
    <!--贴现利率-->
    <common-type-field v-model="addForm.ratePct" :label="$t('m.i.pe.discRate')" prop="ratePct" :validRules="ratePctRule"
                  :required="true" :integerNum="3" :suffixNum="4" :bigTips="false"></common-type-field>
    <!--贴现申请人开户行行号-->
    <common-input v-model="addForm.discOutBankNo" :label="$t('m.i.be.discOutBankNo')" prop="discOutBankNo" :validRules="bankNoRule"
                  :required="true" class="h-form-long-label"></common-input>
    <!--应答时间-->
    <common-time-picker v-model="addForm.respTm" :label="$t('m.i.be.respTm')" prop="respTm"
                        :required="true"></common-time-picker>
    <!--交易对手类型-->
    <h-form-item :label="$t('m.i.be.transCustType')" prop="transCustTypeName" required class="h-form-three">
      <h-input v-model="addForm.transCustTypeName" placeholder="" readonly icon="android-search"
               @on-click="transCustTypeWinOpen"></h-input>
    </h-form-item>
    <!--剔除交易对手行别-->
    <h-form-item :label="$t('m.i.be.eliminateCpBrchType')" prop="eliminateCpBrchTypeName"  class="h-form-three">
      <h-input v-model="addForm.eliminateCpBrchTypeName" placeholder="" readonly icon="android-search"
               @on-click="showCpesBranchWinOpen"></h-input>
    </h-form-item>
    <!--票据总额-->
    <common-input v-model="addForm.totalAmt" :label="$t('m.i.be.totalAmtByYUAN')" prop="totalAmt" :readonly="true"></common-input>
    <!--票据张数-->
    <common-input v-model="addForm.totalNum" :label="$t('m.i.be.totalNum')" prop="totalNum" :readonly="true"></common-input>
    <common-input v-model="addForm.firstPayInterest" :label="$t('m.i.be.payInterestByUnit')" prop="firstPayInterest" :readonly="true"></common-input>
    <common-input v-model="addForm.firstSettleAmt" :label="$t('m.i.be.settleAmtByUnit')" prop="firstSettleAmt" :readonly="true"></common-input>
    <common-input v-model="addForm.remainDays" :label="$t('m.i.be.remainingPeriod')" prop="remainDays" :readonly="true"></common-input>
    <common-input v-model="addForm.fileNum" :label="$t('m.i.be.fileNum')" prop="fileNum" :readonly="true"></common-input>
    <common-input v-model="addForm.listingRemark" :label="$t('m.i.common.remark')" prop="listingRemark" type="textarea"
                  :autosize="{minRows: 2, maxRows: 4}" class="h-form-height-auto" style="width:80%" :maxlength="300"></common-input>
    <!-- 机构类型选择弹窗框 -->
    <common-tree :commonTreeWin="transCustTypeWin" title="查询交易对手类型" :ifcheck="true" :isFilterChildren="true" :isNeedExpand="false"
                 @treeSelectedChange="transCustTypeChange" @commonTreeWinClose="transCustTypeWinClose" :checkedDataArr="transCustTypesArr"
                 url="/shcpe/cpes/baseData/baseData/func_queryBranchClassTreeSelect"></common-tree>
    <cust-info-search :custSearchWin="custSearchWin" :brchCode="brokerBrchCode" @custSearchChange="discCustSearchChange"
                      @custSearchWinClose="discCustSearchWinClose" :batchParams="temBatchParams"> </cust-info-search>
    <!-- 查询票交机构代码 -->
    <show-activity-cpes-branch :showCpesBranch="showCpesBranchWin" @showCpesBranchClose="showCpesBranchClose"
                               :transCorpClass="transCorpClass" :transBrchClasses="transCustTypesArr"
                      @showCpesBranchSubmit="showCpesBranchSubmit"></show-activity-cpes-branch>
  </div>
</template>

<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";
  export default {
    name: "listingFormItem",
    components: {
      ShowActivityCpesBranch: () => import(/* webpackChunkName: "shcpe/cpes/branch/showActivityCpesBranch" */`@/views/bizViews/shcpe/cpes/branch/showActivityCpesBranch`),
      CustInfoSearch: () => import(/* webpackChunkName: "be/discquote/cust/custInfoSearch" */`@/views/bizViews/be/discquote/cust/custInfoSearch`)
    },
    data() {
      let _this = this;
      return {
        options2: {
          disabledDate (date) {
            return  _this.$moment(window.sessionStorage.getItem("workDate"), "YYYYMMDD") > date && date.valueOf() ;
          }
        },
        ratePctRule :[{
          test: /^(\d{1,2}(\.\d{1,4})?|100|100\.0|100\.00|100\.000|100\.0000)$/,
          trigger: "blur",
          message: "利率范围0~100，且小数位不超过四位"
        }],
        bankNoRule :[{
          test: /^(\d{12})$/,
          trigger: "blur",
          message: "行号必须是12位数字"
        }],
        custSearchWin:false,
        brokerBrchCode:"",
        transCustTypeWin:false,
        transCustTypesArr:[],
        transCorpClass:"",
        showCpesBranchWin:false,
        temBatchParams:{},
      }
    },
    props: {
      addForm: {
        type: Object,
        default() {
          return {};
        }
      },
      batchParams: {
        type: Object,
        default: {}
      }
    },
    methods:{
      //贴现申请人弹出选择框
      discCustSearchWinOpen(){
        this.temBatchParams = this.batchParams;
        this.temBatchParams.optType ="1";
        this.temBatchParams.custInfoUrl="/be/discquote/broker/listing/discListingApplyMain/";
        this.brokerBrchCode=this.addForm.brokerBrchCode;
        this.custSearchWin=true;
      },
      discCustSearchChange(info){
        this.addForm.discCustName = info.discCustName;
        this.addForm.discOutSocCode = info.discSocCode;
        this.addForm.discCorpScale = info.discCorpScale;
        this.addForm.discIndustry = info.discIndustry;
        this.addForm.isDiscArc = info.isDiscArc;
        this.addForm.isDiscGreenCorp = info.isDiscGreenCorp;
        this.addForm.isDiscTechnologyCorp = info.isDiscTechnologyCorp;
        this.addForm.isDiscPrivateCorp = info.isDiscPrivateCorp;
        this.addForm.area = info.area;
      },
      discCustSearchWinClose(){
        this.temBatchParams ={};
        this.brokerBrchCode="";
        this.custSearchWin=false;
      },
      //交易对手类型
      transCustTypeWinOpen(){
        this.transCustTypesArr=this.addForm.transCustType?this.addForm.transCustType.split(",") : [];
        this.transCustTypeWin=true;
      },
      transCustTypeWinClose(){
        this.transCustTypesArr=[];
        this.transCustTypeWin=false;
      },
      transCustTypeChange(info){
        let objs = [];
        if (info instanceof Array) {
          objs = info;
        } else {
          objs[0] = info;
        }
        let transBrchTypes = "";
        let transBrchTypesName = "";
        for (var i = 0; i < objs.length; i++) {
          transBrchTypes += objs[i].id + ",";
          transBrchTypesName += objs[i].title + ",";
        }
        let transCustType= this.addForm.transCustType;
        this.addForm.transCustType = transBrchTypes.substring(0, transBrchTypes.length - 1);
        this.addForm.transCustTypeName = transBrchTypesName.substring(0, transBrchTypesName.length - 1);
        if(transCustType!==this.addForm.transCustType){
          this.addForm.eliminateCpBrchType="";
          this.addForm.eliminateCpBrchTypeName="";
        }
        this.transCustTypesArr=[];
        this.transCustTypeWin = false;
      },
      //剔除交易对手行别
      showCpesBranchWinOpen(){
        this.transCustTypesArr=this.addForm.transCustType?this.addForm.transCustType.split(",") : [];
        this.transCorpClass="CC00";
        this.showCpesBranchWin=true;
      },
      showCpesBranchClose(){
        this.transCustTypesArr=[];
        this.transCorpClass="";
        this.showCpesBranchWin=false;
      },
      showCpesBranchSubmit(info){
        let objs = [];
        if (info instanceof Array) {
          objs = info;
        } else {
          objs[0] = info;
        }
        let transBrchTypes = "";
        let transBrchTypesName = "";
        for (var i = 0; i < objs.length; i++) {
          transBrchTypes += objs[i].brchCode + ",";
          transBrchTypesName += objs[i].brchFullNameZh + ",";
        }
        this.addForm.eliminateCpBrchType=transBrchTypes.substring(0, transBrchTypes.length - 1);
        this.addForm.eliminateCpBrchTypeName=transBrchTypesName.substring(0, transBrchTypesName.length - 1);
        this.transCustTypesArr=[];
        this.transCorpClass="";
        this.showCpesBranchWin=false;
      },
      //选择清算速度， 在清算速度改变后修改结算日期
      changeSpeed(currVal) {
        if (!this.batchParams.isSpeedChange) {
          this.batchParams.isSpeedChange = true;
          return;
        }
        if(currVal === "CS01"){
          let workDate = this.$moment(this.addForm.workDate, "YYYYMMDD").format("YYYY/MM/DD");
          workDate = new Date(workDate);
          let workDatePlus = workDate.valueOf() + (1 * 24 * 60 * 60 * 1000);
          workDatePlus = new Date(workDatePlus);
          workDatePlus = this.$moment(workDatePlus, "YYYYMMDD").format("YYYYMMDD");
          post({ code: workDatePlus }, "/sm/oper/holiday/getWorkDate").then(res => {
            if (res && res.data.retCode === "000000") {
              this.addForm.firstSettleDt = this.$moment(res.data.retData, "YYYYMMDD").format("YYYYMMDD");
            }
          });
        }else if(currVal === "CS00"){

          this.addForm.firstSettleDt = this.$moment(this.addForm.workDate, "YYYYMMDD").format("YYYYMMDD");
          let settleDate = this.$moment(this.addForm.firstSettleDt).format('YYYY/MM/DD');
          settleDate=new Date(settleDate);
          post({code:this.$moment(settleDate).format('YYYYMMDD')},'/sm/oper/holiday/isHoliday').then(res=>{
            if(res && res.data.retCode==='000000'){
              if(res.data.retData === true){
                this.$msgTip.info(this,{info:'您选择的是节假日，请重新选择！'});
                this.addForm.firstSettleDt='';
              }else{
                // this.changeTenorVarieties(tenorVarieties);
              }
            }
          });
        }else{
        }
      },

    }
  };
</script>

<style scoped>

</style>
