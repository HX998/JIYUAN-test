<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <cust-name :formItem="formItem" @queryCustMessage="queryCustMessage"></cust-name>
                <cust-acct-no :formItem="formItem" @queryCustAcctNo="queryCustAcctNo"></cust-acct-no>
                <batch-no v-model="formItem.batchNo"></batch-no>
                <bill-no :label="$t('m.i.billInfo.billPackageNo')" v-model="formItem.reverseBillNo" prop="reverseBillNo" :maxlength="30"></bill-no>
                <query-btn v-on:showChange="showQry" :advanceShow='true' :formSearch='handleSearch'
                           :formSearchReset='resetSearch'></query-btn>
              </h-form>
            </h-panel>
            <!-- 数据展示表格 -->
            <h-row>
              <h-col span="24">
                <h-datagrid
                  :columns="columns"
                  highlightRow
                  :bindForm="formItem"
                  url="/ce/disc/elec/forcedisc/forceDiscErrBill/func_queryDiscBatchBillForForceDisc"
                  :on-current-change="handleRowClick"
                  :on-current-change-cancel="handleRowClickCancel"
                  ref="datagrid">
                  <div slot="toolbar" class="pull-left">
                    <h-button type="primary" @click="handle">补处理</h-button>
                  </div>
                </h-datagrid>
              </h-col>
            </h-row>

            <!-- 查询客户信息弹窗 -->
            <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose"
                               @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>
            <!-- 查询客户账号信息弹窗 -->
            <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" :cust-no="this.formItem.custNo"
                               @showCustAcctNoWinClose="showCustAcctNoWinClose"
                               :isAllBankAcct=true
                               @custAcctNoSelectSubmit="custAcctNoSelectSubmit"></show-cust-acct-no>
            <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin"
                            :billId="this.billId" :billRangeStart="this.billRangeStart" :billRangeEnd="this.billRangeEnd"></bill-info-main>
          </div>
        </div>
      </h-col>
    </h-row>
  </div>
</template>

<script>
import {
  post,
  on,
  off,
  getDictListByGroups,
  formatBillRange,
  getDictValueFromMap,
  formatNumber
} from "@/api/bizApi/commonUtil";

