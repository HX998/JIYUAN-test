<template>
  <div>
  <!--票交机构弹出框-->
  <h-msg-box v-model="tempUploadAttachWin" width="1000" :mask-closable="false" @on-close="handleClose" top="10"
             class="h-form-search-layer" :maximize="true">
    <p slot="header">
      <span>{{title}}</span>
    </p>

    <!--数据展示表格-->
    <h-datagrid
      :columns="columns"
      hasPage
      :url="datagridUrl"
      :has-select="false"
      :row-select="true"
      :autoLoad="false"
      ref="datagrid">
      <div slot="toolbar" class="pull-left">
        <h-button type="primary" @click="handleAttachAddForm()" :disabled="hasCommitDisabled">{{$t('m.i.common.add')}}
        </h-button>
        <h-button type="primary" @click="handleAttachDelForm()" :disabled="hasCommitDisabled">
          {{$t('m.i.common.delete')}}
        </h-button>
      </div>
    </h-datagrid>
    <!-- 弹出框模式底部按钮 -->
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
    </div>
  </h-msg-box>

  <!-- 文件导入弹出框-->
  <h-msg-box :title="title" v-model="importWin" :mask-closable="false" class="h-form-search-layer" height="150"
             :footerHide="true">
    <h-upload :action="imageUploadUrl"
              :format="['jpg','jpeg','png','gif','xls','xlsx','doc','docx','wps','ppt','pdf','zip','rar','txt']"
              :max-size="2048"
              :with-credentials="true"
              :on-exceeded-size="handleMaxSize"
              :on-format-error="handleFormatError"
              :on-progress="handleProgress"
              :on-success="uploadSuccess"
              :on-error="uploadError"
              :on-remove="handleRemove"
              @on-goto-add="uploadGotoAdd"
              ref="upload"
              selfConfig
              uploadAll
              :class="{'h-upload-goto-add': imgDataFirst}">
      <h-button type="primary" icon="ios-cloud-upload-outline" slot="chooseFile" v-if="fileSelect">{{$t("m.i.common.chooseImportFile")}}</h-button>
      <h-button type="primary" icon="ios-cloud-upload-outline" slot="postFile" v-if="!fileSelect" :disabled="isDisabled">{{tip}}</h-button>
    </h-upload>
  </h-msg-box>
  </div>
</template>

<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";

  export default {
    name: "uploadAttach",
    data() {
      return {
        columns : [
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
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.fileName'),
            key: "fileName",
            hiddenCol: false
          }
        ],
        datagridUrl : "/sm/msg/noticeattach/getNoticeAttachByNoticeId",
        ifShowMore : false,
        currentSelectRow : null,
        imageUploadUrl : window.LOCAL_CONFIG.API_HOME + "/sm/msg/noticeattach/uploadNoticeAttach",
        importWin : false,
        fileSelect : true,
        imgDataFirst : false,
        isDisabled : false,
        hasCommitDisabled : false,
        noCommitDisabled : false,
        tableRef : "selfTable",
      }
    },
    props: {
      uploadAttachWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      title: {
        type: String,
        default: "上传附件"
      },
      id:{
        type: "",
      },
    },
    comments: {},
    watch: {
      uploadAttachWin(val) {
        if (val === true) {
          this.datagridUrl = "sm/msg/noticeattach/func_getNoticeAttachByNoticeId?id="+this.id;
          this.imageUploadUrl =window.LOCAL_CONFIG.API_HOME + "/sm/msg/noticeattach/func_uploadNoticeAttach?id="+this.id;
          this.isDisabled = false;
          this.$nextTick(()=>{
            this.$refs.datagrid.dataChange(1);
          })

        }
      },
      imgDataFirst(val) {
        this.fileSelect = !this.fileSelect;
      }
    },

    computed: {
      tempUploadAttachWin: {
        get() {
          return this.uploadAttachWin;
        },
        set() {
        }
      },
      tip() {
        return this.isDisabled ? "文件正在上传中..." : "提交";
      }
    },
    methods: {
      handleAttachAddForm(){
        this.imgDataFirst = false;
        this.importWin = true;
        this.$nextTick(() => {
          this.$refs.upload.clearFiles();
        });
      },

      handleAttachDelForm(){
        let list = this.$refs.datagrid.selects;
        if(list != null && list.length>0){
          this.$hMsgBox.confirm({
            title: this.$t('m.i.common.confirm'),
            content: this.$t('m.i.common.isConfirmDelete') + '?',
            onOk: () => {
              this.handleAttachDel();

            }
          })
        }else{
          this.$msgTip.info(this,{info:this.$t('m.i.common.chooseOneData')});
        }

      },
      // 附件选中记录删除
      handleAttachDel() {
        let list = this.$refs.datagrid.selects;
        let ids = "";
        for (var i =0 ,count = list.length;i<count;i++){
          ids += list[i].id;
          if (i < list.length - 1) {
            ids += ",";
          }
        }
        post({ids:ids},'sm/msg/noticeattach/func_deleteNoticeAttach').then(res => {
          if(res){
            let retCode = res.data.retCode
            if(retCode=="000000"){
              this.$msgTip.success(this)
              this.$refs.datagrid.dataChange(1);
              this.currentSelectRow = [];
              this.$refs.datagrid.selects=[];
            }else{
              this.$msgTip.error(this,{info:this.$t('m.i.common.deleteFailed')+res.data.retMsg})
              this.$refs.datagrid.dataChange(1);
            }
          }else{
            this.$msgTip.error(this,{info:this.$t('m.i.common.netError')})
          }
        });
      },
      handleClose() {
        this.currentSelectRow = [];
        this.$refs.datagrid.selects = [];
        this.$emit("uploadAttachClose", "");
      },
      handleProgress() {
        this.$msgTip.info(this, { info: "文件正在上传中..." });
        this.isDisabled = true;
      },
      uploadSuccess(response, file) {
        let retCode = response.retCode;
        if (retCode === "000000") {
          this.$msgTip.success(this, { info: file.name + "上传成功" });
          this.importWin = false;
          this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
        } else {
          this.imgDataFirst = false;
          this.$refs.upload.clearFiles();
          this.$msgTip.error(this, { info: "文件上传失败:" + response.retMsg });
        }
        this.isDisabled = false;
      },
      uploadError(error,file) {
        this.$msgTip.error(this, { info: file.name + "上传失败" });
        this.imgDataFirst = false;
        this.isDisabled = false;
      },
      handleRemove(file) {
        this.$msgTip.success(this, { info: file.name + "已移除"});
        this.imgDataFirst = false;
        this.isDisabled = false;
      },
      //文件列表加入第一条数据时返回true，非第一条数据则不触发事件
      uploadGotoAdd(status) {
        this.imgDataFirst = status;
      },
      handleMaxSize (file) {
        this.$msgTip.error(
          this, { info: "文件 " + file.name + " 太大，不能超过2M" })
      },
      handleFormatError(file) {
        this.$msgTip.error(this,{info:"文件 " + file.name + " 格式不正确，请上传jpg,jpeg,png,gif,xls,xlsx,doc,docx,wps,ppt,pdf,zip,rar,txt格式的文件"});
      },

    }
  };
</script>


<style type="text/css" scoped>
  .h-upload-goto-add.h-upload {
    position: relative;
    padding-bottom: 50px;
  }

  .h-upload-goto-add .h-upload-self {
    position: absolute;
    bottom: 0;
    right: 0;
  }
</style>
