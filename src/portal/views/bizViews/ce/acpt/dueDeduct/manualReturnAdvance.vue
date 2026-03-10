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
                <show-branch
                  v-model="formItem.ownedBrchNames" :label="$t('m.i.common.ownedBrchNo')"
                  prop="ownedBrchNames"
                  :showIcon="true"
                  v-if="licenseFlag" :showCheckBox="true" :brchNo.sync="formItem.ownedBrchNos" :brchName.sync="formItem.ownedBrchNames"
                  :params="{authPath:this.$route.path}"
                  url="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree"
                  queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
                </show-branch>
                <h-form-item prop="drwrName" :label="$t('m.i.billInfo.drwrName')">
                  <h-input v-model="formItem.drwrName" placeholder="" icon="android-search" @on-click="queryCustName()"
                           readonly clearable @on-clear="clearVal('custName')"></h-input>
                </h-form-item>
                <h-form-item prop="drwrAcctNo" :label="$t('m.i.billInfo.drwrAcctNo')">
                  <h-input v-model="formItem.drwrAcctNo" placeholder="" icon="android-search"
                           @on-click="queryCustAcctNo()" readonly clearable @on-clear="clearVal('custAcctNo')"></h-input>
                </h-form-item>
                <h-form-item prop="acptProtocalNoLike" :label="$t('m.i.billInfo.acptProtocalNo')">
                  <h-input v-model="formItem.acptProtocalNoLike" placeholder=""></h-input>
                </h-form-item>
                <h-form-item prop="dueDt" :label="$t('m.i.billInfo.dueDt')">
                  <h-date-picker type="date" v-model="formItem.dueDt" placeholder="" @on-change="handleDateChange"
                                 :editable=false></h-date-picker>
                </h-form-item>
                <h-form-item prop="billClass" :label="$t('m.i.billInfo.billClass')">
                  <h-select v-model="formItem.billClass"  placeholder="">
                    <h-option v-for="item in BillClassList" :value="item.key" :key="item.value">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                                                                   :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid :columns="columns"
                      highlightRow
                      url="/ce/acpt/dueDeduct/manualDeductMain/func_pagingQueryReturnAdvanceAcptBatch"
                      :bindForm="formItem"
                      :on-current-change="handleRowClick"
                      :on-current-change-cancel="handleRowClickCancel"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="billManager()">{{$t("m.i.ce.billManage")}}</h-button>
            </div>
          </h-datagrid>
        </div>
        <!-- 子页面 -->
        <div v-if="billManagerVue" key="2">
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix">
              <h-form :model="billManagerFormItem" :label-width="90" ref="billManagerFormItem" cols="4"
                      class="h-form-search">
                <h-form-item prop="billNoLike" :label="$t('m.i.billInfo.billNo')">
                  <h-input v-model="billManagerFormItem.billNoLike" placeholder=""></h-input>
                </h-form-item>
                <h-form-item class="h-form-operate one-form">
                  <h-button type="primary" @click="billManagerHandleSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="billManagerResetSearch()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
        </div>
        <acpt-batch-info-detail :is-show="billManagerVue" :params="batchInfoParams" url="/ce/acpt/dueDeduct/manualDeductMain/func_pagingQueryReturnAdvanceAcptBatch"
                                ref="acptBatchInfoDetail"></acpt-batch-info-detail>
        <!-- 数据展示表格 -->
        <div v-if="billManagerVue" key="3">
          <h-datagrid :columns="billManagerColumns"
                      url="/ce/acpt/dueDeduct/manualDeductMain/func_pagingQueryAdvanceAcptBill"
                      :bindForm="billManagerFormItem"
                      highlightRow
                      :has-select="false"
                      :row-select="true"
                      :auto-load="false"
                      ref="billManagerDatagrid">
            <div slot="toolbar" class="pull-left">
              <h-dropdown placement="bottom-start" @on-click="accountDetail">
                <h-button type="primary">{{$t('m.i.ce.returnAdvance')}}
                  <h-icon name="unfold"></h-icon>
                </h-button>
                <h-dropdown-menu slot="list">
                  <h-dropdown-item name="batch">{{$t('m.i.ce.batchReturnAdvance')}}</h-dropdown-item>
                  <h-dropdown-item name="select">{{$t('m.i.ce.selectReturnAdvance')}}</h-dropdown-item>
                </h-dropdown-menu>
              </h-dropdown>
              <h-button type="ghost" @click="returnMain">{{$t('m.i.common.goBack')}}</h-button>
            </div>
          </h-datagrid>
        </div>
        <!-- 查询客户信息弹窗 -->
        <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose"
                           @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>
        <!-- 查询客户账号信息弹窗 -->
        <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" :cust-no="this.formItem.drwrCustNo"
                           @showCustAcctNoWinClose="showCustAcctNoWinClose"
                           @custAcctNoSelectSubmit="custAcctNoSelectSubmit"></show-cust-acct-no>

        <!-- 分录弹框 -->
        <acct-record :param="this.acctRecordParam" :url="this.acctRecordUrl" :submitFlag="this.acctSubmitFlag" :showPrintButton="this.showPrintButton" @acctAuthorize="acctAuthorize"
                     :show-acct-record-win="this.showAcctRecordWin" @acctSubmitSure="acctSubmitSure" @showAcctRecordWinClose="showAcctRecordWinClose"
                     @printSuccessCallback="printSuccessCallback" ref="showAcctRecord"></acct-record>

        <!-- 票面 -->
        <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin"
                        :billId="this.billId"></bill-info-main>
        <!--保证金账号查询-->
        <show-deduct-acct @dueDeductAcctWinClose="dueDeductAcctWinClose" :dueDeductAcctWin="dueDeductAcctWin" :params="showParams"></show-deduct-acct>
        <!-- 调整垫款金额 -->
        <h-msg-box v-model="adjustAdvanceWin" width="500" class="h-form-search-layer" :maximize="true" :mask-closable="false">
          <p slot="header">
            <span>归还垫款金额</span>
          </p>
          <h-panel>
            <h-form :model="adjustAdvanceItem" :label-width="115" ref="adjustAdvanceItem" cols="1" class="h-form-search">
              <h-form-item :label="$t('m.i.ce.advancedPayAmt')" prop="advancedPayAmt" required>
                <h-typefield type="money" v-model="adjustAdvanceItem.advancedPayAmt" :maxlength="20"
                             placeholder="数字，小数位最多2位" @on-blur="formatBillMoney()"></h-typefield>
              </h-form-item>
            </h-form>
          </h-panel>
          <div slot="footer">
            <h-button type="ghost" @click="closeAdjustAdvance()">{{$t("m.i.common.close")}}</h-button>
            <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
            <h-button type="primary"  v-else @click="submitAdjustAdvance()">{{$t("m.i.common.submit")}}</h-button>
          </div>
        </h-msg-box>
      </h-col>
    </h-row>
  </div>
