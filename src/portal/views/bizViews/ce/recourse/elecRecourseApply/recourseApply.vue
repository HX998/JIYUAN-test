<!--追索申请-发出追索-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
               <!-- <h-form-item :label="$t('m.i.common.ownedBrchNo')" prop="ownedBrchNos" v-if="this.licenseFlag">
                  <h-input v-model="formItem.ownedBrchNames" icon="android-search" @on-click="brchNoWinOpen"
                           readonly clearable @on-clear="clearVal1('license')"
                           :title="formItem.ownedBrchNames"></h-input>
                </h-form-item>-->
                <show-branch v-model="formItem.ownedBrchNos" :label="$t('m.i.common.ownedBrchNo')" prop="ownedBrchNos" title="机构名称"
                             :brchNo.sync="formItem.ownedBrchNos" :brchName.sync="formItem.ownedBrchNames" v-if="this.licenseFlag" :params="{authPath: this.authPath}"
                             url ="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree" queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
                </show-branch>
                <h-form-item :label="$t('m.i.ce.recourseType')" prop="recourseType">
                  <h-select v-model="formItem.recourseType" placeholder="" showTitle>
                    <h-option v-for="item in recourseTypeList" :value="item.key" :key="item.key">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billNo')" prop="likeBillNo" :validRules="billNoRule">
                  <h-input v-model="formItem.likeBillNo" :maxlength="30"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType">
                  <h-select v-model="formItem.billType" placeholder="" showTitle>
                    <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.drwrName')" prop="drwrName">
                  <h-input v-model="formItem.drwrName" :maxlength=60></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.acptName')" prop="acptName">
                  <h-input v-model="formItem.acptName" :maxlength=60></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.ce.isRecourse')" prop="isRecourse">
                  <h-select v-model="formItem.isRecourse" placeholder="" showTitle>
                    <h-option v-for="item in isRecourseList" :value="item.key" :key="item.key">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                                  :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            highlight-row
            url="/ce/recourse/elecRecourseApply/recourseApply/func_queryRecourseableDraft"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="recourseApply()" v-if="authObj.recourseApplyAuth">发起追索</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--发起追索弹出窗-->
    <h-msg-box v-model="addOrEditWin" width="800" :mask-closable="false" @on-close="handleWinClose"
               class="h-form-search-layer" :maximize="true">
      <p slot="header">
        <span>发起追索</span>
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
          <h-form-item :label="$t('m.i.ce.recourseMoney')" prop="recourseMoney" :required="isRequired" onlyBlurRequire>
            <h-typefield type="money" bigTips v-model="addForm.recourseMoney" :maxlength="20" placeholder="数字，小数位最多2位"
                     @on-blur="formatRecourseAmt('blur')" @on-focus="formatRecourseAmt('focus')"></h-typefield>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.billMoney')" prop="billMoney" :required="isRequired">
            <h-input v-model="addForm.billMoney" :maxlength="20" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.ce.recourseDt')" prop="applyDt" :required="isRequired">
            <h-date-picker type="date" v-model="addForm.applyDt" placeholder="" showFormat :editable=false
                           readonly></h-date-picker>
          </h-form-item>
          <h-form-item :label="$t('m.i.ce.receiverName')" prop="receiverName" :required="isRequired">
            <h-input v-model="addForm.receiverName" readonly icon="android-search" @on-click="queryRecourses()"
                     :maxlength="60" clearable @on-clear="clearReceiverName()"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.ce.receiverAcctNo')" prop="receiverAcctNo" >
            <h-input v-model="addForm.receiverAcctNo" :maxlength="32" readonly></h-input>
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
          <h-form-item :label="$t('m.i.ce.recourseRemark')" prop="recourseRemark">
            <h-input type="textarea" :rows=3 v-model="addForm.recourseRemark" :canResize="false"
                     :maxlength="500"></h-input>
          </h-form-item>
        </h-form>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="handleWinClose">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="submitForm">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>
    <!--查询可追索对象弹出框-->
    <recourses-search :showRecoursesWin="showRecoursesWin" :recoursesParam="recoursesParam"
                      @recoursesChange="recoursesChange"
                      @showRecoursesWinlose="showRecoursesWinlose"></recourses-search>
    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId" :billNo="this.billNo"></bill-info-main>

    <!--<show-license-branch :showBranchWin="brchNoWin" title="机构查询" @brchNoChange="brchNoChange" :authPath="authPath"
                         @showBranchWinClose="brchNoWinClose" :ifcheck="true"
                         :checkStrictly="true"></show-license-branch>-->

  </div>
