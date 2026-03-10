<template>
  <dev>
  <h-msg-box v-model="tempShowSettleBatchDetailWin" :maximize="true" :mask-closable="false" @on-close="handleClose"
             width="1000" class="h-form-table-layer" >
    <p slot="header">
      <span>批量清算明细信息</span>
    </p>
    <!--弹出框内容-->
    <div>
      <!--数据展示表格-->
      <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
        <common-input v-model="formItem.billNo" :label="$t('m.i.billInfo.billPackageNo')" prop="billNo"
                      :maxlength="30" ></common-input>
        <h-form-item class="h-form-operate">
          <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
          <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
        </h-form-item>
      </h-form>
    </div>
    <h-datagrid
      :columns="columns"
      highlightRow
      url="/shcpe/cpes/settle/settleBatchMain/func_querySettleBatchDetail"
      :bindForm="formItem"
      :auto-load="false"
      rowSelect
      :hasSelect="false"
      ref="datagrid">
    </h-datagrid>
    <!-- 弹出框模式底部按钮 -->
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
    </div>

  </h-msg-box>

  <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin"
                  :billId="this.billId" :billRangeStart="this.billRangeStart" :billRangeEnd="this.billRangeEnd"></bill-info-main>

  </dev>

</template>

<script>

import {formatBillRange,formatNumber} from "@/api/bizApi/commonUtil";


export default {
  name: "showSettleBatchDetailWin",
  data(){
    return {
      showBillInfoWin: false,
      billId :"",
      billRangeStart:"",
      billRangeEnd:"",
      formItem : {
        id: "",
        billNo:"",
      },
      columns : [
        {
          type: "index",
          title: this.$t("m.i.common.index"),
          width: 60,
          align: "center"
        },
        {
          title: this.$t('m.i.billInfo.billPackageNo'),
          key: "billNo",
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
                  this.showBillInfo(params.row, type);
                }
              }
            }, params.row.billNo);
          }
        },
        {
          title: this.$t("m.i.billInfo.billRange"),
          align:'center',
          key:"billRange",
          hiddenCol: false,
          render:(h,params) => {
            let billOrigin = params.row.billOrigin;
            let billRangeStart = params.row.billRangeStart;
            let billRangeEnd = params.row.billRangeEnd;
            return h("span", formatBillRange(billOrigin, billRangeStart, billRangeEnd));
          }
        },
        {
          title: this.$t('m.i.billInfo.billPackageMoney'),
          key: "billMoney",
          hiddenCol: false,
          render: (h, params) => {
            let billMoney = formatNumber(params.row.billMoney, 2, ",");
            return h("span", {
              domProps: {
                title: billMoney
              }
            }, billMoney);
          }
        },
        {
          title: this.$t("m.i.be.isInnerClearFlag"),
          key: "isInnerClearFlag",
          hiddenCol: false,
          ellipsis: false,
          render: (h, params) => {
            let dictValue = this.getDictValueFromMap(this.dictMap, "Yon", params.row.isInnerClearFlag);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t("m.i.be.payRcvFlag"),
          key: "payRcvFlag",
          hiddenCol: false,
          ellipsis: false,
          render: (h, params) => {
            let payRcvFlag = params.row.payRcvFlag;
            switch (payRcvFlag) {
              case "PR00":
                return h("span", "收款方");
              case "PR01":
                return h("span", "付款方");
              default :
                return h("span", "");
            }
          }
        },
        {
          title: this.$t("m.i.be.payDealFlag"),
          key: "payDealFlag",
          hiddenCol: false,
          ellipsis: false,
          render: (h, params) => {
            let payDealFlag = params.row.payDealFlag;
            switch (payDealFlag) {
              case "1":
                return h("span", "处理成功");
              case "0":
                return h("span", "处理失败");
              default :
                return h("span", "");
            }
          }
        },
        {
          title: this.$t("m.i.be.rcvDealFlag"),
          key: "rcvDealFlag",
          hiddenCol: false,
          ellipsis: false,
          render: (h, params) => {
            let rcvDealFlag = params.row.rcvDealFlag;
            switch (rcvDealFlag) {
              case "1":
                return h("span", "处理成功");
              case "0":
                return h("span", "处理失败");
              default :
                return h("span", "");
            }
          }
        },
        {
          title: this.$t("m.i.be.payErrorReason"),
          key: "payErrorReason",
          hiddenCol: false,
          ellipsis: false,
        },
        {
          title: this.$t("m.i.be.rcvErrorReason"),
          key: "rcvErrorReason",
          hiddenCol: false,
          ellipsis: false,
        },
      ],
    }
  },
  props: {
    showSettleBatchDetailWin: {
      type: Boolean,
      default() {
        return false;
      }
    },
    batchParams: {
      type: Object,
      default: {}
    },
    dictMap: { //MemberType, CreditRating
      type: Map,
      required: true
    },
  },
  watch: {
    showSettleBatchDetailWin(val) {
      if (val) {
        this.formItem.id = this.batchParams.batchId;
        this.$nextTick(() => {
          this.handleSearch();
        });
      }
    }
  },
  computed: {
    tempShowSettleBatchDetailWin: {
      get() {
        return this.showSettleBatchDetailWin;
      },
      set() {
      }
    }
  },
  methods: {
    handleSearch() {
      this.$refs.datagrid.selects = [];
      this.$refs.datagrid.selectIds = [];
      this.$refs.datagrid.dataChange(1);
    },
    handleClose() {
      this.formSearchReset();
      this.$refs.datagrid.selects = [];
      this.$refs.datagrid.selectIds = [];
      this.$emit("showSettleBatchDetailWinClose", "");
    },
    formSearchReset() {
      this.$refs.formItem.resetFields();
    },
    billInfoWinClose() {
      this.showBillInfoWin = false;
    },
    showBillInfo(row) {
      this.billId = row.billId;
      this.billRangeStart = row.billRangeStart;
      this.billRangeEnd = row.billRangeEnd;
      this.showBillInfoWin = true;
    },
  }
}
</script>

<style scoped>

</style>
