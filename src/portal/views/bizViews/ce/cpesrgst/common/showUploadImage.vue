<template>
  <!-- 影像信息界面 -->
  <h-msg-box v-model="tempShowUploadImageWin" :mask-closable="false" @on-close="handleClose"
             :maximize="true" width="1000" class="h-form-table-layer"  @on-maximize="onMaximize">
    <p slot="header">
      <span>影像信息</span>
    </p>
    <!-- 查询表单 -->
    <div>
      <h-form :model="formItem" :label-width="100" ref="formItem" cols="4" class="h-form-search">
        <h-form-item label="影像类型" prop="imgType" :required="isImgTypeRequired">
          <h-select v-model="formItem.imgType"  placeholder="">
            <h-option v-for="item in imgTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
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
      :bindForm="formItem"
      :auto-load="false"
      :height="300"
      :url="params.listUrl"
      highlightRow
      :on-current-change="handleRowClick"
      :on-current-change-cancel="handleRowClickCancel"
      ref="datagrid">
      <div slot="toolbar">
        <h-button type="primary" @click="openImgWin" v-show="addButtonIsShow">{{$t("m.i.common.imageAdd")}}</h-button>
        <h-button type="primary" @click="registerSubmit" v-show="rgstButtonIsShow">{{this.buttonName}}</h-button>
        <h-button type="primary" @click="deleteDetailed" v-show="deleteButtonIsShow">{{$t("m.i.common.delete")}}</h-button>
      </div>
    </h-datagrid>
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
    </div>
    <!-- 影像上传-->
    <common-upload-image :imageFormItem="this.imageFormItem" :uploadImageWin="uploadImageWin" :imageSize="512"  :imageFormatType="this.imageFormatType"
                         :upload-url="this.uploadUrl" @uploadImageWinClose="uploadImageWinClose"></common-upload-image>

    <!-- 查看影像弹出框-->
    <h-msg-box :title="$t('m.i.common.showImg')" v-model="showImgWin" width="1000" :mask-closable="false" :footerHide="true" :z-index=1010
               class="h-form-search-layer" top="10" :maximize="true" @on-close="showImageClose">
      <img :src="this.viewUrl" width="100%" height="600"/>
    </h-msg-box>
    <!-- 查看票面 -->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId" :billNo="this.billNo"></bill-info-main>
  </h-msg-box>
</template>

