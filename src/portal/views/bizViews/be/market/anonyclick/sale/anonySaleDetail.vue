<!--匿名点击正回购 详情弹窗共用字段-->
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
      <!--成交单编号-->
      <h-col span="6">
        <h-row>
          <h-col span="9" class="label">{{$t("m.i.be.dealNo")}}:</h-col>
          <h-col span="15" class="val">{{viewDatailForm.dealNo}}</h-col>
        </h-row>
      </h-col>
    </h-row>
    <br>
    <h-row :gutter="16">
      <!--成交时间-->
      <h-col span="6">
        <h-row>
          <h-col span="9" class="label">{{$t("m.i.pe.dealDtTm")}}：</h-col>
          <h-col span="15" class="val">{{formatDateTime(viewDatailForm.dealDtTm)}}</h-col>
        </h-row>
      </h-col>
      <!--本方机构名称-->
      <h-col span="6">
        <h-row>
          <h-col span="9" class="label">{{$t("m.i.be.ownBrchName")}}:</h-col>
          <h-col span="15" class="val">{{viewDatailForm.saleBrchName}}</h-col>
        </h-row>
      </h-col>
      <!--本方交易员名称-->
      <h-col span="6">
        <h-row>
          <h-col span="9" class="label">{{$t("m.i.be.traderName")}}：</h-col>
          <h-col span="15" class="val">{{viewDatailForm.saleTraderName}}</h-col>
        </h-row>
      </h-col>
      <!--对方机构名称-->
      <h-col span="6">
        <h-row>
          <h-col span="9" class="label">{{$t("m.i.be.otherBrchName")}}：</h-col>
          <h-col span="15" class="val">{{viewDatailForm.buyBrchName}}</h-col>
        </h-row>
      </h-col>
    </h-row>
    <br>
    <h-row :gutter="16">
      <!--对方机构代码-->
      <h-col span="6">
        <h-row>
          <h-col span="9" class="label">{{$t("m.i.be.custBrchCode")}}：</h-col>
          <h-col span="15" class="val">{{viewDatailForm.buyBrchCode}}</h-col>
        </h-row>
      </h-col>
      <!--对方非法人产品-->
      <h-col span="6">
        <h-row>
          <h-col span="9" class="label">{{$t("m.i.be.custProductNo")}}：</h-col>
          <h-col span="15" class="val">{{viewDatailForm.buyProductName}}</h-col>
        </h-row>
      </h-col>
      <!--对方交易员名称-->
      <h-col span="6">
        <h-row>
          <h-col span="9" class="label">{{$t("m.i.be.custTraderName")}}：</h-col>
          <h-col span="15" class="val">{{viewDatailForm.buyTraderName}}</h-col>
        </h-row>
      </h-col>
      <!--对方交易编号-->
      <h-col span="6">
        <h-row>
          <h-col span="9" class="label">{{$t("m.i.be.custTraderNo")}}：</h-col>
          <h-col span="15" class="val">{{viewDatailForm.buyTraderNo}}</h-col>
        </h-row>
      </h-col>
    </h-row>
    <br>
    <h-row :gutter="16">
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
      <h-col span="6">
        <h-row>
          <h-col span="9" class="label">{{$t("m.i.be.subDeal")}}：</h-col>
          <h-col span="15" class="val">{{format("Yon",viewDatailForm.subDeal)}}</h-col>
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
          <h-col span="15" class="val">{{formatDate(viewDatailForm.firstSettleDt)}}</h-col>
        </h-row>
      </h-col>
      <!--回购期限-->
      <h-col span="6">
        <h-row>
          <h-col span="9" class="label">{{$t("m.i.be.repoTerm")}}：</h-col>
          <h-col span="15" class="val">{{viewDatailForm.tenorDays}}</h-col>
        </h-row>
      </h-col>
    </h-row>
    <br>
    <h-row :gutter="16">
      <!--期限品种-->
      <h-col span="6">
        <h-row>
          <h-col span="9" class="label">{{$t("m.i.be.tenorVarieties")}}：</h-col>
          <h-col span="15" class="val">{{format("TenorVarieties",viewDatailForm.tenorVarieties)}}</h-col>
        </h-row>
      </h-col>
      <!--到期结算日-->
      <h-col span="6">
        <h-row>
          <h-col span="9" class="label">{{$t("m.i.be.dueSettleDt")}}:</h-col>
          <h-col span="15" class="val">{{formatDate(viewDatailForm.dueSettleDt)}}</h-col>
        </h-row>
      </h-col>
      <!--回购利率-->
      <h-col span="6">
        <h-row>
          <h-col span="9" class="label">{{$t("m.i.be.repurchaseRate")}}：</h-col>
          <h-col span="15" class="val">{{formatRate(viewDatailForm.ratePct)}}</h-col>
        </h-row>
      </h-col>
      <!--回购金额-->
      <h-col span="6">
        <h-row>
          <h-col span="9" class="label">{{$t("m.i.pe.buyBackTotalAmt")}}：</h-col>
          <h-col span="15" class="val">{{formatMoney(viewDatailForm.buyBackTotalAmt)}}</h-col>
        </h-row>
      </h-col>
    </h-row>
    <br>
    <h-row :gutter="16">
      <!--首期结算金额-->
      <h-col span="6">
        <h-row>
          <h-col span="9" class="label">{{$t("m.i.be.firstSettleAmtByUnit")}}：</h-col>
          <h-col span="15" class="val">{{formatMoney(viewDatailForm.firstSettleAmt)}}</h-col>
        </h-row>
      </h-col>
      <!--到期结算金额-->
      <h-col span="6">
        <h-row>
          <h-col span="9" class="label">{{$t("m.i.be.dueSettleAmtByUnit")}}：</h-col>
          <h-col span="15" class="val">{{formatMoney(viewDatailForm.dueSettleAmt)}}</h-col>
        </h-row>
      </h-col>
      <!--应付利息-->
      <h-col span="6">
        <h-row>
          <h-col span="9" class="label">{{$t("m.i.be.payInterestByUnit")}}：</h-col>
          <h-col span="15" class="val">{{formatMoney(viewDatailForm.firstPayInterest)}}</h-col>
        </h-row>
      </h-col>
      <!--信用主体类型-->
      <h-col span="6">
        <h-row>
          <h-col span="9" class="label">{{$t("m.i.billInfo.creditMainBankType")}}：</h-col>
          <h-col span="15" class="val">{{format("CreditMajor",viewDatailForm.creditMainBrchClass)}}</h-col>
        </h-row>
      </h-col>
    </h-row>
    <br>
    <h-row :gutter="16">
      <!--最晚结算时间-->
      <h-col span="6">
        <h-row>
          <h-col span="9" class="label">{{$t("m.i.be.setTm")}}：</h-col>
          <h-col span="15" class="val">{{viewDatailForm.setTm}}</h-col>
        </h-row>
      </h-col>
      <!--提票超时时间-->
      <h-col span="6">
        <h-row>
          <h-col span="9" class="label">{{$t("m.i.be.ticketOverTime")}}：</h-col>
          <h-col span="15" class="val">{{viewDatailForm.respTm}}</h-col>
        </h-row>
      </h-col>
      <!--票据总额-->
      <h-col span="6">
        <h-row>
          <h-col span="9" class="label">{{$t("m.i.common.totalAmtBillPackage")}}：</h-col>
          <h-col span="15" class="val">{{formatMoney(viewDatailForm.totalAmt)}}</h-col>
        </h-row>
      </h-col>
      <!--票据张数-->
      <h-col span="6">
        <h-row>
          <h-col span="9" class="label">{{$t("m.i.common.totalNumBillPackage")}}：</h-col>
          <h-col span="15" class="val">{{viewDatailForm.totalNum}}</h-col>
        </h-row>
      </h-col>
    </h-row>
  </div>
</template>

<script>
  import { post, on, off,formatNumber } from "@/api/bizApi/commonUtil";
  export default {
    name: "anonySaleDetail",
    data() {
      let _this = this;
      return {

      }
    },
    props: {
      anonySaleDetailWin: {
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
        return this.anonySaleDetailWin;
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
        return formatNumber(value, 2, ',');
      },
      formatRate(value){
        return formatNumber(value, 4, ',');
      },
      formatDateTime(value) {
        return value ? this.$moment(value, "YYYYMMDDHHmmss").format("YYYY-MM-DD HH:mm:ss") : "";
      },
    }
  };
</script>

<style scoped>

</style>
