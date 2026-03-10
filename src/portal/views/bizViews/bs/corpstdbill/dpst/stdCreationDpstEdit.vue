<!--创设业务-存托签收-修改弹出框-->
<template>
  <div>
    <h-msg-box v-model="tempStdCreationDpstEditWin" :maximize="true" :mask-closable="false" @on-close="handleClose"
               width="1000" class="h-form-search-layer" top="10" >
      <p slot="header">
        <span v-if="batchParams.batchType==='modify'">存托申请详情</span>
        <span v-else-if="batchParams.batchType==='dpstReply'">交易确认详情</span>
        <span v-else-if="batchParams.batchType==='signReply'">存托签收详情</span>
        <span v-else-if="batchParams.batchType==='account'">票据存托记账详情</span>
        <span v-else-if="batchParams.batchType==='emergency'">存托应急退票详情</span>
      </p>
      <div>
        <h-form :model="addOrEditForm" :label-width="115" ref="addOrEditForm" cols="3" class="h-form-search">
          <std-creation-dpst-form-item :addForm="addOrEditForm" :batchParams="batchParams"></std-creation-dpst-form-item>
        </h-form>
        <div > </div>
        <!--数据展示表格-->
        <h-datagrid
          :columns="columns"
          highlight-row
          :auto-load="false"
          :url="dataGridUrl"
          :bindForm="dataGridFormItem"
          :has-select="false"
          :rowSelect="true"
          ref="datagrid">
          <div slot="toolbar" class="pull-left">
            <h-button type="primary" @click="pickBill()" v-if="batchParams.batchType==='modify'">
              {{$t("m.i.common.pickBill")}}
            </h-button>
            <h-button type="primary" @click="deleteBill()" v-if="batchParams.batchType==='modify'">
              {{$t("m.i.be.deleteBill")}}
            </h-button>
            <h-button type="primary" @click="custPyeeAcctSell()" v-if="batchParams.batchType==='modify'">
              {{$t("m.i.bs.custPyeeAcctSell")}}
            </h-button>
            <h-button type="primary" @click="apply()" v-if="batchParams.batchType==='modify'">
              {{$t("m.i.be.applyBatch")}}
            </h-button>
           <!-- <h-dropdown trigger="click" @on-click="apply" v-if="batchParams.batchType==='modify'">
              <h-button type="primary" >{{$t("m.i.be.applyBatch")}}
                <h-icon name="unfold"></h-icon>
              </h-button>
              <h-dropdown-menu slot="list">
                <h-dropdown-item name="selectSubmit">选择提交</h-dropdown-item>
                <h-dropdown-item name="listSubmit">批次提交</h-dropdown-item>
              </h-dropdown-menu>
            </h-dropdown>-->
            <h-button type="primary" @click="agreeStdDpst()" v-if="batchParams.batchType==='dpstReply'">
              {{$t("m.i.common.pass")}}
            </h-button>
            <h-button type="primary" @click="returnApply()" v-if="batchParams.batchType==='dpstReply'">
              {{$t("m.i.bs.return")}}
            </h-button>
          <!--  <h-dropdown trigger="click" @on-click="returnApply" v-if="batchParams.batchType==='dpstReply'">
              <h-button type="primary" >{{$t("m.i.bs.return")}}
                <h-icon name="unfold"></h-icon>
              </h-button>
              <h-dropdown-menu slot="list">
                <h-dropdown-item name="selectReturn">选择退回</h-dropdown-item>
                <h-dropdown-item name="listReturn">批次退回</h-dropdown-item>
              </h-dropdown-menu>
            </h-dropdown>-->
            <h-button type="primary" @click="agreeSign()" v-if="batchParams.batchType==='signReply'">
              {{$t("m.i.bs.sign")}}
            </h-button>
            <h-button type="primary" @click="creationFailed()" v-if="batchParams.batchType==='signReply'">
              {{$t("m.i.bs.creationFailed")}}
            </h-button>
            <h-button type="primary" @click="endorseBack()" v-if="batchParams.batchType==='emergency'">
              {{$t("m.i.bs.endorseBack")}}
            </h-button>
            <h-button type="primary" @click="endorseRefuse()" v-if="batchParams.batchType==='emergency'">
              {{$t("m.i.bs.endorseRefuse")}}
            </h-button>
            <h-button type="primary" @click="synch()" v-if="(batchParams.batchType==='signReply'||batchParams.batchType==='emergency')&&isBbsp">
              {{$t("m.i.bs.synch")}}
            </h-button>
            <h-button type="primary" @click="account()" v-if="batchParams.batchType==='account'">
              {{$t("m.i.bs.account")}}
            </h-button>
             <h-button type="primary" @click="listExport()">
              {{$t("m.i.common.exportData")}}
            </h-button>

          </div>
        </h-datagrid>
      </div>
      <div slot="footer">
      </div>
    </h-msg-box>
    <!--挑票-->
    <dpst-pick-bill :pickBillWin="pickBillWin" :pickBillParams="pickBillParams"
                       @pickBillWinClose="pickBillWinClose"></dpst-pick-bill>
    <h-msg-box v-model="applyWin" :maximize="false" width="400" :footerHide="true" :closable="false" :z-index="2010">
      <div class="modal-body">
        <div class="h-modal-confirm">
          <div class="h-modal-confirm-head">
            <div class="h-modal-confirm-head-icon h-modal-confirm-head-icon-confirm">
              <i class="h-icon iconfont icon-feedback"></i>
            </div>
            <div class="h-modal-confirm-head-title">确认要继续提交申请吗?</div>
          </div>
          <div class="h-modal-confirm-body">
            <div>{{applyTitle}}</div>
          </div>
          <div class="h-modal-confirm-footer">
            <button type="button"  @click="applyClose()" class="h-btn h-btn-text h-btn-large"><span>取消</span></button>
            <button type="button"  @click="applyCommit()" class="h-btn h-btn-primary h-btn-large"><span>确定</span></button>
          </div>
        </div>
      </div>
    </h-msg-box>
    <!--收款账号设置-->
    <std-cust-pyee-acct :custPyeeAcctWin="custPyeeAcctWin" :custPyeeAcctParams="custPyeeAcctParams"
                    @custPyeeAcctClose="custPyeeAcctClose"></std-cust-pyee-acct>
    <common-excel-download @handleSubmit="exportTable" @showExcelTemplateWinClose="showExcelTemplateWinClose" :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.excelParam" :rows="this.rows"></common-excel-download>


    <!--存托记账-->
    <acct-record :param="param"  :showAcctRecordWin="showAcctRecordWin" @showAcctRecordWinClose="showAcctRecordWinClose"
                 :submitFlag="acctSubmitFlag"
                 :showPrintButton="showPrintButton"
                 @printSuccessCallback="printSuccessCallback"
                 :url="acctRecord" @acctSubmitSure="acctSubmitSure"></acct-record>
    <bill-info-main-std @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="billId" :billNo="billNo" :listId="listId"></bill-info-main-std>
  </div>
