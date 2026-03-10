<template>
  <!-- -->
  <h-msg-box v-model="tempShowUploadImageWin" :mask-closable="false" @on-close="handleClose"
             :maximize="true" width="1000" class="h-form-table-layer">
    <p slot="header">
      <span>影像信息查询</span>
    </p>
    <!-- 查询表单 -->
    <div>
      <h-form :model="formItem" :label-width="100" ref="formItem" cols="4" class="h-form-search">
        <h-form-item :label="$t('m.i.common.imgType')" prop="imgType">
          <h-select v-model="formItem.imgType">
            <!--<h-option v-for="item in imgTypeList" :value="item.key" :key="item.key">{{item.value }}</h-option>-->
            <h-option value="IM03" v-if="operType==='add' || operType==='readonly'">贴现正面</h-option>
            <h-option value="IM04" v-if="operType==='add' || operType==='readonly'">贴现背面</h-option>
            <h-option value="IM05">贴现凭证</h-option>
            <h-option value="IM06">瑕疵证明</h-option>
            <h-option value="IM08" v-if="operType==='modify'">贴现影像补充登记</h-option>
          </h-select>
        </h-form-item>
        <h-form-item class="h-form-operate one-form">
          <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
          <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
        </h-form-item>
      </h-form>
    </div>
    <!--数据展示表格-->
    <h-datagrid
      :columns="showUploadImageColumns"
      :bindForm="formItem"
      :auto-load="false"
      url="/ce/disc/paper/register/discRegisterReCheckMain/func_pageQueryDiscRgstImg"
      :row-select="true"
      :has-select="false"
      ref="datagrid">
      <div slot="toolbar">
        <h-button type="primary" @click="openImgWin" v-if="operType !== 'readonly'">{{$t("m.i.common.imageAdd")}}</h-button>
        <h-button type="primary" @click="registerSubmit" v-if="operType==='add'">{{$t("m.i.common.register")}}</h-button>
        <h-button type="primary" @click="registerAgainSubmit" v-if="operType==='modify'">{{$t("m.i.ce.supplementRegister")}}</h-button>
        <h-button type="primary" @click="deleteDetailed" v-if="operType !== 'readonly'">{{$t("m.i.common.delete")}}</h-button>
      </div>
    </h-datagrid>
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
      <!--<h-button type="primary" @click="submitForm">{{$t("m.i.common.commit")}}</h-button>-->
    </div>
    <!-- 影像上传-->
    <common-upload-image :imageFormItem="this.imageFormItem" :upload-image-win="uploadImageWin"
                         :upload-url="this.uploadUrl" @uploadImageWinClose="uploadImageWinClose" :imageSize="512" :imageFormatType="['jpg','JPG']"></common-upload-image>
    <!-- 查看影像弹出框-->
    <h-msg-box :title="$t('m.i.common.showImg')" v-model="showImgWin" width="1000" :mask-closable="false" :footerHide="true" :z-index=1010
               class="h-form-search-layer" top="10" :maximize="true">
      <img :src="imgUrl" width="100%"/>
    </h-msg-box>
  </h-msg-box>

</template>

