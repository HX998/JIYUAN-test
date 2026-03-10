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
                <h-form-item prop="rgstDt" :label="$t('m.i.billInfo.payDt')">
                  <h-date-picker type="date" v-model="formItem.rgstDt" placeholder="" format="yyyy-MM-dd"
                                 :editable=false showFormat @on-change="handleRgstDtChange"></h-date-picker>
                </h-form-item>
                <h-form-item prop="rgstStatus" :label="$t('m.i.ce.rgstStatus')">
                  <h-select v-model="formItem.rgstStatus" placeholder="">
                    <h-option value="BTA01" key="BTA01">已录入</h-option>
                    <h-option value="BTA06" key="BTA06">登记复核已驳回</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item prop="acptBankName" :label="$t('m.i.billInfo.acptBankNo')" class="h-form-long-label">
                  <h-input v-model="formItem.acptBankName" placeholder="" readonly
                           icon="android-search" @on-click="queryCpesBranchCode('acpt')" clearable @on-clear="clearVal('acptBankNameClear')"></h-input>
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
                      url="/ce/cpesrgst/acptSettleRgst/acptSettleRgstApply/func_pagingQueryPaperRgst"
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
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <!-- 新增结清登记信息界面 -->
    <h-msg-box v-model="addOrEditWin" width="800" @on-close="addOrEditWinClose" class="h-form-search-layer"
               :maximize="true" :mask-closable="false">
      <p slot="header">
        <span v-if="addOrEditType==='add'">新增结清登记信息</span>
        <span v-if="addOrEditType==='modify'">修改结清登记信息</span>
      </p>
      <div>
        <h-form :model="addOrEditForm" :label-width="115" ref="addOrEditForm" cols="2" class="h-form-search">
          <h-form-item prop="billNo" :label="$t('m.i.billInfo.billNo')" required>
            <h-input v-model="addOrEditForm.billNo" placeholder="" readonly
                     :icon="addOrEditType==='modify'?'':'android-search'" @on-click="queryBillNo()"></h-input>
          </h-form-item>
          <h-form-item prop="billType" :label="$t('m.i.billInfo.billType')" required>
            <h-select v-model="addOrEditForm.billType" placeholder="" readonly>
              <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item prop="billMoney" :label="$t('m.i.billInfo.billMoney')" required>
            <h-typefield v-model="addOrEditForm.billMoney" :maxlength="20" placeholder="" readonly
                         bigTips></h-typefield>
          </h-form-item>
          <h-form-item prop="dueDt" :label="$t('m.i.billInfo.dueDt')" required>
            <h-date-picker v-model="addOrEditForm.dueDt" type="date" showFormat :editable=false format="yyyy-MM-dd"
                           disabled placeholder=""></h-date-picker>
          </h-form-item>
          <h-form-item prop="acptBankNo" :label="$t('m.i.billInfo.drweBankNo')" required class="h-form-long-label">
            <h-input v-model="addOrEditForm.acptBankNo" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item prop="paperRgstType" :label="$t('m.i.billInfo.settleType')" required>
            <h-select v-model="addOrEditForm.paperRgstType" placeholder="">
              <h-option value="1" key="1">未贴现票据托收结清</h-option>
              <h-option value="2" key="2">未贴现票据追索结清</h-option>
              <h-option value="3" key="3">其它</h-option>
            </h-select>
          </h-form-item>
          <h-form-item prop="rgstDt" :label="$t('m.i.billInfo.payDt')" required>
            <h-date-picker v-model="addOrEditForm.rgstDt" type="date" showFormat :editable=false format="yyyy-MM-dd"
                           placeholder=""></h-date-picker>
          </h-form-item>
          <h-form-item prop="transFromName" :label="$t('m.i.billInfo.hldrName')" required>
            <h-input v-model="addOrEditForm.transFromName" placeholder=""></h-input>
          </h-form-item>
          <h-form-item prop="transFromAcctNo" :label="$t('m.i.billInfo.hldrAcctNo')" required>
            <h-input v-model="addOrEditForm.transFromAcctNo" placeholder=""></h-input>
          </h-form-item>
          <h-form-item prop="transFromBankNo" :label="$t('m.i.billInfo.hldrBankNo')" required>
            <h-input v-model="addOrEditForm.transFromBankNo" placeholder="" readonly
                     icon="android-search" @on-click="queryCpesBranchCode('transFrom')"></h-input>
          </h-form-item>
          <h-form-item prop="transFromSocCode" :label="$t('m.i.ce.hldrSocCode')" :validRules="sosCodeRule"
                       class="h-form-long-label">
            <h-input v-model="addOrEditForm.transFromSocCode" placeholder="" :maxlength="18"></h-input>
          </h-form-item>
          <h-form-item prop="transToBankNo" :label="$t('m.i.billInfo.prsttnBankNo')" required>
            <h-input v-model="addOrEditForm.transToBankNo" placeholder="" readonly
                     icon="android-search" @on-click="queryCpesBranchCode('transTo')"></h-input>
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

    <h-msg-box v-model="searchBillInfoWin" width="1000" @on-close="searchBillInfoWinClose"
               class="h-form-table-layer" :maximize="true" :mask-closable="false">
      <p slot="header">
        <span>查询</span>
      </p>
      <!--查询表单-->
      <div>
        <h-form :model="searchBillFormItem" :label-width="100" ref="searchBillFormItem" cols="4" class="h-form-search" :class="{'h-form-overhd':!searchBillInfoWinIfShowMore}">
          <h-form-item :label="$t('m.i.billInfo.billNo')" prop="billNo">
            <h-input v-model="searchBillFormItem.billNo" placeholder=""></h-input>
          </h-form-item>
          <h-form-item prop="minDueDt" :label="$t('m.i.billInfo.dueDt')">
            <h-date-picker :value="searchBillDueDt" type="daterange" autoPlacement showFormat :editable=false
                           @on-change="handleSearchBillDueDtChange" placeholder=""></h-date-picker>
          </h-form-item>
          <h-form-item prop="acptBankName" :label="$t('m.i.billInfo.acptBankNo')" class="h-form-long-label">
            <h-input v-model="searchBillFormItem.acptBankName" placeholder="" readonly
                     icon="android-search" @on-click="queryCpesBranchCode('searchBillInfoWinAcpt')" clearable @on-clear="clearVal('searchBillFormItemAcptBankNameClear')"></h-input>
          </h-form-item>
          <h-form-item class="h-form-operate">
                  <!--<span class="h-more-input" @click="searchBillInfoWinIfShowMore=!searchBillInfoWinIfShowMore">{{$t("m.i.common.searchAdvanced")}}
                    <i class="icon iconfont"
                       :class="{'icon-arrow-down-screensv':!searchBillInfoWinIfShowMore,'icon-arrow-up-screen':searchBillInfoWinIfShowMore}"></i></span>-->
            <h-button type="primary" @click="searchBillFormItemSearch()">{{$t("m.i.common.search")}}</h-button>
            <h-button type="ghost" @click="searchBillFormItemReset()">{{$t("m.i.common.reset")}}</h-button>
          </h-form-item>
        </h-form>
      </div>
      <!--数据展示表格-->
      <h-row>
        <h-col span="24">
          <h-datagrid
            :columns="searchBillColumns"
            :auto-load="false"
            highlightRow
            url="/ce/cpesrgst/acptSettleRgst/acptSettleRgstApply/func_pagingQueryPaperRgst"
            :bindForm="searchBillFormItem"
            :on-current-change="searchBillHandleClick"
            :on-current-change-cancel="searchBillHandleClickCancel"
            ref="searchBillDatagrid">
          </h-datagrid>
        </h-col>
      </h-row>
      <!-- 弹出框模式底部按钮 -->
      <div slot="footer">
        <h-button type="ghost" @click="searchBillInfoWinClose">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" @click="searchBillInfoWinSubmit">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>

    <!--文件批量导入-->
    <common-file-upload :importWin="importWin" :fileParams="fileParams" @importWinClose="importWinClose"
                        @importSuccess="importSuccess"></common-file-upload>
    <!-- 查看票面 -->
    <rgst-bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"
                    :billNo="this.billNo"></rgst-bill-info-main>

    <!-- 票交所机构 -->
    <show-cpes-branch :showCpesBranch="showCpesBranchWin" @showCpesBranchClose="showCpesBranchClose" :memberId="queryMemberId"
                      @showCpesBranchSubmit="showCpesBranchSubmit"></show-cpes-branch>
  </div>
