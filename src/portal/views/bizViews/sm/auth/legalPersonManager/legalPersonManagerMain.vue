<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!-- 查询表单 -->
          <div class="h-form-search-box">
            <h-panel class="clearfix">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item prop="legalNo" :label="$t('m.i.common.legalNo')">
                  <h-input v-model="formItem.legalNo" placeholder="" icon="android-search"
                           @on-click="queryLegalNo('query')" readonly></h-input>
                </h-form-item>
                <h-form-item prop="userNo" :label="$t('m.i.common.userNo')" :validRules="userNoRule">
                  <h-input v-model="formItem.userNo" placeholder="" :maxlength="20"></h-input>
                </h-form-item>
                <h-form-item prop="userName" :label="$t('m.i.common.userName')" :validRules="userNameRule">
                  <h-input v-model="formItem.userName" placeholder="" :maxlength="16"></h-input>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <h-button type="primary" @click="handleLegalPersonSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid :columns="columns"
                      highlightRow
                      url="/sm/auth/legalPersonManager/legalPersonManagerMain/func_pageQueryList"
                      :bindForm="formItem"
                      :onSelectChange="handleSelectClick"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="handleForm('add')" v-if="authObj.legalManagerAdd">
                {{$t("m.i.common.add")}}
              </h-button>
              <h-button type="primary" @click="handleForm('modify')" v-if="authObj.legalManagerModify">
                {{$t("m.i.common.modify")}}
              </h-button>
              <h-button type="primary" @click="deleteUser()" v-if="authObj.legalManagerDelete">
                {{$t("m.i.common.delete")}}
              </h-button>
              <h-button type="primary" @click="resetPwd()" v-if="authObj.legalManagerResetPwd">{{$t("m.i.common.pwdReset")}}</h-button>
              <h-button type="primary" @click="lockUser()" v-if="authObj.legalManagerLockUser">{{$t("m.i.common.userStatus")}}</h-button>
              <h-button type="primary" @click="dropUser()" v-if="authObj.legalManagerDropUser">{{$t("m.i.auth.dropUser")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!-- 点击新增/修改弹出框 -->
    <h-msg-box v-model="addOrEditWin" width="400" @on-close="addOrEditReset()" class="h-form-search-layer"
               :maximize="true" :mask-closable="false">
      <p slot="header">
        <span v-if="type=='add'">新增</span>
        <span v-if="type=='modify'">修改</span>
      </p>
      <div>
        <h-form :model="addOrEditForm" :label-width="115" ref="addOrEditForm" cols="1" class="h-form-search">
          <h-form-item :label="$t('m.i.common.userNo')" prop="userNo" :validRules="userNoRule" required>
            <h-input v-model="addOrEditForm.userNo" :readonly="readonly" placeholder="不超过20位的数字或字母"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.userName')" prop="userName" :validRules="userNameRule" required>
            <h-input v-model="addOrEditForm.userName" placeholder="不超过16位"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.legalNo')" prop="legalNo" :validRules="legalNoRule" required v-if="editNoView">
            <h-input v-model="addOrEditForm.legalNo" placeholder="" icon="android-search" @on-click="queryLegalNo(type)"
                     readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.legalNo')" prop="legalNo" :validRules="legalNoRule" required v-if="editView">
            <h-input v-model="addOrEditForm.legalNo" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.legalpersonName')" prop="legalpersonName" :validRules="legalpersonNameRule">
            <h-input v-model="addOrEditForm.legalpersonName" readonly placeholder=""></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.brchNo')" prop="brchNo" :validRules="brchNoRule">
            <h-input v-model="addOrEditForm.brchNo" readonly placeholder=""></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.remark')" prop="userRemark" :validRules="userRemarkRule">
            <h-input v-model="addOrEditForm.userRemark" placeholder="不超过80位"></h-input>
          </h-form-item>
        </h-form>
      </div>
      <div slot="footer">
        <div slot="footer">
          <h-button type="ghost" @click="addOrEditWin=!addOrEditWin">{{$t("m.i.common.close")}}</h-button>
          <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
          <h-button type="primary" v-else @click="formAdd()">{{$t("m.i.common.commit")}}</h-button>
        </div>
      </div>
    </h-msg-box>
    <!-- 查询法人编号弹出框 -->
    <legal-no-search :legalNoSearchWin="legalNoSearchWin" @legalNoSearchClose="legalNoSearchClose"
                     @legalNoSearchChange="legalNoSearchChange"></legal-no-search>
  </div>
</template>

<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";

  export default {
    name: "legalPersonManagerMain",
    data() {
      return {
        formItem: {
          legalNo: "",
          userNo: "",
          userName: ""
        },
        addOrEditForm: {
          userId: "",
          userNo: "",
          userName: "",
          legalNo: "",
          legalpersonName: "",
          brchNo: "",
          userRemark: ""
        },
        //给按钮赋权限
        authObj: {
          legalManagerAdd: true,      //新增
          legalManagerModify: true,   //修改
          legalManagerDelete: true,   //删除
          legalManagerResetPwd: true, //重置密码
          legalManagerLockUser: true, //用户状态
          legalManagerDropUser: true  //置为离线
        },
        columns: [
          {
            title: " ",
            type: "radio",
            align: "center",
            width: 50
          },
          {
            type: "selection",
            width: 60,
            hiddenCol: true,
            align: "center"
          },
          {
            type: "index",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.userNo'),
            key: "userNo",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.userName'),
            key: "userName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.legalNo'),
            key: "legalNo",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.brchNo'),
            key: "brchNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.legalpersonName'),
            key: "legalpersonName",

            hiddenCol: false
          },
          {
            title: this.$t("m.i.auth.loginStatus"),
            key: "loginStatus",
            hiddenCol: false,
            render: (h, params) => {
              let loginStatus = params.row.loginStatus;
              let info = "";
              if (loginStatus == "0") {
                info = "离线";
              } else if (loginStatus == "1") {
                info = "在线";
              }
              return h("span", info);
            }
          },
          {
            title: this.$t("m.i.common.userStatus"),
            key: "isEnable",
            hiddenCol: false,
            render: (h, params) => {
              let isEnable = params.row.isEnable;
              let info = "";
              if (isEnable == "0") {
                info = "锁定";
              } else if (isEnable == "1") {
                info = "正常";
              } else {
                info = "无效";
              }
              return h("span", info);
            }
          }
        ],
        editNoView: true,
        editView: false,
        userNoRule: [{ test: /^[0-9A-Za-z]{1,20}$/, trigger: "blur", message: "用户号为小于等于20位的数字或字母组成" }],
        userNameRule: [{ test: /^.{1,16}$/, trigger: "blur", message: "姓名不能超过16位" }],
        legalNoRule: [{ test: /^[0-9]{6}$/, trigger: "blur", message: "法人编号为6位数字" }],
        legalpersonNameRule: [{ test: /^.{1,60}$/, trigger: "blur", message: "法人名称不能超过60位" }],
        brchNoRule: [{ test: /^[0-9a-zA-Z]{1,10}$/, trigger: "blur", message: "由小于或等于10位数字或字母组成" }],
        userRemarkRule: [{ test: /^.{0,80}$/, trigger: "blur", message: "备注不能超过80位" }],
        legalNoSearchWin: false,
        legalNoType: null,
        submitFlag: false,
        addOrEditWin: false,
        readonly: false,
        moveUpDisabled: false,
        moveDownDisabled: false,
        currentSelectRow: [],
        currentSelectRowInx: [],
        type: ""
      };
    },
    components: {
      LegalNoSearch: () => import(/* webpackChunkName: "sm/auth/legalPersonManager/legalNoSearch" */`@/views/bizViews/sm/auth/legalPersonManager/legalNoSearch`)
    },
    watch: {},
    computed: {},
    methods: {
      // 查询法人编号弹窗
      queryLegalNo(legalNoType) {
        if (legalNoType == "modify") {
          return;
        }
        this.legalNoType = legalNoType;
        this.legalNoSearchWin = true;
      },
      // 查询
      handleLegalPersonSearch() {
        this.unDisabled();
        this.currentSelectRow = [];
        this.$refs.datagrid.dataChange(1);
      },
      unDisabled() {
        this.moveUpDisabled = false;
        this.moveDownDisabled = false;
      },
      // 新增/修改
      handleForm(str) {
        this.type = str;
        this.readonly = false;
        this.editNoView = true;
        this.editView = false;
        if (this.type === "modify") {
          this.editNoView = false;
          this.editView = true;
        }
        if (this.type == "modify" && this.currentSelectRow.length == 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        if (this.type == "modify" && this.currentSelectRow.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return;
        }
        if (this.type == "modify") {
          this.readonly = true;
          let userNo = this.currentSelectRow[0].userNo;
          let legalNo = this.currentSelectRow[0].legalNo;
          post({ userNo: userNo, legalNo: legalNo }, "/sm/auth/legalPersonManager/func_getByUserNoAndLegelNo").then(res => {
            if (res) {
              let msg = res.data.retMsg;
              let retCode = res.data.retCode;
              if (retCode == "000000") {
                this.addOrEditForm.userId = res.data.retData.userId;
                this.addOrEditForm.userNo = res.data.retData.userNo;
                this.addOrEditForm.userName = res.data.retData.userName;
                this.addOrEditForm.legalNo = res.data.retData.legalNo;
                this.addOrEditForm.legalpersonName = res.data.retData.legalpersonName;
                this.addOrEditForm.brchNo = res.data.retData.brchNo;
                this.addOrEditForm.userRemark = res.data.retData.userRemark;
              } else {
                this.$msgTip.error(this, { info: msg });
              }
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            }
          });
        } else {
          this.$nextTick(() => {
            this.addOrEditReset();
          });
        }
        this.addOrEditWin = true;
      },
      // 新增/修改页面提交
      formAdd() {
        this.$refs["addOrEditForm"].validate(valid => {
          if (valid) {
            let url = this.type == "add" ? "/sm/auth/legalPersonManager/legalPersonManagerMain/func_addLegalPersonManager" : "/sm/auth/legalPersonManager/legalPersonManagerMain/func_updateLegalPersonManager";
            let pageNo = this.type === "add" ? 1 : this.$refs.datagrid.pageInfo.pageNo;
            this.submitFlag = true;
            post(this.addOrEditForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode == "000000") {
                  this.$msgTip.success(this);
                  this.addOrEditWin = false;
                  this.$refs.datagrid.dataChange(pageNo);
                  this.currentSelectRow = [];
                } else {
                  this.$msgTip.error(this, { info: msg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      //重置新增/修改窗口
      addOrEditReset() {
        this.$refs.addOrEditForm.resetFields();
        this.addOrEditForm.userId = "";
      },
      // 删除
      deleteUser() {
        if (this.currentSelectRow.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return;
        }
        if (this.currentSelectRow.length == 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("m.i.common.isConfirmDelete") + "?",
          onOk: () => {
            this.handleDel();
          }
        });
      },
      handleDel() {
        let list = this.currentSelectRow;
        let ids = "";
        for (var i = 0, count = list.length; i < count; i++) {
          ids += list[i].userId;
          if (i < list.length - 1) {
            ids += ",";
          }
        }
        post({ id: ids }, "/sm/auth/legalPersonManager/legalPersonManagerMain/func_deleteLegalPersonManager").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
              this.currentSelectRow = [];
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      // 重置密码
      resetPwd() {
        if (this.currentSelectRow.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return;
        }
        if (this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        let list = this.currentSelectRow;
        if (list[0].isEnable === "1") {
          this.$hMsgBox.confirm({
            title: "重置密码",
            content: "确定要重置密码吗？",
            onOk: () => {
              let list = this.currentSelectRow;
              let ids = "";
              for (var i = 0, count = list.length; i < count; i++) {
                ids += list[i].userId;
                if (i < list.length - 1) {
                  ids += ",";
                }
              }
              post({ userId: ids }, "/sm/auth/legalPersonManager/legalPersonManagerMain/func_resetLegalPersonManagerPwd").then(res => {
                if (res) {
                  let msg = res.data.retMsg;
                  let retCode = res.data.retCode;
                  if (retCode == "000000") {
                    this.$msgTip.success(this);
                    this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
                    this.currentSelectRow = [];
                  } else {
                    this.$msgTip.error(this, { info: msg });
                  }
                }
              }).catch(error => {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
              });
            }
          });
        } else {
          this.$msgTip.info(this, { info: "请选择用户状态为正常的用户！"});
        }
      },
      // 用户状态
      lockUser() {
        if (this.currentSelectRow.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return;
        }
        if (this.currentSelectRow.length == 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        let list = this.currentSelectRow;
        if (list[0].isEnable == "1") {
          this.$hMsgBox.confirm({
            title: "锁定用户",
            content: "确定要锁定用户吗？",
            onOk: () => {
              this.lockUserStatus();
            }
          });
        } else if (list[0].isEnable == "0") {
          this.$hMsgBox.confirm({
            title: "解锁用户",
            content: "确定要解锁用户吗？",
            onOk: () => {
              this.unLockUserStatus();
            }
          });
        } else {
          this.$msgTip.info(this, { info: "请选择正常或者锁定的用户！"});
        }
      },
      lockUserStatus() {
        let list = this.currentSelectRow;
        let userNo = list[0].userNo;
        let ids = "";
        for (var i = 0, count = list.length; i < count; i++) {
          ids += list[i].userId;
          if (i < list.length - 1) {
            ids += ",";
          }
        }
        post({ userId: ids, userNo: userNo }, "/sm/auth/legalPersonManager/legalPersonManagerMain/func_lockLegalPersonManager").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
              this.currentSelectRow = [];
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      },
      unLockUserStatus() {
        let list = this.currentSelectRow;
        let userNo = list[0].userNo;
        let ids = "";
        for (var i = 0, count = list.length; i < count; i++) {
          ids += list[i].userId;
          if (i < list.length - 1) {
            ids += ",";
          }
        }
        post({ userId: ids, userNo: userNo }, "/sm/auth/legalPersonManager/legalPersonManagerMain/func_unLockLegalPersonManager").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
              this.currentSelectRow = [];
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      },
      // 置为离线
      dropUser() {
        if (this.currentSelectRow.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return;
        }
        if (this.currentSelectRow.length == 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        let list = this.currentSelectRow;
        if (list[0].loginStatus == "1") {
          this.$hMsgBox.confirm({
            title: "置为离线",
            content: "确定要置为离线吗？",
            onOk: () => {
              let userNo = list[0].userNo;
              let ids = "";
              for (var i = 0, count = list.length; i < count; i++) {
                ids += list[i].userId;
                if (i < list.length - 1) {
                  ids += ",";
                }
              }
              post({ userId: ids, userNo: userNo }, "/sm/auth/user/offLine").then(res => {
                if (res) {
                  let msg = res.data.retMsg;
                  let retCode = res.data.retCode;
                  if (retCode == "000000") {
                    this.$msgTip.success(this);
                    this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
                    this.currentSelectRow = [];
                  } else {
                    this.$msgTip.error(this, { info: msg });
                  }
                }
              }).catch(error => {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
              });
            }
          });
        } else {
          this.$msgTip.info(this, { info: "请选择在线用户！"});
        }

      },
      // 行选中
      handleSelectClick(arr, selectInx) {
        this.unDisabled();
        this.currentSelectRow = arr;
        this.currentSelectRowInx = selectInx;
        let selectIndex = selectInx[0];
        let lastSelectIndex = this.$refs.datagrid.tData.length - 1;
        if (selectIndex == "0") {
          this.moveUpDisabled = true;
        }
        if (selectIndex == lastSelectIndex) {
          this.moveDownDisabled = true;
        }
      },
      // 重置查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
      },
      //根据弹框所选数据进行赋值
      legalNoSearchChange(info) {
        if (this.legalNoType == "query") {
          if (info.length === 0) {
            this.$msgTip.error(this, { info: "请先选择记录！" });
            return;
          }
          this.formItem.legalNo = info.legalNo;
        }
        if (this.legalNoType == "add") {
          if (info.length === 0) {
            this.$msgTip.error(this, { info: "请先选择记录！" });
            return;
          }
          this.addOrEditForm.legalNo = info.legalNo;
          this.addOrEditForm.legalpersonName = info.legalpersonName;
          this.addOrEditForm.brchNo = info.brchNo;
        }
        this.legalNoSearchWin = false;
      },
      legalNoSearchClose() {
        this.legalNoSearchWin = false;
      }
    }
  };
</script>

<style scoped>

</style>
