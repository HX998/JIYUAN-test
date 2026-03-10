<!--匿名点击-卖出主批-挑票-->
<template>
  <div>
    <h-msg-box v-model="tempPickBillWin" :mask-closable="false" @on-close="pickBillClose" :maximize="true" width="1000"
               class="h-form-table-layer" top="10" @on-maximize="onMaximize">
      <p slot="header">
        <span>{{title}}</span>
      </p>
      <div :class="{'h-form-overhd':!ifShowMore}">
        <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
          <!--票据种类-->
          <bill-type v-model="formItem.billType" :dictList="pickBillParams.billTypeList" :readonly="true"></bill-type>
          <!--票据介质-->
          <bill-class v-model="formItem.billClass" :dictList="pickBillParams.billClassList" :readonly="true"></bill-class>
          <!--批次号-->
          <batch-no v-model="formItem.batchNo"></batch-no>
          <!--票号模糊-->
          <h-form-item  prop="billNo" :label="$t('m.i.billInfo.billPackageNo')" >
            <h-input v-model="formItem.billNo"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.billOrigin')" prop="billOrigin"
                       v-if="formItem.billClass==='ME02'">
            <h-select v-model="formItem.billOrigin" placeholder="" showTitle>
              <h-option v-for="item in pickBillParams.billOriginList" :value="item.key" :key="item.key">{{item.value }}
              </h-option>
            </h-select>
          </h-form-item>
          <!--票面金额-->
          <bill-money-range :label="$t('m.i.billInfo.billPackageMoney')" v-model="formItem" :rangeProps="['minBillMoney','maxBillMoney']" className="h-form-long-label"></bill-money-range>
          <!--票面到期日-->
          <due-dt-range v-model="dueDt" @on-change="handleDueDtChange"></due-dt-range>
          <!--承兑人名称-->
          <acpt-name v-model="formItem.acptName"></acpt-name>
          <!--买入日期-->
          <common-date-picker v-model="buyDt" :label="$t('m.i.be.buyDt')" type="daterange"
                              :autoPlacement="true" @on-change="handleBuyDtChange"></common-date-picker>
          <!--上手买入利率-->
          <common-type-field-range v-model="formItem" :label="$t('m.i.be.leftHandSeatBuyRate')" :integerNum="2" :suffixNum="4" class="h-form-long-label"
                                   :rangeProps="['minBuyRatePct','maxBuyRatePct']"></common-type-field-range>
          <!---初始买入利率-->
          <common-type-field-range v-model="formItem" :label="$t('m.i.be.initBuyRate')" :integerNum="2" :suffixNum="4"  class="h-form-long-label"
                                   :rangeProps="['minOrgnlBuyRatePct','maxOrgnlBuyRatePct']"></common-type-field-range>
          <!--客户名称-->
          <common-input v-model="formItem.transFromName" :label="$t('m.i.common.custName')" prop="transFromName"></common-input>
          <!--承兑行级别-->
          <common-select v-model="formItem.acptTopBankLevel" :label="$t('m.i.billInfo.acptTopBankLevel')" prop="acptTopBankLevel"
                         :dictList="pickBillParams.bankLevelList"></common-select>
          <!--贴现行级别-->
          <common-select v-model="formItem.discTopBankLevel" :label="$t('m.i.billInfo.distClass')" prop="discTopBankLevel"
                         :dictList="pickBillParams.bankLevelList"></common-select>
          <!--票据期限-->
          <common-select v-model="formItem.billTerm" :label="$t('m.i.be.residualTerm')" prop="billTerm"
                         :dictList="pickBillParams.tenorCodeList"></common-select>
          <!--承兑行类型-->
          <common-select v-model="formItem.acptBankType" :label="$t('m.i.billInfo.acptBankType')" prop="acptBankType"
                         :dictList="pickBillParams.creditMajorList"></common-select>
          <!--贴现行类型-->
          <common-select v-model="formItem.discBankType" :label="$t('m.i.billInfo.discBankType')" prop="discBankType"
                         :dictList="pickBillParams.creditMajorList"></common-select>
          <!--贴现行行名-->
          <h-form-item :label="$t('m.i.billInfo.discBankName')" prop="discBankName" >
            <h-input v-model="formItem.discBankName" @on-click="showChooseBrchWin('discBankName')" icon="search" clearable @on-clear="clearVal('discBankName')" readonly placeholder=""></h-input>
          </h-form-item>
          <!--信用主体类型-->
          <common-select v-model="formItem.creditBranchClass" :label="$t('m.i.billInfo.creditMainBankType')" prop="creditBranchClass"
                         :dictList="pickBillParams.creditMajorList" :readonly="true"></common-select>
          <!--信用主体行名称-->
          <common-input v-model="formItem.creditBranchName" :label="$t('m.i.billInfo.creditMainBankName')" prop="creditBranchName"  class="h-form-long-label"></common-input>
          <!--信用主体代码-->
          <h-form-item :label="$t('m.i.billInfo.creditMainBrchCode')" class="h-form-long-label" prop="creditBrchCode" >
            <h-input v-model="formItem.creditBrchCode" @on-click="showChooseBrchWin('creditBrchCode')" icon="search" clearable @on-clear="clearVal('creditMainBrchCode')" readonly placeholder=""></h-input>
          </h-form-item>
          <query-btn @showChange="showChange" :formSearch="handleSearch" :formSearchReset="resetSearch"></query-btn>
        </h-form>
        <h-datagrid
          :columns="pickColumns"
          url="/be/market/anonyclick/sale/saleApply/func_pagingQueryHldrBillInfo"
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
                    :billNo="billNo"  :billRangeStart="billRangeStart" :billRangeEnd="billRangeEnd"></bill-info-main>
    <brch-code-search :brchCodeWin="showBrchWin" optType="2" @brchCodeWinClose="closeBranch" @brchCodeChange="brchCodeChange"></brch-code-search>
  </div>
