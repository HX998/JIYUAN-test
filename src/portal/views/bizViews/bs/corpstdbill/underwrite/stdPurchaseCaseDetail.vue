<template>
  <div>
    <h-msg-box v-model="tempStdPurchaseCaseDetailWin" maximize width="1000" :mask-closable="false" @on-close="handleClose">
      <p slot="header">
        <span>配售明细详情</span>
      </p>
      <div class="text-body">
        <h-row :gutter="16">
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t("m.i.common.brchName") }}:</h-col>
              <h-col span="15" class="val">{{this.billParams.investBrchName}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t('m.i.bs.investPlacingTotalAmt') }}:</h-col>
              <h-col span="15" class="val">{{formatNumber(this.billParams.investPlacingAmt)}}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <br>
      </div>
      <!-- 数据展示表格 -->
      <h-datagrid
        :columns="columns"
        highlightRow
        @on-page-change="handleDetailPage"
        :gridData="batchDetailList"
        url=""
        :bindForm="billParams"
        :auto-load="false"
        :onCurrentChange="handleCurrentChange"
        :onCurrentChangeCancel="handleCurrentChangeCancel"
        ref="billdatagrid">
        <div slot="toolbar" class="pull-left">
        </div>
      </h-datagrid>
      <div slot="footer">
      </div>
    </h-msg-box>
  </div>
</template>

<script>
import {getDictValueFromMap, post, formatNumber} from "@/api/bizApi/commonUtil";
export default {
  name: "stdBookPurchaseDetail",
  data() {
    return {
      batchId: "",
      formItem: {},
      batchDetailList: {
        list: [],
        pageInfo: {
          count: 0,
          pageNo: 1,
          pageSize: 10
        }
      },
      columns: [
        {
          type: "index",
          key: "numOrder",
          title: this.$t("m.i.common.index"),
          width: 60,
          align: "center",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.bs.purchasePrice'),
          key: 'purchasePrice',
          hiddenCol: false,
          align: "right",
          sortable: true,
          render: (h, params) => {
            return h("p", formatNumber(params.row.purchasePrice, 4, ","));
          }
        },
        {
          title: this.$t('m.i.bs.purchaseAmt'),
          key: 'purchaseAmt',
          hiddenCol: false,
          align: "right",
          sortable: true,
          render: (h, params) => {
            return h("p", formatNumber(params.row.purchaseAmt, 2, ","));
          }
        },
        {
          title: this.$t('m.i.bs.investPlacingAmt'),
          key: 'placingAmt',
          hiddenCol: false,
          align: "right",
          sortable: true,
          render: (h, params) => {
            return h("p", formatNumber(params.row.placingAmt, 2, ","));
          }
        }
      ],
      currentSelectRow: [],
    };
  },
  props: {
    stdPurchaseCaseDetailWin: {
      type: Boolean,
      default() {
        return false;
      }
    },
    billParams: {
      type: Object,
      default() {
        return {};
      }
    },
    dictMap: {
      type: Map,
      required: true
    }
  },
  computed: {
    tempStdPurchaseCaseDetailWin: {
      get() {
        return this.stdPurchaseCaseDetailWin;
      },
      set() {
      }
    }
  },
  watch: {
    stdPurchaseCaseDetailWin(val) {
      if (val) {
        this.$nextTick(() => {
          this.handleSearch();
        });
      }
    },
  },


  methods: {

    // 分页事件
    handleDetailPage(pageNo, pageSize) {
      let obj = Object.assign({}, { batchId: this.billParams.batchId }, { pageNo: pageNo, pageSize: pageSize });
      this.queryBatchDeatilList(obj);
    },
    // 查询票据清单
    queryBatchDeatilList(obj) {
      let url = "";
      if(this.billParams.bookResultPage == "query"){
        url = "/bs/corpstdbill/underwrite/stdBookKeepingResultQry/func_queryStdPurchaseCaseDetailPage";
      }else if(this.billParams.bookResultPage == "confirm"  || this.billParams.bookResultPage == "confirmQuery"){
        url = "/bs/corpstdbill/underwrite/stdBookKeepingConfirm/func_queryStdPurchaseCaseDetailPage";
      }
      post(obj, url).then(res => {
        let retCode = res.data.retCode;
        if (retCode === "000000") {
          this.batchDetailList = res.data.retData;
        }
      });
    },

    //查询
    handleSearch() {
      this.formItem.batchId = this.billParams.batchId;
      this.$refs.billdatagrid.selects = [];
      this.$refs.billdatagrid.selectIds = [];
      this.$refs.billdatagrid.dataChange(1);
      this.$refs.billdatagrid.$refs.gridPage.clearElevator();
    },


    handleCurrentChange(currentRow) {
      this.currentSelectRow = currentRow;
    },
    handleCurrentChangeCancel() {
      this.currentSelectRow = [];
    },
    handleClose() {
      this.$emit("stdPurchaseDetailBtnClose", "");
    },
    format(groupCode, key) {
      return getDictValueFromMap(this.dictMap, groupCode, key);
    },
    formatDate(value) {
      return value ? this.$moment(value, "YYYY-MM-DD").format("YYYY-MM-DD") : "";
    },
    formatDateTime(value) {
      return value ? this.$moment(value, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss") : "";
    },
    formatNumber(value){
      return formatNumber(value, 2, ",");
    },
    formatPriceNumber(value){
      return formatNumber(value, 4, ",");
    },
  }
};
</script>

<style scoped>

</style>
