<template>
  <div>
    <h-msg-box v-model="tempQuoteChangeWin" :mask-closable="false" @on-close="handleClose" :maximize="true" width="1000"
               :height="600" :footerHide="true">
      <p slot="header">
        <span>修改历史查看</span>
      </p>
      <div>
        <h-form :model="formItem" :label-width="100" ref="formItem" cols="3" class="h-form-search">
          <common-select v-model="formItem.busiType" :label="$t('m.i.common.busiType')" prop="busiType" :dictList="dictMap.dcBusiTypeList" readonly></common-select>
          <common-input v-model="formItem.quoteNo" :label="$t('m.i.be.quoteNo')" prop="quoteNo" readonly></common-input>
          <common-select v-model="formItem.reqNum" :label="$t('m.i.be.reqNum')" prop="reqNum" :dictList="tradeCount" @on-change='reqNumChange' :clearable="false"></common-select>
          <common-input v-model="formItem.brokerBrchName" :label="$t('m.i.be.brokerBrchName')" prop="brokerBrchName" readonly></common-input>
          <common-input v-model="formItem.brokerTraderName" :label="$t('m.i.be.brokerTraderName')" prop="brokerTraderName" class="h-form-long-label" readonly></common-input>
          <common-input v-model="formItem.discBrchName" :label="$t('m.i.be.discBrchName')" prop="discBrchName" readonly></common-input>
          <common-input v-model="formItem.discTraderName" :label="$t('m.i.be.discTraderName')" prop="discTraderName" class="h-form-long-label" readonly></common-input>
          <common-select v-model="formItem.billType" :label="$t('m.i.billInfo.billType')" prop="billType" :dictList="dictMap.billTypeList" readonly></common-select>
          <common-select v-model="formItem.billClass" :label="$t('m.i.billInfo.billClass')" prop="billClass" :dictList="dictMap.billClassList" readonly></common-select>
          <common-input v-model="formItem.ratePct" :label="$t('m.i.pe.discRate')" prop="ratePct" readonly></common-input>
          <common-select v-model="formItem.clearSpeed" :label="$t('m.i.be.clearSpeed')" prop="clearSpeed" :dictList="dictMap.clearSpeedList" readonly></common-select>
          <common-select v-model="formItem.clearMode" :label="$t('m.i.be.settleMode')" prop="clearMode" :dictList="dictMap.discClearModeList" readonly></common-select>
          <common-select v-model="formItem.subDeal" :label="$t('m.i.be.subDeal')" prop="subDeal" :dictList="dictMap.yonList" readonly></common-select>
          <common-date-picker v-model="formItem.firstSettleDt" :label="$t('m.i.be.settleDt')" prop="firstSettleDt" readonly></common-date-picker>
          <common-time-picker v-model="formItem.quoteTm" :label="$t('m.i.be.quoteTm')" prop="quoteTm" class="h-form-long-label" readonly></common-time-picker>
          <common-input v-model="formItem.totalAmt" :label="$t('m.i.be.totalAmtByYUAN')" prop="totalAmt" readonly></common-input>
          <common-input v-model="formItem.totalNum" :label="$t('m.i.be.totalNum')" prop="totalNum" readonly></common-input>
          <common-input v-model="formItem.firstPayInterest" :label="$t('m.i.be.payInterestByUnit')" prop="firstPayInterest" readonly></common-input>
          <common-input v-model="formItem.firstSettleAmt" :label="$t('m.i.be.settleAmtByUnit')" prop="firstSettleAmt" readonly></common-input>
          <common-input v-model="formItem.remainDays" :label="$t('m.i.be.remainingPeriod')" prop="remainDays" readonly></common-input>
          <common-input v-model="formItem.diffMsg" :label="$t('m.i.be.diffMsg')" prop="diffMsg" type="textarea" readonly :autosize="{minRows: 2, maxRows: 4}" class="h-form-height-auto" style="width:80%"></common-input>
        </h-form>
      </div>
      <!-- 数据展示表格 -->
      <h-datagrid :columns="columns"
                  :url="billListURL"
                  :bindForm="billFormItem"
                  :onSelectChange="quoteBillSelectClick"
                  :rowSelect="true"
                  :auto-load="false"
                  ref="billDatagrid">
      </h-datagrid>
    </h-msg-box>
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="billId"
                    :billNo="billNo"></bill-info-main>
  </div>
