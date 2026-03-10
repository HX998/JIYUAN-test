<template>
  <div>
    <h-msg-box v-model="tempStdBookKeepingDetailWin" maximize width="1000" :mask-closable="false" :zIndex="1010"
               @on-close="handleClose">
      <p slot="header">
        <span>簿记信息详情</span>
      </p>
      <div class="text-body">
        <h-row :gutter="16">
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t("m.i.common.batchNo") }}:</h-col>
              <h-col span="15" class="val">{{ formItem.batchNo }}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t('m.i.bs.stdProductName') }}:</h-col>
              <h-col span="15" class="val">{{ formItem.stdProductName }}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t('m.i.bs.stdProductShortName') }}:</h-col>
              <h-col span="15" class="val">{{ formItem.stdProductShortName }}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t('m.i.bs.stdProductNo') }}:</h-col>
              <h-col span="15" class="val">{{ formItem.stdProductNo }}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <br>
        <h-row :gutter="16">
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t('m.i.bs.creationAmt') }}:</h-col>
              <h-col span="15" class="val">{{ formatNumber(formItem.creationAmt) }}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t('m.i.bs.priceType') }}:</h-col>
              <h-col span="15" class="val">{{ format("PriceMethod", formItem.priceType) }}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t('m.i.bs.purchaseDt') }}:</h-col>
              <h-col span="15" class="val">{{ formatDate(formItem.purchaseDt) }}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t('m.i.bs.minPurchaseAmt') }}:</h-col>
              <h-col span="15" class="val">{{ formatNumber(formItem.minPurchaseAmt) }}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <br>
        <h-row :gutter="16">
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t('m.i.bs.steppedUpBasisAmt') }}:</h-col>
              <h-col span="15" class="val">{{ formatNumber(formItem.steppedUpBasisAmt) }}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t('m.i.bs.minPurchasePrice') }}:</h-col>
              <h-col span="15" class="val">{{ formatPriceNumber(formItem.minPurchasePrice) }}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t('m.i.bs.email') }}:</h-col>
              <h-col span="15" class="val">{{ formItem.sellEmail }}</h-col>
            </h-row>
          </h-col>
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t('m.i.bs.linkMan') }}:</h-col>
              <h-col span="15" class="val">{{ formItem.sellLinkMan }}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <br>
        <h-row :gutter="16">
          <h-col span="6">
            <h-row>
              <h-col span="9" class="label">{{ $t('m.i.bs.phone') }}:</h-col>
              <h-col span="15" class="val">{{ formItem.sellPhone }}</h-col>
            </h-row>
          </h-col>
        </h-row>
      </div>
      <div slot="footer">
      </div>
    </h-msg-box>
  </div>
</template>

<script>
  import {getDictValueFromMap, post, formatNumber} from "@/api/bizApi/commonUtil";

  export default {
    name: "stdBookKeepingDetail",
    data() {
      return {
        batchId: "",
        formItem: {}
      };
    },
    props: {
      stdBookKeepingDetailWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      batchParams: {
        type: Object,
        default() {
          return {};
        }
      },
      dictMap: {
        type: Map,
        required: true
      }
    },
    computed: {
      tempStdBookKeepingDetailWin: {
        get() {
          return this.stdBookKeepingDetailWin;
        },
        set() {
        }
      }
    },
    watch: {
      stdBookKeepingDetailWin(val) {
        if (val) {
          this.$nextTick(() => {
            this.batchId = this.batchParams.batchId;
            this.queryObjById();
          });
        }
      },
      batchId(val) {
        this.batchId = val;
      }
    },


    methods: {
      //根据批次Id查询信息
      queryObjById() {
        let params = {id: this.batchId};
        let url = "/bs/corpstdbill/underwrite/stdBookKeepingApply/func_findStdBookKeepingById";
        if (this.batchParams.bookKeepingUrl) {
          let url = this.batchParams.bookKeepingUrl;
        }
        post(params, url).then(res => {
            if (res) {
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.$nextTick(() => {
                  this.formItem = res.data.retData;
                });
              } else {
                this.$msgTip.error(this, {info: res.data.retMsg});
              }
            } else {
              this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
            }
          }
        );
      },
      handleClose() {
        this.$emit("stdBookKeepingDetailClose", "");
      },
      format(groupCode, key) {
        return getDictValueFromMap(this.dictMap, groupCode, key);
      },
      formatDate(value) {
        return value ? this.$moment(value, "YYYY-MM-DD").format("YYYY-MM-DD") : "";
      },
      formatDateTime(value) {
        return value ? this.$moment(value, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss") : "";
      },
      formatNumber(value) {
        return formatNumber(value, 2, ",");
      },
      formatPriceNumber(value) {
        return formatNumber(value, 4, ",");
      },
    }
  };
</script>

<style scoped>

</style>
