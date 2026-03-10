<template>
  <div>
    <h-msg-box v-model="tempQuoteApplyMainAddWin" :maximize="true" :mask-closable="false" @on-close="handleClose"
               width="1000" class="h-form-search-layer" top="10" @on-maximize="onMaximize">
      <p slot="header">
        <span>修改报价</span>
      </p>
      <div>
        <h-form :model="addOrEditForm" :label-width="115" ref="addOrEditForm" cols="3" class="h-form-search" onlyBlurRequire>
          <common-select v-model="addOrEditForm.quoteMode" :label="$t('m.i.be.quoteMode')" prop="quoteMode" :dictList="batchParams.quoteModeList" required :readonly="addOrEditForm.isNewOffer === '1'"></common-select>
          <common-select v-model="addOrEditForm.busiType" :label="$t('m.i.common.busiType')" prop="busiType" :dictList="batchParams.DCBusiTypeList" readonly></common-select>
          <common-select v-model="addOrEditForm.tradeMode" :label="$t('m.i.be.sourceTransMode')" prop="tradeMode" :dictList="batchParams.sourceTransModeList" readonly></common-select>
          <common-input v-model="addOrEditForm.busiNo" :label="$t('m.i.be.sourceBusiNo')" prop="busiNo" readonly></common-input>
          <common-input v-model="addOrEditForm.quoteNo" :label="$t('m.i.be.quoteNo')" prop="quoteNo" readonly></common-input>
          <common-input v-model="addOrEditForm.discBrchName" :label="$t('m.i.be.brchName')" prop="discBrchName" readonly></common-input>
          <common-input v-model="addOrEditForm.discTraderName" :label="$t('m.i.be.traderName')" prop="discTraderName" readonly></common-input>
          <common-input v-model="addOrEditForm.brokerBrchName" :label="$t('m.i.be.otherBrchName')" prop="brokerBrchName" readonly></common-input>
          <common-input v-model="addOrEditForm.brokerTraderName" :label="$t('m.i.be.custTraderName')" prop="brokerTraderName" readonly></common-input>
          <common-select v-model="addOrEditForm.billType" :label="$t('m.i.billInfo.billType')" prop="billType" :dictList="batchParams.billTypeList" readonly></common-select>
          <common-select v-model="addOrEditForm.billClass" :label="$t('m.i.billInfo.billClass')" prop="billClass" :dictList="batchParams.billClassList" readonly></common-select>
          <common-input v-model="addOrEditForm.discCustName" :label="$t('m.i.ce.discountApplyName')" prop="discCustName" readonly></common-input>
          <common-input v-model="addOrEditForm.discOutSocCode" :label="$t('m.i.ce.discountApplySocCode')" prop="discOutSocCode" readonly class="h-form-long-label"></common-input>
          <common-select v-model="addOrEditForm.discCorpScale" :label="$t('m.i.be.discCorpScale')" prop="discCorpScale" :dictList="batchParams.corpScaleList" readonly class="h-form-long-label"></common-select>
          <common-select v-model="addOrEditForm.discIndustry" :label="$t('m.i.be.discIndustry')" prop="discIndustry" :dictList="batchParams.industryList" readonly class="h-form-long-label"></common-select>
          <common-select v-model="addOrEditForm.isDiscArc" :label="$t('m.i.be.isDiscArc')" prop="isDiscArc" :dictList="batchParams.yonList" readonly class="h-form-long-label"></common-select>
          <common-select v-model="addOrEditForm.isDiscGreenCorp" :label="$t('m.i.be.isDiscGreen')" prop="isDiscGreenCorp" :dictList="batchParams.yonList" readonly class="h-form-long-label"></common-select>
          <common-select v-model="addOrEditForm.isDiscTechnologyCorp" :label="$t('m.i.be.isDiscTechnologyCorp')" prop="isDiscTechnologyCorp" :dictList="batchParams.yonList" readonly class="h-form-long-label"></common-select>
          <common-select v-model="addOrEditForm.isDiscPrivateCorp" :label="$t('m.i.be.isDiscPrivateCorp')" prop="isDiscPrivateCorp" :dictList="batchParams.yonList" readonly class="h-form-long-label"></common-select>
          <common-select v-model="addOrEditForm.area" :label="$t('m.i.be.discProv')" prop="area" :dictList="batchParams.provinceList" readonly class="h-form-long-label"></common-select>
          <common-input v-model="addOrEditForm.discOutBankNo" :label="$t('m.i.be.discOutBankNo')" prop="discOutBankNo" readonly class="h-form-long-label"></common-input>
          <common-input v-model="addOrEditForm.ratePct" :label="$t('m.i.pe.discRate')" prop="ratePct" :validRules="ratePctRule" required></common-input>
          <common-select v-model="addOrEditForm.clearSpeed" :label="$t('m.i.be.clearSpeed')" prop="clearSpeed" :dictList="batchParams.clearSpeedList" required @on-change="changeSpeed"></common-select>
          <common-select v-model="addOrEditForm.clearMode" :label="$t('m.i.be.settleMode')" prop="clearMode" :dictList="batchParams.discClearModeList" required></common-select>
          <common-select v-model="addOrEditForm.subDeal" :label="$t('m.i.be.subDeal')" prop="subDeal" :dictList="batchParams.yonList" readonly></common-select>
          <common-date-picker v-model="addOrEditForm.firstSettleDt" :label="$t('m.i.be.settleDt')" prop="firstSettleDt" readonly></common-date-picker>
          <common-time-picker v-model="addOrEditForm.quoteTm" :label="$t('m.i.be.quoteTm')" prop="quoteTm" required></common-time-picker>
          <common-input v-model="addOrEditForm.totalAmt" :label="$t('m.i.be.totalAmtByYUAN')" prop="totalAmt" readonly></common-input>
          <common-input v-model="addOrEditForm.totalNum" :label="$t('m.i.be.totalNum')" prop="totalNum" readonly></common-input>
          <common-input v-model="addOrEditForm.firstPayInterest" :label="$t('m.i.be.firstPayInterest')" prop="firstPayInterest" readonly></common-input>
          <common-input v-model="addOrEditForm.firstSettleAmt" :label="$t('m.i.be.firstSettleAmt')" prop="firstSettleAmt" readonly></common-input>
          <common-input v-model="addOrEditForm.remainDays" :label="$t('m.i.be.remainingPeriod')" prop="remainDays" readonly></common-input>
          <common-input v-model="addOrEditForm.fileNum" :label="$t('m.i.be.fileNum')" prop="fileNum" readonly></common-input>
          <common-input v-model="addOrEditForm.quoteRemark" :label="$t('m.i.common.remark')" prop="quoteRemark" type="textarea" :maxlength="300" :autosize="{minRows: 2, maxRows: 4}" class="h-form-height-auto" style="width:80%"></common-input>
          <common-input v-model="addOrEditForm.preChangeInfo" :label="$t('m.i.be.diffMsg')" prop="preChangeInfo" type="textarea" readonly :autosize="{minRows: 2, maxRows: 4}" class="h-form-height-auto" style="width:80%"></common-input>
          <h-form-item label="" prop="prodName"  class="h-form-three">
            <h-button type="primary" @click="saveBatch()">{{$t('m.i.common.save')}}</h-button>
          </h-form-item>
        </h-form>
        <!--数据展示表格-->
        <h-datagrid
            :columns="columns"
            highlight-row
            :auto-load="false"
            url="/be/discquote/disc/quote/quoteApplyMain/func_getQuoteBillList"
            :bindForm="dataGridFormItem"
            :has-select="false"
            :rowSelect="true"
            ref="datagrid">
          <div slot="toolbar" class="pull-left">
            <h-button type="primary" @click="calcInterest()">{{$t("m.i.be.calcInterest")}}</h-button>
            <h-button type="primary" @click="resetQuote()">{{$t("m.i.be.resetQuote")}}</h-button>
            <h-button type="primary" @click="showAttach()">{{$t("m.i.common.showAttach")}}</h-button>
            <h-button type="primary" @click="preDelBill()" v-if="addOrEditForm.tradeMode !== '2' && addOrEditForm.subDeal === '1'">{{$t("m.i.be.preDelBill")}}</h-button>
            <h-button type="primary" @click="replyDel()" v-if="addOrEditForm.tradeMode !== '2'  && addOrEditForm.subDeal === '1'">{{$t("m.i.be.replyDel")}}</h-button>
            <h-button type="primary" @click="applySubmit()">{{$t("m.i.be.applyBatch")}}</h-button>
          </div>
        </h-datagrid>
      </div>
      <div slot="footer">
      </div>
    </h-msg-box>
    <show-file-win :showFileWin="showFileWin" :batchId="batchId" operType="show" @showFileWinClose="showFileWinClose"
                   sourceType="DDD" :filePathUrl="filePathUrl"></show-file-win>
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billNo="billNo"></bill-info-main>
  </div>
