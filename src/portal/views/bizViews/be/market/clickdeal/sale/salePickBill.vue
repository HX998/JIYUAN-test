<!--点击成交-卖出申请-挑票-->
<template>
  <div>
    <h-msg-box v-model="tempPickBillWin" :mask-closable="false" @on-close="pickBillClose" :maximize="true" width="1000"
               class="h-form-table-layer" top="10" @on-maximize="onMaximize">
      <p slot="header">
        <span>{{title}}</span>
      </p>
      <div :class="{'h-form-overhd':!ifShowMore}">
        <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
          <bill-type v-model="formItem.billType" :dictList="pickBillParams.billTypeList" :readonly="true"></bill-type>
          <bill-class v-model="formItem.billClass" :dictList="pickBillParams.billClassList"
                      :readonly="true"></bill-class>
          <batch-no v-model="formItem.batchNo"></batch-no>
          <bill-money-range :label="$t('m.i.billInfo.billPackageMoney')" v-model="formItem" :rangeProps="['minBillMoney','maxBillMoney']" className="h-form-long-label"></bill-money-range>
          <due-dt-range v-model="dueDt" @on-change="handleDueDtChange"></due-dt-range>
          <acpt-name v-model="formItem.acptName"></acpt-name>
          <common-date-picker v-model="buyDt" :label="$t('m.i.be.buyDt')" type="daterange"
                              :autoPlacement="true" @on-change="handleBuyDtChange"></common-date-picker>
          <common-type-field-range v-model="formItem" :label="$t('m.i.be.buyRate')" :integerNum="2" :suffixNum="4"
                                   :rangeProps="['minBuyRatePct','maxBuyRatePct']"></common-type-field-range>
          <common-type-field-range v-model="formItem" :label="$t('m.i.be.initBuyRate')" :integerNum="2" :suffixNum="4"
                                   :rangeProps="['minOrgnlBuyRatePct','maxOrgnlBuyRatePct']"
                                   className="h-form-long-label"></common-type-field-range>
          <bill-no v-model="formItem.billNo" prop="billNo" :label="$t('m.i.billInfo.billPackageNo')"></bill-no>
          <h-form-item :label="$t('m.i.billInfo.billOrigin')" prop="billOrigin"
                       v-if="formItem&&formItem.billClass==='ME02'">
            <h-select v-model="formItem.billOrigin" placeholder="" showTitle>
              <h-option v-for="item in pickBillParams.billOriginList" :value="item.key" :key="item.key">{{item.value }}
              </h-option>
            </h-select>
          </h-form-item>
          <common-input v-model="formItem.transFromName" :label="$t('m.i.common.custName')"
                        prop="transFromName"></common-input>
          <common-input v-model="formItem.discBankName" :label="$t('m.i.billInfo.discBankName')" :readonly="true"
                        prop="discBankName" @on-click="showChooseBrchWin('discBankName')" :showIcon="true"
                        :clearVal="clearVal" clearValTag="discBankName"></common-input>
          <common-select v-model="formItem.acptTopBankLevel" :label="$t('m.i.billInfo.acptTopBankLevel')"
                         prop="acptTopBankLevel"
                         :dictList="pickBillParams.bankLevelList"></common-select>
          <common-select v-model="formItem.discTopBankLevel" :label="$t('m.i.billInfo.distClass')"
                         prop="discTopBankLevel"
                         :dictList="pickBillParams.bankLevelList"></common-select>
          <common-select v-model="formItem.billTerm" :label="$t('m.i.be.residualTerm')" prop="billTerm"
                         :dictList="pickBillParams.tenorCodeList"></common-select>
          <common-select v-model="formItem.acptBankType" :label="$t('m.i.billInfo.acptBankType')" prop="acptBankType"
                         :dictList="pickBillParams.creditMajorList"></common-select>
          <common-select v-model="formItem.discBankType" :label="$t('m.i.billInfo.discBankType')" prop="discBankType"
                         :dictList="pickBillParams.creditMajorList"></common-select>
          <common-input v-model="formItem.creditBranchClassName" :label="$t('m.i.billInfo.creditMainBankType')"
                        prop="creditBranchClassName" :readonly="true"></common-input>
          <common-input v-model="formItem.creditBranchClass" prop="creditBranchClass" v-show="false"></common-input>
          <common-input v-model="formItem.creditBranchName" :label="$t('m.i.billInfo.creditMainBankName')"
                        prop="creditBranchName" class="h-form-long-label"></common-input>
          <common-input v-model="formItem.creditBrchCode" :label="$t('m.i.billInfo.creditMainBrchCode')"
                        class="h-form-long-label" :readonly="true" clearValTag="creditBrchCode"
                        prop="creditBrchCode" @on-click="showChooseBrchWin('creditBrchCode')" :showIcon="true"
                        clearable @on-clear="clearVal"></common-input>
          <!--资产分类下拉框  @Liangqs 20200806-->
          <common-select v-model="formItem.assetIndustry" :label="$t('m.i.be.assetIndustry')" prop="assetIndustry"
                 v-if="openI9flag" :dictList="list"></common-select>

          <query-btn @showChange="showChange" :formSearch="handleSearch" :formSearchReset="resetSearch"></query-btn>
        </h-form>
        <h-datagrid
            :columns="pickColumns"
            :url="pickDataGridUrl"
            :auto-load="false"
            rowSelect
            :bindForm="formItem"
            :hasSelect="false"
            ref="pickBillDatagrid">
        </h-datagrid>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="pickBillClose()">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="pickBillSubmit()">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="billId"
                    :billNo="billNo" :billRangeStart="billRangeStart" :billRangeEnd="billRangeEnd"></bill-info-main>
    <brch-code-search :brchCodeWin="showBrchWin" optType="2" @brchCodeWinClose="closeBranch"
                      @brchCodeChange="brchCodeChange"></brch-code-search>
  </div>
