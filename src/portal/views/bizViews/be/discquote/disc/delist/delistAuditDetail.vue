<template>
  <div>
    <!-- 批次信息 -->
    <div v-if="isShow">
      <div class="text-wrap mb-10">
        <div class="text-header"><span class="tit">详细信息</span></div>
        <div class="text-body">
          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t("m.i.common.batchNo") }}:</h-col>
                <h-col span="15" class="val">{{ viewDatailForm.batchNo }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t("m.i.be.quoteNo") }}:</h-col>
                <h-col span="15" class="val">{{ viewDatailForm.busiNo }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t("m.i.common.busiType") }}:</h-col>
                <h-col span="15" class="val">{{ formatDictValue("DCBusiType", viewDatailForm.busiType) }}</h-col>
              </h-row>
            </h-col>
          </h-row>

          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t("m.i.be.quoteStatus") }}:</h-col>
                <h-col span="15" class="val">{{ formatDictValue("DiscQuoteStatus", viewDatailForm.quoteStatus) }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t("m.i.be.respTm") }}:</h-col>
                <h-col span="15" class="val">{{ viewDatailForm.respTm }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t("m.i.be.brchName") }}:</h-col>
                <h-col span="15" class="val">{{ viewDatailForm.discBrchName }}</h-col>
              </h-row>
            </h-col>
          </h-row>

          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t("m.i.be.traderName") }}:</h-col>
                <h-col span="15" class="val">{{ viewDatailForm.discTraderName }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t("m.i.billInfo.billOrigin") }}:</h-col>
                <h-col span="15" class="val">{{ formatDictValue("BillOrigin", viewDatailForm.billOrigin) }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t("m.i.billInfo.billType") }}:</h-col>
                <h-col span="15" class="val">{{ formatDictValue("DraftTypeCode", viewDatailForm.billType) }}</h-col>
              </h-row>
            </h-col>
          </h-row>

          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t("m.i.billInfo.billClass") }}:</h-col>
                <h-col span="15" class="val">{{ formatDictValue("CDMedia", viewDatailForm.billClass) }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t("m.i.be.isAllowBargain") }}:</h-col>
                <h-col span="15" class="val">{{ formatDictValue("Yon", viewDatailForm.isBargain) }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t("m.i.be.totalNumBillPackage") }}:</h-col>
                <h-col span="15" class="val">{{ viewDatailForm.totalNum }}</h-col>
              </h-row>
            </h-col>
          </h-row>

          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t("m.i.be.totalAmtBillPackage") }}:</h-col>
                <h-col span="15" class="val">{{ formatMoney(viewDatailForm.totalAmt) }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t("m.i.pe.discRate") }}:</h-col>
                <h-col span="15" class="val">{{ viewDatailForm.ratePct }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t("m.i.be.remainingPeriod") }}:</h-col>
                <h-col span="15" class="val">{{ viewDatailForm.remainDays }}</h-col>
              </h-row>
            </h-col>
          </h-row>

          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t("m.i.ce.discountApplyName") }}:</h-col>
                <h-col span="15" class="val">{{ viewDatailForm.discCustName }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t("m.i.ce.discountApplySocCode") }}:</h-col>
                <h-col span="15" class="val">{{ viewDatailForm.discOutSocCode }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t("m.i.be.isDiscArc") }}:</h-col>
                <h-col span="15" class="val">{{ formatDictValue("Yon", viewDatailForm.isDiscArc) }}</h-col>
              </h-row>
            </h-col>
          </h-row>

          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t("m.i.be.isDiscGreen") }}:</h-col>
                <h-col span="15" class="val">{{ formatDictValue("Yon", viewDatailForm.isDiscGreenCorp) }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t("m.i.be.isDiscTechnologyCorp") }}:</h-col>
                <h-col span="15" class="val">{{ formatDictValue("Yon", viewDatailForm.isDiscTechnologyCorp) }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t("m.i.be.isDiscPrivateCorp") }}:</h-col>
                <h-col span="15" class="val">{{ formatDictValue("Yon", viewDatailForm.isDiscPrivateCorp) }}</h-col>
              </h-row>
            </h-col>
          </h-row>

          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t("m.i.be.discProv") }}:</h-col>
                <h-col span="15" class="val">{{ formatDictValue("Province", viewDatailForm.area) }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t("m.i.be.discCorpScale") }}:</h-col>
                <h-col span="15" class="val">{{ formatDictValue("CorpScale", viewDatailForm.discCorpScale) }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t("m.i.be.discIndustry") }}:</h-col>
                <h-col span="15" class="val">{{ formatDictValue("Industry", viewDatailForm.discIndustry) }}</h-col>
              </h-row>
            </h-col>
          </h-row>

          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t("m.i.common.distType") }}:</h-col>
                <h-col span="15" class="val">{{ formatDictValue("DistTypeCode", viewDatailForm.discApplDistType) }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t("m.i.be.discApplAcctNo") }}:</h-col>
                <h-col span="15" class="val">{{ viewDatailForm.discApplAcctNo }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t("m.i.be.discApplAcctName") }}:</h-col>
                <h-col span="15" class="val">{{ viewDatailForm.discApplAcctName }}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t("m.i.be.discOutBrchCode") }}:</h-col>
                <h-col span="15" class="val">{{ viewDatailForm.discOutBrchCode }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t("m.i.be.discApplMemberId") }}:</h-col>
                <h-col span="15" class="val">{{ viewDatailForm.discApplMemberId }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t("m.i.ce.aoAcctNo") }}:</h-col>
                <h-col span="15" class="val">{{ viewDatailForm.discApplAoAcctNo }}</h-col>
              </h-row>
            </h-col>
          </h-row>

          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t("m.i.ce.aoAcctName") }}:</h-col>
                <h-col span="15" class="val">{{ viewDatailForm.discApplAoAcctName }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t("m.i.ce.aoAcctBrchCode") }}:</h-col>
                <h-col span="15" class="val">{{ viewDatailForm.discApplAoAcctBrchCode }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t("m.i.be.settleDt") }}:</h-col>
                <h-col span="15" class="val">{{ formatDate(viewDatailForm.firstSettleDt) }}</h-col>
              </h-row>
            </h-col>
          </h-row>

          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t("m.i.be.clearSpeed") }}:</h-col>
                <h-col span="15" class="val">{{ formatDictValue("ClearSpeed", viewDatailForm.clearSpeed) }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t("m.i.be.settleMode") }}:</h-col>
                <h-col span="15" class="val">{{ formatDictValue("SettleType", viewDatailForm.clearMode) }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t("m.i.be.payInterestByUnit") }}:</h-col>
                <h-col span="15" class="val">{{ formatMoney(viewDatailForm.firstPayInterest) }}</h-col>
              </h-row>
            </h-col>
          </h-row>

          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t("m.i.be.settleAmtByUnit") }}:</h-col>
                <h-col span="15" class="val">{{ formatMoney(viewDatailForm.firstSettleAmt) }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t("m.i.be.fileNum") }}:</h-col>
                <h-col span="15" class="val">{{ viewDatailForm.fileNum }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t("m.i.common.remark") }}:</h-col>
                <h-col span="15" class="val">{{ viewDatailForm.delistRemark }}</h-col>
              </h-row>
            </h-col>
          </h-row>
        </div>

      </div>
    </div>
    <!-- 数据展示表格 -->
    <div v-if="isShow">
      <h-row>
        <h-col span="24">
          <h-datagrid
            :columns="billsColumns"
            highlight-row
            :height="350"
            :notSetWidth="true"
            :autoLoad="false"
            :bindForm="billFormItem"
            url="/be/discquote/disc/delist/listingMain/func_getListingBillList"
            ref="billDatagrid">
            <div slot="toolbar">
            </div>
          </h-datagrid>
        </h-col>
      </h-row>
    </div>
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin"
                    :billRangeEnd="this.billRangeEnd" :billRangeStart="this.billRangeStart"
                    :billNo="billNo"></bill-info-main>
  </div>
