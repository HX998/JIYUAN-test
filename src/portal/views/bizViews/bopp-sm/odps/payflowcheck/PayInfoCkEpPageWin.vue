<template>
  <h-msg-box v-model="tempPayInfoCkEpPageWin" width="800" :mask-closable="false" @on-close="handleClose"
             class="h-form-search-layer" :maximize="true">
    <p slot="header">
      <span>核对异常支付流水</span>
    </p>
    <h-datagrid
      :columns="columns"
      highlightRow
      url="/sm/odps/payflowcheck/payFlowCheckMain/func_queryPayInfoCkEpDtoByPage"
      :bindForm="formItem"
      :onCurrentChange="handleCurrentChange"
      :onCurrentChangeCancel="handleCurrentChangeCancel"
      :auto-load="false"
      ref="datagrid">
      <div slot="toolbar" class="pull-left">
        <h-button type="primary" @click="showBillInfo()">{{$t("s.i.pay.billInfo")}}</h-button>
      </div>
    </h-datagrid>
    <!-- 弹出框模式底部按钮 -->
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
    </div>

    <h-msg-box v-model="payBillInfoCkEpPageWin" width="800" :mask-closable="false" @on-close="handleBillWinClose"
               class="h-form-search-layer" :maximize="true">
      <p slot="header">
        <span>核对异常支付流水明细</span>
      </p>
      <h-panel>
        <h-datagrid
          :columns="billColumns"
          highlightRow
          url="/sm/odps/payflowcheck/payFlowCheckMain/func_queryPayBillInfoCkEpDtoByPage"
          :bindForm="billFormItem"
          :onCurrentChange="handleBillCurrentChange"
          :onCurrentChangeCancel="handleBillCurrentChangeCancel"
          :auto-load="false"
          ref="billDatagrid">
          <div slot="toolbar" class="pull-left">
          </div>
        </h-datagrid>
      </h-panel>
      <!-- 弹出框模式底部按钮 -->
      <div slot="footer">
        <h-button type="ghost" @click="handleBillWinClose">{{$t("m.i.common.close")}}</h-button>
      </div>
    </h-msg-box>
  </h-msg-box>
</template>

<script>
import {getDictValueFromMap} from "@/api/bizApi/commonUtil";

export default {
  name: "PayInfoCkEpPageWin",
  data() {
    return {
      formItem: {
        id: "",
      },
      billFormItem: {
        payInfoCkEpId: "",
      },
      columns: [
          {
            type: "radio",
            title: " ",
            align: "center",
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
            title: this.$t("s.i.pay.noticeObj"),
            key: "noticeObj",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, 'NtfyTrgtCode', params.row.noticeObj);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
        {
          title: this.$t("s.i.pay.payOrderNo"),
          key: "payOrderNo",
          hiddenCol: false,
          sortable: true,
        },
        {
          title: this.$t("s.i.pay.payFlowNo"),
          key: "payFlowNo",
          hiddenCol: false,
          sortable: true,
        },
        {
          title: this.$t("s.i.pay.payFlowStatus"),
          key: "payFlowStatus",
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = getDictValueFromMap(this.dictMap, 'PymnIdStsCode', params.row.payFlowStatus);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t("s.i.pay.payFlowUpdateDtTm"),
          key: "payFlowUpdateDtTm",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            if (null != params.row.payFlowUpdateDtTm && "" !== params.row.payFlowUpdateDtTm) {
              let dttm = this.$moment(params.row.payFlowUpdateDtTm, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
              return h("span", dttm);
            }
          }
        },
          {
            title: this.$t("s.i.pay.orderStatus"),
            key: "orderStatus",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, 'OrdrStsCode', params.row.orderStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("s.i.pay.onlineIssueDtTm"),
            key: "onlineIssueDtTm",
            hiddenCol: false,
            render: (h, params) => {
              if(params.row.onlineIssueDtTm){
                return h("p", this.$moment(params.row.onlineIssueDtTm, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss"));
              }else{
                return h("p", "");
              }
            }
          },
          {
            title: this.$t("s.i.odps.exception"),
            key: "exception",
            hiddenCol: false,
          },
        ],
        billColumns: [
          {
            type: "index",
            key: "numOrder",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.billNo"),
            key: "billNo",
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t("s.i.billInfo.billStatus"),
            key: "billStatus",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, 'EcdsBillStatusCode', params.row.billStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("s.i.pay.billStatusUpdateDtTm"),
            key: "billStatusUpdateDtTm",
            hiddenCol: false,
            render: (h, params) => {
              if(params.row.billStatusUpdateDtTm){
                return h("p", this.$moment(params.row.billStatusUpdateDtTm, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss"));
              }else{
                return h("p", "");
              }
            }
          },
          {
            title: this.$t("s.i.pay.payStatus"),
            key: "payStatus",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, 'BillPayStatus', params.row.payStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("s.i.pay.payStatusUpdateDtTm"),
            key: "payStatusUpdateDtTm",
            hiddenCol: false,
            render: (h, params) => {
              if(params.row.payStatusUpdateDtTm){
                return h("p", this.$moment(params.row.payStatusUpdateDtTm, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss"));
              }else{
                return h("p", "");
              }
            }
          },
          {
            title: this.$t("s.i.odps.exception"),
            key: "exception",
            hiddenCol: false,
          },
        ],
        payBillInfoCkEpPageWin: false,
        currentSelectRow: null,
      }
    },
    computed: {
      tempPayInfoCkEpPageWin: {
        get() {
          return this.payInfoCkEpPageWin;
        },
        set() {
        }
      }
    },
    watch: {
      payInfoCkEpPageWin(val) {
        if (val === true) {
          this.$nextTick(() => {
            this.handleSearch();
          });
        }
      }
    },
    props: {
      payInfoCkEpPageWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      dictMap: {
        type: Map
      },
      id: "",
    },
    methods: {
      handleSearch() {
        this.formItem.id = this.id;
        this.$refs.datagrid.dataChange(1);
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = null;
      },
      handleBillCurrentChange(currentRow) {
      },
      handleBillCurrentChangeCancel() {
      },
      handleClose() {
        this.$emit("payBillInfoCkEpPageWinClose", "");
      },
      handleBillWinClose() {
        this.billFormItem.payInfoCkEpId = null;
        this.payBillInfoCkEpPageWin = false;
      },
      showBillInfo() {
        if (this.currentSelectRow) {
          this.payBillInfoCkEpPageWin = true;
          this.$nextTick(() => {
            this.billFormItem.payInfoCkEpId = this.currentSelectRow.id;
            this.$refs.billDatagrid.dataChange(1);
          });
        }else{
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseDataFirst")});
        }
      }
    }
  }
</script>

<style scoped>

</style>
