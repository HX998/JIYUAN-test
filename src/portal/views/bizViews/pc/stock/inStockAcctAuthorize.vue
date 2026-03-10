<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div v-if="isShow">
          <div class="text-wrap mb-10">
            <div class="text-header"><span class="tit">{{$t('m.i.ce.detailInfo')}}</span></div>
            <div class="text-body">
              <h-row :gutter="8">
                <h-col span="8">
                  <h-row>
                    <h-col span="9" class="label">客户名称：</h-col>
                    <h-col span="15" class="val">{{ viewDetailForm.custName }}</h-col>
                  </h-row>
                </h-col>
                <h-col span="8">
                  <h-row>
                    <h-col span="9" class="label">客户号：</h-col>
                    <h-col span="15" class="val">{{ viewDetailForm.custNo }}</h-col>
                  </h-row>
                </h-col>
                <h-col span="8">
                  <h-row>
                    <h-col span="9" class="label">{{$t('m.i.common.batchNo')}}：</h-col>
                    <h-col span="15" class="val">{{ viewDetailForm.batchNo }}</h-col>
                  </h-row>
                </h-col>
              </h-row>
              <h-row :gutter="8">
                <h-col span="8">
                  <h-row>
                    <h-col span="9" class="label">实物机构：</h-col>
                    <h-col span="15" class="val">{{ viewDetailForm.brchName }}</h-col>
                  </h-row>
                </h-col>
                <h-col span="8">
                  <h-row>
                    <h-col span="9" class="label">申请日期：</h-col>
                    <h-col span="15" class="val">{{ viewDetailForm.applDt  == null ? "" : this.$moment(viewDetailForm.applDt, "YYYY-MM-DD").format("YYYY-MM-DD")}}</h-col>
                  </h-row>
                </h-col>
                <h-col span="8">
                  <h-row>
                    <h-col span="9" class="label">{{$t('m.i.billInfo.billType')}}：</h-col>
                    <h-col span="15" class="val">{{ getDictValueFromMap(this.dictMap,"DraftTypeCode",viewDetailForm.billType) }}</h-col>
                  </h-row>
                </h-col>
              </h-row>
              <h-row :gutter="8">
                <h-col span="8">
                  <h-row>
                    <h-col span="9" class="label">{{$t('m.i.ce.totalCount')}}：</h-col>
                    <h-col span="15" class="val">{{ viewDetailForm.sumCount }}</h-col>
                  </h-row>
                </h-col>
                <h-col span="8">
                  <h-row>
                    <h-col span="9" class="label">{{$t('m.i.ce.totalAmt')}}：</h-col>
                    <h-col span="15" class="val">{{ viewDetailForm.sumMoney }}</h-col>
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
            :bindForm="billFormItem"
            url="/pc/stock/inStockBatchMain/func_queryStockBillInfoByPage"
            :row-select="true"
            :has-select="false"
            ref="stockAccountBillDatagrid">
            <div slot="toolbar">
              <h-button type="primary" @click="account()" v-if="acctType === '1'">{{$t("m.i.ce.accountRecheck")}}</h-button>
              <h-button type="primary" @click="acctAuthorizeBack()">{{$t("m.i.ce.acctAuthorizeBack")}}</h-button>
              <go-back-btn @returnBack="returnMain"></go-back-btn>
            </div>
          </h-datagrid>
        </div>
        <!-- 分录弹框 -->
        <acct-record :param="this.acctRecordParam" :url="this.acctRecordUrl" :show-acct-record-win="this.showAcctRecordWin" :showPrintButton="this.showPrintButton"
                     @acctSubmitSure="acctSubmitSure" @showAcctRecordWinClose="showAcctRecordWinClose" :submitFlag="this.acctSubmitFlag"
                     @printSuccessCallback="printSuccessCallback" :isShowAcctAuth = "true"></acct-record>
        <!--票面信息-->
        <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"></bill-info-main>
      </h-col>
    </h-row>
  </div>
</template>

