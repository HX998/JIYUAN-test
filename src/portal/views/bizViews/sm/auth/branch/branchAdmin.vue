<!--机构管理员管理-->
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
            <!--    <h-form-item :label="$t('m.i.common.brchNo')" prop="brchNo">
                  <h-input v-model="formItem.brchNo" readonly icon="android-search" @on-click="queryBrchNo('query')"
                           clearable @on-clear="clearVal('query')"></h-input>
                </h-form-item>-->

                <show-branch v-model="formItem.brchName"  :label="$t('m.i.common.brchName')"  prop="brchName"
                             :showCheckBox="false" :brchNo.sync="formItem.brchNo" :brchName.sync="formItem.brchName"></show-branch>
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
            url="/sm/auth/branch/branchAdmin/func_queryBranchAdminList"
            :bindForm="formItem"
            :onSelectChange="handleSelectClick"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="handleAddForm('syncUser')" v-if="authObj.syncUser && this.btnAuth.syncUser === undefined ? true : this.btnAuth.syncUser.isShow">{{$t("m.i.common.synch")}}</h-button>
              <h-button type="primary" @click="handleAddForm('add')" v-if="authObj.branchAdminAdd">
                {{$t("m.i.common.add")}}
              </h-button>
              <h-button type="primary" @click="handleAddForm('modify')"
                        v-if="authObj.branchAdminModify">
                {{$t("m.i.common.modify")}}
              </h-button>
              <h-button type="primary" @click="handleComfirm" v-if="authObj.branchAdminDelete">
                {{$t("m.i.common.delete")}}
              </h-button>
              <h-button type="primary" @click="resetPwd()" v-if="authObj.resetPwdAuth">
                {{$t("m.i.common.pwdReset")}}
              </h-button>
              <h-button type="primary" @click="userRoleDistribute()" v-if="authObj.userRoleDistributeAuth">
                {{$t("m.i.auth.roleDistribute")}}
              </h-button>
              <h-button type="primary" @click="showAdminMenu()" v-if="authObj.showAdminMenuAuth">
                {{$t("m.i.auth.showAdminMenu")}}
              </h-button>
              <h-button type="primary" @click="lockUser()" v-if="authObj.lockUserAuth">
                {{$t("m.i.common.userStatus")}}
              </h-button>
              <h-button type="primary" @click="dropUser()" v-if="authObj.dropUserAuth">
                {{$t("m.i.auth.dropUser")}}
              </h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--点击新增/修改弹出窗-->
    <h-msg-box v-model="addOrEditWin" width="800" :mask-closable="false" @on-close="handleWinClose"
               class="h-form-search-layer" :maximize="true">
      <p slot="header">
        <span v-if="type==='add'">新增机构管理员</span>
        <span v-if="type==='modify'">修改机构管理员</span>
        <span v-if="type==='syncUser'">同步机构管理员</span>
      </p>
      <div>
        <h-form :model="addForm" :label-width="115" ref="addForm" cols="2" class="h-form-search">
          <h-form-item :label="$t('m.i.common.userNo')" prop="userNo" :required="isRequired" :validRules="userNoRule">
            <div v-if="type!=='syncUser'">
              <h-input v-if="type==='modify'" :value="addForm.userNo" readonly :maxlength="20"
                       placeholder="不超过20位数字或字母"></h-input>
              <h-input v-else v-model="addForm.userNo" :maxlength="20" placeholder="不超过20位数字或字母"></h-input>
            </div>
            <h-row v-if="type==='syncUser'">
              <h-col span="17">
                <h-input v-model="addForm.userNo" :maxlength="20" placeholder="不超过20位数字或字母"></h-input>
              </h-col>
              <h-col span="5" offset="1">
                <h-button type="primary" @click="syncUser()">{{$t("m.i.common.synch")}}</h-button>
              </h-col>
            </h-row>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.userName')" prop="userName" :required="isRequired">
            <h-input v-model="addForm.userName" :maxlength="16"></h-input>
          </h-form-item>
    <!--      <h-form-item :label="$t('m.i.common.brchNo')" prop="brchNo" :required="isRequired">
            <h-input v-if="type=='modify'" :value="addForm.brchNo" readonly :maxlength="10"
                     :placeholder="$t('m.i.common.brchNo')"></h-input>
            <h-input v-else v-model="addForm.brchNo" readonly icon="android-search" :maxlength="10"
                     @on-click="queryBrchNo('add')" clearable @on-clear="clearVal('add')"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.brchName')" prop="brchName">
            <h-input v-model="addForm.brchName" readonly :maxlength="60"></h-input>
          </h-form-item>-->

          <show-branch v-model="addForm.brchNo"  :label="$t('m.i.common.brchNo')"  prop="brchNo" :required="isRequired"
                       :filterable="type==='add'||type==='syncUser'"  showValue :msgBoxWin="addOrEditWin"  :showCheckBox="false" :brchNo.sync="addForm.brchNo" :brchName.sync="addForm.brchName"></show-branch>
          <h-form-item :label="$t('m.i.common.brchName')" prop="brchName" :required="isRequired">
            <h-input v-model="addForm.brchName" readonly></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.phone')" prop="phoneNo" :validRules="phoneNoRule">
            <h-input v-model="addForm.phoneNo" placeholder="区号-号码/11位手机号" :maxlength="13"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.remark')" prop="userRemark">
            <h-input v-model="addForm.userRemark" :maxlength="500"></h-input>
          </h-form-item>
        </h-form>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="addOrEditWin=!addOrEditWin">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="submitForm">{{$t("m.i.common.commit")}}</h-button>

      </div>
    </h-msg-box>
    <!--<show-branch :showBranchWin="showBranchWin" title="机构查询" @brchNoChange="brchNoChange"
                 @showBranchWinClose="showBranchWinClose"></show-branch>-->
    <role-distribute :roleDistributeWin="adminRoleDistributeWin" :userNo="userNo" :brchNo="brchNo" roleType="3"
                     @roleDistributeWinClose="roleDistributeWinClose"
                     @roleDistributeSubmit="roleDistributeSubmit" title="角色分配"></role-distribute>
    <show-branch-menu :showBranchMenuWin="showBranchMenuWin" :userNo="userNo" roleType="2"
                      @showBranchMenuWinClose="showBranchMenuWinClose" title="查看菜单"></show-branch-menu>
  </div>
