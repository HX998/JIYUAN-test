<template>
  <div>
    <h-msg-box v-model="tempShowFileWin" maximize width="1000" :mask-closable="false" @on-close="handleClose" top="10"
               @on-maximize="onMaximize" class="h-form-table-layer">
      <p slot="header">
        <span>{{$t("m.i.common.fileManage")}}</span>
      </p>
      <!-- 查询表单 -->
      <div :class="{'h-form-overhd':!ifShowMore}">
        <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
          <common-select v-model="formItem.fileType" :label="$t('m.i.be.fileType')" prop="fileType"
                         :dictList="fileBatchParams.attTypeCodeList"></common-select>
          <common-select v-model="formItem.applStatus" :label="$t('m.i.be.applStatus')" prop="applStatus"
                         :dictList="fileBatchParams.fileDetailStatusList"></common-select>
          <query-btn :advanceShow="false" @showChange="showChange" :formSearch="handleSearch"
                     :formSearchReset="resetSearch" formClassAdd="2"></query-btn>
        </h-form>
      </div>
      <!-- 数据展示表格 -->
      <h-datagrid
          :columns="columns"
          highlightRow
          :url= "fileDataGridUrl"
          :bindForm="formItem"
          :autoLoad="false"
          :hasSelect="false"
          rowSelect
          ref="datagrid">
        <div slot="toolbar" class="pull-left">
          <h-button type="primary" @click="addAttach" v-if="operType === 'upload' && fileBatchParams.isShowOperBotton==='1'">{{$t("m.i.common.addAttach")}}</h-button>
          <h-button type="primary" @click="uploadAttach" v-if="operType === 'upload'">{{$t("m.i.common.uploadAttach")}}</h-button>
          <h-button type="primary" @click="deleteAttach" v-if="operType === 'upload' && fileBatchParams.isShowOperBotton==='1'">{{$t("m.i.common.deleteAttach")}}</h-button>
        </div>
      </h-datagrid>
      <div slot="footer">
       <!-- <h-button type="ghost" @click="handleClose()">{{$t("m.i.common.close")}}</h-button>-->
      </div>
    </h-msg-box>
    <!-- 添加附件 -->
    <common-file-upload-no-show :import-win="importWin" :fileParams="fileParams" @importWinClose="importWinClose"
                                @importSuccess="importSuccess" title="附件加载" :height="270">
      <h-form :model="importForm" :label-width="90" ref="importForm" cols="1" class="h-form-search" onlyBlurRequire>
        <common-select v-model="importForm.fileType" :label="$t('m.i.be.fileType')" prop="fileType"
                       :dictList="fileBatchParams.attTypeCodeList"  :required="true"></common-select>
      </h-form>

    </common-file-upload-no-show>
  </div>
</template>

