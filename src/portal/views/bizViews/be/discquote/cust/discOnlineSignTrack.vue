<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">

                <show-branch v-model="formItem.discBrchNameList" label="贴现机构名称" prop="discBrchNameList"
                             :showCheckBox="true" :brchNo.sync="formItem.discBrchNoList"
                             :brchName.sync="formItem.discBrchNameList">
                </show-branch>

                <h-form-item prop="discApplicantName" label="贴现申请人名称" class="h-form-long-label">
                  <h-input v-model="formItem.discApplicantName" placeholder="" :maxlength="50"></h-input>
                </h-form-item>
                <h-form-item prop="discApplicantSocCode" :label="$t('m.i.common.socCode')" class="h-form-long-label">
                  <h-input v-model="formItem.discApplicantSocCode" :maxlength=18></h-input>
                </h-form-item>
                <h-form-item prop="signStatus" label="签约状态">
                  <h-select v-model="formItem.signStatus" placeholder="">
                    <h-option v-for="item in signStatusDictList" :value="item.key" :key="item.key">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <common-date-picker v-model="signApplyDateArray" label="签约申请日期" type="daterange"
                                    :autoPlacement="true"
                                    @on-change="handleSignApplyDatePickerChange"></common-date-picker>
                <common-date-picker v-model="signDueDateArray" label="签约有效期至" type="daterange"
                                    :autoPlacement="true"
                                    @on-change="handleSignDueDatePickerChange"></common-date-picker>


                <h-form-item class="h-form-operate">
                  <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid :columns="columns"
                      url="/be/discquote/onlineSign/func_pageOnlineSignTrack"
                      :bindForm="formItem"
                      :has-select="false"
                      :row-select="false"
                      :onSelectChange="handleSelectClick"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="exportExcel">清单导出</h-button>
              <h-button type="primary" @click="showSignHistory">查看操作历史</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <!--股东信息-->
    <h-msg-box maximize v-model="isShowShareholder" width="1000" @on-close="hideSignDetail" class="h-form-table-layer">
      <p slot="header">
        <span>股东信息</span>
      </p>

      <div class="h-form-search-box">
        <!-- 查询表单 -->
        <h-panel class="clearfix">
          <h-form :model="shareholderForm" :label-width="90" ref="shareholderForm" cols="4" class="h-form-search">
            <h-form-item prop="custName" label="股东名称">
              <h-input v-model="shareholderForm.custName" placeholder="" :maxlength="20"></h-input>
            </h-form-item>

            <h-form-item class="h-form-operate">
              <h-button type="primary" @click="handleSearchShareholder()">{{$t("m.i.common.search")}}</h-button>
              <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
            </h-form-item>
          </h-form>
        </h-panel>
      </div>

      <div>
        <!--        <h-table-min :columns="shareholderColumns" :data="shareholderDataList" notSetWidth></h-table-min>-->
        <h-datagrid :columns="shareholderColumns"
                    highlight-row
                    url="/be/discquote/onlineSign/func_pageDiscCustShareholderInfo"
                    :bindForm="shareholderForm"
                    ref="shareholderGrid">
        </h-datagrid>
      </div>
      <div slot="footer">
        <!--        <div slot="footer">-->
        <!--          <h-button type="primary" @click="hideSignDetail">确定</h-button>-->
        <!--        </div>-->
      </div>
    </h-msg-box>

    <!--受益所有人信息-->
    <h-msg-box maximize v-model="isShowBeneficiary" width="1000" @on-close="hideSignDetail" class="h-form-table-layer">
      <p slot="header">
        <span>受益所有人信息</span>
      </p>
      <div class="h-form-search-box">
        <!-- 查询表单 -->
        <h-panel class="clearfix">
          <h-form :model="beneficiaryForm" :label-width="90" ref="beneficiaryForm" cols="4" class="h-form-search">
            <h-form-item prop="custName" label="姓名">
              <h-input v-model="beneficiaryForm.custName" placeholder="" :maxlength="20"></h-input>
            </h-form-item>

            <h-form-item class="h-form-operate">
              <h-button type="primary" @click="handleSearchBeneficiary()">{{$t("m.i.common.search")}}</h-button>
              <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
            </h-form-item>
          </h-form>
        </h-panel>
      </div>
      <div>
        <h-datagrid :columns="beneficiaryColumns"
                    highlight-row
                    url="/be/discquote/onlineSign/func_pageDiscCustBeneficiaryInfo"
                    :bindForm="beneficiaryForm"
                    ref="beneficiaryGrid">
        </h-datagrid>
      </div>
      <div slot="footer">
        <!--        <div slot="footer">-->
        <!--          <h-button type="primary" @click="hideSignDetail">确定</h-button>-->
        <!--        </div>-->
      </div>
    </h-msg-box>

    <!-- 查看操作历史 -->
    <h-msg-box maximize v-model="isShowSignHistory" width="1000" @on-close="hideSignDetail">
      <p slot="header">
        <span>查看操作历史</span>
      </p>
      <div>
        <!-- 数据展示表格 -->
        <h-datagrid :columns="historyColumns"
                    highlight-row
                    url="/be/discquote/onlineSign/func_pageOnlineSignOperHistory"
                    :bindForm="historyForm"
                    ref="historyGrid">
        </h-datagrid>
      </div>
      <div slot="footer">
        <!--        <div slot="footer">-->
        <!--          <h-button type="primary" @click="hideSignDetail">确定</h-button>-->
        <!--        </div>-->
      </div>
    </h-msg-box>

    <!-- 机构名称选择弹窗框 -->
    <!-- <show-branch :showBranchWin="showBranchWin" title="查询机构树多选" @brchNoChange="brchNoChange" ifcheck="true"
                  :checkStrictly="true" @showBranchWinClose="showBranchWinClose"></show-branch>-->
    <!-- 附件查看 -->
    <show-file-win :showFileWin="showFileWin" :fileBatchParams="fileBatchParams"
                   :dictMap="dictMap" @showFileWinClose="showFileWinClose"
                   :filePathUrl="filePathUrl"></show-file-win>

    <!-- 明细导出 -->
    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param"
                           :rows="this.rows"></common-excel-download>
  </div>
