<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <div class="h-search-form-row" >
                  <h-form-item :label="$t('m.i.shcpe.chargeMonth')" prop="chargeMonthRange">
                    <h-date-picker type="monthrange" v-model="formItem.chargeMonthRange" format="yyyy-MM"
                                   showFormat placeholder="" @on-change="handleChargeMonthChange"></h-date-picker>
                  </h-form-item>
                  <h-form-item class="h-form-operate one-form">
                    <h-button type="primary" @click="formSearch()">{{$t('m.i.common.search')}}</h-button>
                    <h-button type="ghost" @click="formSearchReset()">{{$t('m.i.common.reset')}}</h-button>
                  </h-form-item>
                </div>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            highlight-row
            url="/shcpe/cpes/fee/queryFeeBillAcct"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            :bindForm="formItem"
            ref="datagrid">
            <div slot="toolbar" class='pull-left'>
              <h-button type="primary" @click="account()">记账</h-button>
              <h-button type="primary" @click="queryDetail()">明细</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!-- 分录弹框 -->
    <acct-record :param="this.acctRecordParam" :url="this.acctRecordUrl"
                 :submitFlag="this.acctSubmitFlag"
                 :show-acct-record-win="this.showAcctRecordWin"
                 :showPrintButton="this.showPrintButton"
                 @acctSubmitSure="acctSubmitSure"
                 @showAcctRecordWinClose="showAcctRecordWinClose"
                 @printSuccessCallback="printSuccessCallback"
                 ref="showAcctRecord"></acct-record>

    <h-msg-box v-model="showInfoWin" width="1000" height='450' class="h-form-search-layer" :mask-closable="false" :maximize="true"
               @on-close="infoWinClose" top="60">
      <p slot="header">
        <span>查看记账明细</span>
      </p>
      <h-row>
        <h-col span="24">
          <h-datagrid
            :columns="detailColumns"
            highlightRow
            url="/shcpe/cpes/fee/queryFeeBillAcctDetail"
            :bindForm="info"
            ref="datagridInfo">
            <div slot="toolbar" class="pull-left">
            </div>
          </h-datagrid>
        </h-col>
      </h-row>
      <div slot="footer">
        <h-button type="ghost" @click="infoWinClose">{{$t("m.i.common.close")}}</h-button>
      </div>
    </h-msg-box>

  </div>
</template>

