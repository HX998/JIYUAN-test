<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!-- 查询表单 -->
          <div class="h-form-search-box">
            <h-panel class="h-form-search-box clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form ref="queryFormItem" :model="queryFormItem" :label-width="90" class="h-form-search" cols="4">
                <div class="h-search-form-row">
                  <h-form-item prop="intentionReqId" :label="$t('m.i.be.intentionReqId')" class="h-form-long-label">
                    <h-input v-model="queryFormItem.intentionReqId"  :maxlength="16"></h-input>
                  </h-form-item>
                  <h-form-item prop="busiType" :label="$t('m.i.common.busiType')">
                    <h-select v-model="queryFormItem.busiType" placeholder="">
                      <h-option v-for="item in BusiTypeList" :value="item.key" :key="item.value">{{ item.value}}
                      </h-option>
                    </h-select>
                  </h-form-item>
                  <h-form-item prop="trDir" :label="$t('m.i.be.tradDir')">
                    <h-select v-model="queryFormItem.trDir" placeholder="">
                      <h-option v-for="item in TrDirList" :value="item.key" :key="item.value">{{ item.value}}
                      </h-option>
                    </h-select>
                  </h-form-item>
                  <h-form-item prop="billType" :label="$t('m.i.billInfo.billType')">
                    <h-select v-model="queryFormItem.billType" placeholder="">
                      <h-option v-for="item in BillTypeList" :value="item.key" :key="item.value">{{ item.value}}
                      </h-option>
                    </h-select>
                  </h-form-item>
                  <h-form-item prop="billClass" :label="$t('m.i.billInfo.billClass')">
                    <h-select v-model="queryFormItem.billClass" placeholder="">
                      <h-option v-for="item in BillClassList" :value="item.key" :key="item.value">{{ item.value}}
                      </h-option>
                    </h-select>
                  </h-form-item>
                  <common-rate-range v-model="queryFormItem" :label="$t('m.i.be.tradRate')"  :integerNum="2"
                                     :suffixNum="4" :rangeProps="['minRate','maxRate']"
                                     :validRules="rateRule"></common-rate-range>
                  <h-form-item prop="transDts" :label="$t('m.i.be.transDt')">
                    <h-date-picker v-model="queryFormItem.transDts" format="yyyy-MM-dd" type="date"
                                   placeholder="" :clearable="false"
                                   showFormat :editable=false></h-date-picker>
                  </h-form-item>
                  <h-form-item prop="isRelateQuote" :label="$t('m.i.be.changeToQuoted')">
                    <h-select v-model="queryFormItem.isRelateQuote" placeholder="" showTitle>
                      <h-option v-for="item in YonList" :value="item.key" :key="item.value">{{ item.value}}
                      </h-option>
                    </h-select>
                  </h-form-item>
                  <h-form-item prop="intentionStatus" :label="$t('m.i.common.status')">
                    <h-select v-model="queryFormItem.intentionStatus" placeholder="" showTitle>
                      <h-option v-for="item in IntentionStatusList" :value="item.key" :key="item.value">{{ item.value}}
                      </h-option>
                    </h-select>
                  </h-form-item>
                  <h-form-item class="h-form-operate">
                    <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                                    :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                    <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                    <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
                  </h-form-item>
                </div>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
              <h-datagrid
                  :columns="columns"
                  highlight-row
                  url="/be/market/intention/intentionMain/func_findPreSendIntentionBatch"
                  :bindForm="queryFormItem"
                  :onCurrentChange="onCurrentChange"
                  :onCurrentChangeCancel="onCurrentChangeCancle"
                  :notSetWidth="true"
                  ref="datagrid">
                <div slot="toolbar" class="pull-left">
                  <h-dropdown placement="bottom-start" @on-click="addIntentionBatch">
                    <h-button type="primary">
                      {{$t('m.i.common.add')}}
                      <h-icon name="unfold"></h-icon>
                    </h-button>
                    <h-dropdown-menu slot="list">
                      <h-dropdown-item name="BT01">转贴现</h-dropdown-item>
                      <h-dropdown-item name="BT02">质押式回购</h-dropdown-item>
                      <h-dropdown-item name="BT03">买断式回购</h-dropdown-item>
                    </h-dropdown-menu>
                  </h-dropdown>
                  <h-button type="primary" @on-click="editIntentionBatch()">{{$t('m.i.common.modify')}}</h-button>
                  <h-button type="primary" @on-click="deleIntentionBatch()">{{$t('m.i.be.nullify')}}</h-button>
                  <h-button type="primary" @on-click="copyIntentionBatch()">{{$t('m.i.be.copy')}}</h-button>
                  <h-button type="primary" @on-click="transToQuote()">{{$t('m.i.be.changeToQuot')}}</h-button>
                  <h-dropdown placement="bottom-start" @on-click="matchingIntentionBatch">
                    <h-button type="primary">
                      {{$t('m.i.be.match')}}
                      <h-icon name="unfold"></h-icon>
                    </h-button>
                    <h-dropdown-menu slot="list">
                      <h-dropdown-item name="1">利率匹配</h-dropdown-item>
                      <h-dropdown-item name="2">期限匹配</h-dropdown-item>
                      <h-dropdown-item name="3">信用主体匹配</h-dropdown-item>
                      <h-dropdown-item name="4">综合匹配</h-dropdown-item>
                    </h-dropdown-menu>
                  </h-dropdown>
                </div>
              </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <h-msg-box v-model="matchingWin" width="850" @on-close="matchingWinClose" class="h-form-table-layer"
               :maximize="true" :footerHide="true">
      <p slot="header">
        <span>匹配意向询价</span>
      </p>
      <h-form :model="matchingFormItem" ref="matchingFormItem">
      </h-form>
          <h-datagrid :columns="matchingColumns"
                      :auto-load="false"
                      highlight-row
                      url="/be/market/intention/intentionMain/func_matchingIntentionBatch"
                      :bindForm="matchingFormItem"
                      :onCurrentChange="onMatchingChange"
                      :onCurrentChangeCancel="onMatchingChangeCancle"
                      ref="matchingDatagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @on-click="transToQuoteWithMatched()">{{$t('m.i.be.changeToQuot')}}</h-button>
            </div>
          </h-datagrid>
    </h-msg-box>
    <intention-view :intentionView="intentionView"
                    :intentionType="intentionType"
                    :needBatchId="needBatchId"
                    :isEdit="isEdit"
                    :canEdit="canEdit"
                    :mapList="mapList"
                    @intentionViewClose="intentionViewClose"
                    @intentionViewSaveBatch="intentionViewSaveBatch"
                    @intentionViewSend="intentionViewSend"></intention-view>
    <intention-show :intentionShow="intentionShow"
                    :needBatchId="needBatchId"
                    :intentionType="intentionType"
                    @intentionShowClose="intentionShowClose"></intention-show>
  </div>
