<!--创设业务-设立管理-新增、修改、查看弹出框-->
<template>
  <div>
    <h-msg-box v-model="tempStdCreationAddOrEditWin" :maximize="true" :mask-closable="false" @on-close="handleClose"
               width="1000" class="h-form-search-layer" >
      <p slot="header">
        <span v-if="batchParams.batchType==='add'">标票新增</span>
        <span v-else-if="batchParams.batchType==='modify'">标票修改</span>
        <span v-else-if="batchParams.batchType==='show'">标票查看</span>
      </p>
      <div>
        <h-form :model="addOrEditForm" :label-width="115" ref="addOrEditForm" cols="3" class="h-form-search">
          <std-creation-form-item :addForm="addOrEditForm" :batchParams="batchParams"></std-creation-form-item>
        </h-form>
        <div >

        </div>
      </div>
      <div slot="footer"  style="text-align:left">
        <h-button type="primary" @click="formSave()" >{{$t('m.i.common.save')}}</h-button>
        <h-button type="primary" @click="creditMainManage()" >{{$t('m.i.bs.creditMainManage')}}</h-button>
        <h-button type="primary" @click="orgHolderManage()" v-if="addOrEditForm.collectMode === 'CM02'">{{$t('m.i.bs.orgHolderManage')}}</h-button>
        <h-button type="primary" @click="applySubmit()">{{$t('m.i.common.applySubmit')}}</h-button>
      </div>
    </h-msg-box>

    <show-org-holder :showOrgHolderWin="showOrgHolderWin" :creationId="batchId" :dictMap="dictMap" :batchParams="holderParams" :title="$t('m.i.bs.orgHolderManage')" @showOrgHolderWinClose="showOrgHolderWinClose"></show-org-holder>
    <show-credit-main :showCreditMainWin="showCreditMainWin" :creationId="batchId" :batchParams="creditParams" :baseAssetType="this.addOrEditForm.baseAssetType" :dictMap="dictMap" :title="$t('m.i.bs.creditMainManage')" @showCreditMainClose="showCreditMainClose"></show-credit-main>
  </div>
</template>

