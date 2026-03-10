<!--买入/卖出 新增/修改弹窗共用字段-->
<template>
  <div v-if="isShow">
    <h-row :gutter="16">
      <!--批次号-->
      <h-col span="6">
        <h-row>
          <h-col span="9" class="label">{{$t("m.i.common.batchNo")}}：</h-col>
          <h-col span="15" class="val">{{viewDatailForm.batchNo}}</h-col>
        </h-row>
      </h-col>
      <!--业务类型-->
      <h-col span="6">
        <h-row>
          <h-col span="9" class="label">{{$t("m.i.common.busiType")}}：</h-col>
          <h-col span="15" class="val">{{format("DCBusiType",viewDatailForm.busiType)}}</h-col>
        </h-row>
      </h-col>
      <!--来源交易方式-->
      <h-col span="6">
        <h-row>
          <h-col span="9" class="label">{{$t("m.i.be.sourceTransMode")}}：</h-col>
          <h-col span="15" class="val">{{format("SourceTransMode",viewDatailForm.tradeMode)}}</h-col>
        </h-row>
      </h-col>
      <!--来源业务单编号-->
      <h-col span="6">
        <h-row>
          <h-col span="9" class="label">{{$t("m.i.be.sourceBusiNo")}}：</h-col>
          <h-col span="15" class="val">{{viewDatailForm.busiNo}}</h-col>
        </h-row>
      </h-col>
    </h-row>
    <br>
    <h-row :gutter="16">
      <!--报价单编号-->
      <h-col span="6">
        <h-row>
          <h-col span="9" class="label">{{$t("m.i.be.quoteNo")}}:</h-col>
          <h-col span="15" class="val">{{viewDatailForm.quoteNo}}</h-col>
        </h-row>
      </h-col>
      <!--状态-->
      <h-col span="6">
        <h-row>
          <h-col span="9" class="label">{{$t("m.i.common.status")}}：</h-col>
          <h-col span="15" class="val">{{format("DOQBatchStatus",viewDatailForm.batchStatus)}}</h-col>
        </h-row>
      </h-col>
      <!--本方机构名称-->
      <h-col span="6">
        <h-row>
          <h-col span="9" class="label">{{$t("m.i.be.ownBrchName")}}:</h-col>
          <h-col span="15" class="val">{{viewDatailForm.brokerBrchName}}</h-col>
        </h-row>
      </h-col>
      <!--本方交易员名称-->
      <h-col span="6">
        <h-row>
          <h-col span="9" class="label">{{$t("m.i.be.traderName")}}：</h-col>
          <h-col span="15" class="val">{{viewDatailForm.brokerTraderName}}</h-col>
        </h-row>
      </h-col>
    </h-row>
    <br>
    <h-row :gutter="16">
      <!--对方机构名称-->
      <h-col span="6">
        <h-row>
          <h-col span="9" class="label">{{$t("m.i.be.otherBrchName")}}：</h-col>
          <h-col span="15" class="val">{{viewDatailForm.discBrchName}}</h-col>
        </h-row>
      </h-col>
      <!--对方交易员名称-->
      <h-col span="6">
        <h-row>
          <h-col span="9" class="label">{{$t("m.i.be.custTraderName")}}：</h-col>
          <h-col span="15" class="val">{{viewDatailForm.discTraderName}}</h-col>
        </h-row>
      </h-col>
      <!--贴现申请人名称-->
      <h-col span="6">
        <h-row>
          <h-col span="8" class="label">{{$t("m.i.ce.discountApplyName")}}：</h-col>
          <h-col span="15" class="val">{{viewDatailForm.discCustName}}</h-col>
        </h-row>
      </h-col>
      <!--社会信用代码-->
      <h-col span="6">
        <h-row>
          <h-col span="8" class="label">{{$t("m.i.ce.discountApplySocCode")}}：</h-col>
          <h-col span="15" class="val">{{viewDatailForm.discOutSocCode}}</h-col>
        </h-row>
      </h-col>
    </h-row>
    <br>
    <h-row :gutter="16">
      <!--企业规模-->
      <h-col span="6">
        <h-row>
          <h-col span="8" class="label">{{$t("m.i.be.discCorpScale")}}：</h-col>
          <h-col span="15" class="val">{{format("CorpScale",viewDatailForm.discCorpScale)}}</h-col>
        </h-row>
      </h-col>
      <!--行业分类-->
      <h-col span="6">
        <h-row>
          <h-col span="8" class="label">{{$t("m.i.be.discIndustry")}}：</h-col>
          <h-col span="15" class="val">{{format("Industry",viewDatailForm.discIndustry)}}</h-col>
        </h-row>
      </h-col>
      <!--是否涉农企业-->
      <h-col span="6">
        <h-row>
          <h-col span="8" class="label">{{$t("m.i.be.isDiscArc")}}：</h-col>
          <h-col span="15" class="val">{{format("Yon",viewDatailForm.isDiscArc)}}</h-col>
        </h-row>
      </h-col>
      <!--是否绿色企业-->
      <h-col span="6">
        <h-row>
          <h-col span="8" class="label">{{$t("m.i.be.isDiscGreen")}}：</h-col>
          <h-col span="15" class="val">{{format("Yon",viewDatailForm.isDiscGreenCorp)}}</h-col>
        </h-row>
      </h-col>
    </h-row>
    <br>
    <h-row :gutter="16">
      <!--是否科技企业-->
      <h-col span="6">
        <h-row>
          <h-col span="8" class="label">{{$t("m.i.be.isDiscTechnologyCorp")}}：</h-col>
          <h-col span="15" class="val">{{format("Yon",viewDatailForm.isDiscTechnologyCorp)}}</h-col>
        </h-row>
      </h-col>
      <!--是否民营企业-->
      <h-col span="6">
        <h-row>
          <h-col span="8" class="label">{{$t("m.i.be.isDiscPrivateCorp")}}：</h-col>
          <h-col span="15" class="val">{{format("Yon",viewDatailForm.isDiscPrivateCorp)}}</h-col>
        </h-row>
      </h-col>
      <!--省份-->
      <h-col span="6">
        <h-row>
          <h-col span="8" class="label">{{$t("m.i.be.discProv")}}：</h-col>
          <h-col span="15" class="val">{{format("Province",viewDatailForm.area)}}</h-col>
        </h-row>
      </h-col>
      <!--票据种类-->
      <h-col span="6">
        <h-row>
          <h-col span="9" class="label">{{$t("m.i.billInfo.billType")}}：</h-col>
          <h-col span="15" class="val">{{format("DraftTypeCode",viewDatailForm.billType)}}</h-col>
        </h-row>
      </h-col>
    </h-row>
    <br>
    <h-row :gutter="16">
      <!--票据介质-->
      <h-col span="6">
        <h-row>
          <h-col span="9" class="label">{{$t("m.i.billInfo.billClass")}}：</h-col>
          <h-col span="15" class="val">{{format("CDMedia",viewDatailForm.billClass)}}</h-col>
        </h-row>
      </h-col>
      <!--部分成交选项-->
      <h-col span="6">
        <h-row>
          <h-col span="9" class="label">{{$t("m.i.be.subDeal")}}：</h-col>
          <h-col span="15" class="val">{{format("Yon",viewDatailForm.subDeal)}}</h-col>
        </h-row>
      </h-col>
      <!--清算方式-->
      <h-col span="6">
        <h-row>
          <h-col span="9" class="label">{{$t("m.i.be.clearMode")}}：</h-col>
          <h-col span="15" class="val">{{format("DiscClearMode",viewDatailForm.clearMode)}}</h-col>
        </h-row>
      </h-col>
      <!--清算速度--->
      <h-col span="6">
        <h-row>
          <h-col span="9" class="label">{{$t("m.i.be.clearSpeed")}}：</h-col>
          <h-col span="15" class="val">{{format("ClearSpeed",viewDatailForm.clearSpeed)}}</h-col>
        </h-row>
      </h-col>

    </h-row>
    <br>
    <h-row :gutter="16">
      <!--结算日-->
      <h-col span="6">
        <h-row>
          <h-col span="9" class="label">{{$t("m.i.be.settleDt")}}:</h-col>
          <h-col span="15" class="val">{{formatDate(viewDatailForm.firstSettleDt)}}</h-col>
        </h-row>
      </h-col>
      <!--报价有效时间-->
      <h-col span="6">
        <h-row>
          <h-col span="9" class="label">{{$t("m.i.be.quoteTm")}}：</h-col>
          <h-col span="15" class="val">{{viewDatailForm.quoteTm}}</h-col>
        </h-row>
      </h-col>
      <!--贴现利率-->
      <h-col span="6">
        <h-row>
          <h-col span="9" class="label">{{$t("m.i.pe.discRate")}}：</h-col>
          <h-col span="15" class="val">{{viewDatailForm.ratePct}}</h-col>
        </h-row>
      </h-col>
      <!--贴现申请人开户行行号-->
      <h-col span="6">
        <h-row>
          <h-col span="9" class="label">{{$t("m.i.be.discOutBankNo")}}：</h-col>
          <h-col span="15" class="val">{{viewDatailForm.discOutBankNo}}</h-col>
        </h-row>
      </h-col>
    </h-row>
    <br>
    <h-row :gutter="16">
      <!--票据总额-->
      <h-col span="6">
        <h-row>
          <h-col span="9" class="label">{{$t("m.i.be.totalAmtByYUAN")}}：</h-col>
          <h-col span="15" class="val">{{formatMoney(viewDatailForm.totalAmt)}}</h-col>
        </h-row>
      </h-col>
      <!--票据张数-->
      <h-col span="6">
        <h-row>
          <h-col span="9" class="label">{{$t("m.i.be.totalNum")}}:</h-col>
          <h-col span="15" class="val">{{viewDatailForm.totalNum}}</h-col>
        </h-row>
      </h-col>
      <!--应付利息-->
      <h-col span="6">
        <h-row>
          <h-col span="9" class="label">{{$t("m.i.be.payInterestByUnit")}}:</h-col>
          <h-col span="15" class="val">{{formatMoney(viewDatailForm.firstPayInterest)}}</h-col>
        </h-row>
      </h-col>
      <!--结算金额-->
      <h-col span="6">
        <h-row>
          <h-col span="9" class="label">{{$t("m.i.be.settleAmtByUnit")}}：</h-col>
          <h-col span="15" class="val">{{formatMoney(viewDatailForm.firstSettleAmt)}}</h-col>
        </h-row>
      </h-col>
    </h-row>
    <br>
    <h-row :gutter="16">
      <!--剩余期限-->
      <h-col span="6">
        <h-row>
          <h-col span="9" class="label">{{$t("m.i.be.remainingPeriod")}}：</h-col>
          <h-col span="15" class="val">{{viewDatailForm.remainDays}}</h-col>
        </h-row>
      </h-col>
      <!--附件数量-->
      <h-col span="6">
        <h-row>
          <h-col span="9" class="label">{{$t("m.i.be.fileNum")}}:</h-col>
          <h-col span="15" class="val">{{viewDatailForm.fileNum}}</h-col>
        </h-row>
      </h-col>
    </h-row>
    <br>
    <h-row :gutter="16">
      <!--备注-->
      <h-col span="24">
        <h-row>
          <h-col span="2" class="label">{{$t("m.i.common.remark")}}：</h-col>
          <h-col span="22" class="val">{{viewDatailForm.quoteRemark}}</h-col>
        </h-row>
      </h-col>
    </h-row>

  </div>
</template>

<script>
  import { post, on, off,formatNumber } from "@/api/bizApi/commonUtil";
  export default {
    name: "discDetail",
    data() {
      let _this = this;
      return {

      }
    },
    props: {
      discDetailWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      viewDatailForm: {
        type: Object,
        default() {
          return {};
        }
      },
      batchParams: {
        type: Object,
        default: {}
      }
    },
    computed: {
      isShow() {
        return this.discDetailWin;
      }
    },
    methods:{
      format(groupcode, key) {
        return this.getDictValueFromMap(this.batchParams.dictMap, groupcode, key);
      },
      formatDate(value) {
        return value ? this.$moment(value, "YYYY-MM-DD").format("YYYY-MM-DD") : "";
      },
      formatMoney(value) {
        return value ? formatNumber(value, 2, ",") : "";
      },
    }
  };
</script>

<style scoped>

</style>
