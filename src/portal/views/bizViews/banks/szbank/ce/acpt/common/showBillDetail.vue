<template>
  <!-- 纸票票据明细查询 -->
  <h-msg-box v-model="tempBillDetailWin" width="1000" class="h-form-table-layer" :maximize="true"
             @on-close="handleClose" :mask-closable="false" @on-maximize="onMaximize">
    <p slot="header">
      <span>{{ $t('m.i.ce.detailBill') }}</span>
    </p>
    <!--数据展示表格-->
    <h-datagrid :columns="showBillDetailColumns"
                highlight-row
                :height="400"
                :url="this.listUrl"
                :auto-load="false"
                :bind-form="formItem"
                ref="datagrid">
      <div slot="toolbar" class="pull-left">
      </div>
    </h-datagrid>
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{ $t("m.i.common.close") }}</h-button>
    </div>
    <!-- 票面 -->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin"
                    :billId="this.billId" :billNo="this.billNo" :billRangeEnd="this.billRangeEnd"
                    :billRangeStart="this.billRangeStart"></bill-info-main>
    <!--保证金账号查询-->
    <show-deduct-acct @dueDeductAcctWinClose="dueDeductAcctWinClose" :dueDeductAcctWin="dueDeductAcctWin"
                      :params="showParams"></show-deduct-acct>
  </h-msg-box>
</template>

<script>
import {accMul, formatNumber, getDictValueFromMap} from "@/api/bizApi/commonUtil";

export default {
  name: "showBillDetail",
  components: {
    ShowDeductAcct: () => import(/* webpackChunkName: "ce/acpt/common/showDeductAcct" */`@/views/bizViews/ce/acpt/common/showDeductAcct`),
  },
  data() {
    return {
      billId: "",
      billNo: "",
      billRangeStart: "",
      billRangeEnd: "",
      showBillInfoWin: false,
      showBillDetailColumns: [
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
          title: this.$t('m.i.billInfo.billPackageNo'),
          key: 'billNo',
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
          title: this.$t('m.i.billInfo.flowStatus'),
          key: 'flowStatusName',
          hiddenCol: false,
        },
        {
          title: this.$t('m.i.billInfo.billType'),
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
          title: this.$t('m.i.billInfo.remitDt'),
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
          title: this.$t('m.i.billInfo.dueDt'),
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
          title: this.$t('m.i.billInfo.billPackageMoney'),
          key: 'billMoney',
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
          title: this.$t('m.i.billInfo.acptName'),
          key: 'acptName',
          hiddenCol: false,
          sortable: true,
        },
        {
          title: this.$t('m.i.billInfo.acptAcctNo'),
          key: 'acptAcctNo',
          hiddenCol: false,
          sortable: true,
        },
        {
          title: this.$t('m.i.billInfo.acptBankNo'),
          key: 'acptBankNo',
          hiddenCol: false,
          sortable: true,
        },
        {
          title: this.$t('m.i.billInfo.drwrName'),
          key: 'drwrName',
          hiddenCol: false,
          sortable: true,
        },
        {
          title: this.$t("m.i.ce.guarntrAmt"),
          key: 'guarntrAmt',
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let guarntrAmt = formatNumber(params.row.guarntrAmt, 2, ',');
            return h("span", {
              domProps: {
                title: guarntrAmt
              }
            }, guarntrAmt);
          }
        },
        {
          title: this.$t('m.i.ce.feeMoney'),
          key: 'fee',
          hiddenCol: false,
          render: (h, params) => {
            let fee = formatNumber(params.row.fee, 2, ',');
            return h("span", {
              domProps: {
                title: fee
              }
            }, fee);
          }
        },
      ],
      formItem: {
        batchId: '',
        acctFlowIds: '',
        curFuncNo: 'BICE011303',
        billClass: '',
        licenseFlag: false,
        ownedBrchNo: ""
      },
      //查询保证金账户信息
      dueDeductAcctWin: false,
      showParams: {
        listId: "",
      }
    }
  },
  props: {
    billDetailWin: {
      type: Boolean,
      default() {
        return false;
      }
    },
    batchId: '',
    acctFlowIds: '',
    billClass: '',
    listUrl: '',
    licenseFlag: {
      type: Boolean,
      default() {
        return false;
      }
    },
    ownedBrchNo: ""
  },
  watch: {
    tempBillDetailWin(val) {
      if (val === true) {
        this.$nextTick(() => {
          this.formItem.batchId = this.batchId;
          this.formItem.acctFlowIds = this.acctFlowIds;
          this.formItem.billClass = this.billClass;
          this.formItem.licenseFlag = this.licenseFlag;
          this.formItem.ownedBrchNo = this.ownedBrchNo
          this.$refs.datagrid.dataChange(1);
        });
      }
    }
  },
  computed: {
    tempBillDetailWin: {
      get() {
        return this.billDetailWin;
      },
      set() {
      }
    }
  },
  methods: {
    showDueDeductAcct(id) {
      this.showParams.listId = id;
      this.dueDeductAcctWin = true;
    },

    dueDeductAcctWinClose() {
      this.dueDeductAcctWin = false;
    },
    onMaximize() {
      setTimeout(() => {
        this.$refs.datagrid.$refs.gridContent.handleResize();
      }, 100);
    },
    handleClose() {
      this.$refs.datagrid.tData = [];
      this.$emit("billDetailWinClose", "");
    },
    billInfoWinClose() {
      this.showBillInfoWin = false;
    },
    showBillInfo(info, type) {
      console.log(info);
      this.billId = "";
      this.billNo = "";
      this.billRangeStart = "";
      this.billRangeEnd = "";
      console.log(type);
      if (type === "billId") {
        this.billId = info.billId;
      } else {
        this.billNo = info.billNo;
      }
      this.billRangeStart = info.billRangeStart;
      this.billRangeEnd = info.billRangeEnd;

      console.log(this.billId);
      console.log(this.billNo);


      this.showBillInfoWin = true;
    },
  },
  mounted() {
    this.getDictListByGroups("AcptType,AcptStatus,DeductStatusType,CDMedia,Yon,AcptRgstStatus,AcptCpesRgstType,InOutFlagCode,BillOrigin,DraftTypeCode").then(res => {
      this.AcptTypeList = res.get("AcptType");
      this.DeductStatusList = res.get("DeductStatusType");
      this.billClassList = res.get("CDMedia");
      this.inOutFlagList = res.get("InOutFlagCode")
      this.yonList = res.get("Yon");
      this.dictMap = res.get("map");
      this.billOriginList = res.get("BillOrigin");
      this.billTypeList = res.get("DraftTypeCode");
    });
  },
};
</script>

<style scoped>

</style>
