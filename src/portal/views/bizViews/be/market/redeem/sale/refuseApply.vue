<!-- 回购到期-拒绝申请 -->
<template>
  <h-msg-box v-model="tempRefuseApplyWin" width="800" :mask-closable="false" @on-close="handleClose"
             class="h-form-search-layer" :maximize="true"  :zIndex="1005">
    <p slot="header">
      <span>{{title}}</span>
    </p>
    <div>
      <h-form :model="refuseForm" :label-width="115" ref="refuseForm" cols="2" class="h-form-search">
        <h-form-item :label="$t('m.i.be.sgnOpin')" prop="sgnOpin" class="h-form-height-auto" :required="isRequired"  :validRules="sgnOpinRule">
          <h-input type="textarea" :rows=3 v-model="refuseForm.sgnOpin" :canResize="false" :maxlength="300"></h-input>
        </h-form-item>
        <h-form-item label="应答备注" prop="respRemark" class="h-form-height-auto" :validRules="respRemarkRule">
          <h-input type="textarea" :rows=3 v-model="refuseForm.respRemark" :canResize="false" :maxlength="300"></h-input>
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
    name: "refuseApply",
    data() {
      return {
        refuseForm: {
          id: "",
          sgnOpin: "",
          respRemark: ""
        },
        isRequired:true,
        sgnOpinRule: [{ test: this.validateSgnOpin, trigger: "blur" }],
        respRemarkRule: [{ test: this.validateRespRemark, trigger: "blur" }],
      }
    },
    props: {
      title: {
        type: String,
        default: "拒绝签收"
      },
      refuseApplyWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      refuseParams: {
        type: Object,
        default: {
          batchId: "",
        }
      }
    },
    watch: {
      refuseApplyWin(val) {
        if (val) {
          this.$nextTick(() => {
            this.$refs.refuseForm.resetFields();
            this.refuseForm.id = this.refuseParams.batchId;
          });
        }
      }
    },
    computed: {
      tempRefuseApplyWin: {
        get() {
          return this.refuseApplyWin;
        },
        set() {
        }
      }
    },
    methods: {
      validateSgnOpin(rule, value, callback) {
        if(value){
          if(value.length>150){
            callback(new Error("应答方处理意见长度不能超过150个字符"));
          }else{
            callback();
          }
        }else{
          callback();
        }
      },
      validateRespRemark(rule, value, callback) {
        if(value){
          if(value.length>150){
            callback(new Error("应答备注长度不能超过150个字符"));
          }else{
            callback();
          }
        }else{
          callback();
        }
      },
      handleClose() {
        this.$refs.refuseForm.resetFields();
        this.$emit("refuseApplyWinWinClose", "");
      },
      submitForm() {
        this.$refs["refuseForm"].validate(valid => {
          if (valid) {
            post(this.refuseForm, "/be/market/redeem/sale/saleMatureApplyMain/func_refuseApply").then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.$emit("refuseApplySubmit", "");
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                  this.$emit("refuseApplyError", "");
                }
                this.$refs.refuseForm.resetFields();
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
                this.$emit("refuseApplyError", "");
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
