<template>
  <!-- 影像上传-->
  <h-msg-box v-model="tempImportWin" width="500" height="200" class="h-form-table-layer" :maximize="true" @on-close="handleClose" :mask-closable="false" :zIndex="1005">
    <p slot="header">
      <span>影像上传</span>
    </p>
    <div class="h-layer-excel">
      <span class="h-filename">文件</span>
      <h-upload :action="this.uploadUrl"
                :data="this.imageFormItem"
                :format="tempParam.tempImageFormatType"
                :max-size="tempParam.tempImageSize"
                :with-credentials="true"
                :on-format-error="handleFormatError"
                :on-exceeded-size="handleMaxSize"
                :on-progress="handleProgress"
                :on-success="uploadSuccess"
                :on-error="uploadError"
                :on-remove="handleRemove"
                @on-goto-add="uploadGotoAdd"
                selfConfig
                uploadAll
                :class="{'h-upload-goto-add': fileDataFirst}"
                ref="upload">
        <h-button type="primary" icon="ios-cloud-upload-outline" slot="chooseFile" v-if="!fileDataFirst" :disabled="isDisabled">{{$t("m.i.common.chooseImportFile")}}</h-button>
      </h-upload>
    </div>
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
      <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
      <h-button type="primary" v-else @click="fileUpload" v-show="fileDataFirst">提交</h-button>
    </div>
  </h-msg-box>

</template>

<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";
  export default {
    name: "commonUploadImage",
    data() {
      return {
        importSelect : true,
        fileDataFirst : false,
        isDisabled : false,
        submitFlag : false,
        tempParam : {
          tempImageSize: 0,
          tempImageFormatType: []
        },

      }
    },
    props:{
      uploadImageWin: {
        type: Boolean,
        default: false
      },
      uploadUrl: "",
      imageFormItem: {
        type: Object,
        default() {
          return {};
        }
      },
      imageSize: {
        type: Number,
        default: 0
      },
      imageFormatType: {
        type: Array,
        default: function () {
          return []
        }
      },
    },
    watch: {
      uploadImageWin(val) {
        if (val) {
          this.$nextTick(() => {
            this.$refs.upload.clearFiles();
          });
          this.importSelect = true;
          this.fileDataFirst = false;
          this.isDisabled = false;
          if(this.imageSize === 0) {
            this.tempParam.tempImageSize=99999999;
          }else {
            this.tempParam.tempImageSize=this.imageSize;
          }
          if(this.imageFormatType === []) {
            this.tempParam.tempImageFormatType=['jpg','png','jpeg','JPG','PNG','JPEG'];
          }else {
            this.tempParam.tempImageFormatType=this.imageFormatType;
          }
        }
      }
    },
    computed: {
      tempImportWin: {
        get() {
          return this.uploadImageWin;
        },
        set() {
        }
      }
    },
    methods: {
      handleClose() {
        this.$emit("uploadImageWinClose", "");
      },
      handleFormatError(file) {
        if(this.tempParam.tempImageFormatType.toString() === ['jpg','png','jpeg','JPG','PNG','JPEG'].toString()) {
          this.$msgTip.error(this, { info: "文件 " + file.name + " 格式不正确，请上传jpg、jpeg或png格式的文件" });
        }else if(this.tempParam.tempImageFormatType.toString() === ['jpg','JPG'].toString() || this.tempParam.tempImageFormatType.toString() === ['JPG','jpg'].toString()) {
          this.$msgTip.error(this, { info: "文件 " + file.name + " 格式不正确，请上传jpg格式的文件" });
        }
      },
      handleMaxSize (file) {
        this.$msgTip.error(this, {info: "文件 " + file.name + " 太大，不能超过512KB"});
      },
      handleProgress() {
      },
      uploadSuccess(response, file) {
        this.submitFlag = false;
        let retCode = response.retCode;
        if (retCode === "000000") {
          this.$msgTip.success(this, {info: file.name + "上传成功"});
          this.importSelect = false;
          this.handleClose();
        } else {
          this.importSelect = true;
          this.fileDataFirst = false;
          this.isDisabled = false;
          this.$refs.upload.clearFiles();
          this.$msgTip.error(this, { info: "文件上传失败:" + response.retMsg });
        }
      },
      uploadError(error, file) {
        this.$msgTip.error(this, { info: file.name + "上传失败" });
        this.importSelect = true;
        this.fileDataFirst = false;
        this.isDisabled = false;
      },
      handleRemove(file) {
        this.$msgTip.success(this, { info: file.name + "已移除" });
        this.importSelect = true;
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
        this.submitFlag = true;
        this.$refs.upload.handlePostFile();
      },
      fileCancel() {
        this.$refs.upload.clearFiles();
        this.importSelect = true;
        this.fileDataFirst = false;
        this.isDisabled = false;
      },
    },
  };
</script>

