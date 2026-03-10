<template>
  <!--法人编号弹出框-->
  <h-msg-box v-model="tempLegalNoSearchWin" width="1000" @on-close="handleClose" class="h-form-table-layer"
             :maximize="true" :mask-closable="false" @on-maximize="onMaximize">
    <p slot="header">
      <span>查询法人窗口</span>
    </p>
    <!--查询表单-->
    <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
      <h-form-item :label="$t('m.i.common.legalNo')" prop="legalNo">
        <h-input v-model="formItem.legalNo" placeholder="" :maxlength="6"></h-input>
      </h-form-item>
      <h-form-item :label="$t('m.i.common.legalpersonName')" prop="legalpersonName">
        <h-input v-model="formItem.legalpersonName" placeholder="" :maxlength="60"></h-input>
      </h-form-item>
      <h-form-item class="h-form-operate two-form">
        <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
        <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
      </h-form-item>
    </h-form>
    <!--数据展示表格-->
    <h-datagrid :columns="columns"
                highlightRow
                :autoLoad="false"
                url="/sm/auth/legalperson/getLegalPersonList"
                :bindForm="formItem"
                :on-select-change="handleRowClick"
                :onRowDbClick="doubleHandleClick"
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
    name: "legalNoSearch",
    data() {
      return {
        formItem: {
          legalNo: "",
          legalpersonName: ""
        },
        columns: [
          {
            title: " ",
            type: "radio",
            align: "center",
            width: 50
          },
          {
            type: "selection",
            width: 60,
            hiddenCol: true,
            align: "center"
          },
          {
            type: "index",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.legalNo'),
            key: "legalNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.common.legalpersonName'),
            key: "legalpersonName",
            hiddenCol: false,
            sortable: true
          }
        ],
        pageInfo: {
          pageNo: 1,
          pageSize: 10
        },
        currentSelectRow: [],
        currentSelectRowInx: [],
        submitFlag: false,

        tableRef: "selfTable"
      };
    },
    components: {},
    watch: {
      tempLegalNoSearchWin(val) {
        if (val == true) {
          this.$nextTick(() => {
            this.$refs.formItem.resetFields();
            this.currentSelectRow = [];
            this.$refs.datagrid.dataChange(1);
          });
        }
      }
    },

    computed: {
      tempLegalNoSearchWin: {
        get() {
          return this.legalNoSearchWin;
        },
        set() {
        }
      }
    },
    props: {
      title: String,
      legalNoSearchWin: {
        type: Boolean,
        default() {
          return false;
        }
      }
    },
    methods: {
      doubleHandleClick(arr) {
        this.currentSelectRow = arr;
        this.$emit("legalNoSearchChange", this.currentSelectRow);
      },
      onMaximize() {
        setTimeout(() => {
          this.$refs.datagrid.$refs.gridContent.handleResize();
        }, 100);
      },
      //查询
      formSearch() {
        this.currentSelectRow = [];
        this.$refs.datagrid.dataChange(1);
      },
      //重置
      formSearchReset() {
        this.$refs.formItem.resetFields();
      },
      //行选中
      handleRowClick(arr) {
        this.currentSelectRow = arr[0];
      },
      //确定
      submitForm() {
        if (this.currentSelectRow === null || this.currentSelectRow === "" || this.currentSelectRow === undefined) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.$emit("legalNoSearchChange", this.currentSelectRow);
      },
      //关闭
      handleClose() {
        this.$emit("legalNoSearchClose", "");
      }
    }
  };
</script>

<style scoped>

</style>
