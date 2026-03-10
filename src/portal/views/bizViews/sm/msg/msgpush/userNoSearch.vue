<template>
  <!--用户查询弹出框-->
  <h-msg-box v-model="tempUserNoSearchWin" width="1000" @on-close="handleClose" class="h-form-table-layer" :maximize="true" :mask-closable="false" @on-maximize="onMaximize">
    <p slot="header">
      <span>用户查询窗口</span>
    </p>
    <!--查询表单-->
    <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
      <h-form-item :label="$t('m.i.common.userName')" prop="userName">
        <h-input v-model="formItem.userName" placeholder="" :maxlength="6"></h-input>
      </h-form-item>
      <h-form-item :label="$t('m.i.common.userNo')" prop="userNo">
        <h-input v-model="formItem.userNo" placeholder="" :maxlength="60"></h-input>
      </h-form-item>
      <h-form-item class="h-form-operate two-form">
        <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
        <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
      </h-form-item>
    </h-form>
    <!--数据展示表格-->
    <h-datagrid :columns="columns"
                :autoLoad="false"
                rowSelect
                url="/sm/auth/user/queryAllUsersByUserNo"
                :bindForm="formItem"
                :hasSelect="hasSelect"
                ref="datagridUser">
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
    name: "userNoSearch",
    data() {
      return {
        formItem : {
          userNo: '',
          userName: ''
        },
        columns : [
          {
            type: "selection",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            type: 'index',
            title: this.$t("m.i.common.index"),
            width: 60,
            align: 'center',
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.common.userNo'),
            key: 'userNo',
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.common.userName'),
            key: 'userName',
            hiddenCol: false,
            sortable: true
          }
        ],
        pageInfo : {
          pageNo: 1,
          pageSize: 10
        },
        currentSelectRow : [],
        currentSelectRowInx : [],
        currentSelectList:[],
        submitFlag : false,
        hasSelect : false,
        tableRef:"selfTable",
      }
    },
    components: {
    },
    watch: {
      tempUserNoSearchWin(val) {
        if (val == true) {
          this.$nextTick(() => {
            this.$refs.formItem.resetFields();
            this.currentSelectRow = [];
            this.currentSelectList = [];
            this.$refs.datagridUser.dataChange(1);
          });
        }
      },
    },

    computed: {
      tempUserNoSearchWin: {
        get() {
          return this.userNoSearchWin;
        },
        set() {
        },
      },
    },
    props : {
      title:String,
      userNoSearchWin: {
        type:Boolean,
        default() {
          return false;
        }
      },
    },
    methods: {
      onMaximize() {
        setTimeout(() => {
          this.$refs.datagridUser.$refs.gridContent.handleResize();
        }, 100);
      },
      //查询
      formSearch() {
        this.currentSelectRow = [];
        this.currentSelectList=[];
        this.$refs.datagridUser.dataChange(1);
      },
      //重置
      formSearchReset() {
        this.$refs.formItem.resetFields();
      },

      //确定
      submitForm() {
       let  select=this.$refs.datagridUser.selects;
        if(select.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.$emit("userNoSearchChange", select);
        this.hasSelect=true;
      },
      //关闭
      handleClose() {
        this.$emit("userNoSearchClose", "");
      },
    }
  };
</script>

<style scoped>

</style>
