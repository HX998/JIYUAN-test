<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <!--右侧数据展示表格-->
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <common-input v-model="formItem.payFlowNo" :label="$t('s.i.pay.payFlowNo')"
                              prop="payFlowNo" :maxlength="20"></common-input>
                <common-select v-model="formItem.payFlowStatus" :dictList="this.pymnIdStsCodeList"
                               :label="$t('s.i.pay.payFlowStatus')" prop="payFlowStatus"></common-select>
                <common-type-field-range className="h-form-long-label" v-model="formItem"
                                         :label="$t('s.i.pay.payOrderAmt')" :integerNum="16" :suffixNum="2"
                                         :rangeProps="['minPayOrderAmt','maxPayOrderAmt']"
                                         :bigTips="false"></common-type-field-range>
                <common-input v-model="formItem.payOrderNo" :label="$t('s.i.pay.payOrderNo')"
                              prop="payOrderNo"></common-input>
                <common-input v-model="formItem.platformName" :label="$t('s.i.pay.platformName')"
                              prop="platformName"></common-input>
                <common-select v-model="formItem.billLimitType" :label="$t('s.i.pay.billLimitType')"
                               prop="billLimitType" :dictList="this.dftTypeCodeList"></common-select>
<!--                <common-select v-model="formItem.applStatus" :label="$t('s.i.pay.applStatus')"-->
<!--                               prop="applStatus" :dictList="this.applStatusList"></common-select>-->
                <query-btn @showChange="showChange" :formSearch="handleSearch"
                           :formSearchReset="resetSearch"></query-btn>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            highlightRow
            url="/pay/payment/paymentFlowInfoMain/func_queryOrderPayInfoDtoByPage"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <bopp-show-payment-flow ref="showPaymentFlow" @showPaymentFlowInfo="showPaymentFlowInfo"
                                 :isView="true" :showFullBillInfo="true" :showBill="true"></bopp-show-payment-flow>
              <h-button type="primary" @click="syncPaymentFlowInfo()">{{$t("s.i.pay.syncPaymentFlowInfo")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
  </div>
</template>

<script>
import {formatNumber, getDictValueFromMap, post} from "@/api/bizApi/commonUtil";

export default {
  name: "paymentFlowInfoMain",
  data() {
    return {
      formItem: {
        legalNo: "",
        payFlowNo: "",
        payFlowStatus: "",
        minPayOrderAmt: "",
        maxPayOrderAmt: "",
        payOrderNo: "",
        platformNo: "",
          platformName: "",
          billLimitType: "",
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
            title: this.$t("s.i.pay.platformName"),
            key: "platformName",
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t("s.i.pay.payOrderNo"),
            key: "payOrderNo",
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t("s.i.pay.payOrderDesc"),
            key: "payOrderDesc",
            hiddenCol: false,
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
          {
            title: this.$t("s.i.pay.payFlowNo"),
            key: "payFlowNo",
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t("s.i.pay.billLimitType"),
            key: "billLimitType",
            hiddenCol: false,
            sortable: true,
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
            title: this.$t("s.i.pay.applStatus"),
            key: "applStatus",
            hiddenCol: false,
            sortable: true,
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
      pymnIdStsCodeList: [],
      dftTypeCodeList: [],
      updtTpCodeList: [],
      applStatusList: [],
      dictMap: new Map(),
      ifShowMore: false,
      queryUrl: "/pay/payment/paymentFlowInfoMain/func_queryOrderPayInfoDtoById",
    }
    },
    mounted() {
      this.getDictListByGroups("PayApplyStatus,PymnIdStsCode,DftTypeCode,UpdtTpCode,PayApplyStatus").then(res => {
        this.pymnIdStsCodeList = res.get("PymnIdStsCode");
        this.dftTypeCodeList = res.get("DftTypeCode");
        this.updtTpCodeList = res.get("UpdtTpCode");
        this.applStatusList = res.get("PayApplyStatus");
        for (let i = 0; i < this.applStatusList.length; i++) {
          if (this.applStatusList[i].key === "PA01") {
            this.applStatusList.splice(i, 1); // 将使后面的元素依次前移，数组长度减1
            i--; // 如果不减，将漏掉一个元素
          }
        }
        this.dictMap = res.get("map");
        this.dictMap.pymnIdStsCodeList = this.pymnIdStsCodeList;
        this.dictMap.dftTypeCodeList = this.dftTypeCodeList;
        this.dictMap.updtTpCodeList = this.updtTpCodeList;
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
      showPaymentFlowInfo() {
        if (this.currentSelectRow) {
          this.$refs.showPaymentFlow.openWindow(this.currentSelectRow.id, this.queryUrl);
        } else {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseDataFirst")});
        }
      },
      syncPaymentFlowInfo() {
        if (this.currentSelectRow) {
          this.$hMsgBox.confirm({
            title: this.$t('s.i.pay.syncPaymentFlowInfo'),
            content: this.$t("m.i.common.confirm") + "?",
            onOk: () => {
              this.syncPaymentFlowInfoFunc();
            }
          });
        } else {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
        }
      },
      syncPaymentFlowInfoFunc() {
        let url = "/pay/payment/paymentFlowInfoMain/func_syncPaymentFlowInfo";
        let obj = {
          id: this.currentSelectRow.id,
          memberId: this.$store.getters.userInfo.memberId,
          branchCode: this.$store.getters.userInfo.cepsBrchCode,
        }
        post(obj, url).then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$msgTip.info(this, {info: "作为" + msg + "同步流水申请发送成功"});
            } else {
              this.$msgTip.error(this, {info: msg});
            }
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
          }
        });
      }
    }
  }
</script>

<style scoped>

</style>
