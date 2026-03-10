<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="115" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.common.activeFlag')" prop="isValid">
                  <h-select v-model="formItem.isValid" @on-change="changeStatus()"
                            :clearable="false">
                    <h-option v-for="item in YonList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.bm.authorizedUserName')" prop="authorizedUserName">
                  <h-input v-model="formItem.authorizedUserName" placeholder="" icon="android-search"
                           @on-click="queryUserName('query')" readonly clearable
                           @on-clear="onUserNameClear('query')"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.bm.authorizedRoleName')" prop="authorizedRoleName">
                  <h-input v-model="formItem.authorizedRoleName" placeholder="" icon="android-search"
                           @on-click="queryBranchUser('query')" readonly clearable
                           @on-clear="onBranchUserClear('query')"></h-input>
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
              :bindForm="formItem"
              url="/bm/audit/auditAuthorize/func_pageQueryAuditAuthList"
              :onCurrentChange="onCurrentChangeAuditAuth"
              :onCurrentChangeCancel="onCurrentChangeCancleAuditAuth"
              ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="handleForm()">{{$t('m.i.common.add')}}</h-button>
              <h-button type="primary" v-if="formItem.isValid==='1'" @click="handleAddForm('withdraw')">{{$t('m.i.bm.recoveryAuthority')}}</h-button>
              <h-button type="primary" v-if="formItem.isValid==='0'" @click="handleAddForm('again')">{{$t('m.i.bm.reauthorization')}}</h-button>
            </div>
          </h-datagrid>
          <!-- 点击新增/修改弹出框 -->
          <h-msg-box v-model="addOrEditWin" width="400" class="h-form-search-layer" :maximize="true"
                     :mask-closable="false">
            <p slot="header">
              <span>新增审批授权信息</span>
            </p>
            <h-panel>
              <h-form :model="addOrEditForm" :label-width="115" ref="addOrEditForm" cols="1" class="h-form-search">
                <show-product v-model="addOrEditForm.prodName" :label="$t('m.i.bm.authorizeProdName')" prop="prodName" required
                              :clearProduct="clearProdNo" @productSelectedChange="productSelectedChange"></show-product>
                <h-form-item :label="$t('m.i.bm.authorizeType')" prop="authorizeType" required>
                  <h-select v-model="addOrEditForm.authorizeType" placeholder="" @on-change="authorizeTypeChange">
                    <h-option v-for="item in authorizeTypeList" :value="item.key" :key="item.key">{{item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.bm.authorizedUserNo')" prop="authorizedUserNo" required v-if="addOrEditForm.authorizeType === '0'">
                  <h-input v-model="addOrEditForm.authorizedUserNo" placeholder="" icon="android-search"
                           @on-click="queryUserName('add')" readonly clearable
                           @on-clear="onUserNameClear('add')"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.bm.authorizedUserName')" prop="authorizedUserName" required
                             v-if="addOrEditForm.authorizeType === '0'">
                  <h-input v-model="addOrEditForm.authorizedUserName" placeholder="" readonly></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.bm.authorizedRoleId')" prop="authorizedRoleId" required
                             v-if="addOrEditForm.authorizeType === '1'">
                  <h-input v-model="addOrEditForm.authorizedRoleId" placeholder="" icon="android-search"
                           @on-click="queryBranchUser('add')" readonly clearable
                           @on-clear="onBranchUserClear('add')"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.bm.authorizedRoleName')" prop="authorizedRoleName" required
                             v-if="addOrEditForm.authorizeType === '1'">
                  <h-input v-model="addOrEditForm.authorizedRoleName" placeholder="" readonly></h-input>
                </h-form-item>
              </h-form>
            </h-panel>
            <div slot="footer">
              <h-button type="ghost" @click="addOrEditWin=!addOrEditWin">{{$t("m.i.common.close")}}</h-button>
              <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
              <h-button type="primary" @click="formAdd()">{{$t("m.i.common.commit")}}</h-button>
            </div>
          </h-msg-box>

          <!--被授权用户名称弹出框-->
          <h-msg-box v-model="userSearchWin" width="800" @on-close="userReset" class="h-form-search-layer"
                     :maximize="true" :mask-closable="false" :z-index=1200>
            <p slot="header">
              <span>用户选择</span>
            </p>
            <h-form :model="userFormItem" :label-width="90" ref="userFormItem" cols="4" class="h-form-search">
              <h-form-item :label="$t('m.i.common.userNo')" prop="userNo">
                <h-input v-model="userFormItem.userNo"></h-input>
              </h-form-item>
              <h-form-item :label="$t('m.i.common.userName')" prop="userName">
                <h-input v-model="userFormItem.userName"></h-input>
              </h-form-item>
              <h-form-item class="h-form-operate two-form">
                <h-button type="primary" @click="userFormSearch()">{{$t("m.i.common.search")}}</h-button>
                <h-button type="ghost" @click="userReset()">{{$t("m.i.common.reset")}}</h-button>
              </h-form-item>
            </h-form>
            <h-datagrid
                :columns="userColumns"
                highlight-row
                :autoLoad=false
                url="/sm/auth/user/pageQueryAuditUserByBranchNoAndNotUserIds"
                :bindForm="userFormItem"
                :onCurrentChange="onCurrentChangeUser"
                :onCurrentChangeCancel="onCurrentChangeCancleUser"
                :onRowDbClick="doubleHandleClick"
                ref="userDatagrid">
            </h-datagrid>
            <!-- 弹出框模式底部按钮 -->
            <div slot="footer">
              <h-button type="ghost" @click="userSearchWin=!userSearchWin">{{$t("m.i.common.close")}}</h-button>
              <h-button type="primary" @click="userFormSubmit">{{$t("m.i.common.commit")}}</h-button>
            </div>
          </h-msg-box>

          <!--被授权角色弹出框-->
          <h-msg-box v-model="branchUserSearchWin" width="800" @on-close="branchUserReset" class="h-form-search-layer"
                     :maximize="true" :mask-closable="false" :z-index=1200>
            <p slot="header">
              <span>角色选择</span>
            </p>
            <h-form :model="branchUserFormItem" :label-width="90" ref="branchUserFormItem" cols="4"
                    class="h-form-search">
              <h-form-item :label="$t('m.i.common.roleName')" prop="roleName">
                <h-input v-model="branchUserFormItem.roleName"></h-input>
              </h-form-item>
              <h-form-item :label="$t('m.i.bm.roleIds')" prop="roleIds">
                <h-input v-model="branchUserFormItem.roleIds"></h-input>
              </h-form-item>
              <h-form-item class="h-form-operate two-form">
                <h-button type="primary" @click="branchUserFormSearch()">{{$t("m.i.common.search")}}</h-button>
                <h-button type="ghost" @click="branchUserReset()">{{$t("m.i.common.reset")}}</h-button>
              </h-form-item>
            </h-form>
            <h-datagrid
                :columns="branchUserColumns"
                highlightRow
                :autoLoad="false"
                url="bm/audit/auditAuthorize/func_pageQueryAuditRolesByBranchNoAndNotRoleIds"
                :bindForm="branchUserFormItem"
                :onCurrentChange="onCurrentChangeBranchUser"
                :onCurrentChangeCancel="onCurrentChangeCancleBranchUser"
                :onRowDbClick="doubleHandleClick1"
                ref="branchUserDatagrid">
            </h-datagrid>
            <div slot="footer">
              <h-button type="ghost" @click="branchUserSearchWin=!branchUserSearchWin">{{$t("m.i.common.close")}}
              </h-button>
              <h-button type="primary" @click="branchUserFormSubmit">{{$t("m.i.common.commit")}}</h-button>
            </div>
          </h-msg-box>
        </div>
      </h-col>
    </h-row>
  </div>
</template>
<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";

  export default {
    name: "auditAuthorize",
    components: {},
    data() {
      return {
        columns: [
          {
            title: " ",
            type: "radio",
            align: "center",
            width: 50
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          },

          {
            title: this.$t('m.i.bm.authorizedProdNo'),
            key: "prodNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.bm.authorizedProdName'),
            key: "prodName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.bm.authorizedRoleName'),
            key: "authorizedRoleName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.bm.authorizedRoleId'),
            key: "authorizedRoleId",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.bm.authorizedUserNo'),
            key: "authorizedUserNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.bm.authorizedUserName'),
            key: "authorizedUserName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.activeFlag'),
            key: "isValid",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.YonList;
              let isValid = params.row.isValid;
              for (let i = 0; i < list.length; i++) {
                if (params.row.isValid === list[i].key) {
                  isValid = list[i].value;
                }
              }
              return h("span", isValid);
            }
          }
        ],
        formItem: {
          isValid: "1",
          authorizedUserNo: "",
          authorizedRoleId: "",
          authorizedRoleName: "",
          authorizedUserName: ""
        },
        addOrEditForm: {
          prodNo: "",
          prodName: "",
          authorizeType: "",
          authorizedUserNo: "",
          authorizedRoleId: "",
          authorizedRoleName: "",
          authorizedUserName: ""
        },
        userFormItem: {
          userNo: "",
          userName: ""
        },
        userColumns: [
          {
            title: " ",
            type: "radio",
            align: "center",
            width: 50
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          },

          {
            title: this.$t('m.i.common.userNo'),
            key: "userNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.userName'),
            key: "userName",
            hiddenCol: false
          }
        ],
        branchUserFormItem: {
          roleName: "",
          roleIds: ""
        },
        branchUserColumns: [
          {
            title: " ",
            type: "radio",
            align: "center",
            width: 50
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          },

          {
            title: this.$t('m.i.common.roleName'),
            key: "roleName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.bm.roleIds'),
            key: "id",
            hiddenCol: false
          }
        ],
        selectAuditAuth: null,
        selectUser: null,
        selectBranchUser: null,
        tableRef: "selfTable",
        YonList: [],
        isValids: [],
        userSearchWin: false,
        ifShowMore: false,
        branchUserSearchWin: false,
        addOrEditWin: false,
        submitFlag: false,
        authorizeTypeList: []
      };
    },
    methods: {
      doubleHandleClick(currentRow) {
        this.selectUser = currentRow;
        this.userFormSubmit();
      },
      doubleHandleClick1(currentRow) {
        this.selectBranchUser = currentRow;
        this.branchUserFormSubmit();
      },
      onUserNameClear(type) {
        if (type === "query") {
          this.formItem.authorizedUserNo = "";
          this.formItem.authorizedUserName = "";
        }
        if (type === "add") {
          this.addOrEditForm.authorizedUserNo = "";
          this.addOrEditForm.authorizedUserName = "";
        }
      },
      onBranchUserClear(type) {
        if (type === "query") {
          this.formItem.authorizedRoleId = "";
          this.formItem.authorizedRoleName = "";
        }
        if (type === "add") {
          this.addOrEditForm.authorizedRoleId = "";
          this.addOrEditForm.authorizedRoleName = "";
        }
      },
      //查询
      formSearch() {
        this.$refs.datagrid.dataChange(1);
      },
      //重置
      formSearchReset() {
        this.formItem.authorizedUserNo = "";
        this.formItem.authorizedRoleId = "";
        this.$refs.formItem.resetFields();
      },
      //是否生效修改后刷新界面
      changeStatus() {
        this.formSearch();
      },
      //用户选择弹出框查询
      userFormSearch() {
        this.$refs.userDatagrid.dataChange(1);
      },
      //用户选择弹出框重置
      userReset() {
        this.$refs.userFormItem.resetFields();
      },
      //用户选择弹出框选择
      userSelectClick(arr, selectInx) {
        this.userSelectRow = arr;
        this.userSelectRowInx = selectInx;
      },
      //点击被授权用户名称弹出框
      queryUserName(type) {
        this.type = type;
        this.userSearchWin = true;
        this.$nextTick(() => {
          this.userFormSearch();
        });
      },
      //用户选择弹出框确认按钮
      userFormSubmit() {
        if (this.selectUser == null) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        if (this.type === "query") {
          this.formItem.authorizedUserNo = this.selectUser.userNo;
          this.formItem.authorizedUserName = this.selectUser.userName;
        }
        if (this.type === "add") {
          this.addOrEditForm.authorizedUserNo = this.selectUser.userNo;
          this.addOrEditForm.authorizedUserName = this.selectUser.userName;
        }
        this.selectUser = null;
        this.userSearchWin = false;
      },
      //被授权角色弹出框查询
      branchUserFormSearch() {
        this.$refs.branchUserDatagrid.dataChange(1);

      },
      //被授权角色弹出框重置
      branchUserReset() {
        this.$refs.branchUserFormItem.resetFields();
      },
      //被授权角色弹出框选择
      branchUserSelectClick(arr, selectInx) {
        this.branchUserSelectRow = arr;
        this.branchUserSelectRowInx = selectInx;
      },
      //被授权角色查询框按钮
      queryBranchUser(type) {
        this.type = type;
        this.branchUserSearchWin = true;
        this.$nextTick(() => {
          this.branchUserFormSearch();
        });
      },
      //被授权角色弹出框确认按钮
      branchUserFormSubmit() {
        if (this.selectBranchUser == null) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        if (this.type === "query") {
          this.formItem.authorizedRoleId = this.selectBranchUser.id;
          this.formItem.authorizedRoleName = this.selectBranchUser.roleName;
        }
        if (this.type === "add") {
          this.addOrEditForm.authorizedRoleId = this.selectBranchUser.id;
          this.addOrEditForm.authorizedRoleName = this.selectBranchUser.roleName;
        }
        this.selectBranchUser = null;
        this.branchUserSearchWin = false;
      },
      clearProdNo() {
        this.addOrEditForm.prodName = "";
        this.addOrEditForm.prodNo = "";
      },
      //选择产品名称弹出框确认
      productSelectedChange(arr) {
        this.addOrEditForm.prodName = arr[0].title;
        this.addOrEditForm.prodNo = arr[0].id;
      },
      //新增
      handleForm() {
        this.addOrEditWin = true;
        this.$nextTick(() => {
          this.$refs.addOrEditForm.resetFields();
        });
      },
      onCurrentChangeAuditAuth(currentRow, oldCurrentRow, _index) {
        this.selectAuditAuth = currentRow;
      },
      onCurrentChangeCancleAuditAuth(currentRow, oldCurrentRow, _index) {
        this.selectAuditAuth = null;
      },
      onCurrentChangeUser(currentRow, oldCurrentRow, _index) {
        this.selectUser = currentRow;
      },
      onCurrentChangeCancleUser(currentRow, oldCurrentRow, _index) {
        this.selectUser = null;
      },
      onCurrentChangeBranchUser(currentRow, oldCurrentRow, _index) {
        this.selectBranchUser = currentRow;
      },
      onCurrentChangeCancleBranchUser(currentRow, oldCurrentRow, _index) {
        this.selectBranchUser = null;
      },
      //新增提交
      formAdd() {
        this.$refs["addOrEditForm"].validate(valid => {
          if (valid) {
            let url = "/bm/audit/auditAuthorize/func_insertAuditAuth";
            this.submitFlag = true;
            post(this.addOrEditForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this, { info: msg });
                  this.addOrEditWin = false;
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                  this.selectAuditAuth = null;
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      //收回授权、重新授权
      handleAddForm: function(type) {
        this.type = type;
        if (!this.selectAuditAuth) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        if (this.type === "withdraw") {
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: "确认要收回权限吗?",
            onOk: () => {
              this.handleDel();
            }
          });
        }
        if (this.type === "again") {
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: "确认要重新授权吗?",
            onOk: () => {
              this.handleDel();
            }
          });
        }
      },
      handleDel() {
        let select = this.selectAuditAuth;
        let ids = select.id;
        if (this.type === "withdraw") {
          this.isValids = "0";
        }
        if (this.type === "again") {
          this.isValids = "1";
        }
        post({ id: ids, isValid: this.isValids }, "/bm/audit/auditAuthorize/func_updateAuditAuth").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              if (this.isValids === "0") {
                this.$msgTip.success(this, { info: "" });
              }
              if (this.isValids === "1") {
                this.$msgTip.success(this, { info: "" });
              }
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.selectAuditAuth = null;
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      authorizeTypeChange() {
        this.addOrEditForm.authorizedUserNo = "";
        this.addOrEditForm.authorizedUserName = "";
        this.addOrEditForm.authorizedRoleId = "";
        this.addOrEditForm.authorizedRoleName = "";
      }
    },
    mounted() {
      this.getDictListByGroups("Yon,AuditAuth").then(res => {
        this.authorizeTypeList = res.get("AuditAuth");
        this.YonList = res.get("Yon");
        this.dictMap = res.get("map");
      });
    }
  };
</script>

<style scoped>

</style>
