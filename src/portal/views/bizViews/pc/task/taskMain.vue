<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.pc.taskNo')" prop="taskNo">
                  <h-input v-model="formItem.taskNo"></h-input>
                </h-form-item>

                <h-form-item :label="$t('m.i.pc.taskName')" prop="taskName">
                  <h-input v-model="formItem.taskName"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.pc.processStatus')" prop="processStatus">
                  <h-select v-model="formItem.processStatus" placeholder="">
                    <h-option v-for="item in statusList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
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
                      url="/pc/task/taskMain/func_queryTaskInfo"
                      :bindForm="formItem"
                      :onCurrentChange="handleCurrentChange"
                      :onCurrentChangeCancel="handleCurrentChangeCancel"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="handleAddForm('add')">{{$t("m.i.common.add")}}</h-button>
              <h-button type="primary" @click="handleAddForm('modify')">{{$t("m.i.common.modify")}}</h-button>
              <h-button type="primary" @click="handleDelForm()">{{$t("m.i.common.delete")}}</h-button>
              <h-button type="primary" @click="handleSeqNoEdit()">{{$t("m.i.pc.adjustDir")}}</h-button>
              <h-button type="primary" @click="handleExec()">{{$t("m.i.pc.execInTime")}}</h-button>
              <h-button type="primary" @click="handleExecAll()" v-if="this.autoOpenTask === '0'">{{$t("m.i.pc.allExec")}}</h-button>
            </div>

          </h-datagrid>

        </div>
      </h-col>
    </h-row>

    <!--点击新增/修改弹出窗-->
    <h-msg-box v-model="addOrEditWin" width="1000" height="400" class="h-form-table-layer"
               @on-close="handleWinClose" :mask-closable="false" :maximize="true">
      <p slot="header">
        <span v-if="type=='add'">新增</span>
        <span v-if="type=='modify'">修改</span>
      </p>
      <div>
        <h-form :model="addForm" :label-width="120" ref="addForm" cols="2" class="h-form-search">

          <h-form-item :label="$t('m.i.pc.taskNo')" prop="taskNo" :required="isRequired">
            <h-input v-model="addForm.taskNo" :maxlength=20 :readonly="readonly"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.pc.taskName')" prop="taskName" :required="isRequired">
            <h-input v-model="addForm.taskName" :maxlength=500></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.pc.delayTm')" prop="delayTm">
            <h-input v-model="addForm.delayTm" :maxlength=500 placeholder="距离上节点执行完成延时时间,以s为单位"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.pc.timingFlag')" prop="timingFlag" :required="isRequired">
            <h-select v-model="addForm.timingFlag" :placeholder="'是否开启定时开关'">
              <h-option v-for="item in isList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.pc.cronExpression')" prop="cronExpression">
            <h-input v-model="addForm.cronExpression"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.pc.repeatFlag')" prop="repeatFlag" :required="isRequired">
            <h-select v-model="addForm.repeatFlag" :placeholder="'当日是否允许重复执行'">
              <h-option v-for="item in isList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.pc.functionId')" prop="functionId" :required="isRequired">
            <h-input v-model="addForm.functionId" :canResize="false"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.pc.taskParam')" prop="taskParam">
            <h-input v-model="addForm.taskParam" :canResize="false"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.pc.isSkipHoliday')" prop="isSkipHoliday" :required="isRequired">
            <h-select v-model="addForm.isSkipHoliday" placeholder="">
              <h-option v-for="item in isList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.pc.taskRelation')" prop="taskRelation">
            <h-select v-model="addForm.taskRelation" multiple placeholder="" showTitle>
              <h-option v-for="item in taskList" :value="item.taskNo" :key="item.taskNo">{{ item.taskName }}</h-option>
            </h-select>
          </h-form-item>
        </h-form>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="addOrEditWin=!addOrEditWin">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="addOrEditFormSave()">{{$t("m.i.common.confirm")}}</h-button>
      </div>

    </h-msg-box>

    <!--顺序调整弹框-->
    <h-msg-box v-model="handleSeqNoEditWin" width="400" class="h-form-search-layer"
               @on-close="handleSeqNoEditWinClose" :mask-closable="false" :maximize="true">
      <p slot="header">
        <span>顺序选择</span>
      </p>

      <h-form :model="seqNoForm" :label-width="115" cols="1" ref="seqNoForm" class="h-form-search">
        <h-form-item :label="$t('m.i.pc.newSeqNo')" prop="newSeqNo" :required="isRequired">
          <h-select v-model="seqNoForm.newSeqNo" placeholder="">
            <h-option v-for="item in taskList" :value="item.seqNo" :key="item.seqNo">{{ item.seqNo }}</h-option>
          </h-select>
        </h-form-item>

      </h-form>

      <div slot="footer">
        <h-button type="ghost" @click="handleSeqNoEditWin=!handleSeqNoEditWin">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="submitSeqNoEdit()">{{$t("m.i.common.confirm")}}</h-button>
      </div>

    </h-msg-box>

  </div>
