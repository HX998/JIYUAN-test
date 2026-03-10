<!--代客业务-代客申请-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item prop="custNo" :label="$t('m.i.common.custNo')" required>
                  <h-input v-model="formItem.custNo" placeholder="" icon="android-search" @on-click="queryCustNo()"
                           readonly clearable @on-clear="clearCustNo()"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.custName')" prop="custName" required>
                  <h-input v-model="formItem.custName" :maxlength=60 readonly></h-input>
                </h-form-item>
                <h-form-item prop="custAcctNo" :label="$t('m.i.bm.custAcctNo')" required>
                  <h-input v-model="formItem.custAcctNo" placeholder="" readonly icon="android-search"
                           @on-click="queryCustAcctNo()" clearable></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billNo')" prop="billNo" :validRules="billNoRule">
                  <h-input v-model="formItem.billNo" :maxlength="30"></h-input>
                </h-form-item>
                <h-form-item prop="drwrName" :label="$t('m.i.billInfo.drwrName')">
                  <h-input v-model="formItem.drwrName" placeholder="" :maxlength="125"></h-input>
                </h-form-item>
                <h-form-item prop="pyeeName" :label="$t('m.i.billInfo.pyeeName')">
                  <h-input v-model="formItem.pyeeName" placeholder="" :maxlength="125"></h-input>
                </h-form-item>
                <h-form-item prop="acptName" :label="$t('m.i.billInfo.acptName')">
                  <h-input v-model="formItem.acptName" placeholder="" :maxlength="125"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType">
                  <h-select v-model="formItem.billType" placeholder="">
                    <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billMoney')" :prop="isMinBillMoney">
                  <h-row>
                    <h-col span="11">
                      <h-typefield type="money" v-model="formItem.minBillMoney" :maxlength="20"
                                   @on-blur="formatBillMoney('blur','min')" placeholder=""
                                   @on-focus="formatBillMoney('focus','min')"
                                   bigTips></h-typefield>
                    </h-col>
                    <h-col span="2"><span>至</span></h-col>
                    <h-col span="11">
                      <h-typefield type="money" v-model="formItem.maxBillMoney" :maxlength="20"
                                   @on-blur="formatBillMoney('blur','max')" placeholder=""
                                   @on-focus="formatBillMoney('focus','max')" bigTips></h-typefield>
                    </h-col>
                  </h-row>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.remitDt')" prop="minRemitDt">
                  <h-date-picker :value="remitDt" type="daterange" showFormat :editable=false
                                 @on-change="handleRemitDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.dueDt')" prop="minDueDt">
                  <h-date-picker :value="dueDt" type="daterange" showFormat :editable=false placement="bottom-end"
                                 @on-change="handleDueDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">高级<i class="icon iconfont"
                                                                                  :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid
            :columns="columns"
            highlightRow
            url="/bm/valetBusiness/valetAcct/func_querySettleTransInfo"
            :bindForm="formItem"
            :onSelectChange="handleSelectClick"
            :rowSelect="true"
            :hasSelect="false"
            :auto-load="false"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="account">{{$t("m.i.bm.settleAccount")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!-- 查询客户信息弹窗 -->
    <show-cust-elec-sign :show-cust-elec-sign-win="showCustElecSignWin" @custElecSignWinClose="custElecSignWinClose"
                         @custElecSignSubmit="custElecSignSubmit"></show-cust-elec-sign>
    <!-- 查询客户账号信息弹窗 -->
    <show-cust-elec-sign :show-cust-elec-sign-win="showCustAcctNoWin" :custInfoParams="custInfoParams"
                         :isShowCustAcctNo="true"
                         @custElecSignWinClose="showCustAcctNoWinClose"
                         @custElecSignSubmit="custAcctNoSelectSubmit"></show-cust-elec-sign>
    <!-- 分录弹框 -->
    <acct-record :param="this.acctRecordParam" :url="this.acctRecordUrl" :submitFlag="this.acctSubmitFlag"
                 :showPrintButton="this.showPrintButton"
                 :show-acct-record-win="this.showAcctRecordWin" @acctSubmitSure="acctSubmitSure"
                 @showAcctRecordWinClose="showAcctRecordWinClose"
                 @printSuccessCallback="printSuccessCallback"></acct-record>
    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"
                    :billNo="this.billNo"></bill-info-main>
  </div>
</template>

<script>
  import { post, on, off, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "valetApply",
    components: {
    },
    data() {
      return {
        //区分最大和最小票据金额
        billMoneyType: "min",
        dueDt: [],
        remitDt: [],
        formItem: {
          transNo: "",
          custNo: "",
          custName: "",
          custAcctNo: "",
          billNo: "",
          drwrName: "",
          pyeeName: "",
          acptName: "",
          billType: "",
          minBillMoney: "",
          maxBillMoney: "",
          minDueDt: "",
          maxDueDt: "",
          minRemitDt: "",
          maxRemitDt: ""
        },
        billNoRule: [{ test: /^[0-9]{0,30}$/, trigger: "blur", message: "只能输入数字" }],
        columns: [
          {
            type: "selection",
            key: "multiSelect",
            width: 60,
            hiddenCol: false
          },
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
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params.row.billId, params.row.billNo);
                  }
                }
              }, params.row.billNo);
            }
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
            title: this.$t("m.i.billInfo.ecdsBillStatus"),
            key: "ecdsBillStatus",
            ellipsis: false,
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "EcdsBillStatusCode", params.row.ecdsBillStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.billInfo.billMoney"),
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
            title: this.$t("m.i.billInfo.drwrName"),
            key: "drwrName",
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
            title: this.$t("m.i.billInfo.drwrBankName"),
            key: "drwrBankName",
            sortable: true,
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.pyeeName"),
            key: "pyeeName",
            ellipsis: false,
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.pyeeBankNo"),
            key: "pyeeBankNo",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.pyeeBankName"),
            key: "pyeeBankName",
            sortable: true,
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.acptName"),
            key: "acptName",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.acptBankNo"),
            key: "acptBankNo",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.acptBankName"),
            key: "acptBankName",
            sortable: true,
            ellipsis: false,
            hiddenCol: false
          }
        ],
        billTypeList: [],
        clearMarkList: [],
        YonList: [],
        transNoList: [],
        dictMap: new Map(),
        //是否显示更多查询项
        ifShowMore: false,
        showCustElecSignWin: false,
        showCustAcctNoWin: false,
        addOrEditWin: false,
        addOrEditForm: {
          prsnttnDt: "",
          prsnttnAmt: "",
          overdueFlag: "",
          sttlmMk: "",
          overdueRsn: ""
        },
        isRequired: false,
        submitFlag: false,
        showBillInfoWin: false,
        billId: "",
        billNo: "",
        custInfoParams: {}
      };
    },
    computed: {
      isMinBillMoney() {
        return this.billMoneyType === "min" ? "minBillMoney" : "maxBillMoney";
      }
    },
    mounted() {
      this.getDictListByGroups("DraftTypeCode,SettlementMarkCode,Yon,EcdsBillStatusCode,ValetApplTransNo").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.clearMarkList = res.get("SettlementMarkCode");
        this.YonList = res.get("Yon");
        this.transNoList = res.get("ValetApplTransNo");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      handleDueDtChange(arr) {
        if(arr && arr.length == 2){
          this.formItem.minDueDt = arr[0].replace(/-/g, "");
          this.formItem.maxDueDt = arr[1].replace(/-/g, "");
          this.dueDt = [arr[0], arr[1]];
        }else{
          this.formItem.minDueDt = "";
          this.formItem.maxDueDt = "";
          this.dueDt = [];
        }

      },
      handleRemitDtChange(arr) {
        if(arr && arr.length == 2){
          this.formItem.minRemitDt = arr[0].replace(/-/g, "");
          this.formItem.maxRemitDt = arr[1].replace(/-/g, "");
          this.remitDt = [arr[0], arr[1]];
        }else{
          this.formItem.minRemitDt = "";
          this.formItem.maxRemitDt = "";
          this.remitDt = [];
        }

      },
      clearCustNo() {
        this.formItem.custNo = "";
        this.formItem.custName = "";
        this.formItem.custAcctNo = "";
      },
      //查询客户信息
      queryCustNo() {
        this.showCustElecSignWin = true;
      },
      //赋值
      custElecSignSubmit(info) {
        this.formItem.custNo = info.custNo;
        this.formItem.custName = info.custName;
        this.formItem.custAcctNo = info.custAcctNo;
        this.showCustElecSignWin = false;
      },
      //关闭
      custElecSignWinClose() {
        this.showCustElecSignWin = false;
      },
      //查询客户账号信息
      queryCustAcctNo() {
        if (this.formItem.custNo === "") {
          this.$msgTip.info(this, { info: "请先选择客户" });
          return;
        }
        this.custInfoParams = { custNo: this.formItem.custNo, custName: this.formItem.custName };
        this.showCustAcctNoWin = true;
      },
      //赋值
      custAcctNoSelectSubmit(info) {
        this.formItem.custAcctNo = info.custAcctNo;
        this.showCustAcctNoWin = false;
      },
      //关闭弹窗
      showCustAcctNoWinClose() {
        this.showCustAcctNoWin = false;
      },
      formatBillMoney(optType, itemType) {
        this.billMoneyType = itemType;
        if (optType === "blur") {
          if (itemType === "min") {
            if (!isNaN(parseFloat(this.formItem.minBillMoney)) && isFinite(this.formItem.minBillMoney)) {
              this.formItem.minBillMoney = this.formItem.minBillMoney == null ? "0.00" : formatNumber(this.formItem.minBillMoney, 2, ",");
            }
          } else {
            if (!isNaN(parseFloat(this.formItem.maxBillMoney)) && isFinite(this.formItem.maxBillMoney)) {
              this.formItem.maxBillMoney = this.formItem.maxBillMoney == null ? "0.00" : formatNumber(this.formItem.maxBillMoney, 2, ",");
            }
          }
        } else if (optType === "focus") {
          if (itemType === "min") {
            this.formItem.minBillMoney = this.formItem.minBillMoney.toString().replace(/,/g, "");
          } else {
            this.formItem.maxBillMoney = this.formItem.maxBillMoney.toString().replace(/,/g, "");
          }
        }
      },
      formatPrsnttnAmt(optType) {
        if (optType === "blur") {
          if (!isNaN(parseFloat(this.addOrEditForm.prsnttnAmt)) && isFinite(this.addOrEditForm.prsnttnAmt)) {
            this.addOrEditForm.prsnttnAmt = this.addOrEditForm.prsnttnAmt == null ? "0.00" : formatNumber(this.addOrEditForm.prsnttnAmt, 2, ",");
          }
        } else if (optType === "focus") {
          this.addOrEditForm.prsnttnAmt = this.addOrEditForm.prsnttnAmt.toString().replace(/,/g, "");
        }
      },
      //表单查询
      handleSearch() {
        let minBillMoney = this.formItem.minBillMoney.toString().replace(/,/g, "");
        let maxBillMoney = this.formItem.maxBillMoney.toString().replace(/,/g, "");
        if (parseFloat(minBillMoney) > parseFloat(maxBillMoney)) {
          this.$msgTip.info(this, { info: "票据金额区间输入有误" });
          return;
        }
        this.$refs["formItem"].validate(valid => {
          if (valid) {
            this.$refs.datagrid.selects = [];
            this.$refs.datagrid.selectIds = [];
            this.formItem.minBillMoney = this.formItem.minBillMoney.toString().replace(/,/g, "");
            this.formItem.maxBillMoney = this.formItem.maxBillMoney.toString().replace(/,/g, "");
            this.formItem.minDueDt = this.formItem.minDueDt.replace(/-/g, "");
            this.formItem.maxDueDt = this.formItem.maxDueDt.replace(/-/g, "");
            this.formItem.minRemitDt = this.formItem.minRemitDt.replace(/-/g, "");
            this.formItem.maxRemitDt = this.formItem.maxRemitDt.replace(/-/g, "");
            this.$refs.datagrid.dataChange(1);
          }
        });
      },
      //重置表单查询结果
      resetSearch() {
        this.dueDt = [];
        this.remitDt = [];
        this.formItem.minDueDt = "";
        this.formItem.maxDueDt = "";
        this.formItem.minRemitDt = "";
        this.formItem.maxRemitDt = "";
        this.formItem.minBillMoney = "";
        this.formItem.maxBillMoney = "";
        this.$refs.formItem.resetFields();
        this.$refs.datagrid.tData = [];
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
      },
      //记账
      account() {
        if (this.$refs.datagrid.selects.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定进行结算记账吗?",
          onOk: () => {
            this.getEntryInfo();
          }
        });
      },
      //获取分录信息
      getEntryInfo() {
        let ids = [];
        let list = this.$refs.datagrid.selects;
        for (let i = 0; i < list.length; i++) {
          ids.push(list[i].id);
        }
        this.acptIds = ids;
        this.acctRecordUrl = "/ce/acpt/innerBillPayment/innerBillPaymentAccount/func_accountFlow";
        this.acctRecordParam = { ids: this.acptIds };
        this.showAcctRecordWin = true;
      },
      //确定记账
      acctSubmitSure(info) {
        this.acctSubmitFlag = true;
        post({ ids: this.acptIds }, "/ce/acpt/innerBillPayment/innerBillPaymentAccount/func_accountInCore").then(res => {
          this.acctSubmitFlag = false;
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.showPrintButton = true;
              if (!info.isHasPrint) {
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
      //打印成功回调
      printSuccessCallback() {
        this.showAcctRecordWinClose();
      },
      //关闭分录弹窗
      showAcctRecordWinClose() {
        this.showAcctRecordWin = false;
        this.showPrintButton = false;
        this.acctRecordParam = {};
        this.acctRecordUrl = "";
        this.$refs.datagrid.dataChange(1);
        this.$refs.datagrid.selects = [];
      },
      valetOperate(optType) {
        let content = "", url = "/bm/valetBusiness/valetAcct/func_settleAcctFlow", params = {};
        let list = this.$refs.datagrid.selects;
        if (list != null && list.length !== 0) {
          if (optType === "acct") {
            //代客出票登记
            content = "确定进行结算记账吗？";
            params = { code: JSON.stringify(this.initParams("200101")) };
          }
          this.handleValet(content, params, url);
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      initParams(transNo) {
        let list = this.$refs.datagrid.selects;
        let requestDto = {};
        requestDto.custNo = this.formItem.custNo;
        requestDto.applAcctNo = this.formItem.custAcctNo;
        let reqInfoList = [];
        for (let i = 0, len = list.length; i < len; i++) {
          let reqInfo = {};
          reqInfo.transNo = transNo;
          reqInfo.hldrId = list[i].hldrId;
          reqInfo.billId = list[i].billId;
          if (transNo === "202001" || transNo === "202101") {
            let prsnttn = {};
            prsnttn.prsnttnDt = this.addOrEditForm.prsnttnDt.replace(/-/g, "");
            prsnttn.prsnttnAmt = this.addOrEditForm.prsnttnAmt.toString().replace(/,/g, "");
            prsnttn.sttlmMk = this.addOrEditForm.sttlmMk;
            prsnttn.overdueRsn = this.addOrEditForm.overdueRsn;
            reqInfo.prsnttn = prsnttn;
          }
          reqInfoList.push(reqInfo);
        }
        requestDto.reqInfoList = reqInfoList;
        return requestDto;
      },
      handleValet(content, params, url) {
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: content,
          onOk: () => {
            post(params, url).then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.info(this, { info: res.data.retMsg });
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                  this.$refs.datagrid.selects = [];
                  this.$refs.datagrid.selectIds = [];
                } else {
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                  this.$msgTip.error(this, { info: res.data.retMsg });
                  this.$refs.datagrid.selects = [];
                  this.$refs.datagrid.selectIds = [];
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      overdueFlagChange() {
        this.isRequired = this.addOrEditForm.overdueFlag === "1";
      },
      handleWinClose() {
        this.addOrEditWin = false;
        this.$refs.addOrEditForm.resetFields();
      },
      submitForm() {
        this.$refs["addOrEditForm"].validate(valid => {
          if (valid) {
            this.submitFlag = true;
            let transNo = "";
            if (this.addOrEditForm.overdueFlag === "0") {
              transNo = "202001";
            } else {
              transNo = "202101";
            }
            let params = this.initParams(transNo);
            let url = "/bm/valetBusiness/valetApply/func_valetApplyBill";
            post({ code: JSON.stringify(params) }, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.info(this, { info: res.data.retMsg });
                  this.addOrEditWin = false;
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                  this.$refs.datagrid.selects = [];
                  this.$refs.datagrid.selectIds = [];
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      billInfoWinClose() {
        this.billId = "";
        this.billNo = "";
        this.showBillInfoWin = false;
      },
      showBillInfo(billId, billNo) {
        this.billId = billId;
        this.billNo = billNo;
        this.showBillInfoWin = true;
      }
    }
  };
</script>

<style scoped>

</style>
