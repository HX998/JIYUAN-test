<!--买入/卖出 新增/修改弹窗共用字段-->
<template>
  <div v-if="isShow">
    <h-row :gutter="16">
      <!--业务类型-->
      <h-col span="6">
        <h-row>
          <h-col span="9" class="label">{{$t("m.i.common.busiType")}}：</h-col>
          <h-col span="15" class="val">{{format("BusiType",viewDatailForm.busiType)}}</h-col>
        </h-row>
      </h-col>
      <!--批次号-->
      <h-col span="6">
        <h-row>
          <h-col span="9" class="label">{{$t("m.i.common.batchNo")}}：</h-col>
          <h-col span="15" class="val">{{viewDatailForm.batchNo}}</h-col>
        </h-row>
      </h-col>
      <!--报价单编号-->
      <h-col span="6">
        <h-row>
          <h-col span="9" class="label">{{$t("m.i.be.quoteNo")}}:</h-col>
          <h-col span="15" class="val">{{viewDatailForm.quoteNo}}</h-col>
        </h-row>
      </h-col>
      <!--本方机构名称-->
      <h-col span="6">
        <h-row>
          <h-col span="9" class="label">{{$t("m.i.be.ownBrchName")}}:</h-col>
          <h-col span="15" class="val">{{viewDatailForm.buyBrchName}}</h-col>
        </h-row>
      </h-col>
    </h-row>
    <br>
    <h-row :gutter="16">
      <!--本方交易员名称-->
      <h-col span="6">
        <h-row>
          <h-col span="9" class="label">{{$t("m.i.be.traderName")}}：</h-col>
          <h-col span="15" class="val">{{viewDatailForm.buyTraderName}}</h-col>
        </h-row>
      </h-col>
      <!--票据种类-->
      <h-col span="6">
        <h-row>
          <h-col span="9" class="label">{{$t("m.i.billInfo.billType")}}：</h-col>
          <h-col span="15" class="val">{{format("DraftTypeCode",viewDatailForm.billType)}}</h-col>
        </h-row>
      </h-col>
      <!--票据介质-->
      <h-col span="6">
        <h-row>
          <h-col span="9" class="label">{{$t("m.i.billInfo.billClass")}}：</h-col>
          <h-col span="15" class="val">{{format("CDMedia",viewDatailForm.billClass)}}</h-col>
        </h-row>
      </h-col>
      <!--回购利率-->
      <h-col span="6">
        <h-row>
          <h-col span="9" class="label">{{$t("m.i.be.repurchaseRate")}}：</h-col>
          <h-col span="15" class="val">{{formatRate(viewDatailForm.ratePct)}}</h-col>
        </h-row>
      </h-col>
    </h-row>
    <br>
    <h-row :gutter="16">
      <!--回购金额-->
      <h-col span="6">
        <h-row>
          <h-col span="9" class="label">{{$t("m.i.pe.buyBackTotalAmt")}}：</h-col>
          <h-col span="15" class="val">{{formatMoney(viewDatailForm.buyBackTotalAmt)}}</h-col>
        </h-row>
      </h-col>
      <!--回购期限-->
      <h-col span="6">
        <h-row>
          <h-col span="9" class="label">{{$t("m.i.be.repoTerm")}}：</h-col>
          <h-col span="15" class="val">{{viewDatailForm.tenorDays}}</h-col>
        </h-row>
      </h-col>
      <!--期限品种-->
      <h-col span="6">
        <h-row>
          <h-col span="9" class="label">{{$t("m.i.be.tenorVarieties")}}：</h-col>
          <h-col span="15" class="val">{{format("TenorVarieties",viewDatailForm.tenorVarieties)}}</h-col>
        </h-row>
      </h-col>
      <!--清算类型-->
      <h-col span="6">
        <h-row>
          <h-col span="9" class="label">{{$t("m.i.be.clearType")}}：</h-col>
          <h-col span="15" class="val">{{format("ClearType",viewDatailForm.clearType)}}</h-col>
        </h-row>
      </h-col>
    </h-row>
    <br>
    <h-row :gutter="16">
      <!--结算方式-->
      <h-col span="6">
        <h-row>
          <h-col span="9" class="label">{{$t("m.i.be.settleMode")}}：</h-col>
          <h-col span="15" class="val">{{format("SettleType",viewDatailForm.settleMode)}}</h-col>
        </h-row>
      </h-col>
      <!--清算速度-->
      <h-col span="6">
        <h-row>
          <h-col span="9" class="label">{{$t("m.i.be.clearSpeed")}}：</h-col>
          <h-col span="15" class="val">{{format("ClearSpeed",viewDatailForm.clearSpeed)}}</h-col>
        </h-row>
      </h-col>
      <!--首期结算日-->
      <h-col span="6">
        <h-row>
          <h-col span="9" class="label">{{$t("m.i.be.firstSettleDate")}}:</h-col>
          <h-col span="15" class="val">{{formatDate(viewDatailForm.settleDt)}}</h-col>
        </h-row>
      </h-col>
      <!--到期结算日-->
      <h-col span="6">
        <h-row>
          <h-col span="9" class="label">{{$t("m.i.be.dueSettleDt")}}:</h-col>
          <h-col span="15" class="val">{{formatDate(viewDatailForm.dueSettleDt)}}</h-col>
        </h-row>
      </h-col>
    </h-row>
    <br>
    <h-row :gutter="16">
      <!--信用主体类型-->
      <h-col span="6">
        <h-row>
          <h-col span="9" class="label">{{$t("m.i.billInfo.creditMainBankType")}}：</h-col>
          <h-col span="15" class="val">{{format("CreditMajor",viewDatailForm.creditMainBrchClass)}}</h-col>
        </h-row>
      </h-col>
      <!--已成交票据总额-->
      <h-col span="6" v-if="viewDatailForm.dealTotalAmt">
        <h-row>
          <h-col span="9" class="label">{{$t("m.i.common.dealTotalAmtBillPackage")}}：</h-col>
          <h-col span="15" class="val">{{formatMoney(viewDatailForm.dealTotalAmt)}}</h-col>
        </h-row>
      </h-col>
      <!--已成交票据张数-->
      <h-col span="6" v-if="viewDatailForm.dealTotalNum">
        <h-row>
          <h-col span="9" class="label">{{$t("m.i.common.dealTotalNumBillPackage")}}：</h-col>
          <h-col span="15" class="val">{{viewDatailForm.dealTotalNum}}</h-col>
        </h-row>
      </h-col>
    </h-row>

  </div>
</template>

<script>
  import { post, on, off,formatNumber } from "@/api/bizApi/commonUtil";
  export default {
    name: "applyApplyDetail",
    data() {
      let _this = this;
      return {

      }
    },
    props: {
      anonyApplyDetailWin: {
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
        return this.anonyApplyDetailWin;
      }
    },
    methods:{
      format(groupcode, key) {
        return this.getDictValueFromMap(this.batchParams.dictMap, groupcode, key);
      },
      formatMoney(value) {
        return formatNumber(value, 2, ',');
      },
      formatRate(value){
        return formatNumber(value, 4, ',');
      },
      formatDate(value) {
        return value ? this.$moment(value, "YYYY-MM-DD").format("YYYY-MM-DD") : "";
      },
    }
  };
</script>

<style scoped>

</style>
