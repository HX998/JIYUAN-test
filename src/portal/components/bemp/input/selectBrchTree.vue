<!---->
<template>
  <div>
    <slot name="header">
      <h-form-item :label="labelName" :prop="feildName" :required="required" class="h-form-three">
        <h-input v-model="formItem[formType][feildName]" placeholder="" icon="android-search"
                 @on-click="queryBranchName(optType)" readonly clearable @on-clear="clearBranchName(optType)"></h-input>
      </h-form-item>
    </slot>
    <!-- 机构名称选择弹窗框 -->
    <h-msg-box v-model="brchNameSelectWin" width="400" class="h-form-search-layer" :maximize="true"
               :mask-closable="false" :zIndex=1002 @on-maximize="getTreeHeight($event, 'brchNameSelectMsg')" ref="brchNameSelectMsg">
      <p slot="header">
        <span>机构号选择</span>
      </p>
      <div class="h-tree-search">
        <div class="h-modal-header-wrapper">
          <div class="h-modal-header-btn">
            <h-button type="primary" :disabled="isExpandDisabled" @click='expandTree(brchTreeData)'>
              {{$t("m.i.common.expand")}}
            </h-button>
            <h-button type="primary" :disabled="isNotExpandDisabled" @click='unExpandTree(brchTreeData)'>
              {{$t("m.i.common.noExpand")}}
            </h-button>
          </div>
        </div>
        <div class="h-tree-content" style="position:relative;" :style="{height: mTreeHeight + 'px'}">
          <h-tree :data="brchTreeData" ref='brchTreeData' class='h-tree-self' :show-checkbox="showCheckbox"></h-tree>
        </div>
      </div>
      <!-- 弹出框模式底部按钮 -->
      <div slot="footer">
        <h-button type="ghost" @click="brchNameSelectWin=!brchNameSelectWin">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" @click="brchNameAdd()">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>
  </div>
</template>
<script>
  import { post } from "@/api/bizApi/commonUtil";

  export default {
    name: "selectBrchTree",
    data() {
      return {
        brchNameSelectWin: false,
        brchTreeData: [],
        branchType: "query",
        isDisabled: false,
        isExpandDisabled: false,
        isNotExpandDisabled: true,
        formItem: {},
        mTreeHeight: 300,
        flag: false,
      };
    },
    props: {
      formObj: Object || {},
      formType: {
        type: String,
        default: "addForm"
      },
      required: {
        type: Boolean,
        default: false
      },
      labelName: {
        type: String,
        default: "机构名称"
      },
      feildName: {
        type: String,
        default: "brchName"
      },
      optType: {
        type: String,
        default: "add"
      },
      brchName: {
        type: String,
        default: "brchName"
      },
      brchNo: {
        type: String,
        default: "brchNo"
      },
      brchNos: {
        type: String,
        default: "brchNos"
      },
      showCheckbox:false

    },

    created() {
      let typef = this.formType;
      let obj = {};
      if (typef == "addForm") {
        obj = { addForm: this.formObj };
      } else {
        obj = { formItem: this.formObj };
      }
      this.formItem = obj;
    },
    mounted() {

      let typef = this.formType;
      let obj = {};
      if (typef == "addForm") {
        obj = { addForm: this.formObj };
      } else {
        obj = { formItem: this.formObj };
      }
      this.formItem = obj;

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
      queryBranchName(str) {
        this.branchType = str;
        post({}, "/sm/auth/branch/queryBranchTree").then(res => {
          if (res && res.data) {
            let data = (res.data.retData instanceof Array) ? res.data.retData : [res.data.retData];
            this.brchTreeData = data;
            this.expandTree(this.brchTreeData);
          }
          this.brchNameSelectWin = true;
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      },
      clearBranchName(optType) {
        if (optType === "add") {
          this.formItem[this.formType][this.brchName] = "";
          this.formItem[this.formType][this.brchNo] = "";
        } else if (optType === "query") {
          this.formItem[this.formType][this.brchName] = "";
          this.formItem[this.formType][this.brchNo] = "";
        }
      },
      //收拢左侧树
      unExpandTree(arr) {
        this.recursiveTree(arr, false);
        this.isDisabled = false;
        this.isExpandDisabled = false;
        this.isNotExpandDisabled = true;
      },
      //展开左侧树
      expandTree(arr) {
        this.recursiveTree(arr, true);
        this.isDisabled = true;
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
      brchNameAdd() {
        if(this.showCheckbox){
          let selectedNodes = this.$refs["brchTreeData"].getCheckedNodes(false);
          if (selectedNodes != null && selectedNodes.length !== 0) {
            let brchNos = "";
            let brchList = [];
            let brchNames = "";
            for(var i=0;i<selectedNodes.length; i++){
              brchList.push(selectedNodes[i].id);
              brchNos += selectedNodes[i].id + ',';
              brchNames += selectedNodes[i].title + ',';
            }
            this.formItem[this.formType][this.brchNo] = brchNos.substring(0,brchNos.length - 1);
            this.formItem[this.formType][this.brchNos] = brchList;
            this.formItem[this.formType][this.brchName] = brchNames.substring(0,brchNames.length - 1);
          } else {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          }
        }else{
          let arr = this.$refs["brchTreeData"].getSelectedNodes();
          if (arr.length === 0) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
            return;
          }
          if (this.branchType === "add") {
            this.formItem[this.formType][this.brchName] = arr[0].title;
            this.formItem[this.formType][this.brchNo] = arr[0].id;
          } else if (this.branchType === "query") {
            this.formItem[this.formType][this.brchName] = arr[0].title;
            this.formItem[this.formType][this.brchNo] = arr[0].id;
          }
        }
        this.brchNameSelectWin = false;
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
        this.recursiveAssigNode(this.brchTreeData, arr);
        this.isAllExpand(this.brchTreeData);
        // 完全收缩
        for (let i = 0; i < this.brchTreeData.length; i++) {
          if (this.brchTreeData[i].expand === false) {
            closeCount++;
          }
        }
        if (closeCount === this.brchTreeData.length) {
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
