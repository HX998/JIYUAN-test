<!--信息披露管理-信息披露-新增、修改、查看弹出框-->
<template>
  <div>
    <h-msg-box v-model="tempStdPublishAddOrEditWin" :maximize="true" :mask-closable="false" @on-close="handleClose"
               width="1000" class="h-form-search-layer"  >
      <p slot="header">
        <span v-if="batchParams.batchType==='add'">信息披露新增</span>
        <span v-else-if="batchParams.batchType==='modify'">信息披露修改</span>
        <span v-else-if="batchParams.batchType==='show'">信息披露查看</span>
      </p>
      <div>
        <h-form :model="addOrEditForm" :label-width="115" ref="addOrEditForm" cols="3" class="h-form-search">
          <std-publish-form-item :addForm="addOrEditForm" :batchParams="batchParams"></std-publish-form-item>
        </h-form>
      </div>
      <div></div>
      <div slot="footer"  >
        <h-button v-if="batchParams.batchType!=='show'" type="primary" @click="formSave()"  >{{$t('m.i.common.save')}}</h-button>
        <h-button type="primary" @click="downLoadFile()" >{{$t('m.i.common.download')}}</h-button>
      </div>
    </h-msg-box>
  </div>
</template>

<script>
  import { post } from "@/api/bizApi/commonUtil";
    export default {
        name: "stdPublishAdd",
      components: {
        StdPublishFormItem: () => import(/* webpackChunkName: "bs/corpstdbill/publish/stdPublishFormItem" */"@/views/bizViews/bs/corpstdbill/publish/stdPublishFormItem")
      },
      data() {
        return {
          batchId: "",
          addOrEditForm: {
            id:"",
            legalNo:"",
            memberId:"",
            memberName:"",
            bankNo:"",
            brchCode:"",
            brchNo:"",
            listId:"",
            prodNo:"",
            batchNo:"",
            publishStatus:"",
            baseAssetType:"",
            stdProductName:"",
            stdProductShortName:"",
            stdProductNo:"",
            publishDt:"",
            publishType:"",
            publishMode:"",
            isUpload:"",
            localFilePath:"",
            remoteFilePath:"",
            fileName:""
          }
        };
      },
      props: {
        stdPublishAddOrEditWin: {
          type: Boolean,
          default() {
            return false;
          }
        },
        batchParams: {
          type: Object,
          default() {
            return false;
          }
        }
      },
      computed: {
        tempStdPublishAddOrEditWin: {
          get() {
            return this.stdPublishAddOrEditWin;
          },
          set() {
          }
        }
      },
      watch: {
        stdPublishAddOrEditWin(val) {
          if (val) {
            this.$nextTick(() => {
              this.batchId = this.batchParams.batchId;
              if (this.batchParams.batchType === "add") {
                this.queryObjById();
              }
              if (this.batchParams.batchType === "modify" || this.batchParams.batchType === "show") {
                this.queryObjById();
              }
            });
          }
        },
        batchId(val) {
          this.batchId = val;
        }
      },
      methods: {
        //根据批次Id查询批次信息
        queryObjById() {
          let params = { id: this.batchId };
          let url = "/bs/corpstdbill/publish/stdPublishApply/func_jumpEditStdPublish";
          post(params, url).then(res => {
            if (res) {
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                let obj = res.data.retData;
                this.addOrEditForm.id = obj.id;
                this.addOrEditForm.legalNo = obj.legalNo;
                this.addOrEditForm.memberId = obj.memberId;
                this.addOrEditForm.memberName = obj.memberName;
                this.addOrEditForm.bankNo = obj.bankNo;
                this.addOrEditForm.brchCode = obj.brchCode;
                this.addOrEditForm.brchNo = obj.brchNo;
                this.addOrEditForm.listId = obj.listId;
                this.addOrEditForm.batchNo = obj.batchNo;
                this.addOrEditForm.publishStatus = obj.publishStatus;
                this.addOrEditForm.prodNo = obj.prodNo;
                this.addOrEditForm.baseAssetType = obj.baseAssetType;
                this.addOrEditForm.publishType = obj.publishType;
                this.addOrEditForm.publishMode = obj.publishMode;
                if (obj.stdProductName){
                  this.addOrEditForm.stdProductName = obj.stdProductName;
                }
                if (obj.stdProductShortName){
                  this.addOrEditForm.stdProductShortName = obj.stdProductShortName;
                }
                if (obj.stdProductNo){
                  this.addOrEditForm.stdProductNo = obj.stdProductNo;
                }
                this.addOrEditForm.publishDt = obj.publishDt=== null ? "" : obj.publishDt.toString();
                this.addOrEditForm.isUpload = obj.isUpload;
                this.addOrEditForm.localFilePath = obj.localFilePath=== null ? "" : obj.localFilePath.toString();
                this.addOrEditForm.remoteFilePath = obj.remoteFilePath=== null ? "" : obj.remoteFilePath.toString();
                this.addOrEditForm.fileName = obj.fileName=== null ? "" : obj.fileName.toString();
              } else {
                this.$msgTip.error(this, { info: res.data.retMsg });
              }
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            }
          });
        },
        //关闭弹窗
        handleClose() {
          this.$refs.addOrEditForm.resetFields();
          this.addOrEditForm.id = "";
          this.batchId="";
          this.$emit("stdPublishAddOrEditWinClose", "");
        },
        //模板下载
        templateDownload(){
          this.$refs["addOrEditForm"].validate(valid => {
            if (valid) {
              if(this.addOrEditForm.publishType === 'DT01' ||
                this.addOrEditForm.publishType === 'DT02' ||
                this.addOrEditForm.publishType === 'DT05' ||
                this.addOrEditForm.publishType === 'DT08' ||
                this.addOrEditForm.publishType === 'DT11' ||
                this.addOrEditForm.publishType === 'DT12' ||
                this.addOrEditForm.publishType === 'DT18'){
                  let url = window.LOCAL_CONFIG.API_HOME + "/bs/corpstdbill/publish/stdPublishApply/func_download";
                                        let form = document.createElement("form");
                                        form.setAttribute("id", "formId");
                                        form.setAttribute("action", url);
                                        form.setAttribute("method", "post");
                  let input=document.createElement('input');
                  input.setAttribute("name", "publishType");
                  input.setAttribute("value",this.addOrEditForm.publishType);
                  form.appendChild(input);
                  let input2=document.createElement('input');
                  input2.setAttribute("name", "listId");
                  input2.setAttribute("value",this.addOrEditForm.listId);
                  form.appendChild(input2);
                let input3=document.createElement('input');
                input3.setAttribute("name", "publishDt");
                input3.setAttribute("value",this.addOrEditForm.publishDt);
                form.appendChild(input3);
                                        document.body.appendChild(form);
                                        form.submit();
                                        document.body.removeChild(form);
              }else{
                this.$msgTip.error(this, { info: this.$t("m.i.bs.publishTypeError") });
              }
            }
          });
        },
        //下载附件
        downLoadFile() {
          post({publishType: this.addOrEditForm.publishType, listId: this.addOrEditForm.listId, publishDt: this.addOrEditForm.publishDt}, window.LOCAL_CONFIG.API_HOME + "/bs/corpstdbill/publish/stdPublishApply/func_download").then(res => {
            if (res) {
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                let resp = res.data.retData;
                if(resp.erroMsg){
                  this.$msgTip.info(this, { info: resp.erroMsg });
                }else{
                  let fileName = res.data.retData.fileName;
                  let filePath = res.data.retData.filePath;
                  this.$http({
                    url:window.LOCAL_CONFIG.API_HOME + "/bs/corpstdbill/publish/stdPublishApply/func_createFile",
                    method:'post',
                    params:{
                      fileName:fileName,
                      filePath:filePath
                    },
                    responseType:'arraybuffer' //此处注意请求头
                  }).then(function(res){
                    let isIE = navigator.userAgent.indexOf("MSIE") >= 0 || navigator.userAgent.indexOf("Trident") >= 0;
                    if(isIE) {
                      navigator.msSaveOrOpenBlob(new Blob([res.data]),fileName);
                      return;
                    }
                    let url = window.URL.createObjectURL(new Blob([res.data])); //创建下载链接
                    let link = document.createElement('a'); //创建a标签
                    link.style.display = 'none';  //将a标签隐藏
                    link.href = url;  //给a标签添加下载链接
                    link.setAttribute('download', fileName); // 此处注意，要给a标签添加一个download属性，属性值就是文件名称 否则下载出来的文件是没有属性的，空白白
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
        //保存批次信息
        formSave() {
          this.saveBatch();
        },
        saveBatch() {
          this.saveBatchFunc(res=>{
              this.$msgTip.success(this);
          });
        },
        saveBatchFunc(callback) {
          this.$refs["addOrEditForm"].validate(valid => {
            if (valid) {
              let publishDt=this.addOrEditForm.publishDt.replace(/-/g, "");//披露日期
              let url = "/bs/corpstdbill/publish/stdPublishApply/func_editStdPublish";
              post(this.addOrEditForm, url).then(res => {
                if (res) {
                  let msg = res.data.retMsg;
                  let retCode = res.data.retCode;
                  let retData=res.data.retData;
                  if (retCode === "000000") {
                    this.batchId=retData.id;
                    this.queryObjById();
                    callback();
                  } else {
                    this.$msgTip.error(this, { info: msg });
                  }
                } else {
                  this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
                }
              });
            }
          });
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
                callback();
              } else {
                this.$msgTip.error(this, { info: res.data.retMsg });
              }
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            }
          });
        },
      }
    };
</script>

<style scoped>

</style>
