<!-- 再贴现月授信发生额 -->
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
                  <!--<h-form-item :label="$t('m.i.common.brchName')" prop="brchName">
                    <h-input v-model="formItem.brchName" placeholder="" icon="android-search" :title="formItem.brchName"
                             clearable @on-clear="clearVal('brchName')" @on-click="brchNoWinOpen()" readonly></h-input>
                  </h-form-item>-->
                  <show-branch v-model="formItem.brchName"  :label="$t('m.i.common.brchName')"      prop="brchName"
                               :showCheckBox="true"     :brchNo.sync="formItem.brchNos" :brchName.sync="formItem.brchName">
                  </show-branch>
                  <h-form-item :label="$t('m.i.common.activeFlag')" prop="activeFlag">
                    <h-select  v-model="formItem.activeFlag" placeholder="请选择">
                      <h-option  value="1">已生效</h-option>
                      <h-option  value="0">未生效</h-option>
                    </h-select>
                  </h-form-item>
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
                url="/be/market/rediscount/indexCreditAccrual/func_queryCreditAccrual"
                :bindForm="formItem"
                :onRowClick="handlelRowClick"
                :onSelectChange="handleSelectClick"
                ref="datagrid">
              </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!-- 机构名称选择弹窗框 -->
   <!-- <show-branch :showBranchWin="brchNoWin" title="机构名称" @brchNoChange="brchNoChange" :ifcheck="true" :checkStrictly="true"
                 @showBranchWinClose="brchNoWinClose"></show-branch>-->
  </div>
</template>

<script>
  import { post, on,off,formatNumber } from "@/api/bizApi/commonUtil";
  export default {
    name: "indexCreditAccrual",
    components: {
      // ShowBranch:()=>import(/* webpackChunkName: "sm/auth/branch/showBranch" */`@/views/bizViews/sm/auth/branch/showBranch`)
    },
    data(){
      return {
        formItem : {
          brchName: "",
          activeFlag: "1",
          brchNos:[],

        },
        //查询弹出页面的几个属性
        isShowAdd : false,//页面是否显示
        //更新弹出页面的几个属性
        isShowModify : false,//页面是否显示

        //弹窗的统一属性
        brchTreeData:[],
        isDisabled : false,
        brchNameSelectWin:false,
        addOrEditWin : false,//弹窗value
        scrollable : false,//后面页面是否可以滚动
        transfer : true,//是否将弹窗置于body内
        maximize : true,//是否允许最大化
        maskclosable:false,//是否允许点击遮罩层关闭
        //brchNoWin : false,
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
            title: this.$t("m.i.common.index"),
            type: 'index',
            align: 'center',
            width: 60,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.brchNo'),
            key: 'brchNo',
            hiddenCol: false,
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
            title: this.$t('m.i.be.creditAvalChangeAmt'),
            key: 'creditAvalChangeAmtStr',
            hiddenCol: false,
            render: (h, params) => {
              return h('div', [
                h('span', formatNumber(params.row.creditAvalChangeAmtStr, 2, ','))
              ]);
            },
          },
          {
            title: this.$t('m.i.be.creditSumAccrual'),
            key: 'creditSumAccrualStr',
            hiddenCol: false,
            render: (h, params) => {
              return h('div', [
                h('span', formatNumber(params.row.creditSumAccrualStr, 2, ','))
              ]);
            },
          },
          {
            title: this.$t('m.i.be.theYear'),
            key: 'theYear',
            hiddenCol: false,
            // sortable: true,
          },
          {
            title: this.$t('m.i.be.theMonth'),
            key: 'theMonth',
            hiddenCol: false,
            // sortable: true,
          },
          {
            title: this.$t('m.i.common.activeFlag'),
            key: 'activeFlag',
            hiddenCol: false,
            render: (h, params) => {
              return h('div', [
                h('span', params.row.activeFlag=='1'?'已生效':'未生效')
              ]);
            },
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

        //提交标志，一个请求正在提交的时候会设为false
        submitFlag : false,
        reqUrl:'',
        applyWin : false,
        ifShowMore :false,
        selectData : []
      }
    },
    methods :{
      clearVal(type){
        if(type == 'brchName'){
          this.formItem.brchNos = '';
          this.formItem.brchName = '';
        }
      },
      //查询按钮点击事件
      handleSearch() {
        this.currentSelectRow = [];
        this.currentSelectList = [];
        this.$refs.datagrid.dataChange(1);
      },
      handleReset() {
        this.$refs.formItem.resetFields();
        this.formItem.brchNos='';
        this.formItem.brchName='';
      },
      handlelRowClick(arr) {
        this.currentSelectRow = arr;
      },
      handleSelectClick(selectInx) {
        this.currentSelectRowInx = selectInx
      },
     /* brchNoWinOpen() {
        this.brchNoWin = true;
      },
      brchNoWinClose() {
        this.brchNoWin = false;
      },
      brchNoChange(info) {
        if(info){
          for(let i = 0 ; i<info.length ;i++){
            this.formItem.brchNos[i]=info[i].id;
          }
          this.formItem.brchName = info[0].title;
        }
        this.brchNoWin = false;
      },*/

    }

  };
</script>

<style scoped>

</style>
