<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <!--票据来源-->
                <common-select v-model="formItem.billOrigin" :label="$t('m.i.billInfo.billOrigin')" prop="billOrigin"
                               :dictList="billOriginList"></common-select>
                <h-form-item :label="$t('m.i.billInfo.billPackageNo')" prop="reverseBillNo" :validRules="billNoRule">
                  <h-input v-model="formItem.reverseBillNo" placeholder="" :maxlength="30"></h-input>
                </h-form-item>
                <!--子票区间-->
                <bill-range :formItem="formItem" :rangeProps="['minBillRangeStart','maxBillRangeEnd']"></bill-range>
                <h-form-item :label="$t('m.i.billInfo.billPackageMoney')" prop="billMoney" class="h-form-long-label">
                  <h-row>
                    <h-col span="11">
                      <h-form-item prop="minBillMoney" style="width:100%">
                        <h-typefield v-model="formItem.minBillMoney" integerNum="12" suffixNum="2" placeholder="" type="money"></h-typefield>
                      </h-form-item>
                    </h-col>
                    <h-col span="2" style="text-align: center">-</h-col>
                    <h-col span="11">
                      <h-form-item prop="maxBillMoney" style="width:100%">
                        <h-typefield v-model="formItem.maxBillMoney" integerNum="12" suffixNum="2" placeholder="" type="money"></h-typefield>
                      </h-form-item>
                    </h-col>
                  </h-row>
                </h-form-item>
                <h-form-item :label="$t('m.i.be.contingentRecourseDate')" prop="contingentRecourseDate">
                  <h-date-picker :value="contingentRecourseDate" format="yyyy-MM-dd" type="daterange"
                                 showFormat :editable=false placeholder="" @on-change="handleContingentRecourseDateChange"></h-date-picker>
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
            url="/pb/recourse/recourseAcceptBill/func_queryPendingContingentRecourseBill"
            :bindForm="formItem"
            :notSetWidth="true"
            :row-select="true"
            :has-select="false"
            :auto-load="true"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId" :billNo="this.billNo" :billRangeStart="this.billRangeStart" :billRangeEnd="this.billRangeEnd"></bill-info-main>
  </div>
</template>

