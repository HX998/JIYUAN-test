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
                <h-form-item prop="acptProtocalNo" :label="$t('m.i.billInfo.ProtocalNo')">
                  <h-input v-model="formItem.acptProtocalNo" placeholder=""></h-input>
                </h-form-item>
                <h-form-item prop="remitDt":label="$t('m.i.billInfo.remitDt')">
                  <h-date-picker type="date" v-model="formItem.remitDt" placeholder="" @on-change="handleDateChange" :editable=false></h-date-picker>
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
                      url="/banks/szbank/ce/acpt/elec/acptFeeMistake/queryPageAcptFeeMistake/func_queryPageAcptFeeMistake"
                      :row-select="true"
                      :has-select="false"
                      :bindForm="formItem"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="account()" >{{$t('m.i.ce.account')}}</h-button>
              <h-button type="primary" @click="goBack()" >{{$t('m.i.ce.goBack')}}</h-button>
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
      </h-col>
    </h-row>
  </div>
</template>

<script>
import { post, on, off, getDictListByGroups, getDictValueFromMap,formatNumber,accMul } from "@/api/bizApi/commonUtil";
import {deepClone} from "@/utils/index";

export default {
  name: "feeMistakeMain",
  components: {
    ShowDeductAcct:()=>import(/* webpackChunkName: "ce/acpt/common/showDeductAcct" */`@/views/bizViews/ce/acpt/common/showDeductAcct`),
    // AcptBatchInfoDetail:()=>import(/* webpackChunkName: "ce/acpt/common/acptBatchInfoDetail" */`@/views/bizViews/ce/acpt/common/acptBatchInfoDetail`)
  },
  data() {
    let columns = [
      {
        type: 'selection',
        key: 'multiSelect',
        width: 60,
        hiddenCol: false,
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
        title: this.$t("m.i.billInfo.ProtocalNo"),
        key: 'acptProtocalNo',
        hiddenCol: false,
        sortable: true,
      },
      {
        title: this.$t('m.i.common.acctStatus'),
        key: "acctStatus",
        ellipsis: false,
        hiddenCol: false,
        render: (h, params) => {
          let acctStatus = "";
          if(params.row.acctStatus == "0"){
            acctStatus = "未记账";
          }
          if(params.row.acctStatus == "1"){
            acctStatus = "记账成功";
          }
          if(params.row.acctStatus == "2"){
            acctStatus = "记账失败";
          }
          return h("span", acctStatus);
        }
      },

      {
        title: this.$t("m.i.billInfo.drwrName"),
        key: 'drwrName',
        sortable: true,
        hiddenCol: false,
      },
      {
        title: this.$t("m.i.billInfo.drwrCustNo"),
        key: 'drwrCustNo',
        hiddenCol: false,
      },
      {
        title: this.$t("m.i.billInfo.drwrAcctNo"),
        key: 'drwrAcctNo',
        hiddenCol: false,
        sortable: true,
      },
      {
        title: this.$t("m.i.billInfo.drweBankName"),
        key: 'drweBankName',
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
        title: this.$t("m.i.ce.originTotalFee"),
        key: 'totalOriginFee',
        hiddenCol: false,
        render: (h, params) => {
          let totalOriginFee = formatNumber(params.row.totalOriginFee, 2, ',');
          return h("span", {
            domProps: {
              title: totalOriginFee
            }
          }, totalOriginFee);
        }
      },
      {
        title: this.$t("m.i.ce.newTotalFee"),
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
        title: this.$t("m.i.ce.originFeeRatePersent"),
        key: 'originFeeRatio',
        hiddenCol: false,
        render: (h, params) => {
          if(params.row.originFeeRatio != null && params.row.originFeeRatio !== ""){
            let rate = accMul(params.row.originFeeRatio, 100);
            rate = formatNumber(rate,4, '');
            return h("span", rate);
          }
        }
      },
      {
        title: this.$t("m.i.ce.newFeeRatePersent"),
        key: 'feeRatio',
        hiddenCol: false,
        render: (h, params) => {
          if(params.row.feeRatio != null && params.row.feeRatio !== ""){
            let rate = accMul(params.row.feeRatio, 100);
            rate = formatNumber(rate,4, '');
            return h("span", rate);
          }
        }
      },
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
        acptProtocalNo: '',
        remitDt: '',
        billClass: 'ME01',
        curFuncNo: 'PICE010302',
        authPath:this.$route.path,
        ownedBrchNos:"",
        ownedBrchNames:"",
      },
      billManagerFormItem: {
        promNoteNoLike: '',
        batchId: '',
        billClass: '',
        curFuncNo: ''
      },
      columns: columns,
      temp: deepClone(columns),

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
      showCustAcctNoWin: false,
      showCustMessageWin: false,
      ifShowMore: false,

      btnAuth:"",
      childrenBtnAuth:{},
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
  },
  methods: {
    //表单查询
    handleSearch() {
      this.$refs.datagrid.selects = [];
      this.$nextTick(() => {
        this.$refs.datagrid.dataChange(1);
      })
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

    //重置表单查询结果
    resetSearch() {
      this.$nextTick(() => {
        this.formItem.drwrCustNo = '';
        this.formItem.drwrName = '';
        this.formItem.drwrAcctNo = '';
        this.formItem.acptProtocalNo = '';
        this.formItem.remitDt = '';
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

    //记账
    account() {
      if(this.$refs.datagrid.selects.length === 0) {
        this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
        return;
      }
      let ids = "";
      let list = this.$refs.datagrid.selects;
      let flag=false;
      for(let i=0; i<list.length; i++) {
        ids += list[i].id;
        if(i < list.length - 1) {
          ids += ",";
        }
      }
      this.code = ids;
      this.$hMsgBox.confirm({
        title: this.$t("m.i.common.confirm"),
        content: "确定记账吗?",
        onOk: () => {
          this.getEntryInfo();
        }
      });
    },
    //退回公贷系统
    goBack() {
      if(this.$refs.datagrid.selects.length === 0) {
        this.$msgTip.info(this, { info: "请先选择需要处理的记录" });
        return;
      }
      if (this.$refs.datagrid.selects.length > 1) {
        this.$msgTip.info(this, { info: "最多选中一条记录"});
        return;
      }
      let batchId = this.$refs.datagrid.selects[0].id;

      this.$hMsgBox.confirm({
        title: this.$t("m.i.common.confirm"),
        content: "确定要退回公贷吗?",
        onOk: () => {
          post({id: batchId}, "banks/szbank/ce/acpt/elec/acptFeeMistake/func_reBackToCMS").then(res => {
            if(res) {
              let msg = res.data.retMsg;
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.$msgTip.success(this);
                this.$refs.datagrid.selects = [];
                this.$refs.datagrid.selectIds = [];
                this.$refs.datagrid.dataChange(1);
              } else {
                this.$msgTip.error(this, { info: msg });
              }
            }
          }).catch(error => {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
          });
        }
      });
    },
    //获取分录信息
    getEntryInfo() {
      this.acctRecordUrl = "banks/szbank/ce/acpt/elec/acptFeeMistake/queryPageAcptFeeMistake/func_generateAcctRecord";
      this.acctRecordParam = {code: this.code};
      this.showAcctRecordWin = true;
    },
    //确定记账
    acctSubmitSure(info) {
      this.acctSubmitFlag = true;
      post({code: this.code}, "banks/szbank/ce/acpt/elec/acptFeeMistake/queryPageAcptFeeMistake/func_acctAcptFeeMistake").then(res => {
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
  }
};
</script>

<style scoped>

</style>
