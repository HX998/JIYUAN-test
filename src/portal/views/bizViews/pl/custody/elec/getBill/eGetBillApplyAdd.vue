<template>
  <div>
    <h-msg-box v-model="tempGetBillAddOrEditWin" :maximize="true" @on-close="handleClose"
               width="1000" class="h-form-search-layer" top="10">
      <p slot="header">
        <span v-if="batchParams.batchType==='add'">新增申请</span>
        <span v-else-if="batchParams.batchType==='modify' && batchParams.isCommit === 'noCommit'">修改申请</span>
        <span v-else-if="batchParams.batchType==='modify' && batchParams.isCommit === 'hasCommit'">撤销申请</span>
      </p>
      <div>
        <h-form :model="addOrEditForm" :label-width="115" ref="addOrEditForm" cols="3" class="h-form-search">
          <div>
            <h-form-item prop="agreementNo" :label="$t('m.i.pl.agreementNo')" required>
              <h-input v-model="addOrEditForm.agreementNo" placeholder=""  icon="android-search" @on-click="queryAgreementNo()" readonly></h-input>
            </h-form-item>
            <h-form-item prop="custName" :label="$t('m.i.common.custName')" required>
              <h-input v-model="addOrEditForm.custName" placeholder="" readonly></h-input>
            </h-form-item>
            <h-form-item prop="custNo" :label="$t('m.i.common.custNo')" required>
              <h-input v-model="addOrEditForm.custNo" placeholder="" readonly></h-input>
            </h-form-item>
            <h-form-item prop="custAcctNo" :label="$t('m.i.common.custAcctNo')" required>
              <h-input v-model="addOrEditForm.custAcctNo" placeholder="" readonly></h-input>
            </h-form-item>
            <h-form-item prop="billType" :label="$t('m.i.billInfo.billType')" required>
              <h-select v-model="addOrEditForm.billType"  placeholder="" >
                <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{item.value }}</h-option>
              </h-select>
            </h-form-item>
            <h-form-item prop="getBatchDt" :label="$t('m.i.common.createDt')" required>
              <h-date-picker type="date" v-model="addOrEditForm.getBatchDt" placeholder="" @on-change="handleGetBatchDtChange" :editable=false></h-date-picker>
            </h-form-item>
            <h-form-item prop="getWay" :label="$t('m.i.pl.getWay')" required>
              <h-select v-model="addOrEditForm.getWay"  placeholder="" >
                <h-option v-for="item in getWayList" :value="item.key" :key="item.key">{{item.value }}</h-option>
              </h-select>
            </h-form-item>
            <show-branch v-show="false" v-model="addOrEditForm.saveBrchNo" :label="$t('m.i.pl.saveBrchName')" prop="saveBrchNo" required title="机构名称"
                         :brchNo.sync="addOrEditForm.saveBrchNo" :brchName.sync="addOrEditForm.saveBrchName" :showIcon="false"
                         :readonly="true"
                         :filterable="true" :showCheckBox="false" :msgBoxWin="tempGetBillAddOrEditWin">
            </show-branch>
          </div>
        </h-form>
        <div style="text-align: right">
          <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
          <h-button type="primary" v-else @click="formSave()" v-show="this.batchParams.isCommit === 'noCommit'" >{{$t("m.i.common.save")}}</h-button>
        </div>
        <h-form :model="addSumForm" :label-width="115" ref="addSumForm" cols="3" class="h-form-search">
          <div>
            <h-form-item :label="$t('m.i.pe.total')" prop="totalCount">
              <h-input  v-model="addSumForm.totalCount" disabled></h-input>
            </h-form-item>
            <h-form-item :label="$t('m.i.pe.totalAmt')" prop="totalAmt">
              <h-input  v-model="addSumForm.totalAmt" disabled></h-input>
            </h-form-item>
          </div>
        </h-form>
        <!--数据展示表格-->
        <h-datagrid
          :columns="columns"
          :auto-load="false"
          url="/pl/custody/elec/getBill/eGetBillApplyMain/func_pageQueryGetBillList"
          :bindForm="formItem"
          :rowSelect="true"
          :has-select="hasSelect"
          ref="datagrid">
          <div slot="toolbar" class="pull-left">
            <h-button type="primary" v-if="this.batchParams.isCommit === 'noCommit'" @click="pickBillWinOpen">{{$t("m.i.pl.pickBill")}}</h-button>
            <h-button type="primary" v-if="this.batchParams.isCommit === 'noCommit' && this.batchParams.showEbankPickBill=== '1'" @click="pickBillByEbankWinOpen">{{$t("m.i.pl.pickBillByEbank")}}</h-button>
            <h-dropdown placement="bottom-start" @on-click="deleteBillDetail" v-if="this.batchParams.isCommit === 'noCommit'">
              <h-button type="primary">{{$t("m.i.common.delete")}}<h-icon name="unfold"></h-icon></h-button>
              <h-dropdown-menu slot="list">
                <h-dropdown-item name="select">选择删除</h-dropdown-item>
                <h-dropdown-item name="batch">批次删除</h-dropdown-item>
              </h-dropdown-menu>
            </h-dropdown>
            <h-dropdown placement="bottom-start" @on-click="submit" v-if="this.batchParams.isCommit === 'noCommit'">
              <h-button type="primary">{{$t("m.i.common.submit")}}
                <h-icon name="unfold"></h-icon>
              </h-button>
              <h-dropdown-menu slot="list">
                <h-dropdown-item name="select">选择提交</h-dropdown-item>
                <h-dropdown-item name="batch">批次提交</h-dropdown-item>
              </h-dropdown-menu>
            </h-dropdown>
            <h-button type="primary" v-if="this.batchParams.isCommit === 'noCommit'" @click="exportBillExcel">{{$t("m.i.pe.batchExport")}}</h-button>
            <h-button type="primary" v-if="this.batchParams.isCommit === 'noCommit'" @click="confirmPrint">{{$t("m.i.pl.confirmPrint")}}</h-button>
            <h-button type="primary" v-if="this.batchParams.isCommit === 'hasCommit'" @click="infoCancel">{{$t("m.i.common.cancelCheckAuth")}}</h-button>
          </div>
        </h-datagrid>
      </div>
      <div slot="footer">
      </div>
    </h-msg-box>
    <!-- 查询客户信息弹窗 -->
    <show-sign-agreement :signAgreementWin="signAgreementWin" @signAgreementWinClose="signAgreementWinClose"
                         @signAgreementSubmit="signAgreementSubmit" :signParams="signParams"></show-sign-agreement>

    <show-branch :showBranchWin="showBranchWin" title="机构查询" @brchNoChange="brchNoChange"
                 @showBranchWinClose="showBranchWinClose"></show-branch>

    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin"
                    :bill-range-start="this.billRangeStart" :bill-range-end="this.billRangeEnd"
                    :billId="this.billId" :billNo="this.billNo"></bill-info-main>
    <!-- 挑票 -->
    <e-get-bill-pick :save-pick-bill-win="savePickBillWin" @savePickBillWinClose="savePickBillWinClose"
                     @savePickBillChange="savePickBillChange" :bill-class="this.billClass"
                     :bill-type="this.batchParams.billType" :batch-id="this.batchParams.batchId"
                     :data-source="1"
                     :custAcctNo="this.batchParams.custAcctNo" :acct-brch-no="this.addOrEditForm.saveBrchNo"></e-get-bill-pick>
    <!-- 挑票（网银发起） -->
    <e-get-bill-pick :save-pick-bill-win="savePickBillWinWithEbank" @savePickBillWinClose="savePickBillWinWithEbankClose"
                     @savePickBillChange="savePickBillChange" :bill-class="this.billClass"
                     :bill-type="this.batchParams.billType" :batch-id="this.batchParams.batchId"
                     :data-source="2"
                     :custAcctNo="this.batchParams.custAcctNo" :acct-brch-no="this.addOrEditForm.saveBrchNo"></e-get-bill-pick>
    <common-excel-download @handleSubmit="exportForm" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param"
                           :rows="this.rows"></common-excel-download>
  </div>
