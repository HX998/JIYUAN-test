<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <!--右侧数据展示表格-->
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <common-input v-model="formItem.platformNameLike" :label="$t('s.i.pay.platformName')"
                              prop="platformNameLike" :maxlength="60"></common-input>
                <common-input v-model="formItem.payOrderNoLike" :label="$t('s.i.pay.payOrderNo')"
                              prop="payOrderNoLike" :maxlength="35"></common-input>
                <common-type-field-range className="h-form-long-label" v-model="formItem"
                                         :label="$t('s.i.pay.payOrderAmt')" :integerNum="16" :suffixNum="2"
                                         :rangeProps="['minPayOrderAmt','maxPayOrderAmt']"
                                         :bigTips="false"></common-type-field-range>
                <query-btn @showChange="showChange" :formSearch="handleSearch"
                           :formSearchReset="resetSearch" :advanceShow='false'></query-btn>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
              :columns="columns"
              highlightRow
              url="/pay/order/orderInfoMain/func_getOrderInfoList"
              :bindForm="formItem"
              :onCurrentChange="handleCurrentChange"
              :onCurrentChangeCancel="handleCurrentChangeCancel"
              ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="addOrderInfo()">{{ $t("s.i.pay.addOrderInfo") }}</h-button>
              <h-button type="primary" @click="editOrderInfo()">{{
                  $t("s.i.pay.editOrderInfo")
                }}
              </h-button>
              <h-button type="primary" @click="showPaymentFlow()">{{ $t("s.i.pay.paymentFlow") }}</h-button>
              <h-button type="primary" @click="showOrderAppendInfo()">{{ $t("s.i.pay.orderAppendInfo") }}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <order-info-detail :orderInfoDetailWin="orderInfoDetailWin" @orderInfoDetailWinClose="orderInfoDetailWinClose"
                       :paramForm="orderFormItem" :dictMap="dictMap"></order-info-detail>
    <query-payment-flow-main :paymentFlowWin="paymentFlowWin" @paymentFlowWinClose="paymentFlowWinClose"
                             :orderInfoId="orderInfoId" :dictMap="dictMap"></query-payment-flow-main>
    <order-append-info-view :orderAppendInfoWin="orderAppendInfoWin" @orderAppendInfoWinClose="orderAppendInfoWinClose"
                            :formItem="appendFormItem" :dictMap="dictMap"></order-append-info-view>
  </div>
</template>

<script>
import {formatNumber, getDictValueFromMap} from "@/api/bizApi/commonUtil";

