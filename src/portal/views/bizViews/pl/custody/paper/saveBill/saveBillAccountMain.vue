<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <!-- 主页面 -->
        <div v-if="mainVue" key="1">
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item prop="custNo" :label="$t('m.i.common.custNo')">
                  <h-input v-model="formItem.custNo" placeholder="" icon="android-search" @on-click="queryCustName()" readonly
                           clearable @on-clear="clearVal('custName')"></h-input>
                </h-form-item>
                <h-form-item prop="custAcctNo" :label="$t('m.i.common.custAcctNo')">
                  <h-input v-model="formItem.custAcctNo" placeholder="" icon="android-search" @on-click="queryCustAcctNo()" readonly
                           clearable @on-clear="clearVal('custAcctNo')"></h-input>
                </h-form-item>
                <h-form-item class="h-form-operate two-form">
                  <h-button type="primary" @click="handleSearch()">{{$t('m.i.common.search')}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t('m.i.common.reset')}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid :columns="columns"
                      highlightRow
                      url="/pl/custody/paper/saveBill/saveBillAccountMain/func_pageQuerySaveBatchList"
                      :bindForm="formItem"
                      :on-select-change="handleRowClick"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="billManager()">{{$t('m.i.pl.billManager')}}</h-button>
            </div>
          </h-datagrid>
        </div>
        <!-- 子页面 -->
        <save-bill-batch-info-detail  :is-show="billManagerVue" :params="batchInfoParams" ref="saveBillBatchInfoDetail"
                                      batchInfoUrl="/pl/custody/paper/saveBill/saveBillAccountMain/func_pageQuerySaveBatchList"></save-bill-batch-info-detail>
        <!-- 数据展示表格 -->
        <div v-if="billManagerVue" key="2">
          <h-datagrid :columns="billManagerColumns"
                      url="/pl/custody/paper/saveBill/saveBillAccountMain/func_pageQuerySaveBillList"
                      :auto-load="false"
                      :row-select="true"
                      :bindForm="billManagerFormItem"
                      :has-select="hasSelect"
                      ref="billManagerDatagrid">
            <div slot="toolbar" class="pull-left">
              <h-dropdown placement="bottom-start" @on-click="accountDetail">
                <h-button type="primary">{{$t('m.i.pl.balance')}}<h-icon name="unfold"></h-icon></h-button>
                <h-dropdown-menu slot="list">
                  <h-dropdown-item name="select">选择记账</h-dropdown-item>
                  <h-dropdown-item name="batch">批次记账</h-dropdown-item>
                </h-dropdown-menu>
              </h-dropdown>
              <h-dropdown placement="bottom-start" @on-click="backDetail">
                <h-button type="primary">{{$t('m.i.pl.balanceReturn')}}<h-icon name="unfold"></h-icon></h-button>
                <h-dropdown-menu slot="list">
                  <h-dropdown-item name="select">选择退回</h-dropdown-item>
                  <h-dropdown-item name="batch">批次退回</h-dropdown-item>
                </h-dropdown-menu>
              </h-dropdown>
              <h-button type="ghost" @click="returnMain" >{{$t('m.i.pl.return')}}</h-button>
            </div>
          </h-datagrid>
        </div>
        <!-- 查询客户信息弹窗 -->
        <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose"
                           @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>
        <!-- 查询客户账号信息弹窗 -->
        <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" :cust-no="this.formItem.custNo"
                           @showCustAcctNoWinClose="showCustAcctNoWinClose" @custAcctNoSelectSubmit="custAcctNoSelectSubmit"></show-cust-acct-no>
        <!-- 分录弹框 -->
        <acct-record :param="this.acctRecordParam" :url="this.acctRecordUrl" :submitFlag="this.acctSubmitFlag" :showPrintButton="this.showPrintButton"
                          :show-acct-record-win="this.showAcctRecordWin" @acctSubmitSure="acctSubmitSure" @showAcctRecordWinClose="showAcctRecordWinClose"
                          @printSuccessCallback="printSuccessCallback" ref="showAcctRecord"></acct-record>
        <!--票面信息-->
        <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin"
                        :billId="this.billId" :billNo="this.billNo"></bill-info-main>
      </h-col>
    </h-row>
  </div>
</template>

