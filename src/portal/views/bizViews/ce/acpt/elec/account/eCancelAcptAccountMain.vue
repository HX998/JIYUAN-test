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
                <h-form-item prop="remitDt" :label="$t('m.i.billInfo.remitDt')">
                  <h-date-picker type="date" v-model="formItem.remitDt" placeholder="" @on-change="handleDateChange" :editable=false></h-date-picker>
                </h-form-item>
                <h-form-item prop="acptType" :label="$t('m.i.ce.acptType')">
                  <h-select v-model="formItem.acptType" placeholder="" showTitle>
                    <h-option v-for="item in eAcptTypeList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item prop="batchNoLike" :label="$t('m.i.common.batchNo')">
                  <h-input v-model="formItem.batchNoLike" placeholder=""></h-input>
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
                      url="/ce/acpt/elec/account/eCancelAcptAccountMain/func_queryPageAcptCancelAccountBatch"
                      :bindForm="formItem"
                      highlightRow
                      :on-current-change="handleRowClick"
                      :on-current-change-cancel="handleRowClickCancel"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="cancelAccount()" >{{$t('m.i.ce.cancelAccount')}}</h-button>
            </div>
          </h-datagrid>
        </div>
        <!-- 子页面 -->
        <e-acpt-batch-info-detail :is-show="billManagerVue" :params="batchInfoParams"
                                :batchUrl = "'/ce/acpt/elec/account/eCancelAcptAccountMain/func_getAcptBatchByQueryDto'"
                                ref="acptBatchInfoDetail"></e-acpt-batch-info-detail>
        <!-- 数据展示表格 -->
        <div v-if="billManagerVue" key="2">
          <h-datagrid :columns="billManagerColumns"
                      url="/ce/acpt/elec/account/eCancelAcptAccountMain/func_queryPageAcctFlow"
                      :auto-load="false"
                      highlightRow
                      :row-select="true"
                      :has-select="false"
                      :bindForm="billManagerFormItem"
                      ref="billManagerDatagrid">
            <div slot="toolbar" class="pull-left">
              <h-dropdown placement="bottom-start" @on-click="cancelAccountDetail">
                <h-button type="primary">{{$t('m.i.ce.cancelAccount')}}<h-icon name="unfold"></h-icon></h-button>
                <h-dropdown-menu slot="list">
                  <h-dropdown-item name="batch">{{$t('m.i.ce.batchCancelAccount')}}</h-dropdown-item>
                  <h-dropdown-item name="select">{{$t('m.i.ce.selectCancelAccount')}}</h-dropdown-item>
                </h-dropdown-menu>
              </h-dropdown>
              <h-button type="primary" @click="billDetail" >{{$t('m.i.ce.detailBill')}}</h-button>
              <h-button type="ghost" @click="returnMain" >{{$t('m.i.common.goBack')}}</h-button>
            </div>
          </h-datagrid>
        </div>
        <!--显示流水明细界面-->
        <h-msg-box v-model="acctFlowDetailWin" width="1000" :mask-closable="false" @on-close="acctFlowDetailClose" top="10"
                   class="h-form-search-layer" :maximize="true" @on-maximize="onMaximize">
          <p slot="header">
            <span>{{$t('m.i.ce.flowDetail')}}</span>
          </p>
          <h-datagrid
            :columns="acctFlowColumns"
            :url="acctFlowUrl"
            highlightRow
            :auto-load="false"
            :bindForm="acctFlowFormItem"
            :rowSelect="true"
            ref="acctFlowDatagrid">
            <div slot="toolbar" class="pull-left">
            </div>
          </h-datagrid>
          <div slot="footer">
            <h-button type="ghost" @click="acctFlowDetailClose">{{$t("m.i.common.close")}}</h-button>
          </div>
        </h-msg-box>

        <!-- 查询客户信息弹窗 -->
        <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose" @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>
        <!-- 查询客户账号信息弹窗 -->
        <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" :cust-no="this.formItem.drwrCustNo" @showCustAcctNoWinClose="showCustAcctNoWinClose" @custAcctNoSelectSubmit="custAcctNoSelectSubmit"></show-cust-acct-no>
        <!-- 查看票据明细弹窗 -->
        <show-bill-detail :bill-detail-win="billDetailWin" :batch-id="this.batchId" :acctFlowIds="this.infoIds" bill-class="ME02" @billDetailWinClose="billDetailWinClose" :licenseFlag="licenseFlag" :ownedBrchNo="ownedBrchNo" listUrl="/ce/acpt/elec/account/eCancelAcptAccountMain/func_queryPageAcptBil"></show-bill-detail>
      </h-col>
    </h-row>
    <cancel-acct-print :showCancelAcctPrintWin="showCancelAcctPrintWin" :frontFlowNos="frontFlowNo" @showCancelAcctPrintWinClose="showCancelAcctPrintWinClose"></cancel-acct-print>
    <!--<show-license-branch :showBranchWin="brchNoWin" title="机构查询" @brchNoChange="brchNoChange" :authPath="authPath"
                         @showBranchWinClose="brchNoWin = false" :ifcheck="true" :checkStrictly="true"></show-license-branch>-->
  </div>
