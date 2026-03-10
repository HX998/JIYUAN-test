<template>
  <div>
    <h-msg-box v-model="tempShowFileWin" maximize width="1000" :mask-closable="false" @on-close="handleClose" top="10"
               @on-maximize="onMaximize" class="h-form-table-layer">
      <p slot="header">
        <span>附件信息</span>
      </p>
      <!-- 查询表单 -->
      <div :class="{'h-form-overhd':!ifShowMore}">
        <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
          <common-select v-model="formItem.fileType" :label="$t('m.i.be.fileType')" prop="fileType"
                         :dictList="orderFileTypeList"></common-select>
          <common-select v-model="formItem.applStatus" :label="$t('m.i.be.applStatus')" prop="applStatus"
                         :dictList="fileApplStatusList"></common-select>
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
        :onSelectChange="handleSelectChange"
        rowSelect
        ref="datagrid">
        <div slot="toolbar" class="pull-left">
          <h-button type="primary" @click="addAttach">{{$t("m.i.common.addAttach")}}</h-button>
          <h-button type="primary" @click="uploadAttach">{{$t("m.i.common.uploadAttach")}}</h-button>
          <h-button type="primary" @click="deleteAttach">{{$t("m.i.common.deleteAttach")}}</h-button>
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
                       :dictList="orderFileTypeList"  :required="true"></common-select>
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
          appOrderId: "",
          fileType:"",
          applStatus:"",
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
              let dictValue = this.getDictValueFromMap(this.dictMap, "OrderFileType", params.row.fileType);
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
              let dictValue = this.getDictValueFromMap(this.dictMap, "FileApplStatus", params.row.applStatus);
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
                    this.downLoadFile(params.row.attachId,params.row.fileName,params.row.fileSuffix);
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
        orderFileTypeList: [],
        fileApplStatusList: [],
        preRelationFlagList: [],
        importWin:false,
        suffixStr:"jpg,JPG,jpeg,JPEG,png,PNG,gif,GIF,bmp,BMP,xls,XLS,xlsx,XLSX,et,ET,doc,DOC,docx,DOCX,WPS,wps,ppt,PPT,pps,PPS,dps,DPS,pdf,PDF,zip,rar,ZIP,RAR,pptx,PPTX",
        fileParams: {
          fileUploadUrl: window.LOCAL_CONFIG.API_HOME + this.filePathUrl,
          uploadParams: {
            appOrderId: "",
            suffixStr:[],
            fileType: "",
            maxSize:3*1024,
          }
        },
        fileDataGridUrl: "",
        fileMaxSize: 2*1024,
        selectList: [],
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
            appOrderId: "",
            // 附件类型
            fileType: "",
            // 文件扩展名
            fileSuffix: "",
            // 附件类型集合
            //attTypeCodeList: "",
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
        //this.fileBatchParams = {};
        //this.filePathUrl = "";
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
      handleSelectChange(selection) {
        this.selectList = selection;
        //console.log(this.selectList)
      },
      //查询
      handleSearch(pageNo) {
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.dataChange(!!pageNo ? pageNo : 1);
      },
      //重置表单查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
      },
      //下载附件
      downLoadFile(fileId,fileName,fileSuffix) {
        this.$http({
          url:window.LOCAL_CONFIG.API_HOME + this.filePathUrl + "createFile",
          method:'post',
          params:{
            attachId:fileId
          },
          responseType:'arraybuffer' //此处注意请求头
        }).then(function(res){
          let isIE = navigator.userAgent.indexOf("MSIE") >= 0 || navigator.userAgent.indexOf("Trident") >= 0;
          if(isIE) {
            navigator.msSaveOrOpenBlob(new Blob([res.data]),fileName+"."+fileSuffix);
            return;
          }
          let url = window.URL.createObjectURL(new Blob([res.data])); //创建下载链接
          let link = document.createElement('a'); //创建a标签
          link.style.display = 'none';  //将a标签隐藏
          link.href = url;  //给a标签添加下载链接
          link.setAttribute('download', fileName+"."+fileSuffix); // 此处注意，要给a标签添加一个download属性，属性值就是文件名称 否则下载出来的文件是没有属性的，空白白
          document.body.appendChild(link);
          link.click();  //执行a标签
          document.body.removeChild(link);
        })
      },
      //附件新增
      addAttach(){
        this.fileParams.fileUploadUrl = window.LOCAL_CONFIG.API_HOME + this.filePathUrl + "addAppendFile";
        if (this.fileBatchParams.appOrderId){
          this.fileParams.uploadParams.appOrderId = this.fileBatchParams.appOrderId;
        }
        this.fileParams.uploadParams.maxSize = this.fileMaxSize;

        this.importWin = true;
      },
      importSuccess() {
        this.fileParams.uploadParams.suffixStr=[];
        this.importForm.fileType = "";
        this.importWin = false;
        this.handleSearch();
      },
      importWinClose() {
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
            let params = {id: list[0]};
            let url = this.filePathUrl + "uploadFile";
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
        let idList=[]
        if(this.selectList.length > 0) {
          this.selectList.forEach(item=>{
            idList.push(item.busiId)
          })
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确认要删除附件吗?",
          onOk: () => {
            let params = { ids: idList};
            let url = this.filePathUrl + "deleteFile";
            this.sendPost(params, url, res=>{
              this.handleSearch();
            });
          }
        });
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
              if(res.data.retMsg){
                this.$msgTip.error(this, { info: res.data.retMsg });
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
          this.formItem.appOrderId = this.fileBatchParams.appOrderId?this.fileBatchParams.appOrderId:"";
          this.fileDataGridUrl = this.filePathUrl + "pageFile";

          if(this.dictMap) {
            this.orderFileTypeList= this.dictMap.orderFileTypeList
            this.fileApplStatusList= this.dictMap.fileApplStatusList.filter(item=> {
              return item.key== 'FD00' || item.key=='FD01' || item.key=='FD02'||item.key=='FD06'
            })
            this.preRelationFlagList= this.dictMap.preRelationFlagList
          }
          this.$nextTick(() => {
            this.handleSearch();
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
