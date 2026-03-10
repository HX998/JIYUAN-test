<template>
  <h-msg-box v-model="tempQueryApplyEditWin" width="400" :mask-closable="false" @on-close="handleClose"
             class="h-form-search-layer" :maximize="true">
    <p slot="header">
      <span>支付状态查询申请</span>
    </p>
    <h-panel>
      <h-form :model="formItem" :label-width="115" ref="formItem" cols="1" class="h-form-search">
        <common-select v-model="formItem.sendBrchType" :dictList="this.dictMap.trgtCodeList"
                       :label="$t('s.i.pay.sendBrchType')" prop="sendBrchType" required></common-select>
        <common-input v-model="formItem.payFlowNo" :label="$t('s.i.pay.payFlowNo')"
                      prop="payFlowNo" required :maxlength="20" :validRules="payFlowNoValid"></common-input>
        <common-select v-model="formItem.detailFlag" :dictList="this.dictMap.dtlMkCodeList"
                       :label="$t('s.i.pay.detailFlag')" prop="detailFlag" required></common-select>
        <common-input v-model="formItem.remark" :label="$t('s.i.pay.remark')"
                      prop="remark" requried :maxlength="256" :lengthByByte="false"></common-input>
      </h-form>
    </h-panel>
    <!-- 弹出框模式底部按钮 -->
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
      <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
      <h-button type="primary" v-else @click="formAdd()">{{$t("m.i.common.commit")}}</h-button>
    </div>
  </h-msg-box>
</template>

<script>
import {post} from "@/api/bizApi/commonUtil";

export default {
  name: "queryApplyEdit",
  data() {
    return {
      formItem: {
        legalNo: "",
        sendBrchType: "TG01",
        memberId: "",
        branchCode: "",
        payFlowNo: "",
        detailFlag: "",
        remark: "",
      },
      userInfo: null,
      submitFlag: false,
      payFlowNoValid: [{test: /^[0-9]{1,20}$/, trigger: "blur", message: "支付流水号为小于等于20位的数字组成"}],
    }
    },
    props: {
      queryApplyEditWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      dictMap: {
        type: Map
      }
    },
    computed: {
      tempQueryApplyEditWin: {
        get() {
          return this.queryApplyEditWin;
        },
        set() {
        }
      }
    },
    watch: {
      queryApplyEditWin(val) {
        if (val === true) {

        }
      }
    },
    methods: {
      handleClose() {
        this.$refs.formItem.resetFields();
        this.$emit("queryApplyEditWinClose", "");
      },
      formAdd(){
        this.$refs["formItem"].validate(valid => {
          if (valid) {
            this.submitFlag = true;
            let url = "/pay/payment/payStatusQueryMain/func_sendPaymentStatusQueryApply";
            post(this.formItem, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode == "000000") {
                  this.handleClose();
                } else {
                  this.$msgTip.error(this, {info: msg});
                }
              } else {
                this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
              }
            });
          }
        });
      }
    },
  created() {
    this.userInfo = this.$store.getters.userInfo
    this.formItem.legalNo = this.userInfo.legalNo
    this.formItem.memberId = this.userInfo.memberId
    this.formItem.branchCode = this.userInfo.cepsBrchCode
  }
}
</script>

<style scoped>

</style>
