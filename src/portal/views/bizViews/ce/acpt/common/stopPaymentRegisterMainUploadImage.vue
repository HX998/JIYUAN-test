<template>
  <!-- 影像信息界面 -->
  <h-msg-box v-model="tempShowUploadImageWin" :mask-closable="false" @on-close="handleClose"
             :maximize="true" width="1000" class="h-form-table-layer"  @on-maximize="onMaximize" :zIndex="1001">
    <p slot="header">
      <span>{{$t('m.i.common.imgInfo')}}</span>
    </p>
    <!-- 查询表单 -->
    <div>
      <h-form :model="formItem" :label-width="100" ref="formItem" cols="4" class="h-form-search">
        <h-form-item :label="$t('m.i.common.imgType')" prop="imgType">
          <h-select v-model="formItem.imgType"  placeholder="" showTitle>
            <h-option v-for="item in imageTypeList" :value="item.key" :key="item.key">{{item.value }}</h-option>
          </h-select>
        </h-form-item>
        <h-form-item class="h-form-operate one-form">
          <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
        </h-form-item>
      </h-form>
    </div>
    <!--数据展示表格-->
    <h-row>
      <h-col span="24">
        <h-datagrid
          :columns="showUploadImageColumns"
          :bindForm="formItem"
          :auto-load="false"
          highlight-row
          :height="300"
          url="/ce/acpt/paper/stopPayment/stopPaymentRegisterMain/func_imageListPage"
          :on-select-change="handlelRowClick"
          ref="datagrid">
          <div slot="toolbar">
            <h-button type="primary" @click="openImgWin">{{$t("m.i.common.imageAdd")}}</h-button>
            <h-button type="primary" @click="deleteDetailed">{{$t("m.i.common.delete")}}</h-button>
          </div>
        </h-datagrid>
      </h-col>
    </h-row>
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
    </div>
    <!-- 影像上传-->
    <common-upload-image :imageFormItem="this.imageFormItem" :uploadImageWin="uploadImageWin"
                         :imageFormatType="this.imageFormatType" :upload-url="this.uploadUrl" @uploadImageWinClose="uploadImageWinClose"></common-upload-image>

    <!-- 查看影像弹出框-->
    <h-msg-box :title="$t('m.i.common.showImg')" v-model="showImgWin" width="1000" :mask-closable="false" :footerHide="true" :z-index=1010
               class="h-form-search-layer" top="10" :maximize="true" @on-close="showImageClose">
      <img :src="this.viewUrl" width="100%" height="600"/>
    </h-msg-box>

    <!-- 影像类型选择弹窗 -->
    <h-msg-box v-model="imageTypeWin" width="400" height="200" @on-close="imageTypeWinClose" class="h-form-search-layer" :maximize="true" :mask-closable="false" :z-index=1002 onlyBlurRequire>
      <p slot="header">
        <span>{{$t('m.i.ce.selectImgType')}}</span>
      </p>
      <div>
        <h-form :model="imageTypeForm" :label-width="115" ref="imageTypeForm" cols="1" class="h-form-search">
          <h-form-item prop="imgType" :label="$t('m.i.common.imgType')" required>
            <h-select v-model="imageTypeForm.imgType"  placeholder="" showTitle>
              <h-option v-for="item in imageTypeList" :value="item.key" :key="item.key">{{item.value }}</h-option>
            </h-select>
          </h-form-item>
        </h-form>
      </div>
      <div slot="footer">
        <div slot="footer">
          <h-button type="ghost" @click="imageTypeWinClose">{{$t("m.i.common.close")}}</h-button>
          <h-button type="primary" @click="imageTypeSubmit()">{{$t("m.i.common.commit")}}</h-button>
        </div>
      </div>
    </h-msg-box>
  </h-msg-box>
</template>

