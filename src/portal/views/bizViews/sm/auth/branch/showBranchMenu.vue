<!--查看菜单-->
<template>
  <h-msg-box v-model="tempShowBranchMenuWin" :mask-closable="false" @on-close="handleClose" class="h-form-search-layer"
             :maximize="true" @on-maximize="getTreeHeight($event, 'showBranchMenuMsg')" ref="showBranchMenuMsg">
    <p slot="header">
      <span>{{title}}</span>
    </p>
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
        <h-tree :data="branchMenuData" ref='branchMenuTree' class='h-tree-self' @on-toggle-expand="toggleExpand"></h-tree>
        <h-spin size="large" v-if="showLoading" fix></h-spin>
      </div>
    </div>
    <!-- 弹出框模式底部按钮 -->
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
    </div>
  </h-msg-box>
</template>
<script>
  import { post } from "@/api/bizApi/commonUtil";

  export default {
    name: "showBranchMenu",
    data() {
      return {
        branchMenuData: [],
        expandDisabled :false,
        isExpandDisabled: false,
        isNotExpandDisabled: true,
        flag:false,
        showLoading : true,
        mTreeHeight: 300
      };
    },
    props: {
      title: String,
      showBranchMenuWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      brchNo: "",
      userNo: "",
      //区分机构角色和机构管理员角色，1-机构角色，2-机构管理员角色
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
      showBranchMenuWin(val) {
        if (val === true) {
          this.getBrchMenuTreeList();
        }
      }
    },
    computed: {
      tempShowBranchMenuWin: {
        get() {
          return this.showBranchMenuWin;
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
      //获取机构角色对应菜单
      getBrchMenuTreeList() {
        let params = this.roleType === "1" ? { brchNo: this.brchNo } : { userNo: this.userNo,licenseFlag:this.licenseFlag,ownedBrchNo:this.ownedBrchNo};
        let url = this.roleType === "1" ? "/sm/auth/branch/queryBranchAuth" : "/sm/auth/branchUser/branchUser/func_queryUserAuthority";
        post(params, url).then(res => {
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
      handleClose() {
        this.$emit("showBranchMenuWinClose", "");
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
    }
  };
</script>
<style>

</style>