</template>

<script>
  import {getDictListByGroups, getDictValueFromMap, post} from "@/api/bizApi/commonUtil";

  export default {
    name: "discOnlineSignTrack",
    components: {
      //ShowBranch: () => import(/* webpackChunkName: "sm/auth/branch/showBranch" */`@/views/bizViews/sm/auth/branch/showBranch`),
      showFileWin: () => import(/* webpackChunkName: "pc/img/showFileWin" */"@/views/bizViews/pc/img/showFileWin"),
    },
    data() {
      return {
        fileDetailStatusList: [],
        attTypeCodeList: [],
        fileBatchParams: {},

        // DsctSignStatus 贴现通签约状态
        signStatusDictList: [
          // {
          //   "id": 2022070601,
          //   "legalNo": "000000",
          //   "legalPersonName": null,
          //   "dictGroupCode": "DsctSignStatus",
          //   "key": "ST01",
          //   "likeKey": null,
          //   "value": "待审核",
          //   "description": "贴现通签约状态",
          //   "reserve1": null,
          //   "reserve2": null,
          //   "createTime": null,
          //   "updateTime": null
          // },
          // {
          //   "id": 2022070602,
          //   "legalNo": "000000",
          //   "legalPersonName": null,
          //   "dictGroupCode": "DsctSignStatus",
          //   "key": "ST02",
          //   "likeKey": null,
          //   "value": "已签约",
          //   "description": "贴现通签约状态",
          //   "reserve1": null,
          //   "reserve2": null,
          //   "createTime": null,
          //   "updateTime": null
          // },
        ],
        // signStatusDictListAll: [],

        signApplyDateArray: [],
        signDueDateArray: [],

        // 股东信息
        isShowShareholder: false,
        // 受益人信息
        isShowBeneficiary: false,
        isShowSignHistory: false,

        shareholderForm: {
          id: "",
        },
        beneficiaryForm: {
          id: "",
        },


        // 法人信息
        shareholderColumns: [
          {
            type: "index",
            width: 60,
            align: "center",
          },
          {
            title: "股东名称",
            key: "custName",
          },
          {
            title: "出资比例（%）",
            key: "assetsPercent",
          },
          {
            title: "证件类型",
            key: "certType",
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "CertType", params.row.certType);
              return h("span", {domProps: {title: dictValue}}, dictValue);
            }
          },
          {
            title: "证件号码",
            key: "certNo",
            //width: 180,
          },
          {
            title: "证件登记日",
            key: "certRegDate",
          },
          {
            title: "证件到期日",
            key: "certDueDate",
          },
          {
            title: "证件签发城市",
            key: "certRegCity",
          },
        ],
        shareholderDataList: [],

        // 受益人信息
        beneficiaryColumns: [
          {
            type: "index",
            width: 60,
            align: "center",
          },
          {
            title: "姓名",
            key: "custName",
          },
          {
            title: "证件类型",
            key: "certType",
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "CertType", params.row.certType);
              return h("span", {domProps: {title: dictValue}}, dictValue);
            }
          },
          {
            title: "证件号码",
            key: "certNo",
            //width: 160,
          },
          {
            title: "证件签发日",
            key: "certRegDate",
          },
          {
            title: "证件到期日",
            key: "certDueDate",
          },
          {
            title: "证件签发城市",
            key: "certRegCity",
          },
          {
            title: "联系电话",
            key: "phone",
            // width: 120,
          },
          {
            title: "邮箱",
            key: "email",
            // width: 150,
          },
        ],
        beneficiaryDataList: [],

        historyForm: {
          id: "",
        },
        historyColumns: [
          {
            type: "index",
            key: "numOrder",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: "操作类型",
            key: "operType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "OnlineSignOperType", params.row.operType);
              return h("span", {domProps: {title: dictValue}}, dictValue);
            }
          },
          {
            title: "操作柜员号",
            key: "operTellerNo",
            hiddenCol: false,
          },
          {
            title: "操作日期",
            key: "operDate",
            hiddenCol: false,
          },
          {
            title: "操作结果",
            key: "applyStatus",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "OnlineSignApplyType", params.row.applyStatus);
              return h("span", {domProps: {title: dictValue}}, dictValue);
            }
          },
          {
            title: "操作说明",
            key: "respRemark",
            hiddenCol: false,
          },

          {
            title: "贴现申请人名称",
            key: "discCustName",
            hiddenCol: false
          },

          {
            title: "统一社会信用代码",
            key: "discOutSocCode",
            hiddenCol: false,
          },
          {
            title: "签约状态",
            key: "signStatus",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "DsctSignStatus", params.row.signStatus);
              return h("span", {domProps: {title: dictValue}}, dictValue);
            }
          },
          {
            title: "贴现机构名称",
            key: "discBranchName",
            hiddenCol: false,
          },
          {
            title: "贴现机构代码",
            key: "discBranchCode",
            hiddenCol: false,
          },
          {
            title: "签约申请日期",
            key: "signApplyDate",
            hiddenCol: false,
          },
          {
            title: "签约有效期至",
            key: "signDueDate",
            hiddenCol: false,
          },
          {
            title: "授信额度（元）",
            key: "creditAmt",
            hiddenCol: false,
          },
          {
            title: "地区",
            key: "area",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "Province", params.row.area);
              return h("span", {domProps: {title: dictValue}}, dictValue);
            }
          },

          {
            title: "企业规模",
            key: "discCorpScale",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "CorpScale", params.row.discCorpScale);
              return h("span", {domProps: {title: dictValue}}, dictValue);
            }
          },
          {
            title: "行业分类",
            key: "discIndustry",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "Industry", params.row.discIndustry);
              return h("span", {domProps: {title: dictValue}}, dictValue);
            }
          },
          {
            title: "是否涉农企业",
            key: "isDiscArc",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "Yon", params.row.isDiscArc);
              return h("span", {domProps: {title: dictValue}}, dictValue);
            }
          },
          {
            title: "是否绿色企业",
            key: "isDiscGreenCorp",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "Yon", params.row.isDiscGreenCorp);
              return h("span", {domProps: {title: dictValue}}, dictValue);
            }
          },
          {
            title: "是否科技企业",
            key: "isDiscTechnologyCorp",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "Yon", params.row.isDiscTechnologyCorp);
              return h("span", {domProps: {title: dictValue}}, dictValue);
            }
          },
          {
            title: "是否民营企业",
            key: "isDiscPrivateCorp",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "Yon", params.row.isDiscPrivateCorp);
              return h("span", {domProps: {title: dictValue}}, dictValue);
            }
          },

          {
            title: "备注",
            key: "applRemark",
            hiddenCol: false,
            width: 100,
          },
          {
            title: "法人姓名",
            key: "corpLegalName",
            hiddenCol: false,
          },

          {
            title: "法人证件类型",
            key: "corpLegalCertifyType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "CertType", params.row.corpLegalCertifyType);
              return h("span", {domProps: {title: dictValue}}, dictValue);
            }
          },
          {
            title: "法人证件号码",
            key: "corpLegalCertifyNo",
            hiddenCol: false
          },
          {
            title: "是否需要开票",
            key: "needInv",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "Yon", params.row.needInv);
              return h("span", {domProps: {title: dictValue}}, dictValue);
            }
          }
        ],

        currentSelectList: [],

        //导出
        tempShowExcelTemplateWin: false,
        param: null,
        rows: null,
        //字典值
        dictMap: new Map(),
        applStatusList: [],
        //机构树多选
        // showBranchWin: false,
        //影像上传
        showFileWin: false,
        propsVue: "indexDiscCustInfoTransMonitor",
        formItem: {
          discBrchNameList: JSON.parse(window.sessionStorage.getItem("userInfo")).brchName,
          discBrchNoList: JSON.parse(window.sessionStorage.getItem("userInfo")).brchNo,

          discApplicantName: "",
          discApplicantSocCode: "",
          signStatus: "",
          signApplyDateStart: "",
          signApplyDateEnd: "",
          signDueDateStart: "",
          signDueDateEnd: "",

          // applStatus: "",
          // discCustName: "",
          // discSocCode: ""
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
            title: "贴现申请人名称",
            key: "discCustName",
            hiddenCol: false,
          },

          {
            title: "统一社会信用代码",
            key: "discOutSocCode",
            hiddenCol: false,
          },
          {
            title: "签约状态",
            key: "signStatus",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "DsctSignStatus", params.row.signStatus);
              return h("span", {domProps: {title: dictValue}}, dictValue);
            }
          },
          {
            title: "贴现机构名称",
            key: "discBranchName",
            hiddenCol: false,
          },
          {
            title: "贴现机构代码",
            key: "discBranchCode",
            hiddenCol: false,
          },
          {
            title: "签约申请日期",
            key: "signApplyDate",
            hiddenCol: false,
          },
          {
            title: "签约有效期至",
            key: "signDueDate",
            hiddenCol: false,
          },
          {
            title: "授信额度（元）",
            key: "creditAmt",
            hiddenCol: false,
          },
          {
            title: "剩余额度（元）",
            key: "creditBalance",
            hiddenCol: false,
          },
          {
            title: "已用额度（元）",
            key: "usedCreditAmt",
            hiddenCol: false,
          },
          {

            title: "附件",
            key: "file",
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
                      this.openFileWin(params.row.signId, params.row.applStatus);
                    }
                  }
                }, "查看")
              ]);
            }
          },

          {
            title: "地区",
            key: "area",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "Province", params.row.area);
              return h("span", {domProps: {title: dictValue}}, dictValue);
            }
          },

          {
            title: "企业规模",
            key: "discCorpScale",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "CorpScale", params.row.discCorpScale);
              return h("span", {domProps: {title: dictValue}}, dictValue);
            }
          },
          {
            title: "行业分类",
            key: "discIndustry",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "Industry", params.row.discIndustry);
              return h("span", {domProps: {title: dictValue}}, dictValue);
            }
          },
          {
            title: "是否涉农企业",
            key: "isDiscArc",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "Yon", params.row.isDiscArc);
              return h("span", {domProps: {title: dictValue}}, dictValue);
            }
          },
          {
            title: "是否绿色企业",
            key: "isDiscGreenCorp",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "Yon", params.row.isDiscGreenCorp);
              return h("span", {domProps: {title: dictValue}}, dictValue);
            }
          },
          {
            title: "是否科技企业",
            key: "isDiscTechnologyCorp",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "Yon", params.row.isDiscTechnologyCorp);
              return h("span", {domProps: {title: dictValue}}, dictValue);
            }
          },
          {
            title: "是否民营企业",
            key: "isDiscPrivateCorp",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "Yon", params.row.isDiscPrivateCorp);
              return h("span", {domProps: {title: dictValue}}, dictValue);
            }
          },
          {
            title: "企业类型",
            key: "corpCategory",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "CorpCategory", params.row.corpCategory);
              return h("span", {domProps: {title: dictValue}}, dictValue);
            }
          },
          {
            title: "企业所有制形式",
            key: "corpNature",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "CpesCorpNature", params.row.corpNature);
              return h("span", {domProps: {title: dictValue}}, dictValue);
            }
          },
          {
            title: "注册资本（万元）",
            key: "corpRegistCapital",
            hiddenCol: false,
          },
          {
            title: "营业收入（万元）",
            key: "busiinc",
            hiddenCol: false,
          },
          {
            title: "资产总额（万元）",
            key: "totalAssets",
            hiddenCol: false,
          },
          {
            title: "从业人员（人）",
            key: "employees",
            hiddenCol: false,
          },
          {
            title: "经营范围",
            key: "businessScope",
            hiddenCol: false,
            width: 100,
          },
          {
            title: "营业期限（自）",
            key: "fctvDt",
            hiddenCol: false,
          },
          {
            title: "营业期限（至）",
            key: "xpryDt",
            hiddenCol: false,
          },
          {
            title: "中征码",
            key: "lccCode",
            hiddenCol: false,
          },
          {
            title: "法人姓名",
            key: "corpLegalName",
            hiddenCol: false,
          },

          {
            title: "法人证件类型",
            key: "corpLegalCertifyType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "CertType", params.row.corpLegalCertifyType);
              return h("span", {domProps: {title: dictValue}}, dictValue);
            }
          },
          {
            title: "法人证件号码",
            key: "corpLegalCertifyNo",
            hiddenCol: false
          },
          {
            title: "是否需要开票",
            key: "needInv",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "Yon", params.row.needInv);
              return h("span", {domProps: {title: dictValue}}, dictValue);
            }
          },
          {
            title: "股东信息",
            key: "gd",
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
                      this.showShareholder(params.row.custId);
                    }
                  }
                }, "查看")
              ]);
            }
          },
          {
            title: "受益所有人信息",
            key: "benefit",
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
                      this.showBeneficiary(params.row.custId);
                    }
                  }
                }, "查看")
              ]);
            }
          },
        ],
        filePathUrl: "/be/discquote/disc/onlineSign/discOnlineSignApply/"
      };
    },
    mounted() {
      getDictListByGroups("DsctSignStatus,CertType,CpesCorpNature,CorpCategory," +
        "OnlineSignOperType,OnlineSignApplyType,PreRelationFlag," +
        "FileDetailStatus,AttTypeCode," +
        "CorpScale,Yon,Province,Industry,DCAplStatus,DCFileStatus,RelStatus").then(res => {
        this.applStatusList = res.get("DCAplStatus");
        this.signStatusDictList = res.get('DsctSignStatus');
        this.dictMap = res.get("map");
        this.fileDetailStatusList = res.get("FileDetailStatus");
        this.attTypeCodeList = res.get("AttTypeCode");

      });
    },
    methods: {
      convertDate(date) {
        return date.replace(/-/g, "");
      },
      handleDatePickerChange(arr, name) {
        if (arr && arr.length >= 2) {
          if ('signApplyDate' === name) {
            this.formItem.signApplyDateStart = this.convertDate(arr[0]);
            this.formItem.signApplyDateEnd = this.convertDate(arr[1]);
            this.signApplyDateArray = [arr[0], arr[1]];
            return;
          }
          if ('signDueDate' === name) {
            this.formItem.signDueDateStart = this.convertDate(arr[0]);
            this.formItem.signDueDateEnd = this.convertDate(arr[1]);
            this.signDueDateArray = [arr[0], arr[1]];
            return;
          }
          return;
        }

        if ('signApplyDate' === name) {
          this.formItem.signApplyDateStart = "";
          this.formItem.signApplyDateEnd = "";
          this.signApplyDateArray = [];
          return;
        }
        if ('signDueDate' === name) {
          this.formItem.signDueDateStart = "";
          this.formItem.signDueDateEnd = "";
          this.signDueDateArray = [];
        }
      },
      handleSignApplyDatePickerChange(arr) {
        this.handleDatePickerChange(arr, 'signApplyDate');
      },
      handleSignDueDatePickerChange(arr) {
        this.handleDatePickerChange(arr, 'signDueDate');
      },
      showShareholder(custId) {
        console.log(custId);
        this.isShowShareholder = true;
        this.shareholderForm.id = custId;
        this.$refs.shareholderGrid.dataChange(1);
      },
      showBeneficiary(custId) {
        console.log(custId);
        this.isShowBeneficiary = true;
        this.beneficiaryForm.id = custId;
        this.$refs.beneficiaryGrid.dataChange(1);
      },

      hideSignDetail() {
        this.isShowSignDetail = false;
        this.isShowShareholder = false;
        this.isShowBeneficiary = false;
        this.isShowSignAudit = false;
        this.isShowSignUpdate = false;
        this.isShowSignHistory = false;
        this.$refs.datagrid.selects = [];

        // this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);

        this.$refs.datagrid.selects = [];
      },
      handleSelectClick(arr, selectInx) {
        this.currentSelectList = arr;
        this.currentSelectRowInx = selectInx;
        console.log(arr);
        console.log(selectInx);
      },


      //表单查询
      handleSearch() {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.dataChange(1);
        this.currentSelectList = [];
      },
      handleSearchBeneficiary() {
        console.log(this.formItem);
        this.$refs.beneficiaryGrid.selects = [];
        this.$refs.beneficiaryGrid.dataChange(1);
      },
      handleSearchShareholder() {
        console.log(this.formItem);
        this.$refs.shareholderGrid.selects = [];
        this.$refs.shareholderGrid.dataChange(1);
      },
      //重置表单查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
        this.formItem.discBrchNameList = JSON.parse(window.sessionStorage.getItem("userInfo")).brchName;
        this.formItem.discBrchNoList = JSON.parse(window.sessionStorage.getItem("userInfo")).brchNo;

        this.formItem.discApplicantName = "";
        this.formItem.discApplicantSocCode = "";
        this.formItem.signStatus = "";
        this.formItem.signApplyDateStart = "";
        this.formItem.signApplyDateEnd = "";
        this.formItem.signDueDateStart = "";
        this.formItem.signDueDateEnd = "";
        this.signApplyDateArray = [];
        this.signDueDateArray = [];
        this.currentSelectList = [];

        if (this.$refs.shareholderForm) {
          this.$refs.shareholderForm.resetFields();
        }

        if (this.$refs.beneficiaryForm) {
          this.$refs.beneficiaryForm.resetFields();
        }

      },
      /* //机构树多选
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
         this.formItem.transBrchNoList = transBrchNoList;
         this.formItem.transBrchNameList = transBrchNameList;
         this.showBranchWin = false;
       },*/
      openFileWin(batchId) {
        this.fileBatchParams.busiId = batchId;
        this.fileBatchParams.attachBusiType = "DCS";
        this.fileBatchParams.attTypeCodeList = this.attTypeCodeList;
        this.fileBatchParams.fileDetailStatusList = this.fileDetailStatusList;
        this.showFileWin = true;
      },
      showFileWinClose() {
        this.showFileWin = false;

      },

      //导出
      exportExcel() {
        this.param = "discCustInfoExport";
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
      showSignHistory() {
        console.log(this.currentSelectList);

        if (this.currentSelectList.length === 0) {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseDataFirst")});
          return;
        }

        if (this.currentSelectList.length > 1) {
          this.$msgTip.info(this, {info: "只能选中一条记录操作"});
          return;
        }


        let signId = this.currentSelectList[0].signId;
        console.log(signId);

        //let url = "/be/discquote/onlineSign/func_pageOnlineSignOperHistory";
        this.isShowSignHistory = true;

        this.historyForm.id = signId;
        this.$refs.historyGrid.dataChange(1);
      },

      //清单导出
      exportList(field, exportType) {
        let url = window.LOCAL_CONFIG.API_HOME + "/be/discquote/onlineSign/func_exportOnlineSignTrack";

        let selectedIds = [];

        this.currentSelectList.forEach(function (e) {
          selectedIds.push(e.signId);
        });

        console.log("指定记录导出：", selectedIds);

        //exportType: 0-同步 1-异步
        if (exportType === "1") {

          let params = null;
          if (selectedIds.length !== 0) {
            console.log("指定记录异步导出：", selectedIds);
            params = {
              ids: selectedIds,
              field: field,
              exportType: exportType,
              excelName: this.param
            };
          } else {
            console.log("未指定记录异步导出");
            params = {
              transBrchNoList: this.formItem.transBrchNoList,
              applStatus: this.formItem.applStatus,
              discCustName: this.formItem.discCustName,
              discSocCode: this.formItem.discSocCode,
              field: field,
              exportType: exportType,
              excelName: this.param
            };
          }
          post(params, url).then(res => {
            if (res.status === 200 && res.data === null) {
              this.$msgTip.info(this, {info: "异步导出成功，请进入公共管理》导出下载页面，进行下载"});
            } else if (res.status === 200 && res.data === "") {
              this.$msgTip.info(this, {info: "异步导出成功，请进入公共管理》导出下载页面，进行下载"});
            } else {
              this.$msgTip.error(this, {info: "异步导出失败"});
            }
          });
        } else {
          if (selectedIds.length !== 0) {
            console.log("指定记录同步导出：", selectedIds);
            let form = document.createElement("form");
            form.setAttribute("id", "formId");
            form.setAttribute("action", url);
            form.setAttribute("method", "post");

            let input1 = document.createElement("input");
            input1.type = "text";
            input1.name = "ids";
            input1.value = selectedIds;
            console.log("ids", input1.value);

            form.appendChild(input1);
            let input2 = document.createElement("input");
            input2.type = "text";
            input2.name = "field";
            input2.value = field;
            console.log("field", input2.value);
            form.appendChild(input2);
            let input3 = document.createElement("input");
            input3.type = "text";
            input3.name = "exportType";
            input3.value = exportType;
            console.log("exportType", input3.value);
            form.appendChild(input3);
            let input4 = document.createElement("input");
            input4.type = "text";
            input4.name = "excelName";
            input4.value = this.param;
            console.log("excelName", input4.value);
            form.appendChild(input4);

            document.body.appendChild(form);

            form.submit();
            document.body.removeChild(form);
          } else {
            console.log("未指定记录同步导出");

            let form = document.createElement("form");
            for (let obj in this.formItem) {
              if (this.formItem.hasOwnProperty(obj)) {
                let input = document.createElement("input");
                input.type = "text";
                input.name = obj;
                input.value = this.formItem[obj];
                console.log("筛选条件", obj, input.value);
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
            console.log("field", input3.value);

            form.appendChild(input3);
            let input4 = document.createElement("input");
            input4.type = "text";
            input4.name = "exportType";
            input4.value = exportType;
            console.log("exportType", input4.value);

            form.appendChild(input4);
            let input5 = document.createElement("input");
            input5.type = "text";
            input5.name = "excelName";
            input5.value = this.param;
            console.log("excelName", input5.value);

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