</template>

<script>
  import { post, on, off, formatNumber ,formatBillRange} from "@/api/bizApi/commonUtil";
  import {deepClone} from "@/utils/index";

  export default {
    name: "eGetBillApplyAdd",
    components: {
      EGetBillPick: () => import(/* webpackChunkName: "pl/custody/common/getBillPick" */ '@/views/bizViews/pl/custody/common/eGetBillPick')
    },
    data() {
      return {
        savePickBillWin : false,
        //挑票（网银发起）
        savePickBillWinWithEbank: false,
        addSumForm : {
          totalAmt: '0.00',
          totalCount: '0'
        },
        saveBrchIcon: true,
        billClass : "ME02",
        submitFlag : false,
        hasSelect : false,
        batchId : "",
        addOrEditForm : {
          id:'',
          billClass: 'ME02',
          agreementNo: '',
          custName: '',
          custNo: '',
          custAcctNo: '',
          billType: '',
          getBatchDt: '',
          getWay: '',
          saveBrchNo: this.$store.getters.userInfo.brchNo,
          acctBrchNo: '',
          saveBrchName: this.$store.getters.userInfo.brchName,
        },
        formItem : {
          batchId: '',
          billClass: 'ME02',
          curFuncNo: 'PIPL020503'
        },
        columns : [],
        columnsNoCommit : [
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
            title: this.$t("m.i.billInfo.billOrigin"),
            key: "billOrigin",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.batchParams.dictMap, "BillOrigin", params.row.billOrigin);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.billInfo.billPackageNo"),
            key: 'billNo',
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
            title: this.$t("m.i.billInfo.billRange"),
            align:'center',
            key:"billRange",
            hiddenCol: false,
            render:(h,params) => {
              let billOrigin = params.row.billOrigin;
              let billRangeStart = params.row.billRangeStart;
              let billRangeEnd = params.row.billRangeEnd;
              return h("span", formatBillRange(billOrigin, billRangeStart, billRangeEnd))
            }
          },
          {
            title: this.$t("m.i.billInfo.flowStatus"),
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
        ],
        columnsHasCommit : [
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
            key: "billOrigin",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.batchParams.dictMap, "BillOrigin", params.row.billOrigin);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.billInfo.billPackageNo"),
            key: 'billNo',
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
            title: this.$t("m.i.billInfo.billRange"),
            align:'center',
            key:"billRange",
            hiddenCol: false,
            render:(h,params) => {
              let billOrigin = params.row.billOrigin;
              let billRangeStart = params.row.billRangeStart;
              let billRangeEnd = params.row.billRangeEnd;
              return h("span", formatBillRange(billOrigin, billRangeStart, billRangeEnd))
            }
          },
          {
            title: this.$t("m.i.billInfo.flowStatus"),
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
        ],
        billTypeList : [],
        getWayList : [],
        saveAddBillInfoForm : {},
        currentSelectList : [],
        signAgreementWin : false,
        signParams : {},
        showBranchWin : false,
        //记录批次是否已保存
        hadBatchSave : false,
        showBillInfoWin : false,
        billId : "",
        billNo : "",
        billRangeStart: "",
        billRangeEnd: "",
        //风险信息窗口
        riskCheckWin : false,
        riskParams : {},
        param: null,
        rows: null,
        tempShowExcelTemplateWin: false,
      };
    },
    props: {
      getBillAddOrEditWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      batchParams: {
        type: Object,
        default: {
          dictMap: new Map(),
          billTypeList: [],
          getWayList: [],
          isList: [],
          batchId: "",
          batchType: "",
          isCommit: "",
          curFuncNo: "",
          custAcctNo: "",
          billClass: "",
          billType: "",
          showEbankPickBill: "",
        }
      }
    },
    computed: {
      tempGetBillAddOrEditWin: {
        get() {
          return this.getBillAddOrEditWin;
        },
        set() {
        }
      }
    },
    watch: {
      getBillAddOrEditWin(val) {
        if (val) {
          this.$nextTick(() => {
            // this.isModifyDisabled = false;
            this.$refs.addOrEditForm.resetFields();
            this.$refs.addSumForm.resetFields();
            this.addOrEditForm.id = "";
            this.addOrEditForm.saveBrchNo = this.$store.getters.userInfo.brchNo;
            this.addOrEditForm.saveBrchName = this.$store.getters.userInfo.brchName;
            this.hadBatchSave = false;
            if(this.batchParams.isCommit === 'hasCommit') {
              this.columns = deepClone(this.columnsHasCommit);
              this.$refs.datagrid.createShowCol(this.columns);
            }else {
              this.columns = deepClone(this.columnsNoCommit);
              this.$refs.datagrid.createShowCol(this.columns);
            }
            this.batchId = this.batchParams.batchId;
            this.billTypeList = this.batchParams.billTypeList;
            this.getWayList = this.batchParams.getWayList;
            this.formItem.batchId = this.batchId;
            this.formItem.curFuncNo = this.batchParams.curFuncNo;
            this.formItem.billClass = this.batchParams.billClass;
            if (this.batchParams.batchType === "modify") {
              this.queryObjById();
              this.handleSearch();
              this.hadBatchSave = true;
              this.saveBrchIcon = false;
            }
            if (this.batchParams.batchType === "add") {
              this.saveBrchIcon = true;
              this.$refs.datagrid.tData = [];
              this.addOrEditForm.getBatchDt = this.$moment(window.sessionStorage.getItem("workDate"), "YYYY-MM-DD").format("YYYY-MM-DD");
            }
          });
        }
      },
    },
    methods: {
      //修改时根据票据批次Id查询票据批次信息
      queryObjById() {
        let params = { id: this.batchId, curFuncNo: this.batchParams.curFuncNo, billClass: 'ME02'};
        post(params, "/pl/custody/elec/getBill/eGetBillApplyMain/func_pageQueryGetBatchList").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              if (null !== res.data.retData.list && res.data.retData.list.length > 0) {
                let obj = res.data.retData.list[0];
                this.addOrEditForm.id = obj.id;
                this.addOrEditForm.agreementNo = obj.agreementNo;
                this.addOrEditForm.custName = obj.custName;
                this.addOrEditForm.custNo = obj.custNo;
                this.addOrEditForm.custAcctNo = obj.custAcctNo;
                this.addOrEditForm.billType = obj.billType;
                this.addOrEditForm.getBatchDt = obj.getBatchDt;
                this.addOrEditForm.getWay = obj.getWay;
                this.addOrEditForm.saveBrchNo = obj.acctBrchNo;
                this.addOrEditForm.saveBrchName = obj.acctBrchName;
                if(obj.getBatchDt != null && obj.getBatchDt !== ""){
                  this.addOrEditForm.getBatchDt = this.$moment(obj.getBatchDt, "YYYYMMDD").format("YYYY-MM-DD");
                }
                this.addSumForm.totalCount = obj.totalCount;
                this.addSumForm.totalAmt = formatNumber(obj.totalAmt, 2, ',');
              }
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //关闭弹窗
      handleClose() {
        // this.$refs.addOrEditForm.resetFields();
        // this.addOrEditForm.id = "";
        // this.hadBatchSave = false;
        this.$emit("getBillAddOrEditWinClose", "");
      },
      handleGetBatchDtChange(value) {
        this.addOrEditForm.getBatchDt = value.replace(/-/g, "");
      },
      //表单查询
      handleSearch() {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.dataChange(1);
      },
      //查询签约信息
      queryAgreementNo() {
        this.signParams.agreementUrl = "/pl/custody/elec/getBill/eGetBillApplyMain/func_pagingBillAgreement";
        this.signParams.signFuncNo = "1";
        this.signParams.effectiveFlag = "1";
        this.signAgreementWin = true;
      },
      //赋值
      signAgreementSubmit(info) {
        this.addOrEditForm.agreementNo = info.agreementNo;
        this.addOrEditForm.custName = info.custName;
        this.addOrEditForm.custNo = info.custNo;
        this.addOrEditForm.custAcctNo = info.custAcctNo;
        this.signAgreementWin = false;
      },
      //关闭
      signAgreementWinClose() {
        this.signParams = {};
        this.signAgreementWin = false;
      },
      //查询机构弹出框
      queryBrchNo() {
        this.showBranchWin = true;
      },
      //根据弹框所选数据进行赋值
      brchNoChange(info) {
        this.formItem.brchNo = "";
        for (let i = 0; i < info.length; i++) {
          this.formItem.brchNo += info[i].id;
          if (i < info.length - 1) {
            this.formItem.brchNo += ",";
          }
        }
        this.showBranchWin = false;
      },
      showBranchWinClose() {
        this.showBranchWin = false;
      },
      //保存批次信息
      formSave() {
        this.$refs["addOrEditForm"].validate(valid => {
          this.addOrEditForm.acctBrchNo = this.addOrEditForm.saveBrchNo;
          if (valid) {
            this.addOrEditForm.getBatchDt = this.$moment(this.addOrEditForm.getBatchDt).format("YYYYMMDD");
            if (this.addOrEditForm.getBatchDt < window.sessionStorage.getItem("workDate")) {
              this.$msgTip.info(this, { info: "创建日期必须大于或等于当前营业日期" });
              return;
            }
            let url = this.batchParams.batchType === "add" ? "/pl/custody/elec/getBill/eGetBillApplyMain/func_addGetBatch" : "/pl/custody/elec/getBill/eGetBillApplyMain/func_updateGetBatch";
            if (this.hadBatchSave) {
              url = "/pl/custody/elec/getBill/eGetBillApplyMain/func_updateGetBatch";
            }
            this.submitFlag = true;
            post(this.addOrEditForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.batchParams.custAcctNo = this.addOrEditForm.custAcctNo;
                  this.batchParams.billType = this.addOrEditForm.billType;
                  if (this.batchParams.batchType === "add" && this.hadBatchSave === false) {
                    this.batchId = res.data.retData;
                    this.formItem.batchId = res.data.retData;
                    this.addOrEditForm.id = res.data.retData;
                    this.batchParams.batchId = res.data.retData;
                  }
                  this.handleSearch();
                  this.hadBatchSave = true;
                  this.batchParams.batchType = "modify";
                  this.saveBrchIcon = false;
                } else {
                  this.$msgTip.error(this, { info: msg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      //挑票
      pickBillWinOpen() {
        if (this.batchParams.batchType === "add") {
          if (this.hadBatchSave) {
            this.jumpToBillWin();
          }else {
            this.$msgTip.info(this, { info: "请先保存批次" });
            return;
          }
        }
        if (this.batchParams.batchType === "modify") {
          this.jumpToBillWin();
        }
      },
      //挑票(网银发起）
      pickBillByEbankWinOpen() {
        if (this.batchParams.batchType === "add") {
          if (this.hadBatchSave) {
            this.jumpToBillWinWithEbank();
          }else {
            this.$msgTip.info(this, { info: "请先保存批次" });
            return;
          }
        }
        if (this.batchParams.batchType === "modify") {
          this.jumpToBillWinWithEbank();
        }
      },
      //跳转到挑票界面
      jumpToBillWin(){
        this.savePickBillWin = true;
      },
      //跳转到挑票(网银发起）界面
      jumpToBillWinWithEbank(){
        this.savePickBillWinWithEbank = true;
      },
      //挑票界面根据弹框所选票进行赋值
      savePickBillChange(info, dataSource) {
        let list = info;
        let pickDtoList = [];
        for(let i=0; i<list.length; i++) {
          let pickDto = {
            billId: list[i].billId,
            hldrId: list[i].hldrId,
            transId: list[i].transId,
          };
          pickDtoList.push(pickDto);
        }
        post({batchId: this.batchId ,dataSource: dataSource, pickBillDtoList: pickDtoList},'/pl/custody/elec/getBill/eGetBillApplyMain/func_addGetBillInfo').then(res => {
          if(res){
            let retCode = res.data.retCode;
            if(retCode==="000000"){
              this.$msgTip.success(this,{info:res.data.retMsg});
              this.savePickBillWin = false;
              this.savePickBillWinWithEbank = false;
              this.queryObjById();
              this.handleSearch();
              this.$emit("pageReFresh","");
            }else{
              this.$msgTip.error(this,{info:res.data.retMsg});
              this.$refs.datagrid.dataChange(1);
              this.$emit("pageReFresh","");
            }
          }else{
            this.$msgTip.error(this,{info:this.$t("m.i.common.netError")});
          }
        });
      },
      //挑票界面取消按钮
      savePickBillWinClose(){
        this.savePickBillWin = false;
        this.handleSearch();
      },
      //挑票界面取消按钮 网银
      savePickBillWinWithEbankClose(){
        this.savePickBillWinWithEbank = false;
        this.handleSearch();
      },
      //删除
      deleteBillDetail(str) {
        if(str === "batch") {
          this.batchDelete();
        }
        if(str === "select") {
          this.selectDelete();
        }
      },
      //批次删除
      batchDelete() {
        if (!this.hadBatchSave) {
          this.$msgTip.info(this, { info: "请先保存批次" });
          return;
        }
        if (this.$refs.datagrid.tData.length === 0) {
          this.$msgTip.info(this, { info: "该批次下无数据" });
          return;
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定批次删除明细吗",
          onOk: () => {
            let flowStatusList = ['PIPL02050102-PIPL02050102','PIPL02050102-PIPL02050301','PIPL02050402-PIPL02050301','PIPL02050802-PIPL02050802','PIPL02051302-PIPL02050301','PIPL02060202-PIPL02050301'];
            post({batchId: this.batchId, billOperType: "1", flowStatusList: flowStatusList }, "/pl/custody/elec/getBill/eGetBillApplyMain/func_deleteGetBillInfo").then(res => {
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.handleSearch();
                  this.queryObjById();
                } else {
                  this.$msgTip.error(this, { info: msg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      //选择删除
      selectDelete() {
        if (!this.hadBatchSave) {
          this.$msgTip.info(this, { info: "请先保存批次" });
          return;
        }
        let list = this.$refs.datagrid.selects;
        if (list.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定选择删除明细吗",
          onOk: () => {
            let ids = "";
            for(let i=0; i<list.length; i++) {
              ids += list[i].id;
              if(i<list.length-1) {
                ids += ",";
              }
            }
            post({batchId: this.batchId, billOperType: "0", ids: ids }, "/pl/custody/elec/getBill/eGetBillApplyMain/func_deleteGetBillInfo").then(res => {
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.handleSearch();
                  this.queryObjById();
                } else {
                  this.$msgTip.error(this, { info: msg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      //提交
      submit(type) {
        if (!this.hadBatchSave) {
          this.$msgTip.info(this, { info: "请先保存批次" });
          return;
        }
        if (type === "select") {
          let list = this.$refs.datagrid.selects;
          if (list.length === 0) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
            return;
          }
          let ids = "";
          for(let i=0; i<list.length; i++) {
            ids += list[i].id;
            if(i<list.length - 1) {
              ids += ",";
            }
          }
          let params = { batchId: this.batchId, ids: ids, billOperType: "0" };
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: "确定提交申请吗?",
            onOk: () => {
              this.handleSubmit(params);
            }
          });
        } else if (type === "batch") {
          if (this.batchId === "") {
            this.$msgTip.info(this, { info: "请先保存批次" });
            return;
          }
          if (this.$refs.datagrid.tData.length === 0) {
            this.$msgTip.info(this, { info: "该批次下无数据" });
            return;
          }
          let params = { batchId: this.batchId, billOperType: "1" };
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: "确定批次提交申请吗?",
            onOk: () => {
              this.handleSubmit(params);
            }
          });
        }
      },
      handleSubmit(params) {
        post(params, "/pl/custody/elec/getBill/eGetBillApplyMain/func_submitGetBillFlow").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.handleSearch();
              this.queryObjById();
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
              this.handleSearch();
              this.queryObjById();
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      },
      //撤销
      infoCancel() {
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定撤销申请吗？",
          onOk: () => {
            this.handleCancelApplyBatch();
          }
        });
      },
      handleCancelApplyBatch() {
        post({ batchId: this.batchId, billOperType: '1' }, "/pl/custody/elec/getBill/eGetBillApplyMain/func_cancelGetBillFlow").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.handleClose();
              this.handleSearch();
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
              this.handleSearch();
              this.queryObjById();
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      billInfoWinClose() {
        this.showBillInfoWin = false;
      },
      showBillInfo(info, type) {
        this.billId = "";
        this.billNo = "";
        if (type === "billId") {
          this.billId = info.billId;
        } else {
          this.billNo = info.billNo;
        }
        this.billRangeStart = info.billRangeStart;
        this.billRangeEnd = info.billRangeEnd;
        this.showBillInfoWin = true;
      },
      riskCheckWinClose() {
        this.riskCheckWin = false;
        this.riskParams = {};
      },
      riskCheckSubmit(info) {
        this.handleSubmit(info, true);
      },


      exportBillExcel(){
        if (this.$refs.datagrid.selectIds.length !== 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        } else {
          this.rows = this.$refs.datagrid.total;
        }
        if (!this.hadBatchSave) {
          this.$msgTip.info(this, { info: "请先保存批次" });
          return;
        }
        this.param = "eGetBillListExportInfo";
        this.tempShowExcelTemplateWin = true;
      },
      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },
      exportForm(field, exportType){
        //exportType: 0-同步 1-异步
        let url = window.LOCAL_CONFIG.API_HOME + "/pl/custody/paper/getBill/getBillApplyAdd/func_exportExcel";
        if (exportType === "1") {
          let params = null;
          if (this.$refs.datagrid.selectIds.length !== 0) {
            params = {
              batchId:this.formItem.batchId,
              ids: this.$refs.datagrid.selectIds,
              curFuncNo: this.formItem.curFuncNo,
              field: field,
              exportType: exportType,
              excelName: this.param
            };
          } else {
            params = {
              batchId:this.formItem.batchId,
              billClass: this.formItem.billClass,
              curFuncNo: this.formItem.curFuncNo,
              field: field,
              exportType: exportType,
              excelName: this.param,
            };
          }
          post(params, url).then(res => {
            if(res.status === 200 && res.data === null){
              this.$msgTip.info(this, { info:"异步导出成功，请进入公共管理》导出下载页面，进行下载"});
            }else if(res.status === 200 && res.data === ""){
              this.$msgTip.info(this, { info:"异步导出成功，请进入公共管理》导出下载页面，进行下载"});
            } else{
              this.$msgTip.error(this, { info: "异步导出失败" });
            }
          });
        } else {
          if (this.$refs.datagrid.selectIds.length !== 0) {
            let form = document.createElement("form");
            form.setAttribute("id", "formId");
            form.setAttribute("action", url);
            form.setAttribute("method", "post");
            let input = document.createElement('input');
            input.type = 'text';
            input.name = 'ids';
            input.value = this.$refs.datagrid.selectIds;
            form.appendChild(input);
            let input1 = document.createElement('input');
            input1.type = 'text';
            input1.name = 'batchId';
            input1.value = this.formItem.batchId;
            form.appendChild(input1);
            let input2 = document.createElement('input');
            input2.type = 'text';
            input2.name = 'billClass';
            input2.value = 'ME01';
            form.appendChild(input2);
            let input3 = document.createElement('input');
            input3.type = 'text';
            input3.name = 'curFuncNo';
            input3.value = this.formItem.curFuncNo;
            form.appendChild(input3);

            let input6 = document.createElement("input");
            input6.type = "text";
            input6.name = "field";
            input6.value = field;
            form.appendChild(input6);
            let input4 = document.createElement("input");
            input4.type = "text";
            input4.name = "exportType";
            input4.value = exportType;
            form.appendChild(input4);
            let input5 = document.createElement("input");
            input5.type = "text";
            input5.name = "excelName";
            input5.value = this.param;
            form.appendChild(input5);
            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
          } else {
            let form = document.createElement("form");
            for (let obj in this.formItem) {
              if (this.formItem.hasOwnProperty(obj)) {
                let input = document.createElement("input");
                input.type = "text";
                input.name = obj;
                input.value = this.formItem[obj];
                form.appendChild(input);
              }
            }
            form.setAttribute("id", "formId");
            form.setAttribute("action", url);
            form.setAttribute("method", "post");
            let input1 = document.createElement("input");
            input1.type = "text";
            input1.name = "field";
            input1.value = field;
            form.appendChild(input1);
            let input2 = document.createElement("input");
            input2.type = "text";
            input2.name = "exportType";
            input2.value = exportType;
            form.appendChild(input2);
            let input3 = document.createElement("input");
            input3.type = "text";
            input3.name = "excelName";
            input3.value = this.param;
            form.appendChild(input3);
            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
          }
        }
      },

      //确认书打印
      confirmPrint() {
        if (!this.hadBatchSave) {
          this.$msgTip.info(this, { info: "请先保存批次" });
          return;
        }
        let list = this.$refs.datagrid.selects;
        if (list.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.assembleBillParams(list);
      },

      assembleBillParams(vocherData) {
        let bodyStr = "";
        for (let i = 0; i < vocherData.length; i++) {
          let printData = {};
          printData.billOrigin = !!vocherData[i].billOrigin ? this.getDictValueFromMap(this.batchParams.dictMap, "BillOrigin", vocherData[i].billOrigin) : "";
          printData.billNo = vocherData[i].billNo;
          printData.billRange = formatBillRange(vocherData[i].billOrigin, vocherData[i].billRangeStart, vocherData[i].billRangeEnd);
          printData.flowStatusName = !!vocherData[i].flowStatusName ? vocherData[i].flowStatusName : "";
          printData.billType = !!vocherData[i].billType ? this.getDictValueFromMap(this.batchParams.dictMap, "DraftTypeCode", vocherData[i].billType) : "";
          printData.remitDt = !!vocherData[i].remitDt ? this.$moment(vocherData[i].remitDt, "YYYYMMDD").format("YYYY-MM-DD") : "";
          printData.dueDt = !!vocherData[i].dueDt ? this.$moment(vocherData[i].dueDt, "YYYYMMDD").format("YYYY-MM-DD") : "";
          printData.billMoney = formatNumber(vocherData[i].billMoney, 2, ",");
          printData.drwrName = vocherData[i].drwrName === null ? "" : vocherData[i].drwrName;
          printData.drwrAcctNo = vocherData[i].drwrAcctNo === null ? "" : vocherData[i].drwrAcctNo;
          printData.pyeeName = vocherData[i].pyeeName === null ? "" : vocherData[i].pyeeName;
          printData.acptName = vocherData[i].acptName === null ? "" : vocherData[i].acptName;
          printData.pyeeAcctNo = vocherData[i].pyeeAcctNo === null ? "" : vocherData[i].pyeeAcctNo;
          printData.flowNo = vocherData[i].acctFlowId === null ? "" : vocherData[i].flowNo;
          printData.printObj = JSON.stringify(vocherData[i]);

          bodyStr += "<tr>";
          bodyStr += "<td class='ta-c'>" + (1 + i) + "</td>";
          bodyStr += "<td>" + printData.billOrigin + "</td>";
          bodyStr += "<td>" + printData.billNo + "</td>";
          bodyStr += "<td>" + printData.billRange + "</td>";
          bodyStr += "<td>" + printData.flowStatusName + "</td>";
          bodyStr += "<td>" + printData.billType + "</td>";
          bodyStr += "<td>" + printData.billMoney + "</td>";
          bodyStr += "<td>" + printData.remitDt + "</td>";
          bodyStr += "<td>" + printData.dueDt + "</td>";
          bodyStr += "<td>" + printData.drwrName + "</td>";
          bodyStr += "<td>" + printData.drwrAcctNo + "</td>";
          bodyStr += "<td>" + printData.pyeeName + "</td>";
          bodyStr += "<td>" + printData.acptName + "</td>";
          bodyStr += "</tr>";
        }
        let headHtml = `<div style="text-align:center;" ref="headHtml">
          <div style="text-align:center;font-size:18px;font-weight:bold;">票据池确认清单</div>
           <div style="text-align:left;font-size:14px;font-weight:bold;">取票：√</div>
          <div style="text-align:left;font-size:14px;font-weight:bold;">客户名称：${this.addOrEditForm.custName}</div>
          <div style="text-align:left;font-size:14px;font-weight:bold;">客户账号：${this.addOrEditForm.custAcctNo}</div>
        </div>`;
        let footerHtml = `<div style="font-size:14px;font-weight:bold;display:-webkit-box;display:flex;justify-content:flex-end;">
          <label style="padding-right:20%">收款行:</label>
          <label style="padding-right:20%">客户:</label>
        </div>`;
        let bodyHtml = `<div class="list-table-box"><table class="list-table">
          <thead>
            <tr>
              <th class="ta-c"><b>序号</b></th>
              <th>票据来源</th>
              <th>票据(包)号码</th>
              <th>子票区间</th>
              <th>流程状态</th>
              <th>票据种类</th>
              <th>票据(包)金额(元)</th>
              <th>出票日期</th>
              <th>汇票到期日</th>
              <th>出票人全称</th>
              <th>出票人账号</th>
              <th>收款人全称</th>
              <th>承兑人全称</th>
            </tr>
          </thead>
          <tbody>${bodyStr}</tbody>
        </table>
      </div>`;
        this.$print.printListHtm(this, headHtml, bodyHtml, {
          bodyTop: "20%", bodyLeft: "1%", bodyWidth: "99%", bodyHeight: "75%"
        }, footerHtml);
      },
    }
  };
</script>

<style scoped>

</style>
