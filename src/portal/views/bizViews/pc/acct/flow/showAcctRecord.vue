<template>
  <h-msg-box v-model="tempAcctRecordWin" width="1000" :mask-closable="false" @on-close="handleClose"
             class="h-form-search-layer"
             :maximize="true">
    <p slot="header">
      <span>查看分录数据</span>
    </p>

    <div class="h-tree-search">
      <!--弹出框模式标题-->
      <div class="h-modal-header-wrapper">
        <h-row name="flex" class="layout-menu-wrapper">
          <h-col span="24">
            <div>
              <!--数据展示表格-->
              <h-row>
                <h-col span="24">
                  <h-datagrid
                    :columns="columns"
                    highlight-row
                    :url="userUrl"
                    :auto-load="false"
                    :bindForm="formItem"
                    :onRowClick="handlelRowClick"
                    :onSelectChange="handleSelectClick"
                    ref="datagrid">
                    <div slot="toolbar" class="pull-left">
                    </div>
                  </h-datagrid>
                </h-col>
              </h-row>

            </div>
          </h-col>
        </h-row>
      </div>
    </div>
    <!-- 弹出框模式底部按钮 -->
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
    </div>
  </h-msg-box>
</template>

<script>

  import { mapGetters } from "vuex";
  import { formatNumber } from "../../../../../api/bizApi/commonUtil";

  export default {
    name: "showAcctRecord",
    components: {},
    props: {
      title: String,
      showAcctRecordWin: {
        type: Boolean,
        default() {
          return false;
        }
      }
    },
    data() {
      let options = {};
      options.userUrl = "/pc/acct/flow/indexAcctFlow/func_showAcctRecord?frontFlowNo=" + window.sessionStorage.getItem("frontFlowNo") + "?acctDt=" + window.sessionStorage.getItem("acctDt");
      let columns = [
        {
          title: this.$t("m.i.common.index"),
          type: "index",
          align: "center",
          width:50
        },
        {
          title:this.$t("m.i.common.foreFlowNo"),
          key: "foreFlowNo",
          hiddenCol: false,

        },
        {
          title:this.$t("m.i.pc.acctGroupName"),
          key: "acctGroupName",
          hiddenCol: false,

        },
        {
          title:this.$t("m.i.pc.drCr"),
          key: "drCr",
          hiddenCol: false,
          render: (h, params) => {
            return h("div", [
              h("span", formatterisdrCr(params.row.drCr, params.row, params.row.index))
            ]);
          }
        },
        {
          title: this.$t("m.i.pc.acctNo"),
          key: "acctNo",
          hiddenCol: false

        },
        {
          title: this.$t("m.i.pc.accountBrchNo"),
          key: "accountBrchNo",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.pc.amount"),
          key: 'amount',
          hiddenCol: false,
          render: (h, params) => {
            let amount = formatNumber(params.row.amount, 2, ',');
            return h("span", {
              domProps: {
                title: amount
              }
            }, amount);
          }
        }
      ];
      let formItem = {
        roleName: ""
      };
      options.tableRef = "selfTable";

      options.columns = columns;
      options.formItem = formItem;
      return options;
    },
    watch: {
      showAcctRecordWin(val) {
        if(val){
          this.userUrl = "/pc/acct/flow/indexAcctFlow/func_showAcctRecord?frontFlowNo=" + window.sessionStorage.getItem("frontFlowNo") + "&acctDt=" + window.sessionStorage.getItem("acctDt");
          this.$nextTick(() => {
            this.$refs.datagrid.dataChange(1);
          });
        }
      },
      sidebar: {
        handler(val, oldVal) {
          if (!val.opened) {
            setTimeout(() => {
              this.$refs.datagrid.$refs.gridContent.handleResize();
            }, 100);
          }
        },
        deep: true
      }
    },

    computed: {
      ...mapGetters(["sidebar"]),
      tempAcctRecordWin: {
        get() {
          return this.showAcctRecordWin;
        },
        set() {
        }
      }
    },
    methods: {
      handlelRowClick(arr) {
        this.currentSelectRow = arr;
      },
      handleSelectClick(arr, selectInx) {
        this.unDisabled();
        this.currentSelectList = arr;
        this.currentSelectRowInx = selectInx;
        if (arr.length == 0) return;
        if (arr[0].role_code == "admin") {
          this.deletDisabled = true;
        }
      },
      handleClose() {
        this.$emit("showAcctRecordWinClose", "");
      }

    }
  };

  function formatterisdrCr(value, row, index) {
    if (value != null && value != "") {
      switch (value) {
        case "D":
          return "借";
        case "C":
          return "贷";
        case "S":
          return "收";
        case "P":
          return "付";

      }
    } else {
      return "";
    }
  }
</script>

<style scoped>

</style>
