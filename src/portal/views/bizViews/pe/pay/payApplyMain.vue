<!-- 支付申请 -->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!-- 查询表单 -->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <show-branch
                  v-model="formItem.ownedBrchNames":label="$t('m.i.common.ownedBrchNo')"
                  prop="ownedBrchNames"
                  v-if="this.licenseFlag":showCheckBox="true":brchNo.sync="formItem.ownedBrchNos":brchName.sync="formItem.ownedBrchNames"
                  :params="{authPath:this.$route.path}"
                  url="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree"
                  queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
                </show-branch>
                <h-form-item prop="pyeeName" :label="$t('m.i.billInfo.pyeeName')">
                  <h-input v-model="formItem.pyeeName" placeholder=""></h-input>
                </h-form-item>
                <h-form-item prop="payAmt" :label="$t('m.i.pe.payAmt')">
                  <h-typefield v-model="formItem.payAmt" type="money" bigTips placeholder=""></h-typefield>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid :columns="columns"
                      highlight-row
                      url="/pe/pay/payApplyMain/func_pagingQueryPayApplyInfoList"
                      :bindForm="formItem"
                      :onCurrentChange="handleCurrentChange"
                      :onCurrentChangeCancel="handleCurrentChangeCancel"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="recheck">{{$t("m.i.pe.recheck")}}</h-button>
              <h-button type="primary" @click="vochPrint" v-if="this.btnAuth.vochPrintButtun === undefined ? true : this.btnAuth.vochPrintButtun.isShow">{{$t("m.i.pe.vochPrint")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <!-- 审核弹出窗 -->
    <h-msg-box v-model="recheckWin" width="800" @on-close="recheckWinClose" class="h-form-search-layer" :maximize="true"
               :mask-closable="false">
      <p slot="header">
        <span>审核支付信息</span>
      </p>
      <div>
        <h-form :model="recheckForm" :label-width="115" ref="recheckForm" cols="2" class="h-form-search">
          <h-form-item prop="batchNo" :label="$t('m.i.common.batchNo')">
            <h-input v-model="recheckForm.batchNo" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item prop="prodName" :label="$t('m.i.common.busiType')">
            <h-input v-model="recheckForm.prodName" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item prop="brchNo" :label="$t('m.i.common.brchNo')">
            <h-input v-model="recheckForm.brchNo" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item prop="brchName" :label="$t('m.i.common.brchName')">
            <h-input v-model="recheckForm.brchName" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item prop="pyeeAcctNo" :label="$t('m.i.billInfo.pyeeAcctNo')" v-if="isPyeeAcctNoShow">
            <h-row>
              <h-col :span="spanLeft">
                <h-input v-model="recheckForm.pyeeAcctNo" placeholder="" readonly icon="android-search"
                         @on-click="queryPyeeAcctNo()" clearable @on-clear="clearVal()"></h-input>
              </h-col>
              <h-col :span="spanRight" offset="1" v-if="isShowHistButton">
                <h-button type="primary" @click="showHist()">{{$t("m.i.common.view")}}</h-button>
              </h-col>
            </h-row>
          </h-form-item>
          <h-form-item prop="pyeeAcctNo" :label="$t('m.i.billInfo.pyeeAcctNo')" v-if="!isPyeeAcctNoShow">
            <h-row>
              <h-col :span="spanLeft">
                <h-input v-model="recheckForm.pyeeAcctNo" placeholder="" :maxlength="35"  :readonly="qiyeReadonly && rejectReadonly"></h-input>
              </h-col>
              <h-col :span="spanRight" offset="1" v-if="isShowHistButton">
                <h-button type="primary" @click="showHist()">{{$t("m.i.common.view")}}</h-button>
              </h-col>
            </h-row>
          </h-form-item>
          <h-form-item prop="pyeeName" :label="$t('m.i.billInfo.pyeeName')">
            <h-input v-model="recheckForm.pyeeName" placeholder="" :readonly="qiyeReadonly"></h-input>
          </h-form-item>
          <h-form-item prop="pyeeBankNo" :label="$t('m.i.billInfo.pyeeBankNo')" :validRules="bankNoRule">
            <h-input v-model="recheckForm.pyeeBankNo" placeholder="" :maxlength="12" :readonly="qiyeReadonly && rejectReadonly"></h-input>
          </h-form-item>
          <h-form-item prop="pyeeBankName" :label="$t('m.i.billInfo.pyeeBankName')">
            <h-input v-model="recheckForm.pyeeBankName" placeholder="" :maxlength="80"  :readonly="qiyeReadonly && rejectReadonly"></h-input>
          </h-form-item>
          <h-form-item prop="operTellerName" :label="$t('m.i.common.operTellerName')">
            <h-input v-model="recheckForm.operTellerName" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item prop="payAmt" :label="$t('m.i.pe.payAmt')">
            <h-typefield v-model="recheckForm.payAmt" type="money" bigTips placeholder="" readonly></h-typefield>
          </h-form-item>
        </h-form>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="recheckWinClose">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" @click="recheckNoPassAndCancel" size="large" v-if=this.showCancelButtun>{{$t("m.i.pe.cancel")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="recheckFormSubmit()">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>

    <!-- 查询同业客户账户复核完成数据 -->
    <h-msg-box v-model="custAcctNoWin" :mask-closable="false" @on-close="handleCustAcctNoClose" :maximize="true"
               width="1000" class="h-form-table-layer" @on-maximize="onMaximize">
      <p slot="header">
        <span>查询同业客户账号信息窗口</span>
      </p>
      <!-- 查询表单 -->
      <div>
        <h-form :model="custAcctFormItem" :label-width="100" ref="custAcctFormItem" cols="4" class="h-form-search">
          <h-form-item :label="$t('m.i.common.custNo')" prop="custNo">
            <h-input v-model="custAcctFormItem.custNo" placeholder=""></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.acctNo')" prop="acctNo">
            <h-input v-model="custAcctFormItem.acctNo" placeholder=""></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.acctName')" prop="acctName">
            <h-input v-model="custAcctFormItem.acctName" placeholder=""></h-input>
          </h-form-item>
          <h-form-item class="h-form-operate">
            <h-button type="primary" @click="custAcctFormSearch()">{{$t("m.i.common.search")}}</h-button>
            <h-button type="ghost" @click="custAcctFormSearchReset()">{{$t("m.i.common.reset")}}</h-button>
          </h-form-item>
        </h-form>
      </div>
      <!--数据展示表格-->
      <h-datagrid
        :columns="showCustAcctNoColumns"
        :bindForm="custAcctFormItem"
        highlight-row
        :auto-load="false"
        :height="300"
        url="/bm/cust/bankcustacct/pageQueryBankCustAcctList"
        :onRowDbClick="doubleAcctNoHandleClick"
        :onCurrentChange="handleCustAcctChange"
        :onCurrentChangeCancel="handleCustAcctChangeCancel"
        ref="custAcctDatagrid">
      </h-datagrid>
      <div slot="footer">
        <h-button type="ghost" @click="handleCustAcctNoClose">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" @click="custAcctSubmitForm">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>

    <!-- 历史账号信息弹出框 -->
    <h-msg-box v-model="histAcctWin" width="800" @on-close="handleHistAcctClose" class="h-form-search-layer" :maximize="true"
               :mask-closable="false">
      <p slot="header">
        <span>历史修改账号信息</span>
      </p>
      <div>
      </div>
      <h-datagrid
        :columns="showHistAcctColumns"
        :bindForm="showHistAcctFormItem"
        highlight-row
        :auto-load="false"
        :height="300"
        url="/pe/pay/payApplyMain/func_pagingQueryPayHistAcct"
        ref="histAcctDatagrid">
      </h-datagrid>
      <div slot="footer">
        <h-button type="ghost" @click="handleHistAcctClose">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" @click="handleHistAcctSubmitForm">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>
  </div>
</template>

<script>
  import { post, on, off, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "payApplyMain",
    data() {
      return {
        qiyeReadonly: true,
        rejectReadonly : true,
        isShowHistButton : false,
        btnAuth:"",
        childrenBtnAuth:"",
        brchNoWin:false,
        licenseFlag:false,
        showCancelButtun:false,

        authPath: this.$route.path ,
        //是否显示更多查询项
        ifShowMore: false,
        spanLeft : 24,
        spanRight : 0,
        formItem: {
          pyeeName: "",
          payAmt: "",
          ownedBrchNos:"",
          ownedBrchNames:"",
          authPath:this.$route.path,
        },

        recheckForm: {
          id: "",
          batchNo: "",
          prodName: "",
          prodNo: "",
          brchNo: "",
          brchName: "",
          pyeeName: "",
          pyeeAcctNo: "",
          pyeeBankNo: "",
          pyeeBankName: "",
          operTellerName: "",
          payAmt: ""
        },
        columns: [
          {
            title: " ",
            type: "radio",
            align: "center",
            width: 50,
            hiddenCol: false
          },
          {
            type: "index",
            key: "numOrder",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center"
          },
          {
           title: this.$t('m.i.pe.batchIdAndYNo'),
            key: "batchNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.busiType'),
            key: "prodName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.brchName'),
            key: "brchName",
            hiddenCol: false
          },
          {
           title: this.$t('m.i.common.operTellerName'),
            key: "operTellerName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.pe.payAmt'),
            key: "payAmt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let billMoney = formatNumber(params.row.payAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: billMoney
                }
              }, billMoney);
            }
          },
          {
            title: this.$t('m.i.pe.batchStatus'),
            key: "status",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.pe.drweName'),
            key: "drweName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.billInfo.corpDrwrAcctNo'),
            key: "drweAcctNo",
            hiddenCol: false,
            sortable: true
          },
          {
           title: this.$t('m.i.billInfo.corpDrweBankNo'),
            key: "drweBankNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.billInfo.pyeeName'),
            key: "pyeeName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.billInfo.pyeeAcctNo'),
            key: "pyeeAcctNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.pyeeBankName'),
            key: "pyeeBankName",
            sortable: true,
            hiddenCol: false
          },
          {
            title:this.$t('m.i.billInfo.pyeeBankNo'),
            key: "pyeeBankNo",
            hiddenCol: false
          }, {
           title: this.$t('m.i.pe.clearStatus'),
            key: "clearStatus",
            hiddenCol: true
          }
        ],
        recheckWin: false,
        currentSelectRow: [],
        submitFlag: false,
        isPyeeAcctNoShow: false,
        custAcctFormItem: {
          flowStatus: "FS08",
          custNo: "",
          acctNo: "",
          acctName: ""
        },
        custAcctNoWin: false,
        custAcctNoCurrentSelectRow: [],
        showCustAcctNoColumns: [
          {
            title: " ",
            type: "radio",
            align: "center",
            width: 50,
            hiddenCol: false
          },
          {
            type: "index",
            key: "numOrder",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center"
          },
          {
            title:  this.$t("m.i.common.acctNo"),
            key: "acctNo",
            hiddenCol: false
          },
          {
            title:  this.$t("m.i.common.acctName"),
            key: "acctName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.openBankNo"),
            key: "openBankNo",
            hiddenCol: false
          },
          {
            title:this.$t("m.i.common.openBankName"),
            key: "openBankName",
            hiddenCol: false
          }
        ],
        histAcctWin :false,
        showHistAcctFormItem:{
          id: "",
          legalNo: "",
          payId: "",
          pyeeAcctNo: "",
          pyeeName: "",
          pyeeBankNo :"",
          pyeeBankName :"",
          operTellerNo :"",
          operTellerName :"",
          updateTime :"",
        },
        showHistAcctColumns : [
        {
          type: "index",
          key: "numOrder",
          title: this.$t("m.i.common.index"),
          width: 60,
          align: "center"
        },
        {
          title: this.$t('m.i.billInfo.pyeeAcctNo'),
          key: "pyeeAcctNo",
          hiddenCol: false,
          sortable: true
        },
        {
          title: this.$t('m.i.billInfo.pyeeName'),
          key: "pyeeName",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.billInfo.pyeeBankNo'),
          key: "pyeeBankNo",
          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.billInfo.pyeeBankName'),
          key: "pyeeBankName",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.updateTime'),
          key: "updateTime",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let date = params.row.updateTime == null ? "" : this.$moment(params.row.updateTime, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
            return h("span", date);
          }
        },
        {
          title: this.$t('m.i.common.operTellerName'),
          key: "operTellerName",
          hiddenCol: false
        }
      ],
        bankNoRule: [{ test: /^[0-9]{12}$/, trigger: "blur", message: "大额行号由12位数字组成" }]
      };
    },
    mounted() {
      this.getDictListByGroups("CreditCustType").then(res => {
        this.dictMap = res.get("map");
      });

      //按钮权限查询 控制按钮显隐
      console.log(JSON.parse(window.sessionStorage.getItem("curMenu")));
      let id = JSON.parse(window.sessionStorage.getItem("curMenu")).id;

      post({ authId: id }, "/sm/auth/buttonAuth/func_queryButtonByAuthId").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          let retMsg = res.data.retMsg;
          if (retCode === "000000") {
            this.btnAuth = JSON.parse(res.data.retData);
            if(this.btnAuth.manager!=null&&this.btnAuth.manager!=undefined){
              if(this.btnAuth.manager.children!=null&&this.btnAuth.manager.children!=undefined) {
                this.childrenBtnAuth = this.btnAuth.manager.children;
              }
            }
          } else {
            this.$msgTip.error(this, { info: retMsg });
          }
        } else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }

      });
      this.getPayModuBusiParam();
      //集中操作授权
      post({authPath:this.$route.path}, "sm/auth/licenseBrch/focusOper/func_checkLicenseAuth").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.licenseFlag = res.data.retData.licenseFlag;
          } else {
            this.$msgTip.error(this, { info: res.data.retMsg });
          }
        }else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });
    },
    methods: {
      onMaximize() {
        setTimeout(() => {
          this.$refs.custAcctDatagrid.$refs.gridContent.handleResize();
        }, 100);
      },
      queryPyeeAcctNo() {
        this.custAcctNoWin = true;
        this.$nextTick(() => {
          this.custAcctFormSearch();
        });
      },
      custAcctFormSearch() {
        this.custAcctNoCurrentSelectRow = [];
        this.$refs.custAcctDatagrid.dataChange(1);
      },
      custAcctFormSearchReset() {
        this.$refs.custAcctFormItem.resetFields();
      },
      doubleAcctNoHandleClick(arr) {
        this.custAcctNoCurrentSelectRow = arr;
        this.recheckForm.pyeeAcctNo = this.custAcctNoCurrentSelectRow.acctNo;
        this.recheckForm.pyeeName = this.custAcctNoCurrentSelectRow.acctName;
        this.recheckForm.pyeeBankNo = this.custAcctNoCurrentSelectRow.openBankNo;
        this.recheckForm.pyeeBankName = this.custAcctNoCurrentSelectRow.openBankName;
        this.handleCustAcctNoClose();
      },
      handleCustAcctChange(currentRow) {
        this.custAcctNoCurrentSelectRow = currentRow;
      },
      handleCustAcctChangeCancel() {
        this.custAcctNoCurrentSelectRow = [];
      },
      //确定
      custAcctSubmitForm() {
        if (this.custAcctNoCurrentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.recheckForm.pyeeAcctNo = this.custAcctNoCurrentSelectRow.acctNo;
        this.recheckForm.pyeeName = this.custAcctNoCurrentSelectRow.acctName;
        this.recheckForm.pyeeBankNo = this.custAcctNoCurrentSelectRow.openBankNo;
        this.recheckForm.pyeeBankName = this.custAcctNoCurrentSelectRow.openBankName;
        this.handleCustAcctNoClose();
      },
      //关闭弹窗
      handleCustAcctNoClose() {
        this.custAcctNoWin = false;
        this.custAcctNoCurrentSelectRow = [];
        this.$refs.custAcctFormItem.resetFields();
      },
      //表单查询
      handleSearch() {
        this.currentSelectRow = [];
        this.$refs.datagrid.dataChange(1);
      },
      //重置表单查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
        this.formItem.ownedBrchNos="",
        this.formItem.ownedBrchNames=""
      },
      handleCurrentChange(currentRow) {
        this.qiyeReadonly = true;
        this.rejectReadonly = true;
        this.currentSelectRow = currentRow;
        let status = this.currentSelectRow.clearStatus;
        let prodNo = this.currentSelectRow.prodNo;
        let flowStatus = this.currentSelectRow.statusCode;
        // 复核驳回允许修改账号、行名、行号
        if(flowStatus == "PIPE02011202-PIPE02010901" || flowStatus == "PIPE02011702-PIPE02010901" || flowStatus == "PIPE02011802-PIPE02010901"){
          this.rejectReadonly = false;
        }
        if (status === "20") {
          if (prodNo.substring(0, 2) === "00") {
            this.isPyeeAcctNoShow = true;
          } else {
            this.isPyeeAcctNoShow = false;
            this.qiyeReadonly = false;
            this.rejectReadonly = false;
          }
        } else {
          if (prodNo.substring(0, 2) === "00") {
            this.isPyeeAcctNoShow = true;
          } else {
            this.isPyeeAcctNoShow = false;
          }
        }
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      //审核
      recheck() {
        if (this.currentSelectRow == null || this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        let id = this.currentSelectRow.id;
        post({ id: id }, "/pe/pay/payApplyMain/func_queryApplyPayInfoById").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.recheckForm.id = res.data.retData.id;
              this.recheckForm.batchNo = res.data.retData.batchNo;
              this.recheckForm.prodName = res.data.retData.prodName;
              this.recheckForm.brchNo = res.data.retData.brchNo;
              this.recheckForm.brchName = res.data.retData.brchName;
              this.recheckForm.pyeeName = res.data.retData.pyeeName;
              this.recheckForm.pyeeAcctNo = res.data.retData.pyeeAcctNo;
              this.recheckForm.operTellerName = res.data.retData.operTellerName;
              this.recheckForm.payAmt = res.data.retData.payAmt;
              this.recheckForm.pyeeBankNo = res.data.retData.pyeeBankNo;
              this.recheckForm.pyeeBankName = res.data.retData.pyeeBankName;
              this.queryHistList(id);
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
        this.recheckWin = true;
      },
      //审核弹窗确定
      recheckFormSubmit() {
        this.$refs["recheckForm"].validate(valid => {
          if (valid) {
            let url = "/pe/pay/payApplyMain/func_commitPayInfos";
            this.submitFlag = true;
            post(this.recheckForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.recheckWinClose();
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
                  this.currentSelectRow = [];
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
      //审核弹窗关闭
      recheckWinClose() {
        this.$refs.recheckForm.resetFields();
        this.recheckWin = false;
      },
      //凭证打印
      vochPrint() {
        if (this.currentSelectRow == null || this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        this.assemblePayApplyParams();
      },
      assemblePayApplyParams() {
        let vocherData = this.deepClone([this.currentSelectRow]);
        for (let i = 0; i < vocherData.length; i++) {
          vocherData[i].payAmt = formatNumber(vocherData[i].payAmt, 2, ",");
          vocherData[i].flowNo = vocherData[i].foreFlowNo;
          vocherData[i].printObj = JSON.stringify(vocherData[i]);
        }
        this.$print.vochPrint(this, {
          exitDataFlag: true, params: { voucherType: "PE031901", vocherData: vocherData },
          callback: () => {
            this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
            this.currentSelectRow = [];
          },
          errorCallback: () => {
            this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
            this.currentSelectRow = [];
          }
        });
      },
      clearVal() {
        this.recheckForm.pyeeAcctNo = "";
        this.recheckForm.pyeeName = "";
        this.recheckForm.pyeeBankNo = "";
        this.recheckForm.pyeeBankName = "";
      },
      showHist(){
        this.showHistAcctFormItem.id = this.currentSelectRow.id;
        this.histAcctWin = true ;
        this.$nextTick(() => {
          this.$refs.histAcctDatagrid.dataChange(1);
        })
      },
      handleHistAcctClose(){
        this.histAcctWin = false ;
      },
      handleHistAcctSubmitForm(){
        this.histAcctWin = false ;
      },
      getPayModuBusiParam() {
        post({ paramKey: "pe.pay.audit_mode" }, "/sm/auth/businessParamete/getBusinessParameter").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              if (res.data.retData === "2") {
                this.showCancelButtun = true;
              } else {
                this.showCancelButtun = false;
              }
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      queryHistList(id){
        post({id: id }, "/pe/pay/payApplyMain/func_checkHasPayHistAcct").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let hasAcctHist = res.data.retData;
              let showButtun = this.btnAuth.acctHistButtun  === undefined ? true : this.btnAuth.acctHistButtun.isShow;

              if (hasAcctHist && showButtun) {
                this.spanLeft = 17;
                this.spanRight = 5;
                this.isShowHistButton = true;
              } else {
                this.spanLeft = 24;
                this.spanRight = 0;
                this.isShowHistButton = false;
              }
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });

      },
      //根据弹框所选数据进行赋值
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
      //申请直接作废
      recheckNoPassAndCancel() {
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("m.i.common.isConfirmCancel") + "?",
          onOk: () => {
            this.handleCancel();
          }
        });

      },
      handleCancel(){
        let id = this.currentSelectRow.id;
        let url = "/pe/pay/payApplyMain/func_failReCheckPay";
        post({ id: id }, url).then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.recheckWinClose();
              this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
              this.currentSelectRow = [];
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },


    }
  };
</script>

<style scoped>

</style>
