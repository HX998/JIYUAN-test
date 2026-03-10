<template>
  <div>
    <h-msg-box v-model="tempOrderAppendInfoWin" width="1000" :mask-closable="false" @on-close="handleClose"
               class="h-form-search-layer" :maximize="true" @on-maximize="onMaximize" :height="600">
      <p slot="header">
        <span>订单附加信息展示</span>
      </p>
      <div>
        <h-datagrid
          :columns="columns"
          highlight-row
          url="/pay/order/orderInfoMain/func_getOrderAppendInfoList"
          :bindForm="formItem"
          :onCurrentChange="handleCurrentChange"
          :onCurrentChangeCancel="handleCurrentChangeCancel"
          :autoLoad=false
          ref="orderAppendInfoDatagrid">
          <div slot="toolbar" class="pull-left">
            <h-button type="primary" @click="addAppendInfo()">{{$t("s.i.pay.addAppendInfo")}}</h-button>
            <h-button type="primary" @click="editAppendInfo()">{{$t("s.i.pay.editAppendInfo")}}</h-button>
            <h-button type="primary" @click="commitAppendInfo()">{{$t("s.i.pay.attManagement")}}</h-button>
            <h-button type="primary" @click="registerAppendInfo()">{{$t("s.i.pay.register")}}</h-button>
          </div>
        </h-datagrid>
      </div>
      <!-- 弹出框模式底部按钮 -->
      <div slot="footer">
        <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
      </div>
    </h-msg-box>
    <append-info-detail :orderAppendInfoDetailWin="orderAppendInfoDetailWin" :paramForm="paramForm" :dictMap="dictMap"
                        @orderAppendInfoDetailWinClose="orderAppendInfoDetailWinClose"></append-info-detail>
    <!--附件管理-->
    <show-file-win :showFileWin="showFileWin" :fileBatchParams="fileBatchParams" @showFileWinClose="showFileWinClose"
                   :dictMap="dictMap" :filePathUrl="filePathUrl"></show-file-win>
  </div>
</template>

