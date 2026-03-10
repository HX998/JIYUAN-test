<template>
  <!--贴现挑票弹出框-->
  <h-msg-box v-model="tempacptPickBillWin" width="900"  @on-close="handleClose"
             class="h-form-table-layer" :maximize="true">
    <p slot="header">
      <span>{{title}}</span>
    </p>
    <!--查询表单-->
    <div>
      <h-form :model="acptPickBillForm" :label-width="100" ref="acptPickBillForm" cols="4" class="h-form-search">
          <h-form-item :label="$t('m.i.billInfo.billNo')" prop="reverseBillNo">
            <h-input v-model="acptPickBillForm.reverseBillNo" placeholder=""></h-input>
          </h-form-item>
          <h-form-item class="h-form-operate one-form">
            <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
            <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
          </h-form-item>
        </h-form>
    </div>
    <!--数据展示表格-->
    <h-row>
      <h-col span="24">
        <h-datagrid
          :columns="columns"
          :auto-load="false"
          highlightRow
          url="/ce/acpt/outerBusiBill/busiPaymentDue/acptPickBill/func_pageQueryAcptCorpList"
          :bindForm="acptPickBillForm"
          :onCurrentChange="onCurrentChange"
          :onCurrentChangeCancel="onCurrentChangeCancle"
          ref="discPickDatagrid">
        </h-datagrid>
      </h-col>
    </h-row>
    <!-- 弹出框模式底部按钮 -->
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
      <h-button type="primary" @click="submitForm">{{$t("m.i.common.commit")}}</h-button>
    </div>
  </h-msg-box>
</template>

<script>
import {formatNumber} from "@/api/bizApi/commonUtil";

export default {
    name: "acptPickBill",
    data() {
      let options = {};
      options.columns = [
        {
          title:' ',
          type: "radio",
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
          title:'id',
          key: "id",
          hiddenCol: true,
        },
        {
          title: this.$t("m.i.billInfo.billNo"),
          key: "billNo",
          hiddenCol: false,
          sortable: true,
        },
        {
          title: this.$t("m.i.billInfo.billMoneyByUnit"),
          key: "billMoney",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let billMoney = formatNumber(params.row.billMoney, 2, ',');
            return h("span", {
              domProps: {
                title: billMoney
              }
            }, billMoney);
          }
        },
        {
          title: this.$t("m.i.billInfo.billType"),
          key: "billType",
          hiddenCol: false,
          render:(h,params) => {
            return h("span",this.getDictValueFromMap(this.dictMap,"DraftTypeCode",params.row.billType));
          }
        },
        {
           title: this.$t("m.i.billInfo.drwrName"),
          key: "drwrName",
          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.remitDt"),
          key: "openDt",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            if(params.row.openDt == null || params.row.openDt === ""){
              return "";
            }
            let date = this.$moment(params.row.openDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
          title: this.$t("m.i.billInfo.dueDt"),
          key: "dueDt",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            if(params.row.dueDt == null || params.row.dueDt === ""){
              return "";
            }
            let date = this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
           title: this.$t("m.i.billInfo.drweBankNo"),
          key: "drweBankNo",
          hiddenCol: false,
        },
        {
           title: this.$t("m.i.billInfo.acptName"),
          key: "acptName",
          sortable: true,
          hiddenCol: false,
        }
      ];
      options.currentSelectRow = [];
     // options.currentSelectList = [];
     // options.currentSelectRowInx = [];
     // options.isList = [];
      return options;
    },
    props: {
      acptPickBillForm: Object,
      acptPickBillWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      title: {
        type: String,
        default() {
          return "挑票查询";
        }
      },
      batchId:"",
    },
    watch: {
      acptPickBillWin(val) {
        if (val === true) {
          this.$nextTick(() => {
            this.formSearch();
          });
        }
      }
    },
    computed: {
      tempacptPickBillWin: {
        get() {
          return this.acptPickBillWin;
        },
        set() {
        }
      }
    },
    methods: {
      //查询
      formSearch() {
        this.$refs.discPickDatagrid.dataChange(1);
      },
      //重置
      formSearchReset() {
        this.$refs.acptPickBillForm.resetFields();
      },

        onCurrentChange(currentRow, oldCurrentRow, _index) {
            this.currentSelectRow = currentRow;
        },
        onCurrentChangeCancle(currentRow, oldCurrentRow, _index) {
            this.currentSelectRow = null;
        },
      handleClose() {
        this.$emit("acptPickBillWinClose", "");
      },
      submitForm() {
        if (this.currentSelectRow != null  ) {
          this.$emit("acptPickBillChange", this.currentSelectRow);
        } else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      }
    },
    mounted() {
      this.getDictListByGroups("Yon,DraftTypeCode").then(res => {
        this.dictMap = res.get("map");
      });
    }
  };
</script>

<style scoped>

</style>
