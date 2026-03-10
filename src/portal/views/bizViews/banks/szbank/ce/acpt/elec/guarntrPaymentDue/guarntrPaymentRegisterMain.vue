<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <!--票据（包）号码：-->
                <h-form-item prop="billNoLike" :label="$t('m.i.billInfo.billNo')">
                  <h-input v-model="formItem.billNoLike" placeholder=""></h-input>
                </h-form-item>
                <h-form-item prop="otherBankAcptMark" :label="$t('m.i.ce.otherBankAcptMark')">
                  <h-select v-model="formItem.otherBankAcptMark" placeholder="" showTitle>
                    <h-option v-for="item in YonList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item prop="remitDt" :label="$t('m.i.billInfo.remitDt')">
                  <h-date-picker type="daterange" :value="formItemRemitDt" format="yyyy-MM-dd" showFormat
                                 :editable=false placeholder="" @on-change="handleRemitDtChange"
                                 autoPlacement></h-date-picker>
                </h-form-item>
                <h-form-item prop="dueDt" :label="$t('m.i.billInfo.dueDt')">
                  <h-date-picker type="daterange" :value="formItemDueDt" format="yyyy-MM-dd" showFormat :editable=false
                                 placeholder="" @on-change="handleDueDtChange" autoPlacement></h-date-picker>
                </h-form-item>
                <h-form-item prop="prsttnAcctNo" :label="$t('m.i.billInfo.prsttnAcctNo')" class="h-form-long-label">
                  <h-input v-model="formItem.prsttnAcctNo" placeholder=""></h-input>
                </h-form-item>
                <h-form-item prop="prsttnName" :label="$t('m.i.billInfo.prsttnName')" class="h-form-long-label">
                  <h-input v-model="formItem.prsttnName" placeholder=""></h-input>
                </h-form-item>

                <h-form-item prop="acptName" :label="$t('m.i.ce.warteeName')">
                  <h-input v-model="formItem.acptName" placeholder="" icon="android-search" @on-click="queryCustName()"
                           readonly
                           clearable @on-clear="clearVal('custName')"></h-input>
                </h-form-item>
                <h-form-item prop="acptAcctNo" :label="$t('m.i.ce.warteeAcctNo')">
                  <h-input v-model="formItem.acptAcctNo" placeholder="" icon="android-search"
                           @on-click="queryCustAcctNo()" readonly
                           clearable @on-clear="clearVal('custAcctNo')"></h-input>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{ $t('m.i.common.searchAdvanced') }}<i
                    class="icon iconfont"
                    :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="handleSearch()">{{ $t('m.i.common.search') }}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{ $t('m.i.common.reset') }}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid :columns="columns"
                      highlightRow
                      :row-select="true"
                      :has-select="false"
                      url="/banks/szbank/ce/acpt/elec/guarntrPaymentDue/guarntrPaymentRegisterMain/func_pageQueryGuarntrPaymentRgstList"
                      :bindForm="formItem"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="paymentRegister">{{ $t('m.i.ce.paymentRegister') }}</h-button>
              <h-button type="primary" @click="refuseRegister">{{ $t('m.i.ce.refuseRegister') }}</h-button>
            </div>
          </h-datagrid>
        </div>

        <!-- 付款登记弹框 -->
        <h-msg-box v-model="paymentRegisterWin" width="400" @on-close="paymentRegisterWinClose"
                   class="h-form-search-layer" :maximize="true" :mask-closable="false">
          <p slot="header">
            <span>付款登记</span>
          </p>
          <div>
            <h-form :model="paymentRegisterForm" :label-width="115" ref="paymentRegisterForm" cols="1"
                    class="h-form-search">
              <h-form-item prop="prsttnAcctNo" :label="$t('m.i.billInfo.prsttnAcctNo')" required
                           :validRules="prsttnAcctNoRule">
                <h-input v-model="paymentRegisterForm.prsttnAcctNo" placeholder="" :readonly="rgsReadonly"
                         :maxlength="35"></h-input>
              </h-form-item>
              <h-form-item prop="prsttnName" :label="$t('m.i.billInfo.prsttnName')" required>
                <h-input v-model="paymentRegisterForm.prsttnName" placeholder="" :readonly="rgsReadonly"
                         :maxlength="80"></h-input>
              </h-form-item>
              <h-form-item prop="prsttnBankNo" :label="$t('m.i.billInfo.prsttnBankNo')" required
                           :validRules="prsttnBankNoRule">
                <h-input v-model="paymentRegisterForm.prsttnBankNo" placeholder="" :readonly="rgsReadonly"
                         :maxlength="12"></h-input>
              </h-form-item>
              <h-form-item prop="prsttnBankName" :label="$t('m.i.billInfo.prsttnBankName')" required>
                <h-input v-model="paymentRegisterForm.prsttnBankName" placeholder="" :readonly="rgsReadonly"
                         :maxlength="80"></h-input>
              </h-form-item>
              <h-form-item prop="paymentSignOpin" :label="$t('m.i.ce.paymentSignOpin')" required>
                <h-input v-model="paymentRegisterForm.paymentSignOpin" placeholder="" :maxlength="65"></h-input>
              </h-form-item>
              <h-form-item prop="prsttnRemark" :label="$t('m.i.billInfo.prsttnRemark')">
                <h-input v-model="paymentRegisterForm.prsttnRemark" placeholder="" readonly disabled type="textarea"
                         :rows="3" :canResize="false" :maxlength="100"></h-input>
              </h-form-item>
            </h-form>
          </div>
          <div slot="footer">
            <div slot="footer">
              <h-button type="ghost" @click="paymentRegisterWinClose">{{ $t("m.i.common.close") }}</h-button>
              <h-button type="primary" v-if="submitFlag" disabled>{{ $t("m.i.common.submiting") }}</h-button>
              <h-button type="primary" v-else @click="paymentRegisterWinSubmit()">{{ $t("m.i.ce.paymentRegister") }}
              </h-button>
            </div>
          </div>
        </h-msg-box>

        <!-- 拒付登记弹窗 -->
        <h-msg-box v-model="refuseRegisterWin" width="400" @on-close="refuseRegisterWinClose"
                   class="h-form-search-layer" :maximize="true" :mask-closable="false">
          <p slot="header">
            <span>{{ $t("m.i.ce.refuseRegister") }}</span>
          </p>
          <div>
            <h-form :model="refuseRegisterForm" :label-width="115" ref="refuseRegisterForm" cols="1"
                    class="h-form-search">
              <h-form-item prop="payRefuseCode" :label="$t('m.i.ce.payRefuseCode')" required>
                <h-select v-model="refuseRegisterForm.payRefuseCode" placeholder="" @on-change="payRefuseCodeChange">
                  <h-option v-for="item in payRefuseCodeList" :value="item.key" :key="item.key">{{
                      item.value
                    }}
                  </h-option>
                </h-select>
              </h-form-item>
              <h-form-item prop="payRefuseReason" :label="$t('m.i.ce.payRefuseReason')" class="h-form-height-auto"
                           :required="!otherRefuse">
                <h-input v-model="refuseRegisterForm.payRefuseReason" placeholder="" type="textarea" :rows="4"
                         :canResize="false" :maxlength="60" :readonly="otherRefuse" :lengthByByte="false"></h-input>
              </h-form-item>
            </h-form>
          </div>
          <div slot="footer">
            <div slot="footer">
              <h-button type="ghost" @click="refuseRegisterWinClose">{{ $t("m.i.common.close") }}</h-button>
              <h-button type="primary" v-if="submitFlag" disabled>{{ $t("m.i.common.submiting") }}</h-button>
              <h-button type="primary" v-else @click="refuseRegisterWinSubmit()">{{ $t('m.i.ce.refuseRegister') }}
              </h-button>
            </div>
          </div>
        </h-msg-box>
        <!-- 票面 -->
        <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin"
                        :billId="this.billId" :billNo="this.billNo" :billRangeEnd="this.billRangeEnd"
                        :billRangeStart="this.billRangeStart"></bill-info-main>

        <!-- 查询客户信息弹窗 -->
        <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose"
                           @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>
        <!-- 查询客户账号信息弹窗 -->
        <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" :cust-no="this.formItem.acptCustNo"
                           @showCustAcctNoWinClose="showCustAcctNoWinClose"
                           @custAcctNoSelectSubmit="custAcctNoSelectSubmit" title="查询被保证人账号信息"></show-cust-acct-no>
      </h-col>
    </h-row>
  </div>
