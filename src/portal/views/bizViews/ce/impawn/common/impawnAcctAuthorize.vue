<template>
  <div>
    <div>
      <div class="text-wrap mb-10">
        <div class="text-header"><span class="tit">{{$t('m.i.ce.detailInfo')}}</span></div>
        <div class="text-body">
          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.common.batchNo')}}：</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.batchNo }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.common.custNo')}}：</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.custNo }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.common.custName')}}：</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.custName }}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.common.custAcctNo')}}：</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.custAcctNo }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.billInfo.billType')}}：</h-col>
                <h-col span="15" class="val">{{ this.getDictValueFromMap(this.dictMap, "DraftTypeCode", viewDetailForm.billType) }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.ce.impawnDt')}}：</h-col>
                <h-col span="15" class="val">{{ viewDetailForm.impawnDt }}
                </h-col>
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
                <h-col span="15" class="val">{{ viewDetailForm.sumMoney}}</h-col>
              </h-row>
            </h-col>
          </h-row>
        </div>
      </div>
    </div>

    <!-- 数据展示表格 -->
    <h-datagrid :columns="billManagerColumns"
                  url="/ce/impawn/elec/elecImpawn/eImpawnAccountMain/func_pageQueryImpawnBillList"
                  highlightRow
                  :bindForm="billManagerFormItem"
                  :has-select="false"
                  :rowSelect="true"
                  ref="billManagerDatagrid">
        <div slot="toolbar" class="pull-left">
          <h-button type="primary" @click="account()">{{$t("m.i.ce.accountRecheck")}}</h-button>
          <h-button type="primary" @click="acctAuthorizeBack()">{{$t("m.i.ce.acctAuthorizeBack")}}</h-button>
          <h-button type="ghost" @click="returnMain">{{$t("m.i.common.goBack")}}</h-button>
        </div>
    </h-datagrid>

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
  </div>
</template>

<script>
  import { post, on, off, formatNumber,getDictValueFromMap } from "@/api/bizApi/commonUtil";
  import ImpawnBatchDetail from "@/views/bizViews/ce/impawn/common/impawnBatchDetail";
  export default {
    name: "impawnAcctAuthorize",
    components: {
      ImpawnBatchDetail
    },
    data(){
      return {
        billManagerFormItem: {
          batchId: "",
          funcNo: "PICE030406",
          impawnIds:"",
          billClass: ""
        },
        billManagerColumns: [
          {
            type: "index",
            key: "numOrder",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.billNo"),
            key: "billNo",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let info = "", type = "";
              if (!!params.row.billId) {
                info = params.row.billId;
                type = "billId";
              } else {
                info = params.row.billNo;
                type = "billNo";
              }
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(info, type);
                  }
                }
              }, params.row.billNo);
            }
          },
          {
            title: this.$t("m.i.billInfo.flowStatus"),
            key: "flowStatusName",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",
            ellipsis: false,
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
            title: this.$t("m.i.billInfo.remitDt"),
            key: "remitDt",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.remitDt == null || params.row.remitDt === "") {
                return "";
              }
              let date = this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.billInfo.dueDt"),
            key: "dueDt",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.dueDt == null || params.row.dueDt === "") {
                return "";
              }
              let date = this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.billInfo.billMoneyByUnit"),
            key: "billMoney",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let billMoney = formatNumber(params.row.billMoney, 2, ",");
              return h("span", {
                domProps: {
                  title: billMoney
                }
              }, billMoney);
            }
          },
          {
            title: this.$t("m.i.billInfo.drwrName"),
            key: "drwrName",
            ellipsis: false,
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.drwrAcctNo"),
            key: "drwrAcctNo",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.drwrBankNo"),
            key: "drwrBankNo",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.pyeeName"),
            key: "pyeeName",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.pyeeAcctNo"),
            key: "pyeeAcctNo",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.pyeeBankNo"),
            key: "pyeeBankNo",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.acptName"),
            key: "acptName",
            sortable: true,
            ellipsis: false,
            hiddenCol: false
          }
        ],
        acctSubmitFlag: false,
        showAcctRecordWin: false,
        acctRecordParam: {},
        acctRecordUrl: "",
        //区分批次记账和明细记账
        showBillInfoWin: false,
        billId: "",
        billNo: "",
        dictMap:new Map(),
        showPrintButton:false,
        acctUrl:"",
        acctAuthBackUrl:"",
        viewDetailForm: {
          batchNo: "",
          custNo: "",
          custName: "",
          custAcctNo: "",
          billType: "",
          impawnDt: "",
          unimpawnDt: "",
          sumCount: "",
          sumMoney: ""
        }
      }
    },
    created(){
      this.billManagerFormItem.batchId=this.batchId;
      this.billManagerFormItem.impawnIds=this.listIds;
      this.billManagerFormItem.billClass=this.billClass;

      this.getDictListByGroups("DraftTypeCode").then(res => {
        this.dictMap = res.get("map");
      });
      if (this.billClass ==="ME01") {
        this.acctRecordUrl = "/ce/impawn/paper/paperImpawn/pImpawnAccountMain/func_getImpawnAccount";  //纸票质押记账授权
        this.acctUrl="/ce/impawn/paper/paperImpawn/pImpawnAccountMain/func_acctAuthorizePass";
        this.acctAuthBackUrl="/ce/impawn/paper/paperImpawn/pImpawnAccountMain/func_acctAuthorizeReturn";
      }else {
        this.acctRecordUrl = "/ce/impawn/elec/elecImpawn/eImpawnAccountMain/func_getImpawnAccount"; //电票质押记账授权
        this.acctUrl="/ce/impawn/elec/elecImpawn/eImpawnAccountMain/func_acctAuthorizePass";
        this.acctAuthBackUrl="/ce/impawn/elec/elecImpawn/eImpawnAccountMain/func_acctAuthorizeReturn";
      }
      this.$nextTick(()=>{
        this.getImpawnBatchInfo();
      })
    },
    props: {
      isShow: {
        type: Boolean,
        default: false
      },
      listIds: "",
      batchId: "",
      id:"",
      billClass:"" //票据介质ME01-纸票，ME02-电票
    },
    methods:{
      //记账
      account() {
        this.acctRecordParam = {batchId: this.batchId, operType: "0", impawnIds: this.listIds ,funcNo: "PICE030406"}
        this.showAcctRecordWin = true;
      },
      //确定记账
      acctSubmitSure(info) {
        let param = {};
        param = {acctAuthId:this.id,batchId: this.batchId, operType: "0", impawnIds: this.listIds, funcNo: "PICE030406"};
        this.acctSubmitFlag = true;
        post(param, this.acctUrl).then(res => {
          this.acctSubmitFlag = false;
          if(res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
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
        this.$refs.billManagerDatagrid.dataChange(1,(data)=>{
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
        param = {acctAuthId:this.id,batchId: this.batchId, impawnIds: this.listIds};
        post(param, this.acctAuthBackUrl).then(res => {
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
      getImpawnBatchInfo() {
        let params = {
          id: this.batchId,
          billClass: this.billClass,
          funcNo: "PICE030406",
          impawnIds:this.listIds
        };
        post(params, "/ce/impawn/batch/queryImpawnBatch").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.viewDetailForm.batchNo = res.data.retData.batchNo;
              this.viewDetailForm.custNo = res.data.retData.custNo;
              this.viewDetailForm.custName = res.data.retData.custName;
              this.viewDetailForm.custAcctNo = res.data.retData.custAcctNo;
              this.viewDetailForm.billType = res.data.retData.billType;
              this.viewDetailForm.impawnDt = res.data.retData.impawnDt;
              if (this.viewDetailForm.impawnDt !== null && this.viewDetailForm.impawnDt !== "") {
                this.viewDetailForm.impawnDt = this.$moment(this.viewDetailForm.impawnDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              }
              this.viewDetailForm.sumCount = res.data.retData.sumCount;
              this.viewDetailForm.sumMoney = res.data.retData.sumMoney;
              if (this.viewDetailForm.sumMoney !== null && this.viewDetailForm.sumMoney !== "") {
                this.viewDetailForm.sumMoney = formatNumber(this.viewDetailForm.sumMoney, 2, ",");
              }
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      }
    }
  }
</script>
