<template>
  <h-msg-box v-model="tempAcctBillWin" width="1000" :mask-closable="false" @on-close="handleClose"
             class="h-form-search-layer"
             :maximize="true">
    <p slot="header">
      <span>查看票据明细</span>
    </p>
    <div class="h-tree-search">
      <!--弹出框模式标题-->
      <div class="h-modal-header-wrapper">
        <h-row name="flex" class="layout-menu-wrapper">
          <h-col span="24">
            <div>
              <!--数据展示表格-->
              <h-row>
                <h-col span="24">
                  <h-datagrid
                    :columns="columns"
                    highlight-row
                    :url="userUrl"
                    :auto-load="false"
                    :bindForm="formItem"
                    :onRowClick="handlelRowClick"
                    :onSelectChange="handleSelectClick"
                    ref="datagrid">
                    <div slot="toolbar" class="pull-left">
                    </div>
                  </h-datagrid>
                </h-col>
              </h-row>

            </div>
          </h-col>
        </h-row>
      </div>
      <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin"
                      :billId="this.billId" :billRangeStart="this.billRangeStart" :billRangeEnd="this.billRangeEnd"></bill-info-main>

      <!--标票票面信息-->
      <bill-info-main-std @billInfoWinClose="billInfoStdWinClose" :showBillInfoWin="showBillInfoStdWin" :billId="billId" :billNo="billNo" :listId="listId":billRangeStart="this.billRangeStart" :billRangeEnd="this.billRangeEnd"></bill-info-main-std>

    </div>
    <!-- 弹出框模式底部按钮 -->
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
    </div>
  </h-msg-box>
</template>

<script>
  import { mapGetters } from "vuex";
  import { formatNumber } from "../../../../../api/bizApi/commonUtil";
  import { post, exportList,getDictListByGroups, getDictValueFromMap,formatBillRange} from "@/api/bizApi/commonUtil";
  export default {
    name: "showAcctBill",
    components: {
    },
    props: {
      title: String,
      showAcctBillWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      params:{
        type:Object,
        default(){
          return {};
        }
      }
    },
    data() {
      let options = {};
      options.userUrl = this.params.dataGridUrl + "?frontFlowNo=" + window.sessionStorage.getItem("frontFlowNo");
      let columns = [
        {
          title: this.$t("m.i.common.index"),
          type: "index",
          align: "center"
        },


        {
          title: this.$t("m.i.billInfo.billOrigin"),
          align:'center',
          hiddenCol: false,
          render:(h,params) => {
            let dictValue = (!params.row.billOrigin || params.row.billOrigin === 'CS00') ? '-' : this.getDictValueFromMap(this.dictMap, 'BillOrigin', params.row.billOrigin);

            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title:this.$t("m.i.billInfo.billPackageNo"),
          key: 'billNo',
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let billNo = "";
            if(params.row.billId == null || params.row.billId == ""){
              return ""
            }
            if (params.row.billNo == null || params.row.billNo == "") {
              billNo = "查看票面";
            }else {
              billNo = params.row.billNo;
            }
            return h("a", {
              on: {
                click: () => {
                  this.showBillInfo(params.row);
                }
              }
            }, billNo);
          }
        },
        {
          title: this.$t("m.i.billInfo.billRange"),
          align:'center',
          key:"billRange",
          hiddenCol: false,
          render:(h,params) => {
            let billOrigin = params.row.billOrigin;
            let billRangeStart = params.row.billRangeStart;
            let billRangeEnd = params.row.billRangeEnd;
            return h("span", formatBillRange(billOrigin, billRangeStart, billRangeEnd))
          }
        },
        {
          title: this.$t("m.i.billInfo.billPackageMoney"),
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
          title:this.$t("m.i.common.batchNo"),
          key: "busiBatchNo",
          hiddenCol: false,
        },
        {
          title:this.$t("m.i.billInfo.billType"),
          key: "billType",
          hiddenCol: false,
          render: (h, params) => {
            return h("div", [
              h("span", formatterisBillType(params.row.billType, params.row, params.row.index))
            ]);
          }
        },
        {
          title: this.$t("m.i.billInfo.drwrName"),
          key: "drwrName",
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.billInfo.acptName"),
          key: "acptName",
          sortable: true,
          hiddenCol: false,
        },
        {
          title:  this.$t("m.i.billInfo.remitDt"),
          key: "remitDt",
          ellipsis: false,
          hiddenCol: false,
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
          ellipsis: false,
          hiddenCol: false,
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
          title: this.$t("m.i.pc.isAcpt"),
          key: "isAcpt",
          hiddenCol: false

        },
      ];
      let formItem = {
        roleName: ""
      };
      options.tableRef = "selfTable";
      options.billId = "";
      options.billRangeStart = "";
      options.billRangeEnd = "";
      options.billNo = "";
      options.listId = "";
      options.showBillInfoWin = false;
      options.showBillInfoStdWin = false;
      billId: "",
      options.columns = columns;
      options.formItem = formItem;
      return options;
    },
    mounted() {
      getDictListByGroups("BillOrigin").then(res => {

        this.billOriginList = res.get("BillOrigin");
        this.dictMap = res.get("map");
      });
    },
    watch: {
      showAcctBillWin(val) {
        if(val){
          this.userUrl = this.params.dataGridUrl;
          this.formItem=Object.assign(this.formItem,this.params);
          this.$nextTick(() => {
            this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
          });
        }
      },
      sidebar: {
        handler(val, oldVal) {
          if (!val.opened) {
            setTimeout(() => {
              this.$refs.datagrid.$refs.gridContent.handleResize();
            }, 100);
          }
        },
        deep: true
      }
    },

    computed: {
      ...mapGetters(["sidebar"]),
      tempAcctBillWin: {
        get() {
          return this.showAcctBillWin;
        },
        set() {
        }
      }
    },
    methods: {
      handlelRowClick(arr) {
        this.currentSelectRow = arr;
      },
      handleSelectClick(arr, selectInx) {
        this.unDisabled();
        this.currentSelectList = arr;
        this.currentSelectRowInx = selectInx;
        if (arr.length == 0) return;
        if (arr[0].role_code == "admin") {
          this.deletDisabled = true;
        }
      },
      handleClose() {
        this.$emit("showAcctBillWinClose", "");
      },
      billInfoWinClose() {
        this.showBillInfoWin = false;
      },
      showBillInfo(row) {
        this.billId = row.billId;
        this.billRangeStart = row.billRangeStart;
        this.billRangeEnd = row.billRangeEnd;
        //存托票据明细查询存托服务
        if(this.params.prodNo == "03020201"||this.params.prodNo == "03020301"||this.params.prodNo == "03020302"){
           this.listId = row.busiBatchId;
           this.billNo = row.billNo;
           this.showBillInfoStdWin = true;
        }else{
          this.showBillInfoWin = true;
        }
      },

      billInfoStdWinClose(){
        this.billId=null;
        this.billRangeStart=null;
        this.billRangeEnd=null;
        this.billNo=null;
        this.listId=null;
        this.showBillInfoStdWin=false;
      },

    }
  };

  function formatterisBillClass(value, row, index) {
    if (value != null && value != "") {
      switch (value) {
        case "ME01":
          return "纸票";
        case "ME02":
          return "电票";

      }
    } else {
      return "";
    }
  }

  function formatterisBillType(value, row, index) {

    if (value != null && value != "") {
      switch (value) {
        case "AC01":
          return "银票";
        case "AC02":
          return "商票";
      }
    } else {
      return "";
    }

  }
</script>

<style scoped>
</style>
