<template>
  <div>
    <!--影像加载弹出框-->
    <h-msg-box v-model="tempImageWin" width="1000" :mask-closable="false" @on-close="handleClose" top="10"
               class="h-form-search-layer" :maximize="true" :z-index="1002">
      <p slot="header">
        <span>{{title}}</span>
      </p>
      <!--查询表单-->
      <div>
        <h-form :model="formItem" :label-width="115" ref="formItem" cols="4" class="h-form-search">
          <h-form-item :label="$t('m.i.common.imgType')" prop="imgType">
            <h-select v-model="formItem.imgType" readonly placeholder="">
              <h-option value="IM12">再贴现资料</h-option>
            </h-select>
          </h-form-item>
          <h-form-item class="h-form-operate one-form">
            <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
          </h-form-item>
        </h-form>
      </div>
      <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            hasPage
            url="/be/market/rediscount/redSaleApplyMain/func_queryRedSaleBillImage"
            :bindForm="formItem"
            :hasSelect="hasSelect"
            :autoLoad=false
            rowSelect
            ref="datagrid">
            <div slot="toolbar" class='pull-left'>
              <h-button type="primary" @click="imageAddClick()" v-if="authObj.imageAdd">{{$t("m.i.common.imageAdd")}}
              </h-button>
              <h-button type="primary" @click="imageOperateClick('register')" v-if="authObj.imageRegister">
                {{$t("m.i.common.register")}}
              </h-button>
              <h-button type="primary" @click="imageOperateClick('delete')" v-if="authObj.imageDelete">
                {{$t("m.i.common.delete")}}
              </h-button>
            </div>
          </h-datagrid>
      <!-- 弹出框模式底部按钮 -->
      <div slot="footer">
        <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
      </div>
    </h-msg-box>
    <!-- 影像文件导入弹出框-->
    <h-msg-box :title="title" v-model="importWin" :mask-closable="false" class="h-form-search-layer" height="150"
               :footerHide="true" :z-index="1004">
      <h-upload :action="imageUploadUrl"
                :data="formItem"
                :format="['jpg']"
                :max-size="512"
                :on-exceeded-size="handleMaxSize"
                :with-credentials="true"
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
        <h-button type="primary" icon="ios-cloud-upload-outline" slot="chooseFile" v-if="importSelect">{{$t("m.i.common.chooseImportFile")}}</h-button>
        <h-button type="primary" icon="ios-cloud-upload-outline" slot="postFile" v-if="!importSelect"
                  :disabled="isDisabled">{{tip}}
        </h-button>
      </h-upload>
    </h-msg-box>
    <!-- 查看影像弹出框-->
    <h-msg-box title="影像查看" v-model="showImgWin" width="1000" :mask-closable="false" :footerHide="true"
               class="h-form-search-layer" top="10" :maximize="true" @on-close="showImageClose" :z-index="2010">
      <img :src="this.imgUrl" width="100%" height="600"/>
    </h-msg-box>
  </div>
</template>

