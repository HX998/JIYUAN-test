<!--产品分配-->
<template>
  <h-msg-box v-model="tempProductDistributeWin" @on-close="handleClose" class="h-form-search-layer"
             :maximize="true" :mask-closable="false" @on-maximize="getTreeHeight($event, 'productDistributeMsg')" ref="productDistributeMsg">
    <p slot="header">
      <span>{{title}}</span>
    </p>
    <div class="h-tree-search">
      <!--弹出框模式标题-->
      <div class="h-modal-header-wrapper">
        <div class="h-modal-header-btn">
          <h-button type="primary" :disabled="isExpandDisabled" @click='expandTree(productTreeData)'>
            {{$t("m.i.common.expand")}}
          </h-button>
          <h-button type="primary" :disabled="isNotExpandDisabled" @click='unExpandTree(productTreeData)'>
            {{$t("m.i.common.noExpand")}}
          </h-button>
        </div>
      </div>
      <!--弹出框内容-->
      <div class="h-tree-content" style="position:relative;" :style="{height: mTreeHeight + 'px'}">
        <h-tree :data="productTreeData" ref='productTreeData' class='h-tree-self' :show-checkbox="ifCheck"
                :notDeepCopy="ifCheck" @on-toggle-expand="toggleExpand"></h-tree>
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
    name: "productDistribute",
    data() {
      return {
        productTreeData: [],
        checkedProdNos: "",
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
      title: {
        type: String,
        default: "产品授权"
      },
      productDistributeWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      ifCheck: {
        type: Boolean,
        default() {
          return true;
        }
      },
      brchNo: "",
      legalNo: "",
      optType: ""
    },
    watch: {
      productDistributeWin(val) {
        if (val === true) {
          this.getProductTreeList();
        }
      }
    },
    computed: {
      tempProductDistributeWin: {
        get() {
          return this.productDistributeWin;
        },
        set() {
        }
      }
    },
    methods: {
      getProductTreeList() {
        let params = this.optType === "1" ? { legalNo: this.legalNo, optType: 1 } : { brchNo: this.brchNo, optType: 2 };
        let url = "/bm/prod/product/queryProductMaintenanceTree";
        post(params, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.showLoading = false;
              this.productTreeData = (res.data.retData instanceof Array) ? res.data.retData : [res.data.retData];
              this.expandTree(this.productTreeData);
            } else {
              this.showLoading = false;
              this.productTreeData = [];
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
        let prodNos = "";
        let arr = this.$refs["productTreeData"].getCheckedNodes(true);
        for (let item of arr) {
          prodNos += item.id + ",";
        }
        this.submitFlag = true;
        let params = this.optType === "1" ? { legalNo: this.legalNo, prodNos: prodNos } : {
          brchNo: this.brchNo,
          prodNos: prodNos
        };
        let url = this.optType === "1" ? "/bm/prod/product/productMain/func_saveAssignLegalProduct" : "/bm/prod/product/productMain/func_saveAssignBranchProduct";
        post(params, url).then(res => {
          this.submitFlag = false;
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$emit("productDistributionSubmit", "");
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      handleClose() {
        this.$emit("productDistributeWinClose", "");
      },
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
        this.recursiveAssigNode(this.productTreeData, arr);
        this.isAllExpand(this.productTreeData);
        // 完全收缩
        for (let i = 0; i < this.productTreeData.length; i++) {
          if (this.productTreeData[i].expand === false) {
            closeCount++;
          }
        }
        if (closeCount === this.productTreeData.length) {
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
