<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <h-field-panel collapse key="1">
          <span slot="title">电子合同要约申请201</span>
          <h-form :model="addForm" :label-width="135" ref="addForm" cols="2" class="h-form-search">
            <div>
              <h-form-item prop="ctrctDt" :label="$t('m.i.shcpe.ctrctDt')" required>
                <h-date-picker v-model="addForm.ctrctDt" type="date" placeholder="" showFormat :editable=false></h-date-picker>
              </h-form-item>
              <h-form-item prop="ctrctTp" :label="$t('m.i.shcpe.ctrctTp')" required>
                <h-select v-model="addForm.ctrctTp" placeholder="" showTitle>
                  <h-option value="CT01">转贴现</h-option>
                  <h-option value="CT02">承兑</h-option>
                  <h-option value="CT03">贴现</h-option>
                  <h-option value="CT04">再贴现</h-option>
                  <h-option value="CT05">质押</h-option>
                  <h-option value="CT06">保证</h-option>
                  <h-option value="CT07">其他</h-option>
                </h-select>
              </h-form-item>
              <h-form-item prop="comtmtDdln" :label="$t('m.i.shcpe.comtmtDdln')">
                <h-date-picker type="date" v-model="addForm.comtmtDdln" placeholder="" showFormat :editable=false></h-date-picker>
              </h-form-item>
              <h-form-item prop="cxlMrkr" :label="$t('m.i.shcpe.cxlMrkr')" required>
                <h-select v-model="addForm.cxlMrkr" placeholder="" showTitle>
                  <h-option value="CM01">可以撤销要约</h-option>
                  <h-option value="CM02">不可撤销要约</h-option>
                </h-select>
              </h-form-item>
              <h-form-item prop="rscisnTp" :label="$t('m.i.shcpe.rscisnTp')" required>
                <h-select v-model="addForm.rscisnTp" placeholder="" showTitle>
                  <h-option value="RT01">双方均不可通知解除</h-option>
                  <h-option value="RT02">要约方可通知解除</h-option>
                  <h-option value="RT03">受要约方可通知解除</h-option>
                  <h-option value="RT04">双方均可通知解除</h-option>
                </h-select>
              </h-form-item>
              <h-form-item prop="xtnsn" :label="$t('m.i.shcpe.xtnsn')" required>
                <h-input v-model="addForm.xtnsn" placeholder=""></h-input>
              </h-form-item>
              <h-form-item prop="cnts" :label="$t('m.i.shcpe.cnts')" required>
                <h-input v-model="addForm.cnts" placeholder=""></h-input>
              </h-form-item>
              <h-form-item prop="rtntnPrd" :label="$t('m.i.shcpe.rtntnPrd')" required>
                <h-input v-model="addForm.rtntnPrd" placeholder=""></h-input>
              </h-form-item>
              <h-form-item prop="offereeNm" :label="$t('m.i.shcpe.offereeNm')" required>
                <h-input v-model="addForm.offereeNm" placeholder=""></h-input>
              </h-form-item>
              <h-form-item prop="offereeAcctNo" :label="$t('m.i.shcpe.offereeAcctNo')" required>
                <h-input v-model="addForm.offereeAcctNo" placeholder="" :maxlength=32></h-input>
              </h-form-item>
              <h-form-item prop="offereeBankNo" :label="$t('m.i.shcpe.offereeBankNo')" required>
                <h-input v-model="addForm.offereeBankNo" placeholder="" :maxlength=12></h-input>
              </h-form-item>
            </div>
            <div style="text-align: right">
              <h-button type="primary" @click="formSave">{{$t("m.i.shcpe.sendInviteApply")}}</h-button>
            </div>
          </h-form>
        </h-field-panel>
        <h-field-panel collapse key="2">
          <span slot="title">电子合同要约撤销206</span>
          <h-form :model="addForm2" :label-width="135" ref="addForm2" cols="2" class="h-form-search">
            <div>
              <h-form-item prop="orgnlMsgId" :label="$t('m.i.shcpe.orgnlMsgId')" required>
                <h-input v-model="addForm2.orgnlMsgId" placeholder=""></h-input>
              </h-form-item>
              <h-form-item prop="orgnlCreDtTm" :label="$t('m.i.shcpe.orgnlCreDtTm')" required>
                <h-input v-model="addForm2.orgnlCreDtTm" placeholder=""></h-input>
              </h-form-item>
              <h-form-item prop="ctrctNb" :label="$t('m.i.shcpe.ctrctNb')" required>
                <h-input v-model="addForm2.ctrctNb" placeholder=""></h-input>
              </h-form-item>
              <h-form-item prop="receiverBankNo" :label="$t('m.i.shcpe.offereeBankNo')" required>
                <h-input v-model="addForm2.receiverBankNo" placeholder=""></h-input>
              </h-form-item>
            </div>
            <div style="text-align: right">
              <h-button type="primary" @click="formSave2">{{$t("m.i.shcpe.cancelInviteApply")}}</h-button>
            </div>
          </h-form>

        </h-field-panel>
        <h-field-panel collapse key="3">
          <span slot="title">电子合同要约清分204</span>

          <h-form :model="addForm3" :label-width="135" ref="addForm3" cols="2" class="h-form-search">
            <div>
              <h-form-item prop="xcptnCd" :label="$t('m.i.shcpe.xcptnCd')" required>
                <h-select v-model="addForm3.xcptnCd" placeholder="" showTitle>
                  <h-option value="EC00">无此账号</h-option>
                  <h-option value="EC01">无此行号</h-option>
                  <h-option value="EC02">名称不符</h-option>
                </h-select>
              </h-form-item>
              <h-form-item prop="orgnlMsgId" :label="$t('m.i.shcpe.orgnlMsgId')" required>
                <h-input v-model="addForm3.orgnlMsgId" placeholder=""></h-input>
              </h-form-item>
              <h-form-item prop="orgnlCreDtTm" :label="$t('m.i.shcpe.orgnlCreDtTm')" required>
                <h-input v-model="addForm3.orgnlCreDtTm" placeholder=""></h-input>
              </h-form-item>
              <h-form-item prop="ctrctNb" :label="$t('m.i.shcpe.ctrctNb')" required>
                <h-input v-model="addForm3.ctrctNb" placeholder=""></h-input>
              </h-form-item>
              <h-form-item prop="receiverBankNo" :label="$t('m.i.shcpe.offereeBankNo')" required>
                <h-input v-model="addForm3.receiverBankNo" placeholder=""></h-input>
              </h-form-item>
            </div>
            <div style="text-align: right">
              <h-button type="primary" @click="formSave3">{{$t("m.i.shcpe.clearInviteApply")}}</h-button>
            </div>
          </h-form>

        </h-field-panel>
        <h-field-panel collapse key="4">
          <span slot="title">电子合同要约回复205</span>
          <h-form :model="addForm4" :label-width="135" ref="addForm4" cols="2" class="h-form-search">
            <div>
              <h-form-item prop="rspnsMrkr" :label="$t('m.i.shcpe.rspnsMrkr')" required>
                <h-select v-model="addForm4.rspnsMrkr" placeholder="" showTitle>
                  <h-option value="RM01">同意</h-option>
                  <h-option value="RM02">拒绝</h-option>
                </h-select>
              </h-form-item>
              <h-form-item prop="ctrctDt" :label="$t('m.i.shcpe.agreeOrRefuseDt')" required>
                <h-date-picker type="date" v-model="addForm4.ctrctDt" placeholder="承诺要约时，若要约报文有承诺截止日，则该日期<=承诺截止日" showFormat :editable=false></h-date-picker>
              </h-form-item>
              <h-form-item prop="orgnlMsgId" :label="$t('m.i.shcpe.orgnlMsgId')" required>
                <h-input v-model="addForm4.orgnlMsgId" placeholder=""></h-input>
              </h-form-item>
              <h-form-item prop="orgnlCreDtTm" :label="$t('m.i.shcpe.orgnlCreDtTm')" required>
                <h-input v-model="addForm4.orgnlCreDtTm" placeholder=""></h-input>
              </h-form-item>
              <h-form-item prop="ctrctNb" :label="$t('m.i.shcpe.ctrctNb')" required>
                <h-input v-model="addForm4.ctrctNb" placeholder=""></h-input>
              </h-form-item>
              <h-form-item prop="receiverBankNo" :label="$t('m.i.shcpe.receiverBankNo')" required>
                <h-input v-model="addForm4.receiverBankNo" placeholder=""></h-input>
              </h-form-item>
            </div>
            <div style="text-align: right">
              <h-button type="primary" @click="formSave4">{{$t("m.i.shcpe.replyInviteApply")}}</h-button>
            </div>
          </h-form>
        </h-field-panel>
        <h-field-panel collapse key="5" style="height: 300px">
          <span slot="title">电子合同解除207</span>
          <h-form :model="addForm5" :label-width="135" ref="addForm5" cols="2" class="h-form-search">
            <div>
              <h-form-item prop="ctrctDt" :label="$t('m.i.shcpe.releaseDate')" required>
                <h-date-picker type="date" v-model="addForm5.ctrctDt" placeholder="承诺要约时，若要约报文有承诺截止日，则该日期<=承诺截止日" showFormat :editable=false></h-date-picker>
              </h-form-item>
              <h-form-item prop="ctrctNb" :label="$t('m.i.shcpe.ctrctNb')" required>
                <h-input v-model="addForm5.ctrctNb" placeholder=""></h-input>
              </h-form-item>
              <h-form-item prop="rscisnMrkr" :label="$t('m.i.shcpe.rscisnMrkr')" required>
                <h-select v-model="addForm5.rscisnMrkr" placeholder="只有在发起要约时填写过可以通知解除，才能选择通知解除" showTitle>
                  <h-option value="RM01">协商解除</h-option>
                  <h-option value="RM02">通知解除</h-option>
                </h-select>
              </h-form-item>
              <h-form-item prop="rscisnRsnCd" :label="$t('m.i.shcpe.rscisnRsnCd')" :required="this.addForm5.rscisnMrkr === 'RM02'">
                <h-select v-model="addForm5.rscisnRsnCd" placeholder="" showTitle>
                  <h-option value="RR01">约定的解除合同条件已成就</h-option>
                  <h-option value="RR02">因不可抗力致使不能实现合同目的</h-option>
                  <h-option value="RR03">明确表示或行为表明不履行主要债务</h-option>
                  <h-option value="RR04">迟延履行主要债务，经催告后在合理期限内仍未履行</h-option>
                  <h-option value="RR05">迟延履行债务或其他违约行为致使不能实现合同目的</h-option>
                  <h-option value="RR06">法律规定的其他情形</h-option>
                </h-select>
              </h-form-item>
              <h-form-item prop="rscisnRsnRmrk" :label="$t('m.i.shcpe.rscisnRsnRmrk')" :required="this.addForm5.rscisnRsnCd === 'RR06'">
                <h-input v-model="addForm5.rscisnRsnRmrk" placeholder=""></h-input>
              </h-form-item>
              <h-form-item prop="receiverBankNo" :label="$t('m.i.shcpe.receiverReleaseBankNo')" required>
                <h-input v-model="addForm5.receiverBankNo" placeholder=""></h-input>
              </h-form-item>
            </div>
            <div style="text-align: right">
              <h-button type="primary" @click="formSave5">{{$t("m.i.shcpe.releaseContractApply")}}</h-button>
            </div>
          </h-form>
        </h-field-panel>
      </h-col>
    </h-row>
  </div>
