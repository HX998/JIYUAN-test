<!-- 挂失解挂发生查询-影像信息查看界面 -->
<template>
  <h-msg-box v-model="tempShowUploadImageWin" :mask-closable="false" @on-close="handleClose"
             :maximize="true" width="1000" class="h-form-table-layer" @on-maximize="onMaximize">
    <p slot="header">
      <span>影像信息</span>
    </p>
    <!--数据展示表格-->
    <h-datagrid
      :columns="showUploadImageColumns"
      :bindForm="formItem"
      :auto-load="false"
      highlight-row
      :height="300"
      url="/ce/acpt/paper/stopPayment/stopPaymentRegisterApply/func_imageListPage"
      :onCurrentChange="handleCurrentChange"
      :onCurrentChangeCancel="handleCurrentChangeCancel"
      ref="datagrid">
      <div slot="toolbar">
      </div>
    </h-datagrid>
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
    </div>
    <!-- 查看影像弹出框-->
    <h-msg-box title="影像查看" v-model="showImgWin" width="1000" :mask-closable="false" :footerHide="true" :z-index=1010
               class="h-form-search-layer" top="10" :maximize="true" @on-close="showImageClose">
      <img :src="this.viewUrl" width="100%" height="600"/>
    </h-msg-box>
  </h-msg-box>
</template>

<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";

  export default {
    name: "stopPayOccurImage",
    data() {
      let options = {};
      options.formItem = {
        imgBusiType: "2",
        listId: "",
        imgType: ""
      };
      //查看影像
      options.showImgWin = false;
      options.viewUrl = "";
      options.dictMap = new Map();
      options.showUploadImageColumns = [
        {
          type: "selection",
          key: "multiSelect",
          width: 60,
          hiddenCol: false
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
            return h("span", this.getDictValueFromMap(this.dictMap, "ImgType", params.row.imgType));
          }
        },
        {
          title: this.$t('m.i.common.status'),
          key: "applStatus",
          hiddenCol: false,
          render: (h, params) => {
            return h("span", this.getDictValueFromMap(this.dictMap, "ImgStatus", params.row.applStatus));
          }
        },
        {
          title: this.$t("m.i.common.failReason"),
          key: "dealPrcMsg",
          hiddenCol: false
        },
        {
          title: this.$t('m.i.common.showImg'),
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
                    this.showImage(params.row.id);
                  }
                }
              }, "查看")
            ]);
          }
        }
      ];
      return options;
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
      imageParams: Object
    },
    watch: {
      showUploadImageWin(val) {
        if (val === true) {
          this.getDictInfo();
          this.$nextTick(() => {
            this.formItem.listId = this.imageParams.id;
            this.formItem.imgType = this.imageParams.imgType;
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
        this.getDictListByGroups("ImgType,ImgStatus").then(res => {
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
        this.viewUrl = this.imageParams.viewUrl + "?id=" + id;
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
        this.$refs.datagrid.dataChange(1);
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
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
