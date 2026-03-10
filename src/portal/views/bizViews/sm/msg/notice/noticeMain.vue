<!--公告管理-->
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
                  <h-date-picker :value="formItem.noticeDt" type="date" v-model="formItem.noticeDt" :editable=false
                                 :showFormat=true placeholder="" @on-change="handleDateChange"></h-date-picker>
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
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t("m.i.common.searchAdvanced")}}<i
                    class="icon iconfont"
                    :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid :columns="columns"
                      url="/sm/msg/notice/noticeMain/func_queryNoticeManagerInfo"
                      :bindForm="formItem"
                      :has-select="false"
                      :row-select="true"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="handleAddForm('add')" :disabled="hasCommitDisabled">
                {{$t("m.i.common.add")}}
              </h-button>
              <h-button type="primary" @click="handleAddForm('modify')" :disabled="hasCommitDisabled">
                {{$t("m.i.common.modify")}}
              </h-button>
              <h-button type="primary" @click="handleContentQuery()" :disabled="hasCommitDisabled">
                {{$t("m.i.msg.noticeContent")}}
              </h-button>
              <h-button type="primary" @click="uploadAttach()" :disabled="noCommitDisabled">
                {{$t("m.i.common.uploadAttach")}}
              </h-button>
              <h-button type="primary" @click="handleDelForm()" :disabled="noCommitDisabled">
                {{$t("m.i.common.delete")}}
              </h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <!--点击新增/修改弹出窗-->
    <h-msg-box v-model="addOrEditWin" width="1000" :mask-closable="false" height="400" class="h-form-table-layer"
               @on-close="handleWinClose" :maximize="true">
      <p slot="header">
        <span v-if="type=='add'">新增公告</span>
        <span v-if="type=='modify'">修改公告</span>
      </p>
      <div>
        <h-form :model="addForm" :label-width="120" ref="addForm" cols="2" class="h-form-search">

          <h-form-item :label="$t('m.i.msg.noticeNo')" prop="noticeNo">
            <h-input v-model="addForm.noticeNo" :maxlength=8></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.msg.noticeTitle')" prop="noticeTitle" :required="isRequired">
            <h-input v-model="addForm.noticeTitle" :maxlength=166></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.msg.noticeContent')" prop="noticeContent" :required="isRequired" class="h-form-height-auto" style="width: 100%;">
            <h-input v-model="addForm.noticeContent" type="textarea" :canResize="false" :rows="10"></h-input>
          </h-form-item>
        </h-form>

      </div>
      <div slot="footer">
        <h-button type="ghost" @click="addOrEditWin=!addOrEditWin">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="addOrEditFormSave()">{{$t("m.i.common.confirm")}}</h-button>
      </div>

    </h-msg-box>

    <!--查看公告内容窗口-->

    <h-msg-box v-model="noticeContentWin" width="1000" height="400" :mask-closable="false" class="h-form-table-layer"
               @on-close="handleWinClose" :maximize="true">
      <p slot="header">
        <span>查看公告</span>
      </p>

      <h-form :model="viewForm" :label-width="120" cols="2" ref="viewForm" class="h-form-search">
        <h-form-item :label="$t('m.i.msg.noticeNo')" prop="noticeNo">
          <h-input v-model="viewForm.noticeNo" readonly></h-input>
        </h-form-item>
        <h-form-item :label="$t('m.i.msg.noticeTitle')" prop="noticeTitle">
          <h-input v-model="viewForm.noticeTitle" readonly></h-input>
        </h-form-item>
        <h-form-item :label="$t('m.i.msg.noticeContent')" prop="noticeContent" style="width: 100%;">
          <h-input v-model="viewForm.noticeContent" readonly type="textarea" :canResize="false" :rows="10"></h-input>
        </h-form-item>
      </h-form>
      <!-- 弹出框模式底部按钮 -->
      <p slot="footer">
        <h-button type="ghost" @click="noticeContentWin=!noticeContentWin">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" @click="downloadAttach()" :disabled="noCommitDisabled">
          {{$t("m.i.common.downloadAttach")}}
        </h-button>
      </p>
    </h-msg-box>

    <upload-attach :uploadAttachWin="uploadAttachWin" @uploadAttachClose="uploadAttachClose"
                   :id="this.id"></upload-attach>

    <download-attach :downloadAttachWin="downloadAttachWin" @downloadAttachClose="downloadAttachClose"
                     :id="this.id"></download-attach>
  </div>
</template>

