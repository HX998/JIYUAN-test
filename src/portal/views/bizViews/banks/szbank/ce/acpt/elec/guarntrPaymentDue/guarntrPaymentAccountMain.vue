<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <!--票据（包）号码：-->
                <h-form-item prop="billNoLike" :label="$t('m.i.billInfo.billNo')">
                  <h-input v-model="formItem.billNoLike" placeholder=""></h-input>
                </h-form-item>
                <h-form-item prop="otherBankAcptMark" :label="$t('m.i.ce.otherBankAcptMark')">
                  <h-select v-model="formItem.otherBankAcptMark" placeholder="" showTitle>
                    <h-option v-for="item in YonList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item prop="remitDt" :label="$t('m.i.billInfo.remitDt')">
                  <h-date-picker type="daterange" :value="formItemRemitDt" format="yyyy-MM-dd" showFormat
                                 :editable=false placeholder="" @on-change="handleRemitDtChange"
                                 autoPlacement></h-date-picker>
                </h-form-item>
                <h-form-item prop="dueDt" :label="$t('m.i.billInfo.dueDt')">
                  <h-date-picker type="daterange" :value="formItemDueDt" format="yyyy-MM-dd" showFormat :editable=false
                                 placeholder="" @on-change="handleDueDtChange" autoPlacement></h-date-picker>
                </h-form-item>
                <h-form-item prop="prsttnName" :label="$t('m.i.billInfo.prsttnName')" class="h-form-long-label">
                  <h-input v-model="formItem.prsttnName" placeholder=""></h-input>
                </h-form-item>
                <h-form-item prop="prsttnAcctNo" :label="$t('m.i.billInfo.prsttnAcctNo')" class="h-form-long-label">
                  <h-input v-model="formItem.prsttnAcctNo" placeholder=""></h-input>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{ $t('m.i.common.searchAdvanced') }}<i
                    class="icon iconfont"
                    :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="handleSearch()">{{ $t('m.i.common.search') }}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{ $t('m.i.common.reset') }}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid :columns="columns"
                      highlightRow
                      :row-select="true"
                      :has-select="false"
                      url="/banks/szbank/ce/acpt/elec/guarntrPaymentDue/guarntrPaymentAccountMain/func_pageQueryGuarntrPaymentAccountList"
                      :bindForm="formItem"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="paymentAccount">{{ $t('m.i.ce.paymentAccount') }}</h-button>
            </div>
          </h-datagrid>
        </div>

        <!-- 分录弹框 -->
        <acct-record :param="this.acctRecordParam" :url="this.acctRecordUrl" :submitFlag="this.acctSubmitFlag"
                     :showPrintButton="this.showPrintButton"
                     :show-acct-record-win="this.showAcctRecordWin" @acctSubmitSure="acctSubmitSure"
                     @showAcctRecordWinClose="showAcctRecordWinClose"
                     @printSuccessCallback="printSuccessCallback"></acct-record>

        <!-- 票面 -->
        <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin"
                        :billId="this.billId" :billNo="this.billNo" :billRangeEnd="this.billRangeEnd"
                        :billRangeStart="this.billRangeStart"></bill-info-main>
      </h-col>
    </h-row>
    <!-- <show-license-branch :showBranchWin="brchNoWin" title="机构查询" @brchNoChange="brchNoChange" :authPath="authPath"
                          @showBranchWinClose="brchNoWin = false" :ifcheck="true" :checkStrictly="true"></show-license-branch>-->
  </div>
</template>

<script>
import {
  post,
  formatBillRange,
  getDictListByGroups,
  getDictValueFromMap,
  formatNumber
} from "@/api/bizApi/commonUtil";

