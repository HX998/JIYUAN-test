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
          <bill-money-range :label="$t('m.i.billInfo.billPackageMoney')" v-model="formItem" :rangeProps="['minBillMoney','maxBillMoney']" className="h-form-long-label"></bill-money-range>
          <due-dt-range v-model="dueDt" @on-change="handleDueDtChange"></due-dt-range>
          <acpt-name v-model="formItem.acptName"></acpt-name>
          <bill-no :label="$t('m.i.billInfo.billPackageNo')" v-model="formItem.billNoLike" prop="billNoLike"></bill-no>
          <common-input v-model="formItem.acptBankName" :label="$t('m.i.billInfo.acptBankName')" :readonly="true"
                        prop="acptBankName" @on-click="showChooseBrchWin('acptBankName')" :showIcon="true"
                        :clearVal="clearVal" clearValTag="acptBankName" class="h-form-long-label"></common-input>
          <common-input v-model="formItem.discBankName" :label="$t('m.i.billInfo.discBankName')" :readonly="true"
                        prop="discBankName" @on-click="showChooseBrchWin('discBankName')" :showIcon="true"
                        :clearVal="clearVal" clearValTag="discBankName"></common-input>
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
    <brch-code-search :brchCodeWin="showBrchWin" optType="2" @brchCodeWinClose="closeBranch"
                      @brchCodeChange="brchCodeChange"></brch-code-search>
  </div>
</template>

<script>
  import { post, on, off, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "rebuyPickBill",
    data() {
      return {
        submitFlag: false,
        ifShowMore: false,
        buyDt: [],
        dueDt: [],
        formItem: {
          batchId: "",
          billType: "",
          billClass: "",
          minBillMoney: "",
          maxBillMoney: "",
          acptName: "",
          minDueDt: "",
          maxDueDt: "",
          billNoLike: "",
          acptBankName: "",
          acptBrchCode:"",
          discBankName: "",
          discBrchCode: "",
          acptBankType: "",
          discBankType: ""
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
          },
          {
            title: this.$t('m.i.billInfo.billRange'),
            key: 'billRange',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = !params.row.billRange  ? '-' :params.row.billRange;
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
              let dictValue = this.getDictValueFromMap(this.pickBillParams.dictMap, "DraftTypeCode", this.formItem.billType);
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
              let dictValue = this.getDictValueFromMap(this.pickBillParams.dictMap, "CDMedia", this.formItem.billClass);
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
            key: "creditMainBrchClass",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.pickBillParams.dictMap, "CreditMajor", params.row.creditMainBrchClass);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          }
        ],
        showBillInfoWin: false,
        showBrchWin: false,
        billId: "",
        billNo: "",
        billRangeStart: '',
        billRangeEnd: '',
        chooseType: ""
      };
    },
    components: {
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
        default: "/be/market/clickdeal/rebuy/rebuyReply/func_queryClickDealRebuyBill"
      },
      pickBillParams: {
        type: Object,
        default: {
          dictMap: new Map(),
          billTypeList: [],
          billClassList: [],
          bankLevelList: [],
          superBatchId: "",
          billType: "",
          billClass: "",
          url: "",
          subBatchId: "",
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
        this.formItem.batchId = "";
        this.$refs.formItem.resetFields();
        this.formItem.acptBankName="";
        this.formItem.acptBrchCode="";
        this.formItem.discBankName= "";
        this.formItem.discBrchCode="";
        this.pickBillInit();
      },
      closeBranch(){
        this.showBrchWin=false
      },
      brchCodeChange(info) {
        if (info === null) {
          this.$msgTip.info(this, { info: "请先选择记录！" });
          return;
        }
        if (this.chooseType==='discBankName'){
          this.formItem.discBrchCode=info.brchCode;
          this.formItem.discBankName = info.brchFullNameZh;
        }
        if (this.chooseType==='acptBankName'){
          this.formItem.acptBrchCode=info.brchCode;
          this.formItem.acptBankName = info.brchFullNameZh;
        }
        this.showBrchWin = false;
      },
      showChooseBrchWin(value) {
        this.chooseType = value;
        this.showBrchWin = true;
      },
      clearVal(value) {
        if (value == "discBankName") {
          this.formItem.discBrchCode = "";
          this.formItem.discBankName = "";
        }
        if (value == "acptBankName") {
          this.formItem.acptBrchCode = "";
          this.formItem.acptBankName = "";
        }
      },
      pickBillInit() {
        this.formItem.billType = this.pickBillParams.billType;
        this.formItem.billClass = this.pickBillParams.billClass;
        this.formItem.batchId = this.pickBillParams.superBatchId;
      },
      pickBillClose() {
        this.$refs.pickBillDatagrid.selects = [];
        this.$refs.pickBillDatagrid.selectIds = [];
        this.formItem.discBrchCode = "";
        this.formItem.acptBrchCode = "";
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
        this.billRangeStart = billRangeStart;
        this.billRangeEnd = billRangeEnd;
        this.showBillInfoWin = true;
      },
      pickBillSubmit() {
        let list = this.$refs.pickBillDatagrid.selects;
        if (list.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        let data = {
          subBatchId: this.pickBillParams.subBatchId,
          billIdList: this.$refs.pickBillDatagrid.selectIds
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
    }
  };
</script>

<style scoped>

</style>
