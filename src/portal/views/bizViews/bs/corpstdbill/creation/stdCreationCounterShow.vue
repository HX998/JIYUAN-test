<!--创设业务 费用收取--->
<template>
  <div>
    <h-msg-box v-model="tempStdCreationCounterShowWin" :maximize="true" :mask-closable="false" @on-close="handleClose"
     width="1000" class="h-form-search-layer" >
      <p slot="header">
        <span>对价支付详情</span>
      </p>
      <div>
        <h-form :model="feeAccountForm" :label-width="115" ref="feeAccountForm" cols="3" class="h-form-search">
          <std-creation-fee-form-item :feeForm="feeAccountForm" :batchParams="batchParams"></std-creation-fee-form-item>
        </h-form>
        <!--数据展示表格-->
        <h-datagrid
          :columns="columns"
          highlight-row
          :auto-load="false"
          url="/bs/corpstdbill/creation/stdCreationCounterAccount/func_queryStdCreationBill"
          :bindForm="dataGridFormItem"
          :has-select="false"
          ref="datagrid">
          <div slot="toolbar" class="pull-left">
            <h-button type="primary" @click="payAccount()" >{{$t('m.i.bs.payAcct')}}</h-button>
            <h-button type="primary" @click="listExport()">{{$t('m.i.common.listExport')}}</h-button>
            <h-button type="primary" @click="custFeeDetail()">{{$t('m.i.bs.custFeeDetail')}}</h-button>
          </div>
        </h-datagrid>
      </div>
      <div slot="footer">
      </div>
    </h-msg-box>
    <acct-record :param="param"  :showAcctRecordWin="showAcctRecordWin" @showAcctRecordWinClose="showAcctRecordWinClose"
                 :submitFlag="acctSubmitFlag"
                 :showPrintButton="showPrintButton"
                 @printSuccessCallback="printSuccessCallback"
                 :url="acctRecord" @acctSubmitSure="acctSubmitSure"></acct-record>

    <!-- 客户费用明细 -->
    <std-creation-fee-detail :stdCreationFeeDetailWin="stdCreationFeeDetailWin" :feeDetailParams="feeDetailParams" :dictMap="dictMap"
                           @stdCreationFeeDetailWinClose="stdCreationFeeDetailWinClose" ref="stdCreationFeeDetail"></std-creation-fee-detail>

    <common-excel-download @handleSubmit="exportTable" @showExcelTemplateWinClose="showExcelTemplateWinClose" :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.excelParam" :rows="this.rows"></common-excel-download>
  </div>
</template>

