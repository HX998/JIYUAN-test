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
      url="/ce/acpt/paper/backUnused/backUnusedMain/func_pageQueryAcptImgWithProd"
      :on-select-change="handlelRowClick"
      ref="datagrid">
      <div slot="toolbar">
        <h-button type="primary" @click="openImgWin">{{$t("m.i.common.imageAdd")}}</h-button>
        <h-button type="primary" @click="deleteDetailed">{{$t("m.i.common.delete")}}</h-button>
      </div>
    </h-datagrid>
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
    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"
                    :billNo="this.billNo" ref="billInfoMain"></bill-info-main>
  </h-msg-box>
</template>

<script>
  import { post, on, off, getDictListByGroups, getDictValueFromMap } from "@/api/bizApi/commonUtil";

  export default {
    name: "backUnusedMainUploadImage",
    components:{
    },
    data() {
      return {
          showBillInfoWin: false,
          billId: "",
          billNo: "",
        formItem: {
          prodNo:"01010311",
          imgType: "IM01",
          id: ""
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
            render: (h, params) => {
                return h("a", {
                    on: {
                        click: () => {
                            this.showBillInfo(params.row.billId, params.row.billNo);
                        }
                    }
                }, params.row.billNo);
            }
          },
          {
            title: this.$t('m.i.common.imgType'),
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
          acptId: '',
          prodNo: '01010311'
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
            this.formItem.id = this.params.id;
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
      //影像新增
      openImgWin() {
        this.imageFormItem.acptId = this.params.id;
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
        let ids = "";
        let list = this.currentSelectRow;
        for(let i=0; i<list.length; i++) {
          ids += list[i].id;
          if(i<list.length-1) {
            ids += ",";
          }
        }
        post({ code: ids}, "/ce/acpt/paper/backUnused/backUnusedMain/func_deleteImage").then(res => {
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
    },
      billInfoWinClose() {
          this.billId = "";
          this.billNo = "";
          this.showBillInfoWin = false;
      },
      showBillInfo(billId, billNo) {
          this.billId = billId;
          this.billNo = billNo;
          this.showBillInfoWin = true;
      }
  };
</script>

<style scoped>

</style>
