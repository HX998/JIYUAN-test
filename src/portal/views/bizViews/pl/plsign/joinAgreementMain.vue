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
                           @on-click="queryCustNo('query')" clearable @on-clear="clearVal('query')"
                           readonly></h-input>
                </h-form-item>
                <h-form-item prop="isCommit" :label="$t('m.i.pl.deleteFlag')">
                  <h-radio-group v-model="formItem.deleteFlag">
                    <h-radio label="0" @on-click="noDeleteButton">
                      <span>未解约</span>
                    </h-radio>
                    <h-radio label="1" @on-click="hasDeleteButton">
                      <span>已解约</span>
                    </h-radio>
                  </h-radio-group>
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
                url="/pl/plsign/joinAgreementMain/func_pagingBillAgreement"
                :bindForm="formItem"
                :onCurrentChange="handleCurrentChange"
                :onCurrentChangeCancel="handleCurrentChangeCancel"
                ref="datagrid">
                <div slot="toolbar" class="pull-left">
                  <h-button type="primary" @click="agreementOperate('add')">{{$t("m.i.common.add")}}</h-button>
                  <h-button type="primary" @click="agreementOperate('modify')" :disabled="formItem.deleteFlag === '1'">
                    {{$t("m.i.common.modify")}}
                  </h-button>
                  <h-button type="primary" @click="cancelAgreement" :disabled="formItem.deleteFlag === '1'">{{$t("m.i.pl.incontinue")}}
                  </h-button>
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
        <span v-if="optType==='add'">新增签约</span>
        <span v-if="optType==='modify'">修改签约</span>
      </p>
      <div>
        <h-form :model="addOrEditForm" :label-width="115" ref="addOrEditForm" cols="2" class="h-form-search">
          <h-form-item :label="$t('m.i.pl.agreementNo')" prop="agreementNo" required>
            <h-input v-model="addOrEditForm.agreementNo" :maxlength="60" readonly
                     :icon="optType==='add' ? 'android-search' : ''" @on-click="queryAgreementNo()"></h-input>
          </h-form-item>
          <h-form-item prop="custNo" :label="$t('m.i.common.custNo')" required>
            <h-input v-model="addOrEditForm.custNo" placeholder="" :icon="optType==='add' ? 'android-search' : ''"
                     @on-click="queryCustNo('add')" :clearable="optType==='add'" @on-clear="clearVal('add')" readonly></h-input>
          </h-form-item>
          <h-form-item prop="custName" :label="$t('m.i.common.custName')" required>
            <h-input v-model="addOrEditForm.custName" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item prop="custAcctNo" :label="$t('m.i.pl.custSettleAcctNo')" required>
            <h-input v-model="addOrEditForm.custAcctNo" placeholder="" readonly
                     icon="android-search"
                     @on-click="queryCustAcctNo()"></h-input>
          </h-form-item>
          <h-form-item v-if="isMultiPool!=='1'&&isShowBillBailAcctNo" prop="billBailAcctNo" :label="$t('m.i.pl.poolBillBailAcctNo')" required>
            <h-input v-model="addOrEditForm.billBailAcctNo" placeholder="" readonly :icon="optType!=='renew' ? 'android-search' : ''"
                     @on-click="queryBillBailAcctNo()"></h-input>
          </h-form-item>
          <h-form-item v-if="isMultiPool!=='1'&&isSubAcctWorks==='1'&&isShowBillBailAcctNo" prop="poolBailSubAcctNo" :label="$t('m.i.pl.poolBailSubAcctNo')" >
            <h-input v-model="addOrEditForm.poolBailSubAcctNo" placeholder="" readonly>
            </h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.pl.authorizer')" prop="authorizer" >
            <h-input v-model="addOrEditForm.authorizer" :maxlength="125"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.pl.authorizerIdcard')" prop="authorizerIdcard" :validRules="idCardRule">
            <h-input v-model="addOrEditForm.authorizerIdcard" :maxlength="18"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.pl.secondAuthorizer')" prop="secondAuthorizer">
            <h-input v-model="addOrEditForm.secondAuthorizer" :maxlength="125"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.pl.secondAuthorizerIdcard')" prop="secondAuthorizerIdcard" :validRules="idCardRule"
                       class="h-form-long-label">
            <h-input v-model="addOrEditForm.secondAuthorizerIdcard" :maxlength="18"></h-input>
          </h-form-item>
        </h-form>
        <h-form v-if="isMultiPool==='1'&&isShowBillBailAcctNo" :model="signPoolInfoListForm" :label-width="115" ref="signPoolInfoListForm"
                :cols="isSubAcctWorks==='1'?3:2" class="h-form-search">
          <div v-for="(item,index) in signPoolInfoListForm.signPoolInfoList" :key="index">
            <h-form-item prop="poolName" :label="$t('m.i.pl.poolName')" required onlyBlurRequire>
              <h-input v-model="item.poolName" placeholder="" disabled></h-input>
            </h-form-item>
            <h-form-item prop="billBailAcctNo" :label="$t('m.i.pl.poolBillBailAcctNo')" required onlyBlurRequire>
              <h-input v-model="item.billBailAcctNo" placeholder="" disabled :icon="optType!=='renew' ? 'android-search' : ''"
                       @on-click="queryBillBailAcctNo(index)"></h-input>
            </h-form-item>
            <h-form-item prop="poolBailSubAcctNo" :label="$t('m.i.pl.poolBailSubAcctNo')" v-if="isSubAcctWorks==='1'" key="poolBailSubAcctNo">
              <h-input v-model="item.poolBailSubAcctNo" placeholder="" disabled>
              </h-input>
            </h-form-item>
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
    <!--查询池保证金账户-->
    <show-cust-acct :showCustAcctWin="showCustAcctWin" :selectCustNo="addOrEditForm.custNo" :title="'查看保证金账户'"
                    :selectType="'select'" :custAcctKind="2" @showCustAcctWinClose="showCustAcctWinClose"
                    @custAcctSelect="custAcctSelect"></show-cust-acct>
    <!-- 查询客户信息弹窗 -->
    <show-sign-agreement :signAgreementWin="signAgreementWin" @signAgreementWinClose="signAgreementWinClose"
                         @signAgreementSubmit="signAgreementSubmit" :signParams="signParams"></show-sign-agreement>
    <multi-pool-bail-acct-no-show :win="multiPoolBailAcctNoWin" :params="multiPoolParams" @showMultiPoolBailAcctNoWinClose="showMultiPoolBailAcctNoWinClose"></multi-pool-bail-acct-no-show>
  </div>
