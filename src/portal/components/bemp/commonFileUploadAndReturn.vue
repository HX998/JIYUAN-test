<!--文件批量导入-->
<template>
  <h-msg-box v-model="tempImportWin" width="1000" :mask-closable="false" top="10" class="h-form-search-layer"
             :maximize="true" @on-close="handleClose" :height="getHeight">
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
      <div v-show="!importSelect">
        <h-datagrid
          :columns="fileParams.columns"
          :gridData="gridDatas"
          :hasPage="false"
          highlight-row
          :bindForm="fileParams.formItem"
          showListCkeckBox
          :auto-load="false"
          :height="getGridHeght"
          ref="datagrid">
          <div slot="toolbar" class="pull-left"></div>
        </h-datagrid>
      </div>
    </div>
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
      <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
      <h-button type="primary" v-else @click="submitForm" v-show="!importSelect">{{$t("m.i.common.commit")}}</h-button>
    </div>
  </h-msg-box>
</template>

<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";

  export default {
    name: "commonFileUpload",
    data() {
      return {
        importSelect: true,
        fileDataFirst: false,
        isDisabled: false,
        loadingStatus: false,
        gridDatas: {
          list: []
        },
        submitFlag: false,
        isClick: false
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
            fileUploadUrl: String,  //excel数据导入接口
            formItem: {},           //请求表格数据时附带参数
            uploadParams: {},       //调用excel数据解析接口时附带的额外参数
            extraGridDatas: {},     //需在反显数据中额外添加的字段
            columns: [],
            paramKey: "",           //后台接收对应key
            ignoreError: false      //忽略错误
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
      },
      getHeight() {
        return window.innerHeight - 130;
      },
      getGridHeght() {
        return this.getHeight - 160;
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
        let retCode = response.retCode;
        if (retCode === "000000") {
          if(this.fileParams.ignoreError){
            if(response.retData.listData){
              let list = (response.retData.listData instanceof Array) ? response.retData.listData : [response.retData.listData];
              if(list.length > 0){
                this.gridDatas.list = list;
                this.importSelect = false;
                this.loadingStatus = false;
              }else{
                this.uploadSuccessErrorFunc();
              }
            }else{
              this.uploadSuccessErrorFunc();
            }
            if(response.retData.errorMsg){
              this.$msgTip.error(this, { info: `<div>${"文件上传失败：<br/>" + response.retData.errorMsg}</div>` });
            }
          }else{
            this.gridDatas.list = (response.retData instanceof Array) ? response.retData : [response.retData];
            this.importSelect = false;
            this.loadingStatus = false;
          }
        } else {
          this.uploadSuccessErrorFunc();
          this.$msgTip.error(this, { info: `<div>${"文件上传失败：<br/>" + response.retMsg}</div>` });
        }
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
      submitForm() {
        this.submitFlag = true;
        if(this.isClick) {
          return;
        }
        this.isClick = true;
        let gridDatas = this.gridDatas.list;
        for (let i = 0; i < gridDatas.length; i++) {
          let gridData = gridDatas[i];
          for (let key in gridData) {
            if (gridData.hasOwnProperty(key) && (gridData[key] === null || gridData[key] === undefined)) {
              delete gridData[key];
            }
          }
        }
        if (Object.keys(this.fileParams.extraGridDatas).length > 0) {
          for (let i = 0; i < gridDatas.length; i++) {
            Object.assign(gridDatas[i], this.fileParams.extraGridDatas);
          }
        }
        post({ [this.fileParams.paramKey]: gridDatas }, this.fileParams.fileUploadUrl).then(res => {
          this.submitFlag = false;
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.isClick = false;
              this.$msgTip.success(this, { info: msg });
              this.$emit("importSuccess", res.data.retData);
            } else {
              this.isClick = false;
              this.$msgTip.error(this, { info: msg });
            }
          }
        }).catch(error => {
          this.submitFlag = false;
          this.isClick = false;
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      }
    }
  };
</script>

<style scoped>

</style>
