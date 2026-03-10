<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
   <!--             <h-form-item prop="rgstBrchNameList" :label="$t('m.i.ce.rgstBrchName')">
                  <h-input v-model="formItem.rgstBrchNameList" placeholder="" readonly
                           icon="android-search" @on-click="queryBranchTree()"></h-input>
                </h-form-item>-->
                <show-branch v-model="formItem.rgstBrchNoList" :label="$t('m.i.ce.rgstBrchName')" prop="rgstBrchNoList"
                             title="机构名称" :showCheckBox="true" :brchNo.sync="formItem.rgstBrchNoList" :brchName.sync="formItem.rgstBrchNameList"></show-branch>
                <h-form-item prop="billNo" :label="$t('m.i.billInfo.billNo')">
                  <h-input v-model="formItem.billNo" placeholder="" :maxlength="30"></h-input>
                </h-form-item>
                <h-form-item prop="minBillMoney" :label="$t('m.i.billInfo.billMoney')">
                  <h-row>
                    <h-col span="11">
                      <h-typefield v-model="formItem.minBillMoney" integerNum="10" placeholder="" type="money"
                                   bigTips></h-typefield>
                    </h-col>
                    <h-col span="2" style="text-align: center">至</h-col>
                    <h-col span="11">
                      <h-typefield v-model="formItem.maxBillMoney" integerNum="10" placeholder="" type="money"
                                   bigTips></h-typefield>
                    </h-col>
                  </h-row>
                </h-form-item>
                <h-form-item :label="$t('m.i.ce.rgstDt')" prop="minRgstApplDt">
                  <h-date-picker :value="rgstApplDt" type="daterange" autoPlacement showFormat :editable=false
                                 @on-change="handleRgstDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item prop="rgstStatus" :label="$t('m.i.ce.rgstStatus')">
                  <h-select v-model="formItem.rgstStatus" placeholder="">
                    <h-option v-for="item in rgstStatusList" :value="item.key" :key="item.key">{{item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.remitDt')" prop="minRemitDt">
                  <h-date-picker :value="remitDt" type="daterange" autoPlacement showFormat :editable=false
                                 @on-change="handleRemitDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.dueDt')" prop="minDueDt">
                  <h-date-picker :value="dueDt" type="daterange" autoPlacement showFormat :editable=false
                                 @on-change="handleDueDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item prop="paymentFlag" :label="$t('m.i.bs.settleStatus')">
                  <h-select v-model="formItem.paymentFlag" placeholder="">
                    <h-option v-for="item in paymentFlagList" :value="item.key" :key="item.key">{{item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item prop="drweBankNo" :label="$t('m.i.billInfo.drweBankNo')">
                  <h-input v-model="formItem.drweBankNo" placeholder=""  clearable @on-clear="clearDrweBankNo"
                           icon="android-search" @on-click="queryCpesBranchCode('drwe')"></h-input>
                </h-form-item>
                <h-form-item prop="acptBankNo" :label="$t('m.i.billInfo.acptBankNo')" class="h-form-long-label">
                  <h-input v-model="formItem.acptBankNo" placeholder=""  clearable @on-clear="clearAcptBankNo"
                           icon="android-search" @on-click="queryCpesBranchCode('acpt')"></h-input>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t("m.i.common.searchAdvanced")}}
                    <i class="icon iconfont"
                       :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid :columns="columns"
                      url="/ce/cpesrgst/acptRgst/acptRgstTrackSearch/func_pagingQueryPaperRgstTrackSearch"
                      :bindForm="formItem"
                      :has-select="false"
                      :row-select="true"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="exportExcel">{{$t("m.i.common.export")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <!-- 查看票面 -->
    <rgst-bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"
                    :billNo="this.billNo"></rgst-bill-info-main>

    <!-- 机构名称选择弹窗框 -->
   <!-- <show-branch :showBranchWin="showBranchWin" title="查询机构树多选" @brchNoChange="brchNoChange" ifcheck="true"
                 :checkStrictly="true" @showBranchWinClose="showBranchWinClose"></show-branch>-->

    <!-- 影像维护 -->
    <image-loading
      :imageWin="showUploadImageWin"
      :imageParams="imageParams"
      :isReadonly="true"
      :showAcptSearch="true"
      :showMain="false"
      :showImgPlat="true"
      :couldDel="false"
      @imageWinClose="uploadImageWinClose"></image-loading>

    <!-- 明细导出 -->
    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param"
                           :rows="this.rows"></common-excel-download>
    <!-- 票交所机构 -->
    <show-cpes-branch :showCpesBranch="showCpesBranchWin" @showCpesBranchClose="showCpesBranchClose" :memberId="queryMemberId"
                      @showCpesBranchSubmit="showCpesBranchSubmit"></show-cpes-branch>
  </div>
</template>

<script>
  import { post, on, off, getDictListByGroups, getDictValueFromMap, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "acptRgstTrackSearch",
    components: {
      // ShowBranch: () => import(/* webpackChunkName: "sm/auth/branch/showBranch" */`@/views/bizViews/sm/auth/branch/showBranch`)
      ShowCpesBranch: () => import(/* webpackChunkName: "shcpe/cpes/branch/showCpesBranch" */`@/views/bizViews/shcpe/cpes/branch/showCpesBranch`)
    },
    data() {
      return {
        //导出
        tempShowExcelTemplateWin: false,
        param: null,
        rows: null,
        //字典值
        dictMap: new Map(),
        rgstStatusList: [],
        paymentFlagList: [],
        queryMemberId: JSON.parse(window.sessionStorage.getItem('userInfo')).memberId,
        //机构树多选
        //showBranchWin: false,
        //影像上传
        showUploadImageWin: false,
        showCpesBranchWin: false,
        cpesBranchType: "",
        propsVue: "acptRgstTrackSearch",
        imageParams: {
          listId: "",
          imgBusiType: "acptImage",
          imgType:"IM07",
          prodNo: "RI00",
          imgTypeList: [],
          imageUrl: "/ce/cpesrgst/acptRgst/acptRgstTrackSearch/func_pagingQueryPaperRgstImg", //查询可查看影像url
          imageUploadUrl: "/ce/cpesrgst/acptRgst/acptRgstTrackSearch/func_saveImg", //影像上传url
          imageRegisterUrl: "/ce/cpesrgst/acptRgst/acptRgstTrackSearch/func_sendImgRgstMsg", //影像登记url
          imageDeleteUrl: "/ce/cpesrgst/acptRgst/acptRgstTrackSearch/func_deleteImg", //影像删除url
          imgShowUrl: "/ce/cpesrgst/acptRgst/acptRgstTrackSearch/func_showImg?id=", //查看影像url
          busiType: "RI07",
          billNo: ""
        },
        showBillInfoWin: false,
        billId: "",
        billNo: "",
        remitDt: [],
        dueDt: [],
        rgstApplDt: [],
        ifShowMore: false,
        formItem: {
          rgstClass: "RI00",
          rgstBrchNameList: JSON.parse(window.sessionStorage.getItem("userInfo")).brchName,
          rgstBrchNoList: JSON.parse(window.sessionStorage.getItem("userInfo")).brchNo,
          billNo: "",
          minBillMoney: "",
          maxBillMoney: "",
          minRgstApplDt: "",
          maxRgstApplDt: "",
          minRemitDt: "",
          maxRemitDt: "",
          minDueDt: "",
          maxDueDt: "",
          rgstStatus: "",
          drweBankNo:"",
          drweBankName: "",
          paymentFlag: "",
          acptBankNo: "",
          acptBankName: ""
        },
        columns: [
          {
            type: "selection",
            key: "multiSelect",
            width: 60,
            hiddenCol: false
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
            title: this.$t("m.i.common.acptImage"),
            key: "acptImage",
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.rgstStatus === "BTA04") {
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
                        this.openImgWin(params.row.id, params.row.billNo);
                      }
                    }
                  }, "维护")
                ]);
              }
            }
          },
          {
            title: this.$t("m.i.ce.rgstApplDt"),
            key: "rgstApplDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.rgstApplDt == null || params.row.rgstApplDt === "") {
                return "";
              }
              let date = this.$moment(params.row.rgstApplDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.ce.registerStatus"),
            key: "rgstStatus",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "AcptRgstStatus", params.row.rgstStatus);
              return h("span", { domProps: { title: dictValue } }, dictValue);
            }
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
              return h("span", { domProps: { title: dictValue } }, dictValue);
            }
          },
          {
            title: this.$t("m.i.billInfo.billNo"),
            key: "billNo",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params.row.id, params.row.billNo);
                  }
                }
              }, params.row.billNo);
            }
          },
          {
            title: this.$t("m.i.billInfo.billMoney"),
            key: "billMoney",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let billMoney = formatNumber(params.row.billMoney, 2, ",");
              return h("span", {
                domProps: {
                  title: billMoney
                }
              }, billMoney);
            }
          },
          {
            title: this.$t("m.i.billInfo.remitDt"),
            key: "remitDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.remitDt == null || params.row.remitDt === "") {
                return "";
              }
              let date = this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.billInfo.dueDt"),
            key: "dueDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.dueDt == null || params.row.dueDt === "") {
                return "";
              }
              let date = this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.ce.rgstBrchName"),
            key: "rgstBrchName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.drwrName"),
            key: "drwrName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.drwrAcctNo"),
            key: "drwrAcctNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.drwrBankNo"),
            key: "drwrBankNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.drwrBankName"),
            key: "drwrBankName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.pyeeName"),
            key: "pyeeName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.pyeeAcctNo"),
            key: "pyeeAcctNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.pyeeBankNo"),
            key: "pyeeBankNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.acptName"),
            key: "acptName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.billInfo.acptAcctNo"),
            key: "acptAcctNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.acptDt"),
            key: "acptDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.acptDt == null || params.row.acptDt === "") {
                return "";
              }
              let date = this.$moment(params.row.acptDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.billInfo.acptBankNo"),
            key: "acptBankNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.drweBankNo"),
            key: "drweBankNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.dataSource"),
            key: "dataSource",
            hiddenCol: false,
            render: (h, params) => {
              let flag = "";
              if (params.row.dataSource === "1") {
                flag = "是";
              } else if (params.row.dataSource === "2") {
                flag = "否";
              }
              return h("span", { domProps: { title: flag } }, flag);
            }
          },
          {
            title: this.$t("m.i.common.result"),
            key: "failReason",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.cancelType"),
            key: "cancelType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = "";
              if (params.row.cancelType === "RV01") {
                dictValue = "未用退回";
              } else if (params.row.cancelType === "RV02") {
                dictValue = "信息作废";
              } else if (params.row.cancelType === "RV03") {
                dictValue = "票据作废";
              }
              return h("span", { domProps: { title: dictValue } }, dictValue);
            }
          },
          {
            title: this.$t("m.i.ce.applTellerName"),
            key: "applTellerName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.checkTellerName"),
            key: "checkTellerName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.bs.settleStatus"),
            key: "paymentFlag",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "PaymentFlagCode", params.row.paymentFlag);
              return h("span", { domProps: { title: dictValue } }, dictValue);
            }
          },
        ]
      };
    },
    mounted() {
      getDictListByGroups("CorpScale,Yon,Province,Industry,ImgStatus,DraftTypeCode,AcptRgstStatus,PaymentFlagCode").then(res => {
        this.rgstStatusList = res.get("AcptRgstStatus");
        this.paymentFlagList = res.get("PaymentFlagCode");
        this.rgstStatusList = this.rgstStatusList.filter(item => item.key !== "BTA15"  &&item.key !== "BTA16" );
        this.dictMap = res.get("map");
      });
    },
    methods: {
      //票交所机构弹窗
      queryCpesBranchCode(type) {
        this.cpesBranchType = type;
        this.showCpesBranchWin = true;
      },
      showCpesBranchClose() {
        this.showCpesBranchWin = false;
      },
      showCpesBranchSubmit(info) {
        if (info === null) {
          this.$hMessage.info("请先选择记录！");
          return;
        }
        if (this.cpesBranchType === "drwe") {
          this.formItem.drweBankNo = info.transBrchBankNo;
          this.formItem.drweBankName = info.brchFullNameZh;
        } else if (this.cpesBranchType === "acpt") {
          this.formItem.acptBankNo = info.transBrchBankNo;
          this.formItem.acptBankName = info.brchFullNameZh;
        }
        this.showCpesBranchClose();
      },
      clearDrweBankNo() {
        this.formItem.drweBankNo = "";
        this.formItem.drweBankName = "";
      },
      clearAcptBankNo() {
        this.formItem.acptBankNo = "";
        this.formItem.acptBankName = "";
      },
      handleRemitDtChange(arr) {
        if (arr && arr.length == 2) {
          this.formItem.minRemitDt = arr[0].replace(/-/g, "");
          this.formItem.maxRemitDt = arr[1].replace(/-/g, "");
          this.remitDt = [arr[0], arr[1]];
        } else {
          this.formItem.minRemitDt = arr[0].replace(/-/g, "");
          this.formItem.maxRemitDt = arr[1].replace(/-/g, "");
          this.remitDt = [arr[0], arr[1]];
        }
      },
      handleDueDtChange(arr) {
        if (arr && arr.length == 2) {
          this.formItem.minDueDt = arr[0].replace(/-/g, "");
          this.formItem.maxDueDt = arr[1].replace(/-/g, "");
          this.dueDt = [arr[0], arr[1]];
        } else {
          this.formItem.minDueDt = "";
          this.formItem.maxDueDt = "";
          this.dueDt = [];
        }
      },
      handleRgstDtChange(arr) {
        if (arr && arr.length == 2) {
          this.formItem.minRgstApplDt = arr[0].replace(/-/g, "");
          this.formItem.maxRgstApplDt = arr[1].replace(/-/g, "");
          this.rgstApplDt = [arr[0], arr[1]];
        } else {
          this.formItem.minRgstApplDt = "";
          this.formItem.maxRgstApplDt = "";
          this.rgstApplDt = [];
        }
      },
      //表单查询
      handleSearch() {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.dataChange(1);
      },
      //重置表单查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
        this.formItem.rgstBrchNameList = JSON.parse(window.sessionStorage.getItem("userInfo")).brchName;
        this.formItem.rgstBrchNoList = JSON.parse(window.sessionStorage.getItem("userInfo")).brchNo;
        this.formItem.minBillMoney = "";
        this.formItem.maxBillMoney = "";
        this.formItem.minRgstApplDt = "";
        this.formItem.maxRgstApplDt = "";
        this.formItem.minRemitDt = "";
        this.formItem.maxRemitDt = "";
        this.formItem.minDueDt = "";
        this.formItem.maxDueDt = "";
        this.formItem.rgstStatus = "";
        this.rgstApplDt = [];
        this.remitDt = [];
        this.dueDt = [];
      },
      //票面
      //票面
      showBillInfo(billId, billNo) {
        this.billId = billId;
        this.billNo = billNo;
        this.showBillInfoWin = true;
      },
      billInfoWinClose() {
        this.showBillInfoWin = false;
      },
      /*//机构树多选
      queryBranchTree() {
        this.showBranchWin = true;
      },
      showBranchWinClose() {
        this.showBranchWin = false;
      },
      //根据弹框所选数据进行赋值
      brchNoChange(info) {
        let objs = [];
        if (info instanceof Array) {
          objs = info;
        } else {
          objs[0] = info;
        }
        let transBrchNoList = "";
        let transBrchNameList = "";
        for (var i = 0; i < objs.length; i++) {
          transBrchNoList += objs[i].id + ",";
          transBrchNameList += objs[i].title + ",";
        }
        this.formItem.rgstBrchNoList = transBrchNoList;
        this.formItem.rgstBrchNameList = transBrchNameList;
        this.showBranchWin = false;
      },*/
      //影像维护弹窗
      openImgWin(str, billNo) {
        this.imageParams.imgTypeList.push({ key: "IM01", value: "承兑正面" });
        this.imageParams.imgTypeList.push({ key: "IM07", value: "补充影像(承兑)" });
        this.imageParams.listId = str;
        this.imageParams.billNo = billNo;
        this.showUploadImageWin = true;
      },
      //影像维护关闭
      uploadImageWinClose() {
        this.showUploadImageWin = false;
        this.imageParams.imgTypeList = [];
        this.handleSearch();
      },

      //导出
      exportExcel() {
        this.param = "acptRgstTrackSearchExportInfo";
        if (this.$refs.datagrid.selectIds.length !== 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        } else {
          this.rows = this.$refs.datagrid.total;
        }
        this.tempShowExcelTemplateWin = true;
      },

      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },

      //清单导出
      exportList(field, exportType) {
        //exportType: 0-同步 1-异步
        if (exportType === "1") {
          let url = window.LOCAL_CONFIG.API_HOME + "/ce/cpesrgst/acptRgst/acptRgstTrackSearch/func_exportRgstInfo";
          let params = null;
          if (this.$refs.datagrid.selectIds.length !== 0) {
            params = {
              idList: this.$refs.datagrid.selectIds,
              field: field,
              exportType: exportType,
              excelName: this.param
            };
          } else {
            params = {
              rgstClass: "RI00",
              rgstBrchNoList: this.formItem.rgstBrchNoList,
              billNo: this.formItem.billNo,
              minBillMoney: this.formItem.minBillMoney,
              maxBillMoney: this.formItem.maxBillMoney,
              minRgstApplDt: this.formItem.minRgstApplDt,
              maxRgstApplDt: this.formItem.maxRgstApplDt,
              rgstStatus: this.formItem.rgstStatus,
              minRemitDt: this.formItem.minRemitDt,
              maxRemitDt: this.formItem.maxRemitDt,
              minDueDt: this.formItem.minDueDt,
              maxDueDt: this.formItem.maxDueDt,
              paymentFlag: this.formItem.paymentFlag,
              drweBankNo: this.formItem.drweBankNo,
              acptBankNo: this.formItem.acptBankNo,
              field: field,
              exportType: exportType,
              excelName: this.param
            };
          }
          post(params, url).then(res => {
            if (res.status === 200 && res.data === null) {
              this.$msgTip.info(this, { info: "异步导出成功，请进入公共管理》导出下载页面，进行下载" });
            } else if (res.status === 200 && res.data === "") {
              this.$msgTip.info(this, { info: "异步导出成功，请进入公共管理》导出下载页面，进行下载" });
            } else {
              this.$msgTip.error(this, { info: "异步导出失败" });
            }
          });
        } else {
          if (this.$refs.datagrid.selectIds.length !== 0) {
            let url = window.LOCAL_CONFIG.API_HOME + "/ce/cpesrgst/acptRgst/acptRgstTrackSearch/func_exportRgstInfo";
            let form = document.createElement("form");
            form.setAttribute("id", "formId");
            form.setAttribute("action", url);
            form.setAttribute("method", "post");

            let input1 = document.createElement("input");
            input1.type = "text";
            input1.name = "idList";
            input1.value = this.$refs.datagrid.selectIds;
            form.appendChild(input1);
            let input2 = document.createElement("input");
            input2.type = "text";
            input2.name = "field";
            input2.value = field;
            form.appendChild(input2);
            let input3 = document.createElement("input");
            input3.type = "text";
            input3.name = "exportType";
            input3.value = exportType;
            form.appendChild(input3);
            let input4 = document.createElement("input");
            input4.type = "text";
            input4.name = "excelName";
            input4.value = this.param;
            form.appendChild(input4);

            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
          } else {
            let url = window.LOCAL_CONFIG.API_HOME + "/ce/cpesrgst/acptRgst/acptRgstTrackSearch/func_exportRgstInfo";
            let form = document.createElement("form");
            for (let obj in this.formItem) {
              if (this.formItem.hasOwnProperty(obj)) {
                let input = document.createElement("input");
                input.type = "text";
                input.name = obj;
                input.value = this.formItem[obj];
                form.appendChild(input);
              }
            }
            form.setAttribute("id", "formId");
            form.setAttribute("action", url);
            form.setAttribute("method", "post");

            let input3 = document.createElement("input");
            input3.type = "text";
            input3.name = "field";
            input3.value = field;
            form.appendChild(input3);
            let input4 = document.createElement("input");
            input4.type = "text";
            input4.name = "exportType";
            input4.value = exportType;
            form.appendChild(input4);
            let input5 = document.createElement("input");
            input5.type = "text";
            input5.name = "excelName";
            input5.value = this.param;
            form.appendChild(input5);

            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
          }
        }
      }
    }
  };
</script>

<style scoped>

</style>
