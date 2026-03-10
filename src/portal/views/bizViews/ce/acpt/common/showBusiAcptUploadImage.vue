<template>
  <!-- 影像信息界面 -->
  <h-msg-box v-model="tempShowUploadImageWin" :mask-closable="false" @on-close="handleClose"
             :maximize="true" width="1000" class="h-form-table-layer">
    <p slot="header">
      <span>{{$t('m.i.common.imgInfo')}}</span>
    </p>
    <!-- 查询表单 -->
    <div>
      <h-form :model="formItem" :label-width="100" ref="formItem" cols="4" class="h-form-search">
        <h-form-item :label="$t('m.i.common.imgType')" prop="imgType">
          <h-select v-model="formItem.imgType"  placeholder="" readonly v-if="!isSupplyRgst">
            <h-option value="IM01" key="IM01">{{$t('m.i.ce.acptFront')}}</h-option>
          </h-select>
          <h-select v-model="formItem.imgType"  placeholder="" v-if="isSupplyRgst"  @on-change="imgTypeOnChange" :clearable="false">
            <h-option value="IM01" key="IM01">{{$t('m.i.ce.acptFront')}}</h-option>
            <h-option value="IM07" key="IM07">{{$t('m.i.ce.supplementImg')}}</h-option>
          </h-select>
        </h-form-item>
        <h-form-item class="h-form-operate one-form">
          <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
        </h-form-item>
      </h-form>
    </div>
    <!--数据展示表格-->
    <h-datagrid
      :columns="showUploadImageColumns"
      :bindForm="formItem"
      :auto-load="false"
      highlight-row
      :height="300"
      :url="params.listUrl"
      :onRowClick="handlelRowClick"
      :onSelectChange="handleSelectClick"
      ref="datagrid">
      <div slot="toolbar">
        <h-button type="primary" @click="openImgWin" v-if="operType=='add'" :disabled="isDisabled">{{$t("m.i.common.imageAdd")}}</h-button>
        <h-button type="primary" @click="registerSubmit" v-if="operType=='add'" :disabled="isDisabled">{{buttonName}}</h-button>
        <h-button type="primary" @click="deleteDetailed" v-if="operType=='add'" :disabled="isDisabled">{{$t("m.i.common.delete")}}</h-button>
      </div>
    </h-datagrid>
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
    </div>
    <!-- 影像上传-->
    <common-upload-image :imageFormItem="this.imageFormItem" :upload-image-win="uploadImageWin" :upload-url="this.uploadUrl"
                         :imageSize="512" :imageFormatType="['jpg','JPG']" @uploadImageWinClose="uploadImageWinClose"></common-upload-image>

    <!-- 查看影像弹出框-->
    <h-msg-box :title="$t('m.i.common.showImg')" v-model="showImgWin" width="1000" :mask-closable="false" :footerHide="true" :z-index=1010
               class="h-form-search-layer" top="10" :maximize="true" @on-close="showImageClose">
      <img :src="this.viewUrl" width="100%" height="600"/>
    </h-msg-box>
  </h-msg-box>
</template>