</template>

<script>
  import { accDiv, accMul, formatNumber, off, on, post ,getSingleParamValuesByKeys} from "@/api/bizApi/commonUtil";
  import MultiPoolBailAcctNoShow from "../common/multiPoolBailAcctNoShow";

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
            title: this.$t("m.i.common.brchName"),
            key: "brchName",
            ellipsis: false,
            hiddenCol: false,
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
            render: (h, params) => {
              if (this.isMultiPool === '1'){
                // let attachment = "查看保证金账号";
                // return h("a", {
                //   on: {
                //     click: () => {
                //       this.showAttachDeal(params.row);
                //     }
                //   }
                // }, attachment);
              } else {
                return h("span", params.row.billBailAcctNo);
              }
            },
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
           title: this.$t("m.i.pl.deleteFlag"),
            key: "deleteFlag",
            ellipsis: false,
            hiddenCol: false,
            render: (h, params) => {
              let deleteFlag = params.row.deleteFlag;
              switch (params.row.deleteFlag) {
                case "0":
                  deleteFlag = "未解约";
                  break;
                case "1":
                  deleteFlag = "已解约";
                  break;
              }
              return h("span", deleteFlag);
            }
          }
        ];
      return {
        isSubAcctWorks:"",
        isMultiPool:"",
        billBailAcctNoIndex : "",
        multiPoolBailAcctNoWin : false,
        formItem : {
          agreementNo: "",
          custNo: "",
          custName: "",
          deleteFlag: "0",
          isJoin: "1"
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
          signFuncNo: "",
          custNo: "",
          groupCustNo : "",
          custName: "",
          isGroupCus: "",
          custAcctNo: "",
          billBailAcctNo: "",
          guarntrAgreementNo: "",
          maxMoney: "",
          authorizer: "",
          authorizerIdcard: "",
          secondAuthorizer: "",
          secondAuthorizerIdcard: "",
          discountPcet: "",
          isCheckBeforeInPool: "",
          isCollect: "",
          saleOffMode: "",
          poolBailSubAcctNo:"",
          signPoolInfoList:[],
        },
        signPoolInfoListForm:{
          signPoolInfoList:[
            // {
            //   poolInfoId:"",
            //   poolNo:"",
            //   poolName:"",
            //   billBailAcctNo:"",
            //   poolBailSubAcctNo:"",
            // }
          ],
        },
        ifShowMore : false,
        showCustCorpWin : false,
        showCustAcctNoWin : false,
        showCustAcctWin : false,
        signAgreementWin : false,
        signParams : {},
        multiPoolParams : {},
        //签约操作
        optType : "",
        //客户号弹框
        custType : "query",
        idCardRule : [{ test: /(^\d{18}$)|(^\d{17}(\d|X|x)$)/, trigger: "blur", message: "身份证输入不合法" }],
      };
    },
    components: {
      MultiPoolBailAcctNoShow,
      ShowCustAcct:() => import(/* webpackChunkName: "bm/cust/acct/showCustAcct" */`@/views/bizViews/bm/cust/acct/showCustAcct`),
      ShowCustCorp:() => import(/* webpackChunkName: "bm/cust/corp/showCustCorp" */`@/views/bizViews/bm/cust/corp/showCustCorp`)
    },
    methods: {
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
      queryBillBailAcctNo(index) {
        if (this.addOrEditForm.custNo === "") {
          this.$msgTip.info(this, { info: "请先选择客户" });
          return;
        }
        this.billBailAcctNoIndex= index;
        if(this.currentSelectRow.isCollect !== '0' && this.optType === "modify" ) {
          this.showCustAcctWin = false;
        } else {
          this.showCustAcctWin = true;
        }
      },
      //根据客户保证金账号查询框所选数据进行赋值
      custAcctSelect(info) {
        if (this.isMultiPool === '1') {
          let index = this.billBailAcctNoIndex;
          this.signPoolInfoListForm.signPoolInfoList[index].billBailAcctNo = info.custAcctNo;
          this.signPoolInfoListForm.signPoolInfoList[index].poolBailSubAcctNo = info.subAcctSrlNo; //子账号
        }else {
          this.addOrEditForm.billBailAcctNo = info.custAcctNo;
          this.addOrEditForm.poolBailSubAcctNo = info.subAcctSrlNo;
        }
        this.showCustAcctWin = false;
      },
      //客户保证金查询框关闭
      showCustAcctWinClose() {
        this.showCustAcctWin = false;
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
        this.addOrEditForm.groupCustNo = info.custNo;
        this.addOrEditForm.legalNo = info.legalNo;
        this.signPoolInfoListForm.signPoolInfoList = [];
        let data = info.signPoolInfoList;
        for (let dataKey in data) {
          this.signPoolInfoListForm.signPoolInfoList.push({
            poolInfoId: data[dataKey].id,
            poolNo: data[dataKey].poolNo,
            poolName: data[dataKey].poolName,
            billBailAcctNo:data[dataKey].billBailAcctNo,
            poolBailSubAcctNo:data[dataKey].poolBailSubAcctNo,
            legalNo:data[dataKey].legalNo
          });
        }
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
        if(optType === "query"){
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
        this.formItem.deleteFlag = "0";
        this.formSearch();
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      handleWinClose() {
        this.addOrEditWin = false;
        this.isShowBillBailAcctNo = false;
        this.$refs.addOrEditForm.resetFields();
      },
      showMultiPoolBailAcctNoWinClose(){
        this.multiPoolBailAcctNoWin = false;
      },
      agreementOperate(optType) {
        this.optType = optType;
        if (optType === "add") {
          this.$nextTick(() => {
            this.addFormReset();
          });
        } else {
          if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
            if (this.optType === "modify") {
              if (this.checkBrchNo(this.currentSelectRow.brchNo)) {
                return;
              }
            }
            this.$nextTick(() => {
              this.addOrEditForm.id = this.currentSelectRow.id;
              this.addOrEditForm.legalNo = this.currentSelectRow.legalNo;
              this.addOrEditForm.agreementNo = this.currentSelectRow.agreementNo;
              this.addOrEditForm.custNo = this.currentSelectRow.custNo;
              this.addOrEditForm.custName = this.currentSelectRow.custName;
              this.addOrEditForm.custAcctNo = this.currentSelectRow.custAcctNo;
              this.addOrEditForm.billBailAcctNo = this.currentSelectRow.billBailAcctNo;
              this.addOrEditForm.poolBailSubAcctNo = this.currentSelectRow.poolBailSubAcctNo;
              this.addOrEditForm.authorizer = this.currentSelectRow.authorizer;
              this.addOrEditForm.authorizerIdcard = this.currentSelectRow.authorizerIdcard;
              this.addOrEditForm.secondAuthorizer = this.currentSelectRow.secondAuthorizer;
              this.addOrEditForm.secondAuthorizerIdcard = this.currentSelectRow.secondAuthorizerIdcard;
              this.signPoolInfoListForm.signPoolInfoList = this.currentSelectRow.signPoolInfoList;
              if (this.addOrEditForm.billBailAcctNo === null || this.addOrEditForm.billBailAcctNo === "") {
                if (this.isMultiPool === '1') {
                  this.isShowBillBailAcctNo = true;
                } else {
                  this.isShowBillBailAcctNo = false;
                }
              } else {
                this.isShowBillBailAcctNo = true;
              }
            });
          } else {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
            this.addOrEditWin = false;
            this.isShowBillBailAcctNo = false;
            return;
          }
        }
        this.addOrEditWin = true;
      },
      addFormReset() {
        this.addOrEditForm.id = "";
        this.addOrEditForm.legalNo = "";
        this.$refs.addOrEditForm.resetFields();
        this.addOrEditForm.billBailAcctNo = "";
        this.addOrEditForm.poolBailSubAcctNo = "";
        this.signPoolInfoListForm.signPoolInfoList = [];
      },
      submitForm() {
        this.$refs["addOrEditForm"].validate(valid => {
          if (valid) {
            if (this.isMultiPool === '1') {
              this.addOrEditForm.signPoolInfoList = this.signPoolInfoListForm.signPoolInfoList;
            }
            this.submitFlag = true;
            let url = "/pl/plsign/joinAgreementMain/";
            url = this.optType === "add" ? url + "func_addJoinAgreement" : url + "func_updateJoinAgreement";
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
          if (this.checkBrchNo(this.currentSelectRow.brchNo)) {
            return;
          }
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
        post({ id: this.currentSelectRow.id }, "/pl/plsign/joinAgreementMain/func_deleteJoinAgreement").then(res => {
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
      },
      checkBrchNo(brchNo){
        let userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
        if (userInfo.brchNo !== brchNo) {
          this.$msgTip.info(this, {info: "只有签约机构才能进行此操作"});
          return true;
        }
      },
      //查看多池保证金账号
      showAttachDeal(info) {
        this.multiPoolBailAcctNoWin = true;
        this.multiPoolParams.signPoolInfoList = info.signPoolInfoList;
        this.multiPoolParams.isSubAcctWorks = this.isSubAcctWorks;
        this.multiPoolParams.optType = "renew";
        this.multiPoolParams.custNo = info.custNo;
        this.multiPoolParams.isMultiPool = this.isMultiPool;
        this.multiPoolParams.legalNo = this.info.legalNo;
      },

    },
    watch: {
      "$route": "getParams"
    },
    mounted() {
      this.getParams();
      getSingleParamValuesByKeys("bm.cust.is_sub_acct_works,pl.plsign.is_multi_pool").then(res => {
        this.isSubAcctWorks = res["bm.cust.is_sub_acct_works"];
        this.isMultiPool = res["pl.plsign.is_multi_pool"];  // 是否允许多池模式
        if (this.isSubAcctWorks==='0'){
          this.$refs.datagrid.controlColumnsHidden("poolBailSubAcctNo",true);  //不显示保证金子账号
        }
      });
    }
  };
</script>

<style scoped>

</style>
