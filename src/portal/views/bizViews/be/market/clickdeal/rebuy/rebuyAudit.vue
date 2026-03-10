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
                <h-col span="9" class="label">{{$t("m.i.common.busiType")}}:</h-col>
                <h-col span="15" class="val">{{format("QuoteBusiType",formItem.busiType)}}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.common.batchNo")}}:</h-col>
                <h-col span="15" class="val">{{formItem.batchNo}}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.brchName")}}:</h-col>
                <h-col span="15" class="val">{{formItem.buyBrchName}}</h-col>
              </h-row>
            </h-col>
          </h-row>

          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.traderName")}}:</h-col>
                <h-col span="15" class="val">{{formItem.buyTraderName}}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.tradDir")}}:</h-col>
                <h-col span="15" class="val">{{format("TrDir",this.formItem.trDir)}}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.isAnony")}}:</h-col>
                <h-col span="15" class="val">{{format("Yon",this.formItem.isAnony)}}</h-col>
              </h-row>
            </h-col>
          </h-row>

          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.billInfo.billType")}}:</h-col>
                <h-col span="15" class="val">{{format("DraftTypeCode",this.formItem.billType)}}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.billInfo.billClass")}}:</h-col>
                <h-col span="15" class="val">{{format("CDMedia",this.formItem.billClass)}}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.tradeRange")}}:</h-col>
                <h-col span="15" class="val">{{format("TradeRange",this.formItem.tradeRange)}}</h-col>
              </h-row>
            </h-col>
          </h-row>

          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.pe.dealRate")}}:</h-col>
                <h-col span="15" class="val">{{formatRate(formItem.ratePct)}}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.subDeal")}}:</h-col>
                <h-col span="15" class="val">{{format("Yon",formItem.subDeal)}}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.clearType")}}:</h-col>
                <h-col span="15" class="val">{{format("ClearType",formItem.clearType)}}</h-col>
              </h-row>
            </h-col>
          </h-row>

          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.settleMode")}}:</h-col>
                <h-col span="15" class="val">{{format("SettleType",formItem.settleMode)}}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.clearSpeed")}}:</h-col>
                <h-col span="15" class="val">{{format("ClearSpeed",formItem.clearSpeed)}}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.isNeedConfirm")}}:</h-col>
                <h-col span="15" class="val">{{format("Yon",formItem.isNeedConfirm)}}</h-col>
              </h-row>
            </h-col>
          </h-row>

          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.minResidualTermDay")}}:</h-col>
                <h-col span="15" class="val">{{formItem.minResidualTerm}}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.maxResidualTermDay")}}:</h-col>
                <h-col span="15" class="val">{{formItem.maxResidualTerm}}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.settleDt")}}:</h-col>
                <h-col span="15" class="val">{{formatDate(formItem.settleDt)}}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.minDueDt")}}:</h-col>
                <h-col span="15" class="val">{{formatDate(formItem.minDueDt)}}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.maxDueDt")}}:</h-col>
                <h-col span="15" class="val">{{formatDate(formItem.maxDueDt)}}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.common.totalAmtBillPackage")}}:</h-col>
                <h-col span="15" class="val">{{formatMoney(formItem.totalAmt)}}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.minBillAmt")}}:</h-col>
                <h-col span="15" class="val">{{formatMoney(formItem.minBillAmt)}}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.setTm")}}:</h-col>
                <h-col span="15" class="val">{{formItem.setTm}}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.be.quoteTm")}}:</h-col>
                <h-col span="15" class="val">{{formItem.quoteTm}}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{$t("m.i.billInfo.creditMainBankType")}}:</h-col>
                <h-col span="15" class="val">{{format("CreditMajor",formItem.creditMainBrchClass)}}</h-col>
              </h-row>
            </h-col>
          </h-row>

          <h-collapse v-model="currentCollapse" class="h-custom-collapse">
            <h-collapse-panel name="creditBrchNames" v-if="!!formItem.creditBrchNames">
              {{$t("m.i.be.creditBrchName")}}
              <p slot="content">{{formItem.creditBrchNames}}</p>
            </h-collapse-panel>
            <h-collapse-panel name="transBrchTypesName" v-if="!!formItem.transBrchTypesName">
              {{$t("m.i.be.transCustType")}}
              <p slot="content">{{formItem.transBrchTypesName}}</p>
            </h-collapse-panel>
            <h-collapse-panel name="acptBrchTypesName" v-if="!!formItem.acptBrchTypesName">
              {{$t("m.i.billInfo.acptBankType")}}
              <p slot="content">{{formItem.acptBrchTypesName}}</p>
            </h-collapse-panel>
            <h-collapse-panel name="acptBrchNames" v-if="!!formItem.acptBrchNames">
              {{$t("m.i.billInfo.acptBankName")}}
              <p slot="content">{{formItem.acptBrchNames}}</p>
            </h-collapse-panel>
            <h-collapse-panel name="discBrchTypesName" v-if="!!formItem.discBrchTypesName">
              {{$t("m.i.billInfo.discBankType")}}
              <p slot="content">{{formItem.discBrchTypesName}}</p>
            </h-collapse-panel>
            <h-collapse-panel name="discBrchNames" v-if="!!formItem.discBrchNames">
              {{$t("m.i.billInfo.discBankName")}}
              <p slot="content">{{formItem.discBrchNames}}</p>
            </h-collapse-panel>
            <h-collapse-panel name="trustBrchTypesName" v-if="!!formItem.trustBrchTypesName">
              {{$t("m.i.billInfo.trustBankType")}}
              <p slot="content">{{formItem.trustBrchTypesName}}</p>
            </h-collapse-panel>
            <h-collapse-panel name="trustBrchNames" v-if="!!formItem.trustBrchNames">
              {{$t("m.i.billInfo.trustBankName")}}
              <p slot="content">{{formItem.trustBrchNames}}</p>
            </h-collapse-panel>
          </h-collapse>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { formatNumber, getDictValueFromMap, post, on, off, getDictListByGroups } from "@/api/bizApi/commonUtil";

  export default {
    name: "rebuyAudit",
    data() {
      return {
        billFormItem: {
          batchId: ""
        },
        formItem: {},
        dictMap: new Map(),
        busiType: "",
        currentCollapse: "",
        brchClassMap: new Map(),
        transBrchTypesName: "",
        acptBrchTypesName: "",
        discBrchTypesName: "",
        trustBrchTypesName: "",
      };
    },
    components: {},
    props: {
      isShow: {
        type: Boolean,
        default: false
      },
      listIds: "",
      batchId: ""
    },
    created() {
      this.billFormItem.batchId = this.batchId;
    },
    mounted() {
      getDictListByGroups("ClearSpeed,SettleType,ClearType,Yon,QuoteBusiType,TrDir,CDMedia,DraftTypeCode,CreditMajor,TradeRange,BrchClass,ClearMode").then(res => {
        let brchClassList = res.get("BrchClass");
        brchClassList.forEach(x => {
          return this.brchClassMap.set(x.key, x.value)
        });
        this.dictMap = res.get("map");
        this.init();
      });
    },
    methods: {
      format(groupcode, key) {
        return getDictValueFromMap(this.dictMap, groupcode, key);
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
      //  初始化页面
      init() {
        let batchId = this.batchId;
        let url = "";
        if (batchId) {
          url = "/be/market/clickdeal/rebuy/rebuyAudit/func_getClickDealRebuyBatchDetail";
        } else {
          this.$msgTip.error(this, { info: "批次ID不能为空" });
        }
        post({ batchId: batchId }, url).then(res => {
          if (res && res.data) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$nextTick(() => {
                let obj = res.data.retData;
                this.formItem = obj;
                this.busiType = obj.busiType;
                this.formItem.settleDt = this.$moment(obj.settleDt, "YYYYMMDD").format("YYYY-MM-DD");

                if (null != obj.transCustType) {
                  let brchClassNameList = [];
                  obj.transCustType.split(",").forEach(x => brchClassNameList.push(this.brchClassMap.get(x)));
                  this.formItem.transBrchTypesName = brchClassNameList.join("┃");
                }
                if (null != obj.acptBrchClasses) {
                  let brchClassNameList = [];
                  obj.acptBrchClasses.split(",").forEach(x => brchClassNameList.push(this.brchClassMap.get(x)));
                  this.formItem.acptBrchTypesName = brchClassNameList.join("┃");
                }
                if (null != obj.discBrchClasses) {
                  let brchClassNameList = [];
                  obj.discBrchClasses.split(",").forEach(x => brchClassNameList.push(this.brchClassMap.get(x)));
                  this.formItem.discBrchTypesName = brchClassNameList.join("┃");
                }
                if (null != obj.trustBrchClasses) {
                  let brchClassNameList = [];
                  obj.trustBrchClasses.split(",").forEach(x => brchClassNameList.push(this.brchClassMap.get(x)));
                  this.formItem.trustBrchTypesName = brchClassNameList.join("┃");
                }
                if (obj.creditMainBrchNames) {
                  this.formItem.creditBrchNames = obj.creditMainBrchNames.replace(/,/g, "┃");
                }
                if (obj.acptBrchNames) {
                  this.formItem.acptBrchNames = obj.acptBrchNames.replace(/,/g, "┃");
                }
                if (obj.discBrchNames) {
                  this.formItem.discBrchNames = obj.discBrchNames.replace(/,/g, "┃");
                }
                if (obj.trustBrchNames) {
                  this.formItem.trustBrchNames = obj.trustBrchNames.replace(/,/g, "┃");
                }
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