export default {
  name: "eDiscApplyBatchMain",
  components: {},
  data() {
    return {
      formItem: {
        custName: "",
        custAcctNo: "",
        custNo: "",
        batchNo: "",
        reverseBillNo: ""
      },
      columns: [
        {
          title: ' ',
          type: 'radio',
          align: 'center',
          width: 50
        },
        {
          type: 'index',
          key: 'numOrder',
          title: this.$t("m.i.common.index"),
          width: 60,
          align: 'center',
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.common.batchNo"),
          key: "batchNo",
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.common.custName"),
          key: "custName",
          hiddenCol: false,
          sortable: true,
        },
        {
          title: this.$t("m.i.common.custAcctNo"),
          key: "custAcctNo",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.billType"),
          key: "billType",
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          },
        },
        {
          title: this.$t("m.i.billInfo.billClass"),
          key: "billClass",
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = getDictValueFromMap(this.dictMap, "CDMedia", params.row.billClass);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          },
        },
        {
          title: this.$t("m.i.billInfo.discDt"),
          key: "discDt",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            if (params.row.discDt == null || params.row.discDt === "") {
              return "";
            }
            let discDt = this.$moment(params.row.discDt, "YYYYMMDD").format("YYYY-MM-DD");
            return h("span", discDt);
          }
        },
        {
          title: this.$t("m.i.billInfo.billOrigin"),
          align: 'center',
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = getDictValueFromMap(this.dictMap, "BillOrigin", params.row.billOrigin);
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
          align: 'center',
          key: "billRange",
          hiddenCol: false,
          render: (h, params) => {
            let billOrigin = params.row.billOrigin;
            let billRangeStart = params.row.billRangeStart;
            let billRangeEnd = params.row.billRangeEnd;
            return h("span", formatBillRange(billOrigin, billRangeStart, billRangeEnd))
          }
        },
        {
          title: this.$t("m.i.billInfo.billPackageMoney"),
          key: "billMoney",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let billMoney = formatNumber(params.row.billMoney, 2, ',');
            return h("span", {
              domProps: {
                title: billMoney
              }
            }, billMoney);
          }
        },
        {
          title: this.$t("m.i.ce.forceDiscStage"),
          key: "forceDiscStage",
          hiddenCol: false,
          render: (h, params) => {
            debugger
            let dictValue = this.forceDiscStageMap[params.row.forceDiscStage];
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t("m.i.ce.forceDiscErrorMsg"),
          key: "forceDiscErrorMsg",
          hiddenCol: false,
        },
      ],
      forceDiscStageMap: {
        "01":"解质押申请失败",
        "02":"解质押签收失败",
        "03":"贴现申请失败",
        "04":"贴现签收失败",
        "05":"贴现清算失败",
      },
      showCustMessageWin: false,
      showCustAcctNoWin: false,
      custElecSignWin: false,
      currentSelectRow: null,
      showBillInfoWin: false,
      billId: "",
      billRangeStart: "",
      billRangeEnd: "",
      ifShowMore: false,
      dictMap: new Map(),
    };
  },
  created() {
  },
  mounted() {
    getDictListByGroups("BillOrigin,DraftTypeCode,CDMedia").then(res => {
      this.dictMap = res.get("map");
    });
  },
  methods: {
    billInfoWinClose() {
      this.showBillInfoWin = false;
    },
    showBillInfo(row) {
      this.billId = row.billId;
      this.billRangeStart=row.billRangeStart;
      this.billRangeEnd=row.billRangeEnd;
      this.showBillInfoWin = true;
    },
    handle() {
      if (this.currentSelectRow == null || this.currentSelectRow.length === 0) {
        this.$msgTip.info(this, {info: this.$t("m.i.common.chooseDataFirst")});
        return;
      }
      this.$hMsgBox.confirm({
        title: this.$t('m.i.common.confirm'),
        content: '确认补处理当前[' + this.forceDiscStageMap[this.currentSelectRow.forceDiscStage] + ']?',
        onOk: () => {
          this.handledel();
        }
      })
    },
    handledel() {
      post({id: this.currentSelectRow.listId}, '/ce/disc/elec/forcedisc/forceDiscErrBill/func_forceDiscErrHandle').then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.$msgTip.success(this, {info: this.$t("m.i.common.actionSuccess")});
            this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
            this.currentSelectRow = null;
          } else {
            this.$msgTip.error(this, {info: res.data.retMsg});
          }
        } else {
          this.$msgTip.error(this, {info: this.$t('m.i.common.netError')});
        }
      });
    },
    showQry(val) {
      this.ifShowMore = val;
    },
    //搜索选择框清空事件
    clearVal(optType) {
      if (optType === "custName") {
        this.formItem.custName = "";
        this.formItem.custNo = "";
      }
      if (optType === "custAcctNo") {
        this.formItem.custAcctNo = "";
      }
    },
    //查询
    handleSearch() {
      this.currentSelectRow = null;
      this.$refs.datagrid.dataChange(1);
    },
    //重置查询结果
    resetSearch() {
      this.formItem.custNo = "";
      this.formItem.custAcctNo = "";
      this.formItem.custName = "";
      this.formItem.batchNo = "";
      this.formItem.reverseBillNo = "";
      this.$refs.formItem.resetFields();
    },
    // 行选中
    handleRowClick(arr) {
      this.currentSelectRow = arr;
    },
    handleRowClickCancel() {
      this.currentSelectRow = null;
    },

    //查询客户信息
    queryCustMessage() {
      this.showCustMessageWin = true;
    },
    //根据客户信息查询框所选数据进行赋值
    custCorpSelectSubmit(info) {
      this.formItem.custAcctNo = "";
      this.formItem.custName = info.custName;
      this.formItem.custNo = info.custNo;
      if (info.custAcctNo !== "") {
        this.formItem.custAcctNo = info.custAcctNo;
      }
      this.showCustMessageWin = false;
    },
    //客户信息查询框关闭
    custCorpWinClose() {
      this.showCustMessageWin = false;
    },
    //查询客户账号
    queryCustAcctNo() {
      if (this.formItem.custNo === "") {
        this.$msgTip.info(this, {info: "请先选择客户"});
        return;
      }
      this.showCustAcctNoWin = true;
    },
    //根据客户账号查询框所选数据进行赋值
    custAcctNoSelectSubmit(info) {
      this.formItem.custAcctNo = info.custAcctNo;
      this.showCustAcctNoWin = false;
    },
    //客户账号查询框关闭
    showCustAcctNoWinClose() {
      this.showCustAcctNoWin = false;
    },
  }
};
</script>

<style scoped>

</style>
