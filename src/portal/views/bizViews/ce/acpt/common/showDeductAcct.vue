<template>
  <!-- 登记日期历史查询弹窗 -->
  <h-msg-box v-model="showDueDeductAcctWin" width="800" class="h-form-table-layer" :maximize="true"
             :mask-closable="false" @on-close="dueDeductAcctWinClose()" @on-maximize="onMaximize">
    <!--弹出框模式标题-->
    <p slot="header">
      <span>保证金信息查询</span>
    </p>
    <!-- 数据展示表格 -->
    <div>
      <h-datagrid :columns="dueDeductAcctColumns"
                  highlight-row
                  :autoLoad="false"
                  url="/ce/acpt/common/showDeductAcct/func_pagingQueryDeductAcctInfo"
                  :bindForm="dueDeductAcctForm"
                  :height="350"
                  ref="datagrid" class="pl-5 pr-5">
        <div slot="toolbar" class="pull-left">
        </div>
      </h-datagrid>
    </div>
    <!-- 弹出框模式底部按钮 -->
    <div slot="footer">
      <h-button type="ghost" @click="dueDeductAcctWinClose()">{{$t("m.i.common.close")}}</h-button>
    </div>
  </h-msg-box>
</template>

<script>
  import { formatNumber } from "@/api/bizApi/commonUtil";
  export default {
    name: "showDeductAcct",
    components:{
    },
    data() {
      let dueDeductAcctColumns = [
        {
          title: this.$t("m.i.common.index"),
          type: "index",
          width: 60,
          align: "center"
        },
        {
          title: this.$t("m.i.pe.deductAcctNo"),
          key: "deductAcctNo",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.pe.dpstNo"),
          key: "dpstNo",
          hiddenCol: false
        },
        {
          title:  this.$t("m.i.pe.deductAcctType"),
          key: "deductAcctType",
          hiddenCol: false,
          render: (h, params) => {
            let title = "";
            if (params.row.deductAcctType === "1") {
              title = "结算账户";
            }
            if (params.row.deductAcctType === "2") {
              title = "保证金账户";
            }
            return h("span", title);
          }
        },
        {
          title: this.$t("m.i.ce.guarntrAmt"),
          key: 'dpstAmt',
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let dpstAmt = formatNumber(params.row.dpstAmt, 2, ',');
            return h("span", {
              domProps: {
                title: dpstAmt
              }
            }, dpstAmt);
          }
        },
      ];
      return {
        dueDeductAcctForm: {
          listId: "",
          deductAcctType: "",
          isValid: "1"
        },
        dueDeductAcctColumns : dueDeductAcctColumns,
      }
    },
    mounted() {
    },
    props: {
      dueDeductAcctWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      params: Object,
    },
    watch: {
      dueDeductAcctWin(val) {
        if (val === true) {
          this.dueDeductAcctForm.listId = this.params.listId;
          this.dueDeductAcctForm.deductAcctType = "2";
          this.$nextTick(() => {
            this.formSearch();
          });
        }
      }
    },
    computed: {
      showDueDeductAcctWin: {
        get() {
          return this.dueDeductAcctWin;
        },
        set() {}
      },
    },
    methods: {
      onMaximize() {
        setTimeout(() => {
          this.$refs.datagrid.$refs.gridContent.handleResize();
        }, 100);
      },
      //查询
      formSearch() {
        this.$refs.datagrid.dataChange(1);
      },
      dueDeductAcctWinClose() {
        this.$emit("dueDeductAcctWinClose", "");
      }
    }
  };
</script>

<style scoped>

</style>
