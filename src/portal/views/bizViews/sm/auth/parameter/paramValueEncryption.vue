<template>
  <!--参数值加密-->
  <h-msg-box v-model="tempParamValueEncryptionWin" width="400" class="h-form-search-layer" :maximize="true" :mask-closable="false"
             @on-close="handleClose" top="10">
    <p slot="header">
      <span >参数值加密</span>
    </p>
    <div>
      <h-form :model="formItem" :label-width="115" ref="formItem" cols="1" class="h-form-search">
        <h-form-item :label="$t('m.i.common.paramValue')" prop="paramValue" :required="isRequired">
          <h-input v-model="formItem.paramValue" :maxlength="150"></h-input>
        </h-form-item>
      </h-form>
    </div>
    <div slot="footer" >
      <h-button type="ghost" style="margin:0 8px" @click="handleClose">{{$t("m.i.common.close")}}
      </h-button>
      <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
      <h-button type="primary" v-else @click="submitForm()">{{$t("m.i.common.confirm")}}</h-button>
    </div>
  </h-msg-box>
</template>

<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";

  export default {
    name: "paramValueEncryption",
    data() {
      return {
        formItem: {
          paramValue: ""
        },
        submitFlag:false,
        isRequired:false
      };
    },
    props: {
      paramValueEncryptionWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
    },
    comments: {},
    watch: {
      paramValueEncryptionWin(val) {
        if (val === true) {
          this.isRequired=true;
        }
      }
    },

    computed: {
      tempParamValueEncryptionWin: {
        get() {
          return this.paramValueEncryptionWin;
        },
        set() {
        }
      }
    },
    methods: {
      handleClose() {
        this.formItem.paramValue="";
        this.isRequired=false;
        this.$emit("paramValueEncryptionWinClose", "");
      },
      submitForm() {
        this.$refs["formItem"].validate(valid => {
          if (valid) {
            this.submitFlag = true;
            let url = "/sm/auth/parameter/businessParameter/func_paramValueEncryption";
            post(this.formItem, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  let paramValue = res.data.retData.paramValue;
                  this.formItem.paramValue="";
                  this.isRequired=false;
                  this.$emit("paramValueEncryptionSubmit", paramValue);
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
    }
  };
</script>

<style scoped>

</style>
