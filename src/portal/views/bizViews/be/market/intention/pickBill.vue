<template>
  <h-msg-box v-model="tempPickBillWin" width="1000" class="h-form-table-layer" :maximize="true" :mask-closable="false"
             @on-close="handleClose"
             :z-index="1002">
    <p slot="header">
      <span>挑票页面</span>
    </p>
    <div :class="{'h-form-overhd':!ifShowMore}">
      <h-form :model="pickBillForm" :label-width="90" ref="pickBillForm" cols="4" class="h-form-search">
        <h-form-item :label="$t('m.i.billInfo.billType')">
          <h-select v-model="pickBillForm.billType" placeholder="" readonly showTitle>
            <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{item.value }}</h-option>
          </h-select>
        </h-form-item>
        <h-form-item :label="$t('m.i.billInfo.billClass')">
          <h-select v-model="pickBillForm.billClass" placeholder="" readonly showTitle>
            <h-option v-for="item in billClassList" :value="item.key" :key="item.key">{{item.value }}</h-option>
          </h-select>
        </h-form-item>
        <h-form-item :label="$t('m.i.common.batchNo')" prop="batchNo">
          <h-input v-model="pickBillForm.batchNo" placeholder=""></h-input>
        </h-form-item>
        <h-form-item prop="billAtm" :label="$t('m.i.billInfo.billPackageMoney')" v-if="pickType === '0'" class="h-form-long-label">
          <h-row>
            <h-col span="11">
              <h-form-item prop="minBillMoney">
                <h-typefield v-model="pickBillForm.minBillMoney" integerNum="12" suffixNum="2" placeholder=""
                             bigTips></h-typefield>
              </h-form-item>
            </h-col>
            <h-col span="2" style="text-align: center">-</h-col>
            <h-col span="11">
              <h-form-item prop="maxBillMoney">
                <h-typefield v-model="pickBillForm.maxBillMoney" integerNum="12" suffixNum="2" placeholder=""
                             bigTips></h-typefield>
              </h-form-item>
            </h-col>
          </h-row>
        </h-form-item>
        <h-form-item :label="$t('m.i.billInfo.acptName')" prop="acptName" v-if="pickType === '0'">
          <h-input v-model="pickBillForm.acptName" placeholder=""></h-input>
        </h-form-item>
        <h-form-item prop="dueDate" :label="$t('m.i.billInfo.dueDt')" v-if="pickType === '0'">
          <h-date-picker :value="dueDate" format="yyyy-MM-dd" type="daterange" autoPlacement placeholder="" showFormat
                         :editable=false @on-change="handleDueDateChange"></h-date-picker>
        </h-form-item>
        <h-form-item prop="buyDate" :label="$t('m.i.be.buyDt')">
          <h-date-picker :value="buyDate" format="yyyy-MM-dd" type="daterange" autoPlacement placeholder="" showFormat
                         :editable=false @on-change="handleBuyDateChange"></h-date-picker>
        </h-form-item>
        <h-form-item prop="buyRatePct" :label="$t('m.i.be.buyRate')">
          <h-row>
            <h-col span="11">
              <h-form-item prop="minBuyRatePct">
                <h-typefield v-model="pickBillForm.minBuyRatePct" integerNum="2" suffixNum="4" type="money"
                             placeholder="最多2位整数,4位小数"></h-typefield>
              </h-form-item>
            </h-col>
            <h-col span="2" style="text-align: center">-</h-col>
            <h-col span="11">
              <h-form-item prop="maxBuyRatePct">
                <h-typefield v-model="pickBillForm.maxBuyRatePct" integerNum="2" suffixNum="4" type="money"
                             placeholder="最多2位整数,4位小数"></h-typefield>
              </h-form-item>
            </h-col>
          </h-row>
        </h-form-item>
        <h-form-item :label="$t('m.i.billInfo.billPackageNo')" prop="billNo" v-if="pickType === '0'">
          <h-input v-model="pickBillForm.billNo" placeholder=""></h-input>
        </h-form-item>
        <!--票据来源-->
        <common-select v-model="pickBillForm.billOrigin" :label="$t('m.i.billInfo.billOrigin')" prop="billOrigin" :dictList="billOriginList"
                       v-if="pickType === '0' && pickBillForm.billClass === 'ME02'"></common-select>
        <h-form-item :label="$t('m.i.common.custName')" prop="transFromName" v-if="pickType === '0'">
          <h-input v-model="pickBillForm.transFromName" placeholder=""></h-input>
        </h-form-item>
        <h-form-item :label="$t('m.i.billInfo.acptTopBankLevel')" prop="acptTopBankLevels" v-if="pickType === '0'">
          <h-select v-model="pickBillForm.acptTopBankLevels" placeholder="" showTitle>
            <h-option v-for="item in bankLevelList" :value="item.key" :key="item.key">{{item.value }}
            </h-option>
          </h-select>
        </h-form-item>
        <h-form-item :label="$t('m.i.billInfo.distClass')" prop="discTopBankLevels" v-if="pickType === '0'">
          <h-select v-model="pickBillForm.discTopBankLevels" placeholder="" showTitle>
            <h-option v-for="item in bankLevelList" :value="item.key" :key="item.key">{{item.value }}
            </h-option>
          </h-select>
        </h-form-item>
        <h-form-item :label="$t('m.i.be.residualTerm')" prop="billTerm" v-if="pickType === '0'">
          <h-select v-model="pickBillForm.billTerm" placeholder="" showTitle>
            <h-option v-for="item in tenorCodeList" :value="item.key" :key="item.key">{{item.value }}</h-option>
          </h-select>
        </h-form-item>
        <h-form-item :label="$t('m.i.billInfo.creditMainBankType')" prop="creditBranchClasses" v-if="pickType === '0'">
          <h-select v-model="pickBillForm.creditBranchClasses" placeholder="" showTitle>
            <h-option v-for="item in creditCustTypeList" :value="item.key" :key="item.key">{{item.value }}
            </h-option>
          </h-select>
        </h-form-item>
        <h-form-item :label="$t('m.i.billInfo.creditMainBankName')" class="h-form-long-label" prop="creditBranchName" v-if="pickType === '0'">
          <h-input v-model="pickBillForm.creditBranchName" placeholder=""></h-input>
        </h-form-item>
        <h-form-item :label="$t('m.i.billInfo.creditMainBrchCode')" class="h-form-long-label" prop="creditBrchCode" v-if="pickType === '0'">
          <h-input v-model="pickBillForm.creditBrchCode" @on-click="showBrchWin = true" icon="search" clearable
                   @on-clear="clearVal()"
                   readonly placeholder=""></h-input>
        </h-form-item>
       <!--资产分类下拉框  @Liangqs 20200806-->
        <h-form-item :label="$t('m.i.be.assetIndustry')"  prop="assetIndustry"  v-if="pickType === '0' && openI9flag" >
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
    </div>
    <h-datagrid :columns="pickBillColumns" :url="thisUrl" :auto-load="false" :bindForm="pickBillForm"
                :hasSelect="hasSelect"
                :param-id="paramId" rowSelect ref="pickBillDatagrid">
      <div slot="toolbar" class="pull-left">
        <h-button type="primary" @on-click="selectBatchBill()">{{$t("m.i.common.pickBatch")}}</h-button>
        <h-button type="primary" @on-click="selectInfoBill()">{{$t("m.i.common.pickBillDetail")}}</h-button>
      </div>
    </h-datagrid>
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
      <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
      <h-button type="primary" v-else @click="pickBillStock()">{{$t("m.i.common.commit")}}</h-button>
    </div>

    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="billId"
                    :billNo="billNo" :billRangeStart="billRangeStart" :billRangeEnd="billRangeEnd"></bill-info-main>
    <brch-code-search :brchCodeWin="showBrchWin" optType="2" @brchCodeWinClose="closeBranch"
                      @brchCodeChange="brchCodeChange"></brch-code-search>
  </h-msg-box>
