<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item prop="billNo" :label="$t('m.i.billInfo.billNo')">
                  <h-input v-model="formItem.billNo" placeholder="" :maxlength="30"></h-input>
                </h-form-item>
                <h-form-item prop="rgstDt" :label="$t('m.i.billInfo.anlgSspdDt')">
                  <h-date-picker type="date" v-model="formItem.rgstDt" placeholder="" format="yyyy-MM-dd"
                                 :editable=false showFormat @on-change="handleRgstDtChange"></h-date-picker>
                </h-form-item>
                <h-form-item prop="imgStatus" :label="$t('m.i.common.imgStatus')">
                  <h-select v-model="formItem.imgStatus" placeholder="">
                    <!--<h-option value="1">未录入</h-option>-->
                    <!--<h-option value="2">待上传</h-option>-->
                    <!--<h-option value="3">上传成功</h-option>-->
                    <h-option v-for="item in imgStatusList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item prop="rgstStatus" :label="$t('m.i.ce.rgstStatus')">
                  <h-select v-model="formItem.rgstStatus" placeholder="">
                    <h-option value="BTA02" key="BTA01">待复核</h-option>
                    <h-option value="BTA05" key="BTA06">登记失败</h-option>
                  </h-select>
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
                      url="/ce/cpesrgst/cancelStopPaymentRgst/cancelStopPaymentRgstRecheck/func_pagingQueryPaperRgstCheck"
                      :bindForm="formItem"
                      :row-select="true"
                      :has-select="false"
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

    <!-- 查看解止付登记信息界面 -->
    <h-msg-box v-model="showInfoDetailWin" width="800" @on-close="showInfoDetailWinClose" class="h-form-search-layer"
               :maximize="true" :mask-closable="false">
      <p slot="header">
        <span>查看解止付登记信息</span>
      </p>
      <div>
        <h-form :model="showInfoDetailForm" :label-width="115" ref="showInfoDetailForm" cols="2" class="h-form-search">
          <h-form-item prop="billNo" :label="$t('m.i.billInfo.billNo')" required>
            <h-input v-model="showInfoDetailForm.billNo" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item prop="billType" :label="$t('m.i.billInfo.billType')" required>
            <h-select v-model="showInfoDetailForm.billType" placeholder="" readonly>
              <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item prop="dueDt" :label="$t('m.i.billInfo.dueDt')" required>
            <h-date-picker v-model="showInfoDetailForm.dueDt" type="date" showFormat :editable=false format="yyyy-MM-dd"
                           disabled></h-date-picker>
          </h-form-item>
          <h-form-item prop="billMoney" :label="$t('m.i.billInfo.billMoney')" required>
            <h-typefield v-model="showInfoDetailForm.billMoney" :maxlength="20" placeholder="" bigTips
                         readonly></h-typefield>
          </h-form-item>
          <h-form-item prop="drwrName" :label="$t('m.i.billInfo.drwrName')" required>
            <h-input v-model="showInfoDetailForm.drwrName" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item prop="drwrAcctNo" :label="$t('m.i.billInfo.drwrAcctNo')" required>
            <h-input v-model="showInfoDetailForm.drwrAcctNo" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item prop="acptBankNo" :label="$t('m.i.billInfo.acptBankNo')" required>
            <h-input v-model="showInfoDetailForm.acptBankNo" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item prop="sspdDt" :label="$t('m.i.billInfo.sspdDt')" required>
            <h-date-picker v-model="showInfoDetailForm.sspdDt" readonly type="date" showFormat :editable=false
                           format="yyyy-MM-dd"></h-date-picker>
          </h-form-item>
          <h-form-item prop="sspdName" :label="$t('m.i.ce.sspdName')" required>
            <h-input v-model="showInfoDetailForm.sspdName" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item prop="sspdAcctNo" :label="$t('m.i.ce.sspdAcctNo')">
            <h-input v-model="showInfoDetailForm.sspdAcctNo" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item prop="sspdBankNo" :label="$t('m.i.ce.sspdBankNo')">
            <h-input v-model="showInfoDetailForm.sspdBankNo" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item prop="sspdSocCode" :label="$t('m.i.ce.sspdSocCode')" class="h-form-long-label">
            <h-input v-model="showInfoDetailForm.sspdSocCode" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item prop="sspdType" :label="$t('m.i.billInfo.sspdType')">
            <h-select v-model="showInfoDetailForm.sspdType" placeholder="" readonly required>
              <h-option v-for="item in sspdTypeList" :value="item.key" :key="item.key">{{item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item prop="rgstDt" :label="$t('m.i.billInfo.anlgSspdDt')" required>
            <h-date-picker v-model="showInfoDetailForm.rgstDt" readonly type="date" showFormat :editable=false
                           format="yyyy-MM-dd"></h-date-picker>
          </h-form-item>
          <h-form-item prop="paperRgstType" :label="$t('m.i.ce.paperRgstType')" required>
            <h-select v-model="showInfoDetailForm.paperRgstType" placeholder="" readonly required>
              <h-option v-for="item in anlgSspdTypeList" :value="item.key" :key="item.key">{{item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item prop="sspdReason" :label="$t('m.i.ce.relieveReason')" class="h-form-height-auto" required>
            <h-input type="textarea" :rows=3 v-model="showInfoDetailForm.sspdReason" :canResize="false" readonly
                     :maxlength="300"></h-input>
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
  import { post, on, off, getDictListByGroups, getDictValueFromMap, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "cancelStopPaymentRgstRecheck",
    components: {},
    data() {
      return {
        //影像上传
        showUploadImageWin: false,
        authObject: {
          imageAdd: false,       //影像新增
          imageRegister: false,  //登记
          imageDelete: false     //删除
        },
        propsVue: "cancelStopPaymentRgstRecheck",
        id: "",
        imageParams: {
          listId: "",
          imgTypeList: [],
          imgType: "IM10",
          imageUrl: "/ce/cpesrgst/cancelStopPaymentRgst/cancelStopPaymentRgstApply/func_pagingQueryPaperRgstImg", //查询可查看影像url
          imgShowUrl: "/ce/cpesrgst/cancelStopPaymentRgst/cancelStopPaymentRgstApply/func_showImg?id=" //查看影像url
        },
        dictMap: new Map(),
        imgStatusList: [],
        showBillInfoWin: false,
        ifShowMore: false,
        billId: "",
        billNo: "",
        formItem: {
          rgstClass: "RI08",
          billNo: "",
          rgstDt: "",
          imgStatus: "",
          rgstStatus: ""
        },
        //详细信息
        showInfoDetailWin: false,
        showInfoDetailForm: {
          billType: "",
          billNo: "",
          dueDt: "",
          billMoney: "",
          drwrName: "",
          drwrAcctNo: "",
          sspdName: "",
          acptBankNo: "",
          sspdDt: "",
          sspdAcctNo: "",
          sspdBankNo: "",
          sspdType: "",
          rgstDt: "",
          paperRgstType: "",
          sspdSocCode: "",
          sspdReason: "",
          rgstRemark: ""
        },
        billTypeList: [],
        sspdTypeList: [],
        anlgSspdTypeList: [],
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
                            this.showBillInfo(params.row.id,params.row.billNo);
                        }
                    }
                }, params.row.billNo);
            }
          },
          {
            title: this.$t("m.i.billInfo.anlgSspdDt"),
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
            title: this.$t("m.i.ce.paperRgstType"),
            key: "paperRgstType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "AnlgSspdType", params.row.paperRgstType);
              return h("span", { domProps: { title: dictValue } }, dictValue);
            }
          },
          {
            title: this.$t("m.i.common.imgStatus"),
            key: "imgStatus",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "ImgStatus", params.row.imgStatus);
              return h("span", { domProps: { title: dictValue } }, dictValue);
            }
          },
          {
            title: this.$t("m.i.ce.anlgSspdImage"),
            key: "anlgSspdImage",
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
                      this.openImgWin(params.row.id, "IM09");
                    }
                  }
                }, "查看")
              ]);
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
            title: this.$t("m.i.billInfo.acptBankNo"),
            key: "acptBankNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.transFromName"),
            key: "transFromName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.billInfo.relieveReason"),
            key: "sspdReason",
            hiddenCol: false
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
      this.workDate = window.sessionStorage.getItem("workDate");
      getDictListByGroups("Yon,ImgStatus,DraftTypeCode,AcptRgstStatus,SspdType,AnlgSspdType").then(res => {
        this.imgStatusList = res.get("ImgStatus");
        this.billTypeList = res.get("DraftTypeCode");
        this.anlgSspdTypeList = res.get("AnlgSspdType");
        this.sspdTypeList = res.get("SspdType");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      handleRgstDtChange(value) {
        this.formItem.rgstDt = value.replace(/-/g, "");
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

      //票面
      showBillInfo(billId, billNo) {
        this.billId = billId;
        this.billNo = billNo;
        this.showBillInfoWin = true;
      },
      billInfoWinClose() {
        this.showBillInfoWin = false;
      },
      //影像维护弹窗
      openImgWin(str) {
        this.imageParams.listId = str;
        this.imageParams.imgTypeList.push({ key: "IM10", value: "解除止付" });
        this.showUploadImageWin = true;
      },
      //影像维护关闭
      uploadImageWinClose() {
        this.showUploadImageWin = false;
        this.imageParams.imgTypeList = [];
        this.handleSearch();
      },
      //详细信息超链接展示
      showInfoDetail(str) {
        post({ id: str }, "/ce/cpesrgst/cancelStopPaymentRgst/cancelStopPaymentRgstApply/func_queryPaperRgstById").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.showInfoDetailForm.billNo = res.data.retData.billNo;
              this.showInfoDetailForm.billType = res.data.retData.billType;
              this.showInfoDetailForm.billMoney = res.data.retData.billMoney;
              this.showInfoDetailForm.dueDt = this.$moment(res.data.retData.dueDt, "YYYYMMDD").format("YYYY-MM-DD");
              this.showInfoDetailForm.drwrName = res.data.retData.drwrName;
              this.showInfoDetailForm.drwrAcctNo = res.data.retData.drwrAcctNo;
              this.showInfoDetailForm.sspdName = res.data.retData.sspdName;
              this.showInfoDetailForm.acptBankNo = res.data.retData.acptBankNo;
              this.showInfoDetailForm.sspdDt = this.$moment(res.data.retData.sspdDt, "YYYYMMDD").format("YYYY-MM-DD");
              this.showInfoDetailForm.sspdAcctNo = res.data.retData.sspdAcctNo;
              this.showInfoDetailForm.sspdBankNo = res.data.retData.sspdBankNo;
              this.showInfoDetailForm.sspdType = res.data.retData.sspdType;
              this.showInfoDetailForm.rgstDt = this.$moment(res.data.retData.rgstDt, "YYYYMMDD").format("YYYY-MM-DD");
              this.showInfoDetailForm.paperRgstType = res.data.retData.paperRgstType;
              this.showInfoDetailForm.sspdSocCode = res.data.retData.sspdSocCode;
              this.showInfoDetailForm.sspdReason = res.data.retData.sspdReason;
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
          ids: ids,
          isPass: "1"
        }, "/ce/cpesrgst/cancelStopPaymentRgst/cancelStopPaymentRgstRecheck/func_submitCheck").then(res => {
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
          ids: ids,
          isPass: "0"
        }, "/ce/cpesrgst/cancelStopPaymentRgst/cancelStopPaymentRgstRecheck/func_submitCheck").then(res => {
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
      }
    }
  };
</script>

<style scoped>

</style>