<script>
  import { post, on, off, getDictListByGroups, getDictValueFromMap } from "@/api/bizApi/commonUtil";

  export default {
    name: "showDiscUploadImage",
    components:{  },
    data() {
      return {
        formItem : {
          imgType:"",
          discIds:"",
        },
        imgTypeList : [],
        dictMap : new Map(),
        showUploadImageColumns : [],
        showImageColumns : [
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
            align: "center"
          },
          {
            title: 'id',
            key: "id",
            hiddenCol: true
          },
          {
            title: 'attachId',
            key: "attachId",
            hiddenCol: true
          },
          {
            title: this.$t("m.i.billInfo.billNo"),
            key: "billNo",
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t("m.i.common.imgBatchNo"),
            key: "imgBatchNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.imgType"),
            key: "imgType",
            hiddenCol: false,
            render: (h, params) => {
              return h("span", getDictValueFromMap(this.dictMap,"ImgType",params.row.imgType));
            }
          },
          {
            title: this.$t('m.i.common.status'),
            key: "imgStatus",
            hiddenCol: false,
            render: (h, params) => {
              return h("span", getDictValueFromMap(this.dictMap,"ImgStatus",params.row.imgStatus));
            }
          },
          {
            title: this.$t("m.i.common.failReason"),
            key: "errorMsg",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.showImg"),
            key: "status",
            hiddenCol: false,
            render: (h, params) => {
              return h('div', [
                h('a', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.showImage(params.row.attachId)
                    }
                  }
                }, '查看')
              ]);
            }
          },
        ],
        readImageColumns : [
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: 'id',
            key: "id",
            hiddenCol: true
          },
          {
            title: 'attachId',
            key: "attachId",
            hiddenCol: true
          },
          {
            title: this.$t("m.i.billInfo.billNo"),
            key: "billNo",
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t("m.i.common.imgBatchNo"),
            key: "imgBatchNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.imgType"),
            key: "imgType",
            hiddenCol: false,
            render: (h, params) => {
              return h("span", getDictValueFromMap(this.dictMap,"ImgType",params.row.imgType));
            }
          },
          {
            title: this.$t('m.i.common.status'),
            key: "imgStatus",
            hiddenCol: false,
            render: (h, params) => {
              return h("span", getDictValueFromMap(this.dictMap,"ImgStatus",params.row.imgStatus));
            }
          },
          {
             title: this.$t("m.i.common.failReason"),
            key: "errorMsg",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.showImg"),
            key: "status",
            hiddenCol: false,
            render: (h, params) => {
              return h('div', [
                h('a', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.showImage(params.row.attachId)
                    }
                  }
                }, '查看')
              ]);
            }
          },
        ],
        uploadImageWin : false,
        uploadUrl : window.LOCAL_CONFIG.API_HOME+"/ce/disc/paper/register/discRegisterReCheckMain/func_loadImgFileAndSave",
        imageFormItem : {
          discId: '',
          imgType:''
        },
        imgUrl : "",
        showImgWin : false,
      };
    },
    mounted() {
      getDictListByGroups("ImgType,ImgStatus").then(res => {
        this.imgTypeList = res.get("ImgType");
        this.dictMap = res.get("map");
      });
    },
    props: {
      showUploadImageWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      params: Object,
      operType:'',
    },
    watch: {
      showUploadImageWin(val) {
        if (val === true) {
          this.formItem.discId = this.params.discId;
          if(this.operType === "add" || this.operType === "modify"){
            this.showUploadImageColumns = this.showImageColumns;
          }
          if(this.operType === "readonly"){
            this.showUploadImageColumns = this.readImageColumns;
          }
          this.$nextTick(() => {
            this.formSearch();
          });
        }
      }
    },
    computed: {
      tempShowUploadImageWin: {
        get() {
          return this.showUploadImageWin;
        },
        set() {}
      },
    },
    methods: {
      //查询
      formSearch() {
        this.$refs.datagrid.dataChange(1);
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
      },
      //查询重置
      formSearchReset() {
        this.$refs.formItem.resetFields();
      },
      //查看影像
      showImage(attachId) {
        this.imgUrl = window.LOCAL_CONFIG.API_HOME + "/ce/disc/paper/register/discRegisterReCheckMain/func_showDiscImg?attachId=" + attachId;
        this.$loadingbox.open({
          title: "获取图像信息中，请稍后..."
        });
        setTimeout(() => {
          this.$loadingbox.close();
          this.showImgWin = true;
        },1000);
      },
      //影像维护
      openImgWin() {
        if(this.formItem.imgType === ''){
          this.$msgTip.info(this, { info: "请先选择影像类型！" });
          return;
        }
        this.imageFormItem = this.params;
        this.imageFormItem.imgType = this.formItem.imgType;
        this.uploadImageWin = true;
      },
      //影像维护关闭
      uploadImageWinClose() {
        this.uploadImageWin = false;
        this.formSearch();
      },
      //登记按钮
      registerSubmit(){
        let list = this.$refs.datagrid.selects;
        if (list.length === 0) {
          this.$msgTip.info(this,{info:this.$t("m.i.common.chooseAtLeastOneRecord")});
          return;
        }
        for(let i = 0 ; i < list.length ; i ++){
          if(list[i].imgStatus === 'BTL03' || list[i].imgStatus === 'BTL04'){
            this.$msgTip.info(this,{info:"当前票据影像上传中或上传成功，不允许再次登记"});
            return;
          }
        }
        let ids = "";
        let discIds = "";
        for (let i = 0, count = list.length; i < count; i++) {
          ids += list[i].id;
          discIds += list[i].discId;
          if (i < list.length - 1) {
            ids += ",";
            discIds += ",";
          }
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("m.i.common.isConfirmRegister"),
          onOk: () => {
            post({ ids:ids , discIds: discIds}, "/ce/disc/paper/register/discRegisterReCheckMain/func_sendAcptImgMsg").then(res => {
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.formSearch();
                } else {
                  this.$msgTip.error(this, { info: msg });
                  this.formSearch();
                }
              }
            }).catch(error => {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
            });
          }
        });
      },
      //补充登记
      registerAgainSubmit(){
        let list = this.$refs.datagrid.selects;
        if (list.length === 0) {
          this.$msgTip.info(this,{info:this.$t("m.i.common.chooseAtLeastOneRecord")});
          return;
        }
        for(let i = 0 ; i < list.length ; i ++){
          if(list[i].imgStatus === 'BTL03' || list[i].imgStatus === 'BTL04'){
            this.$msgTip.info(this,{info:"当前票据影像上传中或上传成功，不允许补充登记"});
            return;
          }
        }
        let ids = "";
        let discIds = "";
        for (let i = 0, count = list.length; i < count; i++) {
          ids += list[i].id;
          discIds += list[i].discId;
          if (i < list.length - 1) {
            ids += ",";
            discIds += ",";
          }
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定进行补充登记吗?",
          onOk: () => {
            post({ ids:ids , discIds: discIds}, "/ce/disc/paper/register/discRegisterReCheckMain/func_sendAcptImgMsg").then(res => {
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.formSearch();
                } else {
                  this.$msgTip.error(this, { info: msg });
                  this.formSearch();
                }
              }
            }).catch(error => {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
            });
          }
        });
      },
      //删除按钮
      deleteDetailed() {
        let list = this.$refs.datagrid.selects;
        if (list.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
          return;
        }
        let ids = "";
        let discIds = "";
        for (let i = 0, count = list.length; i < count; i++) {
          ids += list[i].id;
          discIds += list[i].discId;
          if (i < list.length - 1) {
            ids += ",";
            discIds += ",";
          }
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("m.i.common.isConfirmDelete") + "?",
          onOk: () => {
            post({ ids: ids,discIds : discIds }, "/ce/disc/paper/register/discRegisterReCheckMain/func_deleteAcptImg").then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this, { info: this.$t("m.i.common.deleteSuccess") });
                  this.formSearch();
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                  this.formSearch();
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      handleClose() {
        this.$refs.formItem.resetFields();
        this.$refs.datagrid.$refs.gridPage.clearElevator();
        this.$emit("uploadImageWinClose", "");
      }
    },
  };
</script>

<style scoped>

</style>
