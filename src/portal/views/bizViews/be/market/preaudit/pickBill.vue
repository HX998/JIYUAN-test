<template>
  <div>
    <h-msg-box v-model="tempPickBillWin" :mask-closable="false" @on-close="pickBillClose" :maximize="true"
               width="1000" :footerHide="false" class="h-form-table-layer">
      <p slot="header">
        <span>挑票页面</span>
      </p>
      <div :class="{'h-form-overhd':!ifShowMore}">
        <h-form :model="pickBillForm" :label-width="90" ref="pickBillForm" cols="4" class="h-form-search">
          <h-form-item :label="$t('m.i.billInfo.billType')">
            <h-select v-model="pickBillForm.billType" placeholder="请选择" readonly>
              <h-option v-for="item in curDictMap['billTypeList']" :value="item.key" :key="item.key">
                {{item.value }}
              </h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.billClass')">
            <h-select v-model="pickBillForm.billClass" placeholder="请选择" readonly>
              <h-option v-for="item in curDictMap['billClassList']" :value="item.key" :key="item.key">
                {{item.value }}
              </h-option>
            </h-select>
          </h-form-item>
          <h-form-item prop="batchNo" :label="$t('m.i.common.batchNo')">
            <h-input v-model="pickBillForm.batchNo" placeholder=""></h-input>
          </h-form-item>
          <h-form-item prop="billAtm" :label="$t('m.i.billInfo.billPackageMoney')" v-if="pickBillFlag" class="h-form-long-label">
            <h-row>
              <h-col span="11">
                <h-form-item prop="minBillMoney">
                  <h-typefield v-model="pickBillForm.minBillMoney" integerNum="12" type="money"
                               suffixNum="2" placeholder="最多12位整数,2位小数" bigTips></h-typefield>
                </h-form-item>
              </h-col>
              <h-col span="2" style="text-align: center">-</h-col>
              <h-col span="11">
                <h-form-item prop="maxBillMoney">
                  <h-typefield v-model="pickBillForm.maxBillMoney" integerNum="12" type="money"
                               suffixNum="2" placeholder="最多12位整数,2位小数" bigTips></h-typefield>
                </h-form-item>
              </h-col>
            </h-row>
          </h-form-item>

          <h-form-item prop="acptName" :label="$t('m.i.billInfo.acptName')" v-if="pickBillFlag">
            <h-input v-model="pickBillForm.acptName" placeholder=""></h-input>
          </h-form-item>
          <h-form-item prop="dueDate" :label="$t('m.i.billInfo.dueDt')" v-if="pickBillFlag">
            <h-date-picker :value="dueDate" format="yyyy-MM-dd" type="daterange"
                           showFormat :editable=false @on-change="handleDueDateChange"></h-date-picker>
          </h-form-item>
          <h-form-item prop="buyDate" :label="$t('m.i.be.buyDt')">
            <h-date-picker :value="buyDate" format="yyyy-MM-dd" type="daterange"
                           placeholder="买入日期" showFormat :editable=false @on-change="handleBuyDateChange"></h-date-picker>
          </h-form-item>
          <h-form-item prop="BuyRatePct" :label="$t('m.i.be.buyRate')">
            <h-row>
              <h-col span="11">
                <h-form-item prop="minBuyRatePct">
                  <h-typefield v-model="pickBillForm.minBuyRatePct" integerNum="2" suffixNum="4" type="money" placeholder="最多2位整数,4位小数"></h-typefield>
                </h-form-item>
              </h-col>
              <h-col span="2" style="text-align: center">-</h-col>
              <h-col span="11">
                <h-form-item prop="maxBuyRatePct">
                  <h-typefield v-model="pickBillForm.maxBuyRatePct" integerNum="2" suffixNum="4" type="money" placeholder="最多2位整数,4位小数"></h-typefield>
                </h-form-item>
              </h-col>
            </h-row>
          </h-form-item>
          <h-form-item prop="billNo" :label="$t('m.i.billInfo.billPackageNo')" v-if="pickBillFlag">
            <h-input v-model="pickBillForm.billNo"></h-input>
          </h-form-item>
          <!--票据来源-->
          <common-select v-model="pickBillForm.billOrigin" :label="$t('m.i.billInfo.billOrigin')" prop="billOrigin" :dictList="curDictMap['billOriginList']"
                         v-if="pickBillFlag && pickBillForm.billClass === 'ME02'"></common-select>
          <h-form-item prop="transFromName" :label="$t('m.i.common.custName')">
            <h-input v-model="pickBillForm.transFromName"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.acptTopBankLevel')" prop="acptTopBankLevels" v-if="pickBillFlag">
            <h-select v-model="pickBillForm.acptTopBankLevels" placeholder="请选择">
              <h-option v-for="item in curDictMap['bankLevelList']" :value="item.key" :key="item.key">
                {{item.value }}
              </h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.distClass')" prop="discTopBankLevels" v-if="pickBillFlag">
            <h-select v-model="pickBillForm.discTopBankLevels" placeholder="请选择">
              <h-option v-for="item in curDictMap['bankLevelList']" :value="item.key" :key="item.key">
                {{item.value }}
              </h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.residualTerm')" prop="billTerm" v-if="pickBillFlag">
            <h-select v-model="pickBillForm.billTerm" placeholder="请选择">
              <h-option v-for="item in curDictMap['TenorCodeList']" :value="item.key" :key="item.key">
                {{item.value }}
              </h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.acptBankType')" prop="acptBankTypes" v-if="pickBillFlag">
            <h-select v-model="pickBillForm.acptBankTypes" placeholder="请选择">
              <h-option v-for="item in curDictMap['bankTypeList']" :value="item.key" :key="item.key">
                {{item.value }}
              </h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.discBankType')" prop="discBankTypes" v-if="pickBillFlag">
            <h-select v-model="pickBillForm.discBankTypes" placeholder="请选择">
              <h-option v-for="item in curDictMap['bankTypeList']" :value="item.key" :key="item.key">
                {{item.value }}
              </h-option>
            </h-select>
          </h-form-item>
          <!--资产分类下拉框  @Liangqs 20200806-->
          <h-form-item :label="$t('m.i.be.assetIndustry')"  prop="assetIndustry"  v-if="pickBillFlag && openI9flag" >
            <h-select v-model="pickBillForm.assetIndustry"  placeholder="请选择" showTitle>
              <h-option v-for="item in this.list" :value="item.key" :key="item.key">{{item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item class="h-form-operate">
            <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t("m.i.common.searchAdvanced")}}<i
              class="icon iconfont"
              :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
            <h-button type="primary" @click="handlePickBillSearch()">{{$t("m.i.common.search")}}</h-button>
            <h-button type="ghost" @click="resetPickBillSearch()">{{$t("m.i.common.reset")}}</h-button>
          </h-form-item>
        </h-form>
        <h-datagrid :columns="pickColumns"
                    :url="pickUrl"
                    :auto-load="false"
                    :param-id="paramId"
                    :bindForm="pickBillForm"
                    :hasSelect="hasSelect"
                    rowSelect
                    ref="pickBillDatagrid" class="pl-5 pr-5">
          <div slot="toolbar" class="pull-left">
            <h-button type="primary" @on-click="selectBatchBill()" v-if="pickBillFlag">{{$t("m.i.common.pickBatch")}}
            </h-button>
            <h-button type="primary" @on-click="selectInfoBill()" v-else>{{$t("m.i.common.pickBillDetail")}}</h-button>
          </div>
        </h-datagrid>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="pickBillClose()">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="pickBillStock()">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="billId"
                    :billNo="billNo"  :billRangeStart="billRangeStart" :billRangeEnd="billRangeEnd"></bill-info-main>
  </div>