<script>
  import {formatNumber, getDictValueFromMap, post} from "@/api/bizApi/commonUtil";

  export default {
    name: "orderAppendInfoView",
    components: {
      AppendInfoDetail: () => import(/* webpackChunkName: "bopp-pay/order/appendInfoDetail" */`@/views/bizViews/bopp-pay/order/appendInfoDetail`),
      showFileWin: () => import(/* webpackChunkName: "bopp-pay/order/showFileWin" */"@/views/bizViews/bopp-pay/order/showFileWin"),
    },
    data() {
      return {
        paramForm: {
          id: "",
          orderInfoId: "",
          payOrderNo: "",
          type: ""//new-新增，edit-修改，view-查看
        },
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
            title: this.$t("s.i.pay.appOrderType"),
            key: "appOrderType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "AppOrderType", params.row.appOrderType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("s.i.pay.tradeMode"),
            key: "tradeMode",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "TradeMode", params.row.tradeMode);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("s.i.pay.ctrctNo"),
            key: "ctrctNo",
            hiddenCol: false
          },
          {
            title: this.$t("s.i.pay.occurDate"),
            key: "occurDate",
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.occurDate != null && params.row.occurDate != '') {
                return h("span", this.$moment(params.row.occurDate, "YYYY-MM-DD").format("YYYY-MM-DD"));
              }
              return h("span", '')
            }
          },
          {
            title: this.$t("s.i.pay.ctrctAmt"),
            key: "ctrctAmt",
            hiddenCol: false,
            sortable: true,
            align: 'right',
            render: (h, params) => {
              if (params.row.ctrctAmt != null && params.row.ctrctAmt != '') {
                return h("span", formatNumber(params.row.ctrctAmt, 2, ","));
              }
              return h("span", '')
            }
          },
          {
            title: this.$t("s.i.pay.invoiceNo"),
            key: "invoiceNo",
            hiddenCol: false,
          },
          {
            title: this.$t("s.i.pay.invoiceCode"),
            key: "invoiceCode",
            hiddenCol: false,
          },
          {
            title: this.$t("s.i.pay.invoiceAmt"),
            key: "invoiceAmt",
            hiddenCol: false,
            sortable: true,
            align: 'right',
            render: (h, params) => {
              if (params.row.invoiceAmt != null && params.row.invoiceAmt != '') {
                return h("span", formatNumber(params.row.invoiceAmt, 2, ","));
              }
              return h("span", '')
            }
          },
          {
            title: this.$t("s.i.pay.invoiceType"),
            key: "invoiceType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "InvoiceType", params.row.invoiceType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("s.i.pay.suspiciousOrderFlag"),
            key: "suspiciousOrderFlag",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "SuspiciousOrderFlag", params.row.suspiciousOrderFlag);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("s.i.pay.suspiciousContent"),
            key: "suspiciousContent",
            hiddenCol: false
          },
          {
            title: this.$t("s.i.pay.remark"),
            key: "remark",
            hiddenCol: false
          },
          {
            title: this.$t("s.i.pay.otherVoucherNo"),
            key: "otherVoucherNo",
            hiddenCol: false
          },
          {
            title: this.$t("s.i.pay.otherVoucherUse"),
            key: "otherVoucherUse",
            hiddenCol: false
          },
          {
            title: this.$t("s.i.pay.registerStatus"),
            key: "applStatus",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "AppOrderState", params.row.applStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("s.i.pay.dealPrcMsg"),
            key: "dealPrcMsg",
            hiddenCol: false
          },
        ],
        orderAppendInfoDetailWin: false,
        showFileWin: false,
        fileBatchParams:{},
        filePathUrl:"/pay/order/orderAppFile/",
      };
    },
    props: {
      orderAppendInfoWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      formItem: Object,
      dictMap: {
        type: Map
      }
    },
    computed: {
      tempOrderAppendInfoWin: {
        get() {
          return this.orderAppendInfoWin;
        },
        set() {
        }
      }
    },
    watch: {
      orderAppendInfoWin(val) {
        if (val === true) {
          this.$nextTick(() => {
            this.currentSelectRow = null;
            this.$refs.orderAppendInfoDatagrid.dataChange(1);
          });
        }
      }
    },
    methods: {
      onMaximize() {
        setTimeout(() => {
          this.$refs.orderAppendInfoDatagrid.$refs.gridContent.handleResize();
        }, 100);
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = null;
      },
      handleClose() {
        this.$refs.orderAppendInfoDatagrid.$refs.gridPage.clearElevator();
        this.$emit("orderAppendInfoWinClose", "");
      },
      addAppendInfo() {
        this.paramForm.type = "new";
        this.paramForm.payOrderNo = this.formItem.payOrderNo;
        this.paramForm.orderInfoId = this.formItem.orderInfoId;
        this.orderAppendInfoDetailWin = true;
      },
      editAppendInfo() {
        if (this.currentSelectRow) {
          if (this.currentSelectRow.applStatus == 'OA01') {
            this.$msgTip.info(this, {info: this.$t("s.i.pay.underRegisterNoEdit")});
          } else {
            this.paramForm.type = "edit";
            this.paramForm.payOrderNo = this.formItem.payOrderNo;
            this.paramForm.id = this.currentSelectRow.id;
            this.paramForm.orderInfoId = this.currentSelectRow.orderInfoId;
            this.orderAppendInfoDetailWin = true;
          }
        } else {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseDataFirst")});
        }
      },
      registerAppendInfo() {
        if (this.currentSelectRow) {
          this.$hMsgBox.confirm({
            title: this.$t('s.i.pay.registerAdditionalInfo'),
            content: this.$t("m.i.common.confirm") + "?",
            onOk: () => {
              this.registerAppendInfoFunc();
            }
          });
        } else {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
        }
      },
      registerAppendInfoFunc() {
        let url = "/pay/order/orderInfoMain/func_sendOrderAppendInfo";
        let obj = {
          id: this.currentSelectRow.id,
          memberId: this.$store.getters.userInfo.memberId,
          brchNo: this.$store.getters.userInfo.cepsBrchCode
        }
        post(obj, url).then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$msgTip.success(this);
              this.$refs.orderAppendInfoDatagrid.dataChange(1);
            } else {
              this.$msgTip.error(this, {info: msg});
            }
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
          }
        });
      },
      commitAppendInfo() {
        if (this.currentSelectRow) {
          this.fileBatchParams.operType = "upload";
          this.fileBatchParams.appOrderId = this.currentSelectRow.id;
          this.showFileWin = true;
        } else {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseDataFirst")});
        }
      },
      commitAppendInfoFunc() {
        let url = "/pay/order/orderInfoMain/func_sendOrderAppendInfo";
        post({id: this.currentSelectRow.id}, url).then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$refs.orderAppendInfoDatagrid.dataChange(1);
            } else {
              this.$msgTip.error(this, {info: msg});
            }
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
          }
        });

      },
      showFileWinClose(){
        this.fileBatchParams = {};
        this.showFileWin = false;
      },
      orderAppendInfoDetailWinClose() {
        this.paramForm = {};
        this.orderAppendInfoDetailWin = false;
        this.$refs.orderAppendInfoDatagrid.dataChange(1);
      }
    }
  };
</script>

<style scoped>

</style>
