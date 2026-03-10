<template>
  <div>
    <h-msg-box v-model="tempPaymentFlowWin" width="1000" :mask-closable="false"
               @on-close="handleClose"
               class="h-form-table-layer" :maximize="true">
      <p slot="header">
        <span>支付流水维护</span>
      </p>
      <div>
        <h-form :model="formItem" :label-width="90" ref="formItem" cols="3" class="h-form-search">
          <common-input v-model="formItem.payFlowNo" :label="$t('s.i.pay.payFlowNo')" prop="payFlowNo" :maxlength="20"></common-input>
          <common-select v-model="formItem.payFlowStatus" :dictList="this.dictMap.pymnIdStsCodeList"
                         :label="$t('s.i.pay.payFlowStatus')" prop="payFlowStatus"></common-select>
          <query-btn @showChange="showChange" :formSearch="handleSearch" :formSearchReset="resetSearch" :advanceShow='false'></query-btn>
        </h-form>
      </div>
      <div>
        <h-datagrid
          :columns="columns"
          highlight-row
          url="/pay/order/orderInfoMain/func_queryPaymentInfoByPage"
          :bindForm="formItem"
          :onCurrentChange="handleCurrentChange"
          :onCurrentChangeCancel="handleCurrentChangeCancel"
          :autoLoad=false
          ref="datagrid">
          <div slot="toolbar" class="pull-left">
            <h-button type="primary" @click="changePayInfo()">{{$t("s.i.pay.change")}}</h-button>
            <bopp-show-payment-flow ref="showPaymentFlow" @showPaymentFlowInfo="showPaymentFlowInfo"></bopp-show-payment-flow>
          </div>
        </h-datagrid>
      </div>
      <!-- 弹出框模式底部按钮 -->
      <div slot="footer">
        <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
      </div>
    </h-msg-box>
    <change-payment-flow :changePaymentFlowWin="changePaymentFlowWin" @changePaymentFlowWinClose="changePaymentFlowWinClose" :param="param" :dictMap="dictMap"></change-payment-flow>
  </div>
</template>

<script>
import {formatNumber,getDictValueFromMap} from "@/api/bizApi/commonUtil";

export default {
  name: "queryPaymentFlowMain",
  components: {
    ChangePaymentFlow: () => import(/* webpackChunkName: "bopp-pay/order/changePaymentFlow" */`@/views/bizViews/bopp-pay/order/changePaymentFlow`),
  },
  data() {
    return {
      formItem: {
        legalNo: "",
        payFlowNo: "",
        payFlowStatus: "",
        orderInfoId: "",
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
            title: this.$t("s.i.pay.payFlowNo"),
            key: "payFlowNo",
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t("s.i.pay.payFlowStatus"),
            key: "payFlowStatus",
            hiddenCol: false,
            sortable: true,
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
            title: this.$t("s.i.pay.billLimitType"),
            key: "billLimitType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, 'DftTypeCode', params.row.billLimitType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("s.i.pay.drweEnterpriseName"),
            key: "drweEnterpriseName",
            hiddenCol: false,
          },
          {
            title: this.$t("s.i.pay.drweEnterpriseSocCode"),
            key: "drweEnterpriseSocCode",
            hiddenCol: false,
          },
          {
            title: this.$t("s.i.pay.drweAcctNo"),
            key: "drweAcctNo",
            hiddenCol: false,
          },
          {
            title: this.$t("s.i.pay.drweBankNo"),
            key: "drweBankNo",
            hiddenCol: false,
          },
          {
            title: this.$t("s.i.pay.drweBranchName"),
            key: "drweBranchName",
            hiddenCol: false,
          },
          {
            title: this.$t("s.i.pay.pyeeEnterpriseName"),
            key: "pyeeEnterpriseName",
            hiddenCol: false,
          },
          {
            title: this.$t("s.i.pay.pyeeEnterpriseSocCode"),
            key: "pyeeEnterpriseSocCode",
            hiddenCol: false,
          },
          {
            title: this.$t("s.i.pay.pyeeAcctNo"),
            key: "pyeeAcctNo",
            hiddenCol: false,
          },
          {
            title: this.$t("s.i.pay.pyeeBankNo"),
            key: "pyeeBankNo",
            hiddenCol: false,
          },
          {
            title: this.$t("s.i.pay.pyeeBranchName"),
            key: "pyeeBranchName",
            hiddenCol: false,
          },
          {
            title: this.$t("s.i.pay.billPayAmt"),
            key: "billPayAmt",
            hiddenCol: false,
            sortable: true,
            align: 'right',
            render: (h, params) => {
              return h("span", formatNumber(params.row.billPayAmt, 2, ","));
            }
          },
          {
            title: this.$t("s.i.pay.applStatus"),
            key: "applStatus",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, 'PayApplyStatus', params.row.applStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
        ],
        ifShowMore: false,
        paymentFlowDetailWin: false,
        changePaymentFlowWin: false,
        param:{
          payInfoId: "",
        },
        queryUrl: "/pay/order/orderInfoMain/func_queryOrderPayInfoDtoById",
      }
    },
    props: {
      paymentFlowWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      orderInfoId: "",
      dictMap: {
        type: Map
      }
    },
    computed: {
      tempPaymentFlowWin: {
        get() {
          return this.paymentFlowWin;
        },
        set() {
        }
      }
    },
    watch: {
      paymentFlowWin(val) {
        if (val === true) {
          this.$nextTick(() => {
            this.formItem.orderInfoId = this.orderInfoId;
            this.currentSelectRow = null;
            this.$refs.datagrid.dataChange(1);
          });
        }
      }
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
        this.formItem.orderInfoId = this.orderInfoId;
        this.$refs.formItem.resetFields();
      },
      onMaximize() {
        setTimeout(() => {
          this.$refs.datagrid.$refs.gridContent.handleResize();
        }, 100);
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = null;
      },
      handleClose() {
        this.$refs.datagrid.$refs.gridPage.clearElevator();
        this.$refs.formItem.resetFields();
        this.$emit("paymentFlowWinClose", "");
      },
      changePayInfo() {
        if(this.currentSelectRow) {
          if (this.currentSelectRow.applStatus === "PA03") {
            this.param.payInfoId = this.currentSelectRow.id;
            this.changePaymentFlowWin = true;
          } else {
            this.$msgTip.error(this, {info: "发送状态不是已成功的流水不允许发起变更"});
          }
        }else{
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseDataFirst")});
        }
      },
      changePaymentFlowWinClose(){
        this.param.payInfoId = "";
        this.handleSearch(1);
        this.changePaymentFlowWin = false;
      },
      showPaymentFlowInfo() {
        if(this.currentSelectRow) {
          this.$refs.showPaymentFlow.openWindow(this.currentSelectRow.id, this.queryUrl);
        }else{
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseDataFirst")});
        }
      },
    },
  created() {
    this.formItem.legalNo = this.$store.getters.userInfo.legalNo
  }
};
</script>

<style scoped>

</style>