</template>

<script>
import {
  formatNumber,
  formatBillRange,
  getDictListByGroups,
  getDictValueFromMap,
  post
} from "@/api/bizApi/commonUtil";

export default {
  name: "guarntrPaymentRegisterMain",
  components: {
    //ShowLicenseBranch: () => import(/* webpackChunkName: "sm/auth/branch/showLicenseBranch" */`@/views/bizViews/sm/auth/branch/showLicenseBranch`),
  },
  data() {
    return {
      // brchNoWin:false,
      rgsReadonly: false,
      showBillInfoWin: false,
      showCustMessageWin: false,
      showCustAcctNoWin: false,
      otherRefuse: true,
      billId: "",
      billNo: "",
      submitFlag: false,
      prsttnAcctNoRule: [{
        test: /^(?!^\-*$)([0-9a-zA-Z\-]{1,35})$/,
        trigger: "blur",
        message: "由小于或等于35位数字或字母或-组成,不能全为-"
      }],
      prsttnBankNoRule: [{test: /^[0-9]{12}$/, trigger: 'blur', message: '请输入12位数字的行号'}],
      formItem: {
        acptName: '',
        acptCustNo: '',
        acptAcctNo: '',
        prsttnName: '',
        prsttnAcctNo: '',
        otherBankAcptMark: '',
        billOrigin: "",
        billRangeStart: "",
        billRangeEnd: "",
        billNoLike: '',
        minRemitDt: "",
        maxRemitDt: "",
        minDueDt: "",
        maxDueDt: "",
        inOutFlag: "1"
      },
      formItemRemitDt: "",
      formItemDueDt: "",
      paymentRegisterForm: {
        id: '',
        billId: '',
        prsttnAcctNo: '',
        prsttnName: '',
        prsttnBankNo: '',
        prsttnBankName: '',
        paymentSignOpin: '同意付款',
        prsttnRemark: '',
      },
      refuseRegisterForm: {
        ids: '',
        payRefuseCode: '',
        payRefuseReason: '',
      },
      columns: [
        {
          type: "selection",
          hiddenCol: false,
          align: "center",
          width: 60
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
          title: this.$t('m.i.billInfo.billNo'), //票据（包）号码
          key: "billNo",
          ellipsis: false,
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let type = "";
            if (!!params.row.billId) {
              type = "billId";
            } else {
              type = "billNo";
            }
            return h("a", {
              on: {
                click: () => {
                  this.showBillInfo(params.row, type);
                }
              }
            }, params.row.billNo);
          }
        },
        {
          title: this.$t("m.i.ce.otherBankAcptMark"),
          key: 'otherBankAcptMark',
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = getDictValueFromMap(this.dictMap, "Yon", params.row.otherBankAcptMark);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t("m.i.billInfo.flowStatus"),
          key: 'flowStatusName',
          hiddenCol: false
        },
        {
          title: this.$t("m.i.ce.clearMark"),
          key: 'clearMark',
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = getDictValueFromMap(this.dictMap, "SettleType", params.row.clearMark);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
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
            let list = getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
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
            if (params.row.remitDt == null || params.row.remitDt === "") {
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
            if (params.row.dueDt == null || params.row.dueDt === "") {
              return "";
            }
            let date = this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
          title: this.$t('m.i.ce.warteeName'),
          key: 'acptName',
          sortable: true,
          hiddenCol: false,
        },
        {
          title: this.$t('m.i.ce.warteeAcctNo'),
          key: 'acptAcctNo',
          hiddenCol: false,
          sortable: true,
        },
        {
          title: this.$t("m.i.billInfo.prsttnAcctNo"),
          key: 'prsttnAcctNo',
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.billInfo.prsttnName"),
          key: 'prsttnName',
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.billInfo.prsttnBankNo"),
          key: 'prsttnBankNo',
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.billInfo.prsttnBankName"),
          key: 'prsttnBankName',
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.billInfo.prsttnRemark"),
          key: 'prsttnRemark',
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.ce.overdueReason"),
          key: 'overdueReason',
          hiddenCol: false,
        }
      ],
      YonList: [],
      payRefuseCodeList: [],
      dictMap: new Map(),
      paymentRegisterWin: false,
      refuseRegisterWin: false,
      ifShowMore: false,
      controlMode: "0",
      workDate: window.sessionStorage.getItem("workDate"),
      billRangeStart: "",
      billRangeEnd: "",
      billOriginList: [],
    }

  },
  mounted() {
    getDictListByGroups("EcdsDishonorCode,DraftTypeCode,Yon,SettlementMarkCode,FastCashStatus,BillOrigin,SettleType").then(res => {
      this.YonList = res.get("Yon");
      this.payRefuseCodeList = res.get("EcdsDishonorCode");
      this.dictMap = res.get("map");
      this.billOriginList = res.get("BillOrigin");
    });
    this.getBusinessParmeter();
  },
  methods: {
    //查询客户信息
    //触发弹窗
    queryCustName() {
      this.showCustMessageWin = true;
    },
    //赋值
    custCorpSelectSubmit(info) {
      console.log(info);
      this.formItem.acptAcctNo = "";
      this.formItem.acptName = info.custName;
      this.formItem.acptCustNo = info.custNo;
      if (info.custAcctNo !== "") {
        this.formItem.acptAcctNo = info.custAcctNo;
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
      if (this.formItem.acptCustNo === "") {
        this.$msgTip.info(this, {info: "请选择客户"});
        return;
      }
      this.showCustAcctNoWin = true;
    },
    //赋值
    custAcctNoSelectSubmit(info) {
      this.formItem.acptAcctNo = info.custAcctNo;
      this.showCustAcctNoWin = false;
    },
    //关闭弹窗
    showCustAcctNoWinClose() {
      this.showCustAcctNoWin = false;
    },
    clearVal(type) {
      if (type === 'custName') {
        this.formItem.acptCustNo = '';
        this.formItem.acptName = "";
        this.formItem.acptAcctNo = '';
      } else {
        this.formItem.acptAcctNo = '';
      }
    },
    billInfoWinClose() {
      this.showBillInfoWin = false;
    },
    showBillInfo(row, type) {
      this.billId = "";
      this.billNo = "";
      this.billRangeStart = "";
      this.billRangeEnd = "";
      if (type === "billId") {
        this.billId = row.billId;
      } else {
        this.billNo = row.billNo;
      }
      this.billRangeStart = row.billRangeStart;
      this.billRangeEnd = row.billRangeEnd;
      this.showBillInfoWin = true;
    },
    handleRemitDtChange(arr) {
      if (arr && arr.length == 2) {
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
      if (arr && arr.length == 2) {
        this.formItem.minDueDt = arr[0].replace(/-/g, "");
        this.formItem.maxDueDt = arr[1].replace(/-/g, "");
        this.formItemDueDt = [arr[0], arr[1]];
      } else {
        this.formItem.minDueDt = "";
        this.formItem.maxDueDt = "";
        this.formItemDueDt = [];
      }

    },
    //表单查询
    handleSearch() {
      this.$refs.datagrid.selects = [];
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

    //付款登记
    paymentRegister() {
      if (this.$refs.datagrid.selects.length === 0) {
        this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
        return;
      }
      if (this.$refs.datagrid.selects.length > 1) {
        this.$msgTip.info(this, {info: this.$t("m.i.common.onlyChooseOneData")});
        return;
      }
      //判断是否提前签收
      if (this.$refs.datagrid.selects[0].dueDt > this.workDate) {
        //提前签收不控制
        if (this.controlMode === "0") {
          this.registSubmitSure();
          //提前签收提醒
        } else if (this.controlMode === "2") {
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: "当前票据未到期，是否继续办理付款签收业务？",
            onOk: () => {
              this.registSubmitSure();
            }
          });
          //提前签收禁止
        } else if (this.controlMode === "1") {
          this.$msgTip.info(this, {info: "当前票据未到期，禁止提前签收！"});
          return;
        }
      } else {
        this.registSubmitSure();
      }


    },
    registSubmitSure() {
      // if (this.$refs.datagrid.selects[0].clearMark === "ST01") {
      //   this.rgsReadonly = true;
      // } else if (this.$refs.datagrid.selects[0].clearMark === "ST02") {
      //   this.rgsReadonly = false;
      // }
      post({transId: this.$refs.datagrid.selects[0].transId}, "/pc/btrc/trans/func_getTransInfoSignByTransId").then(res => {
        if (res) {
          let msg = res.data.retMsg;
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            if (res.data.retData !== null && res.data.retData !== "") {
              if (this.$refs.datagrid.selects[0].prsttnBankName !== null && this.$refs.datagrid.selects[0].prsttnBankName !== "") {
                this.paymentRegisterForm.prsttnBankName = this.$refs.datagrid.selects[0].prsttnBankName;
              } else {
                this.paymentRegisterForm.prsttnBankName = res.data.retData.transFromBankName;
              }

              if (this.$refs.datagrid.selects[0].prsttnAcctNo !== null && this.$refs.datagrid.selects[0].prsttnAcctNo !== "") {
                this.paymentRegisterForm.prsttnAcctNo = this.$refs.datagrid.selects[0].prsttnAcctNo;
              } else {
                this.paymentRegisterForm.prsttnAcctNo = res.data.retData.transFromAcctNo;
              }

              if (this.$refs.datagrid.selects[0].prsttnName !== null && this.$refs.datagrid.selects[0].prsttnName !== "") {
                this.paymentRegisterForm.prsttnName = this.$refs.datagrid.selects[0].prsttnName;
              } else {
                this.paymentRegisterForm.prsttnName = res.data.retData.transFromName;
              }

              if (this.$refs.datagrid.selects[0].prsttnBankNo !== null && this.$refs.datagrid.selects[0].prsttnBankNo !== "") {
                this.paymentRegisterForm.prsttnBankNo = this.$refs.datagrid.selects[0].prsttnBankNo;
              } else {
                this.paymentRegisterForm.prsttnBankNo = res.data.retData.transFromBankNo;
              }

              if (this.$refs.datagrid.selects[0].prsttnRemark !== null && this.$refs.datagrid.selects[0].prsttnRemark !== "") {
                this.paymentRegisterForm.prsttnRemark = this.$refs.datagrid.selects[0].prsttnRemark;
              } else {
                this.paymentRegisterForm.prsttnRemark = res.data.retData.transFromRemark;
              }

              if (this.$refs.datagrid.selects[0].paymentSignOpin !== null && this.$refs.datagrid.selects[0].paymentSignOpin !== "") {
                this.paymentRegisterForm.paymentSignOpin = this.$refs.datagrid.selects[0].paymentSignOpin;
              }

              this.paymentRegisterForm.billId = this.$refs.datagrid.selects[0].billId;
              this.paymentRegisterWin = true;
            } else {
              this.$msgTip.error(this, {info: "交易信息不存在！"});
            }
          } else {
            this.$msgTip.error(this, {info: msg});
          }
        }
      }).catch(error => {
        this.$msgTip.error(this, {info: this.$t("m.i.common.netError") + error});
      });
    },

    //付款登记弹窗确定
    paymentRegisterWinSubmit() {
      this.paymentRegisterForm.id = this.$refs.datagrid.selects[0].id;
      let params = this.paymentRegisterForm;
      this.$refs["paymentRegisterForm"].validate(valid => {
        if (valid) {
          this.submitFlag = true;
          //增加风险校验
          post(params, "/banks/szbank/ce/acpt/elec/guarntrPaymentDue/guarntrPaymentRegisterMain/func_guarntrPayRgstRiskCheck").then(res => {
            this.submitFlag = false;
            if (res) {
              let msg = res.data.retMsg;
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                if (msg === '0') {
                  this.paymentRegisteSubmit(params);
                } else {
                  let tipMsg = '';
                  if (msg === '1') {
                    tipMsg = '背书信息不连续';
                  } else if (msg === '2') {
                    tipMsg = '最后一手背书人名称与提示付款人名称不一致';
                  } else if (msg === '3') {
                    tipMsg = '背书信息不连续且最后一手背书人名称与提示付款人名称不一致';
                  }
                  this.$hMsgBox.confirm({
                    title: "确认",
                    content: tipMsg + ',确认提交吗？',
                    onOk: () => {
                      this.paymentRegisteSubmit(params);
                    }
                  });
                }
              } else {
                this.$msgTip.error(this, {info: msg});
              }
            }
          }).catch(error => {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError") + error});
          });
        }
      })
    },
    //付款登记提交
    paymentRegisteSubmit(params) {
      post(params, "/banks/szbank/ce/acpt/elec/guarntrPaymentDue/guarntrPaymentRegisterMain/func_submitGuarntrPaymentDueRgst").then(res => {
        this.submitFlag = false;
        if (res) {
          let msg = res.data.retMsg;
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.$msgTip.success(this);
            this.paymentRegisterWinClose();
            this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
            this.$refs.datagrid.selects = [];
          } else {
            this.$msgTip.error(this, {info: msg});
          }
        }
      }).catch(error => {
        this.$msgTip.error(this, {info: this.$t("m.i.common.netError") + error});
      });
    },
    //付款登记弹窗关闭
    paymentRegisterWinClose() {
      this.paymentRegisterWin = false;
      this.$refs.paymentRegisterForm.resetFields();
      this.paymentRegisterForm.prsttnAcctNo = "";
      this.paymentRegisterForm.prsttnName = "";
      this.paymentRegisterForm.prsttnBankNo = "";
      this.paymentRegisterForm.prsttnBankName = "";
      this.paymentRegisterForm.prsttnRemark = "";
    },
    //拒付登记
    refuseRegister() {
      if (this.$refs.datagrid.selects.length === 0) {
        this.$msgTip.info(this, {info: this.$t("m.i.common.chooseAtLeastOneRecord")});
        return;
      }
      this.refuseRegisterWin = true;
    },
    //拒付登记弹窗确定
    refuseRegisterWinSubmit() {
      let ids = "";
      let list = this.$refs.datagrid.selects;
      for (let i = 0; i < list.length; i++) {
        ids += list[i].id;
        if (i < list.length - 1) {
          ids += ",";
        }
      }
      this.refuseRegisterForm.ids = ids;
      this.$refs["refuseRegisterForm"].validate(valid => {
        if (valid) {
          this.submitFlag = true;
          post(this.refuseRegisterForm, "/banks/szbank/ce/acpt/elec/guarntrPaymentDue/guarntrPaymentRegisterMain/func_submitGuarntrPaymentDueRefuseRgst").then(res => {
            this.submitFlag = false;
            if (res) {
              let msg = res.data.retMsg;
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.$msgTip.success(this);
                this.refuseRegisterWinClose();
                this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
                this.$refs.datagrid.selects = [];
              } else {
                this.$msgTip.error(this, {info: msg});
              }
            }
          }).catch(error => {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError") + error});
          });
        }
      })
    },
    //拒付登记弹窗关闭
    refuseRegisterWinClose() {
      this.refuseRegisterWin = false;
      this.$refs.refuseRegisterForm.resetFields();
    },

    payRefuseCodeChange() {
      if (this.refuseRegisterForm.payRefuseCode == 'DC09') {
        this.otherRefuse = false;
      } else {
        this.refuseRegisterForm.payRefuseReason = "";
        this.otherRefuse = true;
      }
    },
    getBusinessParmeter() {
      post({paramKey: "ce.acpt.payment.is_settle_before_control_mode"}, "/sm/auth/businessParamete/getBusinessParameter").then(res => {
        if (res) {
          let msg = res.data.retMsg;
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            if (res.data.retData === "2") {
              this.controlMode = "2";
            } else if (res.data.retData === "1") {
              this.controlMode = "1";
            } else {
              this.controlMode = "0";
            }
          } else {
            this.$msgTip.error(this, {info: msg});
          }
        } else {
          this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
        }
      });
    }
  },
};
</script>

<style scoped>

</style>
