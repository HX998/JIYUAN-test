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
                <show-branch v-model="formItem.ownedBrchNames"  :label="$t('m.i.common.ownedBrchNo')"  prop="ownedBrchNames"
                             v-if="this.licenseFlag"    :showCheckBox="true"     :brchNo.sync="formItem.ownedBrchNos" :brchName.sync="formItem.ownedBrchNames"
                             :params="{authPath:this.$route.path}"
                             url ="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree"
                             queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
                </show-branch>
                <h-form-item :label="$t('m.i.billInfo.billNo')" prop="billNo">
                  <h-input v-model="formItem.billNo" placeholder="" :maxlength="30"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billMoney')" prop="billMoney">
                  <h-row>
                    <h-col span="11">
                      <h-form-item prop="minBillMoney" style="width:100%">
                        <h-typefield v-model="formItem.minBillMoney" integerNum="10" placeholder="" type="money"
                                     bigTips></h-typefield>
                      </h-form-item>
                    </h-col>
                    <h-col span="2" style="text-align: center">-</h-col>
                    <h-col span="11">
                      <h-form-item prop="maxBillMoney" style="width:100%">
                        <h-typefield v-model="formItem.maxBillMoney" integerNum="10" placeholder="" type="money"
                                     bigTips></h-typefield>
                      </h-form-item>
                    </h-col>
                  </h-row>
                </h-form-item>
               <!-- <h-form-item :label="$t('m.i.be.prstBranchName')" prop="prstBranchName" class="h-form-long-label">
                  <h-input v-model="formItem.prstBranchName" readonly icon="android-search"
                           @on-click="queryBranchCode()" placeholder=""
                           clearable @on-clear="clearVal('prstBranchName')"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.be.prsttnBrchCode')" prop="prsttnBrchCode" v-show="false">
                  <h-input v-model="formItem.prsttnBrchCode" v-show="false"></h-input>
                </h-form-item>-->
                <show-cpes-branch :label="$t('m.i.be.prstBranchName')" class="h-form-long-label"
                                  :brchCode.sync="formItem.prsttnBrchCode"  :cpesBrchName.sync="formItem.prstBranchName"
                                  datagridUrl="/cpes/branch/queryBranchList" prop="prstBranchName"
                                  queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>


                <h-form-item :label="$t('m.i.be.contingentRecourseDate')" prop="contingentRecourseDate">
                  <h-date-picker :value="contingentRecourseDate" format="yyyy-MM-dd" type="daterange"
                                 showFormat :editable=false placeholder="" @on-change="handleContingentRecourseDateChange"></h-date-picker>
                </h-form-item>
                <!--<h-form-item :label="$t('m.i.be.hldrBrchName')" prop="hldrBranchName">
                  <h-input v-model="formItem.hldrBranchName" readonly icon="android-search"
                           @on-click="queryBranchCode2()" placeholder=""
                           clearable @on-clear="clearVal('hldrBranchName')"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.be.hldrBrchCode')" prop="hldrBrchCode" v-show="false">
                  <h-input v-model="formItem.hldrBrchCode" v-show="false"></h-input>
                </h-form-item>-->

                <show-cpes-branch :label="$t('m.i.be.hldrBrchName')"
                                  :brchCode.sync="formItem.hldrBrchCode"  :cpesBrchName.sync="formItem.hldrBranchName"
                                  datagridUrl="/cpes/branch/queryBranchList" prop="hldrBranchName"
                                  queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>


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
            url="be/trust/recourse/recourseAcceptBillAccount/func_queryAccountContingentRecourseBill"
            :bindForm="formItem"
            :onSelectChange="handleSelectClick"
            :hasSelect="false"
            rowSelect
            :notSetWidth="true"
            showListCkeckBox
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="account()">{{$t('m.i.be.acct')}}</h-button>
              <h-button type="primary" @click="recording()">{{$t('m.i.be.recordingInfo')}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--点击查看详情弹出窗-->
    <h-msg-box v-model="recordingPayWin" width="800" :mask-closable="false" :maximize="true">
      <p slot="header">
        <span>收款人信息补录</span>
      </p>
      <h-panel>
        <h-form :model="recordingPayForm" :label-width="115" ref="recordingPayForm" cols="2" class="h-form-search">
          <h-form-item :label="$t('m.i.billInfo.pyeeAcctNo')" prop="pyeeAcctNo" required :validRules="validAcctNoRules">
            <h-input v-model="recordingPayForm.pyeeAcctNo" :maxlength=32></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.pyeeName')" prop="pyeeName" required>
            <h-input v-model="recordingPayForm.pyeeName" :maxlength=80 :lengthByByte="false"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.pyeeBankNo')" prop="pyeeBankNo" required :validRules="validRules">
            <h-input v-model="recordingPayForm.pyeeBankNo" :maxlength=12></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.pyeeBankName')" prop="pyeeBankName" required>
            <h-input v-model="recordingPayForm.pyeeBankName" :maxlength=80 :lengthByByte="false"></h-input>
          </h-form-item>

        </h-form>
      </h-panel>
      <div slot="footer">
        <h-button type="ghost" style="margin:0 8px" @click="recordingClose">{{$t('m.i.common.close')}}</h-button>
        <h-button type="primary" @click="recordingSubmitForm()">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>

    <acct-record :param="param" :showAcctRecordWin="showAcctRecordWin" @showAcctRecordWinClose="showAcctRecordWinClose"
                 :submitFlag="acctSubmitFlag"
                 :showPrintButton="showPrintButton"
                 @printSuccessCallback="printSuccessCallback"
                 :url="acctRecord" @acctSubmitSure="acctRecordSure"></acct-record>

    <!--<show-cpes-branch :showCpesBranch="showCpesBranch" @showCpesBranchClose="showCpesBranchClose"
                      @showCpesBranchSubmit="showCpesBranchSubmit"></show-cpes-branch>-->
    <!--<show-cpes-branch :showCpesBranch="showCpesBranchTwo" @showCpesBranchClose="showCpesBranchTwoClose"
                      @showCpesBranchSubmit="showCpesBranchTwoSubmit"></show-cpes-branch>-->
    <recourse-accept-hist :histId="histId" :dictMap="dictMap" :showHist="showHist" :histUrl="histUrl"
                          @closeMsgBox="closeMsgBox"></recourse-accept-hist>
    <bill-info-main
      @billInfoWinClose="billInfoWinClose"
      :showBillInfoWin="showBillInfoWin"
      :billId="billId"
      :billNo="billNo"
    ></bill-info-main>

   <!-- <show-license-branch :showBranchWin="brchNoWin" title="机构查询" @brchNoChange="brchNoChange" :authPath="authPath"
                         @showBranchWinClose="brchNoWinClose" :ifcheck="true"
                         :checkStrictly="true"></show-license-branch>-->

  </div>
</template>

<script>
  import { post, on, off,formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "recourseAcceptBillAccount",
    components: {
      RecourseAcceptHist: () => import(/* webpackChunkName: "be/trust/recourse/recourseAcceptHist" */`@/views/bizViews/be/trust/recourse/recourseAcceptHist`),
      //ShowCpesBranch: () => import(/* webpackChunkName: "shcpe/cpes/branch/showCpesBranch" */`@/views/bizViews/shcpe/cpes/branch/showCpesBranch`),
      //ShowLicenseBranch: () => import(/* webpackChunkName: "sm/auth/branch/showLicenseBranch" */`@/views/bizViews/sm/auth/branch/showLicenseBranch`)

    },
    data() {
      return {
        columns: [
          {
            type: "selection",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: this.$t("m.i.common.ownedBrchNo"),
            key: "ownedBrchName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.billNo'),
            key: "billNo",
            hiddenCol: false,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params.row.billId, params.row.billNo);
                  }
                }
              }, params.row.billNo);
            }
          },
          {
            title: this.$t('m.i.billInfo.billMoney'),
            key: "billMoney",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', formatNumber(params.row.billMoney, 2, ','))
            }
          },
          {
            title: this.$t('m.i.be.recoveryType'),
            key: "recourseType",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "SendRecourseType", params.row.recourseType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.be.contingentRecourseDate'),
            key: "contingentRecourseDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let contingentRecourseDt = params.row.contingentRecourseDt == null ? "" :this.$moment(params.row.contingentRecourseDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", contingentRecourseDt);
            }
          },
          {
            title: this.$t('m.i.be.prsttnApplDt'),
            key: "prsttnApplDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let prsttnApplDt = params.row.prsttnApplDt == null ? "" :this.$moment(params.row.prsttnApplDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", prsttnApplDt);
            }
          },
          {
            title: this.$t('m.i.be.prsttnBrchName'),
            key: "prsttnBrchName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.prsttnSignCode'),
            key: "prsttnSignCode",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "SignUpMarkCode", params.row.prsttnSignCode);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.be.prsttnRefuseReasonCode'),
            key: "prsttnRefuseReasonCode",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "DishonorCode", params.row.prsttnRefuseReasonCode);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.be.prsttnSettleResult'),
            key: "prsttnSettleResult",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "StlResult", params.row.prsttnSettleResult);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.be.hldrBrchName'),
            key: "hldrBrchName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.clearOrSettleStatus'),
            key: "settleStatus",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "MmbStlStatus", params.row.settleStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.be.cashStatus'),
            key: "cashStatus",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "CashStatus", params.row.cashStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.be.currentPayBrchName'),
            key: "currentPayBrchName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.recourseRemark'),
            key: "recourseRemark",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.prsttnApplRemark'),
            key: "prsttnApplRemark",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.prsttnAnswerRemark'),
            key: "prsttnAnswerRemark",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.histList'),
            key: "histList",
            hiddenCol: false,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showHistBox(params.row.id);
                  }
                }
              }, this.$t('m.i.be.histList'));
            }
          },
          {
            title: this.$t('m.i.billInfo.ecdsBillStatus'),
            key: "billStatus",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "BarterTrustStatus", params.row.billStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.billInfo.pyeeAcctNo'),
            key: "pyeeAcctNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.pyeeBankNo'),
            key: "pyeeBankNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.pyeeName'),
            key: "pyeeName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.pyeeBankName'),
            key: "pyeeBankName",
            sortable: true,
            hiddenCol: false
          }
        ],
        contingentRecourseDate:[],
        validRules: [{ test: /^[0-9]{12}$/, trigger: "blur", message: "只能输入数字,且长度为12位" }],
        validAcctNoRules: [{ test: /^[0-9a-zA-Z]{1,32}$/, trigger: "blur", message: "只能输入数字和字母,且长度最大为32位" }],
        formItem: {
          billNo: "",
          prstBranchName: "",
          prsttnBrchCode: "",
          hldrBranchName: "",
          hldrBrchCode: "",
          minBillMoney: "",
          maxBillMoney: "",
          minContingentRecourseDate: "",
          maxContingentRecourseDate: "",
          ownedBrchName: "",
          ownedBrchNo: "",
          ownedBrchNames:"",
          ownedBrchNos:"",
          authPath: this.$route.path
        },
        recordingPayWin: false,
        isRequired: true,
        dictMap: new Map(),
        ifShowMore: false,
        //showCpesBranch: false,
        showBillInfoWin: false,
        //showCpesBranchTwo: false,
        selectData: [],
        param: {},
        showAcctRecordWin: false,
        showPrintButton: false,
        acctSubmitFlag: false,
        //授权信息
        ownedBrchName: "",
        ownedBrchNo: "",
        ownedBrchNames: "",
        ownedBrchNos: "",
        licenseFlag: false,
        authPath: this.$route.path,
        //brchNoWin: false,
        accountUrl: "be/trust/recourse/recourseAcceptBillAccount/func_submitSaveContingentRecourseBill",
        acctRecord: "be/trust/recourse/recourseAcceptBillAccount/func_recourseAcceptQueryAcctRecord",
        histId: "",
        billNo: "",
        billId: "",
        showHist: false,
        histUrl: "be/trust/recourse/recourseAcceptBillAccount/func_queryHistInfo",
        recordingPayForm: {
          id: "",
          pyeeName: "",
          pyeeAcctNo: "",
          pyeeBankNo: "",
          pyeeBankName: ""
        }
      };
    },
    methods: {
      showBillInfo(billId, billNo) {
        this.billId = billId;
        this.billNo = billNo;
        this.showBillInfoWin = true;
      },
      billInfoWinClose() {
        this.showBillInfoWin = false;
      },
      //行选中
      handleSelectClick(selection, selectInx) {
        this.selectData = selection;
      },
      /*queryBranchCode() {
        this.showCpesBranch = true;
      },*/
      /*queryBranchCode2() {
        this.showCpesBranchTwo = true;
      },*/
      /*showCpesBranchClose() {
        this.showCpesBranch = false;
      },*/
      //根据弹框所选数据进行赋值
      /*showCpesBranchSubmit(info) {
        if (info === null) {
          this.$hMessage.error("请先选择记录！");
          return;
        }
        this.formItem.prsttnBrchCode = info.brchCode;
        this.formItem.prstBranchName = info.brchFullNameZh;
        this.showCpesBranch = false;
      },*/
      /*showCpesBranchTwoClose() {
        this.showCpesBranchTwo = false;
      },*/
      //根据弹框所选数据进行赋值
      /*showCpesBranchTwoSubmit(info) {
        if (info === null) {
          this.$hMessage.error("请先选择记录！");
          return;
        }
        this.formItem.hldrBrchCode = info.brchCode;
        this.formItem.hldrBranchName = info.brchFullNameZh;
        this.showCpesBranchTwo = false;
      },*/
      formSearch() {

        /**清除多页选择的数据*/
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
      },
      handleContingentRecourseDateChange(arr){
        if (arr && arr.length >= 2) {
          this.formItem.minContingentRecourseDate = arr[0].replace(/-/g, "");
          this.formItem.maxContingentRecourseDate = arr[1].replace(/-/g, "");
          this.contingentRecourseDate = [arr[0],arr[1]];
        } else {
          this.formItem.minContingentRecourseDate = "";
          this.formItem.maxContingentRecourseDate = "";
          this.contingentRecourseDate = [];
        }
      },
      formSearchReset() {
        this.formItem.ownedBrchNo = "";
        this.formItem.ownedBrchName = "";
        this.formItem.ownedBrchNos = "";
        this.formItem.ownedBrchNames = "";
        this.contingentRecourseDate = [];
        this.formItem.minBillMoney = "";
        this.formItem.maxBillMoney = "";
        this.$refs.formItem.resetFields();
        this.formItem.prsttnBrchCode = "";
        this.formItem.prstBranchName = "";
        this.formItem.hldrBrchCode = "";
        this.formItem.hldrBranchName = "";
      },
      // 关闭记账窗口
      showAcctRecordWinClose() {
        /**清除多页选择的数据*/
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
        this.showPrintButton = false;
        this.showAcctRecordWin = false;
      },
      printSuccessCallback() {
        this.showAcctRecordWinClose();
      },
      acctRecordSure(info) {
        this.acctSubmitFlag = true;
        post({ ids: info.ids ,ownedBrchNo:info.ownedBrchNo,licenseFlag:this.licenseFlag }, this.accountUrl).then(res => {
          this.acctSubmitFlag = false;
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$msgTip.success(this, { info: "操作成功" });
              this.showPrintButton = true;
              this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
              /**清除多页选择的数据*/
              this.$refs.datagrid.selectIds = [];
              this.$refs.datagrid.selects = [];
              if (!info.isHasPrint) {
                this.showAcctRecordWinClose();
              }
            } else {
              /**清除多页选择的数据*/
              this.$refs.datagrid.selectIds = [];
              this.$refs.datagrid.selects = [];
              this.$msgTip.error(this, { info: res.data.retMsg });
              this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      account() {
        let list = this.$refs.datagrid.selects;
        if (null == list || list.length == 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        let ownedBrchNo = "";
        let flag = true;
        list.forEach(row => {
          if (ownedBrchNo !== "" && ownedBrchNo !== row.ownedBrchNo) {
            this.$msgTip.info(this, { info: "请选择相同的机构下的票据记账" });
            return flag = false;
          }
          ownedBrchNo = row.ownedBrchNo;
        });
        this.formItem.ownedBrchNo = ownedBrchNo;

        let ids = "";
        let pyeeAcctNo = "";
        let pyeeBankNo = "";
        let pyeeName = "";
        let pyeeBankName = "";
        let recourseType = "";
        for (let i = 0; i < list.length; i++) {
          ids += list[i].id;
          if (i < list.length - 1) {
            ids += ",";
          }
          recourseType = list[i].recourseType;
          pyeeAcctNo = list[i].pyeeAcctNo;
          pyeeBankNo = list[i].pyeeBankNo;
          pyeeBankName = list[i].pyeeBankName;
          pyeeName = list[i].pyeeName;
          if (recourseType == "2" && (pyeeAcctNo == "" || pyeeBankNo == "" || pyeeBankName == "" || pyeeName == ""
            || pyeeAcctNo == null || pyeeBankNo == null || pyeeBankName == null || pyeeName == null)) {
            this.$msgTip.info(this, { info: "线下被追索记账，必须输入收款人名称、收款人账号、收款人行号、收款人行名" });
            return;
          }
        }
        this.param = { ids: ids,ownedBrchNo:ownedBrchNo,licenseFlag:this.licenseFlag };
        this.showAcctRecordWin = true;//分录弹出框
      },
      recording() {
        let list = this.$refs.datagrid.selects;
        if (list != null && list.length == 1) {
          if (list[0].recourseType == "2") {
            this.recordingPayWin = true;
            this.recordingPayForm.id = list[0].id;
            this.recordingPayForm.pyeeName = list[0].pyeeName;
            this.recordingPayForm.pyeeAcctNo = list[0].pyeeAcctNo;
            this.recordingPayForm.pyeeBankNo = list[0].pyeeBankNo;
            this.recordingPayForm.pyeeBankName = list[0].pyeeBankName;
          } else {
            this.$msgTip.info(this, { info: "线上追索无需补录收款人账号" });
          }
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
      },
      recordingSubmitForm() {
        this.$refs['recordingPayForm'].validate((valid) => {
          if (valid) {
            post(this.recordingPayForm, "/be/trust/recourse/recourseAcceptBillAccount/func_recordingPay").then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode == "000000") {
                  this.$msgTip.success(this, { info: "操作成功" });
                  this.recordingPayWin = false;
                  /**清除多页选择的数据*/
                  this.$refs.datagrid.selectIds = [];
                  this.$refs.datagrid.selects = [];
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);

                } else {
                  this.$msgTip.error(this, { info: "操作失败:" + res.data.retMsg });
                  /**清除多页选择的数据*/
                  this.$refs.datagrid.selectIds = [];
                  this.$refs.datagrid.selects = [];
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                }
              } else {
                this.$msgTip.error(this, { info: "操作失败" });
                this.$refs.datagrid.selectIds = [];
                this.$refs.datagrid.selects = [];
              }
            });

          }
        })
      },
      recordingClose() {
        this.recordingPayWin = false;
        /**清除多页选择的数据*/
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
        this.$refs.recordingPayForm.resetFields();
      },
      closeMsgBox() {
        this.showHist = false;
      },
      showHistBox(histId) {
        this.histId = histId;
        this.showHist = true;
      },
      /*clearVal(type) {
        if (type == "prstBranchName") {
          this.formItem.prsttnBrchCode = "";
          this.formItem.prstBranchName = "";
        }
        if (type == "hldrBranchName") {
          this.formItem.hldrBrchCode = "";
          this.formItem.hldrBranchName = "";
        }
      },*/

      //根据弹框所选数据进行赋值
    /*  brchNoChange(info) {
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
      },*/
    },
    mounted() {
      this.getDictListByGroups("RiskStatus,CashStatus,MmbStlStatus,BarterTrustStatus,SendRecourseType,DishonorCode,SignUpMarkCode,RecourseType,StlResult,IsAcctSuccess").then(res => {
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
