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
                  v-if="licenseFlag" :showCheckBox="true" :brchNo.sync="formItem.ownedBrchNos" :brchName.sync="formItem.ownedBrchNames"
                  :params="{authPath:this.$route.path}"
                  url="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree"
                  queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
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
                <h-form-item prop="dueDt" :label="$t('m.i.billInfo.dueDt')">
                  <h-date-picker type="date" v-model="formItem.dueDt" placeholder="" @on-change="handleDateChange" :editable=false></h-date-picker>
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
                      url="/ce/acpt/dueDeduct/manualDeductResultSearch/func_pagingQueryDeductAcptBatchForSearch"
                      :bindForm="formItem"
                      :on-current-change="handleRowClick"
                      :on-current-change-cancel="handleRowClickCancel"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="billManager()">{{$t('m.i.ce.billManage')}}</h-button>
              <h-button type="primary" @click="deductResultQuery" >{{$t('m.i.ce.deductResultQuery')}}</h-button>
            </div>
          </h-datagrid>
        </div>
        <!-- 子页面 -->
        <div v-if="billManagerVue" key="2">
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix">
              <h-form :model="billManagerFormItem" :label-width="90" ref="billManagerFormItem" cols="4" class="h-form-search">
             <!--   <h-form-item prop="billNoLike" :label="$t('m.i.billInfo.billNo')">
                  <h-input v-model="billManagerFormItem.billNoLike" placeholder=""></h-input>
                </h-form-item>-->
                <common-select v-model="billManagerFormItem.billOrigin" :label="$t('m.i.billInfo.billOrigin')" prop="billOrigin"
                               :dictList="billOriginList"></common-select>
                <bill-no :label="$t('m.i.billInfo.billPackageNo')"  v-model="billManagerFormItem.reverseBillNo" prop="reverseBillNo"></bill-no>
                <bill-range :formItem="billManagerFormItem" :rangeProps="['minBillRangeStart','maxBillRangeEnd']" ></bill-range>
                <h-form-item class="h-form-operate one-form">
                  <h-button type="primary" @click="billManagerHandleSearch()">{{$t('m.i.common.search')}}</h-button>
                  <h-button type="ghost" @click="billManagerResetSearch()">{{$t('m.i.common.reset')}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
        </div>
        <acpt-batch-info-detail :is-show="billManagerVue" :params="batchInfoParams" url="/ce/acpt/dueDeduct/manualDeductResultSearch/func_pagingQueryDeductAcptBatchForSearch"
                                ref="acptBatchInfoDetail"></acpt-batch-info-detail>
        <!-- 数据展示表格 -->
        <div v-if="billManagerVue" key="3">
          <h-datagrid :columns="billManagerColumns"
                      url="/ce/acpt/dueDeduct/manualDeductResultSearch/func_pagingQueryDeductAcptBillForSearch"
                      :bindForm="billManagerFormItem"
                      highlightRow
                      :auto-load="false"
                      :onSelectChange="billManagerHandleSelectClick"
                      ref="billManagerDatagrid">
            <div slot="toolbar" class="pull-left">
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
  </div>
</template>

<script>
  import { post, on, off, getDictListByGroups, getDictValueFromMap, formatBillRange , formatNumber,accMul } from "@/api/bizApi/commonUtil";
  import {deepClone} from "@/utils/index";

  export default {
    name: "manualDeductResultSearch",
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
          title:  this.$t('m.i.billInfo.drwrCustNo'),
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
          type: 'index',
          key: 'numOrder',
          title: this.$t("m.i.common.index"),
          width: 60,
          align: 'center',
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.billInfo.billOrigin"),
          key: 'billOrigin',
          align:'center',
          hiddenCol: false,
          render:(h,params) => {
            let dictValue = (!params.row.billOrigin || params.row.billOrigin === 'CS00') ? '-' : this.getDictValueFromMap(this.dictMap, 'BillOrigin', params.row.billOrigin);
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
          title: this.$t('m.i.ce.promNoteNo'),
          key: 'promNoteNo',
          hiddenCol: false,
        },
        {
          title: this.$t('m.i.billInfo.flowStatus'),
          key: 'flowStatusName',
          hiddenCol: false,
          render:(h,params) => {
            if(params.row.deductStatus == null || params.row.deductStatus === ""){
              let flowStatusName = params.row.flowStatusName;
              return h("span", flowStatusName);
            }else {
              let name = "扣款已申请" + "(" + params.row.flowStatusName + ")";
              return h("span", name);
            }
          }
        },
        {
          title: this.$t('m.i.billInfo.billPackageMoney'),
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
        showBillInfoWin: false,
        billId: "",
        formItem: {
          drwrCustNo: '',
          drwrName: '',
          drwrAcctNo: '',
          acptProtocalNoLike: '',
          dueDt: '',
          deductApplFlag: '1',
          authPath:this.$route.path,
          ownedBrchNos:"",
          ownedBrchNames:"",
        },
        billManagerFormItem: {
          billNoLike: '',
          batchId: '',
          deductApplFlag: '1',
          billOrigin:"",
          reverseBillNo:"",
          minBillRangeStart:"",
          maxBillRangeEnd:""
        },
        columns: columns,
        billManagerColumns: billManagerColumns,
        temp: deepClone(columns),
        billTemp: deepClone(billManagerColumns),
        batchInfoParams: {
          batchId: '',
          billNoLike: "",
          deductApplFlag: '1',
          authPath:this.$route.path,
          ownedBrchNos:"",
        },
        batchId: "",
        currentSelectRow: null,
        billManagerCurrentSelectList: [],
        billOriginList : [],
        mainVue: true,
        billManagerVue: false,
        showCustAcctNoWin: false,
        showCustMessageWin: false,
        submitFlag: false,
        ifShowMore: false,
        //查询保证金账户信息
        dueDeductAcctWin: false,
        showParams: {
          listId:"",
        }
      }
    },
    mounted(){
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
      this.getDictListByGroups("BillOrigin").then(res => {
        this.billOriginList = res.get("BillOrigin");
        this.dictMap = res.get("map");
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
      showBillInfo(row){
        this.billId = row.billId;
        this.billRangeStart = row.billRangeStart;
        this.billRangeEnd = row.billRangeEnd;
        this.showBillInfoWin = true;
      },
      //扣款结果查询
      deductResultQuery() {
        post({}, "/ce/acpt/dueDeduct/manualDeductResultSearch/func_deductBatchFileQuery").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.handleSearch();
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      },
      handleDateChange(value) {
        this.formItem.dueDt = value.replace(/-/g, "");
      },
      //表单查询
      handleSearch() {
        this.currentSelectRow = null;
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
          this.formItem.dueDt = '';
          this.formItem.ownedBrchNos=""
          this.formItem.ownedBrchNames=""
        });
      },
      //行选中
      handleRowClick(arr) {
        this.currentSelectRow = arr;
      },
      handleRowClickCancel() {
        this.currentSelectRow = null;
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
        if(!this.currentSelectRow) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.batchId = this.currentSelectRow.id;
        this.billManagerFormItem.batchId = this.batchId;
        this.billManagerFormItem.dueDt = this.formItem.dueDt;
        this.batchInfoParams.batchId = this.batchId;
        this.batchInfoParams.dueDt = this.formItem.dueDt;
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


      //票据管理子页面方法
      //表单查询
      billManagerHandleSearch() {
        this.billManagerCurrentSelectList = [];
        this.batchInfoParams.billNoLike = this.billManagerFormItem.billNoLike;
        this.batchInfoParams.reverseBillNo = this.billManagerFormItem.reverseBillNo;
        this.batchInfoParams.minBillRangeStart = this.billManagerFormItem.minBillRangeStart;
        this.batchInfoParams.maxBillRangeEnd = this.billManagerFormItem.maxBillRangeEnd;
        this.batchInfoParams.billOrigin = this.billManagerFormItem.billOrigin;
        this.$nextTick(() => {
          this.$refs.billManagerDatagrid.dataChange(1);
          this.$refs.acptBatchInfoDetail.getBatchInfo();
        })
      },
      //重置表单查询结果
      billManagerResetSearch() {
        this.$nextTick(() => {
          this.billManagerFormItem.billNoLike = '';
          this.billManagerFormItem.reverseBillNo = "";
          this.billManagerFormItem.minBillRangeStart = "";
          this.billManagerFormItem.maxBillRangeEnd = "";
          this.billManagerFormItem.billOrigin = "";
          this.batchInfoParams.billNoLike = "";
          this.batchInfoParams.reverseBillNo = "";
          this.batchInfoParams.minBillRangeStart = "";
          this.batchInfoParams.maxBillRangeEnd = "";
          this.batchInfoParams.billOrigin = "";
        })
      },
      //行选中
      billManagerHandleSelectClick(arr) {
        this.billManagerCurrentSelectList = arr;
      },
      //返回主页面
      returnMain() {
        this.mainVue = true;
        this.billManagerVue = false;
        this.currentSelectRow = null;
        this.billManagerCurrentSelectList = [];
        this.billManagerResetSearch();
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
