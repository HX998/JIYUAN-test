<template>
  <div>
    <h-datagrid
      :columns="columns"
      highlight-row
      :auto-load="false"
      url="/pay/payment/payStatusQueryMain/func_queryPaymentStatusQueryListByPage"
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
import {getDictValueFromMap} from "@/api/bizApi/commonUtil";

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
          title: this.$t("s.i.pay.operType"),
          key: "jumpType",
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = getDictValueFromMap(this.dictMap, 'PymnMthdCode', params.row.jumpType);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
          {
            title: this.$t("s.i.pay.privateJumpToken"),
            key: "privateJumpToken",
            hiddenCol: false,
          },
          {
            title: this.$t("s.i.pay.remark"),
            key: "remark",
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
