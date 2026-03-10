<template>
  <div class="h-day-manage" v-on:click="hideRightBox">
    <div class="clearfix">
      <div class="h-day-process">
        <div class="h-process-manage" v-for="(item,index) in taskList" :key="item">
          <div class="process-one-item">
            <div @mouseenter="enter(item.id)" @mouseleave="leave()">
              <span v-if="item.processStatus == '1'" class="process-step p-b-white" style="white-space: nowrap;text-overflow: ellipsis">{{ item.taskName }}</span>
              <span v-else-if="item.processStatus == '3'" class="process-step p-b-red" @contextmenu.prevent="rightBoxMenu(item.id)" style="white-space: nowrap;text-overflow: ellipsis">{{ item.taskName }}</span>
              <span v-else-if="item.processStatus == '4'" class="process-step p-b-pink" style="white-space: nowrap;text-overflow: ellipsis">{{ item.taskName }}</span>
              <span v-else-if="item.processStatus == 'Z'" class="process-step p-b-yellow" style="white-space: nowrap;text-overflow: ellipsis">{{ item.taskName }}</span>
              <span v-else-if="item.processStatus == '0'" class="process-step p-b-gray" style="white-space: nowrap;text-overflow: ellipsis">{{ item.taskName }}</span>
              <span v-else class="process-step" style="white-space: nowrap;text-overflow: ellipsis">{{ item.taskName }}</span>
            </div>
            <div :id="item.id" class="process-right-box" v-show="showRightMenu==item.id" :ref="item.id" style="width:190px">
              <ul>
                <li @click="handExec(item)">{{$t('m.i.pc.repeatExecFailTask')}}</li>
                <li @click="handExecFailFollowTask(item)">{{$t('m.i.pc.repeatExecFailFollowTask')}}</li>
                <li @click="handExecFailTask(item)">{{$t('m.i.pc.repeatExecFailFollowTaskWithFail')}}</li>
              </ul>
            </div>
            <!-- 鼠标经过显示-->
            <div class="process-hover-box" v-show="showTaskDetail==item.id">
              <b class="process-hover-arrow"></b>
              <ul>
                <li class="clearfix">
                  <strong>作业编号：</strong>
                  <span>{{item.taskNo}}</span>
                </li>
                <li class="clearfix">
                  <strong>作业名称：</strong>
                  <span>{{item.taskName}}</span>
                </li>
                <li class="clearfix">
                  <strong>处理状态：</strong>
                  <span v-if="item.processStatus == '1'">已激活</span>
                  <span v-else-if="item.processStatus == '0'">未激活</span>
                  <span v-else-if="item.processStatus == '3'">作业失败</span>
                  <span v-else-if="item.processStatus == '4'">作业暂停</span>
                  <span v-else-if="item.processStatus == 'Z'">正在处理</span>
                  <span v-else>作业完成</span>
                </li>
              </ul>
            </div>
          </div>

          <div v-if="index === (taskListSize-1)">
            <div style="height:100px"></div>
          </div>
          <div v-else class="process-one-arrow">
            <i class="process-line-long"></i>
            <b class="process-arrow p-one-c"></b>
          </div>
        </div>
      </div>
      <div class="h-process-status">
        <div class="p-status-explane">
          <h2>处理状态说明</h2>
          <div class="p-status-color">
            <ul class="clearfix">
              <li>
                <i class="s-c-gray"></i>
                <span>未激活</span>
              </li>
              <li>
                <i class="s-c-white"></i>
                <span>已激活</span>
              </li>
              <li>
                <i class="s-c-green"></i>
                <span>作业完成</span>
              </li>

              <li>
                <i class="s-c-red"></i>
                <span>作业失败</span>
              </li>
              <li>
                <i class="s-c-pink"></i>
                <span>作业暂停</span>
              </li>
              <li>
                <i class="s-c-yellow"></i>
                <span>正在处理</span>
              </li>
            </ul>
          </div>
        </div>
        <div v-if="runTaskMode !== '1'" class="p-status-explane">
          <h-button type="primary" @click="startTask()" :disabled="startFlag">开启日终批量作业</h-button>
        </div>
        <div v-else class="p-status-explane">
          <h-input v-model="executeCronTime" :readonly="startFlag"></h-input>
          <h-button type="primary" @click="resetExecuteCronExpression()" :disabled="startFlag">重置自动批量时间</h-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  post,
  on,
  off,
  getDictListByGroups,
  getDictValueFromMap,
  getParamValuesByKeys
} from "@/api/bizApi/commonUtil";

