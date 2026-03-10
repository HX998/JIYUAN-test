<template>
  <h-msg-box v-model="tempQuerySettleSynResult" @on-close="handleClose" width="1000"
             class="h-form-search-layer" :maximize="true">
    <p slot="header">
      <span>业务结算状态查询结果</span>
    </p>
    <h-panel class="h-main-search h-form-search clearfix" v-show="false">
      <h-form :model="formItem" :label-width="90" ref="formItem" cols="3">
        <div class="h-search-form-row">
          <h-form-item prop="batchId" label="ID">
            <h-input v-model="formItem.batchId" v-show="false"></h-input>
          </h-form-item>
        </div>
      </h-form>
    </h-panel>
    <!-- 数据展示表格 -->
    <h-datagrid
      :columns="columns"
      :auto-load="false"
      highlight-row
      url="/shcpe/cpes/settle/querySettleSynResult/func_querySettleStatusInfo"
      :bindForm="formItem"
      stripe
      ref="datagrid">
    </h-datagrid>
    <div slot="footer">
      <h-button type="ghost" @click="handleClose()">{{$t("m.i.common.close")}}</h-button>
    </div>
    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId" :billNo="this.billNo"
                    :billRangeStart="this.billRangeStart" :billRangeEnd="this.billRangeEnd"></bill-info-main>
  </h-msg-box>
</template>

<script>
  import { post, on, off, getDictListByGroups, getDictValueFromMap, formatBillRange } from "@/api/bizApi/commonUtil";

  export default {
    name: "querySettleSynResult",
    data() {
      return {
        billId : "",
        billNo : "",
        billRangeStart : "",
        billRangeEnd : "",
        showBillInfoWin : false,
        formItem: {
          batchId: ""
        },
        columns: [
          {
            type: "selection",
            hiddenCol: true,
            align: "center"
          },
          {
            type: "index",
            title: this.$t("m.i.common.index"),
            align: "center",
            hiddenCol: false
          },

          {
            title: this.$t('m.i.common.id'),
            key: "id",
            hiddenCol: true,
            align: "center"
          },
          {
            title: this.$t('m.i.common.settleReqNo'),
            key: "settleReqNo",
            hiddenCol: false,
            align: "center"
          },
          {
            title: this.$t('m.i.common.settleBusiType'),
            key: "settleBusiType",
            hiddenCol: false,
            align: "center",

            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap, "StlRequestType", params.row.settleBusiType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.common.isBatchClear'),
            key: "isBatchClear",
            hiddenCol: false,
            align: "center",
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap, "Yon", params.row.isBatchClear);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.be.dealNo'),
            key: "dealNo",
            hiddenCol: false,
            align: "center"
          },
          {
            title: this.$t('m.i.billInfo.billPackageNo'),
            key: "billNo",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
                return h("a", {
                    on: {
                        click: () => {
                            this.showBillInfo(params.row.billId,params.row.billNo,params.row.billRangeStart,params.row.billRangeEnd);
                        }
                    }
                }, params.row.billNo);
            }
          },
          {
            title: this.$t('m.i.billInfo.billRange'),
            key: 'billRange',
            hiddenCol: false,
            render: (h, params) => {
              return h("span", formatBillRange(params.row.billOrigin,params.row.billRangeStart,params.row.billRangeEnd));
            }
          },
          {
            title: this.$t('m.i.be.settleStatus'),
            key: "settleStatus",
            hiddenCol: false,
            align: "center",
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap, "MmbStlStatus", params.row.settleStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.shcpe.drweBrchCode'),
            key: "drweBrchCode",
            hiddenCol: false,
            align: "center"

          },
          {
            title: this.$t('m.i.shcpe.rcvBrchCode'),
            key: "rcvBrchCode",
            hiddenCol: false,
            align: "center"

          },
          {
            title: this.$t('m.i.shcpe.settleFailCode'),
            key: "settleFailCode",
            hiddenCol: false,
            align: "center",
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap, "StlFlRson", params.row.settleFailCode);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          }
        ],
        pageInfo: {
          pageNo: 1,
          pageSize: 10
        },
        tableRef: "selfTable",

        currentSelectRow: null,
        currentSelectList: [],
        currentSelectRowInx: [],
        dictMap: {}
      };
    },
    mounted() {
      getDictListByGroups("StlRequestType,StlFlRson,MmbStlStatus,Yon").then(res => {
        this.dictMap = res.get("map");
      });
    },
    props: {
      querySettleSynResult: {
        type: Boolean,
        default() {
          return false;
        }
      },
      needInfoId: ""
    },
    watch: {
      querySettleSynResult(val) {
        if (val === true) {
          this.$nextTick(() => {
            this.$refs.formItem.resetFields();
            this.formItem.batchId = this.needInfoId;
            this.currentSelectRow = null;
            this.$refs.datagrid.dataChange(1);
          });
        }
      }
    },
    computed: {
      tempQuerySettleSynResult: {
        get() {
          return this.querySettleSynResult;
        },
        set() {
        }
      }
    },
    methods: {
        showBillInfo(billId, billNo,billRangeStart, billRangeEnd) {
            this.billId = billId;
            this.billNo = billNo;
            this.billRangeStart = billRangeStart;
            this.billRangeEnd = billRangeEnd;
            this.showBillInfoWin = true;
        },
        billInfoWinClose() {
            this.showBillInfoWin = false;
        },
      //关闭
      handleClose() {
        this.$emit("querySettleSynResultClose", "");
      }
    }
  };
</script>

<style scoped>

</style>
