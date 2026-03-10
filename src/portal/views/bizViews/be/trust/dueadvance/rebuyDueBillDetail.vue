<!--贴现通挂牌-新增、修改弹出框-->
<template>
  <div>
    <h-msg-box v-model="tempRebuyDueBillDetailWin" :maximize="true" :mask-closable="false" @on-close="handleClose"
               width="1000" class="h-form-search-layer" top="10" @on-maximize="onMaximize">
      <p slot="header">
        <span >垫款收回详情</span>
      </p>
      <div>
        <div class="text-body">
          <bill-detail :billDetailWin="rebuyDueBillDetailWin":viewDatailForm="viewDatailForm" :batchParams="batchParams" ></bill-detail>
        </div>
        <!--数据展示表格-->
        <h-datagrid
          :columns="columns"
          highlight-row
          :auto-load="false"
          :url="dataGridUrl"
          :bindForm="dataGridFormItem"
          :has-select="false"
          :rowSelect="true"
          ref="datagrid">
          <div slot="toolbar" class="pull-left">
            <p>垫款收回明细：</p>
           <!-- <h-button type="primary" @click="listExport">{{$t("m.i.common.listExport")}}</h-button>-->
          </div>
        </h-datagrid>
      </div>
      <div slot="footer">
      </div>
    </h-msg-box>


<!--    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param"
                           :rows="this.rows"></common-excel-download>-->

  </div>
</template>

