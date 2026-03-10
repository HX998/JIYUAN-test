<template>
  <h-msg-box v-model="tempShowUploadImageWin" :mask-closable="false" @on-close="handleClose" :maximize="true" width="1000" class="h-form-table-layer" @on-maximize="onMaximize">
    <p slot="header">
      <span>{{$t("m.i.common.imgInfo")}}</span>
    </p>
    <div>
      <h-form :model="formItem" :label-width="100" ref="formItem" cols="4" class="h-form-search">
        <h-form-item :label="$t('m.i.common.imgType')" prop="imgType">
          <h-select v-model="formItem.imgType" placeholder="" readonly showTitle>
            <h-option value="IM20" key="IM20">{{$t("m.i.ce.discountData")}}</h-option>
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
      url="/ce/disc/paper/apply/discApplyBatchMain/func_imageListPage"
      :on-select-change="handlelRowClick"
      :row-select="true"
      :has-select="hasSelect"
      ref="datagrid">
      <div slot="toolbar">
        <h-button type="primary" @click="openImgWin">{{$t("m.i.common.upload")}}</h-button>
        <h-button type="primary" @click="deleteDetailed">{{$t("m.i.common.delete")}}</h-button>
      </div>
    </h-datagrid>
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
    </div>
    <!-- 影像上传-->
    <common-upload-image :imageFormItem="this.imageFormItem" :uploadImageWin="uploadImageWin" :imageFormatType="this.imageFormatType" :upload-url="this.uploadUrl" @uploadImageWinClose="uploadImageWinClose"></common-upload-image>
    <!-- 查看影像弹出框-->
    <h-msg-box :title="$t('m.i.common.showImg')" v-model="showImgWin" width="1000" :mask-closable="false" :footerHide="true" :z-index=1010 class="h-form-search-layer" top="10" :maximize="true" @on-close="showImageClose">
      <img :src="this.viewUrl" width="100%"/>
    </h-msg-box>
  </h-msg-box>
</template>

<script>
  import { getDictListByGroups, getDictValueFromMap, post } from "@/api/bizApi/commonUtil";

  export default {
    name: "showDiscImageUpload",
    components: {},
    data() {
      return {
        formItem : {
          imgType: "IM20",
          listId: "",
          prodNo: ""
        },
        showImgWin : false,
        viewUrl : "",
        imgTypeList : [],
        dictMap : new Map(),
        imageFormatType : ["jpg", "JPG", "png", "PNG", "jpeg", "JPEG"],
        showUploadImageColumns : [
          {
            type: "selection",
            key: "multiSelect",
            width: 60,
            hiddenCol: false
          }, {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          }, {
            title: this.$t("m.i.ce.ImgFileName"),
            key: "fileName",
            hiddenCol: false
          }, {
           title: this.$t("m.i.ce.uploadDt"),
            key: "uploadDt",
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.uploadDt == null || params.row.uploadDt === "") {
                return "";
              }
              let uploadDt = this.$moment(params.row.uploadDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", uploadDt);
            }
          }, {
            title: this.$t("m.i.common.operTellerNo"),
            key: "operTellerNo",
            hiddenCol: false
          }, {
            title: this.$t('m.i.common.status'),
            key: "applStatus",
            hiddenCol: false,
            render: (h, params) => {
              return h("span", getDictValueFromMap(this.dictMap, "ImgStatus", params.row.applStatus));
            }
          },
          {
           title: this.$t("m.i.common.showImg"),
            key: "showImage",
            hiddenCol: false,
            render: (h, params) => {
              return h("div", [
                h("a", {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.showImage(params.row.attachId);
                    }
                  }
                }, "查看")
              ]);
            }
          }
        ],
        uploadImageWin : false,
        uploadUrl : "",
        imageFormItem : {
          listId: ""
        },
        hasSelect : false,
      };
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
      params: Object
    },
    watch: {
      showUploadImageWin(val) {
        if (val === true) {
          this.getDictInfo();
          this.$nextTick(() => {
            this.formItem.listId = this.params.listId;
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
        set() {
        }
      }
    },
    methods: {
      getDictInfo() {
        getDictListByGroups("ImgType,ImgStatus").then(res => {
          this.imgTypeList = res.get("ImgType");
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
          title: "获取图像信息中，请稍后..."
        });
        setTimeout(() => {
          this.$loadingbox.close();
          this.showImgWin = true;
        }, 1000);
      },
      //查看影像关闭
      showImageClose() {
        this.showImgWin = false;
        this.viewUrl = "";
      },
      //查询
      formSearch() {
        this.currentSelectRow = [];
        this.hasSelect = false;
        this.formItem.listId = this.params.listId;
        this.formItem.prodNo = this.params.prodNo;
        this.formItem.imgType = this.params.imgType;
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.dataChange(1);
      },
      handlelRowClick(arr) {
        this.currentSelectRow = arr;
      },
      //影像新增
      openImgWin() {
        this.imageFormItem.listId = this.params.listId;
        this.imageFormItem.prodNo = this.params.prodNo;
        this.uploadUrl = this.params.uploadUrl;
        this.uploadImageWin = true;
      },
      //影像新增关闭
      uploadImageWinClose() {
        this.uploadImageWin = false;
        this.formSearch();
      },
      //删除按钮
      deleteDetailed() {
        if (this.$refs.datagrid.selects.length === 0) {
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
        let ids = this.$refs.datagrid.selectIds.join(",");
        post({ code: ids }, "/ce/disc/paper/apply/discApplyBatchMain/func_deleteById").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this, { info: this.$t("m.i.common.deleteSuccess") });
              this.formSearch();
              // this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
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
      }
    }
  };
</script>

<style scoped>

</style>
