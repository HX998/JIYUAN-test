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
                <show-branch v-model="formItem.ownedBrchNos" :label="$t('m.i.common.ownedBrchNo')" prop="ownedBrchNos" title="机构名称"
                             :brchNo.sync="formItem.ownedBrchNos" :brchName.sync="formItem.ownedBrchNames" v-if="this.licenseFlag" :params="{authPath: this.authPath}"
                             url ="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree" queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
                </show-branch>
                <h-form-item prop="drwrName" :label="$t('m.i.billInfo.drwrName')">
                  <h-input v-model="formItem.drwrName" placeholder="" icon="android-search" @on-click="queryCustName()" readonly
                           clearable @on-clear="clearVal('custName')"></h-input>
                </h-form-item>
                <h-form-item prop="drwrAcctNo" :label="$t('m.i.billInfo.drwrAcctNo')">
                  <h-input v-model="formItem.drwrAcctNo" placeholder="" icon="android-search" @on-click="queryCustAcctNo()" readonly
                           clearable @on-clear="clearVal('custAcctNo')"></h-input>
                </h-form-item>
                <h-form-item prop="acptProtocalNoLike" :label="$t('m.i.billInfo.acptProtocalNo')">
                  <h-input v-model="formItem.acptProtocalNoLike" placeholder=""></h-input>
                </h-form-item>
                <h-form-item prop="remitDt":label="$t('m.i.billInfo.remitDt')">
                  <h-date-picker type="date" v-model="formItem.remitDt" placeholder="" @on-change="handleDateChange" :editable=false></h-date-picker>
                </h-form-item>
                <h-form-item prop="acptType" :label="$t('m.i.ce.acptType')">
                  <h-select v-model="formItem.acptType" placeholder="" showTitle>
                    <h-option v-for="item in acptTypeList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                  </h-select>
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
                      url="/ce/acpt/paper/account/acptAccountMain/func_queryPageAcptBatchAndBill"
                      :bindForm="formItem"
                      :on-current-change="handleRowClick"
                      :on-current-change-cancel="handleRowClickCancel"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="accountMain()" >{{$t('m.i.ce.account')}}</h-button>
            </div>
          </h-datagrid>
        </div>
        <!-- 子页面 -->
        <div v-if="billManagerVue" key="2">
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix">
              <h-form :model="billManagerFormItem" :label-width="90" ref="billManagerFormItem" cols="4" class="h-form-search">
                <h-form-item prop="promNoteNoLike" :label="$t('m.i.ce.promNoteNo')">
                  <h-input v-model="billManagerFormItem.promNoteNoLike" placeholder=""></h-input>
                </h-form-item>
                <h-form-item class="h-form-operate one-form">
                  <h-button type="primary" @click="billManagerHandleSearch()">{{$t('m.i.common.search')}}</h-button>
                  <h-button type="ghost" @click="billManagerResetSearch()">{{$t('m.i.common.reset')}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
        </div>
        <acpt-batch-info-detail :is-show="billManagerVue" :params="batchInfoParams"
                                :batchUrl = "'/ce/acpt/paper/account/acptAccountMain/func_getAcptBatchByQueryDto'"
                                ref="acptBatchInfoDetail"></acpt-batch-info-detail>
        <!-- 数据展示表格 -->
        <div v-if="billManagerVue" key="3">
          <h-datagrid :columns="billManagerColumns"
                      url="/ce/acpt/paper/account/acptAccountMain/func_queryPageAcptBill"
                      :auto-load="false"
                      :row-select="true"
                      :bindForm="billManagerFormItem"
                      :has-select="false"
                      ref="billManagerDatagrid">
            <div slot="toolbar" class="pull-left">
<!--              <h-dropdown placement="bottom-start" @on-click="accountDetail">-->
              <h-button type="primary" @click="batchAccount">{{$t('m.i.ce.batchAccount')}}</h-button>
              <h-button type="primary" @click="reBatchBack">{{$t('m.i.ce.batchReturnBack')}}</h-button>
              <h-button type="ghost" @click="returnMain" >{{$t('m.i.common.goBack')}}</h-button>
            </div>
          </h-datagrid>
        </div>
        <!-- 查询客户信息弹窗 -->
        <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose"
                           @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>
        <!-- 查询客户账号信息弹窗 -->
        <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" :cust-no="this.formItem.drwrCustNo"
                           @showCustAcctNoWinClose="showCustAcctNoWinClose" @custAcctNoSelectSubmit="custAcctNoSelectSubmit" :isAllBankAcct=true></show-cust-acct-no>
        <!-- 分录弹框 -->
        <acct-record :param="this.acctRecordParam" :url="this.acctRecordUrl" :submitFlag="this.acctSubmitFlag" :showPrintButton="this.showPrintButton" @acctAuthorize="acctAuthorize"
                          :show-acct-record-win="this.showAcctRecordWin" @acctSubmitSure="acctSubmitSure" @showAcctRecordWinClose="showAcctRecordWinClose" :licenseFlag="this.licenseFlag"
                     :ownedBrchNo="this.billManagerFormItem.ownedBrchNo" @printSuccessCallback="printSuccessCallback" ref="showAcctRecord"></acct-record>
        <!-- 票面 -->
        <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"></bill-info-main>
        <!--保证金账号查询-->
        <show-deduct-acct @dueDeductAcctWinClose="dueDeductAcctWinClose" :dueDeductAcctWin="dueDeductAcctWin" :params="showParams"></show-deduct-acct>
      </h-col>
    </h-row>
  </div>
</template>

<script>
  import { post, on, off, getDictListByGroups, getDictValueFromMap,formatNumber,accMul } from "@/api/bizApi/commonUtil";
  import {deepClone} from "@/utils/index";

  export default {
    name: "acptAccountMain",
    components: {
      ShowDeductAcct:()=>import(/* webpackChunkName: "ce/acpt/common/showDeductAcct" */`@/views/bizViews/ce/acpt/common/showDeductAcct`),
      // AcptBatchInfoDetail:()=>import(/* webpackChunkName: "ce/acpt/common/acptBatchInfoDetail" */`@/views/bizViews/ce/acpt/common/acptBatchInfoDetail`)
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
          title: this.$t("m.i.billInfo.acptProtocalNo"),
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
           title: this.$t("m.i.billInfo.drwrName"),
          key: 'drwrName',
          sortable: true,
          hiddenCol: false,
        },
        {
         title: this.$t("m.i.common.custNo"),
          key: 'drwrCustNo',
          hiddenCol: false,
          sortable: true,
        },
        {
          title: this.$t("m.i.common.custAcctNo"),
          key: 'drwrAcctNo',
          hiddenCol: false,
          sortable: true,
        },
        {
          title: this.$t("m.i.billInfo.drweBankName"),
          key: 'drweBankName',
          sortable: true,
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
         title: this.$t("m.i.ce.totalFee"),
          key: 'totalFee',
          hiddenCol: false,
          sortable: true,
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
          title: this.$t("m.i.ce.totalCommitFee"),
          key: 'totalCommitFee',
          sortable: true,
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
          title: this.$t("m.i.ce.totalCount"),
          key: 'totalCount',
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.ce.totalAmt"),
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
          title: this.$t("m.i.ce.bailPcet"),
          key: 'bailPcet',
          hiddenCol: false,
          render: (h, params) => {
            if(params.row.bailPcet != null && params.row.bailPcet !== ""){
              let rate = accMul(params.row.bailPcet, 100) + "(%)";
              return h("span", rate);
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
      ];
      return {
        showBillInfoWin: false,
        billId: "",
        showPrintButton: false,
        authPath: this.$route.path ,
        licenseFlag:false,
        formItem: {
          drwrCustNo: '',
          drwrName: '',
          drwrAcctNo: '',
          acptProtocalNoLike: '',
          remitDt: '',
          acptType: '',
          billClass: 'ME01',
          curFuncNo: 'PICE010302',
          authPath:this.$route.path,
          ownedBrchNos:"",
          ownedBrchNames:"",
        },
        billManagerFormItem: {
          promNoteNoLike: '',
          batchId: '',
          billClass: 'ME01',
          curFuncNo: 'PICE010302'
        },
        columns: columns,
        billManagerColumns: billManagerColumns,
        temp: deepClone(columns),
        billTemp: deepClone(billManagerColumns),
        batchInfoParams: {
          id: '',
          curFuncNo: 'PICE010302',
          promNoteNoLike: ""
        },
        acctSubmitFlag: false,
        acptTypeList: [],
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
        ifShowMore: false,
        //查询保证金账户信息
        dueDeductAcctWin: false,
        btnAuth:"",
        showParams: {
          listId:"",
        }
      }
    },
    mounted() {
      getDictListByGroups("AcptType").then(res => {
        this.acptTypeList = res.get("AcptType");
        this.dictMap = res.get("map");
      });
      //集中操作授权
      post({authPath:this.$route.path}, "sm/auth/licenseBrch/focusOper/func_checkLicenseAuth").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.licenseFlag = res.data.retData.licenseFlag;
            let columns=[]
            if (this.licenseFlag) {
              columns=this.$refs.datagrid.controlColumnsHidden("ownedBrchName", false);
            }else {
              columns=this.$refs.datagrid.controlColumnsHidden("ownedBrchName", true);
            }
            this.temp=deepClone(columns)
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
      clearVal(type){
        if(type === 'custName'){
          this.formItem.drwrCustNo = '';
          this.formItem.drwrName = "";
        }else{
          this.formItem.drwrAcctNo = '';
        }
      },
      billInfoWinClose(){
        this.showBillInfoWin = false;
      },
      showBillInfo(billId){
        this.billId = billId;
        this.showBillInfoWin = true;
      },
      handleDateChange(value) {
        this.formItem.remitDt = value.replace(/-/g, "");
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
          this.formItem.drwrCustNo = '';
          this.formItem.drwrName = '';
          this.formItem.drwrAcctNo = '';
          this.formItem.acptProtocalNoLike = '';
          this.formItem.remitDt = '';
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
        if(this.formItem.drwrCustNo === "") {
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
      //主页面记账
      accountMain() {
        if(this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.batchId = this.currentSelectRow.id;
        this.billManagerFormItem.licenseFlag=this.licenseFlag;
        this.billManagerFormItem.ownedBrchNo=this.currentSelectRow.ownedBrchNo;
        this.billManagerFormItem.batchId = this.batchId;
        this.batchInfoParams.id = this.batchId;
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
        //集中授权参数赋值
        this.billManagerFormItem.licenseFlag=this.licenseFlag;
        this.billManagerFormItem.ownedBrchNo=ownedBrchNo;
        this.batchInfoParams.id = this.batchId;
        this.$refs.datagrid.tData = [];
        this.resetSearch();
        this.mainVue = false;
        this.billManagerVue = true;
        this.$nextTick(() => {
          this.billManagerColumns = deepClone(this.billTemp);
          this.$refs.billManagerDatagrid.createShowCol(this.billTemp);
          this.$refs.billManagerDatagrid.dataChange(this.$refs.billManagerDatagrid.pageInfo.pageNo);
        });
      },

      //退回按钮下拉选择“选择退回/批次退回”
      reBackList(str){
        if(str === "select"){
          this.reSelectBack();
        }
        if(str === "batch"){
          this.reBatchBack();
        }
      },
      //选择退回
      reSelectBack(){
        let list = this.$refs.billManagerDatagrid.tData;
        let ids = "";
        for (let i = 0, count = list.length; i < count; i++) {
          ids += list[i].id;
          if (i < list.length - 1) {
            ids += ",";
          }
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定批次退回吗?",
          onOk: () => {
            let funcNo = "PICE010302";
            let operType = "0"; //明细提交
            post({ids:ids,curFuncNo:funcNo,billOperType:operType}, "/ce/acpt/paper/account/cancelAcptAccountMain/func_accountBack").then(res => {
              if(res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this,{info:msg});
                  this.billManagerCurrentSelectList = [];
                  this.$refs.billManagerDatagrid.selects = [];
                  this.$refs.billManagerDatagrid.selectIds = [];
                  this.returnMain();
                } else {
                  this.$msgTip.error(this,{info:res.data.retMsg});
                  this.$refs.billManagerDatagrid.dataChange(this.$refs.billManagerDatagrid.pageInfo.pageNo);
                }
              }
            }).catch(error => {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
            });
          }
        });
      },
      //批次退回
      reBatchBack() {
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定批次退回吗？",
          onOk: () => {
            this.handleAcctBatchBack();
          }
        });
      },
      handleAcctBatchBack() {
        let operType = "1";
        let funcNo = "PICE010302";
        post({  batchId:this.batchId,billOperType:operType,curFuncNo:funcNo}, "/ce/acpt/paper/account/cancelAcptAccountMain/func_accountBack").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this,{info:msg});
              this.billManagerCurrentSelectList = [];
              this.$refs.billManagerDatagrid.selects = [];
              this.$refs.billManagerDatagrid.selectIds = [];
              this.returnMain();
            } else {
              this.$msgTip.error(this,{info:res.data.retMsg});
              this.$refs.billManagerDatagrid.dataChange(this.$refs.billManagerDatagrid.pageInfo.pageNo);
            }
          } else {
            this.$msgTip.error(this,{info:this.$t('m.i.common.netError')});
          }
        });
      },
      //票据管理子页面方法
      //表单查询
      billManagerHandleSearch() {
        this.$refs.billManagerDatagrid.selects = [];
        this.batchInfoParams.promNoteNoLike = this.billManagerFormItem.promNoteNoLike;
        this.$nextTick(() => {
          this.$refs.billManagerDatagrid.dataChange(1);
          this.$refs.acptBatchInfoDetail.getBatchInfo();
        })
      },
      //重置表单查询结果
      billManagerResetSearch() {
        this.$nextTick(() => {
          this.billManagerFormItem.promNoteNoLike = '';
        })
      },
      //记账
      accountDetail(str) {
        this.acctType = str;
        if(str === "batch") {
          this.batchAccount();
        }
        if(str === "select") {
          this.selectAccount();
        }
      },
      //批次记账
      batchAccount() {
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定批次记账吗?",
          onOk: () => {
            this.getEntryInfo("batch");
          }
        });
      },
      //选择记账
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
          content: "确定记账吗?",
          onOk: () => {
            this.getEntryInfo("select");
          }
        });
      },
      //获取分录信息
      getEntryInfo(str) {
        this.acctRecordUrl = "/ce/acpt/paper/account/acptAccountMain/func_generateAcctRecord";
        if(str === "batch") {
          this.acctRecordParam = {batchId: this.batchId, billOperType: "1",acctAuthFlag:"0",acctAuthBusiType:"01"}
        }else if(str === "select") {
          this.acctRecordParam = {batchId: this.batchId, billOperType: "0", ids: this.acctIds,acctAuthFlag:"0",acctAuthBusiType:"01"}
        }
        this.showAcctRecordWin = true;
      },
      //确定记账
      printSuccessCallback() {
          this.showAcctRecordWinClose();
      },
      //打印成功回调
      acctSubmitSure(info) {
        let param = {};
        this.acctType = "batch";
        if(this.acctType === "batch") {
          param = {batchId: this.batchId, billOperType: "1",licenseFlag:this.licenseFlag, isBack: "0",ownedBrchNo:this.billManagerFormItem.ownedBrchNo};
        }else if (this.acctType === "select") {
          param = {batchId: this.batchId, billOperType: "0",licenseFlag:this.licenseFlag, ids: this.acctIds, isBack: "0",ownedBrchNo:this.billManagerFormItem.ownedBrchNo};
        }
        this.acctSubmitFlag = true;
        post(param, "/ce/acpt/paper/account/acptAccountMain/func_submitAcptAccount").then(res => {
          this.acctSubmitFlag = false;
          if(res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              //组装打印票据明细
              this.contractPrinting(info.recordInfo, info.printDataList);
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
        this.$refs.billManagerDatagrid.selects = [];
        this.$refs.acptBatchInfoDetail.getBatchInfo();
        this.$refs.billManagerDatagrid.dataChange(1,(data)=>{
          if(data.length === 0) {
            this.returnMain();
          }
        })
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
      //组装打印票据明细
      contractPrinting(recordInfo, printDataList) {
        let flowNo = "";
        for(let item in Object.keys(recordInfo)) {
          if(recordInfo[Object.keys(recordInfo)[item]].length !== 0) {
            if(recordInfo[Object.keys(recordInfo)[item]][0].voucherType === 'PE030401') {
              flowNo = Object.keys(recordInfo)[item];
            }
          }
        }
        let listIds = '';
        if (flowNo !== "" && printDataList && printDataList.length > 0){
          listIds = printDataList[0].listId;
        }
        flowNo = listIds + "$$" + flowNo;
        if(flowNo !== "") {
          post({code: flowNo}, "/ce/acpt/paper/account/acptAccountMain/func_queryBillInfoListByFlowNo").then(res => {
            if (res) {
              let msg = res.data.retMsg;
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.getBillListTemplate(res.data.retData);
              } else {
                this.$msgTip.error(this, { info: msg });
              }
            }
          }).catch(error => {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
          });
        }
      },
      getBillListTemplate(billInfoList) {
        post({voucherType: 'PE030401'}, "/pe/print/printConf/printConfManger/queryPrintConfByVoucherType").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let billListJson = {};
              if (res.data.retData !== null) {
                if(res.data.retData.confContent !== undefined && res.data.retData.confContent !== null && res.data.retData.confContent !== "") {
                  billListJson = JSON.parse(res.data.retData.confContent);
                }
              }
              let billInfoListNext = this.assembleAcptBills(billInfoList,billListJson);
              this.$refs.showAcctRecord.getBillInfoList(billInfoListNext);
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      },
      //提交到记账授权
      acctAuthorize(){
        let param = {};
        if(this.acctType === "batch") {
          param = {batchId: this.batchId, billOperType: "1", funcNo: "PICE010302",acctType:"1"};
        }else if (this.acctType === "select") {
          param = {batchId: this.batchId, billOperType: "0", ids: this.acctIds, funcNo: "PICE010302",acctType:"1"};
        }
        this.acctSubmitFlag = true;
        post(param, "/ce/acpt/paper/account/acptAccountMain/func_addAcctAuthorize").then(res => {
          this.acctSubmitFlag = false;
          if(res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.showAcctRecordWinClose();
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      },
      assembleAcptBills(acptBillList,billListJson) {
        let bodyHtml = [];
        let bodyStr1 = "";
        let bodyStr2 = "";
        if(acptBillList !== null && Object.keys(billListJson).length !== 0) {
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
              bodyStr1 +=  "<td class='ta-c'>" + (1+i) + "</td>";
              for(let key in billListJson) {
                let temp = acptBillList[i][key] === null? '': acptBillList[i][key];
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
        if(Object.keys(billListJson).length !== 0) {
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
        }else {
          return "";
        }
      },
    }
  };
</script>

<style scoped>

</style>
