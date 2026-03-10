<template>
  <!--查询法人弹出框-->
  <h-msg-box v-model="tempLegalPersonWin" width="1000" :mask-closable="false" @on-close="handleClose" top="10"
             class="h-form-table-layer" :maximize="true">
    <p slot="header">
      <span>查询法人</span>
    </p>
    <!--查询表单-->
    <div>
      <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
        <h-form-item prop="legalNo" :label="$t('m.i.common.legalNo')">
          <h-input v-model="formItem.legalNo" :maxlength="6"></h-input>
        </h-form-item>
        <h-form-item prop="legalpersonName" :label="$t('m.i.common.legalpersonName')">
          <h-input v-model="formItem.legalpersonName" :maxlength="60"></h-input>
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
      url="/sm/auth/legalperson/queryLegalPersonPage"
      :bindForm="formItem"
      :onSelectChange="handleSelectClick"
      :onRowClick="handleRowClick"
      :onRowDbClick="doubleHandleClick"
      :autoLoad=false
      ref="datagrid">
      <div slot="toolbar" class="pull-left"></div>
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
    name: "legalPersonSearch",
    data() {
      return {
        formItem: {
          legalNo: "",
          legalpersonName: ""
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
            title: this.$t("m.i.common.legalNo"),
            key: "legalNo",
            align: "left",
            ellipsis: false,
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.legalpersonName"),
            key: "legalpersonName",
            align: "left",
            ellipsis: false,
            hiddenCol: false,
            sortable: true
          }
        ],
        currentSelectRow: null,
        currentSelectList: [],
        currentSelectRowInx: []
      };
    },
    props: {
      showLegalPersonWin: {
        type: Boolean,
        default() {
          return false;
        }
      }
    },
    comments: {},
    watch: {
      showLegalPersonWin(val) {
        if (val === true) {
          this.$nextTick(() => {
            this.$refs.formItem.resetFields();
            this.formSearch();
          });
        }
      }
    },


    computed: {
      tempLegalPersonWin: {
        get() {
          return this.showLegalPersonWin;
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
          this.currentSelectList = arr;
          this.$emit("legalPersonChange", this.currentSelectList);
      },
      handleClose() {
        this.$refs.datagrid.$refs.gridPage.clearElevator();
        this.$emit("legalPersonWinClose", "");
      },
      submitForm() {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          this.$emit("legalPersonChange", this.currentSelectRow);
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
        }
      }
    }
  };
</script>

<style scoped>

</style>
