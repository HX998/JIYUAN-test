<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <!-- 左侧树 -->
      <h-col :span="spanLeft" class="layout-menu-left">
        <div>
          <div class="h-modal-header-btn">
            <h-button type="primary" @click="handleExpandTree(productTreeData)" :disabled="isExpandDisabled">
              {{$t("m.i.common.expand")}}
            </h-button>
            <h-button type="primary" @click="handleUnExpandTree(productTreeData)" :disabled="isNotExpandDisabled">
              {{$t("m.i.common.noExpand")}}
            </h-button>
          </div>
          <div class="h-sidebar-menutree-body">
            <h-tree :data="productTreeData" highlight-row ref="productTreeData" @on-select-change="queryByParentId()"
                    :style="{height: mBarHeight-147 + 'px',overflow: 'auto'}" @on-toggle-expand="toggleExpand"></h-tree>
          </div>
        </div>
      </h-col>
      <!-- 右侧数据展示表格 -->
      <h-col :span="spanRight" class="layout-menu-right">
        <div class="h-form-search-box">
          <!-- 查询表单 -->
          <h-panel class="clearfix">
            <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
              <h-form-item prop="prodName" :label="$t('m.i.common.prodName')">
                <h-input v-model="formItem.prodName" placeholder="" :maxlength="60"></h-input>
              </h-form-item>
              <h-form-item class="h-form-operate one-form">
                <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
              </h-form-item>
            </h-form>
          </h-panel>
        </div>
        <div>
          <!-- 数据展示表格 -->
          <h-datagrid :columns="columns"
                      highlight-row
                      url="/bm/prod/product/productMain/func_queryProduct"
                      :bindForm="formItem"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
  </div>
</template>

<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";

  export default {
    name: "productSearch",
    data() {
      let formItem = {
        prodName: ""
      };
      let columns = [
        {
          type: "index",
          key: "numOrder",
          title: this.$t("m.i.common.index"),
          width: 60,
          align: "center",
          hiddenCol: false
        },
        {
          type: "id",
          title: this.$t('m.i.common.id'),
          hiddenCol: true
        },
        {
          title: this.$t("m.i.common.prodNo"),
          key: "prodNo",
          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.prodName"),
          key: "prodName",
          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.bm.prodDesc'),
          key: "prodDesc",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.parentProdNo"),
          key: "parentProdNo",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.parentProdName"),
          key: "parentProdName",
          hiddenCol: false
        }
      ];
      return {
        formItem:formItem,
        columns:columns,
        prodNameRule: [{ test: /^.{1,60}$/, trigger: "blur", message: "产品名称长度不能超过60位" }],
        prodDescRule: [{ test: /^.{0,330}$/, trigger: "blur", message: "产品描述长度应小于330位" }],
        submitFlag: false,
        spanLeft: 4,
        spanRight: 20,
        treeDataChange: false,
        isDisabled: true,
        productTreeData: [],
        mBarHeight: 0,
        isExpandDisabled: false,
        isNotExpandDisabled: true,
        flag:false,
      };
    },
    mounted() {
      this.getLeftTreeList();
      this.handleResize();
      on(window, "resize", this.handleResize);
      this.$refs.datagrid.$refs.gridToolbar.style = "margin-bottom: 15px";
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
        post({}, "/bm/prod/product/queryProductMaintenanceTree").then(res => {
          if (res && res.data) {
            let data = (res.data.retData instanceof Array) ? res.data.retData : [res.data.retData];
            this.productTreeData = data;
          } else {
            this.$msgTip.error(this, { info: res.data.retMsg });
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
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
        this.isExpandDisabled = true;
        this.isNotExpandDisabled = false;
      },
      //递归给左侧树赋值
      recursiveTree(arr, isExpand) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].children) {
            arr[i].expand = isExpand;
            this.recursiveTree(arr[i].children, isExpand);
          }
        }
      },
      //产品树点击查询
      queryByParentId() {
        let arr = this.$refs["productTreeData"].getSelectedNodes();
        if (arr.length !== 0) {
          let id = arr[0].id;
          this.formItem.prodNo = id;
        }
        this.$refs.datagrid.dataChange(1);
      },
      // 查询
      handleSearch() {
        this.$refs.datagrid.dataChange(1);
      },
      // 重置查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
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
