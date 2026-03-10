<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.common.custMgrNo')" prop="custMgrNo">
                  <h-input v-model="formItem.custMgrNo" :maxlength=50></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.custMgrName')" prop="custMgrName">
                  <h-input v-model="formItem.custMgrName" :maxlength=60></h-input>
                </h-form-item>
                <h-form-item class="h-form-operate two-form">
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
              url="/bm/cust/manager/custManager/func_pageQueryCustManagerList"
              :bindForm="formItem"
              :hasSelect="false"
              rowSelect
              ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="handleAddForm('add')" v-if="authObj.bizSetRoleAdd">
                {{$t("m.i.common.add")}}
              </h-button>
              <h-button type="primary" @click="handleAddForm('modify')" v-if="authObj.bizSetRoleAdd">
                {{$t("m.i.common.modify")}}
              </h-button>
              <h-button type="primary" @click="handleComfirm()" v-if="authObj.bizSetRoleDelete"
                        :disabled="deletDisabled">{{$t("m.i.common.delete")}}
              </h-button>
            </div>

          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <!--点击新增/修改弹出窗-->
    <h-msg-box v-model="addOrEditWin" width="1000" class="h-form-table-layer" :maximize="true" :mask-closable="false">
      <p slot="header">
        <span v-if="type=='add'">新增客户经理信息</span>
        <span v-if="type=='modify'">修改客户经理信息</span>
        <span v-if="type=='view'">查看客户经理信息</span>
      </p>
      <h-panel>
        <h-form :model="addForm" :label-width="120" ref="addForm" cols="2" class="h-form-search">
          <h-form-item :label="$t('m.i.common.custMgrNo')" prop="custMgrNo" :required="isRequired" :validRules="mgrNoRule">
            <h-input v-if="type=='view'" :value="addForm.custMgrNo" class="input-boder-0"
                     :title="addForm.custMgrNo"></h-input>
            <h-input v-else-if="type=='modify'" v-model="addForm.custMgrNo" readonly :maxlength=20
                     :placeholder="'20位以下字母或数字'"></h-input>
            <h-input v-else v-model="addForm.custMgrNo" :maxlength=20 :placeholder="'20位以下字母或数字'"></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.custMgrName')" prop="custMgrName" :required="isRequired">
            <h-input v-if="type=='view'" :value="addForm.custMgrName" class="input-boder-0"
                     :title="addForm.custMgrName"></h-input>
            <h-input v-else v-model="addForm.custMgrName" :maxlength=16></h-input>
          </h-form-item>

          <show-branch v-model="addForm.custMgrBrchNo" :label="$t('m.i.common.custMgrBrchNo')" prop="custMgrBrchNo"
                       :required="isRequired" :showCheckBox="false" :msgBoxWin="addOrEditWin" showValue
                       title="机构名称" :brchNo.sync="addForm.custMgrBrchNo" :brchName.sync="addForm.custMgrBrchName">
          </show-branch>

          <h-form-item :label="$t('m.i.common.custMgrBrchName')" prop="custMgrBrchName" :required="isRequired" class="h-form-long-label">
            <h-input v-if="type=='view'" :value="addForm.custMgrBrchName" class="input-boder-0"
                     :title="addForm.custMgrBrchName"></h-input>
            <h-input v-else v-model="addForm.custMgrBrchName" :maxlength=60 readonly></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.custMgrTeam')" prop="custMgrTeam">
            <h-input v-if="type=='view'" :value="addForm.custMgrTeam" class="input-boder-0"
                     :title="addForm.custMgrTeam"></h-input>
            <h-input v-else v-model="addForm.custMgrTeam" :maxlength=66></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.custMgrDeptName')" prop="custMgrDeptName">
            <h-input v-if="type=='view'" :value="addForm.custMgrDeptName" class="input-boder-0"
                     :title="addForm.custMgrDeptName"></h-input>
            <h-input v-else v-model="addForm.custMgrDeptName" :maxlength=66></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.tel')" prop="tel" :validRules="telRule">
            <h-input v-if="type=='view'" :value="addForm.tel" class="input-boder-0" :title="addForm.tel"></h-input>
            <h-input v-else v-model="addForm.tel" :maxlength=11 :placeholder="'小于等于11位数字'"></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.email')" prop="email" :validRules="emailRule">
            <h-input v-if="type=='view'" :value="addForm.email" class="input-boder-0" :title="addForm.email"></h-input>
            <h-input v-else v-model="addForm.email" :maxlength=60 :placeholder="'字母，数字或英文符号'"></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.address')" prop="address">
            <h-input v-if="type=='view'" :value="addForm.address" class="input-boder-0"
                     :title="addForm.address"></h-input>
            <h-input v-else v-model="addForm.address" :maxlength=166></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.remark')" prop="custMgrRemark" class="h-form-long-label">
            <h-input v-if="type=='view'" :value="addForm.custMgrRemark" class="input-boder-0"
                     :title="addForm.custMgrRemark"></h-input>
            <h-input v-else v-model="addForm.custMgrRemark" :maxlength=333></h-input>
          </h-form-item>

        </h-form>
      </h-panel>
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


  </div>
</template>

