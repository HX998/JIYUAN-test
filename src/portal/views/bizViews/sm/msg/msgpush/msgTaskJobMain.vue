<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item label="任务名称" prop="taskName">
                  <h-input v-model="formItem.taskName"></h-input>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid :columns="columns"
                      highlight-row
                      url="/sm/msg/msgpush/msgTaskJobMain/queryMsgTaskConfByPage"
                      :bindForm="formItem"
                      :onCurrentChange="handleCurrentChange"
                      :onCurrentChangeCancel="handleCurrentChangeCancel"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="handleAddForm('add')">{{$t("m.i.common.add")}}</h-button>
              <h-button type="primary" @click="handleAddForm('modify')">{{$t("m.i.common.modify")}}</h-button>
              <h-button type="primary" @click="handleDelForm()">{{$t("m.i.common.delete")}}</h-button>
            </div>

          </h-datagrid>

        </div>
      </h-col>
    </h-row>

    <!--点击新增/修改弹出窗-->
    <h-msg-box v-model="addOrEditWin" width="1000" height="400" class="h-form-table-layer"
               @on-close="addOrEditWin=false" :mask-closable="false" :maximize="true">
      <p slot="header">
        <span v-if="operType==='add'">新增</span>
        <span v-if="operType==='modify'">修改</span>
      </p>
      <div>
        <h-form :model="addForm" :label-width="120" ref="addForm" cols="2" class="h-form-search">
          <h-form-item :label="$t('m.i.pc.taskName')" prop="taskName" required >
            <h-input v-model="addForm.taskName" :maxlength=200 :readonly="operType==='modify'"></h-input>
          </h-form-item>
          <h-form-item label="定时时间" required prop="taskRunTime">
            <h-time-picker v-model="addForm.taskRunTime"  placeholder="选择时间"></h-time-picker>
          </h-form-item>
        </h-form>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="addOrEditWin=!addOrEditWin">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="addOrEditFormSave()">{{$t("m.i.common.confirm")}}</h-button>
      </div>

    </h-msg-box>
  </div>
</template>

<script>

  import { post, on, off, getDictListByGroups, getDictValueFromMap } from "@/api/bizApi/commonUtil";

  export default {
    name:"ShowMsgTaskJob",
    data(){
      return {
        formItem:{
          taskNo:"",
          taskName:""
        },
        columns:[
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
            title:"任务名称",
            key:"taskName",
            hiddenCol:false
          },
          {
            title: "定时时间",
            key:"taskRunTime",
            hiddenCol:false,
            render:(h, params)=>{
              let time = "-";
              if (!!params.row.taskRunTime) {
                let transTm = params.row.taskRunTime.toString();
                let len=transTm.length;
                //补0
                for (let i = 0; i < (6 - len); i++) {
                  transTm = "0" + transTm;
                }
                time = this.$moment(transTm, "HH:mm:ss").format("HH:mm:ss");
              }
              return h("span", time);
            }
          },
          // {
          //   title:"处理状态",
          //   key:"processStatus",
          //   hiddenCol:false
          // },
          {
            title:"创建时间",
            key:"createTime",
            hiddenCol:false,
            render:(h, params) =>{
              return h('span', params.row.createTime?this.$moment(params.row.createTime, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss"):"-")
            }
          },
          {
            title:"更新时间",
            key:"updateTime",
            hiddenCol:false,
            render:(h, params) =>{
              return h('span', params.row.updateTime?this.$moment(params.row.updateTime, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss"):"-")
            }
          }
        ],
        currentSelectRow:null,
        readonly:false,
        addForm:{
          taskRunTime:"",
          taskName:"",
        },
        submitFlag:false,
        addOrEditWin:false,
        operType:"",
        cronExpressionTemp:""
      }
    },
    methods:{
      //新增/修改定死任务
      handleAddForm(operType){
        this.operType = operType;
        if (this.operType == "modify") {
          let list = this.currentSelectRow;
          if (!!list) {
            this.$nextTick(() => {
              let modifyRow = list;
              this.addForm.id = modifyRow.id;
              this.addForm.taskName = modifyRow.taskName;
              this.addForm.taskRunTime =this.formatRunTime(modifyRow.taskRunTime);
            });
          } else {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
            return;
          }
          this.readonly = true;
        } else {
          this.$nextTick(() => {
            this.readonly = false;
            this.addFormReset();
          });
        }
        this.addOrEditWin = true;
      },
      addFormReset() {
        this.$refs.addForm.resetFields();
        this.addForm.id = "";
        this.addForm.taskRunTime="";
      },
      //删除定时任务
      handleDelForm(){
        if (!!this.currentSelectRow) {
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: this.$t("m.i.common.isConfirmDelete") + "?",
            onOk: () => {
              this.handleDel();
            }
          });
        }else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },

      handleDel() {
        post({ id: this.currentSelectRow.id }, "/sm/msg/msgpush/msgTaskJobMain/deleteTask").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(1);
              this.clearSelectData();
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.deleteFailed") + ","+res.data.retMsg });
              this.$refs.datagrid.dataChange(1);
              this.clearSelectData();
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },

      addOrEditFormSave(){
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            this.addForm.taskRunTime=this.addForm.taskRunTime.replace(/:/g,"")
            let url=this.operType==="add"?"/sm/msg/msgpush/msgTaskJobMain/addMsgTask":"/sm/msg/msgpush/msgTaskJobMain/updateMsgTask";
            post(this.addForm, url).then(res => {
              this.$loadingbox.close();
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.addOrEditWin=false
                  this.addFormReset()
                  this.$refs.datagrid.dataChange(1);
                  this.clearSelectData();
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.clearSelectData();
      },
      formSearch() {
        this.$refs.datagrid.dataChange(1);
        this.clearSelectData();
      },
      clearSelectData(){
        this.currentSelectRow=null;
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
      },
      formatRunTime(data){
        let time="";
        if (!!data) {
          let transTm = data.toString();
          if (transTm.length < 6) {   //补0
            for (let i = 0; i < (6 - transTm.length); i++) {
              transTm = "0" + transTm;
            }
          }
          time = this.$moment(transTm, "HH:mm:ss").format("HH:mm:ss");
        }
        return time;
      }
    }
  }
</script>