</template>
<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";

  export default {
    name: "branchAdmin",
    data() {
      return {
        branchList: [],
        formItem: {
          brchNo: "",
          brchName: "",
          userNo: "",
          userName: ""
        },
        //给按钮增加权限
        authObj: {
          syncUser: true,       //同步用户
          branchAdminAdd: true,    //新增机构管理员
          branchAdminModify: true, //修改机构管理员
          branchAdminDelete: true, //删除机构管理员
          resetPwdAuth: true,      //重置密码
          userRoleDistributeAuth: true,//角色分配
          showAdminMenuAuth: true,  //查看机构管理员菜单
          lockUserAuth: true,       //用户状态
          dropUserAuth: true       //置为离线
        },
        btnAuth:"",
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
            ellipsis: false,
            sortable: true
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
              return h("span", val === "0" ? "离线" : "在线");
            }
          },
          //用户状态，0-锁定，1-解锁，2-无效
          {
            title: this.$t("m.i.common.userStatus"),
            key: "isEnable",
            hiddenCol: false,
            ellipsis: false,
            render: (h, params) => {
              let info = params.row.isEnable;
              if (params.row.isEnable === "0") {
                info = "锁定";
              } else if (params.row.isEnable === "1") {
                info = "正常";
              } else {
                info = "无效";
              }
              return h("span", info);
            }
          },
          {
            title: this.$t("m.i.common.userRole"),
            key: "roleName",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("m.i.common.remark"),
            key: "userRemark",
            hiddenCol: true,
            ellipsis: false
          }
        ],
        currentSelectRow: null,
        currentSelectList: [],
        currentSelectRowInx: [],
        type: null,
        isRequired: true,
        addOrEditWin: false,
        submitFlag: false,
        addForm: {
          userId: "",
          userNo: "",
          userName: "",
          brchNo: "",
          brchName: "",
          phoneNo: "",
          userRemark: ""
        },
        userNoRule: [{ test: /^[0-9a-zA-Z]{1,20}$/, trigger: "blur", message: "用户号由不超过20位数字或字母组成" }],
        phoneNoRule: [{ test: /^[\d\-]+$/, trigger: "blur", message: "电话号码应为数字或和'-'组成" }],
        //机构查询弹出框
        //showBranchWin: false,
        //角色分配弹出框
        adminRoleDistributeWin: false,
        //查看菜单弹出框
        showBranchMenuWin: false,
        //区分查询机构号操作类型
        optType: "",
        //选中用户号
        userNo: "",
        brchNo: ""
      };
    },
    watch: {},

    computed: {},
    components: {
      RoleDistribute: () => import(/* webpackChunkName: "sm/auth/branch/roleDistribute" */`@/views/bizViews/sm/auth/branch/roleDistribute`),
      ShowBranchMenu: () => import(/* webpackChunkName: "sm/auth/branch/showBranchMenu" */`@/views/bizViews/sm/auth/branch/showBranchMenu`),
     // ShowBranch: () => import(/* webpackChunkName: "sm/auth/branch/showBranch" */`@/views/bizViews/sm/auth/branch/showBranch`)
    },
    methods: {
      formSearch() {
        this.currentSelectRow = [];
        this.currentSelectList = [];
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
        this.formItem.brchName = "";
        this.formItem.brchNo = "";
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
      handleWinClose() {
        this.$refs.addForm.resetFields();
      },
      // 新增/修改机构管理员
      handleAddForm(str) {
        this.type = str;
        this.isRequired = true;
        if (this.type === "modify") {
          if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
            this.$nextTick(() => {
              this.addForm.userId = this.currentSelectRow.userId;
              this.addForm.userNo = this.currentSelectRow.userNo;
              this.addForm.userName = this.currentSelectRow.userName;
              this.addForm.brchNo = this.currentSelectRow.brchNo;
              this.addForm.brchName = this.currentSelectRow.brchName;
              this.addForm.phoneNo = this.currentSelectRow.phoneNo;
              this.addForm.userRemark = this.currentSelectRow.userRemark;
            });
          } else {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
            this.addOrEditWin = false;
            return;
          }
        } else {
          this.$nextTick(() => {
            this.addFormReset();
          });
        }
        this.addOrEditWin = true;
      },
      addFormReset() {
        this.$nextTick(() => {
          this.addForm.userId = "";
          this.addForm.brchName = "";
          this.formItem.brchNo = "";
          this.$refs.addForm.resetFields();
        });
      },
      //删除机构
      handleComfirm() {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: this.$t("m.i.common.isConfirmDelete") + "?",
            onOk: () => {
              this.handleDel();
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      handleDel() {
        let userNo = this.currentSelectRow.userNo;
        post({ userNo: userNo }, "/sm/auth/branchAdmin/branchAdmin/func_deleteBranchAdmin").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.currentSelectRow = [];
              this.currentSelectList = [];
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      // 重置密码
      resetPwd() {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          if (this.currentSelectRow.isEnable === "1") {
            this.$hMsgBox.confirm({
              title: "重置密码",
              content: "确定要重置密码吗？",
              onOk: () => {
                let userId = this.currentSelectRow.userId;
                let userNo = this.currentSelectRow.userNo;
                post({
                  userId: userId,
                  userNo: userNo
                }, "/sm/auth/branch/branchAdmin/func_resetLegalPersonManagerPwd").then(res => {
                  if (res) {
                    let retCode = res.data.retCode;
                    if (retCode === "000000") {
                      this.$msgTip.success(this);
                      this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                      this.currentSelectRow = [];
                      this.currentSelectList = [];
                    } else {
                      this.$msgTip.error(this, { info: res.data.retMsg });
                    }
                  }
                }).catch(error => {
                  this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
                });
              }
            });
          } else {
            this.$msgTip.info(this, { info: "请选择正常用户" });
          }
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      //角色分配
      userRoleDistribute() {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          this.adminRoleDistributeWin = true;
          this.userNo = this.currentSelectRow.userNo;
          this.brchNo = this.currentSelectRow.brchNo;
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      //查看管理员菜单
      showAdminMenu() {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          this.showBranchMenuWin = true;
          this.userNo = this.currentSelectRow.userNo;
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      // 用户状态，0-锁定，1-解锁，2-无效
      lockUser() {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          if (this.currentSelectRow.isEnable === "0") {
            this.$hMsgBox.confirm({
              title: "解锁用户",
              content: "确定要解锁用户吗？",
              onOk: () => {
                let userNo = this.currentSelectRow.userNo;
                post({ userNo: userNo }, "/sm/auth/branch/branchAdmin/func_unLockLegalPersonManager").then(res => {
                  if (res) {
                    let retCode = res.data.retCode;
                    if (retCode === "000000") {
                      this.$msgTip.success(this);
                      this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                      this.currentSelectRow = [];
                      this.currentSelectList = [];
                    } else {
                      this.$msgTip.error(this, { info: res.data.retMsg });
                    }
                  }
                }).catch(error => {
                  this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
                });
              }
            });
          } else if (this.currentSelectRow.isEnable === "1") {
            this.$hMsgBox.confirm({
              title: "锁定用户",
              content: "确定要锁定用户吗？",
              onOk: () => {
                let userNo = this.currentSelectRow.userNo;
                post({ userNo: userNo }, "/sm/auth/branch/branchAdmin/func_lockLegalPersonManager").then(res => {
                  if (res) {
                    let retCode = res.data.retCode;
                    if (retCode === "000000") {
                      this.$msgTip.success(this);
                      this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                      this.currentSelectRow = [];
                      this.currentSelectList = [];
                    } else {
                      this.$msgTip.error(this, { info: res.data.retMsg });
                    }
                  }
                }).catch(error => {
                  this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
                });
              }
            });
          } else {
            this.$msgTip.info(this, { info: "请选择正常或者锁定的用户" });
          }
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      // 置为离线
      dropUser() {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          if (this.currentSelectRow.loginStatus === "0") {
            this.$msgTip.info(this, { info: "请选择在线用户" });
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
                        this.$msgTip.success(this);
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
      submitForm() {
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            this.submitFlag = true;
            let url = this.type === "modify" ? "/sm/auth/branchAdmin/branchAdmin/func_updateBranchAdmin" : this.type === "syncUser" ? "/sm/auth/branch/branchAdmin/func_syncBranchAdmin" : "/sm/auth/branch/branchAdmin/func_addBranchAdmin";
            post(this.addForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.addOrEditWin = false;
                  let pageNo = this.type === "modify" ? this.$refs.datagrid.pageInfo.pageNo : 1;
                  this.$refs.datagrid.dataChange(pageNo);
                  this.currentSelectRow = [];
                  this.currentSelectList = [];
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      //通过外围同步用户信息
      syncUser() {
        if (this.addForm.userNo !== "") {
          let userNo = this.addForm.userNo;
          post({ userNo: userNo }, "/sm/auth/branchUser/userManager/func_findExternalUser").then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  let userInfo = res.data.retData;
                  this.addForm.userName = userInfo.userName;
                  this.addForm.brchNo = userInfo.brchNo;
                  this.addForm.brchName = userInfo.brchName;
                  this.addForm.phoneNo = userInfo.phoneNo;
                  this.addForm.userRemark = userInfo.userRemark;
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                }
              }
            }
          ).catch(error => {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
          });
        } else {
          this.$msgTip.info(this, { info: "用户号不能为空" });
        }
      },
/*      clearVal(optType) {
        if (optType === "query") {
          this.formItem.brchNo = "";
          this.formItem.brchName = "";
        } else if (optType === "add") {
          this.addForm.brchNo = "";
          this.addForm.brchName = "";
        }
      },*/
     /* //查询机构弹出框
      queryBrchNo(optType) {
        this.showBranchWin = true;
        this.optType = optType;
      },
      //根据弹框所选数据进行赋值
      brchNoChange(info) {
        if (this.optType === "query") {
          this.formItem.brchNo = info[0].id;
          this.formItem.brchName = info[0].title;
        } else if (this.optType === "add") {
          this.addForm.brchNo = info[0].id;
          this.addForm.brchName = info[0].title;
        }
        this.showBranchWin = false;
      },
      showBranchWinClose() {
        this.showBranchWin = false;
      },*/
      roleDistributeWinClose() {
        this.adminRoleDistributeWin = false;
      },
      roleDistributeSubmit() {
        this.adminRoleDistributeWin = false;
        this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
      },
      showBranchMenuWinClose() {
        this.showBranchMenuWin = false;
      }
    },
    mounted() {
      //按钮权限查询 控制按钮显隐
      let id = JSON.parse(window.sessionStorage.getItem("curMenu")).id;
      post({ authId: id }, "/sm/auth/buttonAuth/func_queryButtonByAuthId").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          let retMsg = res.data.retMsg;
          if (retCode === "000000") {
            this.btnAuth = JSON.parse(res.data.retData);
            this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
          } else {
            this.$msgTip.error(this, { info: retMsg });
          }
        } else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });
    },
  };
</script>
