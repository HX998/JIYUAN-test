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
                  <h-input v-model="formItem.drwrName" placeholder="" icon="android-search" @on-click="queryCustName()"
                           readonly clearable @on-clear="clearVal('custName')"></h-input>
                </h-form-item>
                <h-form-item prop="drwrAcctNo" :label="$t('m.i.billInfo.drwrAcctNo')">
                  <h-input v-model="formItem.drwrAcctNo" placeholder="" icon="android-search"
                           @on-click="queryCustAcctNo()" readonly  clearable @on-clear="clearVal('custAcctNo')"></h-input>
                </h-form-item>
                <h-form-item prop="acptProtocalNoLike" :label="$t('m.i.billInfo.acptProtocalNo')">
                  <h-input v-model="formItem.acptProtocalNoLike" placeholder=""></h-input>
                </h-form-item>
                <h-form-item prop="remitDt" :label="$t('m.i.billInfo.remitDt')">
                  <h-date-picker type="date" v-model="formItem.remitDt" placeholder=""
                                 @on-change="handleDateChange" :editable=false></h-date-picker>
                </h-form-item>
                <h-form-item prop="acptType" :label="$t('m.i.ce.acptType')">
                  <h-select v-model="formItem.acptType" placeholder="">
                    <h-option v-for="item in acptTypeList"        :value="item.key" :key="item.key">{{item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item prop="batchNoLike" :label="$t('m.i.common.batchNo')">
                  <h-input v-model="formItem.batchNoLike" placeholder=""></h-input>
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
                      url="/ce/acpt/paper/print/acptPrintMain/func_queryPageAcptBatchAndBill?acptTypeNotEqual=2"
                      :bindForm="formItem"
                      :on-current-change="handleRowClick"
                      :on-current-change-cancel="handleRowClickCancel"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="billManager()">{{$t('m.i.ce.billManage')}}</h-button>
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
                <h-form-item prop="reverseBillNo" :label="$t('m.i.billInfo.billNo')">
                  <h-input v-model="billManagerFormItem.reverseBillNo" placeholder=""></h-input>
                </h-form-item>
                <h-form-item class="h-form-operate one-form">
                  <h-button type="primary" @click="billManagerHandleSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="billManagerResetSearch()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
        </div>
        <acpt-batch-info-detail :is-show="billManagerVue" :params="batchInfoParams"
                                :batchUrl = "'/ce/acpt/paper/print/acptPrintMain/func_getAcptBatchByQueryDto'"
                                ref="acptBatchInfoDetail"></acpt-batch-info-detail>
        <!-- 数据展示表格 -->
        <div v-if="billManagerVue" key="3">
          <h-datagrid :columns="billManagerColumns"
                      url="/ce/acpt/paper/print/acptPrintMain/func_queryPageAcptBill"
                      highlightRow
                      :auto-load="false"
                      :bindForm="billManagerFormItem"
                      :has-select="false"
                      :row-select="true"
                      ref="billManagerDatagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="billPrint">{{$t("m.i.common.proofPrint")}}</h-button>
              <h-button type="ghost" @click="returnMain">{{$t("m.i.common.goBack")}}</h-button>
            </div>
          </h-datagrid>
        </div>


        <!-- 录入票据号码 -->
        <h-msg-box v-model="billNoWin" width="400" @on-close="billNoWinClose" class="h-form-search-layer" :maximize="true" :mask-closable="false">
          <p slot="header">
            <span>录入票据号码</span>
          </p>
          <div>
            <h-form :model="billNoForm" :label-width="115" ref="billNoForm" cols="1" class="h-form-search">
              <h-form-item :label="$t('m.i.billInfo.billNo')" prop="billNo" :validRules="billNoRule" required>
                <h-input v-model="billNoForm.billNo" :maxlength="16"></h-input>
              </h-form-item>
            </h-form>
          </div>
          <div slot="footer">
            <div slot="footer">
              <h-button type="ghost" @click="billNoWinClose">{{$t("m.i.common.close")}}</h-button>
              <h-button type="primary" @click="billNoWinSubmit()">{{$t("m.i.common.commit")}}</h-button>
            </div>
          </div>
        </h-msg-box>

        <!-- 查询客户信息弹窗 -->
        <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose"
                           @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>
        <!-- 查询客户账号信息弹窗 -->
        <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" :cust-no="this.formItem.drwrCustNo"
                           @showCustAcctNoWinClose="showCustAcctNoWinClose" :isAllBankAcct=true
                           @custAcctNoSelectSubmit="custAcctNoSelectSubmit" ></show-cust-acct-no>
        <!-- 票面 -->
        <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"></bill-info-main>
        <!--保证金账号查询-->
        <show-deduct-acct @dueDeductAcctWinClose="dueDeductAcctWinClose" :dueDeductAcctWin="dueDeductAcctWin" :params="showParams"></show-deduct-acct>
      </h-col>
    </h-row>
  </div>
</template>

<script>
import {
  accMul,
  billMoneyDisplay,
  cmycurd,
  dateToUpper,
  formatNumber,
  getDictListByGroups,
  getDictValueFromMap,
  monthToUpper,
  numToUpper,
  post
} from "@/api/bizApi/commonUtil";
import {deepClone} from "@/utils/index";

export default {
    name: "acptPrintMain",
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
                    this.batchNoMain(params.row.id,params.row.ownedBrchNo)
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
          hiddenCol: false,
          sortable: true,
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
          title: this.$t("m.i.ce.promNoteNo"),
          key: 'promNoteNo',
          hiddenCol: false,
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
          title: this.$t("m.i.ce.drwrAcctNo"),
          key: 'drwrAcctNo',
          hiddenCol: false,
        }
      ];
      return {
        printBillMoney: "",
        vocherDataSubmit: [],
        licenseFlag:false,
        authPath: this.$route.path ,
        showBillInfoWin: false,
        billId: "",
        isPrintConfirm: false,
        isManual: false,
        formItem: {
          drwrCustNo: '',
          drwrName: '',
          drwrAcctNo: '',
          acptProtocalNoLike: '',
          batchNoLike:'',
          remitDt: '',
          acptType: '',
          billClass: 'ME01',
          curFuncNo: 'PICE010401',
          authPath:this.$route.path,
          ownedBrchNos:"",
          ownedBrchNames:"",
        },
        billManagerFormItem: {
          billNoLike: '',
          batchId: '',
          billClass: 'ME01',
          curFuncNo: 'PICE010401',
          order: 'create_time asc',
          reverseBillNo: ''
        },
        columns: columns,
        billManagerColumns: billManagerColumns,
        temp: deepClone(columns),
        billTemp: deepClone(billManagerColumns),
        batchInfoParams: {
          id: '',
          curFuncNo: 'PICE010401',
          billNoLike: "",
          reverseBillNo: ""
        },
        succeWin: false,
        printBillNos: "",
        acptTypeList: [],
        dictMap: new Map(),
        batchId: "",
        billNos: "",
        acptIds: "",
        currentSelectRow: [],
        billManagerCurrentSelectList: [],
        mainVue: true,
        billManagerVue: false,
        showCustAcctNoWin: false,
        showCustMessageWin: false,
        ifShowMore: false,
        //录入票号弹出框
        billNoWin:false,
        billNoForm:{
          billNo:""
        },
        billNoRule : [{ test: validBillNo, trigger: "blur" }],
        //查询保证金账户信息
        dueDeductAcctWin: false,
        showParams: {
          listId:"",
        }
      };
      function validBillNo(rule, val, callback) {
        let re = /^[0-9]{3}0[0-9]{2}[5][0-9]{9}$/;
        if (re.test(val)) {
          callback();
        } else {
          callback(new Error("银票号码为16位数字,第四位为0,第七位为5"));
        }
      }
    },
    mounted() {
      getDictListByGroups("AcptType").then(res => {
        this.acptTypeList = res.get("AcptType");
        this.acptTypeList = this.acptTypeList.filter(item => item.key !== "2");
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
      this.queryIsPrintConfirm();
      this.queryIsManualEntryBillNo();
    },
    methods: {
      showDueDeductAcct(id) {
        this.showParams.listId = id;
        this.dueDeductAcctWin = true;
      },

      dueDeductAcctWinClose() {
        this.dueDeductAcctWin = false;
      },
      //关闭录入票号弹出框
      billNoWinClose(){
        this.billNoForm.billNo = "";
        this.$refs.billNoForm.resetFields();
        this.billNoWin = false;
      },
      //录入票号弹出框提交按钮
      billNoWinSubmit(){
        let billNo = this.billNoForm.billNo;
        this.$refs["billNoForm"].validate(valid => {
          if (valid) {
            post({
              batchId: this.batchId,
              billNos: billNo,
              ids: this.acptIds,
              order: "create_time asc",
              licenseFlag :this.licenseFlag,
              ownedBrchNo :this.currentSelectRow.ownedBrchNo
            }, "/ce/acpt/paper/print/acptPrintMain/func_acptVochPrint").then(res => {
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  let list = res.data.retData;
                  for (let i = 0; i < list.length; i++) {
                    this.printBillNos += list[i].billNo;
                    if (i < list.length - 1) {
                      this.printBillNos += ",";
                    }
                  }
                  this.billNoWinClose();
                  this.billPrintConfirm(list);
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
      //获取业务参数
      queryIsPrintConfirm() {
        post({ paramKey: "ce.acpt.vochprint.is_manul_check_after_print" }, "/sm/auth/businessParamete/getBusinessParameter").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let paramValue = res.data.retData;
              if (paramValue === "1") {
                this.isPrintConfirm = true;
              } else {
                this.isPrintConfirm = false;
              }
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      queryIsManualEntryBillNo() {
        post({ paramKey: "ce.acpt.vochprint.is_manual_entry_bill_no" }, "/sm/auth/businessParamete/getBusinessParameter").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.isManual = "1" === res.data.retData[0];
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
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
          this.formItem.drwrCustNo = "";
          this.formItem.drwrName = "";
          this.formItem.drwrAcctNo = "";
          this.formItem.acptProtocalNoLike = "";
          this.formItem.remitDt = "";
          this.formItem.acptType = "";
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
        if (this.currentSelectRow.length == 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.batchId = this.currentSelectRow.id;
        this.billManagerFormItem.batchId = this.batchId;
        //集中授权参数赋值
        this.billManagerFormItem.licenseFlag=this.licenseFlag;
        this.billManagerFormItem.ownedBrchNo=this.currentSelectRow.ownedBrchNo;
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
      batchNoMain(str,ownedBrchNo) {
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
          this.$refs.billManagerDatagrid.dataChange(1);
        });
      },


      //票据管理子页面方法
      //表单查询
      billManagerHandleSearch() {
        this.$refs.billManagerDatagrid.selects = [];
        // this.batchInfoParams.billNoLike = this.billManagerFormItem.billNoLike;
        this.batchInfoParams.reverseBillNo = this.billManagerFormItem.reverseBillNo;
        this.$nextTick(() => {
          this.$refs.billManagerDatagrid.dataChange(1);
          this.$refs.acptBatchInfoDetail.getBatchInfo();
        });
      },
      //重置表单查询结果
      billManagerResetSearch() {
        this.$nextTick(() => {
          this.billManagerFormItem.billNoLike = "";
          this.billManagerFormItem.reverseBillNo = "";
          this.batchInfoParams.reverseBillNo = "";
        });
      },
      //凭证打印
      billPrint() {
        if (this.$refs.billManagerDatagrid.selects.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.billNos = "";
        this.acptIds = "";
        this.printBillNos = "";
        let isBillNoAllBlank = 0;//票号不为空的记录数
        for (let i = 0; i < this.$refs.billManagerDatagrid.selects.length; i++) {
          let billNo = this.$refs.billManagerDatagrid.selects[i].billNo;
          if (!!billNo) {
            isBillNoAllBlank++;
          }
          this.billNos += this.$refs.billManagerDatagrid.selects[i].billNo;
          this.acptIds += this.$refs.billManagerDatagrid.selects[i].id;
          if (i < this.$refs.billManagerDatagrid.selects.length - 1) {
            this.billNos += ",";
            this.acptIds += ",";
          }
        }
        if (this.isManual && isBillNoAllBlank === 0) {
          if (this.$refs.billManagerDatagrid.selects.length > 1) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          } else {
            this.billNoWin = true;
          }
          return;
        }
        if (isBillNoAllBlank === this.$refs.billManagerDatagrid.selects.length || isBillNoAllBlank === 0) {
          post({
            batchId: this.batchId,
            billNos: this.billNos,
            ids: this.acptIds,
            order: "create_time asc",
            licenseFlag :this.licenseFlag,
            ownedBrchNo :this.currentSelectRow.ownedBrchNo
          }, "/ce/acpt/paper/print/acptPrintMain/func_acptVochPrint").then(res => {
            if (res) {
              let msg = res.data.retMsg;
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                let list = res.data.retData;
                for (let i = 0; i < list.length; i++) {
                  this.printBillNos += list[i].billNo;
                  if (i < list.length - 1) {
                    this.printBillNos += ",";
                  }
                }
                this.billPrintConfirm(list);
              } else {
                this.$msgTip.error(this, { info: msg });
              }
            }
          }).catch(error => {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
          });
        } else {
          this.$msgTip.info(this, { info: "请选择全部已分配票号或全部未分配票号的数据!" });
        }
      },
      billPrintConfirm(vocherData) {
        let title = "提示";
        let content = `<p class="word-break">当前打印的票据号码为: ${this.printBillNos}</p>`;
        this.$hMsgBox.confirm({
          title: title,
          content: content,
          onOk: () => {
            this.handleBillPrintConfirm(vocherData);
          },
          onCancel: () => {
            this.billManagerHandleSearch();
          }
        });
      },
      handleBillPrintConfirm(vocherData) {
        this.vocherDataSubmit = [];
        for (let j = 0; j < vocherData.length; j++) {
          let printData = {};
          if (!!vocherData[j].remitDt) {
            printData.upperRemitDtYear = numToUpper(vocherData[j].remitDt.toString().substring(0, 4));
            printData.upperRemitDtMonth = monthToUpper(vocherData[j].remitDt.toString().substring(4, 6));
            printData.upperRemitDtDate = dateToUpper(vocherData[j].remitDt.toString().substring(6, 8));
          }
          debugger;
          if (!!vocherData[j].dueDt) {
            let dueDt = this.$moment(vocherData[j].dueDt, "YYYYMMDD").format("YYYY-MM-DD").split("-");
            printData.dueDt = numToUpper(dueDt[0]) + "年" + monthToUpper(dueDt[1]) + "月" + dateToUpper(dueDt[2]) + "日";
          }
          printData.flowNo = vocherData[j].flowNo;
          printData.acptProtocalNo = vocherData[j].acptProtocalNo;
          printData.batchNo = vocherData[j].batchNo;
          printData.custAcctNo = vocherData[j].custAcctNo;
          printData.custName = vocherData[j].custName;
          printData.totalAmt = vocherData[j].totalAmt;
          printData.totalFee = vocherData[j].totalFee;
          printData.totalNum = vocherData[j].totalNum;
          printData.sumVochFee = vocherData[j].sumVochFee;
          printData.acctDt = vocherData[j].acctDt;
          printData.transTm = vocherData[j].transTm;
          printData.brchName = vocherData[j].brchName;
          printData.remitDt = vocherData[j].remitDt;
          printData.drwrName = vocherData[j].drwrName;
          printData.drwrAcctNo = vocherData[j].drwrAcctNo;
          printData.drweBankName = vocherData[j].drweBankName;
          printData.pyeeName = vocherData[j].pyeeName;
          printData.pyeeAcctNo = vocherData[j].pyeeAcctNo;
          printData.pyeeBankName = vocherData[j].pyeeBankName;
          printData.drweBankNo = vocherData[j].drweBankNo;
          printData.drweBankAddr = vocherData[j].drweBankAddr;
          printData.acptBankName = vocherData[j].acptBankName;
          let billMoney = vocherData[j].billMoney === null ? "0" : vocherData[j].billMoney;
          let tempMoney = "¥" + billMoney.toString();
          printData.billMoney = cmycurd(billMoney);
          billMoneyDisplay(tempMoney, printData);
          printData.printObj = JSON.stringify(vocherData[j]);
          this.vocherDataSubmit.push(printData);
        }
        this.$print.vochPrint(this, {
          exitDataFlag: true, params: { voucherType: "PE030402", vocherData: this.vocherDataSubmit },
          callback: () => {
            if (this.isPrintConfirm) {
              this.$hMsgBox.confirm({
                title: "提示",
                content: "凭证打印成功？",
                okText: "是",
                cancelText: "否",
                onOk: () => {
                  this.billPrintSuccessConfirm();
                },
                onCancel: () => {
                  this.billManagerHandleSearch();
                }
              });
            } else {
              this.billPrintSuccessConfirm();
            }
          },
          errorCallback: () => {
            this.billManagerHandleSearch();
          }
        });
      },
      //凭证打印确认
      billPrintSuccessConfirm() {
        post({
          billNos: this.printBillNos,
          ids: this.acptIds,
          batchId: this.batchId,
          licenseFlag :this.licenseFlag,
          ownedBrchNo :this.currentSelectRow.ownedBrchNo
        }, "/ce/acpt/paper/print/acptPrintMain/func_vochPrintSuccess").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$msgTip.success(this);
              if (this.$refs.billManagerDatagrid.total === this.$refs.billManagerDatagrid.selects.length) {
                this.returnMain();
              } else {
                this.$refs.acptBatchInfoDetail.getBatchInfo();
                this.$refs.billManagerDatagrid.dataChange(this.$refs.billManagerDatagrid.$refs.gridPage.currentPage);
                this.$refs.billManagerDatagrid.selects = [];
              }
              this.printBillNos = "";
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
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
      }
    }
  };
</script>

<style scoped>

</style>
