<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item prop="reverseBillNo" :label="$t('m.i.billInfo.billNo')">
                  <h-input v-model="formItem.reverseBillNo" placeholder=""></h-input>
                </h-form-item>
                <h-form-item prop="remitDt" :label="$t('m.i.billInfo.remitDt')">
                  <h-date-picker type="daterange" :value="formItemRemitDt" format="yyyy-MM-dd" showFormat :editable=false placeholder="" @on-change="handleRemitDtChange" autoPlacement></h-date-picker>
                </h-form-item>
                <h-form-item prop="dueDt" :label="$t('m.i.billInfo.dueDt')">
                  <h-date-picker type="daterange" :value="formItemDueDt" format="yyyy-MM-dd" showFormat :editable=false placeholder="" @on-change="handleDueDtChange" autoPlacement></h-date-picker>
                </h-form-item>
                <h-form-item prop="prsttnName" :label="$t('m.i.ce.entrustName')">
                  <h-input v-model="formItem.prsttnName" placeholder=""></h-input>
                </h-form-item>
                <h-form-item prop="prsttnAcctNo" :label="$t('m.i.ce.entrustAcctNo')">
                  <h-input v-model="formItem.prsttnAcctNo" placeholder=""></h-input>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont" :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="handleSearch()">{{$t('m.i.common.search')}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t('m.i.common.reset')}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid :columns="columns"
                      highlightRow
                      :row-select="true"
                      :has-select="false"
                      url="/ce/acpt/outerBusiBill/busiPaymentDue/busiPaymentRegisterRecheck/func_queryWaitCheck"
                      :bindForm="formItem"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="inputRecheck" v-if="ifSecondRecheck">{{$t('m.i.common.inputRecheck')}}</h-button>
              <h-button type="primary" @click="recheckPass"  v-if="!ifSecondRecheck">{{$t('m.i.common.recheckPass')}}</h-button>
              <h-button type="primary" @click="recheckBack" >{{$t('m.i.common.recheckReturn')}}</h-button>
            </div>
          </h-datagrid>
        </div>
        <!-- 查询客户信息弹窗 -->
        <show-cust-message :show-cust-message-win="showCustMessageWin"
                           @custCorpWinClose="custCorpWinClose" @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>
        <!-- 查询客户账号信息弹窗 -->
        <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" :cust-no="this.formItem.drwrCustNo"
                           @showCustAcctNoWinClose="showCustAcctNoWinClose" @custAcctNoSelectSubmit="custAcctNoSelectSubmit"></show-cust-acct-no>
        <!-- 退回原因录入弹窗 -->
        <h-msg-box v-model="paymentBackWin" width="400" @on-close="paymentBackWinClose" class="h-form-search-layer" :maximize="true" :mask-closable="false">
          <p slot="header">
            <span>退回原因录入</span>
          </p>
          <div>
            <h-form :model="paymentBackForm" :label-width="115" ref="paymentBackForm" cols="1" class="h-form-search">
              <h-form-item prop="paymentRgstReturnReason" :label="$t('m.i.ce.paymentReturnReason')" required>
                <h-input v-model="paymentBackForm.paymentRgstReturnReason" placeholder="" type="textarea" :rows="3" :canResize="false" :maxlength="100"></h-input>
              </h-form-item>
            </h-form>
          </div>
          <div slot="footer">
            <div slot="footer">
              <h-button type="ghost" @click="paymentBackWinClose">{{$t("m.i.common.close")}}</h-button>
              <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
              <h-button type="primary" v-else @click="paymentBackWinSubmit()">退回</h-button>
            </div>
          </div>
        </h-msg-box>

        <!-- 录入复核 -->
        <h-msg-box v-model="inputRecheckWin" width="400" @on-close="inputRecheckWinClose" class="h-form-search-layer" :maximize="true" :mask-closable="false">
          <p slot="header">
            <span>付款登记复核</span>
          </p>
          <div>
            <h-form :model="inputRecheckForm" :label-width="115" ref="inputRecheckForm" cols="1" class="h-form-search" onlyBlurRequire>
              <h-form-item prop="prsttnBankNo" :label="$t('m.i.ce.entrustBankNo')" required :validRules="prsttnBankNoRule">
                <h-input v-model="inputRecheckForm.prsttnBankNo" placeholder="" :maxlength="12"></h-input>
              </h-form-item>
              <h-form-item prop="prsttnBankName" :label="$t('m.i.ce.entrustBankName')" required>
                <h-input v-model="inputRecheckForm.prsttnBankName" placeholder="" :maxlength="80"></h-input>
              </h-form-item>
              <h-form-item prop="prsttnAcctNo" :label="$t('m.i.ce.entrustAcctNo')" required :validRules="prsttnAcctNoRule">
                <h-input v-model="inputRecheckForm.prsttnAcctNo" placeholder="" :maxlength="35"></h-input>
              </h-form-item>
              <h-form-item prop="prsttnName" :label="$t('m.i.ce.entrustName')" required>
                <h-input v-model="inputRecheckForm.prsttnName" placeholder="" :maxlength="80"></h-input>
              </h-form-item>
            </h-form>
          </div>
          <div slot="footer">
            <div slot="footer">
              <h-button type="ghost" @click="inputRecheckWinClose">{{$t("m.i.common.close")}}</h-button>
              <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
              <h-button type="primary" v-else @click="inputRecheckWinSubmit()">{{$t('m.i.common.recheckPass')}}</h-button>
            </div>
          </div>
        </h-msg-box>
        <!-- 票面 -->
        <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"></bill-info-main>
      </h-col>
    </h-row>
  </div>