<script>
  import { post,on,off ,getDictListByGroups ,formatNumber ,getDictValueFromMap,accMul} from "@/api/bizApi/commonUtil";
  export default {
    name: "inStockAcctAuthorize",
    data() {
      return {
        tempIsShow : false,
        viewDetailForm : {
          custName:"",
          custNo:"",
          batchNo:"",
          brchName:"",
          outInDt:"",
          applDt:"",
          billType:"",
          sumCount:"",
          sumMoney:"",
        },
        billFormItem: {
          batchId:"",
          listIds:[],
          operType:"0",
          busiType:"1",
          flowStatus:"EN04"
        },
        billColumns : [
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: this.$t("m.i.billInfo.billNo"),
            key: "billNo",
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
            title: this.$t("m.i.billInfo.billMoney"),
            key: "billMoney",
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
            title: this.$t("m.i.billInfo.remitDt"),
            key: "remitDt",
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
            key: "dueDt",
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
            title:"承兑人全称",
            key:"acptName",
            hiddenCol:false
          },
          {
            title:"出票人全称",
            key:"drwrName",
            hiddenCol:false
          },
          {
            title:"出票人账号",
            key:"drwrAcctNo",
            hiddenCol:false
          },
          {
            title:"出票人开户行行号",
            key:"drwrBankNo",
            hiddenCol:false
          },
          {
            title:"付款行行号",
            key:"drweBankNo",
            hiddenCol:false
          },
          {
            title:"付款行行名",
            key:"drweBankName",
            hiddenCol:false
          },
          {
            title:"收款人全称",
            key:"pyeeName",
            hiddenCol:false
          },
          {
            title:"收款人账号",
            key:"pyeeAcctNo",
            hiddenCol:false
          }
        ],
        acctRecordUrl : "",
        acctRecordParam : {},
        showAcctRecordWin : false,
        acctSubmitFlag : false,
        showPrintButton : false,
        dictMap: new Map(),

        //票面信息页面
        showBillInfoWin : false,
        billId : "",
    };
    },
    created() {
      this.billFormItem.ids = this.listIds;
      this.billFormItem.batchId = this.batchId;
    },
    props : {
      batchId: "",
      isShow: {
        type: Boolean,
        default: false
      },
      batchUrl : {
        type : String,
        default (){
          return "/pc/stock/inStockBatchMain/func_findStockBatchInfo";
        }
      },
      listIds: "",
      batchId: "",
      id:"",
      acctType:"",
    },
    mounted() {
      getDictListByGroups("DraftTypeCode").then(res => {
        this.dictMap = res.get("map");
      });
      this.getBatchInfo();
    },
    methods: {
      getBatchInfo() {
        //获取批次详细信息
        post({batchId:this.batchId,ids:this.listIds,flowStatus:this.billFormItem.flowStatus}, this.batchUrl).then(res => {
          if(res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.viewDetailForm = res.data.retData;
              if(this.viewDetailForm.sumMoney !== null && this.viewDetailForm.sumMoney !== ""){
                this.viewDetailForm.sumMoney = formatNumber(this.viewDetailForm.sumMoney, 2, ',');
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
        this.acctRecordUrl = "/pc/stock/inStockBatchMain/func_generateAcctRecord";
        this.acctRecordParam = {batchId: this.batchId, pageOperType: "0", ids: this.listIds,busiType: "1" }
        this.showAcctRecordWin = true;
      },
      //确定记账
      acctSubmitSure(info) {
        let param = {};
        param = {acctAuthId:this.id,batchId: this.batchId, pageOperType: "0", ids: this.listIds,busiType: "1" };
        this.acctSubmitFlag = true;
        post(param, "/pc/stock/inStockBatchMain/func_acctAuthorizePass").then(res => {
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
        this.$refs.stockAccountBillDatagrid.dataChange(1,(data)=>{
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
        param = {acctAuthId:this.id,batchId: this.batchId,pageOperType: "0", ids: this.listIds,busiType: "1"};
        post(param, "/pc/stock/inStockBatchMain/func_acctAuthorizeReturn").then(res => {
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
    }
  };
</script>

<style scoped>

</style>
