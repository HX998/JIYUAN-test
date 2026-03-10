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
                <h-col span="15" class="val">{{ formItem.batchNo }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t('m.i.bs.collectMode') }}:</h-col>
                <h-col span="15" class="val">{{ format("CollectMode", formItem.collectMode) }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t('m.i.bs.baseAssetType') }}:</h-col>
                <h-col span="15" class="val">{{ format("BaseAssetType", formItem.baseAssetType) }}</h-col>
              </h-row>
            </h-col>
          </h-row>

          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t('m.i.bs.stdProductName') }}:</h-col>
                <h-col span="15" class="val">{{ formItem.stdProductName }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t('m.i.bs.stdProductShortName') }}:</h-col>
                <h-col span="15" class="val">{{ formItem.stdProductShortName }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t('m.i.bs.stdProductNo') }}:</h-col>
                <h-col span="15" class="val">{{ formItem.stdProductNo }}</h-col>
              </h-row>
            </h-col>
          </h-row>

          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t('m.i.bs.ecdsAcctNo') }}:</h-col>
                <h-col span="15" class="val">{{ formItem.ecdsAcctNo }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t("m.i.bs.ecdsAcctName") }}:</h-col>
                <h-col span="15" class="val">{{ formItem.ecdsAcctName }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t('m.i.bs.dpstBrchName') }}:</h-col>
                <h-col span="15" class="val">{{ formItem.dpstBrchName }}</h-col>
              </h-row>
            </h-col>
          </h-row>

          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t('m.i.bs.dpstBrchCode') }}:</h-col>
                <h-col span="15" class="val">{{ formItem.dpstBrchCode }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t('m.i.bs.sellBrchName') }}:</h-col>
                <h-col span="15" class="val">{{ formItem.sellBrchName }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t('m.i.bs.financeMaxRatePct') }}:</h-col>
                <h-col span="15" class="val">{{ formItem.financeMaxRatePct }}</h-col>
              </h-row>
            </h-col>
          </h-row>

          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t('m.i.bs.financeMinRatePct') }}:</h-col>
                <h-col span="15" class="val">{{ formItem.financeMinRatePct }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t('m.i.bs.publishDt') }}:</h-col>
                <h-col span="15" class="val">{{ formatDate(formItem.publishDt) }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t('m.i.bs.declareEndDtTm') }}:</h-col>
                <h-col span="15" class="val">{{ formatDateTime(formItem.declareEndDtTm) }}</h-col>
              </h-row>
            </h-col>
          </h-row>

          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t('m.i.bs.purchaseDt') }}:</h-col>
                <h-col span="15" class="val">{{ formatDate(formItem.purchaseDt) }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t('m.i.bs.raiseDt') }}:</h-col>
                <h-col span="15" class="val">{{ formatDate(formItem.raiseDt) }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t('m.i.bs.paymentDt') }}:</h-col>
                <h-col span="15" class="val">{{ formatDate(formItem.paymentDt) }}</h-col>
              </h-row>
            </h-col>
          </h-row>

          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t('m.i.bs.transPlace') }}:</h-col>
                <h-col span="15" class="val">{{ format("TransPlace", formItem.transPlace) }}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <br>
          <h-row>
            <h-col span="24">
              <ul>
                <li>
                  <hr>
                </li>
              </ul>
            </h-col>
          </h-row>
          <br>
          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t('m.i.bs.creationMaxAmt') }}:</h-col>
                <h-col span="15" class="val">{{ formatNumber(formItem.creationMaxAmt) }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t('m.i.bs.creationMaxTerm') }}:</h-col>
                <h-col span="15" class="val">{{ formItem.creationMaxTerm }}</h-col>
              </h-row>
            </h-col>
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t('m.i.bs.preBeginDueDt') }}:</h-col>
                <h-col span="15" class="val">{{ formatDate(formItem.preBeginDueDt) }}</h-col>
              </h-row>
            </h-col>
          </h-row>

          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-col span="9" class="label">{{ $t('m.i.bs.preEndDueDt') }}:</h-col>
                <h-col span="15" class="val">{{ formatDate(formItem.preEndDueDt) }}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <br>
          <h-row>
            <h-col span="24">
              <ul>
                <li>
                  <hr>
                </li>
              </ul>
            </h-col>
          </h-row>
          <br>
          <div v-if="formItem.isSelfSell==='1'">
            <h-row :gutter="8">
              <h-col span="8">
                <h-row>
                  <h-col span="9" class="label">{{ $t('m.i.bs.calFeeType') }}:</h-col>
                  <h-col span="15" class="val">{{ format("CalFeeType", formItem.calFeeType) }}</h-col>
                </h-row>
              </h-col>
              <h-col span="8">
                <h-row>
                  <h-col span="9" class="label">{{ $t('m.i.bs.feeRate') }}:</h-col>
                  <h-col span="15" class="val">{{ formItem.feeRatePct }}</h-col>
                </h-row>
              </h-col>
              <h-col span="8">
                <h-row>
                  <h-col span="9" class="label">{{ $t('m.i.bs.sellCalFeeType') }}:</h-col>
                  <h-col span="15" class="val">{{ format("CalFeeType", formItem.sellCalFeeType) }}</h-col>
                </h-row>
              </h-col>
            </h-row>
            <br>
            <h-row :gutter="8">
              <h-col span="8">
                <h-row>
                  <h-col span="9" class="label">{{ $t('m.i.bs.sellFeeRate') }}:</h-col>
                  <h-col span="15" class="val">{{ formItem.sellFeeRatePct }}</h-col>
                </h-row>
              </h-col>
            </h-row>
            <br>
          </div>
          <dev v-else>
            <h-row :gutter="8">
              <h-col span="8">
                <h-row>
                  <h-col span="9" class="label">{{ $t('m.i.bs.calFeeType') }}:</h-col>
                  <h-col span="15" class="val">{{ format("CalFeeType", formItem.calFeeType) }}</h-col>
                </h-row>
              </h-col>
              <h-col span="8">
                <h-row>
                  <h-col span="9" class="label">{{ $t('m.i.bs.feeRate') }}:</h-col>
                  <h-col span="15" class="val">{{ formItem.feeRatePct }}</h-col>
                </h-row>
              </h-col>
            </h-row>

            <br>
          </dev>


          <h-row :gutter="8">
            <h-col span="8">
              <h-row>
                <h-button type="primary" @click="showCreditMain()">{{ $t('m.i.bs.showCreditMain') }}</h-button>
                <h-button type="primary" @click="showOrgHolder()" v-if="formItem.collectMode === 'CM02'">
                  {{ $t('m.i.bs.showOrgHolder') }}
                </h-button>
              </h-row>
            </h-col>
          </h-row>
        </div>
      </div>
    </div>

    <show-org-holder :showOrgHolderWin="showOrgHolderWin" :creationId="batchId" :dictMap="dictMap" :batchParams="holderParams"
                     :title="$t('m.i.bs.showOrgHolder')" @showOrgHolderWinClose="showOrgHolderWinClose"
                     :isShow="true"></show-org-holder>
    <show-credit-main :showCreditMainWin="showCreditMainWin" :creationId="batchId" :batchParams="creditParams"
                      :baseAssetType="this.formItem.baseAssetType" :dictMap="dictMap"
                      :title="$t('m.i.bs.showCreditMain')" :isShow="true"
                      @showCreditMainClose="showCreditMainClose"></show-credit-main>
  </div>
