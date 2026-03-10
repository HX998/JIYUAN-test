<!--票据池签约管理-加入签约-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <!--右侧数据展示表格-->
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.pl.agreementNo')" prop="agreementNo">
                  <h-input v-model="formItem.agreementNo" :maxlength="60"></h-input>
                </h-form-item>
                <h-form-item prop="custName" :label="$t('m.i.common.custName')">
                  <h-input v-model="formItem.custName" placeholder="" icon="android-search"
                           @on-click="queryCustNo('query')" clearable @on-clear="clearVal('custName')"
                           readonly></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.ce.signStatus')" prop="signStatus">
                  <h-select v-model="formItem.signStatus" placeholder="" showTitle>
                    <h-option v-for="item in signStatusList" :value="item.key" :key="item.key">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-row>
            <h-col span="24">
              <h-datagrid
                :columns="columns"
                highlightRow
                url="/pl/plsign/preAgreementMain/func_pagingWaitAcceptAgreement"
                :bindForm="formItem"
                :onCurrentChange="handleCurrentChange"
                :onCurrentChangeCancel="handleCurrentChangeCancel"
                ref="datagrid">
                <div slot="toolbar" class="pull-left">
                  <h-button type="primary" @click="agreementOperate('accept')" :disabled="isAcceptAllow">{{$t("m.i.common.acceptance")}}</h-button>
                  <h-button type="primary" @click="agreementOperate('modify')" :disabled="isEditAllow">{{$t("m.i.common.modify")}}</h-button>
                  <h-button type="primary" @click="cancelAgreement" :disabled="isCancelAllow">{{$t("m.i.pl.incontinue")}}</h-button>
                  <h-button type="primary" @click="queryOperateLog()">{{$t("m.i.pl.showOperLog")}}</h-button>
                </div>
              </h-datagrid>
            </h-col>
          </h-row>
        </div>
      </h-col>
    </h-row>
    <!--点击签约弹出窗-->
    <h-msg-box v-model="addOrEditWin" width="800" :mask-closable="false" @on-close="handleWinClose"
               class="h-form-search-layer" :maximize="true">
      <p slot="header">
        <span v-if="optType==='accept'">签约受理</span>
        <span v-if="optType==='modify'">修改签约</span>
      </p>
      <div>
        <h-form :model="addOrEditForm" :label-width="115" ref="addOrEditForm" cols="2" class="h-form-search">
          <h-form-item prop="custNo" :label="$t('m.i.common.custNo')" required>
            <h-input v-model="addOrEditForm.custNo" placeholder=""  readonly></h-input>
          </h-form-item>
          <h-form-item prop="custName" :label="$t('m.i.common.custName')" required>
            <h-input v-model="addOrEditForm.custName" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item prop="custAcctNo" :label="$t('m.i.pl.custSettleAcctNo')" required>
            <h-input v-model="addOrEditForm.custAcctNo" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item prop="operResult" :label="$t('m.i.ce.operFlag')"  required  v-if="isShowOperResult">
            <h-select v-model="addOrEditForm.operResult" placeholder="" @on-change="operFlagChange">
              <h-option value="0">拒绝</h-option>
              <h-option value="1">同意</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.ce.dealRemark')" prop="operRemark" v-if="addOrEditForm.operResult === '0'"
                       class="h-form-height-auto" cols="2">
            <h-input type="textarea" :rows=3 v-model="addOrEditForm.operRemark" :canResize="false"
                     :maxlength="500" ></h-input>
          </h-form-item>

          <div v-if="(isRefuse!=null && isRefuse)">
            <div v-if="!(addOrEditForm.operResult === '0') ">
              <h-form-item :label="$t('m.i.pl.agreementNo')" prop="agreementNo" required>
                <h-input v-model="addOrEditForm.agreementNo" :maxlength="60" readonly ></h-input>
              </h-form-item>
              <h-form-item prop="billBailAcctNo" :label="$t('m.i.pl.poolBillBailAcctNo')" v-if="isShowBillBailAcctNo"
                           required>
                <h-input v-model="addOrEditForm.billBailAcctNo" placeholder="" readonly
                         :icon="optType!=='renew' ? 'android-search' : ''"
                         @on-click="queryBillBailAcctNo()"></h-input>
              </h-form-item>
              <h-form-item prop="poolBailSubAcctNo" :label="$t('m.i.pl.poolBailSubAcctNo')"
                           v-if="isSubAcctWorks==='1'&&isShowBillBailAcctNo">
                <h-input v-model="addOrEditForm.poolBailSubAcctNo" placeholder="" readonly>
                </h-input>
              </h-form-item>
              <h-form-item :label="$t('m.i.pl.authorizer')" prop="authorizer">
                <h-input v-model="addOrEditForm.authorizer" :maxlength="125" :readonly="optType!='modify'"></h-input>
              </h-form-item>
              <h-form-item :label="$t('m.i.pl.authorizerIdcard')" prop="authorizerIdcard" :validRules="idCardRule">
                <h-input v-model="addOrEditForm.authorizerIdcard" :maxlength="18" :readonly="optType!='modify'"></h-input>
              </h-form-item>
              <h-form-item :label="$t('m.i.pl.secondAuthorizer')" prop="secondAuthorizer">
                <h-input v-model="addOrEditForm.secondAuthorizer" :maxlength="125" :readonly="optType!='modify'"></h-input>
              </h-form-item>
              <h-form-item :label="$t('m.i.pl.secondAuthorizerIdcard')" prop="secondAuthorizerIdcard"
                           :validRules="idCardRule"
                           class="h-form-long-label">
                <h-input v-model="addOrEditForm.secondAuthorizerIdcard" :maxlength="18" :readonly="optType!='modify'"></h-input>
              </h-form-item>
              <h-form-item :label="$t('m.i.pl.fee')" prop="fee" required>
                <h-row>
                  <h-typefield type="money" v-model="addOrEditForm.fee" :maxlength="20"
                               :readonly="this.addOrEditForm.operType != '0'"
                               placeholder="数字，小数位最多2位" bigTips divided></h-typefield>
                </h-row>
              </h-form-item>
            </div>
          </div>



        </h-form>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="handleWinClose">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="submitForm">{{$t("m.i.common.commit")}}</h-button>

      </div>
    </h-msg-box>
    <!--查看企业客户-->
    <show-cust-corp :showCustCorpWin="showCustCorpWin" :title="'查询客户信息窗口'" @showCustCorpWinClose="showCustCorpWinClose"
                    @custSelect="custCorpSelect"></show-cust-corp>
    <!-- 查询客户结算账号 -->
    <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" :cust-no="this.addOrEditForm.custNo"
                       @showCustAcctNoWinClose="showCustAcctNoWinClose" :custAcctKind="1"
                       @custAcctNoSelectSubmit="custAcctNoSelectSubmit"></show-cust-acct-no>
    <!--查询票据池保证金账户-->
    <show-pool-acct :showPoolAcctWin="showPoolAcctWin" :selectCustNo="addOrEditForm.custNo" :title="'查看保证金账户'"
                    @showPoolAcctWinClose="showPoolAcctWinClose" :custAcctKind="2"
                    @poolAcctSelect="poolAcctSelect"></show-pool-acct>
    <!-- 查询客户信息弹窗 -->
    <show-sign-agreement :signAgreementWin="signAgreementWin" @signAgreementWinClose="signAgreementWinClose"
                         @signAgreementSubmit="signAgreementSubmit" :signParams="signParams"></show-sign-agreement>
    <!--查看操作历史-->
    <agreement-Log :agreementLogWin="agreementLogWin" :logFormItem="logFormItem" :dictMap="dictMap"
                   :histListUrl = "'/pl/plsign/agreementLog/func_pagingagreementLog'"
                   @agreementLogWinClose="agreementLogWinClose"></agreement-Log>
  </div>
