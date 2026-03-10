<template>
  <!--电票质押挑票弹出框-->
  <h-msg-box v-model="tempImpawnPickBillWin" width="1000" :mask-closable="false" @on-close="handleClose"
             class="h-form-table-layer" :maximize="true" @on-maximize="onMaximize">
    <p slot="header">
      <span>{{title}}</span>
    </p>
    <!--查询表单-->
    <div>
      <div :class="{'h-form-overhd':!ifShowMore}">
        <h-form :model="impawnPickBillForm" :label-width="100" ref="impawnPickBillForm" cols="4"
                class="h-form-search">
          <!--票据来源：下拉框-->
          <h-form-item :label="$t('m.i.billInfo.billOrigin')" prop="billOrigin">
            <h-select v-model="impawnPickBillForm.billOrigin" placeholder="">
              <h-option v-for="item in impawnPickBillParams.billOriginList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.billPackageNo')" prop="reverseBillNo">
            <h-input v-model="impawnPickBillForm.reverseBillNo" :maxLength="30"></h-input>
          </h-form-item>
          <!--子票区间-->
          <bill-range :form-item="impawnPickBillForm" :range-props="['minBillRangeStart','maxBillRangeEnd']"></bill-range>
<!--          <h-form-item :label="$t('m.i.billInfo.billRange')" prop="billRange">-->
<!--            <h-row>-->
<!--              <h-col span="11">-->
<!--                <h-typefield v-model="impawnPickBillForm.minBillRangeStart" placeholder=""></h-typefield>-->
<!--              </h-col>-->
<!--              <h-col span="2" style="text-align: center">至</h-col>-->
<!--              <h-col span="11">-->
<!--                <h-typefield v-model="impawnPickBillForm.maxBillRangeEnd" placeholder=""></h-typefield>-->
<!--              </h-col>-->
<!--            </h-row>-->
<!--          </h-form-item>-->
          <h-form-item prop="acptName" :label="$t('m.i.billInfo.acptName')">
            <h-input v-model="impawnPickBillForm.acptName" :maxlength=60></h-input>
          </h-form-item>
          <h-form-item prop="minDueDt" :label="$t('m.i.billInfo.minDueDt')">
            <h-date-picker type="date" v-model="impawnPickBillForm.minDueDt" placeholder="" showFormat
                           :editable=false></h-date-picker>
          </h-form-item>
          <h-form-item prop="maxDueDt" :label="$t('m.i.billInfo.maxDueDt')">
            <h-date-picker type="date" v-model="impawnPickBillForm.maxDueDt" placeholder="" showFormat
                           :editable=false></h-date-picker>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.minBillPackageMoney')" prop="minBillMoney" :label-width="130">
            <h-typefield type="money" v-model="impawnPickBillForm.minBillMoney" :maxlength="20"
                         placeholder="数字，小数位最多2位" bigTips ></h-typefield>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.maxBillPackageMoney')" prop="maxBillMoney" :label-width="130">
            <h-typefield type="money" v-model="impawnPickBillForm.maxBillMoney" :maxlength="20"
                         placeholder="数字，小数位最多2位" bigTips></h-typefield>
          </h-form-item>
          <h-form-item prop="impawnType" :label="$t('m.i.ce.impawnType')">
            <h-select v-model="impawnPickBillForm.impawnType" readonly>
              <h-option value="1">普通质押</h-option>
              <h-option value="2">票据池质押</h-option>
            </h-select>
          </h-form-item>
          <h-form-item class="h-form-operate">
            <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                            :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
            <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
            <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
          </h-form-item>
        </h-form>
      </div>
    </div>
    <!--数据展示表格-->
    <h-datagrid
      :columns="columns"
      url="/ce/impawn/elec/elecImpawn/eImpawnApplyMain/func_pageQueryImpawnUnsignBills"
      :bindForm="impawnPickBillForm"
      :onSelectChange="handleSelectClick"
      :auto-load="false"
      :rowSelect="true"
      :param-id="'transId'"
      ref="datagrid">
    </h-datagrid>
    <!-- 弹出框模式底部按钮 -->
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
      <h-button type="primary" @click="submitForm">{{$t("m.i.common.commit")}}</h-button>
    </div>
  </h-msg-box>
</template>