</template>

<script>
import {getDictListByGroups, getDictValueFromMap, post,formatNumber} from "@/api/bizApi/commonUtil";

export default {
  name: "stdCreationAudit",
  data() {
    return {
      billFormItem: {
        batchId: ""
      },
      formItem: {},
      dictMap: new Map(),
      showOrgHolderWin: false,
      showCreditMainWin: false,
      holderParams:{},
      creditParams:{}
    };
  },
  components: {
    ShowCreditMain: () => import(/* webpackChunkName: "bs/corpstdbill/creation/showCreditMain" */"@/views/bizViews/bs/corpstdbill/creation/showCreditMain"),
    ShowOrgHolder: () => import(/* webpackChunkName: "bs/corpstdbill/creation/showOrgHolder" */"@/views/bizViews/bs/corpstdbill/creation/showOrgHolder"),
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
    this.billFormItem.batchId = this.batchId;
  },
  mounted() {
    getDictListByGroups("BaseAssetType,Yon,DraftTypeCode,CDMedia,TransPlace,CollectMode,CorpScale,Industry,partnerType,CalFeeType,RatingExpectationType,MemberType,CreditRating").then(res => {
      this.dictMap = res.get("map");
      this.init();
    });
  },
  methods: {
    format(groupCode, key) {
      return getDictValueFromMap(this.dictMap, groupCode, key);
    },
    formatDate(value) {
      return value ? this.$moment(value, "YYYY-MM-DD").format("YYYY-MM-DD") : "";
    },
    formatDateTime(value) {
      return value ? this.$moment(value, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss") : "";
    },
    formatNumber(value){
      return formatNumber(value, 2, ",");
    },
    //  初始化页面
    init() {
      let batchId = this.batchId;
      let url = "";
      if (batchId) {
        url = "/bs/corpstdbill/creation/stdCreationApply/func_jumpEditStdCreation";
      } else {
        this.$msgTip.error(this, {info: "批次ID不能为空"});
      }
      post({id: batchId}, url).then(res => {
        if (res && res.data) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.$nextTick(() => {
              this.formItem = res.data.retData;
            });
          } else {
            this.$msgTip.error(this, {info: res.data.retMsg});
          }
        }
      }).catch(error => {
        this.$msgTip.error(this, {info: this.$t("m.i.common.netError") + error});
      });
    },
    showCreditMain() {
      this.showCreditMainWin = true;
    },
    showCreditMainClose() {
      this.showCreditMainWin = false;
    },
    showOrgHolder() {
      this.showOrgHolderWin = true;
    },
    showOrgHolderWinClose() {
      this.showOrgHolderWin = false;
    },
  }
};
</script>

<style scoped>

</style>
