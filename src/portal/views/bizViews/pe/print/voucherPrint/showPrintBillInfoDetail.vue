<template>
  <div>
    <h-msg-box v-model="tempBillDetailWin" width="1000" class="h-form-table-layer" :maximize="true" @on-close="handleClose" :mask-closable="false" @on-maximize="onMaximize">
      <p slot="header">
        <span>{{$t('m.i.ce.detailBill')}}</span>
      </p>
      <!--数据展示表格-->
      <h-datagrid :columns="showBillDetailColumns"
                  highlight-row
                  :height="400"
                  :url="this.listUrl"
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
    <!-- 票面 -->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"></bill-info-main>
  </div>
</template>

<script>
  import { post,formatNumber, getDictValueFromMap, getDictListByGroups ,accMul} from "@/api/bizApi/commonUtil";

  export default {
      name: "showPrintBillInfoDetail",
      data() {
        return {
          showBillDetailColumns: [
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
                let billNo = "";
                if (params.row.billNo === null || params.row.billNo === "") {
                  billNo = "查看票面";
                }else {
                  billNo = params.row.billNo;
                }
                return h("a", {
                  on: {
                    click: () => {
                      this.showBillInfo(params.row.id);
                    }
                  }
                }, billNo);
              }
            },
            {
              title: this.$t("m.i.billInfo.billType"),
              key: "billType",
              hiddenCol: false,
              render: (h, params) => {
                let title = "";
                if (params.row.billType === "AC01") {
                  title = "银票";
                } else {
                  title = "商票";
                }
                return h("span", title);
              }
            },
            {
              title: this.$t("m.i.billInfo.drwrName"),
              key: 'drwrName',
              hiddenCol: false,
            },
            {
              title: this.$t("m.i.billInfo.acptName"),
              key: 'acptName',
              hiddenCol: false,
            },
            {
              title: this.$t("m.i.billInfo.remitDt"),
              key: 'remitDt',
              hiddenCol: false,
              sortable: true,
              render: (h, params) => {
                if(params.row.remitDt == null || params.row.remitDt === ""){
                  return "";
                }
                let date = this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD");
                return h("span", date);
              }
            },
            {
              title: this.$t("m.i.billInfo.dueDt"),
              key: 'dueDt',
              hiddenCol: false,
              sortable: true,
              render: (h, params) => {
                if(params.row.dueDt == null || params.row.dueDt === ""){
                  return "";
                }
                let date = this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
                return h("span", date);
              }
            },
            {
              title: this.$t("m.i.billInfo.billMoneyByUnit"),
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
            }
          ],
          formItem: {
            foreFlowNo: '',
            frontFlowNo: '',
            rgstDt: ''
          },
          showBillInfoWin: false,
          billId: ""
        }
      },
      props: {
        billDetailWin: {
          type: Boolean,
          default() {
            return false;
          }
        },
        foreFlowNo: '',
        rgstDt: '',
        listUrl:'',
        tempPrintMode: ''
      },
      watch: {
        tempBillDetailWin(val) {
          if (val === true) {
            this.$nextTick(() => {
              if (this.tempPrintMode === "0") {
                this.formItem.foreFlowNo = this.foreFlowNo;
              } else {
                this.formItem.frontFlowNo = this.foreFlowNo;
              }
              this.formItem.rgstDt = this.rgstDt;
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
        showBillInfo(billId) {
          this.billId = billId;
          this.showBillInfoWin = true;
        },
        onMaximize() {
          setTimeout(() => {
            this.$refs.datagrid.$refs.gridContent.handleResize();
          }, 100);
        },
        handleClose() {
          this.$refs.datagrid.tData = [];
          this.formItem.foreFlowNo = '';
          this.formItem.frontFlowNo = '';
          this.formItem.rgstDt = '';
          this.$emit("billDetailWinClose", "");
        }
      }
    }
</script>

<style scoped>

</style>
