<template>
  <!-- 影像信息界面 -->
  <h-msg-box v-model="tempShowUploadImageWin" :mask-closable="false" @on-close="handleClose"
             :maximize="true" width="1000" class="h-form-table-layer">
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
      :url="pageSearchUrl"
      :hasSelect="false"
      rowSelect
      ref="datagrid">
      <div slot="toolbar">
        <h-button v-if="isShow" type="primary" @click="imageQuery">{{$t('m.i.be.searchImg')}}</h-button>
        <h-button v-if="isShow" type="primary" @click="formSearch">{{$t('m.i.config.refreshCache')}}</h-button>
      </div>
    </h-datagrid>
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
    </div>
    <show-image title="影像查看" :carousel-form="carouselForm" :carousel-data="carouselData"></show-image>
  </h-msg-box>
</template>

<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";

  export default {
    name: "showImageInfo",
    data() {
      return {
        formItem: {
          imgType: this.params.imgType,
          prodNo:this.params.prodNo,
          id: "",
          busiBatchId: "",
          listId: "",
          imgBusiType:"",
        },
        //查看影像
        hasSelect: false,
        showImgWin: false,
        pageSearchUrl: "", //分页查询url
        imageSearchUrl: "", //影像查询url
        dictMap: new Map(),
        showUploadImageColumns: [
          {
            type: "selection",
            align: "center",
            width: 60
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: this.$t('m.i.common.imgBatchNo'),
            key: "imgBatchNo",
            hiddenCol: this.isShowInfo
          },
          {
            title: this.$t("m.i.billInfo.billPackageNo"),
            key: "billNo",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.imgType'),
            key: "imgType",
            hiddenCol: false,
            render: (h, params) => {
              if(params.row.imgType === "SIT1" || params.row.imgType === "SIT2" || params.row.imgType === "SIT3" || params.row.imgType === "SIT4") {
                return h("span", this.getDictValueFromMap(this.dictMap,"SspdImageType",params.row.imgType));
              }else if(params.row.imgType === "RIT1" || params.row.imgType === "RIT2" || params.row.imgType === "RIT3" || params.row.imgType === "RIT4") {
                return h("span", this.getDictValueFromMap(this.dictMap,"RelieveImageType",params.row.imgType));
              }else {
                return h("span", this.getDictValueFromMap(this.dictMap, "ImgType", params.row.imgType));
              }
            }
          },
          {
            title: this.$t('m.i.common.status'),
            key: "applStatus",
            hiddenCol: !this.isShowInfo,
            render: (h, params) => {
              return h("span", this.getDictValueFromMap(this.dictMap, "ImgStatus", params.row.applStatus));
            }
          },
          {
            title: this.$t('m.i.common.status'),
            key: "queryStatus",
            hiddenCol: this.isShowInfo,
            render: (h, params) => {
              return h("span", this.getDictValueFromMap(this.dictMap, "ImgStatus", params.row.queryStatus));
            }
          },
          {
            title: this.$t('m.i.common.failReason'),
            key: "dealPrcMsg",
            hiddenCol: this.isShowInfo
          },
          {
            title: this.$t('m.i.common.showImg'),
            key: "showImage",
            hiddenCol: false,
            render: (h, params) => {
              if (!this.isShowInfo && params.row.queryStatus !== "BTL16") {
                return "";
              }
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
                  }, this.$t('m.i.common.view'))
                ]);
            }
          }
        ],
        // 影像控件弹框轮播图数据url
        carouselData: {
          imgUrls: []
        },
        // 影像控件弹框轮播图表单
        carouselForm: {
          initialIndex: 0,    //初始图片位置
          showDialog: false,    //控制影像控件显隐
          tags: []          //图片提示
        }
      };
    },
    mounted() {
      this.getDictListByGroups("ImgType,SspdImageType,RelieveImageType,ImgStatus").then(res => {
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
      isShowInfo: {
        type: Boolean,
        default() {
          return true;
        }
      },
      params: Object,
      isShow:{
        type: Boolean,
        default: true
      }
    },
    watch: {
      showUploadImageWin(val) {
        if (val === true) {
          this.pageSearchUrl = this.params.pageSearchUrl;
          this.imageSearchUrl = this.params.imageSearchUrl;
          if(this.params.id !== null && this.params.id !== undefined){
            this.formItem.id = this.params.id;
          }
          if(this.params.imgType !== null && this.params.imgType !== undefined){
            this.formItem.imgType = this.params.imgType;
          } else {
            this.formItem.imgType = "";
          }
          if(this.params.prodNo !== null && this.params.prodNo !== undefined){
            this.formItem.prodNo = this.params.prodNo;
          }else {
            this.formItem.prodNo = "";
          }
          if(this.params.busiBatchId !== null && this.params.busiBatchId !== undefined){
            this.formItem.busiBatchId = this.params.busiBatchId;
          }
          if(this.params.listId !== null && this.params.listId !== undefined){
            this.formItem.listId = this.params.listId;
          }
          if(this.params.imgBusiType !== null && this.params.imgBusiType !== undefined){
            this.formItem.imgBusiType = this.params.imgBusiType;
          }
          this.$nextTick(() => {
            this.$refs.datagrid.$refs.gridPage.clearElevator();
            this.$refs.datagrid.dataChange(1);
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
      //查看影像
      showImage(id) {
        let list = this.$refs.datagrid.$data.tData;
        let initialIndex = 0;
        let preUrl = window.LOCAL_CONFIG.API_HOME + this.params.imgShowUrl;
        this.carouselData.imgUrls = [];
        for (let i = 0; i < list.length; i++) {
          this.carouselData.imgUrls.push(preUrl + list[i].id);
          if (id === list[i].id) {
            initialIndex = i;
          }
        }
        this.$loadingbox.open({
          title: "获取图像信息中，请稍后..."
        });
        setTimeout(() => {
          this.$loadingbox.close();
          // this.showImgWin = true;
          this.carouselForm.showDialog = true;
          this.carouselForm.initialIndex = initialIndex;
        }, 1000);
      },
      //查询
      formSearch() {
        this.$refs.datagrid.dataChange(1);
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.selects = [];
      },

      //影像查询
      imageQuery() {
        let ids=this.$refs.datagrid.selectIds;
        if (ids.length === 0 || ids === undefined) {
          this.$msgTip.info(this, { info: "请先选择记录！" });
          return;
        }
        let url = this.imageSearchUrl;
        post({ ids: ids }, url).then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.$refs.datagrid.selectIds = [];
              this.$refs.datagrid.selects = [];
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      },
      //关闭
      handleClose() {
        this.$refs.datagrid.tData = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.selects = [];
        this.$emit("uploadImageWinClose", "");
      },
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
