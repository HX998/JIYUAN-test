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
                      url="/pl/custody/elec/getBill/eGetBillCancelAccountMain/func_pageQueryGetBatchList"
                      :bindForm="formItem"
                      :on-select-change="handleRowClick"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="cancelAccountMain()">{{$t('m.i.pl.cancelAccountMain')}}</h-button>
            </div>
          </h-datagrid>
        </div>
        <!-- 子页面 -->
        <get-bill-batch-info-detail :is-show="billManagerVue" :params="batchInfoParams" ref="getBillBatchInfoDetail"
                                    batchInfoUrl="/pl/custody/elec/getBill/eGetBillCancelAccountMain/func_pageQueryGetBatchList"></get-bill-batch-info-detail>
        <!-- 数据展示表格 -->
        <div v-if="billManagerVue" key="2">
          <h-datagrid :columns="billManagerColumns"
                      url="/pl/custody/elec/getBill/eGetBillCancelAccountMain/func_pageQueryCancelAcctFlow"
                      :auto-load="false"
                      :row-select="true"
                      :bindForm="billManagerFormItem"
                      :has-select="hasSelect"
                      ref="billManagerDatagrid">
            <div slot="toolbar" class="pull-left">
              <h-dropdown placement="bottom-start" @on-click="cancelAccountDetail">
                <h-button type="primary">{{$t('m.i.pl.cancelAccountMain')}}<h-icon name="unfold"></h-icon></h-button>
                <h-dropdown-menu slot="list">
                  <h-dropdown-item name="batch">批次撤销记账</h-dropdown-item>
                  <h-dropdown-item name="select">选择撤销记账</h-dropdown-item>
                </h-dropdown-menu>
              </h-dropdown>
              <h-button type="primary" @click="billDetail" >{{$t('m.i.pl.billDetail')}}</h-button>
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
        <!-- 查看票据明细弹窗 -->
        <e-get-bill-show-bill-detail :bill-detail-win="billDetailWin" :batch-id="this.batchId" :batchParams="batchParams"
                                   :acctFlowIds="this.infoIds" bill-class="ME02" @billDetailWinClose="billDetailWinClose"
                                   billDetailUrl="/pl/custody/elec/getBill/eGetBillCancelAccountMain/func_pageQueryGetBillList"></e-get-bill-show-bill-detail>
        <!--显示流水明细界面-->
        <acct-flow-detail :acct-flow-detail-win="acctFlowDetailWin" :acctFlowParams="acctFlowParams" @acctFlowDetailClose="acctFlowDetailClose"></acct-flow-detail>
      </h-col>
    </h-row>
  </div>
</template>

