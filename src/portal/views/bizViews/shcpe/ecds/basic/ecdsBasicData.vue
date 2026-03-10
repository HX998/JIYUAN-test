<template>
  <div >
    <div class="text-wrap mb-10">
      <div class="text-header"><span class="tit">基础数据</span></div>
      <div class="text-body">
            <h-row>
              <h-col span="10" class="label">{{$t('m.i.shcpe.bankNoData')}}：</h-col>
              <h-col span="8" class="val">ECDS_BANK_DATA.dat</h-col>
              <h-col span="6" class="val"> <h-button type="primary" @click="reLoadEcdsBankData()" size="small">{{$t('m.i.shcpe.importAgain')}}</h-button></h-col>
            </h-row>
            <h-row>
              <h-col span="10" class="label">{{$t('m.i.shcpe.bankNoBakFile')}}:</h-col>
              <h-col span="8" class="val">ECDS_BANK_ASS_DATA.dat</h-col>
              <h-col span="6" class="val"> <h-button type="primary" @click="reLoadEcdsBankAssData()" size="small">{{$t('m.i.shcpe.importAgain')}}</h-button></h-col>
            </h-row>
            <h-row>
              <h-col span="10" class="label">{{$t('m.i.shcpe.businessPermissionsFile')}}:</h-col>
              <h-col span="8" class="val">ECDS_AUTHLIST_DATA.dat</h-col>
              <h-col span="6" class="val"> <h-button type="primary" @click="reLoadEcdsAuthlistData()" size="small">{{$t('m.i.shcpe.importAgain')}}</h-button></h-col>
            </h-row>
            <h-row>
              <h-col span="10" class="label">{{$t('m.i.shcpe.commonDataFile')}}:</h-col>
              <h-col span="8" class="val">ECDS_COMMON_DATA.dat</h-col>
              <h-col span="6" class="val"> <h-button type="primary" @click="reLoadEcdsCommonData()" size="small">{{$t('m.i.shcpe.importAgain')}}</h-button></h-col>
            </h-row>
            <h-row>
              <h-col span="10" class="label">{{$t('m.i.shcpe.acessPointDataFile')}}:</h-col>
              <h-col span="8" class="val">ECDS_AP_DATA.dat</h-col>
              <h-col span="6" class="val"> <h-button type="primary" @click="reLoadEcdsApData()" size="small">{{$t('m.i.shcpe.importAgain')}}</h-button></h-col>
            </h-row>
            <h-row>
              <h-col span="10" class="label">{{$t('m.i.shcpe.participantsAuxiliaryFile')}}:</h-col>
              <h-col span="8" class="val">ECDS_PS_ASS_DATA.dat</h-col>
              <h-col span="6" class="val"> <h-button type="primary" @click="reLoadEcdsPsAssData()" size="small">{{$t('m.i.shcpe.importAgain')}}</h-button></h-col>
            </h-row>
            <h-row>
              <h-col span="10" class="label">{{$t('m.i.shcpe.participantsAccessPointDataFile')}}:</h-col>
              <h-col span="8" class="val">ECDS_PSAP_ASS_DATA.dat</h-col>
              <h-col span="6" class="val"> <h-button type="primary" @click="reLoadEcdsPsapAssData()" size="small">{{$t('m.i.shcpe.importAgain')}}</h-button></h-col>
            </h-row>
            <h-row>
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
                <h-button type="primary" icon="ios-cloud-upload-outline" slot="chooseFile" v-if="!fileDataFirst" :disabled="isDisabled">证书上传--请选择文件</h-button>
              </h-upload>
              <div>
                <h-button type="primary" @click="fileUpload" v-show="fileDataFirst" >{{$t("m.i.shcpe.certificateUpload")}}</h-button>
              </div>
            </h-row>
      </div>
    </div>
  </div>

</template>

