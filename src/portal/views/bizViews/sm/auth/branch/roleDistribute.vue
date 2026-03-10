<!--角色分配-->
<template>
  <h-msg-box v-model="tempRoleDistributeWin" :mask-closable="false" @on-close="handleClose" class="h-form-search-layer"
             :maximize="true" @on-maximize="getTreeHeight($event, 'roleDistributeMsg')" ref="roleDistributeMsg">
    <p slot="header">
      <span>{{title}}</span>
    </p>
    <div class="h-tree-search">
      <!--弹出框模式标题-->
      <div class="h-modal-header-wrapper">
        <div class="h-modal-header-btn">
          <h-button type="primary" :disabled="isExpandDisabled" @click='expandTree(roleTreeData)'>
            {{$t("m.i.common.expand")}}
          </h-button>
          <h-button type="primary" :disabled="isNotExpandDisabled" @click='unExpandTree(roleTreeData)'>
            {{$t("m.i.common.noExpand")}}
          </h-button>
        </div>
      </div>
      <!--弹出框内容-->
      <div class="h-tree-content" style="position:relative;" :style="{height: mTreeHeight + 'px'}">
        <h-tree :data="roleTreeData" ref='roleTree' class='h-tree-self' show-checkbox notDeepCopy @on-toggle-expand="toggleExpand"></h-tree>
        <h-spin size="large" v-if="showLoading" fix></h-spin>
      </div>
    </div>
    <!-- 弹出框模式底部按钮 -->
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
      <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
      <h-button type="primary" v-else @click='treeSubmit'>{{$t("m.i.common.commit")}}</h-button>
    </div>
  </h-msg-box>
</template>
<script>
  import { post } from "@/api/bizApi/commonUtil";

  export default {
    name: "roleDistribute",
    data() {
      return {
        roleTreeData: [],
        checkedRoleIds: "",
        expandDisabled: false,
        isExpandDisabled: false,
        isNotExpandDisabled: true,
        flag:false,
        showLoading: true,
        submitFlag: false,
        mTreeHeight: 300
      };
    },
    props: {
      title: String,
      roleDistributeWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      brchNo: "",
      userNo: "",
      legalNo: "",
      //区分机构角色和机构管理员角色，1-机构角色，2-机构柜员，3-机构管理员角色
      roleType: {
        type: String
      },
      licenseFlag:{   //集中授权标识
        type:Boolean,
        default() {
          return false;
        }
      },
      ownedBrchNo:{   //业务所属机构号
        type:String,
        default(){
          return ""
        }
      }
    },
    watch: {
      roleDistributeWin(val) {
        if (val === true) {
          this.getBrchRoleTreeList();
        }
      }
    },
    computed: {
      tempRoleDistributeWin: {
        get() {
          return this.roleDistributeWin;
        },
        set() {
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
      getBrchRoleTreeList() {
        let params = this.roleType === "1" ? { brchNo: this.brchNo } : { userNo: this.userNo ,licenseFlag:this.licenseFlag,ownedBrchNo:this.ownedBrchNo};
        let url = this.roleType === "1" ? "/sm/auth/branch/func_queryRoleTree" : "/sm/auth/branchUser/func_queryRoleTree";
        post(params, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.showLoading = false;
              this.roleTreeData = (res.data.retData instanceof Array) ? res.data.retData : [res.data.retData];
              this.expandTree(this.roleTreeData);
            } else {
              this.showLoading = false;
              this.roleTreeData = [];
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
        this.expandDisabled = false;
        this.isExpandDisabled = false;
        this.isNotExpandDisabled = true;
      },
      //展开左侧树
      expandTree(arr) {
        this.recursiveTree(arr, true);
        this.expandDisabled = true;
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
      treeSubmit() {
        this.checkedRoleIds = "";
        let checkedNodes = this.$refs["roleTree"].getCheckedNodes();
        this.submitFlag = true;
        for (let item of checkedNodes) {
          if (item.id !== "0") {
            this.checkedRoleIds += item.id + ",";
          }
        }
        let params = this.roleType === "1" ? {
          brchNo: this.brchNo,
          roleIds: this.checkedRoleIds
        } : this.roleType === "2" ? { userNo: this.userNo, roleIds: this.checkedRoleIds }
          : { brchNo: this.brchNo, userNo: this.userNo, roleIds: this.checkedRoleIds };
        let url = this.roleType === "1" ? "/sm/auth/branch/roleDistribute/func_distributeBranchRole" : this.roleType === "2" ? "/sm/auth/branch/roleDistribute/func_distributeUserRole2" : "/sm/auth/branch/roleDistribute/func_distributeUserRole3";
        post(params, url).then(res => {
          this.submitFlag = false;
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$emit("roleDistributeSubmit", "");
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      handleClose() {
        this.$emit("roleDistributeWinClose", "");
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
        this.recursiveAssigNode(this.roleTreeData, arr);
        this.isAllExpand(this.roleTreeData);
        // 完全收缩
        for (let i = 0; i < this.roleTreeData.length; i++) {
          if (this.roleTreeData[i].expand === false) {
            closeCount++;
          }
        }
        if (closeCount === this.roleTreeData.length) {
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
    }
  };
</script>
<style>

</style>
