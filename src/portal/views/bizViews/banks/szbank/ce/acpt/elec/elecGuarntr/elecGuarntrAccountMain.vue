<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <!-- 主页面 -->
        <div v-if="mainVue" key="1">
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <!--<own-brch-nos :formItem = "formItem" @brchNoWinOpen="brchNoWin = true" v-if="this.licenseFlag"></own-brch-nos>-->
                <show-branch v-model="formItem.ownedBrchNos" :label="$t('m.i.common.ownedBrchNo')" prop="ownedBrchNos"
                             title="机构名称"
                             :brchNo.sync="formItem.ownedBrchNos" :brchName.sync="formItem.ownedBrchNames"
                             v-if="this.licenseFlag" :params="{authPath: this.authPath}"
                             url="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree"
                             queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
                </show-branch>
                <h-form-item prop="acptProtocalNo" :label="$t('m.i.ce.contractNo')">
                  <h-input v-model="formItem.acptProtocalNo" placeholder=""></h-input>
                </h-form-item>
                <h-form-item prop="drwrName" :label="$t('m.i.ce.warteeName')">
                  <h-input v-model="formItem.drwrName" placeholder="" icon="android-search" @on-click="queryCustName()"
                           readonly
                           clearable @on-clear="clearVal('custName')"></h-input>
                </h-form-item>
                <h-form-item prop="drwrAcctNo" :label="$t('m.i.ce.warteeAcctNo')">
                  <h-input v-model="formItem.drwrAcctNo" placeholder="" icon="android-search"
                           @on-click="queryCustAcctNo()" readonly
                           clearable @on-clear="clearVal('custAcctNo')"></h-input>
                </h-form-item>
                <h-form-item prop="guarntrDt" :label="$t('m.i.ce.guarntrApplyDt')">
                  <h-date-picker type="date" v-model="formItem.guarntrDt" placeholder="" @on-change="handleDateChange"
                                 :editable=false></h-date-picker>
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
                      url="/banks/szbank/ce/acpt/account/elecGuarntrAccountMain/func_queryPageAcptGuarntrBatchAndBill"
                      :bindForm="formItem"
                      :on-current-change="handleRowClick"
                      :on-current-change-cancel="handleRowClickCancel"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="backToCredit()">{{ $t('m.i.ce.returnCredit') }}</h-button>
              <h-button type="primary" @click="account()">{{ $t('m.i.ce.account') }}</h-button>
            </div>
          </h-datagrid>
        </div>
        <e-guarntr-acpt-batch-info-detail :is-show="billManagerVue" :params="batchInfoParams"
                                          :batchUrl="'/banks/szbank/ce/acpt/account/elecGuarntrAccountMain/func_getAcptGuarntrBatchByQueryDto'"
                                          ref="acptBatchInfoDetail"></e-guarntr-acpt-batch-info-detail>
        <!-- 数据展示表格 -->
        <div v-if="billManagerVue" key="3">
          <h-datagrid :columns="billManagerColumns"
                      url="/banks/szbank/ce/acpt/account/elecGuarntrAccountMain/func_queryPageAcptGuarntrBill"
                      :auto-load="false"
                      highlightRow
                      :row-select="true"
                      :has-select="false"
                      :bindForm="billManagerFormItem"
                      ref="billManagerDatagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="billManagerAccount('batch')">{{ $t('m.i.ce.batchAccount') }}</h-button>
              <acct-back-btn @reBackList="reBackList" :btnAuth="childrenBtnAuth"></acct-back-btn>
              <h-button type="primary" @click="feeAdjustHandle('select')"
                        v-if="this.btnAuth.feeAdjustDetailButton === undefined ? false : this.btnAuth.feeAdjustDetailButton.isShow">
                {{ $t('m.i.ce.feeAdjust') }}
              </h-button>
              <h-button type="ghost" @click="returnMain">{{ $t('m.i.common.goBack') }}</h-button>
            </div>
          </h-datagrid>
        </div>
        <!-- 查询客户信息弹窗 -->
        <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose"
                           @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>
        <!-- 查询客户账号信息弹窗 -->
        <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" :cust-no="this.formItem.drwrCustNo"
                           @showCustAcctNoWinClose="showCustAcctNoWinClose"
                           @custAcctNoSelectSubmit="custAcctNoSelectSubmit" title="查询被保证人账号信息"></show-cust-acct-no>
        <!-- 分录弹框 -->
        <acct-record :param="this.acctRecordParam" :url="this.acctRecordUrl"
                     :show-acct-record-win="this.showAcctRecordWin"
                     :submitFlag="this.acctSubmitFlag" :showPrintButton="this.showPrintButton"
                     @printSuccessCallback="printSuccessCallback"
                     @acctSubmitSure="acctSubmitSure" @showAcctRecordWinClose="showAcctRecordWinClose"
                     ref="showAcctRecord" :licenseFlag="this.licenseFlag"
                     :ownedBrchNo="this.billManagerFormItem.ownedBrchNo"></acct-record>
        <!-- 票面 -->
        <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"
                        :billRangeStart="this.billRangeStart" :billRangeEnd="this.billRangeEnd"></bill-info-main>
        <!--保证金账号查询-->
        <show-deduct-acct @dueDeductAcctWinClose="dueDeductAcctWinClose" :dueDeductAcctWin="dueDeductAcctWin"
                          :params="showParams"></show-deduct-acct>
        <!--手续费调整弹窗-->
        <acpt-fee-adjust-win :feeAdjustWin='feeAdjustWin' @feeAdjustWinClose="feeAdjustWinClose"
                             @feeAdjustWinSubmit='feeAdjustWinSubmit' :feeForm='feeForm'
                             :isBatch='isBatch'></acpt-fee-adjust-win>
      </h-col>
    </h-row>
    <!-- <show-license-branch :showBranrchWin="brchNoWin" title="机构查询" @brchNoChange="brchNoChange" :authPath="authPath"
                          @showBranchWinClose="brchNoWin = false" :ifcheck="true" :checkStrictly="true"></show-license-branch>-->
  </div>
