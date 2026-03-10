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
                <h-form-item :label="$t('m.i.common.brchName')" prop="brchNos">
                  <h-input v-model="formItem.brchNos" placeholder="" readonly
                           icon="android-search" @on-click="queryBrchNo"
                           v-show="false"
                  ></h-input>
                  <h-input v-model="formItem.branchName" placeholder="" readonly
                           icon="android-search" @on-click="queryBrchNo" :title="formItem.branchName"
                  ></h-input>
                </h-form-item>
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
                <due-dt-range v-model="dueDate" :minDueDt.sync="formItem.minDueDt" :maxDueDt.sync="formItem.maxDueDt"></due-dt-range>
                <!-- 票据状态 -->
                <common-select v-model="formItem.flowStatus" :label="$t('m.i.billInfo.flowStatus')" prop="flowStatus"
                               :dictList="billStatusList"></common-select>
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
            url="/pb/prsttn/inner/search/prsttnApplBillQuery/func_pageQueryPrsttnBill"
            :bindForm="formItem"
            :hasSelect=false
            rowSelect
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="listExport"  v-if="isShowListExportBtn">{{$t("m.i.common.listExport")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!-- 查询票交机构代码 -->
    <show-cpes-branch :showCpesBranch="showCpesBranch" @showCpesBranchClose="showCpesBranchClose"
                      @showCpesBranchSubmit="showCpesBranchSubmit"></show-cpes-branch>
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin"
                    :billId="this.billId" :billRangeStart="this.billRangeStart" :billRangeEnd="this.billRangeEnd"></bill-info-main>
    <!--收回明细信息-->
    <prsttn-appl-bill-hist @prsttnApplBillHistWinClose="prsttnApplBillHistWinClose" :prsttnApplBillHistWin="prsttnApplBillHistWin" :params="showParams"></prsttn-appl-bill-hist>

    <show-branch-sec :showBranchWin="showBranchWin" title="机构查询" @brchNoChange="brchNoChange"
                     :ifcheck="true" :checkStrictly="true"  @showBranchWinClose="showBranchWinClose"></show-branch-sec>
    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param"
                           :rows="this.rows"></common-excel-download>
  </div>
</template>

<script>
  import { post, on, off, formatNumber, exportList, formatBillRange} from "@/api/bizApi/commonUtil";

  export default {
    name: "prsttnApplBillQuery",
    components: {
      ShowCpesBranch:()=>import(/* webpackChunkName: "shcpe/cpes/branch/showCpesBranch" */`@/views/bizViews/shcpe/cpes/branch/showCpesBranch`),
      PrsttnApplBillHist:()=>import(/* webpackChunkName: "pb/prsttn/inner/search/prsttnApplBillHist" */`@/views/bizViews/pb/prsttn/inner/search/prsttnApplBillHist`),
      ShowBranchSec:()=>import(/* webpackChunkName: "be/market/rediscount/common/showBranch" */`@/views/bizViews/be/market/rediscount/common/showBranch`)
    },
    data() {
      return {
        formItem: {
          settleBusiType: "",
          billType:"",
          billClass:"",
          reverseBillNo: "",
          brchNos:"",
          branchName:"",
          acptBankNo: "",
          acptBankNameTem: "",
          maxBillMoney: "",
          minBillMoney: "",
          acptDt: "",
          dueDate: "",
          minRemitDt: "",
          maxRemitDt: "",
          minDueDate: "",
          maxDueDate: "",
          ownedBrchName: "",
          ownedBrchNo: "",
          billOrigin: "",
          minBillRangeStart: "",
          maxBillRangeEnd: "",
          inOutFlag: "2",
          riskStatus: "",
          orderByClause: "PRSTTN_DT DESC, DUE_DT DESC, ID DESC",
          ownedBrchNames:this.$store.getters.userInfo.brchName,
          ownedBrchNos:this.$store.getters.userInfo.brchNo,
          authPath: this.$route.path,
          flowStatus:"",
        },
        remitDt:[],
        dueDate:[],
        columns: [
          {
            type: "selection",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            type: "index",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.brchName"),
            key: "transBrchName",
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.billInfo.flowStatus'),
            key: "flowStatusName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.acctStatus'),
            key: "acctStatus",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "AcctFlag", params.row.acctStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
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
            title: this.$t('m.i.common.applDt'),
            key: "prsttnDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (null != params.row.prsttnDt && "" !== params.row.prsttnDt) {
                let dttm = this.$moment(params.row.prsttnDt, "YYYY-MM-DD").format("YYYY-MM-DD");
                return h("span", dttm);
              }
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
          },
          {
            title: this.$t('m.i.common.result'),
            key: "dealPrcMsg",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.rejectReason'),
            key: "payRefuseReason",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.prsttnApplRemark'),
            key: "prsttnRemark",
            hiddenCol: false
          },
          {
            title: "收回明细信息",
            key: "prsttnApplBillHist",
            hiddenCol: true,
            render: (h, params) => {
              return h("a", {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.showPrsttnApplBillHist(params.row.id);
                  }
                }
              }, '查看');
            }
          }
        ],
        ifShowMore: false,
        showCpesBranch: false,
        showBillInfoWin: false,
        billId: "",
        billRangeStart: "",
        billRangeEnd: "",
        BillTypeList: [],
        BillClassList: [],
        RiskStatusList: [],
        billOriginList: [],
        billStatusList: [
          {key: "PICE04010202-PICE04010301", value: "待确认(已发出申请)"},
          {key: "PICE04010302-PICE04010401", value: "待签收(已确认申请)"},
          {key: "PICE04010302-PICE04010201", value: "提示付款申请失败"},
          {key: "PICE04010602-PICE04010701", value: "撤销提示付款待确认"},
          {key: "PICE04010702-PICE04010401", value: "撤销提示付款失败"},
          {key: "PICE04010402-PICE04010501", value: "已签收(待清算)"},
          {key: "PICE04010402-PICE04010201", value: "已拒绝"},
          {key: "PICE04010502-PICE04020201", value: "待记账(已清算)"},
          {key: "PICE04010502-PICE04010201", value: "清算失败"},
          {key: "PICE04010802-PICE04010501", value: "已清算排队"},
          {key: "PICE04020202-PICE04020202", value: "已记账"},
          {key: "PICE04010702-PICE04010702", value: "已撤销提示付款"},
        ],
        //授权信息
        ownedBrchName: "",
        ownedBrchNo: "",
        ownedBrchNames: "",
        ownedBrchNos: "",
        licenseFlag: false,
        authPath: this.$route.path,
        //brchNoWin: false,
        dictMap: null,
        //查询收回明细信息
        prsttnApplBillHistWin: false,
        showBranchWin:false,
        tempShowExcelTemplateWin: false,
        param: null,
        rows: null,
        isShowListExportBtn:false,
        showParams: {
          listId:"",
        }
      };
    },
    created() {
      let userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'));
      this.formItem.brchNos = userInfo.brchNo;
      this.formItem.branchName = userInfo.brchName;
    },
    mounted() {
      this.buttonAuthShow();
      this.getDictListByGroups("CDMedia,DraftTypeCode,RiskStatus,BarterTrustStatus,AcctFlag,BillOrigin").then(res => {
        this.BillClassList = res.get("CDMedia");
        this.BillTypeList = res.get("DraftTypeCode");
        this.RiskStatusList = res.get("RiskStatus");
        this.billOriginList = res.get("BillOrigin");
        this.dictMap = res.get("map");
      });
      this.getParams();
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
    watch: {
      "$route": "getParams"
    },
    methods: {
      buttonAuthShow(){
        //按钮权限查询 控制按钮显隐
        let id = JSON.parse(window.sessionStorage.getItem("curMenu")).id;
        post({ authId: id }, "/sm/auth/buttonAuth/func_queryButtonByAuthId").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            let retMsg = res.data.retMsg;
            if (retCode === "000000") {
              this.btnAuth = JSON.parse(res.data.retData);
              if (this.btnAuth.isShowListExportBtn === undefined ? false : this.btnAuth.isShowListExportBtn.isShow) {
                this.isShowListExportBtn = true;
              } else {
                this.isShowListExportBtn = false;
              }
            } else {
              this.$msgTip.error(this, { info: retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
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
                  this.$refs.datagrid.controlColumnsHidden("prsttnApplBillHist", false);
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
      getParams(){
        if (this.$route.path === "/be/trust/prsttn/prsttnApplBillQuery") {
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
      listExport() {
        this.param = "prsttnApplBillQueryInfoExport";
        if (this.$refs.datagrid.selectIds.length !== 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        } else {
          this.rows = this.$refs.datagrid.total;
        }
        this.tempShowExcelTemplateWin = true;
      },
      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },
      exportList(field, exportType) {
        let url = window.LOCAL_CONFIG.API_HOME + "/be/trust/prsttn/prsttnApplBillQuery/func_downLoadQueryPrsttnAsApply";
        let options = {};
        if (this.$refs.datagrid.selectIds.length !== 0) {
          options.params = {
            ids: this.$refs.datagrid.selectIds,
          };
          options.pageSize = this.$refs.datagrid.selectIds.length;
        } else {
          options.params = this.formItem;
          options.pageSize = this.$refs.datagrid.total;
        }
        exportList(this, this.param, field, exportType, url, options);
      },
      formatterBillStatus(value) {
        if (value == null || value == "") {
          return "";
        }
        switch (value) {
          case"AL10":
            return "待确认";
          case"AL11":
            return "待签收";
          case"AL12":
            return "申请已发送报文失败";
          case"AL13":
            return "已签收";
          case"AL14":
            return "提示付款已拒绝";
          case"AL15":
            return "撤销提示付款申请";
          case"AL17":
            return "已撤销提示付款";
          case"AL18":
            return "结清失败";
          case"AL19":
            return "结清成功";
          case"AL22":
            return "资金清算排队中";
        }
      },
      handleSearch() {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.dataChange(1);
      },
      //查询机构弹出框
      queryBrchNo() {
        this.showBranchWin = true;
      },
      showBranchWinClose() {
        this.showBranchWin = false;
      },
      //根据弹框所选数据进行赋值
      brchNoChange(info) {

        let objs = [];
        if(info instanceof Array){
          objs = info;
        } else {
          objs[0] = info;
        }
        let brchNos = "";
        let brchNames = "";
        for(var i=0;i<objs.length; i++){
          brchNos += objs[i].id + ',';
          brchNames += objs[i].title + ',';
        }
        this.formItem.brchNos = brchNos.substring(0,brchNos.length - 1);
        this.formItem.branchName = brchNames.substring(0,brchNames.length - 1);
        this.showBranchWin = false;
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
          this.formItem.minDueDate = arr[0].replace(/-/g, "");
          this.formItem.maxDueDate = arr[1].replace(/-/g, "");
          this.dueDate = [arr[0],arr[1]];
        } else {
          this.formItem.minDueDate = "";
          this.formItem.maxDueDate = "";
          this.dueDate = [];
        }
      },
      //重置查询结果
      resetSearch() {
        this.formItem.ownedBrchNo = "";
        this.formItem.ownedBrchName = "";
        this.formItem.ownedBrchNos = this.$store.getters.userInfo.brchNo;
        this.formItem.ownedBrchNames = this.$store.getters.userInfo.brchName;
        let userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'));
        this.formItem.brchNos = userInfo.brchNo;
        this.formItem.branchName = userInfo.brchName;
        this.remitDt = [];
        this.dueDate = [];
        this.formItem.acptBankNameTem = "";
        this.formItem.acptBankNo = "";
        this.formItem.billType = "";
        this.formItem.billClass = "";
        this.$refs.formItem.resetFields();
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
      showPrsttnApplBillHist(id) {
        this.showParams.listId = id;
        this.prsttnApplBillHistWin = true;
      },
      prsttnApplBillHistWinClose() {
        this.prsttnApplBillHistWin = false;
      },
    }
  };
</script>

<style scoped>

</style>