</template>

<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";

  export default {
    name: "salePickBill",
    components:{
      BrchCodeSearch:()=>import(/* webpackChunkName: "sm/auth/branch/cpesBrchCodeSearch" */`@/views/bizViews/sm/auth/branch/cpesBrchCodeSearch`)
    },
    data() {
      return {
        submitFlag: false,
        ifShowMore: false,
        buyDt: [],
        dueDt: [],
        formItem: {
          billType: "",
          billClass: "",
          batchNo: "",
          minBillMoney: "",
          maxBillMoney: "",
          minDueDt: "",
          maxDueDt: "",
          acptName: "",
          minBuyDt: "",
          maxBuyDt: "",
          minBuyRatePct: "",
          maxBuyRatePct: "",
          minOrgnlBuyRatePct:"",
          maxOrgnlBuyRatePct:"",
          billNo: "",
          transFromName: "",
          acptTopBankLevel:"",
          discTopBankLevel:"",
          billTerm:"",
          acptBankType:"",
          discBankType:"",
          discBankName: "",
          creditBranchClass:"",
          creditBranchName:"",
          creditBrchCode:"",
          billOrigin:"",
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
            hiddenCol: false
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
            title: this.$t("m.i.be.leftHandSeatBuyRate"),
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
            title: this.$t("m.i.billInfo.acptGuarntrBankNo"),
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
          }
        ],
        showBillInfoWin: false,
        billId: "",
        billNo: "",
        billRangeStart:'',
        billRangeEnd:'',
        chooseType:"",
        showBrchWin:false,
      };
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
      url:"",
      pickBillParams: {
        type: Object,
        default: {}
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
      clearVal(value){
        if(value==="creditBrchCode")
        {
          this.formItem.creditBrchCode = '';
        }
        else if (value=="discBankName"){
          this.formItem.discBrchCode='';
          this.formItem.discBankName='';
        }
      },
      closeBranch(){
        this.showBrchWin=false
      },
      showChooseBrchWin(value){
        this.chooseType=value;
        this.showBrchWin=true
      },
      //根据弹框所选数据进行赋值
      brchCodeChange(info) {
        if (info === null) {
          this.$msgTip.info(this, { info: "请先选择记录！" });
          return;
        }
        if (this.chooseType==='creditBrchCode') {
          this.formItem.creditBrchCode = info.brchCode;
        }
        else if (this.chooseType==='discBankName'){
          this.formItem.discBrchCode=info.brchCode;
          this.formItem.discBankName = info.brchFullNameZh;
        }
        this.showBrchWin = false;
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
      pickBillClose() {
        this.$refs.pickBillDatagrid.selects = [];
        this.$refs.pickBillDatagrid.selectIds = [];
        this.resetSearch();
        this.$emit("pickBillWinClose", "");
      },
      pickBillInit() {
        this.formItem.batchId = this.pickBillParams.batchId;
        this.formItem.billType = this.pickBillParams.billType;
        this.formItem.billClass = this.pickBillParams.billClass;
        this.formItem.creditBranchClass = this.pickBillParams.creditBranchClass;
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
        this.formItem.discBankName='';
        this.formItem.discBrchCode='';
        this.$refs.formItem.resetFields();
        this.formItem.batchId = this.pickBillParams.batchId;
        this.formItem.billType = this.pickBillParams.billType;
        this.formItem.billClass = this.pickBillParams.billClass;
        this.formItem.creditBranchClass = this.pickBillParams.creditBranchClass;
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
      pickBillSubmit() {
        let list = this.$refs.pickBillDatagrid.selects;
        if (list.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        let data = {
          batchId: this.pickBillParams.batchId,
          ids: this.$refs.pickBillDatagrid.selectIds
        };
        post(data, this.pickBillParams.url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$msgTip.success(this);
              this.pickBillClose();
              this.submitFlag = false;
            } else {
              this.submitFlag = false;
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
            this.$refs.pickBillDatagrid.selects = [];
            this.$refs.pickBillDatagrid.selectIds = [];
          } else {
            this.submitFlag = false;
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      }
    }
  };
</script>

<style scoped>

</style>
