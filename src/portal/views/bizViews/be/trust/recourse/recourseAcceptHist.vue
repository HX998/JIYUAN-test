<template>
  <div>
    <h-msg-box maximize v-model="tempShowHistWin" width="1000" @on-close="handleClose" @on-maximize="onMaximize">
      <p slot="header">
        <span>历史记录</span>
      </p>
      <h-datagrid
        :columns="billsColumns"
        :autoLoad=false
        :url="histUrl"
        :bindForm="histFormItem"
        ref="bills">
      </h-datagrid>
      <div slot="footer">
      </div>
    </h-msg-box>

  </div>
</template>
<script>

  export default {
    name: "recourseAcceptHist",
    data() {
      return {
        billsColumns: [
          {
            title: this.$t('m.i.be.recourseBrchName'),
            key: "recourseBrchName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.pursuedBrchName'),
            key: "currentPayBrchName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.clearOrSettleStatus'),
            key: "settleStatus",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "MmbStlStatus", params.row.settleStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.be.cashStatus'),
            key: "cashStatus",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "CashStatus", params.row.cashStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.common.acctStatus'),
            key: "acctStatus",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "IsAcctSuccess", params.row.acctStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          }
        ],
        histFormItem: {
          histId: ""
        }
      };
    },
    props: {
      histId: String,
      showHist: {
        type: Boolean,
        default() {
          return false;
        }
      },
      histUrl: String,
      dictMap: {
        type: Map
      }
    },
    methods: {
      onMaximize() {
        setTimeout(() => {
          this.$refs.bills.$refs.gridContent.handleResize();
        }, 100);
      },
      format(groupcode, key) {
        return this.getDictValueFromMap(this.dictMap, groupcode, key);
      },
      formatDate(value) {
        return value ? this.$moment(value, "YYYY-MM-DD").format("YYYY-MM-DD") : "";
      },
      handleClose() {
        this.$emit("closeMsgBox", "");
        this.$refs.bills.$refs.gridPage.clearElevator();
      }
    },
    watch: {
      showHist(i) {
        this.$nextTick(() => {
          this.histFormItem.histId = this.histId;
          this.$refs.bills.dataChange(1);
        });
      }
    },
    computed: {
      tempShowHistWin: {
        get() {
          this.histFormItem.histId = this.histId;
          return this.showHist;
        },
        set() {
        }
      }
    }
  };
</script>