</template>

<script>
import {formatNumber, getDictListByGroups, getDictValueFromMap, post} from "@/api/bizApi/commonUtil";

export default {
    name: "busiPaymentRegisterRecheck",
    components: {},
    data() {
      return {
        showBillInfoWin: false,
        billId: "",
        ifSecondRecheck: true,
        prsttnAcctNoRule: [{test: /^[0-9a-zA-Z]{1,35}$/, trigger:'blur', message: '由小于或等于35位数字或字母组成'}],
        prsttnBankNoRule: [{test: /^[0-9]{12}$/, trigger:'blur', message: '请输入12位数字的行号'}],
        formItem: {
          payRgstBrchNo:this.$store.getters.userInfo.brchNo,
          prsttnName: '',
          prsttnAcctNo: '',
          billNoLike: '',
          minRemitDt: "",
          maxRemitDt: "",
          minDueDt: "",
          maxDueDt: "",
          billClass: 'ME01',
          payRgstStatus:"0",
          prsttnRespStatusList: 'SN02',
          order:"PAY_RGST_DT desc",
          reverseBillNo: ''
        },
        formItemRemitDt: "",
        formItemDueDt: "",
        paymentBackForm: {
          ids: '',
          billOperType: '2',
          paymentRgstReturnReason: ''
        },
        inputRecheckForm: {
          ids: '',
          prsttnAcctNo: '',
          prsttnName: '',
          prsttnBankNo: '',
          prsttnBankName: ''
        },
        columns: [
          {
            type: "selection",
            width: 60,
            align: "center",
            hiddenCol: false
          },
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
            title: this.$t("m.i.billInfo.flowStatus"),
            key: 'prsttnRespStatus',
            hiddenCol: false,
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
          },
          {
           title: this.$t("m.i.ce.paymentSignOpin"),
            key: 'paymentSignOpin',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.ce.payRefuseReason"),
            key: 'rejectReason',
            hiddenCol: false,
          },
        ],
        dictMap: new Map(),
        currentSelectList: [],
        showCustAcctNoWin: false,
        showCustMessageWin: false,
        paymentBackWin: false,
        inputRecheckWin: false,
        submitFlag: false,
        ifShowMore: false
      }
    },
    mounted() {
      getDictListByGroups("Yon,DraftTypeCode,AcptType,RiskStatus,DraftTypeCode,").then(res => {
        this.dictMap = res.get("map");
      });
      this.getIfSecondRecheckBusiParam();
    },
    methods: {
      billInfoWinClose(){
        this.showBillInfoWin = false;
      },
      showBillInfo(billId){
        this.billId = billId;
        this.showBillInfoWin = true;
      },
      handleRemitDtChange(arr) {
        if(arr && arr.length == 2){
          this.formItem.minRemitDt = arr[0].replace(/-/g, "");
          this.formItem.maxRemitDt = arr[1].replace(/-/g, "");
          this.formItemRemitDt = [arr[0], arr[1]];
        } else {
          this.formItem.minRemitDt = "";
          this.formItem.maxRemitDt = "";
          this.formItemRemitDt = [];
        }
      },
      handleDueDtChange(arr) {
        if(arr && arr.length == 2){
          this.formItem.minDueDt = arr[0].replace(/-/g, "");
          this.formItem.maxDueDt = arr[1].replace(/-/g, "");
          this.formItemDueDt = [arr[0], arr[1]];
        } else {
          this.formItem.minDueDt = "";
          this.formItem.maxDueDt = "";
          this.formItemDueDt = [];
        }
      },
      //获取业务参数
      getIfSecondRecheckBusiParam() {
        post({ paramKey: "ce.acpt.corp_payment_rgst_recheck_mode" }, "/sm/auth/businessParamete/getBusinessParameter").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              if (res.data.retData === "1") {
                this.ifSecondRecheck = false;
              } else if (res.data.retData === "0") {
                this.ifSecondRecheck = true;
              }
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //表单查询
      handleSearch() {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds=[]
        this.$nextTick(() => {
          this.$refs.datagrid.dataChange(1);
        })
      },
      //重置表单查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
        this.formItem.minRemitDt = "";
        this.formItem.maxRemitDt = "";
        this.formItem.minDueDt = "";
        this.formItem.maxDueDt = "";
        this.formItemRemitDt = "";
        this.formItemDueDt = "";
      },
      //查询客户信息
      //触发弹窗
      queryCustName() {
        this.showCustMessageWin = true;
      },
      //赋值
      custCorpSelectSubmit(info) {
        this.formItem.drwrAcctNo = "";
        this.formItem.drwrName = info.custName;
        this.formItem.drwrCustNo = info.custNo;
        if(info.custAcctNo !== ""){
          this.formItem.drwrAcctNo = info.custAcctNo;
        }
        this.showCustMessageWin = false;
      },
      //关闭
      custCorpWinClose() {
        this.showCustMessageWin = false;
      },
      //查询客户账号信息
      //触发弹窗
      queryCustAcctNo() {
        if (this.formItem.drwrCustNo === "") {
          this.$msgTip.info(this, { info: "请先选择客户" });
          return;
        }
        this.showCustAcctNoWin = true;
      },
      //赋值
      custAcctNoSelectSubmit(info) {
        this.formItem.drwrAcctNo = info.custAcctNo;
        this.showCustAcctNoWin = false;
      },
      //关闭弹窗
      showCustAcctNoWinClose() {
        this.showCustAcctNoWin = false;
      },

      //录入复核
      inputRecheck() {
        if(this.$refs.datagrid.selects.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        if(this.$refs.datagrid.selects.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return;
        }
        this.inputRecheckWin = true;
      },
      //录入复核确定
      inputRecheckWinSubmit() {
        this.inputRecheckForm.ids = this.$refs.datagrid.selects[0].id;
        this.$refs["inputRecheckForm"].validate(valid => {
          if (valid) {
            let url = "/ce/acpt/outerBusiBill/busiPaymentDue/busiPaymentRegisterRecheck/func_agreePaymentDueRgst";
            post(this.inputRecheckForm, url).then(res => {
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.inputRecheckWinClose();
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
                  this.$refs.datagrid.selects = [];
                  this.$refs.datagrid.selectIds=[]
                } else if(retCode === "0BE320801221"){
                    this.recheckConfirm();
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
      recheckConfirm() {
        let title = "提示";
        let content = `<p class="word-break">录入复核信息与申请岗不一致，是否退回至经办岗?</p>`;
        this.$hMsgBox.confirm({
          title: title,
          content: content,
          onOk: () => {
            this.paymentBackForm.paymentRgstReturnReason = '复核岗录入的信息与申请岗的不一致';
            this.returnBack();
          },
          onCancel: () => {
            //
            // this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
          }
        });
      },
      //录入复核关闭
      inputRecheckWinClose() {
        this.$nextTick(()=>{
          this.$refs.inputRecheckForm.resetFields();
        })
        this.inputRecheckWin = false;
      },
      //复核通过
      recheckPass() {
        if(this.$refs.datagrid.selects.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.$hMsgBox.confirm({
          title: "确认",
          content: "确定复核通过吗？",
          onOk: () => {
            this.$loadingbox.open({
              title: "提交中，请稍后..."
            });
            post({ ids: this.$refs.datagrid.selectIds, billOperType: "1", billClass: "ME01" }, "/ce/acpt/outerBusiBill/busiPaymentDue/busiPaymentRegisterRecheck/func_agreePaymentDueRgst").then(res => {
              if (res) {
                this.$loadingbox.close();
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
                  this.$refs.datagrid.selects = [];
                  this.$refs.datagrid.selectIds=[]
                } else {
                  this.$msgTip.error(this, { info: msg });
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
                  this.$refs.datagrid.selects = [];
                  this.$refs.datagrid.selectIds=[]
                }
              }
            }).catch(error => {
              this.$loadingbox.close();
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
            });
          }
        })
      },
      //复核退回
      recheckBack() {
        if(this.$refs.datagrid.selects.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.paymentBackWin = true;
      },
      returnBack(){
        this.paymentBackForm.ids = this.$refs.datagrid.selectIds;
        this.submitFlag = true;
        post(this.paymentBackForm, "/ce/acpt/outerBusiBill/busiPaymentDue/busiPaymentRegisterRecheck/func_reBackPaymentDueRgst").then(res => {
          this.submitFlag = false;
          if(res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.inputRecheckWinClose();
              this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
              this.$refs.datagrid.selects = [];
              this.$refs.datagrid.selectIds=[]
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      },
      //退回弹窗确认
      paymentBackWinSubmit() {
        this.paymentBackForm.ids = this.$refs.datagrid.selectIds;
        this.$refs["paymentBackForm"].validate(valid=>{
          if (valid) {
            this.submitFlag = true;
            post(this.paymentBackForm, "/ce/acpt/outerBusiBill/busiPaymentDue/busiPaymentRegisterRecheck/func_reBackPaymentDueRgst").then(res => {
              this.submitFlag = false;
              if(res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.paymentBackWinClose();
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
                  this.$refs.datagrid.selects = [];
                  this.$refs.datagrid.selectIds=[]
                } else {
                  this.$msgTip.error(this, { info: msg });
                }
              }
            }).catch(error => {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
            });
          }
        })
      },
      //退回弹窗关闭
      paymentBackWinClose() {
        this.paymentBackWin = false;
        this.$nextTick(()=>{
          this.$refs.paymentBackForm.resetFields();
        })
      }
    }
  };
</script>

<style scoped>

</style>