<script>
  import { post, on,off,formatNumber,getDictListByGroups, accMul} from "@/api/bizApi/commonUtil";

    export default {
      name: "feeBillAccount",
      components: {
      },
      data() {
        return {
          showInfoWin:false,
          acctRecordParam: {},
          acctRecordUrl:"/shcpe/cpes/fee/queryAcctRecord",
          acctSubmitFlag:false,
          showAcctRecordWin:false,
          showPrintButton: false,
          ifShowMore : false,
          dictMap : new Map(),
          formItem : {
            minChargeMonth:"",
            maxChargeMonth:"",
            chargeMonthRange:"",
          },
          info:{
            batchId:""
          },
          columns : [
            {
              type: "radio",
              width: 50,
              align: "center",
              title: " ",
            },
            {
              title: this.$t("m.i.common.index"),
              type: 'index',
              align: 'center',
              hiddenCol: false
            },
            {
              title:this.$t("m.i.shcpe.chargeMonth"),
              key: "chargeMonth",
              hiddenCol:false,
              sortable: true,
              render: (h, params) => {
                let date = params.row.chargeMonth == null ? "" : this.$moment(params.row.chargeMonth, "YYYY-MM").format("YYYY-MM");
                return h("span", date);
              }
            },
            {
              title: this.$t("m.i.common.status"),
              key: "status",
              hiddenCol: false,
              render: (h, params) => {
                let list = this.getDictValueFromMap(this.dictMap, "FeeBillStatus", params.row.status);
                return h("span",
                  {
                    domProps: {
                      title: list
                    }
                  }, list);
              }
            },
            {
              title: this.$t("m.i.shcpe.startDate"),
              key: "startDate",
              hiddenCol: false,
              render: (h, params) => {
                let date = params.row.startDate == null ? "" : this.$moment(params.row.startDate, "YYYY-MM-DD").format("YYYY-MM-DD");
                return h("span", date);
              }
            },
            {
              title: this.$t("m.i.shcpe.endDate"),
              key: "endDate",
              hiddenCol: false,
              render: (h, params) => {
                let date = params.row.endDate == null ? "" : this.$moment(params.row.endDate, "YYYY-MM-DD").format("YYYY-MM-DD");
                return h("span", date);
              }
            },
            {
              title: this.$t("m.i.shcpe.chargeDate"),
              key: "chargeDate",
              hiddenCol: false,
              render: (h, params) => {
                let date = params.row.chargeDate == null ? "" : this.$moment(params.row.chargeDate, "YYYY-MM-DD").format("YYYY-MM-DD");
                return h("span", date);
              }
            },
            {
              title: this.$t("m.i.common.brchName"),
              key: "branchName",
              hiddenCol: false
            },
            {
              title: this.$t("m.i.shcpe.transAmt"),
              key: "transAmt",
              hiddenCol: false,
              render: (h, params) => {
                return h('div', [
                  h('span', formatNumber(params.row.transAmt, 2, ','))
                ]);
              }
            },
            {
              title: this.$t("m.i.shcpe.settleTransferAmt"),
              key: "settleTransferAmt",
              hiddenCol: false,
              render: (h, params) => {
                return h('div', [
                  h('span', formatNumber(params.row.settleTransferAmt, 2, ','))
                ]);
              }
            },
            {
              title: this.$t("m.i.shcpe.acctAmt"),
              key: "acctAmt",
              hiddenCol: false,
              render: (h, params) => {
                return h('div', [
                  h('span', formatNumber(params.row.acctAmt, 2, ','))
                ]);
              }
            },
            {
              title: this.$t("m.i.shcpe.otherAmt"),
              key: "otherAmt",
              hiddenCol: false,
              render: (h, params) => {
                return h('div', [
                  h('span', formatNumber(params.row.otherAmt, 2, ','))
                ]);
              }
            },
            {
              title: this.$t("m.i.shcpe.terminalAmt"),
              key: "terminalAmt",
              hiddenCol: false,
              render: (h, params) => {
                return h('div', [
                  h('span', formatNumber(params.row.terminalAmt, 2, ','))
                ]);
              }
            },
            {
              title: this.$t("m.i.shcpe.totalCalFeeAmt"),
              key: "totalCalFeeAmt",
              hiddenCol: false,
              render: (h, params) => {
                return h('div', [
                  h('span', formatNumber(params.row.totalCalFeeAmt, 2, ','))
                ]);
              }
            },
            {
              title: this.$t("m.i.shcpe.totalPreferentialAmt"),
              key: "totalPreferentialAmt",
              hiddenCol: false,
              render: (h, params) => {
                return h('div', [
                  h('span', formatNumber(params.row.totalPreferentialAmt, 2, ','))
                ]);
              }
            },
            {
              title: this.$t("m.i.shcpe.totalInterestAmt"),
              key: "totalInterestAmt",
              hiddenCol: false,
              render: (h, params) => {
                return h('div', [
                  h('span', formatNumber(params.row.totalInterestAmt, 2, ','))
                ]);
              }
            },
            {
              title: this.$t("m.i.shcpe.totalFeeAmt"),
              key: "totalFeeAmt",
              hiddenCol: false,
              render: (h, params) => {
                return h('div', [
                  h('span', formatNumber(params.row.totalFeeAmt, 2, ','))
                ]);
              }
            },
            {
              title: this.$t("m.i.shcpe.payBrch"),
              key: "acctBranchNo",
              hiddenCol: false
            },
            {
              title: this.$t("m.i.shcpe.ccpcMsgId"),
              key: "ccpcMsgId",
              hiddenCol: false
            }
          ],

          detailColumns : [
            {
              title: this.$t("m.i.common.index"),
              type: 'index',
              align: 'center',
              hiddenCol: false
            },
            {
              title:this.$t("m.i.shcpe.chargeMonth"),
              key: "chargeMonth",
              hiddenCol:false,
              sortable: true,
              render: (h, params) => {
                let date = params.row.chargeMonth == null ? "" : this.$moment(params.row.chargeMonth, "YYYY-MM").format("YYYY-MM");
                return h("span", date);
              }
            },
            {
              title: this.$t("m.i.common.status"),
              key: "status",
              hiddenCol: false,
              render: (h, params) => {
                let list = this.getDictValueFromMap(this.dictMap, "FeeBillStatus", params.row.status);
                return h("span",
                  {
                    domProps: {
                      title: list
                    }
                  }, list);
              }
            },
            {
              title: this.$t("m.i.shcpe.startDate"),
              key: "startDate",
              hiddenCol: false,
              render: (h, params) => {
                let date = params.row.startDate == null ? "" : this.$moment(params.row.startDate, "YYYY-MM-DD").format("YYYY-MM-DD");
                return h("span", date);
              }
            },
            {
              title: this.$t("m.i.shcpe.endDate"),
              key: "endDate",
              hiddenCol: false,
              render: (h, params) => {
                let date = params.row.endDate == null ? "" : this.$moment(params.row.endDate, "YYYY-MM-DD").format("YYYY-MM-DD");
                return h("span", date);
              }
            },
            {
              title: this.$t("m.i.shcpe.chargeDate"),
              key: "chargeDate",
              hiddenCol: false,
              render: (h, params) => {
                let date = params.row.chargeDate == null ? "" : this.$moment(params.row.chargeDate, "YYYY-MM-DD").format("YYYY-MM-DD");
                return h("span", date);
              }
            },
            {
              title: this.$t("m.i.common.brchName"),
              key: "branchName",
              hiddenCol: false
            },
            {
              title: this.$t("m.i.shcpe.transAmt"),
              key: "transAmt",
              hiddenCol: false,
              render: (h, params) => {
                return h('div', [
                  h('span', formatNumber(params.row.transAmt, 2, ','))
                ]);
              }
            },
            {
              title: this.$t("m.i.shcpe.settleTransferAmt"),
              key: "settleTransferAmt",
              hiddenCol: false,
              render: (h, params) => {
                return h('div', [
                  h('span', formatNumber(params.row.settleTransferAmt, 2, ','))
                ]);
              }
            },
            {
              title: this.$t("m.i.shcpe.acctAmt"),
              key: "acctAmt",
              hiddenCol: false,
              render: (h, params) => {
                return h('div', [
                  h('span', formatNumber(params.row.acctAmt, 2, ','))
                ]);
              }
            },
            {
              title: this.$t("m.i.shcpe.otherAmt"),
              key: "otherAmt",
              hiddenCol: false,
              render: (h, params) => {
                return h('div', [
                  h('span', formatNumber(params.row.otherAmt, 2, ','))
                ]);
              }
            },
            {
              title: this.$t("m.i.shcpe.terminalAmt"),
              key: "terminalAmt",
              hiddenCol: false,
              render: (h, params) => {
                return h('div', [
                  h('span', formatNumber(params.row.terminalAmt, 2, ','))
                ]);
              }
            },
            {
              title: this.$t("m.i.shcpe.totalCalFeeAmt"),
              key: "totalCalFeeAmt",
              hiddenCol: false,
              render: (h, params) => {
                return h('div', [
                  h('span', formatNumber(params.row.totalCalFeeAmt, 2, ','))
                ]);
              }
            },
            {
              title: this.$t("m.i.shcpe.totalPreferentialAmt"),
              key: "totalPreferentialAmt",
              hiddenCol: false,
              render: (h, params) => {
                return h('div', [
                  h('span', formatNumber(params.row.totalPreferentialAmt, 2, ','))
                ]);
              }
            },
            {
              title: this.$t("m.i.shcpe.totalInterestAmt"),
              key: "totalInterestAmt",
              hiddenCol: false,
              render: (h, params) => {
                return h('div', [
                  h('span', formatNumber(params.row.totalInterestAmt, 2, ','))
                ]);
              }
            },
            {
              title: this.$t("m.i.shcpe.totalFeeAmt"),
              key: "totalFeeAmt",
              hiddenCol: false,
              render: (h, params) => {
                return h('div', [
                  h('span', formatNumber(params.row.totalFeeAmt, 2, ','))
                ]);
              }
            }
          ],
          currentSelectRow:[],
        }
      },
      methods: {
        handleChargeMonthChange() {
          if (this.formItem.chargeMonthRange.length > 0) {
            let range = this.formItem.chargeMonthRange.replace(/-/g, "");
            let DateRange = range.split("  ");
            this.formItem.minChargeMonth = DateRange[0];
            this.formItem.maxChargeMonth = DateRange[1];
          } else {
            this.formItem.minChargeMonth = "";
            this.formItem.maxChargeMonth = "";
          }
        },
        handleCurrentChange(currentRow) {
          this.currentSelectRow = currentRow;
        },
        handleCurrentChangeCancel() {
          this.currentSelectRow = [];
        },
        infoWinClose(){
          this.showInfoWin=false;
        },
        account() {
          if (this.currentSelectRow !== null && this.currentSelectRow.length !== 0) {
            this.$hMsgBox.confirm({
              title: this.$t("m.i.common.confirm"),
              content: "确定记账吗?",
              onOk: () => {
                this.getEntryInfo();
              }
            });
          }else {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
          }
        },

        //获取分录信息
        getEntryInfo() {
          let list = this.currentSelectRow;
          if (null === list || list.length === 0) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
            return;
          }
          this.acctRecordParam = {id: this.currentSelectRow.id}
          this.showAcctRecordWin = true;
        },
        acctSubmitSure(info) {
          let param = {id: this.currentSelectRow.id};
          this.acctSubmitFlag = true;
          post(param, "/shcpe/cpes/fee/feeBillAccount").then(res => {
            this.acctSubmitFlag = false;
            if(res) {
              let msg = res.data.retMsg;
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.$msgTip.success(this);
                this.showPrintButton = true;
                if (!info.isHasPrint) {
                  this.showAcctRecordWinClose();
                }
              } else {
                this.$msgTip.error(this, { info: msg });
              }
            }
          }).catch(error => {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
          });
        },
        //关闭分录弹窗
        showAcctRecordWinClose() {
          this.showAcctRecordWin = false;
          this.showPrintButton = false;
          this.acctRecordParam = {};
          this.formSearch();
        },
        printSuccessCallback() {
          this.showAcctRecordWinClose();
        },
        queryDetail(){
          if(this.currentSelectRow !== null && this.currentSelectRow.length !== 0){
            this.info.batchId =  this.currentSelectRow.id;
            this.showInfoWin=true;
            this.$refs.datagridInfo.dataChange(1);
          }else{
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          }
        },
        formSearch() {
          this.currentSelectRow = [];
          this.$refs.datagrid.dataChange(1);
        },
        formSearchReset() {
          let userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'));
          this.formItem.branchNos = userInfo.brchNo;
          this.formItem.branchName = userInfo.brchName;
          this.formItem.minChargeMonth = "";
          this.formItem.maxChargeMonth = "";
          this.$refs.formItem.resetFields();
        },
      },
      created() {

      },
      mounted() {
        getDictListByGroups("FeeBillStatus").then(res => {
          this.statusList = res.get("FeeBillStatus");
          this.dictMap = res.get("map");
        });
      }
    }
</script>

<style scoped>

</style>
