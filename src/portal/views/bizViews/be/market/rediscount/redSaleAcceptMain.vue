<!-- 再贴现受理关系 -->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="h-form-search-box clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form ref="formItem" :model="formItem" :label-width="90" class="h-form-search" cols="4">
                <div class="h-search-form-row" >
                  <show-branch v-model="formItem.brchName"  :label="$t('m.i.be.brchName')"      prop="brchName"
                               :showCheckBox="true"     :brchNo.sync="formItem.brchNos" :brchName.sync="formItem.brchName">
                  </show-branch>

                  <h-form-item class="h-form-operate">
                    <h-button type="primary" @click="handleSearch()">{{$t('m.i.common.search')}}</h-button>
                    <h-button type="ghost" @click="handleReset()">{{$t('m.i.common.reset')}}</h-button>
                  </h-form-item>
                </div>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
              <h-datagrid
                :columns="columns"
                highlight-row
                url="/be/market/rediscount/redSaleAcceptMain/func_queryRedSaleAcceptList"
                :bindForm="formItem"
                :onRowClick="handlelRowClick"
                :onSelectChange="handleSelectClick"
                ref="datagrid">
              </h-datagrid>
        </div>
      </h-col>
    </h-row>
  </div>
</template>

<script>
  import { post, on,off} from "@/api/bizApi/commonUtil";

  export default {
    name: "redSaleAcceptMain",
    components: {
    },
    data(){
      return {
        formItem : {
          brchName: "",
          brchNos:"",
        },
        //查询弹出页面的几个属性
        isShowAdd : false,//页面是否显示
        //更新弹出页面的几个属性
        isShowModify : false,//页面是否显示
        //brchNoWin : false,
        //弹窗的统一属性
        brchTreeData:[],
        isDisabled : false,
        brchNameSelectWin:false,
        addOrEditWin : false,//弹窗value
        scrollable : false,//后面页面是否可以滚动
        transfer : true,//是否将弹窗置于body内
        maximize : true,//是否允许最大化
        maskclosable:false,//是否允许点击遮罩层关闭

        //禁用状态
        deletDisabled : false,

        tableRef:"selfTable",
        //操作类型
        type : null,

        //操作权限
        authObj : {
          bizSetRoleAdd: true, //角色添加
          bizSetRoleModify: true, //角色操作权限
          bizSetRoleDelete: true, //角色删除
        },

        //是否只读
        readonly:false,
        //是否必填
        isRequired:true,
        columns : [
          {
            type: "radio",
            width: 50,
            align: "center",
            title: " "
          },
          {
            title: this.$t('m.i.common.brchCode'),
            key: 'brchCode',
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.common.brchName'),
            key: 'brchName',
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.be.pedBrchCode'),
            key: 'pbocBrchCode',
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.be.pedBrchName'),
            key: 'pbocBrchName',
            hiddenCol: false,
          }],

        //现在选中的行
        currentSelectRow : null,

        //用于申请的表单
        applyForm : {
          billNo: "",
          billMoney: ""
        },

        //已经选中的列表数据，列表中每一个元素即是一行
        currentSelectList : [],
        //已选项数据索引集合
        currentSelectRowInx : [],
        tempInx : 0,
        selectData : [],

        //提交标志，一个请求正在提交的时候会设为false
        submitFlag : false,
        reqUrl:'',
        applyWin : false,
        ifShowMore :false,
      }
    },
    methods :{
      //查询按钮点击事件
      handleSearch() {
        this.currentSelectRow = [];
        this.currentSelectList = [];
        this.$refs.datagrid.dataChange(1);
      },
      handleReset() {
        this.$refs.formItem.resetFields();
        this.formItem.brchNos="";
        this.formItem.brchName="";
      },
      handlelRowClick(arr) {
        this.currentSelectRow = arr;
      },
      handleSelectClick(selectInx) {
        this.currentSelectRowInx = selectInx
      },
    }

  };
</script>

<style scoped>

</style>
