<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!-- 查询表单 -->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form ref="formItem" :model="formItem" :label-width="90" class="h-form-search" cols="4">
                <show-branch v-model="formItem.ownedBrchNames"  :label="$t('m.i.common.ownedBrchNo')"  prop="ownedBrchNames"
                             v-if="this.licenseFlag"    :showCheckBox="true"     :brchNo.sync="formItem.ownedBrchNos" :brchName.sync="formItem.ownedBrchNames"
                             :params="{authPath:this.$route.path}"
                             url ="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree"
                             queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
                </show-branch>
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
                <bill-money-range :label="$t('m.i.billInfo.billPackageMoney')" :bigTips="false"
                                  v-model="formItem" :rangeProps="['minBillMoney','maxBillMoney']" class="h-form-long-label"></bill-money-range>
                <!-- 出票日 -->
                <remit-dt-range v-model="remitDt" :minRemitDt.sync="formItem.minRemitDt" :maxRemitDt.sync="formItem.maxRemitDt"></remit-dt-range>
                <!-- 汇票到期日 -->
                <due-dt-range v-model="dueDate" :minDueDt.sync="formItem.minDueDt" :maxDueDt.sync="formItem.maxDueDt"></due-dt-range>
                <!-- 承兑行名称 -->
                <common-input prop="acptBankNameTem" :label="$t('m.i.billInfo.acptBankName')" class="h-form-long-label"
                              v-model="formItem.acptBankNameTem" readonly :showIcon="true"
                              @on-click="queryBranchName()" placeholder=""
                              clearable :clearVal="clearVal" clearValTag="acptBankNameTem"></common-input>
                <!-- 是否被拒绝 -->
                <common-select v-model="formItem.isRefuse" :label="$t('m.i.ce.isRefuse')" prop="isRefuse"
                               :dictList="IsRefuseList"></common-select>
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
            url="/pb/prsttn/inner/account/prsttnApplBillPartMain/func_queryApplyHldrInfoForElec"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @on-click="sendPrsttnAppl()" v-if="authObj.sendPrsttnApplBtn">{{$t('m.i.ce.partReceiveAcct')}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <!--  部分回款记账页面-->
    <h-msg-box v-model="addOrEditWin" width="500" class="h-form-search-layer" :maximize="true" :mask-closable="false" on-close="handleClose">
      <p slot="header">
        <span>部分收回</span>
      </p>
      <h-panel>
        <h-form :model="addOrEditForm" :label-width="115" ref="addOrEditForm" cols="1" class="h-form-search">
          <!--票据(包)号码-->
          <bill-no :label="$t('m.i.billInfo.billPackageNo')" v-model="addOrEditForm.billNo" prop="billNo" :readonly="true" :required="true"></bill-no>
          <!--子票区间-->
          <common-input :label="$t('m.i.billInfo.billRange')" v-model="addOrEditForm.billRange" prop="billRange" :readonly="true" :required="true" ></common-input>
          <!--票据(包)金额(元)-->
          <common-input :label="$t('m.i.billInfo.billPackageMoney')" v-model="addOrEditForm.billMoney" prop="billMoney"
                        :readonly="true" :required="true" @on-blur="formatBillMoney('blur', 'billMoney')"></common-input>
          <!--本次回款金额(元)-->
          <common-input :label="$t('m.i.billInfo.thisReturnMoney')" v-model="addOrEditForm.returnMoney" prop="returnMoney"
                        :required="true" @on-blur="formatBillMoney('blur', 'returnMoney')"
                        @on-focus="formatBillMoney('focus', 'returnMoney')"></common-input>
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
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin"
                    :billId="this.billId" :billRangeStart="this.billRangeStart" :billRangeEnd="this.billRangeEnd"></bill-info-main>

    <!-- <show-license-branch :showBranchWin="brchNoWin" title="机构查询" @brchNoChange="brchNoChange" :authPath="authPath"
                          @showBranchWinClose="brchNoWinClose" :ifcheck="true"
                          :checkStrictly="true"></show-license-branch>-->

  </div>
</template>

<script>
import { post, on, off, formatNumber,formatBillRange } from "@/api/bizApi/commonUtil";

export default {
  name: "prsttnApplBillMain",
  components: {
    ShowCpesBranch:()=>import(/* webpackChunkName: "shcpe/cpes/branch/showCpesBranch" */`@/views/bizViews/shcpe/cpes/branch/showCpesBranch`),
  },
  data() {
    return {
      formItem: {
        billType: "",
        billClass: "",
        riskStatus: "",
        settleBusiType: "",
        reverseBillNo: "",
        billOrigin: "",
        minBillRangeStart: "",
        maxBillRangeEnd: "",
        acptBankNo: "",
        acptBankNameTem: "",
        maxBillMoney: "",
        minBillMoney: "",
        minRemitDt: "",
        maxRemitDt: "",
        minDueDt: "",
        maxDueDt: "",
        busiType: "",
        isRefuse: "",
        ownedBrchName: "",
        ownedBrchNo: "",
        ownedBrchNames:"",
        ownedBrchNos:"",
        inOutFlag: "2",
        authPath: this.$route.path,
      },
      remitDt:[],
      dueDate:[],
      columns: [
        {
          type: "radio",
          hiddenCol: false,
          width: 60,
          title: " ",
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
          title: this.$t('m.i.billInfo.flowStatus'),
          key: "billStatus",
          hiddenCol: false,
          render: (h, params) => {
            let list = this.getDictValueFromMap(this.dictMap, "BillStatusCode", params.row.billStatus);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
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
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            if (null != params.row.dueDt && "" !== params.row.dueDt) {
              let dttm = this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", dttm);
            }
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
      BillTypeList: [],
      BillClassList: [],
      RiskStatusList: [],
      billOriginList: [],
      IsRefuseList:[{
        key:"1",value:"被拒绝"
      }],
      dictMap: null,
      showBillInfoWin: false,
      billId: "",
      billRangeStart: "",
      billRangeEnd: "",
      //授权信息
      ownedBrchName: "",
      ownedBrchNo: "",
      ownedBrchNames: "",
      ownedBrchNos: "",
      licenseFlag: false,
      authPath: this.$route.path,
      param: {},
      addOrEditWin:false,
      addOrEditForm:{
        billNo:"",
        billRange: "",
        billMoney:"",
        returnMoney:"",
      },
      currentSelectRow:[],
      //brchNoWin: false,
    };
  },
  mounted() {
    this.getDictListByGroups("CDMedia,DraftTypeCode,RiskStatus,BillStatusCode,BillOrigin").then(res => {
      this.BillClassList = res.get("CDMedia");
      this.BillTypeList = res.get("DraftTypeCode");
      this.RiskStatusList = res.get("RiskStatus");
      this.billOriginList = res.get("BillOrigin");
      this.dictMap = res.get("map");
    });
    this.getParams();

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
    handleSearch() {
      /**清除多页选择的数据*/
      this.$refs.datagrid.selectIds = [];
      this.$refs.datagrid.selects = [];
      this.$refs.datagrid.dataChange(1);
    },
    //重置查询结果
    resetSearch() {
      this.formItem.ownedBrchNo = "";
      this.formItem.ownedBrchName = "";
      this.formItem.ownedBrchNos = "";
      this.formItem.ownedBrchNames = "";
      this.remitDt = [];
      this.dueDate = [];
      this.formItem.acptBankNameTem = "";
      this.formItem.acptBankNo ="";
      this.$refs.formItem.resetFields();
    },
    sendPrsttnAppl() {
      let list = this.$refs.datagrid.selects;
      if (this.currentSelectRow.length === 0) {
        this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
        return;
      }
      // 组装申请明细数据
      this.addOrEditForm.billNo = this.currentSelectRow.billNo;
      this.addOrEditForm.billRange = formatBillRange(this.currentSelectRow.billOrigin, this.currentSelectRow.billRangeStart, this.currentSelectRow.billRangeEnd);
      this.addOrEditForm.billMoney = this.currentSelectRow.billMoney;
      this.formatBillMoney('blur', 'billMoney');
      this.addOrEditForm.returnMoney = this.currentSelectRow.billMoney;
      this.formatBillMoney('blur', 'returnMoney');
      this.addOrEditWin = true;
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
    getParams(){
      if (this.$route.path === "/pb/prsttn/prsttnApplBillMain") {
        if (this.$route.query.busiType) {
          this.formItem.busiType = this.$route.query.busiType;
          this.formItem.isRefuse = "1";
          this.$nextTick(() => {
            this.handleSearch();
          });
        }
        if (this.$route.query.minDueDt && this.$route.query.maxDueDt) {
          let minDueDt = this.$moment(this.$route.query.minDueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
          let maxDueDt = this.$moment(this.$route.query.maxDueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
          this.dueDate = [minDueDt, maxDueDt];
          this.$nextTick(() => {
            this.handleSearch();
          });
        }
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
    isRefuseButton(res) {
      this.handleSearch();
    },
    handleClose(){
      this.addOrEditWin = false;
    },
    submit() {
      this.$refs['addOrEditForm'].validate((valid) => {
          if (valid) {
            this.param.ownedBrchNo = this.currentSelectRow.ownedBrchNo;
            this.param.licenseFlag = this.licenseFlag;
            this.param.billId = this.currentSelectRow.billId;
            this.param.hldrId = this.currentSelectRow.hldrId;
            this.param.returnMoney = this.addOrEditForm.returnMoney.replace(/,/g, "");
            post(this.param, "/pb/prsttn/inner/account/prsttnApplBillAcct/func_regReceiveMoney").then(res => {
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.addOrEditWin = false;
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                  this.$msgTip.success(this, { info: "操作成功" });
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
    handleCurrentChange(currValue){
      this.currentSelectRow = currValue;
    },
    handleCurrentChangeCancel(){
      this.currentSelectRow = [];
    }
  },
  watch: {
    "$route": "getParams"
  },
};
</script>

<style scoped>

</style>
