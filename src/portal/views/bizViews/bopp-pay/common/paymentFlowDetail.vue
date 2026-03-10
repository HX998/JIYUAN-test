<template>
  <h-msg-box v-model="tempPaymentFlowDetailWin" :width="this.showBill ? 1000 : 800" :mask-closable="false"
                   @on-close="handleClose"
                   class="h-form-search-layer" :maximize="true">
    <p slot="header">
      <span>支付流水详情</span>
    </p>
    <h-panel>
      <h-form :model="formItem" :label-width="115" ref="formItem" :cols="this.showBill ? 3 : 2" class="h-form-search">
        <common-input v-model="formItem.platformName" :label="$t('s.i.pay.platformName')" prop="platformName"
                      readonly></common-input>
        <common-input v-model="formItem.payOrderNo" :label="$t('s.i.pay.payOrderNo')" prop="payOrderNo"
                      readonly></common-input>
        <common-input v-model="formItem.payOrderDesc" :label="$t('s.i.pay.payOrderDesc')" prop="payOrderDesc"
                      readonly></common-input>
        <common-type-field v-model="formItem.payOrderAmt" :label="$t('s.i.pay.payOrderAmt')" prop="payOrderAmt"
                           readonly></common-type-field>
        <common-input v-model="formItem.payFlowNo" :label="$t('s.i.pay.payFlowNo')" prop="payFlowNo"
                      readonly></common-input>
        <common-input v-model="payFlowUpdateDtTm" :label="$t('s.i.pay.payFlowUpdateDtTm')"
                      prop="payFlowUpdateDtTm" readonly></common-input>
        <div v-if="showBill">
          <common-select v-model="formItem.noticeObj" :label="$t('s.i.pay.noticeObj')"
                         prop="noticeObj" :dictList="this.noticeObjCodeList" readonly></common-select>
          <common-select v-model="formItem.noticeType" :label="$t('s.i.pay.noticeType')"
                         prop="noticeType" :dictList="this.noticeTypeCodeList" readonly></common-select>
        </div>
        <common-select v-model="formItem.payFlowStatus" :label="$t('s.i.pay.payFlowStatus')"
                       prop="payFlowStatus" :dictList="this.pymnIdStsCodeList" readonly></common-select>
        <common-select v-model="formItem.billLimitType" :label="$t('s.i.pay.billLimitType')"
                       prop="billLimitType" :dictList="this.dftTypeCodeList" readonly></common-select>
        <common-type-field v-model="formItem.billPayAmt" :label="$t('s.i.pay.billPayAmt')" prop="billPayAmt"
                           readonly></common-type-field>
        <common-type-field v-model="formItem.cashPayAmt" :label="$t('s.i.pay.cashPayAmt')" prop="cashPayAmt"
                           readonly></common-type-field>
        <common-input v-model="formItem.cashPayAcctName" :label="$t('s.i.pay.cashPayAcctName')"
                      prop="cashPayAcctName" readonly></common-input>
        <common-input v-model="formItem.cashPayAcctNo" :label="$t('s.i.pay.cashPayAcctNo')" prop="cashPayAcctNo"
                      readonly></common-input>
        <common-input v-model="formItem.cashPayBankNo" :label="$t('s.i.pay.cashPayBankNo')" prop="cashPayBankNo"
                      readonly className="h-form-long-label"></common-input>
        <common-input v-model="formItem.drweEnterpriseName" :label="$t('s.i.pay.drweEnterpriseName')"
                      prop="drweEnterpriseName" readonly></common-input>
        <common-input v-model="formItem.drweEnterpriseSocCode" :label="$t('s.i.pay.drweEnterpriseSocCode')"
                      prop="drweEnterpriseSocCode" readonly className="h-form-long-label"></common-input>
        <common-input v-model="formItem.drweAcctNo" :label="$t('s.i.pay.drweAcctNo')" prop="drweAcctNo"
                      readonly></common-input>
        <common-input v-model="formItem.drweBankNo" :label="$t('s.i.pay.drweBankNo')" prop="drweBankNo"
                      readonly></common-input>
        <common-input v-model="formItem.drweBranchName" :label="$t('s.i.pay.drweBranchName')" prop="drweBranchName"
                      readonly className="h-form-long-label"></common-input>
        <common-input v-model="formItem.pyeeEnterpriseName" :label="$t('s.i.pay.pyeeEnterpriseName')"
                      prop="pyeeEnterpriseName" readonly></common-input>
        <common-input v-model="formItem.pyeeEnterpriseSocCode" :label="$t('s.i.pay.pyeeEnterpriseSocCode')"
                      prop="pyeeEnterpriseSocCode" readonly className="h-form-long-label"></common-input>
        <common-input v-model="formItem.pyeeAcctNo" :label="$t('s.i.pay.pyeeAcctNo')" prop="pyeeAcctNo"
                      readonly></common-input>
        <common-input v-model="formItem.pyeeBankNo" :label="$t('s.i.pay.pyeeBankNo')" prop="pyeeBankNo"
                      readonly></common-input>
        <common-input v-model="formItem.pyeeBranchName" :label="$t('s.i.pay.pyeeBranchName')" prop="pyeeBranchName"
                      readonly className="h-form-long-label"></common-input>
        <common-input v-model="formItem.remark" :label="$t('s.i.pay.remark')" prop="remark"
                      readonly></common-input>
        <div v-if="showBill">
          <h-datagrid
            :columns="columns"
            highlightRow
            url="/pay/payment/billPaymentMain/func_queryPaymentBillByPage"
            :bindForm="queryFormItem"
            :auto-load="false"
            :row-select="true"
            ref="billDatagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="addBill()" v-if="!isView">{{$t("s.i.pay.addBill")}}</h-button>
              <h-dropdown placement="bottom-start" @on-click="unLockBill" v-if="!isView">
                <h-button type="primary">
                  {{$t("s.i.pay.unLockBill")}}
                  <h-icon name="unfold"></h-icon>
                </h-button>
                <h-dropdown-menu slot="list" id="dropDownMenu">
                  <h-dropdown-item name="POT02">{{$t("s.i.pay.unLockBillForPOT02")}}</h-dropdown-item>
                  <h-dropdown-item name="POT03">{{$t("s.i.pay.unLockBillForPOT03")}}</h-dropdown-item>
                  <h-dropdown-item name="POT04">{{$t("s.i.pay.unLockBillForPOT04")}}</h-dropdown-item>
                </h-dropdown-menu>
              </h-dropdown>
            </div>
          </h-datagrid>
        </div>
      </h-form>
    </h-panel>
    <!-- 弹出框模式底部按钮 -->
    <div slot="footer">
      <h-button type="ghost" @click="handleClose" v-if="!showBill || isView">{{$t("m.i.common.close")}}</h-button>
    </div>
    <edit-bill :editBillWin="editBillWin" :payInfoId="this.payInfoId" @editBillWinClose="editBillWinClose"></edit-bill>
    <bopp-bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin"
                    :billId="billId"></bopp-bill-info-main>
  </h-msg-box>
