<!--机构操作历史查询-->
<template>
  <h-msg-box v-model="tempBrchLogDetailWin" width="800" :mask-closable="false" @on-close="handleClose" top="10"
             class="h-form-search-layer" :maximize="true" @on-maximize="onMaximize">
    <p slot="header">
      <span>{{title}}</span>
    </p>
    <div>
      <h-datagrid
        :columns="columns"
        highlight-row
        url="/sm/auth/branchlog/brchLogDetail/func_pageQueryBranchLog"
        :bindForm="detailFormItem"
        :onCurrentChange="handleCurrentChange"
        :onCurrentChangeCancel="handleCurrentChangeCancel"
        :autoLoad=false
        ref="datagrid">
      </h-datagrid>
    </div>
    <!-- 弹出框模式底部按钮 -->
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
    </div>
  </h-msg-box>
</template>
<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";

  export default {
    name: "brchLogDetail",
    data() {
      return {
        columns: [
          {
            type: "radio",
            title: " ",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.brchNo"),
            key: "brchNo",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.brchName"),
            key: "brchName",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("m.i.auth.cashorgid"),
            key: "cashorgid",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("m.i.common.bankNo"),
            key: "bankNo",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("m.i.common.orgCode"),
            key: "orgCode",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.auth.virtualTellerNo"),
            key: "virtualTellerNo",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.operTellerNo"),
            key: "operTellerNo",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("m.i.common.operDt"),
            key: "operDt",
            hiddenCol: false,
            ellipsis: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.operDt == null ? "" : this.$moment(params.row.operDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.common.operTm"),
            key: "operTm",
            hiddenCol: false,
            ellipsis: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.operTm == null || params.row.operTm === "") {
                return "";
              }
              let operTm = params.row.operTm.toString();
              if (params.row.operTm.toString().length < 6) {
                for (let i = 0; i < (6 - params.row.operTm.toString().length); i++) {
                  operTm = "0" + operTm;
                }
              }
              let date = this.$moment(operTm, "HH:mm:ss").format("HH:mm:ss");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.common.operType"),
            key: "operType",
            hiddenCol: false,
            ellipsis: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "BranchLogOperType", params.row.operType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          }
        ],
        currentSelectRow: null
      };
    },
    props: {
      title: String,
      brchLogDetailWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      detailFormItem: Object,
      dictMap: Map
    },
    components: {},
    watch: {
      brchLogDetailWin(val) {
        if (val === true) {
          this.$nextTick(() => {
            this.currentSelectRow = [];
            this.currentSelectList = [];
            this.$refs.datagrid.dataChange(1);
          });
        }
      }
    },
    computed: {
      tempBrchLogDetailWin: {
        get() {
          return this.brchLogDetailWin;
        },
        set() {
        }
      }
    },
    methods: {
      onMaximize() {
        setTimeout(() => {
          this.$refs.datagrid.$refs.gridContent.handleResize();
        }, 100);
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      handleClose() {
        this.$refs.datagrid.$refs.gridPage.clearElevator();
        this.$emit("brchLogDetailWinClose", "");
      }
    }
  };
</script>