<script>
  import { post, on, off, formatNumber, getDictValueFromMap,formatBillRange } from "@/api/bizApi/commonUtil";

  export default {
    name: "eImpawnPickBill",
    data() {
      return {
        impawnPickBillForm: {
          reverseBillNo: "",
          acptName: "",
          minDueDt: "",
          maxDueDt: "",
          minBillMoney: "",
          maxBillMoney: "",
          impawnType: "1",
          queryType: "1",
          batchId: "",
          billType: "",
          ownedBrchNo:"",
          licenseFlag:"",
          billOrigin: "",
          minBillRangeStart: "",
          maxBillRangeEnd: "",
        },
        ifShowMore: false,
        columns: [
          {
            type: "selection",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.billOrigin"),   //票据来源
            key: "billOrigin",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = (!params.row.billOrigin || params.row.billOrigin === 'CS00') ? '-' : this.getDictValueFromMap(this.impawnPickBillParams.dictMap, "BillOrigin", params.row.billOrigin);
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
            title: this.$t("m.i.billInfo.billRange"),   //子票区间
            key: "billRange",
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
            ellipsis: false,
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.impawnPickBillParams.dictMap, "DraftTypeCode", params.row.billType);
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
            hiddenCol: false,
            ellipsis: false,
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
            hiddenCol: false,
            ellipsis: false,
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
            ellipsis: false,
            key: "drwrName",
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
             title: this.$t("m.i.billInfo.drwrBankName"),
            key: "drwrBankName",
            sortable: true,
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
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("m.i.billInfo.acptBankNo"),
            key: "acptBankNo",
            hiddenCol: false,
            ellipsis: false
          }
        ],
        currentSelectList: [],
        currentSelectRowInx: [],
        isList: [],
      }
    },
    props: {
      title: {
        type: String,
        default() {
          return "挑票查询";
        }
      },
      impawnPickBillWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      impawnPickBillParams: {
        type: Object,
        default: {
          batchId: "",
          billType: "",
          licenseFlag: "",
          ownedBrchNo: "",
          dictMap: new Map(),
          billOriginList: [],
        }
      }
    },
    watch: {
      impawnPickBillWin(val) {
        if (val === true) {
          this.$nextTick(() => {
            this.impawnPickBillForm.batchId = this.impawnPickBillParams.batchId;
            this.impawnPickBillForm.billType = this.impawnPickBillParams.billType;
            this.impawnPickBillForm.ownedBrchNo = this.impawnPickBillParams.ownedBrchNo;
            this.impawnPickBillForm.licenseFlag = this.impawnPickBillParams.licenseFlag;
            this.formSearch();
          });
        }
      },
    },
    computed: {
      tempImpawnPickBillWin: {
        get() {
          return this.impawnPickBillWin;
        },
        set() {
        }
      },
    },
    methods: {
      onMaximize() {
        setTimeout(() => {
          this.$refs.datagrid.$refs.gridContent.handleResize();
        }, 100);
      },
      formatBillMoney(optType, itemType) {
        if (optType === "blur") {
          if (itemType === "min") {
            if (!isNaN(parseFloat(this.impawnPickBillForm.minBillMoney)) && isFinite(this.impawnPickBillForm.minBillMoney)) {
              this.impawnPickBillForm.minBillMoney = this.impawnPickBillForm.minBillMoney == null ? "0.00" : formatNumber(this.impawnPickBillForm.minBillMoney, 2, ",");
            }
          } else {
            if (!isNaN(parseFloat(this.impawnPickBillForm.maxBillMoney)) && isFinite(this.impawnPickBillForm.maxBillMoney)) {
              this.impawnPickBillForm.maxBillMoney = this.impawnPickBillForm.maxBillMoney == null ? "0.00" : formatNumber(this.impawnPickBillForm.maxBillMoney, 2, ",");
            }
          }
        } else if (optType === "focus") {
          if (itemType === "min") {
            this.impawnPickBillForm.minBillMoney = this.impawnPickBillForm.minBillMoney.toString().replace(/,/g, "");
          } else {
            this.impawnPickBillForm.maxBillMoney = this.impawnPickBillForm.maxBillMoney.toString().replace(/,/g, "");
          }
        }
      },
      //查询
      formSearch() {
        this.currentSelectList = [];
        this.impawnPickBillForm.minDueDt = this.impawnPickBillForm.minDueDt.replace(/-/g, "");
        this.impawnPickBillForm.maxDueDt = this.impawnPickBillForm.maxDueDt.replace(/-/g, "");
        // this.impawnPickBillForm.minBillMoney = this.impawnPickBillForm.minBillMoney.toString().replace(/,/g, "");
        // this.impawnPickBillForm.maxBillMoney = this.impawnPickBillForm.maxBillMoney.toString().replace(/,/g, "");
        this.$refs.datagrid.dataChange(1);
      },
      //重置
      formSearchReset() {
        // this.impawnPickBillForm.billType = "";
        this.impawnPickBillForm.impawnType = "1";
        this.$refs.impawnPickBillForm.resetFields();
      },
      handleSelectClick(arr, selectInx) {
        this.currentSelectList = arr;
        this.currentSelectRowInx = selectInx;
      },
      handleClose() {
        this.formSearchReset();
        this.$refs.datagrid.$refs.gridPage.clearElevator();
        this.$emit("impawnPickBillWinClose", "");
      },
      submitForm() {
        this.currentSelectList = this.$refs.datagrid.selects;
        if (this.currentSelectList != null && this.currentSelectList.length !== 0) {
          this.$refs.datagrid.$refs.gridPage.clearElevator();
          this.$emit("impawnPickBillChange", this.currentSelectList);
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
        }
      }
    }
  };
</script>

<style scoped>

</style>