</template>

<script>
  import { accMul, formatNumber, getDictValueFromMap, post } from "@/api/bizApi/commonUtil";
  import { deepClone } from "@/utils/index";

  export default {
    name: "manualReturnAdvance",
    components: {
      ShowDeductAcct:()=>import(/* webpackChunkName: "ce/acpt/common/showDeductAcct" */`@/views/bizViews/ce/acpt/common/showDeductAcct`),
      AcptBatchInfoDetail:()=>import(/* webpackChunkName: "ce/acpt/common/deductBatchInfoDetail" */`@/views/bizViews/ce/acpt/common/deductBatchInfoDetail`)
    },
    data() {
      let columns = [
        {
          title: ' ',
          type: 'radio',
          align: 'center',
          width : 50
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
          title: this.$t("m.i.common.ownedBrchNo"),
          key: "ownedBrchName",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.billInfo.acptProtocalNo'),
          key: 'acptProtocalNo',
          hiddenCol: false,
          sortable: true,
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
                    this.acptProtocalNoMain(params.row.id,params.row.ownedBrchNo)
                  }
                }
              }, params.row.acptProtocalNo)
            ]);
          }
        },
        {
          title: this.$t('m.i.billInfo.drwrName'),
          key: 'drwrName',
          sortable: true,
          hiddenCol: false,
        },
        {
          title: this.$t('m.i.billInfo.drwrCustNo'),
          key: 'drwrCustNo',
          hiddenCol: false,
        },
        {
          title: this.$t('m.i.billInfo.drwrAcctNo'),
          key: 'drwrAcctNo',
          hiddenCol: false,
        },
        {
          title: this.$t('m.i.billInfo.drweBankName'),
          key: 'drweBankName',
          sortable: true,
          hiddenCol: false,
        },
        {
          title: this.$t('m.i.billInfo.remitDt'),
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
          title:  this.$t('m.i.billInfo.dueDt'),
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
          title:  this.$t('m.i.ce.totalFee'),
          key: 'totalFee',
          hiddenCol: false,
          render: (h, params) => {
            let totalFee = formatNumber(params.row.totalFee, 2, ',');
            return h("span", {
              domProps: {
                title: totalFee
              }
            }, totalFee);
          }
        },
        {
          title: this.$t('m.i.ce.totalCommitFee'),
          key: 'totalCommitFee',
          hiddenCol: false,
          render: (h, params) => {
            let totalCommitFee = formatNumber(params.row.totalCommitFee, 2, ',');
            return h("span", {
              domProps: {
                title: totalCommitFee
              }
            }, totalCommitFee);
          }
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
          sortable: true,
          render: (h, params) => {
            let totalAmt = formatNumber(params.row.totalAmt, 2, ',');
            return h("span", {
              domProps: {
                title: totalAmt
              }
            }, totalAmt);
          }
        }
      ];
      let billManagerColumns = [
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
          title: this.$t('m.i.billInfo.billNo'),
          key: 'billNo',
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let billNo = "";
            if (params.row.billNo === null || params.row.billNo === "") {
              billNo = this.$t('m.i.ce.showBillInfo');
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
          title: this.$t('m.i.ce.promNoteNo'),
          key: 'promNoteNo',
          hiddenCol: false,
        },
        {
          title: this.$t('m.i.billInfo.flowStatus'),
          key: 'flowStatusName',
          hiddenCol: false,
        },
        {
          title: this.$t('m.i.billInfo.billMoneyByUnit'),
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
          title: this.$t("m.i.ce.advancedPayAmt"),
          key: 'advancedPayAmt',
          sortable: true,
          render: (h, params) => {
            let advancedPayAmt = formatNumber(params.row.advancedPayAmt, 2, ',');
            return h("span", {
              domProps: {
                title: advancedPayAmt
              }
            }, advancedPayAmt);
          }
        },
        {
          title: this.$t('m.i.billInfo.dueDt'),
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
          title:  this.$t('m.i.ce.fee'),
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
          title: this.$t('m.i.ce.commitFee'),
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
          title: this.$t('m.i.billInfo.pyeeName'),
          key: 'pyeeName',
          sortable: true,
          hiddenCol: false,
        },
        {
          title: this.$t('m.i.billInfo.pyeeAcctNo'),
          key: 'pyeeAcctNo',
          hiddenCol: false,
        },
        {
          title: this.$t('m.i.billInfo.pyeeBankNo'),
          key: 'pyeeBankNo',
          hiddenCol: false,
        },
        {
          title: this.$t('m.i.billInfo.acptName'),
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
          title: this.$t('m.i.ce.drwrAcctNo'),
          key: 'drwrAcctNo',
          hiddenCol: false,
        }
      ];
      return {
        licenseFlag:false,
        authPath: this.$route.path ,
        ownedBrchNo:"",
        dictMap: new Map(),
        adjustAdvanceWin:false,
        showBillInfoWin: false,
        BillClassList: [],
        billId: "",
        deductAcctFormItem: {
          listId: ""
        },
        formItem: {
          drwrCustNo: '',
          drwrName: '',
          drwrAcctNo: '',
          acptProtocalNoLike: '',
          dueDt: '',
          deductApplFlag: '0',
          billClass:'',
          authPath:this.$route.path,
          ownedBrchNos:"",
          ownedBrchNames:"",
        },
        billManagerFormItem: {
          billNoLike: '',
          batchId: '',
          deductApplFlag: '0'
        },
        acctInfoForm: {
          isBatchOper: '0',
          batchId: '',
          acptIds:'',
          ids:'',
          acctNos: []
        },
        deductAcctCurrentList: [],
        viewDetailForm: {},
        columns: columns,
        deductAcctColumns: [
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
            title:  this.$t("m.i.common.acctNo"),
            key: 'deductAcctNo',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.common.dpstNo"),
            key: 'dpstNo',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.common.acctType"),
            key: 'deductAcctType',
            hiddenCol: false,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap, "custAcctKind", params.row.deductAcctType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          }
        ],
        billManagerColumns: billManagerColumns,
        temp: deepClone(columns),
        billTemp: deepClone(billManagerColumns),
        batchInfoParams: {
          batchId: '',
          billNoLike: "",
          deductStatusList:'3',
          deductApplFlag: '0',
          authPath:this.$route.path,
          ownedBrchNos:""
        },
        acctNoList: [],
        batchId: "",
        adjustAdvanceItem:{
          advancedPayAmt:""
        },
        currentSelectRow: [],
        billManagerCurrentSelectList: [],
        acctRecordParam:{},
        showAcctRecordWin: false,
        showPrintButton: false,
        acctRecordUrl: "",
        acctSubmitFlag: false,
        custAcctKindList: [],
        mainVue: true,
        billManagerVue: false,
        showCustAcctNoWin: false,
        showCustMessageWin: false,
        deductConfirmWin: false,
        submitFlag: false,
        ifShowMore: false,
        //查询保证金账户信息
        dueDeductAcctWin: false,
        showParams: {
          listId:"",
        }
      };
    },
    mounted() {
      this.getDictListByGroups("CDMedia,custAcctKind,DeductStatusType").then(res => {
        this.BillClassList = res.get("CDMedia");
        this.custAcctKindList = res.get("custAcctKind");
        this.dictMap = res.get("map");
      });
      this.getParams();

      post({authPath:this.$route.path}, "sm/auth/licenseBrch/focusOper/func_checkLicenseAuth").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.licenseFlag = res.data.retData.licenseFlag;
            if (this.licenseFlag) {
              this.temp=this.$refs.datagrid.controlColumnsHidden("ownedBrchName", false);
            }else {
              this.temp=this.$refs.datagrid.controlColumnsHidden("ownedBrchName", true);
            }
          } else {
            this.$msgTip.error(this, { info: res.data.retMsg });
          }
        }else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });
    },
    methods: {
      showDueDeductAcct(id) {
        this.showParams.listId = id;
        this.dueDeductAcctWin = true;
      },

      dueDeductAcctWinClose() {
        this.dueDeductAcctWin = false;
      },
      formatBillMoney(){
        for(let i = 0;i<this.$refs.billManagerDatagrid.selects.length;i++) {
          if (this.adjustAdvanceItem.advancedPayAmt > this.$refs.billManagerDatagrid.selects[i].advancedPayAmt) {
            this.$msgTip.info(this, {info: "归还垫款金额不能大于垫款金额"});
            this.adjustAdvanceItem.advancedPayAmt = "";
            return;
          }
        }
        if (Number(this.adjustAdvanceItem.advancedPayAmt) <= 0) {
          this.$msgTip.info(this, {info: "归还垫款金额需大于0"});
          this.adjustAdvanceItem.advancedPayAmt = "";
          return;
        }
      },
      closeAdjustAdvance(){
        this.adjustAdvanceItem.advancedPayAmt = "";
        this.adjustAdvanceWin = false;
        this.$refs.adjustAdvanceItem.resetFields();
      },
      clearVal(type){
        if(type === 'custName'){
          this.formItem.drwrCustNo = '';
          this.formItem.drwrName = "";
        }else{
          this.formItem.drwrAcctNo = '';
        }
      },
      onMaximize() {
        this.$refs.deductAcctInfoDatagrid.$refs.gridContent.handleResize();
      },
      handleSeleceDeductAcctChange(arr) {
        this.deductAcctCurrentList = arr;
      },
      billInfoWinClose() {
        this.showBillInfoWin = false;
      },
      showBillInfo(billId) {
        this.billId = billId;
        this.showBillInfoWin = true;
      },
      handleDateChange(value) {
        this.formItem.dueDt = value.replace(/-/g, "");
      },
      //表单查询
      handleSearch() {
        this.currentSelectRow = [];
        this.$nextTick(() => {
          this.$refs.datagrid.dataChange(1);
        });
      },
      //重置表单查询结果
      resetSearch() {
        this.$nextTick(() => {
          this.formItem.drwrCustNo = "";
          this.formItem.drwrName = "";
          this.formItem.drwrAcctNo = "";
          this.formItem.acptProtocalNoLike = "";
          this.formItem.dueDt = "";
          this.formItem.billClass=""
          this.formItem.ownedBrchNos=""
          this.formItem.ownedBrchNames=""
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
      //票据管理
      billManager() {
        if (this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.batchId = this.currentSelectRow.id;
        this.billManagerFormItem.dueDt = this.formItem.dueDt;
        this.billManagerFormItem.batchId = this.batchId;
        this.batchInfoParams.dueDt = this.formItem.dueDt;
        this.batchInfoParams.batchId = this.batchId;
        this.billManagerFormItem.billNoLike = "";
        this.batchInfoParams.billNoLike = "";
        this.batchInfoParams.ownedBrchNos=this.currentSelectRow.ownedBrchNo;
        this.$refs.datagrid.tData = [];
        this.resetSearch();
        this.mainVue = false;
        this.billManagerVue = true;
        this.$nextTick(() => {
          this.billManagerColumns = deepClone(this.billTemp);
          this.$refs.billManagerDatagrid.createShowCol(this.billTemp);
          this.$refs.billManagerDatagrid.dataChange(1);
        });
      },
      //承兑协议编号超链接
      acptProtocalNoMain(str,ownedBrchNo) {
        this.batchId = str;
        this.billManagerFormItem.batchId = this.batchId;
        this.billManagerFormItem.dueDt = this.formItem.dueDt;
        this.batchInfoParams.batchId = this.batchId;
        this.batchInfoParams.dueDt = this.formItem.dueDt;
        this.batchInfoParams.ownedBrchNos=ownedBrchNo
        this.$refs.datagrid.tData = [];
        this.resetSearch();
        this.mainVue = false;
        this.billManagerVue = true;
        this.$nextTick(() => {
          this.billManagerColumns = deepClone(this.billTemp);
          this.$refs.billManagerDatagrid.createShowCol(this.billTemp);
          this.$refs.billManagerDatagrid.dataChange(1);
        });
      },

      //确定记账
      acctSubmitSure(info) {
        // let param = {};
        // if(this.acctType === "batch") {
        //   param = {batchId: this.batchId, billOperType: "1", isBack: "0"};
        // }else if (this.acctType === "select") {
        //   param = {batchId: this.batchId, billOperType: "0", acptIds: this.acctIds, isBack: "0"};
        // }
        // this.acctSubmitFlag = true;
        // post(param, "/ce/acpt/dueDeduct/manualDeductMain/func_deductAccount").then(res => {
        //   this.acctSubmitFlag = false;
        //   if(res) {
        //     let msg = res.data.retMsg;
        //     let retCode = res.data.retCode;
        //     if (retCode === "000000") {
        //       this.$msgTip.success(this);
        //       //组装打印票据明细
        //       this.contractPrinting(info.recordInfo);
        //       this.showPrintButton = true;
        //       if(!info.isHasPrint) {
        //         this.showAcctRecordWinClose();
        //       }
        //     } else {
        //       this.$msgTip.error(this, { info: msg });
        //     }
        //   }
        // }).catch(error => {
        //   this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        // });
      },
      //打印成功回调
      printSuccessCallback() {
        this.showAcctRecordWinClose();
      },
      //批次归还垫款
      batchAccount() {
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定批次归还垫款吗?",
          onOk: () => {
            this.getEntryInfo("batch");
          }
        });
      },
      //选择归还垫款
      selectAccount() {
        let list = this.$refs.billManagerDatagrid.selects;
        if(list.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.acctIds = "";
        for (let i = 0, count = list.length; i < count; i++) {
          this.acctIds += list[i].id;
          if (i < list.length - 1) {
            this.acctIds += ",";
          }
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定归还垫款吗?",
          onOk: () => {
            this.getEntryInfo("select");
          }
        });
      },
      //归还垫款
      accountDetail(str) {
        this.acctType = str;
        if(str === "batch") {
          this.adjustAdvanceWin = true;
        }
        if(str === "select") {
          let list = this.$refs.billManagerDatagrid.selects;
          if(list.length === 0) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
            return;
          }
          this.adjustAdvanceWin = true;
        }
      },
      submitAdjustAdvance(){
        this.$refs["adjustAdvanceItem"].validate(valid => {
        if (valid) {
          if (this.acctType === "batch") {
            this.batchAccount();
          }
          if (this.acctType === "select") {
            this.selectAccount();
          }
        }
        })
      },
      //获取分录信息
      getEntryInfo(str) {
        this.acctRecordUrl = "/ce/acpt/dueDeduct/manualDeductMain/func_generateAdvanceAcctRecord";
        let ids = [];
        for(let i = 0; i < this.$refs.billManagerDatagrid.tData.length; i++){
          ids.push(this.$refs.billManagerDatagrid.tData[i].id);
        }
        if(str === "batch") {
          this.acctRecordParam = {batchId: this.batchId, billOperType: "1",acptIds: ids,acctAuthBusiType:"16",
            prodNo:"010112",advancedPayAmt:this.adjustAdvanceItem.advancedPayAmt}
        }else if(str === "select") {
          this.acctRecordParam = {batchId: this.batchId, billOperType: "0", acptIds: this.acctIds,acctAuthBusiType:"16",
            prodNo:"010112",advancedPayAmt:this.adjustAdvanceItem.advancedPayAmt}
        }
        this.showAcctRecordWin = true;
      },
      //关闭分录弹窗
      showAcctRecordWinClose() {
        this.showAcctRecordWin = false;
        this.showPrintButton = false;
        this.acctRecordParam = {};
        this.acctRecordUrl = "";
      },
      //提交到记账授权
      acctAuthorize(){
        let param = {};
        let ids = [];
        for(let i = 0; i < this.$refs.billManagerDatagrid.tData.length; i++){
          ids.push(this.$refs.billManagerDatagrid.tData[i].id);
        }
        if(this.acctType === "batch") {
          param = {batchId: this.batchId, billOperType: "1",acptIds: ids,acctType:"1",
            prodNo:"010112",advancedPayAmt:this.adjustAdvanceItem.advancedPayAmt};
        }else if (this.acctType === "select") {
          param = {batchId: this.batchId, billOperType: "0", acptIds: this.acctIds,acctType:"1",
            prodNo:"010112",advancedPayAmt:this.adjustAdvanceItem.advancedPayAmt};
        }
        this.acctSubmitFlag = true;
        post(param, "/ce/acpt/dueDeduct/manualDeductMain/func_advanceAccountAuthorize").then(res => {
          this.acctSubmitFlag = false;
          if(res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.closeAdjustAdvance();
              this.showAcctRecordWinClose();
              this.$refs.billManagerDatagrid.selects = [];
              this.$refs.acptBatchInfoDetail.getBatchInfo();
              this.$refs.billManagerDatagrid.dataChange(1,(data)=>{
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

      //票据管理子页面方法
      //表单查询
      billManagerHandleSearch() {
        this.$refs.billManagerDatagrid.selects = [];
        this.batchInfoParams.billNoLike = this.billManagerFormItem.billNoLike;
        this.$nextTick(() => {
          this.$refs.billManagerDatagrid.dataChange(1);
          this.$refs.acptBatchInfoDetail.getBatchInfo();
        });
      },
      //重置表单查询结果
      billManagerResetSearch() {
        this.$nextTick(() => {
          this.billManagerFormItem.billNoLike = "";
          this.batchInfoParams.billNoLike = "";
        });
      },

      //返回主页面
      returnMain() {
        this.mainVue = true;
        this.billManagerVue = false;
        this.currentSelectRow = [];
        this.$refs.billManagerDatagrid.selects = [];
        this.billManagerResetSearch();
        this.$nextTick(() => {
          this.columns = deepClone(this.temp);
          this.$refs.datagrid.createShowCol(this.temp);
        });
      },
      getParams(){
        if (this.$route.path === "/ce/acpt/dueDeduct/manualDeductMain") {
          if (this.$route.query.dueDt) {
            this.formItem.dueDt = this.$moment(this.$route.query.dueDt, "YYYY-MM-DD").format("YYYYMMDD");
            this.formItem.billClass = this.$route.query.billClass;
            this.$nextTick(() => {
              this.handleSearch();
            });
          }
        }
      }
    },
    watch: {
      "$route": "getParams"
    },
  };

</script>

<style scoped>

</style>