</template>

<script>
  import { post, on, off, formatNumber, getDictValueFromMap,getUploadImgType } from "@/api/bizApi/commonUtil";
  import CommonInput from "../../../../../../components/bemp/input/commonInput";
  import CommonSelect from "../../../../../../components/bemp/select/commonSelect";

  export default {
    name: "salePickBill",
    data() {
      return {
        submitFlag: false,
        ifShowMore: false,
        buyDt: [],
        dueDt: [],
        list:[],
        openI9flag:false,
        formItem: {
          billType: "",
          billClass: "",
          assetIndustry:"",
          batchNo: "",
          minBillMoney: "",
          maxBillMoney: "",
          acptName: "",
          minDueDt: "",
          maxDueDt: "",
          minBuyDt: "",
          maxBuyDt: "",
          minBuyRate: "",
          maxBuyRate: "",
          billNo: "",
          acptBankName: "",
          discBankName: "",
          discBrchCode: "",
          transFromName: "",
          prodNo: "",
          creditBranchClassName: "",
          creditBranchClass: "",
          creditBranchName: "",
          creditBrchCode: "",
          minBuyRatePct: "",
          maxBuyRatePct: "",
          minOrgnlBuyRatePct: "",
          maxOrgnlBuyRatePct: "",
          acptTopBankLevel: "",
          discTopBankLevel: "",
          billTerm: "",
          acptBankType: "",
          discBankType: "",
          billOrigin:""
        },
        pickColumns: [
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
              let dictValue = (!params.row.billOrigin || params.row.billOrigin === 'CS00') ? '-' : this.getDictValueFromMap(this.pickBillParams.dictMap, 'BillOrigin', params.row.billOrigin);
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
            sortable: true,
            hiddenCol: false,
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
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.pickBillParams.dictMap, "DraftTypeCode", params.row.billType);
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
              let dictValue = this.getDictValueFromMap(this.pickBillParams.dictMap, "CDMedia", params.row.billClass);
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
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h("p", formatNumber(params.row.billMoney, 2, ","));
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
            sortable: true,
            render: (h, params) => {
              return h("span", params.row.transDt ? this.$moment(params.row.transDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          },
          {
            title: this.$t("m.i.be.buyRate"),
            key: "ratePct",
            hiddenCol: false,
            sortable: true,
            sortMethod: (a, b, type) => { //2019.09.18 组件排序出问题，自己写方法进行排序，若组件后修复，可删去
              if (type === "asc") {
                let a1 = parseFloat(a);
                let a2 = parseFloat(b);
                if (isNaN(a1)) return -1;
                if (isNaN(a2)) return 1;
                return a1 - a2;
              } else if (type === "desc") {
                let a1 = parseFloat(a);
                let a2 = parseFloat(b);
                if (isNaN(a1)) return 1;
                if (isNaN(a2)) return -1;
                return a2 - a1;
              }
            }
          },
          {
            title: this.$t("m.i.be.initBuyRate"),
            key: "orgnlBuyRatePct",
            hiddenCol: false,
            sortable: true,
            sortMethod: (a, b, type) => {
              if (type === "asc") {
                let a1 = parseFloat(a);
                let a2 = parseFloat(b);
                if (isNaN(a1)) return -1;
                if (isNaN(a2)) return 1;
                return a1 - a2;
              } else if (type === "desc") {
                let a1 = parseFloat(a);
                let a2 = parseFloat(b);
                if (isNaN(a1)) return 1;
                if (isNaN(a2)) return -1;
                return a2 - a1;
              }
            }
          },
          {
            title: this.$t("m.i.common.custName"),
            key: "oppName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.billInfo.acptName"),
            key: "acptName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.billInfo.acptBankName"),
            key: "acptBankName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.billInfo.cfmAppBankName"),
            key: "cfmAppBankName",
            sortable: true,
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
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.guarntrTrustBankName"),
            key: "trustBankName",
            sortable: true,
            hiddenCol: false
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
              let dictValue = this.getDictValueFromMap(this.pickBillParams.dictMap, "CreditMajor", params.row.creditMainBankType);
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
              let dictValue =getDictValueFromMap(this.pickBillParams.dictMap, 'AssetIndustry', params.row.assetIndustry);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
        ],
        showBillInfoWin: false,
        showBrchWin: false,
        billId: "",
        billNo: "",
        billRangeStart:'',
        billRangeEnd:'',
        chooseType: ""
      };
    },
    components: {
      CommonSelect,
      CommonInput,
      BrchCodeSearch: () => import(/* webpackChunkName: "sm/auth/branch/cpesBrchCodeSearch" */`@/views/bizViews/sm/auth/branch/cpesBrchCodeSearch`)
    },
    props: {
      title: {
        type: String,
        default: "挑票页面"
      },
      pickBillWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      pickDataGridUrl: {
        type: String,
        default: "/be/market/clickdeal/sale/saleApply/func_pagingQueryHldrBillInfo"
      },
      pickBillParams: {
        type: Object,
        default: {
          dictMap: new Map(),
          billTypeList: [],
          billClassList: [],
          prodNoList: [],
          bankLevelList: [],
          assetIndustryList: [],
          batchId: "",
          billType: "",
          billClass: "",
          creditBranchClassName: "",
          creditBranchClass: "",
          url: "",
          billOriginList: [],
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
            this.$refs.pickBillDatagrid.dataChange(1);
          });
        }
      }
    },
    methods: {
      onMaximize() {
        setTimeout(() => {
          this.$refs.pickBillDatagrid.$refs.gridContent.handleResize();
        }, 100);
      },
      showChange(val) {
        this.ifShowMore = val;
      },
      //表单查询
      handleSearch(pageNo) {
        this.$refs.pickBillDatagrid.selects = [];
        this.$refs.pickBillDatagrid.selectIds = [];
        this.$refs.pickBillDatagrid.dataChange(!!pageNo ? pageNo : 1);
      },
      //重置表单查询结果
      resetSearch() {
        this.buyDt = [];
        this.dueDt = [];
        this.formItem.minBuyDt = "";
        this.formItem.maxBuyDt = "";
        this.formItem.minDueDt = "";
        this.formItem.maxDueDt = "";
        this.formItem.discBrchCode = "";
        this.formItem.discBankName = "";
        this.$refs.formItem.resetFields();
        this.pickBillInit();
      },
      closeBranch() {
        this.showBrchWin = false;
      },
      brchCodeChange(info) {
        if (info === null) {
          this.$msgTip.info(this, { info: "请先选择记录！" });
          return;
        }
        if (this.chooseType === "discBankName") {
          this.formItem.discBrchCode = info.brchCode;
          this.formItem.discBankName = info.brchFullNameZh;
        }
        if (this.chooseType === "creditBrchCode") {
          this.formItem.creditBrchCode = info.brchCode;
        }
        this.showBrchWin = false;
      },
      showChooseBrchWin(value) {
        this.chooseType = value;
        this.showBrchWin = true;
      },
      clearVal(value) {
        if (value === "discBankName") {
          this.formItem.discBrchCode = "";
          this.formItem.discBankName = "";
        }
        if (value === "creditBrchCode") {
          this.formItem.creditBrchCode = "";
        }
      },
      pickBillInit() {
        this.formItem.billType = this.pickBillParams.billType;
        this.formItem.billClass = this.pickBillParams.billClass;
        this.formItem.batchId = this.pickBillParams.batchId;
        this.formItem.subBatchId = this.pickBillParams.subBatchId;
        this.formItem.creditBranchClass = this.pickBillParams.creditBranchClass;
        this.formItem.creditBranchClassName = this.pickBillParams.creditBranchClassName;


        this.list=[];
        let assetList=[];
        this.getDictListByGroups("AssetCatProduct,AssetIndustry").then(res => {
          assetList = res.get("AssetIndustry");
          this.list=assetList.slice(0);
          this.list=this.list.filter(item => item.key != "0");
          let showFlag="";
          getUploadImgType("bm.valuate.is_holdbill_allowsale").then(res => {
            let value = res.value
            if(value=='0'){//否
              showFlag="0";
            }else if(value=="1"){//是
              showFlag="1";
            }
            if(showFlag=="0"){
              this.list = this.list.filter(item => item.key != "1");
            }
          })
        })

      },
      pickBillClose() {
        this.$refs.pickBillDatagrid.selects = [];
        this.$refs.pickBillDatagrid.selectIds = [];
        this.formItem.discBrchCode = "";
        this.formItem.batchId = "";
        this.formItem.subBatchId = "";
        this.pickBillParams.batchId = "";
        this.formItem.discBrchCode = "";
        this.formItem.discBankName = "";
        this.$refs.formItem.resetFields();
        this.$emit("pickBillWinClose", "");
      },
      handleDueDtChange(arr) {
        if (arr && arr.length >= 2) {
          this.formItem.minDueDt = arr[0].replace(/-/g, "");
          this.formItem.maxDueDt = arr[1].replace(/-/g, "");
          this.dueDt = [arr[0], arr[1]];
        } else {
          this.formItem.minDueDt = "";
          this.formItem.maxDueDt = "";
          this.dueDt = [];
        }
      },
      handleBuyDtChange(arr) {
        if (arr && arr.length >= 2) {
          this.formItem.minBuyDt = arr[0].replace(/-/g, "");
          this.formItem.maxBuyDt = arr[1].replace(/-/g, "");
          this.buyDt = [arr[0], arr[1]];
        } else {
          this.formItem.minBuyDt = "";
          this.formItem.maxBuyDt = "";
          this.buyDt = [];
        }
      },
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
      pickBillSubmit() {
        let ids = this.$refs.pickBillDatagrid.selectIds;
        if (ids.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        let data = {
          batchId: this.pickBillParams.batchId,
          subBatchId: this.pickBillParams.subBatchId,
          holdIds: ids
        };
        post(data, this.pickBillParams.url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$msgTip.success(this);
              this.pickBillClose();
              this.submitFlag = false;
              this.$refs.pickBillDatagrid.selects = [];
              this.$refs.pickBillDatagrid.selectIds = [];
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
    },
    mounted() {
      this.openI9flag=window.sessionStorage.getItem('isOpenI9')=='1'?true:false;
    }
  };
</script>

<style scoped>

</style>
