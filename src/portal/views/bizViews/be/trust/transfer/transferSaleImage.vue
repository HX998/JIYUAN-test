<template>
  <div>
    <!--影像加载弹出框-->
    <h-msg-box v-model="tempImageWin" width="1000" :mask-closable="false" @on-close="handleClose" top="10"
               class="h-form-search-layer" :maximize="true">
      <p slot="header">
        <span>{{title}}</span>
      </p>
      <!--查询表单-->
      <div>
        <h-form :model="formItem" :label-width="115" ref="formItem" cols="4" class="h-form-search">
          <h-form-item :label="$t('m.i.common.imgType')" prop="imgType">
            <h-select v-model="formItem.imgType" readonly placeholder="">
              <h-option value="IM11">非交易过户</h-option>
            </h-select>
          </h-form-item>
          <h-form-item class="h-form-operate one-form">
            <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
            <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
          </h-form-item>
        </h-form>
      </div>
      <!--数据展示表格-->
      <h-datagrid
        :columns="columns"
        hasPage
        highlight-row
        url="/be/trust/transfer/func_queryTransferSaleImagePage"
        :bindForm="formItem"
        showListCkeckBox
        :autoLoad=false
        :row-select="true"
        :has-select="false"
        ref="datagrid">
        <div slot="toolbar" class='pull-left'>
          <h-button type="primary" @click="imageAddClick()" v-if="authObj.imageAdd">{{$t("m.i.common.imageAdd")}}
          </h-button>
          <h-button type="primary" @click="imageOperateClick('register')" v-if="authObj.imageRegister">
            {{$t('m.i.be.upload')}}
          </h-button>
          <h-button type="primary" @click="imageOperateClick('delete')" v-if="authObj.imageDelete">
            {{$t("m.i.common.delete")}}
          </h-button>
        </div>
      </h-datagrid>
      <!-- 弹出框模式底部按钮 -->
      <div slot="footer">
        <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
      </div>
    </h-msg-box>
    <!-- 影像文件导入弹出框-->
    <h-msg-box :title="title" v-model="importWin" :mask-closable="false" class="h-form-search-layer" height="150"
               :footerHide="true">
      <h-upload :action="imageUploadUrl"
                :data="formItem"
                :format="['jpg']"
                :max-size="512"
                :with-credentials="true"
                :on-format-error="handleFormatError"
                :on-exceeded-size="handleMaxSize"
                :on-progress="handleProgress"
                :on-success="uploadSuccess"
                :on-error="uploadError"
                :on-remove="handleRemove"
                @on-goto-add="uploadGotoAdd"
                ref="upload"
                selfConfig
                uploadAll
                :class="{'h-upload-goto-add': imgDataFirst}">
        <h-button type="primary" icon="ios-cloud-upload-outline" slot="chooseFile" v-if="importSelect">{{$t("m.i.common.chooseImportFile")}}</h-button>
        <h-button type="primary" icon="ios-cloud-upload-outline" slot="postFile" v-if="!importSelect"
                  :disabled="isDisabled">{{tip}}
        </h-button>
      </h-upload>
    </h-msg-box>
    <!-- 查看影像弹出框-->
    <h-msg-box title="影像查看" v-model="showImgWin" width="1000" :mask-closable="false" :footerHide="true"
               class="h-form-search-layer" top="10" :maximize="true">
      <img :src="imgUrl" width="100%"/>
    </h-msg-box>
    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"
                    :billNo="this.billNo" :billRangeStart="this.billRangeStart" :billRangeEnd="this.billRangeEnd"
                    ref="billInfoMain"></bill-info-main>
  </div>
</template>

