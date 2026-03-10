<template>
  <!--用户查询弹出框-->
  <h-msg-box v-model="tempRoleNoSearchWin" width="1000" @on-close="handleClose" class="h-form-table-layer" :maximize="true" :mask-closable="false" @on-maximize="onMaximize">
    <p slot="header">
      <span>角色查询窗口</span>
    </p>
    <!--查询表单-->
    <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
      <h-form-item :label="$t('m.i.common.roleName')" prop="roleName">
        <h-input v-model="formItem.roleName" placeholder="" :maxlength="6"></h-input>
      </h-form-item>
      <h-form-item class="h-form-operate one-form">
        <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
        <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
      </h-form-item>
    </h-form>
    <!--数据展示表格-->
    <h-datagrid :columns="columns"
                highlightRow
                :autoLoad="false"
                url="/sm/msg/msgpush/roleNoSearch/func_queryAllBranchRolesByLegalNo"
                :bindForm="formItem"
                :onRowClick="handleRowClick"
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
    name: "roleNoSearch",
    data() {
      return {
        formItem : {
          roleName: '',
        },
        columns : [
          {
            title: ' ',
            type: 'radio',
            align: 'center',
            width : 50
          },
          {
            type: 'index',
            title: this.$t("m.i.common.index"),
            width: 60,
            align: 'center',
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.common.roleName'),
            key: 'roleName',
            hiddenCol: false,
            sortable: true
          },
        ],
        currentSelectRow : [],
        currentSelectRowInx : [],
        submitFlag : false
      }
    },
    components: {
    },
    watch: {
      tempRoleNoSearchWin(val) {
        if (val == true) {
          this.$nextTick(() => {
            this.$refs.formItem.resetFields();
            this.currentSelectRow = [];
            this.$refs.datagrid.dataChange(1);
          });
        }
      },
    },

    computed: {
      tempRoleNoSearchWin: {
        get() {
          return this.roleNoSearchWin;
        },
        set() {
        },
      },
    },
    props : {
      title:String,
      roleNoSearchWin: {
        type:Boolean,
        default() {
          return false;
        }
      },
    },
    methods: {
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
        if(this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.$emit("roleNoSearchChange", this.currentSelectRow);
      },
      //关闭
      handleClose() {
        this.$emit("roleNoSearchClose", "");
      },
    }
  };
</script>

<style scoped>

</style>
