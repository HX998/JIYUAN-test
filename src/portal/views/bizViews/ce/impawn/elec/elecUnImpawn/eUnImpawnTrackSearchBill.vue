<!--质押/解质押跟踪查询明细-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper" v-if="tempBillManagerVue">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <!--票据来源：下拉框-->
                <h-form-item :label="$t('m.i.billInfo.billOrigin')" prop="billOrigin">
                  <h-select v-model="formItem.billOrigin" placeholder="">
                    <h-option v-for="item in impawnBillParams.billOriginList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <!--票据（包）号码：-->
                <h-form-item :label="$t('m.i.billInfo.billPackageNo')"  prop="reverseBillNo">
                  <h-input v-model="formItem.reverseBillNo"></h-input>
                </h-form-item>
                <!--子票区间：区间框-->
                <bill-range :form-item="formItem" :range-props="['minBillRangeStart','maxBillRangeEnd']"></bill-range>
                <h-form-item :label="$t('m.i.billInfo.billPackageMoney')" prop="billMoney" :label-width="100">
                  <h-typefield type="money" v-model="formItem.billMoney" placeholder="" @on-blur="formatBillMoney('blur')"
                               @on-focus="formatBillMoney('focus')" bigTips></h-typefield>
                </h-form-item>
                <h-form-item prop="remitDt" :label="$t('m.i.billInfo.remitDt')">
                  <h-date-picker type="date" v-model="formItem.remitDt" placeholder="" showFormat
                                 :editable=false></h-date-picker>
                </h-form-item>
                <h-form-item prop="dueDt" :label="$t('m.i.billInfo.dueDt')">
                  <h-date-picker type="date" v-model="formItem.dueDt" placeholder="" showFormat
                                 :editable=false></h-date-picker>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                                  :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <impawn-batch-detail :batchDetailParams="impawnBillParams" ref="impawnBatchDetail" v-if="batchInfoShowVue"></impawn-batch-detail>
          <!-- 数据展示表格 -->
          <h-datagrid
            :columns="columns"
            highlightRow
            :url="dataUrl"
            :bindForm="formItem"
            :onSelectChange="handleSelectClick"
            :rowSelect="true"
            :auto-load="false"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="ghost" @click="returnMain">返回</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId" :billNo="this.billNo" :billRangeEnd = "this.billRangeEnd" :billRangeStart = "this.billRangeStart"></bill-info-main>
  </div>
</template>