export default {
  name: "orderInfoMain",
  components: {
    OrderInfoDetail: () =>
        import(/* webpackChunkName: "bopp-pay/order/orderInfoDetail" */`@/views/bizViews/bopp-pay/order/orderInfoDetail`),
    QueryPaymentFlowMain: () =>
        import(/* webpackChunkName: "bopp-pay/order/queryPaymentFlowMain" */`@/views/bizViews/bopp-pay/order/queryPaymentFlowMain`),
    OrderAppendInfoView: () =>
        import(/* webpackChunkName: "bopp-pay/order/orderAppendInfoView" */`@/views/bizViews/bopp-pay/order/orderAppendInfoView`),
  },
  data() {
    return {
      formItem: {
        legalNo: "",
        platformNameLike: "",
        payOrderNoLike: "",
        minPayOrderAmt: "",
        maxPayOrderAmt: "",
      },
      appendFormItem: {
        orderInfoId: "",
        payOrderNo: "",
      },
      orderFormItem: {
        type: "",
      },
      orderInfoId: "",
      dictMap: new Map(),
      ifShowMore: false,
      orderInfoDetailWin: false,
      orderAppendInfoWin: false,
      paymentFlowWin: false,
      currentSelectRow: null,
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
          title: this.$t("s.i.pay.platformName"),
          key: "platformName",
          hiddenCol: false,
          sortable: true
        },
        {
          title: this.$t("s.i.pay.payOrderNo"),
          key: "payOrderNo",
          hiddenCol: false,
          sortable: true
        },
        {
          title: this.$t("s.i.pay.payOrderDesc"),
          key: "payOrderDesc",
          hiddenCol: false
        },
        {
          title: this.$t("s.i.pay.payOrderAmt"),
          key: "payOrderAmt",
          hiddenCol: false,
          sortable: true,
          align: 'right',
          render: (h, params) => {
            return h("p", formatNumber(params.row.payOrderAmt, 2, ","));
          }
        },
        // {
        //   title: this.$t("s.i.pay.payOrderDueDtTm"),
        //   key: "payOrderDueDtTm",
        //   hiddenCol: false,
        //   render: (h, params) => {
        //     if (params.row.payOrderDueDtTm) {
        //       let timStr = params.row.payOrderDueDtTm + "";
        //       if (timStr.length < 6) {
        //         timStr = "0" + timStr;
        //       }
        //       return h("p", this.$moment(timStr, "HH:mm:ss").format("HH:mm:ss"));
        //     } else {
        //       return h("p", "");
        //     }
        //   }
        // },
        {
          title: this.$t("s.i.pay.drweEnterpriseName"),
          key: "drweEnterpriseName",
          hiddenCol: false
        },
        {
          title: this.$t("s.i.pay.drweEnterpriseSocCode"),
          key: "drweEnterpriseSocCode",
          hiddenCol: false
        },
        {
          title: this.$t("s.i.pay.drweBankNo"),
          key: "drweBankNo",
          hiddenCol: false
        },
        {
          title: this.$t("s.i.pay.pyeeEnterpriseName"),
          key: "pyeeEnterpriseName",
          hiddenCol: false
        },
        {
          title: this.$t("s.i.pay.pyeeEnterpriseSocCode"),
          key: "pyeeEnterpriseSocCode",
          hiddenCol: false
        },
        {
          title: this.$t("s.i.pay.pyeeBankNo"),
          key: "pyeeBankNo",
          hiddenCol: false
        },
        {
          title: this.$t("s.i.pay.orderStatus"),
          key: "orderStatus",
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = getDictValueFromMap(this.dictMap, 'OrderStatus', params.row.orderStatus);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },{
          title: this.$t("s.i.pay.remark"),
          key: "remark",
          hiddenCol: false
        },

      ],
      ordrStsCodeList: [],
      sspcsMkCodeList: [],
      pymnIdStsCodeList: [],
      dftTypeCodeList: [],
      updtTpCodeList: [],
      ordrNtfyMaCodeList: [],
      ordrStsSelectCodeList: [],
      ordrStsCodeMap: new Map(),
    }
  },
  mounted() {
    this.getDictListByGroups("AppOrderType,AppOrderState,OrdrNtfyMaCode,TradeMode,InvoiceType,SuspiciousOrderFlag,OrderStatus,PayApplyStatus,PymnIdStsCode,DftTypeCode,UpdtTpCode,PreRelationFlag,FileApplStatus,OrderFileType").then(res => {
      this.ordrStsCodeList = res.get("OrderStatus");
      ///this.sspcsMkCodeList = res.get("SspcsMkCode");
      this.pymnIdStsCodeList = res.get("PymnIdStsCode");
      this.dftTypeCodeList = res.get("DftTypeCode");
      this.updtTpCodeList = res.get("UpdtTpCode");
      this.ordrNtfyMaCodeList = res.get("OrdrNtfyMaCode")
      this.dictMap = res.get("map");
      this.dictMap.ordrStsSelectCodeList = this.ordrStsCodeList.filter(item => item.key !== 'OS02');
      this.dictMap.ordrStsCodeList = this.ordrStsCodeList;
      //this.dictMap.sspcsMkCodeList = this.sspcsMkCodeList;
      this.dictMap.pymnIdStsCodeList = this.pymnIdStsCodeList;
      this.dictMap.dftTypeCodeList = this.dftTypeCodeList;
      this.dictMap.updtTpCodeList = this.updtTpCodeList;
      //变更
      this.dictMap.ordrNtfyMaCodeList = this.ordrNtfyMaCodeList.filter(item=> {
        return item.key !== 'ONT01'
      });
      //附加所用信息字典
      this.dictMap.appOrderTypeList = res.get("AppOrderType");
      this.dictMap.tradeModeList = res.get("TradeMode");
      this.dictMap.invoiceTypeList = res.get("InvoiceType");
      this.dictMap.suspiciousOrderFlagList = res.get("SuspiciousOrderFlag");
      this.ordrStsCodeList.forEach(x => {
        return this.ordrStsCodeMap.set(x.key, x.value)
      });
      //附件信息
      this.dictMap.orderFileTypeList = res.get("OrderFileType");
      this.dictMap.fileApplStatusList = res.get("FileApplStatus");
      this.dictMap.preRelationFlagList = res.get("PreRelationFlag");

      this.dictMap.ordrStsCodeMap = this.ordrStsCodeMap;
    });
  },
  created() {
    this.formItem.legalNo = this.$store.getters.userInfo.legalNo
  },
  methods: {
    showChange(val) {
      this.ifShowMore = val;
    },
    //表单查询
    handleSearch(pageNo) {
      this.currentSelectRow = null;
      this.$refs.datagrid.dataChange(!!pageNo ? pageNo : 1);
    },
    //重置表单查询结果
    resetSearch() {
      this.$refs.formItem.resetFields();
    },
    handleCurrentChange(currentRow) {
      this.currentSelectRow = currentRow;
    },
    handleCurrentChangeCancel() {
      this.currentSelectRow = null;
    },
    addOrderInfo() {
      this.orderFormItem.id = null;
      this.orderFormItem.type = "new";
      this.orderInfoDetailWin = true;
    },
    editOrderInfo() {
      if (this.currentSelectRow) {
        if(this.currentSelectRow.orderStatus == 'OS00') {
          this.$msgTip.info(this, {info: this.$t("s.i.pay.cancelOrderCannotChange")});
        }else {
          this.orderFormItem.type = "edit";
          this.orderFormItem.id = this.currentSelectRow.id;
          this.orderInfoDetailWin = true;
        }
      } else {
        this.$msgTip.info(this, {info: this.$t("m.i.common.chooseDataFirst")});
      }
    },
    orderInfoDetailWinClose() {
      this.orderInfoDetailWin = false;
      this.handleSearch(1);
    },
    showPaymentFlow() {
      if (this.currentSelectRow) {
        this.orderInfoId = this.currentSelectRow.id;
        this.paymentFlowWin = true;
      } else {
        this.$msgTip.info(this, {info: this.$t("m.i.common.chooseDataFirst")});
      }
    },
    paymentFlowWinClose() {
      this.paymentFlowWin = false;
    },
    showOrderAppendInfo() {
      if (this.currentSelectRow) {
        this.appendFormItem.orderInfoId = this.currentSelectRow.id;
        this.appendFormItem.payOrderNo = this.currentSelectRow.payOrderNo;
        this.orderAppendInfoWin = true;
      } else {
        this.$msgTip.info(this, {info: this.$t("m.i.common.chooseDataFirst")});
      }
    },
    orderAppendInfoWinClose() {
      this.orderAppendInfoWin = false;
    }
  }
};
</script>

<style scoped>

</style>
