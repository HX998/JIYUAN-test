<template>
  <div>
    <!-- 批次信息 -->
    <!-- 数据展示表格 -->
    <div v-if="isShow">
      <h-datagrid
        :columns="columns"
        highlight-row
        :height="350"
        :bindForm="formItem"
        url="/ce/acpt/fastacpt/sign/fastAcptSignMain/func_queryList"
        ref="datagrid">
      </h-datagrid>
    </div>
  </div>
</template>

<script>
  import { accMul, formatNumber, getDictListByGroups, getDictValueFromMap, post,getBusinessParameter } from "@/api/bizApi/commonUtil";

  export default {
    name: "agreementAudit",
    data() {
      let columns = [
        {
          type: "radio",
          title: " ",
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
          title: this.$t("m.i.common.custNo"),
          key: "custNo",
          hiddenCol: false,
          sortable: true
        },
        {
          title: this.$t("m.i.common.custName"),
          key: "custName",
          hiddenCol: false,
          sortable: true
        },
        {
          title: this.$t("m.i.common.custAcctNo"),
          key: "custAcctNo",
          hiddenCol: false,
          sortable: true
        },
        {
          title: this.$t("m.i.ce.signBrchName"),
          key: "signBrchName",
          hiddenCol: false,
          sortable: true
        },
        {
          title: this.$t("m.i.ce.signStatus"),
          key: "signStatus",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let dictValue = this.getDictValueFromMap(this.dictMap, "FAcptSignStatus", params.row.signStatus);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t("m.i.ce.signApplyDt"),
          key: "applDt",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let date = params.row.applDt;
            if (!!params.row.applDt) {
              date = this.$moment(params.row.applDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            }
            return h("span", date);
          }
        },
        {
          title: this.$t("m.i.ce.applSignEnableDt"),
          key: "applActiveDt",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let date = params.row.applActiveDt;
            if (!!params.row.applActiveDt) {
              date = this.$moment(params.row.applActiveDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            }
            return h("span", date);
          }
        },
        {
          title: this.$t("m.i.ce.applSignDueDt"),
          key: "applFailureDt",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let date = params.row.applFailureDt;
            if (!!params.row.applFailureDt) {
              date = this.$moment(params.row.applFailureDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            }
            return h("span", date);
          }
        },
        {
          title: this.$t("m.i.ce.actualSignEnableDt"),
          key: "actualActiveDt",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let date = params.row.actualActiveDt;
            if (!!params.row.actualActiveDt) {
              date = this.$moment(params.row.actualActiveDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            }
            return h("span", date);
          }
        },
        {
          title: this.$t("m.i.ce.actualSignDueDt"),
          key: "actualFailureDt",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let date = params.row.actualFailureDt;
            if (!!params.row.actualFailureDt) {
              date = this.$moment(params.row.actualFailureDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            }
            return h("span", date);
          }
        },
        {
          title: this.$t("m.i.pc.custMgrNo"),
          key: "custMgrNo",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.pc.custMgrName"),
          key: "custMgrName",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.ce.limitAmt"),
          key: "limitAmt",
          hiddenCol: false,
          render: (h, params) => {
            let limitAmt = formatNumber(params.row.limitAmt, 2, ",");
            return h("span", {
              domProps: {
                title: limitAmt
              }
            }, limitAmt);
          }
        },
        {
          title: this.$t("m.i.bm.operOpin"),
          key: "auditRemark",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.remark"),
          key: "remark",
          hiddenCol: false
        }
      ];
      return {
        dictMap : new Map(),
        signStatusList: [],
        formItem : {
          id: "",
        },
        columns:columns
      };
    },

    created() {
      this.formItem.id = this.batchId;
    },
    mounted() {
      this.getDictListByGroups("FAcptSignStatus,Yon,CustArea").then(res => {
        this.signStatusList = res.get("FAcptSignStatus");
        // this.signStatusList = this.signStatusList.filter(item => item.key === "FA01" || item.key === "FA03");
        this.YonList = res.get("Yon");
        this.dictMap = res.get("map");
      });
    },
    props: {
      isShow: {
        type: Boolean,
        default: false
      },
      listIds: "",
      batchId: ""
    },
    methods: {

    }
  };
</script>

<style scoped>

</style>