<script>
  import { post, on, off, getDictListByGroups, getDictValueFromMap } from "@/api/bizApi/commonUtil";

  export default {
    name: "stopPaymentRegisterMainUploadImage",
    components:{
    },
    data() {
      return {
        formItem: {
          imgBusiType:"",
          listId:"",
          imgType: "",
          billNo: ""
        },
        //查看影像
        showImgWin: false,
        viewUrl: "",
        imgTypeList: [],
        dictMap: new Map(),
        imageFormatType: ['jpg','JPG','png','PNG','jpeg','JPEG'],
        showUploadImageColumns: [
          {
            type: 'selection',
            key: 'multiSelect',
            width: 60,
            hiddenCol: false,
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
            title: this.$t('m.i.common.imgType'),
            key: "imgType",
            hiddenCol: false,
            render: (h, params) => {
              if(params.row.imgType === "SIT1" || params.row.imgType === "SIT2" || params.row.imgType === "SIT3" || params.row.imgType === "SIT4") {
                return h("span", getDictValueFromMap(this.dictMap,"SspdImageType",params.row.imgType));
              }else if(params.row.imgType === "RIT1" || params.row.imgType === "RIT2" || params.row.imgType === "RIT3" || params.row.imgType === "RIT4") {
                return h("span", getDictValueFromMap(this.dictMap,"RelieveImageType",params.row.imgType));
              }
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
            title: this.$t('m.i.common.dealPrcMsg'),
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
        imageTypeForm: {
          imgType: ""
        },
        imageTypeList: [],
        sspdImageTypeList : [],
        relieveImageTypeList: [],
        //影像上传
        imageTypeWin: false,
        uploadImageWin: false,
        uploadUrl: "",
        imageFormItem: {
          listId: '',
          imgType: '',
          billNo: '',
          billType: '',
          billMoney: '',
          dueDt: '',
          acptBankNo: '',
          imgBusiType: ''
        }
      }
    },
    mounted() {
    },
    props: {
      showUploadImageWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      params: Object,
    },
    watch: {
      showUploadImageWin(val) {
        if (val === true) {
          this.getDictInfo();
          this.$nextTick(() => {
            this.formItem.listId = this.params.sspdId;
            this.formItem.billNo = this.params.billNo;
            this.formItem.imgBusiType = this.params.imgBusiType;
            if(this.params.imgType === "IM09") {
              this.imageTypeList = this.sspdImageTypeList;
            }else if(this.params.imgType === "IM10") {
              this.imageTypeList = this.relieveImageTypeList;
            }
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
      getDictInfo() {
        getDictListByGroups("ImgType,ImgStatus,SspdImageType,RelieveImageType").then(res => {
          this.sspdImageTypeList = res.get("SspdImageType");
          this.relieveImageTypeList = res.get("RelieveImageType");
          this.dictMap = res.get("map");
        });
      },
      onMaximize() {
        setTimeout(() => {
          this.$refs.datagrid.$refs.gridContent.handleResize();
        }, 100);
      },
      //查看影像
      showImage(id) {
        this.viewUrl = this.params.viewUrl + "?id=" + id;
        this.$loadingbox.open({
          title: this.$t('m.i.ce.loadingImgMsg'),
        });
        setTimeout(() => {
          this.$loadingbox.close();
          this.showImgWin = true;
        }, 1000)
      },
      //查看影像关闭
      showImageClose() {
        this.showImgWin = false;
        this.viewUrl = "";
      },
      //查询
      formSearch() {
        this.currentSelectRow = [];
        this.$refs.datagrid.dataChange(1);
      },
      handlelRowClick(arr) {
        this.currentSelectRow = arr;
      },
      //影像新增
      openImgWin() {
        this.imageFormItem.listId = this.params.sspdId;
        this.imageFormItem.billNo = this.params.billNo;
        this.imageFormItem.imgBusiType = this.params.imgBusiType;
        this.uploadUrl = this.params.uploadUrl;
        if(this.params.imgType === "IM09") {
          this.imageTypeList = this.sspdImageTypeList;
        }else if(this.params.imgType === "IM10") {
          this.imageTypeList = this.relieveImageTypeList;
        }
        this.imageTypeWin = true;
      },
      //影像类型选择弹框
      imageTypeSubmit() {
        this.$refs["imageTypeForm"].validate(valid => {
          if (valid) {
            this.imageFormItem.imgType = this.imageTypeForm.imgType;
            this.imageTypeWinClose();
            this.uploadImageWin = true;
          }
        });
      },
      imageTypeWinClose() {
        this.imageTypeWin = false;
        this.$refs.imageTypeForm.resetFields();
      },

      //影像新增关闭
      uploadImageWinClose() {
        this.uploadImageWin = false;
        this.formSearch();
      },
      //删除按钮
      deleteDetailed() {
        if (this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst")});
          return;
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("m.i.common.isConfirmDelete") + "?",
          zIndex: "1002",
          onOk: () => {
            this.handleDeleteDetailed();
          }
        });
      },
      handleDeleteDetailed() {
        let ids = "";
        let list = this.currentSelectRow;
        for (let i = 0; i < list.length; i++) {
          ids += list[i].id;
          if (i < list.length - 1) {
            ids += ",";
          }
        }
        let url = this.params.deleteUrl;
        post({ code: ids }, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this, { info: this.$t("m.i.common.deleteSuccess") });
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.currentSelectRow = [];
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
        this.$refs.datagrid.$refs.gridPage.clearElevator();
        this.$emit("uploadImageWinClose", "");
      },
    }
  };
</script>

<style scoped>

</style>
