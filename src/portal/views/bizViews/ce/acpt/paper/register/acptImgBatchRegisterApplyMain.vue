<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <show-branch v-model="formItem.rgstBrchNoList" :label="$t('m.i.ce.rgstBrchName')" prop="rgstBrchNoList"
                             title="机构名称" :showCheckBox="true" :brchNo.sync="formItem.rgstBrchNoList"
                             :brchName.sync="formItem.rgstBrchNameList"></show-branch>
                <h-form-item prop="packageName" :label="$t('m.i.ce.packageName')">
                  <h-input v-model="formItem.packageName" placeholder=""></h-input>
                </h-form-item>
                <h-form-item class="h-form-operate two-form">
                  <h-button type="primary" @click="handleSearch()">{{ $t("m.i.common.search") }}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{ $t("m.i.common.reset") }}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid :columns="columns"
                      url="/ce/acpt/paper/register/acptImgBatchRegisterApplyMain/func_pagingQueryAcptImgPackage"
                      highlightRow
                      :bindForm="formItem"
                      :on-current-change="handleRowClick"
                      :on-current-change-cancel="handleRowClickCancel"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="showBatchUpload">{{ $t("m.i.ce.batchUploadImg") }}</h-button>
              <h-button type="primary" @click="batchMatchImgRgst">{{ $t("m.i.ce.batchMatchRgst") }}</h-button>
              <h-button type="primary" @click="showImgFailInfoMessage">{{ $t("m.i.ce.checkErrorMessage") }}</h-button>
              <h-button type="primary" @click="deleteImgRgstInfo">{{ $t("m.i.ce.deleteRgstInfo") }}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--    查看错误信息-->
    <h-msg-box v-model="checkFailInfoWin" width="1000" class="h-form-search-layer" :maximize="true"
               :mask-closable="false" top="50">
      <p slot="header">查看错误信息</p>
      <!-- 数据展示表格 -->
      <h-datagrid :columns="failInfoColumns"
                  :url="failInfoUrl"
                  highlightRow
                  :bindForm="failInfoFormItem"
                  ref="failInfoDatagrid">
      </h-datagrid>
      <div slot="footer">
        <h-button type="ghost" style="margin:0 8px" @click="checkFailInfoWin=!checkFailInfoWin">
          {{ $t("m.i.common.close") }}
        </h-button>
      </div>
    </h-msg-box>
    <!--    批量上传影像-->
    <h-msg-box :title="$t('m.i.ce.batchUploadImg')" v-model="imgBatchUploadWin" :mask-closable="false"
               class="h-form-search-layer" height="255" width="650"
               :footerHide="true" :z-index="2000">
      <h-upload :action="fileComitUrl"
                :format="['zip']"
                :max-size="51200"
                :with-credentials="true"
                :on-format-error="handleFormatError"
                :on-progress="handleProgress"
                :on-success="uploadSuccess"
                :on-error="uploadError"
                :on-exceeded-size="handleMaxSize"
                :on-remove="handleRemove"
                @on-goto-add="uploadGotoAdd"
                ref="upload"
                selfConfig
                uploadAll
                :class="{'h-upload-goto-add': btnShow}">
        <h-button type="primary" icon="ios-cloud-upload-outline" v-if="fileSelect" slot="chooseFile">
          {{ $t("m.i.common.chooseImportFile") }}
        </h-button>
        <h-button type="primary" icon="ios-cloud-upload-outline" v-if="!fileSelect" slot="postFile"
                  :disabled="isDisabled">{{ tip }}
        </h-button>
      </h-upload>
      <h-card style="margin-top:20px">
        <p style="padding-bottom: 10px">请将需要上传的所有承兑影像放入一个文件夹，然后将文件夹压缩为“.zip”或“.ZIP”格式再选择导入；</p>
        <p style="padding-bottom: 10px">影像压缩包请勿大于50MB；</p>
        <p style="padding-bottom: 10px">影像图片请符合“.jpg”或“.JPG”格式，单张影像图片请勿大于512KB；</p>
        <p style="padding-bottom: 10px">承兑正面影像：同一票据只能上传一张，命名规则：“票号.jpg”；</p>
      </h-card>
    </h-msg-box>
  </div>

</template>

<script>
import {post} from "@/api/bizApi/commonUtil";