<script>
  import { post, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "stdCreationFeeAccountBill",
    components: {
      stdCreationFeeDetail: () => import(/* webpackChunkName: "bs/corpstdbill/creation/stdCreationFeeDetail" */"@/views/bizViews/bs/corpstdbill/creation/stdCreationFeeDetail"),
      StdCreationFeeFormItem: () => import(/* webpackChunkName: "bs/corpstdbill/creation/stdCreationFeeFormItem" */"@/views/bizViews/bs/corpstdbill/creation/stdCreationFeeFormItem")
    },
    data() {
      return {
        batchId: "",
        feeAccountForm: {
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
          feeRate: "",
          totalFeeAmt:"",
          totalSettleAmt:"",
          totalSellFeeAmt:"",
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
          feeAcctBrchNo:"",
          interestStatus:"",
          purchaseResult:"",
          financeRatePct:"",
          creationAmt:"",
          creationTerm:"",
          creationNum:"",
          beginDueDt:"",
          endDueDt:""
        },
        dataGridFormItem: {
          id: ""
        },

        //清单导出
        excelParam:null,
        rows: null,
        tempShowExcelTemplateWin: false,

        feeDetailParams:{},
        param : {},
        acctRecord : "/bs/corpstdbill/creation//stdCreationCounterAccount/func_queryStdCreationCounterRecord",
        accountUrl : "/bs/corpstdbill/creation/stdCreationCounterAccount/func_stdCreationCounterAccount",
        showPrintButton:false,
        acctSubmitFlag:false,
        stdCreationFeeDetailWin: false,
        showAcctRecordWin : false,
        columns: [
          {
            type: "index",
            key: "numOrder",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.custName"),
            key: "custName",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.common.custAcctNo"),
            key: "custPyeeAcctNo",
            hiddenCol: false,
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
            title: this.$t("m.i.billInfo.billNo"),
            key: "billNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.billInfo.drwrName"),
            key: "drwrName",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.acptName"),
            key: "acptName",
            hiddenCol: false,
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
            align: "right",
            sortable: true,
            render: (h, params) => {
              return h("p", formatNumber(params.row.billMoney, 2, ","));
            }
          },
          {
            title: this.$t("m.i.bs.feeAmt"),
            key: "feeAmt",
            hiddenCol: false,
            align: "right",
            sortable: true,
            render: (h, params) => {
              return h("p", formatNumber(params.row.feeAmt, 2, ","));
            }
          },
          {
            title: this.$t("m.i.bs.sellFeeAmt"),
            key: "sellFeeAmt",
            hiddenCol: false,
            align: "right",
            sortable: true,
            render: (h, params) => {
              return h("p", formatNumber(params.row.sellFeeAmt, 2, ","));
            }
          },
          {
            title: this.$t("m.i.bs.settleAmt"),
            key: "settleAmt",
            hiddenCol: false,
            align: "right",
            sortable: true,
            render: (h, params) => {
              return h("p", formatNumber(params.row.settleAmt, 2, ","));
            }
          },
        ],
      };
    },
    props: {
      stdCreationCounterShowWin: {
        type: Boolean,
        default: false
      },
      batchParams: {
        type: Object,
        default: {}
      },
      dictMap: { //CorpScale,Industry,partnerType,Yon
        type: Map
      },
    },
    watch: {
      stdCreationCounterShowWin(val) {
        if (val) {
          this.$nextTick(() => {
            this.batchId = this.batchParams.batchId;
            this.dataGridFormItem.id = this.batchParams.batchId;
            this.queryObjById();
            this.$refs.datagrid.dataChange(1);
          });
        }
      },
      batchId(val) {
        this.batchId = val;
      }
    },
    computed: {
      tempStdCreationCounterShowWin: {
        get() {
          return this.stdCreationCounterShowWin;
        },
        set() {
        }
      }
    },
    methods: {
      //根据批次Id查询批次信息
      queryObjById() {
        let params = { id: this.batchId };
        let url = "/bs/corpstdbill/creation/stdCreationCounterAccount/func_jumpStdCreationCounter";
        post(params, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let obj = res.data.retData;
              this.feeAccountForm.id = obj.id;
              this.feeAccountForm.legalNo = obj.legalNo;
              this.feeAccountForm.memberId = obj.memberId;
              this.feeAccountForm.batchNo = obj.batchNo;
              this.feeAccountForm.dpstId = obj.dpstId;
              this.feeAccountForm.flowStatus = obj.flowStatus;
              this.feeAccountForm.prodNo = obj.prodNo;
              this.feeAccountForm.prodName = obj.prodName;
              this.feeAccountForm.collectMode = obj.collectMode;
              this.feeAccountForm.calFeeType = obj.calFeeType;
              this.feeAccountForm.feeControlMode = obj.feeControlMode;
              this.feeAccountForm.feeRate = obj.feeRate;
              this.feeAccountForm.baseAssetType = obj.baseAssetType;
              this.feeAccountForm.billType = obj.billType;
              this.feeAccountForm.billClass = obj.billClass;
              this.feeAccountForm.totalFeeAmt = formatNumber(obj.totalFeeAmt, 2, ',');
              this.feeAccountForm.totalSettleAmt = formatNumber(obj.totalSettleAmt, 2, ',');
              this.feeAccountForm.totalSellFeeAmt = formatNumber(obj.totalSellFeeAmt, 2, ',');
              this.feeAccountForm.feeAcctBrchNo = obj.feeAcctBrchNo;
              this.feeAccountForm.interestStatus = obj.interestStatus;
              this.feeAccountForm.financeRatePct = obj.financeRatePct;
              this.feeAccountForm.creationAmt = formatNumber(obj.creationAmt, 2, ',');
              this.feeAccountForm.creationTerm = obj.creationTerm;
              this.feeAccountForm.creationNum = obj.creationNum;
              this.feeAccountForm.purchaseResult = obj.purchaseResult;
              if (obj.stdProductName){
                this.feeAccountForm.stdProductName = obj.stdProductName;
              }
              if (obj.stdProductShortName){
                this.feeAccountForm.stdProductShortName = obj.stdProductShortName;
              }
              if (obj.stdProductNo){
                this.feeAccountForm.stdProductNo = obj.stdProductNo;
              }
              if (obj.ecdsAcctNo){
                this.feeAccountForm.ecdsAcctNo = obj.ecdsAcctNo;
              }
              this.feeAccountForm.ecdsAcctName = obj.ecdsAcctName;
              this.feeAccountForm.dpstOrgCode = obj.dpstOrgCode;
              this.feeAccountForm.dpstBrchName = obj.dpstBrchName;
              this.feeAccountForm.dpstBankNo = obj.dpstBankNo;
              this.feeAccountForm.dpstBrchCode = obj.dpstBrchCode;
              this.feeAccountForm.sellBrchName = obj.sellBrchName;
              if (obj.creationMaxAmt){
                this.feeAccountForm.creationMaxAmt = obj.creationMaxAmt===null?"":obj.creationMaxAmt.toString();
              }
              if(obj.creationMaxTerm){
                this.feeAccountForm.creationMaxTerm = obj.creationMaxTerm;
              }
              this.feeAccountForm.financeMaxRate = obj.financeMaxRate;
              this.feeAccountForm.financeMinRate = obj.financeMinRate;
              this.feeAccountForm.financeMaxRatePct = obj.financeMaxRatePct;
              this.feeAccountForm.financeMinRatePct = obj.financeMinRatePct;
              this.feeAccountForm.preBeginDueDt = obj.preBeginDueDt=== null ? "" : obj.preBeginDueDt.toString();
              this.feeAccountForm.preEndDueDt = obj.preEndDueDt=== null ? "" : obj.preEndDueDt.toString();
              this.feeAccountForm.publishDt = obj.publishDt=== null ? "" : obj.publishDt.toString();
              this.feeAccountForm.declareEndDt = obj.declareEndDt=== null ? "" : obj.declareEndDt.toString();
              this.feeAccountForm.declareEndTm = obj.declareEndTm;
              if(this.feeAccountForm.declareEndDt){
                if(this.feeAccountForm.declareEndTm){
                  let declareEndTm= new String(this.feeAccountForm.declareEndTm);
                  while (declareEndTm.length<6){
                    declareEndTm="0"+declareEndTm;
                  }
                  this.feeAccountForm.declareEndDtTm=this.feeAccountForm.declareEndDt+declareEndTm;
                }else{
                  this.feeAccountForm.declareEndDtTm=this.feeAccountForm.declareEndDt+"000000";
                }
              };
              this.feeAccountForm.purchaseDt = obj.purchaseDt=== null ? "" : obj.purchaseDt.toString();
              this.feeAccountForm.raiseDt = obj.raiseDt=== null ? "" : obj.raiseDt.toString();
              this.feeAccountForm.paymentDt = obj.paymentDt=== null ? "" : obj.paymentDt.toString();
              this.feeAccountForm.transPlace = obj.transPlace;
              this.feeAccountForm.beginDueDt = obj.beginDueDt=== null ? "" : obj.beginDueDt.toString();
              this.feeAccountForm.endDueDt = obj.endDueDt=== null ? "" : obj.endDueDt.toString();
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
      //费用计算
      feeCount(){
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("确认要计算费用吗") + "?",
          onOk: () => {
            if(this.batchId) {
              let id = this.batchId;
              let url = "/bs/corpstdbill/creation/stdCreationFeeAccount/func_countStdCreationFee";
              post({ id: id }, url).then(res => {
                if (res) {
                  let retCode = res.data.retCode
                  if (retCode == "000000") {
                    this.$msgTip.success(this);
                    this.queryObjById();
                    this.$refs.datagrid.dataChange(1);
                  } else {
                    this.$msgTip.error(this, { info: res.data.retMsg });
                  }
                } else {
                  this.$msgTip.error(this, { info: this.$t('m.i.common.netError') });
                }
              });
            }
          }
        });
      },
      payAccount() {
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("确认要支付记账吗") + "?",
          onOk: () => {
            this.param = {id:this.batchId,ownedBrchNo:this.feeAccountForm.feeAcctBrchNo};
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
      //打开客户费用明细
      custFeeDetail(){
        if (this.feeAccountForm.interestStatus != 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.bs.countFeeFirst") });
          return;
        }
        this.feeDetailParams.batchId = this.batchParams.batchId
        this.stdCreationFeeDetailWin = true;
      },
      stdCreationFeeDetailWinClose() {
        this.stdCreationFeeDetailWin = false;
        let pageNo = this.$refs.datagrid.pageInfo.pageNo;
        this.handleSearch(pageNo);
        this.feeDetailParams = {};
      },
      //关闭弹窗
      handleClose() {
        this.$refs.feeAccountForm.resetFields();
        this.feeAccountForm.id = "";
        this.batchId="";
        this.$emit("stdCreationCounterShowWinClose", "");
      },

      listExport() {
        this.excelParam = 'stdCreationAccountBillExport';
        this.rows = this.$refs.datagrid.total;
        this.tempShowExcelTemplateWin = true;
      },
      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },
      tempShowExcelTemplateWinOpen() {
        this.excelParam = 'stdCreationAccountBillExport';
        this.rows = this.$refs.datagrid.total;
        this.tempShowExcelTemplateWin = true;
      },
      //清单导出
      exportTable(field, exportType) {
        //exportType: 0-同步 1-异步
        if(exportType === "1"){
          let url = window.LOCAL_CONFIG.API_HOME + '/bs/corpstdbill/creation/stdCreationFeeAccount/func_exportBillData'
          let params = null;
          params = { dpstId:this.feeAccountForm.dpstId,
            field: field, exportType: exportType, excelName: this.excelParam};

          post(params, url).then(res => {
            if(res.status === 200 && res.data === null){
              this.$msgTip.info(this, { info:"异步导出成功，请进入公共管理》导出下载页面，进行下载"});
            }else if(res.status === 200 && res.data === ""){
              this.$msgTip.info(this, { info:"异步导出成功，请进入公共管理》导出下载页面，进行下载"});
            } else{
              this.$msgTip.error(this, { info: "异步导出失败" });
            }
          });
        }else {
          let url = window.LOCAL_CONFIG.API_HOME + '/bs/corpstdbill/creation/stdCreationFeeAccount/func_exportBillData'
          let form = document.createElement("form");
          form.setAttribute("id", "formId");
          form.setAttribute("action", url);
          form.setAttribute("method", "post");
          let key;
          for (key in this.tmpForm) {
            let input = document.createElement('input')
            input.type = 'text'
            input.name = key
            input.value = this.tmpForm[key]
            form.appendChild(input);
          }
          let input1 = document.createElement('input')
          input1.type = 'text'
          input1.name = "dpstId"
          input1.value = this.feeAccountForm.dpstId;
          form.appendChild(input1);
          let input2 = document.createElement('input')
          input2.type = 'text'
          input2.name = 'field';
          input2.value = field;
          form.appendChild(input2)
          let input3 = document.createElement('input')
          input3.type = 'text'
          input3.name = 'exportType';
          input3.value = exportType;
          form.appendChild(input3)
          let input4 = document.createElement('input')
          input4.type = 'text'
          input4.name = 'excelName';
          input4.value = this.excelParam;
          form.appendChild(input4)
          document.body.appendChild(form);
          form.submit();
          document.body.removeChild(form);
        }
      },
    }
  };
</script>

<style scoped>

</style>
