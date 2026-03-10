<template>
  <div>
    <!-- 纸票票据明细查询 -->
    <h-msg-box v-model="tempBillDetailWin" width="1000" class="h-form-table-layer" :maximize="true" @on-close="handleClose" :mask-closable="false" @on-maximize="onMaximize">
      <p slot="header">
        <span>撤销记账明细</span>
      </p>
      <!--数据展示表格-->
      <h-datagrid :columns="showBillDetailColumns"
                  highlight-row
                  :height="400"
                  :url="billDetailUrl"
                  :auto-load="false"
                  :bind-form="formItem"
                  ref="datagrid">
        <div slot="toolbar" class="pull-left">
        </div>
      </h-datagrid>
      <div slot="footer">
        <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
      </div>
    </h-msg-box>
    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin"
                    :billId="this.billId" :billNo="this.billNo"></bill-info-main>
  </div>
</template>

<script>
  import { post,formatNumber, getDictValueFromMap, getDictListByGroups } from "@/api/bizApi/commonUtil";

  export default {
    name: "getBillShowBillDetail",
    components: {
    },
    data() {
      return {
        showBillInfoWin : false,
        billId : "",
        billNo : "",
        showBillDetailColumns : [
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: this.$t("m.i.billInfo.billNo"),
            key: 'billNo',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let info = "", type = "";
              if (!!params.row.billId) {
                info = params.row.billId;
                type = "billId";
              } else {
                info = params.row.billNo;
                type = "billNo";
              }
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(info, type);
                  }
                }
              }, params.row.billNo);
            }
          },
          {
            title: this.$t("m.i.billInfo.flowStatus"),
            key: 'flowStatusName',
            hiddenCol: false,
          },
          {
           title: this.$t("m.i.billInfo.drwrName"),
            key: 'drwrName',
            sortable: true,
            hiddenCol: false,
          },
          {
           title: this.$t("m.i.billInfo.pyeeName"),
            key: 'pyeeName',
            sortable: true,
            hiddenCol: false,
          },
          {
           title: this.$t("m.i.billInfo.acptName"),
            key: 'acptName',
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t("m.i.billInfo.billMoney"),
            key: 'billMoney',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let billMoney = formatNumber(params.row.billMoney, 2, ',');
              return h("span", {
                domProps: {
                  title: billMoney
                }
              }, billMoney);
            }
          },
        ],
        formItem : {
          batchId: '',
          acctFlowIds: '',
          curFuncNo: 'PIPL020603',
          billClass:''
        },
      };
    },
    props: {
      billDetailWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      batchId: '',
      acctFlowIds: '',
      billClass:'',
      billDetailUrl: ''
    },
    watch: {
      tempBillDetailWin(val) {
        if (val === true) {
          this.formItem.batchId = this.batchId;
          this.formItem.acctFlowIds = this.acctFlowIds;
          this.formItem.billClass = this.billClass;
          this.$nextTick(() => {
            this.$refs.datagrid.dataChange(1);
          });
        }
      }
    },
    computed: {
      tempBillDetailWin: {
        get() {
          return this.billDetailWin;
        },
        set() {
        }
      }
    },
    methods: {
      billInfoWinClose() {
        this.showBillInfoWin = false;
      },
      showBillInfo(info, type) {
        this.billId = "";
        this.billNo = "";
        if (type === "billId") {
          this.billId = info;
        } else {
          this.billNo = info;
        }
        this.showBillInfoWin = true;
      },
      onMaximize() {
        setTimeout(() => {
          this.$refs.datagrid.$refs.gridContent.handleResize();
        }, 100);
      },
      handleClose() {
        this.$refs.datagrid.tData = [];
        this.$emit("billDetailWinClose", "");
      }
    }
  };
</script>

<style scoped>

</style>
