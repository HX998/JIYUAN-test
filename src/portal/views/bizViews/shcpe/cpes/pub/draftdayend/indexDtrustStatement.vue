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
                  <h-form-item :label="$t('m.i.common.brchCode')" prop="brchCode">
                    <h-input v-model="formItem.brchCode"></h-input>
                  </h-form-item>
                  <h-form-item label="核对日期" prop="checkDt">
                    <h-date-picker type="date" v-model="formItem.checkDt" format="yyyy-MM-dd" showFormat
                                   placeholder=""></h-date-picker>
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
            url="/shcpe/cpes/pub/draftdayend/indexDtrustStatement/func_queryDtrustStatement"
            :bindForm="formItem"
            :onRowClick="handlelRowClick"
            :onSelectChange="handleSelectClick"
            :notSetWidth="true"
            ref="datagrid">
            <div slot="toolbar" class='pull-left'>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
  </div>
</template>

<script>
  import {  post, on, off,formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "indexDtrustStatement",
    components: {},
    data() {
      return {
        formItem: {
          brchCode: "",
          checkDt: ""
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
            title: this.$t('m.i.common.memberId'),
            key: "memberId",
            hiddenCol: false
          },
          {
            title: "核对日期",
            key: "checkDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.checkDt == null ? "" : this.$moment(params.row.checkDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
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
            title: this.$t("m.i.shcpe.trstAccountType"),
            key: "trstAccountType",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "AmountType", params.row.trstAccountType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.shcpe.beginBalanceAmt"),
            key: "beginBalanceAmt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("span", formatNumber(params.row.beginBalanceAmt, 2, ","));
            }
          },
          {
            title: this.$t("m.i.shcpe.drChangeAmt"),
            key: "drChangeAmt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("span", formatNumber(params.row.drChangeAmt, 2, ","));
            }
          },
          {
            title: this.$t("m.i.shcpe.crChangeAmt"),
            key: "crChangeAmt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("span", formatNumber(params.row.crChangeAmt, 2, ","));
            }
          },
          {
            title: this.$t("m.i.shcpe.endBalanceAmt"),
            key: "endBalanceAmt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("span", formatNumber(params.row.endBalanceAmt, 2, ","));
            }
          },
          {
            title: this.$t('m.i.common.remark'),
            key: "trstRemark",
            hiddenCol: false
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
        if (this.formItem.checkDt != null && this.formItem.checkDt != "") {
          this.formItem.checkDt = this.formItem.checkDt.replace(/-/g, "");
        }
        this.$refs.datagrid.dataChange(1);
      },
      handleReset() {
        this.$refs.formItem.resetFields();
      },
      handlelRowClick(arr) {
        this.currentSelectRow = arr;
      },
      handleSelectClick(selectInx) {
        this.currentSelectRowInx = selectInx;
      },
      formatterisTrstAccountType(value) {
        if (value != null && value != "") {

          switch (value.substring(0,1)) {
            case '1':
              return '托管账户';
            case '2':
              return '质权账户';
          }
        } else {
          return "";
        }
      }

    },

    mounted() {
      this.getDictListByGroups("AmountType").then(res => {
        this.dictMap = res.get("map");
      });
    }

  };
</script>

<style scoped>

</style>
