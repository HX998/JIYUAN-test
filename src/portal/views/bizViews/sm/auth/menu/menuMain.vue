<template>
  <div class="layout" :class="{'layout-hide-text': spanLeft < 4}">
    <h-row name="flex" class="layout-menu-wrapper">
      <!-- 左侧树 -->
      <h-col :span="spanLeft" class="layout-menu-left">
        <div>
          <div class="h-tree-search h-sidebar-menutree">
            <h-button type="primary" @click="handleExpandTree(menuTreeData)" :disabled="isExpandDisabled">
              {{ $t("m.i.common.expand") }}
            </h-button>
            <h-button type="primary" @click="handleUnExpandTree(menuTreeData)" :disabled="isNotExpandDisabled">
              {{ $t("m.i.common.noExpand") }}
            </h-button>
            <h-button type="primary" @click="upOrDownAuthMove('1')">{{ $t("m.i.common.moveUp") }}</h-button>
            <h-button type="primary" @click="upOrDownAuthMove('2')">{{ $t("m.i.common.moveDown") }}</h-button>
            <div class="h-sidebar-menutree-body">
              <h-tree :data="menuTreeData" highlight-row ref="menuTreeData" @on-select-change="queryByParentId()"
                      @on-toggle-expand="toggleExpand"
                      :style="{height: mBarHeight-180+ 'px',overflow: 'auto'}"></h-tree>
            </div>
          </div>
        </div>
      </h-col>
      <!-- 右侧数据展示表格 -->
      <h-col :span="spanRight" class="layout-menu-right">
        <div class="h-form-search-box">
          <!-- 查询表单 -->
          <h-panel class="clearfix">
            <h-form :model="formItem" :label-width="80" ref="formItem" cols="4" class="h-form-search">
              <h-form-item prop="authName" :label="$t('m.i.auth.authName')">
                <h-input v-model="formItem.authName" placeholder="" :maxlength="20"></h-input>
              </h-form-item>
              <h-form-item prop="authType" :label="$t('m.i.auth.authType')">
                <h-select v-model="formItem.authType" placeholder="" multiple showTitle>
                  <h-option v-for="item in authTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                </h-select>
              </h-form-item>
              <h-form-item class="h-form-operate two-form">
                <h-button type="primary" @click="handleMenuSearch()">{{ $t('m.i.common.search') }}</h-button>
                <h-button type="ghost" @click="resetSearch()">{{ $t('m.i.common.reset') }}</h-button>
              </h-form-item>
            </h-form>
          </h-panel>
        </div>
        <div>
          <!-- 数据展示表格 -->
          <h-col span="24">
            <h-datagrid :columns="columns"
                        highlight-row
                        url="/sm/auth/menu/menuMain/func_pageQueryProdList"
                        :bindForm="formItem"
                        :onSelectChange="handleSelectClick"
                        ref="datagrid">
              <div slot="toolbar" class="pull-left">
                <h-button type="primary" @click="handleForm('add')" v-if="authObj.menuAdd">{{ $t("m.i.common.add") }}
                </h-button>
                <h-button type="primary" @click="handleForm('modify')" v-if="authObj.menuModify">
                  {{ $t("m.i.common.modify") }}
                </h-button>
                <h-button type="primary" @click="deleteMenu()" v-if="authObj.menuDelete">{{ $t("m.i.common.delete") }}
                </h-button>
              </div>
            </h-datagrid>
          </h-col>
        </div>
      </h-col>
    </h-row>

    <!-- 点击新增/修改弹出窗 -->
    <h-msg-box v-model="addOrEditWin" width="400" @on-close="addOrEditReset" class="h-form-search-layer"
               :maximize="true" :mask-closable="false">
      <p slot="header">
        <span v-if="type=='add'">新增菜单</span>
        <span v-if="type=='modify'">修改菜单</span>
      </p>
      <div>
        <h-form :model="addOrEditForm" :label-width="115" ref="addOrEditForm" cols="1" class="h-form-search">
          <h-form-item prop="authName" :label="$t('m.i.auth.authName')" required :validRules="authNameRule">
            <h-input v-model="addOrEditForm.authName" placeholder="不超过20位"></h-input>
          </h-form-item>
          <h-form-item prop="authType" :label="$t('m.i.auth.authType')" required>
            <h-select v-model="addOrEditForm.authType" placeholder="" multiple :readonly="readonly" showTitle>
              <h-option v-for="item in authTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item prop="path" :label="$t('m.i.auth.path')" :validRules="authPathRule">
            <h-input v-model="addOrEditForm.path" placeholder="/../..的格式，不超过100位"></h-input>
          </h-form-item>
        </h-form>
      </div>
      <div slot="footer">
        <div slot="footer">
          <h-button type="ghost" @click="addOrEditWin=!addOrEditWin">{{ $t("m.i.common.close") }}</h-button>
          <h-button type="primary" v-if="submitFlag" disabled>{{ $t("m.i.common.submiting") }}</h-button>
          <h-button type="primary" v-else @click="formAdd()">{{ $t("m.i.common.commit") }}</h-button>
        </div>
      </div>
    </h-msg-box>
  </div>
