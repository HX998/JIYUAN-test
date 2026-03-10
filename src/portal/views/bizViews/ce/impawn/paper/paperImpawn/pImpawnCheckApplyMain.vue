<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <!-- 主页面 -->
        <div v-if="mainVue">
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
               <!-- <h-form-item :label="$t('m.i.common.ownedBrchNo')" prop="ownedBrchNos" v-if="this.licenseFlag">
                  <h-input v-model="formItem.ownedBrchNames" icon="android-search" @on-click="brchNoWinOpen"
                           readonly clearable @on-clear="clearVal1('license')" :title="formItem.ownedBrchNames" ></h-input>
                </h-form-item>-->
                <show-branch v-model="formItem.ownedBrchNos" :label="$t('m.i.common.ownedBrchNo')" prop="ownedBrchNos" title="机构名称"
                             :brchNo.sync="formItem.ownedBrchNos" :brchName.sync="formItem.ownedBrchNames" v-if="this.licenseFlag" :params="{authPath: this.authPath}"
                             url ="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree" queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
                </show-branch>
                <h-form-item prop="custNo" :label="$t('m.i.common.custNo')">
                  <select-cust-corp v-model="formItem.custNo" :custNo="formItem.custNo" :value.sync="formItem.custNo" title="查询客户信息"></select-cust-corp>
                </h-form-item>
                <h-form-item prop="batchNo" :label="$t('m.i.common.batchNo')">
                  <h-input v-model="formItem.batchNo" placeholder=""></h-input>
                </h-form-item>
                <h-form-item prop="impawnDt" :label="$t('m.i.ce.impawnDt')">
                  <h-date-picker type="date" v-model="formItem.impawnDt" placeholder=""
                                 @on-change="handleDateChange" showFormat :editable=false></h-date-picker>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" v-if="this.licenseFlag" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                                                                   :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="handleSearch()">{{$t('m.i.common.search')}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t('m.i.common.reset')}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid :columns="columns"
                      highlightRow
                      url="/ce/impawn/paper/paperImpawn/pImpawnCheckApplyMain/func_queryImpawnBatch"
                      :bindForm="formItem"
                      :autoLoad="false"
                      :onCurrentChange="handleCurrentChange"
                      :onCurrentChangeCancel="handleCurrentChangeCancel"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="cancelAccountMain()" >提交复核</h-button>
            </div>
          </h-datagrid>
        </div>
        <!-- 子页面 -->
        <div v-if="billManagerVue">
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="billManagerFormItem" :label-width="90" ref="billManagerFormItem" cols="4" class="h-form-search">
                <h-form-item prop="reverseBillNo" :label="$t('m.i.billInfo.billNo')">
                  <h-input v-model="billManagerFormItem.reverseBillNo" placeholder=""></h-input>
                </h-form-item>
                <h-form-item prop="billMoney" :label="$t('m.i.billInfo.billMoney')">
                  <h-typefield v-model="billManagerFormItem.billMoney" type="money"  bigTips placeholder=""></h-typefield>
                </h-form-item>
                <h-form-item prop="remitDt" :label="$t('m.i.billInfo.remitDt')">
                  <h-date-picker type="date" v-model="billManagerFormItem.remitDt" placeholder="" @on-change="handleRemitDtChange"></h-date-picker>
                </h-form-item>
                <h-form-item prop="dueDt" :label="$t('m.i.billInfo.dueDt')">
                  <h-date-picker type="date" v-model="billManagerFormItem.dueDt" placeholder="" @on-change="handleDueDtChange"></h-date-picker>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont" :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="billManagerHandleSearch()">{{$t('m.i.common.search')}}</h-button>
                  <h-button type="ghost" @click="billManagerResetSearch()">{{$t('m.i.common.reset')}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <impawn-batch-detail :batchDetailParams="impawnBillParams" ref="impawnBatchDetail"></impawn-batch-detail>
        </div>
        <!-- 数据展示表格 -->
        <div v-if="billManagerVue">
          <h-datagrid :columns="billManagerColumns"
                      url="/ce/impawn/paper/paperImpawn/pImpawnCheckApplyMain/func_pageQueryImpawnBillList"
                      highlightRow
                      :auto-load="false"
                      :bindForm="billManagerFormItem"
                      :has-select="false"
                      :row-select="true"
                      ref="billManagerDatagrid">
            <div slot="toolbar" class="pull-left">
              <h-dropdown placement="bottom-start" @on-click="checkPass">
                <h-button type="primary">复核通过<h-icon name="unfold"></h-icon></h-button>
                <h-dropdown-menu slot="list">
                  <h-dropdown-item name="batch">批次复核通过</h-dropdown-item>
                  <h-dropdown-item name="select">选择复核通过</h-dropdown-item>
                </h-dropdown-menu>
              </h-dropdown>
              <h-dropdown placement="bottom-start" @on-click="checkBack">
                <h-button type="primary">复核退回<h-icon name="unfold"></h-icon></h-button>
                <h-dropdown-menu slot="list">
                  <h-dropdown-item name="batch">批次复核退回</h-dropdown-item>
                  <h-dropdown-item name="select">选择复核退回</h-dropdown-item>
                </h-dropdown-menu>
              </h-dropdown>
              <h-button type="ghost" @click="returnMain" >返回</h-button>
            </div>
          </h-datagrid>
          <!--票面信息-->
          <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"></bill-info-main>
        </div>
      </h-col>
    </h-row>


    <!-- 退回原因录入弹窗 -->
    <h-msg-box v-model="impawnBackWin" width="400" @on-close="paymentBackWinClose" class="h-form-search-layer" :maximize="true" :mask-closable="false">
      <p slot="header">
        <span>退回原因录入</span>
      </p>
      <div>
        <h-form :model="impawnBackForm" :label-width="115" ref="impawnBackForm" cols="1" class="h-form-search">
          <h-form-item prop="impawnRgstReturnReason" :label="$t('m.i.ce.paymentReturnReason')" required>
            <h-input v-model="impawnBackForm.impawnRgstReturnReason" placeholder="" type="textarea" :rows="3" :canResize="false" :maxlength="100" :lengthByByte="false"></h-input>
          </h-form-item>
        </h-form>
      </div>
      <div slot="footer">
        <div slot="footer">
          <h-button type="ghost" @click="paymentBackWinClose">{{$t("m.i.common.close")}}</h-button>
          <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
          <h-button type="primary" v-else @click="impawnBackWinSubmit()">{{$t("m.i.ce.returnBack")}}</h-button>
        </div>
      </div>
    </h-msg-box>

    <!--<show-license-branch :showBranchWin="brchNoWin" title="机构查询" @brchNoChange="brchNoChange" :authPath="authPath"
                         @showBranchWinClose="brchNoWinClose" :ifcheck="true" :checkStrictly="true"></show-license-branch>-->

  </div>
</template>

<script>
  import { post, on, off, getDictListByGroups, getDictValueFromMap,formatNumber } from "@/api/bizApi/commonUtil";
  import ImpawnBatchDetail from "@/views/bizViews/ce/impawn/paper/paperImpawn/pImpawnCheckApplyBatchDetail";

  export default {
    name: "pImpawnCheckApplyMain",
    components: {
      ImpawnBatchDetail,
      //ShowLicenseBranch: () => import(/* webpackChunkName: "sm/auth/branch/showLicenseBranch" */`@/views/bizViews/sm/auth/branch/showLicenseBranch`),

    },
    data() {
      let columns=[
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
          key: "ownedBrchNo",
          hiddenCol: true
        },
        {
          title: this.$t("m.i.common.ownedBrchNo"),
          key: "ownedBrchName",
          hiddenCol: true
        },
        {
          title: this.$t("m.i.common.batchNo"),
          key: 'batchNo',
          ellipsis: false,
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            return h('div', [
              h('a', {
                on: {
                  click: () => {
                    this.openBillManagerWin(params.row)
                  }
                }
              }, params.row.batchNo)
            ]);
          },
        },
        {
          title: this.$t("m.i.common.custName"),
          key: 'custName',
          ellipsis: false,
          hiddenCol: false,
          sortable: true,
        },
        {
          title: this.$t("m.i.common.custNo"),
          key: 'custNo',
          ellipsis: false,
          hiddenCol: false,
          sortable: true,
        },
        {
          title: this.$t("m.i.common.custAcctNo"),
          key: 'custAcctNo',
          ellipsis: false,
          hiddenCol: false,
          sortable: true,
        },
        {
          title: this.$t("m.i.billInfo.billType"),
          key: 'billType',
          ellipsis: false,
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = getDictValueFromMap(this.dictMap,"DraftTypeCode",params.row.billType);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t("m.i.ce.impawnDt"),
          key: 'impawnDt',
          ellipsis: false,
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            if(params.row.impawnDt == null || params.row.impawnDt === ""){
              return "";
            }
            let date = this.$moment(params.row.impawnDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
          title: this.$t("m.i.ce.totalCount"),
          key: 'sumCount',
          ellipsis: false,
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.ce.totalAmt"),
          key: 'sumMoney',
          ellipsis: false,
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let sumMoney = formatNumber(params.row.sumMoney, 2, ',');
            return h("span", {
              domProps: {
                title: sumMoney
              }
            }, sumMoney);
          }
        },
      ];
      return {
        submitFlag:false,
        formItem: {
          custNo: '',
          batchNo: '',
          impawnDt: '',
          ownedBrchName:"",
          ownedBrchNo:"",
          ownedBrchNames:"",
          ownedBrchNos:"",
          authPath:this.$route.path ,
          billClass : 'ME01',
          impawnRgstStatusList: ['BTC02','BTC05'],
          impawnRgstApplTellerNoNotEqual : this.$store.getters.userInfo.userNo,
          auditModeKey : 'ce.impawn.is_rgst_check_exclude',
          queryFlag: "0",
        },
        impawnBackForm: {
          checkFlag : '',
          impawnRgstReturnReason : '',
          batchOrSelect:''
        },
        billManagerFormItem: {
          batchId: '',
          billNo: '',
          reverseBillNo:'',
          billMoney: '',
          remitDt: '',
          dueDt: '',
          impawnRgstApplTellerNoNotEqual : this.$store.getters.userInfo.userNo,
          auditModeKey : 'ce.impawn.is_rgst_check_exclude',
        },
        columns: columns,
        cloneColumns: this.deepClone(columns),
        billManagerColumns: [
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
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (!!params.row.billId) {
                return h("a", {
                  on: {
                    click: () => {
                      this.showBillInfo(params.row.billId);
                    }
                  }
                }, params.row.billNo);
              } else {
                return h("span", null, params.row.billNo);
              }
            }
          },
          {
            title: this.$t("m.i.billInfo.flowStatus"),
            key: 'flowStatusName',
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.impawnRgstStatus == null || params.row.impawnRgstStatus === "") {
                let flowStatusName = params.row.flowStatusName;
                return h("span", flowStatusName);
              } else {
                let impawnRgstStatus = this.getDictValueFromMap(this.dictMap, "ImpawnRgstStatus", params.row.impawnRgstStatus);
                return h("span", impawnRgstStatus + "(" + params.row.flowStatusName + ")");
              }
            }
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: 'billType',
            ellipsis: false,
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap,"DraftTypeCode",params.row.billType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.billInfo.remitDt"),
            key: 'remitDt',
            ellipsis: false,
            hiddenCol: false,
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
            ellipsis: false,
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
            title: this.$t("m.i.billInfo.billMoney"),
            key: 'billMoney',
            ellipsis: false,
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
            title: this.$t("m.i.billInfo.drwrName"),
            key: 'drwrName',
            sortable: true,
            ellipsis: false,
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.drwrAcctNo"),
            key: 'drwrAcctNo',
            ellipsis: false,
            hiddenCol: false,
          },
          {
             title: this.$t("m.i.billInfo.drwrBankNo"),
            key: 'drwrBankNo',
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.pyeeName"),
            key: 'pyeeName',
            sortable: true,
            ellipsis: false,
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.pyeeAcctNo"),
            key: 'pyeeAcctNo',
            ellipsis: false,
            hiddenCol: false,
          },
          {
             title: this.$t("m.i.billInfo.pyeeBankNo"),
            key: 'pyeeBankNo',
            ellipsis: false,
            hiddenCol: false
          },
          {
             title: this.$t("m.i.billInfo.acptName"),
            key: 'acptName',
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
          },
        ],
        currentSelectRow: [],
        mainVue: true,
        billManagerVue: false,
        ifShowMore: false,
        dictMap: new Map(),
        batchId: "",
        ownedBrchName:"",
        ownedBrchNo:"",
        ownedBrchNames:"",
        ownedBrchNos:"",
        licenseFlag:false,
        authPath: this.$route.path ,
        // brchNoWin : false,
        impawnBackWin: false,
        showBillInfoWin: false,
        billId: "",
        impawnBillParams: {}
      }
    },
    mounted() {
      getDictListByGroups("DraftTypeCode,ImpawnRgstStatus").then(res => {
        this.dictMap = res.get("map");
      });
      post({ paramKey: "ce.impawn.rgst_audit_mode" }, "/sm/auth/businessParamete/getBusinessParameter").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            let auditMode = res.data.retData;
            if(auditMode == '0'){
              this.formItem.impawnRgstStatusList =  ['BTC02'];
            }
          }
        }
        this.handleSearch();
      });
      post({authPath:this.$route.path}, "sm/auth/licenseBrch/focusOper/func_checkLicenseAuth").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.licenseFlag = res.data.retData.licenseFlag;
            let columns=[];
            if (this.licenseFlag) {
              columns = this.$refs.datagrid.controlColumnsHidden("ownedBrchName", false);
            }else {
              columns = this.$refs.datagrid.controlColumnsHidden("ownedBrchName", true);
            }
            this.cloneColumns = this.deepClone(columns);
          } else {
            this.$msgTip.error(this, { info: res.data.retMsg });
          }
        }else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });
    },
    watch: {
      billManagerVue(val) {
        if (val) {
          this.billManagerFormItem.batchId = this.impawnBillParams.batchId;
          this.billManagerFormItem.funcNo = this.impawnBillParams.funcNo;
          this.billManagerFormItem.billClass = this.impawnBillParams.billClass;
          this.dataUrl =  "/ce/impawn/paper/paperImpawn/pImpawnCheckApplyMain/func_pageQueryImpawnBillList";
          this.$nextTick(() => {
            let columnsTmp = [];
            columnsTmp = this.deepClone(this.billManagerColumns);
            this.$refs.billManagerDatagrid.createShowCol(columnsTmp);
            this.billManagerHandleSearch();
            this.$refs.impawnBatchDetail.getImpawnBatchInfo(this.impawnBillParams.accountType);
          });
        }
      },
    },
    methods: {
      handleDateChange(value) {
        this.formItem.impawnDt = value.replace(/-/g, "");
      },
      handleRemitDtChange(value) {
        this.billManagerFormItem.remitDt = value.replace(/-/g, "");
      },
      handleDueDtChange(value) {
        this.billManagerFormItem.dueDt = value.replace(/-/g, "");
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
          this.formItem.ownedBrchNo = "";
          this.formItem.ownedBrchName = "";
          this.formItem.ownedBrchNos = "";
          this.formItem.ownedBrchNames = "";
          this.$refs.formItem.resetFields();
        })
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      //查询客户信息
      //触发弹窗
      queryCustName() {
        this.showCustMessageWin = true;
      },
      //赋值
      custCorpSelectSubmit(info) {
        this.formItem.drwrName = info.custName;
        this.formItem.drwrCustNo = info.custNo;
        this.showCustMessageWin = false;
      },
      //关闭
      custCorpWinClose() {
        this.showCustMessageWin = false;
      },
      //主页面撤销记账
      cancelAccountMain() {
        if(this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.batchId = this.currentSelectRow.id;
        this.billManagerFormItem.batchId = this.batchId;
        this.impawnBillParams.batchId = this.batchId;
        this.impawnBillParams.dictMap = this.dictMap;
        this.impawnBillParams.funcNo = this.formItem.funcNo;
        this.impawnBillParams.billClass = this.formItem.billClass;
        this.impawnBillParams.impawnRgstStatusList =  this.formItem.impawnRgstStatusList;
        this.impawnBillParams.ownedBrchNo = this.currentSelectRow.ownedBrchNo;
        this.impawnBillParams.licenseFlag = this.licenseFlag;
        this.impawnBillParams.accountType = "impawn";
        this.impawnBillParams.detailType = "impawnAccount";
        // this.batchInfoParams.id = this.batchId;
        this.$refs.datagrid.tData = [];
        this.mainVue = false;
        this.billManagerVue = true;
        this.$nextTick(() => {
          this.$refs.billManagerDatagrid.createShowCol(this.billManagerColumns);
        });
        this.billManagerHandleSearch();
      },



      //票据管理子页面方法
      //表单查询
      billManagerHandleSearch() {
        this.$refs.billManagerDatagrid.selects = [];
        this.$nextTick(() => {
          this.$refs.billManagerDatagrid.dataChange(1);
        })
      },
      //重置表单查询结果
      billManagerResetSearch() {
        this.$nextTick(() => {
          this.billManagerFormItem.promNoteNo = '';
          this.billManagerFormItem.billNo = '';
          this.billManagerFormItem.reverseBillNo = '';
          this.billManagerFormItem.billMoney = '';
          this.billManagerFormItem.remitDt = '';
          this.billManagerFormItem.dueDt = '';
        })
      },
      //复核通过
      checkPass(str) {
        if(str === "batch") {
          this.batchCancelAccount("1");
        }
        if(str === "select") {
          this.selectCancelAccount("1");
        }
      },
      //复核退回
      checkBack(str) {
        this.impawnBackForm.batchOrSelect = str;
        if(str === "batch") {
          // this.batchCancelAccount("2");
          this.impawnBackForm.checkFlag = "2";
          this.impawnBackWin = true;
          this.$refs.impawnBackForm.resetFields();
        }
        if(str === "select") {
          if(this.$refs.billManagerDatagrid.selects.length === 0) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
            return;
          }
          this.impawnBackForm.checkFlag = "2";
          this.impawnBackWin = true;
          this.$refs.impawnBackForm.resetFields();
        }
      },
      // batchCancelAccountHandler(checkFlag){
      //   this.batchCancelAccount(checkFlag);
      // },
      // selectCancelAccountHandler(checkFlag){
      //   this.selectCancelAccount(checkFlag);
      // },
      impawnBackWinSubmit(){
        this.$refs["impawnBackForm"].validate(valid => {
          if (valid) {
            if (this.impawnBackForm.batchOrSelect === "batch") {
              this.batchCancelAccount(this.impawnBackForm.checkFlag);
            } else if (this.impawnBackForm.batchOrSelect === "select") {
              this.selectCancelAccount(this.impawnBackForm.checkFlag);
            }
          }
        });
      },
      //批次复核
      batchCancelAccount(checkFlag) {
        let content = "";
        let impawnRgstReturnReason = "";
        if(checkFlag == "2"){
          content = "确定批次复核退回吗?";
          impawnRgstReturnReason = this.impawnBackForm.impawnRgstReturnReason;
        }
        if(checkFlag == "1"){
          content = "确定批次复核通过吗?";
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: content,
          onOk: () => {
            post({batchId: this.batchId, billOperType: "1", operSite: "2", checkFlag : checkFlag,
                impawnRgstStatusList: this.formItem.impawnRgstStatusList,impawnRgstReturnReason :impawnRgstReturnReason,
                ownedBrchNo:this.impawnBillParams.ownedBrchNo,licenseFlag:this.impawnBillParams.licenseFlag},
              "/ce/impawn/paper/paperImpawn/pImpawnCheckApplyMain/func_checkImpawnCeRgst").then(res => {
              if(res) {
                let msg = res.data.retMsg
                let retCode = res.data.retCode
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
      //选择复核
      selectCancelAccount(checkFlag) {
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
        let content = "";
        let impawnRgstReturnReason = "";
        if(checkFlag == "2"){
          content = "确定复核退回吗?";
          impawnRgstReturnReason = this.impawnBackForm.impawnRgstReturnReason;
        }
        if(checkFlag == "1"){
          content = "确定复核通过吗?";
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: content,
          onOk: () => {
            post({ids: ids, billOperType: "0", batchId: this.batchId, operSite: "2", impawnRgstReturnReason :impawnRgstReturnReason,
              impawnRgstStatusList: this.formItem.impawnRgstStatusList, checkFlag : checkFlag,
              ownedBrchNo:this.impawnBillParams.ownedBrchNo,licenseFlag:this.impawnBillParams.licenseFlag}, "/ce/impawn/paper/paperImpawn/pImpawnCheckApplyMain/func_checkImpawnCeRgst").then(res => {
              if(res) {
                let msg = res.data.retMsg
                let retCode = res.data.retCode
                if (retCode == "000000") {
                  this.$msgTip.success(this);
                  if(this.$refs.billManagerDatagrid.tData.length === this.$refs.billManagerDatagrid.selects.length) {
                    this.returnMain();
                  }else {
                    this.$refs.impawnBatchDetail.getImpawnBatchInfo("impawn");
                    this.$refs.billManagerDatagrid.dataChange(this.$refs.billManagerDatagrid.$refs.gridPage.currentPage);
                    this.$refs.billManagerDatagrid.selects = [];
                  }
                } else {
                  this.$msgTip.error(this, { info: msg });
                }
                this.impawnBackWin = false;
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
        this.impawnBackWin = false;
        this.billManagerResetSearch();
        this.resetSearch();
        this.handleSearch();
        this.$nextTick(() => {
          this.columns = this.deepClone(this.cloneColumns);
          this.$refs.datagrid.createShowCol(this.cloneColumns);
        });
      },
      //退回弹窗关闭
      paymentBackWinClose() {
        this.impawnBackWin = false;
        this.$refs.impawnBackForm.resetFields();
      },
      billInfoWinClose(){
        this.showBillInfoWin = false;
      },
      showBillInfo(billId){
        this.billId = billId;
        this.showBillInfoWin = true;
      },
      //点击批次编号超链接
      openBillManagerWin(info) {
        this.batchId = info.id;
        this.impawnBillParams.batchId = info.id;
        this.impawnBillParams.ownedBrchNo = info.ownedBrchNo;
        this.assembleParams();
      },
      assembleParams() {
        this.impawnBillParams.dictMap = this.dictMap;
        this.impawnBillParams.funcNo = this.formItem.funcNo;
        this.impawnBillParams.billClass = this.formItem.billClass;
        this.impawnBillParams.licenseFlag = this.licenseFlag;
        this.impawnBillParams.accountType = "impawn";
        this.impawnBillParams.detailType = "impawnAccount";
        this.impawnBillParams.impawnRgstStatusList =  this.formItem.impawnRgstStatusList;
        this.$refs.datagrid.tData = [];
        this.mainVue = false;
        this.billManagerVue = true;
        this.$nextTick(() => {
          this.$refs.billManagerDatagrid.createShowCol(this.billManagerColumns);
        });
        this.billManagerHandleSearch();
      },
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
      },
      brchNoWinOpen() {
        this.brchNoWin = true;},
      brchNoWinClose() {
        this.brchNoWin = false;
      },*/
    }
  };
</script>

<style scoped>

</style>
