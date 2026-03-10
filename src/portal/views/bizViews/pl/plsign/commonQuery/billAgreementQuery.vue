<!--业务查询-公共查询-签约查询-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <!--右侧数据展示表格-->
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <show-branch v-model="formItem.brchNoList" :label="$t('m.i.common.brchName')" prop="brchNoList" isNeedChecked
                             title="机构名称" :showCheckBox="true" :brchNo.sync="formItem.brchNoList" :brchName.sync="formItem.brchNameList"></show-branch>
                <h-form-item :label="$t('m.i.pl.agreementNo')" prop="agreementNo">
                  <h-input v-model="formItem.agreementNo" :maxlength="60"></h-input>
                </h-form-item>
                <h-form-item prop="custName" :label="$t('m.i.common.custName')">
                  <h-input v-model="formItem.custName" placeholder="" icon="android-search"
                           @on-click="queryCustNo()" clearable @on-clear="clearVal('custName')" readonly></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.pl.agreementType')" prop="agreementType">
                  <h-select v-model="formItem.agreementType" placeholder="">
                    <h-option value="1">集团总部签约</h-option>
                    <h-option value="2">分子公司加入签约</h-option>
                    <h-option value="3">分子公司单独签约</h-option>
                    <h-option value="4">普通公司签约</h-option>
                    <!--<h-option v-for="item in signTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>-->
                  </h-select>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                                                                  :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>

                  <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            highlightRow
            url="/pl/plsign/billAgreementMain/func_pagingBillAgreement"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="tempShowExcelTemplateWinOpen()" :disabled="this.ifDisabledExport">
                {{$t("m.i.common.export")}}
              </h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!-- 查询客户信息弹窗 -->
    <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose"
                       @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>
    <!-- 查询客户信息弹窗 -->
    <show-sign-agreement :signAgreementWin="signAgreementWin" @signAgreementWinClose="signAgreementWinClose"
                         :signParams="signParams" :isShowQuery="false"></show-sign-agreement>

    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param"
                           :rows="this.rows"></common-excel-download>

  </div>
</template>

