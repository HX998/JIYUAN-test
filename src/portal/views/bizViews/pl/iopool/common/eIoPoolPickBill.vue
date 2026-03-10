<!--出池挑票弹出框-->
<template>
  <h-msg-box v-model="tempIoPoolPickBillWin" width="1000" :mask-closable="false" @on-close="handleClose"
             class="h-form-table-layer" :maximize="true" @on-maximize="onMaximize">
    <p slot="header">
      <span>{{ title }}</span>
    </p>
    <!--查询表单-->
    <div>
      <div :class="{'h-form-overhd':!ifShowMore}">
        <h-form :model="ioPoolPickBillForm" :label-width="100" ref="ioPoolPickBillForm" cols="4"
                class="h-form-search">
          <bill-no :label="$t('m.i.billInfo.billPackageNo')"  v-model="ioPoolPickBillForm.likeBillNo" prop="likeBillNo"></bill-no>
          <bill-range :form-item="ioPoolPickBillForm"
                      :range-props="['minBillRangeStart','maxBillRangeEnd']"></bill-range>
          <h-form-item :label="$t('m.i.billInfo.billPackageMoney')" prop="billMoney"
                       v-if="ioPoolPickBillParams.pickBillType==='outPool'">
            <h-typefield type="money" v-model="ioPoolPickBillForm.billMoney" :maxlength="20"
                         placeholder="" bigTips divided></h-typefield>
          </h-form-item>
          <h-form-item class="h-form-operate">
            <!--<span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"-->
            <!--:class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>-->
            <h-button type="primary" @click="formSearch()">{{ $t("m.i.common.search") }}</h-button>
            <h-button type="ghost" @click="formSearchReset()">{{ $t("m.i.common.reset") }}</h-button>
          </h-form-item>
        </h-form>
      </div>
    </div>
    <!--数据展示表格-->
    <h-datagrid
      :columns="columns"
      :url="ioPoolPickBillParams.pickBillUrl"
      :bindForm="ioPoolPickBillForm"
      :auto-load="false"
      :rowSelect="true"
      :has-select="false"
      :param-id="paramId"
      ref="datagrid">
    </h-datagrid>
    <!-- 弹出框模式底部按钮 -->
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{ $t("m.i.common.close") }}</h-button>
      <h-button type="primary" @click="submitForm">{{ $t("m.i.common.commit") }}</h-button>
    </div>
  </h-msg-box>
</template>

<script>
import {formatNumber, off, on, post, formatBillRange} from "@/api/bizApi/commonUtil";

