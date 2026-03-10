<template>
  <h-msg-box v-model="tempChooseBillWin" width="1000" :mask-closable="false" @on-close="handleClose" top="10"
             class="h-form-table-layer" :maximize="true" @on-maximize="onMaximize">
    <p slot="header">
      <span>{{title}}</span>
    </p>
    <!--查询表单-->
    <div>
      <h-panel :class="{'h-form-overhd':!ifShowMore}">
        <h-form :model="formItem" :label-width="100" ref="formItem" cols="4" class="h-form-search">
          <bill-type v-model="formItem.billType" :dictList="billTypeList"></bill-type>
          <!-- 票据来源 -->
          <common-select :label="$t('m.i.billInfo.billOrigin')" prop="billOrigin"
                         v-model="formItem.billOrigin" :dictList="billOriginList"></common-select>

          <!--票据(包)号码-->
          <bill-no v-model="formItem.billNoLike" prop="billNoLike" :label="$t('m.i.billInfo.billPackageNo')"></bill-no>
          <!--子票区间-->
          <bill-range :formItem="formItem" :rangeProps="['minBillRangeStart','maxBillRangeEnd']"></bill-range>
          <!-- 票据(包)金额 -->
          <bill-money-range v-model="formItem" :rangeProps="['minBillMoney','maxBillMoney']" :label="$t('m.i.billInfo.billPackageMoney')"></bill-money-range>
          <query-btn :advanceShow='true' @showChange="showChange" :formSearch='formSearch' :formSearchReset='formSearchReset'></query-btn>
        </h-form>
      </h-panel>
    </div>
    <!--数据展示表格-->
    <h-datagrid
      :columns="columns"
      highlight-row
      url= "/pe/showBill/showBillApply/func_pickShowBill"
      :bindForm="formItem"
      :onCurrentChange="handleCurrentChange"
      :onCurrentChangeCancel="handleCurrentChangeCancel"
      :onRowDbClick="doubleHandleClick"
      :autoLoad="false"
      ref="datagrid">
    </h-datagrid>
    <!-- 弹出框模式底部按钮 -->
    <div slot="footer">
      <close-btn @close="handleClose"></close-btn>
      <commit-btn @commit="submitForm"></commit-btn>
    </div>
    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billRangeEnd = "this.billRangeEnd" :billRangeStart = "this.billRangeStart"
                    :billId="this.billId"></bill-info-main></h-msg-box>
</template>

<script>
  import {
    post, on, off, getDictListByGroups,formatNumber,
    getDictValueFromMap,formatBillRange
  } from "@/api/bizApi/commonUtil";

  export default {
    name: "chooseBill",
    data() {
      return {
        billId : "",
        billRangeStart:"",
        billRangeEnd:"",
        showBillInfoWin : false,
        formItem : {
          billType : '',
          billOrigin : '',
          billMoney : '',
          minBillMoney:"",
          maxBillMoney:"",
          billNoLike : '',
          cdtQrySignStatus : '',
          billRangeStart : '',
          billRangeEnd : '',
          minBillRangeStart:"",
          maxBillRangeEnd : "",
        },
        columns : [
          {
            title: " ",
            type: "radio",
            align: "center",
            width: 60
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: this.$t("m.i.billInfo.billOrigin"),
            align:'center',
            hiddenCol: false,
            render:(h,params) => {
              let dictValue = getDictValueFromMap(this.dictMap,"BillOrigin",params.row.billOrigin);
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
                    this.showBillInfo(params.row);
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
            render:(h,params) => {
              return h("span",getDictValueFromMap(this.dictMap,"DraftTypeCode",params.row.billType));
            }
          },
          {
            title: this.$t("m.i.billInfo.billPackageMoney"),
            key: "billMoney",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let billMoney = formatNumber(params.row.billMoney, 2, ',');
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
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.drwrAcctNo"),
            key: "drwrAcctNo",
            hiddenCol: false,
            sortable: true
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
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.billInfo.pyeeAcctNo'),
            key: 'pyeeAcctNo',
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.billInfo.pyeeBankNo'),
            key: 'pyeeBankNo',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.acptName"),
            key: "acptName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.cpesBillStatus'),
            key: "billStatus",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.formatBillStatus(params.row.billOrigin,params.row.billStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          }
        ],
        currentSelectRow: null,
        ifShowMore: false,
        currentSelectRowInx: [],
        billTypeList : [],
        billOriginList:[],
        tableRef: "selfTable"
      };
    },
    props: {
      chooseBillWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      title: {
        type: String,
        default: "挑票查询"
      }
    },
    comments: {},
    watch: {
      chooseBillWin(val) {
        if (val === true) {
          this.$nextTick(() => {
            this.formSearchReset();
            this.$refs.datagrid.dataChange(1);

          });
        }
      }
    },

    computed: {
      tempChooseBillWin: {
        get() {
          return this.chooseBillWin;
        },
        set() {
        }
      }
    },
    methods: {
      onMaximize() {
        setTimeout(() => {
          this.$refs.datagrid.$refs.gridContent.handleResize();
        }, 100);
      },
      showChange(val) {
        this.ifShowMore = val;
      },
      formSearch() {
        this.currentSelectRow = [];
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
      },
      //票面信息
      showBillInfo(row) {
        this.billId = row.billId;
        this.billRangeStart=row.billRangeStart;
        this.billRangeEnd=row.billRangeEnd;
        this.showBillInfoWin = true;
      },
      billInfoWinClose() {
          this.showBillInfoWin = false;
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      doubleHandleClick(arr) {
        this.currentSelectRow = arr;
        this.$emit("chooseBillChange", this.currentSelectRow);
      },
      handleClose() {
        this.$emit("queryStockBillClose", "");
        this.$refs.formItem.resetFields();

      },
      submitForm() {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          this.$emit("chooseBillChange", this.currentSelectRow);
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      formatBillStatus(billOrigin, billStatus){
        if(billOrigin==="CS01"){
          return  this.dictMap.get("EcdsBillStatusCode").get(billStatus);
        }else {
          return this.dictMap.get("BillStatusCode").get(billStatus);
        }

      },
    },
    mounted() {
      getDictListByGroups("Yon,DraftTypeCode,BillOrigin,DraftTypeCode,CdtQrySignCode,EcdsBillStatusCode,BillStatusCode").then(res => {
        this.billTypeList=res.get("DraftTypeCode");
        this.isList = res.get("Yon");
        this.billOriginList= res.get("BillOrigin");
        this.cdtQrySignStatusList = res.get("CdtQrySignCode")
        this.dictMap = res.get("map");
      });
      on(window, "resize", this.handleResize);
    }
  };
</script>

<style scoped>

</style>
