<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <common-input v-model="formItem.platformName" :label="$t('s.i.pay.platformName')"
                              prop="platformName" :maxlength="60"></common-input>
                <common-input v-model="formItem.payOrderNo" :label="$t('s.i.pay.payOrderNo')"
                              prop="payOrderNo" :maxlength="35"></common-input>
                <common-input v-model="formItem.payFlowNo" :label="$t('s.i.pay.payFlowNo')"
                              prop="payFlowNo" :maxlength="20"></common-input>
                <common-input v-model="formItem.drweEnterpriseNameLike" :label="$t('s.i.pay.drweEnterpriseName')"
                              prop="drweEnterpriseNameLike" :maxlength="60" className="h-form-long-label"></common-input>
                <common-input v-model="formItem.pyeeEnterpriseNameLike" :label="$t('s.i.pay.pyeeEnterpriseName')"
                              prop="pyeeEnterpriseNameLike" :maxlength="60" className="h-form-long-label"></common-input>
                <common-select v-model="formItem.billLimitType" :label="$t('s.i.pay.billLimitType')"
                               prop="billLimitType" :dictList="this.dftTypeCodeList"></common-select>
                <common-date-picker v-model="formItem.payFlowDtRang" :label="$t('s.i.pay.createTime')"
                                    prop="payFlowDtRang" type="daterange"
                                    :rangeValue="['minPayFlowDt','maxPayFlowDt']"
                                    :minPayFlowDt.sync="formItem.minPayFlowDt"
                                    :maxPayFlowDt.sync="formItem.maxPayFlowDt"
                                    @on-change="handlePayFlowDtChange"></common-date-picker>
                <common-type-field-range className="h-form-long-label" v-model="formItem"
                                         :label="$t('s.i.pay.payOrderAmt')" :integerNum="16" :suffixNum="2"
                                         :rangeProps="['minPayOrderAmt','maxPayOrderAmt']"
                                         :bigTips="false"></common-type-field-range>
                <query-btn @showChange="showChange" :formSearch="handleSearch"
                           :formSearchReset="resetSearch"></query-btn>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="showColumns"
            url="/pe/busiqry/payFlowOccurQuery/payFlowOccurQuery"
            :bindForm="formItem"
            hasPage
            highlightRow
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="showBillList()">{{$t("s.i.pay.showBillList")}}
              </h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <bill-list-query :billListWin="billListWin" :dictMap="dictMap" @billListWinClose="billListWinClose" :param="param"></bill-list-query>
  </div>
</template>

<script>
  import {formatNumber, getDictValueFromMap} from "@/api/bizApi/commonUtil";

  export default {
    name: "payFlowOccurQuery",
    components: {
      BillListQuery: () => import(/* webpackChunkName: "bopp-pe/busiqry/billListQuery" */`@/views/bizViews/bopp-pe/busiqry/billListQuery`)
    },
    data() {
      return {
        formItem: {
          legalNo: "",
          platformName: "",
          payOrderNo: "",
          payFlowNo: "",
          drweEnterpriseNameLike: "",
          pyeeEnterpriseNameLike: "",
          billLimitType: "",
          payFlowDtRang: [],
          minPayFlowDt: "",
          maxPayFlowDt: "",
          minPayOrderAmt: "",
          maxPayOrderAmt: "",
        },
        currentSelectRow: null,
        dftTypeCodeList: [],
        showColumns: [
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
          },
          {
            title: this.$t("s.i.pay.payOrderNo"),
            key: "payOrderNo",
            hiddenCol: false,
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
            render: (h, params) => {
              return h("p", formatNumber(params.row.payOrderAmt, 2, ","));
            }
          },
          {
            title: this.$t("s.i.pay.payFlowNo"),
            key: "payFlowNo",
            hiddenCol: false,
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
            title: this.$t('s.i.pay.createTime'),
            key: "payFlowDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let payFlowDt = params.row.payFlowDt == null ? "" : this.$moment(params.row.payFlowDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", payFlowDt);
            }
          },
        ],
        dictMap: new Map(),
        ifShowMore: false,
        billListWin: false,
        param: {
          payInfoId: ''
        }
      }
    },
    mounted() {
      this.getDictListByGroups("DftTypeCode,DraftTypeCode").then(res => {
        this.dftTypeCodeList = res.get("DftTypeCode");
        this.dictMap = res.get("map");
      });
    },
    created() {
      this.formItem.legalNo = this.$store.getters.userInfo.legalNo
    },
    methods: {
      handlePayFlowDtChange(arr) {
        if (arr && arr.length === 2) {
          this.formItem.minPayFlowDt = arr[0].replace(/-/g, "");
          this.formItem.maxPayFlowDt = arr[1].replace(/-/g, "");
          this.formItem.payFlowDtRang = [arr[0], arr[1]];
        } else {
          this.formItem.minPayFlowDt = "";
          this.formItem.maxPayFlowDt = "";
          this.formItem.payFlowDtRang = [];
        }
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = null;
      },
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
      billListWinClose(){
        this.billListWin = false;
        this.handleSearch(1);
      },
      showBillList() {
        if(this.currentSelectRow) {
          this.param.payInfoId = this.currentSelectRow.id;
          this.billListWin = true;
        }else {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
        }

      }
    }
  };
</script>

<style scoped>

</style>