</template>

<script>
  import { post, formatNumber,exportList } from "@/api/bizApi/commonUtil";

  export default {
    name: "stdCreationDpstEdit",
    components: {
      StdCreationDpstFormItem: () => import(/* webpackChunkName: "bs/corpstdbill/dpst/stdCreationDpstFormItem" */"@/views/bizViews/bs/corpstdbill/dpst/stdCreationDpstFormItem"),
      DpstPickBill: () => import(/* webpackChunkName: "bs/corpstdbill/dpst/dpstPickBill" */"@/views/bizViews/bs/corpstdbill/dpst/dpstPickBill"),
      StdCustPyeeAcct: () => import(/* webpackChunkName: "bs/corpstdbill/dpst/stdCustPyeeAcct" */"@/views/bizViews/bs/corpstdbill/dpst/stdCustPyeeAcct")
    },
    data() {
      return {
        batchId: "",
        //记账
        showPrintButton:false,
        acctSubmitFlag:false,
        showAcctRecordWin : false,
        param : {},
        acctRecord : "/bs/corpstdbill/dpst/stdCorpDpstAccount/func_queryStdCreationAcctRecord",
        accountUrl : "/bs/corpstdbill/dpst/stdCorpDpstAccount/func_queryStdCreationAcct",
        addOrEditForm: {
          id:"",
          legalNo:"",
          memberId:"",
          batchNo:"",
          dpstId:"",
          flowStatus:"",
          prodNo:"",
          prodName:"",
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
          creationMaxAmt:"",
          creationMaxTerm:"",
          financeMaxRate:"",
          financeMinRate:"",
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
          beginDueDt:"",
          endDueDt:"",
          creationAmt:"",
          creationTerm:"",
          calFeeType:"",
          feeRatePct:"",
          dpstApplBrchNo:"",
          sellCalFeeType:"",
          sellFeeRatePct:"",
          isSelfSell:"",
        },
          //清单导出
          excelParam:null,
          rows: null,
          tempShowExcelTemplateWin: false,
        dataGridFormItem: {
          batchId: "",
          batchType:""
        },
        dataGridUrl: "",
        columns: [
          {
            type: "selection",
            width: 50,
            hiddenCol: false,
            align: "center"
          },
          {
            type: "index",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center"
          },
          {
            title: this.$t("m.i.bs.flowStatus"),
            key: "flowStatus",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.batchParams.dictMap, "DpstBillFlowStatus", params.row.flowStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.common.custName'),
            key: 'custName',
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.custAcctNo'),
            key: 'custAcctNo',
            hiddenCol: false
          },
          {
            title: this.$t('m.i.bs.endrsmtApplDt'),
            key: 'endrsmtApplDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('span', params.row.endrsmtApplDt ? this.$moment(params.row.endrsmtApplDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
            }
          },
          {
            title: this.$t('m.i.billInfo.billNo'),
            key: 'billNo',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('a', {
                on: {
                  click: () => {
                    this.billInfoWinOpen(params.row.billId, params.row.billNo,params.row.id)
                  }
                }
              }, params.row.billNo)
            }
          },
          {
            title: this.$t('m.i.billInfo.billType'),
            key: 'billType',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue =this.getDictValueFromMap(this.batchParams.dictMap, 'DraftTypeCode', params.row.billType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.billInfo.drwrName'),
            key: 'drwrName',
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.acptName'),
            key: 'acptName',
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.remitDt'),
            key: 'remitDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('span', params.row.remitDt ? this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
            }
          },
          {
            title: this.$t('m.i.billInfo.dueDt'),
            key: 'dueDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('span', params.row.dueDt ? this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
            }
          },
          {
            title: this.$t("m.i.billInfo.billMoneyByUnit"),
            key: "billMoney",
            hiddenCol: false,
            sortable: true,
            align: "right",
            render: (h, params) => {
              return h("p", formatNumber(params.row.billMoney, 2, ","));
            }
          },
          {
            title: this.$t('m.i.bs.custPyeeAcctNo'),
            key: 'custPyeeAcctNo',
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.bs.custPyeeBankNo'),
            key: 'custPyeeBankNo',
            hiddenCol: false,
            sortable: true
          },
        ],
        pickBillWin: false,
        pickBillParams: {},
        submitType:"",
        applyWin:false,
        applyTitle:"",
        custPyeeAcctWin:false,
        custPyeeAcctParams: {},
        isBbsp:false,
        showBillInfoWin: false,
        billId: "",
        billNo: "",
        listId:""
      };
    },
    props: {
      stdCreationDpstEditWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      batchParams: {
        type: Object,
        default(){
          return {};
        }
      }
    },
    computed: {
      tempStdCreationDpstEditWin: {
        get() {
          return this.stdCreationDpstEditWin;
        },
        set() {
        }
      }
    },
    watch: {
      stdCreationDpstEditWin(val) {
        if (val) {
          this.batchId = this.batchParams.batchId;
          this.dataGridFormItem.batchId = this.batchParams.batchId;
          this.dataGridFormItem.batchType=this.batchParams.batchType;
          this.dataGridUrl=this.batchParams.dataGridUrl;
          this.$nextTick(() => {
            if (this.batchParams.batchType === "modify"
              || this.batchParams.batchType === "dpstReply"
              || this.batchParams.batchType === "signReply"
              || this.batchParams.batchType === "account"
              || this.batchParams.batchType === "emergency") {
              this.queryObjById();
              this.handleSearch();
              if(this.batchParams.batchType === "signReply"||this.batchParams.batchType === "emergency"){
                this.getBbsp();
              }
            }
          });
        }
      },
      batchId(val) {
        this.batchId = val;
      }
    },
    methods: {
      getBbsp(){
        let url="/bs/corpstdbill/dpst/stdCorpDpstSign/func_getIsBbsp";
        if(this.batchParams.batchType === "signReply"){
          url="/bs/corpstdbill/dpst/stdCorpDpstSign/func_getIsBbsp";
        }else if(this.batchParams.batchType === "emergency"){
          url="/bs/corpstdbill/dpst/stdCorpDpstEmergency/func_getIsBbsp";
        }
        let params = {};
        post(params, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let obj = res.data.retData;
              this.isBbsp=obj.bbsp;
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //根据批次Id查询批次信息
      queryObjById() {
        let params = { id: this.batchId };
        let url = this.batchParams.batchUrl;
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
              this.addOrEditForm.baseAssetType = obj.baseAssetType;
              this.addOrEditForm.collectMode = obj.collectMode;
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
              this.addOrEditForm.ecdsAcctName = obj.ecdsAcctName;
              this.addOrEditForm.dpstOrgCode = obj.dpstOrgCode;
              this.addOrEditForm.dpstBrchName = obj.dpstBrchName;
              this.addOrEditForm.dpstBankNo = obj.dpstBankNo;
              this.addOrEditForm.dpstBrchCode = obj.dpstBrchCode;
              this.addOrEditForm.dpstApplBrchNo = obj.dpstApplBrchNo;
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
              this.addOrEditForm.beginDueDt = obj.beginDueDt=== null ? "" : obj.beginDueDt.toString();
              this.addOrEditForm.endDueDt = obj.endDueDt=== null ? "" : obj.endDueDt.toString();
              this.addOrEditForm.creationAmt = obj.creationAmt=== null ? "" : obj.creationAmt.toString();
              this.addOrEditForm.creationTerm = obj.creationTerm=== null ? "" : obj.creationTerm.toString();
              this.addOrEditForm.calFeeType = obj.calFeeType=== null ? "" : obj.calFeeType.toString();
              this.addOrEditForm.feeRatePct = obj.feeRatePct=== null ? "" : obj.feeRatePct.toString();
              this.addOrEditForm.sellCalFeeType = obj.sellCalFeeType=== null ? "" : obj.sellCalFeeType.toString();
              this.addOrEditForm.sellFeeRatePct = obj.sellFeeRatePct=== null ? "" : obj.sellFeeRatePct.toString();
              this.addOrEditForm.isSelfSell = obj.isSelfSell;

            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      handleSearch(pageNo) {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.dataChange(!!pageNo ? pageNo : 1);
      },
      //关闭弹窗
      handleClose() {
        this.$refs.addOrEditForm.resetFields();
        this.addOrEditForm.id = "";
        this.batchId="";
        this.dataGridFormItem.batchId="";
        this.dataGridUrl ="";
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$emit("stdCreationDpstEditWinClose", "");
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
            let url = "/bs/corpstdbill/dpst/stdCorpDpstApply/func_saveCorpDpst";
            post(this.addOrEditForm, url).then(res => {
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                let retData=res.data.retData;
                if (retCode === "000000") {
                  // this.batchId=retData.id;      // this.batchId=retData.id;
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
        if (optType === "pickBill") {//挑票
          this.pickBillCallBack();
        }else if (optType === "commitApply") {//提交申请
          this.applySubmitCallback();
        }
      },
      //挑票
      pickBill() {
        this.saveBatch("pickBill");
      },
      pickBillCallBack() {
        if (this.batchId) {
          this.pickBillParams.dictMap = this.batchParams.dictMap;
          this.pickBillParams.billTypeList = this.batchParams.billTypeList;
          this.pickBillParams.billClassList = this.batchParams.billClassList;
          this.pickBillParams.batchId = this.batchId;
          this.pickBillParams.billType = this.addOrEditForm.billType;
          this.pickBillParams.billClass = this.addOrEditForm.billClass;
          this.pickBillParams.stdProductNo =this.addOrEditForm.stdProductNo;
          this.pickBillParams.stdProductShortName =this.addOrEditForm.stdProductShortName;
          this.pickBillParams.stdProductName =this.addOrEditForm.stdProductName;
          this.pickBillParams.ecdsAcctNo =this.addOrEditForm.ecdsAcctNo;
          this.pickBillParams.ecdsAcctName =this.addOrEditForm.ecdsAcctName;
          this.pickBillParams.preBeginDueDt =this.addOrEditForm.preBeginDueDt;
          this.pickBillParams.preEndDueDt =this.addOrEditForm.preEndDueDt;
          this.pickBillParams.creationId =this.addOrEditForm.id;
          // this.pickBillParams.pickType = "discListingBill";
          this.pickBillParams.url = "/bs/corpstdbill/dpst/stdCorpDpstApply/func_pickBillAdd";
          this.pickBillParams.pickBillDatagridUrl="/bs/corpstdbill/dpst/stdCorpDpstApply/func_queryWaitSignBillPage";
          this.pickBillWin = true;
        } else {
          this.$msgTip.error(this, { info: "请先保存批次" });
        }
      },
      pickBillWinClose() {
        this.pickBillParams = {};
        this.queryObjById();
        this.handleSearch();
        this.pickBillWin = false;
      },
      // 删除票据
      deleteBill() {
        if (this.batchId) {
          let list = this.$refs.datagrid.selectIds;
          if (list.length === 0) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
            return;
          }
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: "确认要删除票据吗?",
            onOk: () => {
              let params = { id: this.batchId, listIds: list };
              let url = "/bs/corpstdbill/dpst/stdCorpDpstApply/func_deleteBill";
              this.sendPost(params, url, res=>{
                this.queryObjById();
                this.handleSearch();
              });
            }
          });
        } else {
          this.$msgTip.error(this, { info: "请先保存批次" });
        }
      },
      custPyeeAcctSell(){
        this.custPyeeAcctParams.creationId = this.batchId;
        this.custPyeeAcctWin = true;

      },
      custPyeeAcctClose(){
        this.custPyeeAcctWin = false;
        this.custPyeeAcctParams = {};
        this.queryObjById();
        this.handleSearch();
      },
      // 提交申请
      apply(obj){
        this.submitType=obj;
        this.applyWin=true;
        this.applyTitle="确认要提交申请吗?";
      },
      applyClose(){
        this.applyWin=false;
        this.applyTitle="";
      },
      //申请提交
      applyCommit(){
        this.saveBatch("commitApply");
        this.applyWin=false;
        this.applyTitle="";
      },
      applySubmitCallback() {
        if (this.batchId) {
          let params = { id: this.batchId ,submitType:this.submitType,riskFlag:'0'};
          if (this.submitType==="selectSubmit") {
            let list = this.$refs.datagrid.selectIds;
            if (list.length === 0) {
              this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
              return;
            }
            params.listIds=list;
          }
          let url = "/bs/corpstdbill/dpst/stdCorpDpstApply/func_commitDpstApply";
          post(params, url).then(res => {
            if (res) {
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                let obj = res.data.retData;
                let riskInfo=obj.riskInfo;
                if (riskInfo) {
                  params.riskFlag = "1";
                  this.continueApply(riskInfo, params,url);
                }else {
                  this.$msgTip.success(this);
                  if (this.submitType==="selectSubmit") {
                    this.queryObjById();
                    this.handleSearch();
                  }else {
                    this.handleClose();
                  }

                }
              } else {
                this.$msgTip.error(this, { info: res.data.retMsg });
              }
            } else {
              this.$msgTip.error(this, { info: this.$t('m.i.common.netError') });
            }
          });
        } else {
          this.$msgTip.error(this, { info: "请先保存批次" });
        }
      },
      continueApply(content, params,url){
        this.$hMsgBox.confirm({
          title:"确认要继续提交申请吗?",
          content:content,
          width:"600",
          onOk: () => {
            post(params, url).then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  let obj = res.data.retData;
                  this.$msgTip.success(this);
                  if (this.submitType==="selectSubmit") {
                    this.queryObjById();
                    this.handleSearch();
                  }else {
                    this.handleClose();
                  }
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg, width: "600" });
                }
              }else {
                this.$msgTip.error(this, { info: this.$t('m.i.common.netError') });
              }
            });
          }
        });
      },
      //交易确认通过
      agreeStdDpst(){
        if (this.batchId) {
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: "确认要通过吗?",
            onOk: () => {
              let params = { id: this.batchId};
              let url = "/bs/corpstdbill/dpst/stdCorpDpstReply/func_agreeStdDpst";
              this.sendPost(params, url, res=>{
                this.handleClose();
              });
            }
          });
        } else {
          this.$msgTip.error(this, { info: "请先保存批次" });
        }
      },
      //存托退回
      returnApply(obj){
        if (this.batchId) {
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: "确认要退回吗?",
            onOk: () => {
              let params = { id: this.batchId ,submitType:obj};
              if (obj==="selectReturn") {
                let list = this.$refs.datagrid.selectIds;
                if (list.length === 0) {
                  this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
                  return;
                }
                params.listIds=list;
              }
              let url = "/bs/corpstdbill/dpst/stdCorpDpstReply/func_backApply";
              this.sendPost(params, url, res=>{
                if (obj==="selectReturn") {
                  this.queryObjById();
                  this.handleSearch();
                }else{
                  this.handleClose();
                }
              });
            }
          });

        } else {
          this.$msgTip.error(this, { info: "请先保存批次" });
        }
      },
      //同意签收
      agreeSign(){
        if (this.batchId) {
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: "确认要签收吗?",
            onOk: () => {
              let params = { id: this.batchId};
              let url = "/bs/corpstdbill/dpst/stdCorpDpstSign/func_agreeSign";
              this.sendPost(params, url, res=>{
                this.queryObjById();
                this.handleSearch();
              });
            }
          });
        } else {
          this.$msgTip.error(this, { info: "请先保存批次" });
        }
      },
      //创设失败
      creationFailed(){
        if (this.batchId) {
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: "确认要创设失败吗?",
            onOk: () => {
              let params = { id: this.batchId};
              let url = "/bs/corpstdbill/dpst/stdCorpDpstSign/func_stdCreationFailed";
              this.sendPost(params, url, res=>{
                // this.queryObjById();
                // this.handleSearch();
                this.handleClose();
              });
            }
          });
        } else {
          this.$msgTip.error(this, { info: "请先保存批次" });
        }
      },
      //背书退票
      endorseBack(){
        if (this.batchId) {
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: "确认要背书退票吗?",
            onOk: () => {
              let params = { id: this.batchId};
              let url = "/bs/corpstdbill/dpst/stdCorpDpstEmergency/func_stdDpstEndorseBack";
              this.sendPost(params, url, res=>{
                this.queryObjById();
                this.handleSearch();
              });
            }
          });
        } else {
          this.$msgTip.error(this, { info: "请先保存批次" });
        }
      },
      //签收拒绝
      endorseRefuse(){
        if (this.batchId) {
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: "确认要签收拒绝吗?",
            onOk: () => {
              let params = { id: this.batchId};
              let url = "/bs/corpstdbill/dpst/stdCorpDpstEmergency/func_stdDpstEndorseRefuse";
              this.sendPost(params, url, res=>{
                this.queryObjById();
                this.handleSearch();
              });
            }
          });
        } else {
          this.$msgTip.error(this, { info: "请先保存批次" });
        }
      },
      //状态同步
      synch(){
        if (this.batchId) {
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: "确认要状态同步吗?",
            onOk: () => {
              let params = { id: this.batchId};
              let url = "/bs/corpstdbill/dpst/stdCorpDpstSign/func_stdDpstSynchStatus";
              if (this.batchParams.batchType === "signReply") {
                url = "/bs/corpstdbill/dpst/stdCorpDpstSign/func_stdDpstSynchStatus";
              }else if(this.batchParams.batchType === "emergency"){
                url = "/bs/corpstdbill/dpst/stdCorpDpstEmergency/func_stdDpstSynchStatus";
              }

              this.sendPost(params, url, res=>{
                this.queryObjById();
                this.handleSearch();
              });
            }
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
                this.$msgTip.error(this, { info: res.data.retData.erroMsg, width: "600"});
              }else{
                this.$msgTip.success(this);
              }
              callback();
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },

      printSuccessCallback(){
        this.showAcctRecordWinClose();
      },
      account() {
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("确认要存托记账吗") + "?",
          onOk: () => {
            this.param = {id:this.batchId,ownedBrchNo:this.addOrEditForm.dpstApplBrchNo};
            this.showAcctRecordWin = true;
          }
        });
      },
      // 关闭记账窗口
      showAcctRecordWinClose() {
        this.showAcctRecordWin = false;
        this.showPrintButton = false;
        this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
      },
      acctSubmitSure(info) {
        this.acctSubmitFlag = true;
        post({ id: info.id ,ownedBrchNo:info.ownedBrchNo,
          ownedBrchName:info.ownedBrchName }, this.accountUrl).then(res => {
          this.acctSubmitFlag = false;
          if (res) {
            let retCode = res.data.retCode
            if (retCode == "000000") {
              this.$msgTip.success(this);
              this.showPrintButton = true;
              //this.handleClose();
              if(!info.isHasPrint) {
                this.showAcctRecordWinClose();
              }
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
              this.showAcctRecordWinClose();
            }
          } else {
            this.$msgTip.error(this, { info: this.$t('m.i.common.netError') });
          }
        });
      },
        listExport() {
            this.excelParam = 'stdCreationBillEditExport';
            this.rows = this.$refs.datagrid.total;
            this.tempShowExcelTemplateWin = true;
        },
        showExcelTemplateWinClose() {
            this.tempShowExcelTemplateWin = false;
        },
        tempShowExcelTemplateWinOpen() {
            this.excelParam = 'stdCreationBillEditExport';
            this.rows = this.$refs.datagrid.total;
            this.tempShowExcelTemplateWin = true;
        },
        exportTable(field, exportType) {
            let url = window.LOCAL_CONFIG.API_HOME + "/bs/corpstdbill/creation/stdCreationTrackQuery/func_exportStdBillExcle";
            let options = {};
            if (this.$refs.datagrid.selectIds.length !== 0) {
                options.params = {
                    ids: this.$refs.datagrid.selectIds,
                    batchId: this.batchId
                };
                options.pageSize = this.$refs.datagrid.selectIds.length;
            } else {
                options.params ={batchId: this.batchId};
                options.pageSize = this.$refs.datagrid.total;
            }
            exportList(this, this.excelParam, field, exportType, url, options);
        },
      billInfoWinClose(){
        this.billId=null;
        this.billNo=null;
        this.listId=null;
        this.showBillInfoWin=false;
      },
      billInfoWinOpen(billId,billNo,listId){
        this.billId=billId;
        this.billNo=billNo;
        this.listId=listId;
        this.showBillInfoWin=true;
      },
    }
  };
</script>

<style scoped>

</style>
