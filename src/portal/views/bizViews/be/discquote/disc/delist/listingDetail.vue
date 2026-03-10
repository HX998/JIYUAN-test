<template>
  <div>
    <h-msg-box v-model="tempListingDetail" maximize width="1000" :mask-closable="false" @on-close="handleClose" top="10"
               @on-maximize="onMaximize">
      <p slot="header">
        <span>{{ $t("m.i.common.showDetail") }}</span>
      </p>
      <div class="text-body">
        <h-row :gutter="16">
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t("m.i.common.batchNo") }}:</h-col>
              <h-col span="15" class="val">{{ viewDatailForm.batchNo }}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t("m.i.be.quoteNo") }}:</h-col>
              <h-col span="15" class="val">{{ viewDatailForm.busiNo }}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t("m.i.common.busiType") }}：</h-col>
              <h-col span="15" class="val">{{ formatDictValue("DCBusiType", viewDatailForm.busiType) }}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t("m.i.be.quoteStatus") }}：</h-col>
              <h-col span="15" class="val">{{ formatDictValue("DiscQuoteStatus", viewDatailForm.quoteStatus) }}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <br>
        <h-row :gutter="16">
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t("m.i.be.respTm") }}：</h-col>
              <h-col span="15" class="val">{{ viewDatailForm.respTm }}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t("m.i.be.brchName") }}：</h-col>
              <h-col span="15" class="val">{{ viewDatailForm.discBrchName }}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t("m.i.be.traderName") }}：</h-col>
              <h-col span="15" class="val">{{ viewDatailForm.discTraderName }}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t("m.i.billInfo.billOrigin") }}：</h-col>
              <h-col span="15" class="val">{{ formatDictValue("BillOrigin", viewDatailForm.billOrigin) }}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <br>
        <h-row :gutter="16">
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t("m.i.billInfo.billType") }}：</h-col>
              <h-col span="15" class="val">{{ formatDictValue("DraftTypeCode", viewDatailForm.billType) }}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t("m.i.billInfo.billClass") }}：</h-col>
              <h-col span="15" class="val">{{ formatDictValue("CDMedia", viewDatailForm.billClass) }}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t("m.i.be.isAllowBargain") }}：</h-col>
              <h-col span="15" class="val">{{ formatDictValue("Yon", viewDatailForm.isBargain) }}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t("m.i.be.totalNumBillPackage") }}：</h-col>
              <h-col span="15" class="val">{{ viewDatailForm.totalNum }}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <br>
        <h-row :gutter="16">
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t("m.i.be.totalAmtBillPackage") }}：</h-col>
              <h-col span="15" class="val">{{ formatMoney(viewDatailForm.totalAmt) }}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t("m.i.pe.discRate") }}:</h-col>
              <h-col span="15" class="val">{{ viewDatailForm.ratePct }}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t("m.i.be.remainingPeriod") }}:</h-col>
              <h-col span="15" class="val">{{ viewDatailForm.remainDays }}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t("m.i.ce.discountApplyName") }}:</h-col>
              <h-col span="15" class="val">{{ viewDatailForm.discCustName }}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <br>
        <h-row :gutter="16">
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t("m.i.ce.discountApplySocCode") }}:</h-col>
              <h-col span="15" class="val">{{ viewDatailForm.discOutSocCode }}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t("m.i.be.isDiscArc") }}:</h-col>
              <h-col span="15" class="val">{{ formatDictValue("Yon", viewDatailForm.isDiscArc) }}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t("m.i.be.isDiscGreen") }}:</h-col>
              <h-col span="15" class="val">{{ formatDictValue("Yon", viewDatailForm.isDiscGreenCorp) }}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t("m.i.be.isDiscTechnologyCorp") }}:</h-col>
              <h-col span="15" class="val">{{ formatDictValue("Yon", viewDatailForm.isDiscTechnologyCorp) }}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <br>
        <h-row :gutter="16">
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t("m.i.be.isDiscPrivateCorp") }}:</h-col>
              <h-col span="15" class="val">{{ formatDictValue("Yon", viewDatailForm.isDiscPrivateCorp) }}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t("m.i.be.discProv") }}：</h-col>
              <h-col span="15" class="val">{{ formatDictValue("Province", viewDatailForm.area) }}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t("m.i.be.discCorpScale") }}:</h-col>
              <h-col span="15" class="val">{{ formatDictValue("CorpScale", viewDatailForm.discCorpScale) }}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t("m.i.be.discIndustry") }}：</h-col>
              <h-col span="15" class="val">{{ formatDictValue("Industry", viewDatailForm.discIndustry) }}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <br>
        <h-row :gutter="16">
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t("m.i.common.distType") }}:</h-col>
              <h-col span="15" class="val">{{ formatDictValue("DistTypeCode", viewDatailForm.discApplDistType) }}
              </h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t("m.i.be.discApplAcctNo") }}：</h-col>
              <h-col span="15" class="val">{{ viewDatailForm.discApplAcctNo }}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t("m.i.be.discApplAcctName") }}:</h-col>
              <h-col span="15" class="val">{{ viewDatailForm.discApplAcctName }}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t("m.i.be.discOutBrchCode") }}：</h-col>
              <h-col span="15" class="val">{{ viewDatailForm.discOutBrchCode }}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <br>
        <h-row :gutter="16">
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t("m.i.be.discApplMemberId") }}:</h-col>
              <h-col span="15" class="val">{{ viewDatailForm.discApplMemberId }}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t("m.i.ce.aoAcctNo") }}：</h-col>
              <h-col span="15" class="val">{{ viewDatailForm.discApplAoAcctNo }}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t("m.i.ce.aoAcctName") }}:</h-col>
              <h-col span="15" class="val">{{ viewDatailForm.discApplAoAcctName }}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t("m.i.ce.aoAcctBrchCode") }}：</h-col>
              <h-col span="15" class="val">{{ viewDatailForm.discApplAoAcctBrchCode }}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <br>
        <h-row :gutter="16">
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t("m.i.be.settleDt") }}：</h-col>
              <h-col span="15" class="val">{{ formatDate(viewDatailForm.firstSettleDt) }}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t("m.i.be.clearSpeed") }}:</h-col>
              <h-col span="15" class="val">{{ formatDictValue("ClearSpeed", viewDatailForm.clearSpeed) }}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t("m.i.be.settleMode") }}：</h-col>
              <h-col span="15" class="val">{{ formatDictValue("SettleType", viewDatailForm.clearMode) }}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t("m.i.be.payInterestByUnit") }}:</h-col>
              <h-col span="15" class="val">{{ formatMoney(viewDatailForm.firstPayInterest) }}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <br>
        <h-row :gutter="16">
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t("m.i.be.settleAmtByUnit") }}：</h-col>
              <h-col span="15" class="val">{{ formatMoney(viewDatailForm.firstSettleAmt) }}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t("m.i.be.fileNum") }}:</h-col>
              <h-col span="15" class="val">{{ viewDatailForm.fileNum }}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t("m.i.common.remark") }}：</h-col>
              <h-col span="15" class="val">{{ viewDatailForm.delistRemark }}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <br>
      </div>
      <h-datagrid :columns="billsColumns" :autoLoad="false" :url="billsUrl" :bindForm="formItem" ref="bills"
                  :hasSelect="false" rowSelect>
        <div slot="toolbar" class="pull-left">
          <h-button type="primary" @click="delist" v-if="this.showType === 'delist'">{{ $t("m.i.be.delisting") }}
          </h-button>
          <h-button type="primary" @click="delistCancel" v-if="this.showType === 'appl'">{{ $t("m.i.be.delistCancel") }}
          </h-button>
          <h-button type="primary" @click="delistDeal" v-if="this.showType === 'appl'">{{ $t("m.i.be.delistDeal") }}
          </h-button>
          <h-button type="primary" @click="changeToQuot" v-if="this.showType === 'appl'">{{ $t("m.i.be.changeToQuot") }}
          </h-button>
          <h-button type="primary" @click="quoteApply" v-if="this.showType === 'confirm'">{{ $t("m.i.be.delistDeal") }}
          </h-button>
          <h-button type="primary" @click="returnApply" v-if="this.showType === 'confirm'">{{ $t("m.i.be.returnApply") }}
          </h-button>
          <h-button type="primary" @click="showAttach">{{ $t("m.i.common.showAttach") }}</h-button>
          <h-button type="primary" @click="listExport">{{ $t("m.i.common.listExport") }}</h-button>
        </div>
      </h-datagrid>
      <div slot="footer">
      </div>
    </h-msg-box>
    <show-file-win :showFileWin="showFileWin" :fileBatchParams="fileBatchParams" @showFileWinClose="showFileWinClose" :dictMap="this.detailParams.dictMap" :filePathUrl="filePathUrl"></show-file-win>
    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param"
                           :rows="this.rows"></common-excel-download>
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin"
                    :billRangeEnd="this.billRangeEnd" :billRangeStart="this.billRangeStart"
                    :billNo="billNo"></bill-info-main>
  </div>