</template>

<script>
  import { post, formatNumber, getDictValueFromMap } from "@/api/bizApi/commonUtil";

  export default {
    name: "quoteApplyMainAdd",
    data() {
      return {
        addOrEditForm: {
          id: "",
          quoteMode: "",
          quoteNo: "",
          busiNo: "",
          discBrchName: "",
          discTraderName: "",
          brokerBrchName: "",
          brokerTraderName: "",
          billType: "",
          billClass: "",
          discCustName: "",
          discOutSocCode: "",
          discCorpScale: "",
          discIndustry: "",
          isDiscArc: "",
          isDiscGreenCorp: "",
          isDiscTechnologyCorp: "",
          isDiscPrivateCorp: "",
          area: "",
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
          quoteRemark: "",
          isNewOffer: "",
        },
        dataGridFormItem: {
          batchId: ""
        },
        columns: [
          {
            type: "selection",
            width: 50,
            align: "center",
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
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('a', {
                on: {
                  click: () => {
                    this.billInfoWinOpen(params.row.billNo)
                  }
                }
              }, params.row.billNo)
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
            title: this.$t('m.i.common.status'),
            key: 'preRelationFlag',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue =getDictValueFromMap(this.batchParams.dictListMap, 'PreRelationFlag', params.row.preRelationFlag);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.billInfo.dueDt'),
            key: 'dueDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('span', params.row.dueDt?this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD"):"")
            }
          },
          {
            title: this.$t('m.i.billInfo.dueMatDt'),
            key: 'dueMatDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('span', params.row.dueMatDt?this.$moment(params.row.dueMatDt, "YYYY-MM-DD").format("YYYY-MM-DD"):"")
            }
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
            title: this.$t('m.i.be.remainingPeriod'),
            key: "remainDays",
            hiddenCol: false,
            sortable: true,
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
        ratePctRule :[
        {
          test: this.validRatePct,
          trigger:'blur',
        }],
        batchId: "",
        showFileWin: false,
        isCurChange: false,
        showBillInfoWin:false,
        billNo:"",
        filePathUrl: "/be/discquote/disc/quote/quoteApplyMain/"
      }
    },
    components: {
      ShowFileWin: () => import(/* webpackChunkName: "be/discquote/file/showFileWin" */`@/views/bizViews/be/discquote/file/showFileWin`)
    },
    props: {
      quoteApplyMainAddWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      batchParams: {
        type: Object,
        default() {
          return {};
        }
      }
    },
    computed: {
      tempQuoteApplyMainAddWin: {
        get() {
          return this.quoteApplyMainAddWin;
        },
        set() {
        }
      }
    },
    watch: {
      quoteApplyMainAddWin(val) {
        if (val) {
          this.dataGridFormItem.batchId = this.batchParams.batchId;
          this.isCurChange = false;
          this.queryObjById();
          this.$nextTick(()=>{
            this.$refs.datagrid.dataChange(1);
          });
        }
      },
    },
    methods: {
      onMaximize() {
        setTimeout(() => {
          this.$refs.datagrid.$refs.gridContent.handleResize();
        }, 100);
      },
      handleClose(){
        this.$refs.addOrEditForm.resetFields();
        this.addOrEditForm.id = "";
        this.$emit("quoteApplyMainAddWinClose", "");
      },
      saveBatch(){
        this.saveBatchFunc(res => {
          this.$refs.datagrid.dataChange(1);
          this.$msgTip.success(this);
        })
      },
      calcInterest(){
        this.$hMsgBox.confirm({
          title: "利息计算信息",
          content: "确定要利息计算吗？",
          onOk: () => {
            this.saveBatchFunc(() => {
              let params = {batchId: this.batchParams.batchId};
              let url = "/be/discquote/disc/quote/quoteApplyMain/func_calcInterest";
              this.sendPost(params, url, res => {
                this.addOrEditForm = res.data.retData;
                this.addOrEditForm.firstSettleDt = this.$moment(this.addOrEditForm.firstSettleDt, "YYYYMMDD").format("YYYY-MM-DD");
                this.$msgTip.success(this);
              });
            })
          }
        });
      },
      resetQuote(){
        this.$hMsgBox.confirm({
          title: "重置报价信息",
          content: "确定要重置报价吗？",
          onOk: () => {
            let params = {batchId: this.batchParams.batchId};
            let url = "/be/discquote/disc/quote/quoteApplyMain/func_resetQuoteInfo";
            this.sendPost(params, url, res => {
              this.addOrEditForm = res.data.retData;
              this.addOrEditForm.firstSettleDt = this.$moment(this.addOrEditForm.firstSettleDt, "YYYYMMDD").format("YYYY-MM-DD");
              this.$msgTip.success(this);
            });
          }
        });
      },
      showAttach() {
        this.batchId = this.batchParams.batchId;
        this.showFileWin = true;
      },
      showFileWinClose() {
        this.showFileWin = false;
      },
      billInfoWinClose(){
        this.billNo=null;
        this.showBillInfoWin=false;
      },
      billInfoWinOpen(billNo){
        this.billNo=billNo;
        this.showBillInfoWin=true;
      },
      applySubmit(){
        this.$hMsgBox.confirm({
          title: "提交申请信息",
          content: "确定要提交申请吗？",
          onOk: () => {
            this.saveBatchFunc(() => {
              let params = {batchId: this.batchParams.batchId};
              let url = "/be/discquote/disc/quote/quoteApplyMain/func_commitApply";
              this.sendPost(params, url, res => {
                this.$msgTip.success(this);
                this.handleClose();
              });
            })
          }
        });
      },
      preDelBill(){
        let billIds = this.$refs.datagrid.selectIds;
        if(billIds && billIds.length > 0){
          this.$hMsgBox.confirm({
            title: "预删除信息",
            content: "确定要预删除吗？",
            onOk: () => {
              this.saveBatchFunc(() => {
                let params = {batchId: this.batchParams.batchId, billIds: billIds};
                let url = "/be/discquote/disc/quote/quoteApplyMain/func_removeBill";
                this.sendPost(params, url, res => {
                  this.addOrEditForm = res.data.retData;
                  this.addOrEditForm.firstSettleDt = this.$moment(this.addOrEditForm.firstSettleDt, "YYYYMMDD").format("YYYY-MM-DD");
                  if(this.addOrEditForm.errMsg){
                    this.$msgTip.info(this, { info: this.addOrEditForm.errMsg });
                  }else{
                    this.$msgTip.success(this);
                  }
                });
              })
            }
          });
        }else{
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      replyDel(){
        let billIds = this.$refs.datagrid.selectIds;
        if(billIds && billIds.length > 0){
          this.$hMsgBox.confirm({
            title: "恢复预删除信息",
            content: "确定要恢复预删除吗？",
            onOk: () => {
              this.saveBatchFunc(() => {
                let params = {batchId: this.batchParams.batchId, billIds: billIds};
                let url = "/be/discquote/disc/quote/quoteApplyMain/func_revertBill";
                this.sendPost(params, url, res => {
                  this.addOrEditForm = res.data.retData;
                  this.addOrEditForm.firstSettleDt = this.$moment(this.addOrEditForm.firstSettleDt, "YYYYMMDD").format("YYYY-MM-DD");
                  if(this.addOrEditForm.errMsg){
                    this.$msgTip.info(this, { info: this.addOrEditForm.errMsg });
                  }else {
                    this.$msgTip.success(this);
                  }
                });
              })
            }
          });
        }else{
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      queryObjById() {
        let params = { id: this.batchParams.batchId };
        let url = "/be/discquote/disc/quote/quoteApplyMain/func_showQuoteDetail";
        post(params, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.addOrEditForm = res.data.retData;
              this.addOrEditForm.firstSettleDt = this.$moment(this.addOrEditForm.firstSettleDt, "YYYYMMDD").format("YYYY-MM-DD");
            }
          }
        });
      },
      saveBatchFunc(callback){
        this.$refs["addOrEditForm"].validate(valid => {
          if (valid) {
            this.addOrEditForm.firstSettleDt = this.addOrEditForm.firstSettleDt.replace(/-/g, "");
            let url = "/be/discquote/disc/quote/quoteApplyMain/func_editApply";
            post(this.addOrEditForm, url).then(res => {
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.batchId = res.data.retData.id;
                  this.addOrEditForm = res.data.retData;
                  this.addOrEditForm.firstSettleDt = this.$moment(this.addOrEditForm.firstSettleDt, "YYYYMMDD").format("YYYY-MM-DD");
                  this.$refs.datagrid.selects = [];
                  this.$refs.datagrid.selectIds = [];
                  callback();
                } else {
                  this.$msgTip.error(this, { info: msg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      sendPost(params, url, callback) {
        post(params, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              callback(res);
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
          this.$refs.datagrid.dataChange(1);
        });
      },
      changeSpeed(currVal) {
        if (!this.isCurChange) {
          this.isCurChange = true;
          return;
        }
        let workDt = window.sessionStorage.getItem("workDate");
        // T+1 情况
        if (currVal === "CS01") {
          let workDate = this.$moment(workDt, "YYYYMMDD").format("YYYY/MM/DD");
          workDate = new Date(workDate);
          let workDatePlus = workDate.valueOf() + (1 * 24 * 60 * 60 * 1000);
          workDatePlus = new Date(workDatePlus);
          workDatePlus = this.$moment(workDatePlus, "YYYYMMDD").format("YYYYMMDD");
          post({ code: workDatePlus }, "/sm/oper/holiday/getWorkDate").then(res => {
            if (res && res.data.retCode === "000000") {
              this.addOrEditForm.firstSettleDt = this.$moment(res.data.retData, "YYYYMMDD").format("YYYY-MM-DD");
            }
          });
        } else {
          this.addOrEditForm.firstSettleDt = this.$moment(workDt, "YYYYMMDD").format("YYYY-MM-DD");
        }

      },
      validRatePct(rule, val, callback){
        this.addOrEditForm.minRate = this.addOrEditForm.minRate ? parseFloat(this.addOrEditForm.minRate) : 0;
        this.addOrEditForm.maxRate = this.addOrEditForm.maxRate ? parseFloat(this.addOrEditForm.maxRate) : 100;

        if(this.addOrEditForm.minRate <= val && this.addOrEditForm.maxRate >= val && /^(\d{1,2}(\.\d{1,4})?|100)$/.test(val)){
          callback()
        }else{
          callback(new Error("利率范围" + this.addOrEditForm.minRate + "~" + this.addOrEditForm.maxRate + "，且小数位不超过四位"))
        }
      }
    }
  };
</script>

<style scoped>

</style>