</template>

<script>
  import { post, getDictValueFromMap, formatNumber, getUploadImgType, formatBillRange } from "@/api/bizApi/commonUtil";

  export default {
    name: "pickBill",
    data() {
      return {
        billTypeList: [],
        billClassList: [],
        list:[],
        openI9flag:false,
        submitFlag: false,
        pickBillFlag: true,
        ifShowMore: false,
        paramId: "id",
        //明细挑票地址
        pickBillUrl: "/be/market/preaudit/preAuditMain/func_pagingQueryHldrBillInfo",
        //批次挑票地址
        pickBillBatchUrl: "/be/market/preaudit/preAuditMain/func_pagingQueryHldrBillCollect",
        pickUrl: "/be/market/preaudit/preAuditMain/func_pagingQueryHldrBillInfo",
        pickBillForm: {
          billType: "",
          billClass: "",
          batchNo: "",
          minBillMoney: "",
          maxBillMoney: "",
          acptName: "",
          dueDate: "",
          minDueDt: "",
          maxDueDt: "",
          buyDate: "",
          minBuyDt: "",
          maxBuyDt: "",
          minBuyRatePct: "",
          maxBuyRatePct: "",
          billNo: "",
          transFromName: "",
          batchId: null,
          isLock: "",
          acptTopBankLevels: "",
          discTopBankLevels: "",
          acptBankTypes: "",
          discBankTypes: "",
          assetIndustry:"",
          billTerm: "",
          billOrigin: ""
        },
        dueDate:[],
        buyDate:[],
        pickColumns: [],
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
            title: this.$t("m.i.common.batchNo"),
            key: "batchNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.billOrigin'),
            key: 'billOrigin',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = (!params.row.billOrigin || params.row.billOrigin === 'CS00') ? '-' : getDictValueFromMap(this.curDictMap.dictListMap, 'BillOrigin', params.row.billOrigin);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.billInfo.billPackageNo"),
            key: "billNo",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.billInfoWinOpen(params.row.billId, params.row.billNo,params.row.billRangeStart,params.row.billRangeEnd);
                  }
                }
              }, params.row.billNo);
            }
          },
          {
            title: this.$t("m.i.billInfo.billRange"),
            align:'center',
            key:"billRange",
            hiddenCol: false,
            render:(h,params) => {
              let billOrigin = params.row.billOrigin;
              let billRangeStart = params.row.billRangeStart;
              let billRangeEnd = params.row.billRangeEnd;
              return h("span", formatBillRange(billOrigin, billRangeStart, billRangeEnd))
            }
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.curDictMap.dictListMap, "DraftTypeCode", params.row.billType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.billInfo.billClass"),
            key: "billClass",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.curDictMap.dictListMap, "CDMedia", params.row.billClass);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.billInfo.billPackageMoney"),
            key: "billMoney",
            hiddenCol: false,
            render: (h, params) => {
              return h("p", formatNumber(params.row.billMoney, 2, ","));
            }
          },
          {
            title: this.$t('m.i.billInfo.remitDt'),
            key: "remitDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h("span", params.row.remitDt ? this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          },
          {
            title: this.$t("m.i.billInfo.dueDt"),
            key: "dueDt",
            hiddenCol: false,
            render: (h, params) => {
              return h("span", params.row.dueDt ? this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          },
          {
            title: this.$t("m.i.be.buyDt"),
            key: "transDt",
            hiddenCol: false,
            render: (h, params) => {
              return h("span", params.row.transDt ? this.$moment(params.row.transDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          },
          {
            title: this.$t("m.i.be.buyRate"),
            key: "ratePct",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.custName"),
            key: "oppName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.acptName"),
            key: "acptName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.acptBankName"),
            key: "acptBankName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.cfmAppBankName"),
            key: "cfmAppBankName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.acptGuarntrBankName"),
            key: "acptGuarntrBankName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.discBankName"),
            key: "discBankName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.discGuarntrBankName"),
            key: "discGuarntrBankName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.guarntrTrustBankName"),
            key: "trustBankName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.assetIndustry'),
            key: 'assetIndustry',
            hiddenCol: window.sessionStorage.getItem("isOpenI9") == "1" ? false : true,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.curDictMap.dictListMap, 'AssetIndustry', params.row.assetIndustry);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          }
        ],
        pickBillBatchColumns: [
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
            title: this.$t("m.i.common.batchNo"),
            key: "batchNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.custName"),
            key: "oppName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.prodName"),
            key: "prodName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.curDictMap.dictListMap, "DraftTypeCode", params.row.billType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.billInfo.billClass"),
            key: "billClass",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.curDictMap.dictListMap, "CDMedia", params.row.billClass);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.be.buyDt"),
            key: "buyDt",
            hiddenCol: false,
            render: (h, params) => {
              return h("span", params.row.buyDt ? this.$moment(params.row.buyDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          },
          {
            title: this.$t("m.i.be.buyRate"),
            key: "buyRatePct",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.be.totalBillMoney"),
            key: "totalBillMoney",
            hiddenCol: false,
            render: (h, params) => {
              return h("p", formatNumber(params.row.totalBillMoney, 2, ","));
            }
          },
          {
            title: this.$t("m.i.be.totalCountByUnit"),
            key: "totalCount",
            hiddenCol: false
          }
        ],
        pickBillSelectList: [],
        pickBillSelectRowInx: [],
        hasSelect: false,
        curDictMap: new Map(),
        showBillInfoWin: false,
        billId: "",
        billNo: "",
        billRangeStart:'',
        billRangeEnd:'',
      };
    },
    components: {},
    props: {
      batchId: Number,
      billType: String,
      billClass: String,
      busiType: String,
      isLock: String,
      settleDt: [String, Number],
      dictMap: {
        type: Object
      },
      pickBillWin: {
        type: Boolean,
        default() {
          return false;
        }
      }
    },
    computed: {
      tempPickBillWin: {
        get() {
          return this.pickBillWin;
        },
        set() {

        }
      }
    },
    watch: {
      pickBillWin(val) {
        if (val) {
          this.$nextTick(() => {
            this.pickBillInit();
            if (this.batchId) {
              this.hasSelect = false;
              this.pickBillForm.settleDt = this.settleDt ? this.settleDt.replace(/-/g, "") : "";
              this.$refs.pickBillDatagrid.dataChange(1);
              this.pickBillSelectList = [];
            }
          });
        }
      }
    },
    methods: {
      billInfoWinClose() {
        this.billId = null;
        this.billNo = null;
        this.billRangeStart = null;
        this.billRangeEnd = null;
        this.showBillInfoWin = false;
      },
      billInfoWinOpen(billId, billNo,billRangeStart,billRangeEnd) {
        this.billId = billId;
        this.billNo = billNo;
        this.billRangeStart=billRangeStart;
        this.billRangeEnd=billRangeEnd;
        this.showBillInfoWin = true;
      },
      pickBillClose(data) {
        this.pickBillFlag = true;
        this.hasSelect = true;
        this.pickUrl = this.pickBillUrl;
        this.pickColumns = this.pickBillColumns;
        this.pickBillSelectList = [];
        this.$refs.pickBillForm.resetFields();
        this.$emit("pickBillWinClose", data);
      },
      pickBillInit() {
        this.pickBillForm.billType = this.billType;
        this.pickBillForm.billClass = this.billClass;
        this.pickBillForm.busiType = this.busiType;
        this.pickBillForm.batchId = this.batchId;
        this.pickBillForm.isLock = this.isLock;
        this.pickColumns = this.pickBillColumns;
        this.curDictMap = this.dictMap;

        let showFlag="";
        this.list=[];
        console.log(this.busiType)
        this.list=this.dictMap['assetIndustryList'].slice(0);
        this.list=this.list.filter(item => item.key != "0");
        getUploadImgType("bm.valuate.is_holdbill_allowsale").then(res => {
          let value = res.value
          if(value=='0'){//否
            showFlag="0";
          }else if(value=="1"){//是
            showFlag="1";
          }
          if((this.busiType=="BT01" || this.busiType=="RBT01") && showFlag=="0"){
            this.list = this.list.filter(item => item.key != "1");
          }
        })
      },
      // 行选中
      pickBillSelectClick(arr, selectInx) {
        this.pickBillSelectList = arr;
        this.pickBillSelectRowInx = selectInx;
      },
      //切换为批次挑票
      selectBatchBill() {
        this.paramId = "batchNo";
        this.pickBillFlag = false;
        this.hasSelect = true;
        this.pickBillSelectList = [];
        this.$refs.pickBillForm.resetFields();
        this.pickUrl = this.pickBillBatchUrl;
        this.pickColumns = this.pickBillBatchColumns;
        this.$nextTick(() => {
          this.$refs.pickBillDatagrid.dataChange(1);
        });
      },
      //切换为明细挑票
      selectInfoBill() {
        this.paramId = "id";
        this.pickBillFlag = true;
        this.hasSelect = true;
        this.pickBillSelectList = [];
        this.$refs.pickBillForm.resetFields();
        this.pickUrl = this.pickBillUrl;
        this.pickColumns = this.pickBillColumns;
        this.$nextTick(() => {
          this.hasSelect = false;
          this.$refs.pickBillDatagrid.dataChange(1);
        });
      },
      //挑票页面查询
      handlePickBillSearch() {
        this.$refs.pickBillDatagrid.dataChange(1);
        this.pickBillSelectList = [];
      },
      handleDueDateChange(arr){
        if (arr && arr.length >= 2) {
          this.pickBillForm.minDueDt = arr[0].replace(/-/g, "");
          this.pickBillForm.maxDueDt = arr[1].replace(/-/g, "");
          this.dueDate = [arr[0],arr[1]];
        } else {
          this.pickBillForm.minDueDt = "";
          this.pickBillForm.maxDueDt = "";
          this.dueDate = [];
        }
      },
      handleBuyDateChange(arr){
        if (arr && arr.length >= 2) {
          this.pickBillForm.minBuyDt = arr[0].replace(/-/g, "");
          this.pickBillForm.maxBuyDt = arr[1].replace(/-/g, "");
          this.buyDate = [arr[0],arr[1]];
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
        this.$refs.pickBillForm.resetFields();
      },
      //挑票新增方法
      pickBillStock() {
        this.submitFlag = true;
        let pickBillFlag = this.pickBillFlag;
        let list = this.$refs.pickBillDatagrid.selects;
        if (list.length === 0) {
          if (pickBillFlag) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
            this.submitFlag = false;
            return;
          }else {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
            this.submitFlag = false;
            return;
          }
        }
        if (pickBillFlag) {
          //按明细挑票
          let ids = [];
          for (let i = 0; i < list.length; i++) {
            ids.push(list[i].id);
          }
          let batchId = this.batchId;
          let url = "/be/market/preaudit/preAuditMain/func_pickBillStock";
          post({ batchId: batchId, ids: ids, isLock: this.isLock }, url).then(res => {
            if (res) {
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.$msgTip.success(this);
                this.pickBillSelectList = [];
                this.pickBillClose(res.data.retData);
                this.submitFlag = false;
              } else {
                this.submitFlag = false;
                this.$msgTip.error(this, { info: res.data.retMsg });
              }
            } else {
              this.submitFlag = false;
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            }
          });
        } else {
          // 按批次挑票
          if (list.length > 1) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
            this.submitFlag = false;
            return;
          }
          let batchNo = list[0].batchNo;
          let buyDt = list[0].buyDt;
          let transFromName = list[0].oppName;
          let prodNo = list[0].prodNo;
          let billClass = list[0].billClass;
          let billType = list[0].billType;
          let buyRatePct = list[0].buyRatePct;
          let batchId = this.batchId;
          let data = {
            batchId: batchId, batchNo: batchNo, buyDt: buyDt, transFromName: transFromName,
            prodNo: prodNo, billClass: billClass, billType: billType, buyRatePct: buyRatePct, isLock: this.isLock
          };
          let url = "/be/market/preaudit/preAuditMain/func_batchPickBillStock";
          post(data, url).then(res => {
            if (res) {
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.$msgTip.success(this);
                this.pickBillSelectList = [];
                this.pickBillClose(res.data.retData);
                this.submitFlag = false;
              } else {
                this.submitFlag = false;
                this.$msgTip.error(this, { info: res.data.retMsg });
              }
            } else {
              this.submitFlag = false;
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            }
          });
        }
      }
    },
    mounted() {
      this.openI9flag=window.sessionStorage.getItem('isOpenI9')=='1'?true:false;
    }
  };
</script>

<style scoped>

</style>
