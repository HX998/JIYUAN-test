<template>
  <div>
    <h-form :model="imgFormItem" ref="imgFormItem"></h-form>
    <h-datagrid
      :columns="imgColumns"
      :auto-load="false"
      highlight-row
      url="/pc/btrc/common/pagingQueryImgInfos"
      :bindForm="imgFormItem"
      :hasSelect="false"
      rowSelect
      paramId="imgBatchNo"
      ref="imgDatagrid">
      <div slot="toolbar" class="pull-left">
        <h-button type="primary" @on-click="queryImg()">{{$t("m.i.pc.queryImg")}}</h-button>
        <h-button type="primary" @on-click="handleSearch()">{{$t("m.i.config.refreshCache")}}</h-button>
      </div>
    </h-datagrid>


    <h-msg-box v-model="imgDetailWin" width="1000" :mask-closable="false" @on-close="handleClose"
               class="h-form-table-layer" :maximize="true" @on-maximize="onMaximize" :z-index=1010>
      <p slot="header">
        <span>影像详情</span>
      </p>
      <div>
        <h-datagrid
          :columns="detailColumns"
          highlight-row
          url="/pc/img/imgUpRegister/queryImageDetail"
          :bindForm="detailFormItem"
          :onCurrentChange="handleCurrentChange"
          :onCurrentChangeCancel="handleCurrentChangeCancel"
          :autoLoad=true
          ref="imgDetailData">
        </h-datagrid>
      </div>
      <!-- 弹出框模式底部按钮 -->
      <div slot="footer">
        <h-button type="ghost" @click="imgDetailWin=!imgDetailWin">{{$t("m.i.common.close")}}</h-button>
      </div>
      <show-image title="影像查看" :carousel-form="carouselForm" :carousel-data="carouselData"></show-image>

    </h-msg-box>
    <!-- 查看影像弹出框-->
    <show-image title="影像查看" :carousel-form="carouselForm" :carousel-data="carouselData"></show-image>
  </div>
</template>

<script>
import { post } from "@/api/bizApi/commonUtil";

