<template>
  <!--票交机构弹出框-->
  <h-msg-box v-model="tempHldrDetailWin" width="1000" :mask-closable="false" @on-close="handleClose" top="10"
             class="h-form-search-layer" :maximize="true">
    <p slot="header">
      <span>{{title}}</span>
    </p>

    <!--数据展示表格-->
    <h-datagrid
      :columns="columns"
      highlight-row
      :url="datagridUrl"
      :autoLoad="false"
      ref="datagrid">
    </h-datagrid>
    <!-- 弹出框模式底部按钮 -->
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
    </div>
    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId" :billNo="this.billNo"></bill-info-main>
  </h-msg-box>
</template>

<script>
  import {
    post, on, off, getDictListByGroups,
    getDictValueFromMap
  } from "@/api/bizApi/commonUtil";

  export default {
    name: "hldrDetail",
    data() {
      return {
        billId : "",
        billNo : "",
        showBillInfoWin : false,
        columns: [

          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.billNo'),
            key: "billNo",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
                return h("a", {
                    on: {
                        click: () => {
                            this.showBillInfo(params.row.billId,params.row.billNo);
                        }
                    }
                }, params.row.billNo);
            }
          },
          {
            title: this.$t('m.i.billInfo.billMoney'),
            key: "billMoney",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.remitDt'),
            key: "remitDt",
            hiddenCol: false,
            render: (h, params) => {
              let date = this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t('m.i.billInfo.dueDt'),
            key: "dueDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t('m.i.billInfo.drwrName'),
            key: "drwrName",
            hiddenCol: false

          }

        ],
        datagridUrl: "/shcpe/ecds/check/monthCheckHldrDetail",
        ifShowMore: false,
        currentSelectRow: [],
        currentSelectList: [],
        currentSelectRowInx: [],
        tableRef: "selfTable"
      };
    },
    props: {
      hldrDetailWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      title: {
        type: String,
        default: "持有明细"
      },
      id: {
        type: ""
      }
    },
    comments: {},
    watch: {
      hldrDetailWin(val) {
        if (val === true) {
          this.datagridUrl = "/shcpe/ecds/check/monthDraftCheck/func_monthCheckHldrDetail?summryId=" + this.id;
          this.$nextTick(() => {
            this.$refs.datagrid.dataChange(1);
          });
        }
      }
    },

    computed: {
      tempHldrDetailWin: {
        get() {
          return this.hldrDetailWin;
        },
        set() {
        }
      }
    },
    methods: {
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      handleClose() {
        this.currentSelectRow = [];
        this.currentSelectList = [];
        this.$emit("hldrDetailClose", "");
      },
        showBillInfo(billId, billNo) {
            this.billId = billId;
            this.billNo = billNo;
            this.showBillInfoWin = true;
        },
        billInfoWinClose() {
            this.showBillInfoWin = false;
        },
    }
  };
</script>

<style scoped>

</style>
