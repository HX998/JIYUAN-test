<!--追索申请-同意清偿回复-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <show-branch v-model="formItem.ownedBrchNos" :label="$t('m.i.common.ownedBrchNo')" prop="ownedBrchNos" title="机构名称"
                             :brchNo.sync="formItem.ownedBrchNos" :brchName.sync="formItem.ownedBrchNames" v-if="this.licenseFlag" :params="{authPath: this.authPath}"
                             url ="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree" queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
                </show-branch>
                <!--标票产品名称-->
                <common-input :label="$t('m.i.bs.stdProductName')" prop="stdProductNameLike"
                              v-model="formItem.stdProductNameLike" showIcon @on-click="queryProductName"
                              :maxlength="60" lengthByByte></common-input>
                <!--票号-->
                <common-input :label="$t('m.i.billInfo.billNo')" prop="billNoLike" v-model="formItem.billNoLike" :maxlength=30
                              type="int"></common-input>
                <!--票据种类-->
                <common-select v-model="formItem.billType" :label="$t('m.i.billInfo.billType')" prop="billType"
                               :dictList="billTypeList"></common-select>
                <!--出票人全称-->
                <common-input :label="$t('m.i.billInfo.drwrName')" prop="drwrNameLike"
                              v-model="formItem.drwrNameLike"></common-input>
                <!--承兑人全称-->
                <common-input :label="$t('m.i.billInfo.acptName')" prop="acptNameLike"
                              v-model="formItem.acptNameLike"></common-input>
                <!--被追索人名称-->
                <common-input :label="$t('m.i.ce.receiverName')" prop="rcvgNameLike"
                              v-model="formItem.rcvgNameLike" :maxlength=60></common-input>
                <!--追索通知日期-->
                <common-date-picker :label="$t('m.i.ce.recourseDt')" prop="recourseDt" v-model="formItem.recourseDt"
                                    :showFormat="true" :editable=false ></common-date-picker>
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
            url="/bs/corpstdbill/recourse/stdRecourseReplyAgree/func_queryStaySignUpDraft"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="recourseReply()" >回复</h-button>
              <h-button type="primary" @click="recourseStatusSync()" v-if="isBbsp">{{$t('m.i.bs.synch')}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--回复弹出窗-->
    <h-msg-box v-model="addOrEditWin" width="800" :mask-closable="false" @on-close="handleWinClose"
               class="h-form-search-layer" :maximize="true">
      <p slot="header">
        <span>同意清偿回复</span>
      </p>
      <div>
        <h-form :model="addForm" :label-width="115" ref="addForm" cols="2" class="h-form-search">
          <h-form-item :label="$t('m.i.ce.signUpMark')" prop="signUpMark" :required="isRequired">
            <h-select v-model="addForm.signUpMark" placeholder="" showTitle>
              <h-option value="SU01">拒绝</h-option>
              <h-option value="SU00">签收</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.ce.remarkBySgnr')" prop="remarkBySgnr" class="h-form-height-auto">
            <h-input type="textarea" :rows=3 v-model="addForm.remarkBySgnr" :canResize="false"
                     :maxlength="256" lengthByByte></h-input>
          </h-form-item>
        </h-form>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="handleWinClose">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="submitForm">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>

    <show-cpes-branch :showCpesBranch="showCpesProductBranch" @showCpesBranchClose="showCpesProductBranchClose"
                      :showMemberId="false" :memberId="memberId" :brchType="productBrchType"
                      @showCpesBranchSubmit="showCpesProductBranchSubmit"></show-cpes-branch>
    <!--票面信息-->
    <bill-info-main-std @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="billId" :billNo="billNo" :listId="listId"></bill-info-main-std>

  </div>
</template>

<script>
  import { on, off, post, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "stdRecourseReplyAgree",
    components: {
      ShowCpesBranch: () => import(/* webpackChunkName: "shcpe/cpes/branch/showCpesBranch" */`@/views/bizViews/shcpe/cpes/branch/showCpesBranch`),
    },
    data() {
      return {
        ifShowMore : false,
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
            key: "ownedBrchNo",
            hiddenCol: true
          },
          {
            title: this.$t("m.i.common.ownedBrchNo"),
            key: "ownedBrchName",
            hiddenCol: true
          },
          {
            title: this.$t("m.i.billInfo.flowStatus"),
            key: "flowStatusName",
            hiddenCol: false,
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
                    this.billInfoWinOpen(params.row.billId, params.row.billNo,params.row.dpstBillId)
                  }
                }
              }, params.row.billNo)
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
            title: this.$t("m.i.bs.recourseMoneyByUnit"),
            key: "recourseAmt",
            hiddenCol: false,
            sortable: true,
            align: "right",
            ellipsis: false,
            render: (h, params) => {
              let recourseAmt = formatNumber(params.row.recourseAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: recourseAmt
                }
              }, recourseAmt);
            }
          },
          {
            title: this.$t("m.i.ce.recourseDt"),
            key: "recourseDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.recourseDt == null ? "" : this.$moment(params.row.recourseDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.bs.agreeAmtByUnit"),
            key: "agreeAmt",
            hiddenCol: false,
            ellipsis: false,
            align: "right",
            sortable: true,
            render: (h, params) => {
              let agreeAmt = formatNumber(params.row.agreeAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: agreeAmt
                }
              }, agreeAmt);
            }
          },
          {
            title: this.$t("m.i.ce.agreeDt"),
            key: "agreeDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.agreeDt == null ? "" : this.$moment(params.row.agreeDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.ce.agreeRemark"),
            key: "agreeRemark",
            hiddenCol: false,

          },
          {
            title: this.$t("m.i.ce.receiverName"),
            key: "rcvgName",
            hiddenCol: false,

            sortable: true
          },
          {
            title: this.$t("m.i.ce.receiverAcctNo"),
            key: "rcvgAcctNo",
            hiddenCol: false,

          },
          {
            title: this.$t("m.i.ce.rcvgBankNo"),
            key: "rcvgBankNo",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("m.i.ce.recourseType"),
            key: "recourseType",
            ellipsis: false,
            hiddenCol: false,
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
            title: this.$t("m.i.ce.recourseReasonCode"),
            key: "recourseReasonCode",
            hiddenCol: false,
            ellipsis: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "RecourseReasonCode", params.row.recourseReasonCode);
              return h("span",
                  {
                    domProps: {
                      title: list
                    }
                  }, list);
            }
          },
          {
            title: this.$t("m.i.ce.recourseRemark"),
            key: "recourseRemark",
            hiddenCol: false,
            ellipsis: false
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
        ],
        formItem : {
          stdProductNameLike: "",
          stdProductNo: "",
          billNoLike: "",
          billType: "",
          drwrNameLike: "",
          acptNameLike: "",
          rcvgNameLike: "",
          recourseDt: "",
          ownedBrchName: "",
          ownedBrchNo: "",
          ownedBrchNames:"",
          ownedBrchNos:"",
          authPath: this.$route.path,
          busiType: "AR",
        },
        addForm : {
          billId: "",
          recourseId: "",
          applicantrole: "RC00",
          applicantAcctNo: "0",
          applicantBankNo: this.$store.getters.userInfo.bankNo,
          signUpMark: "",
          remarkBySgnr: "",
          ownedBrchNo: "",
          licenseFlag: false
        },
        billNoRule : [{ test: /^[0-9]{0,30}$/, trigger: "blur", message: "只能输入数字" }],
        isRequired : true,
        addOrEditWin : false,
        submitFlag : false,
        currentSelectRow : null,
        billTypeList : [],
        dictMap : new Map(),
        ownedBrchName: "",
        ownedBrchNo: "",
        ownedBrchNames: "",
        ownedBrchNos: "",
        licenseFlag: false,
        authPath: this.$route.path,
        productBrchType: "4",
        memberId: JSON.parse(window.sessionStorage.getItem('userInfo')).memberId,
        showCpesProductBranch: false,
        isBbsp: false,
        showBillInfoWin: false,
        billId: "",
        billNo: "",
        listId:""

      }
    },
    methods: {
      formSearch() {
        this.currentSelectRow = [];
        this.formItem.recourseDt = this.formItem.recourseDt.replace(/-/g, "");
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.formItem.ownedBrchNo = "";
        this.formItem.ownedBrchName = "";
        this.formItem.ownedBrchNos = "";
        this.formItem.ownedBrchNames = "";
        this.formItem.stdProductNameLike = "";
        this.formItem.stdProductNo = "";
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
        this.addForm.billId = "";
        this.addForm.recourseId = "";
        this.$refs.addForm.resetFields();
      },
      // 同意清偿回复
      recourseReply() {
        this.isRequired = true;
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          this.addOrEditWin = true;
          this.$nextTick(() => {
            this.addForm.billId = this.currentSelectRow.billId;
            this.addForm.id = this.currentSelectRow.id;
            this.addForm.ownedBrchNo = this.currentSelectRow.ownedBrchNo;
            this.addForm.licenseFlag = this.licenseFlag;
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          this.addOrEditWin = false;
          return false;
        }
      },
      recourseStatusSync(){
        post(this.formItem, "/bs/corpstdbill/recourse/stdRecourseReplyAgree/func_recourseStatusSync").then(res => {
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
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            this.submitFlag = true;
            let url = "/bs/corpstdbill/recourse/stdRecourseReplyAgree/func_agreementRecourseSignUpEcdsRequest";
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
      queryProductName() {
        this.showCpesProductBranch = true;
      },
      showCpesProductBranchClose() {
        this.showCpesProductBranch = false;
      },
      showCpesProductBranchSubmit(info) {
        if (info === null) {
          this.$msgTip.error(this, {info: "请先选择记录！"});
          return;
        }
        this.formItem.stdProductNo = info.brchCode;
        this.formItem.stdProductNameLike = info.brchFullNameZh;
        // this.$parent.validateField('buyProductName');
        this.showCpesProductBranch = false;
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
      this.getDictListByGroups("DraftTypeCode,Yon,EcdsRecourseType,EcdsBillStatusCode,RecourseReasonCode").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
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
