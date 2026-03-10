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
                <h-form-item prop="rgstDt" :label="$t('m.i.billInfo.sspdDt')">
                  <h-date-picker type="date" v-model="formItem.rgstDt" placeholder="" format="yyyy-MM-dd"
                                 :editable=false showFormat @on-change="handleSuspendDtChange"></h-date-picker>
                </h-form-item>
                <h-form-item prop="imgStatus" :label="$t('m.i.common.imgStatus')">
                  <h-select v-model="formItem.imgStatus" placeholder="">
                    <h-option value="BTL00" key="BTL00">未上传</h-option>
                    <h-option value="BTL13" key="BTL13">影像待上传</h-option>
                    <h-option value="BTL04" key="BTL04">影像上传成功</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item prop="rgstStatus" :label="$t('m.i.ce.rgstStatus')">
                  <h-select v-model="formItem.rgstStatus" placeholder="">
                    <h-option value="BTA01" key="BTA01">已录入</h-option>
                    <h-option value="BTA06" key="BTA06">登记复核已驳回</h-option>
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
                      url="/ce/cpesrgst/stopPaymentRgst/stopPaymentRgstApply/func_pagingQueryPaperRgst"
                      :bindForm="formItem"
                      :row-select="true"
                      :has-select="false"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="singleAdd('add')">{{$t("m.i.common.add")}}</h-button>
              <h-button type="primary" @click="singleAdd('modify')">{{$t("m.i.common.modify")}}</h-button>
              <h-button type="primary" @click="busiDelete">{{$t("m.i.common.delete")}}</h-button>
              <h-button type="primary" @click="submitRecheck">{{$t("m.i.common.submitCheck")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <!-- 新增止付登记信息界面 -->
    <h-msg-box v-model="addOrEditWin" width="800" @on-close="addOrEditWinClose" class="h-form-search-layer"
               :maximize="true" :mask-closable="false">
      <p slot="header">
        <span v-if="addOrEditType==='add'">新增止付登记信息</span>
        <span v-if="addOrEditType==='modify'">修改止付登记信息</span>
      </p>
      <div>
        <h-form :model="addOrEditForm" :label-width="115" ref="addOrEditForm" cols="2" class="h-form-search">
          <!--<h-form-item prop="billNo" :label="$t('m.i.billInfo.billNo')" :validRules="billNoRule" required>-->
          <!--<h-input v-model="addOrEditForm.billNo" :maxlength="16" placeholder=""></h-input>-->
          <!--</h-form-item>-->
          <h-form-item :label="$t('m.i.billInfo.billNo')" prop="billNo" :validRules="billNoRule" required>
            <h-row v-if="addOrEditType==='add'">
              <h-col span="18">
                <h-input v-model="addOrEditForm.billNo" :maxlength="16" placeholder=""></h-input>
              </h-col>
              <h-col span="4" offset="1">
                <h-button type="primary" size="small" @click="importBill()">{{$t("m.i.common.import")}}</h-button>
              </h-col>
            </h-row>
            <h-input v-if="addOrEditType==='modify'" v-model="addOrEditForm.billNo" readonly :maxlength="16"
                     placeholder=""></h-input>
          </h-form-item>
          <h-form-item prop="billType" :label="$t('m.i.billInfo.billType')" required>
            <h-select v-model="addOrEditForm.billType" placeholder="" readonly>
              <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item prop="billMoney" :label="$t('m.i.billInfo.billMoney')" required>
            <h-typefield v-model="addOrEditForm.billMoney" readonly :maxlength="20" placeholder="数字，小数位最多2位"
                         bigTips></h-typefield>
          </h-form-item>
          <h-form-item prop="dueDt" :label="$t('m.i.billInfo.dueDt')" required>
            <h-date-picker v-model="addOrEditForm.dueDt" readonly type="date" showFormat :editable=false
                           format="yyyy-MM-dd"></h-date-picker>
          </h-form-item>
          <h-form-item prop="drwrName" :label="$t('m.i.billInfo.drwrName')">
            <h-input v-model="addOrEditForm.drwrName" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item prop="drwrAcctNo" :label="$t('m.i.billInfo.drwrAcctNo')">
            <h-input v-model="addOrEditForm.drwrAcctNo" placeholder="" readonly></h-input>
          </h-form-item>

          <h-form-item prop="acptBankNo" :label="$t('m.i.billInfo.drweBankNo')" required>
            <h-input v-model="addOrEditForm.acptBankNo" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item prop="acptBankName" :label="$t('m.i.billInfo.acptBankName')">
            <h-input v-model="addOrEditForm.acptBankName" placeholder="" readonly></h-input>
          </h-form-item>

          <h-form-item prop="transFromName" :label="$t('m.i.ce.sspdName')" required>
            <h-input v-model="addOrEditForm.transFromName" placeholder=""></h-input>
          </h-form-item>
          <h-form-item prop="rgstDt" :label="$t('m.i.billInfo.sspdDt')" required>
            <h-date-picker v-model="addOrEditForm.rgstDt" type="date" showFormat :editable=false
                           format="yyyy-MM-dd"></h-date-picker>
          </h-form-item>
          <h-form-item prop="transFromAcctNo" :label="$t('m.i.ce.sspdAcctNo')">
            <h-input v-model="addOrEditForm.transFromAcctNo" placeholder=""></h-input>
          </h-form-item>

          <h-form-item prop="transFromBankNo" :label="$t('m.i.ce.sspdBankNo')">
            <h-input v-model="addOrEditForm.transFromBankNo" placeholder="" readonly clearable
                     icon="android-search" @on-click="queryCpesBranchCode()"></h-input>
          </h-form-item>

          <h-form-item prop="paperRgstType" :label="$t('m.i.billInfo.sspdType')" required>
            <h-select v-model="addOrEditForm.paperRgstType" placeholder="">
              <h-option v-for="item in sspdTypeList" :value="item.key" :key="item.key">{{item.value }}</h-option>
            </h-select>
          </h-form-item>

          <h-form-item prop="transFromSocCode" :label="$t('m.i.ce.sspdSocCode')" :validRules="sosCodeRule"
                       class="h-form-long-label">
            <h-input v-model="addOrEditForm.transFromSocCode" placeholder="" :maxlength="18"></h-input>
          </h-form-item>

          <h-form-item prop="sspdReason" :label="$t('m.i.ce.sspdReason')" class="h-form-height-auto" required>
            <h-input type="textarea" :rows=3 v-model="addOrEditForm.sspdReason" :canResize="false"
                     :maxlength="100"></h-input>
          </h-form-item>

          <h-form-item prop="rgstRemark" :label="$t('m.i.common.remark')" class="h-form-height-auto">
            <h-input type="textarea" :rows=3 v-model="addOrEditForm.rgstRemark" :canResize="false"
                     :maxlength="300"></h-input>
          </h-form-item>
        </h-form>
      </div>
      <div slot="footer">
        <div slot="footer">
          <h-button type="ghost" @click="addOrEditWinClose">{{$t("m.i.common.close")}}</h-button>
          <h-button type="primary" @click="addOrEditWinSubmit()">{{$t("m.i.common.commit")}}</h-button>
        </div>
      </div>
    </h-msg-box>
    <image-loading
      :imageWin="showUploadImageWin"
      :imageParams="imageParams"
      :showImgPlat="true"
      @imageWinClose="uploadImageWinClose"></image-loading>

    <!-- 查看票面 -->
    <rgst-bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"
                    :billNo="this.billNo"></rgst-bill-info-main>

    <show-cpes-branch :showCpesBranch="showCpesBranchWin" @showCpesBranchClose="showCpesBranchClose"
                      @showCpesBranchSubmit="showCpesBranchSubmit"></show-cpes-branch>
  </div>
</template>

<script>
  import { post, on, off, getDictListByGroups, getDictValueFromMap, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "stopPaymentRgstApply",
    components: {
      ShowCpesBranch: () => import(/* webpackChunkName: "shcpe/cpes/branch/showCpesBranch" */`@/views/bizViews/shcpe/cpes/branch/showCpesBranch`)
    },
    data() {
      return {
        //影像上传
        showUploadImageWin: false,
        //票交所机构
        showCpesBranchWin: false,
        id: "",
        propsVue: "stopPaymentRgstApply",
        imageParams: {
          listId: "",
          imgBusiType: "suspendImage",
          prodNo: "RI07",
          imgTypeList: [],
          imgType: "IM09",
          imageUrl: "/ce/cpesrgst/stopPaymentRgst/stopPaymentRgstApply/func_pagingQueryPaperRgstImg", //查询可查看影像url
          imageUploadUrl: "/ce/cpesrgst/stopPaymentRgst/stopPaymentRgstApply/func_saveImg", //影像上传url
          imageRegisterUrl: "/ce/cpesrgst/stopPaymentRgst/stopPaymentRgstApply/func_sendImgRgstMsg", //影像登记url
          imageDeleteUrl: "/ce/cpesrgst/stopPaymentRgst/stopPaymentRgstApply/func_deleteImg", //影像删除url
          imgShowUrl: "/ce/cpesrgst/stopPaymentRgst/stopPaymentRgstApply/func_showImg?id=", //查看影像url
          busiType: "RI09"
        },
        showBillInfoWin: false,
        billId: "",
        billNo: "",
        dictMap: new Map(),
        ifShowMore: false,
        formItem: {
          rgstClass: "RI07",
          billNo: "",
          rgstDt: "",
          imgStatus: "",
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
            title: this.$t("m.i.billInfo.sspdDt"),
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
            title: this.$t("m.i.ce.stopPayType"),
            key: "paperRgstType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "SspdType", params.row.paperRgstType);
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
            title: this.$t("m.i.ce.sspdImage"),
            key: "sspdImage",
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
            title: this.$t("m.i.ce.sspdName"),
            key: "transFromName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.billInfo.sspdReason"),
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
        ],
        addOrEditType: "",
        addOrEditWin: false,
        addOrEditForm: {
          id: "",
          billType: "",
          billNo: "",
          dueDt: "",
          billMoney: "",
          drwrName: "",
          drwrAcctNo: "",
          transFromName: "",
          acptBankNo: "",
          acptBankName: "",
          rgstDt: "",
          transFromAcctNo: "",
          transFromBankNo: "",
          paperRgstType: "",
          transFromSocCode: "",
          sspdReason: "",
          rgstRemark: ""
        },
        billNoRule: [{ test: validBillNo, trigger: "blur" }],
        sosCodeRule: [{ test: validSosCode, trigger: "blur" }],
        sspdTypeList: [],
        billTypeList: []


      };

      function validBillNo(rule, val, callback) {
        let type = val.substring(6, 7);
        let billType = "";
        if (type === "5") {
          billType = "AC01";
        } else if (type === "6") {
          billType = "AC02";
        } else {
          billType = "";
        }
        if (billType === "AC01") {
          let re = /^[0-9]{3}0[0-9]{2}[5][0-9]{9}$/;
          if (re.test(val)) {
            callback();
          } else {
            callback(new Error("银票号码为16位数字,第四位为0,第七位为5"));
          }
        } else if (billType === "AC02") {
          let re = /^[0-9]{3}0[0-9]{2}[6][0-9]{9}$/;
          if (re.test(val)) {
            callback();
          } else {
            callback(new Error("商票号码为16位数字,第四位为0,第七位为6"));
          }
        } else {
          callback(new Error("票据号码输入不符合规范"));
        }
      }

      function validSosCode(rule, val, callback) {
        let re = /([a-zA-Z0-9]{2})([0-9]{6})([a-zA-Z0-9]{10})/;
        if (re.test(val)) {
          callback();
        } else if (val === "" || val === null || val === undefined) {
          callback();
        } else {
          callback(new Error("非法输入，社会信用代码由两位数字或字母，加六位数字，加十位数字或字母组成，且为18位"));
        }
      }
    },
    mounted() {
      this.workDate = window.sessionStorage.getItem("workDate");
      getDictListByGroups("SspdType,DraftTypeCode,ImgStatus,AcptRgstStatus").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.sspdTypeList = res.get("SspdType");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      handleSuspendDtChange(value) {
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
      //影像维护弹窗
      openImgWin(str) {
        this.imageParams.imgTypeList.push({ key: "IM09", value: "止付" });
        this.imageParams.listId = str;
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
      //导入
      importBill() {
        if (this.addOrEditForm.billNo === "") {
          this.$msgTip.info(this, { info: "请先输入票据号码" });
          return;
        }
        let billType = (this.addOrEditForm.billNo).substring(6, 7);
        if (billType === "5") {
          this.addOrEditForm.billType = "AC01";
        } else if (billType === "6") {
          this.addOrEditForm.billType = "AC02";
        } else {
          this.addOrEditForm.billType = "";
        }
        let flag = this.validBillNo(this.addOrEditForm.billNo);
        let billNo = this.addOrEditForm.billNo;
        if (flag) {
          post({ code: billNo }, "/ce/cpesrgst/stopPaymentRgst/stopPaymentRgstApply/func_importBillInfo").then(res => {
            if (res) {
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                let obj = res.data.retData;
                if (obj !== null) {
                  this.addOrEditForm.billType = res.data.retData.billType;
                  this.addOrEditForm.billMoney = res.data.retData.billMoney;
                  this.addOrEditForm.dueDt = this.$moment(res.data.retData.dueDt, "YYYYMMDD").format("YYYY-MM-DD");
                  this.addOrEditForm.drwrName = res.data.retData.drwrName;
                  this.addOrEditForm.drwrAcctNo = res.data.retData.drwrAcctNo;
                  this.addOrEditForm.acptBankNo = res.data.retData.acptBankNo;
                  this.addOrEditForm.acptBankName = res.data.retData.acptBankName;
                } else {
                  this.$msgTip.info(this, { info: "未找到票号" + this.addOrEditForm.billNo + "的相关信息！" });
                  // this.initBillInfo(this.discAddBillInfoForm.billNo);
                }
              } else {
                this.$msgTip.error(this, { info: res.data.retMsg });
              }
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            }
          });
        } else {
          this.$msgTip.info(this, { info: "输入的票号不符合规范" });
        }
      },
      //票据导入前校验
      validBillNo(billNo) {
        let flag = false;
        if (this.addOrEditForm.billType === "AC01") {
          let re = /^[0-9]{3}0[0-9]{2}[5][0-9]{9}$/;
          if (re.test(billNo)) {
            flag = true;
          }
        } else if (this.addOrEditForm.billType === "AC02") {
          let re = /^[0-9]{3}0[0-9]{2}[6][0-9]{9}$/;
          if (re.test(billNo)) {
            flag = true;
          }
        }
        return flag;
      },
      //单笔新增、修改
      singleAdd(type) {
        this.addOrEditType = type;
        if (this.addOrEditType === "modify") {
          let list = this.$refs.datagrid.selects;
          if (list.length === 0) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
            return;
          }
          if (list.length > 1) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
            return;
          }
          let id = list[0].id;
          post({ id: id }, "/ce/cpesrgst/stopPaymentRgst/stopPaymentRgstApply/func_queryPaperRgstById").then(res => {
            if (res) {
              let msg = res.data.retMsg;
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.addOrEditWin = true;
                this.$nextTick(() => {
                  this.addOrEditForm.id = id;
                  this.addOrEditForm.billNo = res.data.retData.billNo;
                  this.addOrEditForm.billType = res.data.retData.billType;
                  this.addOrEditForm.billMoney = res.data.retData.billMoney;
                  this.addOrEditForm.dueDt = this.$moment(res.data.retData.dueDt, "YYYYMMDD").format("YYYY-MM-DD");
                  this.addOrEditForm.drwrName = res.data.retData.drwrName;
                  this.addOrEditForm.drwrAcctNo = res.data.retData.drwrAcctNo;
                  this.addOrEditForm.transFromName = res.data.retData.transFromName;
                  this.addOrEditForm.acptBankNo = res.data.retData.acptBankNo;
                  this.addOrEditForm.acptBankName = res.data.retData.acptBankName;
                  this.addOrEditForm.rgstDt = this.$moment(res.data.retData.rgstDt, "YYYYMMDD").format("YYYY-MM-DD");
                  this.addOrEditForm.transFromAcctNo = res.data.retData.transFromAcctNo;
                  this.addOrEditForm.transFromBankNo = res.data.retData.transFromBankNo;
                  this.addOrEditForm.paperRgstType = res.data.retData.paperRgstType;
                  this.addOrEditForm.transFromSocCode = res.data.retData.transFromSocCode;
                  this.addOrEditForm.sspdReason = res.data.retData.sspdReason;
                  this.addOrEditForm.rgstRemark = res.data.retData.rgstRemark;
                });
              } else {
                this.$msgTip.error(this, { info: msg });
              }
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            }
          });
        } else if (this.addOrEditType === "add") {
          this.addOrEditWin = true;
          this.$nextTick(() => {
            this.addFormReset();
          });
        }
      },
      addFormReset() {
        this.addOrEditForm.id = "";
        this.$refs.addOrEditForm.resetFields();
      },
      //提交
      addOrEditWinSubmit() {
        this.$refs["addOrEditForm"].validate(valid => {
          if (valid) {
            let url = this.addOrEditType === "add" ? "/ce/cpesrgst/stopPaymentRgst/stopPaymentRgstApply/func_addSuspendRgstInfo" : "/ce/cpesrgst/stopPaymentRgst/stopPaymentRgstApply/func_updateSuspendPaperRgst";
            this.addOrEditForm.dueDt = this.$moment(this.addOrEditForm.dueDt).format("YYYYMMDD");
            this.addOrEditForm.rgstDt = this.$moment(this.addOrEditForm.rgstDt).format("YYYYMMDD");
            let pageNo = this.addOrEditType === "add" ? 1 : this.$refs.datagrid.pageInfo.pageNo;
            post(this.addOrEditForm, url).then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.addOrEditWin = false;
                  this.$refs.datagrid.selects = [];
                  this.$refs.datagrid.dataChange(pageNo);
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      //关闭
      addOrEditWinClose() {
        this.addFormReset();
        this.addOrEditWin = false;
      },

      //删除
      busiDelete() {
        if (this.$refs.datagrid.selects.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("m.i.common.isConfirmDelete") + "?",
          onOk: () => {
            this.handleDel();
          }
        });
      },
      handleDel() {
        let list = this.$refs.datagrid.selects;
        let ids = "";
        for (let i = 0, count = list.length; i < count; i++) {
          ids += list[i].id;
          if (i < list.length - 1) {
            ids += ",";
          }
        }
        post({ ids: ids }, "/ce/cpesrgst/stopPaymentRgst/stopPaymentRgstApply/func_deleteSuspendPaperRgst").then(res => {
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


      //提交复核
      submitRecheck() {
        if (this.$refs.datagrid.selects.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.$hMsgBox.confirm({
          title: "确认",
          content: "确定提交复核吗？",
          onOk: () => {
            this.handleRecheck();
          }
        });
      },
      handleRecheck() {
        let list = this.$refs.datagrid.selects;
        let ids = "";
        for (let i = 0, count = list.length; i < count; i++) {
          ids += list[i].id;
          if (i < list.length - 1) {
            ids += ",";
          }
        }
        post({ ids: ids }, "/ce/cpesrgst/stopPaymentRgst/stopPaymentRgstApply/func_submitRgstApply").then(res => {
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
      //票交所机构弹窗
      queryCpesBranchCode() {
        this.showCpesBranchWin = true;
      },
      showCpesBranchSubmit(info) {
        if (info === null) {
          this.$hMessage.info("请先选择记录！");
          return;
        }
        this.addOrEditForm.transFromBankNo = info.transBrchBankNo;
        this.showCpesBranchClose();
      },
      showCpesBranchClose() {
        this.showCpesBranchWin = false;
      }
    }
  };
</script>

<style scoped>

</style>