<script>
  import { post, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "stdCreationAdd",
    components: {
      ShowCreditMain: () => import(/* webpackChunkName: "bs/corpstdbill/creation/showCreditMain" */"@/views/bizViews/bs/corpstdbill/creation/showCreditMain"),
      ShowOrgHolder: () => import(/* webpackChunkName: "bs/corpstdbill/creation/showOrgHolder" */"@/views/bizViews/bs/corpstdbill/creation/showOrgHolder"),
      StdCreationFormItem: () => import(/* webpackChunkName: "bs/corpstdbill/creation/stdCreationFormItem" */"@/views/bizViews/bs/corpstdbill/creation/stdCreationFormItem")
    },
    data() {
      return {
        batchId: "",
        addOrEditForm: {
          id:"",
          legalNo:"",
          memberId:"",
          batchNo:"",
          dpstId:"",
          flowStatus:"",
          prodNo:"",
          prodName:"",
          collectMode: "",
          calFeeType: "",
          feeControlMode: "",
          feeRatePct: "",
          sellCalFeeType: "",
          sellFeeControlMode: "",
          sellFeeRatePct: "",
          baseAssetType:"",
          billType:"",
          billClass:"",
          stdProductName:"",
          stdProductShortName:"",
          stdProductNo:"",
          ecdsAcctNo:"",
          ecdsAcctName:"",
          dpstOrgCode:"",
          dpstBrchName:"",
          dpstBankNo:"",
          dpstBrchCode:"",
          sellBrchName:"",
          sellBankNo:"",
          sellBrchCode:"",
          creationMaxAmt:"",
          creationMaxTerm:"",
          financeMaxRate:"",
          financeMaxRatePct:"",
          financeMinRate:"",
          financeMinRatePct:"",
          preBeginDueDt:"",
          preEndDueDt:"",
          publishDt:"",
          declareEndDt:"",
          declareEndTm:"",
          purchaseDt:"",
          raiseDt:"",
          paymentDt:"",
          transPlace:"",
          declareEndDtTm:"",
          isSelfSell:""
        },
        showOrgHolderWin: false,
        showCreditMainWin: false,
        holderParams:{},
        creditParams:{}
      };
    },
    props: {
      stdCreationAddOrEditWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      batchParams: {
        type: Object,
        default() {
          return {};
        }
      },
      dictMap: { //CorpScale,Industry,partnerType,Yon
        type: Map,
        required: true
      },
    },
    computed: {
      tempStdCreationAddOrEditWin: {
        get() {
          return this.stdCreationAddOrEditWin;
        },
        set() {
        }
      }
    },
    watch: {
      stdCreationAddOrEditWin(val) {
        if (val) {
          this.$nextTick(() => {
            this.batchId = this.batchParams.batchId;
            if (this.batchParams.batchType === "add") {
              this.queryObjById();
            }
            if (this.batchParams.batchType === "modify" || this.batchParams.batchType === "show") {
              this.queryObjById();
            }
          });
        }
      },
      batchId(val) {
        this.batchId = val;
      }
    },
    methods: {
      //根据批次Id查询批次信息
      queryObjById() {
        let params = { id: this.batchId };
        let url = "/bs/corpstdbill/creation/stdCreationApply/func_jumpEditStdCreation";
        post(params, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let obj = res.data.retData;
              this.addOrEditForm.id = obj.id;
              this.addOrEditForm.legalNo = obj.legalNo;
              this.addOrEditForm.memberId = obj.memberId;
              this.addOrEditForm.batchNo = obj.batchNo;
              this.addOrEditForm.dpstId = obj.dpstId;
              this.addOrEditForm.flowStatus = obj.flowStatus;
              this.addOrEditForm.prodNo = obj.prodNo;
              this.addOrEditForm.prodName = obj.prodName;
              this.addOrEditForm.collectMode = obj.collectMode;
              this.addOrEditForm.calFeeType = obj.calFeeType;
              this.addOrEditForm.feeControlMode = obj.feeControlMode;
              this.addOrEditForm.feeRatePct = obj.feeRatePct;
              this.addOrEditForm.sellCalFeeType = obj.sellCalFeeType;
              this.addOrEditForm.sellFeeControlMode = obj.sellFeeControlMode;
              this.addOrEditForm.sellFeeRatePct = obj.sellFeeRatePct;
              this.addOrEditForm.baseAssetType = obj.baseAssetType;
              this.addOrEditForm.billType = obj.billType;
              this.addOrEditForm.billClass = obj.billClass;
              if (obj.stdProductName){
                this.addOrEditForm.stdProductName = obj.stdProductName;
              }
              if (obj.stdProductShortName){
                this.addOrEditForm.stdProductShortName = obj.stdProductShortName;
              }
              if (obj.stdProductNo){
                this.addOrEditForm.stdProductNo = obj.stdProductNo;
              }
              if (obj.ecdsAcctNo){
                this.addOrEditForm.ecdsAcctNo = obj.ecdsAcctNo;
              }
              if (obj.ecdsAcctName){
                this.addOrEditForm.ecdsAcctName = obj.ecdsAcctName;
              }
              this.addOrEditForm.dpstOrgCode = obj.dpstOrgCode;
              this.addOrEditForm.dpstBrchName = obj.dpstBrchName;
              this.addOrEditForm.dpstBankNo = obj.dpstBankNo;
              this.addOrEditForm.dpstBrchCode = obj.dpstBrchCode;
              this.addOrEditForm.sellBrchName = obj.sellBrchName;
              this.addOrEditForm.sellBankNo = obj.sellBankNo;
              this.addOrEditForm.sellBrchCode = obj.sellBrchCode;
              if (obj.creationMaxAmt){
                this.addOrEditForm.creationMaxAmt = obj.creationMaxAmt===null?"":obj.creationMaxAmt.toString();
              }
              if(obj.creationMaxTerm){
                this.addOrEditForm.creationMaxTerm = obj.creationMaxTerm;
              }
              this.addOrEditForm.financeMaxRate = obj.financeMaxRate;
              this.addOrEditForm.financeMinRate = obj.financeMinRate;
              this.addOrEditForm.financeMaxRatePct = obj.financeMaxRatePct;
              this.addOrEditForm.financeMinRatePct = obj.financeMinRatePct;
              this.addOrEditForm.preBeginDueDt = obj.preBeginDueDt=== null ? "" : obj.preBeginDueDt.toString();
              this.addOrEditForm.preEndDueDt = obj.preEndDueDt=== null ? "" : obj.preEndDueDt.toString();
              this.addOrEditForm.publishDt = obj.publishDt=== null ? "" : obj.publishDt.toString();
              this.addOrEditForm.declareEndDt = obj.declareEndDt=== null ? "" : obj.declareEndDt.toString();
              this.addOrEditForm.declareEndTm = obj.declareEndTm;
              if(this.addOrEditForm.declareEndDt){
                if(this.addOrEditForm.declareEndTm){
                  let declareEndTm= new String(this.addOrEditForm.declareEndTm);
                  while (declareEndTm.length<6){
                    declareEndTm="0"+declareEndTm;
                  }
                  this.addOrEditForm.declareEndDtTm=this.addOrEditForm.declareEndDt+declareEndTm;
                }else{
                  this.addOrEditForm.declareEndDtTm=this.addOrEditForm.declareEndDt+"000000";
                }
              };
              this.addOrEditForm.purchaseDt = obj.purchaseDt=== null ? "" : obj.purchaseDt.toString();
              this.addOrEditForm.raiseDt = obj.raiseDt=== null ? "" : obj.raiseDt.toString();
              this.addOrEditForm.paymentDt = obj.paymentDt=== null ? "" : obj.paymentDt.toString();
              this.addOrEditForm.transPlace = obj.transPlace;
              this.addOrEditForm.isSelfSell = obj.isSelfSell;
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //关闭弹窗
      handleClose() {
        this.$refs.addOrEditForm.resetFields();
        this.addOrEditForm.id = "";
        this.batchId="";
        this.$emit("stdCreationAddOrEditWinClose", "");
      },

      //保存批次信息
      formSave() {
        this.saveBatch();
      },
      saveBatch(optType) {
        if (optType) {
          this.addOrEditForm.buttonName = optType;
        }
        this.saveBatchFunc(res=>{
          if (optType) {
            this.triggerClickEvent(optType);
            this.addOrEditForm.buttonName ="";
          }else{
            this.$msgTip.success(this);
          }
        });
      },
      saveBatchFunc(callback) {
        this.$refs["addOrEditForm"].validate(valid => {
          if (valid) {
            let financeMinRatePct=this.addOrEditForm.financeMinRatePct;
            let financeMaxRatePct=this.addOrEditForm.financeMaxRatePct;
            let rateBoolean=financeMaxRatePct-financeMinRatePct<0;
            if(rateBoolean){
              this.$msgTip.error(this, { info: "融资利率上限(%)必须大于等于融资利率下限(%)"});
              return;
            }
            let maxTenorDays=this.addOrEditForm.maxTenorDays?this.addOrEditForm.maxTenorDays:365;
            if(parseInt(this.addOrEditForm.creationMaxTerm)>parseInt(maxTenorDays)){
              this.$msgTip.error(this, { info: "创设期限上限不能大于"+maxTenorDays +"天"});
              return;
            }
            let preBeginDueDt=this.addOrEditForm.preBeginDueDt.replace(/-/g, "");//基础资产起始到期日(准入)
            let preEndDueDt=this.addOrEditForm.preEndDueDt.replace(/-/g, "");//基础资产截止到期日(准入)
            if(preEndDueDt<=preBeginDueDt){
              this.$msgTip.error(this, { info: "基础资产截止到期日(准入)必须大于基础资产起始到期日(准入)"});
              return;
            }
            let declareEndDtTm=this.addOrEditForm.declareEndDtTm.replace(/-/g, "").replace(/:/g,"").replace(" ","");//申报截止时间
            this.addOrEditForm.declareEndDt=declareEndDtTm.substring(0, 8);
            this.addOrEditForm.declareEndTm=declareEndDtTm.substring(8, 14);
            while (this.addOrEditForm.declareEndTm.length>1&&this.addOrEditForm.declareEndTm.startsWith("0")) {
              this.addOrEditForm.declareEndTm=this.addOrEditForm.declareEndTm.substr(1);
            }
            this.addOrEditForm.publishDt = this.addOrEditForm.publishDt.replace(/-/g, "");
            this.addOrEditForm.purchaseDt = this.addOrEditForm.purchaseDt.replace(/-/g, "");
            this.addOrEditForm.raiseDt = this.addOrEditForm.raiseDt.replace(/-/g, "");
            this.addOrEditForm.paymentDt = this.addOrEditForm.paymentDt.replace(/-/g, "");
            let publishDt=this.addOrEditForm.publishDt;//披露日期
            let declareEndDt =this.addOrEditForm.declareEndDt;//申报截止时间
            let purchaseDt=this.addOrEditForm.purchaseDt;//申购日期
            let raiseDt=this.addOrEditForm.raiseDt;//缴款日期
            let paymentDt=this.addOrEditForm.paymentDt;//兑付日期
            if(declareEndDt<publishDt){
              this.$msgTip.error(this, { info: "申报截止时间必须大于等于披露日期"});
              return;
            }
            if(purchaseDt<declareEndDt){
              this.$msgTip.error(this, { info: "申购日期必须大于等于申报截止时间"});
              return;
            }
            if(raiseDt<purchaseDt){
              this.$msgTip.error(this, { info: "缴款日期必须大于等于申购日期"});
              return;
            }
            if(paymentDt<raiseDt){
              this.$msgTip.error(this, { info: "兑付日期必须大于等于缴款日期"});
              return;
            }
            if(paymentDt<=preEndDueDt){
              this.$msgTip.error(this, { info: "兑付日期必须大于基础资产截止到期日(准入)"});
              return;
            }
            if(preBeginDueDt<=raiseDt){
              this.$msgTip.error(this, { info: "基础资产起始到期日(准入)必须大于缴款日期"});
              return;
            }

            let url = "/bs/corpstdbill/creation/stdCreationApply/func_editStdCreation";
            post(this.addOrEditForm, url).then(res => {
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                let retData=res.data.retData;
                if (retCode === "000000") {
                  this.batchId=retData.id;
                  this.queryObjById();
                  callback();
                } else {
                  this.$msgTip.error(this, { info: msg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      //按钮事件触发保存
      triggerClickEvent(optType) {
        if (optType === "commitApply") {//提交申请
          this.applySubmitCallback();
        }
      },
      //申请提交
      applySubmit(){
        this.saveBatch("commitApply");
      },
      applySubmitCallback() {
        if (this.batchId) {
          let params = { id: this.batchId };
          let url = "/bs/corpstdbill/creation/stdCreationApply/func_commitStdCreation";
          this.sendPost(params, url, res=>{
            this.handleClose();
          });
        } else {
          this.$msgTip.error(this, { info: "请先保存批次" });
        }
      },
      sendPost(params, url, callback) {
        post(params, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              if(res.data.retData.erroMsg){
                this.$msgTip.error(this, { info: res.data.retData.erroMsg });
              }else{
                this.$msgTip.success(this);
                callback();
              }
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      creditMainManage(){
        this.saveBatchFunc(()=>{
          this.showCreditMainWin = true;
        });
      },
      showCreditMainClose(){
        this.showCreditMainWin = false;
      },
      orgHolderManage(){
        this.saveBatchFunc(res=>{
          this.showOrgHolderWin = true;
        });
      },
      showOrgHolderWinClose(){
        this.showOrgHolderWin = false;
      }
    }
  };
</script>

<style scoped>

</style>
