<!--标票追索申请-发出追索-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <!--标票产品名称-->
                <common-input :label="$t('m.i.bs.stdProductName')" prop="stdProductNameLike"
                              v-model="formItem.stdProductNameLike" showIcon @on-click="queryProductName"
                              :maxlength="60" lengthByByte></common-input>
                <!--票号-->
                <common-input :label="$t('m.i.billInfo.billNo')" prop="billNoLike" v-model="formItem.billNoLike" :maxlength=30
                              type="int"></common-input>
                <!--出票日期-->
                <common-date-picker :label="$t('m.i.billInfo.remitDt')" prop="remitDt" v-model="remitDt"
                                    type="daterange" :autoPlacement="true"
                                    @on-change="handleRemitDtChange"></common-date-picker>
                <!--票面金额-->
                <bill-money-range v-model="formItem" :rangeProps="['minBillMoney','maxBillMoney']" :bigTips="false"
                                  :label="$t('m.i.billInfo.billMoneyByUnit')"></bill-money-range>

                <!--汇票到期日-->
                <common-date-picker :label="$t('m.i.billInfo.dueDt')" prop="dueDt" v-model="dueDt" type="daterange"
                                    :autoPlacement="true" @on-change="handleDueDtChange"></common-date-picker>
                <!--出票人全称-->
                <common-input :label="$t('m.i.billInfo.drwrName')" prop="drwrNameLike"
                              v-model="formItem.drwrNameLike"></common-input>

                <!--承兑人全称-->
                <common-input :label="$t('m.i.billInfo.acptName')" prop="acptNameLike"
                              v-model="formItem.acptNameLike"></common-input>

                <query-btn :advanceShow="true" @showChange="showChange" :formSearch="handleSearch"
                           :formSearchReset="resetSearch"></query-btn>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            highlight-row
            url="/bs/corpstdbill/recourse/stdRecourseApply/func_queryStayRecourseNoticeDraft"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="recourseApply()" >{{$t('m.i.bs.recourseNotice')}}</h-button>
              <h-button type="primary" @click="recourseStatusSync()" v-if="isBbsp">{{$t('m.i.bs.synch')}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--发起追索弹出窗-->
    <h-msg-box v-model="addOrEditWin" width="800" :mask-closable="false" @on-close="handleWinClose"
               class="h-form-search-layer" :maximize="true">
      <p slot="header">
        <span>追索通知</span>
      </p>
      <div>
        <h-form :model="addForm" :label-width="115" ref="addForm" cols="2" class="h-form-search">
          <h-form-item :label="$t('m.i.billInfo.billNo')" prop="billNo" :validRules="billNoRule" :required="isRequired">
            <h-input v-model="addForm.billNo" :maxlength="30" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.ce.recourseType')" prop="recourseType" :required="isRequired">
            <h-select v-model="addForm.recourseType" readonly placeholder="" @on-change="recourseTypeChange" showTitle>
              <h-option v-for="item in recourseTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.ce.recourseMoney')" prop="recourseAmt" :required="isRequired" :validRules="recourseMoneyRule">
            <h-typefield type="money" v-model="addForm.recourseAmt" :maxlength="20" placeholder="数字，小数位最多2位"
                     @on-blur="formatRecourseAmt('blur')" @on-focus="formatRecourseAmt('focus')"></h-typefield>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.billMoney')" prop="billMoney" :required="isRequired">
            <h-typefield type="money" bigTips v-model="addForm.billMoney" :maxlength="20" placeholder="数字，小数位最多2位"
                     @on-blur="formatBillMoney('blur')" @on-focus="formatBillMoney('focus')" readonly></h-typefield>
          </h-form-item>
          <h-form-item :label="$t('m.i.ce.recourseDt')" prop="recourseDt" :required="isRequired">
            <h-date-picker type="date" v-model="addForm.recourseDt" placeholder="" showFormat :editable=false
                           readonly></h-date-picker>
          </h-form-item>
          <h-form-item :label="$t('m.i.ce.receiverName')" prop="rcvgName" :required="isRequired">
            <h-input v-model="addForm.rcvgName" readonly icon="android-search" @on-click="queryRecourses()"
                     :maxlength="60" clearable @on-clear="clearReceiverName()"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.ce.receiverAcctNo')" prop="rcvgAcctNo" >
            <h-input v-model="addForm.rcvgAcctNo" :maxlength="32" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.ce.rcvgBankNo')" prop="rcvgBankNo"  class="h-form-long-label">
            <h-input v-model="addForm.rcvgBankNo" :maxlength="60" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.ce.rcvgOrgCode')" prop="rcvgOrgCode"  class="h-form-long-label">
            <h-input v-model="addForm.rcvgOrgCode" :maxlength="10" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.ce.recourseReasonCode')" prop="recourseReasonCode" :required="addForm.recourseType==='RT01'">
            <h-select v-model="addForm.recourseReasonCode" placeholder="" showTitle>
              <h-option v-for="item in recourseReasonCodeList" :value="item.key" :key="item.value">{{ item.value }}
              </h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.ce.recourseRemark')" prop="recourseRemark" class="h-form-height-auto">
            <h-input type="textarea" :rows=3 v-model="addForm.recourseRemark" :canResize="false"
                     :maxlength="256" lengthByByte></h-input>
          </h-form-item>
        </h-form>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="handleWinClose">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" @click="submitForm">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>
    <!--查询可追索对象弹出框-->
    <std-recourses-search :showRecoursesWin="showRecoursesWin" :recoursesParam="recoursesParam"
                      @recoursesChange="recoursesChange"
                      @showRecoursesWinlose="showRecoursesWinlose"></std-recourses-search>
    <!--票面信息-->
    <bill-info-main-std @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="billId" :billNo="billNo" :listId="listId"></bill-info-main-std>
    <show-cpes-branch :showCpesBranch="showCpesProductBranch" @showCpesBranchClose="showCpesProductBranchClose"
                      :showMemberId="false" :memberId="memberId" :brchType="productBrchType"
                      @showCpesBranchSubmit="showCpesProductBranchSubmit"></show-cpes-branch>



  </div>
</template>

<script>
  import { on, off, post, formatNumber } from "@/api/bizApi/commonUtil";
  export default {
    name: "stdRecourseApply",
    data() {
      return {
        ifShowMore : false,
        //给按钮增加权限
        authObj : {
          recourseApplyAuth: true           //发起追索
        },
        columns : [
          {
            type: "radio",
            title: " ",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            type: "index",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center"
          },
          {
            title: this.$t('m.i.bs.stdProductName'),
            key: "stdProductName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.billNo"),
            key: "billNo",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('a', {
                on: {
                  click: () => {
                    this.billInfoWinOpen(params.row.billId, params.row.billNo,params.row.id)
                  }
                }
              }, params.row.billNo)
            }
          },
          {
            title: this.$t("m.i.billInfo.ecdsBillStatus"),
            key: "ecdsBillStatus",
            ellipsis: false,
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "EcdsBillStatusCode", params.row.ecdsBillStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",
            hiddenCol: false,
            ellipsis: false,
            sortable: true,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.billInfo.billMoneyByUnit"),
            key: "billMoney",
            hiddenCol: false,
            ellipsis: false,
            align: "right",
            sortable: true,
            render: (h, params) => {
              let billMoney = formatNumber(params.row.billMoney, 2, ",");
              return h("span", {
                domProps: {
                  title: billMoney
                }
              }, billMoney);
            }
          },
          {
            title: this.$t("m.i.billInfo.remitDt"),
            key: "remitDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.remitDt == null ? "" : this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.billInfo.dueDt"),
            key: "dueDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.dueDt == null ? "" : this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
           title: this.$t("m.i.billInfo.drwrName"),
            key: "drwrName",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          },
          {
            title: this.$t("m.i.billInfo.drwrAcctNo"),
            key: "drwrAcctNo",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          },
          {
            title: this.$t("m.i.billInfo.pyeeName"),
            key: "pyeeName",
            hiddenCol: false,
            sortable: true,
            ellipsis: false
          },
          {
            title: this.$t("m.i.billInfo.pyeeAcctNo"),
            key: "pyeeAcctNo",
            hiddenCol: false,
            sortable: true,
            ellipsis: false
          },
          {
            title: this.$t("m.i.billInfo.acptName"),
            key: "acptName",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          },
          {
            title: this.$t("m.i.billInfo.acptBankName"),
            key: "acptBankName",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          },
        ],
        formItem : {
          stdProductNo: "",
          stdProductNameLike:"",
          recourseType: "",
          billNoLike: "",
          minRemitDt:"",
          maxRemitDt:"",
          minBillMoney:"",
          maxBillMoney:"",
          minDueDt:"",
          maxDueDt:"",
          billType: "",
          drwrNameLike: "",
          acptNameLike: "",
          isRecourse: "",
          ownedBrchName: "",
          ownedBrchNo: "",
          ownedBrchNames:"",
          ownedBrchNos:"",
          authPath: this.$route.path,
          busiType: "RA",
        },
        addForm : {
          billNo: "",
          dpstBillId:"",
          recourseType: "",
          recourseAmt: "",
          billMoney: "",
          recourseDt : this.$moment(window.sessionStorage.getItem("workDate")).format("YYYYMMDD"),
          rcvgName: "",
          rcvgAcctNo: "",
          rcvgBankNo: "",
          rcvgOrgCode: "",
          recourseReasonCode: "",
          recourseRemark: "",
          ecdsBillStatus: "",
          isRecourse: "",
          ownedBrchNo: "",
          licenseFlag: false
        },
        billNoRule : [{ test: /^[0-9]{0,30}$/, trigger: "blur", message: "只能输入数字" }],
        recourseMoneyRule: [{ test: this.validateRecourseMoney, trigger: ["blur","change"] }],
        isRequired : true,
        addOrEditWin : false,
        submitFlag : false,
        currentSelectRow : null,
        recourseTypeList : [],
        billTypeList : [],
        isRecourseList : [],
        remitDt: [],
        dueDt: [],
        recourseReasonCodeList : [],
        dictMap : new Map(),
        showRecoursesWin : false,
        showCpesProductBranch: false,
        recoursesParam : {
          billId: "",
          ecdsAcctNo: "",
          billNo: "",
        },
        memberId: JSON.parse(window.sessionStorage.getItem('userInfo')).memberId,
        productBrchType: "4",
        dpstBillId:"",
        ownedBrchName: "",
        ownedBrchNo: "",
        ownedBrchNames: "",
        ownedBrchNos: "",
        licenseFlag: false,
        authPath: this.$route.path,
        isBbsp: false,
        showBillInfoWin: false,
        billId: "",
        billNo: "",
        listId:""
      }
    },
    components: {
      stdRecoursesSearch: () => import(/* webpackChunkName: "bs/corpstdbill/recourse/stdRecoursesSearch" */ '@/views/bizViews/bs/corpstdbill/recourse/stdRecoursesSearch'),
      ShowCpesBranch:()=>import(/* webpackChunkName: "shcpe/cpes/branch/showCpesBranch" */`@/views/bizViews/shcpe/cpes/branch/showCpesBranch`),
    },
    methods: {
      handleSearch(pageNo) {
        this.currentSelectRow = [];
        this.$refs.datagrid.dataChange(!!pageNo ? pageNo : 1);
      },
      resetSearch() {
        this.formItem.minDueDt="";
        this.formItem.maxDueDt="";
        this.dueDt = [];
        this.formItem.minRemitDt="";
        this.formItem.maxRemitDt="";
        this.remitDt = [];
        this.formItem.stdProductNo="";
        this.$refs.formItem.resetFields();
      },
      showChange(val) {
        this.ifShowMore = val;
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      handleWinClose() {
        this.addOrEditWin = false;
        this.addForm.ecdsBillStatus = "";
        this.addForm.isRecourse = "";
        this.$refs.addForm.resetFields();
      },
      handleRemitDtChange(arr) {
        if (arr && arr.length >= 2) {
          this.formItem.minRemitDt = arr[0].replace(/-/g, "");
          this.formItem.maxRemitDt = arr[1].replace(/-/g, "");
          this.remitDt = [arr[0], arr[1]];
        } else {
          this.formItem.minRemitDt = "";
          this.formItem.maxRemitDt = "";
          this.remitDt = [];
        }
      },
      handleDueDtChange(arr) {
        if (arr && arr.length >= 2) {
          this.formItem.minDueDt = arr[0].replace(/-/g, "");
          this.formItem.maxDueDt = arr[1].replace(/-/g, "");
          this.dueDt = [arr[0], arr[1]];
        } else {
          this.formItem.minDueDt = "";
          this.formItem.maxDueDt = "";
          this.dueDt = [];
        }
      },
      queryProductName() {
        this.showCpesProductBranch = true;
      },
      showCpesProductBranchClose() {
        this.showCpesProductBranch = false;
      },
      showCpesProductBranchSubmit(info) {
        if (info === null) {
          this.$msgTip.info(this, {info: "请先选择记录！"});
          return;
        }
        this.formItem.stdProductNo = info.brchCode;
        this.formItem.stdProductNameLike = info.brchFullNameZh;
        // this.$parent.validateField('buyProductName');
        this.showCpesProductBranch = false;
      },

      formatRecourseAmt(optType) {
        if (optType === "blur") {
          if (!isNaN(parseFloat(this.addForm.recourseAmt)) && isFinite(this.addForm.recourseAmt)) {
            this.addForm.recourseAmt = this.addForm.recourseAmt == null ? "0.00" : formatNumber(this.addForm.recourseAmt, 2, ",");
          }
        } else if (optType === "focus") {
          this.addForm.recourseAmt = this.addForm.recourseAmt.toString().replace(/,/g, "");
        }
      },
      formatBillMoney(optType) {
        if (optType === "blur") {
          if (!isNaN(parseFloat(this.addForm.billMoney)) && isFinite(this.addForm.billMoney)) {
            this.addForm.billMoney = this.addForm.billMoney == null ? "0.00" : formatNumber(this.addForm.billMoney, 2, ",");
          }
        } else if (optType === "focus") {
          this.addForm.billMoney = this.addForm.billMoney.toString().replace(/,/g, "");
        }
      },
      clearReceiverName() {
        this.addForm.rcvgName = "";
        this.addForm.rcvgAcctNo = "";
        this.addForm.rcvgBankNo = "";
        this.addForm.rcvgOrgCode = "";
        this.addForm.receiverBankNo = "" ;
        this.addForm.receiverOrgCode = "";
      },
      //可追索对象弹出框
      queryRecourses() {
        this.showRecoursesWin = true;
        this.recoursesParam = {
          billId: this.currentSelectRow.billId,
          ecdsAcctNo: this.currentSelectRow.ecdsAcctNo,
          billNo: this.currentSelectRow.billNo,
          dictMap: this.dictMap,
        };
      },
      //根据弹框所选数据进行赋值
      recoursesChange(info) {
        this.addForm.rcvgName = info.custName;
        this.addForm.rcvgAcctNo = info.acctNo;
        this.addForm.rcvgBankNo = info.bankNo;
        this.addForm.rcvgOrgCode = info.orgCode;
        this.addForm.receiverBankNo = info.bankNo ;
        this.addForm.receiverOrgCode = info.orgCode;
        this.showRecoursesWin = false;
      },
      showRecoursesWinlose() {
        this.showRecoursesWin = false;
        this.recoursesParam = {};
      },
      // 发起追索
      recourseApply() {
        this.isRequired = true;
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          this.addOrEditWin = true;
          this.$nextTick(() => {
            this.addForm.billNo = this.currentSelectRow.billNo;
            this.addForm.billId = this.currentSelectRow.billId;
            this.addForm.dpstBillId = this.currentSelectRow.id;
            this.addForm.hldrId =  this.currentSelectRow.hldrId;
            this.addForm.ecdsBillStatus = this.currentSelectRow.ecdsBillStatus;
            this.addForm.isRecourse = this.currentSelectRow.isRecourse;
            this.addForm.recourseType = this.currentSelectRow.recourseType;
            this.addForm.ownedBrchNo = this.currentSelectRow.ownedBrchNo;
            this.addForm.licenseFlag = this.licenseFlag;
            this.addForm.billMoney = this.currentSelectRow.billMoney == null ? "0.00" : formatNumber(this.currentSelectRow.billMoney, 2, ",");
            if (this.currentSelectRow.recourseDt != null && this.currentSelectRow.recourseDt !== "") {
              this.addForm.recourseDt = this.$moment(this.currentSelectRow.recourseDt, "YYYYMMDD").format("YYYY-MM-DD");
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          this.addOrEditWin = false;
          return false;
        }
      },
      validateRecourseMoney(rule, value, callback){
        var money = this.addForm.billMoney;
        if(value && !/^(?:[1-9]\d{0,15}|0)(?:\.\d{1,2})?$/.test(value)){
          callback(new Error("追索金额必须是大于等于0的数字，最多16位整数且小数位不超过两位"));
        }else if((value*1)>(money*1)){
          callback(new Error("追索金额不能大于票面金额"));
        }else{
          callback();
        }

      },

      recourseStatusSync(){
        post(this.formItem, "/bs/corpstdbill/recourse/stdRecourseApply/func_recourseStatusSync").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              let pageNo = this.$refs.datagrid.pageInfo.pageNo;
              this.$refs.datagrid.dataChange(pageNo);
              this.currentSelectRow = [];
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },

      submitForm() {
        this.addForm.recourseAmt = this.addForm.recourseAmt.toString().replace(/,/g, "");
        this.addForm.recourseDt = this.addForm.recourseDt.toString().replace(/-/g, "");
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            this.submitFlag = true;
            let url = "/bs/corpstdbill/recourse/stdRecourseApply/func_commitRecourseNotice";
            post(this.addForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.handleWinClose();
                  let pageNo = this.$refs.datagrid.pageInfo.pageNo;
                  this.$refs.datagrid.dataChange(pageNo);
                  this.currentSelectRow = [];
                  // this.isRecourseApplyAgain();
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
      //是否再次发起追索
      isRecourseApplyAgain() {
        let params = {
          billNo: this.currentSelectRow.billNo,
          ecdsBillStatus: this.currentSelectRow.ecdsBillStatus,
          isRecourse: this.currentSelectRow.isRecourse
        };
        post(params, "/shcpe/cpes/branch/agencyInformation/func_queryBranchs").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              if (Number(res.data.totalCount) > 0) {
                this.$hMsgBox.confirm({
                  title: this.$t("m.i.common.confirm"),
                  content: "追索成功！是否向其他人发起追索?",
                  onOk: () => {
                    this.queryRecourses();
                  },
                  onCancel:() => {
                    this.addOrEditWin = false;
                    let pageNo = this.$refs.datagrid.pageInfo.pageNo;
                    this.$refs.datagrid.dataChange(pageNo);
                    this.currentSelectRow = [];
                  },
                });
              } else {
                this.updateEcdsBillInfoRemaRcrs();
              }
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //更新可追索人数
      updateEcdsBillInfoRemaRcrs() {
        let params = {
          billNo: this.currentSelectRow.billNo,
          remaRcrs: 0,
        };
        post(params, "/shcpe/cpes/branch/agencyInformation/func_queryBranchs").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.addOrEditWin = false;
              let pageNo = this.$refs.datagrid.pageInfo.pageNo;
              this.$refs.datagrid.dataChange(pageNo);
              this.currentSelectRow = [];
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //追索类型变更
      recourseTypeChange(currentValue) {
        if (currentValue === "RT01") {
          this.addForm.recourseReasonCode = "RC00";
        } else {
          this.addForm.recourseReasonCode = "";
        }
      },
      getBbsp(){
        let url="/bs/corpstdbill/recourse/stdRecourseApply/func_getIsBbsp";
        post({}, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let obj = res.data.retData;
              this.isBbsp=obj.bbsp;
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      billInfoWinClose(){
        this.billId=null;
        this.billNo=null;
        this.listId=null;
        this.showBillInfoWin=false;
      },
      billInfoWinOpen(billId,billNo,listId){
        this.billId=billId;
        this.billNo=billNo;
        this.listId=listId;
        this.showBillInfoWin=true;
      },
    },
    mounted() {
      this.getDictListByGroups("DraftTypeCode,Yon,EcdsRecourseType,EcdsBillStatusCode,partnerType,RecourseReasonCode").then(res => {
        this.recourseTypeList = res.get("EcdsRecourseType");
        this.billTypeList = res.get("DraftTypeCode");
        this.isRecourseList = res.get("Yon");
        this.recourseReasonCodeList = res.get("RecourseReasonCode");
        this.dictMap = res.get("map");
      });

      this.getBbsp();

      post({ authPath: this.$route.path }, "sm/auth/licenseBrch/focusOper/func_checkLicenseAuth").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.licenseFlag = res.data.retData.licenseFlag;
            if (this.licenseFlag) {
              this.$refs.datagrid.controlColumnsHidden("ownedBrchName", false);
            } else {
              this.$refs.datagrid.controlColumnsHidden("ownedBrchName", true);
            }
          } else {
            this.$msgTip.error(this, { info: res.data.retMsg });
          }
        } else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });
    }
  };
</script>

<style scoped>

</style>
