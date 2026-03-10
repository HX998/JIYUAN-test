<!-- session管理 -->
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
                <h-form-item :label="$t('m.i.common.userNo')" prop="userNo" :validRules="userNoRule">
                  <h-input v-model="formItem.userNo" :maxlength="20"></h-input>
                </h-form-item>
                <h-form-item class="h-form-operate one-form">
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
            url="/sm/auth/session/sessionManage/func_querySession"
            :bindForm="formItem"
            :onSelectChange="handleSelectClick"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="dropUser()" v-if="authObj.dropUserAuth">
                {{$t("m.i.auth.dropUser")}}
              </h-button>
              <h-button type="primary" @click="dropAllUser()" v-if="isShow">{{$t("m.i.auth.dropAllUser")}}
              </h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
  </div>
</template>

<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";

  export default {
    name: "sessionManage",
    data() {
      return {
        userNoRule: [{ test: /^[0-9a-zA-Z]{1,20}$/, trigger: "blur", message: "用户号由不超过20位数字或字母组成" }],
        formItem: {
          userNo: ""
        },
        //给按钮增加权限
        authObj: {
          dropUserAuth: true,       //置为离线
          dropAllUserAuth: true       //全部置为离线
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
            ellipsis: false
          },
          {
            title: this.$t("m.i.common.brchNo"),
            key: "brchNo",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("m.i.common.brchName"),
            key: "brchName",
            hiddenCol: false,
            ellipsis: false
          },
          //在线状态，0-离线，1-在线
          {
            title: this.$t("m.i.auth.loginStatus"),
            key: "loginStatus",
            hiddenCol: false,
            ellipsis: false,
            render: (h, params) => {
              let val = params.row.loginStatus;
              return h("div", val === "0" ? "离线" : "在线");
            }
          },
          {
            title: this.$t("m.i.auth.loginTime"),
            key: "lastLoginDtTm",
            hiddenCol: false,
            render: (h,params) => {
              let val = params.row.lastLoginDtTm;
              return h("div", this.$moment(val).format("YYYY-MM-DD HH:mm:ss"));
            }
          },
          {
            title: this.$t("m.i.auth.lastLoginAddr"),
            key: "lastLoginAddr",
            hiddenCol: false,
          },
        ],
        currentSelectRow: null,
        currentSelectList: [],
        currentSelectRowInx: []
      };
    },
    components: {},
    watch: {},

    computed: {
      isShow() {
        let userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
        let userType = userInfo.userType;
        return this.authObj.dropAllUserAuth && userType === "1";
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
      handleSelectClick(arr, selectInx) {
        this.currentSelectList = arr;
        this.currentSelectRowInx = selectInx;
        if (arr.length === 0) {
          return false;
        }
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      // 置为离线
      dropUser() {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          let userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
          let userNo = userInfo.userNo;
          let loginAddress = userInfo.loginAddress;
          if (this.currentSelectRow.userNo === userNo && this.currentSelectRow.loginAddress === loginAddress) {
            this.$msgTip.info(this, { info: "当前登录用户不可置为离线，请选择其他在线用户" });
          } else {
            this.$hMsgBox.confirm({
              title: "置为离线",
              content: "确定要置为离线吗？",
              onOk: () => {
                let userId = this.currentSelectRow.userId;
                let userNo = this.currentSelectRow.userNo;
                post({ userId: userId, userNo: userNo }, "/sm/auth/user/offLine").then(res => {
                    if (res) {
                      let retCode = res.data.retCode;
                      if (retCode === "000000") {
                        this.$msgTip.success(this, { info: "该用户已置为离线" });
                        this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                        this.currentSelectRow = [];
                        this.currentSelectList = [];
                      } else {
                        this.$msgTip.error(this, { info: res.data.retMsg });
                      }
                    }
                  }
                ).catch(error => {
                  this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
                });
              }
            });
          }
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      //全部置为离线
      dropAllUser() {
        this.$hMsgBox.confirm({
          title: "全部置为离线",
          content: "确定要全部置为离线吗？",
          onOk: () => {
            post({}, "/sm/auth/session/sessionManage/func_allOffLine").then(res => {
                if (res) {
                  let retCode = res.data.retCode;
                  if (retCode === "000000") {
                    this.$msgTip.success(this);
                    this.$refs.datagrid.dataChange(1);
                    this.currentSelectRow = [];
                    this.currentSelectList = [];
                    // this.$store.dispatch("Logout").then(() => {
                    //   location.reload();
                    // });
                  } else {
                    this.$msgTip.error(this, { info: res.data.retMsg });
                  }
                }
              }
            ).catch(error => {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
            });
          }
        });
      }
    }
  };
</script>

<style scoped>

</style>
