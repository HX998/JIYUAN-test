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
                <show-branch v-model="formItem.ownedBrchNos" :label="$t('m.i.common.ownedBrchNo')" prop="ownedBrchNos" title="机构名称"
                             :brchNo.sync="formItem.ownedBrchNos" :brchName.sync="formItem.ownedBrchNames" v-if="this.licenseFlag" :params="{authPath: this.authPath}"
                             url ="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree" queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
                </show-branch>
                <h-form-item :label="$t('m.i.billInfo.billOrigin')" prop="billOrigin">
                  <h-select v-model="formItem.billOrigin" placeholder="">
                    <h-option v-for="item in billOriginList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billPackageNo')" prop="billNo" :validRules="billNoRule">
                  <h-input v-model="formItem.billNo" :maxlength="30"></h-input>
                </h-form-item>
                <bill-range :formItem="formItem" :rangeProps="['minBillRangeStart','maxBillRangeEnd']"></bill-range>
                <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType">
                  <h-select v-model="formItem.billType" placeholder="" showTitle>
                    <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.drwrName')" prop="drwrName">
                  <h-input v-model="formItem.drwrName" :maxlength=60 :lengthByByte="false"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.acptName')" prop="acptName">
                  <h-input v-model="formItem.acptName" :maxlength=60 :lengthByByte="false"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.ce.recourseName')" prop="recourseName">
                  <h-input v-model="formItem.recourseName" :maxlength=60 :lengthByByte="false"></h-input>
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
            url="/pb/recourse/recourseReply/func_queryAgreementRecourseDraft"
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
          <h-form-item :label="$t('m.i.bs.agreeAmtByUnit')" prop="settleAmt" :required="isRequired"  :validRules="settleAmtRule" v-if="addForm.billOrigin === 'CS01'">
            <h-typefield type="money" v-model="addForm.settleAmt" :maxlength="20" placeholder="数字，小数位最多2位"></h-typefield>
          </h-form-item>
          <h-form-item :label="$t('m.i.bs.agreeAmtByUnit')" prop="settleAmt" :required="isRequired" :validRules="settleAmtRule" v-else>
            <h-typefield type="money" v-model="addForm.settleAmt" :maxlength="20" placeholder="数字，小数位最多2位" :readonly="settleAmtReadOnly"></h-typefield>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.settleMode')" prop="settleMode" :required="isRequired" v-if="addForm.billOrigin !== 'CS01'">
            <h-select v-model="addForm.settleMode" placeholder="" @on-change="settleModeChange">
              <h-option v-for="item in settleModeList" :value="item.key" :key="item.value">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.bs.agreeRangeNum')" prop="agreeRangeNum" :required="isRequired" :validRules="agreeRangeNumRule"  v-if="showAgreeRangeNum">
            <h-typefield  v-model="addForm.agreeRangeNum"  type="money"  integerNum="12" suffixNum="0"></h-typefield>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.clearType')" prop="settleType" :required="isRequired" v-if="addForm.billOrigin !== 'CS01'">
            <h-select v-model="addForm.settleType" placeholder="">
              <h-option v-for="item in clearTypeList" :value="item.key" :key="item.value">{{ item.value }}
              </h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.ce.agreeRemark')" prop="agreeRemark" v-if="addForm.billOrigin == 'CS01'">
            <h-input type="textarea" :rows=3 v-model="addForm.agreeRemark" :canResize="false"
                     :maxlength="256" :lengthByByte="false"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.ce.agreeRemark')" prop="agreeRemark" v-else>
            <h-input type="textarea" :rows=3 v-model="addForm.agreeRemark" :canResize="false"
                     :maxlength="150" :lengthByByte="false"></h-input>
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
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="billId"
                    :billNo="billNo" :billRangeStart="billRangeStart" :billRangeEnd="billRangeEnd"></bill-info-main>

    <!--附件管理-->
    <show-file-win :showFileWin="showFileWin" :fileBatchParams="fileBatchParams" @showFileWinClose="showFileWinClose" :dictMap="dictMap" :filePathUrl="filePathUrl"></show-file-win>


  </div>
</template>

