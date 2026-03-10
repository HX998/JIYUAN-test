<!--极速贴现-签约审批设置-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.ce.checkBrchName')" prop="checkBrchName">
                  <h-input v-model="formItem.checkBrchName" readonly :maxlength="125"
                           icon="android-search" @on-click="queryCheckBrchNo('query')" clearable @on-clear="clearCheckBrchNo('query')"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.ce.signBrchName')" prop="signBrchName">
                  <h-input v-model="formItem.signBrchName" readonly :maxlength="125"
                           icon="android-search" @on-click="querySignBrchNo('query')" clearable @on-clear="clearSignBrchNo('query')"></h-input>
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
            url="/ce/disc/elec/fastdisc/signAuditMain/func_list"
            :bindForm="formItem"
            :rowSelect="true"
            :onSelectChange="handleSelectClick"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="handleAddForm('add')" v-if="authObj.signAuditAdd">
                {{$t("m.i.common.add")}}
              </h-button>
              <h-button type="primary" @click="handleAddForm('modify')" v-if="authObj.signAuditModify">
                {{$t("m.i.common.modify")}}
              </h-button>
              <h-button type="primary" @click="handleComfirm" v-if="authObj.signAuditDelete">
                {{$t("m.i.common.delete")}}
              </h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--点击修改弹出窗-->
    <h-msg-box v-model="addOrEditWin" width="800" :mask-closable="false" @on-close="handleWinClose"
               class="h-form-search-layer" :maximize="true">
      <p slot="header">
        <span v-if="type==='add'">新增</span>
        <span v-if="type==='modify'">修改</span>
      </p>
      <div>
        <h-form :model="addForm" :label-width="115" ref="addForm" cols="2" class="h-form-search">
          <h-form-item :label="$t('m.i.ce.checkBrchName')" prop="checkBrchName" :required="isRequired">
            <h-input v-model="addForm.checkBrchName" readonly :maxlength="125"
                     icon="android-search" @on-click="queryCheckBrchNo('add')" clearable @on-clear="clearCheckBrchNo('add')"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.ce.signBrchName')" prop="signBrchName" :required="isRequired">
            <h-input v-model="addForm.signBrchName" readonly :maxlength="125"
                     icon="android-search" @on-click="querySignBrchNo('add')" clearable @on-clear="clearSignBrchNo('add')"></h-input>
          </h-form-item>
        </h-form>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="handleWinClose">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="submitForm">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>
    <show-branch :showBranchWin="showCheckBrchWin" @brchNoChange="checkBrchChange" @showBranchWinClose="showCheckBrchWinClose"></show-branch>
    <show-branch :showBranchWin="showSignBrchWin" @brchNoChange="signBrchChange" @showBranchWinClose="showSignBrchWinClose"></show-branch>
  </div>
</template>

