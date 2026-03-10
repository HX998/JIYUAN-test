<template>
  <!-- 客户账号信息查询 -->
  <h-msg-box v-model="tempShowCustAcctNoWin" width="1000" class="h-form-table-layer" :maximize="true"
             @on-close="handleClose" :mask-closable="false" @on-maximize="onMaximize" :z-index=1201>
    <p slot="header">
      <span>{{title}}</span>
    </p>
    <!--数据展示表格-->
    <!-- 查询表单 -->
    <div :class="{'h-form-overhd':!ifShowMore}">
      <h-form :model="formItem" :label-width="100" ref="formItem" cols="4" class="h-form-search" v-if="isSearch">
        <h-form-item :label="$t('m.i.common.custAcctNo')" prop="custAcctNo">
          <h-input v-model="formItem.custAcctNo" placeholder=""></h-input>
        </h-form-item>
        <h-form-item :label="$t('m.i.common.custName')" prop="custName">
          <h-input v-model="formItem.custName" placeholder=""></h-input>
        </h-form-item>
        <h-form-item class="h-form-operate">
          <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
          <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
        </h-form-item>
      </h-form>
    </div>
    <h-datagrid
      :columns="showCustAcctNoColumns"
      highlight-row
      url="/bm/cust/acct/pageQueryCustAcctList"
      :auto-load="false"
      :bind-form="formItem"
      :onRowDbClick="doubleHandleClick"
      :on-select-change="handleRowClick"
      ref="datagrid">
    </h-datagrid>
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
      <h-button type="primary" @click="submitForm">{{$t("m.i.common.commit")}}</h-button>
    </div>
  </h-msg-box>
</template>

<script>
  import { post, getDictListByGroups, getDictValueFromMap } from "@/api/bizApi/commonUtil";

  export default {
    name: "showCustAcctNo",
    data() {
      return {
        ifShowMore: false,
        showCustAcctNoColumns: [
          {
            title: " ",
            type: "radio",
            align: "center",
            width: 50
          },
          {
            type: "selection",
            key: "multiSelect",
            width: 60,
            hiddenCol: true
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: this.$t("m.i.common.custNo"),
            key: "custNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.custName"),
            key: "custName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.acctName"),
            key: "acctName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.custAcctNo"),
            key: "custAcctNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.custAcctKind"),
            key: "custAcctKind",
            hiddenCol: false,
            render: (h, params) => {
              return h("span", getDictValueFromMap(this.dictMap, "custAcctKind", params.row.custAcctKind));
            }
          },
          {
            title: this.$t("m.i.common.isOtherBankAcct"),
            key: "isOtherBankAcct",
            hiddenCol: false,
            render: (h, params) => {
              return h("span", getDictValueFromMap(this.dictMap, "Yon", params.row.isOtherBankAcct));
            }
          },
          {
            title: this.$t("m.i.common.openBrchName"),
            key: "openBrchName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.openBrchNo"),
            key: "openBrchNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.openBankNo"),
            key: "openBankNo",
            hiddenCol: false
          }
        ],
        formItem: {
          custNo: "",
          custName: "",
          activeFlag: "1",
          custAcctKind: "",
          isOtherBankAcct: "0",
          busiOwnBrchNo:"",
          custAcctNo:"",
          openBrchNo:"",
          isDpst:"1"
        },
        dictMap: new Map(),
        currentSelectRow: []
      };

    },
    props: {
      title: {
        type: String,
        default: '查询客户账号信息窗口'
      },
      showCustAcctNoWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      isAllBankAcct: {
        type: Boolean,
        default() {
          return false;
        }
      },
      isSearch: {
        type: Boolean,
        default() {
          return false;
        }
      },
      custNo: "",
      custName: "",
      custAcctKind: "",
      busiOwnBrchNo:"",
      openBrchNo:"",
    },
    watch: {
      showCustAcctNoWin(val) {
        if (val === true) {
          this.getDictInfo();
          if (this.isAllBankAcct) {
            this.formItem.isOtherBankAcct = null;
          }
          this.formItem.custNo = "";
          this.formItem.custAcctKind = "";
          this.formItem.openBrchNo = "";
          this.currentSelectRow = [];
          this.formItem.custNo = this.custNo;
          this.formItem.openBrchNo = this.openBrchNo;
          if (!!this.custName) {
            this.formItem.custName = this.custName;
          }
          if (!!this.custAcctKind) {
            this.formItem.custAcctKind = this.custAcctKind;
          }
          this.formItem.busiOwnBrchNo = this.busiOwnBrchNo;
          this.$nextTick(() => {
            this.$refs.datagrid.$refs.gridPage.clearElevator();
            this.$refs.datagrid.dataChange(1);
          });
        }
      }
    },
    computed: {
      tempShowCustAcctNoWin: {
        get() {
          return this.showCustAcctNoWin;
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
      getDictInfo() {
        getDictListByGroups("Yon,custAcctKind").then(res => {
          this.dictMap = res.get("map");
        });
      },
      handleRowClick(arr) {
        this.currentSelectRow = arr;
      },
      doubleHandleClick(arr) {
        this.currentSelectRow = arr;
        this.$emit("custAcctNoSelectSubmit", this.currentSelectRow);
      },
      //查询
      formSearch() {
        this.currentSelectRow = [];
        this.$refs.datagrid.dataChange(1);
      },
      //查询重置
      formSearchReset() {
        this.formItem.custAcctNo = "";
        this.formItem.custName = "";
      },
      submitForm() {
        let list = this.currentSelectRow[0];
        if (list == null || list.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        // 选择客户
        this.$emit("custAcctNoSelectSubmit", this.currentSelectRow[0]);
      },
      handleClose() {
        this.$emit("showCustAcctNoWinClose", "");
      }
    }
  };
</script>

<style scoped>

</style>
