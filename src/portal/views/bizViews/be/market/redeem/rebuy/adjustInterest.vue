                        <!-- 返售申请-修改单申请-利息调整 -->
<template>
  <h-msg-box v-model="tempAdjustInterestWin" width="800" :mask-closable="false" @on-close="handleClose"
             class="h-form-search-layer" :maximize="true"  :zIndex="1005">
    <p slot="header">
      <span>{{title}}</span>
    </p>
    <div>
      <h-form :model="adjustForm" :label-width="115" ref="adjustForm" cols="2" class="h-form-search">
        <h-form-item :label="$t('m.i.billInfo.billPackageNo')" prop="billNo">
          <h-input v-model="adjustForm.billNo" readonly></h-input>
        </h-form-item>
        <h-form-item :label="$t('m.i.billInfo.billPackageMoney')" prop="billMoney">
          <h-typefield v-model="adjustForm.billMoney" readonly></h-typefield>
        </h-form-item>
        <h-form-item :label="$t('m.i.be.trialInterest')" prop="dueInterest">
          <h-typefield v-model="adjustForm.dueInterest" readonly></h-typefield>
        </h-form-item>
        <h-form-item :label="$t('m.i.be.interestAdjustmentType')" prop="interestAdjustmentType" :required="isRequired">
          <h-select v-model="adjustForm.interestAdjustmentType">
            <h-option value="AT01">调增</h-option>
            <h-option value="AT02">调减</h-option>
          </h-select>
        </h-form-item>
        <h-form-item :label="$t('m.i.be.adjustmentInterest')" prop="adjustmentInterest" :required="isRequired" :validRules="interestRule">
          <h-typefield v-model="adjustForm.adjustmentInterest" placeholder="正数,支持2位小数"></h-typefield>
        </h-form-item>
      </h-form>
    </div>
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
      <h-button type="primary" @click="submitForm">{{$t("m.i.common.commit")}}</h-button>
    </div>
  </h-msg-box>
</template>

<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";

  export default {
    name: "adjustInterest",
    data() {
      let options = {};
      options.adjustForm = {
        billNo: "",
        billMoney: "",
        dueInterest: "",
        interestAdjustmentType: "",
        adjustmentInterest: ""
      };
      options.isRequired = true;
      options.interestRule = [{
        test: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0)$)|(^[0-9]\.[0-9]([0-9])?$)/,
        trigger: "blur",
        message: "正数,支持2位小数"
      }];
      return options;
    },
    props: {
      title: {
        type: String,
        default: "利息调整"
      },
      adjustInterestWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      adjustParams: {
        type: Object,
        default: {
          adjustId: "",
          billNo: "",
          billMoney: "",
          dueInterest: "",
          adjustTypeList: []
        }
      }
    },
    watch: {
      adjustInterestWin(val) {
        if (val) {
          this.adjustForm.id = this.adjustParams.adjustId;
          this.adjustForm.billNo = this.adjustParams.billNo;
          this.adjustForm.billMoney = this.adjustParams.billMoney;
          this.adjustForm.dueInterest = this.adjustParams.dueInterest;
        }
      }
    },
    computed: {
      tempAdjustInterestWin: {
        get() {
          return this.adjustInterestWin;
        },
        set() {
        }
      }
    },
    methods: {
      handleClose() {
        this.adjustForm.interestAdjustmentType=''
        this.adjustForm.adjustmentInterest=''
        this.$emit("adjustInterestWinClose", "");
        this.$refs["adjustForm"].resetFields();
      },
      submitForm() {
        this.$refs["adjustForm"].validate(valid => {
          if (valid) {
            post(this.adjustForm, "/be/market/redeem/rebuy/rebuyMatureApplyMain/func_adjustment").then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.$emit("adjustInterestSubmit", "");
                  this.$refs["adjustForm"].resetFields();
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