<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";

  export default {
    name: "custManager",
    components: {

    },
    data() {
      let columns = [
        {
          type: "selection",
          key: "duoxuan",
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
          title: this.$t('m.i.common.custMgrNo'),
          key: "custMgrNo",

          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.custMgrName'),
          key: "custMgrName",

          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.custMgrTeam'),
          key: "custMgrTeam",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.custMgrBrchNo'),
          key: "custMgrBrchNo",

          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.custMgrBrchName'),
          key: "custMgrBrchName",

          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.custMgrDeptName'),
          key: "custMgrDeptName",

          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.tel'),
          key: "tel",

          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.email'),
          key: "email",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.address'),
          key: "address",

          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.remark"),
          key: "custMgrRemark",
          hiddenCol: false
        }
      ];
      let formItem = {
        custMgrNo: "",
        custMgrName: ""
      };
      let addForm = {
        id: "",
        custMgrNo: "",
        custMgrName: "",
        custMgrTeam: "",
        activeFlag: "",
        custMgrBrchNo: "",
        custMgrBrchName: "",
        custMgrDeptName: "",
        transplantFlag: "",
        tel: "",
        email: "",
        address: "",
        custMgrRemark: "",
        reserve1: "",
        reserve2: "",
        reserve3: "",
        createTime: "",
        updateTime: ""
      };
      //给按钮增加权限
      let authObj = {
        bizSetRoleAdd: true, //角色添加
        bizSetRoleDelete: true, //角色删除
        bizSetRoleORight: true, //角色操作权限
        bizSetRoleARight: true, //角色授权权限
        bizRoleRightSet: true, //角色权限处理
        bizRoleRightCopy: true, //角色权限复制
        bizSetRoleDownload: true //角色信息下载
      };
      return {
        authObj: authObj,

        // 是否显示新增或修改窗口
        addOrEditWin: false,
        formItem: formItem,
        addForm: addForm,
        columns: columns,
        branchColumns: columns,
        type: null,
        readonly: false,
        isRequired: true,
        tableRef: "selfTable",
        deletDisabled: false,
        submitFlag: false,
        copyWin: false,
        submitWin: false,
        submitMsg: "",
        submitTitle: "",
        retMsg: "",
        ifShowMore: false,
        //roleNameRule:[{test: validRoleName, trigger:'blur'}],
        mgrNoRule: [{ test: /^[a-zA-Z0-9]{1,20}$/, trigger: "blur", message: "只能输入1-20位字母或数字" }],
        telRule: [{ test: /^[0-9]{0,11}$/, trigger: "blur", message: "只能输入11位以下数字" }],
        emailRule: ["email"]
      };
    },
    methods: {
      addFormReset() {
        this.$refs.addForm.resetFields();
        this.addForm.id = "";
      },
      handleAddForm(str) {
        this.type = str;
        this.readonly = false;
        this.isRequired = true;
        if (this.type == "modify" || this.type == "view") {
          let list = this.$refs.datagrid.selects;
          if (!list || list.length !== 1) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
            return;
          }
          if (this.type == "modify") {
            this.readonly = true;
          }
          if (this.type == "view") {
            this.isRequired = false;
          }
          this.$nextTick(() => {
            this.addForm.id = list[0].id;
            this.addForm.custMgrNo = list[0].custMgrNo;
            this.addForm.custMgrName = list[0].custMgrName;
            this.addForm.custMgrTeam = list[0].custMgrTeam;
            this.addForm.activeFlag = list[0].activeFlag;
            this.addForm.custMgrBrchNo = list[0].custMgrBrchNo;
            this.addForm.custMgrBrchName = list[0].custMgrBrchName;
            this.addForm.custMgrDeptName = list[0].custMgrDeptName;
            this.addForm.transplantFlag = list[0].transplantFlag;
            this.addForm.tel = list[0].tel;
            this.addForm.email = list[0].email;
            this.addForm.address = list[0].address;
            this.addForm.custMgrRemark = list[0].custMgrRemark;
            this.addForm.reserve1 = list[0].reserve1;
            this.addForm.reserve2 = list[0].reserve2;
            this.addForm.reserve3 = list[0].reserve3;
            this.addForm.createTime = list[0].createTime;
            this.addForm.updateTime = list[0].updateTime;
          });
        } else {
          this.$nextTick(() => {
            this.addFormReset();
          });
        }
        this.addOrEditWin = true;
      },
      unDisabled() {
        this.deletDisabled = false;
      },
      formSearch() {
        this.unDisabled();
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
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
            let url = this.type == "add" ? "/bm/cust/manager/custManager/func_insertCustManager" : "/bm/cust/manager/custManager/func_updateCustManager";
            let msg = this.type == "add" ? this.$t("m.i.common.addSuccess") : this.$t("m.i.common.modifySuccess");
            let pageNo = this.type === "add" ? 1 : this.$refs.datagrid.pageInfo.pageNo;
            this.submitFlag = true;
            this.submitMsg = msg;
            post(this.addForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode == "000000") {
                  // this.$hMessage.success(msg)
                  this.$msgTip.success(this);
                  this.addOrEditWin = false;
                  this.$refs.datagrid.dataChange(pageNo);
                  this.$refs.datagrid.selects = [];
                  this.$refs.datagrid.selectIds = [];
                  this.retMsg = "";
                } else {
                  // this.submitMsg = this.type=="add"?this.$t('m.i.common.addFailed'):this.$t('m.i.common.modifyFailed');
                  this.$msgTip.error(this, { info: res.data.retMsg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }

            });
          }
        });

      },
      handleComfirm() {
        let list = this.$refs.datagrid.selects;
        if (list != null && list.length > 0) {
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
        post({ ids: this.$refs.datagrid.selectIds }, "/bm/cust/manager/custManager/func_deleteCustManager").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              // this.$hMessage.success(this.$t('m.i.common.deleteSuccess'))
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.$refs.datagrid.selects = [];
              this.$refs.datagrid.selectIds = [];
              this.retMsg = "";
            } else {
              // this.submitMsg = this.$t('m.i.common.deleteFailed');
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },

      queryCustNo() {

      }

    }
  };
</script>

<style scoped>

</style>