<script>
  import { post, on, off, getDictListByGroups, getDictValueFromMap } from "@/api/bizApi/commonUtil";

  export default {
    name: "showBusiAcptUploadImage",
    components:{
    },
    data() {
      return {
        formItem: {
          imgType:"",
          id:"",
        },
        isDisabled: false,
        //查看影像
        showImgWin: false,
        viewUrl: "",
        imgTypeList: [],
        currentSelectList: [],
        dictMap: new Map(),
        showUploadImageColumns: [
          {
            type: "selection",
            align: "center",
            key:"duoxuan",
            width : 50
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: this.$t('m.i.billInfo.billNo'),
            key: "billNo",
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.common.imgBatchNo'),
            key: "imgBatchNo",
            hiddenCol: false
          },
          {
            title:  this.$t('m.i.common.imgType'),
            key: "imgType",
            hiddenCol: false,
            render: (h, params) => {
              return h("span", getDictValueFromMap(this.dictMap,"ImgType",params.row.imgType));
            }
          },
          {
            title: this.$t('m.i.common.status'),
            key: "applStatus",
            hiddenCol: false,
            render: (h, params) => {
              return h("span", getDictValueFromMap(this.dictMap,"ImgStatus",params.row.applStatus));
            }
          },
          {
            title: this.$t('m.i.common.failReason'),
            key: "dealPrcMsg",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.showImg'),
            key: "showImage",
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
                      this.showImage(params.row.id)
                    }
                  }
                }, '查看')
              ]);
            }
          },
        ],
        //影像上传
        uploadImageWin: false,
        uploadUrl: "",
        imageFormItem: {
          id: '',
          imgType: ''
        }
      }
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
      isSupplyRgst: {
        type: Boolean,
        default() {
          return false;
        }
      },
      operType: {
        type: String,
        default() {
          return 'add';
        }
      },
      params: Object,
      buttonName: ""
    },
    watch: {
      showUploadImageWin(val) {
        if (val === true) {
          this.currentSelectList = [];
          this.formItem.id = this.params.id;
          if(this.isSupplyRgst){
            this.formItem.imgType = "IM07";
          } else {
            this.formItem.imgType = "IM01";
          }
          this.$nextTick(() => {
            this.formSearch();
          });
        }
      },
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
      imgTypeOnChange() {
        if(this.formItem.imgType === "IM01" && this.isSupplyRgst) {
          this.isDisabled = true;
        }else {
          this.isDisabled = false;
        }
        this.formSearch();
      },
      handleSelectClick(arr) {
        this.currentSelectList = arr;
      },
      //查看影像
      showImage(id) {
        this.viewUrl = this.params.viewUrl+"?id="+id;
        this.$loadingbox.open({
          title: this.$t('m.i.ce.loadingImgMsg'),
        });
        setTimeout(() => {
          this.$loadingbox.close();
          this.showImgWin = true;
        },1000)
      },
      //查看影像关闭
      showImageClose() {
        this.showImgWin = false;
        this.viewUrl = "";
      },
      //查询
       formSearch() {
        this.$refs.datagrid.dataChange(1);
      },
      handlelRowClick(arr) {
        this.currentSelectRow = arr[0];
      },
      //影像新增
      openImgWin() {
        this.imageFormItem.id = this.params.id;
        this.uploadUrl = this.params.uploadUrl;
        if(this.isSupplyRgst){
          this.imageFormItem.imgType = "IM07";
        }
        this.uploadImageWin = true;
      },
      //影像新增关闭
      uploadImageWinClose() {
        this.uploadImageWin = false;
        this.formSearch();
      },
      //登记按钮
      registerSubmit(){
        if (this.currentSelectList.length === 0) {
          this.$msgTip.info(this,{info: this.$t("m.i.common.chooseDataFirst")});
          return;
        }
        let ids = [];
        for(let i = 0; i < this.currentSelectList.length; i++){
          ids.push(this.currentSelectList[i].id);
        }
        let sendUrl =  this.params.sendUrl;
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("m.i.common.isConfirmRegister"),
          onOk: () => {
            post({ ids: ids}, sendUrl).then(res => {
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                  this.currentSelectList = [];
                } else {
                  this.$msgTip.error(this, { info: msg });
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
        if (this.currentSelectList.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("m.i.common.isConfirmDelete") + "?",
          onOk: () => {
            this.handleDeleteDetailed();
          }
        });
      },
      handleDeleteDetailed() {
        let ids = [];
        for(let i = 0; i < this.currentSelectList.length; i++){
          ids.push(this.currentSelectList[i].id);
        }
        let deleteUrl = this.params.deleteUrl;
        post({ ids: ids}, deleteUrl).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this, { info: this.$t("m.i.common.deleteSuccess") });
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.currentSelectList = [];
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      handleClose() {
        this.$refs.datagrid.tData = [];
        this.$emit("uploadImageWinClose", "");
      }
    },
  };
</script>

