<template>
  <!--贴现挑票弹出框-->
  <h-msg-box v-model="tempDiscPickBillWin" width="800" :mask-closable="false" @on-close="handleClose"
             class="h-form-table-layer" :maximize="true">
    <p slot="header">
      <span>{{title}}</span>
    </p>
    <!--查询表单-->
    <div>
      <h-form :model="discPickBillForm" :label-width="100" ref="discPickBillForm" cols="4" class="h-form-search">
        <bill-no v-model="discPickBillForm.billNo"></bill-no>
        <query-btn :advanceShow='false' :formSearch='formSearch' :formSearchReset='formSearchReset'></query-btn>
      </h-form>
    </div>
    <!--数据展示表格-->
    <h-datagrid
      :columns="columns"
      :url="queryRefusedUrl"
      :bindForm="discPickBillForm"
      param-id="hldrId"
      :has-select="false"
      :rowSelect="true"
      ref="datagrid">
    </h-datagrid>
    <!-- 弹出框模式底部按钮 -->
    <div slot="footer">
      <close-btn @close="handleClose"></close-btn>
      <commit-btn @commit="submitForm"></commit-btn>
    </div>
  </h-msg-box>
</template>

<script>
  import { post, on, off,formatNumber, getDictValueFromMap ,getDictListByGroups} from "@/api/bizApi/commonUtil";

  export default {
    name: "discPickBill",
    data() {
      return {
        columns : [
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
              return h("span",getDictValueFromMap(this.dictMap,"DraftTypeCode",params.row.billType));
            }
          },
          {
            title: this.$t("m.i.billInfo.drwrName"),
            key: "drwrName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.remitDt"),
            key: "remitDt",
            hiddenCol: false,
            render: (h, params) => {
              if(params.row.remitDt == null || params.row.remitDt === ""){
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
            render: (h, params) => {
              if(params.row.dueDt == null || params.row.dueDt === ""){
                return "";
              }
              let date = this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
             title: this.$t("m.i.billInfo.acptName"),
            key: "acptName",
            sortable: true,
            hiddenCol: false,
          }
        ],
        dictMap : new Map(),
      };
    },
    props: {
      discPickBillForm: Object,
      discPickBillWin: {
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
      queryRefusedUrl :{
        type : String,
        default (){
          return "/ce/disc/batch/pageQueryRefusedDsicBillList";
        }
      }
    },
    watch: {
      discPickBillWin(val) {
        if (val === true) {
          this.$nextTick(() => {
            this.discPickBillForm.billNo = '';
            this.formSearch();
          });
        }
      },
    },

    computed: {
      tempDiscPickBillWin: {
        get() {
          return this.discPickBillWin;
        },
        set() {
        }
      },
    },
    methods: {
      //查询
      formSearch() {
        this.$refs.datagrid.dataChange(1);
      },
      //重置
      formSearchReset() {
        this.$refs.discPickBillForm.resetFields();
      },
      handleClose() {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$emit("discPickBillWinClose", "");
      },
      submitForm() {
        if (this.$refs.datagrid.selects != null && this.$refs.datagrid.selects.length !== 0) {
          this.$emit("discPickBillChange", this.$refs.datagrid.selects, () => {
            this.$refs.datagrid.selects = [];
            this.$refs.datagrid.selectIds = [];
            this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
          });
        } else {
          this.$hMessage.info(this.$t("m.i.common.chooseOneData"));
        }
      }
    },
    mounted() {
      getDictListByGroups("DraftTypeCode").then(res => {
        this.dictMap = res.get("map");
      });
    }
  };
</script>

<style scoped>

</style>
