<!--匿名点击授信扣除系数文件查询-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.be.memberName')" prop="transMemberName">
                  <h-input v-model="formItem.transMemberName"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.pe.oppositeBrchName')" prop="transBrchName">
                  <h-input v-model="formItem.transBrchName"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.operDt')" prop="operDt" >
                  <h-date-picker v-model="formItem.operDt" type="date" placeholder=""
                                 :editable=false :showFormat=true @on-change="handleDateChange"></h-date-picker>
                </h-form-item>
                <query-btn :advanceShow="false" @showChange="showChange" :formSearch="handleSearch"
                           :formSearchReset="resetSearch"></query-btn>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid
            :columns="columns"
            highlightRow
            url="/shcpe/cpes/anonycreditdata/queryAnonyCreditDataPage"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">

          </h-datagrid>
        </div>
      </h-col>
    </h-row>

  </div>
</template>

<script>
  import { post, accMul, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "anonyCreditData",
    data() {
      return {
        formItem: {
          transMemberName: "",
          transBrchName: "",
          operDt: window.sessionStorage.getItem("workDate"),
        },
        columns: [
        /*  {
            type: "radio",
            title: " ",
            key: "multiSelect",
            width: 60,
            hiddenCol: false
          },*/
          {
            type: "index",
            key: "numOrder",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.busiType"),
            key: "busiType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "BusiType", params.row.busiType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.be.tradeType"),
            key: "tradeType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "TradeType", params.row.tradeType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.pc.creditType'),
            key: 'creditType',
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "CreParamType", params.row.creditType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.common.memberName"),
            key: "memberName",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.common.brchName"),
            key: "brchName",
            hiddenCol: false,
          },
    /*      {
            title: this.$t("m.i.be.transBrchType"),
            key: "transBrchTypeNames",
            hiddenCol: false,
          },*/
          {
            title: this.$t("m.i.be.memberName"),
            key: "transMemberName",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.pe.oppositeBrchName"),
            key: "transBrchName",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.common.saleAmt"),
            key: "saleAmt",
            hiddenCol: false,
            render: (h, params) => {
              return h("p", formatNumber(params.row.saleAmt, 2, ","));
            }
          },
          {
            title: this.$t("m.i.common.saleUsedAmt"),
            key: "usedSaleAmt",
            hiddenCol: false,
            render: (h, params) => {
              return h("p", formatNumber(params.row.usedSaleAmt, 2, ","));
            }
          },
          {
            title: this.$t("m.i.common.rebuyAmt"),
            key: "rebuyAmt",
            hiddenCol: false,
            render: (h, params) => {
              return h("p", formatNumber(params.row.rebuyAmt, 2, ","));
            }
          },
          {
            title: this.$t("m.i.common.rebuyUsedAmt"),
            key: "usedRebuyAmt",
            hiddenCol: false,
            render: (h, params) => {
              return h("p", formatNumber(params.row.usedRebuyAmt, 2, ","));
            }
          },
          {
            title: this.$t('m.i.common.operDt'),
            key: 'operDt',
            hiddenCol: false,
            render: (h, params) => {
              return h('span', params.row.operDt ? this.$moment(params.row.operDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
            }
          }
        ],
        currentSelectRow: [],
        //是否显示更多查询项
        ifShowMore: false,
        dictMap: new Map(),
      };
    },
    mounted() {
      this.getDictListByGroups("BusiType,CreParamType,TradeType,TenorVarieties").then(res => {
        this.dictMap = res.get("map");
      });
    },
    methods: {
      showChange(val) {
        this.ifShowMore = val;
      },
      //表单查询
      handleSearch(pageNo) {
        this.currentSelectRow = [];
        this.formItem.operDt = this.formItem.operDt.replace(/-/g, "");
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
        this.currentSelectRow = [];
      },
      handleDateChange(value) {
        this.formItem.operDt = value.replace(/-/g, "");
      },
    }
  };
</script>

<style scoped>

</style>