<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";
  export default {
    name: "ecdsBasicData",
    data() {
      let options = {};
      options.fileDataFirst = false;
      options.isDisabled = false;
      options.submitFlag = false;
      return options;
    },

    props: {
      uploadCertParams: {
        type: Object,
        default() {
          return {
            fileUploadUrl: window.LOCAL_CONFIG.API_HOME+"/ecds/basic/ecdsBasicData/func_uploadCertificate",   //导入接口
            uploadParams: {},       //调用数据解析接口时附带的额外参数
          };
        }
      }
    },


    watch: {
      importWin(val) {
        if (val) {
          this.$refs.upload.clearFiles();
          this.fileDataFirst = false;
          this.isDisabled = false;
        }
      },
    },

    mounted() {

    },
    destroyed(){
      clearInterval(this.timer);
    },
    methods: {
      setTimer() {
        setInterval(() => {
          location.reload(true);
        }, 5000)
      },



      handleFormatError(file) {
        this.$msgTip.error(this, { info: "文件 " + file.name + " 格式不正确，请上传pfx格式的文件" });
      },
      handleProgress() {
      },
      uploadSuccess(response, file) {
        let retCode = response.retCode;
        if (retCode === "000000") {
          this.$msgTip.success(this, {info: file.name + "上传成功"});
          this.$emit("importSuccess", "");
        } else {
          this.fileDataFirst = false;
          this.isDisabled = false;
          this.$refs.upload.clearFiles();
          this.$msgTip.error(this, { info: "文件上传失败:" + response.retMsg });
        }
      },
      uploadError(error, file) {
        this.$msgTip.error(this, { info: file.name + "上传失败" });
        this.fileDataFirst = false;
        this.isDisabled = false;
      },
      handleRemove(file) {
        this.$msgTip.success(this, { info: file.name + "已移除" });
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



      reLoadEcdsBankData(){
        this.$hMsgBox.confirm({
          title: this.$t('m.i.shcpe.bankNoData'),
          content: this.$t("m.i.common.confirm") + "?",
          onOk: () => {
            this.$loadingbox.open({
              title: "导入数据中，请稍后..."
            });
            post({flag:"ECDS_BANK_DATA"},'/shcpe/ecds/basic/ecdsBasicData/func_loadEcdsBasicData').then(res => {
              if(res){
                this.$loadingbox.close();
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if(retCode==="000000"){
                  this.$msgTip.success(this,{info:this.$t('m.i.common.importSuccess')});
                }else{
                  this.$msgTip.error(this,{info:msg});
                }
              }else{
                this.$loadingbox.close();
                this.$msgTip.error(this,{info:this.$t("m.i.common.netError")});
              }
            });
          }
        });
      },

      reLoadEcdsBankAssData(){
        this.$hMsgBox.confirm({
          title: "行号数据辅助文件",
          content: this.$t("m.i.common.confirm") + "?",
          onOk: () => {
            this.$loadingbox.open({
              title: "导入数据中，请稍后..."
            });
            post({flag:"ECDS_BANK_ASS_DATA"},'/shcpe/ecds/basic/ecdsBasicData/func_loadEcdsBasicData').then(res => {
              if(res){
                this.$loadingbox.close();
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if(retCode==="000000"){
                  this.$msgTip.success(this,{info:this.$t('m.i.common.importSuccess')});
                }else{
                  this.$msgTip.error(this,{info:msg});
                }
              }else{
                this.$loadingbox.close();
                this.$msgTip.error(this,{info:this.$t("m.i.common.netError")});
              }
            });
          }
        });
      },

      reLoadEcdsAuthlistData(){
        this.$hMsgBox.confirm({
          title: this.$t('m.i.shcpe.businessPermissionsFile'),
          content: this.$t("m.i.common.confirm") + "?",
          onOk: () => {
            this.$loadingbox.open({
              title: "导入数据中，请稍后..."
            });
            post({flag:"ECDS_AUTHLIST_DATA"},'/shcpe/ecds/basic/ecdsBasicData/func_loadEcdsBasicData').then(res => {
              if(res){
                this.$loadingbox.close();
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if(retCode==="000000"){
                  this.$msgTip.success(this,{info:this.$t('m.i.common.importSuccess')});
                }else{
                  this.$msgTip.error(this,{info:msg});
                }
              }else{
                this.$loadingbox.close();
                this.$msgTip.error(this,{info:this.$t("m.i.common.netError")});
              }
            });
          }
        });
      },

      reLoadEcdsCommonData(){
        this.$hMsgBox.confirm({
          title: "公共数据文件",
          content: this.$t("m.i.common.confirm") + "?",
          onOk: () => {
            this.$loadingbox.open({
              title: "导入数据中，请稍后..."
            });
            post({flag:"ECDS_COMMON_DATA"},'/shcpe/ecds/basic/ecdsBasicData/func_loadEcdsBasicData').then(res => {
              if(res){
                this.$loadingbox.close();
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if(retCode==="000000"){
                  this.$msgTip.success(this,{info:this.$t('m.i.common.importSuccess')});
                }else{
                  this.$msgTip.error(this,{info:msg});
                }
              }else{
                this.$loadingbox.close();
                this.$msgTip.error(this,{info:this.$t("m.i.common.netError")});
              }
            });
          }
        });
      },

      reLoadEcdsApData(){
        this.$hMsgBox.confirm({
          title: "接入点信息文件",
          content: this.$t("m.i.common.confirm") + "?",
          onOk: () => {
            this.$loadingbox.open({
              title: "导入数据中，请稍后..."
            });
            post({flag:"ECDS_AP_DATA"},'/shcpe/ecds/basic/ecdsBasicData/func_loadEcdsBasicData').then(res => {
              if(res){
                this.$loadingbox.close();
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if(retCode==="000000"){
                  this.$msgTip.success(this,{info:this.$t('m.i.common.importSuccess')});
                }else{
                  this.$msgTip.error(this,{info:msg});
                }
              }else{
                this.$loadingbox.close();
                this.$msgTip.error(this,{info:this.$t("m.i.common.netError")});
              }
            });
          }
        });
      },

      reLoadEcdsPsAssData(){
        this.$hMsgBox.confirm({
          title: this.$t('m.i.shcpe.participantsAuxiliaryFile'),
          content: this.$t("m.i.common.confirm") + "?",
          onOk: () => {
            this.$loadingbox.open({
              title: "导入数据中，请稍后..."
            });
            post({flag:"ECDS_PS_ASS_DATA"},'/shcpe/ecds/basic/ecdsBasicData/func_loadEcdsBasicData').then(res => {
              if(res){
                this.$loadingbox.close();
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if(retCode==="000000"){
                  this.$msgTip.success(this,{info:this.$t('m.i.common.importSuccess')});
                }else{
                  this.$msgTip.error(this,{info:msg});
                }
              }else{
                this.$loadingbox.close();
                this.$msgTip.error(this,{info:this.$t("m.i.common.netError")});
              }
            });
          }
        });
      },


      reLoadEcdsPsapAssData(){
        this.$hMsgBox.confirm({
          title: this.$t('m.i.shcpe.participantsAccessPointDataFile'),
          content: this.$t("m.i.common.confirm") + "?",
          onOk: () => {
            this.$loadingbox.open({
              title: "导入数据中，请稍后..."
            });
            post({flag:"ECDS_PSAP_ASS_DATA"},'/shcpe/ecds/basic/ecdsBasicData/func_loadEcdsBasicData').then(res => {
              if(res){
                this.$loadingbox.close();
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if(retCode==="000000"){
                  this.$msgTip.success(this,{info:this.$t('m.i.common.importSuccess')});
                }else{
                  this.$msgTip.error(this,{info:msg});
                }
              }else{
                this.$loadingbox.close();
                this.$msgTip.error(this,{info:this.$t("m.i.common.netError")});
              }
            });
          }
        });
      },
    },
  };
</script>

<style scoped>

</style>
