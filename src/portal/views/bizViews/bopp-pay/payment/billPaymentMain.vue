<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper" v-if="mainVue">
      <!--右侧数据展示表格-->
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <common-input v-model="formItem.payFlowNo" :label="$t('s.i.pay.payFlowNo')"
                              prop="payFlowNo" :maxlength="20"></common-input>
                <common-select v-model="formItem.payFlowStatus" :dictList="this.pymnIdStsCodeList"
                               :label="$t('s.i.pay.payFlowStatus')" prop="payFlowStatus"></common-select>
                <query-btn :formSearch="handleSearch" :advanceShow="false"
                           :formSearchReset="resetSearch"></query-btn>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            highlightRow
            url="/pay/payment/billPaymentMain/func_queryPaymentInfoByPage"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="billInfo()">{{$t("s.i.pay.billInfo")}}</h-button>
<!--              <h-button type="primary" @click="toCppay()">收银台</h-button>-->
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
<!--    <Cppay :cppayVue="cppayVue" :cppayParams="cppayParams" @backToMain="backToMain"></Cppay>-->
    <payment-flow-detail :paymentFlowDetailWin="paymentFlowDetailWin" @paymentFlowDetailWinClose="paymentFlowDetailWinClose" :param="param" :showBill="true"></payment-flow-detail>
  </div>
</template>

<script>
import {formatNumber,getDictValueFromMap} from "@/api/bizApi/commonUtil";

export default {
  name: "billPaymentMain",
  data() {
    return {
      formItem: {
        legalNo: "",
        payFlowNo: "",
        payFlowStatus: "",
      },
      param: {
        queryUrl: "",
        payInfoId: "",
        },
        cppayParams: {},
        dictMap: new Map(),
        columns:[
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
              return h("p", formatNumber(params.row.billPayAmt, 2, ","));
            }
          },
        ],
        pymnIdStsCodeList: [],
        paymentFlowDetailWin: false,
        mainVue: true,
        cppayVue: false,
        queryUrl: "/pay/payment/billPaymentMain/func_queryOrderPayInfoDtoById",
      }
    },
    components: {
      Cppay: () => import(/* webpackChunkName: "bopp-pay/cashier/cppay" */`@/views/bizViews/bopp-pay/cashier/cppay`),
      PaymentFlowDetail: () => import(/* webpackChunkName: "bopp-pay/common/paymentFlowDetail" */`@/views/bizViews/bopp-pay/common/paymentFlowDetail`)
    },
    mounted() {
      this.getDictListByGroups("PymnIdStsCode,DftTypeCode").then(res => {
        this.pymnIdStsCodeList = res.get("PymnIdStsCode")
        this.dictMap = res.get("map");
      });
    },
    methods: {
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
      billInfo(){
        if(this.currentSelectRow){
          this.param.queryUrl = this.queryUrl;
          this.param.payInfoId = this.currentSelectRow.id;
          this.paymentFlowDetailWin = true;
        }else{
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseDataFirst")});
        }
      },
      paymentFlowDetailWinClose(){
        this.paymentFlowDetailWin = false;
      },
      toCppay(){
        if (this.currentSelectRow) {
          this.cppayParams.payInfoId = this.currentSelectRow.id;
          this.mainVue = false;
          this.cppayVue = true;
        } else {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseDataFirst")});
        }
      },
      backToMain(){
        this.mainVue = true;
        this.cppayVue = false;
      }
    },
  created() {
    this.formItem.legalNo = this.$store.getters.userInfo.legalNo
  }
}
</script>

<style scoped>

</style>
