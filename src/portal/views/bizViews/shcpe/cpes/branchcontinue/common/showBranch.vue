<!--机构查询-->
<template>
  <h-msg-box v-model="tempShowBranchWin" :mask-closable="false" @on-close="handleClose" class="h-form-search-layer" :z-index=1200
    :maximize="true" @on-maximize="getTreeHeight($event, 'showBranchMsg')" ref="showBranchMsg">
    <p slot="header">
      <span>{{title}}</span>
    </p>
    <div class="h-tree-search">
      <!--弹出框模式标题-->
      <div class="h-modal-header-wrapper">
        <div class="h-modal-header-btn">
          <h-button type="primary" :disabled="isExpandDisabled" @click='expandTree(branchList)'>
            {{$t("m.i.common.expand")}}
          </h-button>
          <h-button type="primary" :disabled="isNotExpandDisabled" @click='unExpandTree(branchList)'>
            {{$t("m.i.common.noExpand")}}
          </h-button>
        </div>
      </div>
      <!--弹出框内容-->
      <div class="h-tree-content" style="position:relative;" :style="{height: mTreeHeight + 'px'}">
        <h-tree v-if="true" :data="branchList" ref='branchTree' class='h-tree-self' onlyUpdateDown multiple show-checkbox @on-toggle-expand="toggleExpand"></h-tree>
        <h-tree v-else :data="branchList" ref='branchTree' class='h-tree-self' @on-toggle-expand="toggleExpand"></h-tree>
        <h-spin size="large" v-if="showLoading" fix></h-spin>
      </div>
    </div>
    <!-- 弹出框模式底部按钮 -->
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
      <h-button type="primary" @click="submitForm">{{$t("m.i.common.commit")}}</h-button>
    </div>
  </h-msg-box>
</template>
<script>
  import { post } from "@/api/bizApi/commonUtil";

  export default {
    name: "showBranch",
    data() {
      return {
        branchList: [],
        expandDisabled: false,
        isExpandDisabled: false,
        isNotExpandDisabled: true,
        flag:false,
        showLoading: true,
        mTreeHeight: 300
      }
    },
    props: {
      title: String,
      showBranchWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      ifcheck: {
        default() {
          return false;
        }
      },
      checkStrictly: {
        type: Boolean,
        default() {
          return false;
        }
      },
      multiple: {
        type: Boolean,
        default() {
          return false;
        }
      }
    },
    watch: {
      showBranchWin(val) {
        if (val === true) {
          this.getBranchTreeList();
        }
      }
    },
    computed: {
      tempShowBranchWin: {
        get() {
          return this.showBranchWin;
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
      //获取机构
      getBranchTreeList() {
        let params = {};
        let url = "/sm/auth/branch/queryBranchTree";
        post(params, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.showLoading = false;
              this.branchList = (res.data.retData instanceof Array) ? res.data.retData : [res.data.retData];
              this.expandTree(this.branchList);
            } else {
              this.showLoading = false;
              this.branchList = [];
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
      submitForm() {
        let selectedNodes = [];
        selectedNodes = this.$refs["branchTree"].getCheckedNodes(false);
        if (selectedNodes != null && selectedNodes.length !== 0) {
          this.$emit("brchNoChange", selectedNodes);
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      handleClose() {
        this.$emit("showBranchWinClose", "");
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
        this.recursiveAssigNode(this.branchList, arr);
        this.isAllExpand(this.branchList);
        // 完全收缩
        for (let i = 0; i < this.branchList.length; i++) {
          if (this.branchList[i].expand === false) {
            closeCount++;
          }
        }
        if (closeCount === this.branchList.length) {
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