<script>
  import { post, on, off, getDictListByGroups,getDictValueFromMap } from "@/api/bizApi/commonUtil";

  export default {
    name: "uploadImage",
    data() {
      return {
        formItem : {
          busiBatchId: "",
          listId: "",
          uploadStatus: "",
          imgType: "IM12"
        },

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
            title: "id",
            key: "id",
            hiddenCol: true
          },
          {
            title: this.$t("m.i.billInfo.billPackageNo"),
            key: "billNo",
            hiddenCol: false,
            ellipsis: false,
            sortable: true,
          },
          {
            title: this.$t("m.i.common.imgBatchNo"),
            key: "imgBatchNo",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("m.i.common.imgType"),
            key: "imgType",
            hiddenCol: false,
            ellipsis: false,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap, "ImgType", params.row.imgType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.be.uploadStatus'),
            key: "applStatus",
            hiddenCol: false,
            ellipsis: false,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap, "ImgStatus", params.row.applStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.common.dealPrcMsg'),
            key: "dealPrcMsg",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("m.i.common.showImg"),
            key: "showImg",
            hiddenCol: false,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showImage(params.row.id);
                  }
                }
              }, this.$t('m.i.common.view'));
            }
          }
        ],
        dictMap : null,
        imgTypeList : [],
        uploadStatusList : [],
        importWin : false,
        imageUploadUrl : window.LOCAL_CONFIG.API_HOME + "/be/market/rediscount/redSaleApplyMain/func_loadImgFile",
        importSelect : true,
        imgDataFirst : false,
        isDisabled : false,
        showImgWin : false,
        hasSelect : false,
        imgUrl : ""
      }
    },
    props: {
      authObj: {
        type: Object,
        default() {
          return {
            imageAdd: true,           //影像新增
            imageRegister: true,      //上传
            imageDelete: true         //删除
          };
        }
      },
      imageWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      title: {
        type: String,
        default: "影像信息"
      },
      imageParams: {
        type: Object,
        default() {
          return {
            busiBatchId: "",
            type: "",
            listId: ""
          };
        }
      }
    },
    computed: {
      tempImageWin: {
        get() {
          return this.imageWin;
        },
        set() {
        }
      },
      tip() {
        return this.isDisabled ? "文件正在上传中..." : "提交";
      }
    } ,
    comments: {},
    watch: {
      imageWin(val) {
        if (val === true) {
          this.$nextTick(() => {
            this.hasSelect = false;
            this.$refs.formItem.resetFields();
            this.formItem.busiBatchId = this.imageParams.busiBatchId;
            this.formItem.listId = this.imageParams.listId;
            if(this.imageParams.type === 'view'){
              this.authObj.imageAdd = false;
              this.authObj.imageRegister = false;
              this.authObj.imageDelete = false;
            }else{
              this.authObj.imageAdd = true;
              this.authObj.imageRegister = true;
              this.authObj.imageDelete = true;
            }
            this.formSearch();
            this.isDisabled = false;
          });
        }
      },
      imgDataFirst(val) {
        this.importSelect = !this.importSelect;
      }
    },

    methods: {
      //查看影像关闭
      showImageClose() {
        this.showImgWin = false;
        this.imgUrl = "";
      },
      formSearch() {
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
      },
      //影像新增
      imageAddClick() {
        if (this.formItem.imgType !== "") {
          this.imgDataFirst = false;
          this.importWin = true;
          this.$nextTick(() => {
            this.$refs.upload.clearFiles();
          });
        } else {
          this.$msgTip.info(this, { info: "请先选择影像类型" });
        }
      },
      //影像上传/删除
      imageOperateClick(str) {
        let list = this.$refs.datagrid.selects;
        if (list != null && list.length > 0) {
          let url = str === "register" ? "/be/market/rediscount/redSaleApplyMain/func_registerImgInfo" : "/be/market/rediscount/redSaleApplyMain/func_delImgInfo";
          let title = str === "register" ? "上传影像信息" : "删除影像信息";
          let content = str === "register" ? "确定要上传吗?" : "确定要删除吗?";
          this.$hMsgBox.confirm({
            title: title,
            content: content,
            zIndex:1008,
            onOk: () => {
              this.handleOperate(url);
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      handleOperate(url) {
        let list = this.$refs.datagrid.selects;
        this.hasSelect = true;
        let ids = this.formateListData(list);
        post({ code: ids }, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
            this.hasSelect = false;
            this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      formateListData(list){
        let ids = [];
        for(let i=0,len=list.length;i<len;i++){
          ids.push(list[i].id);
        }
        return ids.join(",");
      },
      handleClose() {
        this.hasSelect = true;
        this.$emit("imageWinClose", "");
      },
      handleFormatError(file) {
        this.$msgTip.error(this, { info: "文件 " + file.name + " 格式不正确，请上传jpg格式的图片" });
      },
      handleProgress() {
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
      },
      handleRemove(file) {
        this.$msgTip.success(this, { info: file.name + "已移除"});
        this.imgDataFirst = false;
      },
      //文件列表加入第一条数据时返回true，非第一条数据则不触发事件
      uploadGotoAdd(status) {
        this.imgDataFirst = status;
      },
      //查看影像
      showImage(id) {
        this.imgUrl = window.LOCAL_CONFIG.API_HOME + "/be/market/rediscount/redSaleApplyMain/func_showImg?id=" + id;
        setTimeout(() => {
          this.showImgWin = true;
        }, 100)
      },
      //影像太大
      handleMaxSize(file) {
        this.$msgTip.error(this,{info:"影像文件 " + file.name + " 大于512K"});
      },
    },
    mounted() {
      getDictListByGroups("ImgType,ImgStatus").then(res => {
        this.imgTypeList = res.get("ImgType");
        this.uploadStatusList = res.get("ImgStatus");
        this.dictMap = res.get("map");
      });
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