</template>

<script>
  import { post, on, off, getDictListByGroups, getDictValueFromMap, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "acptSettleRgstApply",
    components: {
      ShowCpesBranch: () => import(/* webpackChunkName: "shcpe/cpes/branch/showCpesBranch" */`@/views/bizViews/shcpe/cpes/branch/showCpesBranch`)
    },
    data() {
      return {
        //票号弹窗
        searchBillInfoWin: false,
        searchBillInfoWinIfShowMore: false,
        searchBillFormItem: {
          billNo: "",
          minDueDt: "",
          maxDueDt: "",
          rgstClass: "RI00",
          rgstStatusList: "BTA04,BTA11",
          drweBankNo: JSON.parse(window.sessionStorage.getItem("userInfo")).bankNo,
          extSelfDataNullFlag:"1",
          acptBankNo: "",
          acptBankName: ""
        },
        searchBillDueDt: [],
        searchBillCurrentRow: [],
        searchBillColumns: [
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
            title: this.$t("m.i.billInfo.acptName"),
            key: "acptName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.billInfo.acptBankNo"),
            key: "acptBankNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.acptBankName"),
            key: "acptBankName",
            hiddenCol: false,
            sortable: true
          }
        ],
        //票交机构
        showCpesBranchWin: false,
        cpesBranchType: "",
        //票面
        showBillInfoWin: false,
        billId: "",
        billNo: "",
        //字典值
        dictMap: new Map(),
        billTypeList: [],

        formItem: {
          rgstClass: "RI06",
          billNo: "",
          rgstDt: "",
          rgstStatus: "",
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
            title: this.$t("m.i.billInfo.paymentDt"),
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
            title: this.$t("m.i.billInfo.hldrName"),
            key: "transFromName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.billInfo.hldrAcctNo"),
            key: "transFromAcctNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.hldrBankNo"),
            key: "transFromBankNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.hldrSocCode"),
            key: "transFromSocCode",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.entrustBankNo"),
            key: "transToBankNo",
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
          paperRgstType: "",
          billType: "",
          billNo: "",
          billMoney: "",
          dueDt: "",
          acptBankNo: "",
          rgstDt: "",
          transFromName: "",
          transFromAcctNo: "",
          transFromBankNo: "",
          transFromSocCode: "",
          transToBankNo: ""
        },
        billNoRule: [{ test: this.validBillNo, trigger: "blur" }],
        sosCodeRule: [{ test: this.validSosCode, trigger: "blur" }],
        queryMemberId: "",
        //导入
        importWin: false,
        fileParams: {
          //导入excel数据解析接口
          loadExcelUrl: window.LOCAL_CONFIG.API_HOME + "/ce/cpesrgst/acptSettleRgst/acptSettleRgstApply/func_analysisExcelData",
          //excel数据导入接口
          fileUploadUrl: window.LOCAL_CONFIG.API_HOME + "/ce/cpesrgst/acptSettleRgst/acptSettleRgstApply/func_saveExcelData",
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
              title: this.$t("m.i.billInfo.settleType"),
              key: "paperRgstType",
              hiddenCol: false,
              render: (h, params) => {
                let list = "";
                if (params.row.paperRgstType === "1") {
                  list = "未贴现票据托收结清";
                } else if (params.row.paperRgstType === "2") {
                  list = "未贴现票据追索结清";
                } else if (params.row.paperRgstType === "3") {
                  list = "其它";
                }
                return h("span",
                  {
                    domProps: {
                      title: list
                    }
                  }, list);
              }
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
              sortable: true,
              /*render: (h, params) => {
                return h("a", {
                  on: {
                    click: () => {
                      this.showBillInfo(params.row.billId, params.row.billNo);
                    }
                  }
                }, params.row.billNo);
              }*/
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
              title: this.$t("m.i.billInfo.paymentDt"),
              key: "rgstDt",
              hiddenCol: false,
              sortable: true,
              render: (h, params) => {
                let date = params.row.rgstDt == null ? "" : this.$moment(params.row.rgstDt, "YYYY-MM-DD").format("YYYY-MM-DD");
                return h("span", date);
              }
            },
            {
              title: this.$t("m.i.billInfo.hldrName"),
              key: "transFromName",
              sortable: true,
              hiddenCol: false
            },
            {
              title: this.$t("m.i.billInfo.hldrAcctNo"),
              key: "transFromAcctNo",
              hiddenCol: false
            },
            {
              title: this.$t("m.i.billInfo.hldrSocCode"),
              key: "transFromSocCode",
              hiddenCol: false
            },
            {
              title: this.$t("m.i.billInfo.hldrBankNo"),
              key: "transFromBankNo",
              hiddenCol: false
            },
            {
              title: this.$t("m.i.ce.entrustBankNo"),
              key: "transToBankNo",
              hiddenCol: false
            },
            {
              title: this.$t("m.i.ce.acptSettleRgstRemark"),
              key: "rgstRemark",
              hiddenCol: false
            },
            {
              title: this.$t("m.i.ce.entrustBankName"),
              key: "transToBankName",
              sortable: true,
              hiddenCol: false
            }
          ],
          paramKey: "list"         //后台接收对应key
        }

      };
    },
    mounted() {
      getDictListByGroups("Yon,DraftTypeCode,AcptRgstStatus").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      clearVal(optType) {
        if (optType === "acptBankNameClear") {
          this.formItem.acptBankNo = "";
          this.formItem.acptBankName = "";
        } else if (optType === "searchBillFormItemAcptBankNameClear") {
          this.searchBillFormItem.acptBankNo = "";
          this.searchBillFormItem.acptBankName = "";
        }
      },
      //查询票号弹窗方法
      queryBillNo() {
        this.searchBillInfoWin = true;
        this.$nextTick(() => {
          this.searchBillFormItemSearch();
        });
      },
      handleSearchBillDueDtChange(arr) {
        if (arr && arr.length == 2) {
          this.searchBillFormItem.minDueDt = arr[0].replace(/-/g, "");
          this.searchBillFormItem.maxDueDt = arr[1].replace(/-/g, "");
          this.searchBillDueDt = [arr[0], arr[1]];
        } else {
          this.searchBillFormItem.minDueDt = "";
          this.searchBillFormItem.maxDueDt = "";
          this.searchBillDueDt = [];
        }
      },
      searchBillFormItemSearch() {
        this.searchBillCurrentRow = [];
        this.$refs.searchBillDatagrid.dataChange(1);
      },
      searchBillFormItemReset() {
        this.searchBillFormItem.billNo = "";
        this.searchBillFormItem.minDueDt = "";
        this.searchBillFormItem.maxDueDt = "";
        this.searchBillDueDt = [];
        this.searchBillFormItem.acptBankNo = "";
        this.searchBillFormItem.acptBankName = "";
      },
      searchBillHandleClick(arr) {
        this.searchBillCurrentRow = arr;
      },
      searchBillHandleClickCancel() {
        this.searchBillCurrentRow = [];
      },
      searchBillInfoWinSubmit() {
        this.addOrEditForm.billNo = this.searchBillCurrentRow.billNo;
        this.addOrEditForm.billType = this.searchBillCurrentRow.billType;
        this.addOrEditForm.billMoney = this.searchBillCurrentRow.billMoney;
        this.addOrEditForm.dueDt = this.searchBillCurrentRow.dueDt + "";
        this.addOrEditForm.acptBankNo = this.searchBillCurrentRow.acptBankNo;
        this.searchBillInfoWinClose();
      },
      searchBillInfoWinClose() {
        this.searchBillFormItemReset();
        this.searchBillInfoWin = false;
      },
      validSosCode(rule, val, callback) {
        if (val == null || val === "") {
          callback();
        } else {
          let re = /([a-zA-Z0-9]{2})([0-9]{6})([a-zA-Z0-9]{10})/;
          if (re.test(val)) {
            callback();
          } else {
            callback(new Error("非法输入，社会信用代码由两位数字或字母，加六位数字，加十位数字或字母组成，且为18位"));
          }
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
        this.formItem.acptBankNo = "";
        this.formItem.acptBankName = "";
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
          post({ id: id }, "/ce/cpesrgst/acptSettleRgst/acptSettleRgstApply/func_queryPaperRgstById").then(res => {
            if (res) {
              let msg = res.data.retMsg;
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.addOrEditWin = true;
                this.$nextTick(() => {
                  this.addOrEditForm.id = id;
                  this.addOrEditForm.billType = res.data.retData.billType;
                  this.addOrEditForm.billNo = res.data.retData.billNo;
                  this.addOrEditForm.dueDt = res.data.retData.dueDt + "";
                  this.addOrEditForm.billMoney = res.data.retData.billMoney;
                  this.addOrEditForm.acptBankNo = res.data.retData.acptBankNo;
                  this.addOrEditForm.paperRgstType = res.data.retData.paperRgstType;
                  this.addOrEditForm.rgstDt = res.data.retData.rgstDt + "";
                  this.addOrEditForm.transFromName = res.data.retData.transFromName;
                  this.addOrEditForm.transFromAcctNo = res.data.retData.transFromAcctNo;
                  this.addOrEditForm.transFromBankNo = res.data.retData.transFromBankNo;
                  this.addOrEditForm.transFromSocCode = res.data.retData.transFromSocCode;
                  this.addOrEditForm.transToBankNo = res.data.retData.transToBankNo;
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
              "/ce/cpesrgst/acptSettleRgst/acptSettleRgstApply/func_addAcptSettlePaperRgst" :
              "/ce/cpesrgst/acptSettleRgst/acptSettleRgstApply/func_updateAcptPaperRgst";
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
        post({ listIds: ids }, "/ce/cpesrgst/acptSettleRgst/acptSettleRgstApply/func_deleteAcptPaperRgst").then(res => {
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

      //模板下载
      templateDownload() {
        let url = window.LOCAL_CONFIG.API_HOME + "/ce/cpesrgst/acptSettleRgst/acptSettleRgstApply/func_downloadacptrgstmodel";
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

      //结清
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
        post({ listIds: ids }, "/ce/cpesrgst/acptSettleRgst/acptSettleRgstApply/func_submitRgstApply").then(res => {
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
      queryCpesBranchCode(type) {
        this.cpesBranchType = type;
        if (type === "acpt") {
          this.queryMemberId = JSON.parse(window.sessionStorage.getItem('userInfo')).memberId;
        } else if (type === "searchBillInfoWinAcpt") {
          this.queryMemberId = JSON.parse(window.sessionStorage.getItem('userInfo')).memberId;
        } else {
          this.queryMemberId = "";
        }
        this.showCpesBranchWin = true;
      },
      showCpesBranchSubmit(info) {
        if (info === null) {
          this.$hMessage.info("请先选择记录！");
          return;
        }
        if (this.cpesBranchType === "transFrom") {
          this.addOrEditForm.transFromBankNo = info.transBrchBankNo;
        } else if (this.cpesBranchType === "transTo") {
          this.addOrEditForm.transToBankNo = info.transBrchBankNo;
        }
        if (this.cpesBranchType === "acpt") {
          this.formItem.acptBankNo = info.transBrchBankNo;
          this.formItem.acptBankName = info.brchFullNameZh;
        }
        if (this.cpesBranchType === "searchBillInfoWinAcpt") {
          this.searchBillFormItem.acptBankNo = info.transBrchBankNo;
          this.searchBillFormItem.acptBankName = info.brchFullNameZh;
        }
        this.showCpesBranchClose();
      },
      showCpesBranchClose() {
        this.showCpesBranchWin = false;
        this.queryMemberId = "";
      }
    }
  };
</script>

<style scoped>

</style>
