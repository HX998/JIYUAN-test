<template>
  <!--解质押挑票弹出框-->
  <h-msg-box v-model="tempUnImpawnPickBillWin" width="1000" :mask-closable="false" @on-close="handleClose"
             class="h-form-table-layer" :maximize="true" @on-maximize="onMaximize">
    <p slot="header">
      <span>{{title}}</span>
    </p>
    <!--查询表单-->
    <div>
      <div :class="{'h-form-overhd':!ifShowMore}">
        <h-form :model="unImpawnPickBillForm" :label-width="100" ref="unImpawnPickBillForm" cols="4"
                class="h-form-search">
          <h-form-item prop="custNo" :label="$t('m.i.common.custNo')" v-if="this.unImpawnPickBillParams.billClass === 'ME01'">
            <h-input v-model="unImpawnPickBillForm.custNo" placeholder=""  readonly></h-input>
          </h-form-item>
          <h-form-item prop="custName" :label="$t('m.i.common.custName')" v-if="this.unImpawnPickBillParams.billClass === 'ME01'">
            <h-input v-model="unImpawnPickBillForm.custName" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.billNo')" prop="billNo">
            <h-input v-model="unImpawnPickBillForm.reverseBillNo" :maxLength="30"></h-input>
          </h-form-item>
          <h-form-item prop="acptName" :label="$t('m.i.billInfo.acptName')">
            <h-input v-model="unImpawnPickBillForm.acptName" :maxlength=60></h-input>
          </h-form-item>
          <h-form-item prop="minDueDt" :label="$t('m.i.billInfo.minDueDt')">
            <h-date-picker type="date" v-model="unImpawnPickBillForm.minDueDt" placeholder="" showFormat
                           :editable=false></h-date-picker>
          </h-form-item>
          <h-form-item prop="maxDueDt" :label="$t('m.i.billInfo.maxDueDt')">
            <h-date-picker type="date" v-model="unImpawnPickBillForm.maxDueDt" placeholder="" showFormat
                           :editable=false></h-date-picker>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.minBillMoney')" prop="minBillMoney">
            <h-typefield type="money" v-model="unImpawnPickBillForm.minBillMoney" :maxlength="20"
                         placeholder="数字，小数位最多2位" bigTips ></h-typefield>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.maxBillMoney')" prop="maxBillMoney">
            <h-typefield type="money" v-model="unImpawnPickBillForm.maxBillMoney" :maxlength="20"
                         placeholder="数字，小数位最多2位" bigTips ></h-typefield>
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
      url="/ce/impawn/paper/paperUnImpawn/pUnImpawnApplyMain/func_pickList"
      :bindForm="unImpawnPickBillForm"
      paramId="billId"
      :has-select="false"
      :auto-load="false"
      :rowSelect="true"
      ref="datagrid">
      <div slot="toolbar" class="pull-left"></div>
    </h-datagrid>
    <!-- 弹出框模式底部按钮 -->
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
      <h-button type="primary" @click="submitForm">{{$t("m.i.common.commit")}}</h-button>
    </div>
  </h-msg-box>
</template>

