<template>
  <div>
    <!-- 批量导入弹出框-->
    <h-msg-box title="批量导入" v-model="tempUploadWin" @on-close="handleClose" height="150" :footerHide="true" :mask-closable="false">
      <h-upload :action="uploadUrl"
                :data="{batchId:batchId,isLock:isLock, isTotalColl : isTotalColl,isTemStorage:isTemStorage}"
                :format="['xls','xlsx']"
                :max-size="2048"
                :with-credentials="true"
                :on-format-error="handleFormatError"
                :on-progress="handleProgress"
                :on-success="uploadSuccess"
                :on-error="uploadError"
                :on-remove="handleRemove"
                @on-goto-add="selectData"
                ref="upload"
                selfConfig
                uploadAll
                :class="{'h-upload-goto-add': curSelectDataFirst}">
        <h-button type="primary" icon="ios-cloud-upload-outline" slot="chooseFile" v-if="curImportSelect">{{$t("m.i.common.chooseImportFile")}}</h-button>
        <h-button type="primary" icon="ios-cloud-upload-outline" slot="postFile" v-if="!curImportSelect" :disabled="importIsDisabled">{{$t('m.i.be.submission')}}</h-button>
      </h-upload>
    </h-msg-box>
  </div>
</template>

<script>
  export default {
    name: "upload",
    data(){
      return{
        importIsDisabled: false,
        curSelectDataFirst:false,
        curImportSelect:false
      }
    },
    props:{
      batchId:Number,
      isLock:String,
      isTotalColl:String,
      isTemStorage:String,
      uploadUrl:String,
      uploadWin:{
        type: Boolean,
        default() {
          return false;
        }
      },
      importSelect:{
        type: Boolean,
        default() {
          return false;
        }
      },
      selectDataFirst:{
        type: Boolean,
        default() {
          return false;
        }
      }
    },
    watch:{

      sidebar:{
        handler(val,oldVal){
          if(!val.opened){
            setTimeout(()=>{
              this.$refs.datagrid.$refs.gridContent.handleResize()
            },100)
          }
        },
        deep:true
      },
      importSelect(val){
        this.curImportSelect=val;
      },
      selectDataFirst(val) {
        this.curSelectDataFirst=this.selectDataFirst;

      },
      curSelectDataFirst(val){
        if(val) {
          this.curImportSelect = false;
        }
      }
    },
    computed: {
      tempUploadWin: {
        get() {
          return this.uploadWin;
        },
        set(){

        }
      },
    },
    methods:{
      selectData(status) {
        this.curSelectDataFirst = status;
      },
      handleFormatError(file) {
        this.$msgTip.error(this, { info: "文件 " + file.name + " 格式不正确，请上传xls、xlsx格式的文件" });
      },
      handleProgress () {
        this.$hMessage.loading({
          content: '文件正在上传中...'
        })
        this.importIsDisabled = true;
      },
      uploadSuccess(response, file){
        let retCode = response.retCode;
        if (retCode === "000000") {
          let obj = response.retData;
          let prmptMsg=obj.prmptMsg;
          if(prmptMsg){
            this.$msgTip.info(this, {info: file.name + "上传成功:"+prmptMsg,time:0});
          }else{
            this.$msgTip.success(this, {info: file.name + "上传成功"});
          }
          this.handleClose();
          this.importIsDisabled = false;
          this.$refs.upload.clearFiles();
          this.curImportSelect = true;
          this.curSelectDataFirst = false;
        } else {
          this.importIsDisabled = false;
          this.$msgTip.error(this, { info: "文件上传失败,失败原因[" + response.retMsg +"]请重新上传！"});
          this.$refs.upload.clearFiles();
          this.curImportSelect = true;
          this.curSelectDataFirst = false;
        }
      },
      uploadError (file) {
        this.$msgTip.error(this, { info: file.name+'上传失败' });
      },
      handleRemove(file){
        this.$msgTip.success(this, {info: file.name+'已移除'});
        this.curImportSelect = true;
        this.curSelectDataFirst = false;
      },
      handleClose() {
        this.$emit("uploadWinClose", "");
      },
    }
  };
</script>

<style type="text/css" scoped>
  .h-upload-goto-add.h-upload {
    position: relative;
    padding-bottom: 50px;
  }
  .h-upload-goto-add .h-upload-self{
    position: absolute;
    bottom: 0;
    right: 0;
  }
</style>