</template>

<script>
  import {formatNumber, getSingleParamValuesByKeys, post} from "@/api/bizApi/commonUtil";


  export default {
    name: "joinAgreementMain",
    data() {
      let columns = [
          {
            type: "radio",
            title: " ",
            key: "multiSelect",
            width: 60,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
           title: this.$t("m.i.pl.agreementNo"),
            key: "agreementNo",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          },
          {
            title: this.$t("m.i.pl.signCustNo"),
            key: "custNo",
            ellipsis: false,
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.custName"),
            key: "custName",
            ellipsis: false,
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.pl.custSettleAcctNo"),
            key: "custAcctNo",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("m.i.pl.poolBillBailAcctNo"),
            key: "billBailAcctNo",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t('m.i.pl.poolBailSubAcctNo'),
            key: "poolBailSubAcctNo",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("m.i.pl.authorizer"),
            key: "authorizer",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.pl.authorizerIdcard"),
            key: "authorizerIdcard",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.pl.secondAuthorizer"),
            key: "secondAuthorizer",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("m.i.pl.secondAuthorizerIdcard"),
            key: "secondAuthorizerIdcard",
            hiddenCol: false,
            ellipsis: false
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
            title: this.$t("m.i.ce.signStatus"),
            key: "signStatus",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "PoolSignStatus", params.row.signStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          }

        ];
      return {
        //受理结果,0-拒绝,1-同意
        isRefuse : null,
        isAcceptAllow: true,
        isEditAllow: true,
        isCancelAllow: true,
        isShowOperResult:true,
        signStatusList : [],
        isSubAcctWorks:"",
        formItem : {
          agreementNo: "",
          custNo: "",
          custName: "",
          deleteFlag: "0",
          isJoin: "1",
          signStatus:"PS01"
        },
        columns : columns,
        cloneColumns : this.deepClone(columns),
        currentSelectRow : [],
        addOrEditWin : false,
        submitFlag : false,
        isShowBillBailAcctNo : false,
        addOrEditForm : {
          id: "",
          legalNo: "",
          agreementNo: "",
          signStartDt: "",
          signEndDt: "",
          custNo: "",
          custName: "",
          custAcctNo: "",
          billBailAcctNo: "",
          authorizer: "",
          authorizerIdcard: "",
          secondAuthorizer: "",
          secondAuthorizerIdcard: "",
          poolBailSubAcctNo:"",
          isJoin:"1",
          fee: "",
          operType:"",
          operResult:"",
          operRemark:"",
          dataSource: "0"
        },
        ifShowMore : false,
        showCustCorpWin : false,
        showCustAcctNoWin : false,
        showPoolAcctWin : false,
        signAgreementWin : false,
        //查询操作历史弹出框
        agreementLogWin : false,
        logFormItem:{
          agreeId:""
        },
        signParams : {},
        dictMap : new Map(),
        //签约操作
        optType : "",
        //客户号弹框
        custType : "query",
        idCardRule : [{ test: /(^\d{18}$)|(^\d{17}(\d|X|x)$)/, trigger: "blur", message: "身份证输入不合法" }],
      };
    },
    components: {
      ShowSignAgreement:() => import(/* webpackChunkName: "pl/common/showSignAgreement" */`@/views/bizViews/pl/common/showSignAgreement`),
      ShowCustAcct:() => import(/* webpackChunkName: "bm/cust/acct/showCustAcct" */`@/views/bizViews/bm/cust/acct/showCustAcct`),
      ShowCustCorp:() => import(/* webpackChunkName: "bm/cust/corp/showCustCorp" */`@/views/bizViews/bm/cust/corp/showCustCorp`),
      agreementLog:() => import(/* webpackChunkName: "pl/plsign/agreementLog" */`@/views/bizViews/pl/plsign/agreementLog`),
    },
    methods: {
      operFlagChange(currentValue) {
        if (currentValue === "0") {//拒绝
          this.isRefuse = false;
        } else if (currentValue === "1") {//同意
          this.isRefuse = true;
          this.addOrEditForm.acceptRemark = "";
        } else {
          this.isRefuse = null;
          this.addOrEditForm.acceptRemark = "";
        }
      },
      //查询客户信息
      queryCustNo(custType) {
        this.showCustCorpWin = true;
        this.custType = custType;
      },
      //赋值
      custCorpSelect(info) {
        this.showCustCorpWin = false;
        if (this.custType === "query") {
          this.formItem.custNo = info.custNo;
          this.formItem.custName = info.custName;
        } else if (this.custType === "add") {
          this.addOrEditForm.custNo = info.custNo;
          this.addOrEditForm.custName = info.custName;
        }
      },
      //关闭
      showCustCorpWinClose() {
        this.showCustCorpWin = false;
      },
      //查询客户结算账户
      queryCustAcctNo() {
        if (this.addOrEditForm.custNo === "") {
          this.$msgTip.info(this, { info: "请先选择客户" });
          return;
        }
        this.showCustAcctNoWin = true;
      },
      //根据客户账号查询框所选数据进行赋值
      custAcctNoSelectSubmit(info) {
        this.addOrEditForm.custAcctNo = info.custAcctNo;
        this.showCustAcctNoWin = false;
      },
      //客户账号查询框关闭
      showCustAcctNoWinClose() {
        this.showCustAcctNoWin = false;
      },
      //查询池保证金账号
      queryBillBailAcctNo() {
        if (this.addOrEditForm.custNo === "") {
          this.$msgTip.info(this, { info: "请先选择客户" });
          return;
        }
        this.showPoolAcctWin = true;
      },
      //根据客户保证金账号查询框所选数据进行赋值
      poolAcctSelect(info) {
        this.addOrEditForm.billBailAcctNo = info.custAcctNo;
        this.addOrEditForm.poolBailSubAcctNo = info.subAcctSrlNo;
        this.showPoolAcctWin = false;
      },
      //客户保证金查询框关闭
      showPoolAcctWinClose() {
        this.showPoolAcctWin = false;
      },
      //查询签约信息
      queryAgreementNo() {
        this.signParams.isMainGroupCus = "1";
        this.signParams.is = "1";
        this.signParams.agreementUrl = "/pl/plsign/joinAgreementMain/func_pagingBillAgreement";
        this.signAgreementWin = true;
      },
      //赋值
      signAgreementSubmit(info) {
        this.addOrEditForm.agreementNo = info.agreementNo;
        if(info.isCollect === '0'){
          this.isShowBillBailAcctNo = true;
        }else{
          this.isShowBillBailAcctNo = false;
        } ;
        this.signAgreementWin = false;
      },
      //关闭
      signAgreementWinClose() {
        this.signParams = {};
        this.signAgreementWin = false;
      },
      //未解约
      noDeleteButton() {
        this.formItem.deleteFlag = "0";
        this.formSearch();
      },
      //已解约
      hasDeleteButton() {
        this.formItem.deleteFlag = "1";
        this.formSearch();
      },
      //搜索选择框清空事件
      clearVal(optType){
        if(optType === "custName"){
          this.formItem.custName = "";
          this.formItem.custNo = "";
        }
        if(optType === "add"){
          this.addOrEditForm.custName = "";
          this.addOrEditForm.custNo = "";
        }
      },
      formSearch() {
        this.currentSelectRow = [];
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.formItem.custNo = "";
        this.formItem.signEndDt = "";
        this.$refs.formItem.resetFields();
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
        /* PS01 签约待受理：修改、解约按钮显灰，受理、查看操作历史按钮正常显示
           PS07 签约已生效：受理按钮显灰，修改、解约、查看操作历史按钮正常显示
          */
        if (currentRow.signStatus === "PS01") {
          this.isAcceptAllow = false;
          this.isEditAllow = true;
          this.isCancelAllow = true;
        } else if (currentRow.signStatus === "PS07") {
          this.isAcceptAllow = true;
          this.isEditAllow = false;
          this.isCancelAllow = false;
        }
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      handleWinClose() {
        this.addOrEditWin = false;
        this.isShowBillBailAcctNo = false;
        this.$refs.addOrEditForm.resetFields();
      },
      queryOperateLog() {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          this.agreementLogWin = true;
          this.logFormItem.agreeId = this.currentSelectRow.id;
        } else {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
        }
      },
      agreementLogWinClose() {
        this.agreementLogWin = false;
        this.logFormItem = {};
      },
      agreementOperate(operateType) {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          post({id: this.currentSelectRow.id}, "/pl/plsign/preAgreementMain/func_getPreAgreement").then(res => {
            if (res) {
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.addOrEditForm.id = res.data.retData.id;
                this.addOrEditForm.legalNo = res.data.retData.legalNo;
                this.addOrEditForm.agreementNo = res.data.retData.agreementNo;
                this.addOrEditForm.custNo = res.data.retData.custNo;
                this.addOrEditForm.custName = res.data.retData.custName;
                this.addOrEditForm.custAcctNo = res.data.retData.custAcctNo;
                this.addOrEditForm.billBailAcctNo = res.data.retData.billBailAcctNo;
                this.addOrEditForm.poolBailSubAcctNo = res.data.retData.poolBailSubAcctNo;
                this.addOrEditForm.authorizer = res.data.retData.authorizer;
                this.addOrEditForm.authorizerIdcard = res.data.retData.authorizerIdcard;
                this.addOrEditForm.secondAuthorizer = res.data.retData.secondAuthorizer;
                this.addOrEditForm.secondAuthorizerIdcard = res.data.retData.secondAuthorizerIdcard;
                if (res.data.retData.isCollect === '0') {
                  this.isShowBillBailAcctNo = true;
                } else {
                  this.isShowBillBailAcctNo = false;
                }
                this.addOrEditForm.signStartDt = res.data.retData.signStartDt;
                this.addOrEditForm.signEndDt = res.data.retData.signEndDt;
                this.addOrEditForm.fee = res.data.retData.fee;
                this.addOrEditForm.operType = res.data.retData.operType;

                //页面发起的修改，隐藏受理结果
                if (operateType == 'modify') {
                  this.addOrEditForm.dataSource ="1";
                  this.optType = "modify";
                  this.isShowOperResult = false;
                  this.addOrEditForm.operResult = '1';
                  this.addOrEditForm.operType = "1";
                  this.isRefuse = true;
                } else {
                  this.optType = "accept";
                }

              } else {
                this.$msgTip.error(this, {info: res.data.retMsg});
              }
            } else {
              this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
            }
          });
        } else {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
          this.addOrEditWin = false;
          this.isShowBillBailAcctNo = false;
          return;
        }
        this.addOrEditWin = true;
      },
      addFormReset() {
        this.addOrEditForm.id = "";
        this.addOrEditForm.legalNo = "";
        this.$refs.addOrEditForm.resetFields();
        this.addOrEditForm.billBailAcctNo = "";
        this.addOrEditForm.poolBailSubAcctNo = "";
      },
      submitForm() {
        this.$refs["addOrEditForm"].validate(valid => {
          if (valid) {
            this.submitFlag = true;
            let url = "/pl/plsign/preAgreementMain/";
            url = (this.optType === "modify" || this.addOrEditForm.operType === "1") ? url + "func_modifyAccept" : url + "func_acceptSign";
            post(this.addOrEditForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.addOrEditWin = false;
                  this.isShowBillBailAcctNo=false;
                  let pageNo = this.optType === "add" ? 1 : this.$refs.datagrid.pageInfo.pageNo;
                  this.$refs.datagrid.dataChange(pageNo);
                  this.currentSelectRow = [];
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      cancelAgreement() {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: "确定解约该签约信息吗?",
            onOk: () => {
              this.handleCancel();
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      handleCancel() {
        post({ id: this.currentSelectRow.id }, "/pl/plsign/preAgreementMain/fun_cancelAgreement").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.currentSelectRow = [];
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      getParams(){
        if (this.$route.path === "/pl/plsign/joinAgreementMain") {
          if (this.$route.query.signEndDt) {
            this.formItem.signEndDt = this.$moment(this.$route.query.signEndDt, "YYYY-MM-DD").format("YYYYMMDD");
            this.$nextTick(() => {
              this.formSearch();
            });
          }
        }
      }
    },
    watch: {
      "$route": "getParams"
    },
    mounted() {
      this.getDictListByGroups("PoolSignStatus,SignLogOperType").then(res => {
        this.signStatusList = res.get("PoolSignStatus");
        this.signStatusList = this.signStatusList.filter(item => item.key === "PS01" || item.key === "PS07");
        this.dictMap = res.get("map");
      });
      this.getParams();
      getSingleParamValuesByKeys("bm.cust.is_sub_acct_works").then(res => {
        this.isSubAcctWorks = res["bm.cust.is_sub_acct_works"];
        if (this.isSubAcctWorks==='0'){
          this.$refs.datagrid.controlColumnsHidden("poolBailSubAcctNo",true);  //不显示保证金子账号
        }
      });
    }
  };
</script>

<style scoped>

</style>
