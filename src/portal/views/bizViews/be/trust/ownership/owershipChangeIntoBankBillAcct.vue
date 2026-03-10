<style>

</style>
<!--场务权属变更转出方记账 -->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <!-- 票据来源 -->
                <common-select :label="$t('m.i.billInfo.billOrigin')" prop="billOrigin"
                               v-model="formItem.billOrigin" :dictList="BillOriginList"></common-select>
                <!-- 票据号码 -->
                <bill-no :label="$t('m.i.billInfo.billPackageNo')" v-model="formItem.billNoLike" prop="billNoLike"></bill-no>
                <!-- 子票区间 -->
                <bill-range :formItem="formItem" :rangeProps="['minBillRangeStart','maxBillRangeEnd']"></bill-range>
                <!-- 票据类型 -->
                <bill-type v-model="formItem.billType" :dictList="DraftTypeList"></bill-type>
                <!-- 票据类型 -->
                <bill-class v-model="formItem.billClass" :dictList="CDMediaList"></bill-class>
                <!-- 记账状态 -->
                <common-select :label="$t('m.i.common.acctStatus')" prop="acctStatus"
                               v-model="formItem.acctStatus" :dictList="AcctFlagList"></common-select>
                <!-- 变更日期 -->
                <common-date-picker v-model="transDt" type="daterange"  :label="$t('m.i.be.changeDt')" prop="transDt" @on-change="handleTransDateChange"></common-date-picker>
                <!-- 承兑行名称 -->
                <show-cpes-branch v-model="formItem.acptBrchCode" :label="$t('m.i.billInfo.acptBankName')" class="h-form-long-label"
                                  :brchCode.sync="formItem.acptBrchCode"  :cpesBrchName.sync="formItem.acptBankName"
                                  datagridUrl="/cpes/branch/queryBranchList" prop="acptBankName"
                                  queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>
                <!-- 票据金额 -->
                <bill-money-range :label="$t('m.i.billInfo.billPackageMoney')" v-model="formItem" :bigTips="false"
                                  :rangeProps="['minBillMoney','maxBillMoney']" class="h-form-long-label"></bill-money-range>
                <!-- 汇票到期日 -->
                <due-dt-range v-model="dueDtTmp" :minDueDt.sync="formItem.minDueDt" :maxDueDt.sync="formItem.maxDueDt"></due-dt-range>

                <query-btn :advanceShow='true' @showChange="showChange" :formSearch='formSearch' :formSearchReset='formSearchReset'></query-btn>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            highlight-row
            row-select
            :has-select="false"
            url="/be/trust/ownership/owershipChangeIntoBankBillAcct/func_queryPendingAcctOwershipChangeIntoBill"
            :bindForm="formItem"
            ref="datagrid">
            <div slot="toolbar" class='pull-left'>
              <h-button type="primary" @click="showAcctInfo()">{{$t('m.i.be.acct')}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <acct-record :param="param"
                 :showAcctRecordWin="this.showAcctRecordWin"
                 :showPrintButton="showPrintButton"
                 @showAcctRecordWinClose="showAcctRecordWinClose"
                 url="/be/trust/ownership/owershipChangeIntoBankBillAcct/func_queryIntoAcctRecord"
                 @printSuccessCallback="printSuccessCallback"
                 @acctSubmitSure="applyAccount"></acct-record>
    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"
                    :billNo="this.billNo" :billRangeStart="billRangeStart" :billRangeEnd="billRangeEnd"></bill-info-main>
  </div>

</template>
<script>
import { post, on, off, formatNumber, accMul, formatBillRange } from "@/api/bizApi/commonUtil";

export default {
  name: "owershipChangeIntoBankBillAcct",
  data() {
    return {
      dictMap: new Map(),
      billId : "",
      billNo : "",
      billRangeStart: "",
      billRangeEnd: "",
      showBillInfoWin : false,
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
          render: (h, params) => {
            return h("p", formatNumber(params.row.billMoney, 2, ","));
          }
        },
        {
          title: this.$t('m.i.billInfo.remitDt'),
          key: "remitDt",
          hiddenCol: false,
          render: (h, params) => {
            return h("span", params.row.remitDt ? this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
          }
        },
        {
          title: this.$t('m.i.billInfo.dueDt'),
          key: "dueDt",
          hiddenCol: false,
          render: (h, params) => {
            return h("span", params.row.dueDt ? this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
          }
        },
        {
          title: this.$t('m.i.billInfo.acptBankName'),
          key: "acptBankName",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.be.changeDt'),
          key: "transDt",
          hiddenCol: false,
          render: (h, params) => {
            return h("span", params.row.transDt ? this.$moment(params.row.transDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
          }
        },
        {
          title: this.$t('m.i.be.owershipOutName'),
          key: "transFromName",
          hiddenCol: false,

        },
        {
          title: this.$t("m.i.common.remark"),
          key: "reqRemark",
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
        }
      ],
      transDt:[],
      dueDtTmp:[],
      formItem: {
        billOrigin: "",
        billNoLike: "",
        minBillRangeStart: "",
        maxBillRangeEnd: "",
        billType: "",
        billClass: "",
        billStatus: "",
        transDt: "",
        minTransDt: "",
        maxTransDt: "",
        acptBrchCode: "",
        minBillMoney: "",
        maxBillMoney: "",
        acptBankName: "",
        minDueDt: "",
        maxDueDt: ""
      },
      type: null,
      DraftTypeList: [],
      CDMediaList: [],
      BillOriginList: [],
      AcctFlagList: [
        {key: '0', value: '未记账'},
        {key: '2', value: '记账失败'},
      ],
      currentSelectList: [],
      submitFlag: false,
      ifShowMore: false,
      param: {},
      acctSubmitFlag: false,
      showPrintButton:false,
      schemeIdList: [],
      showAcctRecordWin: false,
      id: null,
      ids: null,
      addRate:false,
    };
  },
  methods: {
    showChange(val) {
      this.ifShowMore = val;
    },
    minBillMoneyVaild() {
      this.formItem.minBillMoney = this.formItem.minBillMoney.trim();
      if (this.formItem.minBillMoney.length != 0 && Number(this.formItem.minBillMoney)) {
        let min = Number(this.formItem.minBillMoney);
        if (this.formItem.maxBillMoney.length != 0 && Number(this.formItem.maxBillMoney)) {
          let max = Number(this.formItem.maxBillMoney);
          if (min > max) {
            this.$msgTip.info(this, { info: "最大值不能小于最小值" });
            this.formItem.minBillMoney = "";
          }
        }
      } else {
        this.formItem.minBillMoney = "";
      }
    },
    maxBillMoneyVaild() {
      if (this.formItem.maxBillMoney.length != 0 && Number(this.formItem.maxBillMoney)) {
        let max = Number(this.formItem.maxBillMoney);
        if (this.formItem.minBillMoney.length != 0 && Number(this.formItem.minBillMoney)) {
          let min = Number(this.formItem.minBillMoney);
          if (min > max) {
            this.$msgTip.info(this, { info: "最大值不能小于最小值" });
            this.formItem.maxBillMoney = "";
          }
        }
      } else {
        this.formItem.maxBillMoney = "";
      }
    },
    //记账弹窗
    showAcctInfo() {
      this.currentSelectList = this.$refs.datagrid.selects;
      if (this.currentSelectList.length > 0) {
        let selects = this.currentSelectList;
        let ids = [];
        let billClass = "";
        let billType = "";
        for (let i = 0; i < selects.length; i++) {
          let row = selects[i];
          if (billClass !== "" && billClass !== row.billClass) {
            this.$msgTip.info(this, { info: "请选择票据介质相同的票据记账" });
            return;
          }
          if (billType !== "" && billType !== row.billType) {
            this.$msgTip.info(this, { info: "请选择票据种类相同的票据记账" });
            return;
          }
          billType = row.billType;
          billClass = row.billClass;
          ids.push(row.id);
        }
        this.param = {ids: ids};
        this.showAcctRecordWin = true;
      } else {
        this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
      }
    },
    //确定记账，发送记账请求
    applyAccount(info) {
      this.acctSubmitFlag = true;
      post({ ids: info.ids }, "/be/trust/ownership/owershipChangeIntoBankBillAcct/func_accountOwershipChangeBankIntoBills").then(res => {
        this.acctSubmitFlag = false;
        if (res) {
          let msg = res.data.retMsg;
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.showPrintButton = true;
            this.$msgTip.success(this);
            if(!info.isHasPrint) {
              this.showAcctRecordWinClose();
            }
            this.$msgTip.info(this, { info: this.$t("m.i.be.acctSuccess") });
          } else {
            this.$msgTip.error(this, { info: msg });
            this.$refs.datagrid.dataChange(1);
          }
        } else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });
    },
    printSuccessCallback() {
      this.showAcctRecordWinClose();
      this.$refs.datagrid.dataChange(1);
      this.$refs.datagrid.selectIds = [];
      this.$refs.datagrid.selects = [];
    },
    // 关闭记账窗口
    showAcctRecordWinClose() {
      this.showAcctRecordWin = false;
      this.showPrintButton = false;
      this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
      this.currentSelectList = [];
      this.$refs.datagrid.selectIds = [];
      this.$refs.datagrid.selects = [];
    },
    handleChange(value) {
      this.formItem.acctDt = value.replace(/-/g, "");
    },
    showBillInfo(row) {
      this.billId = row.billId;
      this.billRangeStart=row.billRangeStart;
      this.billRangeEnd=row.billRangeEnd;
      this.showBillInfoWin = true;
    },
    billInfoWinClose() {
      this.showBillInfoWin = false;
    },
    formSearch() {
      this.$refs.datagrid.dataChange(1);
      this.currentSelectList = [];
      this.$refs.datagrid.selectIds = [];
      this.$refs.datagrid.selects = [];
    },
    handleTransDateChange(arr){
      if (arr && arr.length >= 2) {
        this.formItem.minTransDt = arr[0].replace(/-/g, "");
        this.formItem.maxTransDt = arr[1].replace(/-/g, "");
        this.transDt = [arr[0],arr[1]];
      } else {
        this.formItem.minTransDt = "";
        this.formItem.maxTransDt = "";
        this.transDt = [];
      }
    },
    handleDueDtChange(arr){
      if (arr && arr.length >= 2) {
        this.formItem.minDueDt = arr[0].replace(/-/g, "");
        this.formItem.maxDueDt = arr[1].replace(/-/g, "");
        this.dueDtTmp = [arr[0],arr[1]];
      } else {
        this.formItem.minDueDt = "";
        this.formItem.maxDueDt = "";
        this.dueDtTmp = [];
      }
    },
    formSearchReset() {
      this.transDt = [];
      this.dueDtTmp = [];
      this.formItem.minBillMoney = "";
      this.formItem.maxBillMoney = "";
      this.formItem.minDueDt = "";
      this.formItem.maxDueDt = "";
      this.formItem.acptBrchCode = "";
      this.formItem.acptBankName = "";
      this.$refs.formItem.resetFields();
    },
    created() {
      this.formItem.acctDt = this.$moment(new Date()).format("YYYYMMDD");
    },
  },
  mounted() {
    this.getDictListByGroups("CDMedia,DraftTypeCode,BillOrigin,AcctFlag").then(res => {
      this.CDMediaList = res.get("CDMedia");
      this.DraftTypeList = res.get("DraftTypeCode");
      this.BillOriginList = res.get("BillOrigin");
      this.dictMap = res.get("map");
    });
  }
};
</script>
