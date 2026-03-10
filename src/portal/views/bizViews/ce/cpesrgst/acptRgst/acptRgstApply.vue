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
                <h-form-item prop="rgstStatus" :label="$t('m.i.ce.rgstStatus')">
                  <h-select v-model="formItem.rgstStatus" placeholder="">
                    <h-option value="BTA01" key="BTA01">已录入</h-option>
                    <h-option value="BTA06" key="BTA06">登记复核已驳回</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item prop="acptDt" :label="$t('m.i.billInfo.acptDt')">
                  <h-date-picker type="date" v-model="formItem.acptDt" placeholder="" format="yyyy-MM-dd"
                                 :editable=false showFormat @on-change="handleAcptDtChange"></h-date-picker>
                </h-form-item>
                <h-form-item prop="imgStatus" :label="$t('m.i.common.imgStatus')">
                  <h-select v-model="formItem.imgStatus" placeholder="">
                    <h-option value="BTL00" key="BTL00">未上传</h-option>
                    <h-option value="BTL13" key="BTL13">影像待上传</h-option>
                    <h-option value="BTL03" key="BTL03">影像上传中</h-option>
                    <h-option value="BTL04" key="BTL04">影像上传成功</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item prop="drwrName" :label="$t('m.i.billInfo.drwrName')">
                  <h-input v-model="formItem.drwrName" placeholder=""></h-input>
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
                      url="/ce/cpesrgst/acptRgst/acptRgstApply/func_pagingQueryPaperRgst"
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

    <!-- 新增承兑登记信息界面 -->
    <h-msg-box v-model="addOrEditWin" width="800" @on-close="addOrEditWinClose" class="h-form-search-layer"
               :maximize="true" :mask-closable="false">
      <p slot="header">
        <span v-if="addOrEditType==='add'">新增承兑登记信息</span>
        <span v-if="addOrEditType==='modify'">修改承兑登记信息</span>
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
          <h-form-item prop="remitDt" :label="$t('m.i.billInfo.remitDt')" required>
            <h-date-picker v-model="addOrEditForm.remitDt" type="date" showFormat :editable=false format="yyyy-MM-dd"
                           placeholder="" @on-change="handleRemitDtChange"></h-date-picker>
          </h-form-item>
          <h-form-item prop="dueDt" :label="$t('m.i.billInfo.dueDt')" required>
            <h-date-picker v-model="addOrEditForm.dueDt" type="date" showFormat :editable=false format="yyyy-MM-dd"
                           placeholder="" @on-change="handleDueDtChange"></h-date-picker>
          </h-form-item>
          <h-form-item prop="billMoney" :label="$t('m.i.billInfo.billMoney')" required :validRules="billMoneyRule">
            <h-typefield v-model="addOrEditForm.billMoney" :maxlength="20" placeholder="" bigTips></h-typefield>
          </h-form-item>
          <h-form-item prop="acptDt" :label="$t('m.i.billInfo.acptDt')" required>
            <h-date-picker v-model="addOrEditForm.acptDt" type="date" showFormat :editable=false format="yyyy-MM-dd"
                           placeholder="" @on-change="handleEditFromAcptDtChange"></h-date-picker>
          </h-form-item>
          <h-form-item prop="acptName" :label="$t('m.i.billInfo.acptName')" required>
            <h-input v-model="addOrEditForm.acptName" placeholder="" :maxlength="60"></h-input>
          </h-form-item>
          <h-form-item prop="acptAcctNo" :label="$t('m.i.billInfo.acptAcctNo')" required>
            <h-input v-model="addOrEditForm.acptAcctNo" placeholder="" :maxlength="32"></h-input>
          </h-form-item>
          <h-form-item prop="acptBankNo" :label="$t('m.i.billInfo.acptBankNo')" required>
            <h-input v-model="addOrEditForm.acptBankNo" placeholder="" :maxlength="12" readonly
                     icon="android-search" @on-click="queryCpesBranchCode('acpt')"></h-input>
          </h-form-item>
          <h-form-item prop="acptBankName" :label="$t('m.i.billInfo.acptBankName')">
            <h-input v-model="addOrEditForm.acptBankName" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item prop="acptSocCode" :label="$t('m.i.billInfo.acptSocCode')" required :validRules="sosCodeRule"
                       class="h-form-long-label">
            <h-input v-model="addOrEditForm.acptSocCode" placeholder="" :maxlength="18"></h-input>
          </h-form-item>
          <h-form-item prop="drwrName" :label="$t('m.i.billInfo.drwrName')" required>
            <h-input v-model="addOrEditForm.drwrName" placeholder="" :maxlength="60"></h-input>
          </h-form-item>
          <h-form-item prop="drwrAcctNo" :label="$t('m.i.billInfo.drwrAcctNo')" required>
            <h-input v-model="addOrEditForm.drwrAcctNo" placeholder="" :maxlength="32"></h-input>
          </h-form-item>
          <h-form-item prop="drwrBankNo" :label="$t('m.i.billInfo.drwrBankNo')">
            <h-input v-model="addOrEditForm.drwrBankNo" placeholder="" readonly
                     icon="android-search" @on-click="queryCpesBranchCode('drwr')"></h-input>
          </h-form-item>
          <h-form-item prop="drwrBankName" :label="$t('m.i.billInfo.drwrBankName')">
            <h-input v-model="addOrEditForm.drwrBankName" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item prop="drwrSocCode" :label="$t('m.i.billInfo.drwrSocCode')" required :validRules="sosCodeRule"
                       class="h-form-long-label">
            <h-input v-model="addOrEditForm.drwrSocCode" placeholder="" :maxlength="18"></h-input>
          </h-form-item>
          <h-form-item prop="drwrIndustry" :label="$t('m.i.billInfo.drwrIndustry')" required>
            <h-select v-model="addOrEditForm.drwrIndustry" placeholder="">
              <h-option v-for="item in industryCategoryList" :value="item.key" :key="item.key">{{ item.value }}
              </h-option>
            </h-select>
          </h-form-item>
          <h-form-item prop="drwrCorpScale" :label="$t('m.i.billInfo.drwrCorpScale')" required>
            <h-select v-model="addOrEditForm.drwrCorpScale" placeholder="">
              <h-option v-for="item in corpScaleList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item prop="isDrwrArc" :label="$t('m.i.billInfo.isDrwrArc')" required class="h-form-long-label">
            <h-select v-model="addOrEditForm.isDrwrArc" placeholder="">
              <h-option v-for="item in isList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item prop="drwrArea" :label="$t('m.i.billInfo.drwrArea')" required>
            <h-select v-model="addOrEditForm.drwrArea" placeholder="">
              <h-option v-for="item in areaList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item prop="isDrwrGrn" :label="$t('m.i.billInfo.isDrwrGrn')" required class="h-form-long-label">
            <h-select v-model="addOrEditForm.isDrwrGrn" placeholder="">
              <h-option v-for="item in isList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item prop="pyeeName" :label="$t('m.i.billInfo.pyeeName')" required>
            <h-input v-model="addOrEditForm.pyeeName" placeholder="" :maxlength="60"></h-input>
          </h-form-item>
          <h-form-item prop="pyeeAcctNo" :label="$t('m.i.billInfo.pyeeAcctNo')" required>
            <h-input v-model="addOrEditForm.pyeeAcctNo" placeholder="" :maxlength="32"></h-input>
          </h-form-item>
          <h-form-item prop="pyeeBankNo" :label="$t('m.i.billInfo.pyeeBankNo')">
            <h-input v-model="addOrEditForm.pyeeBankNo" placeholder="" readonly
                     icon="android-search" @on-click="queryCpesBranchCode('pyee')"></h-input>
          </h-form-item>
          <h-form-item prop="pyeeBankName" :label="$t('m.i.billInfo.pyeeBankName')" required>
            <h-input v-model="addOrEditForm.pyeeBankName" placeholder="" :maxlength="80"></h-input>
          </h-form-item>
          <h-form-item prop="pyeeSocCode" :label="$t('m.i.billInfo.pyeeSocCode')" :validRules="sosCodeRule"
                       class="h-form-long-label">
            <h-input v-model="addOrEditForm.pyeeSocCode" placeholder="" :maxlength="18"></h-input>
          </h-form-item>
          <h-form-item prop="drweBankNo" :label="$t('m.i.billInfo.drweBankNo')" required>
            <h-input v-model="addOrEditForm.drweBankNo" placeholder="" readonly
                     icon="android-search" @on-click="queryCpesBranchCode('drwe')"></h-input>
          </h-form-item>
          <h-form-item prop="drweBankName" :label="$t('m.i.billInfo.drweBankName')">
            <h-input v-model="addOrEditForm.drweBankName" placeholder="" readonly></h-input>
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
        <span>批量修改出票人信息</span>
      </p>
      <div>
        <h-form :model="batchEditForm" :label-width="115" ref="batchEditForm" cols="1" class="h-form-search">
          <h-form-item prop="drwrIndustry" :label="$t('m.i.billInfo.drwrIndustry')" required>
            <h-select v-model="batchEditForm.drwrIndustry" placeholder="">
              <h-option v-for="item in industryCategoryList" :value="item.key" :key="item.key">{{item.value }}
              </h-option>
            </h-select>
          </h-form-item>
          <h-form-item prop="drwrCorpScale" :label="$t('m.i.billInfo.drwrCorpScale')" required>
            <h-select v-model="batchEditForm.drwrCorpScale" placeholder="">
              <h-option v-for="item in corpScaleList" :value="item.key" :key="item.key">{{item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item prop="drwrArea" :label="$t('m.i.billInfo.drwrArea')" required>
            <h-select v-model="batchEditForm.drwrArea" placeholder="">
              <h-option v-for="item in areaList" :value="item.key" :key="item.key">{{item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item prop="isDrwrGrn" :label="$t('m.i.billInfo.isDrwrGrn')" required class="h-form-long-label">
            <h-select v-model="batchEditForm.isDrwrGrn" placeholder="">
              <h-option v-for="item in isList" :value="item.key" :key="item.key">{{item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item prop="isDrwrArc" :label="$t('m.i.billInfo.isDrwrArc')" required class="h-form-long-label">
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
    <rgst-bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.id"
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
  import { post, on, off, getDictListByGroups, getDictValueFromMap, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "acptRgstApply",
    components: {
      ShowCpesBranch: () => import(/* webpackChunkName: "shcpe/cpes/branch/showCpesBranch" */`@/views/bizViews/shcpe/cpes/branch/showCpesBranch`)
    },
    data() {
      return {
        maxPaperBillMoney : 1000000,
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
        isList: [],
        areaList: [],
        industryCategoryList: [],
        corpScaleList: [],
        billTypeList: [],
        //影像上传
        showUploadImageWin: false,
        propsVue: "acptRgstApply",
        imageParams: {
          listId: "",
          imgBusiType: "acptImage",
          prodNo: "RI00",
          imgTypeList: [],
          imgType: "IM01",
          imageUrl: "/ce/cpesrgst/acptRgst/acptRgstApply/func_pagingQueryPaperRgstImg", //查询可查看影像url
          imageUploadUrl: "/ce/cpesrgst/acptRgst/acptRgstApply/func_saveImg", //影像上传url
          imageRegisterUrl: "/ce/cpesrgst/acptRgst/acptRgstApply/func_sendImgRgstMsg", //影像登记url
          imageDeleteUrl: "/ce/cpesrgst/acptRgst/acptRgstApply/func_deleteImg", //影像删除url
          imgShowUrl: "/ce/cpesrgst/acptRgst/acptRgstApply/func_showImg?id=", //查看影像url
          busiType: "RI07",
          billNo: ""
        },
        billId: "",
        id: "",
        billNo: "",
        showBillInfoWin: false,
        dictMap: new Map(),
        ifShowMore: false,
        formItem: {
          rgstClass: "RI00",
          billNo: "",
          rgstStatus: "",
          acptDt: "",
          imgStatus: "",
          drwrName: ""
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
            title: this.$t("m.i.common.imgStatus"),
            key: "imgStatus",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "ImgStatus", params.row.imgStatus);
              return h("span", { domProps: { title: dictValue } }, dictValue);
            }
          },
          {
            title: this.$t("m.i.common.acptImg"),
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
                      this.openImgWin(params.row.id, params.row.billNo);
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
            title: this.$t("m.i.ce.registerStatus"),
            key: "rgstStatus",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "AcptRgstStatus", params.row.rgstStatus);
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
            title: this.$t("m.i.billInfo.drwrSocCode"),
            key: "drwrSocCode",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.drwrIndustry"),
            key: "drwrIndustry",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "Industry", params.row.drwrIndustry);
              return h("span", { domProps: { title: dictValue } }, dictValue);
            }
          },
          {
            title: this.$t("m.i.common.corpScale"),
            key: "drwrCorpScale",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "CorpScale", params.row.drwrCorpScale);
              return h("span", { domProps: { title: dictValue } }, dictValue);
            }
          },
          {
            title: this.$t("m.i.billInfo.isDrwrArc"),
            key: "isDrwrArc",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "Yon", params.row.isDrwrArc);
              return h("span", { domProps: { title: dictValue } }, dictValue);
            }
          },
          {
            title: this.$t("m.i.billInfo.drwrArea"),
            key: "drwrArea",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "Province", params.row.drwrArea);
              return h("span", { domProps: { title: dictValue } }, dictValue);
            }
          },
          {
            title: this.$t("m.i.common.isGreenCorp"),
            key: "isDrwrGrn",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "Yon", params.row.isDrwrGrn);
              return h("span", { domProps: { title: dictValue } }, dictValue);
            }
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
            title: this.$t("m.i.billInfo.pyeeBankName"),
            key: "pyeeBankName",
            sortable: true,
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
        ],
        addOrEditType: "",
        addOrEditWin: false,
        addOrEditForm: {
          id: "",
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
        billNoRule: [{ test: this.validBillNo, trigger: "blur" }],
        sosCodeRule: [{ test: this.validSosCode, trigger: "blur" }],
        billMoneyRule:[{ test: this.validBillMoney, trigger: "blur" }],

        //导入
        importWin: false,
        fileParams: {
          //导入excel数据解析接口
          loadExcelUrl: window.LOCAL_CONFIG.API_HOME + "/ce/cpesrgst/acptRgst/acptRgstApply/func_analysisExcelData",
          //excel数据导入接口
          fileUploadUrl: window.LOCAL_CONFIG.API_HOME + "/ce/cpesrgst/acptRgst/acptRgstApply/func_saveExcelData",
          formItem: {},           //请求表格数据时附带参数
          uploadParams: {},       //调用excel数据解析接口时附带的额外参数
          extraGridDatas: {},     //需在反显数据中额外添加的字段
          columns: [
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
              title: this.$t("m.i.billInfo.remitDt"),
              key: "remitDt",
              hiddenCol: false,
              sortable: true,
              render: (h, params) => {
                let date = params.row.remitDt == null ? "" : this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD");
                return h("span", date);
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
              title: this.$t("m.i.billInfo.drwrSocCode"),
              key: "drwrSocCode",
              hiddenCol: false
            },
            {
              title: this.$t("m.i.billInfo.drwrIndustry"),
              key: "drwrIndustry",
              hiddenCol: false,
              render: (h, params) => {
                let list = getDictValueFromMap(this.dictMap, "Industry", params.row.drwrIndustry);
                return h("span",
                  {
                    domProps: {
                      title: list
                    }
                  }, list);
              }
            },
            {
              title: this.$t("m.i.billInfo.drwrCorpScale"),
              key: "drwrCorpScale",
              hiddenCol: false,
              render: (h, params) => {
                let list = getDictValueFromMap(this.dictMap, "CorpScale", params.row.drwrCorpScale);
                return h("span",
                  {
                    domProps: {
                      title: list
                    }
                  }, list);
              }
            },
            {
              title: this.$t("m.i.billInfo.isDrwrArc"),
              key: "isDrwrArc",
              hiddenCol: false,
              render: (h, params) => {
                let list = getDictValueFromMap(this.dictMap, "Yon", params.row.isDrwrArc);
                return h("span",
                  {
                    domProps: {
                      title: list
                    }
                  }, list);
              }
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
              title: this.$t("m.i.billInfo.drwrArea"),
              key: "drwrArea",
              hiddenCol: false,
              render: (h, params) => {
                let list = getDictValueFromMap(this.dictMap, "Province", params.row.drwrArea);
                return h("span",
                  {
                    domProps: {
                      title: list
                    }
                  }, list);
              }
            },
            {
              title: this.$t("m.i.billInfo.isDrwrGrn"),
              key: "isDrwrGrn",
              hiddenCol: false,
              render: (h, params) => {
                let list = getDictValueFromMap(this.dictMap, "Yon", params.row.isDrwrGrn);
                return h("span",
                  {
                    domProps: {
                      title: list
                    }
                  }, list);
              }
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
              title: this.$t("m.i.billInfo.pyeeBankName"),
              key: "pyeeBankName",
              sortable: true,
              hiddenCol: false
            },
            {
              title: this.$t("m.i.billInfo.pyeeSocCode"),
              key: "pyeeSocCode",
              hiddenCol: false
            },
            {
              title: this.$t("m.i.billInfo.acptName"),
              key: "acptName",
              hiddenCol: false
            },
            {
              title: this.$t("m.i.billInfo.acptAcctNo"),
              key: "acptAcctNo",
              hiddenCol: false
            },
            {
              title: this.$t("m.i.billInfo.acptSocCode"),
              key: "acptSocCode",
              hiddenCol: false
            },
            {
              title: this.$t("m.i.billInfo.acptDt"),
              key: "acptDt",
              hiddenCol: false,
              sortable: true,
              render: (h, params) => {
                let date = params.row.acptDt == null ? "" : this.$moment(params.row.acptDt, "YYYY-MM-DD").format("YYYY-MM-DD");
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
              title: this.$t("m.i.common.remark"),
              key: "rgstRemark",
              hiddenCol: false
            },
            {
              title: this.$t("m.i.billInfo.acptBankName"),
              key: "acptBankName",
              sortable: true,
              hiddenCol: false
            },
            {
              title: this.$t("m.i.billInfo.drweBankName"),
              key: "drweBankName",
              sortable: true,
              hiddenCol: false
            }
          ],
          paramKey: "list"         //后台接收对应key
        }

      };
    },
    watch: {
      "addOrEditForm.billType": function (val) {
        if (this.addOrEditForm.billNo) {
          this.$refs.addOrEditForm.validateField("billNo");
        }
      },
    },
    mounted() {
      getDictListByGroups("CorpScale,Yon,Province,Industry,ImgStatus,DraftTypeCode,AcptRgstStatus").then(res => {
        this.corpScaleList = res.get("CorpScale");
        this.isList = res.get("Yon");
        this.areaList = res.get("Province");
        this.industryCategoryList = res.get("Industry");
        this.billTypeList = res.get("DraftTypeCode");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      handleRemitDtChange(value){
        this.addOrEditForm.remitDt = value.replace(/-/g, "");
      },
      handleDueDtChange(value){
        this.addOrEditForm.dueDt = value.replace(/-/g, "");
      },
      handleEditFromAcptDtChange(value){
        this.addOrEditForm.acptDt = value.replace(/-/g, "");
      },
      validSosCode(rule, val, callback) {
        let re = /([a-zA-Z0-9]{2})([0-9]{6})([a-zA-Z0-9]{10})/;
        if (val === "" || val === null || val === undefined) {
          callback();
        }
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
          if(value> 0 && value<=Number(this.maxPaperBillMoney)){
            callback();
          }else{
            callback(new Error("票面金额应小于等于"+ formatNumber(this.maxPaperBillMoney, 2, ",") +"、大于0.00"));
          }
        } else {
          callback(new Error("票面金额应小于等于"+ formatNumber(this.maxPaperBillMoney, 2, ",") +"、大于0.00的数字，且小数位不超过两位"));
        }
      },
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
      openImgWin(str, billNo) {
        this.imageParams.imgTypeList.push({ key: "IM01", value: "承兑正面" });
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
          post({ id: id }, "/ce/cpesrgst/acptRgst/acptRgstApply/func_queryPaperRgstById").then(res => {
            if (res) {
              let msg = res.data.retMsg;
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.addOrEditWin = true;
                this.$nextTick(() => {
                  this.addOrEditForm.id = id;
                  this.addOrEditForm.billType = res.data.retData.billType;
                  this.addOrEditForm.billNo = res.data.retData.billNo;
                  this.addOrEditForm.remitDt = res.data.retData.remitDt + "";
                  this.addOrEditForm.dueDt = res.data.retData.dueDt + "";
                  this.addOrEditForm.billMoney = res.data.retData.billMoney;
                  this.addOrEditForm.acptDt = res.data.retData.acptDt + "";
                  this.addOrEditForm.acptName = res.data.retData.acptName;
                  this.addOrEditForm.acptAcctNo = res.data.retData.acptAcctNo;
                  this.addOrEditForm.acptBankNo = res.data.retData.acptBankNo;
                  this.addOrEditForm.acptBankName = res.data.retData.acptBankName;
                  this.addOrEditForm.acptSocCode = res.data.retData.acptSocCode;
                  this.addOrEditForm.drwrName = res.data.retData.drwrName;
                  this.addOrEditForm.drwrAcctNo = res.data.retData.drwrAcctNo;
                  this.addOrEditForm.drwrBankNo = res.data.retData.drwrBankNo;
                  this.addOrEditForm.drwrBankName = res.data.retData.drwrBankName;
                  this.addOrEditForm.drwrSocCode = res.data.retData.drwrSocCode;
                  this.addOrEditForm.drwrIndustry = res.data.retData.drwrIndustry;
                  this.addOrEditForm.drwrCorpScale = res.data.retData.drwrCorpScale;
                  this.addOrEditForm.isDrwrArc = res.data.retData.isDrwrArc;
                  this.addOrEditForm.drwrArea = res.data.retData.drwrArea;
                  this.addOrEditForm.isDrwrGrn = res.data.retData.isDrwrGrn;
                  this.addOrEditForm.pyeeName = res.data.retData.pyeeName;
                  this.addOrEditForm.pyeeAcctNo = res.data.retData.pyeeAcctNo;
                  this.addOrEditForm.pyeeBankNo = res.data.retData.pyeeBankNo;
                  this.addOrEditForm.pyeeBankName = res.data.retData.pyeeBankName;
                  this.addOrEditForm.pyeeSocCode = res.data.retData.pyeeSocCode;
                  this.addOrEditForm.drweBankNo = res.data.retData.drweBankNo;
                  this.addOrEditForm.drweBankName = res.data.retData.drweBankName;
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
            let url = this.addOrEditType === "add" ?
              "/ce/cpesrgst/acptRgst/acptRgstApply/func_addAcptRgstInfo" :
              "/ce/cpesrgst/acptRgst/acptRgstApply/func_updateAcptPaperRgst";
            if (this.addOrEditForm.remitDt >= this.addOrEditForm.dueDt) {
              this.$msgTip.info(this, { info: "出票日期必须小于汇票到期日" });
              return;
            }
            // this.addOrEditForm.acptDt = this.$moment(this.addOrEditForm.acptDt).format("YYYYMMDD");
            // this.addOrEditForm.dueDt = this.$moment(this.addOrEditForm.dueDt).format("YYYYMMDD");
            // this.addOrEditForm.remitDt = this.$moment(this.addOrEditForm.remitDt).format("YYYYMMDD");
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
      //票面
      showBillInfo(id, billNo) {
        this.id = id;
        this.billNo = billNo;
        this.showBillInfoWin = true;
      },
      billInfoWinClose() {
        this.showBillInfoWin = false;
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
        post({ listIds: ids }, "/ce/cpesrgst/acptRgst/acptRgstApply/func_deleteAcptPaperRgst").then(res => {
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
        let url = window.LOCAL_CONFIG.API_HOME + "/ce/cpesrgst/acptRgst/acptRgstApply/func_downloadacptrgstmodel";
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
        let ids = "";
        for (let i = 0, count = list.length; i < count; i++) {
          ids += list[i].id;
          if (i < list.length - 1) {
            ids += ",";
          }
        }
        post({ listIds: ids }, "/ce/cpesrgst/acptRgst/acptRgstApply/func_submitRgstApply").then(res => {
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

      //批量修改
      batchEdit() {
        let list = this.$refs.datagrid.selects;
        if (list.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        let ids = "";
        for (let i = 0, count = list.length; i < count; i++) {
          ids += list[i].id;
          if (i < list.length - 1) {
            ids += ",";
          }
        }
        this.batchEditForm.listIds = ids;
        this.batchEditForm.drwrIndustry = list[0].drwrIndustry;
        this.batchEditForm.drwrCorpScale = list[0].drwrCorpScale;
        this.batchEditForm.drwrArea = list[0].drwrArea;
        this.batchEditForm.isDrwrGrn = list[0].isDrwrGrn;
        this.batchEditForm.isDrwrArc = list[0].isDrwrArc;
        this.batchEditWin = true;
      },
      batchEditWinSubmit() {
        this.$refs["batchEditForm"].validate(valid => {
          if (valid) {
            post(this.batchEditForm, "/ce/cpesrgst/acptRgst/acptRgstApply/func_batchUpdateDrwrInfo").then(res => {
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
        } else if (this.cpesBranchType === "drwe") {
          this.addOrEditForm.drweBankNo = info.transBrchBankNo;
          this.addOrEditForm.drweBankName = info.brchFullNameZh;
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
