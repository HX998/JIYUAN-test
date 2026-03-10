<!--客户明细 客户信息+账户信息--->
<template>
  <div>
    <h-msg-box v-model="tempRgstInfoCompareWin" :maximize="true" :mask-closable="false" @on-close="handleClose"
               width="1250" class="h-form-search-layer">
      <p slot="header">
        <span>信息登记比对</span>
      </p>
      <div>
        <!--        <h-form :model="compareForm" :label-width="115" cols="3" class="abc" >-->
        <!--          <h-row type="flex"  align="top" height="10">-->
        <!--            <h-col span="4" class-name="info-item">-->
        <!--            </h-col>-->
        <!--            <h-col span="4" class-name="info-item">-->
        <!--              <p class="label">{{$t("m.i.bm.oldRgstInfo")}}</p>-->
        <!--            </h-col>-->
        <!--            <h-col span="4" class-name="info-item">-->
        <!--              <p class="label">{{$t("m.i.bm.newRgstInfo")}}</p>-->
        <!--            </h-col>-->
        <!--            <h-col span="4" class-name="info-item">-->
        <!--            </h-col>-->
        <!--            <h-col span="4" class-name="info-item">-->
        <!--              <p class="label">{{$t("m.i.bm.oldRgstInfo")}}</p>-->
        <!--            </h-col>-->
        <!--            <h-col span="4" class-name="info-item">-->
        <!--              <p class="label">{{$t("m.i.bm.newRgstInfo")}}</p>-->
        <!--            </h-col>-->
        <!--          </h-row>-->
        <!--          <h-row type="flex"  align="top" height="10">-->
        <!--            <h-col span="4" class-name="info-item">-->
        <!--              <p class="label">{{$t("m.i.common.corpName")}}</p>-->
        <!--            </h-col>-->
        <!--            <h-col span="4" class-name="info-item">-->
        <!--                <input v-model="compareForm.corpName"  readonly placeholder=""></input>-->
        <!--            </h-col>-->
        <!--            <h-col span="4" class-name="info-item">-->
        <!--              <p class="label">{{$t("m.i.bm.newRgstInfo")}}</p>-->
        <!--            </h-col>-->
        <!--            <h-col span="4" class-name="info-item">-->
        <!--            </h-col>-->
        <!--            <h-col span="4" class-name="info-item">-->
        <!--              <p class="label">{{$t("m.i.bm.oldRgstInfo")}}</p>-->
        <!--            </h-col>-->
        <!--            <h-col span="4" class-name="info-item">-->
        <!--              <p class="label">{{$t("m.i.bm.newRgstInfo")}}</p>-->
        <!--            </h-col>-->
        <!--          </h-row>-->
        <!--        </h-form>-->
        <div style="margin: 0 20px;border: 1px solid #666666;">
          <table style="border-collapse: collapse;border-spacing: 0;width: 100%;">
            <colgroup>
              <col width="16%">
              <col width="17%">
              <col width="17%">
              <col width="17%">
              <col width="17%">
              <col width="17%">
            </colgroup>
            <tr>
              <td class="th"></td>
              <td class="th tac">{{ $t("m.i.bm.oldRgstInfo") }}</td>
              <td class="th tac">{{ $t("m.i.bm.newRgstInfo") }}</td>
              <td class="th"></td>
              <td class="th tac">{{ $t("m.i.bm.oldRgstInfo") }}</td>
              <td class="th tac">{{ $t("m.i.bm.newRgstInfo") }}</td>
            </tr>
            <tr>
              <td class="th">{{ $t('m.i.common.corpName') }}</td>
              <td>{{ compareForm.oldCustName }}</td>
              <td>{{ compareForm.newCustName }}</td>
              <td class="th">{{ $t('m.i.common.socCode') }}</td>
              <td>{{ compareForm.oldSocCode }}</td>
              <td>{{ compareForm.newSocCode }}</td>
            </tr>
            <tr>
              <td class="th">{{ $t('m.i.bm.lccCode') }}</td>
              <td>{{ compareForm.oldLccCode }}</td>
              <td>{{ compareForm.newLccCode }}</td>
              <td class="th">{{ $t('m.i.bm.leiCode') }}</td>
              <td>{{ compareForm.oldLeiCode }}</td>
              <td>{{ compareForm.newLeiCode }}</td>
            </tr>
            <tr>
              <td class="th">{{ $t('m.i.bm.custEmail') }}</td>
              <td>{{ compareForm.oldCustEmail }}</td>
              <td>{{ compareForm.newCustEmail }}</td>
              <td class="th"></td>
              <td>{{ compareForm.pyeeBankName }}</td>
              <td>{{ compareForm.pyeeBankName }}</td>
            </tr>
            <tr>
              <td class="th">{{ $t('m.i.bm.custAddr') }}</td>
              <td>{{ compareForm.oldCustAddr }}</td>
              <td>{{ compareForm.newCustAddr }}</td>
              <td class="th">{{ $t('m.i.bm.mainBusiAddr') }}</td>
              <td>{{ compareForm.oldMainBusiAddr }}</td>
              <td>{{ compareForm.newMainBusiAddr }}</td>
            </tr>
            <tr>
              <td class="th">{{ $t('m.i.bm.corpScale') }}</td>
              <td>{{format("CorpScale", compareForm.oldCorpScale)}}</td>
              <td>{{format("CorpScale", compareForm.newCorpScale)}}</td>
              <td class="th">{{ $t('m.i.common.isGreenCorpFdisc') }}</td>
              <td>{{format("Yon", compareForm.oldIsGreenCorp)}}</td>
              <td>{{format("Yon", compareForm.newIsGreenCorp)}}</td>
            </tr>
            <tr>
              <td class="th">{{ $t('m.i.bm.corpNature') }}</td>
              <td>{{format("CpesCorpNature", compareForm.oldCorpNature)}}</td>
              <td>{{format("CpesCorpNature", compareForm.newCorpNature)}}</td>
              <td class="th">{{ $t('m.i.common.isSciCorpFdisc') }}</td>
              <td>{{format("Yon", compareForm.oldIsTechnologyCorp)}}</td>
              <td>{{format("Yon", compareForm.newIsTechnologyCorp)}}</td>
            </tr>
            <tr>
              <td class="th">{{ $t('m.i.bs.creditRating') }}</td>
              <td>{{ compareForm.oldCreditRating }}</td>
              <td>{{ compareForm.newCreditRating }}</td>
              <td class="th">{{ $t('m.i.billInfo.cdtRatgAgcy') }}</td>
              <td>{{ compareForm.oldCreditRatingMain }}</td>
              <td>{{ compareForm.newCreditRatingMain }}</td>
            </tr>
            <tr>
              <td class="th">{{ $t('m.i.billInfo.cdtRatgDueDt') }}</td>
              <td>{{formatDate(compareForm.oldCreditRatgDueDt)}}</td>
              <td>{{formatDate(compareForm.newCreditRatgDueDt)}}</td>
              <td class="th"></td>
              <td>{{ compareForm.pyeeBankName }}</td>
              <td>{{ compareForm.pyeeBankName }}</td>
            </tr>
            <tr>
              <td class="th">{{ $t('m.i.bm.corpLegalName') }}</td>
              <td>{{ compareForm.oldCorpLegalName }}</td>
              <td>{{ compareForm.newCorpLegalName }}</td>
              <td class="th">{{ $t('m.i.bm.corpLegalCertType') }}</td>
              <td>{{format("CertType", compareForm.oldCorpLegalCertType)}}</td>
              <td>{{format("CertType", compareForm.newCorpLegalCertType)}}</td>
            </tr>
          </table>
        </div>
      </div>
      <div slot="footer">
        <h-button type="primary" @click="handleClose">{{ $t("m.i.common.commit") }}</h-button>
      </div>
    </h-msg-box>
  </div>