export default {
  name: "acptImgBatchRegisterApplyMain",
  data() {
    return {
      //showBranchWin: false,
      checkFailInfoWin: false,
      isDisabled: false,
      fileComitUrl: window.LOCAL_CONFIG.API_HOME + "/ce/acpt/paper/register/acptImgBatchRegisterApplyMain/func_uploadAcptImgPackage",
      failInfoUrl: "/ce/acpt/paper/register/acptImgBatchRegisterApplyMain/func_pagingQueryAcptImgErrorInfo",
      fileSelect: true,
      btnShow: false,
      imgBatchUploadWin: false,
      currentSelectRow: [],
      ImgBatchUploadStautList: [],
      dictMap: new Map(),
      formItem: {
        packageName: "",
        imgBusiType: "acptImage",
        inOutFlag: "1",
        rgstBrchNameList: JSON.parse(window.sessionStorage.getItem("userInfo")).brchName,
        rgstBrchNoList: JSON.parse(window.sessionStorage.getItem("userInfo")).brchNo,
      },
      failInfoFormItem: {
        attachId: ""
      },
      columns: [
        {
          title: " ",
          type: "radio",
          align: "center",
          width: 50
        },
        {
          type: "index",
          key: "numOrder",
          title: this.$t("m.i.common.index"),
          width: 60,
          align: "center",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.ce.packageName"),
          key: "packageName",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.fileNo"),
          key: "attachId",
          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.ce.matchSuccNum"),
          key: "matchSuccNum",
          hiddenCol: false,
          render: (h, params) => {
            let succNum = params.row.matchSuccNum;
            if (params.row.matchSuccNum === null || params.row.matchSuccNum === "") {
              succNum = "-";
            }
            return h("span", succNum);
          }
        },
        {
          title: this.$t("m.i.ce.matchFailNum"),
          key: "matchFailNum",
          hiddenCol: false,
          render: (h, params) => {
            let succNum = params.row.matchFailNum;
            if (params.row.matchFailNum === null || params.row.matchFailNum === "") {
              succNum = "-";
            }
            return h("span", succNum);
          }
        },
        {
          title: this.$t("m.i.ce.rgstSuccNum"),
          key: "rgstSuccNum",
          hiddenCol: false,
          render: (h, params) => {
            let succNum = params.row.rgstSuccNum;
            if (params.row.rgstSuccNum === null || params.row.rgstSuccNum === "") {
              succNum = "-";
            }
            return h("span", succNum);
          }
        },
        {
          title: this.$t("m.i.ce.rgstFailNum"),
          key: "rgstFailNum",
          hiddenCol: false,
          render: (h, params) => {
            let succNum = params.row.rgstFailNum;
            if (params.row.rgstFailNum === null || params.row.rgstFailNum === "") {
              succNum = "-";
            }
            return h("span", succNum);
          }
        },
        {
          title: this.$t("m.i.pc.dealStatus"),
          key: "dealStatus",
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = this.getDictValueFromMap(this.dictMap, "ImgBatchUploadStauts", params.row.dealStatus);
            return h("span", {domProps: {title: dictValue}}, dictValue);
          }
        },
        {
          title: this.$t("m.i.auth.uploadDt"),
          key: "uploadDtTm",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            let uploadDtTm = this.$moment(params.row.uploadDtTm, "YYYYMMDDHHmmss").format("YYYY-MM-DD HH:mm:ss");
            return h("span", uploadDtTm);
          }
        },
        {
          title: this.$t("m.i.common.operTellerNo"),
          key: "operTellerNo",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.operBrchName"),
          key: "brchName",
          hiddenCol: false
        }
      ],
      failInfoColumns: [
        {
          type: "index",
          key: "numOrder",
          title: this.$t("m.i.common.index"),
          width: 60,
          align: "center",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.fileNo"),
          key: "attachId",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.billNo"),
          key: "billNo",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.imgType"),
          key: "imgType",
          hiddenCol: false,
          render: (h, params) => {
            let list = this.getDictValueFromMap(this.dictMap, "ImgType", params.row.imgType);
            return h("span", {domProps: {title: list}}, list);
          }
        },
        {
          title: this.$t("m.i.bm.failType"),
          key: "failType",
          hiddenCol: false,
          render: (h, params) => {
            let list = this.getDictValueFromMap(this.dictMap, "ImgBatchUpFailInfoType", params.row.failType);
            return h("span", {domProps: {title: list}}, list);
          }
        },
        {
          title: this.$t("m.i.common.failReason"),
          key: "failInfo",
          hiddenCol: false
        }
      ]
    };
  },
  watch: {
    btnShow(val) {
      this.fileSelect = !this.fileSelect;
    }
  },
  computed: {
    tip() {
      return this.isDisabled ? "文件正在上传中..." : "提交";
    }
  },
  mounted() {
    this.getDictListByGroups("ImgType,ImgBatchUploadStauts,ImgBatchUpFailInfoType").then(res => {
      this.ImgBatchUploadStautList = res.get("ImgBatchUploadStauts");
      this.dictMap = res.get("map");
    });
  },
  methods: {
    handleRowClick(arr) {
      this.currentSelectRow = arr;
    },
    handleRowClickCancel() {
      this.currentSelectRow = [];
    },
    //表单查询
    handleSearch() {
      this.currentSelectRow = [];
      this.$refs.datagrid.dataChange(1);
    },
    //重置表单查询结果
    resetSearch() {
      this.$refs.formItem.resetFields();
      this.formItem.rgstBrchNameList = JSON.parse(window.sessionStorage.getItem("userInfo")).brchName;
      this.formItem.rgstBrchNoList = JSON.parse(window.sessionStorage.getItem("userInfo")).brchNo;
    },
    // 文件上传
    handleFormatError(file) {
      this.$msgTip.error(this, {info: "文件 " + file.name + " 格式不正确，请上传.zip文件。"});
    },
    handleProgress() {
      this.isDisabled = true;
    },
    uploadSuccess(response, file) {
      let retCode = response.retCode;
      if (retCode === "000000") {
        this.$msgTip.success(this, {info: file.name + "上传成功"});
        this.imgBatchUploadWin = false;
        this.$refs.datagrid.dataChange(1);
      } else {
        this.$refs.upload.clearFiles();
        this.btnShow = false;
        this.$msgTip.error(this, {info: "文件上传失败:" + response.retMsg});
      }
      this.isDisabled = false;
    },
    uploadError(error, file) {
      this.$msgTip.error(this, {info: file.name + "上传失败"});
      this.isDisabled = false;
      this.btnShow = false;
    },
    handleMaxSize(file) {
      this.$msgTip.error(this, {info: "文件 " + file.name + " 太大，不能超过50MB"});
    },
    handleRemove(file) {
      this.$msgTip.success(this, {info: file.name + "已移除"});
      this.btnShow = false;
      this.isDisabled = false;
    },
    uploadGotoAdd(status) {
      this.btnShow = status;
    },
    //查看错误信息
    showImgFailInfoMessage() {
      if (this.currentSelectRow.length === 0) {
        this.$msgTip.info(this, {info: this.$t("m.i.common.chooseDataFirst")});
        return;
      }
      this.failInfoFormItem.attachId = this.currentSelectRow.attachId;
      this.checkFailInfoWin = true;
      this.$nextTick(() => {
        this.$refs.failInfoDatagrid.dataChange(1);
      });
    },
    showBatchUpload() {
      this.btnShow = false;
      this.imgBatchUploadWin = true;
      this.$nextTick(() => {
        this.$refs.upload.clearFiles();
      });
    },
    batchMatchImgRgst() {
      if (this.currentSelectRow.length === 0) {
        this.$msgTip.info(this, {info: this.$t("m.i.common.chooseDataFirst")});
        return;
      }
      if (this.currentSelectRow.matchSuccNum > 0 && this.currentSelectRow.matchSuccNum === this.currentSelectRow.rgstSuccNum) {
        this.$msgTip.error(this, {info: "此记录已经匹配登记完成，请勿重复匹配登记"});
        return;
      }
      this.$hMsgBox.confirm({
        title: "匹配登记",
        content: "确定匹配登记吗?",
        onOk: () => {
          let url = "/ce/acpt/paper/register/acptImgBatchRegisterApplyMain/func_matchAcptImgPackage";
          post({id: this.currentSelectRow.id}, url).then(res => {
            if (res) {
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.$msgTip.success(this, {info: "匹配完成"});
                this.$refs.datagrid.dataChange(1);
              } else {
                this.$msgTip.error(this, {info: res.data.retMsg});
              }
            } else {
              this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
            }
          });
        }
      });
    },
    deleteImgRgstInfo() {
      if (this.currentSelectRow.length === 0) {
        this.$msgTip.info(this, {info: this.$t("m.i.common.chooseDataFirst")});
        return;
      }
      this.$hMsgBox.confirm({
        title: this.$t("m.i.common.confirm"),
        content: this.$t("m.i.common.isConfirmDelete") + "?",
        onOk: () => {
          let url = "/ce/acpt/paper/register/acptImgBatchRegisterApplyMain/func_deleteAcptImgPackage";
          post({id: this.currentSelectRow.id}, url).then(res => {
            if (res) {
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.$msgTip.success(this, {info: "删除成功"});
                this.$refs.datagrid.dataChange(1);
              } else {
                this.$msgTip.error(this, {info: res.data.retMsg});
              }
            } else {
              this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
            }
          });
        }
      });
    }
  }
};
</script>
