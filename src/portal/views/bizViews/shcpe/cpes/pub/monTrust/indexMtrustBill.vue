<!--托管票据信息查询应答 -->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="h-form-search-box clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form ref="formItem" :model="formItem" :label-width="90" class="h-form-search" cols="4">
                <div class="h-search-form-row">
                  <h-form-item :label="$t('m.i.billInfo.billPackageNo')" prop="billNoLike">
                    <h-input v-model="formItem.billNoLike" placeholder="" :maxlength="30"></h-input>
                  </h-form-item>
                  <bill-range :formItem="formItem" :rangeProps="['minBillRangeStart','maxBillRangeEnd']"></bill-range>
                  <h-form-item :label="$t('m.i.billInfo.billPackageMoney')" class="h-form-long-label">
                    <h-row>
                      <h-col span="11">
                        <h-typefield v-model="formItem.minBillMoney" integerNum="10" placeholder="" type="money"
                                     bigTips></h-typefield>
                      </h-col>
                      <h-col span="2" style="text-align: center">至</h-col>
                      <h-col span="11">
                        <h-typefield v-model="formItem.maxBillMoney" integerNum="10" placeholder="" type="money"
                                     bigTips></h-typefield>
                      </h-col>
                    </h-row>
                  </h-form-item>
                  <h-form-item class="h-form-operate">
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
            url="/shcpe/cpes/pub/draftdayend/indexMtrustBill/func_queryMtrustStatement"
            :bindForm="formItem"
            :onRowClick="handlelRowClick"
            :notSetWidth="true"
            :onSelectChange="handleSelectClick"
            ref="datagrid">
            <div slot="toolbar" class='pull-left'>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId" :billNo="this.billNo"
                    :billRangeStart="this.billRangeStart" :billRangeEnd="this.billRangeEnd"></bill-info-main>
  </div>
</template>

<script>
  import { post, on, off,formatNumber,formatBillRange} from "@/api/bizApi/commonUtil";

  export default {
    name: "indexMtrustBill",
    components: {},
    data() {
      return {
        billId : "",
        billNo : "",
        billRangeStart : "",
        billRangeEnd : "",
        showBillInfoWin : false,
        formItem: {
          billNoLike: "",
          minBillRangeStart: "",
          maxBillRangeEnd: "",
          minBillMoney: "",
          maxBillMoney: ""
        },
        type: null,
        setRoleRole: false,
        setRoleRight: false,
        setRoleAllotRight: false,
        copyWin: false,
        readonly: false,
        isRequired: true,
        columns: [
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            align: "center",
            width: 60,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.brchCode'),
            key: "brchCode",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.brchName'),
            key: "brchName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.acptBrchCode'),
            key: "acptBrchCode",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.acptBrchName'),
            key: "acptBrchName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.shcpe.compareBrchType'),
            key: "compareBrchType",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "CompareBrchType", params.row.compareBrchType);
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
            render: (h, params) => {
                return h("a", {
                    on: {
                        click: () => {
                            this.showBillInfo(params.row.billId,params.row.billNo,params.row.billRangeStart,params.row.billRangeEnd);
                        }
                    }
                }, params.row.billNo);
            }
          },
          {
            title: this.$t("m.i.billInfo.billRange"),
            key:"billRange",
            hiddenCol: false,
            render: (h, params) => {
              return h("span", formatBillRange(params.row.billOrigin,params.row.billRangeStart,params.row.billRangeEnd));
            }
          },
          {
            title: this.$t('m.i.billInfo.billPackageMoney'),
            key: "billMoney",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("span", formatNumber(params.row.billMoney, 2, ","));
            }
          },
          {
            title: this.$t('m.i.common.checkDt'),
            key: "checkDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.checkDt == null ? "" : this.$moment(params.row.checkDt, "YYYY-MM-DD").format("YYYY-MM-DD");
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
            title: this.$t('m.i.billInfo.cpesBillStatus'),
            key: "billStatus",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "CpesBillStatus", params.row.billStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.shcpe.cirStatus'),
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
            title: this.$t('m.i.common.remark'),
            key: "trstRemark",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.createTime'),
            key: "createTime",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.createTime == null ? "" : this.$moment(params.row.createTime, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.common.updateTime"),
            key: "updateTime",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.updateTime == null ? "" : this.$moment(params.row.updateTime, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          }
        ],
        histData: {
          rows: [],
          total: 1
        },
        traderData: {
          rows: [],
          total: 1
        },
        userTraderWin: false,
        showDefaultTeller: false,
        branchDto: {},
        currentSelectRow: [],
        traderSelectRow: [],
        currentSelectList: [],
        currentSelectRowInx: [],
        tempInx: 0,
        pageInfo: {
          pageNo: 1,
          pageSize: 10
        },
        brchRoleDistributeWin: false,
        userHistWin: false,
        defaultTraderNo: null,
        showBranchMenuWin: false,
        tableRef: "selfTable",
        submitCopyRoleDisabled: false,

        numberRule: ["num"],
        deletDisabled: false,
        kindTree: [],
        submitFlag: false,
        ifShowMore: false,
        schemeIdList: [],
        dictMap: new Map()
      };
    },
    watch: {},

    computed: {},
    methods: {
      //查询按钮点击事件
      handleSearch() {
        let min = Number(this.formItem.minBillMoney);
        let max = Number(this.formItem.maxBillMoney);
        if (min != 0 && max != 0) {
          if (min > max) {
            this.$msgTip.error(this, { info: this.$t("m.i.shcpe.minNotLargerThanMax") });
          } else {
            this.$refs.datagrid.dataChange(1);
          }
        } else {
          this.$refs.datagrid.dataChange(1);
        }
      },
      handleReset() {
        this.formItem.minBillMoney = "";
        this.formItem.maxBillMoney = "";
        this.$refs.formItem.resetFields();
      },
      showBillInfo(billId, billNo,billRangeStart,billRangeEnd) {
          this.billId = billId;
          this.billNo = billNo;
          this.billRangeStart = billRangeStart;
          this.billRangeEnd = billRangeEnd;
          this.showBillInfoWin = true;
      },
      billInfoWinClose() {
          this.showBillInfoWin = false;
      },
      handlelRowClick(arr) {
        this.currentSelectRow = arr;
      },
      handleSelectClick(selectInx) {
        this.currentSelectRowInx = selectInx;
      }
    },

    mounted() {
      this.getDictListByGroups("CpesBillStatus,RiskStatus,CompareBrchType,BillCirStatusCode").then(res => {
        this.dictMap = res.get("map");
      });
    }

  };
</script>

<style scoped>

</style>
