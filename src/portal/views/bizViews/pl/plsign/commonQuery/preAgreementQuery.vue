<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <!--查询表单-->
        <div>
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <show-branch v-model="formItem.brchNoList" :label="$t('m.i.ce.signBrchName')" prop="brchNoList" isNeedChecked
                             title="机构名称" :showCheckBox="true" :brchNo.sync="formItem.brchNoList" :brchName.sync="formItem.brchNameList"></show-branch>
                <h-form-item :label="$t('m.i.ce.signStatus')" prop="signStatusList">
                  <h-select v-model="formItem.signStatusList" placeholder="" multiple showTitle>
                    <h-option v-for="item in signStatusDictList" :value="item.key" :key="item.key">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.pl.agreementNo')" prop="agreementNo">
                  <h-input v-model="formItem.agreementNo" :maxlength="60"></h-input>
                </h-form-item>
                <h-form-item prop="custName" :label="$t('m.i.common.custName')">
                  <h-input v-model="formItem.custName" placeholder="" icon="android-search"
                           @on-click="queryCustNo('query')" clearable @on-clear="clearVal('custName')"
                           readonly></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.pl.agreementType')" prop="signType">
                  <h-select v-model="formItem.signType" placeholder="">
                    <h-option value="1">集团总部签约</h-option>
                    <h-option value="2">分子公司加入签约</h-option>
                    <h-option value="3">分子公司单独签约</h-option>
                    <h-option value="4">普通公司签约</h-option>
                    <!--<h-option v-for="item in signTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>-->
                  </h-select>
                </h-form-item>
                <h-form-item class="h-form-operate">
                <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i
                  class="icon iconfont"
                  :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid
            highlightRow
            :columns="columns"
            :bindForm="formItem"
            url="/pl/plsign/preAgreementMain/func_pagingPreAgreement"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!-- 查询客户信息弹窗 -->
    <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose"
                       @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>
  </div>
</template>

<script>
  import {accMul, formatNumber, getSingleParamValuesByKeys} from "@/api/bizApi/commonUtil";

  export default {
    name: "preAgreementQuery",
    data() {
      let columns = [
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
          sortable: true
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
              discountPcet = accMul(discountPcet, 100);
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
        },
        {
          title: this.$t("m.i.ce.fee"),
          key: 'fee',
          hiddenCol: false,
          render: (h, params) => {
            let fee = formatNumber(params.row.fee, 2, ',');
            return h("span", {
              domProps: {
                title: fee
              }
            }, fee);
          }
        },
        {
          title: this.$t("m.i.ce.signBrchName"),
          key: "brchName",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.ce.signStatus"),
          key: "signStatus",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let dictValue = this.getDictValueFromMap(this.dictMap, "PoolSignStatus", params.row.signStatus);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
      ];
      return {
        //是否显示更多查询项
        ifShowMore: false,
        showCustMessageWin: false,
        dictMap: new Map(),
        signStatusDictList: [],
        formItem: {
          brchNoList: JSON.parse(window.sessionStorage.getItem('userInfo')).brchNo,
          brchNameList: JSON.parse(window.sessionStorage.getItem('userInfo')).brchName,
          signStatusList: [],
          agreementNo: "",
          custNo: "",
          custName: "",
          deleteFlag: "0",
          signType: [],
        },
        columns: columns,
        showSignBrchWin: false,

      };
    },
    mounted() {
      this.getDictListByGroups("SignFuncNo,SaleOffMode,Yon,FreezedFuncNo,CDMedia,DraftTypeCode,bankLevel,CorpScale,ModeType,PoolSignStatus,SignLogOperType").then(res => {
        this.dictMap = res.get("map");
        this.signStatusDictList = res.get("PoolSignStatus");
      });
      getSingleParamValuesByKeys("bm.cust.is_sub_acct_works").then(res => {
        this.isSubAcctWorks = res["bm.cust.is_sub_acct_works"];
        if (this.isSubAcctWorks === '0') {
          this.$refs.datagrid.controlColumnsHidden("poolBailSubAcctNo", true);  //不显示保证金子账号
        }
      })

    },
    props: {
      listIds: "",
      batchId: "",
    },
    methods: {

      formSearch() {
        this.currentSelectRow = [];
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.formItem.custNo = "";
        this.formItem.brchNoList = JSON.parse(window.sessionStorage.getItem('userInfo')).brchNo;
        this.formItem.brchNameList = JSON.parse(window.sessionStorage.getItem('userInfo')).brchName;
        this.$refs.formItem.resetFields();
      },
      //查询签约机构弹出框
      querySignBrchNo() {
        this.showSignBrchWin = true;
      },
      //根据弹框所选数据进行赋值
      signBrchChange(info) {
        let objs = [];
        if (info instanceof Array) {
          objs = info;
        } else {
          objs[0] = info;
        }
        let brchNos = ""
        let brchNames = ""
        for (let i = 0; i < objs.length; i++) {
          brchNos += objs[i].id + ",";
          brchNames += objs[i].title + ",";
        }
        this.formItem.brchNoList = brchNos.substring(0, brchNos.length - 1);
        this.formItem.brchNameList = brchNames.substring(0, brchNames.length - 1);
        this.showSignBrchWin = false;
      },
      showSignBrchWinClose() {
        this.showSignBrchWin = false;
      },
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
      clearVal(optType) {
        if (optType === "custName") {
          this.formItem.custName = "";
          this.formItem.custNo = "";
        }else if(optType ==="brchNoList"){
          this.formItem.brchNoList = "";
          this.formItem.brchNameList = "";
        }
      },
    }
  };
</script>

<style scoped>

</style>