</template>

<script>
  import { post } from "@/api/bizApi/commonUtil";

  export default {
    name: "ctrctBusi",
    components: {
    },
    data() {
      return {
        dictMap: {
          type: Map
        },
        addForm: {
          ctrctDt: "",
          ctrctTp: "",
          comtmtDdln: "",
          cxlMrkr: "",
          rscisnTp: "",
          xtnsn: "",
          cnts: "",
          rtntnPrd: "",
          offereeNm: "",
          offereeAcctNo: "",
          offereeBankNo: ""
        },
        addForm2: {
          ctrctNb: "",
          orgnlMsgId: "",
          orgnlCreDtTm: "",
          receiverBankNo: ""
        },
        addForm3: {
          ctrctNb: "",
          orgnlMsgId: "",
          orgnlCreDtTm: "",
          receiverBankNo: "",
          xcptnCd: ""
        },
        addForm4: {
          ctrctNb: "",
          orgnlMsgId: "",
          orgnlCreDtTm: "",
          receiverBankNo: "",
          ctrctDt: "",
          rspnsMrkr: ""
        },
        addForm5: {
          ctrctNb: "",
          receiverBankNo: "",
          ctrctDt: "",
          rscisnMrkr: "",
          rscisnRsnCd: "",
          rscisnRsnRmrk: ""
        }
      };
    },
    computed: {},
    mounted() {
    },
    beforeDestroy() {
    },
    watch: {},
    methods: {
      formSave() {
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            post(this.addForm, "/shcpe/ecds/ctrct/ctrctBusi/sendCtrct201").then(res => {
              if (res) {
                if (res.data.retCode === "000000") {
                  this.addForm2.orgnlMsgId = res.data.retData.orgnlMsgId;
                  this.addForm2.orgnlCreDtTm = res.data.retData.orgnlCreDtTm;
                  this.addForm2.receiverBankNo = res.data.retData.receiverBankNo;
                  this.$msgTip.success(this, { info: res.data.retMsg });
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      formSave2() {
        this.$refs["addForm2"].validate(valid => {
          if (valid) {
            post(this.addForm2, "/shcpe/ecds/ctrct/ctrctBusi/sendCtrct206").then(res => {
              if (res) {
                if (res.data.retCode === "000000") {
                  this.$msgTip.success(this, { info: res.data.retMsg });
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      formSave3() {
        this.$refs["addForm3"].validate(valid => {
          if (valid) {
            post(this.addForm3, "/shcpe/ecds/ctrct/ctrctBusi/sendCtrct204").then(res => {
              if (res) {
                if (res.data.retCode === "000000") {
                  this.$msgTip.success(this, { info: res.data.retMsg });
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      formSave4() {
        this.$refs["addForm4"].validate(valid => {
          if (valid) {
            post(this.addForm4, "/shcpe/ecds/ctrct/ctrctBusi/sendCtrct205").then(res => {
              if (res) {
                if (res.data.retCode === "000000") {
                  this.$msgTip.success(this, { info: res.data.retMsg });
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      formSave5() {
        this.$refs["addForm5"].validate(valid => {
          if (valid) {
            post(this.addForm5, "/shcpe/ecds/ctrct/ctrctBusi/sendCtrct207").then(res => {
              if (res) {
                if (res.data.retCode === "000000") {
                  this.$msgTip.success(this, { info: res.data.retMsg });
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      }
    }
  };
</script>

<style scoped>

</style>
