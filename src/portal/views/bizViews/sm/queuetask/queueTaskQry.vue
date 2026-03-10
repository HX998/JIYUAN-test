<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.billInfo.billPackageNo')" prop="billNoLike">
                  <h-input v-model="formItem.billNoLike" ></h-input>
                </h-form-item>
                <!--子票区间-->
                <bill-range :formItem="formItem" :rangeProps="['minBillRangeStart','maxBillRangeEnd']"></bill-range>
                <h-form-item :label="$t('m.i.queuetask.taskCode')" prop="taskCode">
                  <h-input v-model="formItem.taskCode" ></h-input>
                </h-form-item>
                 <h-form-item :label="$t('m.i.common.status')" prop="status">
                     <h-select v-model="formItem.status" style="width:200px">
                        <h-option v-for="item in isList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                      </h-select>
                  </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t("m.i.common.searchAdvanced")}}<i
                    class="icon iconfont"
                    :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="formSearch()">{{$t('m.i.common.search')}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t('m.i.common.reset')}}</h-button>
                </h-form-item>
            </h-form>
          </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid :columns="columns"
                      highlight-row
                      url="/sm/queuetask/queueTaskQry/func_pagingQueryQueueTask"
                      :bindForm="formItem"
                      :onCurrentChange="handleCurrentChange"
                      :onCurrentChangeCancel="handleCurrentChangeCancel"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="repeatExecuteTask()">{{$t('m.i.queuetask.repeatExecuteTask')}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
  </div>
</template>

<script>
  import {post, on, off, getDictListByGroups, getDictValueFromMap, formatBillRange} from "@/api/bizApi/commonUtil";

  export default {
    name: "queueTaskQry",
    data(){
      return {
        dictMap: new Map(),
        ifShowMore : false,
        formItem : {
          billNoLike : '',
          taskCode:'',
          status:'',
          minBillRangeStart:"",
          maxBillRangeEnd:""
        },
        columns : [
          {
            type: "radio",
            title: " ",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: this.$t("m.i.queuetask.taskCode"),
            key: "taskCode",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.queuetask.taskName"),
            key: "taskName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.batchNo"),
            key: "batchNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.billInfo.billPackageNo"),
            key: "billNo",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.billRange"),
            align: 'center',
            key: "billRange",
            hiddenCol: false,
            render: (h, params) => {
              let billOrigin = params.row.billOrigin;
              let billRangeStart = params.row.billRangeStart;
              let billRangeEnd = params.row.billRangeEnd;
              return h("span", formatBillRange(billOrigin, billRangeStart, billRangeEnd))
            }
          },
          {
            title: this.$t('m.i.common.status'),
            key: "status",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap,"TaskProcessStatus",params.row.status);
              return h("span", {domProps: {title: dictValue}}, dictValue);
            }
          },{
            title: this.$t("m.i.common.errorMsg"),
            key: "errorMsg",
            sortable: true,
            hiddenCol: false
          },{
            title: this.$t("m.i.common.operTm"),
            key: "operDtTm",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let date = this.$moment(params.row.operDtTm, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
              return h("span", date);
            }
          },{
            title: this.$t('m.i.common.remark'),
            key: "queueRemark",
            sortable: true,
            hiddenCol: false
          }
        ],
        isList : [],
        currentSelectRow:[],
        isRequired:true,
      }
    },
    methods :{
    repeatExecuteTask(){

    let row = this.currentSelectRow;
     let url = "/sm/queuetask/queueTaskQry/func_handExecQueueTask";
    if(row != null && row.length !== 0){
            post(row, url).then(res => {
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
                  this.currentSelectList = [];
                  this.currentSelectRow=[];
                } else {
                  this.$msgTip.error(this, { info: msg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });


     }else{
       this.$msgTip.info(this,{info:this.$t('m.i.common.chooseOneData')});
     }
    },

      unDisabled(){
        this.deletDisabled=false
      },
      formSearch() {
        this.unDisabled()
        this.$refs.datagrid.dataChange(1);
        this.currentSelectRow = [];
        this.currentSelectList=[];
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
        this.formItem.minBillRangeStart = null;
        this.formItem.maxBillRangeEnd = null;
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      getParams(){
        if (this.$route.path === "/sm/queuetask/queueTaskQry") {
          if (this.$route.query.taskCode) {
            this.formItem.taskCode = this.$route.query.taskCode;
            this.formItem.status = this.$route.query.status;
            this.$nextTick(() => {
              this.formSearch();
            });
          }
        }
      },
    },
    mounted() {
      this.getParams();
      getDictListByGroups("TaskProcessStatus").then(res => {
        this.isList = res.get("TaskProcessStatus");
        this.dictMap = res.get("map");
      });
    },
    watch: {
      "$route": "getParams"
    },
  };
</script>

<style scoped>

</style>
