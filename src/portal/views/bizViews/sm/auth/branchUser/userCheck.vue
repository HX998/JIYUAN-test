<!--角色设置-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix">
              <h-form :model="checkformItem" :label-width="90" ref="checkformItem" cols="4" class="h-form-search">
                <show-branch
                  v-model="checkformItem.ownedBrchNames" :label="$t('m.i.common.ownedBrchNo')"
                  prop="ownedBrchNames"
                  v-if="licenseFlag" :showCheckBox="true" :brchNo.sync="checkformItem.ownedBrchNos" :brchName.sync="checkformItem.ownedBrchNames"
                  :params="{authPath:this.$route.path}"
                  url="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree"
                  queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
                </show-branch>
                <h-form-item :label="$t('m.i.common.userNo')" prop="userNo">
                  <h-input v-model="checkformItem.userNo" :maxlength="20"></h-input>
                </h-form-item>
               <!-- <h-form-item :label="$t('m.i.common.brchNo')" prop="brchNo">
                  <h-input v-model="checkformItem.brchNo" readonly icon="android-search"
                           @on-click="querybranchNo('query')"></h-input>
                </h-form-item>-->

                <show-branch v-model="checkformItem.brchName"  :label="$t('m.i.common.brchName')"  prop="brchName"
                             :showCheckBox="false" :brchNo.sync="checkformItem.brchNo" :brchName.sync="checkformItem.brchName"></show-branch>
                <h-form-item class="h-form-operate" :class="licenseFlag? '':'two-form'">
                  <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            :hasSelect="hasSelect"
            :rowSelect="true"
            url="/sm/auth/branchUser/branchUser/func_getBranchUserCheckList"
            :bindForm="checkformItem"
            :onRowClick="handlelRowClick"
            :onSelectChange="handleSelectClick"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="handleCheck('pass')" v-if="authObj.bizSetRoleAdd">通过</h-button>
              <h-button type="primary" @click="handleCheck('reject')" v-if="authObj.bizRoleRightSet">驳回</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--<show-branch :showBranchWin="showBranchWin" title="机构查询" @brchNoChange="brchNoChange"
                 @showBranchWinClose="showBranchWinClose"></show-branch>-->
  </div>
