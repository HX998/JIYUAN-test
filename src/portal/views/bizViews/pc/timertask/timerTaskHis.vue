<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.pc.taskNo')" prop="taskNo">
                  <h-input v-model="formItem.taskNo"></h-input>
                </h-form-item>

                <h-form-item :label="$t('m.i.pc.taskName')" prop="taskName">
                  <h-input v-model="formItem.taskName" ></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.busiDt')" prop="busiDt">
                  <h-date-picker :value="formItem.busiDt" type="date" placeholder=""  v-model="formItem.busiDt"  :editable=false :showFormat=true @on-change="handleDateChange"></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.pc.dealStatus')" prop="processStatus">
                  <h-select v-model="formItem.processStatus"  placeholder="">
                    <h-option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.pc.triggerType')" prop="triggerType" >
                  <h-select v-model="formItem.triggerType" placeholder="">
                    <h-option v-for="item in isList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont" :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="formSearch()">{{$t('m.i.common.search')}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t('m.i.common.reset')}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid :columns="columns"
                      highlight-row
                      url="/pc/timertask/timerTaskHis/func_queryTimerTaskHisInfo"
                      :bindForm="formItem"
                      ref="datagrid">
          </h-datagrid>

        </div>
      </h-col>
    </h-row>
    <!--点击查看权限弹出窗-->
    <h-msg-box v-model="viewAuthWin" width="400" :mask-closable="false" @on-close="handleWinClose"
               :maximize="true">
      <p slot="header">
        <span>错误信息查看</span>
      </p>
      <div style="word-wrap: break-word;">{{authContext}}</div>
      <div slot="footer">
        <h-button type="ghost" @click="viewAuthWin=!viewAuthWin">{{$t("m.i.common.close")}}</h-button>
      </div>
    </h-msg-box>
  </div>
</template>

<script>
  import {post, on, off, getDictListByGroups, getDictValueFromMap} from "@/api/bizApi/commonUtil";


  export default {
    name: "timerTaskHis",
    data(){
      return {
        columns : [
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title:this.$t("m.i.pc.taskNo"),
            key: "taskNo",
            hiddenCol: false
          },
          {
            title:this.$t("m.i.pc.taskName"),
            key: "taskName",
            hiddenCol: false,

          },
          {
            title: this.$t("m.i.common.busiDt"),
            key: "busiDt",
            hiddenCol: false,
            render: (h, params) => {
              let date = this.$moment(params.row.busiDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.pc.operTellerId"),
            key: "operTellerNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.pc.processMsg"),
            key: "processMsg",
            hiddenCol: false
          },
          {
            title:this.$t("m.i.pc.dealStatus"),
            key: "processStatus",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap,"TaskProcessStatus",params.row.processStatus);
              return h("span", {domProps: {title: dictValue}}, dictValue);
            }
          },
          {
            title: this.$t("m.i.pc.errorEnCode"),
            key: "errorCode",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.errorMsg"),
            key: "errorMsg",
            hiddenCol: false,
            render: (h, params) => {
              if(params.row.errorMsg == null || params.row.errorMsg === ""){
                return "";
              }
              return h("a", {
                on: {
                  click: () => {
                    this.getAutolist(params.row.errorMsg);
                  }
                }
              }, "查看错误信息");
            }
          },
          {
            title: this.$t("m.i.pc.triggerType"),
            key: "triggerType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap,"executeMode",params.row.triggerType);
              return h("span", {domProps: {title: dictValue}}, dictValue);
            }
          },
          {
            title:this.$t("m.i.pc.beginGmt"),
            key: "beginGmt",
            hiddenCol: false,
            render: (h, params) => {
              if(params.row.beginGmt ==null){
                return null;
              }
              let date = this.$moment(params.row.beginGmt).format("YYYY-MM-DD HH:mm:ss");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.pc.endGmt"),
            key: "endGmt",
            hiddenCol: false,
            render: (h, params) => {
              if(params.row.endGmt ==null){
                return null;
              }
              let date = this.$moment(params.row.endGmt).format("YYYY-MM-DD HH:mm:ss");
              return h("span", date);
            }
          },
        ],
        statusList :[
          {
            value:"2",
            label:"作业完成"
          },{
            value:"3",
            label:"作业失败"
          }],
        formItem : {
          taskNo : '',
          taskName:'',
          busiDt:'',
          processStatus:'',
          triggerType:'',
        },
        authContext: null,
        isList : [],
        dictMap : new Map(),
        ifShowMore : false,
        viewAuthWin: false,
      };
    },
    methods :{
      handleDateChange(value) {
        this.formItem.busiDt = value.replace(/-/g, "");
      },
      //查看权限弹窗
      getAutolist(value) {
        this.authContext = value;
        this.viewAuthWin = true;
      },
      handleWinClose() {
        this.$refs.editForm.resetFields();
      },

      unDisabled(){
        this.deletDisabled=false
      },
      formSearch() {
        this.unDisabled()
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
      }
    },
    mounted() {
      getDictListByGroups("executeMode,TaskProcessStatus").then(res => {
        this.isList = res.get("executeMode");
        this.dictMap = res.get("map");
      });
    }
  };
</script>

<style scoped>

</style>