export default {
  name: "guarntrPaymentAccountMain",
  components: {
    //ShowLicenseBranch: () => import(/* webpackChunkName: "sm/auth/branch/showLicenseBranch" */`@/views/bizViews/sm/auth/branch/showLicenseBranch`),

  },
  data() {
    return {
      // brchNoWin:false,
      licenseFlag: false,
      authPath: this.$route.path,
      showPrintButton: false,
      acctSubmitFlag: false,
      auditMode: false,
      showBillInfoWin: false,
      billId: "",
      billNo: "",
      formItem: {
        prsttnName: '',
        prsttnAcctNo: '',
        otherBankAcptMark: '',
        billNoLike: '',
        billOrigin: "",
        billRangeStart: "",
        billRangeEnd: "",
        minRemitDt: "",
        maxRemitDt: "",
        minDueDt: "",
        maxDueDt: "",
        inOutFlag: "1"
      },
      formItemRemitDt: "",
      formItemDueDt: "",
      columns: [
        {
          type: "selection",
          hiddenCol: false,
          align: "center",
          width: 60
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
          title: this.$t('m.i.billInfo.billNo'), //票据（包）号码
          key: "billNo",
          ellipsis: false,
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let type = "";
            if (!!params.row.billId) {
              type = "billId";
            } else {
              type = "billNo";
            }
            return h("a", {
              on: {
                click: () => {
                  this.showBillInfo(params.row, type);
                }
              }
            }, params.row.billNo);
          }
        },
        {
          title: this.$t("m.i.ce.otherBankAcptMark"),
          key: 'otherBankAcptMark',
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = getDictValueFromMap(this.dictMap, "Yon", params.row.otherBankAcptMark);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          },
        },
        {
          title: this.$t("m.i.billInfo.flowStatus"),
          key: 'flowStatusName',
          hiddenCol: false
        },
        {
          title: this.$t("m.i.ce.clearMark"),
          key: 'clearMark',
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = getDictValueFromMap(this.dictMap,"SettleType",params.row.clearMark);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t("m.i.billInfo.acptProtocalNo"),
          key: 'acptProtocalNo',
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.ce.promNoteNo"),
          key: 'promNoteNo',
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.billInfo.billType"),
          key: 'billType',
          hiddenCol: false,
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
          title: this.$t("m.i.billInfo.billMoneyByUnit"),
          key: 'billMoney',
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
          title: this.$t("m.i.billInfo.pyeeName"),
          key: 'pyeeName',
          sortable: true,
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.billInfo.drwrName"),
          key: 'drwrName',
          sortable: true,
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.billInfo.drwrAcctNo"),
          key: 'drwrAcctNo',
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.billInfo.remitDt"),
          key: 'remitDt',
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            if (params.row.remitDt == null || params.row.remitDt === "") {
              return "";
            }
            let date = this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
          title: this.$t("m.i.billInfo.dueDt"),
          key: 'dueDt',
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            if (params.row.dueDt == null || params.row.dueDt === "") {
              return "";
            }
            let date = this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
          title: this.$t("m.i.billInfo.prsttnAcctNo"),
          key: 'prsttnAcctNo',
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.billInfo.prsttnName"),
          key: 'prsttnName',
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.billInfo.prsttnBankNo"),
          key: 'prsttnBankNo',
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.billInfo.prsttnBankName"),
          key: 'prsttnBankName',
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.billInfo.prsttnRemark"),
          key: 'prsttnRemark',
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.ce.overdueReason"),
          key: 'overdueReason',
          hiddenCol: false,
        },
      ],
      YonList: [],
      showAcctRecordWin: false,
      acctRecordParam: {},
      acctRecordUrl: "",
      acptIds: "",
      currentSelectList: [],
      dictMap: new Map(),
      submitFlag: false,
      ifShowMore: false,
      billRangeStart: "",
      billRangeEnd: "",
      billOriginList: [],
    }
  },
  mounted() {
    getDictListByGroups("DraftTypeCode,Yon,SettlementMarkCode,BillOrigin,SettleType").then(res => {
      this.YonList = res.get("Yon");
      this.billOriginList = res.get("BillOrigin");
      this.dictMap = res.get("map");
    });
  },
  methods: {
    billInfoWinClose() {
      this.showBillInfoWin = false;
    },
    showBillInfo(row, type) {
      this.billId = "";
      this.billNo = "";
      this.billRangeStart = "";
      this.billRangeEnd = "";
      if (type === "billId") {
        this.billId = row.billId;
      } else {
        this.billNo = row.billNo;
      }
      this.billRangeStart = row.billRangeStart;
      this.billRangeEnd = row.billRangeEnd;
      this.showBillInfoWin = true;
    },
    handleRemitDtChange(arr) {
      if (arr && arr.length == 2) {
        this.formItem.minRemitDt = arr[0].replace(/-/g, "");
        this.formItem.maxRemitDt = arr[1].replace(/-/g, "");
        this.formItemRemitDt = [arr[0], arr[1]];
      } else {
        this.formItem.minRemitDt = "";
        this.formItem.maxRemitDt = "";
        this.formItemRemitDt = [];
      }

    },
    handleDueDtChange(arr) {
      if (arr && arr.length == 2) {
        this.formItem.minDueDt = arr[0].replace(/-/g, "");
        this.formItem.maxDueDt = arr[1].replace(/-/g, "");
        this.formItemDueDt = [arr[0], arr[1]];
      } else {
        this.formItem.minDueDt = "";
        this.formItem.maxDueDt = "";
        this.formItemDueDt = [];
      }
    },
    //表单查询
    handleSearch() {
      this.$refs.datagrid.selects = [];
      this.$nextTick(() => {
        this.$refs.datagrid.dataChange(1);
      })
    },
    //重置表单查询结果
    resetSearch() {
      this.$refs.formItem.resetFields();
      this.formItem.minRemitDt = "";
      this.formItem.maxRemitDt = "";
      this.formItem.minDueDt = "";
      this.formItem.maxDueDt = "";
      this.formItemRemitDt = "";
      this.formItemDueDt = "";
    },

    //付款记账
    paymentAccount() {
      if (this.$refs.datagrid.selects.length === 0) {
        this.$msgTip.info(this, {info: this.$t("m.i.common.chooseAtLeastOneRecord")});
        return;
      }
      let ids = "";
      let list = this.$refs.datagrid.selects;
      let ownedBrchNo = list[0].ownedBrchNo;
      let flag = false;
      for (let i = 0; i < list.length; i++) {
        ids += list[i].id;
        if (i < list.length - 1) {
          ids += ",";
        }
        if (list[i].ownedBrchNo !== ownedBrchNo) {
          flag = true;
          break;
        }
      }
      if (flag) {
        this.$msgTip.info(this, {info: "请选择相同的机构下的票据记账"});
        return;
      }
      this.acptIds = ids;
      this.$hMsgBox.confirm({
        title: this.$t("m.i.common.confirm"),
        content: "确定记账吗?",
        onOk: () => {
          this.getEntryInfo();
        }
      });
    },
    //获取分录信息
    getEntryInfo() {
      this.acctRecordUrl = "/banks/szbank/ce/acpt/elec/guarntrPaymentDue/guarntrPaymentAccountMain/func_generateAcctRecord";
      this.acctRecordParam = {
        code: this.acptIds,
      };
      this.showAcctRecordWin = true;
    },
    //确定记账
    acctSubmitSure(info) {
      this.acctSubmitFlag = true;
      post({
        code: this.acptIds,
      }, "/banks/szbank/ce/acpt/elec/guarntrPaymentDue/guarntrPaymentAccountMain/func_acct").then(res => {
        this.acctSubmitFlag = false;
        if (res) {
          let msg = res.data.retMsg;
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.$msgTip.success(this);
            this.showPrintButton = true;
            if (!info.isHasPrint) {
              this.showAcctRecordWinClose();
            }
          } else {
            this.$msgTip.error(this, {info: msg});
          }
        }
      }).catch(error => {
        this.$msgTip.error(this, {info: this.$t("m.i.common.netError") + error});
      });
    },
    //打印成功回调
    printSuccessCallback() {
      this.showAcctRecordWinClose();
    },
    //关闭分录弹窗
    showAcctRecordWinClose() {
      this.showAcctRecordWin = false;
      this.showPrintButton = false;
      this.acctRecordParam = {};
      this.acctRecordUrl = "";
      this.$refs.datagrid.dataChange(1);
      this.$refs.datagrid.selects = [];
    }
  }
};
</script>

<style scoped>

</style>
