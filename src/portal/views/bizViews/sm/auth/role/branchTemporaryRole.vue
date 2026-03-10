<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.auth.tempRoleName')" prop="roleName">
                  <h-input v-model="formItem.roleName" placeholder="" :maxlength=60></h-input>
                </h-form-item>
<!--                <h-form-item :label="$t('m.i.common.brchNo')" prop="brchNo">-->
<!--                  <h-input v-model="formItem.brchNo" readonly icon="android-search" @on-click="queryBrchCodeForSearch"-->
<!--                           placeholder=""></h-input>-->
<!--                </h-form-item>-->
<!--                <h-form-item :label="$t('m.i.common.brchName')" prop="branchName">-->
<!--                  <h-input v-model="formItem.branchName" placeholder="" :maxlength=60 :title="formItem.branchName"></h-input>-->
<!--                </h-form-item>-->
                <show-branch v-model="formItem.branchName"   :label="$t('m.i.common.brchName')"  prop="branchName"
                             :showCheckBox="false" :brchNo.sync="formItem.brchNo" :brchName.sync="formItem.branchName"></show-branch>

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
            url="/sm/auth/branchTemporaryRole/queryRolePageByBranch"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="handleAddForm('add')" v-if="authObj.bizSetRoleAdd">
                {{$t("m.i.common.add")}}
              </h-button>
              <h-button type="primary" @click="handleAddForm('modify')" v-if="authObj.bizSetRoleAdd">
                {{$t("m.i.common.modify")}}
              </h-button>
              <h-button type="primary" @click="handleComfirm()" v-if="authObj.bizSetRoleDelete">
                {{$t("m.i.common.delete")}}
              </h-button>
              <h-button type="primary" @click="handleAuth()" v-if="authObj.bizRoleRightSet">
                {{$t("m.i.auth.setMenu")}}
              </h-button>
              <h-button type="primary" @click="showUser()">{{$t("m.i.auth.showUser")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--点击新增/修改弹出窗-->
    <h-msg-box v-model="addOrEditWin" width="400" class="h-form-search-layer" :maximize="true" :mask-closable="false">
      <p slot="header">
        <span v-if="type=='add'">新增机构临时角色</span>
        <span v-if="type=='modify'">修改机构临时角色</span>
        <span v-if="type=='view'">查看机构临时角色</span>
      </p>
      <div>
        <h-form :model="addForm" :label-width="115" ref="addForm" cols="1" class="h-form-search">
          <h-form-item :label="$t('m.i.common.roleName')" prop="roleName" :required="isRequired">
            <h-input v-if="type=='view'" :value="addForm.roleName" class="input-boder-0"
                     :title="addForm.roleName"></h-input>
            <h-input v-else v-model="addForm.roleName" :maxlength=60></h-input>
          </h-form-item>
  <!--        <h-form-item :label="$t('m.i.common.brchNo')" prop="brchNo" required>
            <h-input v-if="type=='view'" v-model="addForm.brchNo" :placeholder="''" readonly
                     icon="android-search"></h-input>
            <h-input v-else-if="type=='add'" v-model="addForm.brchNo" :placeholder="''" readonly
                     icon="android-search" @on-click="queryBrchCode"></h-input>
            <h-input v-else v-model="addForm.brchNo" :placeholder="''" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.brchName')" prop="branchName">
            <h-input v-if="type=='view'" :value="addForm.branchName" readonly :placeholder="''"></h-input>
            <h-input v-else :value="addForm.branchName" readonly :placeholder="''"></h-input>
          </h-form-item>-->

          <show-branch v-model="addForm.brchNo"  :label="$t('m.i.common.brchNo')"  prop="brchNo"  required
                       :filterable="type=='add'"  showValue :showCheckBox="false" :brchNo.sync="addForm.brchNo" :msgBoxWin="addOrEditWin" :brchName.sync="addForm.branchName" ></show-branch>
          <h-form-item :label="$t('m.i.common.brchName')" prop="branchName" required>
            <h-input  :value="addForm.branchName" readonly :placeholder="''"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.auth.roleDescription')" prop="description" class="h-form-height-auto">

            <h-input v-if="type=='view'" type="textarea" :value="addForm.description" readonly class="input-boder-0"
                     :title="addForm.description" :rows=3 :canResize="false"></h-input>
            <h-input v-else v-model="addForm.description" type="textarea" :maxlength="80" :rows=3
                     :canResize="false"></h-input>
          </h-form-item>
        </h-form>
      </div>
      <div slot="footer" v-if="type!='view'">
        <h-button type="ghost" @click="addOrEditWin=!addOrEditWin">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="submitForm()">{{$t("m.i.common.confirm")}}</h-button>

      </div>
      <div slot="footer" v-else>
        <h-button type="primary" @click="addOrEditWin=!addOrEditWin">{{$t("m.i.common.close")}}</h-button>
      </div>
    </h-msg-box>

    <!--<show-branch :showBranchWin="brchCodeWin" title="机构查询" @brchNoChange="brchNoChange"
                 @showBranchWinClose="brchCodeWinClose"></show-branch>

    <show-branch :showBranchWin="brchCodeWinForSearch" title="机构查询" @brchNoChange="brchNoChangeForSearch"
                 @showBranchWinClose="brchCodeWinCloseForSearch"></show-branch>-->

    <branch-temporary-role-user :showUserWin="showUserWin" :title="showUserRole" :roleId="showUserWinRoleId"
                                @showUserWinClose="showUserWinClose"></branch-temporary-role-user>
    <branch-temporary-role-right :showRoleRightWin="showRoleRightWin" :roleId="roleRightId"
                                 @showRoleRightClose="showRoleRightClose"></branch-temporary-role-right>
  </div>
</template>

<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";

  export default {
    name: "branchTemporaryRole",
    components: {
     // ShowBranch: () => import(/* webpackChunkName: "sm/auth/branch/showBranch" */`@/views/bizViews/sm/auth/branch/showBranch`),
      BranchTemporaryRoleUser: () => import(/* webpackChunkName: "sm/auth/role/branchTemporaryRoleUser" */`@/views/bizViews/sm/auth/role/branchTemporaryRoleUser`),
      BranchTemporaryRoleRight: () => import(/* webpackChunkName: "sm/auth/role/branchTemporaryRoleRight" */`@/views/bizViews/sm/auth/role/branchTemporaryRoleRight`)
    },
    data() {
      return {
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
            key: "xuhao",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.roleName"),
            key: "roleName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.brchNo"),
            key: "brchNo",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.brchName"),
            key: "branchName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.description"),
            key: "description",
            hiddenCol: false
          }
        ],
        formItem: {
          roleName: "",
          brchNo: "",
          branchName: ""
        },
        addForm: {
          id: "",
          roleName: "",
          description: "",
          brchNo: "",
          branchName: ""
        },
        //给按钮增加权限
        authObj: {
          bizSetRoleAdd: true, //角色添加
          bizSetRoleDelete: true, //角色删除
          bizSetRoleORight: true, //角色操作权限
          bizSetRoleARight: true, //角色授权权限
          bizRoleRightSet: true, //角色权限处理
          bizRoleRightCopy: true, //角色权限复制
          bizSetRoleDownload: true //角色信息下载
        },
        // 是否显示新增或修改窗口
        addOrEditWin: false,
        type: null,
        readonly: false,
        isRequired: true,
        deletDisabled: false,
        submitFlag: false,
        copyWin: false,
        //brchCodeWin: false,
        submitWin: false,
        ifShowMore: false,
        //brchCodeWinForSearch: false,
        showUserRole: "",
        showUserWin: false,
        showUserWinRoleId: 0,
        showRightWin: false,
        showRightRole: "",
        currentSelectRow: [],
        roleRightId: "",
        showRoleRightWin: false
      };
    },
    watch: {},

    computed: {},
    methods: {
      showRoleRightClose() {
        this.showRoleRightWin = false;
      },
      showQry(val) {
        this.ifShowMore = val;
      },
      addFormReset() {
        this.$refs.addForm.resetFields();
        this.addForm.id = "";
      },
      handleAddForm(str) {
        this.type = str;
        this.readonly = false;
        this.isRequired = true;
        if (this.type == "modify" || this.type == "view") {
          if (this.currentSelectRow == null || this.currentSelectRow.length === 0) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
            return;
          }
          this.addForm.id = this.currentSelectRow.id;
          this.addForm.roleName = this.currentSelectRow.roleName;
          this.addForm.description = this.currentSelectRow.description;
          this.addForm.brchNo = this.currentSelectRow.brchNo;
          this.addForm.branchName = this.currentSelectRow.branchName;
          // this.queryObjById(this.currentSelectRow.id);
          if (this.addForm.roleType == 1) {
          }
          if (this.type == "modify") {
            this.readonly = true;
          }
          if (this.type == "view") {
            this.isRequired = false;
          }
        } else {
          this.$nextTick(() => {
            this.addFormReset();
          });
        }
        this.addOrEditWin = true;
      },
      queryObjById(id) {
        post({ id: id }, "/sm/auth/branchTemporaryRole/queryRolePageByBranch").then(res => {
          this.submitFlag = false;
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.addForm.id = res.data.retData.id;
              this.addForm.roleName = res.data.retData.roleName;
              this.addForm.description = res.data.retData.description;
              this.addForm.brchNo = res.data.retData.brchNo;
              this.addForm.branchName = res.data.retData.branchName;
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });

      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      formSearch() {
        this.$refs.datagrid.dataChange(1);
        this.currentSelectRow = [];
      },
      formSearchReset() {
          this.formItem.branchName = "";
          this.formItem.brchNo = "";
        this.$refs.formItem.resetFields();
      },
      submitForm() {
        let btnType = this.type;
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            // 新增或修改的url
            let url = this.type == "add" ? "/sm/auth/branchTemporaryRole/branchTemporaryRole/func_addBranchTemporaryRole" : "/sm/auth/branchTemporaryRole/branchTemporaryRole/func_updateBranchTemporaryRole";
            this.submitFlag = true;
            post(this.addForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode == "000000") {
                  this.$msgTip.success(this);
                  this.addOrEditWin = false;
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                  this.currentSelectRow = [];
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

      handleAuth(str) {
        if (this.currentSelectRow == null || this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        let url = this.$route.path + "Right";
        let id = this.currentSelectRow.id;
        let roleName = this.currentSelectRow.roleName;
        let obj = { id: id, roleName: roleName };
        window.sessionStorage.setItem("legalPersonRoleRight", JSON.stringify(obj));
        this.roleRightId = id;
        this.showRoleRightWin = true;
      },
      handleComfirm() {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: this.$t("m.i.common.isConfirmDelete") + "?",
            onOk: () => {
              this.handledel();
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }

      },
      handledel() {
        let delId = this.currentSelectRow.id;
        post({ id: delId }, "/sm/auth/branchTemporaryRole/branchTemporaryRole/func_deleteBranchTemporaryRole").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$msgTip.success(this);
              let pageNo = this.$refs.datagrid.pageInfo.pageNo;
              if (pageNo > 1 && (this.$refs.datagrid.total % this.$refs.datagrid.pageInfo.pageSize == 1)) {
                pageNo -= 1;
              }
              this.$refs.datagrid.dataChange(pageNo);
              this.currentSelectRow = [];
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
     /* //机构弹出框
      queryBrchCode() {
        this.brchCodeWin = true;
      },
      brchCodeWinClose() {
        this.brchCodeWin = false;
      },
      //根据弹框所选数据进行赋值
      brchNoChange(info) {
        let objs = [];
        if (info instanceof Array) {
          objs[0] = info[0];
        } else {
          objs[0] = info;
        }
        this.addForm.brchNo = objs[0].id;
        this.addForm.branchName = objs[0].title;
        this.brchCodeWin = false;
      },*/
     /* //机构弹出框【查询用】
      queryBrchCodeForSearch() {
        this.brchCodeWinForSearch = true;
      },
      brchCodeWinCloseForSearch() {
        this.brchCodeWinForSearch = false;
      },
      //根据弹框所选数据进行赋值
      brchNoChangeForSearch(info) {
        let objs = [];
        if (info instanceof Array) {
          objs[0] = info[0];
        } else {
          objs[0] = info;
        }
        this.formItem.brchNo = objs[0].id;
        this.formItem.branchName = objs[0].title;
        this.brchCodeWinForSearch = false;
      },*/

      /**查看用户*/
      showUser() {
        if (this.currentSelectRow == null || this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        this.showUserRole = this.currentSelectRow.roleName;
        this.showUserWinRoleId = this.currentSelectRow.id;
        this.showUserWin = true;
      },
      showUserWinClose() {
        this.showUserWin = false;
      }
    },
    mounted() {
    }

  };
</script>

<style scoped>

</style>
