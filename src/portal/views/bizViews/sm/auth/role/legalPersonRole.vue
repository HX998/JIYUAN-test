<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.common.roleName')" prop="roleName">
                  <h-input v-model="formItem.roleName" placeholder="" :maxlength=60></h-input>
                </h-form-item>
                <h-form-item class="h-form-operate one-form">
                  <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--查询表单-->
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            highlight-row
            url="/sm/auth/role/legalPersonRole/func_queryRolePageByType"
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
              <h-button type="primary" @click="handleAuth()" v-if="authObj.bizRoleRightSet">{{$t("m.i.auth.setMenu")}}
              </h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <!--点击新增/修改弹出窗-->
    <h-msg-box v-model="addOrEditWin" width="400" class="h-form-search-layer" :maximize="true" :mask-closable="false">
      <p slot="header">
        <span v-if="type=='add'">新增法人角色</span>
        <span v-if="type=='modify'">修改法人角色</span>
        <span v-if="type=='view'">查看法人角色</span>
      </p>
      <div>
        <h-form :model="addForm" :label-width="115" ref="addForm" cols="1" class="h-form-search">
          <h-form-item :label="$t('m.i.common.roleName')" prop="roleName" :required="isRequired">
            <h-input v-if="type=='view'" :value="addForm.roleName" roleName class="input-boder-0"
                     :title="addForm.roleName"></h-input>
            <h-input v-else v-model="addForm.roleName" :maxlength=60 placeholder=""></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.auth.roleDescription')" prop="description" style="height:72px;">
            <h-input v-if="type=='view'" type="textarea" :value="addForm.description" readonly class="input-boder-0"
                     :title="addForm.description" :canResize="false"></h-input>
            <h-input v-else v-model="addForm.description" type="textarea" :maxlength="80" :canResize="false"
                     placeholder=""></h-input>
          </h-form-item>
        </h-form>
      </div>
      <div slot="footer" v-if="type!='view'">
        <h-button type="ghost" style="margin:0 8px" @click="addOrEditWin=!addOrEditWin">{{$t("m.i.common.close")}}
        </h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="submitForm()">{{$t("m.i.common.confirm")}}</h-button>

      </div>
      <div slot="footer" v-else>
        <h-button type="primary" @click="addOrEditWin=!addOrEditWin">{{$t("m.i.common.close")}}</h-button>
      </div>
    </h-msg-box>
    <legal-person-role-right :showLegalRoleWin="showLegalRoleWin" :roleId="roleRightId"
                             @legalRoleWinClose="legalRoleWinClose">
    </legal-person-role-right>
  </div>
</template>

<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";

  export default {
    name: "legalPersonRole",
    components: {
      LegalPersonRoleRight: () => import(/* webpackChunkName: "sm/auth/role/legalPersonRoleRight" */`@/views/bizViews/sm/auth/role/legalPersonRoleRight`)
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
            title: this.$t("m.i.common.description"),
            key: "description",
            hiddenCol: false

          }
        ],
        formItem: {
          roleName: ""
        },
        addForm: {
          id: 0,
          roleName: "",
          description: ""
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
        roleNameRule: [{ test: this.validRoleName, trigger: "blur" }],
        submitWin: false,
        submitMsg: "",
        submitTitle: "",
        ifShowMore: false,
        currentSelectRow: [],
        roleRightId: "",
        showLegalRoleWin: false
      };
    },
    watch: {},

    computed: {},
    methods: {
      legalRoleWinClose() {
        this.showLegalRoleWin = false;
      },
      addFormReset() {
        this.$refs.addForm.resetFields();
        this.addForm.id = "";
      },
      handleAddForm(str) {
        this.type = str;
        this.readonly = false;
        this.isRequired = true;
        this.addForm.schemeId = "";
        this.addForm.schemeName = "";
        if (this.type == "modify" || this.type == "view") {
          if (this.currentSelectRow == null || this.currentSelectRow.length === 0) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
            return;
          }
          this.queryObjById(this.currentSelectRow.id);
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
        post({ id: id }, "/sm/auth/role/legalPersonRole/func_queryRole").then(res => {
          this.submitFlag = false;
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.addForm.id = res.data.retData.id;
              this.addForm.roleName = res.data.retData.roleName;
              this.addForm.description = res.data.retData.description;
            } else {
              this.submitMsg = "查询失败";
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
        this.currentSelectRow = [];
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
      },
      submitForm() {
        let btnType = this.type;
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            // 新增或修改的url
            let url = this.type == "add" ? "/sm/auth/role/legalPersonRole/func_addRole" : "/sm/auth/role/legalPersonRole/func_updateRole";
            let msg = this.type == "add" ? this.$t("m.i.common.addSuccess") : this.$t("m.i.common.modifySuccess");
            let pageNo = this.type === "add" ? 1 : this.$refs.datagrid.pageInfo.pageNo;
            this.submitMsg = msg;
            this.submitFlag = true;
            post(this.addForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode == "000000") {
                  this.$msgTip.success(this);
                  this.$refs.datagrid.dataChange(pageNo);
                  this.currentSelectRow = [];
                  this.addOrEditWin = false;
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
        this.roleRightId = id.toString();
        this.showLegalRoleWin = true;
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
        post({ id: delId }, "/sm/auth/role/legalPersonRole/func_deleteRole").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
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
      validRoleName(rule, val, callback) {
        let re = /^[\w\u4e00-\u9fa5\（\）\(\)\-S]*$/;
        if (re.test(val)) {
          callback();
        } else {
          callback(new Error("非法输入，只能输入中文、英文、数字、小括号和下划线"));
        }
      }
    }

  };
</script>

<style scoped>

</style>