<script>
  import { post, on, off, formatNumber, accMul ,exportList,getSingleParamValuesByKeys} from "@/api/bizApi/commonUtil";

  export default {
    name: "billAgreementQuery",
    data() {
      return {
        ifShowMore : false,
        formItem : {
          brchNoList: JSON.parse(window.sessionStorage.getItem('userInfo')).brchNo,
          brchNameList: JSON.parse(window.sessionStorage.getItem('userInfo')).brchName,
          agreementNo: "",
          custNo: "",
          custName: "",
          agreementType: ""
        },
        columns : [
          {
            type: "radio",
            title: " ",
            key: "multiSelect",
            width: 60,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
           title: this.$t("m.i.pl.agreementNo"),
            key: "agreementNo",
            hiddenCol: false,
            ellipsis: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.isGroupCus === "1" || params.row.isGroupCus === "") {
                return h("a", {
                  on: {
                    click: () => {
                      this.showAgreement(params.row.agreementNo);
                    }
                  }
                }, params.row.agreementNo);
              } else {
                return h("span", params.row.agreementNo);
              }
            }
          },
          {
            title: this.$t("m.i.pl.signStartDt"),
            key: "signStartDt",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.signStartDt == null || params.row.signStartDt === "") {
                return "";
              }
              let date = this.$moment(params.row.signStartDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.pl.signEndDt"),
            key: "signEndDt",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.signEndDt == null || params.row.signEndDt === "") {
                return "";
              }
              let date = this.$moment(params.row.signEndDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.pl.signFunc"),
            key: "signFuncNo",
            ellipsis: false,
            hiddenCol: false,
            render: (h, params) => {
              let _signFuncNo = params.row.signFuncNo.indexOf("!") >= 0 ? params.row.signFuncNo.substring(0, params.row.signFuncNo.length - 1) : params.row.signFuncNo;
              let dictValue = this.getDictValueFromMap(this.dictMap, "SignFuncNo", _signFuncNo);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.pl.signCustNo"),
            key: "custNo",
            ellipsis: false,
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.custName"),
            key: "custName",
            ellipsis: false,
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.pl.custSettleAcctNo"),
            key: "custAcctNo",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("m.i.pl.poolBillBailAcctNo"),
            key: "billBailAcctNo",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t('m.i.pl.poolBailSubAcctNo'),
            key: "poolBailSubAcctNo",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("m.i.pl.authorizer"),
            key: "authorizer",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.pl.authorizerIdcard"),
            key: "authorizerIdcard",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.pl.secondAuthorizer"),
            key: "secondAuthorizer",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("m.i.pl.secondAuthorizerIdcard"),
            key: "secondAuthorizerIdcard",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("m.i.common.custMgrNo"),
            key: "custMgrNo",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("m.i.common.custMgrName"),
            key: "custMgrName",
            hiddenCol: false,
            ellipsis: false
          },
          {
           title: this.$t("m.i.pl.deleteFlag"),
            key: "deleteFlag",
            ellipsis: false,
            hiddenCol: false,
            render: (h, params) => {
              let deleteFlag = params.row.deleteFlag;
              switch (params.row.deleteFlag) {
                case "0":
                  deleteFlag = "未解约";
                  break;
                case "1":
                  deleteFlag = "已解约";
                  break;
                case "3":
                  deleteFlag = "审批中";
                  break;
                case "4":
                  deleteFlag = "审批拒绝";
                  break;
                default:
                  deleteFlag = "";
              }
              return h("span", deleteFlag);
            }
          },
          {
           title: this.$t("m.i.pl.isGroupCus"),
            key: "isGroupCus",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "Yon", params.row.isGroupCus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.pl.saleOffMode"),
            key: "saleOffMode",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "SaleOffMode", params.row.saleOffMode);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.pl.discountPcet"),
            key: "discountPcet",
            hiddenCol: false,
            render: (h, params) => {
              let discountPcet = params.row.discountPcet;
              if (discountPcet != null && discountPcet !== "" && discountPcet !== 0) {
                discountPcet = formatNumber(accMul(discountPcet, 100), 2, ",");
                return h("span", discountPcet);
              } else {
                return h("span", "");
              }
            }
          },
          {
            title: this.$t("m.i.pl.maxMoney"),
            key: "maxMoney",
            hiddenCol: false,
            ellipsis: false,
            render: (h, params) => {
              let maxMoney = formatNumber(params.row.maxMoney, 2, ",");
              return h("span", {
                domProps: {
                  title: maxMoney
                }
              }, maxMoney);
            }
          },
          {
           title: this.$t("m.i.pl.isCheckBeforeInPool"),
            key: "isCheckBeforeInPool",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "Yon", params.row.isCheckBeforeInPool);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.pl.isCollect"),
            key: "isCollect",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "Yon", params.row.isCollect);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          }
        ],
        currentSelectRow : [],
        showCustMessageWin : false,
        agreementTypeList : [],
        dictMap : new Map(),
        signAgreementWin : false,
        signParams : {},
        tempShowExcelTemplateWin: false,
        ifDisabledExport: false,
        isSubAcctWorks:""
      };
    },
    components: {

    },
    methods: {
      //查询客户信息
      queryCustNo() {
        this.showCustMessageWin = true;
      },
      //赋值
      custCorpSelectSubmit(info) {
        this.formItem.custNo = info.custNo;
        this.formItem.custName = info.custName;
        this.showCustMessageWin = false;
      },
      //关闭
      custCorpWinClose() {
        this.showCustMessageWin = false;
      },
      //搜索选择框清空事件
      clearVal(optType){
        if(optType === "custName"){
          this.formItem.custName = "";
          this.formItem.custNo = "";
        }
      },
      formSearch() {
        this.currentSelectRow = [];
        this.$refs.datagrid.dataChange(1);
        this.ifDisabledExport = false;
      },
      formSearchReset() {
        this.formItem.brchNoList = JSON.parse(window.sessionStorage.getItem('userInfo')).brchNo;
        this.formItem.brchNameList = JSON.parse(window.sessionStorage.getItem('userInfo')).brchName;
        this.formItem.custNo = "";
        this.ifDisabledExport = true;
        this.$refs.formItem.resetFields();
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      //查询签约信息
      showAgreement(agreementNo) {
        this.signParams.agreementNo = agreementNo;
        this.signParams.isGroupCus = "1";
        this.signParams.agreementUrl = "/pl/plsign/commonQuery/billAgreementQuery/func_pagingBillAgreement";
        this.signParams.showSubBillBailAcctNo = this.isSubAcctWorks==='1';
        this.signAgreementWin = true;
        this.ifDisabledExport = false;
      },
      //关闭
      signAgreementWinClose() {
        this.signParams = {};
        this.signAgreementWin = false;
        this.ifDisabledExport = false;
      },
      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },
      //清单导出
      tempShowExcelTemplateWinOpen() {
        this.param = "szbankBillAgreementExportInfo";
        if (this.$refs.datagrid.selectIds.length != 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        } else {
          this.rows = this.$refs.datagrid.total;
        }
        this.tempShowExcelTemplateWin = true;
      },

      //清单导出
      exportList(field, exportType) {
        let exportUrl = window.LOCAL_CONFIG.API_HOME + "/pl/plsign/commonQuery/billAgreementQuery/func_exportBillAgreementExcel";
        let options = {
          params: {}
        };
        options.params = this.formItem;
        options.pageSize = this.$refs.datagrid.total;
        exportList(this, this.param, field, exportType, exportUrl, options);
      },

    },
    mounted() {
      this.getDictListByGroups("SignFuncNo,Yon,SaleOffMode").then(res => {
        // this.signTypeList = res.get("SignType");
        this.dictMap = res.get("map");
      });
      getSingleParamValuesByKeys("bm.cust.is_sub_acct_works").then(res => {
          this.isSubAcctWorks = res["bm.cust.is_sub_acct_works"];
          if (this.isSubAcctWorks==='0'){
            this.$refs.datagrid.controlColumnsHidden("poolBailSubAcctNo",true);  //不显示保证金子账号
          }
        })
    }
  };
</script>

<style scoped>

</style>
