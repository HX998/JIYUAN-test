<template>
  <div>
    <h-msg-box v-model="tempPickBillWin" :mask-closable="false" @on-close="handleClose" :maximize="true" width="1100"
               :height="600"
               :footerHide="false" class="h-form-table-layer" top="10">
      <p slot="header">
        <span>挑票页面</span>
      </p>
      <div>
        <div :class="{'h-form-overhd':!ifShowMore}">
          <h-form :model="pickBillForm" :label-width="90" ref="pickBillForm" cols="4" class="h-form-search">
            <h-form-item :label="$t('m.i.billInfo.billType')">
              <h-select v-model="pickBillForm.billType" placeholder="请选择" readonly showTitle>
                <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{item.value }}</h-option>
              </h-select>
            </h-form-item>
            <h-form-item :label="$t('m.i.billInfo.billClass')">
              <h-select v-model="pickBillForm.billClass" placeholder="请选择" readonly showTitle>
                <h-option v-for="item in billClassList" :value="item.key" :key="item.key">{{item.value }}</h-option>
              </h-select>
            </h-form-item>
            <h-form-item prop="batchNo" :label="$t('m.i.common.batchNo')">
              <h-input v-model="pickBillForm.batchNo" placeholder=""></h-input>
            </h-form-item>
            <h-form-item prop="billAtm" :label="$t('m.i.be.billMoneyByTenThousandUnit')"
                         class="h-form-parentheses-label h-form-long-label" v-if="pickBillFlag">
              <h-row>
                <h-col span="11">
                  <h-form-item prop="minBillMoney">
                    <h-typefield v-model="pickBillForm.minBillMoney" integerNum="12" type="money" suffixNum="2"
                                 placeholder="最多12位整数,2位小数"></h-typefield>
                  </h-form-item>
                </h-col>
                <h-col span="2" style="text-align: center">-</h-col>
                <h-col span="11">
                  <h-form-item prop="maxBillMoney">
                    <h-typefield v-model="pickBillForm.maxBillMoney" integerNum="12" type="money" suffixNum="2"
                                 placeholder="最多12位整数,2位小数"></h-typefield>
                  </h-form-item>
                </h-col>
              </h-row>
            </h-form-item>

            <h-form-item prop="acptName" :label="$t('m.i.billInfo.acptName')" v-if="pickBillFlag">
              <h-input v-model="pickBillForm.acptName" placeholder=""></h-input>
            </h-form-item>
            <h-form-item prop="discBankName" :label="$t('m.i.billInfo.discBankName')" v-if="pickBillFlag">
              <h-input v-model="pickBillForm.discBankName" placeholder=""></h-input>
            </h-form-item>
            <h-form-item prop="dueDate" :label="$t('m.i.billInfo.dueDt')" v-if="pickBillFlag">
              <h-date-picker :value="dueDate" format="yyyy-MM-dd" type="daterange" autoPlacement placeholder="到期日期"
                             showFormat :editable=false @on-change="handleDueDateChange"></h-date-picker>
            </h-form-item>
            <h-form-item prop="buyDate" :label="$t('m.i.be.buyDt')">
              <h-date-picker :value="buyDate" format="yyyy-MM-dd" type="daterange" autoPlacement placeholder="买入日期"
                             showFormat :editable=false @on-change="handleBuyDateChange"></h-date-picker>
            </h-form-item>
            <h-form-item prop="buyRatePct" :label="$t('m.i.be.buyRate')">
              <h-row>
                <h-col span="11">
                  <h-form-item prop="minBuyRatePct">
                    <h-typefield v-model="pickBillForm.minBuyRatePct" integerNum="2" suffixNum="4" type="money"
                                 placeholder="最多2位整数,4位小数" :bigTips="false"></h-typefield>
                  </h-form-item>
                </h-col>
                <h-col span="2" style="text-align: center">-</h-col>
                <h-col span="11">
                  <h-form-item prop="maxBuyRatePct">
                    <h-typefield v-model="pickBillForm.maxBuyRatePct" integerNum="2" suffixNum="4" type="money"
                                 placeholder="最多2位整数,4位小数" :bigTips="false"></h-typefield>
                  </h-form-item>
                </h-col>
              </h-row>
            </h-form-item>
            <h-form-item prop="billNo" :label="$t('m.i.billInfo.billPackageNo')" v-if="pickBillFlag">
              <h-input v-model="pickBillForm.billNo"></h-input>
            </h-form-item>
            <!-- 子票区间 -->
            <h-form-item :label="$t('m.i.billInfo.billRange')" prop="billRange">
              <h-row>
                <h-col span="11">
                   <h-typefield v-model="pickBillForm.billRangeStart" integerNum="12" placeholder="" type="int" bigTips></h-typefield>
                  <!--                   <h-input v-model="pickBillForm.billRangeStart"></h-input>-->
                                  </h-col>
                                  <h-col span="2" style="text-align: center">至</h-col>
                                  <h-col span="11">
                                    <h-typefield v-model="pickBillForm.billRangeEnd" integerNum="12" placeholder="" type="int" bigTips></h-typefield>
                                    <!--<h-input v-model="pickBillForm.billRangeEnd"></h-input>-->
                </h-col>
              </h-row>
            </h-form-item>
            <h-form-item :label="$t('m.i.billInfo.billOrigin')" prop="billOrigin"
                         v-if="pickBillFlag&&pickBillForm.billClass==='ME02'">
              <h-select v-model="pickBillForm.billOrigin" placeholder="" showTitle>
                <h-option v-for="item in billOriginList" :value="item.key" :key="item.key">{{item.value }}
                </h-option>
              </h-select>
            </h-form-item>
            <h-form-item prop="transFromName" :label="$t('m.i.common.custName')">
              <h-input v-model="pickBillForm.transFromName"></h-input>
            </h-form-item>
            <h-form-item :label="$t('m.i.be.residualTerm')" prop="billTerm" v-if="pickBillFlag">
              <h-select v-model="pickBillForm.billTerm" placeholder="请选择" showTitle>
                <h-option v-for="item in tenorCodeList" :value="item.key" :key="item.key">{{item.value }}</h-option>
              </h-select>
            </h-form-item>
            <h-form-item :label="$t('m.i.billInfo.creditMainBankType')" prop="creditBranchClasses" v-if="pickBillFlag">
              <h-select v-model="pickBillForm.creditBranchClasses" placeholder="请选择" showTitle>
                <h-option v-for="item in CreditMajorList" :value="item.key" :key="item.key">{{item.value }}</h-option>
              </h-select>
            </h-form-item>
            <h-form-item :label="$t('m.i.billInfo.creditMainBankName')" prop="creditBranchName" v-if="pickBillFlag"
                         class="h-form-long-label">
              <h-input v-model="pickBillForm.creditBranchName" placeholder=""></h-input>
            </h-form-item>
            <h-form-item :label="$t('m.i.billInfo.creditMainBrchCode')" class="h-form-long-label" prop="creditBrchCode"
                         v-if="pickBillFlag">
              <h-input v-model="pickBillForm.creditBrchCode" @on-click="showBrchWin = true" icon="search" clearable
                       @on-clear="clearVal()"
                       readonly placeholder=""></h-input>
            </h-form-item>
            <h-form-item :label="$t('m.i.billInfo.businessSource')" prop="orgnlProdNos" v-if="pickBillFlag">
              <h-select v-model="pickBillForm.orgnlProdNos" placeholder="请选择" multiple showTitle>
                <h-option v-for="item in billSourceList" :value="item.key" :key="item.key">{{item.value }}
                </h-option>
              </h-select>
            </h-form-item>
            <!--资产分类下拉框  @Liangqs 20200806-->
            <h-form-item :label="$t('m.i.be.assetIndustry')" prop="assetIndustry" v-if="pickBillFlag && openI9flag">
              <h-select v-model="pickBillForm.assetIndustry" placeholder="请选择" showTitle>
                <h-option v-for="item in list" :value="item.key" :key="item.key">{{item.value }}</h-option>
              </h-select>
            </h-form-item>

            <h-form-item :label="$t('m.i.be.rediscFlag')" prop="isRelieve" v-if="rediscFlagPickBill">
              <h-select v-model="pickBillForm.rediscountFlag" placeholder="" showTitle>
                <h-option v-for="item in yonList" :value="item.key" :key="item.key">{{ item.value }}
                </h-option>
              </h-select>
            </h-form-item>
            <h-form-item class="h-form-operate" style="width: auto">
              <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i
                class="icon iconfont"
                :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
              <h-button type="primary" @click="handlePickBillSearch('common')">{{$t('m.i.common.search')}}</h-button>
              <h-button type="primary" @click="handlePickBillSearch('group')" style="width: 80px">
                {{$t('m.i.be.combinationQuery')}}
              </h-button>
              <h-button type="ghost" @click="resetPickBillSearch()">{{$t('m.i.common.reset')}}</h-button>
            </h-form-item>
          </h-form>
          <h-datagrid :columns="pickColumns" :url="pickUrl" :auto-load="false" :height="300" :bindForm="pickBillForm"
                      :hasSelect="hasSelect"
                      rowSelect ref="pickBillDatagrid" class="pl-5 pr-5">
            <!--<div slot="toolbar" class="pull-left">-->
            <!--<h-button type="primary" @on-click="selectBatchBill()" v-if="pickBillFlag">{{$t('m.i.common.pickBatch')}}</h-button>-->
            <!--<h-button type="primary" @on-click="selectInfoBill()" v-else{{$t('m.i.common.pickBillDetail')}}</h-button>-->
            <!--</div>-->
          </h-datagrid>
        </div>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="pickBillClose()">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="pickBillStock()">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>

    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="billId"
                    :billNo="billNo" :billRangeStart="billRangeStart" :billRangeEnd="billRangeEnd"></bill-info-main>
    <brch-code-search :brchCodeWin="showBrchWin" optType="2" @brchCodeWinClose="closeBranch"
                      @brchCodeChange="brchCodeChange"></brch-code-search>
  </div>
