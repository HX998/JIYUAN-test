<!-- 减值管理-减值记账 -->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <show-branch v-model="formItem.brchNos" :label="$t('m.i.common.brchName')" prop="brchNos"

                             title="机构名称" :brchNo.sync="formItem.brchNos" :brchName.sync="formItem.branchName">
                </show-branch>
                <common-select v-model="formItem.prodNo" prop="prodNo" :dictList="prodNoList"
                               :label="$t('m.i.common.prodName')"></common-select>
                <common-date-picker v-model="operDt" :label="$t('m.i.bm.valuateOperDt')"
                                    type="daterange" :rangeValue="['minOperDt','maxOperDt']"
                                    :minOperDt.sync="formItem.minOperDt" :maxOperDt.sync="formItem.maxOperDt">
                </common-date-picker>
                <query-btn :advanceShow="false" :formSearch="handleSearch" :formSearchReset="resetSearch"></query-btn>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid :columns="columns"
                      url="/bm/valuate/deductValuate/func_queryDeductValuateWaitAcctPage"
                      :bindForm="formItem"
                      :row-select="true"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="deductValuateAccount">{{$t("m.i.ce.account")}}</h-button>
              <h-button type="primary" @click="deductValuateAccountBack">{{$t("m.i.ce.accountBack")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!-- 分录弹框 -->
    <acct-record :showAcctRecordWin="showAcctRecordWin" :param="acctRecordParam" url="/bm/valuate/deductValuate/func_generateAcctRecord"
                 :submitFlag="acctSubmitFlag" :showPrintButton="showPrintButton"
                 @acctSubmitSure="acctSubmitSure" @showAcctRecordWinClose="showAcctRecordWinClose"
                 @printSuccessCallback="printSuccessCallback" ref="showAcctRecord"></acct-record>
  </div>
</template>

<script>
  import {post, formatNumber, formatTime} from "@/api/bizApi/commonUtil";

  export default {
    name: "deductValuateAccount",
    data() {
      return {
        ifShowMore: false,
        formItem: {
          brchNos:"",
          brchNo: "",
          branchName: "",
          prodNo: "",
          minOperDt: "",
          maxOperDt: ""
        },
        operDt: [],
        columns: [
          {
            type: "selection",
            key: "multiSelect",
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
            title: this.$t("m.i.common.brchNo"),
            key: "brchNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.brchName"),
            key: "brchName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.prodName"),
            key: "prodNo",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "DeductProduct", params.row.prodNo);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.bm.currentDeductBalanceAmt"),
            key: "currentDeductBalanceAmt",
            hiddenCol: false,
            render: (h, params) => {
              let amt = formatNumber(params.row.currentDeductBalanceAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: amt
                }
              }, amt);
            }
          },
          {
            title: this.$t("m.i.bm.previousDeductDiffAmt"),
            key: "previousDeductDiffAmt",
            hiddenCol: false,
            render: (h, params) => {
              let amt = formatNumber(params.row.previousDeductDiffAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: amt
                }
              }, amt);
            }
          },
          {
            title: this.$t("m.i.bm.valuateOperTm"),
            key: "operDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let operDt = params.row.operDt ? this.$moment(params.row.operDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "";
              let operTm = formatTime(this, params.row.operTm);
              return h("span", operDt + " " + operTm);
            }
          },
          {
            title: this.$t("m.i.bm.valuateCreateTellerName"),
            key: "createTellerName",
            hiddenCol: false
          }
        ],
        dictMap: new Map(),
        prodNoList: [],
        showAcctRecordWin:false,
        acctRecordParam: {},
        acctSubmitFlag:false,
        showPrintButton:false
      }
    },
    methods: {
      handleSearch(pageNo) {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.dataChange(pageNo ? pageNo : 1);
      },
      resetSearch() {
        this.$refs.formItem.resetFields();
        this.formItem.minOperDt = "";
        this.formItem.maxOperDt = "";
        this.operDt = [];
      },
      deductValuateAccount() {
        if (this.$refs.datagrid.selects.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        this.acctRecordParam = { ids: this.$refs.datagrid.selectIds };
        this.showAcctRecordWin = true;
      },
      acctSubmitSure(info) {
        this.acctSubmitFlag = true;
        post({ ids: this.$refs.datagrid.selectIds }, "/bm/valuate/deductValuate/func_deductValuateAcct").then(res => {
          this.acctSubmitFlag = false;
          if (res) {
            if (res.data.retCode === "000000") {
              this.showPrintButton = true;
              if (!info.isHasPrint) {
                this.showAcctRecordWinClose();
              }
              this.$msgTip.success(this, { info: "操作成功" });
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      showAcctRecordWinClose() {
        this.showPrintButton = false;
        this.showAcctRecordWin = false;
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.dataChange(1);
      },
      printSuccessCallback() {
        this.showAcctRecordWinClose();
      },
      deductValuateAccountBack() {
        if (this.$refs.datagrid.selects.length === 0) {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseDataFirst")});
          return;
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定记账退回吗?",
          onOk: () => {
            this.handleAccountBack();
          }
        });
      },
      handleAccountBack() {
        post({ids: this.$refs.datagrid.selectIds}, "/bm/valuate/deductValuate/func_backValuateAcct").then(res => {
          if (res) {
            if (res.data.retCode === "000000") {
              this.$msgTip.success(this);
              this.handleSearch();
            } else {
              this.$msgTip.error(this, {info: res.data.retMsg});
            }
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
          }
        });
      },
    },

    mounted() {
      this.getDictListByGroups("DeductProduct").then(res => {
        this.prodNoList = res.get("DeductProduct");
        this.dictMap = res.get("map");
      });
    }
  }
</script>

<style scoped>

</style>
