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
                    <h-option v-for="item in eAcptTypeList" v-if="item.key !='2'" :value="item.key" :key="item.key">{{item.value }}</h-option>
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
                      highlightRow
                      url="/ce/acpt/elec/sign/eAcptSignMain/func_queryPageAcptBatchAndBill"
                      :bindForm="formItem"
                      :on-current-change="handleRowClick"
                      :on-current-change-cancel="handleRowClickCancel"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="elecSign()" >{{$t('m.i.ce.sign')}}</h-button>
            </div>
          </h-datagrid>
        </div>
        <!-- 子页面 -->
        <div v-if="billManagerVue" key="2">
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix">
              <h-form :model="billManagerFormItem" :label-width="90" ref="billManagerFormItem" cols="4" class="h-form-search">
                <h-form-item prop="promNoteNoLike" :label="$t('m.i.ce.promNoteNo')" v-if="isShowPromNoteNo === '1'">
                  <h-input v-model="billManagerFormItem.promNoteNoLike" placeholder=""></h-input>
                </h-form-item>
                <h-form-item class="h-form-operate one-form" v-if="isShowPromNoteNo === '1'">
                  <h-button type="primary" @click="billManagerHandleSearch()">{{$t('m.i.common.search')}}</h-button>
                  <h-button type="ghost" @click="billManagerResetSearch()">{{$t('m.i.common.reset')}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
        </div>
        <e-acpt-batch-info-detail :is-show="billManagerVue" :params="batchInfoParams"
                                :batchUrl = "'/ce/acpt/elec/sign/eAcptSignMain/func_getAcptBatchByQueryDto'"
                                ref="acptBatchInfoDetail"></e-acpt-batch-info-detail>
        <!-- 数据展示表格 -->
        <div v-if="billManagerVue" key="3">
        <h-datagrid :columns="billManagerColumns"
                    url="/ce/acpt/elec/sign/eAcptSignMain/func_queryPageAcptBil"
                    highlightRow
                    :row-select="true"
                    :has-select="false"
                    :auto-load="false"
                    :bindForm="billManagerFormItem"
                    ref="billManagerDatagrid">
          <div slot="toolbar" class="pull-left">
            <h-dropdown placement="bottom-start" @on-click="sign">
              <h-button type="primary">{{$t('m.i.ce.sign')}}<h-icon name="unfold"></h-icon></h-button>
              <h-dropdown-menu slot="list">
                <h-dropdown-item name="batch">{{$t('m.i.ce.batchSign')}}</h-dropdown-item>
                <h-dropdown-item name="select">{{$t('m.i.ce.selectSign')}}</h-dropdown-item>
              </h-dropdown-menu>
            </h-dropdown>
            <h-button type="ghost" @click="returnMain" >{{$t('m.i.common.goBack')}}</h-button>
          </div>
        </h-datagrid>
        </div>
        <!-- 查询客户信息弹窗 -->
        <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose"
                           @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>
        <!-- 查询客户账号信息弹窗 -->
        <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" :cust-no="this.formItem.drwrCustNo"
                           @showCustAcctNoWinClose="showCustAcctNoWinClose" @custAcctNoSelectSubmit="custAcctNoSelectSubmit"></show-cust-acct-no>
        <!-- 票面 -->
        <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId" :billRangeStart="this.billRangeStart" :billRangeEnd="this.billRangeEnd"></bill-info-main>
        <!--保证金账号查询-->
        <show-deduct-acct @dueDeductAcctWinClose="dueDeductAcctWinClose" :dueDeductAcctWin="dueDeductAcctWin" :params="showParams"></show-deduct-acct>
      </h-col>
    </h-row>
    <!--<show-license-branch :showBranchWin="brchNoWin" title="机构查询" @brchNoChange="brchNoChange" :authPath="authPath"
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
    name: "eAcptSignMain",
    components: {
      ShowDeductAcct:()=>import(/* webpackChunkName: "ce/acpt/common/showDeductAcct" */`@/views/bizViews/ce/acpt/common/showDeductAcct`),
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
          title: this.$t("m.i.ce.acptType"),
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
         title: this.$t("m.i.billInfo.drwrName"),
          key: 'drwrName',
          sortable: true,
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.billInfo.drwrCustNo"),
          key: 'drwrCustNo',
          hiddenCol: false,
          sortable: true,
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
          title: this.$t("m.i.billInfo.billOrigin"),
          align:'center',
          hiddenCol: false,
          render:(h,params) => {
            let dictValue = getDictValueFromMap(this.dictMap,"BillOrigin",params.row.billOrigin);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t("m.i.billInfo.billPackageNo"),
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
                  this.showBillInfo(params.row);
                }
              }
            }, billNo);
          }
        },
        {
          title: this.$t("m.i.billInfo.billRange"),
          align:'center',
          key:"billRange",
          hiddenCol: false,
          render:(h,params) => {
            let billOrigin = params.row.billOrigin;
            let billRangeStart = params.row.billRangeStart;
            let billRangeEnd = params.row.billRangeEnd;
            return h("span", formatBillRange(billOrigin, billRangeStart, billRangeEnd));
          }
        },
        {
          title:  this.$t("m.i.billInfo.flowStatus"),
          key: 'flowStatusName',
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.billInfo.billPackageMoney"),
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
          title:  this.$t("m.i.ce.fee"),
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
          title:  this.$t("m.i.ce.commitFee"),
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
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.billInfo.acptName"),
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
          title: this.$t("m.i.ce.drwrAcctNo"),
          key: 'drwrAcctNo',
          hiddenCol: false,
        }
      ];
      return {
        // brchNoWin:false,
        licenseFlag:false,
        authPath: this.$route.path ,
        showBillInfoWin: false,
        isShowPromNoteNo:"",
        btnAuth:"",
        billId: "",
        billRangeStart:"",
        billRangeEnd:"",
        formItem: {
          drwrCustNo: '',
          drwrName: '',
          drwrAcctNo: '',
          acptProtocalNoLike: '',
          batchNoLike:'',
          remitDt: '',
          acptType: '',
          acptTypeNotEqual : '2',
          billClass: 'ME02',
          curFuncNo: 'PICE010216',
          authPath:this.$route.path,
          ownedBrchNos:"",
          ownedBrchNames:"",
        },
        billManagerFormItem: {
          promNoteNoLike: '',
          batchId: '',
          billClass: 'ME02',
          curFuncNo: 'PICE010216'
        },
        columns: columns,
        billManagerColumns: billManagerColumns,
        temp: deepClone(columns),
        billTemp: deepClone(billManagerColumns),
        batchInfoParams: {
          id: '',
          curFuncNo: 'PICE010216',
          promNoteNoLike: ""
        },
        batchId: "",
        acptTypeList: [],
        eAcptTypeList: [],
        billOriginList:[],
        dictMap: new Map(),
        currentSelectRow: [],
        billManagerCurrentSelectList: [],
        mainVue: true,
        billManagerVue: false,
        showCustMessageWin: false,
        showCustAcctNoWin: false,
        ifShowMore: false,
        //查询保证金账户信息
        dueDeductAcctWin: false,
        syncOperMode:"",
        queryUrl: "/pc/busiLock/func_getBusiLockParam",
        showParams: {
          listId:"",
        }
      }
    },
    mounted() {
      this.getSyncOperMode();
      this.buttonAuthShow();
      getDictListByGroups("AcptType,BillOrigin,EAcptType").then(res => {
        this.acptTypeList = res.get("AcptType");
        this.eAcptTypeList = res.get("EAcptType");
        this.billOriginList = res.get("BillOrigin");
        this.dictMap = res.get("map");
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
      /*//根据弹框所选数据进行赋值
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
      showBillInfo(row){
        this.billId = row.billId;
        this.billRangeStart = row.billRangeStart;
        this.billRangeEnd = row.billRangeEnd;
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
      //签收
      elecSign() {
        if(this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.batchId = this.currentSelectRow.id;
        this.billManagerFormItem.batchId = this.batchId;
        this.billManagerFormItem.licenseFlag=this.licenseFlag
        this.billManagerFormItem.ownedBrchNo=this.currentSelectRow.ownedBrchNo
        this.batchInfoParams.id = this.batchId;
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
        this.batchInfoParams.id = this.batchId;
        this.billManagerFormItem.licenseFlag=this.licenseFlag
        this.billManagerFormItem.ownedBrchNo=ownedBrchNo
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

      buttonAuthShow(){
        //按钮权限查询 控制按钮显隐
        let id = JSON.parse(window.sessionStorage.getItem("curMenu")).id;
        post({ authId: id }, "/sm/auth/buttonAuth/func_queryButtonByAuthId").then(res => {
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
            } else {
              this.$msgTip.error(this, { info: retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
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
          this.batchInfoParams.promNoteNoLike = '';
        })
      },
      //签收
      sign(str) {
        if(str === "batch") {
          this.signBatch();
        }
        if(str === "select") {
          this.signSelect();
        }
      },
      //批次签收
      signBatch() {
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定批次签收吗?",
          onOk: () => {
            post({batchId: this.batchId, billOperType: '1',licenseFlag:this.licenseFlag,ownedBrchNo:this.billManagerFormItem.ownedBrchNo}, "/ce/acpt/elec/sign/eAcptSignMain/func_submitAcptSign").then(res => {
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
      //选择签收
      signSelect() {
        if(this.$refs.billManagerDatagrid.selects.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        let list = this.$refs.billManagerDatagrid.selects;
        let transIds = "";
        for (let i = 0 ; i < list.length; i++) {
          transIds += list[i].transId;
          if (i < list.length - 1) {
            transIds += ",";
          }
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定签收吗?",
          onOk: () => {
            post({batchId: this.batchId, transIds: transIds, billOperType: '0',licenseFlag:this.licenseFlag,ownedBrchNo:this.billManagerFormItem.ownedBrchNo}, "/ce/acpt/elec/sign/eAcptSignMain/func_submitAcptSign").then(res => {
              if(res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
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
        this.billManagerResetSearch();
        this.$nextTick(() => {
          this.columns = deepClone(this.temp);
          this.$refs.datagrid.createShowCol(this.temp);
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
    }
  };
</script>

<style scoped>

</style>
