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
                <h-form-item prop="rgstStatus" :label="$t('m.i.ce.rgstStatus')">
                  <h-select v-model="formItem.rgstStatus" placeholder="">
                    <h-option value="BTA02" key="BTA01">待复核</h-option>
                    <h-option value="BTA05" key="BTA06">登记失败</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item class="h-form-operate one-form">
                  <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid :columns="columns"
                      url="/ce/cpesrgst/discRgst/discRgstRecheck/func_pagingQueryPaperRgstCheck"
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

    <!-- 查看贴现登记信息界面 -->
    <h-msg-box v-model="showInfoDetailWin" width="800" @on-close="showInfoDetailWinClose" class="h-form-search-layer"
               :maximize="true" :mask-closable="false">
      <p slot="header">
        <span>查看贴现登记信息</span>
      </p>
      <div>
        <h-form :model="showInfoDetailForm" :label-width="115" ref="showInfoDetailForm" cols="2" class="h-form-search">
          <h-form-item prop="billType" :label="$t('m.i.billInfo.billType')">
            <h-select v-model="showInfoDetailForm.billType" placeholder="" readonly>
              <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item prop="billNo" :label="$t('m.i.billInfo.billNo')">
            <h-input v-model="showInfoDetailForm.billNo" :maxlength="16" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item prop="billMoney" :label="$t('m.i.billInfo.billMoney')">
            <h-typefield v-model="showInfoDetailForm.billMoney" :maxlength="20" readonly placeholder="数字，小数位最多2位"
                         bigTips></h-typefield>
          </h-form-item>
          <h-form-item prop="dueDt" :label="$t('m.i.billInfo.dueDt')">
            <h-date-picker v-model="showInfoDetailForm.dueDt" type="date" readonly showFormat :editable=false
                           format="yyyy-MM-dd"></h-date-picker>
          </h-form-item>
          <h-form-item prop="acptName" :label="$t('m.i.billInfo.acptName')">
            <h-input v-model="showInfoDetailForm.acptName" placeholder="" readonly :maxlength="60"></h-input>
          </h-form-item>
          <h-form-item prop="acptBankNo" :label="$t('m.i.billInfo.acptBankNo')">
            <h-input v-model="showInfoDetailForm.acptBankNo" placeholder="" :maxlength="12" readonly
                     icon="android-search" @on-click="queryCpesBranchCode('acpt')"></h-input>
          </h-form-item>
          <h-form-item prop="acptBankName" :label="$t('m.i.billInfo.acptBankName')">
            <h-input v-model="showInfoDetailForm.acptBankName" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item prop="drwrName" :label="$t('m.i.billInfo.drwrName')">
            <h-input v-model="showInfoDetailForm.drwrName" placeholder="" readonly :maxlength="60"></h-input>
          </h-form-item>
          <h-form-item prop="drwrAcctNo" :label="$t('m.i.billInfo.drwrAcctNo')">
            <h-input v-model="showInfoDetailForm.drwrAcctNo" placeholder="" readonly :maxlength="32"></h-input>
          </h-form-item>
          <h-form-item prop="drwrBankNo" :label="$t('m.i.billInfo.drwrBankNo')">
            <h-input v-model="showInfoDetailForm.drwrBankNo" placeholder="" readonly
                     icon="android-search" @on-click="queryCpesBranchCode('drwr')"></h-input>
          </h-form-item>
          <h-form-item prop="drwrBankName" :label="$t('m.i.billInfo.drwrBankName')">
            <h-input v-model="showInfoDetailForm.drwrBankName" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item prop="pyeeName" :label="$t('m.i.billInfo.pyeeName')">
            <h-input v-model="showInfoDetailForm.pyeeName" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item prop="pyeeAcctNo" :label="$t('m.i.billInfo.pyeeAcctNo')">
            <h-input v-model="showInfoDetailForm.pyeeAcctNo" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item prop="pyeeBankNo" :label="$t('m.i.billInfo.pyeeBankNo')">
            <h-input v-model="showInfoDetailForm.pyeeBankNo" placeholder="" readonly
                     icon="android-search" @on-click="queryCpesBranchCode('pyee')"></h-input>
          </h-form-item>
          <h-form-item prop="pyeeBankName" :label="$t('m.i.billInfo.pyeeBankName')">
            <h-input v-model="showInfoDetailForm.pyeeBankName" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item prop="rgstDt" :label="$t('m.i.billInfo.discDt')">
            <h-date-picker v-model="showInfoDetailForm.rgstDt" type="date" showFormat readonly :editable=false
                           format="yyyy-MM-dd"></h-date-picker>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.discInterestRate')" prop="discInterestRate">
            <h-input v-model="showInfoDetailForm.discInterestRate" readonly placeholder="利率范围0~100" :maxlength=60
                     :style="{width:'160px'}"></h-input>
            <span>(%)</span>
          </h-form-item>

          <h-form-item prop="transFromName" :label="$t('m.i.ce.discountOutName')">
            <h-input v-model="showInfoDetailForm.transFromName" placeholder="" readonly :maxlength="60"></h-input>
          </h-form-item>
          <h-form-item prop="transFromAcctNo" :label="$t('m.i.ce.transFromAcctNo')">
            <h-input v-model="showInfoDetailForm.transFromAcctNo" placeholder="" readonly :maxlength="32"></h-input>
          </h-form-item>
          <h-form-item prop="transFromBankNo" :label="$t('m.i.ce.transFromBankNo')">
            <h-input v-model="showInfoDetailForm.transFromBankNo" placeholder="" readonly
                     icon="android-search" @on-click="queryCpesBranchCode('transFrom')"></h-input>
          </h-form-item>
          <h-form-item prop="transFromSocCode" :label="$t('m.i.ce.transFromSocCode')" class="h-form-long-label">
            <h-input v-model="showInfoDetailForm.transFromSocCode" placeholder="" readonly :maxlength="18"></h-input>
          </h-form-item>
          <h-form-item prop="transFromIndustry" :label="$t('m.i.ce.transFromIndustry')">
            <h-select v-model="showInfoDetailForm.transFromIndustry" readonly :maxlength=60>
              <h-option v-for="item in industryCategoryList" :value="item.key" :key="item.key">{{ item.value }}
              </h-option>
            </h-select>
          </h-form-item>
          <h-form-item prop="transFromCorpScale" :label="$t('m.i.ce.transFromCorpScale')">
            <h-select v-model="showInfoDetailForm.transFromCorpScale" readonly :maxlength=60>
              <h-option v-for="item in corpScaleList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item prop="isTransFromArc" :label="$t('m.i.ce.isTransFromArc')" class="h-form-long-label">
            <h-select v-model="showInfoDetailForm.isTransFromArc" readonly :maxlength=60>
              <h-option v-for="item in isList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item prop="transFromArea" :label="$t('m.i.ce.transFromArea')">
            <h-select v-model="showInfoDetailForm.transFromArea" readonly :maxlength=60>
              <h-option v-for="item in areaList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item prop="isTransFromGrn" :label="$t('m.i.ce.isTransFromGrn')" class="h-form-long-label">
            <h-select v-model="showInfoDetailForm.isTransFromGrn" readonly :maxlength=60>
              <h-option v-for="item in isList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item prop="transToBankNo" :label="$t('m.i.ce.transToBankNo')">
            <h-input v-model="showInfoDetailForm.transToBankNo" placeholder="" readonly
                     icon="android-search" @on-click="queryCpesBranchCode('transTo')"></h-input>
          </h-form-item>
          <h-form-item prop="transToBankName" :label="$t('m.i.ce.transToBankName')">
            <h-input v-model="showInfoDetailForm.transToBankName" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item prop="rgstRemark" :label="$t('m.i.common.remark')" class="h-form-height-auto">
            <h-input type="textarea" :rows=3 v-model="showInfoDetailForm.rgstRemark" :canResize="false" readonly
                     :maxlength="300"></h-input>
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
  import {
    post,
    on,
    off,
    accMul,
    getDictListByGroups,
    getDictValueFromMap,
    formatNumber
  } from "@/api/bizApi/commonUtil";

  export default {
    name: "discRgstRecheck",
    components: {},
    data() {
      return {
        //详细信息
        showInfoDetailWin: false,
        showInfoDetailForm: {
          billType: "",
          billNo: "",
          billMoney: "",
          dueDt: "",
          acptName: "",
          acptAcctNo: "",
          acptBankNo: "",
          acptBankName: "",
          drwrName: "",
          drwrAcctNo: "",
          drwrBankNo: "",
          drwrBankName: "",
          pyeeName: "",
          pyeeAcctNo: "",
          pyeeBankNo: "",
          pyeeBankName: "",
          rgstDt: "",
          discInterestRate: "",
          transFromName: "",
          transFromAcctNo: "",
          transFromBankNo: "",
          transFromSocCode: "",
          transFromIndustry: "",
          transFromCorpScale: "",
          isTransFromArc: "",
          transFromArea: "",
          isTransFromGrn: "",
          transToBankNo: "",
          transToBankName: "",
          rgstRemark: ""
        },
        //影像上传
        showUploadImageWin: false,
        propsVue: "discRgstRecheck",
        authObject: {
          imageAdd: false,       //影像新增
          imageRegister: false,  //登记
          imageDelete: false     //删除
        },
        imageParams: {
          listId: "",
          imgTypeList: [],
          imageUrl: "/ce/cpesrgst/discRgst/discRgstRecheck/func_pagingQueryPaperRgstImg", //查询可查看影像url
          imgShowUrl: "/ce/cpesrgst/discRgst/discRgstRecheck/func_showImg?id="
        },
        //票面
        showBillInfoWin: false,
        billId: "",
        billNo: "",
        //字典值
        dictMap: new Map(),
        isList: [],
        areaList: [],
        industryCategoryList: [],
        corpScaleList: [],
        billTypeList: [],
        imgStatusList: [],

        formItem: {
          rgstClass: "RI04",
          billNo: "",
          rgstStatus: ""
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
            title: this.$t("m.i.billInfo.discDt"),
            key: "rgstDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.rgstDt == null || params.row.rgstDt === "") {
                return "";
              }
              let date = this.$moment(params.row.rgstDt, "YYYY-MM-DD").format("YYYY-MM-DD");
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
            title: this.$t("m.i.ce.registerStatus"),
            key: "rgstStatus",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "AcptRgstStatus", params.row.rgstStatus);
              return h("span", { domProps: { title: dictValue } }, dictValue);
            }
          },
          {
            title: this.$t("m.i.billInfo.acptBankName"),
            key: "acptBankName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.ce.discountApplyName"),
            key: "transFromName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.ce.transToBankName"),
            key: "transToBankName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.billInfo.discInterestRate"),
            key: "discInterestRate",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.discInterestRate != null && params.row.discInterestRate !== "") {
                let rate = accMul(params.row.discInterestRate, 100) + "(%)";
                return h("span", rate);
              }
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
        this.imageParams.imgTypeList.push({ key: "IM03", value: "贴现正面" });
        this.imageParams.imgTypeList.push({ key: "IM04", value: "贴现背面" });
        this.imageParams.imgTypeList.push({ key: "IM05", value: "贴现凭证" });
        this.imageParams.imgTypeList.push({ key: "IM06", value: "瑕疵证明" });
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
          rgstClass: "RI04"
        }, "/ce/cpesrgst/discRgst/discRgstRecheck/func_submitCheck").then(res => {
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
          rgstClass: "RI04"
        }, "/ce/cpesrgst/discRgst/discRgstRecheck/func_submitCheck").then(res => {
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
        post({ id: str }, "/ce/cpesrgst/discRgst/discRgstRecheck/func_queryPaperRgstById").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.showInfoDetailForm.billType = res.data.retData.billType;
              this.showInfoDetailForm.billNo = res.data.retData.billNo;
              this.showInfoDetailForm.dueDt = this.$moment(res.data.retData.dueDt, "YYYYMMDD").format("YYYY-MM-DD");
              this.showInfoDetailForm.billMoney = res.data.retData.billMoney;
              this.showInfoDetailForm.acptName = res.data.retData.acptName;
              this.showInfoDetailForm.acptAcctNo = res.data.retData.acptAcctNo;
              this.showInfoDetailForm.acptBankNo = res.data.retData.acptBankNo;
              this.showInfoDetailForm.acptBankName = res.data.retData.acptBankName;
              this.showInfoDetailForm.drwrName = res.data.retData.drwrName;
              this.showInfoDetailForm.drwrAcctNo = res.data.retData.drwrAcctNo;
              this.showInfoDetailForm.drwrBankNo = res.data.retData.drwrBankNo;
              this.showInfoDetailForm.drwrBankName = res.data.retData.drwrBankName;
              this.showInfoDetailForm.pyeeName = res.data.retData.pyeeName;
              this.showInfoDetailForm.pyeeAcctNo = res.data.retData.pyeeAcctNo;
              this.showInfoDetailForm.pyeeBankNo = res.data.retData.pyeeBankNo;
              this.showInfoDetailForm.pyeeBankName = res.data.retData.pyeeBankName;
              this.showInfoDetailForm.rgstDt = this.$moment(res.data.retData.rgstDt, "YYYYMMDD").format("YYYY-MM-DD");
              this.showInfoDetailForm.discInterestRate = accMul(res.data.retData.discInterestRate,100);
              this.showInfoDetailForm.transFromName = res.data.retData.transFromName;
              this.showInfoDetailForm.transFromAcctNo = res.data.retData.transFromAcctNo;
              this.showInfoDetailForm.transFromBankNo = res.data.retData.transFromBankNo;
              this.showInfoDetailForm.transFromSocCode = res.data.retData.transFromSocCode;
              this.showInfoDetailForm.transFromIndustry = res.data.retData.transFromIndustry;
              this.showInfoDetailForm.transFromCorpScale = res.data.retData.transFromCorpScale;
              this.showInfoDetailForm.isTransFromArc = res.data.retData.isTransFromArc;
              this.showInfoDetailForm.transFromArea = res.data.retData.transFromArea;
              this.showInfoDetailForm.isTransFromGrn = res.data.retData.isTransFromGrn;
              this.showInfoDetailForm.transToBankNo = res.data.retData.transToBankNo;
              this.showInfoDetailForm.transToBankName = res.data.retData.transToBankName;
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