<script>

  import { post, on, off } from "@/api/bizApi/commonUtil";


  export default {
    name: "noticeMain",
    components: {
      DownloadAttach: () => import( /* webpackChunkName: "sm/msg/notice/downloadAttach" */ "@/views/bizViews/sm/msg/notice/downloadAttach"),
      UploadAttach: () => import( /* webpackChunkName: "sm/msg/notice/uploadAttach" */ "@/views/bizViews/sm/msg/notice/uploadAttach")
    },
    data() {
      let columns = [
        {
          type: "selection",
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
          title: this.$t("m.i.msg.noticeNo"),
          key: "noticeNo",
          hiddenCol: false,
          sortable: true
        },
        {
          title: this.$t("m.i.msg.noticeTitle"),
          key: "noticeTitle",
          hiddenCol: false,
          sortable: true
        },
        {
          title: this.$t("m.i.msg.pubTellerName"),
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
        }
      ];
      return {
        // 是否显示新增或修改窗口
        addOrEditWin: false,
        uploadFileName: "",
        fileId: "",
        uploadWin: false,
        formItem: {
          noticeTitle: "",
          noticeDt: "",
          noticeNo: "",
          pubTellerName: "",
          noticeContent: ""
        },
        addForm: {
          id: "",
          noticeNo: "",
          noticeTitle: "",
          noticeContent: ""
        },
        viewForm: {
          id: "",
          noticeNo: "",
          noticeTitle: "",
          noticeContent: ""
        },
        columns: columns,
        fileColumns: [
          {
            type: "selection",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          }, {
            title: this.$t("m.i.common.fileName"),
            key: "fileName",
            hiddenCol: false
          }
        ],
        branchColumns: columns,
        type: null,
        readonly: false,
        isRequired: true,
        hasCommitDisabled: false,
        noCommitDisabled: false,
        submitFlag: false,
        copyWin: false,
        ifShowMore: false,
        showOptHistWin: false,
        custMgrNoWinOpen: false,
        brchCodeWin: false,
        noticeContentWin: false,
        uploadNoticeAttachWin: false,
        uploadFileWin: false,
        id: "",
        downloadAttachWin: false,
        uploadAttachWin: false,
        fileList: { rows: [], total: 1 },
        noticeId: null,
        // 富文本编辑器
        editorText: "",
        editorTextCopy: "",
        readonly: false
      };
    },
    methods: {

      // 附件列表分页事件
      handlePageChange(pageNo, pageSize) {
        if (this.noticeId != null) {
          let obj = { id: this.noticeId, pageNo: pageNo, pageSize: pageSize };
          this.queryAttachList(obj);
        }
      },
      addOrEditFormSave() {
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            let url = this.type == "add" ? "/sm/msg/notice/noticeMain/func_addNoticeInfo" : "/sm/msg/notice/noticeMain/func_updateNoticeInfo";
            let msg = this.type == "add" ? this.$t("m.i.common.addSuccess") : this.$t("m.i.common.modifySuccess");
            let pageNo = this.type === "add" ? 1 : this.$refs.datagrid.pageInfo.pageNo;
            this.submitFlag = true;
            post(this.addForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode == "000000") {
                  this.$msgTip.success(this);
                  this.addOrEditWin = false;
                  this.$refs.datagrid.dataChange(pageNo);
                  this.currentSelectRow = [];
                  this.$refs.datagrid.selects = [];
                } else {
                  this.$msgTip.error(this, { info: this.$t("m.i.common.addFailed") + res.data.retMsg });
                  this.$refs.datagrid.dataChange(pageNo);
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }

            });
          }
        });
      },
      handleDateChange(value) {
        this.formItem.noticeDt = value.replace(/-/g, "");
      },
      handleAddForm(str) {
        this.type = str;
        this.readonly = false;
        this.isRequired = true;
        if (this.type == "modify") {
          let list = this.$refs.datagrid.selects;
          if (list != null && list.length > 0) {
            if (list.length > 1) {
              this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
              return;
            }
            this.currentSelectRow = this.$refs.datagrid.selects[0];
          } else {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
            return;
          }
          this.queryObjById(this.currentSelectRow.id);
          if (this.type == "modify") {
            this.readonly = true;
          }
        } else {
          this.$nextTick(() => {
            this.addFormReset();
          });
        }
        this.addOrEditWin = true;
      },

      uploadAttach() {
        let list = this.$refs.datagrid.selects;
        if (list != null && list.length > 0) {
          if (list.length > 1) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
            return;
          }
          this.currentSelectRow = this.$refs.datagrid.selects[0];
          this.id = this.currentSelectRow.id;
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        this.uploadAttachWin = true;

      },

      addFormReset() {
        this.$refs.addForm.resetFields();
        this.addForm.id = "";
      },

      queryObjById(id) {
        post({ id: id }, "/sm/msg/notice/noticeMain/func_getNoticeDtoById").then(res => {
          this.submitFlag = false;
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.addForm.id = res.data.retData.id;
              this.addForm.noticeNo = res.data.retData.noticeNo;
              this.addForm.noticeTitle = res.data.retData.noticeTitle;
              this.addForm.noticeContent = res.data.retData.noticeContent;
              this.viewForm.id = res.data.retData.id;
              this.viewForm.noticeNo = res.data.retData.noticeNo;
              this.viewForm.noticeTitle = res.data.retData.noticeTitle;
              this.viewForm.noticeContent = res.data.retData.noticeContent;
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });

      },
      formSearch() {
        this.$refs.datagrid.dataChange(1);
        this.currentSelectRow = [];
        this.$refs.datagrid.selects = [];
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
      },
      handleDelForm() {
        let list = this.$refs.datagrid.selects;
        if (list != null && list.length > 0) {
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
        let list = this.$refs.datagrid.selects;
        let ids = "";
        for (var i = 0, count = list.length; i < count; i++) {
          ids += list[i].id;
          if (i < list.length - 1) {
            ids += ",";
          }
        }
        post({ ids: ids }, "sm/msg/notice/noticeMain/func_deleteNoticeInfo").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.currentSelectRow = [];
              this.$refs.datagrid.selects = [];
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.deleteFailed") + res.data.retMsg });
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },


      handleContentQuery() {
        let list = this.$refs.datagrid.selects;
        if (list != null && list.length > 0) {
          if (list.length > 1) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
            return;
          }
          this.queryObjById(list[0].id);
          this.id = list[0].id;
          this.noticeContentWin = true;
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }

      },
      downloadAttach() {
        this.downloadAttachWin = true;
      },

      downloadAttachClose() {
        this.downloadAttachWin = false;
      },


      uploadAttachClose() {
        this.uploadAttachWin = false;
      },


      handleWinClose() {
        this.$refs.addForm.resetFields();
        this.currentSelectRow = [];
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.dataChange(1);
      },
      addOrEditWinClose() {
        this.$refs.addForm.resetFields();
        this.addOrEditWin = false;
      }
    }
  };
</script>

<style scoped>

</style>
