<!--机构查询-->
<template>
  <div>
    <h-msg-box v-model="tempcheckImgWin" :maximize="true" @on-close="handleClose" width="1000"
               class="h-form-table-layer" @on-maximize="onMaximize">
      <p slot="header">
        <span>查看影像</span>
      </p>
      <!--数据展示表格-->
      <h-datagrid
        :columns="ImgDataColumns"
        url="/be/infoQuery/paperRegInfoQuery/paperRegInfoQueryAnswer/func_checkImg"
        highlight-row
        :bindForm="bills"
        :onCurrentChange="handlelRowClick"
        :onCurrentChangeCancel="handlelRowClickClose"
        :autoLoad=false
        showListCkeckBox
        ref="datagrid">
        <div slot="toolbar" class="pull-left">
          <h-button type="primary" @click="checkCPESImg()">{{$t('m.i.common.searchImg')}}</h-button>
          <h-button type="primary" @click="refresh()">{{$t('m.i.config.refreshCache')}}</h-button>
        </div>
      </h-datagrid>
      <div slot="footer">
        <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
      </div>
    </h-msg-box>
    <!-- 查看影像弹出框-->
    <h-msg-box title="影像查看" v-model="showImgWin" width="1000" :mask-closable="false" :footerHide="true" :z-index=1010
               class="h-form-search-layer" top="10" :maximize="true">
      <img :src="this.imgUrl" width="100%" height="600"/>
    </h-msg-box>
  </div>
</template>

<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";

  export default {
    name: "checkImg",
    data() {
      return {
        currentSelectRow: [],
        showImgWin: false,
        imgUrl: "",
        dictMap: new Map(),
        ImgDataColumns: [
          {
            title: " ",
            type: "radio",
            width: 50,
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
            title: this.$t("m.i.common.imgType"),
            key: "imgType",
            hiddenCol: false,
            ellipsis: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "ImgType", params.row.imgType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.common.imgBatchNo'),
            key: "imgBatchNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.common.queryStatus'),
            key: "queryStatus",
            hiddenCol: false,
            render: (h, params) => {
              return h("div", [
                h("span", this.formatterqueryStatus(params.row.queryStatus))
              ]);
            }
          },
          {
            title: this.$t("m.i.common.showImg"),
            key: "showImg",
            hiddenCol: false,
            render: (h, params) => {
              return h("div", [h("h-button", {
                props: {
                  type: "primary",
                  size: "small"
                },
                on: {
                  "click": () => {
                    this.showImage(params.row);
                  }
                }
              }, this.$t("m.i.common.view"))]);
            }
          }
        ]
      };
    },
    props: {
      title: String,
      bills: {
        type: Object,
        required: true
      },
      showmsg: {
        type: Boolean,
        default() {
          return false;
        }
      },
      checkImgWin: {
        type: Boolean,
        default() {
          return false;
        }
      }
    },
    methods: {
      onMaximize() {
        setTimeout(() => {
          this.$refs.datagrid.$refs.gridContent.handleResize();
        }, 100);
      },
      handleClose() {
        this.$emit("checkImgWinClose", "");
      },
      handlelRowClick(arr, oldArr, index) {
        this.currentSelectRow = arr;
      },
      handlelRowClickClose() {
        this.currentSelectRow = [];
      },
      checkCPESImg() {
        let list = this.currentSelectRow;
        if (list == null || list.length <= 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        post({ id: list.busiImgId,imgBatchNo:list.imgBatchNo }, "/be/infoQuery/paperRegInfoQuery/paperRegInfoQueryAnswer/func_submitImgQueryApply").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$msgTip.success(this);
            } else {
              let retMsg = res.data.retMsg;
              this.$msgTip.error(this, { info: retMsg });
            }
          } else {
            let retMsg = this.$t("m.i.common.netError");
            this.$msgTip.error(this, { info: retMsg });
          }
        });
      },
      refresh() {
        this.currentSelectRow = [];
        this.$refs.datagrid.dataChange(1);
      },
      //查看影像
      showImage(list) {
        if (list.queryStatus != "BTL16") {
          this.$msgTip.info(this, { info: "只有查询状态为查询成功才能查看影像" });
          return;
        }
        this.imgUrl = window.LOCAL_CONFIG.API_HOME + "/pc/img/imgUpRegister/showImg?id=" + list.busiImgId;
        setTimeout(() => {
          this.showImgWin = true;
        }, 100);
      },
      formatterqueryStatus(value) {
        switch (value) {
          case "BTL15":
            return "已发出查询";
          case "BTL16":
            return "查询成功";
          case "BTL17":
            return "查询失败";
          default:
            return "未发出查询";
        }
      }
    },
    mounted() {
      this.getDictListByGroups("ImgType,ImgStatus").then(res => {
        this.dictMap = res.get("map");
      });
    },
    watch: {
      showmsg() {
        this.$nextTick(() => {
          this.$refs.datagrid.dataChange(1);
        });
      }
    },
    computed: {
      tempcheckImgWin: {
        get() {
          return this.showmsg;
        },
        set() {
        }
      }
    }
  };
</script>