</template>

<script>
  import {formatNumber, getDictValueFromMap, post} from "@/api/bizApi/commonUtil";

  export default {
    name: "paymentFlowDetail",
    components: {
      EditBill: () => import(/* webpackChunkName: "bopp-pay/common/editBill" */`@/views/bizViews/bopp-pay/common/editBill`),
    },
    data() {
      return {
        formItem: {
          platformName: "",
          payOrderNo: "",
          payOrderDesc: "",
          payOrderAmt: "",
          payFlowNo: "",
          payFlowUpdateDtTm: "",
          noticeObj: "",
          noticeType: "",
          payFlowStatus: "",
          billLimitType: "",
          billPayAmt: "",
          cashPayAmt: "",
          cashPayAcctName: "",
          cashPayAcctNo: "",
          cashPayBankNo: "",
          drweEnterpriseName: "",
          drweEnterpriseSocCode: "",
          drweAcctNo: "",
          drweBankNo: "",
          drweBranchName: "",
          pyeeEnterpriseName: "",
          pyeeEnterpriseSocCode: "",
          pyeeAcctNo: "",
          pyeeBankNo: "",
          pyeeBranchName: "",
          remark: "",
        },
        queryFormItem: {
          payInfoId: "",
        },
        dictMap: new Map(),
        payFlowUpdateDtTm: "",
        columns: this.simpleBillInfoColumns,
        simpleBillInfoColumns: [
          {
            type: 'selection',
            width: 50,
            hiddenCol: false,
            align: 'center'
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
            title: this.$t("m.i.billInfo.billPackageNo"),
            key: "billNo",
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t("m.i.billInfo.billRange"),
            align: 'center',
            key: "billRange",
            hiddenCol: false,
            // render: (h, params) => {
            //   let billOrigin = params.row.billOrigin;
            //   let billRangeStart = params.row.billRangeStart;
            //   let billRangeEnd = params.row.billRangeEnd;
            //   return h("span", formatBillRange(billOrigin, billRangeStart, billRangeEnd))
            // }
          },
          {
            title: this.$t("m.i.billInfo.billPackageMoney"),
            key: "billMoney",
            hiddenCol: false,
            sortable: true,
            align: 'right',
            render: (h, params) => {
              return h("span", formatNumber(params.row.billMoney, 2, ","));
            }
          },
          {
            title: this.$t("m.i.billInfo.stdAmt"),
            key: "stdAmt",
            hiddenCol: false,
            sortable: true,
            align: 'right',
            render: (h, params) => {
              return h("span", formatNumber(params.row.stdAmt, 2, ","));
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
            title: this.$t("m.i.common.dealPrcMsg"),
            key: "dealPrcMsg",
            hiddenCol: false,
          },
        ],
        fullBillInfoColumns: [
          {
            type: "index",
            key: "numOrder",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.billPackageNo"),
            key: "billNo",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.payStatus === "PS06" || params.row.payStatus === "PS07" ||
                params.row.payStatus === "PS67" || params.row.payStatus === "PS01" ||
                params.row.payStatus === "PS02" || params.row.payStatus === "PS62" ||
                params.row.payStatus === "PS04" || params.row.payStatus === "PS64" ||
                params.row.payStatus === "PS05" || params.row.payStatus === "PS65" ||
                params.row.payStatus === "PS03" || params.row.payStatus === "PS08" ||
                params.row.payStatus === "PS68") {
                return h('a', {
                  on: {
                    click: () => {
                      this.billInfoWinOpen(params.row.id)
                    }
                  }
                }, params.row.billNo)
              }
              return h('span', params.row.billNo);
            }
          },
          {
            title: this.$t("m.i.billInfo.billRange"),
            align: 'center',
            key: "billRange",
            hiddenCol: false,
            // render: (h, params) => {
            //   let billOrigin = params.row.billOrigin;
            //   let billRangeStart = params.row.billRangeStart;
            //   let billRangeEnd = params.row.billRangeEnd;
            //   return h("span", formatBillRange(billOrigin, billRangeStart, billRangeEnd))
            // }
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, 'DraftTypeCode', params.row.billType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.billInfo.billPackageMoney"),
            key: "billMoney",
            hiddenCol: false,
            sortable: true,
            align: 'right',
            render: (h, params) => {
              return h("span", formatNumber(params.row.billMoney, 2, ","));
            }
          },
          {
            title: this.$t("m.i.billInfo.stdAmt"),
            key: "stdAmt",
            hiddenCol: false,
            sortable: true,
            align: 'right',
            render: (h, params) => {
              return h("span", formatNumber(params.row.stdAmt, 2, ","));
            }
          },
          {
            title: this.$t('m.i.billInfo.remitDt'),
            key: "remitDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let remitDt = params.row.remitDt == null ? "" : this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", remitDt);
            }
          },
          {
            title: this.$t('m.i.billInfo.dueDt'),
            key: "dueDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let remitDt = params.row.dueDt == null ? "" : this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", remitDt);
            }
          },
          {
            title: this.$t("m.i.billInfo.drwrName"),
            key: "drwrName",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.drwrBankNo"),
            key: "drwrBankNo",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.pyeeName"),
            key: "pyeeName",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.pyeeBankName"),
            key: "pyeeBankName",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.acptName"),
            key: "acptName",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.acptBankNo"),
            key: "acptBankNo",
            hiddenCol: false,
          },
        ],
        pymnIdStsCodeList: [],
        dftTypeCodeList: [],
        noticeObjCodeList: [],
        noticeTypeCodeList: [],
        editBillWin: false,
        showBillInfoWin: false,
        payInfoId: "",
        billId: "",
      }
    },
    props: {
      paymentFlowDetailWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      param: {
        payInfoId: "",
        queryUrl: "/pay/order/orderInfoMain/func_queryOrderPayInfoDtoById",
      },
      showBill: {
        type: Boolean,
        default() {
          return false;
        }
      },
      isView: {
        type: Boolean,
        default() {
          return false;
        }
      },
      showFullBillInfo: {
        type: Boolean,
        default() {
          return false;
        }
      },
    },
    computed: {
      tempPaymentFlowDetailWin: {
        get() {
          return this.paymentFlowDetailWin;
        },
        set() {
        }
      }
    },
    watch: {
      paymentFlowDetailWin(val) {
        if (val === true) {
          this.queryFormItem.payInfoId = this.param.payInfoId;
          this.columns = this.showFullBillInfo ? this.fullBillInfoColumns : this.simpleBillInfoColumns
          this.initFormItem();
        }
      },
    },
    mounted() {
      this.getDictListByGroups("PymnIdStsCode,DftTypeCode,BillPayStatus,DraftTypeCode,TrgtCode,OrdrNtfyMaCode").then(res => {
        this.pymnIdStsCodeList = res.get("PymnIdStsCode");
        this.dftTypeCodeList = res.get("DftTypeCode");
        this.noticeObjCodeList = res.get("TrgtCode");
        this.noticeTypeCodeList = res.get("OrdrNtfyMaCode")
        this.dictMap = res.get("map");
      });
    },
    methods: {
      handleSearchBill() {
        if (this.showBill) {
          this.$refs.billDatagrid.dataChange(1);
        }
      },
      handleClose() {
        this.$refs.formItem.resetFields();
        this.$emit("paymentFlowDetailWinClose", "");
      },
      initFormItem() {
        let params = {id: this.param.payInfoId};
        let url = this.param.queryUrl;
        post(params, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.formItem = res.data.retData;
              //清空时间
              this.payFlowUpdateDtTm = ""
              if (this.formItem.payFlowUpdateDtTm) {
                this.payFlowUpdateDtTm = this.$moment(this.formItem.payFlowUpdateDtTm, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
              }
              this.handleSearchBill();
            } else {
              this.$msgTip.error(this, {info: res.data.retMsg});
            }
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
          }
        });
      },
      addBill() {
        this.payInfoId = this.param.payInfoId;
        this.editBillWin = true;
      },
      editBillWinClose() {
        this.$refs.billDatagrid.dataChange(1);
        this.editBillWin = false;
      },
      unLockBill(type) {
        let ids = this.$refs.billDatagrid.selectIds;
        if (ids.length === 0) {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseAtLeastOneRecord")});
          return;
        }
        this.$hMsgBox.confirm({
          title: this.$t('s.i.pay.unLockBill'),
          content: this.$t("m.i.common.confirm") + "?",
          onOk: () => {
            this.unLockBillFunc(type, ids);
          }
        });
      },
      unLockBillFunc(type, ids) {
        let url = "/pay/payment/billPaymentMain/func_lockUnLockBillFromPage";
        let obj = {
          id: this.param.payInfoId,
          idList: ids,
          paymentOptionType: type,
          sendBrchType: "TG01",
          memberId: this.$store.getters.userInfo.memberId,
          branchCode: this.$store.getters.userInfo.cepsBrchCode,
        }
        post(obj, url).then(res => {
          if (res) {
            let retCode = res.data.retCode
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.handleSearchBill();
            } else {
              this.$msgTip.error(this, {info: res.data.retMsg});
            }
          } else {
            this.$msgTip.error(this, {info: this.$t('m.i.common.netError')});
          }
        });
      },
      billInfoWinClose() {
        this.billId = null;
        this.showBillInfoWin = false;
      },
      billInfoWinOpen(billId) {
        this.billId = billId;
        this.showBillInfoWin = true;
      },
    }
  }
</script>

<style scoped>

</style>
