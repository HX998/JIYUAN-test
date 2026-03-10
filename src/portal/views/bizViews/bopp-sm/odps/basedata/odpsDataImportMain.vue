<template>
  <div class="layout">
    <table style="width: 100%">
      <tr>
        <h2 style="margin-left:20px;">公共类基础数据</h2>
      </tr>
      <tr>
        <td class="h-import-td">
          <h-button type="primary" @click="platformDataImport()">{{ $t("s.i.odps.platformData") }}</h-button>
          <h-button type="primary" @click="busiAuthDataImport()">{{ $t("s.i.odps.busiAuthData") }}</h-button>
          <h-button type="primary" @click="commonDataImport()">{{ $t("s.i.odps.commonData") }}</h-button>
          <h-upload :action="uploadCertParams.fileUploadUrl"
                    :data="uploadCertParams.uploadParams"
                    :format="['pfx']"
                    :max-size="2048"
                    :with-credentials="true"
                    :on-format-error="handleFormatError"
                    :on-progress="handleProgress"
                    :on-success="uploadSuccess"
                    :on-error="uploadError"
                    :on-remove="handleRemove"
                    @on-goto-add="uploadGotoAdd"
                    selfConfig
                    uploadAll
                    :class="{'h-upload-goto-add': fileDataFirst}"
                    ref="upload">
            <h-button type="primary" icon="ios-cloud-upload-outline" slot="chooseFile" v-if="!fileDataFirst"
                      :disabled="isDisabled">证书上传--请选择文件
            </h-button>
          </h-upload>
          <div>
            <h-button type="primary" @click="fileUpload" v-show="fileDataFirst">
              {{ $t("m.i.shcpe.certificateUpload") }}
            </h-button>
          </div>
        </td>
      </tr>
    </table>
    <h-row name="flex" class="layout-menu-wrapper">
      <!--右侧数据展示表格-->
      <h-col span="24">
        <div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            highlight-row
            url="/sm/odps/basedata/odpsDataImportMain/func_queryImportOdpsBaseLogList"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="refreshImportLog()">{{$t("s.i.odps.refresh")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <!--点击查看错误堆栈信息弹出窗-->
    <h-msg-box v-model="stackTraceWin" class="h-form-search" :maximize="true" width="800" height="350" @on-close="closeStackTraceWin">
      <p slot="header">
        <span>错误信息查看</span>
      </p>
      <div>
        <h-form :model="stackTraceForm" :label-width="115" ref="stackTraceForm" cols="4" class="h-form-search">
          <div class="h-search-form-row">
            <h-input v-model="stackTraceForm.stackTrace" readonly type="textarea" :rows="18"></h-input>
          </div>
        </h-form>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="closeStackTraceWin">{{$t("m.i.common.close")}}</h-button>
      </div>
    </h-msg-box>
  </div>
</template>

<script>
import {post} from "@/api/bizApi/commonUtil";

export default {
  name: "odpsDataImportMain",
  data() {
    return {
      type: "",
      columns: [
        {
          title: this.$t("m.i.common.index"),
          type: "index",
          width: 60,
          align: "center"
          },
          {
            title: this.$t('s.i.odps.fileName'),
            key: "fileName",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t('s.i.odps.status'),
            key: "status",
            hiddenCol: false,
            render: (h, params) => {
              let status = params.row.status;
              status = this.formatImportStatus(status);
              return h("span",
                {
                  domProps: {
                    title: status
                  }
                }, status);
            }
          },
          {
            title: this.$t('s.i.odps.operTellerNo'),
            key: "operTellerNo",
            hiddenCol: false,
            ellipsis: false,
          },
          {
            title: this.$t('s.i.odps.createTime'),
            key: "createTime",
            hiddenCol: false,
            sortable:true,
            render: (h, params) => {
              if (null != params.row.createTime && "" !== params.row.createTime) {
                let createTime = this.$moment(params.row.createTime, "YYYY-MM-DD HH:mm:ss:SSS").format("YYYY-MM-DD HH:mm:ss");
                return h("span", createTime);
              }
            }
          },
          {
            title: this.$t('s.i.odps.updateTime'),
            key: "updateTime",
            hiddenCol: false,
            sortable:true,
            render: (h, params) => {
              if (null != params.row.updateTime && "" !== params.row.updateTime) {
                let updateTime = this.$moment(params.row.updateTime, "YYYY-MM-DD HH:mm:ss:SSS").format("YYYY-MM-DD HH:mm:ss");
                return h("span", updateTime);
              }
            }
          },
          {
            title: this.$t("m.i.common.errorMsg"),
            key: "stackTrace",
            align: "center",
            hiddenCol: false,
            render: (h, params) => {
              if(params.row.stackTrace == null || params.row.stackTrace === ""){
                return "";
              }
              return h("a", {
                on: {
                  click: () => {
                    this.showStackTrace(params.row.stackTrace);
                  }
                }
              }, "查看错误信息");
            }
          },
      ],
      stackTraceForm: {
        stackTrace: ""
      },
      uploadCertParams: {
        fileUploadUrl: window.LOCAL_CONFIG.API_HOME + "/sm/odps/basedata/odpsDataImportMain/func_uploadCertificate",   //导入接口
        uploadParams: {},       //调用数据解析接口时附带的额外参数
      },
      stackTraceWin: false,
      fileDataFirst: false,
      isDisabled: false,
    };
    },
    methods: {
      platformDataImport() {
        this.$hMsgBox.confirm({
          title: this.$t("s.i.odps.platformData"),
          content: this.$t("m.i.common.confirm") + "?",
          onOk: () => {
            this.type = "ODPS_PLATFORM_DATA";
            this.importData();
          }
        });
      },
      busiAuthDataImport() {
        this.$hMsgBox.confirm({
          title: this.$t("s.i.odps.busiAuthData"),
          content: this.$t("m.i.common.confirm") + "?",
          onOk: () => {
            this.type = "ODPS_MSG_PE_DATA";
            this.importData();
          }
        });
      },
      commonDataImport() {
        this.$hMsgBox.confirm({
          title: this.$t("s.i.odps.commonData"),
          content: this.$t("m.i.common.confirm") + "?",
          onOk: () => {
            this.type = "ODPS_COMM_PARAM_DATA";
            this.importData();
          }
        });
      },
      importData() {
        post({ code: this.type }, "/sm/odps/basedata/odpsDataImportMain/func_importOdpsBaseData").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.type = " ";
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this.$t("m.i.common.netError"));
          }
        });
      },
      formatImportStatus(status){
        let result = "";
        if(status === "0"){
          result = "导入成功";
        }else if(status === "1"){
          result = "导入失败";
        }else if(status === "2"){
          result = "导入中";
        }
        return result;
      },
      refreshImportLog() {
        this.$refs.datagrid.dataChange(1);
      },
      closeStackTraceWin() {
        this.stackTraceForm.stackTrace = "";
        this.stackTraceWin = false;
      },
      //查看错误堆栈信息弹窗
      showStackTrace(stackTrace) {
        this.stackTraceForm.stackTrace = stackTrace;
        this.stackTraceWin = true;
      },


      handleFormatError(file) {
        this.$msgTip.error(this, {info: "文件 " + file.name + " 格式不正确，请上传pfx格式的文件"});
      },
      handleProgress() {
      },
      uploadSuccess(response, file) {
        let retCode = response.retCode;
        this.fileDataFirst = false;
        this.isDisabled = false;
        this.$refs.upload.clearFiles();
        if (retCode === "000000") {
          this.$msgTip.success(this, {info: file.name + "上传成功"});
        } else {
          this.$msgTip.error(this, {info: "文件上传失败:" + response.retMsg});
        }
      },
      uploadError(error, file) {
        this.$msgTip.error(this, {info: file.name + "上传失败"});
        this.fileDataFirst = false;
        this.isDisabled = false;
      },
      handleRemove(file) {
        this.$msgTip.success(this, {info: file.name + "已移除"});
        this.fileDataFirst = false;
        this.isDisabled = false;
      },
      //文件列表加入第一条数据时返回true，非第一条数据则不触发事件
      uploadGotoAdd(status) {
        this.fileDataFirst = status;
        this.isDisabled = status;
      },
      //文件导入
      fileUpload() {
        this.$refs.upload.handlePostFile();
      },
      fileCancel() {
        this.$refs.upload.clearFiles();
        this.fileDataFirst = false;
        this.isDisabled = false;
      },
    }
  };
</script>

<style scoped>
  .h-import-td {
    padding: 20px 20px 10px 20px;
    border-top: 1px solid;
    border-bottom: 1px solid;
  }
  button {
    margin-bottom: 10px;
  }
</style>