<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";

  export default {
    name: "transferSaleImage",
    data() {
      return {
          showBillInfoWin: false,
          billId: "",
          billNo: "",
        billRangeStart: null,
        billRangeEnd: null,
        formItem: {
          busiBatchId: "",
          listId: "",
          uploadStatus: "",
          billRange: "",
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
                return h("a", {
                    on: {
                        click: () => {
                            this.showBillInfo(params.row.billId, params.row.billNo, params.row.billRangeStart, params.row.billRangeEnd);
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
            key: "applStatus",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "ImgStatus", params.row.applStatus);
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
              return h("a", {
                on: {
                  click: () => {
                    this.showImage(params.row.id);
                  }
                }
              }, this.$t('m.i.common.view'));
            }
          }
        ],
        currentSelectList: [],
        dictMap: null,
        imgTypeList: [],
        uploadStatusList: [],
        importWin: false,
        imageUploadUrl: window.LOCAL_CONFIG.API_HOME + "/be/trust/transfer/func_addTransferSaleImage",
        importSelect: true,
        imgDataFirst: false,
        isDisabled: false,
        showImgWin: false,
        imgUrl: ""
      };
    },
    props: {
      authObj: {
        type: Object,
        default() {
          return {
            imageAdd: true,           //影像新增
            imageRegister: true,      //上传
            imageDelete: true         //删除
          };
        }
      },
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
          this.$refs.formItem.resetFields();
          this.formItem.busiBatchId = this.imageParams.busiBatchId;
          this.formItem.listId = this.imageParams.listId;
          this.formItem.billRangeStart = this.imageParams.billRangeStart;
          this.formItem.billRangeEnd = this.imageParams.billRangeEnd;
          if (this.imageParams.type === "view") {
            this.authObj.imageAdd = false;
            this.authObj.imageRegister = false;
            this.authObj.imageDelete = false;
          } else {
            this.authObj.imageAdd = true;
            this.authObj.imageRegister = true;
            this.authObj.imageDelete = true;
          }
          this.formSearch();
          this.isDisabled = false;
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
      formSearch() {
        this.currentSelectList = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
      },
      //影像新增
      imageAddClick() {
        if (this.formItem.imgType !== "") {
          this.imgDataFirst = false;
          this.importWin = true;
          this.$nextTick(() => {
            this.$refs.upload.clearFiles();
          });
        } else {
          this.$msgTip.info(this, { info: "请先选择影像类型" });
        }
      },
      //影像上传/删除
      imageOperateClick(str) {
        this.currentSelectList = this.$refs.datagrid.selects;
        if (this.currentSelectList != null && this.currentSelectList.length > 0) {
          if (str === "register" && this.currentSelectList[0].applStatus !== "BTL01") {
            this.$msgTip.info(this, { info: "只有上传状态为已录入的影像才能上传！" });
            return;
          }
          let url = str === "register" ? "/be/trust/transfer/func_uploadTransferSaleImage" : "/be/trust/transfer/func_deleteTransferSaleImage";
          let title = str === "register" ? "上传影像信息" : "删除影像信息";
          let content = str === "register" ? "确定要上传吗?" : "确定要删除吗?";
          this.$hMsgBox.confirm({
            title: title,
            content: content,
            onOk: () => {
              this.handleOperate(url);
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      handleOperate(url) {
        let ids = this.formateListData(this.currentSelectList);
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
      handleFormatError(file) {
        this.$msgTip.error(this, { info: "文件 " + file.name + " 格式不正确，请上传jpg格式的图片" });
      },
      handleProgress() {
        this.isDisabled = true;
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
      showImage(id) {
        this.imgUrl = window.LOCAL_CONFIG.API_HOME + "/be/trust/transfer/transferSaleImage/func_showImg?id=" + id;
        this.showImgWin = true;
      },
      handleMaxSize(file) {
        this.$msgTip.error(this, { info: "文件 " + file.name + " 太大，不能超过512KB" });
      },
        billInfoWinClose() {
            this.billId = "";
            this.billNo = "";
            this.billRangeStart = null;
            this.billRangeEnd = null;
            this.showBillInfoWin = false;
        },
        showBillInfo(billId, billNo,billRangeStart,billRangeEnd) {
            this.billId = billId;
            this.billNo = billNo;
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
      this.getDictListByGroups("ImgType,ImgUploadStauts,ImgStatus").then(res => {
        this.imgTypeList = res.get("ImgType");
        this.uploadStatusList = res.get("ImgUploadStauts");
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