</template>

<script>
  import { on, off, post, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "recourseApply",
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
            key: "ownedBrchNo",
            hiddenCol: true
          },
          {
            title: this.$t("m.i.common.ownedBrchNo"),
            key: "ownedBrchName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.billNo"),
            key: "billNo",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let info = "", type = "";
              if (!!params.row.billId) {
                info = params.row.billId;
                type = "billId";
              } else {
                info = params.row.billNo;
                type = "billNo";
              }
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(info, type);
                  }
                }
              }, params.row.billNo);
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
            title: this.$t("m.i.billInfo.billMoney"),
            key: "billMoney",
            hiddenCol: false,
            ellipsis: false,
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
           title: this.$t("m.i.billInfo.drwrName"),
            key: "drwrName",
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
            title: this.$t("m.i.billInfo.acptName"),
            key: "acptName",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
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
            title: this.$t("m.i.ce.recourseType"),
            key: "recourseType",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "EcdsRecourseType", params.row.recourseType);
              return h("span",
                  {
                    domProps: {
                      title: list
                    }
                  }, list);
            }
          },
          {
            title: this.$t("m.i.ce.isRecourse"),
            key: "isRecourse",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "Yon", params.row.isRecourse);
              return h("span",
                  {
                    domProps: {
                      title: list
                    }
                  }, list);
            }
          }
        ],
        formItem : {
          recourseType: "",
          likeBillNo: "",
          billType: "",
          drwrName: "",
          acptName: "",
          isRecourse: "",
          ownedBrchName: "",
          ownedBrchNo: "",
          ownedBrchNames:"",
          ownedBrchNos:"",
          authPath: this.$route.path
        },
        addForm : {
          billNo: "",
          recourseType: "",
          recourseMoney: "",
          billMoney: "",
          applyDt : this.$moment(window.sessionStorage.getItem("workDate")).format("YYYYMMDD"),
          receiverName: "",
          receiverAcctNo: "",
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
        isRequired : true,
        addOrEditWin : false,
        submitFlag : false,
        currentSelectRow : null,
        recourseTypeList : [],
        billTypeList : [],
        isRecourseList : [],
        recourseReasonCodeList : [],
        dictMap : new Map(),
        showRecoursesWin : false,
        recoursesParam : {
          billNo: "",
          ecdsBillStatus: "",
          isRecourse: "",
          hldrId:"",
          ownedBrchNo:"",
          licenseFlag: this.licenseFlag,
        },
        showBillInfoWin : false,
        billId : "",
        billNo : "",
        ownedBrchName: "",
        ownedBrchNo: "",
        ownedBrchNames: "",
        ownedBrchNos: "",
        licenseFlag: false,
        authPath: this.$route.path,
        //brchNoWin: false,
      }
    },
    components: {
      RecoursesSearch: () => import(/* webpackChunkName: "ce/recourse/elecRecourseApply/recoursesSearch" */ '@/views/bizViews/ce/recourse/elecRecourseApply/recoursesSearch'),
      //ShowLicenseBranch: () => import(/* webpackChunkName: "sm/auth/branch/showLicenseBranch" */`@/views/bizViews/sm/auth/branch/showLicenseBranch`)

    },
    methods: {
      formSearch() {
        this.currentSelectRow = [];
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.formItem.ownedBrchNo = "";
        this.formItem.ownedBrchName = "";
        this.formItem.ownedBrchNos = "";
        this.formItem.ownedBrchNames = "";
        this.$refs.formItem.resetFields();
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
      formatRecourseAmt(optType) {
        if (optType === "blur") {
          if (!isNaN(parseFloat(this.addForm.recourseMoney)) && isFinite(this.addForm.recourseMoney)) {
            this.addForm.recourseMoney = this.addForm.recourseMoney == null ? "0.00" : formatNumber(this.addForm.recourseMoney, 2, ",");
          }
        } else if (optType === "focus") {
          this.addForm.recourseMoney = this.addForm.recourseMoney.toString().replace(/,/g, "");
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
        this.addForm.receiverName = "";
        this.addForm.receiverAcctNo = "";
        this.addForm.rcvgBankNo = "";
        this.addForm.rcvgOrgCode = "";
        this.addForm.receiverBankNo = "" ;
        this.addForm.receiverOrgCode = "";
      },
      //可追索对象弹出框
      queryRecourses() {
        this.showRecoursesWin = true;
        this.recoursesParam = {
          billNo: this.currentSelectRow.billNo,
          ecdsBillStatus: this.currentSelectRow.ecdsBillStatus,
          isRecourse: this.currentSelectRow.isRecourse,
          hldrId:this.currentSelectRow.hldrId,
          dictMap: this.dictMap,
          ownedBrchNo:this.currentSelectRow.ownedBrchNo,
          licenseFlag: this.licenseFlag,
        };
      },
      //根据弹框所选数据进行赋值
      recoursesChange(info) {
        this.addForm.receiverName = info.custName;
        this.addForm.receiverAcctNo = info.acctNo;
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
            this.addForm.hldrId =  this.currentSelectRow.hldrId;
            this.addForm.ecdsBillStatus = this.currentSelectRow.ecdsBillStatus;
            this.addForm.isRecourse = this.currentSelectRow.isRecourse;
            this.addForm.recourseType = this.currentSelectRow.recourseType;
            this.addForm.ownedBrchNo = this.currentSelectRow.ownedBrchNo;
            this.addForm.licenseFlag = this.licenseFlag;
            this.addForm.billMoney = this.currentSelectRow.billMoney == null ? "0.00" : formatNumber(this.currentSelectRow.billMoney, 2, ",");
            if (this.currentSelectRow.applyDt != null && this.currentSelectRow.applyDt !== "") {
              this.addForm.applyDt = this.$moment(this.currentSelectRow.applyDt, "YYYYMMDD").format("YYYY-MM-DD");
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          this.addOrEditWin = false;
          return false;
        }
      },
      submitForm() {
        this.addForm.recourseMoney = this.addForm.recourseMoney.toString().replace(/,/g, "");
        this.addForm.applyDt = this.addForm.applyDt.toString().replace(/-/g, "");
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            this.submitFlag = true;
            let url = "/ce/recourse/elecRecourseApply/recourseApply/func_recourseNotificationEcdsRequest";
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
      billInfoWinClose(){
        this.showBillInfoWin = false;
      },
      showBillInfo(info, type) {
        this.billId = "";
        this.billNo = "";
        if (type === "billId") {
          this.billId = info;
        } else {
          this.billNo = info;
        }
        this.showBillInfoWin = true;
      },
      //追索类型变更
      recourseTypeChange(currentValue) {
        if (currentValue === "RT01") {
          this.addForm.recourseReasonCode = "RC00";
        } else {
          this.addForm.recourseReasonCode = "";
        }
      },
     /* //根据弹框所选数据进行赋值
      brchNoChange(info) {
        let objs = [];
        if (info instanceof Array) {
          objs = info;
        } else {
          objs[0] = info;
        }
        let brchNos = "";
        let brchNames = "";
        for (var i = 0; i < objs.length; i++) {
          brchNos += objs[i].id + ",";
          brchNames += objs[i].title + ",";
        }
        this.formItem.ownedBrchNos = brchNos.substring(0, brchNos.length - 1);
        this.formItem.ownedBrchNames = brchNames.substring(0, brchNames.length - 1);
        this.brchNoWin = false;
      },
      brchNoWinOpen() {
        this.brchNoWin = true;
      },
      brchNoWinClose() {
        this.brchNoWin = false;
      }*/
    },
    mounted() {
      this.getDictListByGroups("DraftTypeCode,Yon,EcdsRecourseType,EcdsBillStatusCode,partnerType,RecourseReasonCode").then(res => {
        this.recourseTypeList = res.get("EcdsRecourseType");
        this.billTypeList = res.get("DraftTypeCode");
        this.isRecourseList = res.get("Yon");
        this.recourseReasonCodeList = res.get("RecourseReasonCode");
        this.dictMap = res.get("map");
      });

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