</template>

<script>
  import {post, on, off} from '@/api/bizApi/commonUtil'

  export default {
    name: "menuMain",
    data() {
      return {
        mBarHeight: 0,
        formItem: {
          id: "",
          authName: "",
          authType: [],
          path: ""
        },
        addOrEditForm: {
          id: "",
          parentAuthNo: "",
          orderNo: "",
          authName: "",
          authType: [],
          path: ""
        },
        //给按钮增加权限
        authObj: {
          menuAdd: true,    //新增
          menuModify: true, //修改
          menuDelete: true //删除
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
            key: "multiSelect",
            width: 60,
            hiddenCol: true
          },
          {
            type: "index",
            title: this.$t("m.i.common.index"),
            align: "center",
            width: 60,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.auth.authName"),
            key: "authName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.auth.authType'),
            key: "authType",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "AuthorityType", params.row.authType);
              return h("span", {
                domProps: {
                  title: list
                }
              }, list);
            }
          },
          {
            title: this.$t('m.i.auth.path'),
            key: "path",
            hiddenCol: false
          }
        ],
        authNameRule: [{test: /^.{1,20}$/, trigger: "blur", message: "菜单名称长度不能超过20位"}],
        authPathRule: [{test: /^.{0,100}$/, trigger: "blur", message: "菜单路径长度应小于100位"}],
        spanLeft: 4,
        spanRight: 20,
        treeDataChange: false,
        readonly: false,
        addOrEditWin: false,
        currentSelectRow: [],
        currentSelectRowInx: [],
        isDisabled: true,
        isExpandDisabled: false,
        isNotExpandDisabled: true,
        addBtnDisabled: false,
        type: null,
        submitFlag: false,
        menuTreeData: [],
        modifyId: "",
        dictMap: new Map(),
        authTypeList: [],
        flag: false,
        expandTreeData: []
      };
    },
    components: {},
    watch: {
      treeDataChange(val) {
        if (val == true) {
          this.getLeftTreeList();
        }
      }
    },
    computed: {},
    mounted() {
      this.getLeftTreeList();
      this.handleResize();
      on(window, 'resize', this.handleResize);
      this.getDictListByGroups("AuthorityType").then(res => {
        this.authTypeList = res.get("AuthorityType");
        this.dictMap = res.get("map");
      });
    },
    beforeDestroy() {
      off(window, "resize", this.handleResize);
    },
    methods: {
      handleResize() {
        this.$nextTick(() => {
          this.mBarHeight = window.innerHeight;
        });
      },
      // 获取左边树结构
      getLeftTreeList() {
        post({}, '/sm/auth/menu/menuMain/func_queryAllAuthority').then(res => {
          if (res && res.data) {
            let data = (res.data.retData instanceof Array) ? res.data.retData : [res.data.retData];
            this.menuTreeData = data
            this.isDisabled = true;
            this.isExpandDisabled = false;
            this.isNotExpandDisabled = true;
          }
        }).catch(error => {
          this.$msgTip.error(this, {info: this.$t('m.i.common.netError') + error});
        })
      },
      //收拢左侧树
      handleUnExpandTree(arr) {
        this.recursiveTree(arr, false);
        this.isDisabled = !this.isDisabled;
        this.isExpandDisabled = false;
        this.isNotExpandDisabled = true;
      },
      //展开左侧树
      handleExpandTree(arr) {
        this.recursiveTree(arr, true);
        this.isDisabled = !this.isDisabled;
        this.expandTreeData = this.deepClone(arr);
        this.isExpandDisabled = true;
        this.isNotExpandDisabled = false;
      },
      //递归给左侧树赋值
      recursiveTree(arr, isExpand) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].children) {
            arr[i].expand = isExpand
            this.recursiveTree(arr[i].children, isExpand)
          }
        }
      },
      //菜单树点击查询
      queryByParentId() {
        let arr = this.$refs["menuTreeData"].getSelectedNodes();
        if (arr.length !== 0) {
          this.formItem.id = arr[0].id;
          this.currentSelectRow = [];
          this.$refs.datagrid.dataChange(1);
        }
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
        this.recursiveAssigNode(this.menuTreeData, arr);
        this.isAllExpand(this.menuTreeData);
        // 完全收缩
        for (let i = 0; i < this.menuTreeData.length; i++) {
          if (this.menuTreeData[i].expand === false) {
            closeCount++;
          }
        }
        if (closeCount === this.menuTreeData.length) {
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
      //上移、下移
      upOrDownAuthMove(type) {
        let optionType = type;
        let arr = this.$refs["menuTreeData"].getSelectedNodes();
        let id = '';
        if (this.currentSelectRow.length > 1) {
          this.$msgTip.info(this, {info: this.$t('m.i.common.onlyChooseOneData')});
          return;
        }
        if (arr.length === 0 && this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseDataFirst")});
          return;
        }
        if (this.currentSelectRow.length === 0) {
          id = arr[0].id;
        } else {
          id = this.currentSelectRow[0].id;
        }
        this.treeDataChange = false;
        post({optionType: optionType, authId: id}, '/sm/auth/menu/menuMain/func_upDownAuth').then(res => {
          if (res) {
            let msg = res.data.retMsg
            let retCode = res.data.retCode
            if (retCode == "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(1);
              this.currentSelectRow = [];
              this.treeDataChange = true;
              this.isDisabled = true;
              this.isExpandDisabled = false;
              this.isNotExpandDisabled = true;
            } else {
              this.$msgTip.error(this, {info: msg});
              this.$refs.datagrid.dataChange(1);
            }
          } else {
            this.$msgTip.error(this, {info: this.$t('m.i.common.netError')});
          }
        })
      },
      // 行选中
      handleSelectClick(arr, selectInx) {
        this.currentSelectRow = arr;
        this.currentSelectRowInx = selectInx;
        if (this.$refs["menuTreeData"].getSelectedNodes().length !== 0) {
          this.$refs["menuTreeData"].$set(this.$refs["menuTreeData"].getSelectedNodes()[0], 'selected', false);
        }
      },
      // 查询
      handleMenuSearch() {
        this.currentSelectRow = [];
        this.formItem.id = '';
        this.$refs.datagrid.dataChange(1)
      },
      // 新增/修改
      handleForm(str) {
        this.type = str;
        this.readonly = false;
        let arr = this.$refs["menuTreeData"].getSelectedNodes();
        if (this.currentSelectRow.length === 0 && arr.length === 0) {
          this.$msgTip.info(this, {info: "请先选择父节点！"});
          return
        }
        if (this.currentSelectRow.length > 1) {
          this.$msgTip.info(this, {info: this.$t('m.i.common.onlyChooseOneData')});
          return
        }
        if (this.type === "add") {
          if (this.currentSelectRow.length === 0) {
            this.addOrEditForm.parentAuthNo = arr[0].id;
            if (arr[0].path != '' && arr[0].path != null) {
              this.$msgTip.info(this, {info: "父菜单已存在路径，不能新增子菜单!"});
              return;
            }
          } else {
            this.addOrEditForm.parentAuthNo = this.currentSelectRow[0].id;
            if (this.currentSelectRow[0].path != '' && this.currentSelectRow[0].path != null) {
              this.$msgTip.info(this, {info: "父菜单已存在路径，不能新增子菜单!"});
              return;
            }
          }
        }
        if (this.type === "modify") {
          this.readonly = true;
          if (this.currentSelectRow.length === 0) {
            this.modifyId = arr[0].id;
          } else {
            this.modifyId = this.currentSelectRow[0].id;
          }
          post({id: this.modifyId}, '/sm/auth/menu/menuMain/func_findAuthorityById').then(res => {
            if (res) {
              let msg = res.data.retMsg
              let retCode = res.data.retCode
              if (retCode == "000000") {
                this.addOrEditForm.id = res.data.retData.id;
                this.addOrEditForm.authName = res.data.retData.authName;
                this.addOrEditForm.parentAuthNo = res.data.retData.parentAuthNo;
                this.addOrEditForm.authType = res.data.retData.authType.split(",");
                this.addOrEditForm.path = res.data.retData.path;
              } else {
                this.$msgTip.error(this, {info: msg});
              }
            } else {
              this.$msgTip.error(this, {info: this.$t('m.i.common.netError')});
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
            let url = this.type === "add" ? '/sm/auth/menu/menuMain/func_saveAuthorityDto' : '/sm/auth/menu/menuMain/func_updateAuthorityDto'
            this.submitFlag = true;
            post(this.addOrEditForm, url).then(res => {
              this.submitFlag = false
              if (res) {
                let msg = res.data.retMsg
                let retCode = res.data.retCode
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.addOrEditWin = false;
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
                  this.currentSelectRow = [];
                  this.getLeftTreeList();
                } else {
                  this.$msgTip.error(this, {info: msg});
                }
              } else {
                this.$msgTip.error(this, {info: this.$t('m.i.common.netError')});
              }
            });
          }
        });
      },
      //删除
      deleteMenu() {
        let arr = this.$refs["menuTreeData"].getSelectedNodes();
        if (this.currentSelectRow.length === 0 && arr.length === 0) {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseDataFirst")});
          return
        }
        if (this.currentSelectRow.length > 1) {
          this.$msgTip.info(this, {info: this.$t('m.i.common.onlyChooseOneData')});
          return
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
        let arr = this.$refs["menuTreeData"].getSelectedNodes();
        let list = this.currentSelectRow;
        let ids = "";
        if (list.length === 0) {
          ids += arr[0].id;
        } else {
          ids += list[0].id;
        }
        post({id: ids}, '/sm/auth/menu/menuMain/func_deleteAuthority').then(res => {
          if (res) {
            let msg = res.data.retMsg
            let retCode = res.data.retCode
            if (retCode == "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
              this.currentSelectRow = [];
              this.getLeftTreeList();
            } else {
              this.$msgTip.error(this, {info: msg});
            }
          } else {
            this.$msgTip.error(this, {info: this.$t('m.i.common.netError')});
          }
        })
      },
      // 重置查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
      },
      //重置新增/修改窗口
      addOrEditReset() {
        this.$refs.addOrEditForm.resetFields();
        this.addOrEditForm.id = '';
      },
    },

  };
</script>

<style scoped>

</style>