</template>

<script>
import {formatNumber, formatTime, getDictListByGroups, getDictValueFromMap, post} from "@/api/bizApi/commonUtil";
import {deepClone} from "@/utils/index";

export default {
    name: "eCancelAcptAccountMain",
    components: {
      ShowBillDetail:()=>import(/* webpackChunkName: "ce/acpt/common/showBillDetail" */`@/views/bizViews/ce/acpt/common/showBillDetail`),
      // AcptBatchInfoDetail:()=>import(/* webpackChunkName: "ce/acpt/common/eAcptBatchInfoDetail" */`@/views/bizViews/ce/acpt/common/eAcptBatchInfoDetail`)
      // ShowLicenseBranch: () => import(/* webpackChunkName: "sm/auth/branch/showLicenseBranch" */`@/views/bizViews/sm/auth/branch/showLicenseBranch`),
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
          title: this.$t("m.i.common.batchNo"),
          key: 'batchNo',
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
                    this.batchNoMain(params.row.id,params.row.ownedBrchNo,params.row.lockUserNo)
                  }
                }
              }, params.row.batchNo)
            ]);
          }
        },
        {
          title: this.$t("m.i.billInfo.acptProtocalNo"),
          key: 'acptProtocalNo',
          hiddenCol: false,
          sortable: true,
        },
        {
          title: this.$t('m.i.ce.acptType'),
          key: 'acptType',
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let list = getDictValueFromMap(this.dictMap,"EAcptType",params.row.acptType);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
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
          sortable: true,
        },
        {
          title: this.$t('m.i.billInfo.drwrAcctNo'),
          key: 'drwrAcctNo',
          hiddenCol: false,
          sortable: true,
        },
        {
          title: this.$t('m.i.billInfo.drweBankName'),
          key: 'drweBankName',
          sortable: true,
          hiddenCol: false,
        },
        {
          title:  this.$t('m.i.billInfo.remitDt'),
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
          title: this.$t('m.i.ce.totalFee'),
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
        },
        {
          title: this.$t("m.i.ce.lockUserNo"),
          key: "lockUserNo",
          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.ce.lockBrchName"),
          key: "lockBrchName",
          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.ce.lockTm"),
          key: "lockTm",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            if (params.row.lockTm == null || params.row.lockTm === "" ||params.row.lockTm === 0) {
              return "";
            }
            let lockTm = formatTime(this,params.row.lockTm);
            return h("span", lockTm);
          }
        },
      ];
      let billManagerColumns = [
        {
          type: 'selection',
          key: 'multiSelect',
          width: 60,
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.ce.frontFlowNo"),
          key: 'frontFlowNo',
          hiddenCol: false,
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
          title: this.$t("m.i.common.backFlowNo"),
          key: 'backFlowNo',
          hiddenCol: false,
          render: (h, params) => {
            if (params.row.backFlowNo === null || params.row.backFlowNo === "") {
              return h('div', [
                h('a', {
                  on: {
                    click: () => {
                      this.showAcctFlowDetail(params.row.id)
                    }
                  }
                }, "查看明细")
              ]);
            }else {
              return h("span",
                {
                  domProps: {
                    title: params.row.backFlowNo
                  }
                }, params.row.backFlowNo);
            }
          }
        },
        {
          title: this.$t("m.i.common.prodNo"),
          key: 'prodNo',
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.common.prodName"),
          key: 'prodName',
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.ce.acctBrchNo"),
          key: 'acctBrchNo',
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.common.acctTellerNo"),
          key: 'acctTellerNo',
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.common.acctDt"),
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
          title: this.$t("m.i.common.transTm"),
          key: 'transTm',
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            if (params.row.transTm == null || params.row.transTm === "") {
              return "";
            }
            if (params.row.transTm.toString().length < 6) {
              let transTm = params.row.transTm + "";
              for(let i=0; i<(6-params.row.transTm.toString().length); i++) {
                transTm = "0" + transTm;
              }
              let date = this.$moment(transTm, "HH:mm:ss").format("HH:mm:ss");
              return h("span", date);
            }else{
              let date = this.$moment(params.row.transTm, "HH:mm:ss").format("HH:mm:ss");
              return h("span", date);
            }
          }
        }
      ];
      return {
        // brchNoWin:false,
        licenseFlag:false,
        authPath: this.$route.path ,
        ownedBrchNo:"",
        showCancelAcctPrintWin:false,
        frontFlowNo:[],
        cancelType:"",
        formItem: {
          drwrCustNo: '',
          drwrName: '',
          drwrAcctNo: '',
          acptProtocalNoLike: '',
          batchNoLike:'',
          remitDt: '',
          acptType: '',
          billClass: 'ME02',
          curFuncNo: 'PICE010303',
          authPath:this.$route.path,
          ownedBrchNos:"",
          ownedBrchNames:"",
        },
        billManagerFormItem: {
          batchId: '',
          billClass: 'ME02',
          curFuncNo: 'PICE010303'
        },
        viewDetailForm: {
          drwrCustNo: '',
          drwrName: '',
          drwrAcctNo: '',
          acptProtocalNo: '',
          remitDt: '',
          acptType: '',
          totalCount: '',
          totalAmt: '',
          totalFee: '',
          totalCommitFee: ''
        },
        columns: columns,
        billManagerColumns: billManagerColumns,
        acctFlowFormItem: {
          foreFlowIds: ""
        },
        acctFlowColumns: [
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
            key: "foreFlowNo",
            ellipsis: false,
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.backFlowNo"),
            key: "backFlowNo",
            ellipsis: false,
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.ce.rowType"),
            key: "rowType",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.rowType === "1") {
                return h("span", "是");
              }
              return h("span", "否");
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
            key: "sendAcctBrchNo",
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
            title: this.$t("m.i.common.accountBrchNo"),
            key: "accountBrchNo",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.acctTellerNo"),
            key: "acctTellerNo",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.acctDt"),
            key: "acctDt",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.acctDt == null || params.row.acctDt === "") {
                return "";
              }
              let date = this.$moment(params.row.acctDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.common.transTm"),
            key: "transTm",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.transTm == null || params.row.transTm === "") {
                return "";
              }
              let transTm = params.row.transTm.toString();
              if (params.row.transTm.toString().length < 6) {
                for (let i = 0; i < (6 - params.row.transTm.toString().length); i++) {
                  transTm = "0" + transTm;
                }
              }
              let date = this.$moment(transTm, "HH:mm:ss").format("HH:mm:ss");
              return h("span", date);
            }
          }
        ],
        temp: deepClone(columns),
        billTemp: deepClone(billManagerColumns),
        batchInfoParams: {
          id: '',
          acctDt: '',
          curFuncNo: 'PICE010303'
        },
        acptTypeList: [],
        billOriginList:[],
        eAcptTypeList:[],
        dictMap: new Map(),
        batchId: "",
        infoIds: "",
        currentSelectRow: [],
        billManagerCurrentSelectList: [],
        mainVue: true,
        billManagerVue: false,
        billDetailWin: false,
        showCustMessageWin: false,
        showCustAcctNoWin: false,
        acctFlowDetailWin: false,
        acctFlowUrl: "",
        syncOperMode:"",
        queryUrl: "/pc/busiLock/func_getBusiLockParam",
        //是否显示更多查询项
        ifShowMore: false,
        acctAuthMode:false,
      }
    },
    mounted() {
      this.getSyncOperMode();
      getDictListByGroups("AcptType,BillOrigin,EAcptType").then(res => {
        this.acptTypeList = res.get("AcptType");
        this.eAcptTypeList = res.get("EAcptType");
        this.billOriginList = res.get("BillOrigin");
        this.dictMap = res.get("map");
      });
      post({ code: "01" }, "pc/acct/authorize/judgeAcctAuthorizeBusi").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.acctAuthMode = res.data.retData;
          } else {
            this.$msgTip.error(this, { info: res.data.retMsg });
          }
        } else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });
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
     /* //根据弹框所选数据进行赋值
      brchNoChange(info) {
        let objs = [];
        if(info instanceof Array){
          objs = info;
        } else {
          objs[0] = info;
        }
        let brchNos = "";
        let brchNames = "";
        for(var i=0;i<objs.length; i++){
          brchNos += objs[i].id + ',';
          brchNames += objs[i].title + ',';
        }
        this.formItem.ownedBrchNos = brchNos.substring(0,brchNos.length - 1);
        this.formItem.ownedBrchNames = brchNames.substring(0,brchNames.length - 1);
        this.brchNoWin = false;
      },*/
      getSyncOperMode() {
        let url = this.queryUrl;
        post({},url).then(res => {
            if (res) {
              let msg = res.data.retMsg;
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.syncOperMode = res.data.retMsg;
                if (this.syncOperMode==='1') {
                  this.$refs.datagrid.controlColumnsHidden("lockUserNo", false);
                  this.$refs.datagrid.controlColumnsHidden("lockBrchName", false);
                  this.$refs.datagrid.controlColumnsHidden("lockTm", false);
                } else {
                  this.$refs.datagrid.controlColumnsHidden("lockUserNo", true);
                  this.$refs.datagrid.controlColumnsHidden("lockBrchName", true);
                  this.$refs.datagrid.controlColumnsHidden("lockTm", true);
                }
              } else {
                this.$msgTip.error(this, { info: msg });
              }
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            }
          }
        );
      },
      clearVal(type){
        if(type === 'custName'){
          this.formItem.drwrCustNo = '';
          this.formItem.drwrName = "";
        }else{
          this.formItem.drwrAcctNo = '';
        }
      },
      handleDateChange(value) {
        this.formItem.remitDt = value.replace(/-/g, "");
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
          this.formItem.acptProtocalNoLike = '';
          this.formItem.remitDt = '';
          this.formItem.acptType = '';
          this.formItem.ownedBrchNames = "";
          this.formItem.ownedBrchNos = "";
          this.formItem.batchNoLike = "";
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
      //撤销记账
      cancelAccount() {
        if(this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.batchId = this.currentSelectRow.id;
        this.ownedBrchNo=this.currentSelectRow.ownedBrchNo;
        this.billManagerFormItem.batchId = this.batchId;
        this.batchInfoParams.id = this.batchId;
        this.batchInfoParams.acctDt = this.$moment(window.sessionStorage.getItem("workDate")).format("YYYYMMDD");
        this.resetSearch();
        if (this.syncOperMode==='1') {
          let userNo = JSON.parse(window.sessionStorage.getItem("userInfo")).userNo;
          let lockUserNo = this.currentSelectRow.lockUserNo;
          if (lockUserNo!=="" && lockUserNo !==null && lockUserNo !== undefined) {
            if (lockUserNo !== userNo ) {
              this.$msgTip.info(this, { info: this.$t("m.i.ce.busiLockErrorMsg")+'['+lockUserNo+']'+this.$t("m.i.ce.busiLockErrorMsg1")});
              return;
            }
          }
          this.addOrDelBatchBusiLock(this.batchId,"add");
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
      //承兑协议编号超链接
      batchNoMain(str,ownedBrchNo,lockUserNo) {
        this.batchId = str;
        this.billManagerFormItem.batchId = this.batchId;
        this.ownedBrchNo=ownedBrchNo;
        this.batchInfoParams.id = this.batchId;
        this.batchInfoParams.acctDt = this.$moment(window.sessionStorage.getItem("workDate")).format("YYYYMMDD");
        this.resetSearch();
        if (this.syncOperMode==='1') {
          let userNo = JSON.parse(window.sessionStorage.getItem("userInfo")).userNo;
          if (lockUserNo!=="" && lockUserNo !==null && lockUserNo !== undefined) {
            if (lockUserNo !== userNo ) {
              this.$msgTip.info(this, { info: this.$t("m.i.ce.busiLockErrorMsg")+'['+lockUserNo+']'+this.$t("m.i.ce.busiLockErrorMsg1")});
              return;
            }
          }
          this.addOrDelBatchBusiLock(this.batchId,"add");
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



      //票据管理子页面方法
      //表单查询
      billManagerHandleSearch() {
        this.$refs.billManagerDatagrid.selects = [];
        this.$nextTick(() => {
          this.$refs.billManagerDatagrid.dataChange(1);
          this.$refs.acptBatchInfoDetail.getBatchInfo();
        })
      },
      //撤销记账
      cancelAccountDetail(str) {
        this.cancelType=str;
        if (this.acctAuthMode) {
          if(str === "batch") {
            this.batchAcctAuthorize();
          }
          if(str === "select") {
            this.selectAcctAuthorize();
          }
        } else {
          if(str === "batch") {
            this.batchCancelAccount();
          }
          if(str === "select") {
            this.selectCancelAccount();
          }
        }
      },
      //批次撤销记账
      batchCancelAccount() {
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定批次撤销记账吗?",
          onOk: () => {
            this.$loadingbox.open({
              title: "撤销记账中，请稍后..."
            });
            let obj=this.$refs.billManagerDatagrid.tData[0];
            post({batchId: this.batchId, billOperType: "1",licenseFlag:this.licenseFlag,ownedBrchNo:this.ownedBrchNo}, "/ce/acpt/elec/account/eCancelAcptAccountMain/func_cancelAccount").then(res => {
              if(res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode == "000000") {
                  this.$loadingbox.close();
                  if (obj.isPrint==="1") {
                    this.frontFlowNo = res.data.retData;
                    this.showCancelAcctPrintWin = true;
                  }else {
                    this.$msgTip.success(this);
                    this.returnMain();
                  }
                } else {
                  this.$loadingbox.close();
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
        if(this.$refs.billManagerDatagrid.selects.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
          return;
        }
        let list = this.$refs.billManagerDatagrid.selects;
        let ids = "";
        for (var i = 0, count = list.length; i < count; i++) {
          ids += list[i].id;
          if (i < list.length - 1) {
            ids += ",";
          }
        }
        let obj=list[0];
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定撤销记账吗?",
          onOk: () => {
            this.$loadingbox.open({
              title: "撤销记账中，请稍后..."
            });
            post({batchId: this.batchId, billOperType: "0", ids: ids,licenseFlag:this.licenseFlag,ownedBrchNo:this.ownedBrchNo}, "/ce/acpt/elec/account/eCancelAcptAccountMain/func_cancelAccount").then(res => {
              if(res) {
                let msg = res.data.retMsg
                let retCode = res.data.retCode
                if (retCode == "000000") {
                  this.$loadingbox.close();
                  if (obj.isPrint==="1") {
                    this.showCancelAcctPrintWin = true;
                    this.frontFlowNo = res.data.retData;
                  }else {
                    this.$msgTip.success(this);
                    if(this.$refs.billManagerDatagrid.total === this.$refs.billManagerDatagrid.selects.length) {
                      this.returnMain();
                    }else {
                      this.$refs.acptBatchInfoDetail.getBatchInfo();
                      this.$refs.billManagerDatagrid.dataChange(this.$refs.billManagerDatagrid.$refs.gridPage.currentPage);
                      this.$refs.billManagerDatagrid.selects = [];
                    }
                  }
                } else {
                  this.$loadingbox.close();
                  this.$msgTip.error(this, { info: msg });
                }
              }
            }).catch(error => {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
            });
          }
        });
      },
      //批次提交到记账授权
      batchAcctAuthorize(){
        let param = {};
        param = {batchId: this.batchId, billOperType: "1", funcNo: "PICE010303",acctType:"2"};
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定批次提交记账授权吗?",
          onOk: () => {
            this.$loadingbox.open({
              title: "记账授权中，请稍后..."
            });
            post(param, "/ce/acpt/elec/account/eAcptAccountMain/func_addAcctAuthorize").then(res => {
              if(res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$loadingbox.close();
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
      //明细提交到记账授权
      selectAcctAuthorize(){
        let param = {};
        let list = this.$refs.billManagerDatagrid.selects;
        if(list.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
          return;
        }
        let ids = "";
        for (var i = 0, count = list.length; i < count; i++) {
          ids += list[i].id;
          if (i < list.length - 1) {
            ids += ",";
          }
        }
        param = {batchId: this.batchId, billOperType: "0", ids: ids, funcNo: "PICE010303",acctType:"2"};
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定明细记账授权吗?",
          onOk: () => {
            this.$loadingbox.open({
              title: "记账授权中，请稍后..."
            });
            post(param, "/ce/acpt/elec/account/eAcptAccountMain/func_addAcctAuthorize").then(res => {
              if(res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$loadingbox.close();
                  this.$msgTip.success(this);
                  if(this.$refs.billManagerDatagrid.total === this.$refs.billManagerDatagrid.selects.length) {
                    this.returnMain();
                  }else {
                    this.$refs.acptBatchInfoDetail.getBatchInfo();
                    this.$refs.billManagerDatagrid.dataChange(this.$refs.billManagerDatagrid.$refs.gridPage.currentPage);
                    this.$refs.billManagerDatagrid.selects = [];
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
      showCancelAcctPrintWinClose(){
        this.showCancelAcctPrintWin=false;
        this.$msgTip.success(this);
        if (this.cancelType==="select") {
          if(this.$refs.billManagerDatagrid.total === this.$refs.billManagerDatagrid.selects.length) {
            this.returnMain();
          }else {
            this.$refs.acptBatchInfoDetail.getBatchInfo();
            this.$refs.billManagerDatagrid.dataChange(this.$refs.billManagerDatagrid.$refs.gridPage.currentPage);
            this.$refs.billManagerDatagrid.selects = [];
          }
        }
        if (this.cancelType==="batch") {
          this.returnMain();
        }
      },
      //票据明细弹窗
      billDetail() {
        if(this.$refs.billManagerDatagrid.selects.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
          return;
        }
        let ids = "";
        let list = this.$refs.billManagerDatagrid.selects;
        for(let i=0; i<list.length; i++) {
          ids += list[i].id;
          if(i<list.length-1) {
            ids += ",";
          }
        }
        this.infoIds = ids;
        this.billDetailWin = true;
      },
      //票据明细弹窗关闭
      billDetailWinClose() {
        this.billDetailWin = false;
      },
      //返回主页面
      returnMain() {
        this.mainVue = true;
        this.billManagerVue = false;
        if (this.syncOperMode==='1') {
          this.addOrDelBatchBusiLock(this.batchId,"delete");
        }
        this.currentSelectRow = [];
        this.$refs.billManagerDatagrid.selects = [];
        this.getSyncOperMode();
        this.handleSearch();
        this.$nextTick(() => {
          this.columns = deepClone(this.temp);
          this.$refs.datagrid.createShowCol(this.temp);
        });
      },
      showAcctFlowDetail(frontFlowNo) {
        this.acctFlowFormItem.foreFlowIds = frontFlowNo;
        this.acctFlowUrl =  "/pc/acct/flow/queryAcctFlowPageByBatchIds";
        this.acctFlowDetailWin = true;
        this.$nextTick(() => {
          if (this.$refs.acctFlowDatagrid != null) {
            this.$refs.acctFlowDatagrid.dataChange(1);
          }
        });
      },

      addOrDelBatchBusiLock(id,type) {
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
                  this.$msgTip.error(this, { info: res.data.retMsg });
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
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          } else {
            post({ id: id, lockType: "1" }, "/ce/acpt/elec/apply/eAcptApplyMain/func_deleteBatchBusiLock").then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode !== "000000") {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
        }
      },
      acctFlowDetailClose() {
        this.acctFlowDetailWin = false;
      },
      onMaximize() {
        setTimeout(() => {
          this.$refs.acctFlowDatagrid.$refs.gridContent.handleResize();
        }, 100);
      },
    }
  };
</script>

<style scoped>

</style>