</template>

<script>
import {post, formatNumber, exportList, formatBillRange} from "@/api/bizApi/commonUtil";

export default {
  name: "listingDetail",
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
          title: this.$t("m.i.billInfo.billPackageNo"),
          key: "billNo",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            if (this.viewDatailForm.quoteStatus !== "DES03"
              && this.viewDatailForm.quoteStatus !== "DES05"
              && this.viewDatailForm.quoteStatus !== "DES08"
              && this.viewDatailForm.quoteStatus !== "DES09") {
              return h("span", params.row.billNo);
            }
            return h('a', {
              on: {
                click: () => {
                  this.billInfoWinOpen(params.row)
                }
              }
            }, params.row.billNo)
          }
        },
        {
          title: this.$t("m.i.billInfo.billRange"),
          align: 'center',
          key: "billRange",
          hiddenCol: false,
          render: (h, params) => {
            let billOrigin = this.viewDatailForm.billOrigin;
            let billRangeStart = params.row.billRangeStart;
            let billRangeEnd = params.row.billRangeEnd;
            return h("span", formatBillRange(billOrigin, billRangeStart, billRangeEnd))
          }
        },
        {
          title: this.$t("m.i.billInfo.billPackageMoney"),
          key: "billMoney",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            return h("p", formatNumber(params.row.billMoney, 2, ","));
          }
        },
        {
          title: this.$t("m.i.billInfo.stdAmt"),
          key: "stdAmt",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            return h("p", formatNumber(params.row.stdAmt, 2, ","));
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
          title: this.$t("m.i.billInfo.drwrName"),
          key: "drwrName",
          hiddenCol: false
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
          title: this.$t('m.i.be.remainingPeriod'),
          key: "remainDays",
          sortable: true,
          hiddenCol: this.showType === 'delist'
        },
        {
          title: this.$t('m.i.be.payInterestByUnit'),
          key: "firstPayInterest",
          sortable: true,
          hiddenCol: this.showType === 'delist',
          render: (h, params) => {
            return h('span', formatNumber(params.row.firstPayInterest, 2, ','))
          }
        },
        {
          title: this.$t('m.i.be.settleAmtByUnit'),
          key: "firstSettleAmt",
          sortable: true,
          hiddenCol: this.showType === 'delist',
          render: (h, params) => {
            return h('span', formatNumber(params.row.firstSettleAmt, 2, ','))
          }
        },
      ],
      showFileWin: false,
      tempShowExcelTemplateWin: false,
      showBillInfoWin: false,
      billNo: "",
      billRangeStart: "",
      billRangeEnd: "",
      batchId: "",
      param: "",
      rows: "",
      filePathUrl: "",
      fileBatchParams: {}
    };
  },
  components: {
    showFileWin: () => import(/* webpackChunkName: "pc/img/showFileWin" */"@/views/bizViews/pc/img/showFileWin"),
  },
  props: {
    listingDetailWin: {
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
    showType: {
      type: String,
      default() {
        return "";
      }
    },
    billsUrl: {
      type: String,
      default() {
        return "/be/discquote/disc/delist/listingMain/func_getListingBillList";
      }
    },
    batchUrl: {
      type: String,
      default() {
        return "/be/discquote/disc/delist/listingMain/func_getDelistingBatch";
      }
    },
    exportUrl: {
      type: String,
      default() {
        return "/be/discquote/disc/delist/listingMain/func_downloadDiscDelistBill";
      }
    },
    delistDealFun: {
      type: Function,
    }
  },
  methods: {
    handleClose() {
      this.$emit("listingDetailWinClose", "");
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
    billInfoWinClose() {
      this.billNo = null;
      this.billRangeStart = null;
      this.billRangeEnd = null;
      this.showBillInfoWin = false;
    },
    billInfoWinOpen(row) {
      this.billNo = row.billNo;
      this.billRangeStart = row.billRangeStart;
      this.billRangeEnd = row.billRangeEnd;
      this.showBillInfoWin = true;
    },
    delist() {
      this.$hMsgBox.confirm({
        title: "摘牌信息",
        content: "确定要摘牌吗？",
        onOk: () => {
          let params = {batchId: this.detailParams.batchId, sgnupMk: "0"};
          let url = "/be/discquote/disc/delist/listingMain/func_delistingAnswer";
          this.sendPost(params, url);
        }
      });
    },
    delistCancel() {
      this.$hMsgBox.confirm({
        title: "摘牌取消信息",
        content: "确定要摘牌取消吗？",
        onOk: () => {
          let params = {batchId: this.detailParams.batchId, sgnupMk: "1"};
          let url = "/be/discquote/disc/delist/delistMain/func_delistingAnswer";
          this.sendPost(params, url);
        }
      });
    },
    delistDeal() {
      let params = { batchId: this.detailParams.batchId, billOrigin: this.detailParams.billOrigin};
      this.delistDealFun(params);
    },
    changeToQuot() {
      this.$hMsgBox.confirm({
        title: "转对话报价信息",
        content: "确定要转对话报价吗？",
        onOk: () => {
          let params = {batchId: this.detailParams.batchId};
          let url = "/be/discquote/disc/delist/delistMain/func_changeDelistingToQuote";
          this.sendPost(params, url);
        }
      });
    },
    quoteApply() {
      this.$hMsgBox.confirm({
        title: "成交信息",
        content: "确定要成交吗？",
        onOk: () => {
          let params = {batchId: this.detailParams.batchId, operType: "1"};
          let url = "/be/discquote/disc/delist/delistConfirm/func_dealDestingOper";
          this.sendPost(params, url);
        }
      });
    },
    returnApply() {
      this.$hMsgBox.confirm({
        title: "退回信息",
        content: "确定要退回吗？",
        onOk: () => {
          let params = {batchId: this.detailParams.batchId, operType: "0"};
          let url = "/be/discquote/disc/delist/delistConfirm/func_dealDestingOper";
          this.sendPost(params, url);
        }
      });
    },
    showAttach() {
      this.fileBatchParams.busiId = this.detailParams.batchId;
      this.fileBatchParams.attachBusiType = "discDelistFileType";
      this.fileBatchParams.attTypeCodeList = this.detailParams.attTypeCodeList;
      this.fileBatchParams.fileDetailStatusList = this.detailParams.fileDetailStatusList;
      this.filePathUrl = this.detailParams.filePathUrl;
      this.showFileWin = true;
    },
    showFileWinClose() {
      this.showFileWin = false;
    },
    listExport() {
      if (this.showType == "delist") {
        this.param = "discDelistBillExport";
      } else {
        this.param = "discDelistBillWithInterestExport";
      }
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
    sendPost(params, url) {
      post(params, url).then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.currentSelectRow = null;
            this.$msgTip.success(this);
            this.handleClose();
          } else {
            this.$msgTip.error(this, {info: res.data.retMsg});
          }
        } else {
          this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
        }
      });
    }
  },
  watch: {
    listingDetailWin(val) {
      if (val) {
        post({id: this.detailParams.batchId}, this.batchUrl).then(res => {
          if (res.data.retCode === "000000") {
            if (res.data.retData != null) {
              this.viewDatailForm = res.data.retData;
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, {info: this.$t("m.i.common.netError") + error});
        });
        this.$nextTick(() => {
          this.formItem.batchId = this.detailParams.batchId;
          this.$refs.bills.dataChange(1);
        });
      }
    }
  },
  computed: {
    tempListingDetail: {
      get() {
        return this.listingDetailWin;
      },
      set() {
      }
    }
  }
};
</script>

<style scoped>

</style>
