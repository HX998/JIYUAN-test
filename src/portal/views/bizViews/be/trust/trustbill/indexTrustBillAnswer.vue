<!--托管票据信息查询应答 -->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form ref="formItem" :model="formItem" :label-width="90" class="h-form-search" cols="4">
                <div class="h-search-form-row">
                  <h-form-item :label="$t('m.i.billInfo.billOrigin')"  prop="billOrigin">
                    <h-select v-model="formItem.billOrigin" placeholder="">
                      <h-option v-for="item in billOriginList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                    </h-select>
                  </h-form-item>
                  <bill-no :label="$t('m.i.billInfo.billPackageNo')" v-model="formItem.billNoLike" prop="billNoLike"></bill-no>
                  <bill-range :form-item="formItem" :range-props="['minBillRangeStart','maxBillRangeEnd']" ></bill-range>
                  <bill-money :label="$t('m.i.billInfo.billPackageMoney')" :formItem="formItem" class="h-form-long-label"></bill-money>
                  <h-form-item class="h-form-operate">
                    <span class="h-more-input" @click="ifShowMore=!ifShowMore">
                      {{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont" :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                    <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                    <h-button type="ghost" @click="handleReset()">{{$t("m.i.common.reset")}}</h-button>
                  </h-form-item>
                </div>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            highlight-row
            url="/be/trust/trustbill/indexTrustBillAnswer/func_queryTrustBillAnswer"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class='pull-left'>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId" :billNo="this.billNo"></bill-info-main>
  </div>
</template>

<script>
  import { post, on, off, formatNumber, formatBillRange } from "@/api/bizApi/commonUtil";

  export default {
    name: "indexTrustBillAnswer",
    data() {
      return {
          billId : "",
          billNo : "",
          showBillInfoWin : false,
        billOriginList: [],
        formItem: {
          billOrigin: "",
          billNoLike: "",
          minBillRangeStart: "",
          maxBillRangeEnd: "",
          minBillMoney: "",
          maxBillMoney: ""
        },
        columns: [
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            align: "center",
            width: 60,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.billOrigin"),
            key: "billOrigin",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "BillOrigin", params.row.billOrigin);
              if ('CS00'===list){
                list='';
              }
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.billInfo.billPackageNo'),
            key: "billNo",
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t("m.i.billInfo.billRange"),
            key:"billRange",
            align: "center",
            hiddenCol: false,
            render:(h,params) => {
              let billOrigin = params.row.billOrigin;
              let billRangeStart = params.row.billRangeStart;
              let billRangeEnd = params.row.billRangeEnd;
              return h("span", formatBillRange(billOrigin, billRangeStart, billRangeEnd))
            }
          },
          {
            title: this.$t('m.i.billInfo.billType'),
            key: "billType",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.billInfo.billPackageMoney'),
            key: "billMoney",
            hiddenCol: false,
            sortable: true,
            align: "right",
            render: (h, params) => {
              return h("span", formatNumber(params.row.billMoney, 2, ","));
            }
          },
          {
            title: this.$t('m.i.billInfo.remitDt'),
            key: "remitDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.remitDt == null ? "" : this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t('m.i.billInfo.dueDt'),
            key: "dueDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.dueDt == null ? "" : this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t('m.i.common.remark'),
            key: "billRemark",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.drwrName'),
            key: "drwrName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.drwrDistType'),
            key: "drwrDistType",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "DistTypeCode", params.row.drwrDistType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.billInfo.drwrAcctNo'),
            key: "drwrAcctNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.drwrBrchNo'),
            key: "drwrBrchCode",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.drwrBrchName'),
            key: "drwrBankName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.drwrSocCode'),
            key: "drwrSocCode",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.acptName'),
            key: "acptName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.acptAcctNo'),
            key: "acptAcctNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.acptBankNo'),
            key: "acptBankNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.acptOpenBrchCode'),
            key: "acptBrchCode",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.acptOpenBrchName'),
            key: "acptBankName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.acptUnifySocCode'),
            key: "acptSocCode",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.pyeeName'),
            key: "pyeeName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.pyeeDistType'),
            key: "pyeeDistType",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "DistTypeCode", params.row.pyeeDistType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.billInfo.pyeeAcctNo'),
            key: "pyeeAcctNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.pyeeBrchNo'),
            key: "pyeeBrchCode",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.pyeeBrchName'),
            key: "pyeeBankName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.payeeSocCode'),
            key: "pyeeSocCode",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.drweBankNo'),
            key: "drweBankNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.discBrchCode'),
            key: "discBrchCode",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.holdBranchCode'),
            key: "hldrBrchCode",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.ecdsBillStatus'),
            key: "billStatus",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "BillStatusCode", params.row.billStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.billInfo.stockStatus'),
            key: "stockStatus",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "BillStockStatus", params.row.stockStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.be.stockBranchCode'),
            key: "stockBrchCode",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.stockBankNo'),
            key: "stockBankNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.stockBankName'),
            key: "stockBankName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.riskStatus'),
            key: "riskStatus",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "RiskStatus", params.row.riskStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.billInfo.banEndrsmtMark'),
            key: "banEndrsmtMark",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "BanEndorsementMarkCode", params.row.banEndrsmtMark);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.billInfo.cirStatus'),
            key: "cirStatus",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "BillCirStatusCode", params.row.cirStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          ],
        currentSelectRow: [],
        ifShowMore: false,
        dictMap: new Map()
      };
    },
    methods: {
      //查询按钮点击事件
      handleSearch() {
        let min = Number(this.formItem.minBillMoney);
        let max = Number(this.formItem.maxBillMoney);
        if (min != 0 && max != 0) {
          if (min > max) {
            this.$msgTip.error(this, { info: "票据(包)金额(元)最小值不能超过最大值" });
          } else {
            this.currentSelectRow = [];
            this.$refs.datagrid.dataChange(1);
          }
        } else {
          this.currentSelectRow = [];
          this.$refs.datagrid.dataChange(1);
        }
      },
      handleReset() {
        this.formItem.minBillMoney = "";
        this.formItem.maxBillMoney = "";
        this.$refs.formItem.resetFields();
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
        showBillInfo(billId, billNo) {
            this.billId = billId;
            this.billNo = billNo;
            this.showBillInfoWin = true;
        },
        billInfoWinClose() {
            this.showBillInfoWin = false;
        },
    },
    mounted() {
      this.getDictListByGroups("DraftTypeCode,RiskStatus,CpesFlowStatus,BillStatus,BillStockStatus,Industry,BillOrigin,DistTypeCode,BillStatusCode,BanEndorsementMarkCode,BillCirStatusCode").then(res => {
        this.billOriginList = res.get("BillOrigin");
        this.dictMap = res.get("map");
      });
    }
  };
</script>

<style scoped>

</style>
