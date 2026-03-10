<template>
  <h-msg-box v-model="showPswEmpowerWin" :mask-closable="false" @on-close="handleClose"
             :maximize="true" width="460" class="h-form-table-layer">
    <p slot="header">
      <span>密码授权</span>
    </p>
    <h-form :model="formItem" :label-width="60" ref="formItem" cols="1"  class="card-box login-form" :rules="validRule">
      <div class="login-form-wrapper">
        <h-row>
          <h-col span="20">
        <!-- 用户名-->
        <h-form-item prop="userNo">
          <h-input name="userNo" type="text" v-model="formItem.userNo" size="large" autocomplete="off" :placeholder="$t('m.i.common.loginUserName')" ref='userNo'>
            <img src="../../assets/user.png" alt="" slot="prepend">
          </h-input>
        </h-form-item>
          </h-col>
        </h-row>
        <br>
        <h-row>
          <h-col span="20">
        <!-- 密码 -->
        <h-form-item  prop="userPwd">
          <h-input name="userPwd" :type="passwdType === 'ciphertext' ? 'password' : 'text'" @keyup.enter.native.prevent="handleLogin" v-model="formItem.userPwd" size="large" autocomplete="new-password" :placeholder="$t('m.i.common.password')" ref='userPwd'>
            <img src="../../assets/pwd.png" alt="" slot="prepend">
            <h-icon :name="passwdType === 'ciphertext' ? 'browse-colse' : 'browse'" slot="append" @on-click="passwdTypeChange" size="18" style="padding-left:4px;"></h-icon>
          </h-input>
        </h-form-item>
          </h-col>
        </h-row>
      </div>
    </h-form>
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
      <h-button type="primary" @click="submitForm">{{$t("m.i.common.commit")}}</h-button>
    </div>
  </h-msg-box>
</template>

<script>
    import { post, getDictListByGroups,getDictValueFromMap } from "@/api/bizApi/commonUtil";
    import {getKeys} from "@/api/login.js";
    export default {
        name: "pswEmpowerWin",
        data(){
            const validateUserName = (rule, value, callback) => {
                if(value === null || value ==='' || value === undefined){
                    callback(new Error("用户名不能为空"))
                }
                let re = /^[a-zA-Z0-9]{1,20}$/;
                if(re.test(value)){
                    callback()
                }else{
                    callback(new Error("用户号为小于等于20位的数字或字母组成"))
                }
            }
            const validatePass = (rule, value, callback) => {
                if(!value){
                    callback(new Error(this.$t('m.i.common.passwordMsg_1')))
                }
                if (value.length < 6) {
                    callback(new Error(this.$t('m.i.common.pswdLength')))
                }else if (value.length > 18) {
                    callback(new Error('密码不能大于18位'))
                } else {
                    callback()
                }
            }
            return{
                passwdType : "ciphertext",
                formItem : {
                    userNo : "",
                    userPwd : "",
                },
                // 表单校验规则
                validRule: {
                    userNo: [{validator: validateUserName,  trigger: 'blur'}],
                    userPwd: [{validator: validatePass,  trigger: 'blur'}]
                },
            }
        },
        props: {
            showPswEmpowerWin: {
                type: Boolean,
                default() {
                    return false;
                }
            },
            totalAmt : {
                type : Number,
                default : ''
            },
            brchNo : {
                type: String,
                default: ''
            }
        },
        methods: {
          //回车
          handleLogin(){
            this.submitForm();
          },
            //确认
            submitForm(){
                this.$refs.formItem.validate((valid) => {
                    if (valid) {
                        getKeys().then(res => {
                            res = res.data.retData;
                            let key1 = res.key1;
                            let key2 = res.key2;
                            let key3 = res.key3;
                            let userNo = BizSecurity.DES.encrypt(this.formItem.userNo, key1, key2, key3);
                            let userPwd = BizSecurity.DES.encrypt(this.formItem.userPwd, key1, key2, key3);
                          let data = {
                            userNo: userNo,
                            userPwd: userPwd,
                            brchNo: this.brchNo,
                            transAmt: this.totalAmt,
                            key3: key3
                          };
                            post(data, "pc/acct/acctEmpower/func_verifyAuthUser").then(res => {
                                if (res) {
                                    let retCode = res.data.retCode;
                                    if (retCode === "000000") {
                                        this.$msgTip.success(this,{ info: "授权成功！"});
                                        this.handleEmpowerSuccess();
                                    }else {
                                        this.$msgTip.error(this, { info : res.data.retMsg });
                                    }
                                } else {
                                    this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
                                }
                            });
                        });
                    }else{
                      return false
                    }
                });
            },
            //授权成功
            handleEmpowerSuccess(){
              this.$refs.formItem.resetFields();
                // this.formItem.userNo = '';
                // this.formItem.userPwd = '';
                this.passwdType = "ciphertext";
                this.$emit("empowerSuccess", "");
            },
            handleClose() {
              this.$refs.formItem.resetFields();
                // this.formItem.userNo = '';
                // this.formItem.userPwd = '';
                this.passwdType = "ciphertext";
                this.$emit("pswEmpowerWinClose", "");
            },
            //切换密文和明文
            passwdTypeChange() {
                this.passwdType =  this.passwdType === "ciphertext" ? "plaintext" : "ciphertext";
            },
        },
    }
</script>

<style scoped>

</style>
