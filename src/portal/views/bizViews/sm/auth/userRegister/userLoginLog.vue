<!--用户登录日志-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <!--右侧数据展示表格-->
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
            <!--    <h-form-item :label="$t('m.i.common.brchName')" prop="brchName">
                  <h-input v-model="formItem.brchNo" readonly v-show="false" placeholder=""></h-input>
                  <h-input v-model="formItem.brchName" readonly icon="android-search" @on-click="queryBrchNo()"
                           clearable @on-clear="clearVal()" :title="formItem.brchName"></h-input>
                </h-form-item>-->

                <show-branch v-model="formItem.brchNo"  :label="$t('m.i.common.brchName')"  prop="brchName"
                             :showCheckBox="true" :brchNo.sync="formItem.brchNo" :brchName.sync="formItem.brchName"></show-branch>

                <h-form-item :label="$t('m.i.common.userNo')" prop="userNo">
                  <h-input v-model="formItem.userNo" :maxlength="20"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.userName')" prop="userName">
                  <h-input v-model="formItem.userName" :maxlength="60"></h-input>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            highlight-row
            url="/sm/auth/userRegistr/pageQueryUserLogs"
            :bindForm="formItem"
            :autoLoad=false
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left"></div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--<show-branch :showBranchWin="showBranchWin" title="机构查询" @brchNoChange="brchNoChange"
                 ifcheck="true" :checkStrictly="true" @showBranchWinClose="showBranchWinClose"></show-branch>-->
  </div>
</template>

<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";

  export default {
    name: "userLoginLog",
    data() {
      return {
        userNoRule: [{ test: /^[0-9a-zA-Z]{1,20}$/, trigger: "blur", message: "用户号由不超过20位数字或字母组成" }],
        formItem: {
          brchNo: "",
          brchName: "",
          userNo: "",
          userName: "",
          userType: "",
          userLogType: "userLoginLog"
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
            title: this.$t("m.i.common.brchNo"),
            key: "brchNo",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.brchName"),
            key: "brchName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.userNo"),
            key: "userNo",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.userName"),
            key: "userName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.auth.loginTime"),
            key: "createTime",
            hiddenCol: false,
            ellipsis: false,
            sortable: true,
            render: (h, params) => {
              let date = this.$moment(params.row.createTime, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.auth.lastLoginOutDtTm"),
            key: "lastLoginOutDtTm",
            hiddenCol: false,
            ellipsis: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.lastLoginOutDtTm;
              if(date != null){
                 date = this.$moment(params.row.lastLoginOutDtTm, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
              }
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.auth.lastLoginAddr"),
            key: "lastLoginAddr",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("m.i.common.description"),
            key: "userDesc",
            hiddenCol: false
          }
        ],
        currentSelectRow: null,
        //机构查询弹出框
        //showBranchWin: false
      };
    },
    components: {
      //ShowBranch: () => import(/* webpackChunkName: "sm/auth/branch/showBranch" */`@/views/bizViews/sm/auth/branch/showBranch`)
    },
    watch: {},

    computed: {},
    methods: {
      formSearch() {
        //查询时置空机构名称,根据机构号查询
        let branchName = this.formItem.brchName;
        this.formItem.brchName = "";
        this.currentSelectRow = [];
        this.$refs.datagrid.dataChange(1);
        this.formItem.brchName = branchName;
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
        let userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
        this.formItem.brchNo = userInfo.brchNo;
        this.formItem.brchName = userInfo.brchName;
      },

      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
    /*  clearVal() {
        this.formItem.brchNo = "";
        this.formItem.brchName = "";
      },
      //查询机构弹出框
      queryBrchNo() {
        this.showBranchWin = true;
      },
      //根据弹框所选数据进行赋值
      brchNoChange(info) {

        this.formItem.brchNo = "";
        this.formItem.brchName = "";
        for (let i = 0; i < info.length; i++) {
          this.formItem.brchNo += info[i].id;
          this.formItem.brchName += info[i].title;
          if (i < info.length - 1) {
            this.formItem.brchNo += ",";
            this.formItem.brchName += ",";
          }
        }
        this.showBranchWin = false;
      },
      showBranchWinClose() {
        this.showBranchWin = false;
      }*/
    },
    created() {
      let userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
      this.formItem.brchNo = userInfo.brchNo;
      this.formItem.brchName = userInfo.brchName;
      this.formItem.userType = userInfo.userType;
    },
    mounted(){
      this.formSearch();
    }
  };
</script>

<style scoped>

</style>
