<template>
  <!--总行票交机构弹出框-->
  <h-msg-box v-model="tempBrchCodeWin" width="1000" @on-close="handleClose" class="h-form-table-layer" :maximize="true"
             :mask-closable="false" @on-maximize="onMaximize">
    <p slot="header">
      <span>查询总行票交机构代码</span>
    </p>
    <!--查询表单-->
    <div>
      <h-form :model="formItem" :label-width="80" ref="formItem" cols="4" class="h-form-search">
        <h-form-item :label="$t('m.i.common.brchName')" prop="brchFullNameZh">
          <h-input v-model="formItem.brchFullNameZh" :maxlength="60"></h-input>
        </h-form-item>
        <h-form-item :label="$t('m.i.common.brchCode')" prop="brchCode">
          <h-input v-model="formItem.brchCode" :maxlength="20"></h-input>
        </h-form-item>
        <h-form-item class="h-form-operate two-form">
          <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
          <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
        </h-form-item>
      </h-form>
    </div>
    <!--数据展示表格-->
    <h-datagrid :columns="columns"
                highlightRow
                :autoLoad="false"
                url="/cpes/branch/brchCodeSearch/func_getLegalBranchCodeSearch"
                :bindForm="formItem"
                :on-select-change="handleRowClick"
                :onRowDbClick="doubleHandleClick"
                ref="datagrid">
    </h-datagrid>
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
      <h-button type="primary" @click="submitForm">{{$t("m.i.common.commit")}}</h-button>
    </div>
  </h-msg-box>
  <!-- 弹出框模式底部按钮 -->
</template>

<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";

  export default {
    name: "brchCodeSearch",
    data() {
      return {
        formItem: {
          brchFullNameZh: "",
          brchCode: "",
          memberId: ""
        },
        pageInfo: {
          pageNo: 1,
          pageSize: 10
        },
        columns: [
          {
            type: "radio",
            title: " ",
            width: 60,
            hiddenCol: false
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
            title: this.$t('m.i.common.memberId'),
            key: "memberId",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.memberName'),
            key: "memberName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.brchCode'),
            key: "brchCode",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.brchName'),
            key: "brchFullNameZh",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.bankNo"),
            key: "transBrchBankNo",
            hiddenCol: false
          }
        ],
        currentSelectRow: null,
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
      needMemberId: ""
    },
    watch: {
      tempBrchCodeWin(val) {
        if (val == true) {
          this.$nextTick(() => {
            this.$refs.formItem.resetFields();
            this.formItem.memberId = this.needMemberId;
            this.currentSelectRow = null;
            this.$refs.datagrid.dataChange(1);
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
      doubleHandleClick(arr) {
        this.currentSelectRow = arr;
        this.$emit("brchCodeWinSubmit", this.currentSelectRow);
      },
      onMaximize() {
        setTimeout(() => {
          this.$refs.datagrid.$refs.gridContent.handleResize();
        }, 100);
      },
      //查询
      formSearch() {
        this.$refs.datagrid.dataChange(1);
        this.currentSelectRow = null;
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
        this.$emit("brchCodeWinSubmit", this.currentSelectRow);
      },
      //关闭
      handleClose() {
        this.$emit("branchCodeWinClose", "");
      },
    }
  };
</script>

<style scoped>

</style>