</template>

<script>
import {post, formatNumber, getDictValueFromMap, formatBillRange, getDictListByGroups} from "@/api/bizApi/commonUtil";

export default {
  name: "delistAuditDetail",
  data() {
    return {
      billFormItem: {
        batchId: ""
      },
      viewDatailForm: {},
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
      showBillInfoWin: false,
      billNo: "",
      billRangeStart: "",
      billRangeEnd: "",
      dictMap: new Map(),
    };
  },
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    listIds: "",
    batchId: ""
  },
  mounted() {
    getDictListByGroups("DiscQuoteStatus,Yon,DraftTypeCode,CorpScale,Industry,Province,CDMedia,ClearSpeed,SettleType,DCBusiType,BillOrigin,DistTypeCode").then(res => {
      this.dictMap = res.get("map");
    });
    this.init();
  },
  methods: {
    onMaximize() {
      setTimeout(() => {
        this.$refs.billDatagrid.$refs.gridContent.handleResize();
      }, 100);
    },
    formatDictValue(groupcode, key) {
      return getDictValueFromMap(this.dictMap, groupcode, key)
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
    init(){
      let batchId= this.batchId;
      let url ='';
      if(batchId){
        url='/be/discquote/disc/delist/listingMain/func_getDelistingBatch';
      }else{
        this.$msgTip.error(this, { info:"批次ID不能为空"});
      }
      post({id: batchId}, url).then(res => {
        if (res.data.retCode === "000000") {
          if (res.data.retData != null) {
            this.viewDatailForm = res.data.retData;
          }
        }
      }).catch(error => {
        this.$msgTip.error(this, {info: this.$t("m.i.common.netError") + error});
      });
      this.$nextTick(() => {
        this.billFormItem.batchId = this.batchId;
        this.$refs.billDatagrid.dataChange(1);
      });
    }
  },
};
</script>

<style scoped>

</style>
