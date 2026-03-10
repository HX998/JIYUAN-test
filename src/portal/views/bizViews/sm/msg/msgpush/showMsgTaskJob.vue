<template>
  <!--法人编号弹出框-->
  <h-msg-box v-model="tempMsgTaskJobWin" width="1000" @on-close="handleClose" class="h-form-table-layer"
             :maximize="true" :mask-closable="false" @on-maximize="onMaximize">
    <p slot="header">
      <span>查询定时消息任务窗口</span>
    </p>
    <!--查询表单-->
    <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
      <h-form-item label="定时任务名称" prop="taskName">
        <h-input v-model="formItem.taskName" placeholder="" :maxlength="6"></h-input>
      </h-form-item>
      <h-form-item label="运行时间">
        <h-time-picker v-model="taskRunTmRange" confirm type="timerange" placement="bottom-end" placeholder="选择时间" style="width: 168px"></h-time-picker>
      </h-form-item>
      <h-form-item class="h-form-operate two-form">
        <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
        <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
      </h-form-item>
    </h-form>
    <!--数据展示表格-->
    <h-datagrid :columns="columns"
                :highlightRow="true"
                :autoLoad="false"
                url="/sm/msg/msgpush/msgTaskJobMain/queryMsgTaskConfByPage"
                :bindForm="formItem"
                :onCurrentChange="handleRowClick"
                :onCurrentChangeCancel="handleCurrentChangeCancel"
                :onRowDbClick="doubleHandleClick"
                ref="datagrid">
    </h-datagrid>
    <!-- 弹出框模式底部按钮 -->
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
      <h-button type="primary" @click="submitForm">{{$t("m.i.common.commit")}}</h-button>
    </div>
  </h-msg-box>
</template>

<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";

  export default {
    name: "showMsgTaskJob",
    data() {
      return {
        formItem: {
          taskName: "",
          minTaskRunTime: "",
          maxTaskRunTime: ""
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
        pageInfo: {
          pageNo: 1,
          pageSize: 10
        },
        currentSelectRow: null,
        submitFlag: false,

        taskRunTmRange:[]
      };
    },
    components: {},
    watch: {
      tempMsgTaskJobWin(val) {
        if (val == true) {
          this.$nextTick(() => {
            this.$refs.formItem.resetFields();
            this.currentSelectRow = null;
            this.$refs.datagrid.dataChange(1);
          });
        }
      }
    },

    computed: {
      tempMsgTaskJobWin: {
        get() {
          return this.showMsgTaskJobWin;
        },
        set() {
        }
      }
    },
    props: {
      title: String,
      showMsgTaskJobWin: {
        type: Boolean,
        default() {
          return false;
        }
      }
    },
    methods: {
      doubleHandleClick(arr) {
        this.currentSelectRow = arr;
        this.$emit("msgTaskJobChange", this.currentSelectRow);
      },
      onMaximize() {
        setTimeout(() => {
          this.$refs.datagrid.$refs.gridContent.handleResize();
        }, 100);
      },
      //查询
      formSearch() {
        if (this.taskRunTmRange instanceof Array &&this.taskRunTmRange.length==2) {
          this.formItem.minTaskRunTime=this.taskRunTmRange[0].replace(/:/g,"");
          this.formItem.maxTaskRunTime=this.taskRunTmRange[1].replace(/:/g,"");
        }
        this.currentSelectRow = null;
        this.$refs.datagrid.dataChange(1);
      },
      //重置
      formSearchReset() {
        this.$refs.formItem.resetFields();
        this.formItem.minTaskRunTime=""
        this.formItem.maxTaskRunTime="";
        this.taskRunTmRange=[];
      },
      //行选中
      handleRowClick(arr) {
        this.currentSelectRow = arr;
      },
      handleCurrentChangeCancel(){
        this.currentSelectRow = null
      },
      //确定
      submitForm() {
        if (this.currentSelectRow === null || this.currentSelectRow === "" || this.currentSelectRow === undefined) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.$emit("msgTaskJobChange", this.currentSelectRow);
      },
      //关闭
      handleClose() {
        this.$emit("closeMsgTaskJobWin", "");
      }
    }
  };
</script>

<style scoped>

</style>
