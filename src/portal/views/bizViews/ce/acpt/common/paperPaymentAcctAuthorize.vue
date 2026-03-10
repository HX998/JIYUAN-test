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
                <h-col span="9" class="label">{{$t('m.i.ce.totalAmt')}}：</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.totalMoney }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.ce.sumCount')}}：</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.totalNum }}</h-col>
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
        url="/ce/acpt/paper/paymentDue/paymentAccountMain/func_queryPageAcptAcctAuthBill"
        ref="acptTrackBillDatagrid">
        <div slot="toolbar">
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
    name: "paperPaymentAcctAuthorize",
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
          ids: "",
          billClass:"ME01",
          acptStatus:"0"
        },
        viewDetailForm : {
          totalNum:"",
          totalMoney: "",
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
            title: this.$t("m.i.billInfo.billNo"),
            key: 'billNo',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params.row.billId);
                  }
                }
              }, params.row.billNo);
            }
          },
          {
            title: this.$t("m.i.ce.acptType"),
            key: 'acptType',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap,"AcptType",params.row.acptType);
              return h("span", {
                domProps: {
                  title: list
                }
              }, list);
            }
          },
          {
            title: this.$t("m.i.billInfo.flowStatus"),
            key: 'flowStatusName',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.ce.fastCashStatus"),
            key: 'fastCashStatus',
            hiddenCol: true,
            render: (h, params) => {
              let dict = "";
              if(params.row.fastCashStatus === '1' || params.row.fastCashStatus === '2' || params.row.fastCashStatus === '3'){
                dict = "可秒兑";
              }else if (params.row.fastCashStatus === '5'){
                dict = "不可秒兑";
              }else if(params.row.fastCashStatus === '6'){
                dict = "秒兑失败（人工介入）";
              }
              return h("span",
                {
                  domProps: {
                    title: dict
                  }
                }, dict);
            }
          },
          {
            title: this.$t("m.i.billInfo.riskStatus"),
            key: 'riskStatus',
            hiddenCol: false,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap,"RiskStatus",params.row.riskStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.billInfo.acptProtocalNo"),
            key: 'acptProtocalNo',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.ce.promNoteNo"),
            key: 'promNoteNo',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: 'billType',
            hiddenCol: false,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap,"DraftTypeCode",params.row.billType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.billInfo.billMoney"),
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
            title: this.$t("m.i.billInfo.pyeeName"),
            key: 'pyeeName',
            sortable: true,
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.drwrName"),
            key: 'drwrName',
            sortable: true,
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.drwrAcctNo"),
            key: 'drwrAcctNo',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.remitDt"),
            key: 'remitDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if(params.row.remitDt == null || params.row.remitDt === ""){
                return "";
              }
              let date = this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.billInfo.dueDt"),
            key: 'dueDt',
            hiddenCol: false,
            render: (h, params) => {
              if(params.row.dueDt == null || params.row.dueDt === ""){
                return "";
              }
              let date = this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.ce.entrustAcctNo"),
            key: 'prsttnAcctNo',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.ce.entrustName"),
            key: 'prsttnName',
            sortable: true,
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.ce.entrustBankNo"),
            key: 'prsttnBankNo',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.ce.entrustBankName"),
            key: 'prsttnBankName',
            sortable: true,
            hiddenCol: false,
          }
        ]
      };
    },
    created() {
      this.billFormItem.ids = this.listIds;
    },
    mounted() {
      getDictListByGroups("AcptType,GuarntrType,Yon,RiskStatus,DraftTypeCode").then(res => {
        this.dictMap = res.get("map");
      });
      this.getSumInfo();
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
      querySumUrl: {
        type: String,
        default() {
          return "ce/acpt/paper/paymentDue/paymentAccountMain/func_queryPageAcptAcctAuthBill";
        }
      }
    },
    methods: {
      getSumInfo() {
        //获取批次详细信息
        post({ids: this.listIds}, this.querySumUrl).then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let data = res.data.retData;
              this.viewDetailForm.totalNum = data.pageInfo.count;
              this.viewDetailForm.totalMoney = formatNumber(data.pageInfo.sumMoney, 2, ",");
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
        this.acctRecordUrl = "/ce/acpt/paper/paymentDue/paymentAccountMain/func_generateAcctRecord";
        this.acctRecordParam = {code: this.listIds};
        this.showAcctRecordWin = true;
      },
      //确定记账
      acctSubmitSure(info) {
        let param = {};
        param = {id:this.id,batchId: this.batchId,code: this.listIds,isBack: "0",isAllDataOneBatch:"1",curFuncNo:"PICE010810"};
        this.acctSubmitFlag = true;
        post(param, "/ce/acpt/paper/paymentDue/paymentAccountMain/func_acctAuthorizePass").then(res => {
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
        param = {id:this.id,batchId: this.batchId, ids: this.listIds,curFuncNo: "PICE010810"};
        post(param, "/ce/acpt/paper/backUnused/backUnusedAccount/func_acctAuthorizeReturn").then(res => {
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
