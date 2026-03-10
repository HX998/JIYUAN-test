<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!-- 查询表单 -->
          <div class="h-form-search-box">
            <h-panel class="h-form-search-box clearfix" >
              <h-form ref="formItem" :model="formItem" :label-width="90" class="h-form-search" cols="4">
                <div class="h-search-form-row">
                  <h-form-item prop="clearNo" :label="$t('m.i.be.clearNo')">
                    <h-input v-model="formItem.clearNo" placeholder="" :maxlength="20" ></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.be.clearDt')" prop="clearDt">
                    <h-date-picker :value="formItem.clearDt" type="daterange" autoPlacement showFormat :editable=false @on-change="handleClearDtChange" placeholder=""></h-date-picker>
                  </h-form-item>
                  <h-form-item class="h-form-operate">
                    <h-button type="primary" @click="handleSearch">{{$t("m.i.common.search")}}</h-button>
                    <h-button type="ghost" @click="resetSearch">{{$t("m.i.common.reset")}}</h-button>
                  </h-form-item>
                </div>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid
            :columns="columns"
            highlight-row
            url="/shcpe/cpes/settle/settleBatchMain/func_querySettleBatch"
            :bindForm="formItem"
            :onCurrentChange="onCurrentChange"
            :onCurrentChangeCancel="onCurrentChangeCancle"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="showDetail()">{{$t("m.i.common.showDetail")}}</h-button>
            </div>
          </h-datagrid>
        </div>

        <settle-batch-detail-show :showSettleBatchDetailWin="showSettleBatchDetailWin" @showSettleBatchDetailWinClose="showSettleBatchDetailWinClose" :batchParams="batchParams" :dictMap="dictMap"  ref="settleBatchDetailShow"></settle-batch-detail-show>

      </h-col>
    </h-row>
  </div>


</template>

