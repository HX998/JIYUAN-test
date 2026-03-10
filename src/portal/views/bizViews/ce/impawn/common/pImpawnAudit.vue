<template>
  <div>
    <h-row name="flex" class="layout-menu-wrapper" v-if="tempIsShow">
      <h-col span="24">
        <div>
          <impawn-batch-detail :batchDetailParams="impawnBillParams" ref="impawnBatchDetail"></impawn-batch-detail>
          <h-row>
            <h-col span="24">
              <h-datagrid
                :columns="billManagerColumns"
                url="/bm/audit/prodAuditMain/func_pageQueryCeImpawnBillList"
                highlightRow
                :bindForm="billManagerFormItem"
                :onSelectChange="billManagerHandleRowClick"
                :rowSelect="true"
                ref="billManagerDatagrid">
                <div slot="toolbar" class="pull-left">
                </div>
              </h-datagrid>
            </h-col>
          </h-row>
        </div>
      </h-col>
    </h-row>
    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId" :billNo="this.billNo" :billRangeEnd = "this.billRangeEnd" :billRangeStart = "this.billRangeStart"></bill-info-main>

  </div>
</template>

<script>
  import { post, on, off, formatNumber } from "@/api/bizApi/commonUtil";
  import ImpawnBatchDetail from "@/views/bizViews/ce/impawn/common/impawnBatchDetail";

  export default {
    name: "impawnAudit",
    components: {
      ImpawnBatchDetail
    },
    data() {
      return {
        billManagerFormItem: {
          batchId: "",
          impawnIds: ""
        },
        billManagerColumns: [
          {
            type: "selection",
            key: "multiSelect",
            width: 60,
            hiddenCol: false
          },
          {
            type: "index",
            key: "numOrder",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
           title: this.$t("m.i.billInfo.billPackageNo"),
            key: "billNo",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let info = "", type = "";
              if (!!params.row.billId) {
                info = params.row;
                type = "billId";
              } else {
                info = params.row;
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
            title: this.$t("m.i.billInfo.flowStatus"),
            key: "flowStatusName",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.billInfo.remitDt"),
            key: "remitDt",
            ellipsis: false,
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
            key: "dueDt",
            ellipsis: false,
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
          title: this.$t("m.i.billInfo.billPackageMoney"),
            key: "billMoney",
            ellipsis: false,
            hiddenCol: false,
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
           title: this.$t("m.i.billInfo.drwrName"),
            key: "drwrName",
            ellipsis: false,
            sortable: true,
            hiddenCol: false
          },
          {
           title: this.$t("m.i.billInfo.drwrAcctNo"),
            key: "drwrAcctNo",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.drwrBankNo"),
            key: "drwrBankNo",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.pyeeName"),
            key: "pyeeName",
            ellipsis: false,
            sortable: true,
            hiddenCol: false
          },
          {
           title: this.$t("m.i.billInfo.pyeeAcctNo"),
            key: "pyeeAcctNo",
            ellipsis: false,
            hiddenCol: false
          },
          {
             title: this.$t("m.i.billInfo.pyeeBankNo"),
            key: "pyeeBankNo",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.acptName"),
            key: "acptName",
            sortable: true,
            ellipsis: false,
            hiddenCol: false
          }
        ],
        currentSelectList: [],
        impawnBillParams: {
          id: "",
          impawnIds: "",
          accountType: "",
          dictMap: new Map(),
        },
        showBillInfoWin: false,
        billId: "",
        billNo: "",
        billRangeStart:"",
        billRangeEnd:"",
        dictMap: new Map()
      }
    },
    props: {
      isShow: {
        type: Boolean,
        default() {
          return false;
        }
      },
      listIds: "",
      batchId: "",
    },
    computed: {
      tempIsShow: {
        get() {
          return this.isShow;
        },
        set() {
        }
      }
    },
    created() {
      this.billManagerFormItem.batchId = this.batchId;
      this.billManagerFormItem.impawnIds = this.listIds;
      this.impawnBillParams.id = this.batchId;
      this.impawnBillParams.impawnIds = this.listIds;
      this.impawnBillParams.accountType = "impawn";
      this.getDictListByGroups("DraftTypeCode,BillOrigin").then(res => {
        this.dictMap = res.get("map");
        this.impawnBillParams.dictMap = this.dictMap;
      });
    },
    mounted() {
      this.$nextTick(() => {
        this.$refs.impawnBatchDetail.getImpawnBatchInfo("impawn", "audit", "/bm/audit/prodAuditMain/func_queryCeImpawnBatch");
      });
    },
    watch: {
      isShow(val) {
        if (val) {
          this.billManagerFormItem.batchId = this.batchId;
          this.billManagerFormItem.impawnIds = this.listIds;
          this.impawnBillParams.id = this.batchId;
          this.impawnBillParams.impawnIds = this.listIds;
          this.impawnBillParams.accountType = "impawn";
          this.impawnBillParams.dictMap = this.dictMap;
          this.$nextTick(() => {
            this.$refs.impawnBatchDetail.getImpawnBatchInfo("impawn", "audit", "/bm/audit/prodAuditMain/func_queryCeImpawnBatch");
          });
        }
      }
    },
    methods: {
      //行选中
      billManagerHandleRowClick(arr) {
        this.currentSelectList = arr;
      },
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
        this.billRangeStart=row.billRangeStart;
        this.billRangeEnd=row.billRangeEnd;
        this.showBillInfoWin = true;
      }
    }
  };
</script>

<style scoped>

</style>
