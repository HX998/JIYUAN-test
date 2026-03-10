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
                <h-form-item :label="$t('m.i.billInfo.billNo')" prop="reverseBillNo" :validRules="billNoRule">
                  <h-input v-model="formItem.reverseBillNo" :maxlength="30"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billMoney')" prop="billMoney">
                  <h-typefield type="money" v-model="formItem.billMoney" :maxlength="20" placeholder="" bigTips divided></h-typefield>
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
            :has-select="false"
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
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId" :billNo="this.billNo"></bill-info-main>
  </div>
</template>

<script>
  import { post, on, off, formatNumber } from "@/api/bizApi/commonUtil";
  import ImpawnBatchDetail from "@/views/bizViews/ce/impawn/paper/paperImpawn/pImpawnTrackSearchBatchDetail";

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
         title: this.$t("m.i.billInfo.billNo"),
          key: "billNo",
          ellipsis: false,
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let info = "", type = "";
            if (!!params.row.billId) {
              info = params.row.billId;
              type = "billId";
            } else {
              info = params.row.billNo;
              type = "billNo";
            }
            return h("a", {
              on: {
                click: () => {
                  this.showBillInfo(info, type);
                }
              }
            }, params.row.billNo);
          }
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
          title: this.$t("m.i.billInfo.flowStatus"),
          key: "flowStatusName",
          ellipsis: false,
          hiddenCol: false,
          render: (h, params) => {
            if (params.row.impawnRgstStatus == null || params.row.impawnRgstStatus === "") {
              let flowStatusName = params.row.flowStatusName;
              return h("span", flowStatusName);
            } else {
              let impawnRgstStatus = this.getDictValueFromMap(this.impawnBillParams.dictMap, "ImpawnRgstStatus", params.row.impawnRgstStatus);
              return h("span", impawnRgstStatus + "(" + params.row.flowStatusName + ")");
            }
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
        title: this.$t("m.i.billInfo.billMoneyByUnit"),
          key: "billMoney",
          ellipsis: false,
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let billMoney = formatNumber(params.row.billMoney, 2, ",");
            return h("span", {
              domProps: {
                title: billMoney
              }
            }, billMoney);
          }
        },
        {
         title: this.$t("m.i.billInfo.drwrName"),
          key: "drwrName",
          sortable: true,
          ellipsis: false,
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
          reverseBillNo:"",
          billMoney: "",
          remitDt: "",
          dueDt: "",
          batchId: "",
          billClass: ""
        },
        billNoRule: [{ test: /^[0-9]{0,30}$/, trigger: "blur", message: "只能输入数字" }],
        impawnRgstStatus: {
          title: this.$t("m.i.billInfo.flowStatus"),
          key: "flowStatusName",
          ellipsis: false,
          hiddenCol: false,
          render: (h, params) => {
            if (params.row.impawnRgstStatus == null || params.row.impawnRgstStatus === "") {
              let flowStatusName = params.row.flowStatusName;
              return h("span", flowStatusName);
            } else {
              let impawnRgstStatus = this.getDictValueFromMap(this.impawnBillParams.dictMap, "ImpawnRgstStatus", params.row.impawnRgstStatus);
              return h("span", impawnRgstStatus + "(" + params.row.flowStatusName + ")");
            }
          }
        },
        columns: columns,
        cloneColumns: this.deepClone(columns),
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
          this.dataUrl =  "/ce/impawn/paper/paperImpawn/pImpawnTrackSearch/func_pageQueryImpawnBillList";
          this.$nextTick(() => {
            if (this.impawnBillParams.accountType === "impawn") {
              this.cloneColumns.splice(4,1,this.impawnRgstStatus);
              this.columns = this.deepClone(this.cloneColumns);
            } else {
              this.cloneColumns.splice(4,1,this.unimpawnRgstStatus);
              this.columns = this.deepClone(this.cloneColumns);
            }
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
        this.$refs.datagrid.selects = [];
        this.formItem.remitDt = this.formItem.remitDt.replace(/-/g, "");
        this.formItem.dueDt = this.formItem.dueDt.replace(/-/g, "");
        // this.formItem.billMoney = this.formItem.billMoney.toString().replace(/,/g, "");
        this.$refs.datagrid.dataChange(1);
      },
      //重置表单查询结果
      resetSearch() {
        this.formItem.billNo = "";
        this.formItem.reverseBillNo = "";
        this.formItem.billMoney = "";
        this.formItem.remitDt = "";
        this.formItem.dueDt = "";
      },
      //返回主页面
      returnMain() {
        this.resetSearch();
        this.$emit("returnTrackSearchMain", "");
      },
      billInfoWinClose(){
        this.showBillInfoWin = false;
      },
      showBillInfo(info, type) {
        this.billId = "";
        this.billNo = "";
        if (type === "billId") {
          this.billId = info;
        } else {
          this.billNo = info;
        }
        this.showBillInfoWin = true;
      }
    }
  };
</script>

<style scoped>

</style>