<script>
  import { post, on, off, getDictListByGroups, getDictValueFromMap,formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "showUploadImage",
    data() {
      return {
        //影像类型是否必输
        isImgTypeRequired: true,
        //按钮是否显示
        addButtonIsShow: true,
        rgstButtonIsShow: true,
        deleteButtonIsShow: true,
        imgTypeList: [],
        buttonName: '登记',
        //票面
        showBillInfoWin: false,
        billId: '',
        billNo: '',
        formItem: {
          imgType:"",
          listId:"",
        },
        //查看影像
        showImgWin: false,
        viewUrl: "",

        dictMap: new Map(),
        imageFormatType: ['jpg','JPG'],
        columns: [
          {
            title: ' ',
            type: 'radio',
            align: 'center',
            width : 50
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: this.$t("m.i.billInfo.billNo"),
            key: "billNo",
            hiddenCol: false,
            sortable: true,
            /*render: (h, params) => {
                return h("a", {
                    on: {
                        click: () => {
                            this.showBillInfo(params.row.billId,params.row.billNo);
                        }
                    }
                }, params.row.billNo);
            }*/
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
            key: "applStatus",
            hiddenCol: false,
            render: (h, params) => {
              return h("span", getDictValueFromMap(this.dictMap,"ImgStatus",params.row.applStatus));
            }
          },
          {
             title: this.$t("m.i.common.result"),
            key: "dealPrcMsg",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.showImg"),
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
          listId: '',
          imgType: '',
          imgBusiType: '',
          prodNo: ''
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
      propsVue: ''
    },
    watch: {
      showUploadImageWin(val) {
        if (val === true) {
          this.getDictInfo();
          this.$nextTick(() => {
            this.formItem.listId = this.params.id;
            this.setValueByPropsVue();
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
      setValueByPropsVue() {
        this.imgTypeList = [];
        if (this.propsVue === "acptRgstApply") {
          this.imageFormItem.imgBusiType = "acptImage";
          this.imageFormItem.prodNo = "RI00";
          this.imgTypeList.push({key: 'IM01', value: '承兑正面'});
          this.formItem.imgType = 'IM01';
          this.buttonName = '登记';
          this.addButtonIsShow = true;
          this.rgstButtonIsShow = true;
          this.deleteButtonIsShow = true;
        }else if (this.propsVue === "acptRgstTrackSearch") {
          this.imageFormItem.imgBusiType = "acptImage";
          this.imageFormItem.prodNo = "RI00";
          this.imgTypeList.push({key: 'IM01', value: '承兑正面'});
          this.imgTypeList.push({key: 'IM07', value: '补充影像(承兑)'});
          this.buttonName = '补充登记';
          this.addButtonIsShow = true;
          this.rgstButtonIsShow = true;
          this.deleteButtonIsShow = true;
        }else if (this.propsVue === "acptRgstRecheck") {
          this.imgTypeList.push({key: 'IM01', value: '承兑正面'});
          this.formItem.imgType = 'IM01';
          this.isImgTypeRequired = false;
          this.buttonName = '登记';
          this.addButtonIsShow = false;
          this.rgstButtonIsShow = false;
          this.deleteButtonIsShow = false;
        }else if (this.propsVue === "discRgstApply") {
          this.imageFormItem.imgBusiType = "discImage";
          this.imageFormItem.prodNo = "RI04";
          this.imgTypeList.push({key: 'IM03', value: '贴现正面'});
          this.imgTypeList.push({key: 'IM04', value: '贴现背面'});
          this.imgTypeList.push({key: 'IM05', value: '贴现凭证'});
          this.imgTypeList.push({key: 'IM06', value: '瑕疵证明'});
          this.buttonName = '登记';
          this.addButtonIsShow = true;
          this.rgstButtonIsShow = true;
          this.deleteButtonIsShow = true;
        }else if (this.propsVue === "discRgstRecheck") {
          this.imgTypeList.push({key: 'IM03', value: '贴现正面'});
          this.imgTypeList.push({key: 'IM04', value: '贴现背面'});
          this.imgTypeList.push({key: 'IM05', value: '贴现凭证'});
          this.imgTypeList.push({key: 'IM06', value: '瑕疵证明'});
          this.isImgTypeRequired = false;
          this.buttonName = '登记';
          this.addButtonIsShow = false;
          this.rgstButtonIsShow = false;
          this.deleteButtonIsShow = false;
        }else if (this.propsVue === "discRgstTrackSearch") {
          this.imageFormItem.imgBusiType = "discImage";
          this.imageFormItem.prodNo = "RI04";
          this.imgTypeList.push({key: 'IM03', value: '贴现正面'});
          this.imgTypeList.push({key: 'IM04', value: '贴现背面'});
          this.imgTypeList.push({key: 'IM05', value: '贴现凭证'});
          this.imgTypeList.push({key: 'IM06', value: '瑕疵证明'});
          this.imgTypeList.push({key: 'IM08', value: '补充影像(贴现)'});
          this.buttonName = '补充登记';
          this.addButtonIsShow = true;
          this.rgstButtonIsShow = true;
          this.deleteButtonIsShow = true;
        }else if (this.propsVue === "stopPaymentRgstApply") {
          this.imageFormItem.imgBusiType = "suspendImage";
          this.imageFormItem.prodNo = "RI07";
          this.imgTypeList.push({key: 'IM09', value: '止付'});
          this.formItem.imgType = 'IM09';
          this.buttonName = '登记';
          this.addButtonIsShow = true;
          this.rgstButtonIsShow = true;
          this.deleteButtonIsShow = true;
        }else if (this.propsVue === "stopPaymentRgstRecheck") {
          this.imgTypeList.push({key: 'IM09', value: '止付'});
          this.formItem.imgType = 'IM09';
          this.isImgTypeRequired = false;
          this.buttonName = '登记';
          this.addButtonIsShow = false;
          this.rgstButtonIsShow = false;
          this.deleteButtonIsShow = false;
        }else if (this.propsVue === "cancelStopPaymentRgstApply") {
          this.imageFormItem.imgBusiType = "relieveImage";
          this.imageFormItem.prodNo = "RI08";
          this.imgTypeList.push({key: 'IM10', value: '解除止付'});
          this.formItem.imgType = 'IM10';
          this.buttonName = '登记';
          this.addButtonIsShow = true;
          this.rgstButtonIsShow = true;
          this.deleteButtonIsShow = true;
        }else if (this.propsVue === "cancelStopPaymentRgstRecheck") {
          this.imgTypeList.push({key: 'IM10', value: '解除止付'});
          this.formItem.imgType = 'IM10';
          this.isImgTypeRequired = false;
          this.buttonName = '登记';
          this.addButtonIsShow = false;
          this.rgstButtonIsShow = false;
          this.deleteButtonIsShow = false;
        }
      },
      getDictInfo() {
        getDictListByGroups("ImgType,ImgStatus").then(res => {
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
        this.viewUrl = this.params.viewUrl+"?id="+id;
        this.$loadingbox.open({
          title: "获取图像信息中，请稍后..."
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
        this.currentSelectRow = [];
        this.$refs.datagrid.dataChange(1);
      },
      handleRowClick(arr) {
        this.currentSelectRow = arr;
      },
      handleRowClickCancel() {
        this.currentSelectRow = [];
      },
        //票面
        showBillInfo(billId, billNo) {
            this.billId = billId;
            this.billNo = billNo;
            this.showBillInfoWin = true;
        },
        billInfoWinClose() {
            this.showBillInfoWin = false;
        },
      //影像新增
      openImgWin() {
        if (this.formItem.imgType === "" || this.formItem.imgType === null) {
          this.$msgTip.info(this,{info: "请先选择影像类型！"});
          return;
        }
        this.imageFormItem.imgType = this.formItem.imgType;
        this.imageFormItem.listId = this.params.id;
        this.uploadUrl = this.params.uploadUrl;
        this.uploadImageWin = true;
      },
      //影像新增关闭
      uploadImageWinClose() {
        this.uploadImageWin = false;
        this.formSearch();
      },
      //登记按钮
      registerSubmit(){
        if (this.currentSelectRow.length === 0) {
          this.$msgTip.info(this,{info: "请先选择记录！"});
          return;
        }
        let id = this.currentSelectRow.id;
        let sendUrl = this.params.sendUrl;
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("m.i.common.isConfirmRegister"),
          onOk: () => {
            post({ id: id}, sendUrl).then(res => {
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.formSearch();
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
        if (this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: "请先选择记录！" });
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
        let id = this.currentSelectRow.id;
        let url = this.params.deleteUrl;
        post({ id: id}, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this, { info: this.$t("m.i.common.deleteSuccess") });
              this.formSearch();
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
      }
    },
  };
</script>

<style scoped>

</style>
