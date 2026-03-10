<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item prop="billNo" :label="$t('m.i.billInfo.billNo')">
                  <h-input v-model="formItem.billNo" placeholder="" :maxlength="30"></h-input>
                </h-form-item>
                <h-form-item prop="acptDt" :label="$t('m.i.billInfo.acptDt')">
                  <h-date-picker type="date" v-model="formItem.acptDt" placeholder="" format="yyyy-MM-dd"
                                 :editable=false showFormat @on-change="handleAcptDtChange"></h-date-picker>
                </h-form-item>
                <h-form-item prop="rgstStatus" :label="$t('m.i.ce.rgstStatus')">
                  <h-select v-model="formItem.rgstStatus" placeholder="">
                    <h-option value="BTA02" key="BTA01">待复核</h-option>
                    <h-option value="BTA05" key="BTA06">登记失败</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid :columns="columns"
                      url="/ce/cpesrgst/acptRgst/acptRgstRecheck/func_pagingQueryPaperRgstCheck"
                      :bindForm="formItem"
                      :has-select="false"
                      :row-select="true"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="recheckPass">{{$t("m.i.common.pass")}}</h-button>
              <h-button type="primary" @click="recheckBack">{{$t("m.i.common.back")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <!-- 查看票面 -->
    <rgst-bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"
                    :billNo="this.billNo"></rgst-bill-info-main>

    <!-- 影像维护 -->
    <image-loading
      :imageWin="showUploadImageWin"
      :imageParams="imageParams"
      :authObj="authObject"
      @imageWinClose="uploadImageWinClose"></image-loading>

    <!-- 查看承兑登记信息界面 -->
    <h-msg-box v-model="showInfoDetailWin" width="800" @on-close="showInfoDetailWinClose" class="h-form-search-layer"
               :maximize="true" :mask-closable="false">
      <p slot="header">
        <span>查看承兑登记信息</span>
      </p>
      <div>
        <h-form :model="showInfoDetailForm" :label-width="115" ref="showInfoDetailForm" cols="2" class="h-form-search">
          <h-form-item prop="billType" :label="$t('m.i.billInfo.billType')" required>
            <h-select v-model="showInfoDetailForm.billType" placeholder="" readonly>
              <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item prop="billNo" :label="$t('m.i.billInfo.billNo')" required>
            <h-input v-model="showInfoDetailForm.billNo" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item prop="remitDt" :label="$t('m.i.billInfo.remitDt')" required>
            <h-date-picker v-model="showInfoDetailForm.remitDt" type="date" showFormat :editable=false
                           format="yyyy-MM-dd" disabled></h-date-picker>
          </h-form-item>
          <h-form-item prop="dueDt" :label="$t('m.i.billInfo.dueDt')" required>
            <h-date-picker v-model="showInfoDetailForm.dueDt" type="date" showFormat :editable=false format="yyyy-MM-dd"
                           disabled></h-date-picker>
          </h-form-item>
          <h-form-item prop="billMoney" :label="$t('m.i.billInfo.billMoney')" required>
            <h-typefield v-model="showInfoDetailForm.billMoney" :maxlength="20" placeholder="" bigTips
                         readonly></h-typefield>
          </h-form-item>
          <h-form-item prop="acptDt" :label="$t('m.i.billInfo.acptDt')" required>
            <h-date-picker v-model="showInfoDetailForm.acptDt" type="date" showFormat :editable=false
                           format="yyyy-MM-dd" disabled></h-date-picker>
          </h-form-item>
          <h-form-item prop="acptName" :label="$t('m.i.billInfo.acptName')" required>
            <h-input v-model="showInfoDetailForm.acptName" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item prop="acptAcctNo" :label="$t('m.i.billInfo.acptAcctNo')" required>
            <h-input v-model="showInfoDetailForm.acptAcctNo" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item prop="acptBankNo" :label="$t('m.i.billInfo.acptBankNo')" required>
            <h-input v-model="showInfoDetailForm.acptBankNo" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item prop="acptBankName" :label="$t('m.i.billInfo.acptBankName')" required>
            <h-input v-model="showInfoDetailForm.acptBankName" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item prop="acptSocCode" :label="$t('m.i.billInfo.acptSocCode')" required class="h-form-long-label">
            <h-input v-model="showInfoDetailForm.acptSocCode" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item prop="drwrName" :label="$t('m.i.billInfo.drwrName')" required>
            <h-input v-model="showInfoDetailForm.drwrName" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item prop="drwrAcctNo" :label="$t('m.i.billInfo.drwrAcctNo')" required>
            <h-input v-model="showInfoDetailForm.drwrAcctNo" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item prop="drwrBankNo" :label="$t('m.i.billInfo.drwrBankNo')" required>
            <h-input v-model="showInfoDetailForm.drwrBankNo" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item prop="drwrBankName" :label="$t('m.i.billInfo.drwrBankName')" required>
            <h-input v-model="showInfoDetailForm.drwrBankName" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item prop="drwrSocCode" :label="$t('m.i.billInfo.drwrSocCode')" required class="h-form-long-label">
            <h-input v-model="showInfoDetailForm.drwrSocCode" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item prop="drwrIndustry" :label="$t('m.i.billInfo.drwrIndustry')" required>
            <h-select v-model="showInfoDetailForm.drwrIndustry" placeholder="" readonly>
              <h-option v-for="item in industryCategoryList" :value="item.key" :key="item.key">{{ item.value }}
              </h-option>
            </h-select>
          </h-form-item>
          <h-form-item prop="drwrCorpScale" :label="$t('m.i.billInfo.drwrCorpScale')" required>
            <h-select v-model="showInfoDetailForm.drwrCorpScale" placeholder="" readonly>
              <h-option v-for="item in corpScaleList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item prop="isDrwrArc" :label="$t('m.i.billInfo.isDrwrArc')" required class="h-form-long-label">
            <h-select v-model="showInfoDetailForm.isDrwrArc" placeholder="" readonly>
              <h-option v-for="item in isList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item prop="drwrArea" :label="$t('m.i.billInfo.drwrArea')" required>
            <h-select v-model="showInfoDetailForm.drwrArea" placeholder="" readonly>
              <h-option v-for="item in areaList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item prop="isDrwrGrn" :label="$t('m.i.billInfo.isDrwrGrn')" required class="h-form-long-label">
            <h-select v-model="showInfoDetailForm.isDrwrGrn" placeholder="" readonly>
              <h-option v-for="item in isList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item prop="pyeeName" :label="$t('m.i.billInfo.pyeeName')" required>
            <h-input v-model="showInfoDetailForm.pyeeName" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item prop="pyeeAcctNo" :label="$t('m.i.billInfo.pyeeAcctNo')" required>
            <h-input v-model="showInfoDetailForm.pyeeAcctNo" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item prop="pyeeBankNo" :label="$t('m.i.billInfo.pyeeBankNo')">
            <h-input v-model="showInfoDetailForm.pyeeBankNo" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item prop="pyeeBankName" :label="$t('m.i.billInfo.pyeeBankName')" required>
            <h-input v-model="showInfoDetailForm.pyeeBankName" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item prop="pyeeSocCode" :label="$t('m.i.billInfo.pyeeSocCode')" class="h-form-long-label">
            <h-input v-model="showInfoDetailForm.pyeeSocCode" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item prop="drweBankNo" :label="$t('m.i.billInfo.drweBankNo')" required>
            <h-input v-model="showInfoDetailForm.drweBankNo" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item prop="drweBankName" :label="$t('m.i.billInfo.drweBankName')" required>
            <h-input v-model="showInfoDetailForm.drweBankName" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item prop="rgstRemark" :label="$t('m.i.common.remark')" class="h-form-height-auto">
            <h-input type="textarea" :rows=3 v-model="showInfoDetailForm.rgstRemark" :canResize="false"
                     readonly></h-input>
          </h-form-item>
        </h-form>
      </div>
      <div slot="footer">
        <div slot="footer">
          <h-button type="ghost" @click="showInfoDetailWinClose">{{$t("m.i.common.close")}}</h-button>
        </div>
      </div>
    </h-msg-box>
  </div>
</template>

<script>
  import { post, on, off, getDictListByGroups, getDictValueFromMap, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "acptRgstRecheck",
    components: {},
    data() {
      return {
        isList: [],
        areaList: [],
        industryCategoryList: [],
        corpScaleList: [],
        billTypeList: [],
        dictMap: new Map(),
        //详细信息
        showInfoDetailWin: false,
        showInfoDetailForm: {
          billType: "",
          billNo: "",
          remitDt: "",
          dueDt: "",
          billMoney: "",
          acptDt: "",
          acptName: "",
          acptAcctNo: "",
          acptBankNo: "",
          acptBankName: "",
          acptSocCode: "",
          drwrName: "",
          drwrAcctNo: "",
          drwrBankNo: "",
          drwrBankName: "",
          drwrSocCode: "",
          drwrIndustry: "",
          drwrCorpScale: "",
          isDrwrArc: "",
          drwrArea: "",
          isDrwrGrn: "",
          pyeeName: "",
          pyeeAcctNo: "",
          pyeeBankNo: "",
          pyeeBankName: "",
          pyeeSocCode: "",
          drweBankNo: "",
          drweBankName: "",
          rgstRemark: ""
        },
        //影像上传
        showUploadImageWin: false,
        propsVue: "acptRgstRecheck",
        authObject: {
          imageAdd: false,       //影像新增
          imageRegister: false,  //登记
          imageDelete: false     //删除
        },
        imageParams: {
          listId: "",
          imgTypeList: [],
          imgType: "IM01",
          imageUrl: "/ce/cpesrgst/acptRgst/acptRgstRecheck/func_pagingQueryPaperRgstImg", //查询可查看影像url
          imgShowUrl: "/ce/cpesrgst/acptRgst/acptRgstRecheck/func_showImg?id=" //查看影像url
        },
        showBillInfoWin: false,
        billId: "",
        billNo: "",
        formItem: {
          rgstClass: "RI00",
          rgstStatus: "",
          billNo: "",
          acptDt: ""
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
            title: this.$t("m.i.ce.info"),
            key: "info",
            hiddenCol: false,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showInfoDetail(params.row.id);
                  }
                }
              }, "查看");
            }
          },
          {
            title: this.$t("m.i.common.showImg"),
            key: "acptImage",
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
                      this.openImgWin(params.row.id);
                    }
                  }
                }, "维护")
              ]);
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
          }
        ]

      };
    },
    mounted() {
      getDictListByGroups("CorpScale,Yon,Province,Industry,ImgStatus,DraftTypeCode,AcptRgstStatus").then(res => {
        this.corpScaleList = res.get("CorpScale");
        this.isList = res.get("Yon");
        this.areaList = res.get("Province");
        this.industryCategoryList = res.get("Industry");
        this.billTypeList = res.get("DraftTypeCode");
        this.imgStatusList = res.get("ImgStatus");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      handleAcptDtChange(value) {
        this.formItem.acptDt = value.replace(/-/g, "");
      },
      //表单查询
      handleSearch() {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.dataChange(1);
      },
      //重置表单查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
      },
      //影像维护弹窗
      openImgWin(str) {
        this.imageParams.listId = str;
        this.imageParams.imgTypeList.push({ key: "IM01", value: "承兑正面" });
        this.showUploadImageWin = true;
      },
      //影像维护关闭
      uploadImageWinClose() {
        this.showUploadImageWin = false;
        this.imageParams.imgTypeList = [];
        this.handleSearch();
      },
      //票面
      showBillInfo(billId, billNo) {
        this.billId = billId;
        this.billNo = billNo;
        this.showBillInfoWin = true;
      },
      billInfoWinClose() {
        this.showBillInfoWin = false;
      },

      //通过
      recheckPass() {
        if (this.$refs.datagrid.selects.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.$hMsgBox.confirm({
          title: "确认",
          content: "确定通过吗？",
          onOk: () => {
            this.handleReCheckPass();
          }
        });
      },
      handleReCheckPass() {
        let list = this.$refs.datagrid.selects;
        let ids = "";
        for (let i = 0, count = list.length; i < count; i++) {
          ids += list[i].id;
          if (i < list.length - 1) {
            ids += ",";
          }
        }
        post({
          listIds: ids,
          isPass: "1",
          isCancel: "0"
        }, "/ce/cpesrgst/acptRgst/acptRgstRecheck/func_submitCheck").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.handleSearch();
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
              this.handleSearch();
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },

      //驳回
      recheckBack() {
        if (this.$refs.datagrid.selects.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.$hMsgBox.confirm({
          title: "确认",
          content: "确定驳回吗？",
          onOk: () => {
            this.handleReCheckBack();
          }
        });
      },
      handleReCheckBack() {
        let list = this.$refs.datagrid.selects;
        let ids = "";
        for (let i = 0, count = list.length; i < count; i++) {
          ids += list[i].id;
          if (i < list.length - 1) {
            ids += ",";
          }
        }
        post({
          listIds: ids,
          isPass: "0",
          isCancel: "0"
        }, "/ce/cpesrgst/acptRgst/acptRgstRecheck/func_submitCheck").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.handleSearch();
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
              this.handleSearch();
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },

      //详细信息超链接展示
      showInfoDetail(str) {
        post({ id: str }, "/ce/cpesrgst/acptRgst/acptRgstRecheck/func_queryPaperRgstById").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.showInfoDetailForm.billType = res.data.retData.billType;
              this.showInfoDetailForm.billNo = res.data.retData.billNo;
              this.showInfoDetailForm.remitDt = res.data.retData.remitDt + "";
              this.showInfoDetailForm.dueDt = res.data.retData.dueDt + "";
              this.showInfoDetailForm.billMoney = res.data.retData.billMoney;
              this.showInfoDetailForm.acptDt = res.data.retData.acptDt + "";
              this.showInfoDetailForm.acptName = res.data.retData.acptName;
              this.showInfoDetailForm.acptAcctNo = res.data.retData.acptAcctNo;
              this.showInfoDetailForm.acptBankNo = res.data.retData.acptBankNo;
              this.showInfoDetailForm.acptBankName = res.data.retData.acptBankName;
              this.showInfoDetailForm.acptSocCode = res.data.retData.acptSocCode;
              this.showInfoDetailForm.drwrName = res.data.retData.drwrName;
              this.showInfoDetailForm.drwrAcctNo = res.data.retData.drwrAcctNo;
              this.showInfoDetailForm.drwrBankNo = res.data.retData.drwrBankNo;
              this.showInfoDetailForm.drwrBankName = res.data.retData.drwrBankName;
              this.showInfoDetailForm.drwrSocCode = res.data.retData.drwrSocCode;
              this.showInfoDetailForm.drwrIndustry = res.data.retData.drwrIndustry;
              this.showInfoDetailForm.drwrCorpScale = res.data.retData.drwrCorpScale;
              this.showInfoDetailForm.isDrwrArc = res.data.retData.isDrwrArc;
              this.showInfoDetailForm.drwrArea = res.data.retData.drwrArea;
              this.showInfoDetailForm.isDrwrGrn = res.data.retData.isDrwrGrn;
              this.showInfoDetailForm.pyeeName = res.data.retData.pyeeName;
              this.showInfoDetailForm.pyeeAcctNo = res.data.retData.pyeeAcctNo;
              this.showInfoDetailForm.pyeeBankNo = res.data.retData.pyeeBankNo;
              this.showInfoDetailForm.pyeeBankName = res.data.retData.pyeeBankName;
              this.showInfoDetailForm.pyeeSocCode = res.data.retData.pyeeSocCode;
              this.showInfoDetailForm.drweBankNo = res.data.retData.drweBankNo;
              this.showInfoDetailForm.drweBankName = res.data.retData.drweBankName;
              this.showInfoDetailForm.rgstRemark = res.data.retData.rgstRemark;
              this.showInfoDetailWin = true;
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      showInfoDetailWinClose() {
        this.showInfoDetailWin = false;
        this.$refs.showInfoDetailForm.resetFields();
      }

    }
  };
</script>

<style scoped>

</style>