<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";

  export default {
    name: "signAuditMain",
    data() {
      return {
        formItem : {
          signBrchNo: "",
          signBrchName: "",
          checkBrchNo: "",
          checkBrchName: "",
        },
        //给按钮增加权限
        authObj : {
          signAuditAdd: true, //新增审批机构
          signAuditModify: true, //修改审批机构
          signAuditDelete: true //删除审批机构
        },
        columns : [
          {
            type: "selection",
            width: 60,
            hiddenCol: false,
            align: "center"
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.checkBrchNo"),
            key: "checkBrchNo",
            hiddenCol: false,
            sortable: true
          },
          {
              title: this.$t("m.i.ce.checkBrchName"),
            key: "checkBrchName",
            hiddenCol: false
          },
          {
              title: this.$t("m.i.ce.signBrchNo"),
            key: "signBrchNo",
            hiddenCol: false,
            sortable: true
          },
          {
           title: this.$t("m.i.ce.signBrchName"),
            key: "signBrchName",
            hiddenCol: false
          },
        ],
        currentSelectList : [],
        currentSelectRowInx : [],
        type : null,
        isRequired : true,
        addOrEditWin : false,
        submitFlag : false,
        addForm : {
          id: "",
          legalNo: "",
          signBrchNo: "",
          signBrchName: "",
          checkBrchNo: "",
          checkBrchName: "",
        },
        //审批机构查询弹出框
        showCheckBrchWin : false,
        checkBrchOptType : null,
        //签约机构查询弹出框
        showSignBrchWin : false,
        signBrchOptType : null,
      };
    },
    components: {
      ShowBranch:() => import(/* webpackChunkName: "sm/auth/branch/showBranch" */`@/views/bizViews/sm/auth/branch/showBranch`)
    },
    methods: {
      formSearch() {
        this.currentSelectList = [];
        this.currentSelectRowInx = [];
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.formItem.signBrchNo = "";
        this.formItem.checkBrchNo = "";
        this.$refs.formItem.resetFields();
      },
      handleSelectClick(arr, selectInx) {
        this.currentSelectList = arr;
        this.currentSelectRowInx = selectInx;
        if (arr.length === 0) {
          return false;
        }
      },
      handleWinClose() {
        this.addOrEditWin = false;
        this.addFormReset();
      },
      //新增/修改
      handleAddForm(str) {
        this.type = str;
        this.isRequired = true;
        if (this.type === "modify") {
          if (this.currentSelectList != null && this.currentSelectList.length !== 1) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
            this.addOrEditWin = false;
            return;
          } else {
            this.$nextTick(() => {
              this.addForm.id = this.currentSelectList[0].id;
              this.addForm.legalNo = this.currentSelectList[0].legalNo;
              this.addForm.signBrchNo = this.currentSelectList[0].signBrchNo;
              this.addForm.signBrchName = this.currentSelectList[0].signBrchName;
              this.addForm.checkBrchNo = this.currentSelectList[0].checkBrchNo;
              this.addForm.checkBrchName = this.currentSelectList[0].checkBrchName;
            });
          }
        } else {
          this.$nextTick(() => {
            this.addFormReset();
          });
        }
        this.addOrEditWin = true;
      },
      addFormReset() {
        this.addForm.id = "";
        this.addForm.legalNo = "";
        this.addForm.signBrchNo = "";
        this.addForm.checkBrchNo = "";
        this.$refs.addForm.resetFields();
      },
      //删除
      handleComfirm() {
        let list = this.currentSelectList;
        if (list != null && list.length > 0) {
          let signIds = [];
          for (let i = 0; i < list.length; i++) {
            signIds.push(list[i].id);
          }
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: this.$t("m.i.common.isConfirmDelete") + "?",
            onOk: () => {
              this.handleDel(signIds.join(","));
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      handleDel(signIds) {
        post({ code: signIds }, "/ce/disc/elec/fastdisc/signAuditMain/func_delete").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.currentSelectList = [];
              this.currentSelectRowInx = [];
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      submitForm() {
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            this.submitFlag = true;
            let url = this.type === "add" ? "/ce/disc/elec/fastdisc/signAuditMain/func_add" : "/ce/disc/elec/fastdisc/signAuditMain/func_update";
            post(this.addForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.addOrEditWin = false;
                  let pageNo = this.type === "add" ? 1 : this.$refs.datagrid.pageInfo.pageNo;
                  this.$refs.datagrid.dataChange(pageNo);
                  this.currentSelectList = [];
                  this.currentSelectRowInx = [];
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
      clearCheckBrchNo(optType) {
        if (optType === "query") {
          this.formItem.checkBrchNo = "";
          this.formItem.checkBrchName = "";
        } else if (optType === "add") {
          this.addForm.checkBrchNo = "";
          this.addForm.checkBrchName = "";
        }
      },
      //查询审批机构弹出框
      queryCheckBrchNo(optType) {
        this.showCheckBrchWin = true;
        this.checkBrchOptType = optType;
      },
      //根据弹框所选数据进行赋值
      checkBrchChange(info) {
        if (this.checkBrchOptType === "query") {
          this.formItem.checkBrchNo = info[0].id;
          this.formItem.checkBrchName = info[0].title;
        } else if (this.checkBrchOptType === "add") {
          this.addForm.checkBrchNo = info[0].id;
          this.addForm.checkBrchName = info[0].title;
        }
        this.showCheckBrchWin = false;
      },
      showCheckBrchWinClose() {
        this.showCheckBrchWin = false;
      },
      clearSignBrchNo(optType) {
        if (optType === "query") {
          this.formItem.signBrchNo = "";
          this.formItem.signBrchName = "";
        } else if (optType === "add") {
          this.addForm.signBrchNo = "";
          this.addForm.signBrchName = "";
        }
      },
      //查询签约机构弹出框
      querySignBrchNo(optType) {
        this.showSignBrchWin = true;
        this.signBrchOptType = optType;
      },
      //根据弹框所选数据进行赋值
      signBrchChange(info) {
        if (this.signBrchOptType === "query") {
          this.formItem.signBrchNo = info[0].id;
          this.formItem.signBrchName = info[0].title;
        } else if (this.signBrchOptType === "add") {
          this.addForm.signBrchNo = info[0].id;
          this.addForm.signBrchName = info[0].title;
        }
        this.showSignBrchWin = false;
      },
      showSignBrchWinClose() {
        this.showSignBrchWin = false;
      }
    }
  };
</script>

<style scoped>

</style>
