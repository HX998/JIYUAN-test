<template>
  <h-msg-box v-model="tempImportWin" width="500" :height="height" class="h-form-search-layer" :maximize="true"
             @on-close="handleClose" :mask-closable="false">
    <p slot="header">
      <span>{{title}}</span>
    </p>
    <slot></slot>
    <h-form :label-width="90" cols="1" class="h-form-search">
      <h-form-item label="文件">
        <h-upload :action="fileParams.fileUploadUrl"
                  :data="extraData"
                  :format="fileParams.uploadParams.suffixStr || ['xls','xlsx']"
                  :max-size="fileParams.uploadParams.maxSize || 2048"
                  :on-exceeded-size="handleMaxSize"
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
                    :disabled="isDisabled">{{$t("m.i.common.chooseImportFile")}}
          </h-button>
        </h-upload>
      </h-form-item>
    </h-form>
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
    name: "commonFileUploadNoShow",
    data() {
      return {
        importSelect: true,
        fileDataFirst: false,
        isDisabled: false,
        submitFlag: false,
        importForm: {},
        extraData: {}  //上传时附带的额外参数
      };
    },
    props: {
      height: {
        type: Number,
        default: 200
      },
      title: {
        type: String,
        default: "Excel导入"
      },
      importWin: {
        type: Boolean,
        default: false
      },
      fileParams: {
        type: Object,
        default() {
          return {
            fileUploadUrl: String,   //导入excel数据解析接口
            uploadParams: {}       //调用excel数据解析接口时附带的额外参数
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
          this.extraData = this.deepClone(this.fileParams.uploadParams);
          this.importSelect = true;
          this.fileDataFirst = false;
          this.isDisabled = false;
          this.submitFlag = false;
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
      handleMaxSize(file) {
        let maxSize = this.fileParams.uploadParams.maxSize ? this.fileParams.uploadParams.maxSize : 2048;
        this.$msgTip.error(
          this, { info: "文件 " + file.name + " 太大，不能超过" + (maxSize / 1024) + "M" });
      },
      handleFormatError(file) {
        let suffixStr = this.fileParams.uploadParams.suffixStr ? this.fileParams.uploadParams.suffixStr : "xls,xlsx";
        this.$msgTip.error(this, { info: "文件 " + file.name + " 格式不正确，请上传" + suffixStr + "格式的文件" });
      },
      handleProgress() {
      },
      uploadSuccess(response, file) {
        let retCode = response.retCode;
        this.submitFlag = false;
        if (retCode === "000000") {
          this.$msgTip.success(this, { info: file.name + "上传成功" });
          this.importSelect = false;
          this.$emit("importSuccess", "");
        } else {
          this.importSelect = true;
          this.fileDataFirst = false;
          this.isDisabled = false;
          this.$refs.upload.clearFiles();
          this.$msgTip.error(this, { info: "文件上传失败:" + response.retMsg });
          this.$emit("importError", "");


        }
      },
      uploadError(error, file) {
        this.$msgTip.error(this, { info: file.name + "上传失败" });
        this.importSelect = true;
        this.fileDataFirst = false;
        this.isDisabled = false;
        this.submitFlag = false;
      },
      handleRemove(file) {
        this.$msgTip.success(this, { info: file.name + "已移除" });
        this.importSelect = true;
        this.fileDataFirst = false;
        this.isDisabled = false;
        this.submitFlag = false;
      },
      //文件列表加入第一条数据时返回true，非第一条数据则不触发事件
      uploadGotoAdd(status) {
        this.fileDataFirst = status;
        this.isDisabled = status;
      },
      //文件导入
      fileUpload() {
        this.submitFlag = true;
        if (this.$slots.default && this.$slots.default[0].data && this.$slots.default[0].data.ref) {
          let fomrRef = this.$slots.default[0].data.ref;
          this.extraData = Object.assign(this.extraData, this.$slots.default[0].context[fomrRef]);
        }
        this.$refs.upload.handlePostFile();
      },
      fileCancel() {
        this.$refs.upload.clearFiles();
        this.importSelect = true;
        this.fileDataFirst = false;
        this.isDisabled = false;
        this.submitFlag = false;
      }
    }
  };
</script>

<style scoped>

</style>
