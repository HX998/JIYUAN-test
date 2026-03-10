<template>
  <!--票交机构弹出框-->
  <h-msg-box v-model="tempBrchCodeWin" width="1000" :mask-closable="false" @on-close="handleClose" top="10"
             class="h-form-table-layer" :maximize="true">
    <p slot="header">
      <span>{{title}}</span>
    </p>
    <!--查询表单-->
    <div>
      <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
        <h-form-item :label="$t('m.i.common.brchFullNameZh')" prop="brchFullNameZh">
          <h-input v-model="formItem.brchFullNameZh"></h-input>
        </h-form-item>
        <h-form-item :label="$t('m.i.common.brchCode')" prop="brchCode">
          <h-input v-model="formItem.brchCode"></h-input>
        </h-form-item>
        <h-form-item :label="$t('m.i.common.transBrchBankNo')" prop="transBrchBankNo">
          <h-input v-model="formItem.transBrchBankNo"></h-input>
        </h-form-item>
        <h-form-item class="h-form-operate">
          <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
          <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
        </h-form-item>
      </h-form>
    </div>
    <!--数据展示表格-->
    <h-datagrid
      :columns="columns"
      highlight-row
      :url="datagridUrl"
      :bindForm="formItem"
      :onRowClick="handleRowClick"
      :onSelectChange="handleSelectClick"
      :onRowDbClick="doubleHandleClick"
      :autoLoad=false
      ref="datagrid">
    </h-datagrid>
    <!-- 弹出框模式底部按钮 -->
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
      <h-button type="primary" @click="submitForm">{{$t("m.i.common.commit")}}</h-button>
    </div>
  </h-msg-box>
</template>

<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";

  export default {
    name: "buyBrchNameSearch",
    data() {
      return {
        formItem: {
          brchFullNameZh: "",
          brchCode: "",
          transBrchBankNo: ""
        },
        columns: [
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.brchCode"),
            key: "brchCode",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.brchFullNameZh"),
            key: "brchFullNameZh",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.transBrchBankNo"),
            key: "transBrchBankNo",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("m.i.common.memberId"),
            key: "memberId",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("m.i.common.memberName"),
            key: "memberName",
            hiddenCol: false,
            ellipsis: false
          }
        ],
        datagridUrl: "/shcpe/cpes/branch/agencyInformation/func_queryBranchs",
        currentSelectRow: null,
        currentSelectList: [],
        currentSelectRowInx: []
      };
    },
    props: {
      brchCodeWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      title: {
        type: String,
        default: "查询票交机构"
      },
      //1-只查询当前会员下的票交机构，2-查询全部
      optType: {
        type: String,
        default: "1"
      }
    },
    comments: {},
    watch: {
      brchCodeWin(val) {
        if (val === true) {
          this.datagridUrl = this.optType === "1" ? "/shcpe/cpes/branch/agencyInformation/func_queryBranchs" : "/cpes/branch/queryBranchList";
          this.$nextTick(() => {
            this.$refs.formItem.resetFields();
            this.formSearch();
          });
        }
      }
    },

    computed: {
      tempBrchCodeWin: {
        get() {
          return this.brchCodeWin;
        },
        set() {
        }
      }
    },
    methods: {
      formSearch() {
        this.currentSelectRow = [];
        this.currentSelectList = [];
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
      },
      handleRowClick(arr) {
        this.currentSelectRow = arr[0];
      },
      handleSelectClick(arr, selectInx) {
        this.currentSelectList = arr;
        this.currentSelectRowInx = selectInx;
        if (arr.length === 0) {
          return false;
        }
      },
      doubleHandleClick(arr) {
        this.currentSelectRow = arr;
        this.$emit("brchCodeChange", this.currentSelectRow);
      },
      handleClose() {
        this.$refs.datagrid.$refs.gridPage.clearElevator();
        this.$emit("brchCodeWinClose", "");
      },
      submitForm() {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          this.$emit("brchCodeChange", this.currentSelectRow);
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      }
    }
  };
</script>

<style scoped>

</style>
