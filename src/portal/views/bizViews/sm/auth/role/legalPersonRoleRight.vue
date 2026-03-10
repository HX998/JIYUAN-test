<!--角色设置/分配操作权限-->
<template>
  <h-msg-box v-model="templegalRoleWin" :mask-closable="false" @on-close="handleClose" class="h-form-search-layer"
             :maximize="true" top="10" @on-maximize="getTreeHeight($event, 'legalRoleMsg')" ref="legalRoleMsg">
    <p slot="header">
      <span>设置菜单</span>
    </p>
    <div class="h-tree-search" ref="treeWinModel">
      <div class="h-modal-header-wrapper">
        <div class="h-modal-header-btn">
          <h-button type="ghost" :disabled="isExpandDisabled" @click='expandTree(treeData)'>{{$t("m.i.common.expand")}}
          </h-button>
          <h-button type="ghost" :disabled="isNotExpandDisabled" @click='unExpandTree(treeData)'>
            {{$t("m.i.common.noExpand")}}
          </h-button>
        </div>
      </div>
      <!--弹出框内容-->
      <div class="h-tree-content" style="position:relative;" :style="{height: mTreeHeight + 'px'}"
           @DOMMouseScroll.prevent.stop="handleScroll"
           @mousewheel.prevent.stop="handleScroll" ref="treeContent">
        <h-tree :data="treeData" ref='tree' class='h-tree-self' show-checkbox @on-toggle-expand="toggleExpand"></h-tree>
        <h-spin size="large" v-if="showLoading" fix></h-spin>
      </div>
      <!--弹出框加载中-->
      <!-- 弹出框模式底部按钮 -->
    </div>
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
      <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
      <h-button type="primary" v-else @click='treeSubmit'>{{$t("m.i.common.confirm")}}</h-button>
    </div>
  </h-msg-box>
</template>
<script>
  import { post } from "@/api/bizApi/commonUtil";

  export default {
    name: "legalPersonRoleRight",
    data() {
      return {
        treeData: [],
        expandDisabled: false,
        isExpandDisabled: false,
        isNotExpandDisabled: true,
        showLoading: true,
        submitFlag: false,
        mTreeHeight: 360,
        flag: false,
      };
    },
    props: {
      title: String,
      showLegalRoleWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      roleId: {
        type: String,
        default() {
          return "";
        }
      }
    },
    watch: {
      showLegalRoleWin(val) {
        if (val) {
          this.expandDisabled = false;
          this.isExpandDisabled = false;
          this.isNotExpandDisabled = true;
          this.getPermissionTreeList();
          this.$nextTick(() => {
            this.$refs.treeContent.scrollTop = 0;
          });
        }
      }
    },
    methods: {
      getTreeHeight(isMax, msgRef) {
        this.$nextTick(() => {
          if(isMax) {
            let headerHeight = this.$refs[msgRef].$el.getElementsByClassName('h-modal-header')[0].offsetHeight;
            let footerHeight = this.$refs[msgRef].$el.getElementsByClassName('h-modal-footer')[0].offsetHeight;
            let headerBtnHeight = this.$refs[msgRef].$el.getElementsByClassName('h-modal-header-wrapper')[0].offsetHeight;
            let mTreeHeight = window.innerHeight - (headerHeight+1) - (footerHeight+1) - headerBtnHeight - 20;
            if(window.sessionStorage.getItem("isTransfer") === "0") {
              let appObj = document.getElementsByClassName("app-main");
              let appOffsetHeight = appObj.length == 0 ? 0 : appObj[0].offsetHeight;
              mTreeHeight = appOffsetHeight - (headerHeight+1) - (footerHeight+1) - headerBtnHeight - 20;
            }
            this.mTreeHeight = mTreeHeight;
          } else {
            this.mTreeHeight = 300;
          }
        });
      },
      handleScroll (e) {
        let type = e.type;
        let delta = 0;
        if (type === 'DOMMouseScroll' || type === 'mousewheel') {
          delta = (e.wheelDelta) ? e.wheelDelta : -(e.detail || 0) * 40;
        }
        e.currentTarget.scrollTop -= delta;
      },
      getPermissionTreeList() {
        post({ "authorityType": "1", "roleId": this.roleId }, "/sm/auth/authority/queryAssignedRoleAuths").then(res => {
          if (res && res.data) {
            this.showLoading = false;
            this.treeData = res.data.retData;
            // 给左侧树赋值
            this.expandTree(this.treeData);
          }
        });
      },
      treeSubmit() {
        let code = "";
        // 与初次值进行对比,去掉没有实际改变的值，同时拼接提交字符串值
        let checkedArr = this.$refs["tree"].getCheckedNodes();
        for (let i = 0; i < checkedArr.length; i++) {
          code += checkedArr[i].id + ",";
        }
        this.submitFlag = true;
        post({ "id": this.roleId, "code": code }, "/sm/auth/roleAuth/authorizeRoleAuthority").then(res => {
          this.submitFlag = false;
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$msgTip.success(this);
              this.$emit("legalRoleWinClose", "");
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
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
      handleClose() {
        this.$emit("legalRoleWinClose", ""); //handleAction
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
        this.recursiveAssigNode(this.treeData, arr);
        this.isAllExpand(this.treeData);
        // 完全收缩
        for (let i = 0; i < this.treeData.length; i++) {
          if (this.treeData[i].expand === false) {
            closeCount++;
          }
        }
        if (closeCount === this.treeData.length) {
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
    computed: {
      templegalRoleWin: {
        get() {
          return this.showLegalRoleWin;
        },
        set() {
        }
      }
    }
  };
</script>
<style>

</style>
