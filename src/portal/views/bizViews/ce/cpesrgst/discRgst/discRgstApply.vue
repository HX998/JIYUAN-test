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
                <h-form-item prop="rgstDt" :label="$t('m.i.billInfo.discDt')">
                  <h-date-picker type="date" v-model="formItem.rgstDt" placeholder="" format="yyyy-MM-dd"
                                 :editable=false showFormat @on-change="handleRgstDtChange"></h-date-picker>
                </h-form-item>
                <h-form-item prop="transFromName" :label="$t('m.i.ce.discountApplyName')" :label-width="110">
                  <h-input v-model="formItem.transFromName" placeholder=""></h-input>
                </h-form-item>
                <h-form-item prop="rgstStatus" :label="$t('m.i.ce.rgstStatus')">
                  <h-select v-model="formItem.rgstStatus" placeholder="">
                    <h-option value="BTA01" key="BTA01">已录入</h-option>
                    <h-option value="BTA06" key="BTA06">登记复核已驳回</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item prop="imgStatus" :label="$t('m.i.common.imgStatus')">
                  <h-select v-model="formItem.imgStatus" placeholder="">
                    <h-option value="BTL00" key="BTL00">未上传</h-option>
                    <h-option value="BTL13" key="BTL13">影像待上传</h-option>
                    <h-option value="BTL04" key="BTL04">影像上传成功</h-option>
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
                      url="/ce/cpesrgst/discRgst/discRgstApply/func_pagingQueryPaperRgst"
                      :bindForm="formItem"
                      :row-select="true"
                      :has-select="false"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="singleAdd('add')">{{$t("m.i.ce.singleAdd")}}</h-button>
              <h-button type="primary" @click="singleAdd('modify')">{{$t("m.i.common.modify")}}</h-button>
              <h-button type="primary" @click="busiDelete">{{$t("m.i.common.delete")}}</h-button>
              <h-button type="primary" @click="templateDownload">{{$t("m.i.common.templateDownload")}}</h-button>
              <h-button type="primary" @click="batchImport">{{$t("m.i.common.batchImport")}}</h-button>
              <h-button type="primary" @click="submitRecheck">{{$t("m.i.common.submitCheck")}}</h-button>
              <h-button type="primary" @click="batchEdit">{{$t("m.i.common.batchEdit")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <!-- 新增贴现登记信息界面 -->
    <h-msg-box v-model="addOrEditWin" width="800" @on-close="addOrEditWinClose" class="h-form-search-layer"
               :maximize="true" :mask-closable="false">
      <p slot="header">
        <span v-if="addOrEditType ==='add'">新增贴现登记信息</span>
        <span v-if="addOrEditType ==='modify'">修改贴现登记信息</span>
      </p>
      <div>
        <h-form :model="addOrEditForm" :label-width="115" ref="addOrEditForm" cols="2" class="h-form-search">
          <h-form-item prop="billType" :label="$t('m.i.billInfo.billType')" required>
            <h-select v-model="addOrEditForm.billType" placeholder="" :readonly="addOrEditType==='modify'">
              <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item prop="billNo" :label="$t('m.i.billInfo.billNo')" :validRules="billNoRule" required>
            <h-input v-model="addOrEditForm.billNo" :maxlength="16" placeholder=""
                     :readonly="addOrEditType==='modify'"></h-input>
          </h-form-item>
          <h-form-item prop="billMoney" :label="$t('m.i.billInfo.billMoney')" required :validRules="billMoneyRule">
            <h-typefield v-model="addOrEditForm.billMoney" :maxlength="12" placeholder="数字，小数位最多2位"
                         bigTips></h-typefield>
          </h-form-item>
          <h-form-item prop="dueDt" :label="$t('m.i.billInfo.dueDt')" required>
            <h-date-picker v-model="addOrEditForm.dueDt" type="date" showFormat :editable=false
                           format="yyyy-MM-dd"></h-date-picker>
          </h-form-item>
          <h-form-item prop="acptName" :label="$t('m.i.billInfo.acptName')">
            <h-input v-model="addOrEditForm.acptName" placeholder="" :maxlength="60" :lengthByByte="false"></h-input>
          </h-form-item>
          <h-form-item prop="acptBankNo" :label="$t('m.i.billInfo.acptBankNo')" required>
            <h-input v-model="addOrEditForm.acptBankNo" placeholder="" :maxlength="12" readonly
                     icon="android-search" @on-click="queryCpesBranchCode('acpt')"></h-input>
          </h-form-item>
          <h-form-item prop="acptBankName" :label="$t('m.i.billInfo.acptBankName')">
            <h-input v-model="addOrEditForm.acptBankName" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item prop="drwrName" :label="$t('m.i.billInfo.drwrName')">
            <h-input v-model="addOrEditForm.drwrName" placeholder="" :maxlength="60" :lengthByByte="false"></h-input>
          </h-form-item>
          <h-form-item prop="drwrAcctNo" :label="$t('m.i.billInfo.drwrAcctNo')">
            <h-input v-model="addOrEditForm.drwrAcctNo" placeholder="" :maxlength="32"></h-input>
          </h-form-item>
          <h-form-item prop="drwrBankNo" :label="$t('m.i.billInfo.drwrBankNo')">
            <h-input v-model="addOrEditForm.drwrBankNo" placeholder="" readonly
                     icon="android-search" @on-click="queryCpesBranchCode('drwr')"></h-input>
          </h-form-item>
          <h-form-item prop="drwrBankName" :label="$t('m.i.billInfo.drwrBankName')">
            <h-input v-model="addOrEditForm.drwrBankName" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item prop="pyeeName" :label="$t('m.i.billInfo.pyeeName')">
            <h-input v-model="addOrEditForm.pyeeName" placeholder="" :maxlength="60" :lengthByByte="false"></h-input>
          </h-form-item>
          <h-form-item prop="pyeeAcctNo" :label="$t('m.i.billInfo.pyeeAcctNo')">
            <h-input v-model="addOrEditForm.pyeeAcctNo" placeholder="" :maxlength="32"></h-input>
          </h-form-item>
          <h-form-item prop="pyeeBankNo" :label="$t('m.i.billInfo.pyeeBankNo')">
            <h-input v-model="addOrEditForm.pyeeBankNo" placeholder="" readonly
                     icon="android-search" @on-click="queryCpesBranchCode('pyee')"></h-input>
          </h-form-item>
          <h-form-item prop="pyeeBankName" :label="$t('m.i.billInfo.pyeeBankName')">
            <h-input v-model="addOrEditForm.pyeeBankName" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item prop="rgstDt" :label="$t('m.i.billInfo.discDt')" required>
            <h-date-picker v-model="addOrEditForm.rgstDt" type="date" showFormat :editable=false
                           format="yyyy-MM-dd"></h-date-picker>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.discInterestRate')" prop="discInterestRate" :validRules="discRateRule"
                       required>
            <h-input v-model="addOrEditForm.discInterestRate" placeholder="利率范围0~100" :maxlength=8
                     :style="{width:'160px'}"></h-input>
            <span>(%)</span>
          </h-form-item>

          <h-form-item prop="transFromName" :label="$t('m.i.ce.discountOutName')" required>
            <h-input v-model="addOrEditForm.transFromName" placeholder="" :maxlength="60" :lengthByByte="false"></h-input>
          </h-form-item>
          <h-form-item prop="transFromAcctNo" :label="$t('m.i.ce.transFromAcctNo')" required>
            <h-input v-model="addOrEditForm.transFromAcctNo" placeholder="" :maxlength="32"></h-input>
          </h-form-item>
          <h-form-item prop="transFromBankNo" :label="$t('m.i.ce.transFromBankNo')" required>
            <h-input v-model="addOrEditForm.transFromBankNo" placeholder="" readonly
                     icon="android-search" @on-click="queryCpesBranchCode('transFrom')"></h-input>
          </h-form-item>
          <h-form-item prop="transFromSocCode" :label="$t('m.i.ce.transFromSocCode')" :validRules="sosCodeRule" required
                       class="h-form-long-label">
            <h-input v-model="addOrEditForm.transFromSocCode" placeholder="" :maxlength="18"></h-input>
          </h-form-item>
          <h-form-item prop="transFromIndustry" :label="$t('m.i.ce.transFromIndustry')" required>
            <h-select v-model="addOrEditForm.transFromIndustry" :maxlength=60>
              <h-option v-for="item in industryCategoryList" :value="item.key" :key="item.key">{{ item.value }}
              </h-option>
            </h-select>
          </h-form-item>
          <h-form-item prop="transFromCorpScale" :label="$t('m.i.ce.transFromCorpScale')" required>
            <h-select v-model="addOrEditForm.transFromCorpScale" :maxlength=60>
              <h-option v-for="item in corpScaleList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item prop="isTransFromArc" :label="$t('m.i.ce.isTransFromArc')" required class="h-form-long-label">
            <h-select v-model="addOrEditForm.isTransFromArc" :maxlength=60>
              <h-option v-for="item in isList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item prop="transFromArea" :label="$t('m.i.ce.transFromArea')" required>
            <h-select v-model="addOrEditForm.transFromArea" :maxlength=60>
              <h-option v-for="item in areaList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item prop="isTransFromGrn" :label="$t('m.i.ce.isTransFromGrn')" required class="h-form-long-label">
            <h-select v-model="addOrEditForm.isTransFromGrn" :maxlength=60>
              <h-option v-for="item in isList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item prop="transToBankNo" :label="$t('m.i.ce.transToBankNo')" required>
            <h-input v-model="addOrEditForm.transToBankNo" placeholder="" readonly
                     icon="android-search" @on-click="queryCpesBranchCode('transTo')"></h-input>
          </h-form-item>
          <h-form-item prop="transToBankName" :label="$t('m.i.ce.transToBankName')" required>
            <h-input v-model="addOrEditForm.transToBankName" placeholder="" readonly></h-input>
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

    <!-- 批量修改界面 -->
    <h-msg-box v-model="batchEditWin" width="400" @on-close="batchEditWinClose" class="h-form-search-layer"
               :maximize="true" :mask-closable="false">
      <p slot="header">
        <span>批量修改贴出人信息页面</span>
      </p>
      <div>
        <h-form :model="batchEditForm" :label-width="115" ref="batchEditForm" cols="1" class="h-form-search">
          <h-form-item prop="drwrIndustry" :label="$t('m.i.ce.transFromIndustry')" required>
            <h-select v-model="batchEditForm.drwrIndustry" placeholder="">
              <h-option v-for="item in industryCategoryList" :value="item.key" :key="item.key">{{item.value }}
              </h-option>
            </h-select>
          </h-form-item>
          <h-form-item prop="drwrCorpScale" :label="$t('m.i.ce.transFromCorpScale')" required>
            <h-select v-model="batchEditForm.drwrCorpScale" placeholder="">
              <h-option v-for="item in corpScaleList" :value="item.key" :key="item.key">{{item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item prop="drwrArea" :label="$t('m.i.ce.transFromArea')" required>
            <h-select v-model="batchEditForm.drwrArea" placeholder="">
              <h-option v-for="item in areaList" :value="item.key" :key="item.key">{{item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item prop="isDrwrGrn" :label="$t('m.i.ce.isTransFromGrn')" required class="h-form-long-label">
            <h-select v-model="batchEditForm.isDrwrGrn" placeholder="">
              <h-option v-for="item in isList" :value="item.key" :key="item.key">{{item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item prop="isDrwrArc" :label="$t('m.i.ce.isTransFromArc')" required class="h-form-long-label">
            <h-select v-model="batchEditForm.isDrwrArc" placeholder="">
              <h-option v-for="item in isList" :value="item.key" :key="item.key">{{item.value }}</h-option>
            </h-select>
          </h-form-item>
        </h-form>
      </div>
      <div slot="footer">
        <div slot="footer">
          <h-button type="ghost" @click="batchEditWinClose">{{$t("m.i.common.close")}}</h-button>
          <h-button type="primary" @click="batchEditWinSubmit()">{{$t("m.i.common.commit")}}</h-button>
        </div>
      </div>
    </h-msg-box>

    <!--文件批量导入-->
    <common-file-upload :importWin="importWin" :fileParams="fileParams" @importWinClose="importWinClose"
                        @importSuccess="importSuccess"></common-file-upload>
    <!-- 查看票面 -->
    <rgst-bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"
                    :billNo="this.billNo"></rgst-bill-info-main>

    <!-- 影像维护 -->
    <image-loading
      :imageWin="showUploadImageWin"
      :imageParams="imageParams"
      :showImgPlat="true"
      @imageWinClose="uploadImageWinClose"></image-loading>

    <!-- 票交所机构 -->
    <show-cpes-branch :showCpesBranch="showCpesBranchWin" @showCpesBranchClose="showCpesBranchClose"
                      @showCpesBranchSubmit="showCpesBranchSubmit"></show-cpes-branch>


  </div>
</template>

<script>
  import {
    post,
    on,
    off,
    getDictListByGroups,
    accMul,
    getDictValueFromMap,
    formatNumber
  } from "@/api/bizApi/commonUtil";

  export default {
    name: "discRgstApply",
    components: {
      ShowCpesBranch: () => import(/* webpackChunkName: "shcpe/cpes/branch/showCpesBranch" */`@/views/bizViews/shcpe/cpes/branch/showCpesBranch`)
    },
    data() {
      return {
        //批量修改
        batchEditWin: false,
        batchEditForm: {
          listIds: "",
          drwrIndustry: "",
          drwrCorpScale: "",
          drwrArea: "",
          isDrwrGrn: "",
          isDrwrArc: ""
        },

        showCpesBranchWin: false,
        cpesBranchType: "",
        discRateRule: [{
          test: /^(((\d|[1-9]\d)(\.\d{1,4})?)|100|100\.0|100\.00|100\.000|100\.0000)$/,
          trigger: "blur",
          message: "利率为0~100之间的数，小数位不超过4位"
        }],
        //影像上传
        showUploadImageWin: false,
        propsVue: "discRgstApply",
        imageParams: {
          imgTypeList: [],//影像类型数据字典
          imgBusiType: "discImage",
          prodNo: "RI04",
          listId: "",
          imageUrl: "/ce/cpesrgst/discRgst/discRgstApply/func_pagingQueryPaperRgstImg", //查询可查看影像url
          imageUploadUrl: "/ce/cpesrgst/discRgst/discRgstApply/func_saveImg", //影像上传url
          imageRegisterUrl: "/ce/cpesrgst/discRgst/discRgstApply/func_sendImgRgstMsg", //影像登记url
          imageDeleteUrl: "/ce/cpesrgst/discRgst/discRgstApply/func_deleteImg", //影像删除url
          imgShowUrl: "/ce/cpesrgst/discRgst/discRgstApply/func_showImg?id=", //查看影像url
          busiType: "RI08",
          billNo: ""
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
        rgstStatusList: [],
        corpScaleList: [],
        billTypeList: [],

        ifShowMore: false,
        formItem: {
          rgstClass: "RI04",
          billNo: "",
          transFromName: "",
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
            title: this.$t("m.i.common.imgStatus"),
            key: "imgStatus",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "ImgStatus", params.row.imgStatus);
              return h("span", { domProps: { title: dictValue } }, dictValue);
            }
          },
          {
            title: this.$t("m.i.ce.discountImg"),
            key: "discImage",
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
                      this.openImgWin(params.row.id, params.row.billNo);
                    }
                  }
                }, "维护")
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
          },
          {
            title: this.$t("m.i.billInfo.dataSource"),
            key: "dataScourse",
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
            title: this.$t("m.i.common.isGreenCorp"),
            key: "isTransFromGrn",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "Yon", params.row.isTransFromGrn);
              return h("span", { domProps: { title: dictValue } }, dictValue);
            }
          },
          {
            title: this.$t("m.i.ce.transFromSocCode"),
            key: "transFromSocCode",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.industryCategory"),
            key: "transFromIndustry",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "Industry", params.row.transFromIndustry);
              return h("span", { domProps: { title: dictValue } }, dictValue);
            }
          },
          {
            title: this.$t("m.i.common.corpScale"),
            key: "transFromCorpScale",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "CorpScale", params.row.transFromCorpScale);
              return h("span", { domProps: { title: dictValue } }, dictValue);
            }
          },
          {
            title: this.$t("m.i.common.isArc"),
            key: "isTransFromArc",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "Yon", params.row.isTransFromArc);
              return h("span", { domProps: { title: dictValue } }, dictValue);
            }
          },
          {
            title: this.$t("m.i.common.area"),
            key: "transFromArea",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "Province", params.row.transFromArea);
              return h("span", { domProps: { title: dictValue } }, dictValue);
            }
          }
        ],
        addOrEditType: "",
        addOrEditWin: false,
        addOrEditForm: {
          billType: "AC01",
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
          isTransFromArc: "0",
          transFromArea: "",
          isTransFromGrn: "0",
          transToBankNo: this.$store.getters.userInfo.bankNo,
          transToBankName: this.$store.getters.userInfo.brchName,
          rgstRemark: ""
        },
        billNoRule: [{ test: this.validBillNo, trigger: "blur" }],
        sosCodeRule: [{ test: this.validSosCode, trigger: "blur" }],
        billMoneyRule: [{ test: this.validBillMoney, trigger: "blur", }],

        //导入
        importWin: false,
        fileParams: {
          //导入excel数据解析接口
          loadExcelUrl: window.LOCAL_CONFIG.API_HOME + "/ce/cpesrgst/discRgst/discRgstApply/analysisExcelData",
          //excel数据导入接口
          fileUploadUrl: window.LOCAL_CONFIG.API_HOME + "/ce/cpesrgst/discRgst/discRgstApply/func_saveExcelData",
          formItem: {},           //请求表格数据时附带参数
          uploadParams: {},       //调用excel数据解析接口时附带的额外参数
          extraGridDatas: {},     //需在反显数据中额外添加的字段
          columns: [
            {
              type: "radio",
              title: " ",
              width: 60,
              align: "center",
              hiddenCol: false
            },
            {
              type: "index",
              title: this.$t("m.i.common.index"),
              width: 60,
              align: "center"
            },
            {
              title: this.$t("m.i.billInfo.billType"),
              key: "billType",
              hiddenCol: false,
              render: (h, params) => {
                let list = getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
                return h("span",
                  {
                    domProps: {
                      title: list
                    }
                  }, list);
              }
            },
            {
              title: this.$t("m.i.billInfo.billNo"),
              key: "billNo",
              hiddenCol: false,
            },
            {
              title: this.$t("m.i.billInfo.billMoneyByUnit"),
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
                let date = params.row.dueDt == null ? "" : this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
                return h("span", date);
              }
            },
            {
              title: this.$t("m.i.billInfo.acptBankNo"),
              key: "acptBankNo",
              hiddenCol: false
            },
            {
              title: this.$t("m.i.billInfo.discDt"),
              key: "rgstDt",
              hiddenCol: false,
              sortable: true,
              render: (h, params) => {
                let date = params.row.rgstDt == null ? "" : this.$moment(params.row.rgstDt, "YYYY-MM-DD").format("YYYY-MM-DD");
                return h("span", date);
              }
            },
            {
              title: this.$t("m.i.billInfo.discInterestRate"),
              key: "discInterestRate",
              hiddenCol: false,
              sortable: true,
              render: (h, params) => {
                if (params.row.discInterestRate != null && params.row.discInterestRate !== "") {
                  let rate = params.row.discInterestRate + "(%)";
                  return h("span", rate);
                }
              }
            },
            {
              title: this.$t("m.i.ce.discountOutName"),
              key: "transFromName",
              hiddenCol: false
            },
            {
              title: this.$t("m.i.ce.transFromAcctNo"),
              key: "transFromAcctNo",
              hiddenCol: false
            },
            {
              title: this.$t("m.i.ce.transFromArea"),
              key: "transFromArea",
              hiddenCol: false,
              render: (h, params) => {
                let list = getDictValueFromMap(this.dictMap, "Province", params.row.transFromArea);
                return h("span", { domProps: { title: list } }, list);
              }
            },
            {
              title: this.$t("m.i.ce.isTransFromGrn"),
              key: "isTransFromGrn",
              hiddenCol: false,
              render: (h, params) => {
                let list = getDictValueFromMap(this.dictMap, "Yon", params.row.isTransFromGrn);
                return h("span", { domProps: { title: list } }, list);
              }
            },
            {
              title: this.$t("m.i.ce.transFromSocCode"),
              key: "transFromSocCode",
              hiddenCol: false
            },
            {
              title: this.$t("m.i.ce.transFromIndustry"),
              key: "transFromIndustry",
              hiddenCol: false,
              render: (h, params) => {
                let list = getDictValueFromMap(this.dictMap, "Industry", params.row.transFromIndustry);
                return h("span", { domProps: { title: list } }, list);
              }
            },
            {
              title: this.$t("m.i.ce.transFromCorpScale"),
              key: "transFromCorpScale",
              hiddenCol: false,
              render: (h, params) => {
                let list = getDictValueFromMap(this.dictMap, "CorpScale", params.row.transFromCorpScale);
                return h("span", { domProps: { title: list } }, list);
              }
            },
            {
              title: this.$t("m.i.ce.isTransFromArc"),
              key: "isTransFromArc",
              hiddenCol: false,
              render: (h, params) => {
                let list = getDictValueFromMap(this.dictMap, "Yon", params.row.isTransFromArc);
                return h("span", { domProps: { title: list } }, list);
              }
            },
            {
              title: this.$t("m.i.ce.transToBankNo"),
              key: "transToBankNo",
              hiddenCol: false
            },
            {
              title: this.$t("m.i.ce.transFromBankNo"),
              key: "transFromBankNo",
              hiddenCol: false
            },
            {
              title: this.$t("m.i.common.remark"),
              key: "rgstRemark",
              hiddenCol: false
            },
            {
              title: this.$t("m.i.billInfo.acptName"),
              key: "acptName",
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
            }
          ],
          paramKey: "list"         //后台接收对应key
        }

      };
    },
    mounted() {
      getDictListByGroups("CorpScale,Yon,Province,Industry,ImgStatus,DraftTypeCode,AcptRgstStatus").then(res => {
        this.rgstStatusList = res.get("AcptRgstStatus");
        this.corpScaleList = res.get("CorpScale");
        this.isList = res.get("Yon");
        this.areaList = res.get("Province");
        this.industryCategoryList = res.get("Industry");
        this.billTypeList = res.get("DraftTypeCode");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      validSosCode(rule, val, callback) {
        let re = /([a-zA-Z0-9]{2})([0-9]{6})([a-zA-Z0-9]{10})/;
        if (re.test(val)) {
          callback();
        } else {
          callback(new Error("非法输入，社会信用代码由两位数字或字母，加六位数字，加十位数字或字母组成，且为18位"));
        }
      },
      validBillNo(rule, val, callback) {
        if (this.addOrEditForm.billType === "AC01") {
          let re = /^[0-9]{3}0[0-9]{2}[5][0-9]{9}$/;
          if (re.test(val)) {
            callback();
          } else {
            callback(new Error("银票号码为16位数字,第四位为0,第七位为5"));
          }
        } else if (this.addOrEditForm.billType === "AC02") {
          let re = /^[0-9]{3}0[0-9]{2}[6][0-9]{9}$/;
          if (re.test(val)) {
            callback();
          } else {
            callback(new Error("商票号码为16位数字,第四位为0,第七位为6"));
          }
        } else {
          callback(new Error("请选择票据种类"));
        }
      },
      validBillMoney(rule, val, callback) {
        let value = val.toString().replace(/,/g, "");
        let re = /^([1-9]\d{0,8}|0)([.]?|(\.\d{1,2})?)$/;
        if (re.test(value)) {
          if(value> 0 && value<=1000000){
            callback();
          }else{
            callback(new Error("票面金额应小于等于1,000,000.00、大于0.00"));
          }
        } else {
          callback(new Error("票据金额为大于等于0的不超过100万的数字，且小数位不超过两位"));
        }
      },
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
      //影像维护弹窗
      openImgWin(str, billNo) {
        this.imageParams.listId = str;
        this.imageParams.imgTypeList.push({ key: "IM03", value: "贴现正面" });
        this.imageParams.imgTypeList.push({ key: "IM04", value: "贴现背面" });
        this.imageParams.imgTypeList.push({ key: "IM05", value: "贴现凭证" });
        this.imageParams.imgTypeList.push({ key: "IM06", value: "瑕疵证明" });
        this.imageParams.imgBusiType = "discImage";
        this.imageParams.prodNo = "RI04";
        this.imageParams.billNo = billNo;
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
          post({ id: id }, "/ce/cpesrgst/discRgst/discRgstApply/func_queryPaperRgstById").then(res => {
            if (res) {
              let msg = res.data.retMsg;
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.addOrEditWin = true;
                this.$nextTick(() => {
                  this.addOrEditForm.id = id;
                  this.addOrEditForm.billType = res.data.retData.billType;
                  this.addOrEditForm.billNo = res.data.retData.billNo;
                  this.addOrEditForm.dueDt = this.$moment(res.data.retData.dueDt, "YYYYMMDD").format("YYYY-MM-DD");
                  this.addOrEditForm.billMoney = res.data.retData.billMoney;
                  this.addOrEditForm.acptName = res.data.retData.acptName;
                  this.addOrEditForm.acptAcctNo = res.data.retData.acptAcctNo;
                  this.addOrEditForm.acptBankNo = res.data.retData.acptBankNo;
                  this.addOrEditForm.acptBankName = res.data.retData.acptBankName;
                  this.addOrEditForm.drwrName = res.data.retData.drwrName;
                  this.addOrEditForm.drwrAcctNo = res.data.retData.drwrAcctNo;
                  this.addOrEditForm.drwrBankNo = res.data.retData.drwrBankNo;
                  this.addOrEditForm.drwrBankName = res.data.retData.drwrBankName;
                  this.addOrEditForm.pyeeName = res.data.retData.pyeeName;
                  this.addOrEditForm.pyeeAcctNo = res.data.retData.pyeeAcctNo;
                  this.addOrEditForm.pyeeBankNo = res.data.retData.pyeeBankNo;
                  this.addOrEditForm.pyeeBankName = res.data.retData.pyeeBankName;
                  this.addOrEditForm.rgstDt = this.$moment(res.data.retData.rgstDt, "YYYYMMDD").format("YYYY-MM-DD");
                  this.addOrEditForm.discInterestRate = accMul(res.data.retData.discInterestRate, 100);
                  this.addOrEditForm.transFromName = res.data.retData.transFromName;
                  this.addOrEditForm.transFromAcctNo = res.data.retData.transFromAcctNo;
                  this.addOrEditForm.transFromBankNo = res.data.retData.transFromBankNo;
                  this.addOrEditForm.transFromSocCode = res.data.retData.transFromSocCode;
                  this.addOrEditForm.transFromIndustry = res.data.retData.transFromIndustry;
                  this.addOrEditForm.transFromCorpScale = res.data.retData.transFromCorpScale;
                  this.addOrEditForm.isTransFromArc = res.data.retData.isTransFromArc;
                  this.addOrEditForm.transFromArea = res.data.retData.transFromArea;
                  this.addOrEditForm.isTransFromGrn = res.data.retData.isTransFromGrn;
                  this.addOrEditForm.transToBankNo = res.data.retData.transToBankNo;
                  this.addOrEditForm.transToBankName = res.data.retData.transToBankName;
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
            let url = this.addOrEditType === "add" ? "/ce/cpesrgst/discRgst/discRgstApply/func_addDiscRgstInfo" : "/ce/cpesrgst/discRgst/discRgstApply/func_updateAcptPaperRgst";
            this.addOrEditForm.rgstDt = this.$moment(this.addOrEditForm.rgstDt).format("YYYYMMDD");
            this.addOrEditForm.dueDt = this.$moment(this.addOrEditForm.dueDt).format("YYYYMMDD");
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
        let listIds = "";
        for (let i = 0, count = list.length; i < count; i++) {
          listIds += list[i].id;
          if (i < list.length - 1) {
            listIds += ",";
          }
        }
        post({ listIds: listIds }, "/ce/cpesrgst/discRgst/discRgstApply/func_deleteAcptPaperRgst").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.handleSearch();
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },

      //模板下载
      templateDownload() {
        let url = window.LOCAL_CONFIG.API_HOME + "/ce/cpesrgst/discRgst/discRgstApply/func_downloaddiscrgstmodel";
        let form = document.createElement("form");
        form.setAttribute("id", "formId");
        form.setAttribute("action", url);
        form.setAttribute("method", "post");
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
      },

      //批量导入
      batchImport() {
        this.importWin = true;
      },
      importWinClose() {
        this.importWin = false;
      },
      importSuccess() {
        this.importWin = false;
        this.$refs.datagrid.dataChange(1);
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
        let listIds = "";
        for (let i = 0, count = list.length; i < count; i++) {
          listIds += list[i].id;
          if (i < list.length - 1) {
            listIds += ",";
          }
        }
        post({ listIds: listIds }, "/ce/cpesrgst/discRgst/discRgstApply/func_submitRgstApply").then(res => {
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

      //批量修改
      batchEdit() {
        let list = this.$refs.datagrid.selects;
        if (list.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        let listIds = "";
        for (let i = 0, count = list.length; i < count; i++) {
          listIds += list[i].id;
          if (i < list.length - 1) {
            listIds += ",";
          }
        }
        this.batchEditForm.listIds = listIds;
        this.batchEditForm.drwrIndustry = list[0].transFromIndustry;
        this.batchEditForm.drwrCorpScale = list[0].transFromCorpScale;
        this.batchEditForm.drwrArea = list[0].transFromArea;
        this.batchEditForm.isDrwrGrn = list[0].isTransFromGrn;
        this.batchEditForm.isDrwrArc = list[0].isTransFromArc;
        this.batchEditWin = true;
      },
      batchEditWinSubmit() {
        this.$refs["batchEditForm"].validate(valid => {
          if (valid) {
            post(this.batchEditForm, "/ce/cpesrgst/discRgst/discRgstApply/func_batchUpdateDiscInfo").then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.batchEditWinClose();
                  this.handleSearch();
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
      batchEditWinClose() {
        this.batchEditWin = false;
        this.$refs.batchEditForm.resetFields();
        this.batchEditForm.listIds = "";
      },

      //票交所机构弹窗
      queryCpesBranchCode(type) {
        this.cpesBranchType = type;
        this.showCpesBranchWin = true;
      },
      showCpesBranchSubmit(info) {
        if (info === null) {
          this.$hMessage.info("请先选择记录！");
          return;
        }
        if (this.cpesBranchType === "acpt") {
          this.addOrEditForm.acptBankNo = info.transBrchBankNo;
          this.addOrEditForm.acptBankName = info.brchFullNameZh;
        } else if (this.cpesBranchType === "drwr") {
          this.addOrEditForm.drwrBankNo = info.transBrchBankNo;
          this.addOrEditForm.drwrBankName = info.brchFullNameZh;
        } else if (this.cpesBranchType === "pyee") {
          this.addOrEditForm.pyeeBankNo = info.transBrchBankNo;
          this.addOrEditForm.pyeeBankName = info.brchFullNameZh;
        } else if (this.cpesBranchType === "transFrom") {
          this.addOrEditForm.transFromBankNo = info.transBrchBankNo;
        } else if (this.cpesBranchType === "transTo") {
          this.addOrEditForm.transToBankNo = info.transBrchBankNo;
          this.addOrEditForm.transToBankName = info.brchFullNameZh;
        }
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