</template>
<script>
  import {  post,  on, off } from "@/api/bizApi/commonUtil";

  export default {
    name: "userCheck",
    data() {
      return {
        licenseFlag:false,
        authPath: this.$route.path ,
        checkformItem: {
          roleCode: "",
          roleName: "",
          kindCode: "",
          roleType: "",
          brchNo: "",
          remark: "",
          userNo:"",
          authPath:this.$route.path,
          ownedBrchNos:"",
          ownedBrchNames:"",
        },
        type: null,
        addOrEditWin: false,
        setRoleRole: false,
        setRoleRight: false,
        setRoleAllotRight: false,
        copyWin: false,
        readonly: false,
        isRequired: true,
        addForm: {
          roleCode: "",
          roleName: "",
          roleOrder: "",
          paramValue: "",
          kindCode: "BIZFRAME",
          kindId: "",
          paramDesc: "",
          paramRegex: "",
          relOrg: "0_000000",
          beginDate: "",
          endDate: "",
          beginDateFmt: "",
          endDateFmt: "",
          roleType: 0,
          schemeId: "",
          schemeName: "",
          remark: ""
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
        columns: [
          {
            type: "selection",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: this.$t('m.i.common.brchName'),
            key: "ownedBrchName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.userNo'),
            key: "userNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.common.userName'),
            key: "userName",
            hiddenCol: false,
            sortable: true
          },

          {
            title: this.$t('m.i.common.brchNo'),
            key: "brchNo",

            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.traderId'),
            key: "traderId",
            hiddenCol: false,
            sortable: true

          }, {
            title: this.$t("m.i.common.userRole"),
            key: "roleName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.auth.operation"),
            key: "description",
            hiddenCol: false
          }
        ],
        currentSelectRow: null,
        currentSelectList: [],
        currentCopySelectRow: null,
        currentCopySelectList: [],
        currentSelectRowInx: [],
        tempInx: 0,
        //showBranchWin: false,
        submitCopyRoleDisabled: false,
        roleCodeRule: [{ test: this.validRoleCode, trigger: "blur" }],
        roleNameRule: [{ test: this.validRoleName, trigger: "blur" }],
        numberRule: ["num"],
        deletDisabled: false,
        kindTree: [],
        submitFlag: false,
        schemeIdList: [],
        hasSelect: false
      };
    },
    components: {
      //ShowBranch: () => import(/* webpackChunkName: "sm/auth/branch/showBranch" */`@/views/bizViews/sm/auth/branch/showBranch`)
    },
    watch: {},

    computed: {},
    methods: {
    /*  //查询机构弹出框
      querybranchNo(optType) {
        this.showBranchWin = true;
        this.optType = optType;
      },
      showBranchWinClose() {
        this.showBranchWin = false;
      },
      //根据弹框所选数据进行赋值
      //根据弹框所选数据进行赋值
      brchNoChange(info, optType) {
        if (this.optType == "query") {
          this.checkformItem.brchNo = info[0].id;
          this.checkformItem.brchName = info[0].title;
        } else if (this.optType == "add") {
          this.addForm.branchNo = info[0].id;
          this.addForm.brchName = info[0].title;
        }
        this.showBranchWin = false;
      },*/

      formSearch() {
        this.unDisabled();
        this.hasSelect = true;
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.$refs.checkformItem.resetFields();
      },
      copySearch() {
        this.$refs.copyDatagrid.dataChange(1);
      },
      handleSelectClick(arr, selectInx) {
        this.unDisabled();
        this.currentSelectList = arr;
        this.currentSelectRowInx = selectInx;
        if (arr.length == 0) return;
      },
      unDisabled() {
        this.deletDisabled = false;
      },
      handlelRowClick(arr) {
        this.currentSelectRow = arr;
      },

      handleCheck(str) {
        let list = this.$refs.datagrid.selects; //this.currentSelectList;
        if (list.length > 0) {
          this.$hMsgBox.confirm({
            title: str === "pass" ? "复核通过" : "复核驳回",
            content: str === "pass" ? "确定要复核通过吗?" : "确定要驳回吗？",
            onOk: () => {
              this.handledel(str === "pass" ? "/sm/auth/branchUser/userCheck/func_checkPass" : "/sm/auth/branchUser/userCheck/func_checkReject");
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }

      },
      handledel(url) {
        let list = this.$refs.datagrid.selects; //this.currentSelectList;
        let ids = "";
        for (var i = 0, count = list.length; i < count; i++) {
          ids += list[i].id;
          if (i < list.length - 1) {
            ids += ",";
          }
        }
        post({ ids: ids }, url).then(res => {
          if (res) {
            let return_code = res.data.retCode;
            if (return_code === "000000") {
              this.$msgTip.success(this, { info: "操作成功" });
              this.$refs.datagrid.dataChange(1);
              this.currentSelectRow = [];
              this.currentSelectList = [];
              this.hasSelect = true;
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg === null ? "操作失败" : res.data.retMsg });
              this.$refs.datagrid.dataChange(1);
            }
          } else {
            this.$msgTip.error(this, { info: "操作失败" });
          }
        });

      },
      validRoleCode(rule, val, callback) {
        let re = /^\w+$/;
        if (re.test(val)) {
          callback();
        } else {
          callback(new Error("非法输入，只能输入英文、下划线和数字"));
        }
      },
      validRoleName(rule, val, callback) {
        let re = /^[\w\u4e00-\u9fa5\（\）\(\)\-\s]*$/;
        if (re.test(val)) {
          callback();
        } else {
          callback(new Error("非法输入，只能输入中文、英文、数字、小括号和下划线"));
        }
      }
    },
    mounted(){
      post({authPath:this.$route.path}, "sm/auth/licenseBrch/focusOper/func_checkLicenseAuth").then(res => {
    if (res) {
      let retCode = res.data.retCode;
      if (retCode === "000000") {
        this.licenseFlag = res.data.retData.licenseFlag;
        if (this.licenseFlag) {
          this.$refs.datagrid.controlColumnsHidden("ownedBrchName", false);
        }else {
          this.$refs.datagrid.controlColumnsHidden("ownedBrchName", true);
        }
      } else {
        this.$msgTip.error(this, { info: res.data.retMsg });
      }
    }else {
      this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
    }
  });
  }
  };
</script>
<style>

</style>