<script>
  import { post, formatNumber ,exportList} from "@/api/bizApi/commonUtil";

  export default {
    name: "rebuyDueBillDetail",
    components: {
      BillDetail: () => import(/* webpackChunkName: "be/trust/dueadvance/billDetail"*/"@/views/bizViews/be/trust/dueadvance/billDetail"),
    },
    data() {
      return {
        listId: "",
        viewDatailForm: {
          id:"",
          legalNo:"",
          memberId:"",
          advancedAcctFlowId:"",
          advancedProdNo:"",
          advancedProdName:"",
          rcvProdNo:"",
          rcvProdName:"",
          busiType:"",
          brchNo:"",
          brchName:"",
          billId:"",
          billNo:"",
          billType:"",
          billClass:"",
          remitDt:"",
          dueDt:"",
          billMoney:"",
          drwrName:"",
          drwrAcctNo:"",
          acptName:"",
          acptBankNo:"",
          acptBankName:"",
          balanceAmt:"",
          advancedBalanceAmt:"",
          advancedPayAmt:"",
          saleReceiveAmt:"",
          sumSaleReceiveAmt:"",
          advancedPayDt:"",
          discBrchCode:"",
          discBankNo:"",
          discBankName:"",
          saleBrchName:"",
          batchNo:"",
          quoteNo:"",
          dealDt:"",
          dealNo:"",
          flowStatus:"",
          orgnlListId:"",
          orgnlProdNo:"",
          advancedApplTellerNo:"",
          advancedCheckTellerNo:"",
          advancedAcctTellerNo:"",
          advancedApplBrchNo:"",
          advancedAcctBrchNo:"",
          rcvApplTellerNo:"",
          rcvCheckTellerNo:"",
          rcvAcctTellerNo:"",
          rcvApplBrchNo:"",
          rcvAcctBrchNo:"",
          reserve1:"",
          reserve2:"",
          reserve3:"",
          saleReceiveInterest:"",
          sumSaleReceiveInterest:""
        },
        dataGridFormItem: {
          listId: ""
        },
        columns: [
         /* {
            type: "selection",
            width: 50,
            hiddenCol: false,
            align: "center"
          },*/
          {
            type: "index",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center"
          },
          {
            title: this.$t("m.i.common.advancedReceiveDt"),
            key: "acctDt",
            hiddenCol: false,
            render: (h, params) => {
              return h("span", params.row.acctDt ? this.$moment(params.row.acctDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          },
          {
            title: this.$t("m.i.common.saleReceiveAmt"),
            key: "saleReceiveAmt",
            hiddenCol: false,
            render: (h, params) => {
              let billMoney = formatNumber(params.row.saleReceiveAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: billMoney
                }
              }, billMoney);
            }
          },
          {
            title: this.$t("m.i.common.saleReceiveInterest"),
            key: "saleReceiveInterest",
            hiddenCol: false,
            render: (h, params) => {
              let billMoney = formatNumber(params.row.saleReceiveInterest, 2, ",");
              return h("span", {
                domProps: {
                  title: billMoney
                }
              }, billMoney);
            }
          },
          {
            title: this.$t("m.i.common.advancedBalanceAmt"),
            key: "advancedBalanceAmt",
            hiddenCol: false,
            render: (h, params) => {
              return h("p", formatNumber(params.row.advancedBalanceAmt, 2, ","));
            }
          },
        ],

        // tempShowExcelTemplateWin: false,
        // param: "",
        // rows: "",
      };
    },
    props: {
      rebuyDueBillDetailWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      batchParams: {
        type: Object,
        default: {}
      },
      dataGridUrl: {
        type: String,
        default() {
          return "/be/trust/dueadvance/rebuyDueBillTrackQuery/func_queryRebuyDueDetail";
        }
      },
      exportUrl: {
        type: String,
        default() {
          return "";
        }
      },
      batchUrl: {
        type: String,
        default() {
          return "/be/trust/dueadvance/rebuyDueBillTrackQuery/func_findRebuyDueBillById";
        }
      }
    },
    computed: {
      tempRebuyDueBillDetailWin: {
        get() {
          return this.rebuyDueBillDetailWin;
        },
        set() {
        }
      }
    },
    watch: {
      rebuyDueBillDetailWin(val) {
        if (val) {
          this.$nextTick(() => {
            this.listId = this.batchParams.listId;
            this.dataGridFormItem.listId=this.listId;
            this.queryObjById();
            this.handleSearch();
          });
        }
      },
      listId(val) {
        this.listId = val;
      }
    },
    methods: {
      onMaximize() {
        setTimeout(() => {
          this.$refs.datagrid.$refs.gridContent.handleResize();
        }, 100);
      },
      //根据批次Id查询批次信息
      queryObjById() {
        let params = { id: this.listId };
        let url = this.batchUrl;
        post(params, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let obj = res.data.retData;
              this.viewDatailForm.id =  obj.id;
              this.viewDatailForm.legalNo =  obj.legalNo;
              this.viewDatailForm.memberId =  obj.memberId;
              this.viewDatailForm.advancedAcctFlowId =  obj.advancedAcctFlowId;
              this.viewDatailForm.advancedProdNo =  obj.advancedProdNo;
              this.viewDatailForm.advancedProdName =  obj.advancedProdName;
              this.viewDatailForm.rcvProdNo =  obj.rcvProdNo;
              this.viewDatailForm.rcvProdName =  obj.rcvProdName;
              this.viewDatailForm.busiType =  obj.busiType;
              this.viewDatailForm.brchNo =  obj.brchNo;
              this.viewDatailForm.brchName =  obj.brchName;
              this.viewDatailForm.billId =  obj.billId;
              this.viewDatailForm.billNo =  obj.billNo;
              this.viewDatailForm.billType =  obj.billType;
              this.viewDatailForm.billClass =  obj.billClass;
              this.viewDatailForm.remitDt = obj.remitDt=== null ?"":obj.remitDt.toString();
              this.viewDatailForm.dueDt =  obj.dueDt=== null ?"":obj.dueDt.toString();
              this.viewDatailForm.billMoney = obj.billMoney=== null ?"":obj.billMoney.toString();
              this.viewDatailForm.drwrName =  obj.drwrName;
              this.viewDatailForm.drwrAcctNo =  obj.drwrAcctNo;
              this.viewDatailForm.acptName =  obj.acptName;
              this.viewDatailForm.acptBankNo =  obj.acptBankNo;
              this.viewDatailForm.acptBankName =  obj.acptBankName;
              this.viewDatailForm.balanceAmt = obj.balanceAmt=== null ?"":obj.balanceAmt.toString();
              this.viewDatailForm.advancedBalanceAmt = obj.advancedBalanceAmt=== null ?"":obj.advancedBalanceAmt.toString();
              this.viewDatailForm.advancedPayAmt = obj.advancedPayAmt=== null ?"":obj.advancedPayAmt.toString();
              this.viewDatailForm.saleReceiveAmt = obj.saleReceiveAmt=== null ?"":obj.saleReceiveAmt.toString();
              this.viewDatailForm.sumSaleReceiveAmt = obj.sumSaleReceiveAmt=== null ?"":obj.sumSaleReceiveAmt.toString();
              this.viewDatailForm.advancedPayDt =  obj.advancedPayDt=== null ?"":obj.advancedPayDt.toString();
              this.viewDatailForm.discBrchCode =  obj.discBrchCode;
              this.viewDatailForm.discBankNo =  obj.discBankNo;
              this.viewDatailForm.discBankName =  obj.discBankName;
              this.viewDatailForm.saleBrchName =  obj.saleBrchName;
              this.viewDatailForm.batchNo =  obj.batchNo;
              this.viewDatailForm.quoteNo =  obj.quoteNo;
              this.viewDatailForm.dealDt = obj.dealDt=== null ?"":obj.dealDt.toString();
              this.viewDatailForm.dealNo =  obj.dealNo;
              this.viewDatailForm.flowStatus =  obj.flowStatus;
              this.viewDatailForm.orgnlListId =  obj.orgnlListId;
              this.viewDatailForm.orgnlProdNo =  obj.orgnlProdNo;
              this.viewDatailForm.advancedApplTellerNo =  obj.advancedApplTellerNo;
              this.viewDatailForm.advancedCheckTellerNo =  obj.advancedCheckTellerNo;
              this.viewDatailForm.advancedAcctTellerNo =  obj.advancedAcctTellerNo;
              this.viewDatailForm.advancedApplBrchNo =  obj.advancedApplBrchNo;
              this.viewDatailForm.advancedAcctBrchNo =  obj.advancedAcctBrchNo;
              this.viewDatailForm.rcvApplTellerNo =  obj.rcvApplTellerNo;
              this.viewDatailForm.rcvCheckTellerNo =  obj.rcvCheckTellerNo;
              this.viewDatailForm.rcvAcctTellerNo =  obj.rcvAcctTellerNo;
              this.viewDatailForm.rcvApplBrchNo =  obj.rcvApplBrchNo;
              this.viewDatailForm.rcvAcctBrchNo =  obj.rcvAcctBrchNo;
              this.viewDatailForm.reserve1 =  obj.reserve1;
              this.viewDatailForm.reserve2 =  obj.reserve2;
              this.viewDatailForm.reserve3 =  obj.reserve3;
              this.viewDatailForm.saleReceiveInterest = obj.saleReceiveInterest=== null ?"":obj.saleReceiveInterest.toString();
              this.viewDatailForm.sumSaleReceiveInterest = obj.sumSaleReceiveInterest=== null ?"":obj.sumSaleReceiveInterest.toString();
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //关闭弹窗
      handleClose() {
        this.viewDatailForm.id = "";
        this.listId = "";
        this.dataGridFormItem.listId="";
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$emit("rebuyDueBillDetailWinClose", "");
      },
      handleSearch(pageNo) {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.dataChange(!!pageNo ? pageNo : 1);
      },
      // listExport() {
      //   this.param = "discListingBillExport";
      //   if (this.$refs.datagrid.selectIds.length != 0) {
      //     this.rows = this.$refs.datagrid.selectIds.length;
      //   } else {
      //     this.rows = this.$refs.datagrid.total;
      //   }
      //   this.tempShowExcelTemplateWin = true;
      // },
      // showExcelTemplateWinClose() {
      //   this.tempShowExcelTemplateWin = false;
      // },
      // exportList(field, exportType) {
      //   let url = window.LOCAL_CONFIG.API_HOME + this.exportUrl;
      //   let options = {};
      //   if (this.$refs.datagrid.selectIds.length !== 0) {
      //     options.params = {
      //       batchId: this.batchId,
      //       ids: this.$refs.datagrid.selectIds,
      //     };
      //     options.pageSize = this.$refs.datagrid.selectIds.length;
      //   } else {
      //     options.params = {
      //       batchId: this.batchId
      //     };
      //     options.pageSize = this.$refs.datagrid.total;
      //   }
      //   exportList(this, this.param, field, exportType, url, options);
      // },
    }
  };
</script>

<style scoped>

</style>
