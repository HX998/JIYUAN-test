<template>
  <div>
    <!-- 批次信息 -->
    <div v-if="isShow">
      <div class="text-wrap mb-10">
        <div class="text-header"><span class="tit">{{$t('m.i.ce.detailInfo')}}</span></div>
        <div class="text-body">
          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.billInfo.drwrCustNo')}}：</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.drwrCustNo }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.billInfo.drwrName')}}：</h-col>
                <h-col span="15" class="val">{{viewDetailForm.drwrName}}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.billInfo.drwrAcctNo')}}：</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.drwrAcctNo }}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.billInfo.acptProtocalNo')}}：</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.acptProtocalNo }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.billInfo.remitDt')}}：</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.remitDt == null ? "" : this.$moment(viewDetailForm.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD") }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.ce.acptType')}}：</h-col>
                <h-col span="15" class="val">{{ getDictValueFromMap(this.dictMap,"AcptType",viewDetailForm.acptType)}}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.ce.totalCount')}}：</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.totalCount }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.ce.totalAmt')}}：</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.totalAmt }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.ce.totalFee')}}：</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.totalFee }}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.ce.totalCommitFee')}}：</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.totalCommitFee }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.ce.guarntrType')}}：</h-col>
                <h-col span="15" class="val">{{ getDictValueFromMap(this.dictMap,"GuarntrType",viewDetailForm.guarntrType) }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.ce.feeRatio')}}：</h-col>
                <h-col span="15" class="val">{{viewDetailForm.feeRatio}}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.ce.commitFeeRatio')}}：</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.commitFeeRatio }}</h-col>
              </h-row>
            </h-col>
          </h-row>
        </div>
      </div>
    </div>
    <!-- 数据展示表格 -->
    <div v-if="isShow">
      <h-datagrid
        :columns="billColumns"
        highlight-row
        :height="350"
        :bindForm="billFormItem"
        url="/ce/acpt/paper/account/acptAccountMain/func_queryPageAcptAcctAuthBill"
        ref="acptTrackBillDatagrid">
        <div slot="toolbar">
          <h-button type="primary" @click="cancelAccount()" v-if="acctType === '2'">{{$t("m.i.ce.cancelAccount")}}</h-button>
          <h-button type="primary" @click="account()" v-if="acctType === '1'">{{$t("m.i.ce.accountRecheck")}}</h-button>
          <h-button type="primary" @click="acctAuthorizeBack()">{{$t("m.i.ce.acctAuthorizeBack")}}</h-button>
          <h-button type="ghost" @click="returnMain()">{{$t("m.i.common.goBack")}}</h-button>
        </div>
      </h-datagrid>
    </div>
    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId" :billNo="this.billNo"></bill-info-main>
    <!-- 分录弹框 -->
    <acct-record :param="this.acctRecordParam"
                 :url="this.acctRecordUrl"
                 :show-acct-record-win="this.showAcctRecordWin"
                 :showPrintButton="this.showPrintButton"
                 :isShowAcctAuth = "true"
                 @acctSubmitSure="acctSubmitSure"
                 @showAcctRecordWinClose="showAcctRecordWinClose" :submitFlag="this.acctSubmitFlag"
                 @printSuccessCallback="printSuccessCallback"></acct-record>
    <!--保证金账号查询-->
    <show-deduct-acct @dueDeductAcctWinClose="dueDeductAcctWinClose" :dueDeductAcctWin="dueDeductAcctWin" :params="showParams"></show-deduct-acct>
  </div>
</template>

<script>
  import { accMul, formatNumber, getDictListByGroups, getDictValueFromMap, post,getBusinessParameter } from "@/api/bizApi/commonUtil";

  export default {
    name: "paperAcptAcctAuthorize",
    components: {
      ShowDeductAcct:()=>import(/* webpackChunkName: "ce/acpt/common/showDeductAcct" */`@/views/bizViews/ce/acpt/common/showDeductAcct`),
    },
    data() {
      return {
        //票面信息页面
        showBillInfoWin : false,
        billId : "",
        acctRecordUrl : "",
        acctRecordParam : {},
        showAcctRecordWin : false,
        showPrintButton : false,
        billNo : "",
        acctSubmitFlag : false,
        //查询保证金账户信息
        dueDeductAcctWin: false,
        showParams: {
          listId:"",
        },
        dictMap : new Map(),
        billFormItem : {
          batchId: "",
          ids: "",
          curFuncNo:"PICE010306",
          billClass:"ME01"
        },
        viewDetailForm : {
          drwrCustNo:"",
          drwrName: "",
          drwrAcctNo: "",
          acptProtocalNo:"",
          remitDt:"",
          acptType:"",
          totalCount:"",
          totalAmt:"",
          totalFee:"",
          totalCommitFee:"",
          guarntrType:"",
          feeRatio:"",
          commitFeeRatio:""
        },
        billColumns : [
          {
            type: 'index',
            key: 'numOrder',
            title: this.$t("m.i.common.index"),
            width: 60,
            align: 'center',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.ce.promNoteNo"),
            key: 'promNoteNo',
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t("m.i.billInfo.billNo"),
            key: 'billNo',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let billNo = "";
              if (params.row.billNo === null || params.row.billNo === "") {
                billNo = "查看票面";
              }else {
                billNo = params.row.billNo;
              }
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params.row.billId);
                  }
                }
              }, billNo);
            }
          },
          {
            title: this.$t("m.i.billInfo.flowStatus"),
            key: 'flowStatusName',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.billMoneyByUnit"),
            key: 'billMoney',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let billMoney = formatNumber(params.row.billMoney, 2, ',');
              return h("span", {
                domProps: {
                  title: billMoney
                }
              }, billMoney);
            }
          },
          {
            title: this.$t("m.i.billInfo.dueDt"),
            key: 'dueDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if(params.row.dueDt == null || params.row.dueDt === ""){
                return "";
              }
              let date = this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.ce.fee"),
            key: 'fee',
            hiddenCol: false,
            render: (h, params) => {
              let fee = formatNumber(params.row.fee, 2, ',');
              return h("span", {
                domProps: {
                  title: fee
                }
              }, fee);
            }
          },
          {
            title: this.$t("m.i.ce.commitFee"),
            key: 'commitFee',
            hiddenCol: false,
            render: (h, params) => {
              let commitFee = formatNumber(params.row.commitFee, 2, ',');
              return h("span", {
                domProps: {
                  title: commitFee
                }
              }, commitFee);
            }
          },
          {
            title: this.$t("m.i.billInfo.pyeeName"),
            key: 'pyeeName',
            sortable: true,
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.pyeeAcctNo"),
            key: 'pyeeAcctNo',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.pyeeBankName"),
            key: 'pyeeBankName',
            sortable: true,
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.acptName"),
            key: 'acptName',
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t("m.i.ce.bailPcetStr"),
            key: 'bailPcet',
            hiddenCol: false,
            render: (h, params) => {
              if(params.row.bailPcet != null && params.row.bailPcet !== ""){
                let rate = accMul(params.row.bailPcet, 100);
                let rateFormat = formatNumber(rate, 2, ',');
                return h("span", rateFormat);
              }
            }
          },
          {
            title: this.$t("m.i.ce.guarntrAmt"),
            key: 'guarntrAmt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let guarntrAmt = formatNumber(params.row.guarntrAmt, 2, ',');
              return h("span", {
                domProps: {
                  title: guarntrAmt
                }
              }, guarntrAmt);
            }
          },
          {
            title: this.$t("m.i.ce.guarntrNo"),
            key: "guarntrNo",
            hiddenCol: false,
            render: (h, params) => {
              return h("a", {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.showDueDeductAcct(params.row.id);
                  }
                }
              }, '查看');
            }
          },
          {
            title: this.$t("m.i.ce.settleAcctNo"),
            key: 'settleAcctNo',
            hiddenCol: false,
          }
        ],
        //影像上传
        showUploadImageWin : false,
        imageParams : {
          listId: Number,
          prodNo: String,
          imgType: "IM20",
          queryUrl: window.LOCAL_CONFIG.API_HOME + "/bm/audit/prodAuditMain/func_paperDiscImageListPage",
          viewUrl: window.LOCAL_CONFIG.API_HOME + "/bm/audit/prodAuditMain/func_paperDiscImageById"
        },
      };
    },
    created() {
      this.billFormItem.ids = this.listIds;
      this.billFormItem.batchId = this.batchId;
      this.imageParams.listId = this.batchId;
    },
    mounted() {
      getDictListByGroups("AcptType,GuarntrType,Yon").then(res => {
        this.dictMap = res.get("map");
      });
      this.getBatchInfo();

    },
    props: {
      isShow: {
        type: Boolean,
        default: false
      },
      listIds: "",
      batchId: "",
      id:"",
      acctType:"",
      queryBatchUrl: {
        type: String,
        default() {
          return "ce/acpt/paper/account/acptAccountMain/func_getAcptBatchByQueryDto";
        }
      }
    },
    methods: {
      getBatchInfo() {
        //获取批次详细信息
        post({ id: this.batchId, ids: this.listIds}, this.queryBatchUrl).then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.viewDetailForm = res.data.retData;
              if (this.viewDetailForm.totalAmt !== null && this.viewDetailForm.totalAmt !== "") {
                this.viewDetailForm.totalAmt = formatNumber(this.viewDetailForm.totalAmt, 2, ",");
              }
              if (this.viewDetailForm.totalFee !== null && this.viewDetailForm.totalFee !== "") {
                this.viewDetailForm.totalFee = formatNumber(this.viewDetailForm.totalFee, 2, ",");
              }
              if (this.viewDetailForm.totalCommitFee !== null && this.viewDetailForm.totalCommitFee !== "") {
                this.viewDetailForm.totalCommitFee = formatNumber(this.viewDetailForm.totalCommitFee, 2, ",");
              }
              if (this.viewDetailForm.feeRatio !== null && this.viewDetailForm.feeRatio !== "") {
                this.viewDetailForm.feeRatio = accMul(this.viewDetailForm.feeRatio,10000)+"‱";
              }
              if (this.viewDetailForm.commitFeeRatio !== null && this.viewDetailForm.commitFeeRatio !== "") {
                this.viewDetailForm.commitFeeRatio = accMul(this.viewDetailForm.commitFeeRatio,10000)+"‱";
              }
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      },
      //记账
      account() {
        this.acctRecordUrl = "/ce/acpt/paper/account/acptAccountMain/func_generateAcctAuthRecord";
        this.acctRecordParam = {batchId: this.batchId, billOperType: "0", ids: this.listIds ,funcNo: "PICE010306"}
        this.showAcctRecordWin = true;
      },
      //确定记账
      acctSubmitSure(info) {
        let param = {};
        param = {id:this.id,batchId: this.batchId, billOperType: "0", ids: this.listIds, funcNo: "PICE010306",isBack: "0"};
        this.acctSubmitFlag = true;
        post(param, "/ce/acpt/paper/account/acptAccountMain/func_acctAuthorizePass").then(res => {
          this.acctSubmitFlag = false;
          if(res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            debugger
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.showPrintButton = true;
              if(!info.isHasPrint) {
                this.showAcctRecordWinClose();
              }
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      },
      submitCancelAccount(){
        let param = {};
        param = {id:this.id,batchId: this.batchId,ids: this.listIds, billOperType: "0",acctType:"2"};
        post(param, "/ce/acpt/paper/account/acptAccountMain/func_cancelAcctAuthorizePass").then(res => {
          if(res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            debugger
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.acptTrackBillDatagrid.dataChange(1,(data)=>{
                if(data.length === 0) {
                  this.returnMain();
                }
              })
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      },
      //确定撤销记账
      cancelAccount() {
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定撤销记账吗？",
          onOk: () => {
            this.submitCancelAccount();
          }
        });
      },
      //关闭分录弹窗
      showAcctRecordWinClose() {
        this.showAcctRecordWin = false;
        this.showPrintButton = false;
        this.acctRecordParam = {};
        this.acctRecordUrl = "";
        this.$refs.acptTrackBillDatagrid.dataChange(1,(data)=>{
          if(data.length === 0) {
            this.returnMain();
          }
        })
      },
      //打印成功回调
      printSuccessCallback() {
        this.showAcctRecordWinClose();
      },
      returnMain(){
        this.$emit("returnMain");
      },
      //记账授权退回
      acctAuthorizeBack(){
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定记账授权退回吗？",
          onOk: () => {
            this.submitAcctAuthorizeBack();
          }
        });
      },
      submitAcctAuthorizeBack(){
        let param = {};
        param = {id:this.id,batchId: this.batchId, ids: this.listIds};
        post(param, "/ce/acpt/paper/account/acptAccountMain/func_acctAuthorizeReturn").then(res => {
          if(res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.returnMain();
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      },
      //票面信息关闭
      billInfoWinClose() {
        this.showBillInfoWin = false;
      },
      //票面信息
      showBillInfo(billId, billNo) {
        this.billId = billId;
        this.billNo = billNo;
        this.showBillInfoWin = true;
      },
      showDueDeductAcct(id) {
        this.showParams.listId = id;
        this.dueDeductAcctWin = true;
      },
      dueDeductAcctWinClose() {
        this.dueDeductAcctWin = false;
      },
    }
  };
</script>

<style scoped>

</style>
