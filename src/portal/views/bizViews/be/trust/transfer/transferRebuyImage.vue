<template>
  <div>
    <!--影像加载弹出框-->
    <h-msg-box v-model="tempImageWin" width="1000" :mask-closable="false" @on-close="handleClose" top="10"
               class="h-form-table-layer" :maximize="true" @on-maximize="onMaximize">
      <p slot="header">
        <span>{{title}}</span>
      </p>
      <!--查询表单-->
      <h-row name="flex" class="layout-menu-wrapper">
        <h-col span="24">
      <div>
        <div class="h-form-search-box">
          <h-form :model="formItem" :label-width="115" ref="formItem" cols="4" class="h-form-search">
            <h-form-item :label="$t('m.i.common.imgType')" prop="imgType">
              <h-select v-model="formItem.imgType" readonly placeholder="" showTitle>
                <h-option value="IM11">非交易过户</h-option>
              </h-select>
            </h-form-item>
            <h-form-item class="h-form-operate one-form">
              <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
              <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
            </h-form-item>
          </h-form>
        </div>
      </div>
        </h-col>
      </h-row>
      <!--数据展示表格-->
      <h-datagrid
        :columns="columns"
        hasPage
        highlight-row
        url="/be/trust/transfer/transferRebuyImage/func_queryTransferRebuyImagePage"
        :bindForm="formItem"
        showListCkeckBox
        :autoLoad=false
        :row-select="true"
        :has-select="false"
        ref="datagrid">
        <div slot="toolbar" class='pull-left'>
          <h-button type="primary" @click="sendQuery">{{$t('m.i.common.searchImg')}}</h-button>
          <h-button type="primary" @click="refresh">{{$t('m.i.config.refreshCache')}}</h-button>
        </div>
      </h-datagrid>
      <!-- 弹出框模式底部按钮 -->
      <div slot="footer">
        <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
      </div>
    </h-msg-box>

    <!-- 查看影像弹出框-->
    <h-msg-box title="影像查看" v-model="showImgWin" width="1000" :mask-closable="false" :footerHide="true"
               class="h-form-search-layer" top="10" :maximize="true">
      <img :src="imgUrl" width="100%"/>
    </h-msg-box>
    <!-- 查看票面 -->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId" :billNo="this.billNo"
                    :billRangeStart="this.billRangeStart" :billRangeEnd="this.billRangeEnd"></bill-info-main>
  </div>
</template>