</template>

<script>

  import { post, on, off, getDictListByGroups, getDictValueFromMap, getParamValuesByKeys} from "@/api/bizApi/commonUtil";

  export default {
    name: "taskMain",
    data() {
      return {
        columns: [
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
            title: this.$t("m.i.pc.taskNo"),
            key: "taskNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.pc.taskName"),
            key: "taskName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.pc.seqNo"),
            key: "seqNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.pc.delayTm"),
            key: "delayTm",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.pc.timingFlag"),
            key: "timingFlag",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "Yon", params.row.timingFlag);
              return h("span", { domProps: { title: dictValue } }, dictValue);
            }
          },
          {
            title: this.$t("m.i.pc.cronExpression"),
            key: "cronExpression",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.pc.isRepeatFlagCurrentDay"),
            key: "repeatFlag",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "Yon", params.row.repeatFlag);
              return h("span", { domProps: { title: dictValue } }, dictValue);
            }
          },
          {
            title: this.$t("m.i.pc.functionId"),
            key: "functionId",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.pc.taskParam"),
            key: "taskParam",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.pc.isSkipHoliday"),
            key: "isSkipHoliday",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "Yon", params.row.isSkipHoliday);
              return h("span", { domProps: { title: dictValue } }, dictValue);
            }
          },
          {
            title: this.$t("m.i.pc.taskRelation"),
            key: "taskRelation",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.pc.preFiredDtTm"),
            key: "preFiredDtTm",
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.preFiredDtTm == null) {
                return null;
              }
              let date = this.$moment(params.row.preFiredDtTm, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.pc.dealStatus"),
            key: "processStatus",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "TaskProcessStatus", params.row.processStatus);
              return h("span", { domProps: { title: dictValue } }, dictValue);
            }
          }
        ],
        statusList: [],
        formItem: {
          taskNo: "",
          taskName: "",
          processStatus: ""
        },
        seqNoForm: {
          id: "",
          seqNo: "",
          newSeqNo: ""
        },
        addForm: {
          id: "",
          taskNo: "",
          taskName: "",
          delayTm: "",
          timingFlag: "",
          cronExpression: "",
          repeatFlag: "",
          taskParam: "",
          isSkipHoliday: "",
          functionId: "",
          taskRelation: []
        },
        // 是否显示新增或修改窗口
        addOrEditWin: false,
        handleSeqNoEditWin: false,
        dictMap: new Map(),
        isList: [],
        type: null,
        tableRef: "selfTable",
        taskList: [],
        submitFlag: false,
        isRequired: true,
        readonly: true,
        autoOpenTask: ""
      };
    },
    created(){
      getParamValuesByKeys("task.is_open_auto_task").then(res => {
        let autoOpenTask = res["task.is_open_auto_task"];
        if (autoOpenTask === "" || autoOpenTask == null || autoOpenTask == undefined) {
          this.autoOpenTask = "1";
        } else {
          this.autoOpenTask = autoOpenTask;
        }
      });
    },
    methods: {
      handleSeqNoEdit() {
        let list = this.currentSelectRow;
        if (list != null && list.length !== 0) {
		  this.queryAllTask("all");
		  this.handleSeqNoEditWin = true;
          this.$nextTick(() => {
            this.$refs.seqNoForm.resetFields();
            let modifyRow = list;
            this.seqNoForm.id = modifyRow.id;
            this.seqNoForm.seqNo = modifyRow.seqNo;
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
      },

      handleSeqNoEditWinClose() {
        this.$refs.seqNoForm.resetFields();
      },

      submitSeqNoEdit() {
        this.$refs["seqNoForm"].validate(valid => {
          if (valid) {
            this.submitFlag = true;
            let url = "/pc/task/taskMain/func_updateTaskSeqNo";
            post(this.seqNoForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode == "000000") {
                  this.$msgTip.success(this);
                  this.handleSeqNoEditWin = false;
                  this.$refs.datagrid.dataChange(1);
                  this.currentSelectRow = [];
                  this.currentSelectList = [];
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                  this.$refs.datagrid.dataChange(1);
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },

      addOrEditFormSave() {
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            let url = this.type == "add" ? "/pc/task/taskMain/func_addTaskInfo" : "/pc/task/taskMain/func_updateTaskInfo";
            let msg = this.type == "add" ? this.$t("m.i.common.addSuccess") : this.$t("m.i.common.modifySuccess");
            this.submitFlag = true;
            this.addForm.taskRelation = this.addForm.taskRelation.join(",");
            post(this.addForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode == "000000") {
                  this.$msgTip.success(this);
                  this.addOrEditWin = false;
                  this.$refs.datagrid.dataChange(1);
                  this.currentSelectRow = [];
                  this.currentSelectList = [];
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                  this.$refs.datagrid.dataChange(1);
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }

            });
            this.addForm.taskRelation = [];
          }
        });
      },
      handleAddForm(str) {
        this.type = str;
        this.isRequired = true;
        if (this.type == "modify") {
          let list = this.currentSelectRow;
          if (list != null && list.length !== 0) {
            this.$nextTick(() => {
              let modifyRow = list;
              this.addForm.id = modifyRow.id;
              this.addForm.taskNo = modifyRow.taskNo;
              this.addForm.taskName = modifyRow.taskName;
              this.addForm.parentTaskNo = modifyRow.parentTaskNo;
              this.addForm.delayTm = modifyRow.delayTm;
              this.addForm.timingFlag = modifyRow.timingFlag;
              this.addForm.cronExpression = modifyRow.cronExpression;
              this.addForm.repeatFlag = modifyRow.repeatFlag;
              this.addForm.taskParam = modifyRow.taskParam;
              this.addForm.isSkipHoliday = modifyRow.isSkipHoliday;
              this.addForm.functionId = modifyRow.functionId;
              if (modifyRow.taskRelation != null) {
                this.addForm.taskRelation = modifyRow.taskRelation.split(",");
              } else {
                this.addForm.taskRelation = [];
              }
            });
          } else {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
            return;
          }
          this.readonly = true;
          this.queryAllTask("part");
        } else {
          this.$nextTick(() => {
            this.readonly = false;
            this.addFormReset();
            this.addForm.delayTm = "0";
            this.queryAllTask("all");
          });
        }
        this.addOrEditWin = true;
      },
      handleDelForm() {
        let list = this.currentSelectRow;
        if (list != null && list.length !== 0) {
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: this.$t("m.i.common.isConfirmDelete") + "?",
            onOk: () => {
              this.handleDel();
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }

      },
      handleDel() {
        let list = this.currentSelectRow;

        post({ id: list.id }, "pc/task/taskMain/func_deleteTaskInfo").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(1);
              this.currentSelectRow = [];
              this.currentSelectList = [];
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.deleteFailed") + res.data.retMsg });
              this.$refs.datagrid.dataChange(1);
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },

      queryAllTask(str) {
        post({}, "pc/task/taskMain/func_queryAllTask").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.taskList = res.data.retData;
              if ("part" == str) {
                //表示需要查询除自己之外的所有任务,修改依赖任务时,依赖任务的集合不包括自己
                let row = this.currentSelectRow;
                for (let k = 0; k < this.taskList.length; k++) {
                  if (this.taskList[k].id === row.id) {
                    this.taskList.splice(k, 1);
                    return;
                  }
                }
              }
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },

      //选中一条任务立即执行
      handleExec() {
        let list = this.currentSelectRow;
        if (list != null && list.length !== 0) {
          this.currentSelectRow = list;
          post(this.currentSelectRow, "pc/task/taskMain/func_runImmediatelyTask").then(res => {
            if (res) {
              let retCode = res.data.retCode;
              if (retCode == "000000") {
                this.$msgTip.info(this, { info: "正在执行中...,稍后刷新试试" });
                this.$refs.datagrid.dataChange(1);
                this.currentSelectRow = [];
                this.currentSelectList = [];
              } else {
                this.$msgTip.error(this, { info: res.data.retMsg });
              }
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
      },

      //执行所有任务
      handleExecAll() {
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确认一键运行所有任务" + "?",
          onOk: () => {
            post({}, "pc/task/taskMain/func_runImmediatelyAllTask").then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode == "000000") {
                  this.$msgTip.info(this, { info: "正在执行中...,稍后刷新试试" });
                  this.$refs.datagrid.dataChange(1);
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
      addFormReset() {
        this.$refs.addForm.resetFields();
        this.addForm.id = "";
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },

      unDisabled() {
        this.deletDisabled = false;
      },
      formSearch() {
        this.currentSelectRow = [];
        this.currentSelectList = [];
        this.unDisabled();
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
      },
      handleWinClose() {
        this.$refs.addForm.resetFields();
      }

    },
    mounted() {
      getDictListByGroups("Yon,TaskProcessStatus").then(res => {
        this.isList = res.get("Yon");
        this.statusList = res.get("TaskProcessStatus");
        this.dictMap = res.get("map");
      });
    }

  };
</script>

<style scoped>

</style>