export default {
  name: "ImgQuery",
  props: {
    billId: "",
    dictMap: {
      type: Map
    }
  },
  data() {
    return {
      imgFormItem : {},
      imgColumns : [
        {
          type: "selection",
          width: 60,
          align: "center"
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
            let list = this.getDictValueFromMap(
              this.dictMap,
              "ImgType",
              params.row.imgType
            );
            return h("span", { domProps: { title: list } }, list);
          }
        },
        {
          title: this.$t("m.i.common.queryStatus"),
          key: "queryStatus",
          hiddenCol: false,
          ellipsis: false,
          render: (h, params) => {
            if(params.row.queryStatus){
              let list = this.getDictValueFromMap(
                this.dictMap,
                "ImgStatus",
                params.row.queryStatus
              );
              return h("span", { domProps: { title: list } }, list);
            }else{
              return h("span", "未发起查询");
            }
          }
        },
        {
          title: this.$t("m.i.common.showImg"),
          key: "showImg",
          hiddenCol: false,
          render: (h, params) => {
            if (params.row.queryStatus !== "BTL16") {
              return "";
            }
            return h(
              "a",
              {
                on: {
                  click: () => {
                    this.showImagePreCheck(params.row.id);
                  }
                }
              },
              "查看"
            );
          }
        }
      ],
      // imgUrl : "",
      selectData : null,
      // showImgWin : false,
      // 影像控件弹框轮播图数据url
      carouselData: {
        imgUrls: []
      },
      // 影像控件弹框轮播图表单
      carouselForm: {
        initialIndex: 0,    //初始图片位置
        showDialog: false,    //控制影像控件显隐
        tags: []          //图片提示
      },
      imgDetailWin : false,
      imgDetailData: {
        rows: [],
        total: 1
      },
      detailFormItem: {
        roleCode: "",
        roleName: "",
        kindCode: "",
        roleType: "",
        userRemark: "",
        bindTrader: "",
        brchNo: "",
        brchName:"",
        userNo:"",
        userName: "",
        loginStatus:"",
        authPath:this.$route.path,
        ownedBrchNos:"",
        ownedBrchNames:"",
      },
      detailColumns: [

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
            let list = this.getDictValueFromMap(
              this.dictMap,
              "ImgType",
              params.row.imgType
            );
            return h("span", { domProps: { title: list } }, list);
          }
        },
        {
          title: this.$t("m.i.common.queryStatus"),
          key: "queryStatus",
          hiddenCol: false,
          ellipsis: false,
          render: (h, params) => {
            if(params.row.queryStatus){
              let list = this.getDictValueFromMap(
                this.dictMap,
                "ImgStatus",
                params.row.queryStatus
              );
              return h("span", { domProps: { title: list } }, list);
            }else{
              return h("span", "未发起查询");
            }
          }
        },
        {
          title: this.$t("m.i.common.showImg"),
          key: "showImg",
          hiddenCol: false,
          render: (h, params) => {
            if (params.row.queryStatus !== "BTL16") {
              return "";
            }
            return h(
              "a",
              {
                on: {
                  click: () => {
                    this.showImageByAttachId(params.row.attachId);
                  }
                }
              },
              "查看"
            );
          }
        }
      ],
      currentSelectRow : null,
    };
  },
  watch :{
    imgDetailWin(val) {
      if (!val) {
        this.$nextTick(() => {
          this.$refs.imgDetailData.$refs.gridPage.clearElevator();
          this.$refs.imgDetailData.dataChange(this.$refs.imgDetailData.$refs.gridPage.currentPage);
        });
      }
      this.onMaximize();
    },
  },
  methods: {
    queryImg() {
      let selects = this.$refs.imgDatagrid.selects;
      if (selects === null || selects.length === 0) {
        this.$msgTip.info(this, {info: this.$t("m.i.common.chooseDataFirst")});
        return;
      }
      let imgBatchNos = selects.map(row => row.imgBatchNo);
      post(
        {imgBatchNos: this.$refs.imgDatagrid.selectIds},
        "/pc/img/imgUpRegister/commintQueryImgUpInfo"
      ).then(res => {
        if (res) {
          let msg = res.data.retMsg;
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.$msgTip.success(this);
          } else {
            this.$msgTip.error(this, {info: msg});
          }
          this.$refs.imgDatagrid.dataChange(
            this.$refs.imgDatagrid.pageInfo.pageNo
          );
          this.$refs.imgDatagrid.selects=[];
          this.$refs.imgDatagrid.selectIds=[];
        } else {
          this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
        }
      });
    },
    showImagePreCheck(id) {
      post(
        {id: id},
        "/pc/img/imgUpRegister/queryImagePreCheck"
      ).then(res => {
        if (res) {
          let msg = res.data.retMsg;
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            let retData = res.data.retData;
            if (retData.sumNum > 1){
              this.detailFormItem.id = id;
              this.imgDetailWin = true;

            } else {
              this.showImage(id);
            }
          } else {
            this.$msgTip.error(this, {info: msg});
          }
        } else {
          this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
        }
      });
    },
    showImage(id) {
      let list = this.$refs.imgDatagrid.$data.tData;
      let initialIndex = 0;
      let preUrl = window.LOCAL_CONFIG.API_HOME + "/pc/img/imgUpRegister/showImg?id=";
      this.carouselData.imgUrls = [];
      let tempImgIds = [];
      // this.carouselData.imgUrls.push(window.LOCAL_CONFIG.API_HOME + "/pc/img/imgUpRegister/showImg?id=" + id);
      for (let i = 0; i < list.length; i++) {
        if(!!list[i].id && list[i].queryStatus === "BTL16") {
          this.carouselData.imgUrls.push(preUrl + list[i].id);
          tempImgIds.push(list[i].id);
        }
      }
      for (let j = 0; j < tempImgIds.length; j++) {
        if (id === tempImgIds[j]) {
          initialIndex = j;
        }
      }
      setTimeout(() => {
        // this.showImgWin = true;
        this.carouselForm.showDialog = true;
        this.carouselForm.initialIndex = initialIndex;
      }, 100);
    },

    showImageByAttachId(attachId) {
      let list = this.$refs.imgDetailData.$data.tData;
      let initialIndex = 0;
      let preUrl = window.LOCAL_CONFIG.API_HOME + "/pc/img/imgUpRegister/showImgByAttachId?attachId=";
      this.carouselData.imgUrls = [];
      let tempImgIds = [];
      // this.carouselData.imgUrls.push(window.LOCAL_CONFIG.API_HOME + "/pc/img/imgUpRegister/showImg?id=" + id);
      for (let i = 0; i < list.length; i++) {
        if(!!list[i].attachId && list[i].queryStatus === "BTL16") {
          this.carouselData.imgUrls.push(preUrl + list[i].attachId);
          tempImgIds.push(list[i].attachId);
        }
      }
      for (let j = 0; j < tempImgIds.length; j++) {
        if (attachId === tempImgIds[j]) {
          initialIndex = j;
        }
      }
      setTimeout(() => {
        // this.showImgWin = true;
        this.carouselForm.showDialog = true;
        this.carouselForm.initialIndex = initialIndex;
      }, 100);
    },
    handleSearch() {
      if(typeof this.billId !== "undefined" && this.billId != "" && this.billId != null){
        this.imgFormItem.billId = this.billId;
        this.$nextTick(() => {
          this.$refs.imgDatagrid.dataChange(1);
          this.$refs.imgDatagrid.selects=[];
          this.$refs.imgDatagrid.selectIds=[];
        });
      }else{
        this.$msgTip.info(this, { info: "票据ID为空" });
        this.$nextTick(() => {
          this.$refs.imgDatagrid.$refs.gridContent.handleResize();
        });
      }

    },
    onMaximize() {
      setTimeout(() => {
        this.$refs.imgDetailData.$refs.gridContent.handleResize();
      }, 100);
    },
    handleCurrentChange(currentRow) {
      this.currentSelectRow = currentRow;
    },
    handleCurrentChangeCancel() {
      this.currentSelectRow = [];
    },
    handleClose() {
      this.$refs.datagrid.$refs.gridPage.clearElevator();
      this.imgDetailWin = false;
    }
  }
};
</script>