<script>
  import { on, off, post, getDictValueFromMap,formatNumber,formatBillRange } from "@/api/bizApi/commonUtil";

  export default {
    name: "recourseReply",
    data() {
      return {
        ifShowMore : false,
        showFileWin:false,
        fileBatchParams:{},
        filePathUrl:"/pb/recourse/recourseReply/",
        fileDetailStatusList:[],
        attTypeCodeList: [{key:'FT07',value:'其他'}],
        //给按钮增加权限
        authObj : {
          recourseReplyAuth: true           //同意清偿
        },
        agreeRangeNumRule:[{ test: this.agreeRangeNumRuleFunc, trigger: "blur", }],
        settleAmtRule:[{test: this.settleAmtRuleFunc, trigger: "blur",}],
        numValid: [{
          test: /^[0-9]\d*$/g,
          trigger: "blur",
          message: "请输入0-9的数字"
        }],
        showAgreeRangeNum:false,
        settleAmtReadOnly:false,
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
            title: this.$t('m.i.billInfo.billOrigin'),
            key: 'billOrigin',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = (!params.row.billOrigin || params.row.billOrigin === 'CS00') ? '-' : getDictValueFromMap(this.dictMap, 'BillOrigin', params.row.billOrigin);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.billInfo.billPackageNo"),
            key: "billNo",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params);
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
            title: this.$t("m.i.common.showAttach"),
            key: "showAttach",
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.billOrigin === 'CS01') {
                return h("span", "-")
              }
              return h('a', {
                on: {
                  click: () => {
                    this.showAttach(params)
                  }
                }
              }, "查看");
            }
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",
            hiddenCol: false,
            ellipsis: false,
            sortable: true,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
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
            title: this.$t("m.i.billInfo.billPackageMoney"),
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
            title: this.$t("m.i.bs.recourseMoneyByUnit"),
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
              let list = getDictValueFromMap(this.dictMap, "RcrsTypeCode", params.row.recourseType);
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
              let list = getDictValueFromMap(this.dictMap, "RecourseReasonCode", params.row.recourseReasonCode);
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
        ],
        formItem : {
          billOrigin: "",
          billNo: "",
          minBillRangeStart: "",
          maxBillRangeEnd: "",
          billType: "",
          drwrName: "",
          acptName: "",
          recourseName: "",
          recourseDt: "",
          ownedBrchName: "",
          ownedBrchNo: "",
          ownedBrchNames:"",
          ownedBrchNos:"",
          authPath: this.$route.path
        },
        addForm : {
          billOrigin: "",
          billId: "",
          billMoney: "",
          id: "",
          applicantrole: "RC00",
          applicantAcctNo: "0",
          applicantBankNo: this.$store.getters.userInfo.bankNo,
          agreeAmt: "",
          settleAmt:"",
          settleMode: "",
          settleType: "",
          agreeDt : this.$moment(window.sessionStorage.getItem("workDate")).format("YYYYMMDD"),
          agreeRemark: "",
          ownedBrchNo: "",
          agreeRangeNum: "",
          maxAgreeRangeNum:"",
          isAllowSplitBill: false,
          licenseFlag: false
        },
        billNoRule : [{ test: /^[0-9]{0,30}$/, trigger: "blur", message: "只能输入数字" }],
        isRequired : true,
        addOrEditWin : false,
        submitFlag : false,
        currentSelectRow : null,
        billTypeList: [],
        billOriginList: [],
        settleModeList: [],
        clearTypeList: [],
        dictMap : new Map(),
        showBillInfoWin : false,
        billId : "",
        billNo : "",
        billRangeStart:"",
        billRangeEnd:"",
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
      showFileWin: () => import(/* webpackChunkName: "pc/img/showFileWin" */"@/views/bizViews/pc/img/showFileWin"),
    },
    methods: {
      settleModeChange() {
        this.settleAmtReadOnly = false;
        if (this.addForm.settleMode == 'ST02') {
          // FOP
          if (this.addForm.isAllowSplitBill) {
            // 允许分包流转
            this.showAgreeRangeNum = true;
          } else {
            this.showAgreeRangeNum = false;
          }
        } else if (this.addForm.settleMode == 'ST01') {
          // DVP
          this.showAgreeRangeNum = false;
          if (!this.addForm.isAllowSplitBill) {
            this.settleAmtReadOnly = true;
          }
        }
      },
      settleAmtRuleFunc(rule, val, callback) {
        let value = val.toString().replace(/,/g, "");
        if (this.addForm.billOrigin == "CS01") {
          // ecds票据金额控制大于等于0
            if (value < 0) {
              callback(new Error("同意清偿金额应大于等于0"));
            } else {
              callback();
            }
        } else if (this.addForm.billOrigin == "CS02" || this.addForm.billOrigin == "CS03") {
          if (this.addForm.settleMode == "ST02") {
              // FOP时结算金额可为0
              if (value < 0) {
                callback(new Error("同意清偿金额应大于等于0"));
              } else {
                callback();
              }
          } else if (value <= 0 || value > this.addForm.billMoney) {
            callback(new Error("同意清偿金额应大于0且小于等于持有票据（包）金额" + formatNumber(this.addForm.billMoney, 2, ",")));
          } else {
            callback();
          }
        } else {
          callback();
        }

      },
      agreeRangeNumRuleFunc(rule, val, callback) {
        let value = val.toString().replace(/,/g, "");
        if (value > this.addForm.maxAgreeRangeNum) {
            callback(new Error("清偿子票据张数应小于或等于持票子票据张数[" + this.addForm.maxAgreeRangeNum + "]"));
        } else if  (value <= 0){
            callback(new Error("清偿子票据张数应大于0"));
        } else {
          callback();
        }
      },
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
        this.addForm.billOrigin = "";
        this.addForm.billMoney = "";
        this.addForm.billId = "";
        this.addForm.id = "";
        this.addForm.isAllowSplitBill = false;
        this.showAgreeRangeNum = false;
        this.addForm.agreeRangeNum = "";
        this.addForm.maxAgreeRangeNum = "";
        this.settleAmtReadOnly = false;
        this.$refs.addForm.resetFields();
      },
      formatAgreeAmt(optType, billOrigin) {
        if (optType === "blur") {
          if (!isNaN(parseFloat(this.addForm.settleAmt)) && isFinite(this.addForm.settleAmt)) {
            if (billOrigin !== "CS01"){
              if (this.addForm.settleAmt < 0 || this.addForm.settleAmt > this.addForm.billMoney){
                this.$msgTip.info(this, { info: "调整金额应大于等于0且小于等于票据(包)金额" });
                this.addForm.settleAmt = null;
                return;
              }
            }
            this.addForm.settleAmt = this.addForm.settleAmt == null ? "0.00" : formatNumber(this.addForm.settleAmt, 2, ",");
          }
        } else if (optType === "focus") {
          this.addForm.settleAmt = this.addForm.settleAmt.toString().replace(/,/g, "");
        }
      },
      //同意清偿
      recourseReply() {
        this.isRequired = true;
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          this.addOrEditWin = true;
          this.$nextTick(() => {
            this.addForm.billId = this.currentSelectRow.billId;
            this.addForm.billMoney = this.currentSelectRow.billMoney;
            this.addForm.billOrigin = this.currentSelectRow.billOrigin;
            if (this.currentSelectRow.billRangeStart != 0 && null != this.currentSelectRow.billRangeStart) {
              this.addForm.isAllowSplitBill = true;
              this.addForm.agreeRangeNum = this.currentSelectRow.billRangeEnd - this.currentSelectRow.billRangeStart + 1;
              this.addForm.maxAgreeRangeNum = this.currentSelectRow.billRangeEnd - this.currentSelectRow.billRangeStart + 1;

            }
            this.addForm.settleAmt = this.addForm.billMoney;
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
      submitForm() {
        this.addForm.settleAmt = this.addForm.settleAmt.toString().replace(/,/g, "");
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            this.submitFlag = true;
            let url = "/pb/recourse/recourseReply/func_agreementRecourseReply";
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
      showBillInfo(params){
        this.billId = params.row.billId;
        this.billNo = params.row.billNo;
        this.billRangeStart = params.row.billRangeStart;
        this.billRangeEnd = params.row.billRangeEnd;
        this.showBillInfoWin = true;
      },
      // 打开附件弹窗
      showAttach(params) {
        this.fileBatchParams.operType = "show";
        this.fileBatchParams.busiId = params.row.id;
        this.fileBatchParams.attachBusiType = "recourseFile";
        this.fileBatchParams.attTypeCodeList = this.attTypeCodeList;
        this.fileBatchParams.fileDetailStatusList = this.fileDetailStatusList;
        this.showFileWin = true;
      },

      // 附件关闭
      showFileWinClose(){
        this.fileBatchParams = {};
        this.showFileWin = false;
      }
    },



    mounted() {
      this.getDictListByGroups("DraftTypeCode,Yon,EcdsBillStatusCode,RcrsTypeCode,RecourseReasonCode,BillOrigin,SettleType,ClearType,FileDetailStatus,AttTypeCode,PreRelationFlag").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.billOriginList = res.get("BillOrigin");
        this.settleModeList = res.get("SettleType");
        this.clearTypeList = res.get("ClearType");
        this.fileDetailStatusList = res.get("FileDetailStatus");
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