<script>
  import { post, on, off, formatNumber,formatBillRange } from "@/api/bizApi/commonUtil";
  import ImpawnBatchDetail from "@/views/bizViews/ce/impawn/elec/elecUnImpawn/eUnImpawnTrackSearchBatchDetail";

  export default {
    name: "impawnTrackSearch",
    components: {
      ImpawnBatchDetail
    },
    data() {
      let columns = [
        {
          type: "selection",
          key: "multiSelect",
          width: 60,
          hiddenCol: false
        },
        {
          type: "index",
          key: "numOrder",
          title: this.$t("m.i.common.index"),
          width: 60,
          align: "center",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.billOrigin"),   //票据来源
          key: "billOrigin",
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = (!params.row.billOrigin || params.row.billOrigin === 'CS00') ? '-' : this.getDictValueFromMap(this.impawnBillParams.dictMap, "BillOrigin", params.row.billOrigin);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t('m.i.billInfo.billPackageNo'), //票据（包）号码
          key: "billNo",
          ellipsis: false,
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let info = "", type = "";
            if (!!params.row.billId) {
              info = params;
              type = "billId";
            } else {
              info = params;
              type = "billNo";
            }
            return h("a", {
              on: {
                click: () => {
                  this.showBillInfo(params.row, type);
                }
              }
            }, params.row.billNo);
          }
        },
        {
          title: this.$t("m.i.billInfo.billRange"),   //子票区间
          key: "billRange",
          sortable: true,
          ellipsis: false,
          hiddenCol: false,
          render:(h,params) => {
            let billOrigin = params.row.billOrigin;
            let billRangeStart = params.row.billRangeStart;
            let billRangeEnd = params.row.billRangeEnd;
            return h("span", formatBillRange(billOrigin, billRangeStart, billRangeEnd))
          }
        },
        {
          title: this.$t('m.i.billInfo.billPackageMoney'),   //票据(包)金额
          key: "billMoney",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            return h('span', formatNumber(params.row.billMoney, 2, ','))
          }
        },
        {
          title: this.$t("m.i.billInfo.flowStatus"),
          key: "flowStatusName",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.billType"),
          key: "billType",
          ellipsis: false,
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = this.getDictValueFromMap(this.impawnBillParams.dictMap, "DraftTypeCode", params.row.billType);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
          }
        },
        {
          title: this.$t("m.i.billInfo.remitDt"),
          key: "remitDt",
          ellipsis: false,
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            if (params.row.remitDt == null || params.row.remitDt === "") {
              return "";
            }
            let date = this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
          title: this.$t("m.i.billInfo.dueDt"),
          key: "dueDt",
          ellipsis: false,
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            if (params.row.dueDt == null || params.row.dueDt === "") {
              return "";
            }
            let date = this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
         title: this.$t("m.i.billInfo.drwrName"),
          key: "drwrName",
          ellipsis: false,
          sortable: true,
          hiddenCol: false
        },
        {
         title: this.$t("m.i.billInfo.drwrAcctNo"),
          key: "drwrAcctNo",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.drwrBankNo"),
          key: "drwrBankNo",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.pyeeName"),
          key: "pyeeName",
          sortable: true,
          ellipsis: false,
          hiddenCol: false
        },
        {
         title: this.$t("m.i.billInfo.pyeeAcctNo"),
          key: "pyeeAcctNo",
          ellipsis: false,
          hiddenCol: false
        },
        {
           title: this.$t("m.i.billInfo.pyeeBankNo"),
          key: "pyeeBankNo",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.acptName"),
          key: "acptName",
          sortable: true,
          ellipsis: false,
          hiddenCol: false
        }
      ];
      return {
        dataUrl: "",
        formItem: {
          billNo: "",
          billMoney: "",
          remitDt: "",
          dueDt: "",
          batchId: "",
          billClass: "",
          reverseBillNo:"",
          billOrigin: "",
          minBillRangeStart: "",
          maxBillRangeEnd: "",
        },
        billNoRule: [{ test: /^[0-9]{0,30}$/, trigger: "blur", message: "只能输入数字" }],
        unimpawnRgstStatus: {
          title: this.$t("m.i.billInfo.flowStatus"),
          key: "flowStatusName",
          ellipsis: false,
          hiddenCol: false
        },
        columns: columns,
        cloneColumns: this.deepClone(columns),
        currentSelectList: [],
        //是否显示更多查询项
        ifShowMore: false,
        showBillInfoWin: false,
        billId: "",
        billNo: ""
      }
    },
    props: {
      billManagerVue: {
        type: Boolean,
        default() {
          return false;
        }
      },
      batchInfoShowVue: {
        type: Boolean,
        default() {
          return false;
        }
      },
      impawnBillParams: {
        type: Object,
        default: {
          dictMap: new Map(),
          batchId: "",
          billClass: "",
          accountType:"",    //区分质押和解质押
          billOriginList:"",
        }
      }
    },
    computed: {
      tempBillManagerVue: {
        get() {
          return this.billManagerVue;
        },
        set() {
        }
      }
    },
    mounted() {
    },
    watch: {
      billManagerVue(val) {
        if (val) {
          this.formItem.batchId = this.impawnBillParams.batchId;
          this.formItem.billClass = this.impawnBillParams.billClass;
          this.dataUrl =  "/ce/impawn/elec/elecUnImpawn/eUnImpawnTrackSearch/func_billlist";
          this.$nextTick(() => {
            this.cloneColumns.splice(6,1,this.unimpawnRgstStatus);
            this.columns = this.deepClone(this.cloneColumns);
            this.$refs.datagrid.createShowCol(this.cloneColumns);
            if(this.batchInfoShowVue){
              this.$refs.impawnBatchDetail.getImpawnBatchInfo(this.impawnBillParams.accountType);
            }
            this.handleSearch();
          });
        }
      }
    },
    methods: {
      //表单查询
      handleSearch() {
        this.currentSelectList = [];
        this.formItem.remitDt = this.formItem.remitDt.replace(/-/g, "");
        this.formItem.dueDt = this.formItem.dueDt.replace(/-/g, "");
        this.$refs.datagrid.dataChange(1);
      },
      //重置表单查询结果
      resetSearch() {
        this.formItem.billNo = "";
        this.formItem.billMoney = "";
        this.formItem.remitDt = "";
        this.formItem.dueDt = "";
        this.formItem.reverseBillNo = "";
        this.formItem.billOrigin = "";
        this.formItem.minBillRangeStart = "";
        this.formItem.maxBillRangeEnd = "";
      },
      handleSelectClick(arr, selectInx) {
        this.currentSelectList = arr;
        if (arr.length === 0) {
          return false;
        }
      },
      //返回主页面
      returnMain() {
        this.resetSearch();
        this.$emit("returnTrackSearchMain", "");
      },
      billInfoWinClose(){
        this.showBillInfoWin = false;
      },
      showBillInfo(row, type) {
        this.billId = "";
        this.billNo = "";
        this.billRangeStart = "";
        this.billRangeEnd = "";
        if (type === "billId") {
          this.billId = row.billId;
        } else {
          this.billNo = row.billNo;
        }
        this.billRangeStart=row.billRangeStart;
        this.billRangeEnd=row.billRangeEnd;
        this.showBillInfoWin = true;
      }
    }
  };
</script>

<style scoped>

</style>