</template>
<script>
  import { post, on, off, formatNumber,getDictValueFromMap } from "@/api/bizApi/commonUtil";

  export default {
    name: "quoteHistChange",
    data() {
      return {
        formItem: {
          id: "",
          busiType: "",
          quoteNo: "",
          reqNum: "",
          brokerBrchName: "",
          brokerTraderName: "",
          discBrchName: "",
          discTraderName: "",
          billClass: "",
          billType: "",
          ratePct: "",
          clearSpeed: "",
          clearMode: "",
          subDeal: "",
          firstSettleDt: "",
          quoteTm: "",
          totalAmt: "",
          totalNum: "",
          firstPayInterest: "",
          firstSettleAmt: "",
          remainDays: "",
          diffMsg: "",
        },
        billFormItem: { batchId: null },
        columns: [
          {
            type: "selection",
            width: 50,
            hiddenCol: false,
            align: "center"
          },
          {
            type: "index",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center"
          },
          {
            title: this.$t("m.i.billInfo.billNo"),
            key: "billNo",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (this.trDir === "TDD01") {
                return h("span", params.row.billNo);
              }
              return h("a", {
                on: {
                  click: () => {
                    this.billInfoWinOpen(params.row.billId, params.row.billNo);
                  }
                }
              }, params.row.billNo);
            }
          },
          {
            title: this.$t("m.i.billInfo.billMoneyByUnit"),
            key: "billMoney",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("p", formatNumber(params.row.billMoney, 2, ","));
            }
          },
          {
            title: this.$t("m.i.billInfo.dueDt"),
            key: "dueDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("span", params.row.dueDt ? this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          },
          {
            title: this.$t("m.i.billInfo.dueMatDt"),
            key: "dueMatDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("span", params.row.dueMatDt ? this.$moment(params.row.dueMatDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          },
          {
            title: this.$t('m.i.billInfo.drwrName'),
            key: "drwrName",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.acptName"),
            key: "acptName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.acptBankNo"),
            key: "acptBankNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.acptBankName"),
            key: "acptBankName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.discountApplyAcctNo"),
            key: "discFundsInAcctNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.remainDays'),
            key: "remainDays",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.payInterestByUnit'),
            key: "firstPayInterest",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', formatNumber(params.row.firstPayInterest, 2, ','))
            }
          },
          {
            title: this.$t('m.i.be.settleAmtByUnit'),
            key: "firstSettleAmt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', formatNumber(params.row.firstSettleAmt, 2, ','))
            }
          },
        ],
        quoteBillSelectList: [],
        quoteBillSelectRowInx: [],
        tradeCount: [],
        importSelect: false,
        selectDataFirst: false,
        showBillInfoWin: false,
        billType: "",
        billClass: "",
        maxNum: "",
        temIsQuoteNew: "",
        billId: "",
        billNo: "",
      };
    },
    props: {
      trDir: String,//交易方向：买入、卖出、正回购、逆回购
      quoteNo: String,// 报价单编号
      isQuoteNew: String,//是否最新报价
      reqNum: String,//请求次数
      dictMap: {
        type: Object,
        default() {
          return {
            dcBusiTypeList: [],//贴现通业务类型
            billTypeList: [],//票据种类
            billClassList: [],//票据介质
            corpScaleList: [],//企业规模
            industryList: [],//行业类型
            yonList: [],//是否
            provinceList: [],//省份
            clearSpeedList: [],//清算速度
            discClearModeList: [],//贴现通清算模式
          };
        }
      },
      initURL: {
        type: String,
        default() {
          return "/be/discquote/disc/quote/func_findQuoteHist";
        }
      },
      billListURL: {
        type: String,
        default() {
          return "/be/discquote/disc/quote/func_findQuoteHistBill";
        }
      },
      quoteHistChangeWin: {
        type: Boolean,
        default() {
          return false;
        }
      }
    },
    computed: {
      tempQuoteChangeWin: {
        get() {
          return this.quoteHistChangeWin;
        },
        set() {

        }
      },
    },
    watch: {
      quoteHistChangeWin(val) {
        if (val) {
          this.temIsQuoteNew = this.isQuoteNew;
          this.init();
        }
      }
    },
    methods: {
      billInfoWinClose() {
        this.billId = null;
        this.billNo = null;
        this.showBillInfoWin = false;
      },
      billInfoWinOpen(billId, billNo) {
        this.billId = billId;
        this.billNo = billNo;
        this.showBillInfoWin = true;
      },
      handleClose() {
        this.maxNum = null;
        this.$emit("quoteHistChangeWinClose", "");
      },
      //选择记录
      quoteBillSelectClick(arr, selectInx) {
        this.quoteBillSelectList = arr;
        this.quoteBillSelectRowInx = selectInx;
      },
      //  初始化页面;
      init() {
        let quoteNo = this.quoteNo;
        let trDir = this.trDir;
        let reqNum = null;
        let txIsQuoteNew = null;
        if (this.temIsQuoteNew) {
          txIsQuoteNew = this.temIsQuoteNew;
        } else {
          reqNum = this.formItem.reqNum;
        }
        post({ quoteNo: quoteNo, trDir: trDir, isQuoteNew: txIsQuoteNew, index: reqNum }, this.initURL).then(res => {
          if (res && res.data) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$nextTick(() => {
                let obj = res.data.retData;
                if (obj) {
                  this.formItem = obj;
                  if (!this.maxNum) {
                    this.maxNum = this.formItem.reqNum;
                  }
                  for (let i = 1; i <= this.maxNum; i++) {
                    this.tradeCount[i - 1] = {key:i, value:"第"+i+"次"};
                  }
                  if (this.formItem.firstSettleDt) {
                    this.formItem.firstSettleDt = this.$moment(this.formItem.firstSettleDt, "YYYYMMDD").format("YYYY-MM-DD");
                  }
                  this.billFormItem.batchId = this.formItem.id;
                  if (this.formItem.id) {
                    this.$refs.billDatagrid.dataChange(1);
                  }
                }
              });
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      },
      reqNumChange(){
        if(this.temIsQuoteNew){
          this.temIsQuoteNew = null;
        }else{
          this.init();
        }
      }
    },
  };
</script>