<script>
  import { post, on, off ,formatNumber,formatBillRange} from "@/api/bizApi/commonUtil";

  export default {
    name: "recourseAcceptBill",
    components: {
    },
    data() {
      return {
        billNoRule : [{ test: /^[0-9]{0,30}$/, trigger: "blur", message: "只能输入数字" }],
        columns: [
          {
            type: "selection",
            width: 50,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: this.$t("m.i.billInfo.billOrigin"),
            key: "billOrigin",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "BillOrigin", params.row.billOrigin);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.billInfo.billPackageNo'),
            key: "billNo",
            hiddenCol: false,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params.row);
                  }
                }
              }, params.row.billNo);
            }
          },
          {
            title: this.$t("m.i.billInfo.billRange"),
            align: 'center',
            key: "billRange",
            hiddenCol: false,
            render: (h, params) => {
              let billOrigin = params.row.billOrigin;
              let billRangeStart = params.row.billRangeStart;
              let billRangeEnd = params.row.billRangeEnd;
              return h("span", formatBillRange(billOrigin, billRangeStart, billRangeEnd))
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
            title: this.$t('m.i.be.contingentRecourseDate'),
            key: "contingentRecourseDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let contingentRecourseDt = params.row.contingentRecourseDt == null ? "" :this.$moment(params.row.contingentRecourseDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", contingentRecourseDt);
            }
          },
          {
            title: this.$t('m.i.be.recoveryType'),
            key: "recourseType",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "RcrsTypeCode", params.row.recourseType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.be.hldrBrchName'),
            key: "hldrBrchName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.prsttnApplDt'),
            key: "prsttnApplDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let prsttnApplDt = params.row.prsttnApplDt == null ? "" :this.$moment(params.row.prsttnApplDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", prsttnApplDt);
            }
          },
          {
            title: this.$t('m.i.be.prsttnBrchName'),
            key: "pyeeBankName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.prsttnSignCode'),
            key: "prsttnSignCode",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "SignUpMarkCode", params.row.prsttnSignCode);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.be.prsttnRefuseReasonCode'),
            key: "prsttnRefuseReasonCode",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "DishonorCode", params.row.prsttnRefuseReasonCode);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.be.prsttnSettleResult'),
            key: "prsttnSettleResult",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "StlResult", params.row.prsttnSettleResult);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.be.prsttnApplRemark'),
            key: "prsttnApplRemark",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.prsttnAnswerRemark'),
            key: "prsttnAnswerRemark",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.cashStatus'),
            key: "cashStatus",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "CashStatus", params.row.cashStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.pe.clearStatus'),
            key: "settleStatus",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "MmbStlStatus", params.row.settleStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.be.currentPayBrchName'),
            key: "currentPayBrchName",
            hiddenCol: false
          }
        ],
        contingentRecourseDate:[],
        formItem: {
          reverseBillNo: "",
          cashStatus: "",
          prstBranchName: "",
          hldrBranchName: "",
          settleStatus: "",
          minBillMoney: "",
          maxBillMoney: "",
          prsttnBrchCode: "",
          contingentRecourseDate: "",
          minContingentRecourseDate: "",
          maxContingentRecourseDate: "",
          hldrBrchCode: "",
          hldrBrchName: "",
          billOrigin:"",
          minBillRangeStart:"",
          maxBillRangeEnd:"",
        },
        showBillInfoWin: false,
        billNo: "",
        billId: "",
        billRangeStart: "",
        billRangeEnd: "",
        cashStatusList: [],
        billOriginList:[],
        settleStatusList: [],
        dictMap: new Map(),
        ifShowMore: false
      };
    },
    methods: {
      showBillInfo(billInfo) {
        this.billId = billInfo.billId;
        this.billNo = billInfo.billNo;
        this.billRangeStart = billInfo.billRangeStart;
        this.billRangeEnd = billInfo.billRangeEnd;
        this.showBillInfoWin = true;
      },
      billInfoWinClose() {
        this.showBillInfoWin = false;
      },
      formSearch() {
        this.$refs.datagrid.dataChange(1);
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.selects = [];
      },
      handleContingentRecourseDateChange(arr){
        if (arr && arr.length >= 2) {
          this.formItem.minContingentRecourseDate = arr[0].replace(/-/g, "");
          this.formItem.maxContingentRecourseDate = arr[1].replace(/-/g, "");
          this.contingentRecourseDate = [arr[0],arr[1]];
        } else {
          this.formItem.minContingentRecourseDate = "";
          this.formItem.maxContingentRecourseDate = "";
          this.contingentRecourseDate = [];
        }
      },
      formSearchReset() {
        this.contingentRecourseDate = [];
        this.formItem.minBillMoney = "";
        this.formItem.maxBillMoney = "";
        this.formItem.hldrBrchCode = "";
        this.formItem.hldrBrchName = "";
        this.formItem.prsttnBrchCode = "";
        this.formItem.prstBranchName = "";
        this.$refs.formItem.resetFields();
        this.formItem.minBillRangeStart = "";
        this.formItem.maxBillRangeEnd = "";
        this.formItem.minBillMoney = "";
        this.formItem.maxBillMoney = "";
      },
      clearVal(type) {
        if (type == "prstBranchName") {
          this.formItem.prsttnBrchCode = "";
          this.formItem.prstBranchName = "";
        }
        if (type == "hldrBrchName") {
          this.formItem.hldrBrchCode = "";
          this.formItem.hldrBrchName = "";
        }
      },
      getParams(){
        if (this.$route.path === "/be/trust/recourse/recourseAcceptBill") {
          if (this.$route.query.contingentRecourseDate) {
            let contingentRecourseDate = this.$moment(this.$route.query.contingentRecourseDate, "YYYY-MM-DD").format("YYYY-MM-DD");
            this.contingentRecourseDate = [contingentRecourseDate, contingentRecourseDate];
            this.$nextTick(() => {
              this.formSearch();
            });
          }
        }
      }
    },
    created(){

    },
    watch: {
      "$route": "getParams"
    },
    mounted() {
      this.getDictListByGroups("RiskStatus,CashStatus,MmbStlStatus,BarterTrustStatus,DishonorCode,SignUpMarkCode,RecourseType,SendRecourseType,StlResult,BillOrigin,RcrsTypeCode").then(res => {
        this.cashStatusList = res.get("CashStatus");
        this.settleStatusList = res.get("MmbStlStatus");
        this.billOriginList = res.get("BillOrigin");
        this.dictMap = res.get("map");
      });
      this.getParams();
    }
  };
</script>

<style scoped>

</style>