</template>

<script>
  import {
    post,
    on,
    off,
    getDictListByGroups,
    getDictValueFromMap,
    formatNumber,
    getMoreParamValuesByKeys,
    getUploadImgType
  } from "@/api/bizApi/commonUtil";

  export default {
    name: "redSalePickBill",
    data() {
      return {
        ifShowMore: false,
        billTypeList: [],
        billClassList: [],
        billSourceList: [],
        submitFlag: false,
        pickBillFlag: true,
        tenorCodeList: [],
        assetIndustryList: [],
        CreditMajorList: [],
        billOriginList: [],
        list: [],
        openI9flag: false,
        pickBillForm: {
          assetIndustry: "",
          billType: "",
          billClass: "",
          batchNo: "",
          billRangeStart: "",
          billRangeEnd: "",
          minBillMoney: "",
          maxBillMoney: "",
          drweBankName: "",
          dueDate: "",
          dueSettleDt: "",
          minDueDt: "",
          maxDueDt: "",
          buyDate: "",
          minBuyDt: "",
          maxBuyDt: "",
          discBankName: "",
          minBuyRatePct: "",
          maxBuyRatePct: "",
          billNo: "",
          transFromName: "",
          batchId: "",
          billTerm: '',
          pickType: '',
          acptName: '',
          creditBrchCode: '',
          creditBranchName: '',
          creditBranchClasses: [],
          rediscountFlag: '1',
          orgnlProdNos: [],
        },
        //明细挑票地址
        pickBillUrl: "/be/market/rediscount/redSaleApplyMain/func_pagingQueryHldrBillInfo",
        //批次挑票地址
        pickBillBatchUrl: "/be/market/rediscount/redSaleApplyMain/func_pagingQueryHldrBillCollect",
        pickUrl: "/be/market/rediscount/redSaleApplyMain/func_pagingQueryHldrBillInfo",
        pickColumns: [],
        dueDate: [],
        buyDate: [],
        yonList: [],
        rediscFlagPickBill: false,
        pickBillColumns: [
          {
            type: "selection",
            width: 50,
            hiddenCol: false,
            align: "center"
          },
          {
            type: "index",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center"
          },
          {
            title: this.$t('m.i.common.batchNo'),
            key: "batchNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.billOrigin'),
            key: 'billOrigin',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = (!params.row.billOrigin || params.row.billOrigin === 'CS00') ? '-' : getDictValueFromMap(this.dictMap, 'BillOrigin', params.row.billOrigin);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.billInfo.billPackageNo'),
            key: "billNo",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params.row.billId, params.row.billNo, params.row.billRangeStart, params.row.billRangeEnd);
                  }
                }
              }, params.row.billNo);
            }
          },
          {
            title: this.$t('m.i.billInfo.billRange'),
            key: 'billRange',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = !params.row.billRange ? '-' : params.row.billRange;
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
            title: this.$t('m.i.billInfo.billClass'),
            key: "billClass",
            hiddenCol: false,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap, "CDMedia", params.row.billClass);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.billInfo.billPackageMoney'),
            key: "billMoney",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', formatNumber(params.row.billMoney, 2, ','))
            }
          },
          {
            title: this.$t('m.i.billInfo.dueDt'),
            key: "dueDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("span", params.row.dueDt ? this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          },
          {
            title: this.$t('m.i.be.buyDt'),
            key: "transDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("span", params.row.transDt ? this.$moment(params.row.transDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          },
          {
            title: this.$t('m.i.be.buyRate'),
            key: "ratePct",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.custName'),
            key: "oppName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.acptName'),
            key: "acptName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.acptBankName'),
            key: "acptBankName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.cfmAppBankName'),
            key: "cfmAppBankName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.acptGuarntrBankName'),
            key: "acptGuarntrBankName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.discBankName'),
            key: "discBankName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.billInfo.discGuarntrBankName'),
            key: "discGuarntrBankName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.guarntrTrustBankName'),
            key: "trustBankName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.creditMainBrchCode'),
            key: "creditMainBrchCode",
            hiddenCol: false,

          },
          {
            title: this.$t('m.i.billInfo.creditMainBankName'),
            key: "creditMainBankName",
            hiddenCol: false,

          },
          {
            title: this.$t('m.i.billInfo.creditMainBankType'),
            key: "creditMainBankType",
            hiddenCol: false,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap, "CreditMajor", params.row.creditMainBankType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.be.assetIndustry'),
            key: 'assetIndustry',
            hiddenCol: window.sessionStorage.getItem("isOpenI9") == "1" ? false : true,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, 'AssetIndustry', params.row.assetIndustry);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.common.corpScale'),
            key: "discCorpScale",
            hiddenCol: false,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap, "CorpScale", params.row.discCorpScale);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          }
        ],
        pickBillBatchColumns: [
          {
            type: 'selection',
            hiddenCol: false,
            align: 'center'
          },
          {
            type: 'index',
            title: this.$t("m.i.common.index"),
            align: 'center'
          },
          {
            title: this.$t('m.i.common.batchNo'),
            key: 'batchNo',
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.custName'),
            key: 'transFromName',
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t("m.i.common.prodName"),
            key: 'prodName',
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.billType'),
            key: 'billType',
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
            title: this.$t('m.i.billInfo.billClass'),
            key: 'billClass',
            hiddenCol: false,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap, "CDMedia", params.row.billClass);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.be.buyDt'),
            key: 'buyDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('span', params.row.buyDt ? this.$moment(params.row.buyDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
            }
          },
          {
            title: this.$t('m.i.be.buyRate'),
            key: 'buyRatePct',
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.totalBillMoney'),
            key: 'totalBillMoney',
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.totalCountByUnit'),
            key: 'totalCount',
            hiddenCol: false
          },
        ],
        showBillInfoWin: false,
        billId: "",
        billNo: "",
        billRangeStart: '',
        billRangeEnd: '',
        pickBillSelectList: [],
        pickBillSelectRowInx: [],
        dictMap: new Map(),
        hasSelect: false,
        showBrchWin: false
      }
    },
    components: {
      BrchCodeSearch: () => import(/* webpackChunkName: "sm/auth/branch/cpesBrchCodeSearch" */`@/views/bizViews/sm/auth/branch/cpesBrchCodeSearch`)
    },
    props: {
      batchId: "",
      billType: String,
      billClass: String,
      busiType: String,
      dueSettleDt: String,
      pickBillWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
    },
    computed: {

      tempPickBillWin: {
        get() {
          return this.pickBillWin;
        },
        set() {

        }
      },
    },
    watch: {
      pickBillWin(val) {
        if (val) {
          this.$nextTick(() => {
            this.pickBillInit();
            if (this.batchId) {
              this.hasSelect = false;
              this.$refs.pickBillDatagrid.dataChange(1);
            }
          });
        }
      }
    },
    methods: {
      clearVal() {
        this.pickBillForm.creditBrchCode = '';
      },
      closeBranch() {
        this.showBrchWin = false
      },
      //根据弹框所选数据进行赋值
      brchCodeChange(info) {
        if (info === null) {
          this.$msgTip.info(this, {info: "请先选择记录！"});
          return;
        }
        this.pickBillForm.creditBrchCode = info.brchCode;
        this.showBrchWin = false;
      },
      showBillInfo(billId, billNo, billRangeStart, billRangeEnd) {
        this.billId = billId;
        this.billNo = billNo;
        this.billRangeStart = billRangeStart;
        this.billRangeEnd = billRangeEnd;
        this.showBillInfoWin = true;
      },
      billInfoWinClose() {
        this.billId = null;
        this.billNo = null;
        this.billRangeStart = null;
        this.billRangeEnd = null;
        this.showBillInfoWin = false;
      },
      handleClose() {
        this.hasSelect = true;
        this.$refs.pickBillForm.resetFields();
        this.$emit("pickBillWinClose", "");

      },
      pickBillClose() {
        this.hasSelect = true;
        this.pickBillFlag = true;
        this.pickUrl = this.pickBillUrl;
        this.pickColumns = this.pickBillColumns;
        this.pickBillSelectList = [];
        this.$refs.pickBillForm.resetFields();
        this.$emit("pickBillWinClose", "");
      },
      // //切换为批次挑票
      // selectBatchBill(){
      //   this.pickBillFlag=false;
      //   this.pickBillSelectList = [];
      //   this.$refs.pickBillForm.resetFields();
      //   this.pickUrl=this.pickBillBatchUrl;
      //   this.pickColumns=this.pickBillBatchColumns;
      //   this.$nextTick(()=>{
      //     this.$refs.pickBillDatagrid.dataChange(1);
      //   })
      // },
      // //切换为明细挑票
      // selectInfoBill(){
      //   this.pickBillFlag=true;
      //   this.pickBillSelectList = [];
      //   this.$refs.pickBillForm.resetFields();
      //   this.pickUrl=this.pickBillUrl;
      //   this.pickColumns=this.pickBillColumns;
      //   this.$nextTick(()=> {
      //     this.$refs.pickBillDatagrid.dataChange(1);
      //   })
      // },
      pickBillInit() {
        this.pickBillForm.billType = this.billType;
        this.pickBillForm.billClass = this.billClass;
        this.pickBillForm.busiType = this.busiType;
        this.pickBillForm.batchId = this.batchId;
        this.pickBillForm.dueSettleDt = this.dueSettleDt;
        this.pickBillForm.billRangeStart = null;
        this.pickBillForm.billRangeEnd = null;
        this.pickColumns = this.pickBillColumns;
        console.log(111111111111);
        let showFlag = "";
        this.list = [];
        this.list = this.assetIndustryList.slice(0);
        console.log("list:", this.list);
        this.list=this.list.filter(item => item.key != "0");
        getUploadImgType("bm.valuate.is_holdbill_allowsale").then(res => {
          let value = res.value
          if (value == '0') {//否
            showFlag = "0";
          } else if (value == "1") {//是
            showFlag = "1";
          }
          console.log("busiType:", this.busiType)
          if (this.busiType == "RBT01" && showFlag == "0") {
            this.list = this.list.filter(item => item.key != "1");
          }
          console.log("最终list:", this.list)
        })

      },
      // 行选中
      pickBillSelectClick(arr, selectInx) {
        this.pickBillSelectList = arr;
        this.pickBillSelectRowInx = selectInx;
      },
      //挑票页面查询
      handlePickBillSearch(pickType) {
        this.hasSelect = true;
        /**清除多页选择的数据*/
        this.$refs.pickBillDatagrid.selectIds = [];
        this.$refs.pickBillDatagrid.selects = [];
        if (pickType == 'group') {
          this.pickBillForm.pickType = "group";
        } else if (pickType == 'common') {
          this.pickBillForm.pickType = "common";
        }
        this.$refs.pickBillDatagrid.dataChange(1);
      },
      handleDueDateChange(arr) {
        if (arr && arr.length >= 2) {
          this.pickBillForm.minDueDt = arr[0].replace(/-/g, "");
          this.pickBillForm.maxDueDt = arr[1].replace(/-/g, "");
          this.dueDate = [arr[0], arr[1]];
        } else {
          this.pickBillForm.minDueDt = "";
          this.pickBillForm.maxDueDt = "";
          this.dueDate = [];
        }
      },
      handleBuyDateChange(arr) {
        if (arr && arr.length >= 2) {
          this.pickBillForm.minBuyDt = arr[0].replace(/-/g, "");
          this.pickBillForm.maxBuyDt = arr[1].replace(/-/g, "");
          this.buyDate = [arr[0], arr[1]];
        } else {
          this.pickBillForm.minBuyDt = "";
          this.pickBillForm.maxBuyDt = "";
          this.buyDate = [];
        }
      },
      //挑票页面重置查询条件
      resetPickBillSearch() {
        this.dueDate = [];
        this.buyDate = [];
        this.pickBillForm.billRangeStart = null;
        this.pickBillForm.billRangeEnd = null;
        this.$refs.pickBillForm.resetFields();
      },
      //挑票新增方法
      pickBillStock() {
        this.submitFlag = true;
        let list = this.$refs.pickBillDatagrid.selects;
        this.hasSelect = true;
        if (list.length === 0) {
          this.submitFlag = false;
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
          return;
        }
        let pickBillFlag = this.pickBillFlag;
        if (pickBillFlag) {
          let ids = "";
          for (let i = 0; i < list.length; i++) {
            ids += list[i].id;
            if (i < list.length - 1) {
              ids += ",";
            }
          }
          let batchId = this.batchId;
          let url = "/be/market/rediscount/redSaleApplyMain/func_redSalePickBillStock";
          post({batchId: batchId, ids: ids}, url).then(res => {
            if (res) {
              let retCode = res.data.retCode
              if (retCode == "000000") {
                this.$msgTip.success(this);
                this.pickBillSelectList = [];
                this.pickBillClose();
                this.submitFlag = false;
              } else {
                this.submitFlag = false;
                this.$msgTip.error(this, {info: res.data.retMsg});
              }
              this.hasSelect = false;
              //modify by cao 20240422 这里会再次查询挑票页面
              //this.$refs.pickBillDatagrid.dataChange(1);
            } else {
              this.submitFlag = false;
              this.$msgTip.error(this, {info: this.$t('m.i.common.netError')});
            }
          });
        } else {
          // 按批次挑票
          if (list.length > 1) {
            this.$msgTip.info(this, {info: this.$t("m.i.common.onlyChooseOneData")});
            this.submitFlag = false;
            return
          }
          let batchNo = list[0].batchNo;
          let buyDt = list[0].buyDt;
          let transFromName = list[0].transFromName;
          let prodNo = list[0].prodNo;
          let billClass = list[0].billClass;
          let billType = list[0].billType;
          let buyRatePct = list[0].buyRatePct;
          let batchId = this.batchId;
          let data = {
            batchId: batchId, batchNo: batchNo, buyDt: buyDt, transFromName: transFromName,
            prodNo: prodNo, billClass: billClass, billType: billType, buyRatePct: buyRatePct, isLock: this.isLock
          };
          let url = "/be/market/rediscount/redSaleApplyMain/func_batchPickBillStock";
          post(data, url).then(res => {
            if (res) {
              let retCode = res.data.retCode
              if (retCode == "000000") {
                this.$msgTip.success(this);
                this.pickBillSelectList = [];
                this.pickBillClose();
                this.submitFlag = false;
              } else {
                this.submitFlag = false;
                this.$msgTip.error(this, {info: res.data.retMsg});
              }
            } else {
              this.submitFlag = false;
              this.$msgTip.error(this, {info: this.$t('m.i.common.netError')});
            }
          });
        }
      }
    },

    mounted() {
      this.openI9flag = window.sessionStorage.getItem('isOpenI9') == '1' ? true : false;
      getDictListByGroups("TenorCode,CDMedia,AssetIndustry,DraftTypeCode,CreditMajor,CorpScale,CreditMajor,Yon,BillOrigin,billSource").then(res => {
        this.billClassList = res.get("CDMedia");
        this.billTypeList = res.get("DraftTypeCode");
        this.tenorCodeList = res.get("TenorCode");
        this.CreditMajorList = res.get("CreditMajor");
        this.assetIndustryList = res.get("AssetIndustry");
        this.billOriginList = res.get("BillOrigin");
        this.yonList = res.get("Yon");
        this.billSourceList = res.get("billSource");
        this.dictMap = res.get("map");
      });
    },
    created() {
      getMoreParamValuesByKeys("be.market.is_open_redisc_flag_pick_bill").then(res => {
        let idAudit = res['be.market.is_open_redisc_flag_pick_bill'];
        if (idAudit === '1') {
          this.rediscFlagPickBill = true;
        } else {
          this.rediscFlagPickBill = false;
        }
      });
    }
  };

</script>

<style scoped>

</style>
