<template>
  <h-msg-box v-model="tempProductSelectWin" @on-close="handleClose" class="h-form-search-layer"
             :maximize="true" :mask-closable="false" :z-index=1010
             @on-maximize="getTreeHeight($event, 'productSelectMsg')" ref="productSelectMsg">
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
        <h-tree :data="productTreeData" ref='productTreeData' class='h-tree-self' :show-checkbox="multiple"
                :multiple="multiple" @on-toggle-expand="toggleExpand"></h-tree>
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
    name: "commonProductSelect",
    data() {
      return {
        productTreeData: [],
        expandDisabled: false,
        submitFlag: false,
        mTreeHeight: 300,
        isExpandDisabled: false,
        isNotExpandDisabled: true,
        flag:false
      };
    },
    components: {},
    watch: {
      productSelectWin(val) {
        if (val === true) {
          this.getProductTreeList();
        }
      }
    },
    computed: {
      tempProductSelectWin: {
        get() {
          return this.productSelectWin;
        },
        set() {
        }
      }
    },
    props: {
      title: {
        type: String,
        default: "产品号选择"
      },
      productSelectWin: {
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
      getProductTreeList() {
        post({}, "/bm/prod/product/queryProductMaintenanceTree").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.productTreeData = (res.data.retData instanceof Array) ? res.data.retData : [res.data.retData];
              this.expandTree(this.productTreeData);
            } else {
              this.productTreeData = [];
              this.$msgTip.error(this, { info: msg });
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
      //确定
      treeSubmit() {
        let arr = [];
        if (this.multiple) {
          arr = this.$refs["productTreeData"].getCheckedNodes();
        } else {
          arr = this.$refs["productTreeData"].getSelectedNodes();
        }
        if (arr != null && arr.length !== 0) {
          this.$emit("productSelectChange", arr);
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
        }
      },
      //关闭
      handleClose() {
        this.$emit("productSelectWinClose", "");
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

<style scoped>

</style>