</template>

<script>
  import { post, on, off,formatNumber, getDictListByGroups,getDictValueFromMap } from "@/api/bizApi/commonUtil";

  export default {
    name: "intentionMain",
    data() {
      return {
        mapList : {},
        queryFormItem : {
          intentionReqId: "",
          trDir: "",
          busiType: "",
          billType: "",
          billClass: "",
          rate: "",
          minRate: "",
          maxRate: "",
          transDts: "",
          transDt:"",
          minTransDt: "",
          maxTransDt: "",
          isRelateQuote: "",
          intentionStatus: ""
        },
        matchingFormItem : {
          id: "",
          trDir: "",
          transCustType: "",
          creditCustType: "",
          minResidualTerm: "",
          maxResidualTerm: "",
          rate: "",
          sendRange: "",
          matchingMethod: ""
        },
        matchingColumns : [
          {
            title: " ",
            type: "radio",
            hiddenCol: false,
            width: 50,
            align: "center"
          },
          {
            type: "index",
            title: this.$t("m.i.common.index"),
            align: "center",
            width : 50,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.id'),
            key: "id",
            hiddenCol: true,
            align: "center"
          },
          {
            title: this.$t('m.i.be.intentionReqId'),
            key: "intentionReqId",
            hiddenCol: false,
            align: "center"
          },
          {
            title: this.$t('m.i.common.busiType'),
            key: "busiType",
            align: "center",
            hiddenCol: false,
            render: (h, params) => {
             let dictValue = getDictValueFromMap(this.dictMap, 'QuoteBusiType', params.row.busiType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.common.status'),
            key: "intentionStatus",
            align: "center",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, 'IntentionStatus', params.row.intentionStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.sendBrchName'),
            key: "sendBrchName",
            align: "center",
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.be.sendTraderName'),
            key: "sendTraderName",
            align: "center",
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.be.tradDir'),
            key: "trDir",
            align: "center",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, 'TrDir', params.row.trDir);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.billInfo.billType'),
            key: "billType",
            align: "center",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, 'DraftTypeCode', params.row.billType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.billInfo.billClass'),
            key: "billClass",
            align: "center",
            hiddenCol: false,
            render: (h, params) => {
          let dictValue = getDictValueFromMap(this.dictMap, 'CDMedia', params.row.billClass);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.tradRate'),
            key: "rate",
            align: "center",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
                return h('span', formatNumber(params.row.rate, 4, ','))

            }
          },
          {
            title: this.$t('m.i.be.dueTradRate'),
            key: "dueRate",
            align: "center",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('span', formatNumber(params.row.dueRate, 4, ','))
            }
          },
          {
            title: this.$t('m.i.be.totalAmtBillPackageByTenThousandUnit'),
            key: "totalAmt",
            align: "center",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('span', formatNumber(params.row.totalAmt, 2, ','))
            }
          },
          {
            title: this.$t('m.i.be.buyBackTotalAmtByUnit'),
            key: "buyBackTotalAmt",
            align: "center",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('span', formatNumber(params.row.buyBackTotalAmt, 2, ','))
            }
          },
          {
            title: this.$t('m.i.be.minResidualTerm'),
            key: "residualTerm",
            align: "center",
            hiddenCol: false,
            render: (h, params) => {
              if (null != params.row.minResidualTerm && params.row.maxResidualTerm) {
                let minResidualTerm = getDictValueFromMap(this.dictMap, "TenorCode", params.row.minResidualTerm);
                let maxResidualTerm = getDictValueFromMap(this.dictMap, "TenorCode", params.row.maxResidualTerm);
                if (minResidualTerm !== "" && maxResidualTerm !== "") {
                  return h("span", minResidualTerm + "-" + maxResidualTerm);
                }
              }
              return h("span", "");
            }
          },
          {
            title: this.$t('m.i.billInfo.creditMainBankType'),
            key: "creditCustType",
            align: "center",
            hiddenCol: false,
            render: (h, params) => {
              let keyList = params.row.creditCustType.split(",");
              if (keyList.length === this.CreditCustTypeList.length) {
                return h("span", "");
              }
              let valueList = [];
              for (let i = 0; i < keyList.length; i++) {
                valueList.push(getDictValueFromMap(this.dictMap, "CreditMajor", keyList[i]));
              }
              return h("span", valueList.join(","));
            }
          },
          {
            title: this.$t('m.i.be.transDt'),
            key: "transDt",
            align: "center",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (null != params.row.transDt && "" !== params.row.transDt) {
                let dttm = this.$moment(params.row.transDt, "YYYY-MM-DD").format("YYYY-MM-DD");
                return h("span", dttm);
              }
            }
          }
        ],
        columns : [
          {
            title: " ",
            type: 'radio',
            align: 'center',
            width : 50
          },
          {
            type: "index",
            title: this.$t("m.i.common.index"),
            align: "center",
            width : 50,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.id'),
            key: "id",
            hiddenCol: true,
            align: "center"
          },
          {
            title: this.$t('m.i.common.status'),
            key: "intentionStatus",
            align: "center",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, 'IntentionStatus', params.row.intentionStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.common.busiType'),
            key: "busiType",
            align: "center",
            hiddenCol: false,
            render: (h, params) => {
          let dictValue = getDictValueFromMap(this.dictMap, 'BusiType', params.row.busiType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.intentionReqId'),
            key: "intentionReqId",
            hiddenCol: false,
            sortable: true,
            align: "center",
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showIntentionBatch(params.row.id,params.row.busiType);
                  }
                }
              }, params.row.intentionReqId);
            }
          },
          {
            title: this.$t('m.i.be.tradDir'),
            key: "trDir",
            align: "center",
            hiddenCol: false,
            render: (h, params) => {
             let dictValue = getDictValueFromMap(this.dictMap, 'TrDir', params.row.trDir);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.sendBrchName'),
            key: "sendBrchName",
            align: "center",
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.be.sendTraderName'),
            key: "sendTraderName",
            align: "center",
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.be.changeToQuoted'),
            key: "isRelateQuote",
            align: "center",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, 'Yon', params.row.isRelateQuote);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.sendRange'),
            key: "sendRange",
            align: "center",
            hiddenCol: false,
            render: (h, params) => {
             let dictValue = getDictValueFromMap(this.dictMap, 'SendRange', params.row.sendRange);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.transCustType'),
            key: "transCustType",
            align: "center",
            hiddenCol: false,
            render: (h, params) => {
              let keyList = params.row.transCustType.split(",");
              if (keyList.length === this.CreditCustTypeList.length) {
                return h("span", "");
              }
              let valueList = [];
              for (let i = 0; i < keyList.length; i++) {
                valueList.push(getDictValueFromMap(this.dictMap, "CreditMajor", keyList[i]));
              }
              return h("span", valueList.join(","));
            }
          },
          {
            title: this.$t('m.i.billInfo.billType'),
            key: "billType",
            align: "center",
            hiddenCol: false,
            render: (h, params) => {
             let dictValue = getDictValueFromMap(this.dictMap, 'DraftTypeCode', params.row.billType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.billInfo.billClass'),
            key: "billClass",
            align: "center",
            hiddenCol: false,
            render: (h, params) => {
             let dictValue = getDictValueFromMap(this.dictMap, 'CDMedia', params.row.billClass);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.tradRate'),
            key: "rate",
            align: "center",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('span', formatNumber(params.row.rate, 4, ','))
            }
          },
          {
            title: this.$t('m.i.be.dueTradRate'),
            key: "dueRate",
            align: "center",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('span', formatNumber(params.row.dueRate, 4, ','))
            }
          },
          {
            title: this.$t('m.i.be.totalAmtBillPackageByTenThousandUnit'),
            key: "totalAmt",
            align: "center",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('span', formatNumber(params.row.totalAmt, 2, ','))
            }
          },
          {
            title: this.$t('m.i.be.buyBackTotalAmtByUnit'),
            key: "buyBackTotalAmt",
            align: "center",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('span', formatNumber(params.row.buyBackTotalAmt, 2, ','))
            }
          },
          {
            title: this.$t('m.i.be.minResidualTerm'),
            key: "residualTerm",
            align: "center",
            hiddenCol: false,
            render: (h, params) => {
              if (null != params.row.minResidualTerm && params.row.maxResidualTerm) {
                let minResidualTerm = getDictValueFromMap(this.dictMap, "TenorCode", params.row.minResidualTerm);
                let maxResidualTerm = getDictValueFromMap(this.dictMap, "TenorCode", params.row.maxResidualTerm);
                if (minResidualTerm !== "" && maxResidualTerm !== "") {
                  return h("span", minResidualTerm + "-" + maxResidualTerm);
                }
              }
              return h("span", "");
            }
          },
          {
            title: this.$t('m.i.billInfo.creditMainBankType'),
            key: "creditCustType",
            align: "center",
            hiddenCol: false,
            render: (h, params) => {
              let keyList = params.row.creditCustType.split(",");
              if (keyList.length === this.CreditCustTypeList.length) {
                return h("span", "");
              }
              let valueList = [];
              for (let i = 0; i < keyList.length; i++) {
                valueList.push(getDictValueFromMap(this.dictMap, "CreditMajor", keyList[i]));
              }
              return h("span", valueList.join(","));
            }
          },
          {
            title: this.$t('m.i.be.transDt'),
            key: "transDt",
            align: "center",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              if (null != params.row.transDt && "" !== params.row.transDt) {
                let dttm = this.$moment(params.row.transDt, "YYYY-MM-DD").format("YYYY-MM-DD");
                return h("span", dttm);
              }
            }
          },
          {
            title: this.$t('m.i.common.dealPrcMsg'),
            key: "dealPrcMsg",
            hiddenCol: false,
            align: "center"
          }
        ],
        disabled : false,
        otherFormItem : {},
        intentionType : "",
        needBatchId : "",
        intentionReqId : "",
        canEdit : true,
        isEdit : false,
        isView : false,
        intentionView : false,
        intentionShow : false,
        matchingWin : false,
        ifShowMore : false,
        dictMap : null,
        SendRangeList : [],
        TenorCodeList : [],
        CreditCustTypeList : [],
        BusiTypeList : [],
        TrDirList : [],
        BillClassList : [],
        BillTypeList : [],
        currentSelectList : [],
        currentMatcheSelectList : [],
        YonList:[],
        IntentionStatusList:[],
        rateRule: [{ test: this.validRate, trigger: "blur" }],
      };
    },
    components: {
      IntentionView:()=>import(/* webpackChunkName: "be/market/intention/intentionView" */`@/views/bizViews/be/market/intention/intentionView`),
      IntentionShow:()=>import(/* webpackChunkName: "be/market/intention/intentionShow" */`@/views/bizViews/be/market/intention/intentionShow`)
    },
    watch: {
      matchingWin(val) {
        if (val) {
          this.$nextTick(() => {
            this.$refs.matchingDatagrid.dataChange(this.$refs.matchingDatagrid.pageInfo.pageNo);
          });
        }
      }
    },
    mounted() {
      getDictListByGroups("CDMedia,DraftTypeCode,TrDir,CreditMajor,TenorCode,SendRange,QuoteBusiType,IntentionStatus,BusiType,Yon,BillOrigin").then(res => {
        this.BillClassList = res.get("CDMedia");
        this.BillTypeList = res.get("DraftTypeCode");
        this.BusiTypeList = res.get("QuoteBusiType");
        this.TrDirList = res.get("TrDir");
        this.CreditCustTypeList = res.get("CreditMajor");
        this.YonList = res.get("Yon");
        let intentionStatusList = res.get("IntentionStatus");
        intentionStatusList.forEach(item => {
          if(item.key === "IQS02" || item.key === "IQS12"|| item.key === "IQS17" || item.key === "IQS11"){
            this.IntentionStatusList.push(item);
          }
        });
        this.dictMap = res.get("map");
        this.mapList={
          BusiTypeList:this.BusiTypeList,
        }
      });
    },
    created() {
      this.queryFormItem.transDt = window.sessionStorage.getItem("workDate");
      this.queryFormItem.transDts = window.sessionStorage.getItem("workDate");
    },
    methods: {
      handleSearch() {
        let transDt = this.queryFormItem.transDts.replace(/-/g, "");
        this.queryFormItem.transDt = transDt;
        this.currentSelectList = [];
        this.unDisabled();
        this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
      },
      unDisabled() {
        this.moveUpDisabled = false;
        this.moveDownDisabled = false;
      },
      resetSearch() {
        this.queryFormItem.transDt = "";
        this.$refs.queryFormItem.resetFields();
        this.queryFormItem.transDts = window.sessionStorage.getItem("workDate");
      },
      onCurrentChange(currentRow,oldCurrentRow,_index) {
        this.currentSelectList = currentRow;
        this.disabled = currentRow.intentionStatus === 'IQS12';
      },
      onCurrentChangeCancle(currentRow,oldCurrentRow,_index){
        this.currentSelectList = [];
      },
      onMatchingChange(currentRow,oldCurrentRow,_index) {
        this.currentMatcheSelectList = currentRow;
      },
      onMatchingChangeCancle(currentRow,oldCurrentRow,_index){
        this.currentMatcheSelectList = [];
      },
      addIntentionBatch(type) {
        this.canEdit = true;
        this.needBatchId = "";
        this.intentionType = type;
        this.isEdit = false;
        this.intentionView = true;
      },
      editIntentionBatch() {
        let selects = this.currentSelectList;
        if (selects.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        if(selects.intentionStatus === "IQS12"){
          this.$msgTip.info(this, { info: "发送待确认的批次不允许此操作" });
          return;
        }
        this.canEdit = selects.intentionStatus !== "IQS02" && selects.intentionStatus !== "IQS17";
        this.isEdit = true;
        this.intentionType = selects.busiType;
        this.needBatchId = selects.id;
        this.intentionView = true;
      },
      deleIntentionBatch(){
        let selects = this.currentSelectList;
        if (selects.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        if(selects.intentionStatus === "IQS12"){
          this.$msgTip.info(this, { info: "发送待确认的批次不允许此操作" });
          return;
        }
        this.$hMsgBox.confirm({
          title: "作废确认",
          content: "确定要作废吗？",
          onOk: () => {
            post({ id: selects.id }, "/be/market/intention/intentionMain/func_deleteIntentionBatch").then(res => {
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                } else {
                  this.$msgTip.error(this, { info: msg });
                }
                this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      copyIntentionBatch() {
        let selects = this.currentSelectList;
        if (selects.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        if(selects.intentionStatus === "IQS12"){
          this.$msgTip.info(this, { info: "发送待确认的批次不允许此操作" });
          return;
        }
        this.$hMsgBox.confirm({
          title: "复制信息",
          content: "确定要复制吗？",
          onOk: () => {
            post({ id: selects.id }, "/be/market/intention/intentionMain/func_copyIntentionBatch").then(res => {
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                } else {
                  this.$msgTip.error(this, { info: msg });
                }
                this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      transToQuote() {
        let selects = this.currentSelectList;
        if (selects.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        if(selects.intentionStatus === "IQS12"){
          this.$msgTip.info(this, { info: "发送待确认的批次不允许此操作" });
          return;
        }
        this.$hMsgBox.confirm({
          title: "转对话报价",
          content: "确定要转对话报价吗？",
          onOk: () => {
            post({ id: selects.id }, "/be/market/intention/intentionMain/func_transToQuoteApl").then(res => {
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  if(this.matchingWin){
                    this.matchingWin = false;
                  }
                } else {
                  this.$msgTip.error(this, { info: msg });
                }
                this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      matchingIntentionBatch(type) {
        let selects = this.currentSelectList;
        if (selects.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.matchingFormItem.id = selects.id;
        this.matchingFormItem.matchingMethod = type;
        this.matchingWin = true;
      },
      matchingWinClose() {
        this.$refs["matchingFormItem"].resetFields();
        this.matchingWin = false;
      },
      transToQuoteWithMatched() {
        let select = this.currentMatcheSelectList;
        if (select.length === 0) {
          this.$msgTip.error(this, {info: this.$t("m.i.common.chooseOneData")});
          return;
        }
        post({ cpId: select.id, id: this.matchingFormItem.id}, "/be/market/intention/intentionMain/func_transToQuoteApl").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
            } else {
              this.$msgTip.error(this, { info: msg });
            }
            this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      intentionViewClose() {
        this.currentSelectList = [];
        this.intentionView = false;
        this.$refs.datagrid.dataChange(1);
      },
      intentionViewSaveBatch() {
        this.$refs.datagrid.dataChange(1);
      },
      intentionViewSend() {
        this.currentSelectList = [];
        this.intentionView = false;
        this.$refs.datagrid.dataChange(1);
      },
      intentionShowClose() {
        this.intentionShow = false;
      },
      showIntentionBatch(id,busiType){
        this.intentionType = busiType;
        this.needBatchId = id;
        this.intentionShow = true;
      },
      validRate(rule, val, callback) {
        if (this.queryFormItem.minRate === "" || this.queryFormItem.maxRate === "") {
          callback();
          return;
        }
        if (this.queryFormItem.minRate > this.queryFormItem.maxRate) {
          callback(new Error("最大交易利率不能小于最小交易利率"));
        } else {
          callback();
        }
      }
    }
  };
</script>

<style scoped>

</style>
