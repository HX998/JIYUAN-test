<!--匿名点击逆回购-申请管理审批-->
<template>
  <!-- 批次信息 -->
  <div v-if="isShow">
    <div class="text-wrap mb-10">
      <div class="text-header"><span class="tit">详细信息</span></div>
      <div class="text-body">
        <h-row :gutter="8">
          <!--业务类型-->
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.common.busiType")}}:</h-col>
              <h-col span="15" class="val">{{formatDict("BusiType",viewDetailForm.busiType)}}</h-col>
            </h-row>
          </h-col>
          <!--批次号-->
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.batchNo")}}:</h-col>
              <h-col span="15" class="val">{{viewDetailForm.batchNo}}</h-col>
            </h-row>
          </h-col>
          <!--本方机构名称-->
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.ownBrchName")}}:</h-col>
              <h-col span="15" class="val">{{viewDetailForm.buyBrchName}}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <h-row :gutter="8">
          <!--本方交易员名称-->
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.traderName")}}:</h-col>
              <h-col span="15" class="val">{{viewDetailForm.buyTraderName}}</h-col>
            </h-row>
          </h-col>
          <!--票据种类-->
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.billInfo.billType")}}:</h-col>
              <h-col span="15" class="val">{{formatDict("DraftTypeCode",viewDetailForm.billType)}}</h-col>
            </h-row>
          </h-col>
          <!--票据介质-->
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.billInfo.billClass")}}:</h-col>
              <h-col span="15" class="val">{{formatDict("CDMedia",viewDetailForm.billClass)}}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <h-row :gutter="8">
          <!--回购利率-->
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.repurchaseRate")}}:</h-col>
              <h-col span="15" class="val">{{formatRate(viewDetailForm.ratePct)}}</h-col>
            </h-row>
          </h-col>
          <!--回购金额-->
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.pe.buyBackTotalAmt")}}:</h-col>
              <h-col span="15" class="val">{{formatMoney(viewDetailForm.buyBackTotalAmt)}}</h-col>
            </h-row>
          </h-col>
          <!--回购期限-->
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.repoTerm")}}:</h-col>
              <h-col span="15" class="val">{{viewDetailForm.tenorDays}}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <h-row :gutter="8">
          <!--期限品种-->
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.tenorVarieties")}}:</h-col>
              <h-col span="15" class="val">{{formatDict("TenorVarieties",viewDetailForm.tenorVarieties)}}</h-col>
            </h-row>
          </h-col>
          <!--清算类型-->
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.clearType")}}:</h-col>
              <h-col span="15" class="val">{{formatDict("ClearType",viewDetailForm.clearType)}}</h-col>
            </h-row>
          </h-col>
          <!--结算方式-->
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.settleMode")}}:</h-col>
              <h-col span="15" class="val">{{formatDict("SettleType",viewDetailForm.settleMode)}}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <h-row :gutter="8">
          <!--清算速度-->
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.clearSpeed")}}:</h-col>
              <h-col span="15" class="val">{{formatDict("ClearSpeed",viewDetailForm.clearSpeed)}}</h-col>
            </h-row>
          </h-col>
          <!--首期结算日-->
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.firstSettleDate")}}:</h-col>
              <h-col span="15" class="val">{{formatDate(viewDetailForm.settleDt)}}</h-col>
            </h-row>
          </h-col>
          <!--到期结算日-->
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.be.dueSettleDt")}}:</h-col>
              <h-col span="15" class="val">{{formatDate(viewDetailForm.dueSettleDt)}}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <h-row :gutter="8">
          <!--信用主体类型-->
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">{{$t("m.i.billInfo.creditMainBankType")}}:</h-col>
              <h-col span="15" class="val">{{formatDict("CreditMajor",viewDetailForm.creditMainBrchClass)}}</h-col>
            </h-row>
          </h-col>
        </h-row>
      </div>
    </div>
  </div>
</template>

<script>
  import { post,formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "rebuyAudit",
    data() {
      return {
        viewDetailForm: {},
        dictMap: new Map()
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
    created() {

    },
    mounted() {
      this.getDictListByGroups("DraftTypeCode,CDMedia,TenorVarieties,ClearType,SettleType,ClearSpeed,CreditMajor,BusiType").then(res => {
        this.dictMap = res.get("map");
        this.init();
      });
    },
    methods: {
      formatDict(groupcode, key) {
        if (!!key) {
          return this.getDictValueFromMap(this.dictMap, groupcode, key);
        }
      },
      formatMoney(value) {
        return formatNumber(value, 2, ',');
      },
      formatRate(value){
        return formatNumber(value, 4, ',');
      },
      formatDate(value) {
        if (!!value) {
          return value ? this.$moment(value, "YYYY-MM-DD").format("YYYY-MM-DD") : "";
        }
      },
      //  初始化页面
      init() {
        let batchId = this.batchId;
        let url = "";
        if (batchId) {
          url = "/be/market/anonyclick/rebuy/rebuyAudit/func_findAnonyRebuyBatchById";
        } else {
          this.$msgTip.error(this, { info: "批次ID不能为空" });
        }
        post({ id: batchId}, url).then(res => {
          if (res && res.data) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$nextTick(() => {
                this.viewDetailForm = res.data.retData;
              });
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      }
    }
  };
</script>

<style scoped>

</style>
