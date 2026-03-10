<!--存取票-流水明细界面-->
<template>
  <h-msg-box v-model="tempAcctFlowDetailWin" width="1000" :mask-closable="false" @on-close="acctFlowDetailClose" top="10"
             class="h-form-search-layer" :maximize="true" @on-maximize="onMaximize">
    <p slot="header">
      <span>流水明细</span>
    </p>
    <h-datagrid
      :columns="acctFlowColumns"
      :url="acctFlowParams.acctFlowUrl"
      highlightRow
      :auto-load="false"
      :bindForm="acctFlowFormItem"
      :rowSelect="true"
      ref="acctFlowDatagrid">
      <div slot="toolbar" class="pull-left">
      </div>
    </h-datagrid>
    <div slot="footer">
      <h-button type="ghost" @click="acctFlowDetailClose">{{$t("m.i.common.close")}}</h-button>
    </div>
  </h-msg-box>
</template>

<script>
  export default {
    name: "acctFlowDetail",
    data() {
      return {
        acctFlowFormItem : {
          foreFlowIds: ""
        },
        acctFlowColumns : [
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
            title: this.$t("m.i.common.foreFlowNo"),
            key: "foreFlowNo",
            ellipsis: false,
            hiddenCol: false,
            sortable: true
          },
          {
            title:this.$t("m.i.common.backFlowNo"),
            key: "backFlowNo",
            ellipsis: false,
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.prodName"),
            key: "prodName",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.sendAcctBrchNo"),
            key: "sendAcctBrchNo",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title:  this.$t("m.i.common.operTellerNo"),
            key: "operTellerNo",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.accountBrch"),
            key: "accountBrchNo",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.acctTellerNo"),
            key: "acctTellerNo",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.transDt"),
            key: "acctDt",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.acctDt == null || params.row.acctDt === "") {
                return "";
              }
              let date = this.$moment(params.row.acctDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title:  this.$t("m.i.common.transTm"),
            key: "transTm",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.transTm == null || params.row.transTm === "") {
                return "";
              }
              let transTm = params.row.transTm.toString();
              if (params.row.transTm.toString().length < 6) {
                for (let i = 0; i < (6 - params.row.transTm.toString().length); i++) {
                  transTm = "0" + transTm;
                }
              }
              let date = this.$moment(transTm, "HH:mm:ss").format("HH:mm:ss");
              return h("span", date);
            }
          }
        ],
      };
    },
    props: {
      acctFlowDetailWin: {
        type: Boolean,
        default: false
      },
      acctFlowParams : {
        type: Object,
        default: {
          foreFlowIds: "",
          acctFlowUrl: "/pc/acct/flow/queryAcctFlowPageByBatchIds"
        }
      }
    },
    watch: {
      acctFlowDetailWin(val) {
        if (val === true) {
          this.acctFlowFormItem.foreFlowIds = this.acctFlowParams.foreFlowIds;
          this.$nextTick(() => {
            this.$refs.acctFlowDatagrid.dataChange(1);
          });
        }
      }
    },
    computed: {
      tempAcctFlowDetailWin: {
        get() {
          return this.acctFlowDetailWin;
        },
        set() {
        }
      }
    },
    methods: {
      onMaximize() {
        setTimeout(() => {
          this.$refs.acctFlowDatagrid.$refs.gridContent.handleResize();
        }, 100);
      },
      acctFlowDetailClose() {
        this.$emit("acctFlowDetailClose", "");
      }
    }
  };
</script>

<style scoped>

</style>