</template>

<script>
  import { post, on, off, getDictListByGroups, getDictValueFromMap, formatNumber, getUploadImgType, formatBillRange} from "@/api/bizApi/commonUtil";

  export default {
    name: "pickBill",
    data() {
      let _this = this;
      return {
        list:[],
        billTypeList: [],
        billClassList: [],
        tenorCodeList: [],
        bankLevelList: [],
        billOriginList: [],
        assetIndustryList: [],
        submitFlag: false,
        openI9flag:false,
        hasSelect: false,
        ifShowMore: false,
        paramId: "id",
        dueDate: [],
        buyDate: [],
        dictMap: new Map(),
        pickBillForm: {
          assetIndustry: "",
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
          acptTopBankLevels: [],
          discTopBankLevels: [],
          billTerm: "",
          busiType: "",
          transClassList: [],
          creditBrchCode: "",
          creditBranchName: "",
          creditBranchClasses: "",
          batchId: null,
          billOrigin:""
        },
        pickBillObj: {
          creditCustTypeKeyList: [],
          busiType: "",
          billType: "",
          billClass: "",
          minResidualTerm: "",
          maxResidualTerm: ""
        },
        thisUrl: "",
        billUrl: "/be/market/intention/intentionMain/func_selectHldBill",
        batchUrl: "/be/market/intention/intentionMain/func_selectHldBillByBatch",
        pickBillColumns: [],
        pickType: "0",
        billId: "",
        billNo: "",
        billRangeStart:'',
        billRangeEnd:'',
        showBillInfoWin: false,
        billColumns: [
          {
            type: "selection",
            hiddenCol: false,
            width: 60,
          },
          {
            type: "index",
            title: this.$t("m.i.common.index"),
            width: 60,
          },
          {
            title: this.$t("m.i.common.batchNo"),
            key: "batchNo",
            hiddenCol: false,
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
            title: this.$t("m.i.billInfo.billPackageNo"),
            key: "billNo",
            hiddenCol: false,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params.row.billId, params.row.billNo,params.row.billRangeStart,params.row.billRangeEnd);
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
              let dictValue = getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
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
              let dictValue = getDictValueFromMap(this.dictMap, "CDMedia", params.row.billClass);
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
            sortable: true,
            render: (h, params) => {
              return h("span", formatNumber(params.row.billMoney, 2, ","));
            }
          },
          {
            title: this.$t("m.i.billInfo.dueDt"),
            key: "dueDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              if (null != params.row.dueDt && "" !== params.row.dueDt) {
                let dttm = this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
                return h("span", dttm);
              }
            }
          },
          {
            title: this.$t("m.i.be.buyDt"),
            key: "transDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (null != params.row.transDt && "" !== params.row.transDt) {
                let dttm = this.$moment(params.row.transDt, "YYYY-MM-DD").format("YYYY-MM-DD");
                return h("span", dttm);
              }
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
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.acptName"),
            key: "acptName",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.acptBankName"),
            key: "acptBankName",
            sortable: true,
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.acptGuarntrBankName"),
            key: "acptGuarntrBankName",
            sortable: true,
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.discBankName"),
            key: "discBankName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.billInfo.discGuarntrBankName"),
            key: "discGuarntrBankName",
            sortable: true,
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.guarntrTrustBankName"),
            key: "trustBankName",
            sortable: true,
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.creditMainBrchCode"),
            key: "creditMainBrchCode",
            hiddenCol: false

          },
          {
            title: this.$t("m.i.billInfo.creditMainBankName"),
            key: "creditMainBankName",
            hiddenCol: false

          },
          {
            title: this.$t("m.i.billInfo.creditMainBankType"),
            key: "creditMainBankType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "CreditMajor", params.row.creditMainBankType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.assetIndustry'),
            key: 'assetIndustry',
            hiddenCol:window.sessionStorage.getItem("isOpenI9")=="1"?false:true,
            render: (h, params) => {
              let dictValue =getDictValueFromMap(this.dictMap, 'AssetIndustry', params.row.assetIndustry);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
        ],
        batchColumns: [
          {
            type: "selection",
            hiddenCol: false,
            width: 60,
          },
          {
            type: "index",
            title: this.$t("m.i.common.index"),
            width: 60,
          },
          {
            title: this.$t("m.i.common.batchNo"),
            key: "batchNo",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.be.buyDt"),
            key: "buyDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              if (null != params.row.buyDt && "" !== params.row.buyDt) {
                let dttm = this.$moment(params.row.buyDt, "YYYY-MM-DD").format("YYYY-MM-DD");
                return h("span", dttm);
              }
            }
          },
          {
            title: this.$t("m.i.common.custName"),
            key: "oppName",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.common.prodNo"),
            key: "prodNo",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.common.prodName"),
            key: "prodName",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: "billClass",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.billInfo.billClass"),
            key: "billType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "CDMedia", params.row.billClass);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
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
              return h("span", formatNumber(params.row.totalBillMoney, 2, ","));
            }
          },
          {
            title: this.$t("m.i.common.totalNumBillPackage"),
            key: "totalCount",
            hiddenCol: false,
          }
        ],
        creditCustTypeList: [],
        residualTermOption: {
          disabledDate(date) {
            if (_this.needPickBillObj.minResidualTerm !== "" && _this.needPickBillObj.maxResidualTerm !== "") {
              let bigan = Number(_this.needPickBillObj.minResidualTerm.substr(2, 4));
              let end = Number(_this.needPickBillObj.maxResidualTerm.substr(2, 4));
              let workDate = window.sessionStorage.getItem("workDate");
              workDate = this.$moment(workDate, "YYYY-MM-DD");
              return date < workDate + (bigan * 1000 * 60 * 60 * 24) || date > workDate + (end * 1000 * 60 * 60 * 24);
            }

          }
        },
        showBrchWin: false
      };
    },
    components: {
      BrchCodeSearch: () => import(/* webpackChunkName: "sm/auth/branch/cpesBrchCodeSearch" */`@/views/bizViews/sm/auth/branch/cpesBrchCodeSearch`)
    },
    props: {
      batchId: "",
      pickBillWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      needPickBillObj: {
        type: Object,
        default() {
          return this.pickBillObj;
        }
      },
      isTotalColl: String
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
          this.pickBillForm.busiType = this.needPickBillObj.busiType;
          this.pickBillForm.billType = this.needPickBillObj.billType;
          this.pickBillForm.billClass = this.needPickBillObj.billClass;
          this.pickBillForm.batchId = this.batchId;
          this.pickBillColumns = this.billColumns;
          this.thisUrl = this.billUrl;
          this.pickType = "0";
          this.$nextTick(() => {
            this.hasSelect = false;
            this.$refs.pickBillDatagrid.dataChange(1);
          });

          let keyList = this.needPickBillObj.creditCustTypeKeyList;
          this.creditCustTypeList = [];
          for (let i = 0; i < keyList.length; i++) {
            let value = this.getDictValueFromMap(this.dictMap, "CreditMajor", keyList[i]);
            this.creditCustTypeList.push({ key: keyList[i], value: value });
          }
          this.pickBillForm.transClassList = this.needPickBillObj.creditCustTypeKeyList;
        }
        console.log(this.pickBillColumns);

        // 查询条件资产分类数据字典变更
        this.getDictListByGroups("AssetIndustry").then(res => {
          let assetIndustryList = res.get("AssetIndustry");
          assetIndustryList=assetIndustryList.filter(item => item.key != "0");
          this.list=[];
          let showFlag = "";
          getUploadImgType("bm.valuate.is_holdbill_allowsale").then(res => {
            let value = res.value
            if (value === '0') {//否
              showFlag = "0";
            } else if (value === "1") {//是
              showFlag = "1";
            }
            if ((this.needPickBillObj.busiType == "BT01" && showFlag == "0") && this.isTotalColl != "1") {
              this.list = assetIndustryList.filter(item => item.key != "1");
            } else {
              this.list = assetIndustryList;
            }
          })
        });
      }
    },
    methods: {
      clearVal() {
        this.pickBillForm.creditBrchCode = "";
      },
      closeBranch() {
        this.showBrchWin = false;
      },
      //根据弹框所选数据进行赋值
      brchCodeChange(info) {
        if (info === null) {
          this.$msgTip.info(this, { info: "请先选择记录！" });
          return;
        }
        this.pickBillForm.creditBrchCode = info.brchCode;
        this.showBrchWin = false;
      },
      handleClose() {
        this.hasSelect = true;
        this.pickBillColumns = this.billColumns;
        this.thisUrl = this.billUrl;
        this.ifShowMore = false;
        this.resetPickBillSearch();
        this.$emit("pickBillWinClose", "");
      },
      //挑票页面查询
      handlePickBillSearch() {
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
        this.pickBillForm.creditBranchName = '';
        this.pickBillForm.creditBrchCode = '';
        this.$refs.pickBillForm.resetFields();
      },
      //挑票新增方法
      pickBillStock() {
        let list = this.$refs.pickBillDatagrid.selects;
        if (list.length === 0) {
          if (this.pickType === "0") {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
            return;
          }else {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
            return;
          }
        }
        console.log("list",list);
        let flag=1;
        let billList=[];
        if(window.sessionStorage.getItem("isOpenI9")=="1"){
          for(let i=0;i<list.length;i++){
            if(list[i].assetIndustry=="1"){
              billList.push(list[i].billNo)
              flag=0;
            }
          }
        }
        console.log(flag)
        if(flag==0){
          console.log(flag)
          this.handleClose();
          this.$hMsgBox.confirm({
            title: "确认",
            content: "选中票据【"+billList.toString()+"】资产类型为持有-按摊余成本计量，请确定是否提交？",
            onOk: () => {
              this.addBill(list);
              console.log("121212")
            },
            onCancel: () =>{
              console.log(11111)
              return;
            }
          });
        }else{
          this.addBill(list);
        }


      },
      addBill(list){
        let data = {};
        let url = "/be/market/intention/intentionMain/func_addBill";
        if (this.pickType === "0") {
          //明细挑票
          let ids = [];
          for (let i = 0; i < list.length; i++) {
            ids.push(list[i].id);
          }
          data = { batchId: this.batchId, holdIds: ids };
        } else {
          if (list.length > 1) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
            return;
          }
          url = "/be/market/intention/intentionMain/func_addBillByBatch";
          data = {
            batchId: this.batchId,
            batchNo: list[0].batchNo,
            buyDt: list[0].buyDt,
            prodNo: list[0].prodNo,
            billClass: list[0].billClass,
            billType: list[0].billType
          };
        }

        post(data, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.pickBillDatagrid.dataChange(this.$refs.pickBillDatagrid.pageInfo.pageNo);
              this.handleClose();
              this.$emit("pickedBill", "");
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });

      },
      selectBatchBill() {
        this.pickType = "1";
        this.paramId = "batchNo";
        this.thisUrl = this.batchUrl;
        this.pickBillColumns = this.batchColumns;
        this.hasSelect = true;
        this.$nextTick(() => {
          this.$refs.pickBillDatagrid.dataChange(1);
        });
      },
      selectInfoBill() {
        this.paramId = "id";
        this.pickType = "0";
        this.thisUrl = this.billUrl;
        this.pickBillColumns = this.billColumns;
        this.hasSelect = true;
        this.$nextTick(() => {
          this.hasSelect = false;
          this.$refs.pickBillDatagrid.dataChange(1);
        });
      },
      showBillInfo(billId, billNo,billRangeStart,billRangeEnd) {
        this.billId = billId;
        this.billNo = billNo;
        this.billRangeStart=billRangeStart;
        this.billRangeEnd=billRangeEnd;
        this.showBillInfoWin = true;
      },
      billInfoWinClose() {
        this.billId = null;
        this.billNo = null;
        this.billRangeStart = null;
        this.billRangeEnd = null;
        this.showBillInfoWin = false;
      }
    },
    mounted() {
      this.openI9flag=window.sessionStorage.getItem('isOpenI9')=='1'?true:false;
      getDictListByGroups("TenorCode,CDMedia,AssetIndustry,DraftTypeCode,CreditMajor,bankLevel,BillOrigin").then(res => {
        this.billClassList = res.get("CDMedia");
        this.billTypeList = res.get("DraftTypeCode");
        this.tenorCodeList = res.get("TenorCode");
        this.bankLevelList = res.get("bankLevel");
        this.assetIndustryList = res.get("AssetIndustry");
        this.billOriginList = res.get("BillOrigin");
        this.dictMap = res.get("map");
      });
    }
  };

</script>

<style scoped>

</style>
