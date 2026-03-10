<template>
  <h-msg-box v-model="setPasswordTempWin"
             :title="$t('m.i.common.pwdReset')"
             :closable="closable"
             :mask-closable="false"
             @on-close="handleCancle"
             style="text-align:left" class="h-form-search"
             :transfer="true" :scrollable="false">
    <span v-if="!closable" style="font-size: 14px;color: red;margin-left: 50px;">{{msgInfo}}</span><br>
    <h-panel>
      <h-form ref="setPassForm" :model="setPassForm" :label-width="80">
        <div class="h-search-form-row">
          <h-form-item prop="oldPassword" :label="$t('m.i.common.curPwd')" required>
            <h-input type="password" v-model="setPassForm.oldPassword"
                     :placeholder="$t('m.i.common.enterCurPwd')"></h-input>
          </h-form-item>
        </div>
        <div class="h-search-form-row">
          <h-form-item prop="newPassword" :label="$t('m.i.common.newPwd')" required :rules="validNewPassCheck">
            <h-input type="password" v-model="setPassForm.newPassword" :placeholder="$t('m.i.common.enterNewPwd')"
                     @on-change="onkeypress"></h-input>
          </h-form-item>
        </div>
        <div class="h-search-form-row">
          <h-form-item prop="newPasswordCheck" :label="$t('m.i.common.newPwdConf')" required
                       :rules="validNewPassCheck">
            <h-input type="password" v-model="setPassForm.newPasswordCheck"
                     :placeholder="$t('m.i.common.enterNewPwdAgain')"
                     @keyup.enter.native="handleSetPassword"></h-input> <!--strengthTip :tipState="tipState"-->
          </h-form-item>
        </div>
      </h-form>
    </h-panel>
    <div slot="footer">
      <h-button v-if="closable" @click="handleCancle">{{$t("m.i.common.cancle")}}</h-button>
      <h-button type="primary" @click="handleSetPassword">{{$t("m.i.common.confirm")}}</h-button>
    </div>
  </h-msg-box>
</template>

<script>
import { changePwdSceneLogined } from "@/api/login";

  export default {
    name: "topbarEditPwd",

    data() {
      // 新密码框校验
      // 确认密码框校验
      const validatePassCheck = (rule, value, callback) => {
        if (value === "") {
          callback(new Error(this.$t("m.i.common.enterNewPwdAgain")));
        } else if (value !== this.setPassForm.newPassword) {
          callback(new Error(this.$t("m.i.common.pwdNoEquals")));
        } else {
          callback();
        }
      };
      return {
        setPassForm: {
          oldPassword: "",
          newPassword: "",
          newPasswordCheck: ""
        },
        validNewPassCheck: {
          validator: validatePassCheck, trigger: "blur"
        },
      }
    },
    props: {
      setPassword: {
        type: Boolean,
        default() {
          return false;
        }
      },
      closable: {
        type: Boolean,
        default() {
          return true;
        }
      },
      msgInfo: {
        type: String,
        default() {
          return this.$t("m.i.common.defaultPwdMsg");
        }
      },
    },
    computed: {
      setPasswordTempWin: {
        get() {
          return this.setPassword;
        },
        set() {
        }
      }
    },
    watch: {
      setPassword(val) {
        if (!val) {
          this.$nextTick(() => {
            this.$refs.setPassForm.resetFields();
          })
        }

      }
    },
    methods: {
      handleCancle() {
        this.$emit("handleCancle", "");
      },
      onkeypress() {
        // this.validatePwd(this.setPassForm.newPassword);
      },
      handleSetPassword() {
        this.$refs["setPassForm"].validate((valid) => {
          if (valid) {
            changePwdSceneLogined(this.setPassForm.oldPassword, this.setPassForm.newPassword).then(res => {
              if (res.data && res.data.retCode == "000000") {
                this.$hMessage.success(this.$t("m.i.common.successResetPwd"));
                this.handleCancle();
              } else {
                //this.$hMessage.success(this.$t('m.i.common.failResetPwd'));
                this.$hMessage.info(res.data.retMsg);
                //this.msgInfo = res.data.return_info
              }
            }).catch(error => {
              this.$hMessage.info(this.$t("m.i.common.netError"));
            });
          } else {
            this.$hMessage.error(this.$t("m.i.common.enterRightPwd"));
          }
        });
      },

    }
  };
</script>

<style scoped>

</style>