export default {
  name: "taskMonitor",
  data() {
    return {
      showRightMenu: "none",
      showTaskDetail: false,
      dictMap: new Map(),
      type: null,
      taskList: [],
      taskListSize: 0,
      submitFlag: false,
      isRequired: true,
      readonly: true,
      startFlag: false,
      runTaskMode: "1",
      executeCronTime: "0 0 20 * * ? *"
    };
  },
  methods: {
    hideRightBox: function(event) {
      if (this.showRightMenu != "none") {
        let sp = document.getElementById(this.showRightMenu);
        if (!sp.contains(event.target)) {
          this.showRightMenu = "none";
        }
      }
    },

    resetExecuteCronExpression: function() {
      if (!!this.executeCronTime) {
        post(
          { loading: true, code: this.executeCronTime },
          "pc/task/taskMonitor/func_resetExecuteCronExpression"
        ).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
                this.startFlag = true;
                this.$msgTip.info(this, { info: "设置自动执行批量表达式成功" });
            } else {
                this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      } else {
        this.$msgTip.error(this, { info: "请输入批量作业执行表达式" });
      }
    },

    startTask: function() {
      post({ loading: false }, "pc/task/taskMonitor/func_startTask").then(
        res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$msgTip.info(this, { info: "开启日终批量成功" });
              this.startFlag = true;
              this.showRightMenu = "none";
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        }
      );
    },
    handExec(item) {
      post(item, "pc/task/taskMain/func_runImmediatelyTask").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode == "000000") {
            this.$msgTip.info(this, { info: "正在执行中...,稍后刷新试试" });
            this.showRightMenu = "none";
          } else {
            this.$msgTip.error(this, { info: res.data.retMsg });
          }
        } else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });
    },
    handExecFailFollowTask(item) {
      post(item, "pc/task/taskMonitor/func_runFailFollowAllTask").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode == "000000") {
            this.$msgTip.info(this, { info: "正在执行中...,稍后刷新试试" });
            this.showRightMenu = "none";
          } else {
            this.$msgTip.error(this, { info: res.data.retMsg });
          }
        } else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });
    },

    handExecFailTask(item) {
      post(item, "pc/task/taskMonitor/func_runFailAllTask").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode == "000000") {
            this.$msgTip.info(this, { info: "正在执行中...,稍后刷新试试" });
            this.showRightMenu = "none";
          } else {
            this.$msgTip.error(this, { info: res.data.retMsg });
          }
        } else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });
    },

    enter(itemId) {
      this.showTaskDetail = itemId;
    },

    leave() {
      this.showTaskDetail = "none";
    },

    rightBoxMenu(itemId) {
      this.leave();
      this.showRightMenu = itemId;
    },
    queryAllTask() {
      post({ loading: false }, "pc/task/taskMonitor/func_monitorAllTask").then(
        res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.taskList = res.data.retData;
              this.startFlag = false;
              this.taskListSize = this.taskList.length;
              for (let i = 0; i < this.taskListSize; i++) {
                if (this.taskList[i].processStatus !== "0") {
                  this.startFlag = true;
                  break;
                }
              }
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            clearInterval(this.timer);
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        }
      );
    },
    refreshPage() {
      this.queryAllTask();
    }
  },
  mounted() {
    getParamValuesByKeys(
      "task.is_open_auto_task,task.global_execute_cron_time"
    ).then(res => {
      this.runTaskMode = !!res["task.is_open_auto_task"]
        ? res["task.is_open_auto_task"]
        : this.runTaskMode;
      this.executeCronTime = !!res["task.global_execute_cron_time"]
        ? res["task.global_execute_cron_time"]
        : this.executeCronTime;
    });
    if (this.timer) {
      clearInterval(this.timer);
    } else {
      this.timer = setInterval(() => {
        this.refreshPage();
      }, 10000);
    }
    this.queryAllTask();
  },
  destroyed() {
    clearInterval(this.timer);
  }
};
</script>
<style scoped lang="scss">
</style>