<script>
  import { post, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "showFileWin",
    components: {
    },
    data(){
      return {
        formItem: {
          busiId: "",
          fileType:"",
          applStatus:"",
          busiNo:"",
          attachBusiType:""
        },
        importForm:{
          fileType:""
        },
        columns: [
          {
            type: "selection",
            width: 50,
            align: "center",
            hiddenCol: false
          },
          {
            type: "index",
            key: "numOrder",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.be.fileBatchNo"),
            key: "fileBatchNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.be.fileName"),
            key: "fileName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.fileType'),
            key: "fileType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "AttTypeCode", params.row.fileType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.applStatus'),
            key: "applStatus",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "FileDetailStatus", params.row.applStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.preRelationFlag'),
            key: "preRelationFlag",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "PreRelationFlag", params.row.preRelationFlag);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.be.attachment"),
            key: "attachment",
            hiddenCol: false,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.downLoadFile(params.row.id);
                  }
                }
              }, this.$t("m.i.common.downloadAttach"));
            }
          },
          {
            title: this.$t("m.i.common.dealPrcMsg"),
            key: "dealPrcMsg",
            hiddenCol: false,
          },
        ],
        ifShowMore: false,
        attTypeCodeList: [],
        fileDetailStatusList: [],
        importWin:false,
        suffixStr:"jpg,JPG,jpeg,JPEG,png,PNG,gif,GIF,bmp,BMP,xls,XLS,xlsx,XLSX,et,ET,doc,DOC,docx,DOCX,WPS,wps,ppt,PPT,pps,PPS,dps,DPS,pdf,PDF,zip,rar,ZIP,RAR",
        fileParams: {
          fileUploadUrl: window.LOCAL_CONFIG.API_HOME + this.filePathUrl + "func_addFile",
          uploadParams: {//
            busiId: "",
            // sourceType:"DBL",
            suffixStr:[],
            busiNo: "",
            attachBusiType: "",
            maxSize:this.fileMaxSize
          }
        },
        fileDataGridUrl: "",
        fileMaxSize: 1.5*1024,
        operType:""
      }
    },
    props: {
      showFileWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      dictMap: { //CorpScale,Industry,partnerType,Yon
        type: Map
      },
      fileBatchParams: {
        type: Object,
        default() {
          return {
            busiId: "",
            busiNo: "",
            attachBusiType: "",
            operType: {
              //show-仅查询 upload-上传
              type: String,
              default() {
                return "show";
              }
            },
            isShowOperBotton:"",
            // 附件类型
            fileType: "",
            // 文件扩展名
            fileSuffix: "",
            // 附件类型集合
            attTypeCodeList: "",
            // 附件最大容量
            fileMaxSize: this.fileMaxSize
          };
        }
      },
      filePathUrl: {
        required: true
      }
    },
    methods:{
      handleClose(){
        this.resetSearch();
        this.fileBatchParams = {};
        this.filePathUrl = "";
        this.$emit("showFileWinClose", "");
      },
      onMaximize() {
        setTimeout(() => {
          this.$refs.datagrid.$refs.gridContent.handleResize();
        }, 100);
      },
      showChange(val) {
        this.ifShowMore = val;
      },
      //查询
      handleSearch(pageNo) {
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.selects = [];
        // this.formItem.batchId = this.batchId;
        this.$refs.datagrid.dataChange(!!pageNo ? pageNo : 1);
      },
      //重置表单查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
      },
      //下载附件
      downLoadFile(fileId) {
        post({id: fileId }, this.filePathUrl + "func_downLoadFile").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let fileDetailDto = res.data.retData;
              if (fileDetailDto.erroMsg){
                this.handleSearch(this.$refs.datagrid.pageInfo.pageNo);
                this.$msgTip.info(this, { info: fileDetailDto.erroMsg });
              }else{
                this.$http({
                  url:window.LOCAL_CONFIG.API_HOME + this.filePathUrl + "func_createFile",
                  method:'post',
                  params:{
                    attachId:fileDetailDto.attachId
                  },
                  responseType:'arraybuffer' //此处注意请求头
                }).then(function(res){
                  let isIE = navigator.userAgent.indexOf("MSIE") >= 0 || navigator.userAgent.indexOf("Trident") >= 0;
                  if(isIE) {
                    navigator.msSaveOrOpenBlob(new Blob([res.data]),fileDetailDto.fileName+"."+fileDetailDto.fileSuffix);
                    return;
                  }
                  let url = window.URL.createObjectURL(new Blob([res.data])); //创建下载链接
                  let link = document.createElement('a'); //创建a标签
                  link.style.display = 'none';  //将a标签隐藏
                  link.href = url;  //给a标签添加下载链接
                  link.setAttribute('download', fileDetailDto.fileName+"."+fileDetailDto.fileSuffix); // 此处注意，要给a标签添加一个download属性，属性值就是文件名称 否则下载出来的文件是没有属性的，空白白
                  document.body.appendChild(link);
                  link.click()  //执行a标签
                  document.body.removeChild(link);
                })
              }
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //附件新增
      addAttach(){
        this.fileParams.fileUploadUrl = window.LOCAL_CONFIG.API_HOME + this.filePathUrl + "func_addFile";
        this.fileParams.uploadParams.attachBusiType = this.fileBatchParams.attachBusiType;
        // this.fileParams.uploadParams.suffixStr = this.fileBatchParams.fileSuffix.split(",");
        if (this.fileBatchParams.busiId){
          this.fileParams.uploadParams.busiId = this.fileBatchParams.busiId;
        }
        if (this.fileBatchParams.busiType){
          this.fileParams.uploadParams.busiType = this.fileBatchParams.busiType;
        }
        if (this.fileBatchParams.busiNo){
          this.fileParams.uploadParams.busiNo = this.fileBatchParams.busiNo;
        }
        if (this.fileBatchParams.maxSize){
          this.fileParams.uploadParams.maxSize = this.fileBatchParams.maxSize;
        }
        this.importWin = true;
      },
      importSuccess() {
        // this.fileParams.uploadParams.batchId = "";
        this.fileParams.uploadParams.suffixStr=[];
        this.importForm.fileType = "";
        this.importWin = false;
        this.handleSearch();
      },
      importWinClose() {
        // this.fileParams.uploadParams.batchId = "";
        this.fileParams.uploadParams.suffixStr=[];
        this.importForm.fileType = "";
        this.importWin = false;
      },
      //上传附件
      uploadAttach(){
          let list = this.$refs.datagrid.selectIds;
          if (list.length === 0) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
            return;
          }
          if(list.length > 1){
            this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
            return;
          }
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: "确认要上传附件吗?",
            onOk: () => {
              let params = {id: list[0],busiId:this.formItem.busiId};
              let url = this.filePathUrl + "func_uploadFile";
              this.sendPost(params, url, res=>{
                this.handleSearch(this.$refs.datagrid.pageInfo.pageNo);
              });
            }
          });
      },
      //删除附件
      deleteAttach(){
          let list = this.$refs.datagrid.selectIds;
          if (list.length === 0) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
            return;
          }
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: "确认要删除附件吗?",
            onOk: () => {
              let params = { ids: list,busiId:this.formItem.busiId};
              let url = this.filePathUrl + "func_deleteFile";
              this.sendPost(params, url, res=>{
                this.handleSearch();
              });
            }
          });
      },
      //恢复预删除
      replyDel(){
        // if (this.batchId) {
        //   let list = this.$refs.datagrid.selectIds;
        //   if (list.length === 0) {
        //     this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
        //     return;
        //   }
        //   this.$hMsgBox.confirm({
        //     title: this.$t("m.i.common.confirm"),
        //     content: "确认要恢复预删除吗?",
        //     onOk: () => {
        //       let params = { batchId: this.batchId, fileIds: list,sourceType:this.sourceType };
        //       let url = this.filePathUrl + "func_restoreFile";
        //       this.sendPost(params, url, res=>{
        //         this.handleSearch();
        //       });
        //     }
        //   });
        // } else {
        //   this.$msgTip.error(this, { info: "请先保存批次" });
        // }
      },
      download (data,fileName) {
        if (!data) {
          return
        }

      },
      sendPost(params, url, callback) {
        post(params, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              if(res.data.retData.erroMsg){
                this.$msgTip.error(this, { info: res.data.retData.erroMsg });
              }else{
                this.$msgTip.success(this);
              }
              this.handleSearch(this.$refs.datagrid.pageInfo.pageNo);
              callback();
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
    },
    watch: {
      showFileWin(val){
        if(val){
          this.formItem.busiId = this.fileBatchParams.busiId?this.fileBatchParams.busiId:"";
          this.formItem.busiNo = this.fileBatchParams.busiNo?this.fileBatchParams.busiNo:"";
          this.formItem.busiType = this.fileBatchParams.busiType?this.fileBatchParams.busiType:"";
          this.fileBatchParams.isShowOperBotton = this.fileBatchParams.isShowOperBotton?this.fileBatchParams.isShowOperBotton:"1";

          this.formItem.attachBusiType = this.fileBatchParams.attachBusiType;
          this.fileDataGridUrl = this.filePathUrl + "func_queryFileDetailPage";
          this.operType = this.fileBatchParams.operType;
          if(this.fileBatchParams.fileSuffix !== null && this.fileBatchParams.fileSuffix !==""){
            this.suffixStr = this.fileBatchParams.fileSuffix;
          }
          if (this.fileBatchParams.fileMaxSize !== null){
            this.fileMaxSize = this.fileBatchParams.fileMaxSize;
          }
          if (this.fileBatchParams.attTypeCodeList !== null && this.fileBatchParams.attTypeCodeList.length>0){
            this.attTypeCodeList = this.fileBatchParams.attTypeCodeList;
          }
          if (this.fileBatchParams.fileDetailStatusList !== null && this.fileBatchParams.fileDetailStatusList.length > 0) {
            this.fileDetailStatusList = this.fileBatchParams.fileDetailStatusList;
          }
          this.$nextTick(() => {
            this.handleSearch();
            // this.$refs.datagrid.dataChange(1);
          });
        }
      }
    },
    computed: {
      tempShowFileWin: {
        get() {
          return this.showFileWin;
        },
        set() {
        }
      }
    }
  };
</script>

<style scoped>

</style>
