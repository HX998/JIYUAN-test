<template>
  <div>
    <h-datagrid
      :columns="columns"
      highlight-row
      :auto-load="false"
      url="/pay/payment/payStatusQueryMain/func_queryPaymentStatusQueryBillByPage"
      :bindForm="queryFormItem"
      :hasPage="false"
      :row-select="true"
      ref="datagrid">
      <div slot="toolbar" class="pull-left">
      </div>
    </h-datagrid>
  </div>
</template>

<script>
import {formatNumber, getDictValueFromMap} from "@/api/bizApi/commonUtil";

export default {
  name: "showQueryRespBillListTab",
  data() {
    return {
      queryFormItem: {
        id: "",
      },
      columns: [
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
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t("m.i.billInfo.billRange"),
            key: "billRange",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.ecdsBillStatus"),
            key: "billStatus",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, 'BillStatusCode', params.row.billStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("s.i.billInfo.circulateStat"),
            key: "cirStatus",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, 'BillCirStatusCode', params.row.cirStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("s.i.pay.payStatus"),
            key: "payStatus",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, 'BillPayStatus', params.row.payStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.billInfo.banEndrsmtMark"),
            key: "banEndrsmtFlag",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, 'BanEndorsementMarkCode', params.row.banEndrsmtFlag);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.billInfo.billPackageMoney"),
            key: "billMoney",
            hiddenCol: false,
            sortable: true,
            align: 'right',
            render: (h, params) => {
              return h("span", formatNumber(params.row.billMoney, 2, ","));
            }
          },
          {
            title: this.$t("m.i.billInfo.stdAmt"),
            key: "stdAmt",
            hiddenCol: false,
            sortable: true,
            align: 'right',
            render: (h, params) => {
              return h("span", formatNumber(params.row.stdAmt, 2, ","));
            }
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, 'DraftTypeCode', params.row.billType);
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
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("span", params.row.remitDt ? this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD")
                  : "");
            }
          },
          {
            title: this.$t("m.i.billInfo.dueDt"),
            key: "dueDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("span", params.row.dueDt ? this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD")
                  : "");
            }
          },
          {
            title: this.$t("m.i.billInfo.drwrName"),
            key: "drwrName",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.drwrAcctNo"),
            key: "drwrAcctNo",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.pyeeName"),
            key: "pyeeName",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.pyeeAcctNo"),
            key: "pyeeAcctNo",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.acptName"),
            key: "acptName",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.acptAcctNo"),
            key: "acptAcctNo",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.acptBankNo"),
            key: "acptBankNo",
            hiddenCol: false,
          },
        ],
      }
    },
    props: {
      statusQueryId: "",
      dictMap: {
        type: Map
      }
    },
    methods: {
      handleSearch() {
        this.queryFormItem.id = this.statusQueryId;
        this.$refs.datagrid.dataChange(1);
      },
    }
  }
</script>

<style scoped>

</style>
