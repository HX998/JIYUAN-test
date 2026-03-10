<!--角色设置/分配操作权限-->
<template>
  <h-msg-box v-model="tempRoleRightWin" :mask-closable="false" @on-close="handleClose" class="h-form-search-layer"
             :maximize="true" @on-maximize="getTreeHeight($event, 'roleRightMsg')" ref="roleRightMsg">
    <p slot="header">
      <span>设置菜单</span>
    </p>
    <div class="h-tree-search" ref="treeWinModel">
      <!--弹出框模式标题-->
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
      <div class="h-tree-content" style="position:relative;" :style="{height: mTreeHeight + 'px'}">
        <h-tree :data="treeData" ref='tree' class='h-tree-self' show-checkbox @on-toggle-expand="toggleExpand"></h-tree>
        <h-spin size="large" v-if="showLoading" fix></h-spin>
      </div>
      <!--弹出框加载中-->

    </div>
    <!-- 弹出框模式底部按钮 -->
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
    name: "branchTemporaryRoleRight",
    data() {
      return {
        title: "",
        search: "",
        treeData: [],
        searchReault: [], // 查询结果数组
        searchReaultEl: [], // 查询结果对应el
        curentSearchIndex: 0, // 当前检索index
        searchTotal: 0, // 查询结果数量,
        treeHeight: null,
        modifyArray: [],
        treeOldArray: [],
        firstRender: true,
        submitString: "",
        moveDisabled: true,
        expandDisabled: false,
        isExpandDisabled: false,
        isNotExpandDisabled: true,
        flag:false,
        showLoading: true,
        submitFlag: false,
        rootArr: [],
        mTreeHeight: 360
      };
    },
    props: {
      showRoleRightWin: {
        type: Boolean,
        default: false
      },
      roleId: {
        type: [String, Number],
        default: ""
      }

    },
    watch: {
      curentSearchIndex(curIndex, oldVal) {
        if (curIndex <= this.searchTotal && curIndex > 0 && this.searchReaultEl && this.searchReaultEl.length > 0) {
          this.searchReaultEl[curIndex - 1].style.background = "#a8d6fe";
          if (oldVal > 0) {
            this.searchReaultEl[oldVal - 1].style.background = "";
          }
        }
      },
      showRoleRightWin(val) {
        if (val) {
          this.getPermissionTreeList();
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
      // 输入框输入值进行查询
      handleSearch() {
        this.searchReault = [];
        this.filterSearch(this.treeData);
        this.searchReault = this.getSearchNodes();
        if (this.searchReault.length > 0) {
          this.searchTotal = this.searchReault.length;
          this.$nextTick(function() {
            this.searchReaultEl = this.$refs.tree.$el.getElementsByClassName("h-tree-title-search");
            this.curentSearchIndex = 1;
            document.getElementsByClassName("h-tree-content")[0].scrollTop = this.searchReaultEl[this.curentSearchIndex - 1].offsetTop;
            this.moveDisabled = this.searchTotal == 1 ? true : false;
            this.expandDisabled = true;
            this.isExpandDisabled = true;
            this.isNotExpandDisabled = false;
          });
        } else {
          this.curentSearchIndex = 0;
          this.searchTotal = 0;
          this.moveDisabled = true;
          this.expandDisabled = false;
          this.isExpandDisabled = false;
          this.isNotExpandDisabled = true;
        }
      },
      // 过滤查询值
      filterSearch(arr) {
        let that = this;
        let isExpand = false;
        for (let item of arr) {
          if (this.search != "" && item.title.indexOf(this.search) >= 0) {
            that.$set(item, "search", true);
            isExpand = true;
          } else {
            that.$set(item, "search", false);
          }
          if (item.children && item.children.length > 0) {
            if (this.filterSearch(item.children)) {
              that.$set(item, "expand", true);
              isExpand = true;
            } else {
              that.$set(item, "expand", false);
            }
          }
        }
        return isExpand;
      },
      getPermissionTreeList() {
        let params = window.sessionStorage.getItem("legalPersonRoleRight");
        let json = JSON.parse(params);
        post({ "authorityType": "2", "roleId": json.id }, "/sm/auth/authority/queryAssignedRoleAuths").then(res => {
          if (res && res.data) {
            this.showLoading = false;
            this.firstRender = true;
            let isUnderscore = window.LOCAL_CONFIG.isUnderscore + "";
            if (isUnderscore == "true") {
              this.treeData = res.data.retData;
            } else {
              this.treeData = res.data.retData;
            }
            // 给左侧树赋值
            this.expandTree(this.treeData);
          }
        });
      },
      handleSearchNext() {
        if (this.curentSearchIndex < this.searchTotal) {
          this.curentSearchIndex = this.curentSearchIndex + 1;
          document.getElementsByClassName("h-tree-content")[0].scrollTop = this.searchReaultEl[this.curentSearchIndex - 1].offsetTop;
        } else {
          this.$hMessage.info(this.$t("m.i.common.isLastOne"));
        }
      },
      // 获取查询节点
      getSearchNodes() {
        return this.$refs.tree.flatState.filter(obj => obj.node.search).map(obj => obj.node);
      },
      // 重置查询结果
      resetSearch() {
        if (this.searchTotal > 0 && this.curentSearchIndex > 0) {
          this.searchReaultEl[this.curentSearchIndex].style.background = "";
        }
      },
      updateDown(nodeList, root, type, event, modifyArr) {
        let that = this;
        for (let item of nodeList) {
          if (root[item].node[type] !== event) {
            that.$set(root[item].node, type, event);
            // 将更新的节点保存
            modifyArr.push(root[item].node);
          }
          if (root[item].children && root[item].children.length > 0) {
            that.updateDown(root[item].children, root, type, event, modifyArr);
          }
        }
      },
      findDown(nodelist, root, type) {
        let that = this;
        for (let item of nodelist) {
          if (root[item].node[type]) {
            that.$set(root[root[item].parent].node, type, true);
          }
        }
      },
      checkChange(root, data, node, that, event, type, modifyArray) {
        // 当前节点值变换
        that.$set(data, type, event);
        // 将所有变动值保存在一个数组里面，方便提交
        that.$emit("input", event);
        modifyArray.push(node.node);
        // 如果有父节点，父节点值变换
        if (node.parent >= 0) {
          // let parentRight = root[node.parent].node.hasOptRight
          if (event) {
            that.$set(root[node.parent].node, type, true);
          } else {
            that.$set(root[node.parent].node, type, false);
            that.findDown(root[node.parent].children, root, type);
          }
          // 保存修改节点
          // if (parentRight !== root[node.parent].node.hasOptRight) {
          modifyArray.push(root[node.parent].node);
          // }
        }
        // 如果有子节点，子节点全部转换
        if (node.children && node.children.length > 0) {
          that.updateDown(node.children, root, type, event, modifyArray);
        }
      },
      // 重新渲染
      renderSearchTree(h, { root, node, data }) {
        let that = this;
        let has_opt_right = data.has_opt_right + "";
        let has_auth_right = data.has_auth_right + "";
        let hasOptRight = has_opt_right == "true" ? true : false;
        let hasAuthRight = has_auth_right == "true" ? true : false;
        // 保存首次数据
        if (this.firstRender) {
          this.treeOldArray = this.deepClone(root);
          this.firstRender = false;
        }
        return h("span", {
          class: {
            "h-tree-title": true,
            "h-tree-title-self": true,
            "h-tree-title-search": data.search,
            "h-tree-title-selected": data.selected,
            "h-tree-title-filterable": data.filterable
          },
          on: {
            // click: () => {
            //   this.handleRenderClick(data)
            // }
          }
        }, [
          h("span", {
            style: {
              overflow: "hidden",
              whiteSpace: "nowrap",/*不显示的地方用省略号...代替*/
              textOverflow: "ellipsis",
              width: "300px",
              display: "inline-block",
              verticalAlign: "bottom"
            }
          }, data.title),
          h("div", {
            class: {
              "h-tree-check": true
            }
          }, [
            h("h-checkbox", {
              style: {
                width: "52px"
              },
              props: {
                label: "2",
                value: hasAuthRight, // 授权权限
                indeterminate: false
              },
              on: {
                input: function(event) {
                  that.checkChange(root, data, node, that, event, "has_auth_right", that.modifyArray);
                }
              }
            }, "授权")
          ])
        ]);
      },
      treeSubmit() {
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
        let params = window.sessionStorage.getItem("legalPersonRoleRight");
        let json = JSON.parse(params);
        this.submitFlag = true;
        post({ "id": this.roleId, "code": code }, "/sm/auth/roleAuth/authorizeRoleAuthority").then(res => {
          this.submitFlag = false;
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$msgTip.success(this);
              this.$emit("showRoleRightClose", "");
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
      handleToggleExpand(arr) {
        if (arr.parent_id === "bizroot") {
          this.recursiveTree(this.treeData, arr.expand);
          this.expandDisabled = !this.expandDisabled;
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
        this.$emit("showRoleRightClose", "");
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
      tempRoleRightWin: {
        get() {
          return this.showRoleRightWin;
        },
        set() {
        }
      }

    },
    created() {

    },
    mounted() {
      let params = JSON.parse(window.sessionStorage.getItem("legalPersonRoleRight"));
      this.title = params.roleName;
    },
    destroyed() {
      // window.removeEventListener('resize')
    }
  };
</script>
<style>

</style>
