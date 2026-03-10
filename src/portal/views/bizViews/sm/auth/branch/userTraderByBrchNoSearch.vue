<template>
  <!--交易柜员弹出框-->
  <h-msg-box v-model="tempUserTraderWin" width="1000" :mask-closable="false" @on-close="handleTraderClose" top="10"
             class="h-form-table-layer" :maximize="true" :zIndex="1003" @on-maximize="onMaximize">
    <p slot="header">
      <span>{{title}}</span>
    </p>
    <!--查询表单-->
    <div>
      <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
        <h-form-item :label="$t('m.i.common.traderId')" prop="traderId">
          <h-input v-model="formItem.traderId"></h-input>
        </h-form-item>
        <h-form-item :label="$t('m.i.common.traderName')" prop="traderName">
          <h-input v-model="formItem.traderName"></h-input>
        </h-form-item>
        <h-form-item class="h-form-operate two-form">
          <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
          <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
        </h-form-item>
      </h-form>
    </div>
    <!--数据展示表格-->
    <h-datagrid
      :columns="columns"
      highlight-row
      url="/cpes/trader/queryActiveTrader"
      :bindForm="formItem"
      :onCurrentChange="onCurrentChange"
      :onCurrentChangeCancel="onCurrentChangeCancle"
      :onRowDbClick="doubleHandleClick"
      :autoLoad="false"
      ref="datagrid">
    </h-datagrid>
    <!-- 弹出框模式底部按钮 -->
    <div slot="footer">
      <h-button type="ghost" @click="handleTraderClose">{{$t("m.i.common.close")}}</h-button>
      <h-button type="primary" @click="submitForm">{{$t("m.i.common.commit")}}</h-button>
    </div>
  </h-msg-box>
</template>

<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";

  export default {
    name: "userTraderByBrchNoSearch",
    data() {
      return {
        formItem: {
          brchNo: "",
          traderId: "",
          userName: "",
          memberId: "",
          traderName: ""
        },
        columns: [
          {
            type: "radio",
            title: " ",
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
            title: this.$t('m.i.common.brchCode'),
            key: "brchCode",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          },
          {
            title: this.$t('m.i.common.brchName'),
            key: "brchFullNameZh",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t('m.i.common.traderId'),
            key: "traderId",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t('m.i.common.traderName'),
            key: "traderName",
            hiddenCol: false,
            ellipsis: false
          }

        ],
        currentSelectRow: null,
        currentSelectList: [],
        currentSelectRowInx: []
      };
    },
    props: {
      userTraderWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      params: {
        type: Object
      },
      title: {
        type: String,
        default: "查询交易柜员"
      },
      memberId: String,
      brchCode: String,
      defaultClose: {
        type: Boolean,
        default: true,
      }
    },
    comments: {},
    watch: {
      userTraderWin(val) {
        if (val === true) {
          this.$nextTick(() => {
            this.formItem.brchCode = this.brchCode;
            this.formItem.memberId = this.memberId;
            this.formItem = Object.assign(this.formItem, this.params);
            this.formSearch();
          });
        }
      }
    },

    computed: {
      tempUserTraderWin: {
        get() {
          return this.userTraderWin;
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
      formSearch() {
        this.currentSelectRow = [];
        this.currentSelectList = [];
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
      },
      onCurrentChange(currentRow, oldCurrentRow, _index) {
        this.currentSelectRow = currentRow;
      },
      onCurrentChangeCancle(currentRow, oldCurrentRow, _index) {
        this.currentSelectRow = null;
      },

      doubleHandleClick(arr) {
        this.currentSelectRow = arr;
        this.$emit("userTraderChange", this.currentSelectRow);
        if (this.defaultClose) {
          this.handleTraderClose();
        } else {
          this.formItem.traderId = "";
          this.formItem.traderName = "";
          this.$refs.datagrid.$refs.gridPage.clearElevator();
        }
      },

      handleSelectClick(arr, selectInx) {
        this.currentSelectList = arr;
        this.currentSelectRowInx = selectInx;
        if (arr.length === 0) {
          return false;
        }
      },

      handleTraderClose() {
        this.formItem.traderId = "";
        this.formItem.traderName = "";
        this.$refs.datagrid.$refs.gridPage.clearElevator();
        this.$emit("userTraderWinClose", "");
      },

      submitForm() {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          this.$emit("userTraderChange", this.currentSelectRow);
          if (this.defaultClose) {
            this.handleTraderClose();
          } else {
            this.formItem.traderId = "";
            this.formItem.traderName = "";
            this.$refs.datagrid.$refs.gridPage.clearElevator();
          }
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      }

    }
  };
</script>

<style scoped>

</style>
