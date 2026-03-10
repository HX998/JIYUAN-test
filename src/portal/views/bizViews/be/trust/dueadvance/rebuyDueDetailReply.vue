<!--转贴现逾期转垫款-复核管理-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <common-input v-model="formItem.quoteNo" :label="$t('m.i.be.quoteNo')" prop="quoteNo" :maxlength="20"></common-input>
                <common-input v-model="formItem.dealNo" :label="$t('m.i.be.dealNo')" prop="dealNo" :maxlength="20"></common-input>
                <batch-no v-model="formItem.batchNo"></batch-no>
                <bill-no v-model="formItem.billNoLike" prop="billNoLike" :label="$t('m.i.billInfo.billPackageNo')"></bill-no>
                <common-date-picker v-model="dueDate" :label="$t('m.i.billInfo.dueDt')" type="daterange" :autoPlacement="true" @on-change="handleDueDtChange"></common-date-picker>
                <common-date-picker v-model="dealDate" :label="$t('m.i.be.dealDt')" type="daterange" :autoPlacement="true" @on-change="handleDealDtChange"></common-date-picker>
                <!--<bill-type v-model="formItem.billType" :dictList="billTypeList"></bill-type>
                <bill-class v-model="formItem.billClass" :dictList="billClassList"></bill-class>-->
                <query-btn :advanceShow="true" @showChange="showChange" :formSearch="handleSearch"
                           :formSearchReset="resetSearch"></query-btn>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid
            :columns="columns"
            highlightRow
            url="/be/trust/dueadvance/rebuyDueDetailReply/func_queryRebuyDueDetailReply"
            :bindForm="formItem"
            rowSelect
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="rebuyDueDetailApplyAgree()">{{$t("m.i.common.agree")}}</h-button>
              <h-button type="primary" @click="rebuyDueBillApplyRefuse()">{{$t("m.i.common.refuse")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId" :billNo="this.billNo" :billRangeEnd = "this.billRangeEnd" :billRangeStart = "this.billRangeStart"></bill-info-main>
    <acct-record :param="param"  :showAcctRecordWin="showAcctRecordWin" @showAcctRecordWinClose="showAcctRecordWinClose"
                 :submitFlag="acctSubmitFlag"
                 :showPrintButton="showPrintButton"
                 @printSuccessCallback="printSuccessCallback"
                 :url="acctRecord" @acctSubmitSure="acctSubmitSure"></acct-record>

  </div>
</template>

<script>
  import { post, accMul, formatNumber, formatBillRange  } from "@/api/bizApi/commonUtil";

  export default {
    name: "rebuyDueDetailReply",
    components: {
    },
    data() {
      return {

        formItem: {
          quoteNo:"",
          dealNo:"",
          batchNo: "",
          billNoLike:"",
          minDueDt:"",
          maxDueDt:"",
          minDealDt:"",
          maxDealDt:"",
          billType: "",
          billClass: "",
        },
        columns: [
          {
            type: "selection",
            align: "center",
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
            title: this.$t("m.i.billInfo.billOrigin"),
            align:'center',
            key: 'billOrigin',
            render: (h, params) => {
              let list = (!params.row.billOrigin || params.row.billOrigin === 'CS00') ? '-' :  this.getDictValueFromMap(this.dictMap, "BillOrigin", params.row.billOrigin);
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
            key: 'billNo',
            hiddenCol: false,
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
            hiddenCol: false,
            render:(h,params) => {
              let billOrigin = params.row.billOrigin;
              let billRangeStart = params.row.billRangeStart;
              let billRangeEnd = params.row.billRangeEnd;
              return h("span", formatBillRange(billOrigin, billRangeStart, billRangeEnd))
            }
          },
          {
            title: this.$t("m.i.common.busiType"),
            key: "busiType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "DueAdvanceBusiType", params.row.busiType);
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
              let list = this.getDictValueFromMap(this.dictMap, "CDMedia", params.row.billClass);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.billInfo.billPackageMoney'),
            key: "billMoney",
            hiddenCol: false,
            render: (h, params) => {
              return h("p", formatNumber(params.row.billMoney, 2, ","));
            }
          },
          {
            title: this.$t('m.i.common.advancedPayAmt'),
            key: "advancedPayAmt",
            hiddenCol: false,
            render: (h, params) => {
              return h("p", formatNumber(params.row.advancedPayAmt, 2, ","));
            }
          },
          {
            title: this.$t('m.i.common.advancedBalanceAmt'),
            key: "advancedBalanceAmt",
            hiddenCol: false,
            render: (h, params) => {
              return h("p", formatNumber(params.row.advancedBalanceAmt, 2, ","));
            }
          },
          {
            title: this.$t('m.i.common.saleReceiveAmt'),
            key: "saleReceiveAmt",
            hiddenCol: false,
            render: (h, params) => {
              return h("p", formatNumber(params.row.saleReceiveAmt, 2, ","));
            }
          },
          {
            title: this.$t('m.i.common.saleReceiveInterest'),
            key: "saleReceiveInterest",
            hiddenCol: false,
            render: (h, params) => {
              return h("p", formatNumber(params.row.saleReceiveInterest, 2, ","));
            }
          },
          {
            title: this.$t('m.i.billInfo.remitDt'),
            key: "remitDt",
            hiddenCol: false,
            render: (h, params) => {
              return h("span", params.row.remitDt ? this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          },
          {
            title: this.$t('m.i.billInfo.dueDt'),
            key: "dueDt",
            hiddenCol: false,
            render: (h, params) => {
              return h("span", params.row.dueDt ? this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          },
          {
            title: this.$t('m.i.be.saleBrchName'),
            key: "saleBrchName",
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.billInfo.drwrName'),
            key: "drwrName",
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.billInfo.acptName'),
            key: "acptName",
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.billInfo.acptBankNo'),
            key: "acptBankNo",
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.billInfo.acptBankName'),
            key: "acptBankName",
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.billInfo.discBankName'),
            key: "discBankName",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.common.batchNo"),
            key: "batchNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.be.quoteNo"),
            key: "quoteNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.be.dealNo"),
            key: "dealNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.dealDt'),
            key: "dealDt",
            hiddenCol: false,
            render: (h, params) => {
              return h("span", params.row.dealDt ? this.$moment(params.row.dealDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          }
        ],
        //是否显示更多查询项
        ifShowMore: false,
        dictMap: new Map(),
        showBillInfoWin:false,
        billId:"",
        billNo:"",
        billRangeStart:"",
        billRangeEnd:"",
        dueDate: [],
        dealDate:[],
        billTypeList:[],
        billClassList: [],
        busiTypeList: [],
        isList:[],
        param : {},
        showAcctRecordWin : false,
        showPrintButton:false,
        acctSubmitFlag:false,
        acctRecord : "/be/trust/dueadvance/rebuyDueBillReply/func_queryRebuyDueDetailAcctRecord",
        accountUrl : "/be/trust/dueadvance/rebuyDueDetailReply/func_rebuyDueDetailAgreeApply",
      };
    },
    mounted() {
      this.getDictListByGroups("DueAdvanceBusiType,Yon,DraftTypeCode,CDMedia,BillOrigin").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.billClassList = res.get("CDMedia");
        this.busiTypeList = res.get("DueAdvanceBusiType");
        this.isList = res.get("Yon");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      showChange(val) {
        this.ifShowMore = val;
      },
      //表单查询
      handleSearch(pageNo) {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.dataChange(!!pageNo ? pageNo : 1);
      },
      //重置表单查询结果
      resetSearch() {
        this.dueDate= [];
        this.dealDate=[];
        this.formItem.minDueDt="";
        this.formItem.maxDueDt="";
        this.formItem.minDealDt="";
        this.formItem.maxDealDt="";
        this.$refs.formItem.resetFields();
      },
      handleDueDtChange(arr) {
        if (arr && arr.length >= 2) {
          this.formItem.minDueDt = arr[0].replace(/-/g, "");
          this.formItem.maxDueDt = arr[1].replace(/-/g, "");
          this.dueDate = [arr[0], arr[1]];
        } else {
          this.formItem.minDueDt = "";
          this.formItem.maxDueDt = "";
          this.dueDate = [];
        }
      },
      handleDealDtChange(arr) {
        if (arr && arr.length >= 2) {
          this.formItem.minDealDt = arr[0].replace(/-/g, "");
          this.formItem.maxDealDt = arr[1].replace(/-/g, "");
          this.dealDate = [arr[0], arr[1]];
        } else {
          this.formItem.minDealDt = "";
          this.formItem.maxDealDt = "";
          this.dealDate = [];
        }
      },
      //票据详情
      billInfoWinClose(){
        this.billId=null;
        this.billNo=null;
        this.showBillInfoWin=false;
      },
      billInfoWinOpen(billId,billNo){
        this.billId=billId;
        this.billNo=billNo;
        this.showBillInfoWin=true;
      },
      printSuccessCallback(){
        this.showAcctRecordWinClose();
      },
      acctSubmitSure(info) {
        this.acctSubmitFlag = true;
        post({ ids: info.ids }, this.accountUrl).then(res => {
          this.acctSubmitFlag = false;
          if (res) {
            let retCode = res.data.retCode
            if (retCode == "000000") {
              this.$msgTip.success(this);
              this.showPrintButton = true;
              if(!info.isHasPrint) {
                this.showAcctRecordWinClose();
              }
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
              this.showAcctRecordWinClose();
            }
          } else {
            this.$msgTip.error(this, { info: this.$t('m.i.common.netError') });
          }
        });
      },
      // 关闭记账窗口
      showAcctRecordWinClose() {
        this.showAcctRecordWin = false;
        this.showPrintButton = false;
        this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
      },
      account(ids) {
        this.param = {ids:ids};
        this.showAcctRecordWin = true;
      },
      rebuyDueDetailApplyAgree(){
        let ids = this.$refs.datagrid.selectIds;
        if (ids != null && ids.length !== 0) {
          this.$hMsgBox.confirm({
            title: "同意信息",
            content: "请确认，同意将所选的票据收回垫款金额？",
            onOk: () => {
              this.account(ids);
              /*let params={ id: this.currentSelectRow.id };
              let url="/be/trust/dueadvance/rebuyDueDetailReply/func_rebuyDueDetailAgreeApply";
              this.sendPost(params,url);*/
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
        }
      },
      rebuyDueBillApplyRefuse(){
        let ids = this.$refs.datagrid.selectIds;
        if (ids != null && ids.length !== 0) {
          this.$hMsgBox.confirm({
            title: "拒绝信息",
            content: "请确认，拒绝将所选的票据收回垫款金额？",
            onOk: () => {
              let params={ ids: ids};
              let url="/be/trust/dueadvance/rebuyDueDetailReply/func_rebuyDueDetailCancelApply";
              this.sendPost(params,url);
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
        }
      },
      sendPost(params, url) {
        post(params, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.$refs.datagrid.selects = [];
              this.$refs.datagrid.selectIds = [];
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
              this.$refs.datagrid.selects = [];
              this.$refs.datagrid.selectIds = [];
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
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
