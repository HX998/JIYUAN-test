<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="'业务模块'" prop="moduleName">
                  <h-select v-model="formItem.moduleName" placeholder="" filterable @on-change="findTodoItemList">
                    <h-option v-for="item in ModuleNameList" :value="item" :key="item">{{ item }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="'待办任务名称'" prop="id">
                  <h-select v-model="formItem.id" placeholder="" filterable>
                    <h-option v-for="item in TodoItemList" :value="item.id" :key="item.id">{{ item.pendRemark }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item class="h-form-operate two-form">
                  <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid :columns="columns"
                      url="/sm/msg/todoitem/todoItemMain/func_queryTodoItemByPage"
                      highlightRow
                      :bindForm="formItem"
                      :onCurrentChange="handleCurrentChange"
                      :onCurrentChangeCancel="handleCurrentChangeCancel"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left"></div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <div class="h-index-bottom">
      <h-icon name="remind"></h-icon>
      <span>实时获取数据需手动刷新</span>
    </div>
  </div>
</template>

<script>
  import { post, on, formatNumber, handleGotoPage } from "@/api/bizApi/commonUtil";

  export default {
    name: "todoItemMain",
    data(){
      let columns = [
        {
          title: this.$t("m.i.common.index"),
          type: "index",
          width: 60,
          align: "center"
        },
        {
          title: "业务模块",
          key: "moduleName",
          hiddenCol: false,
        },
        {
          title: "待办任务名称",
          key: "pendRemark",
          hiddenCol: false,
        },
        {
          title: this.$t('m.i.be.totalCount'),
          key: "totalNum",
          hiddenCol: false,
        },
        {
          title: this.$t('m.i.be.totalAmtByYUAN'),
          key: "totalAmt",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            if(params.row.totalAmt <= 0){
              return h('p', '-');
            }
            return h('p', formatNumber(params.row.totalAmt, 2, ','));
          }
        },
        {
          title: "查看",
          hiddenCol: false,
          render: (h, params) => {
            return h("a", {
              on: {
                click: () => {
                  this.show(params.row, "");
                }
              }
            }, "查看");
          }
        }
      ];
      let formItem = {
        moduleName: "",
        pendRemark: "",
        id: "",
      };
      return {
        columns: columns,
        formItem: formItem,
        currentSelectRow: [],
        TodoItemList: [],
        ModuleNameList: [],
        loading: false,
      }
    },
    methods: {
      show(item,turnType){
        handleGotoPage(this, 'mainIndex', item, turnType);
      },
      getQueryString(url,name){
        var reg = new RegExp("(^|&?)"+ name +"=([^&]*)(&|$)");
        var r = url.substr(1).match(reg);
        if(r!=null) {
          return unescape(r[2]);
        }else{
          return null;
        }
      },
      formSearch(){
        this.$refs.datagrid.dataChange(1);
        this.currentSelectRow = [];
      },
      formSearchReset(){
        this.$refs.formItem.resetFields();
      },
      handleCurrentChange(currentRow){
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel(){
        this.currentSelectRow = [];
      },
      findTodoItemList(){
        post({moduleName: this.formItem.moduleName ,loading:false}, "/sm/msg/todoitem/todoItemMain/func_findTodoItemList").then(res => {
          if(res && res.data.retCode === "000000"){
            this.TodoItemList = res.data.retData
          }else {
            this.TodoItemList = [];
          }
        });
      }
    },
    created() {
      post({loading:false}, "/sm/msg/todoitem/todoItemMain/func_getAllModelNameList").then(res => {
        if(res && res.data.retCode === "000000"){
          this.ModuleNameList = res.data.retData;
        }
      });
      this.findTodoItemList();
    }
  };
</script>

<style scoped>

</style>
