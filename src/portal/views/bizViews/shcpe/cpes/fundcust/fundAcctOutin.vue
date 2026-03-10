<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.shcpe.cpesAcctNo')" prop="cpesAcctNo">
                  <h-input v-model="formItem.cpesAcctNo" placeholder="" :maxlength="32"></h-input>
                </h-form-item>
                <h-form-item prop="operDate" :label="$t('m.i.shcpe.moveAccountDtTm')">
                  <h-date-picker v-model="formItem.operDate" format="yyyy-MM-dd" type="daterange" placeholder=""
                                 showFormat :editable=false @on-change="handleOperDateChange"></h-date-picker>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid
            :columns="columns"
            highlightRow
            url="/fundCust/fundCustInfo/fundAcctOutin/func_queryFundAcctOutin"
            :bindForm="formItem"
            :hasSelect="false"
            rowSelect
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="listExport">{{$t("m.i.common.listExport")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param"
                           :rows="this.rows"></common-excel-download>
    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billNo="this.billNo"
                    :billRangeStart="billRangeStart" :billRangeEnd="billRangeEnd"></bill-info-main>
  </div>
</template>

<script>
  import { post, on, off,exportList,formatNumber,getDictValueFromMap } from "@/api/bizApi/commonUtil";

  export default {
    name: "fundAcctOutin",
    components: {
    },
    data() {
      return {
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
            align: "center"
          },
          {
            title: this.$t("m.i.shcpe.cpesAcctNo"),
            key: "cpesAcctNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.shcpe.moveAccountDtTm"),
            key: "outInDtTm",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.outInDtTm == null || params.row.outInDtTm === "") {
                return "";
              }
              let outInDtTm = this.$moment(params.row.outInDtTm, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", outInDtTm);
            }
          },
          {
            title: this.$t("m.i.shcpe.moveAccountType"),
            key: "moveAccountType",
            hiddenCol: false,
            render: (h, params) => {
              let moveAccountType = this.getDictValueFromMap(this.dictMap, "movAccountType", params.row.moveAccountType);
              return h("span",
                {
                  domProps: {
                    title: moveAccountType
                  }
                }, moveAccountType);
            }
          },
          {
            title: this.$t("m.i.shcpe.moveAccountFlowNo"),
            key: "moveAccountFlowNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.shcpe.newPayRcvFlag"),
            key: "payRcvFlag",
            hiddenCol: false,
            render: (h, params) => {
              let payRcvFlag = this.getDictValueFromMap(this.dictMap, "PayRcvFlag", params.row.payRcvFlag);
              return h("span",
                {
                  domProps: {
                    title: payRcvFlag
                  }
                }, payRcvFlag);
            }
          },
          {
            title: this.$t("m.i.pc.amount"),
            key: "changeAmt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              if (null == params.row.changeAmt || params.row.changeAmt === "") {
                return h("span", "0.00");
              } else {
                let changeAmt = formatNumber(params.row.changeAmt, 2, ",");
                return h("span", {
                  domProps: {
                    title: changeAmt
                  }
                }, changeAmt);
              }
            }
          },
          {
            title: this.$t("m.i.shcpe.fundAcctBalanceAmt"),
            key: "fundAcctBalanceAmt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              if (null == params.row.fundAcctBalanceAmt || params.row.fundAcctBalanceAmt === "") {
                return h("span", "0.00");
              } else {
                let fundAcctBalanceAmt = formatNumber(params.row.fundAcctBalanceAmt, 2, ",");
                return h("span", {
                  domProps: {
                    title: fundAcctBalanceAmt
                  }
                }, fundAcctBalanceAmt);
              }
            }
          },
          {
            title: this.$t('m.i.shcpe.draftBusiNo'),
            key: "draftBusiNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.billPackageNo'),
            key: "billNo",
            hiddenCol: false,
            sortable: true,
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
            key:"billRange",
            hiddenCol: false,
            render:(h,params) => {
              let billRangeStart = params.row.billRangeStart;
              let billRangeEnd = params.row.billRangeEnd;
              return h("span", this.formatBillRange(billRangeStart, billRangeEnd))
            }
          },
          {
            title: this.$t('m.i.billInfo.pyeeAcctNo'),
            key: "pyeeAcctNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.pyeeAcctName'),
            key: "pyeeAcctName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.drweAcctNo'),
            key: "drweAcctNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.drweAcctName'),
            key: "drweAcctName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.shcpe.interestPeriod"),
            key: "interestPeriod",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.shcpe.interestStartDt"),
            key: "interestStartDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.interestStartDt == null || params.row.interestStartDt === "") {
                return "";
              }
              let interestStartDt = this.$moment(params.row.interestStartDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", interestStartDt);
            }
          },
          {
            title: this.$t("m.i.shcpe.interestEndDt"),
            key: "interestEndDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.interestEndDt == null || params.row.interestEndDt === "") {
                return "";
              }
              let interestEndDt = this.$moment(params.row.interestEndDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", interestEndDt);
            }
          },
        ],
        formItem: {
          memberId: "",
          minoperDt: "",
          maxoperDt: "",
          operDate: "",
        },
        type: null,
        dictMap: new Map(),
        tempShowExcelTemplateWin: false,
        param: null,
        rows: null,
        showBillInfoWin : false,
        billRangeStart: "",
        billRangeEnd: "",
        billId : "",
        billNo : "",
      };
    },
    watch: {},
    mounted() {
      this.getDictListByGroups("movAccountType,PayRcvFlag").then(res => {
        this.dictMap = res.get("map");
      });
    },
    computed: {},
    methods: {
      listExport() {
        this.param = "fundAcctOutinInfoExport";
        if (this.$refs.datagrid.selectIds.length !== 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        } else {
          this.rows = this.$refs.datagrid.total;
        }
        this.tempShowExcelTemplateWin = true;
      },
      handleOperDateChange(arr) {
        if (arr && arr.length == 2) {
          this.formItem.minoperDt = arr[0].replace(/-/g, "");
          this.formItem.maxoperDt = arr[1].replace(/-/g, "");
        } else {
          this.formItem.minoperDt = "";
          this.formItem.maxoperDt = "";
        }
      },
      formSearch() {
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
        this.formItem.brchCode = "";
        this.formItem.operDate = "";
        this.formItem.minoperDt = "";
        this.formItem.maxoperDt = "";
      },
      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },
      exportList(field, exportType) {
        let url = window.LOCAL_CONFIG.API_HOME + "/fundCust/fundCustInfo/provisionQuery/func_downloadProvisionInfoQuery";
        let options = {};
        if (this.$refs.datagrid.selectIds.length !== 0) {
          options.params = {
            ids: this.$refs.datagrid.selectIds,
          };
          options.pageSize = this.$refs.datagrid.selectIds.length;
        } else {
          options.params = this.formItem;
          options.pageSize = this.$refs.datagrid.total;
        }
        exportList(this, this.param, field, exportType, url, options);
      },
      billInfoWinClose() {
        this.showBillInfoWin = false;
      },
      formatBillRange(billRangeStart, billRangeEnd) {
        if(billRangeStart === null || billRangeEnd === null){
          return "-";
        }
        if (!(billRangeStart+"") || !(billRangeEnd+"")){
          return "-";
        }
        if (billRangeStart.toString() === '0' && billRangeEnd.toString() === '0'){
          return "0";
        }
        return billRangeStart.toString().padLeft(12, '0') + "," + billRangeEnd.toString().padLeft(12, '0');
      },
      showBillInfo(row) {
        this.billNo = row.billNo;
        this.billRangeStart=row.billRangeStart;
        this.billRangeEnd=row.billRangeEnd;
        this.showBillInfoWin = true;
      },
    },
  };
</script>

<style scoped>

</style>