<script>
  import { post, on, off, formatNumber, getDictValueFromMap } from "@/api/bizApi/commonUtil";

  export default {
    name: "pUnImpawnPickBill",
    data() {
      return {
        unImpawnPickBillForm: {
          reverseBillNo: "",
          custNo: "",
          custName: "",
          acptName: "",
          minDueDt: "",
          maxDueDt: "",
          minBillMoney: "",
          maxBillMoney: "",
          impawnType: "1",
          billClass: "",
          billType: "",
          ownedBrchNo:"",
          licenseFlag:"",
        },
        ifShowMore: false,
        columns: [],
        eColumns: [
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
           title: this.$t("m.i.billInfo.billNo"),
            key: "billNo",
            ellipsis: false,
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",
            ellipsis: false,
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.unImpawnPickBillParams.dictMap, "DraftTypeCode", params.row.billType);
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
             title: this.$t("m.i.billInfo.drwrBankName"),
            key: "drwrBankName",
            sortable: true,
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.pyeeName"),
            key: "pyeeName",
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
        pColumns: [
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
           title: this.$t("m.i.billInfo.billNo"),
            key: "billNo",
            ellipsis: false,
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",
            ellipsis: false,
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.unImpawnPickBillParams.dictMap, "DraftTypeCode", params.row.billType);
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
            title: this.$t("m.i.ce.impawnDt"),
            key: "transDt",
            hiddenCol: false,
            ellipsis: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.transDt == null || params.row.transDt === "") {
                return "";
              }
              let date = this.$moment(params.row.transDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.ce.impawnBatchNo"),
            key: "batchNo",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.obligeeName"),
            key: "oppName",
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
        isList: []
      }
    },
    props: {
      title: {
        type: String,
        default() {
          return "挑票查询";
        }
      },
      unImpawnPickBillWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      unImpawnPickBillParams: {
        type: Object,
        default: {
          dictMap: new Map(),
          billClass: "",
          custNo: "",
          custName: "",
          custAcctNo: "",
          billType: "",
          licenseFlag: "",
          ownedBrchNo: "",
        }
      }
    },
    watch: {
      unImpawnPickBillWin(val) {
        if (val === true) {
          if (this.unImpawnPickBillParams.billClass === "ME01") {
            this.unImpawnPickBillForm.custNo = this.unImpawnPickBillParams.custNo;
            this.unImpawnPickBillForm.custName = this.unImpawnPickBillParams.custName;
            this.unImpawnPickBillForm.custAcctNo = this.unImpawnPickBillParams.custAcctNo;
          }
          this.unImpawnPickBillForm.ownedBrchNo = this.unImpawnPickBillParams.ownedBrchNo;
          this.unImpawnPickBillForm.licenseFlag = this.unImpawnPickBillParams.licenseFlag;
          this.unImpawnPickBillForm.billClass = this.unImpawnPickBillParams.billClass;
          this.unImpawnPickBillForm.billType = this.unImpawnPickBillParams.billType;
          this.$nextTick(() => {
            if (this.unImpawnPickBillParams.billClass === "ME01") {
              this.columns = this.pColumns;
            } else {
              this.columns = this.eColumns;
            }
            this.$refs.datagrid.createShowCol(this.columns);
            this.formSearch();
          });
        }
      },
    },
    computed: {
      tempUnImpawnPickBillWin: {
        get() {
          return this.unImpawnPickBillWin;
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
            if (!isNaN(parseFloat(this.unImpawnPickBillForm.minBillMoney)) && isFinite(this.unImpawnPickBillForm.minBillMoney)) {
              this.unImpawnPickBillForm.minBillMoney = this.unImpawnPickBillForm.minBillMoney == null ? "0.00" : formatNumber(this.unImpawnPickBillForm.minBillMoney, 2, ",");
            }
          } else {
            if (!isNaN(parseFloat(this.unImpawnPickBillForm.maxBillMoney)) && isFinite(this.unImpawnPickBillForm.maxBillMoney)) {
              this.unImpawnPickBillForm.maxBillMoney = this.unImpawnPickBillForm.maxBillMoney == null ? "0.00" : formatNumber(this.unImpawnPickBillForm.maxBillMoney, 2, ",");
            }
          }
        } else if (optType === "focus") {
          if (itemType === "min") {
            this.unImpawnPickBillForm.minBillMoney = this.unImpawnPickBillForm.minBillMoney.toString().replace(/,/g, "");
          } else {
            this.unImpawnPickBillForm.maxBillMoney = this.unImpawnPickBillForm.maxBillMoney.toString().replace(/,/g, "");
          }
        }
      },
      //查询
      formSearch() {
        this.$refs.datagrid.selects = [];
        this.unImpawnPickBillForm.minDueDt = this.unImpawnPickBillForm.minDueDt.replace(/-/g, "");
        this.unImpawnPickBillForm.maxDueDt = this.unImpawnPickBillForm.maxDueDt.replace(/-/g, "");
        // this.unImpawnPickBillForm.minBillMoney = this.unImpawnPickBillForm.minBillMoney.toString().replace(/,/g, "");
        // this.unImpawnPickBillForm.maxBillMoney = this.unImpawnPickBillForm.maxBillMoney.toString().replace(/,/g, "");
        this.$refs.datagrid.dataChange(1);
      },
      //重置
      formSearchReset() {
        this.unImpawnPickBillForm.billType = "";
        this.unImpawnPickBillForm.reverseBillNo = "";
        this.$refs.unImpawnPickBillForm.resetFields(true);
      },
      handleClose() {
        this.formSearchReset();
        this.$refs.datagrid.$refs.gridPage.clearElevator();
        this.$emit("unImpawnPickBillWinClose", "");
      },
      submitForm() {
        if (this.$refs.datagrid.selects != null && this.$refs.datagrid.selects.length !== 0) {
          this.formSearchReset();
          this.$refs.datagrid.$refs.gridPage.clearElevator();
          this.$emit("unImpawnPickBillChange", this.$refs.datagrid.selects);
        } else {
          this.$hMessage.info(this.$t("m.i.common.chooseAtLeastOneRecord"));
        }
      }
    }
  };
</script>

<style scoped>

</style>