<script>
  import { post, on, off, getDictListByGroups, getDictValueFromMap ,formatNumber} from "@/api/bizApi/commonUtil";

  export default {
    name: "settleBatchMain",
    data() {
      return {
        showSettleBatchDetailWin:false,
        formItem: {
          clearNo: "",
          maxClearDt: "",
          minClearDt: "",
          clearDt:[],
        },
        batchParams:{},
        columns: [
          {
            type: "radio",
            title: " ",
            hiddenCol: false,
            align: "center",
            width: 60
          },
          {
            type: "index",
            title: this.$t("m.i.common.index"),
            align: "center",
            hiddenCol: false,
            width: 60
          },
          {
            title: this.$t("m.i.be.clearDt"),
            key: "clearDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.clearDt == null || params.row.clearDt === "") {
                return "";
              }
              let remitDt = this.$moment(params.row.clearDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", remitDt);
            }
          },
          {
            title: this.$t("m.i.be.clearNo"),
            key: "clearNo",
            hiddenCol: false,
            align: "center"
          },
          {
            title: this.$t("m.i.be.clearCct"),
            key: "clearCct",
            hiddenCol: false,
            align: "center"
          },
          {
            title: this.$t("m.i.be.paySumNum"),
            key: "paySumNum",
            hiddenCol: false,
            align: "center"
          },
          {
            title: this.$t("m.i.be.paySuccessNum"),
            key: "paySuccessNum",
            hiddenCol: false,
            align: "center"
          },
          {
            title: this.$t("m.i.be.payFailNum"),
            key: "payFailNum",
            hiddenCol: false,
            align: "center"
          },
          {
            title: this.$t('m.i.be.paySumAmt'),
            key: "paySumAmt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let paySumAmt = formatNumber(params.row.paySumAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: paySumAmt
                }
              }, paySumAmt);
            }
          },
          {
            title: this.$t('m.i.be.paySuccessAmt'),
            key: "paySuccessAmt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let paySuccessAmt = formatNumber(params.row.paySuccessAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: paySuccessAmt
                }
              }, paySuccessAmt);
            }
          },
          {
            title: this.$t('m.i.be.payFailAmt'),
            key: "payFailAmt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let payFailAmt = formatNumber(params.row.payFailAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: payFailAmt
                }
              }, payFailAmt);
            }
          },
          {
            title: this.$t('m.i.be.payInnerSettleAmt'),
            key: "payInnerSettleAmt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let payInnerSettleAmt = formatNumber(params.row.payInnerSettleAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: payInnerSettleAmt
                }
              }, payInnerSettleAmt);
            }
          },
          {
            title: this.$t("m.i.be.payInnerSettleNum"),
            key: "payInnerSettleNum",
            hiddenCol: false,
            align: "center"
          },
          {
            title: this.$t('m.i.be.payPaymentAmt'),
            key: "payPaymentAmt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let payPaymentAmt = formatNumber(params.row.payPaymentAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: payPaymentAmt
                }
              }, payPaymentAmt);
            }
          },

          {
            title: this.$t("m.i.be.rcvSumNum"),
            key: "rcvSumNum",
            hiddenCol: false,
            align: "center"
          },
          {
            title: this.$t("m.i.be.rcvSuccessNum"),
            key: "rcvSuccessNum",
            hiddenCol: false,
            align: "center"
          },
          {
            title: this.$t("m.i.be.rcvFailNum"),
            key: "rcvFailNum",
            hiddenCol: false,
            align: "center"
          },
          {
            title: this.$t('m.i.be.rcvSumAmt'),
            key: "rcvSumAmt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let rcvSumAmt = formatNumber(params.row.rcvSumAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: rcvSumAmt
                }
              }, rcvSumAmt);
            }
          },
          {
            title: this.$t('m.i.be.rcvSuccessAmt'),
            key: "rcvSuccessAmt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let rcvSuccessAmt = formatNumber(params.row.rcvSuccessAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: rcvSuccessAmt
                }
              }, rcvSuccessAmt);
            }
          },
          {
            title: this.$t('m.i.be.rcvFailAmt'),
            key: "rcvFailAmt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let rcvFailAmt = formatNumber(params.row.rcvFailAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: rcvFailAmt
                }
              }, rcvFailAmt);
            }
          },
          {
            title: this.$t('m.i.be.rcvInnerSettleAmt'),
            key: "rcvInnerSettleAmt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let rcvInnerSettleAmt = formatNumber(params.row.rcvInnerSettleAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: rcvInnerSettleAmt
                }
              }, rcvInnerSettleAmt);
            }
          },
          {
            title: this.$t("m.i.be.rcvInnerSettleNum"),
            key: "rcvInnerSettleNum",
            hiddenCol: false,
            align: "center"
          },
          {
            title: this.$t('m.i.be.rcvRcvmentAmt'),
            key: "rcvRcvmentAmt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let rcvRcvmentAmt = formatNumber(params.row.rcvRcvmentAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: rcvRcvmentAmt
                }
              }, rcvRcvmentAmt);
            }
          },
        ],
        pageInfo: {
          pageNo: 1,
          pageSize: 10
        },
        currentSelectRow: null,

        dictMap: []
      };
    },
    components: {
      settleBatchDetailShow: () => import(/* webpackChunkName: "shcpe/cpes/settle/settleBatchDetailShow" */`@/views/bizViews/shcpe/cpes/settle/settleBatchDetailShow`),
    },
    watch: {},

    computed: {},
    mounted() {
      getDictListByGroups("Yon").then(res => {
        this.dictMap = res.get("map");
      });
    },
    methods: {
      //日期选择框
      handleClearDtChange(arr) {
        if(arr && arr.length == 2){
          this.formItem.minClearDt = arr[0].replace(/-/g, "");
          this.formItem.maxClearDt = arr[1].replace(/-/g, "");
          this.clearDt = [arr[0], arr[1]];
        }else{
          this.formItem.minClearDt = "";
          this.formItem.maxClearDt = "";
          this.clearDt = [];
        }

      },
      handleSearch() {
        this.$refs.datagrid.dataChange(1);
      },

      onCurrentChange(currentRow, oldCurrentRow, _index) {
        this.currentSelectRow = currentRow;
      },
      onCurrentChangeCancle(currentRow, oldCurrentRow, _index) {
        this.currentSelectRow = null;
      },
      //重置查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
        this.formItem.maxClearDt = "";
        this.formItem.minClearDt = "";

      },
      showDetail(){
        if (this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        this.batchParams.batchId = this.currentSelectRow.id;
        this.showSettleBatchDetailWin = true;
      },
      showSettleBatchDetailWinClose(){
        this.batchParams = {};
        this.showSettleBatchDetailWin = false;
      }

    }
  };
</script>

<style scoped>

</style>
