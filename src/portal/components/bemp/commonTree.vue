<!--通用树组件弹框-->
<template>
  <h-msg-box v-model="tempCommonTreeWin" :mask-closable="false" @on-close="handleClose" class="h-form-search-layer"
             :z-index=1200 :maximize="true" @on-maximize="getTreeHeight($event, 'commonTreeMsg')" ref="commonTreeMsg">
    <p slot="header">
      <span>{{title}}</span>
    </p>
    <div class="h-tree-search">
      <!--弹出框模式标题-->
      <div class="h-modal-header-wrapper">
        <div class="h-modal-header-btn">
          <h-button type="primary" :disabled="isExpandDisabled" @click='expandTree(treeDataList)'>
            {{$t("m.i.common.expand")}}
          </h-button>
          <h-button type="primary" :disabled="isNotExpandDisabled" @click='unExpandTree(treeDataList)'>
            {{$t("m.i.common.noExpand")}}
          </h-button>
          <slot name="checkStrictly" v-if="isTree"></slot>
          <slot></slot>
        </div>
      </div>
      <!--弹出框内容-->
      <div class="h-tree-content" style="position:relative;" :style="{height: mTreeHeight + 'px'}">
        <h-tree :data="treeDataList" ref='treeRef' class='h-tree-self' :selectToCheck="ifcheck" :show-checkbox="ifcheck"
                :checkStrictly="tempCheckStrictly" :multiple="multiple" :onlyUpdateDown="onlyUpdateDown" @on-toggle-expand="toggleExpand"
                :notDeepCopy="notDeepCopy" :class="isShowRadioIcon ? {'h-tree-radio-select': !ifcheck} : ''"></h-tree>
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
    name: "commonTree",
    data() {
      return {
        treeDataList: [],
        expandDisabled: false,
        isExpandDisabled: false,
        isNotExpandDisabled: true,
        showLoading: true,
        mTreeHeight: 300,
        tempCheckStrictly: this.checkStrictly,
        isTree: true,     //非树形结构时不展示
        flag: false,
        expandTreeData: []
      };
    },
    props: {
      title: {
        type: String,
        default: ""
      },
      commonTreeWin: {
        type: Boolean,
        default: false
      },
      ifcheck: {//是否显示复选框，默认不显示
        type: Boolean,
        default: false
      },
      checkStrictly: {//父子节点是否联动，false-联动，true-不联动
        type: Boolean,
        default: false
      },
      multiple: {//是否支持多选，false-不支持，true-支持
        type: Boolean,
        default: false
      },
      onlyUpdateDown: {//父子组件级联时是否只向下级联，不向上级联，false-向上级联，true-不向上级联
        type: Boolean,
        default: false
      },
      notDeepCopy: {//组件data属性传入组件中变量是否随组件内部修改而修改，false-不修改，true-修改
        type: Boolean,
        default: false
      },
      deepCopyForExpend: {//展开收缩时是否记住勾选值
        type: Boolean,
        default: true
      },
      url: {
        type: String,
        default: ""
      },
      params: {//调用接口时对应参数
        type: Object,
        default() {
          return {};
        }
      },
      required: {//点击确定按钮时是否必选，false-否，true-是
        type: Boolean,
        default: false
      },
      isFilterChildren: {//是否只返回不存在children的子节点，默认返回全部选中节点
        type: Boolean,
        default: false
      },
      isNeedChecked: {//反显时是否需选中已选项
        type: Boolean,
        default: true
      },
      checkedDataArr: {//待选中数据，仅在isNeedChecked为true时生效，只有当checkStrictly为true时，勾选数据与反显数据一致
        type: Array,
        default() {
          return [];
        }
      },
      isNeedExpand: {//是否默认展开
        type: Boolean,
        default: true
      },
      isShowRadioIcon: {//单选时是否显示单选图标
        type: Boolean,
        default: false
      }
    },
    watch: {
      tempCommonTreeWin(val) {
        if (val === true) {
          this.getTreeDataList();
        }
      },
      checkStrictly(val) {
        this.tempCheckStrictly = val;
      }
    },
    computed: {
      tempCommonTreeWin: {
        get() {
          return this.commonTreeWin;
        },
        set() {
        }
      }
    },
    methods: {
      getTreeDataList() {
        post(this.params, this.url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.showLoading = false;
              this.treeDataList = (res.data.retData instanceof Array) ? res.data.retData : [res.data.retData];
              this.checkTree(this.treeDataList);
              if (this.isNeedChecked && this.checkedDataArr.length > 0) {
                if(this.ifcheck) {
                  this.tempCheckStrictly = true;
                  this.recursiveTree(this.checkedDataArr, this.treeDataList, "checked", true);
                } else {
                  this.recursiveTree(this.checkedDataArr, this.treeDataList, "selected", true);
                }
              }
              if (this.isNeedExpand) {
                if(this.deepCopyForExpend) {
                  this.$nextTick(() => {
                    this.expandTree(this.treeDataList);
                  })
                } else {
                  this.expandTree(this.treeDataList);
                }
              }
              this.$nextTick(() => {
                this.tempCheckStrictly = this.checkStrictly;
              });
            } else {
              this.showLoading = false;
              this.treeDataList = [];
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //验证当前是否为树形结构
      checkTree(arr) {
        this.isTree = arr.some(child => {
          return child.children != null && (Array.isArray(child.children) && child.children.length > 0)
        });
      },
      //收拢左侧树
      unExpandTree(arr) {
        this.recursiveTreeSetAttr(arr, "expand", false);
        this.expandDisabled = false;
        this.isExpandDisabled = false;
        this.isNotExpandDisabled = true;
      },
      //展开左侧树
      expandTree(arr) {
        this.recursiveTreeSetAttr(arr, "expand", true);
        this.expandDisabled = true;
        this.isExpandDisabled = true;
        this.isNotExpandDisabled = false;
      },
      /**
       * 递归给左侧树赋值
       * @param arr       赋值数据源
       * @param attribute   属性，expand
       * @param attributeValue      属性值
       */
      recursiveTreeSetAttr(arr, attribute, attributeValue) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].children) {
            this.$set(arr[i], attribute, attributeValue);
            this.recursiveTreeSetAttr(arr[i].children, attribute, attributeValue);
          }
        }
      },
      /**
       * 递归左侧树进行勾选
       * @param targetArr       赋值数据源
       * @param treeDataList    初始数据
       * @param attribute   属性，checked
       * @param attributeValue      属性值
       */
      recursiveTree(targetArr, treeDataList, attribute, attributeValue) {
        treeDataList = treeDataList == null ? this.treeDataList : treeDataList;
        for (let i = 0; i < treeDataList.length; i++) {
          for (let j = 0; j < targetArr.length; j++) {
            if (targetArr[j] === treeDataList[i].id || targetArr[j] === treeDataList[i].title) {
              this.$set(treeDataList[i], attribute, attributeValue);
            }
          }
          if (treeDataList[i].children) {
            this.recursiveTree(targetArr, treeDataList[i].children, attribute, attributeValue);
          }
        }
      },
      submitForm() {
        let selectedNodes = [];
        if (this.ifcheck) {
          selectedNodes = this.$refs["treeRef"].getCheckedNodes();
        } else {
          selectedNodes = this.$refs["treeRef"].getSelectedNodes();
        }
        if (this.isFilterChildren) {
          selectedNodes = selectedNodes.filter(item => {
            return item.children == null;
          });
        }
        if (this.required) {
          if (selectedNodes != null && selectedNodes.length !== 0) {
            this.$emit("treeSelectedChange", selectedNodes);
          } else {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          }
        } else {
          this.$emit("treeSelectedChange", selectedNodes);
        }
      },
      handleClose() {
        this.$emit("commonTreeWinClose", "");
      },
      //计算树高度
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
        this.recursiveAssigNode(this.treeDataList, arr);
        this.isAllExpand(this.treeDataList);
        // 完全收缩
        for (let i = 0; i < this.treeDataList.length; i++) {
          if (this.treeDataList[i].expand === false) {
            closeCount++;
          }
        }
        if (closeCount === this.treeDataList.length) {
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
