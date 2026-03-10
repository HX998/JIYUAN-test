<template>
  <div>
    <h-msg-box v-model="tempQuoteApplyDetailWin" maximize width="1000" :mask-closable="false" @on-close="handleClose" top="10"
               @on-maximize="onMaximize">
      <p slot="header">
        <span>{{$t("m.i.common.showDetail")}}</span>
      </p>
      <div class="text-body">
        <h-row :gutter="16">
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.common.batchNo")}}:</h-col>
              <h-col span="15" class="val">{{viewDatailForm.batchNo}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.quoteNo")}}:</h-col>
              <h-col span="15" class="val">{{viewDatailForm.quoteNo}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.sourceBusiNo")}}:</h-col>
              <h-col span="15" class="val">{{viewDatailForm.busiNo}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.common.busiType")}}：</h-col>
              <h-col span="15" class="val">{{formatDictValue("DCBusiType",viewDatailForm.busiType)}}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <br>
        <h-row :gutter="16">
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.sourceTransMode")}}：</h-col>
              <h-col span="15" class="val">{{formatDictValue("SourceTransMode",viewDatailForm.tradeMode)}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.quoteStatus")}}：</h-col>
              <h-col span="15" class="val">{{formatDictValue("DCQuoteStatus",viewDatailForm.quoteStatus)}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.billInfo.billType")}}：</h-col>
              <h-col span="15" class="val">{{formatDictValue("DraftTypeCode",viewDatailForm.billType)}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.billInfo.billClass")}}：</h-col>
              <h-col span="15" class="val">{{formatDictValue("CDMedia",viewDatailForm.billClass)}}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <br>
        <h-row :gutter="16">
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.brchName")}}：</h-col>
              <h-col span="15" class="val">{{viewDatailForm.discBrchName}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.traderName")}}：</h-col>
              <h-col span="15" class="val">{{viewDatailForm.discTraderName}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.otherBrchName")}}：</h-col>
              <h-col span="15" class="val">{{viewDatailForm.brokerBrchName}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.custTraderName")}}：</h-col>
              <h-col span="15" class="val">{{viewDatailForm.brokerTraderName}}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <br>
        <h-row :gutter="16">
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.ce.discountApplyName")}}:</h-col>
              <h-col span="15" class="val">{{viewDatailForm.discCustName}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.ce.discountApplySocCode")}}:</h-col>
              <h-col span="15" class="val">{{viewDatailForm.discOutSocCode}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.isDiscArc")}}:</h-col>
              <h-col span="15" class="val">{{formatDictValue("Yon",viewDatailForm.isDiscArc)}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.isDiscGreen")}}:</h-col>
              <h-col span="15" class="val">{{formatDictValue("Yon",viewDatailForm.isDiscGreenCorp)}}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <br>
        <h-row :gutter="16">
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.isDiscTechnologyCorp")}}:</h-col>
              <h-col span="15" class="val">{{formatDictValue("Yon",viewDatailForm.isDiscTechnologyCorp)}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.isDiscPrivateCorp")}}:</h-col>
              <h-col span="15" class="val">{{formatDictValue("Yon",viewDatailForm.isDiscPrivateCorp)}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.discProv")}}：</h-col>
              <h-col span="15" class="val">{{formatDictValue("Province",viewDatailForm.area)}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.discCorpScale")}}:</h-col>
              <h-col span="15" class="val">{{formatDictValue("CorpScale",viewDatailForm.discCorpScale)}}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <br>
        <h-row :gutter="16">
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.discIndustry")}}：</h-col>
              <h-col span="15" class="val">{{formatDictValue("Industry",viewDatailForm.discIndustry)}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.discOutBankNo")}}:</h-col>
              <h-col span="15" class="val">{{viewDatailForm.discOutBankNo}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.pe.discRate")}}:</h-col>
              <h-col span="15" class="val">{{viewDatailForm.ratePct}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.totalNum")}}：</h-col>
              <h-col span="15" class="val">{{viewDatailForm.totalNum}}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <br>
        <h-row :gutter="16">
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.totalAmtByYUAN")}}：</h-col>
              <h-col span="15" class="val">{{formatMoney(viewDatailForm.totalAmt)}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.remainingPeriod")}}:</h-col>
              <h-col span="15" class="val">{{viewDatailForm.remainDays}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.settleDt")}}：</h-col>
              <h-col span="15" class="val">{{formatDate(viewDatailForm.firstSettleDt)}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.clearSpeed")}}:</h-col>
              <h-col span="15" class="val">{{formatDictValue("ClearSpeed",viewDatailForm.clearSpeed)}}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <br>
        <h-row :gutter="16">
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.quoteTm")}}：</h-col>
              <h-col span="15" class="val">{{viewDatailForm.quoteTm}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.settleMode")}}：</h-col>
              <h-col span="15" class="val">{{formatDictValue("DiscClearMode",viewDatailForm.clearMode)}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.payInterestByUnit")}}:</h-col>
              <h-col span="15" class="val">{{formatMoney(viewDatailForm.firstPayInterest)}}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <br>
        <h-row :gutter="16">
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.settleAmtByUnit")}}：</h-col>
              <h-col span="15" class="val">{{formatMoney(viewDatailForm.firstSettleAmt)}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.fileNum")}}:</h-col>
              <h-col span="15" class="val">{{viewDatailForm.fileNum}}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.common.remark")}}：</h-col>
              <h-col span="15" class="val">{{viewDatailForm.quoteRemark}}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <br>
      </div>
      <h-datagrid :columns="billsColumns" :autoLoad="false" :url="billsUrl" :bindForm="formItem" ref="bills"
                  :hasSelect="false" rowSelect>
        <div slot="toolbar" class="pull-left">
          <h-button type="primary" @click="showAttach">{{$t("m.i.common.showAttach")}}</h-button>
          <h-button type="primary" @click="listExport">{{$t("m.i.common.listExport")}}</h-button>
        </div>
      </h-datagrid>
      <div slot="footer">
      </div>
    </h-msg-box>
    <show-file-win :showFileWin="showFileWin" :batchId="batchId" operType="show" @showFileWinClose="showFileWinClose"
                   sourceType="DDQ" :filePathUrl="filePathUrl"></show-file-win>
    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param"
                           :rows="this.rows"></common-excel-download>
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billNo="billNo"></bill-info-main>
  </div>
</template>

<script>
  import { post, formatNumber, getDictValueFromMap, exportList } from "@/api/bizApi/commonUtil";

  export default {
    name: "quoteApplyDetail",
    data() {
      return {
        viewDatailForm: {},
        formItem: {
          batchId: ""
        },
        billsColumns: [
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
            title: this.$t("m.i.billInfo.dueDt"),
            key: "dueDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let dt = this.$moment(params.row.dueDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", dt);
            }
          },
          {
            title: this.$t("m.i.billInfo.dueMatDt"),
            key: "dueMatDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let dt = this.$moment(params.row.dueMatDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", dt);
            }
          },
          {
            title: this.$t('m.i.common.status'),
            key: 'preRelationFlag',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.detailParams.dictMap, 'PreRelationFlag', params.row.preRelationFlag);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
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
          {
            title: this.$t("m.i.shcpe.dlvOrderNo"),
            key: "dlvOrderNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.clearStatus"),
            key: "clearStatus",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.detailParams.dictMap, 'DiscStlResult', params.row.clearStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
        ],
        showFileWin: false,
        tempShowExcelTemplateWin: false,
        showBillInfoWin:false,
        billNo:"",
        batchId: "",
        param: "",
        rows: "",
        filePathUrl: ""
      };
    },
    components: {
      ShowFileWin: () => import(/* webpackChunkName: "be/discquote/file/showFileWin" */`@/views/bizViews/be/discquote/file/showFileWin`)
    },
    props: {
      quoteApplyDetailWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      detailParams: {
        type: Object,
        default() {
          return {
            batchId: "",
            dictMap: new Map()
          };
        }
      },
      billsUrl: {
        type: String,
        default() {
          return "/be/discquote/disc/quote/quoteApplyMain/func_getQuoteBillList";
        }
      },
      batchUrl: {
        type: String,
        default() {
          return "/be/discquote/disc/quote/quoteApplyMain/func_getQuoteBatch";
        }
      },
      exportUrl: {
        type: String,
        default() {
          return "/be/discquote/disc/quote/quoteApplyMain/func_downloadDiscDelistBill";
        }
      }
    },
    methods: {
      handleClose() {
        this.$emit("quoteApplyDetailWinClose", "");
      },
      onMaximize() {
        setTimeout(() => {
          this.$refs.bills.$refs.gridContent.handleResize();
        }, 100);
      },
      formatDictValue(groupCode, key) {
        return this.getDictValueFromMap(this.detailParams.dictMap, groupCode, key);
      },
      formatDate(value) {
        return value ? this.$moment(value, "YYYY-MM-DD").format("YYYY-MM-DD") : "";
      },
      formatMoney(value) {
        return value ? formatNumber(value, 2, ",") : "";
      },
      showAttach() {
        this.batchId = this.detailParams.batchId;
        this.filePathUrl = this.detailParams.filePathUrl;
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
      listExport() {
        this.param = "discQuoteInBillExport";
        if (this.$refs.bills.selectIds.length != 0) {
          this.rows = this.$refs.bills.selectIds.length;
        } else {
          this.rows = this.$refs.bills.total;
        }
        this.tempShowExcelTemplateWin = true;
      },
      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },
      exportList(field, exportType) {
        let url = window.LOCAL_CONFIG.API_HOME + this.exportUrl;
        let options = {};
        if (this.$refs.bills.selectIds.length !== 0) {
          options.params = {
            batchId: this.formItem.batchId,
            ids: this.$refs.bills.selectIds,
          };
          options.pageSize = this.$refs.bills.selectIds.length;
        } else {
          options.params = this.formItem;
          options.pageSize = this.$refs.bills.total;
        }
        exportList(this, this.param, field, exportType, url, options);
      },
    },
    watch: {
      quoteApplyDetailWin(val) {
        if (val) {
          post({ id: this.detailParams.batchId }, this.batchUrl).then(res => {
            if (res.data.retCode === "000000") {
              if (res.data.retData != null) {
                this.viewDatailForm = res.data.retData;
              }
            }
          }).catch(error => {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
          });
          this.$nextTick(() => {
            this.formItem.batchId = this.detailParams.batchId;

            this.$refs.bills.dataChange(1);
          });
        }
      }
    },
    computed: {
      tempQuoteApplyDetailWin: {
        get() {
          return this.quoteApplyDetailWin;
        },
        set() {
        }
      }
    }
  };
</script>

<style scoped>

</style>