</template>

<script>
import {
  accMul,
  formatBillRange,
  formatNumber,
  formatTime,
  getDictListByGroups,
  getDictValueFromMap,
  post
} from "@/api/bizApi/commonUtil";
import {deepClone} from "@/utils/index";

export default {
  name: "elecGuarntrAccountMain",
  components: {
    ShowDeductAcct: () => import(/* webpackChunkName: "ce/acpt/common/showDeductAcct" */`@/views/bizViews/ce/acpt/common/showDeductAcct`),
    EGuarntrAcptBatchInfoDetail: () => import(/* webpackChunkName: "banks/szbank/ce/acpt/elec/elecGuarntr/eGuarntrAcptBatchInfoDetail" */`@/views/bizViews/banks/szbank/ce/acpt/elec/elecGuarntr/eGuarntrAcptBatchInfoDetail`)
    // AcptBatchInfoDetail:()=>import(/* webpackChunkName: "ce/acpt/common/eAcptBatchInfoDetail" */`@/views/bizViews/ce/acpt/common/eAcptBatchInfoDetail`)
    // ShowLicenseBranch: () => import(/* webpackChunkName: "sm/auth/branch/showLicenseBranch" */`@/views/bizViews/sm/auth/branch/showLicenseBranch`),
  },
  data() {
    let columns = [
      {
        title: ' ',
        type: 'radio',
        align: 'center',
        width: 50
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
        title: this.$t('m.i.ce.contractNo'),
        key: 'acptProtocalNo',
        hiddenCol: false,
        sortable: false,
        render: (h, params) => {
          return h('div', [
            h('a', {
              props: {
                type: 'primary',
                size: 'small'
              },
              style: {
                marginRight: '5px'
              },
              on: {
                click: () => {
                  this.acptProtocalNoMain(params.row.id, params.row.ownedBrchNo, params.row.lockUserNo)
                }
              }
            }, params.row.acptProtocalNo)
          ]);
        }
      },
      {
        title: this.$t('m.i.ce.warteeCustNo'),
        key: 'drwrCustNo',
        hiddenCol: false,
        sortable: false,
      },
      {
        title: this.$t('m.i.ce.warteeName'),
        key: 'drwrName',
        sortable: false,
        hiddenCol: false,
      },
      {
        title: this.$t('m.i.ce.warteeAcctNo'),
        key: 'drwrAcctNo',
        hiddenCol: false,
        sortable: false,
      },
      {
        title: this.$t('m.i.ce.guarntrApplyDt'),
        key: 'guarntrDt',
        hiddenCol: false,
        sortable: false,
        render: (h, params) => {
          if (params.row.guarntrDt == null || params.row.guarntrDt === "") {
            return "";
          }
          let date = this.$moment(params.row.guarntrDt, "YYYY-MM-DD").format("YYYY-MM-DD");
          return h("span", date);
        }
      },
      {
        title: this.$t('m.i.ce.guarntrNo'),
        key: 'guarntrNo',
        hiddenCol: false,
        sortable: false,
      },
      {
        title: this.$t('m.i.ce.totalCount'),
        key: 'totalCount',
        hiddenCol: false,
      },
      {
        title: this.$t('m.i.ce.totalAmt'),
        key: 'totalAmt',
        hiddenCol: false,
        sortable: false,
        render: (h, params) => {
          let totalAmt = formatNumber(params.row.totalAmt, 2, ',');
          return h("span", {
            domProps: {
              title: totalAmt
            }
          }, totalAmt);
        }
      },
    ];
    let billManagerColumns = [
      {
        type: 'index',
        key: 'numOrder',
        title: this.$t("m.i.common.index"),
        width: 60,
        align: 'center',
        hiddenCol: false,
      },
      {
        title: this.$t("m.i.billInfo.billOrigin"),
        align: 'center',
        hiddenCol: false,
        render: (h, params) => {
          let dictValue = getDictValueFromMap(this.dictMap, "BillOrigin", params.row.billOrigin);
          return h("span", {
            domProps: {
              title: dictValue
            }
          }, dictValue);
        }
      },
      {
        title: this.$t('m.i.billInfo.billPackageNo'),
        key: 'billNo',
        hiddenCol: false,
        sortable: false,
        render: (h, params) => {
          let billNo = "";
          if (params.row.billNo === null || params.row.billNo === "") {
            billNo = this.$t('m.i.ce.showBillInfo');
          } else {
            billNo = params.row.billNo;
          }
          return h("a", {
            on: {
              click: () => {
                this.showBillInfo(params.row);
              }
            }
          }, billNo);
        }
      },
      {
        title: this.$t('m.i.billInfo.flowStatus'),
        key: 'flowStatusName',
        hiddenCol: false,
      },
      {
        title: this.$t('m.i.billInfo.billType'),
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
        title: this.$t('m.i.billInfo.remitDt'),
        key: 'remitDt',
        hiddenCol: false,
        sortable: false,
        render: (h, params) => {
          if (params.row.remitDt == null || params.row.remitDt === "") {
            return "";
          }
          let date = this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD");
          return h("span", date);
        }
      },
      {
        title: this.$t('m.i.billInfo.dueDt'),
        key: 'dueDt',
        hiddenCol: false,
        sortable: false,
        render: (h, params) => {
          if (params.row.dueDt == null || params.row.dueDt === "") {
            return "";
          }
          let date = this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
          return h("span", date);
        }
      },
      {
        title: this.$t('m.i.billInfo.billPackageMoney'),
        key: 'billMoney',
        sortable: false,
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
        title: this.$t('m.i.billInfo.acptName'),
        key: 'acptName',
        hiddenCol: false,
        sortable: false,
      },
      {
        title: this.$t('m.i.billInfo.acptAcctNo'),
        key: 'acptAcctNo',
        hiddenCol: false,
        sortable: false,
      },
      {
        title: this.$t('m.i.billInfo.acptBankNo'),
        key: 'acptBankNo',
        hiddenCol: false,
        sortable: false,
      },
      {
        title: this.$t('m.i.billInfo.drwrName'),
        key: 'drwrName',
        hiddenCol: false,
        sortable: false,
      },
      {
        title: this.$t("m.i.ce.guarntrAmt"),
        key: 'guarntrAmt',
        hiddenCol: false,
        sortable: false,
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
        title: this.$t('m.i.ce.feeMoney'),
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
    ];
    return {
      // brchNoWin:false,
      licenseFlag: false,
      authPath: this.$route.path,
      showPrintButton: false,
      showBillInfoWin: false,
      btnAuth: "",
      childrenBtnAuth: {},
      billId: "",
      billRangeStart: "",
      billRangeEnd: "",
      acctSubmitFlag: false,
      feeAdjustWin: false,
      formItem: {
        drwrCustNo: '',
        drwrName: '',
        drwrAcctNo: '',
        acptProtocalNoLike: '',
        remitDt: '',
        acptType: '',
        billClass: 'ME02',
        curFuncNo: 'BICE011302',
        authPath: this.$route.path,
        ownedBrchNos: "",
        ownedBrchNames: "",
        acptProtocalNo: "",
        acptName: "",
        acptAcctNo: "",
        guarntrDt: ""
      },
      billManagerFormItem: {
        promNoteNoLike: '',
        batchId: '',
        billClass: 'ME02',
        curFuncNo: 'BICE011302'
      },
      feeForm: {
        batchId: "",
        billId: "",
        billMoney: '',
        feeRate: "",
        feeAmt: "",
        minFeeLimit: '1',
        minFeeAmt: "",
        billClass: 'ME02',
        curFuncNo: 'BICE011302'
      },
      isBatch: true,
      columns: columns,
      billManagerColumns: billManagerColumns,
      temp: deepClone(columns),
      billTemp: deepClone(billManagerColumns),
      batchInfoParams: {
        id: '',
        billClass: 'ME02',
        curFuncNo: 'BICE011302',
        promNoteNoLike: ""
      },
      acptTypeList: [],
      billOriginList: [],
      eAcptTypeList: [],
      dictMap: new Map(),
      batchId: "",
      showAcctRecordWin: false,
      acctRecordParam: {},
      acctRecordUrl: "",
      acctIds: "",
      acctType: "",
      currentSelectRow: [],
      billManagerCurrentSelectList: [],
      mainVue: true,
      billManagerVue: false,
      showCustAcctNoWin: false,
      showCustMessageWin: false,
      //是否显示更多查询项
      ifShowMore: false,
      //查询保证金账户信息
      dueDeductAcctWin: false,
      isShowPromNoteNo: "",
      syncOperMode: "",
      queryUrl: "/pc/busiLock/func_getBusiLockParam",
      showParams: {
        listId: "",
      }
    }
  },
  mounted() {
    this.getSyncOperMode();
    this.buttonAuthShow();
    getDictListByGroups("AcptType,BillOrigin,EAcptType,DraftTypeCode").then(res => {
      this.acptTypeList = res.get("AcptType");
      this.eAcptTypeList = res.get("EAcptType");
      this.billOriginList = res.get("BillOrigin");
      this.dictMap = res.get("map");
    });
  },
  methods: {
    buttonAuthShow() {
      //按钮权限查询 控制按钮显隐
      let id = JSON.parse(window.sessionStorage.getItem("curMenu")).id;
      post({authId: id}, "/sm/auth/buttonAuth/func_queryButtonByAuthId").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          let retMsg = res.data.retMsg;
          if (retCode === "000000") {
            this.btnAuth = JSON.parse(res.data.retData);
            if (this.btnAuth.isShowPromNoteNo === undefined ? true : this.btnAuth.isShowPromNoteNo.isShow) {
              this.billTemp.forEach((value, index) => {
                if (value.key === "promNoteNo") {
                  value.hiddenCol = false;
                }
              });
              this.isShowPromNoteNo = '1';
            } else {
              this.billTemp.forEach((value, index) => {
                if (value.key === "promNoteNo") {
                  value.hiddenCol = true;
                }
              });
              this.isShowPromNoteNo = '0';
            }
            if (this.btnAuth.manager != null && this.btnAuth.manager != undefined) {
              if (this.btnAuth.manager.children != null && this.btnAuth.manager.children != undefined) {
                this.childrenBtnAuth = this.btnAuth.manager.children;
              }
            }
          } else {
            this.$msgTip.error(this, {info: retMsg});
          }
        } else {
          this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
        }
      });
    },
    getSyncOperMode() {
      let url = this.queryUrl;
      post({}, url).then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.syncOperMode = res.data.retMsg;
              if (this.syncOperMode === '1') {
                this.$refs.datagrid.controlColumnsHidden("lockUserNo", false);
                this.$refs.datagrid.controlColumnsHidden("lockBrchName", false);
                this.$refs.datagrid.controlColumnsHidden("lockTm", false);
              } else {
                this.$refs.datagrid.controlColumnsHidden("lockUserNo", true);
                this.$refs.datagrid.controlColumnsHidden("lockBrchName", true);
                this.$refs.datagrid.controlColumnsHidden("lockTm", true);
              }
            } else {
              this.$msgTip.error(this, {info: msg});
            }
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
          }
        }
      );
    },
    showDueDeductAcct(id) {
      this.showParams.listId = id;
      this.dueDeductAcctWin = true;
    },

    dueDeductAcctWinClose() {
      this.dueDeductAcctWin = false;
    },
    clearVal(type) {
      if (type === 'custName') {
        this.formItem.drwrCustNo = '';
        this.formItem.drwrName = "";
        this.formItem.drwrAcctNo = "";
      } else {
        this.formItem.drwrAcctNo = '';
      }
    },
    billInfoWinClose() {
      this.showBillInfoWin = false;
    },
    showBillInfo(row) {
      this.billId = row.billId;
      this.billRangeStart = row.billRangeStart;
      this.billRangeEnd = row.billRangeEnd;
      this.showBillInfoWin = true;
    },
    handleDateChange(value) {
      this.formItem.guarntrDt = value.replace(/-/g, "");
    },
    //表单查询
    handleSearch() {
      this.currentSelectRow = [];
      this.$nextTick(() => {
        this.$refs.datagrid.dataChange(1);
      })
    },
    //重置表单查询结果
    resetSearch() {
      this.$nextTick(() => {
        this.formItem.drwrCustNo = '';
        this.formItem.drwrName = '';
        this.formItem.drwrAcctNo = '';
        this.formItem.acptProtocalNo = '';
        this.formItem.guarntrDt = '';
        this.formItem.acptType = '';
        this.formItem.ownedBrchNames = "";
        this.formItem.ownedBrchNos = "";
      });
    },
    //行选中
    handleRowClick(arr) {
      this.currentSelectRow = arr;
    },
    handleRowClickCancel() {
      this.currentSelectRow = [];
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
      if (info.custAcctNo !== "") {
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
        this.$msgTip.info(this, {info: "请选择客户"});
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
    //记账
    account() {
      if (this.currentSelectRow.length === 0) {
        this.$msgTip.info(this, {info: this.$t("m.i.common.chooseDataFirst")});
        return;
      }
      this.batchId = this.currentSelectRow.id;
      this.billManagerFormItem.licenseFlag = this.licenseFlag
      this.billManagerFormItem.ownedBrchNo = this.currentSelectRow.ownedBrchNo
      this.billManagerFormItem.batchId = this.batchId;
      this.batchInfoParams.id = this.batchId;
      this.resetSearch();
      if (this.syncOperMode === '1') {
        let userNo = JSON.parse(window.sessionStorage.getItem("userInfo")).userNo;
        let lockUserNo = this.currentSelectRow.lockUserNo;
        if (lockUserNo !== "" && lockUserNo !== null && lockUserNo !== undefined) {
          if (lockUserNo !== userNo) {
            this.$msgTip.info(this, {info: this.$t("m.i.ce.busiLockErrorMsg") + '[' + lockUserNo + ']' + this.$t("m.i.ce.busiLockErrorMsg1")});
            return;
          }
        }
        this.addOrDelBatchBusiLock(this.batchId, "add");
      } else {
        this.mainVue = false;
        this.billManagerVue = true;
        this.$nextTick(() => {
          this.billManagerColumns = deepClone(this.billTemp);
          this.$refs.billManagerDatagrid.createShowCol(this.billTemp);
          this.$refs.billManagerDatagrid.dataChange(1);
        });
      }
      this.$refs.datagrid.tData = [];
    },
    backToCredit() {
      if (this.currentSelectRow.length === 0) {
        this.$msgTip.info(this, {info: this.$t("m.i.common.chooseDataFirst")});
        return;
      }
      this.$hMsgBox.confirm({
        title: "退回信贷",
        content: "确认退回信贷吗?",
        onOk: () => {
          this.doBackCredict();
        }
      });
    },
    doBackCredict() {
      post({
        batchId: this.currentSelectRow.id,
      }, "/banks/szbank/ce/acpt/account/elecGuarntrAccountMain/func_backCredit").then(res => {
        if (res) {
          let msg = res.data.retMsg;
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.$msgTip.success(this, {info: "退回信贷成功！"})
            this.handleSearch()
          } else {
            this.$msgTip.error(this, {info: msg});
            this.$refs.billManagerDatagrid.dataChange(this.$refs.billManagerDatagrid.pageInfo.pageNo);
          }
        }
      })
    },
    //承兑协议编号超链接
    acptProtocalNoMain(str, ownedBrchNo, lockUserNo) {
      this.batchId = str;
      this.billManagerFormItem.batchId = this.batchId;
      //集中授权参数赋值
      this.billManagerFormItem.licenseFlag = this.licenseFlag
      this.billManagerFormItem.ownedBrchNo = ownedBrchNo
      this.batchInfoParams.id = this.batchId;
      this.resetSearch();
      if (this.syncOperMode === '1') {
        let userNo = JSON.parse(window.sessionStorage.getItem("userInfo")).userNo;
        if (lockUserNo !== "" && lockUserNo !== null && lockUserNo !== undefined) {
          if (lockUserNo !== userNo) {
            this.$msgTip.info(this, {info: this.$t("m.i.ce.busiLockErrorMsg") + '[' + lockUserNo + ']' + this.$t("m.i.ce.busiLockErrorMsg1")});
            return;
          }
        }
        this.addOrDelBatchBusiLock(this.batchId, "add");
      } else {
        this.mainVue = false;
        this.billManagerVue = true;
        this.$nextTick(() => {
          this.billManagerColumns = deepClone(this.billTemp);
          this.$refs.billManagerDatagrid.createShowCol(this.billTemp);
          this.$refs.billManagerDatagrid.dataChange(1);
        });
      }
      this.$refs.datagrid.tData = [];
    }
    ,


    //票据管理子页面方法
    //表单查询
    billManagerHandleSearch() {
      this.$refs.billManagerDatagrid.selects = [];
      this.batchInfoParams.promNoteNoLike = this.billManagerFormItem.promNoteNoLike;
      this.$nextTick(() => {
        this.$refs.billManagerDatagrid.dataChange(1);
        this.$refs.acptBatchInfoDetail.getBatchInfo();
      })
    }
    ,
    //重置表单查询结果
    billManagerResetSearch() {
      this.$nextTick(() => {
        this.billManagerFormItem.promNoteNoLike = '';
      })
    }
    ,
    //记账
    billManagerAccount(str) {
      this.acctType = str;
      if (str === "batch") {
        this.batchAccount();
      }
      if (str === "select") {
        this.selectAccount();
      }
    }
    ,
    //批次记账
    batchAccount() {
      this.$hMsgBox.confirm({
        title: this.$t("m.i.common.confirm"),
        content: "确定批次记账吗?",
        onOk: () => {
          this.getEntryInfo("batch");
        }
      });
    }
    ,
    //选择记账
    selectAccount() {
      if (this.$refs.billManagerDatagrid.selects.length === 0) {
        this.$msgTip.info(this, {info: this.$t("m.i.common.chooseDataFirst")});
        return;
      }
      this.acctIds = "";
      let list = this.$refs.billManagerDatagrid.selects;
      for (var i = 0, count = list.length; i < count; i++) {
        this.acctIds += list[i].id;
        if (i < list.length - 1) {
          this.acctIds += ",";
        }
      }
      this.$hMsgBox.confirm({
        title: this.$t("m.i.common.confirm"),
        content: "确定选择记账吗?",
        onOk: () => {
          this.getEntryInfo("select");
        }
      });
    }
    ,

    //记账退回
    reBackList(str) {
      if (str === "batch") {
        this.batchAccountBack();
      }
      if (str === "select") {
        this.selectAccountBack();
      }
    }
    ,
    //选择退回
    selectAccountBack() {
      if (this.$refs.billManagerDatagrid.selects.length === 0) {
        this.$msgTip.info(this, {info: this.$t("m.i.common.chooseAtLeastOneRecord")});
        return;
      }
      let ids = this.$refs.billManagerDatagrid.selectIds.join(",");
      this.$hMsgBox.confirm({
        title: this.$t("m.i.common.confirm"),
        content: "确定选择退回吗?",
        onOk: () => {
          let funcNo = "BICE011302"; //承兑记账功能号
          let operType = "0"; //明细提交
          post({
            ids: ids,
            curFuncNo: funcNo,
            billOperType: operType,
          }, "/ce/acpt/elec/account/eCancelAcptAccountMain/func_accountBack").then(res => {
            if (res) {
              let msg = res.data.retMsg;
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.$msgTip.success(this);
                if (this.$refs.billManagerDatagrid.total === this.$refs.billManagerDatagrid.selects.length) {
                  this.returnMain();
                } else {
                  this.billManagerCurrentSelectList = [];
                  this.$refs.billManagerDatagrid.selects = [];
                  this.$refs.billManagerDatagrid.selectIds = [];
                  this.$refs.billManagerDatagrid.dataChange(this.$refs.billManagerDatagrid.pageInfo.pageNo);
                }
              } else {
                this.$msgTip.error(this, {info: msg});
                this.$refs.billManagerDatagrid.dataChange(this.$refs.billManagerDatagrid.pageInfo.pageNo);
              }
            }
          }).catch(error => {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError") + error});
          });
        }
      });
    }
    ,
    //批次退回
    batchAccountBack() {
      this.$hMsgBox.confirm({
        title: this.$t("m.i.common.confirm"),
        content: "确定批次退回吗？",
        onOk: () => {
          this.handleReCheckBatchBack();
        }
      });
    }
    ,
    handleReCheckBatchBack() {
      let operType = "1";
      let funcNo = "BICE011302";
      post({
        batchId: this.batchId,
        billOperType: operType,
        curFuncNo: funcNo
      }, "/ce/acpt/elec/account/eCancelAcptAccountMain/func_accountBack").then(res => {
        if (res) {
          let msg = res.data.retMsg;
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.$msgTip.success(this, {info: msg});
            this.billManagerCurrentSelectList = [];
            this.$refs.billManagerDatagrid.selects = [];
            this.$refs.billManagerDatagrid.selectIds = [];
            this.returnMain();
          } else {
            this.$msgTip.error(this, {info: res.data.retMsg});
            this.$refs.billManagerDatagrid.dataChange(this.$refs.billManagerDatagrid.pageInfo.pageNo);
          }
        } else {
          this.$msgTip.error(this, {info: this.$t('m.i.common.netError')});
        }
      });
    }
    ,

    //获取分录信息
    getEntryInfo(str) {
      this.acctRecordUrl = "/banks/szbank/ce/acpt/account/elecGuarntrAccountMain/func_generateAcctRecord";
      if (str === "batch") {
        this.acctRecordParam = {batchId: this.batchId, billOperType: "1", acctAuthFlag: "0", acctAuthBusiType: "01"}
      } else if (str === "select") {
        this.acctRecordParam = {
          batchId: this.batchId,
          billOperType: "0",
          ids: this.acctIds,
          acctAuthFlag: "0",
          acctAuthBusiType: "01"
        }
      }
      this.showAcctRecordWin = true;
    }
    ,
    //确定记账
    acctSubmitSure(info) {
      let param = {};
      if (this.acctType === "batch") {
        param = {
          batchId: this.batchId,
          billOperType: "1",
          isBack: "0",
          licenseFlag: this.licenseFlag,
          ownedBrchNo: this.billManagerFormItem.ownedBrchNo
        };
      } else if (this.acctType === "select") {
        param = {
          batchId: this.batchId,
          billOperType: "0",
          ids: this.acctIds,
          isBack: "0",
          licenseFlag: this.licenseFlag,
          ownedBrchNo: this.billManagerFormItem.ownedBrchNo
        };
      }
      this.acctSubmitFlag = true;
      post(param, "/banks/szbank/ce/acpt/account/elecGuarntrAccountMain/func_submitAcptGuarntrAccount").then(res => {
        if (res) {
          this.acctSubmitFlag = false;
          let msg = res.data.retMsg
          let retCode = res.data.retCode
          if (retCode == "000000") {
            this.$msgTip.success(this);
            //组装打印票据明细
            this.contractPrinting(info.recordInfo, info.printDataList);
            this.showPrintButton = true;
            if (!info.isHasPrint) {
              this.showAcctRecordWinClose();
            }
          } else {
            this.$msgTip.error(this, {info: msg});
          }
        }
      }).catch(error => {
        this.$msgTip.error(this, {info: this.$t("m.i.common.netError") + error});
      });
    }
    ,
    //打印成功回调
    printSuccessCallback() {
      this.showAcctRecordWinClose();
    }
    ,
    //关闭分录弹窗
    showAcctRecordWinClose() {
      this.showAcctRecordWin = false;
      this.showPrintButton = false;
      this.acctRecordParam = {};
      this.acctRecordUrl = "";
      this.$refs.billManagerDatagrid.selects = [];
      this.$refs.acptBatchInfoDetail.getBatchInfo();
      this.$refs.billManagerDatagrid.dataChange(1, (data) => {
        if (data.length === 0) {
          this.returnMain();
        }
      })
    }
    ,
    //返回主页面
    returnMain() {
      this.mainVue = true;
      this.billManagerVue = false;
      if (this.syncOperMode === '1') {
        this.addOrDelBatchBusiLock(this.batchId, "delete");
      }
      this.currentSelectRow = [];
      this.$refs.billManagerDatagrid.selects = [];
      this.getSyncOperMode();
      this.billManagerResetSearch();
      this.$nextTick(() => {
        this.columns = deepClone(this.temp);
        this.$refs.datagrid.createShowCol(this.temp);
      });
    }
    ,
    //组装打印票据明细
    contractPrinting(recordInfo, printDataList) {
      let flowNo = "";
      for (let item in Object.keys(recordInfo)) {
        if (recordInfo[Object.keys(recordInfo)[item]].length !== 0) {
          if (recordInfo[Object.keys(recordInfo)[item]][0].voucherType === 'PE030401') {
            flowNo = Object.keys(recordInfo)[item];
          }
        }
      }
      let listIds = '';
      if (flowNo !== "" && printDataList && printDataList.length > 0) {
        listIds = printDataList[0].listId;
      }
      flowNo = listIds + "$$" + flowNo;

      if (flowNo !== "") {
        post({code: flowNo}, "/banks/szbank/ce/acpt/account/elecGuarntrAccountMain/func_queryBillInfoListByFlowNo").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.getBillListTemplate(res.data.retData);
            } else {
              this.$msgTip.error(this, {info: msg});
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, {info: this.$t("m.i.common.netError") + error});
        });
      }
    }
    ,
    getBillListTemplate(billInfoList) {
      post({voucherType: 'PE030401'}, "/pe/print/printConf/printConfManger/queryPrintConfByVoucherType").then(res => {
        if (res) {
          let msg = res.data.retMsg;
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            let billListJson = {};
            if (res.data.retData !== null) {
              if (res.data.retData.confContent !== undefined && res.data.retData.confContent !== null && res.data.retData.confContent !== "") {
                billListJson = JSON.parse(res.data.retData.confContent);
              }
            }
            let billInfoListNext = this.assembleAcptBills(billInfoList, billListJson);
            this.$refs.showAcctRecord.getBillInfoList(billInfoListNext);
          } else {
            this.$msgTip.error(this, {info: msg});
          }
        }
      }).catch(error => {
        this.$msgTip.error(this, {info: this.$t("m.i.common.netError") + error});
      });
    }
    ,
    //手续费调整弹窗关闭
    feeAdjustWinClose() {
      this.feeAdjustWin = false;
    }
    ,
    feeAdjustHandle(info) {
      if (info === 'batch') {
        if (this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseDataFirst")});
          return;
        }
        this.feeForm.batchId = this.currentSelectRow.id;
        this.feeForm.billMoney = "1";
        this.isBatch = true;
      } else {
        if (this.$refs.billManagerDatagrid.selects.length === 0) {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseDataFirst")});
          return;
        }
        if (this.$refs.billManagerDatagrid.selects.length > 1) {
          this.$msgTip.info(this, {info: this.$t("m.i.common.onlyChooseOneData")});
          return;
        }
        let bill = this.$refs.billManagerDatagrid.selects[0];
        this.feeForm.billId = bill.id;
        this.feeForm.billMoney = bill.billMoney;
        this.isBatch = false;
      }
      this.feeAdjustWin = true;
    }
    ,
    feeAdjustWinSubmit() {
      let batchFeeAdjustUrl = "/ce/acpt/elec/account/eAcptAccountMain/func_batchFeeAdjust";
      let selectFeeAdjustUrl = "/ce/acpt/elec/account/eAcptAccountMain/func_selectFeeAdjust";
      let url = this.isBatch ? batchFeeAdjustUrl : selectFeeAdjustUrl;
      post(this.feeForm, url).then(res => {
        if (res) {
          let msg = res.data.retMsg;
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.$msgTip.success(this);
            this.feeAdjustWinClose();
            if (this.isBatch) {
              this.handleSearch();
            } else {
              this.billManagerHandleSearch();
            }
          } else {
            this.feeForm.feeRate = "",
              this.feeForm.feeAmt = "",
              this.$msgTip.error(this, {info: msg});
          }
        } else {
          this.$msgTip.error(this, {info: this.$t('m.i.common.netError')});
        }
      });
    }
    ,
    addOrDelBatchBusiLock(id, type) {
      if (this.syncOperMode === '1') {
        let lockUserNo = JSON.parse(window.sessionStorage.getItem("userInfo")).userNo;
        let lockBrchName = JSON.parse(window.sessionStorage.getItem("userInfo")).brchName;
        if (type === "add") {
          post({
            id: id,
            lockType: "0",
            lockUserNo: lockUserNo,
            lockBrchName: lockBrchName
          }, "/ce/acpt/elec/apply/eAcptApplyMain/func_addBatchBusiLock").then(res => {
            if (res) {
              let retCode = res.data.retCode;
              if (retCode !== "000000") {
                this.$msgTip.error(this, {info: res.data.retMsg});
                this.handleSearch();
              } else {
                this.mainVue = false;
                this.billManagerVue = true;
                this.$nextTick(() => {
                  this.billManagerColumns = deepClone(this.billTemp);
                  this.$refs.billManagerDatagrid.createShowCol(this.billTemp);
                  this.$refs.billManagerDatagrid.dataChange(1);
                });
              }
            } else {
              this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
            }
          });
        } else {
          post({id: id, lockType: "1"}, "/ce/acpt/elec/apply/eAcptApplyMain/func_deleteBatchBusiLock").then(res => {
            if (res) {
              let retCode = res.data.retCode;
              if (retCode !== "000000") {
                this.$msgTip.error(this, {info: res.data.retMsg});
              }
            } else {
              this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
            }
          });
        }
      }
    }
    ,
    assembleAcptBills(acptBillList, billListJson) {
      let bodyHtml = [];
      let bodyStr1 = "";
      let bodyStr2 = "";
      if (acptBillList !== null && Object.keys(billListJson).length !== 0) {
        for (let i = 0; i < acptBillList.length; i++) {
          if (!!acptBillList[i].remitDt) {
            acptBillList[i].remitDt = this.$moment(acptBillList[i].remitDt, "YYYYMMDD").format("YYYY-MM-DD");
          }
          if (!!acptBillList[i].dueDt) {
            acptBillList[i].dueDt = this.$moment(acptBillList[i].dueDt, "YYYYMMDD").format("YYYY-MM-DD");
          }
          acptBillList[i].billMoney = formatNumber(acptBillList[i].billMoney, 2, ',');
          acptBillList[i].fee = formatNumber(acptBillList[i].fee, 2, ',');
          acptBillList[i].vochFee = formatNumber(acptBillList[i].vochFee, 2, ',');
          // if (i < 10) {
          bodyStr1 += "<tr>";
          bodyStr1 += "<td class='ta-c'>" + (1 + i) + "</td>";
          for (let key in billListJson) {
            let temp = acptBillList[i][key] === null ? '' : acptBillList[i][key];
            bodyStr1 += "<td>" + temp + "</td>";
          }
          bodyStr1 += "</tr>";
          // } else {
          //   bodyStr2 += "<tr>";
          //   bodyStr2 +=  "<td class='ta-c'>" + (1+i) + "</td>";
          //   for(let key in billListJson) {
          //     let temp = acptBillList[i][key] === null? '': acptBillList[i][key];
          //     bodyStr2 += "<td>" + temp + "</td>";
          //   }
          //   bodyStr2 += "</tr>";
          // }
        }
      }
      if (Object.keys(billListJson).length !== 0) {
        let headHtml = "";
        for (let key in billListJson) {
          headHtml += "<th>" + billListJson[key] + "</th>";
        }
        let bodyHtml1 = `<div class="list-table-box"><table class="list-table">
            <thead>
              <tr>
                <th class="ta-c"><b>序号</b></th>
                ${headHtml}
              </tr>
            </thead>
            <tbody>${bodyStr1}</tbody>
          </table>
        </div>`
        bodyHtml.push(bodyHtml1);
        if (!!bodyStr2) {
          let bodyHtml2 = `<div class="list-table-box">
            <table class="list-table">
              <tbody>${bodyStr2}</tbody>
            </table>
          </div>`
          bodyHtml.push(bodyHtml2);
        }
        return bodyHtml;
      } else {
        return "";
      }
    }
    ,
  },
};
</script>

<style scoped>

</style>
