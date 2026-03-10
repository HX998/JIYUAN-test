<template>
  <h-msg-box v-model="tempImportWin" width="500" :mask-closable="false" class="h-form-search-layer"
             :maximize="true" @on-close="handleClose" :height="100">
    <p slot="header">
      <span>{{title}}</span>
    </p>
    <div class="h-layer-excel">
      <span class="h-filename">文件</span>
      <div class="h-pj-upload">
        <h-upload :action="fileParams.loadExcelUrl"
                  :data="fileParams.uploadParams"
                  :format="['xls','xlsx']"
                  :max-size="2048"
                  :with-credentials="true"
                  :on-exceeded-size="handleMaxSize"
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
          <h-button type="primary" icon="ios-cloud-upload-outline" slot="chooseFile" :disabled="isDisabled">
            {{$t("m.i.common.chooseImportFile")}}
          </h-button>
        </h-upload>
        <div class="h-excel-operate">
          <h-button type="ghost" class="h-excel-import" :disabled="!importSelect || loadingStatus" @click="fileUpload">
            {{loadingStatus ?
            "导入中" : "导入"}}
          </h-button>
          <h-button type="ghost" @click="fileCancel">取消</h-button>
        </div>
      </div>
    </div>
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
    </div>
  </h-msg-box>
</template>

<script>
  export default {
    name: "upload",
    data() {
      return {
        importSelect: true,
        fileDataFirst: false,
        isDisabled: false,
        loadingStatus: false,
        gridDatas: {
          list: []
        },
        submitFlag: false
      };
    },
    props: {
      title: {
        type: String,
        default: "批量导入"
      },
      importWin: {
        type: Boolean,
        default: false
      },
      fileParams: {
        type: Object,
        default() {
          return {
            loadExcelUrl: String,   //导入excel数据解析接口
            uploadParams: {},       //调用excel数据解析接口时附带的额外参数
          };
        }
      }
    },
    comments: {},
    watch: {
      importWin(val) {
        if (val) {
          this.$nextTick(() => {
            this.$refs.upload.clearFiles();
          });
          this.importSelect = true;
          this.fileDataFirst = false;
          this.isDisabled = false;
          this.loadingStatus = false;
        }
      }
    },
    computed: {
      tempImportWin: {
        get() {
          return this.importWin;
        },
        set() {
        }
      }
    },
    methods: {
      handleClose() {
        this.$emit("importWinClose", "");
      },
      handleMaxSize (file) {
        this.$msgTip.error(
          this, { info: "文件 " + file.name + " 太大，不能超过2M" })
      },
      handleFormatError(file) {
        this.$msgTip.error(this, { info: "文件 " + file.name + " 格式不正确，请上传xls或xlsx格式的文件" });
      },
      handleProgress() {
      },
      uploadSuccess(response, file) {
        this.importSelect = false;
        this.loadingStatus = false;
        this.$emit("uploadSuccess", response, file);
      },
      uploadSuccessErrorFunc(){
        this.importSelect = true;
        this.fileDataFirst = false;
        this.isDisabled = false;
        this.loadingStatus = false;
        this.$refs.upload.clearFiles();
      },
      uploadError(error, file) {
        this.$msgTip.error(this, { info: file.name + "上传失败" });
        this.importSelect = true;
        this.fileDataFirst = false;
        this.isDisabled = false;
        this.loadingStatus = false;
      },
      handleRemove(file) {
        this.$msgTip.success(this, { info: file.name + "已移除" });
        this.importSelect = true;
        this.fileDataFirst = false;
        this.isDisabled = false;
        this.loadingStatus = false;
      },
      //文件列表加入第一条数据时返回true，非第一条数据则不触发事件
      uploadGotoAdd(status) {
        this.fileDataFirst = status;
        this.isDisabled = status;
      },
      //文件导入
      fileUpload() {
        this.loadingStatus = true;
        this.$refs.upload.handlePostFile();
      },
      fileCancel() {
        this.$refs.upload.clearFiles();
        this.importSelect = true;
        this.fileDataFirst = false;
        this.isDisabled = false;
        this.loadingStatus = false;
      },
    }
  };
</script>

<style type="text/css" scoped>
</style>
