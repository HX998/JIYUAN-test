<!--弹窗共用字段-->
<template>
  <div v-if="isShow">
    <h-row :gutter="16">
      <!--票号-->
      <h-col span="6">
        <h-row>
          <h-col span="9" class="label">{{$t("m.i.billInfo.billNo")}}：</h-col>
          <h-col span="15" class="val">{{viewDatailForm.billNo}}</h-col>
        </h-row>
      </h-col>
      <!--票据介质-->
      <h-col span="6">
        <h-row>
          <h-col span="9" class="label">{{$t("m.i.billInfo.billClass")}}：</h-col>
          <h-col span="15" class="val">{{format("CDMedia",viewDatailForm.billClass)}}</h-col>
        </h-row>
      </h-col>
      <!--票据种类-->
      <h-col span="6">
        <h-row>
          <h-col span="9" class="label">{{$t("m.i.billInfo.billType")}}：</h-col>
          <h-col span="15" class="val">{{format("DraftTypeCode",viewDatailForm.billType)}}</h-col>
        </h-row>
      </h-col>
      <!--票据金额-->
      <h-col span="6">
        <h-row>
          <h-col span="9" class="label">{{$t("m.i.billInfo.billMoneyByUnit")}}：</h-col>
          <h-col span="15" class="val">{{formatMoney(viewDatailForm.billMoney)}}</h-col>
        </h-row>
      </h-col>
    </h-row>
    <br>
    <h-row :gutter="16">
      <!--出票日-->
      <h-col span="6">
        <h-row>
          <h-col span="9" class="label">{{$t("m.i.billInfo.remitDt")}}:</h-col>
          <h-col span="15" class="val">{{formatDate(viewDatailForm.remitDt)}}</h-col>
        </h-row>
      </h-col>
      <!--到期日-->
      <h-col span="6">
        <h-row>
          <h-col span="9" class="label">{{$t("m.i.billInfo.dueDt")}}:</h-col>
          <h-col span="15" class="val">{{formatDate(viewDatailForm.dueDt)}}</h-col>
        </h-row>
      </h-col>
      <!--转垫款日期-->
      <h-col span="6">
        <h-row>
          <h-col span="9" class="label">{{$t("m.i.common.advancedPayDt")}}:</h-col>
          <h-col span="15" class="val">{{formatDate(viewDatailForm.advancedPayDt)}}</h-col>
        </h-row>
      </h-col>
      <!--垫款金额-->
      <h-col span="6">
        <h-row>
          <h-col span="9" class="label">{{$t("m.i.common.advancedPayAmt")}}：</h-col>
          <h-col span="15" class="val">{{formatMoney(viewDatailForm.advancedPayAmt)}}</h-col>
        </h-row>
      </h-col>
    </h-row>
    <br>
    <h-row :gutter="16">
      <!--垫款余额-->
      <h-col span="6">
        <h-row>
          <h-col span="9" class="label">{{$t("m.i.common.advancedBalanceAmt")}}：</h-col>
          <h-col span="15" class="val">{{formatMoney(viewDatailForm.advancedBalanceAmt)}}</h-col>
        </h-row>
      </h-col>
      <!--总收回余额-->
      <h-col span="6">
        <h-row>
          <h-col span="9" class="label">{{$t("m.i.common.sumSaleReceiveAmt")}}：</h-col>
          <h-col span="15" class="val">{{formatMoney(viewDatailForm.sumSaleReceiveAmt)}}</h-col>
        </h-row>
      </h-col>
      <!--总收回利息-->
      <h-col span="6">
        <h-row>
          <h-col span="9" class="label">{{$t("m.i.common.sumSaleReceiveInterest")}}：</h-col>
          <h-col span="15" class="val">{{formatMoney(viewDatailForm.sumSaleReceiveInterest)}}</h-col>
        </h-row>
      </h-col>
    </h-row>
  </div>
</template>

<script>
  import { post, on, off,formatNumber } from "@/api/bizApi/commonUtil";
  export default {
    name: "billDetail",
    data() {
      let _this = this;
      return {
        currentCollapse: "",
      }
    },
    props: {
      billDetailWin: {
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
        return this.billDetailWin;
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