<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";

  export default {
    name: "transferRebuyImage",
    data() {
      return {
          showBillInfoWin: false,
          billId: "",
        billRangeStart: "",
        billRangeEnd: "",
          billNo: "",
        formItem: {
          busiBatchId: "",
          listId: "",
          billRange: "",
          uploadStatus: "",
          imgType: "IM11"
        },
        columns: [
          {
            type: "selection",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.billPackageNo"),
            key: "billNo",
            hiddenCol: false,
            sortable: true,
              render: (h, params) => {
                  let info = "", type = "";
                  if (!!params.row.billId) {
                      info = params.row.billId;
                      type = "billId";
                  } else {
                      info = params.row.billNo;
                      type = "billNo";
                  }
                  return h("a", {
                      on: {
                          click: () => {
                              this.showBillInfo(info, type, params.row.billRangeStart, params.row.billRangeEnd);
                          }
                      }
                  }, params.row.billNo);
              }
          },
          {
            title: this.$t("m.i.billInfo.billRange"),
            key:"billRange",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.pageShowFormatBillRange(params.row.billRangeStart, params.row.billRangeEnd);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
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
              let list = this.getDictValueFromMap(this.dictMap, "ImgType", params.row.imgType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.common.status'),
            key: "queryStatus",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "ImgStatus", params.row.queryStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
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
              }, this.$t('m.i.common.view'))]);
            }
          }
        ],
        currentSelectList: [],
        dictMap: null,
        imgTypeList: [],
        imgStatusList: [],
        importWin: false,
        importSelect: true,
        imgDataFirst: false,
        isDisabled: false,
        showImgWin: false,
        imgUrl: ""
      };
    },
    props: {
      imageWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      title: {
        type: String,
        default: "影像加载"
      },
      imageParams: {
        type: Object,
        default() {
          return {
            busiBatchId: "",
            type: "",
            billRangeStart: "",
            billRangeEnd: "",
            listId: ""
          };
        }
      }
    },
    watch: {
      imageWin(val) {
        if (val === true) {
          this.$nextTick(() => {
            this.$refs.formItem.resetFields();
            this.formItem.listId = this.imageParams.listId;
            this.formItem.billRangeStart = this.imageParams.billRangeStart;
            this.formItem.billRangeEnd = this.imageParams.billRangeEnd;
            this.formSearch();
            this.isDisabled = false;
          });
        }
      },
      imgDataFirst(val) {
        this.importSelect = !this.importSelect;
      }
    },
    computed: {
      tempImageWin: {
        get() {
          return this.imageWin;
        },
        set() {
        }
      },
      tip() {
        return this.isDisabled ? "文件正在上传中..." : "提交";
      }
    },
    methods: {
      formatterSendStatus(value) {
        switch (value) {
          case "1":
            return "未发出查询";
          case "2":
            return "查询中";
          case "4":
            return "查询成功";
          case "3":
            return "查询失败";
          default:
            return "未发出查询";
        }
      },
      onMaximize() {
        setTimeout(() => {
          this.$refs.datagrid.$refs.gridContent.handleResize();
        }, 100);
      },
      formSearch() {
        this.currentSelectList = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
      },
      formateListData(list) {
        let ids = [];
        for (let i = 0, len = list.length; i < len; i++) {
          ids.push(list[i].id);
        }
        return ids.join(",");
      },
      handleClose() {
        this.$emit("imageWinClose", "");
      },
      handleProgress() {
        this.isDisabled = true;
      },
      sendQuery() {
        this.currentSelectList = this.$refs.datagrid.selects;
        if (this.currentSelectList == null || this.currentSelectList.length == 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        let ids = this.formateListData(this.currentSelectList);
        let url = "/be/trust/transfer/transferRebuyImage/func_sendImgQuery";
        post({ imageIdsStr: ids }, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.currentSelectList = [];
              this.$refs.datagrid.selectIds = [];
              this.$refs.datagrid.selects = [];
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      refresh() {
        this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
      },
      uploadSuccess(response, file) {
        let retCode = response.retCode;
        if (retCode === "000000") {
          this.$msgTip.success(this, { info: file.name + "上传成功" });
          this.importWin = false;
          this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
        } else {
          this.imgDataFirst = false;
          this.$refs.upload.clearFiles();
          this.$msgTip.error(this, { info: "文件上传失败:" + response.retMsg });
        }
        this.isDisabled = false;
      },
      uploadError(error, file) {
        this.$msgTip.error(this, { info: file.name + "上传失败" });
        this.imgDataFirst = false;
      },
      handleRemove(file) {
        this.$msgTip.success(this, { info: file.name + "已移除" });
        this.imgDataFirst = false;
      },
      //文件列表加入第一条数据时返回true，非第一条数据则不触发事件
      uploadGotoAdd(status) {
        this.imgDataFirst = status;
      },
      //查看影像
      showImage(list) {
        if (list.queryStatus != "BTL16") {
          this.$msgTip.info(this, { info: "只有发送状态为查询成功才能查看影像" });
          return;
        }
        this.imgUrl = window.LOCAL_CONFIG.API_HOME + "/be/trust/transfer/transferRebuyImage/func_showImg?id=" + list.id;
        this.showImgWin = true;
      },
        //票面
        billInfoWinClose(){
            this.showBillInfoWin = false;
        },
        showBillInfo(info, type, billRangeStart, billRangeEnd) {
            this.billId = "";
            this.billNo = "";
            if (type === "billId") {
                this.billId = info;
            } else {
                this.billNo = info;
            }
          this.billRangeStart = billRangeStart;
          this.billRangeEnd = billRangeEnd;
            this.showBillInfoWin = true;
        },
      pageShowFormatBillRange(billRangeStart, billRangeEnd) {
        if (billRangeStart == null || billRangeStart === ""
          || billRangeEnd == null || billRangeEnd === "") {
          return '-';
        }
        if (billRangeStart.toString() === '0' && billRangeEnd.toString() === '0') {
          return '0';
        }
        return billRangeStart.toString().padLeft(12, '0') + "," + billRangeEnd.toString().padLeft(12, '0');
      }
    },
    mounted() {
      this.getDictListByGroups("ImgType,ImgStatus").then(res => {
        this.imgTypeList = res.get("ImgType");
        this.imgStatusList = res.get("ImgStatus");
        this.dictMap = res.get("map");
      });
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
