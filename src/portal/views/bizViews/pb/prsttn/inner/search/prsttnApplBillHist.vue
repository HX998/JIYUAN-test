<template>
  <!-- 收回明细弹窗 -->
  <h-msg-box v-model="showPrsttnApplBillHistWin" width="800" class="h-form-table-layer" :maximize="true"
             :mask-closable="false" @on-close="prsttnApplBillHistWinClose()" @on-maximize="onMaximize">
    <!--弹出框模式标题-->
    <p slot="header">
      <span>托收收回明细信息</span>
    </p>
    <!-- 数据展示表格 -->
    <div>
      <h-datagrid :columns="prsttnApplBillHistColumns"
                  highlight-row
                  :autoLoad="false"
                  url="/pb/prsttn/inner/search/prsttnApplBillQuery/func_pagingQueryPrsttnApplBillHist"
                  :bindForm="prsttnApplBillHistForm"
                  :height="350"
                  ref="datagrid" class="pl-5 pr-5">
        <div slot="toolbar" class="pull-left">
        </div>
      </h-datagrid>
    </div>
    <!-- 弹出框模式底部按钮 -->
    <div slot="footer">
      <h-button type="ghost" @click="prsttnApplBillHistWinClose()">{{$t("m.i.common.close")}}</h-button>
    </div>
  </h-msg-box>
</template>

<script>
import { formatNumber,formatBillRange } from "@/api/bizApi/commonUtil";
export default {
  name: "showPrsttnApplBillHist",
  components:{
  },
  data() {
    let prsttnApplBillHistColumns = [
      {
        type: "selection",
        width: 60,
        align: "center",
        hiddenCol: false
      },
      {
        title: this.$t("m.i.common.index"),
        type: "index",
        width: 60,
        align: "center"
      },
      {
        title: this.$t('m.i.billInfo.billPackageNo'),
        key: "billNo",
        hiddenCol: false
      },
      {
        title: this.$t("m.i.billInfo.billRange"),
        key:"billRange",
        hiddenCol: false,
        render:(h,params) => {
          let billOrigin = params.row.billOrigin;
          let billRangeStart = params.row.billRangeStart;
          let billRangeEnd = params.row.billRangeEnd;
          return h("span", formatBillRange(billOrigin, billRangeStart, billRangeEnd))
        }
      },
      {
        title: this.$t('m.i.billInfo.billPackageMoney'),
        key: "billMoney",
        hiddenCol: false,
        sortable: true,
        render: (h, params) => {
          return h("p", formatNumber(params.row.billMoney, 2, ","));
        }
      },
      {
        title: "收回日期",
        key: "prsttnAcctDt",
        hiddenCol: false,
        render: (h, params) => {
          if(params.row.prsttnAcctDt == null || params.row.prsttnAcctDt === ""){
            return "";
          }
          let date = this.$moment(params.row.prsttnAcctDt, "YYYYMMDD").format("YYYY-MM-DD");
          return h("span", date);
        }
      },
      {
        title: "收回金额",
        key: "prsttnReceiveAmt",
        hiddenCol: false,
        sortable: true,
        render: (h, params) => {
          let prsttnReceiveAmt = formatNumber(params.row.prsttnReceiveAmt, 2, ",");
          return h("span", {
            domProps: {
              title: prsttnReceiveAmt
            }
          }, prsttnReceiveAmt);
        }
      },
      {
        title: this.$t("m.i.common.backFlowNo"),
        key: 'backFlowNo',
        hiddenCol: false
      },
      {
        title: "余额",
        key: "noReturnMoney",
        hiddenCol: false,
        sortable: true,
        render: (h, params) => {
          let noReturnMoney = formatNumber(params.row.noReturnMoney, 2, ",");
          return h("span", {
            domProps: {
              title: noReturnMoney
            }
          }, noReturnMoney);
        }
      },


    ];
    return {
      prsttnApplBillHistForm: {
        listId: ""
      },
      prsttnApplBillHistColumns : prsttnApplBillHistColumns,
    }
  },
  mounted() {
  },
  props: {
    prsttnApplBillHistWin: {
      type: Boolean,
      default() {
        return false;
      }
    },
    params: Object,
  },
  watch: {
    prsttnApplBillHistWin(val) {
      if (val === true) {
        this.prsttnApplBillHistForm.listId = this.params.listId;
        this.$nextTick(() => {
          this.formSearch();
        });
      }
    }
  },
  computed: {
    showPrsttnApplBillHistWin: {
      get() {
        return this.prsttnApplBillHistWin;
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
    prsttnApplBillHistWinClose() {
      this.$emit("prsttnApplBillHistWinClose", "");
    }
  }
};
</script>

<style scoped>

</style>
