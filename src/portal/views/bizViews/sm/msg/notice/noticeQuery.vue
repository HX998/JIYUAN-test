<!--公告查询-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.msg.noticeTitle')" prop="noticeTitle">
                  <h-input v-model="formItem.noticeTitle" :maxlength=500></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.msg.noticeDt')" prop="noticeDt">
                   <h-date-picker :value="formItem.noticeDt" type="date"  v-model="formItem.noticeDt"  :editable=false :showFormat=true placeholder="" @on-change="handleDateChange"></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.msg.noticeNo')" prop="noticeNo">
                  <h-input v-model="formItem.noticeNo" :maxlength=20></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.msg.pubTellerName')" prop="pubTellerName">
                  <h-input v-model="formItem.pubTellerName" :maxlength=50></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.msg.noticeContent')" prop="noticeContent">
                  <h-input v-model="formItem.noticeContent" :maxlength=500></h-input>
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
                      url="/sm/msg/notice/noticeQuery/func_queryNoticeInfo"
                      :auto-load="false"
                      :bindForm="formItem"
                      :onCurrentChange="handleCurrentChange"
                      :onCurrentChangeCancel="handleCurrentChangeCancel"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="handleContentQuery()" :disabled="hasCommitDisabled">{{$t('m.i.msg.showNoticeContent')}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <!--查看公告内容窗口-->
    <h-msg-box v-model="noticeContentWin" width="1000" height="400" :mask-closable="false"  class="h-form-table-layer"
               @on-close="handleWinClose"       :maximize="true">
                   <p slot="header">
                        <span >查看公告</span>
                   </p>
            <h-form :model="viewForm"  :label-width="120" cols="2" ref="viewForm" class="h-form-search">
               <h-form-item :label="$t('m.i.msg.noticeNo')" prop="noticeNo" >
                <h-input v-model="viewForm.noticeNo" readonly></h-input>
               </h-form-item>
               <h-form-item :label="$t('m.i.msg.noticeTitle')" prop="noticeTitle">
                <h-input v-model="viewForm.noticeTitle" readonly></h-input>
               </h-form-item>
               <h-form-item :label="$t('m.i.msg.noticeContent')"  prop="noticeContent" style="width: 100%;">
                 <h-input  v-model="viewForm.noticeContent"  type="textarea" readonly :canResize="false"  :rows="10"></h-input>
               </h-form-item>
             </h-form>
          <p slot="footer">
            <h-button type="ghost" @click="noticeContentWin=!noticeContentWin">{{$t("m.i.common.close")}}</h-button>
            <h-button type="primary"  @click="downloadAttach()" :disabled="noCommitDisabled">{{$t('m.i.common.downloadAttach')}}</h-button>
          </p>
    </h-msg-box>

    <!--挑票页面弹框-->
    <download-attach :downloadAttachWin="downloadAttachWin" @downloadAttachClose="downloadAttachClose"
                 :id ="this.id"></download-attach>
  </div>
</template>

<script>
  import {post, on, off} from "@/api/bizApi/commonUtil";

  export default {
    name: "noticeQuery",
    components: {
      DownloadAttach: () => import( /* webpackChunkName: "sm/msg/notice/downloadAttach" */ '@/views/bizViews/sm/msg/notice/downloadAttach')
    },
    data(){
      return {
        formItem : {
          noticeTitle : '',
          noticeDt:'',
          noticeNo:'',
          pubTellerName:'',
        },
        viewForm :{
          noticeNo:'',
          noticeTitle:'',
          noticeContent:'',
        },
        columns : [
          {
            type: "radio",
            title:" ",
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
            title: this.$t('m.i.msg.noticeNo'),
            key: "noticeNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.msg.noticeTitle'),
            key: "noticeTitle",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.msg.pubTellerName'),
            key: "pubTellerName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.msg.noticeDt'),
            key: "noticeDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let date = this.$moment(params.row.noticeDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
        ],
        readonly:false,
        isRequired:true,
        hasCommitDisabled : false,
        noCommitDisabled : false,
        ifShowMore : false,
        noticeContentWin :false,
        downloadAttachWin:false,
        currentSelectRow:[],
        id : '',
      }
    },
    watch: {
      "$route": "getParams"
    },
    methods :{

      handleContentQuery(){
      let row = this.currentSelectRow;
        if(row != null && row.length !== 0){
          this.viewForm.noticeNo = row.noticeNo;
          this.viewForm.noticeTitle = row.noticeTitle;
          this.viewForm.noticeContent = row.noticeContent;
          this.id = row.id;
          this.noticeContentWin=true;
        }else{
        this.$msgTip.info(this,{info:this.$t('m.i.common.chooseOneData')});
        }
      },
      handleWinClose(){
        this.currentSelectRow = [];
        this.currentSelectList = [];
        this.$refs.datagrid.dataChange(1);
      },
      downloadAttach(){
      this.downloadAttachWin = true;
      },

      downloadAttachClose(){
      this.downloadAttachWin = false;
      },

     handleDateChange(value) {
        this.formItem.noticeDt = value.replace(/-/g, "");
      },

      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
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
      },
      getParams(){
        if (this.$route.path === "/sm/msg/notice/noticeQuery") {
          if (this.$route.query.noticeDt) {
            let noticeDt = this.$moment(this.$route.query.noticeDt, "YYYY-MM-DD").format("YYYYMMDD");
            this.formItem.noticeDt = noticeDt;
            this.$nextTick(() => {
              this.formSearch();
            });
          } else {
            this.$nextTick(() => {
              this.formSearch();
            });
          }
        }
      }
    },
    mounted() {
      this.getParams();
    },

  };
</script>

<style scoped>

</style>