</template>
<script>
  import { post, formatNumber } from "@/api/bizApi/commonUtil";
  export default {
    name: "rgstInfoCompare",
    data() {
      let _this = this;
      return {
        custNo:"",
        compareForm:{
          oldCustName:"",
          oldSocCode:"",
        }
      }
    },
    watch: {
      rgstInfoCompareWin(val) {
        if (val) {
          this.$nextTick(() => {
            this.custNo = this.compareParams.custNo;
            this.query();
          });
        }
      },
      batchId(val) {
        this.batchId = val;
      }
    },
    computed: {
      tempRgstInfoCompareWin: {
        get() {
          return this.rgstInfoCompareWin;
        },
        set() {
        }
      }
    },
    props: {
      rgstInfoCompareWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      dictMap: { //CorpScale,Industry,partnerType,Yon
        type: Map
      },
      compareParams: {
        type: Object,
        default: {}
      }
    },
    methods: {
      formatDate(value) {
        return value ? this.$moment(value, "YYYY-MM-DD").format("YYYY-MM-DD") : "";
      },
      format(groupcode, key) {
        if (typeof key === "undefined" || key === null) {
          return "";
        }
        if (this.dictMap.size === 0) {
          return key;
        }
        let status=this.dictMap.get(groupcode).get(key);
        if(status){
          return status;
        }else{
          return key;
        }
      },
      handleClose() {
        this.$emit("rgstInfoCompareWinClose", "");
      },
      query(){
        let params = { custNo: this.custNo };
        let url = "/bm/cpes/custsign/custCorpSign/func_getCompareData";
        post(params, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let obj = res.data.retData;
              this.compareForm.oldCustName = obj.oldCustName;
              this.compareForm.oldSocCode = obj.oldSocCode;
              this.compareForm.oldLccCode = obj.oldLccCode;
              this.compareForm.oldLeiCode = obj.oldLeiCode;
              this.compareForm.oldCustEmail = obj.oldCustEmail;
              this.compareForm.oldCustAddr = obj.oldCustAddr;
              this.compareForm.oldMainBusiAddr = obj.oldMainBusiAddr;
              this.compareForm.oldIndustryCategory = obj.oldIndustryCategory;
              this.compareForm.oldCorpScale = obj.oldCorpScale;
              this.compareForm.oldCorpNature = obj.oldCorpNature;
              this.compareForm.oldIsTechnologyCorp = obj.oldIsTechnologyCorp;
              this.compareForm.oldIsGreenCorp = obj.oldIsGreenCorp;
              this.compareForm.oldCreditRating = obj.oldCreditRating;
              this.compareForm.oldCreditRatingMain = obj.oldCreditRatingMain;
              this.compareForm.oldCreditRatgDueDt = obj.oldCreditRatgDueDt;
              this.compareForm.oldCorpLegalName = obj.oldCorpLegalName;
              this.compareForm.oldCorpLegalCertType = obj.oldCorpLegalCertType;
              this.compareForm.newCustName = obj.newCustName;
              this.compareForm.newSocCode = obj.newSocCode;
              this.compareForm.newLccCode = obj.newLccCode;
              this.compareForm.newLeiCode = obj.newLeiCode;
              this.compareForm.newCustEmail = obj.newCustEmail;
              this.compareForm.newCustAddr = obj.newCustAddr;
              this.compareForm.newMainBusiAddr = obj.newMainBusiAddr;
              this.compareForm.newIndustryCategory = obj.newIndustryCategory;
              this.compareForm.newCorpScale = obj.newCorpScale;
              this.compareForm.newCorpNature = obj.newCorpNature;
              this.compareForm.newIsTechnologyCorp = obj.newIsTechnologyCorp;
              this.compareForm.newIsGreenCorp = obj.newIsGreenCorp;
              this.compareForm.newCreditRating = obj.newCreditRating;
              this.compareForm.newCreditRatingMain = obj.newCreditRatingMain;
              this.compareForm.newCreditRatgDueDt = obj.newCreditRatgDueDt;
              this.compareForm.newCorpLegalName = obj.newCorpLegalName;
              this.compareForm.newCorpLegalCertType = obj.newCorpLegalCertType;
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      }
    }
  };
</script>
<style scoped>
td {
  border: 1px solid #666666;
  height: 40px;
  padding: 0 7px;
  color: #000000;
}
.th {
  text-align: right;
  color: #333333;
}
.tac {
  text-align: center;
}
</style>