export default {
  name: "eIoPoolPickBill",
  data() {
    return {
      ioPoolPickBillForm: {
        queryType: "1",
        batchId: "",
        billType: "",
        billClass: "",
        custNo: "",
        custAcctNo: "",
        likeBillNo: "",
        billMoney: "",
        minBillRangeStart: "",
        maxBillRangeEnd: "",
        billOriginList: [],
        dataSource: ""

      },
      paramId: "hldrId",
      ifShowMore: false,
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.index"),
          type: "index",
          width: 60,
          align: "center",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.billOrigin"),
          key: "billOrigin",
          hiddenCol: false,
          render: (h, params) => {
            let list = this.getDictValueFromMap(this.ioPoolPickBillParams.dictMap, "BillOrigin", params.row.billOrigin);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
        {
          title: this.$t("m.i.billInfo.billPackageNo"),
          key: "billNo",
          ellipsis: false,
          hiddenCol: false,
          sortable: true
        },
        {
          title: this.$t("m.i.billInfo.billRange"),
          align: 'center',
          key: "billRange",
          hiddenCol: false,
          render: (h, params) => {
            let billOrigin = params.row.billOrigin;
            let billRangeStart = params.row.billRangeStart;
            let billRangeEnd = params.row.billRangeEnd;
            return h("span", formatBillRange(billOrigin, billRangeStart, billRangeEnd))
          }
        },
        {
          title: this.$t("m.i.billInfo.billClass"),
          key: "billClass",
          ellipsis: false,
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = this.getDictValueFromMap(this.ioPoolPickBillParams.dictMap, "CDMedia", params.row.billClass);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t("m.i.billInfo.billType"),
          key: "billType",
          ellipsis: false,
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = this.getDictValueFromMap(this.ioPoolPickBillParams.dictMap, "DraftTypeCode", params.row.billType);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t("m.i.billInfo.billPackageMoney"),
          key: "billMoney",
          ellipsis: false,
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let billMoney = formatNumber(params.row.billMoney, 2, ",");
            return h("span", {
              domProps: {
                title: billMoney
              }
            }, billMoney);
          }
        },
        {
          title: this.$t("m.i.billInfo.remitDt"),
          key: "remitDt",
          hiddenCol: false,
          ellipsis: false,
          sortable: true,
          render: (h, params) => {
            if (params.row.remitDt == null || params.row.remitDt === "") {
              return "";
            }
            let date = this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
          title: this.$t("m.i.billInfo.dueDt"),
          key: "dueDt",
          hiddenCol: false,
          ellipsis: false,
          sortable: true,
          render: (h, params) => {
            if (params.row.dueDt == null || params.row.dueDt === "") {
              return "";
            }
            let date = this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
          title: this.$t("m.i.billInfo.drwrName"),
          ellipsis: false,
          key: "drwrName",
          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.drwrAcctNo"),
          ellipsis: false,
          key: "drwrAcctNo",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.pyeeName"),
          key: "pyeeName",
          ellipsis: false,
          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.acptName"),
          key: "acptName",
          sortable: true,
          ellipsis: false,
          hiddenCol: false
        },
      ],
      currentSelectList: [],
    };
  },
  props: {
    title: {
      type: String,
      default() {
        return "挑票查询";
      }
    },
    ioPoolPickBillWin: {
      type: Boolean,
      default() {
        return false;
      }
    },
    ioPoolPickBillParams: {
      type: Object,
      default: {
        batchId: "",
        billType: "",
        billClass: "",
        custNo: "",
        custAcctNo: "",
        dictMap: new Map(),
        pickBillType: "",   //挑票类型
        pickBillUrl: ""     //查询挑票信息对应Url
      }
    }
  },
  watch: {
    ioPoolPickBillWin(val) {
      if (val === true) {
        this.ioPoolPickBillForm.batchId = this.ioPoolPickBillParams.batchId;
        this.ioPoolPickBillForm.billType = this.ioPoolPickBillParams.billType;
        this.ioPoolPickBillForm.billClass = this.ioPoolPickBillParams.billClass;
        this.ioPoolPickBillForm.custNo = this.ioPoolPickBillParams.custNo;
        this.ioPoolPickBillForm.custAcctNo = this.ioPoolPickBillParams.custAcctNo;
        this.ioPoolPickBillForm.billOriginList = this.ioPoolPickBillParams.billOriginArray;
        this.ioPoolPickBillForm.dataSource = this.ioPoolPickBillParams.dataSource;
        this.$nextTick(() => {
          this.formSearch();
        });
      }
    },
  },
  computed: {
    tempIoPoolPickBillWin: {
      get() {
        return this.ioPoolPickBillWin;
      },
      set() {
      }
    }
  },
  methods: {
    onMaximize() {
      setTimeout(() => {
        this.$refs.datagrid.$refs.gridContent.handleResize();
      }, 100);
    },
    //查询
    formSearch() {
      this.currentSelectList = [];
      this.$refs.datagrid.selectIds = [];
      this.$refs.datagrid.selects = [];
      this.ioPoolPickBillForm.billMoney = this.ioPoolPickBillForm.billMoney.toString().replace(/,/g, "");
      this.$refs.datagrid.dataChange(1);
    },
    //重置
    formSearchReset() {
      this.ioPoolPickBillForm.queryType = "1";
      this.$refs.ioPoolPickBillForm.resetFields();
    },
    handleSelectClick(arr, selectInx) {
      this.currentSelectList = arr;
    },
    handleClose() {
      this.formSearchReset();
      this.$refs.datagrid.$refs.gridPage.clearElevator();
      this.$emit("ioPoolPickBillWinClose", "");
    },
    submitForm() {
      this.currentSelectList = this.$refs.datagrid.selects;
      if (this.currentSelectList != null && this.currentSelectList.length !== 0) {
        this.$refs.datagrid.$refs.gridPage.clearElevator();
        this.$emit("ioPoolPickBillChange", this.currentSelectList);
      } else {
        this.$hMessage.info(this.$t("m.i.common.chooseOneData"));
      }
    }
  }
};
</script>

<style scoped>

</style>
