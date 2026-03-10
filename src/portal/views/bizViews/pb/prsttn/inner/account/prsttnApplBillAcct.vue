<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!-- 查询表单 -->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form ref="formItem" :model="formItem" :label-width="90" class="h-form-search" cols="4">
               <!-- <h-form-item :label="$t('m.i.common.ownedBrchNo')" prop="ownedBrchNos" v-if="this.licenseFlag">
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
                <!-- 票据类型 -->
                <bill-type v-model="formItem.billType" :dictList="BillTypeList"></bill-type>
                <!-- 票据类型 -->
                <bill-class v-model="formItem.billClass" :dictList="BillClassList"></bill-class>
                <!-- 风险标识 -->
                <common-select v-model="formItem.riskStatus" :label="$t('m.i.billInfo.riskStatus')" prop="riskStatus"
                               :dictList="RiskStatusList"></common-select>
                <!-- 票据来源 -->
                <common-select :label="$t('m.i.billInfo.billOrigin')" prop="billOrigin"
                               v-model="formItem.billOrigin" :dictList="billOriginList"></common-select>
                <!-- 票据号码 -->
                <bill-no :label="$t('m.i.billInfo.billPackageNo')" v-model="formItem.reverseBillNo" prop="reverseBillNo"></bill-no>
                <!-- 子票区间 -->
                <bill-range :formItem="formItem" :rangeProps="['minBillRangeStart','maxBillRangeEnd']"></bill-range>
                <!-- 票据金额 -->
                <bill-money-range :label="$t('m.i.billInfo.billPackageMoney')" v-model="formItem" :bigTips="false"
                                  :rangeProps="['minBillMoney','maxBillMoney']" class="h-form-long-label"></bill-money-range>
                <!-- 承兑行名称 -->
                <common-input prop="acptBankNameTem" :label="$t('m.i.billInfo.acptBankName')" class="h-form-long-label"
                              v-model="formItem.acptBankNameTem" readonly :showIcon="true"
                              @on-click="queryBranchName()" placeholder=""
                              clearable :clearVal="clearVal" clearValTag="acptBankNameTem"></common-input>
                <!-- 出票日 -->
                <remit-dt-range v-model="remitDt" :minRemitDt.sync="formItem.minRemitDt" :maxRemitDt.sync="formItem.maxRemitDt"></remit-dt-range>
                <!-- 汇票到期日 -->
                <due-dt-range v-model="dueDt" :minDueDt.sync="formItem.minDueDt" :maxDueDt.sync="formItem.maxDueDt"></due-dt-range>
                <h-form-item class="h-form-operate">
                    <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                                    :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="handleSearch">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="resetSearch">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid
            :columns="columns"
            highlight-row
            url="/pb/prsttn/inner/account/ePrsttnAccountMain/func_pageQueryPrsttnBill"
            :bindForm="formItem"
            :hasSelect="false"
            rowSelect
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="receiveAllMoney()">{{$t('m.i.ce.allReceiveAcct')}}</h-button>
              <h-button type="primary" v-if="showPartAcct" @click="receivePartMoney()">{{$t('m.i.ce.partReceiveAcct')}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--  部分回款记账页面-->
    <h-msg-box v-model="addOrEditWin" width="500" class="h-form-search-layer" :maximize="true" :mask-closable="false" on-close="handleClose">
      <p slot="header">
        <span>部分回款</span>
      </p>
      <h-panel>
        <h-form :model="addOrEditForm" :label-width="115" ref="addOrEditForm" cols="1" class="h-form-search" onlyBlurRequire>
          <!--票据(包)号码-->
          <bill-no :label="$t('m.i.billInfo.billPackageNo')" v-model="addOrEditForm.billNo" prop="billNo" :readonly="true" :required="true"></bill-no>
          <!--子票区间-->
          <common-input :label="$t('m.i.billInfo.billRange')" v-model="addOrEditForm.billRange" prop="billRange" :readonly="true" :required="true" ></common-input>
          <!--票据(包)金额(元)-->
          <common-input :label="$t('m.i.billInfo.billPackageMoney')" v-model="addOrEditForm.billMoney" prop="billMoney"
                        :readonly="true" :required="true" @on-blur="formatBillMoney('blur', 'billMoney')"></common-input>
          <!--已回款金额(元)-->
          <common-input :label="$t('m.i.billInfo.returnMoney')" v-model="addOrEditForm.returnMoney" prop="returnMoney"
                        :readonly="true" :required="true" v-if="showReturnMoney" @on-blur="formatBillMoney('blur', 'returnMoney')"></common-input>
          <!--未回款金额(元)-->
          <common-input :label="$t('m.i.billInfo.noReturnMoney')" v-model="addOrEditForm.noReturnMoney" prop="noReturnMoney"
                        :readonly="true" :required="true" v-if="showReturnMoney" @on-blur="formatBillMoney('blur', 'noReturnMoney')"></common-input>
          <!--本次回款金额(元)-->
          <common-input :label="$t('m.i.billInfo.thisReturnMoney')" v-model="addOrEditForm.thisReturnMoney" prop="thisReturnMoney"
                        :readonly="thisReturnMoneyReadonly" :required="true" @on-blur="formatBillMoney('blur', 'thisReturnMoney')"
                        @on-focus="formatBillMoney('focus', 'thisReturnMoney')" :validRules="thisReturnMoneyRule"></common-input>
        </h-form>
      </h-panel>
      <div slot="footer">
        <h-button type="ghost" @click="handleClose()">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary"  @click="submit()">{{$t("m.i.common.submit")}}</h-button>
      </div>
    </h-msg-box>
    <!-- 查询票交机构代码 -->
    <show-cpes-branch :showCpesBranch="showCpesBranch" @showCpesBranchClose="showCpesBranchClose"
                      @showCpesBranchSubmit="showCpesBranchSubmit"></show-cpes-branch>
    <acct-record :param="param" :showAcctRecordWin="showAcctRecordWin" @showAcctRecordWinClose="showAcctRecordWinClose"
                 :submitFlag="acctSubmitFlag"
                 :showPrintButton="showPrintButton"
                 @printSuccessCallback="printSuccessCallback"
                 url="/pb/prsttn/inner/account/ePrsttnAccountMain/func_generateAcctRecord"
                 @acctSubmitSure="prsttnApplAcct"></acct-record>
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin"
                    :billId="this.billId" :billRangeStart="this.billRangeStart" :billRangeEnd="this.billRangeEnd"></bill-info-main>

    <!--<show-license-branch :showBranchWin="brchNoWin" title="机构查询" @brchNoChange="brchNoChange" :authPath="authPath"
                         @showBranchWinClose="brchNoWinClose" :ifcheck="true"
                         :checkStrictly="true"></show-license-branch>
-->
  </div>
</template>

<script>
  import { post, on, off, formatNumber,accSub,formatBillRange } from "@/api/bizApi/commonUtil";

  export default {
    name: "prsttnApplBillAcct",
    components: {
      ShowCpesBranch:()=>import(/* webpackChunkName: "shcpe/cpes/branch/showCpesBranch" */`@/views/bizViews/shcpe/cpes/branch/showCpesBranch`),
      //ShowLicenseBranch: () => import(/* webpackChunkName: "sm/auth/branch/showLicenseBranch" */`@/views/bizViews/sm/auth/branch/showLicenseBranch`)

    },
    data() {
      return {
        formItem: {
          billType: "",
          billClass: "",
          riskStatus: "",
          settleBusiType: "",
          reverseBillNo: "",
          acptBankNo: "",
          acptBankNameTem: "",
          maxBillMoney: "",
          minBillMoney: "",
          acptDt: "",
          dueDt: "",
          minRemitDt: "",
          maxRemitDt: "",
          minDueDateInt: "",
          maxDueDateInt: "",
          ownedBrchName: "",
          ownedBrchNo: "",
          ownedBrchNames:"",
          ownedBrchNos:"",
          billOrigin: "",
          minBillRangeStart: "",
          maxBillRangeEnd: "",
          inOutFlag: "2",
          curFuncNo: "PICE040202",
          orderByClause: "PRSTTN_DT, ID",
          authPath: this.$route.path,
        },
        remitDt:[],
        dueDt:[],
        columns: [
          {
            type: "selection",
            hiddenCol: false,
            width: 60,
            align: "center"
          },
          {
            type: "index",
            title: this.$t("m.i.common.index"),
            align: "center",
            width: 60,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.ownedBrchNo"),
            key: "ownedBrchName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.billType'),
            key: "billType",
            hiddenCol: false,
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
            title: this.$t('m.i.billInfo.billClass'),
            key: "billClass",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "CDMedia", params.row.billClass);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.billInfo.billOrigin"),
            key:'billOrigin',
            hiddenCol: false,
            render:(h,params) => {
              if (!params.row.billOrigin || "CS00" === params.row.billOrigin){
                return h("span", "-");
              }
              let dictValue = this.getDictValueFromMap(this.dictMap,"BillOrigin",params.row.billOrigin);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.billInfo.billPackageNo'),
            key: "billNo",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params.row);
                  }
                }
              }, params.row.billNo);
            }
          },
          {
            title: this.$t("m.i.billInfo.billRange"),
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
            title: this.$t('m.i.billInfo.billPackageMoney'),
            key: "billMoney",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("p", formatNumber(params.row.billMoney, 2, ","));
            }
          },
          {
            title: this.$t("m.i.billInfo.returnMoney"),
            key: "returnMoney",
            sortable: true,
            hiddenCol: true,
            render: (h, params) => {
              let returnMoney = formatNumber(params.row.returnMoney, 2, ',');
              return h("span", {
                domProps: {
                  title: returnMoney
                }
              }, returnMoney);
            }
          },
          {
            title: this.$t("m.i.billInfo.noReturnMoney"),
            key: "noReturnMoney",
            sortable: true,
            hiddenCol: true,
            render: (h, params) => {
              let noReturnMoney = formatNumber(params.row.noReturnMoney, 2, ',');
              return h("span", {
                domProps: {
                  title: noReturnMoney
                }
              }, noReturnMoney);
            }
          },
          {
            title: this.$t('m.i.billInfo.riskStatus'),
            key: "riskStatus",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "RiskStatus", params.row.riskStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.billInfo.pyeeName'),
            key: "pyeeName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.drwrName'),
            key: "drwrName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.drwrAcctNo'),
            key: "drwrAcctNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.remitDt'),
            key: "remitDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (null != params.row.remitDt && "" !== params.row.remitDt) {
                let dttm = this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD");
                return h("span", dttm);
              }
            }
          },
          {
            title: this.$t('m.i.billInfo.dueDt'),
            key: "dueDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (null != params.row.dueDt && "" !== params.row.dueDt) {
                let dttm = this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
                return h("span", dttm);
              }
            }
          },
          {
            title: this.$t('m.i.billInfo.flowStatus'),
            key: "flowStatusName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.acptName'),
            key: "acptName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.acptBankNo'),
            key: "acptBankNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.acptBankName'),
            key: "acptBankName",
            sortable: true,
            hiddenCol: false
          }
        ],
        authObj: {
          sendPrsttnApplBtn: true
        },
        ifShowMore: false,
        showCpesBranch: false,
        addOrEditWin : false,
        showPartAcct:false,
        addOrEditForm :{
          billNo:"",
          billMoney:"",
          returnMoney:"",
          noReturnMoney:"",
          thisReturnMoney:"",
          ownedBrchNo :"",
          licenseFlag:false,
        },
        BillTypeList: [],
        BillClassList: [],
        RiskStatusList: [],
        dictMap: null,
        showBillInfoWin: false,
        billId: "",
        billRangeStart: "",
        billRangeEnd: "",
        param: {},
        acctSubmitFlag: false,
        showAcctRecordWin: false,
        showPrintButton: false,
        //授权信息
        ownedBrchName: "",
        ownedBrchNo: "",
        ownedBrchNames: "",
        ownedBrchNos: "",
        licenseFlag: false,
        authPath: this.$route.path,
       // brchNoWin: false,
        selectData: [],
        showReturnMoney:true,
        thisReturnMoneyReadonly:false,
        thisReturnMoneyRule: [{ test: this.validateThisReturnMoney, trigger: "blur" }],
      };
    },
    mounted() {
      this.getDictListByGroups("CDMedia,DraftTypeCode,RiskStatus,BarterTrustStatus,BillOrigin").then(res => {
        this.BillClassList = res.get("CDMedia");
        this.BillTypeList = res.get("DraftTypeCode");
        this.RiskStatusList = res.get("RiskStatus");
        this.billOriginList = res.get("BillOrigin");
        this.dictMap = res.get("map");
      });
      this.getShowPartAcct();
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
    },
    methods: {
      handleClose(){
        this.addOrEditWin = false;
        this.addOrEditForm.billClass="";
        this.addOrEditForm.billType="";
        this.addOrEditForm.thisReturnMoney="";
      },
      getShowPartAcct() {
        let paramKey = "be.trust.prsnttn_part_acct";
        post({ paramKey :paramKey}, "/sm/auth/businessParamete/getBusinessParameter").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let param = res.data.retData;
              this.showPartAcct = param === "1";
              if(this.showPartAcct){
                this.$nextTick(() => {
                  this.$refs.datagrid.controlColumnsHidden("returnMoney", false);
                  this.$refs.datagrid.controlColumnsHidden("noReturnMoney", false);
                });
              }
            } else {
              this.showPartAcct = false;
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      handleSearch() {
        this.selectData = [];
        /**清除多页选择的数据*/
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.dataChange(1);
      },
      handleIssuDateChange(arr){
        if (arr && arr.length >= 2) {
          this.formItem.minRemitDt = arr[0].replace(/-/g, "");
          this.formItem.maxRemitDt = arr[1].replace(/-/g, "");
          this.remitDt = [arr[0],arr[1]];
        } else {
          this.formItem.minRemitDt = "";
          this.formItem.maxRemitDt = "";
          this.remitDt = [];
        }
      },
      handleDueDtChange(arr){
        if (arr && arr.length >= 2) {
          this.formItem.minDueDateInt = arr[0].replace(/-/g, "");
          this.formItem.maxDueDateInt = arr[1].replace(/-/g, "");
          this.dueDt = [arr[0],arr[1]];
        } else {
          this.formItem.minDueDateInt = "";
          this.formItem.maxDueDateInt = "";
          this.dueDt = [];
        }
      },
      handleRowClick(arr) {
        this.selectData = arr;
      },
      //重置查询结果
      resetSearch() {
        this.formItem.ownedBrchNo = "";
        this.formItem.ownedBrchName = "";
        this.formItem.ownedBrchNos = "";
        this.formItem.ownedBrchNames = "";
        this.$refs.formItem.resetFields();
        this.dueDt = [];
        this.formItem.minDueDateInt = "";
        this.formItem.maxDueDateInt = "";
        this.remitDt = [];
        this.formItem.acptBankNameTem = "";
        this.formItem.acptBankNo = "";
      },
      printSuccessCallback() {
        this.showAcctRecordWinClose();
        this.$refs.datagrid.dataChange(1);
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.selects = [];
      },
      receiveAllMoney() {
        let selects = this.$refs.datagrid.selects;
        if (null === selects || selects.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
          return;
        }
        let ids = [];
        let billClass = "";
        let billType = "";
        let ownedBrchNo = "";
        for(let i=0 ; i< selects.length; i++){
          let row = selects[i];
          if (billClass !== "" && billClass !== row.billClass) {
            this.$msgTip.info(this, { info: "请选择票据介质相同的票据记账" });
            return;
          }
          if (billType !== "" && billType !== row.billType) {
            this.$msgTip.info(this, { info: "请选择票据种类相同的票据记账" });
            return;
          }
          if (ownedBrchNo !== "" && ownedBrchNo !== row.ownedBrchNo) {
            this.$msgTip.info(this, { info: "请选择相同的机构下的票据记账" });
            return;
          }
          ownedBrchNo = row.ownedBrchNo;
          billType = row.billType;
          billClass = row.billClass;
          ids.push(row.id);
        }
        this.param = { ids: ids,accountType:"1",receiveMoney:"",ownedBrchNo:ownedBrchNo,
          licenseFlag:this.licenseFlag,inOutFlag:"2",billClass: billClass,billType:billType };
        this.showAcctRecordWin = true;
      },

      receivePartMoney() {
        let selects = this.$refs.datagrid.selects;
        if (null === selects || selects.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        if (this.$refs.datagrid.selects.length > 1) {
          this.$msgTip.info(this,{info:this.$t("m.i.common.onlyChooseOneData")});
          return;
        }
        let obj = selects[0];
        post({id:obj.id}, "/pb/prsttn/inner/account/prsttnApplBillAcct/func_getPrsttnApplBillHisById").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.addOrEditWin = true;
              this.addOrEditForm.ownedBrchNo = obj.ownedBrchNo;
              this.addOrEditForm.licenseFlag = this.licenseFlag;
              this.addOrEditForm.billNo=obj.billNo;
              this.addOrEditForm.billRange = formatBillRange(obj.billOrigin, obj.billRangeStart, obj.billRangeEnd);
              this.addOrEditForm.billMoney=obj.billMoney;
              this.addOrEditForm.billClass=obj.billClass;
              this.addOrEditForm.billType=obj.billType;
              this.formatBillMoney('blur', 'billMoney');
              if (res.data.retData) {
                this.showReturnMoney = false;
                this.thisReturnMoneyReadonly = true;
                this.addOrEditForm.thisReturnMoney = res.data.retData.receiveMoney;
                this.formatBillMoney('blur', 'thisReturnMoney');
              } else {
                this.showReturnMoney = true;
                this.thisReturnMoneyReadonly = false;
                this.addOrEditForm.returnMoney=this.$refs.datagrid.selects[0].returnMoney;
                this.addOrEditForm.noReturnMoney=this.$refs.datagrid.selects[0].noReturnMoney;
                this.addOrEditForm.thisReturnMoney = this.addOrEditForm.noReturnMoney;
                this.formatBillMoney('blur', 'returnMoney');
                this.formatBillMoney('blur', 'noReturnMoney');
                this.formatBillMoney('blur', 'thisReturnMoney');
              }
            } else {
              this.$msgTip.error(this, { info: msg });
              this.$refs.datagrid.dataChange(1);
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        })
      },
      submit(){
        this.$refs['addOrEditForm'].validate((valid) => {
          if (valid) {
            this.ids = this.$refs.datagrid.selectIds.join(",");
            let receiveMoney = this.addOrEditForm.thisReturnMoney.replace(/,/g, "");
            this.param = { ids: this.ids ,accountType:"0",receiveMoney:receiveMoney, billClass: this.addOrEditForm.billClass,
            ownedBrchNo:this.addOrEditForm.ownedBrchNo,licenseFlag:this.licenseFlag, billType: this.addOrEditForm.billType};
            this.addOrEditWin = false;
            this.addOrEditForm.thisReturnMoney ="";
            this.showAcctRecordWin = true;
          }})


      },
      showAcctRecordWinClose() {
        this.showPrintButton = false;
        this.showAcctRecordWin = false;
        this.$refs.datagrid.dataChange(1);
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.selects = [];
      },
      prsttnApplAcct(info) {
        this.acctSubmitFlag = true;
        post({ ids: info.ids ,accountType:info.accountType,receiveMoney:info.receiveMoney,billClass: info.billClass,billType: info.billType,
          ownedBrchNo:info.ownedBrchNo,licenseFlag:this.licenseFlag,inOutFlag:"2" }, "/pb/prsttn/inner/account/prsttnApplBillAcct/func_regReceiveMoney").then(res => {
          this.acctSubmitFlag = false;
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.showPrintButton = true;
              if (!info.isHasPrint) {
                this.showAcctRecordWinClose();
              }
              this.$msgTip.success(this, { info: "操作成功" });
            } else {
              this.$msgTip.error(this, { info: msg });
              this.showAcctRecordWinClose();
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      queryBranchName() {
        this.showCpesBranch = true;
      },
      showCpesBranchClose() {
        this.showCpesBranch = false;
      },
      showCpesBranchSubmit(info) {
        if (info === null) {
          this.$msgTip.error(this, { info: "请先选择记录！" });
          return;
        }
        this.formItem.acptBankNo = info.transBrchBankNo;
        this.formItem.acptBankNameTem = info.brchFullNameZh;
        this.showCpesBranch = false;
      },
      billInfoWinClose() {
        this.showBillInfoWin = false;
      },
      showBillInfo(row) {
        this.billId = row.billId;
        this.billRangeStart=row.billRangeStart;
        this.billRangeEnd=row.billRangeEnd;
        this.showBillInfoWin = true;
      },
      clearVal(type) {
        if (type === "acptBankNameTem") {
          this.formItem.acptBankNo = "";
          this.formItem.acptBankNameTem = "";
        }
      },
      formatBillMoney(optType, field) {
        if (optType === "blur") {
          if (!isNaN(parseFloat(this.addOrEditForm[field])) && isFinite(this.addOrEditForm[field])) {
            this.addOrEditForm[field] = this.addOrEditForm[field] == null ? "0.00" : formatNumber(this.addOrEditForm[field], 2, ",");
          }
        } else if (optType === "focus") {
          this.addOrEditForm[field] = this.addOrEditForm[field].toString().replace(/,/g, "");
        }
      },
      validateThisReturnMoney(rule, val, callback) {
        let noReturnMoney = this.addOrEditForm["noReturnMoney"].toString().replace(/,/g, "");
        let value = val.toString().replace(/,/g, "");
        let re = /^([1-9]\d{0,8}|0)([.]?|(\.\d{1,2})?)$/;
        if (re.test(value)) {
          if(value > 0 && Number(value) <= Number(noReturnMoney)){
            callback();
          }else{
            callback(new Error("本次回款金额应小于等于未回款金额[" + this.addOrEditForm["noReturnMoney"] + "]、大于0.00"));
          }
        } else {
          callback(new Error("本次回款金额为大于0.00的不超过100万的数字，且小数位不超过两位"));
        }
      },
    }
  };
</script>

<style scoped>

</style>
