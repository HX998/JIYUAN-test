<!--同意清偿申请-同意清偿-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <!--<h-form-item :label="$t('m.i.common.ownedBrchNo')" prop="ownedBrchNos" v-if="this.licenseFlag">
                  <h-input v-model="formItem.ownedBrchNames" icon="android-search" @on-click="brchNoWinOpen"
                           readonly clearable @on-clear="clearVal1('license')"
                           :title="formItem.ownedBrchNames"></h-input>
                </h-form-item>-->
                <show-branch v-model="formItem.ownedBrchNos" :label="$t('m.i.common.ownedBrchNo')" prop="ownedBrchNos" title="机构名称"
                             :brchNo.sync="formItem.ownedBrchNos" :brchName.sync="formItem.ownedBrchNames" v-if="this.licenseFlag" :params="{authPath: this.authPath}"
                             url ="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree" queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
                </show-branch>
                <h-form-item :label="$t('m.i.billInfo.billNo')" prop="billNo" :validRules="billNoRule">
                  <h-input v-model="formItem.billNo" :maxlength="30"></h-input>
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
                <h-form-item :label="$t('m.i.ce.recourseName')" prop="rcrsName">
                  <h-input v-model="formItem.rcrsName" :maxlength=60></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.ce.recourseDt')" prop="recourseDt">
                  <h-date-picker v-model="formItem.recourseDt" type="date" showFormat :editable=false placeholder="" ></h-date-picker>
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
            url="/ce/recourse/elecRecourseReply/recourseReply/func_queryAgreementRecourseDraft"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="recourseReply()" v-if="authObj.recourseReplyAuth">同意</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--同意清偿弹出窗-->
    <h-msg-box v-model="addOrEditWin" width="800" :mask-closable="false" @on-close="handleWinClose"
               class="h-form-search-layer" :maximize="true">
      <p slot="header">
        <span>同意清偿</span>
      </p>
      <div>
        <h-form :model="addForm" :label-width="115" ref="addForm" cols="2" class="h-form-search">
          <h-form-item :label="$t('m.i.ce.agreeAmt')" prop="agreeMoney" :required="isRequired">
            <h-typefield type="money" bigTips v-model="addForm.agreeMoney" :maxlength="20" placeholder="数字，小数位最多2位"
                     @on-blur="formatAgreeAmt('blur')" @on-focus="formatAgreeAmt('focus')"></h-typefield>
          </h-form-item>
          <h-form-item :label="$t('m.i.ce.agreeRemark')" prop="agreeRemark">
            <h-input type="textarea" :rows=3 v-model="addForm.agreeRemark" :canResize="false"
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
    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId" :billNo="this.billNo"></bill-info-main>

   <!-- <show-license-branch :showBranchWin="brchNoWin" title="机构查询" @brchNoChange="brchNoChange" :authPath="authPath"
                         @showBranchWinClose="brchNoWinClose" :ifcheck="true"
                         :checkStrictly="true"></show-license-branch>-->

  </div>
</template>

<script>
  import { on, off, post, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "recourseReply",
    data() {
      return {
        ifShowMore : false,
        //给按钮增加权限
        authObj : {
          recourseReplyAuth: true           //同意清偿
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
            title: this.$t("m.i.ce.agreeAmt"),
            key: "agreeAmt",
            hiddenCol: false,
            ellipsis: false,
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
           title: this.$t("m.i.ce.agreeRemark"),
            key: "agreeRemark",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("m.i.ce.recourseMoney"),
            key: "recourseAmt",
            hiddenCol: false,
            sortable: true,
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
            title: this.$t("m.i.ce.recourseName"),
            key: "recourseName",
            sortable: true,
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("m.i.ce.recourseAcctNo"),
            key: "recourseAcctNo",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("m.i.ce.recourseBankNo"),
            key: "recourseBankNo",
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
            title: this.$t("m.i.ce.isRecourse"),
            key: "isRecourse",
            ellipsis: false,
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "Yon", params.row.isRecourse);
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
          }
        ],
        formItem : {
          billNo: "",
          billType: "",
          drwrName: "",
          acptName: "",
          rcrsName: "",
          recourseDt: "",
          ownedBrchName: "",
          ownedBrchNo: "",
          ownedBrchNames:"",
          ownedBrchNos:"",
          authPath: this.$route.path
        },
        addForm : {
          billId: "",
          recourseId: "",
          applicantrole: "RC00",
          applicantAcctNo: "0",
          applicantBankNo: this.$store.getters.userInfo.bankNo,
          agreeMoney: "",
          agreeDt : this.$moment(window.sessionStorage.getItem("workDate")).format("YYYYMMDD"),
          agreeRemark: "",
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
      //ShowLicenseBranch: () => import(/* webpackChunkName: "sm/auth/branch/showLicenseBranch" */`@/views/bizViews/sm/auth/branch/showLicenseBranch`)

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
      formatAgreeAmt(optType) {
        if (optType === "blur") {
          if (!isNaN(parseFloat(this.addForm.agreeMoney)) && isFinite(this.addForm.agreeMoney)) {
            this.addForm.agreeMoney = this.addForm.agreeMoney == null ? "0.00" : formatNumber(this.addForm.agreeMoney, 2, ",");
          }
        } else if (optType === "focus") {
          this.addForm.agreeMoney = this.addForm.agreeMoney.toString().replace(/,/g, "");
        }
      },
      //同意清偿
      recourseReply() {
        this.isRequired = true;
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          this.addOrEditWin = true;
          this.$nextTick(() => {
            this.addForm.billId = this.currentSelectRow.billId;
            this.addForm.recourseId = this.currentSelectRow.id;
            this.addForm.ownedBrchNo = this.currentSelectRow.ownedBrchNo;
            this.addForm.licenseFlag = this.licenseFlag;
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          this.addOrEditWin = false;
          return false;
        }
      },
      submitForm() {
        this.addForm.agreeMoney = this.addForm.agreeMoney.toString().replace(/,/g, "");
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            this.submitFlag = true;
            let url = "/ce/recourse/elecRecourseReply/recourseReply/func_agreementRecourseEcdsRequest";
            post(this.addForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.handleWinClose()
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
      /*//根据弹框所选数据进行赋值
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
      this.getDictListByGroups("DraftTypeCode,Yon,EcdsBillStatusCode,EcdsRecourseType,RecourseReasonCode").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
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