<script>
  import { post, on, off, getDictListByGroups, getDictValueFromMap,formatNumber } from "@/api/bizApi/commonUtil";
  import {deepClone} from "@/utils/index";

  export default {
    name: "saveBillAccountMain",
    components: {

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
          type: 'selection',
          key: 'multiSelect',
          width: 60,
          hiddenCol: true,
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
          title: this.$t("m.i.common.batchNo"),
          key: 'batchNo',
          hiddenCol: false,
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
                    this.billManageNoMain(params.row.id)
                  }
                }
              }, params.row.batchNo)
            ]);
          }
        },
        {
          title: this.$t("m.i.common.custName"),
          key: 'custName',
          sortable: true,
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.common.custNo"),
          key: 'custNo',
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.common.custAcctNo"),
          key: 'custAcctNo',
          hiddenCol: false,
          sortable: true,
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
          title: this.$t("m.i.pl.checkType"),
          key: 'checkType',
          hiddenCol: false,
          render: (h, params) => {
            let list = getDictValueFromMap(this.dictMap, "CheckType", params.row.checkType);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
        {
          title: this.$t("m.i.pl.saveBrchName"),
          key: 'saveBrchName',
          sortable: true,
          hiddenCol: false,
        },
        {
          title: this.$t('m.i.common.createDt'),
          key: 'saveBatchDt',
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            if (params.row.saveBatchDt == null || params.row.saveBatchDt === "") {
              return "";
            }
            let date = this.$moment(params.row.saveBatchDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
          title: this.$t('m.i.common.createTime'),
          key: 'createTime',
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            if (params.row.createTime == null || params.row.createTime === "") {
              return "";
            }
            let createTime = params.row.createTime.toString().substring(8,14);
            let date = this.$moment(createTime, "HH:mm:ss").format("HH:mm:ss");
            return h("span", date);
          }
        },
        {
          title: this.$t("m.i.pe.totalAmt"),
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
        },
        {
          title: this.$t("m.i.pe.total"),
          key: 'totalCount',
          hiddenCol: false,
        }
      ];
      let billManagerColumns = [
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
          title: this.$t("m.i.billInfo.billNo"),
          key: 'billNo',
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
          key: 'flowStatusName',
          hiddenCol: false,
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
          title: this.$t("m.i.billInfo.drwrName"),
          key: 'drwrName',
          sortable: true,
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.billInfo.pyeeName"),
          key: 'pyeeName',
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
          title: this.$t("m.i.billInfo.acptProtocalNo"),
          key: 'acptProtocalNo',
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.billInfo.drweBankAddr"),
          key: 'drweBankAddr',
          hiddenCol: false,
        }
      ];
      return {
        showBillInfoWin : false,
        billId : "",
        billNo : "",
        formItem : {
          custNo: '',
          custAcctNo: '',
          billClass: 'ME01',
          curFuncNo: 'PIPL020301',
          acctBrchNo: this.$store.getters.userInfo.brchNo,
        },
        billManagerFormItem : {
          batchId: '',
          billClass: 'ME01',
          curFuncNo: 'PIPL020301'
        },
        columns : columns,
        billManagerColumns : billManagerColumns,
        temp : this.deepClone(columns),
        billTemp : this.deepClone(billManagerColumns),
        batchInfoParams : {
          id: '',
          billClass: 'ME01',
          curFuncNo: 'PIPL020301',
        },
        acctType : "",
        dictMap : new Map(),
        batchId : "",
        currentSelectRow : [],
        mainVue : true,
        billManagerVue : false,
        showCustAcctNoWin : false,
        showCustMessageWin : false,
        //是否显示更多查询项
        ifShowMore : false,
        hasSelect : false,
        submitFlag : false,
        //分录
        showPrintButton : false,
        acctSubmitFlag : false,
        showAcctRecordWin : false,
        acctRecordParam : {},
        acctRecordUrl : "",
      };
    },
    mounted() {
      getDictListByGroups("CheckType,DraftTypeCode").then(res => {
        this.dictMap = res.get("map");
      });
    },
    methods: {
      clearVal(type){
        if(type === 'custName'){
          this.formItem.custNo = '';
        }else{
          this.formItem.custAcctNo = '';
        }
      },
      billInfoWinClose() {
        this.showBillInfoWin = false;
      },
      showBillInfo(info, type) {
        this.billId = "";
        this.billNo = "";
        if (type === "billId") {
          this.billId = info;
        } else {
          this.billNo = info;
        }
        this.showBillInfoWin = true;
      },
      //批次页面
      //表单查询
      handleSearch() {
        this.currentSelectRow = [];
        this.$nextTick(() => {
          this.$refs.datagrid.dataChange(1);
        });
      },
      //重置表单查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
      },
      //行选中
      handleRowClick(arr) {
        this.currentSelectRow = arr;
      },
      //查询客户信息
      //触发弹窗
      queryCustName() {
        this.showCustMessageWin = true;
      },
      //赋值
      custCorpSelectSubmit(info) {
        this.formItem.custAcctNo = "";
        this.formItem.custNo = info.custNo;
        if (info.custAcctNo !== "") {
          this.formItem.custAcctNo = info.custAcctNo;
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
        if (this.formItem.custNo === "") {
          this.$msgTip.info(this, { info: "请先选择客户" });
          return;
        }
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
      //记账管理
      billManager() {
        if(this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.batchId = this.currentSelectRow[0].id;
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
      //批次编号超链接
      billManageNoMain(id) {
        this.batchId = id;
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


      //明细页面
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
        if (list.length === 0) {
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
        this.acctRecordUrl = "/pl/custody/paper/saveBill/saveBillAccountMain/func_getSaveBillAcctRecord";
        if(str === "batch") {
          this.acctRecordParam = {batchId: this.batchId, operType: "1"}
        }else if(str === "select") {
          this.acctRecordParam = {batchId: this.batchId, operType: "0", ids: this.acctIds}
        }
        this.showAcctRecordWin = true;
      },
      //确定记账
      acctSubmitSure(info) {
        let param = {};
        if(this.acctType === "batch") {
          param = {batchId: this.batchId, operType: "1"};
        }else if (this.acctType === "select") {
          param = {batchId: this.batchId, operType: "0", ids: this.acctIds};
        }
        this.acctSubmitFlag = true;
        post(param, "/pl/custody/paper/saveBill/saveBillAccountMain/func_saveBillAccount").then(res => {
          this.acctSubmitFlag = false;
          if(res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              //组装打印票据明细
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
        this.$refs.saveBillBatchInfoDetail.getBatchInfo();
        this.$refs.billManagerDatagrid.selects = [];
        this.$refs.billManagerDatagrid.selectIds = [];
        this.$refs.billManagerDatagrid.dataChange(1,(data)=>{
          if(data.length === 0) {
            this.returnMain();
          }
        })
      },

      //退回
      backDetail(str) {
        if(str === "batch") {
          this.batchBack();
        }
        if(str === "select") {
          this.selectBack();
        }
      },
      //批次退回
      batchBack() {
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定批次退回吗?",
          onOk: () => {
            post({batchId: this.batchId, operType: "1"}, "/pl/custody/paper/saveBill/saveBillAccountMain/func_saveBillAccountBack").then(res => {
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
          }
        });
      },
      //选择退回
      selectBack() {
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
          content: "确定退回吗?",
          onOk: () => {
            post({batchId: this.batchId, operType: "0", ids: this.acctIds}, "/pl/custody/paper/saveBill/saveBillAccountMain/func_saveBillAccountBack").then(res => {
              if(res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  if(this.$refs.billManagerDatagrid.total === this.$refs.billManagerDatagrid.selects.length) {
                    this.$refs.billManagerDatagrid.selects = [];
                    this.$refs.billManagerDatagrid.selectIds = [];
                    this.returnMain();
                  }else {
                    this.$refs.billManagerDatagrid.dataChange(1);
                    this.$refs.billManagerDatagrid.selects = [];
                    this.$refs.billManagerDatagrid.selectIds = [];
                    this.$refs.saveBillBatchInfoDetail.getBatchInfo();
                  }
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
      //返回
      returnMain() {
        this.mainVue = true;
        this.billManagerVue = false;
        this.currentSelectRow = [];
        this.$nextTick(() => {
          this.columns = deepClone(this.temp);
          this.$refs.datagrid.createShowCol(this.temp);
        });
      }
    }
  };
</script>

<style scoped>

</style>
