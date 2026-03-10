<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <show-branch v-model="formItem.licensedBrchName"  :label="$t('m.i.auth.licensedBrchName')"  prop="licensedBrchName"
                             :showCheckBox="false" :brchNo.sync="formItem.licensedBrchNo" :brchName.sync="formItem.licensedBrchName"></show-branch>
                <show-branch v-model="formItem.licenseBrchName"   :label="$t('m.i.auth.licenseBrchName')"  prop="licenseBrchName"
                             :showCheckBox="false" :brchNo.sync="formItem.licenseBrchNo" :brchName.sync="formItem.licenseBrchName"></show-branch>

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
            :has-select="false"
            :row-select="true"
            url="/sm/auth/licenseBrch/focusOper/func_queryLicenseBrch"
            :bindForm="formItem"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="handleAddForm('add')">{{$t('m.i.common.add')}}</h-button>
              <h-button type="primary" @click="handleAddForm('modify')">{{$t('m.i.common.modify')}}</h-button>
              <h-button type="primary" @click="handleDelete()">{{$t('m.i.common.delete')}}</h-button>
              <h-button type="primary" @click="viewLicensedAuthority()">{{$t('m.i.auth.viewLicensedAuth')}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <!--点击新增/修改弹出窗-->
    <h-msg-box v-model="addOrEditWin" width="1000" height="400" class="h-form-table-layer" :maximize="true"  :mask-closable="false"
               @on-close="handleWinClose" @on-maximize="getTreeHeight($event, 'addOrEditMsg')" ref="addOrEditMsg">
      <p slot="header">
        <span v-if="type=='add'">新增集中操作授权</span>
        <span v-if="type=='modify'">修改集中操作授权</span>
      </p>
      <h-panel ref="formPanel">
        <h-form :model="addForm" :label-width="120" ref="addForm" cols="2" class="h-form-search">
          <h-form-item :label="$t('m.i.auth.focusType')" prop="focusType" :required="isRequired&&showAddFormItem"  v-show="showAddFormItem">
            <h-select v-model="addForm.focusType" :title="addForm.focusType" :readonly="type=='modify'" @on-change="focusTypeChange">
              <h-option v-for="item in focusTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.auth.licenseUserNo')" prop="licenseUserNo" :required="this.addForm.focusType == '2'&&showAddFormItem"
                       v-show="this.addForm.focusType == '2'&&showAddFormItem">
            <h-input v-if="type=='add'" v-model="addForm.licenseUserNo" :title="addForm.licenseUserNo"></h-input>
            <h-input v-else v-model="addForm.licenseUserNo" :maxlength=60 readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.auth.licenseUserName')" prop="licenseUserName" :required="this.addForm.focusType == '2'&&showAddFormItem"
                       v-show="this.addForm.focusType == '2'&&showAddFormItem">
            <h-input v-if="type=='add'" v-model="addForm.licenseUserName" :title="addForm.licenseUserName"></h-input>
            <h-input v-else v-model="addForm.licenseUserName" :maxlength=60 readonly></h-input>
          </h-form-item>


          <show-branch v-model="addForm.licensedBrchNo" :label="$t('m.i.auth.licensedBrchNo')"   prop="licensedBrchNo"  :required="isRequired&&showAddFormItem"
                       :filterable="type=='add'"   :msgBoxWin="addOrEditWin" showValue :showCheckBox="false" :brchNo.sync="addForm.licensedBrchNo" :brchName.sync="addForm.licensedBrchName"  v-show="(type==='add'||(type==='modify'&&modifyType==='radio'))"></show-branch>
          <h-form-item :label="$t('m.i.auth.licensedBrchName')" prop="licensedBrchName" :required="isRequired&&showAddFormItem"  v-show="showAddFormItem">
            <h-input  v-model="addForm.licensedBrchName"   readonly></h-input>
          </h-form-item>

          <show-branch v-model="addForm.licenseBrchNos"   :label="$t('m.i.auth.licenseBrchNo')"  prop="licenseBrchNos" :required="isRequired&&showAddFormItem"
                       :filterable="type=='add'"  :msgBoxWin="addOrEditWin"  showValue  :brchNo.sync="addForm.licenseBrchNos" :brchName.sync="addForm.licenseBrchNames"  v-show="showAddFormItem"></show-branch>
          <h-form-item :label="$t('m.i.auth.licenseBrchName')" prop="licenseBrchNames" :required="isRequired&&showAddFormItem"  v-show="showAddFormItem">
            <h-input  v-model="addForm.licenseBrchNames"   readonly></h-input>
          </h-form-item>

        </h-form>
      </h-panel>

      <div class="h-tree-search">
        <!--弹出框模式标题-->
        <div class="h-modal-header-wrapper">
          <div class="h-modal-header-btn">
            <h-button type="primary" :disabled="isExpandDisabled" @click='expandTree(branchMenuData)'>
              {{$t("m.i.common.expand")}}
            </h-button>
            <h-button type="primary" :disabled="isNotExpandDisabled" @click='unExpandTree(branchMenuData)'>
              {{$t("m.i.common.noExpand")}}
            </h-button>
          </div>
        </div>
        <!--弹出框内容-->
        <div class="h-tree-content" style="position:relative;" :style="{height: mTreeHeight + 'px'}">
          <h-tree :data="branchMenuData" ref='tree' class='h-tree-self' :show-checkbox="true"
                  :selectToCheck="true" :notDeepCopy="true" @on-toggle-expand="toggleExpand"></h-tree>
          <h-spin size="large" v-if="showLoading" fix></h-spin>
        </div>
      </div>

      <!-- 弹出框模式底部按钮 -->
      <div slot="footer">
        <h-button type="ghost" @click="handleWinClose()">{{$t('m.i.common.close')}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="submitForm()">{{$t('m.i.common.commit')}}</h-button>
      </div>
    </h-msg-box>

    <show-License-menu :showLicenseMenuWin="showLicenseMenuWin" :licenseBrchNo="licenseBrchNo" :licensedBrchNo="licensedBrchNo" roleType="1"
                      @showLicenseMenuWinClose="showLicenseMenuWinClose" title="查看菜单"></show-License-menu>

  </div>
</template>

<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";

  export default {
    name: "focusOper",
    components: {
      ShowLicenseMenu: () => import(/* webpackChunkName: "sm/auth/licenseBrch/showLicenseMenu" */`@/views/bizViews/sm/auth/licenseBrch/showLicenseMenu`)
    },
    data() {
      return {
        branchMenuData: [],
        expandDisabled :false,
        isExpandDisabled: false,
        isNotExpandDisabled: true,
        flag:false,
        showLoading : false,
        modifyType:"", //修改类型   radio 单选修改  selection 多选修改
        //区分机构角色和机构管理员角色，1-机构角色，2-机构管理员角色
        roleType: {
          type: String
        },
        formItem: {
          licenseUserNo: "",
          licenseUserName: "",
          licenseBrchNo: "",
          licenseBrchName: "",
          licensedBrchNo:"",
          licensedBrchName:""
        },
        addForm: {
          ids: [],
          legalNo: "",
          focusType: "1",
          authId: "",
          authIdStr:"",
          licenseUserNo: "",
          licenseUserName: "",
          licenseBrchNos: "",
          licenseBrchNames: "",
          licensedBrchNo: "",
          licensedBrchName: "",
          createTime: "",
          updateTime: ""
        },
        viewForm: {
          billType: "",
          billClass: "",
          custName: "",
          custBrchCode: "",
          applDt: "",
          custMgrNo: "",
          brchName: ""
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
            title: this.$t('m.i.auth.licenseUserNo'),
            key: "licenseUserNo",
            hiddenCol: true,
          },
          {
            title: this.$t('m.i.auth.licenseUserName'),
            key: "licenseUserName",
            hiddenCol: true
          },
          {
            title: this.$t('m.i.auth.licensedBrchNo'),
            key: "licensedBrchNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.auth.licensedBrchName'),
            key: "licensedBrchName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.auth.licenseBrchNo'),
            key: "licenseBrchNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.auth.licenseBrchName'),
            key: "licenseBrchName",
            hiddenCol: false
          },

          {
            title: this.$t('m.i.auth.focusType'),
            key: "focusType",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.focusTypeList;
              let focusType = params.row.focusType;
              for (let i = 0; i < list.length; i++) {
                if (params.row.focusType === list[i].key) {
                  focusType = list[i].value;
                }
              }
              return h("span", {
                domProps: {
                  title: focusType
                }
              },focusType);
            }
          }
        ],
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
        focusTypeList : [
          {
            key: '1',
            value: '按机构'
          }/*,{
            key: '2',
            value: '按柜员'
          }*/
        ],
        billTypeList: [],
        billClassList: [],
        currentSelectBillList: [],
        branchList: [],
        modifyArray: [],
        brchCodeWin : false,
        isRequired: true,
        readonly: false,
       /* brchNoWin1:false,
        brchNoWin2:false,
        brchNoWin3:false,
        brchNoWin4:false,*/
        isDisabled: false,
        submitFlag: false,
        spanLeft: 4,
        spanRight: 20,
        type:"",
        dictMap: new Map(),
        ifShowMore: false,
        // 是否显示新增或修改窗口
        addOrEditWin: false,
        billId: null,
        //选中用户号
        userNo: "",
        brchNo: "",
        licenseBrchNo:"",
        licensedBrchNo:"",
        //查看菜单弹出框
        showLicenseMenuWin: false,
        url: "be/trust/impawn/impawnApply",
        billList: {
          list: [],
          pageInfo: {
            count: 0,
            pageNo: 1,
            pageSize: 10
          }
        },
        batchId: null,
        mTreeHeight: 300
      };
    },
    methods: {
      getTreeHeight(isMax, msgRef) {
        this.$nextTick(() => {
          if(isMax) {
            let headerHeight = this.$refs[msgRef].$el.getElementsByClassName('h-modal-header')[0].offsetHeight;
            let footerHeight = this.$refs[msgRef].$el.getElementsByClassName('h-modal-footer')[0].offsetHeight;
            let formHeight = this.$refs.formPanel.$el.offsetHeight;
            let headerBtnHeight = this.$refs[msgRef].$el.getElementsByClassName('h-modal-header-wrapper')[0].offsetHeight;
            let mTreeHeight = window.innerHeight - (headerHeight+1) - (footerHeight+1) - headerBtnHeight - formHeight - 26;
            if(window.sessionStorage.getItem("isTransfer") === "0") {
              let appObj = document.getElementsByClassName("app-main");
              let appOffsetHeight = appObj.length == 0 ? 0 : appObj[0].offsetHeight;
              mTreeHeight = appOffsetHeight - (headerHeight+1) - (footerHeight+1) - headerBtnHeight - formHeight - 26;
            }
            this.mTreeHeight = mTreeHeight;
          } else {
            this.mTreeHeight = 300;
          }
        });
      },
      handleAddForm(str) {
        this.type = str;
        if(this.type == "add") {
          this.readonly = false;
          this.$nextTick(() => {
              this.addFormReset();
          });
          this.getBrchMenuTreeList()
        } else if (this.type == "modify" ) {
          if (this.$refs.datagrid.selects.length == 0) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
            return;
          }
          //从页面拿值
          this.addForm.ids = this.$refs.datagrid.selectIds;
          this.readonly = true;
          if (this.$refs.datagrid.selectIds.length===1){
            this.modifyType="radio";
            let currentSelectRow=this.$refs.datagrid.selects[0];
            this.addForm.focusType = currentSelectRow.focusType;
            this.addForm.licenseUserNo = currentSelectRow.licenseUserNo;
            this.addForm.licenseUserName = currentSelectRow.licenseUserName;
            this.addForm.licenseBrchNos = currentSelectRow.licenseBrchNo;
            this.addForm.licenseBrchNames = currentSelectRow.licenseBrchName;
            this.addForm.licensedBrchNo = currentSelectRow.licensedBrchNo;
            this.addForm.licensedBrchName = currentSelectRow.licensedBrchName;
            this.getPermissionTreeList(currentSelectRow.id);
          } else {
            this.modifyType="selection"; //多选修改
            this.getBrchMenuTreeList();
          }
        }
        this.addOrEditWin = true;
      },

      //删除确认
      handleDelete(){
        if (this.$refs.datagrid.selectIds.length == 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
        } else {
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: this.$t("m.i.common.isConfirmDelete") + "?",
            onOk: () => {
              this.handledel();
            }
          });
        }
      },
      /*删除操作*/
      handledel() {
        post({ ids: this.$refs.datagrid.selectIds }, "/sm/auth/licenseBrch/focusOper/func_deleteFocusOper").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$refs.datagrid.dataChange(1);
              this.$msgTip.success(this)
              this.$refs.datagrid.selectIds = [];
              this.$refs.datagrid.selects = [];
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.deleteFailed") + res.data.retMsg });
              this.$refs.datagrid.dataChange(1);
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },

      //查看已授权菜单
      viewLicensedAuthority(){
        if (this.$refs.datagrid.selectIds.length === 1) {
          this.showLicenseMenuWin = true;
          this.licenseBrchNo = this.$refs.datagrid.selects[0].licenseBrchNo;
          this.licensedBrchNo = this.$refs.datagrid.selects[0].licensedBrchNo;
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      showLicenseMenuWinClose() {
        this.showLicenseMenuWin = false;
      },

      submitForm() {
        debugger
        this.$refs["addForm"].validate(valid => {
          console.log(valid)
          if (valid) {
            // 数组去重
            let hash = {};
            this.modifyArray = this.modifyArray.reduce(function(item, next) {
              hash[next.id] ? "" : hash[next.id] = true && item.push(next);
              return item;
            }, []);
            let code = "";
            // 与初次值进行对比,去掉没有实际改变的值，同时拼接提交字符串值
            let checkedArr = this.$refs["tree"].getCheckedNodes();
            for (let i = 0; i < checkedArr.length; i++) {
              code += checkedArr[i].id + ",";
            }
            this.addForm.authIdStr = code;
            this.submitFlag = true;
            // 新增或修改的url
            let url = this.type=="add"?'sm/auth/licenseBrch/focusOper/func_addFocusOper':'sm/auth/licenseBrch/focusOper/func_updateFocusOper'
            let msg = this.type=="add"?this.$t('m.i.common.addSuccess'):this.$t('m.i.common.modifySuccess')
            post(this.addForm,url).then(res => {
              if(res){
                this.submitFlag = false;
                let retCode = res.data.retCode
                if(retCode=="000000"){
                  this.$msgTip.success(this)
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                  this.handleWinClose();
                }else{
                  this.$msgTip.error(this,{info:res.data.retMsg})
                }
              }else{
                this.$msgTip.error(this,{info:this.$t('m.i.common.netError')})
              }

            });
          }
        });

      },
      formSearch() {
        this.$refs.datagrid.selectIds=[];
        this.$refs.datagrid.selects=[];
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.formItem.licenseUserNo = null;
        this.formItem.licenseUserName = null;
        this.formItem.licenseBrchNo = null;
        this.formItem.licenseBrchName = null;
        this.formItem.licensedBrchNo = null;
        this.formItem.licensedBrchName = null;
        this.$refs.formItem.resetFields();
      },
      addFormReset() {
        this.$refs.addForm.resetFields();
        this.addForm.ids=[];
        this.addForm.focusType = "1";
        this.addForm.licenseUserNo = "";
        this.addForm.licenseUserName = "";
        this.addForm.licenseBrchNos = "";
        this.addForm.licenseBrchNames = "";
        this.addForm.licensedBrchNo = "";
        this.addForm.licensedBrchName = "";
        this.branchMenuData = [];
        this.readonly = false;
      },
      handleWinClose() {
        this.addFormReset();
        this.addOrEditWin = false;
      },
      orgSelectChange(item) {
        if (item.length > 0) {
          this.formItem.brchNo = item[0].id;
        } else {
          this.formItem.brchNo = "";
        }
        this.brchNo = "";
        this.formSearch("0");
      },
      focusTypeChange(){
        this.addForm.licenseUserNo="";
        this.addForm.licenseUserName="";
      },
      getPermissionTreeList(focusOperId) {
        post({"focusOperId": focusOperId }, "/sm/auth/licenseBrch/focusOper/func_queryAssignedLicenseAuths").then(res => {
          if (res&&res.data) {
            if (res.data.retCode==="000000") {
              this.showLoading = false;
              this.branchMenuData = (res.data.retData instanceof Array) ? res.data.retData : [res.data.retData];
              // 给左侧树赋值
              this.expandTree(this.branchMenuData);
            }else {
              this.showLoading = false;
              this.branchMenuData = [];
              this.$msgTip.error(this, { info: res.data.retMsg });
            }

          }
        });
      },
      //获取机构角色对应菜单
      getBrchMenuTreeList() {
        let url =  "/sm/auth/branch/func_queryFocusAuthMenu";
        post({}, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.showLoading = false;
              this.branchMenuData = (res.data.retData instanceof Array) ? res.data.retData : [res.data.retData];
              this.expandTree(this.branchMenuData);
            } else {
              this.showLoading = false;
              this.branchMenuData = [];
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //收拢左侧树
      unExpandTree(arr) {
        this.recursiveTree(arr, false);
        this.expandDisabled = !this.expandDisabled;
        this.isExpandDisabled = false;
        this.isNotExpandDisabled = true;
      },
      //展开左侧树
      expandTree(arr) {
        this.recursiveTree(arr, true);
        this.expandDisabled = !this.expandDisabled;
        this.isExpandDisabled = true;
        this.isNotExpandDisabled = false;
      },
      //递归给左侧树赋值
      recursiveTree(arr, isExpand) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].children) {
            this.$set(arr[i], "expand", isExpand);
            this.recursiveTree(arr[i].children, isExpand);
          }
        }
      },
      getCheckedNodes(name) {

      },
      recursiveAssigNode(menuTreeData, arr) {
        this.flag = false;
        for (let i = 0; i < menuTreeData.length; i++) {
          if (this.flag) {
            break;
          }
          if (menuTreeData[i].id === arr.id) {
            menuTreeData[i] = arr;
            this.flag = true;
            break;
          }
          if (menuTreeData[i].children) {
            this.recursiveAssigNode(menuTreeData[i].children, arr)
          }
        }
      },
      isAllExpand(arr) {
        this.flag = true;
        for (let i = 0; i < arr.length; i++) {
          if (!this.flag) {
            break;
          }
          if (arr[i].expand === false && arr[i].children) {
            this.flag = false;
            break;
          }
          if (arr[i].children) {
            this.isAllExpand(arr[i].children)
          }
        }
      },
      toggleExpand(arr, status) {
        let closeCount = 0;
        this.recursiveAssigNode(this.branchMenuData, arr);
        this.isAllExpand(this.branchMenuData);
        // 完全收缩
        for (let i = 0; i < this.branchMenuData.length; i++) {
          if (this.branchMenuData[i].expand === false) {
            closeCount++;
          }
        }
        if (closeCount === this.branchMenuData.length) {
          this.isExpandDisabled = false;
          this.isNotExpandDisabled = true;
          return;
        }
        if(!this.flag){
          this.isExpandDisabled = false;
          this.isNotExpandDisabled = false;
        }else{
          this.isExpandDisabled = true;
          this.isNotExpandDisabled = false;
        }

      },
    },
    mounted() {
      this.getDictListByGroups("DraftTypeCode,CDMedia").then(res => {
        this.billClassList = res.get("CDMedia");
        this.billTypeList = res.get("DraftTypeCode");
        this.dictMap = res.get("map");
      });
    },
    watch:{
    },
    computed:{
      showAddFormItem: {
        get() {
          return this.type==='add'||(this.type==='modify'&&this.modifyType==='radio');
        },
        set(val) {
        }
      }
    }

  };
</script>

<style scoped>

</style>