<script>
  import { post, on, off, getDictListByGroups, getDictValueFromMap,formatNumber } from "@/api/bizApi/commonUtil";
  import {deepClone} from "@/utils/index";


  export default {
    name: "eGetBillCancelAccountMain",
    components: {
      AcctFlowDetail: () => import(/* webpackChunkName: "pl/custody/common/acctFlowDetail" */ '@/views/bizViews/pl/custody/common/acctFlowDetail'),
      EGetBillShowBillDetail: () => import(/* webpackChunkName: "pl/custody/common/getBillShowBillDetail" */ '@/views/bizViews/pl/custody/common/eGetBillShowBillDetail'),
      GetBillBatchInfoDetail: () => import(/* webpackChunkName: "pl/custody/common/getBillBatchInfoDetail" */ '@/views/bizViews/pl/custody/common/getBillBatchInfoDetail')
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
          title: this.$t("m.i.pl.getWay"),
          key: 'getWay',
          hiddenCol: false,
          render: (h, params) => {
            let list = getDictValueFromMap(this.dictMap, "GetWay", params.row.getWay);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
        {
          title: this.$t('m.i.common.createDt'),
          key: 'getBatchDt',
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            if (params.row.getBatchDt == null || params.row.getBatchDt === "") {
              return "";
            }
            let date = this.$moment(params.row.getBatchDt, "YYYY-MM-DD").format("YYYY-MM-DD");
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
          type: "index",
          key: "numOrder",
          title: this.$t("m.i.common.index"),
          width: 60,
          align: "center",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.foreFlowNo"),
          key: "frontFlowNo",
          ellipsis: false,
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            return h('div', [
              h('a', {
                on: {
                  click: () => {
                    this.showAcctFlowDetail(params.row.id)
                  }
                }
              }, params.row.frontFlowNo)
            ]);
          }
        },
        {
          title: this.$t("m.i.common.prodName"),
          key: "prodName",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title:  this.$t("m.i.common.sendAcctBrchNo"),
          key: "sendAcctBrchName",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.operTellerNo"),
          key: "operTellerNo",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.pc.accountBrch"),
          key: "acctBrchName",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.pl.acctTellerName"),
          key: "acctTellerNo",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.transDt"),
          key: 'acctDt',
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            if(params.row.acctDt == null || params.row.acctDt === ""){
              return "";
            }
            let date = this.$moment(params.row.acctDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
          title:  this.$t("m.i.common.transTm"),
          key: 'transTm',
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            if (params.row.transTm == null || params.row.transTm === "") {
              return "";
            }
            let transTm = params.row.transTm.toString();
            if (params.row.transTm.toString().length < 6) {
              for(let i=0; i<(6-params.row.transTm.toString().length); i++) {
                transTm = "0" + transTm;
              }
            }
            let date = this.$moment(transTm, "HH:mm:ss").format("HH:mm:ss");
            return h("span", date);
          }
        }
      ];
      return {
        formItem : {
          custNo: '',
          custAcctNo: '',
          billClass: 'ME02',
          curFuncNo: 'PIPL020603',
          acctBrchNo: this.$store.getters.userInfo.brchNo,
        },
        billManagerFormItem : {
          batchId: '',
          billClass: 'ME02',
        },
        columns : columns,
        billManagerColumns : billManagerColumns,
        temp : this.deepClone(columns),
        billTemp : this.deepClone(billManagerColumns),
        batchInfoParams : {
          id: '',
          curFuncNo: 'PIPL020603',
          billClass: 'ME02',
          acctDt: ''
        },
        dictMap : new Map(),
        batchId : "",
        infoIds : "",
        currentSelectRow : [],
        mainVue : true,
        billManagerVue : false,
        showCustAcctNoWin : false,
        showCustMessageWin : false,
        billDetailWin : false,

        //是否显示更多查询项
        ifShowMore : false,
        //前台流水号超链接
        acctFlowDetailWin : false,
        acctFlowParams : {},
        batchParams: {},
      };
    },
    mounted() {
      getDictListByGroups("CheckType,DraftTypeCode,GetWay,BillOrigin").then(res => {
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
      //撤销记账
      cancelAccountMain() {
        if(this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.batchId = this.currentSelectRow[0].id;
        this.billManagerFormItem.batchId = this.batchId;
        this.batchInfoParams.id = this.batchId;
        this.batchInfoParams.acctDt = this.$moment(window.sessionStorage.getItem("workDate")).format("YYYYMMDD");
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
        this.batchInfoParams.acctDt = this.$moment(window.sessionStorage.getItem("workDate")).format("YYYYMMDD");
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
      //撤销记账明细-前台流水号超链接
      showAcctFlowDetail(frontFlowNo) {
        this.acctFlowParams.foreFlowIds = frontFlowNo;
        this.acctFlowParams.acctFlowUrl = "/pc/acct/flow/queryAcctFlowPageByBatchIds";
        this.acctFlowDetailWin = true;
      },
      acctFlowDetailClose() {
        this.acctFlowParams = {};
        this.acctFlowDetailWin = false;
      },
      //明细页面
      //撤销记账
      cancelAccountDetail(str) {
        if(str === "batch") {
          this.batchCancelAccount();
        }
        if(str === "select") {
          this.selectCancelAccount();
        }
      },
      //批次撤销记账
      batchCancelAccount() {
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定批次撤销记账吗?",
          onOk: () => {
            post({batchId: this.batchId, operType: "1"}, "/pl/custody/elec/getBill/eGetBillCancelAccountMain/func_cancelBillAccount").then(res => {
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
      //选择撤销记账
      selectCancelAccount() {
        let list = this.$refs.billManagerDatagrid.selects;
        if(list.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        let ids = "";
        for (let i = 0, count = list.length; i < count; i++) {
          ids += list[i].id;
          if (i < list.length - 1) {
            ids += ",";
          }
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定撤销记账吗?",
          onOk: () => {
            post({batchId: this.batchId, operType: "0", acctFlowIds: ids}, "/pl/custody/elec/getBill/eGetBillCancelAccountMain/func_cancelBillAccount").then(res => {
              if(res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  if(this.$refs.billManagerDatagrid.total === list.length) {
                    this.returnMain();
                  }else {
                    this.$refs.getBillBatchInfoDetail.getBatchInfo();
                    this.$refs.billManagerDatagrid.dataChange(1);
                    this.$refs.billManagerDatagrid.selects = [];
                    this.$refs.billManagerDatagrid.selectIds = [];
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
      //票据明细弹窗
      billDetail() {
        let list = this.$refs.billManagerDatagrid.selects;
        if(list.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        let ids = "";
        for(let i=0; i<list.length; i++) {
          ids += list[i].id;
          if(i<list.length-1) {
            ids += ",";
          }
        }
        this.infoIds = ids;
        this.batchParams.dictMap = this.dictMap;
        this.billDetailWin = true;
      },
      //票据明细弹窗关闭
      billDetailWinClose() {
        this.billDetailWin = false;
      },
      //返回主页面
      returnMain() {
        this.$refs.billManagerDatagrid.tData = [];
        this.mainVue = true;
        this.billManagerVue = false;
        this.currentSelectRow = [];
        this.$nextTick(() => {
          this.columns = deepClone(this.temp);
          this.$refs.datagrid.createShowCol(this.temp);
        });
      },
    }
  };
</script>

<style scoped>

</style>
