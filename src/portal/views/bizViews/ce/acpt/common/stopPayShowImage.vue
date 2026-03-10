<template>
  <!-- 影像信息界面 -->
  <h-msg-box v-model="tempShowUploadImageWin" :mask-closable="false" @on-close="handleClose"
             :maximize="true" width="1000" class="h-form-table-layer"  @on-maximize="onMaximize">
    <p slot="header">
      <span>{{$t('m.i.common.imgInfo')}}</span>
    </p>
    <!--数据展示表格-->
    <h-datagrid
      :columns="showUploadImageColumns"
      :bindForm="formItem"
      :auto-load="false"
      highlight-row
      :height="300"
      url="/ce/acpt/paper/stopPayment/stopPaymentRecheck/func_imageListPage"
      :on-select-change="handlelRowClick"
      ref="datagrid">
      <div slot="toolbar">
      </div>
    </h-datagrid>
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
    </div>

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
    name: "stopPayShowImage",
    data() {
      return {
        formItem: {
          imgBusiType: '',
          listId:"",
        },
        //查看影像
        showImgWin: false,
        viewUrl: "",
        imgTypeList: [],
        dictMap: new Map(),
        showUploadImageColumns: [
          {
            title: ' ',
            type: 'radio',
            align: 'center',
            width : 50
          },
          {
            type: 'selection',
            key: 'multiSelect',
            width: 60,
            hiddenCol: true,
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
        ]
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
            this.formItem.listId = this.params.id;
            this.formItem.imgBusiType = this.params.imgBusiType;
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
        this.currentSelectRow = [];
        this.$refs.datagrid.dataChange(1);
      },
      handlelRowClick(arr) {
        this.currentSelectRow = arr;
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
