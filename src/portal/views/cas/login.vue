<template>
  <div class="app-login" v-if="!loginCas">
    <div class="app-login-bg"></div>
    <div class="login-logo">
      <img :src="logoUrl"/>
    </div>
    <div class="login-header">
      <span class="login-header-title">1111-票据交易管理平台</span>
      <span class="login-header-version">v5.0</span>
    </div>
    <div class="login-wrapper">
      <div class="login-body">
        <div class="login-form" v-if="!firstLogin">
          <h-form autoComplete="off" :model="loginForm" ref="loginForm" label-position="left"
                  class="card-box login-form" :rules="validRule">
            <div class="login-form-wrapper">
              <!-- 用户名、手机号 -->
              <h-form-item prop="username">
                <h-input name="username" type="text" v-model="loginForm.username" autocomplete="off"
                         :placeholder="loginType==3 ? $t('m.i.common.mobile') : $t('m.i.common.loginUserName')"
                         ref='username' @keydown.tab.native.prevent="handleTabChange('username')">
                  <img v-if="loginType==3" src="@/assets/phone.png" slot="prepend">
                  <img v-else src="@/assets/user.png" alt="" slot="prepend">
                  <h-icon class="ipt-empty" name="delete-close-s" slot="append" @on-click="emptyName"></h-icon>
                </h-input>
              </h-form-item>
              <!-- 密码登录，密码自动填充 -->
              <h-form-item v-if="loginType == 1 && isChrome" prop="tempPassword"
                :style="{'position': tempPasswordZindex === -1 ? 'absolute' : '','z-index':tempPasswordZindex}"
                :validRules="tempPasswordZindex === -1 ? [] : passwordTempRules">
                <h-input type="text" autocomplete="off" style="position: absolute;z-index: -1;border: 0px;"
                         :disabled="tempPasswordZindex === -1"></h-input>
                <h-input name="tempPassword" :type="passwdType === 'ciphertext' ? 'password' : 'text'"
                         @keyup.enter.native.prevent="handleLogin"  @keydown.tab.native.prevent="handleTabChange('tempPassword')"
                         v-model="loginForm.tempPassword"
                         :placeholder="$t('m.i.common.password')" autocomplete="new-password"
                         :disabled="tempPasswordZindex === -1" @on-change="passwordTempChange" ref='passwTempFormord'>
                  <img src="@/assets/pwd.png" alt="" slot="prepend">
                  <h-icon class="ipt-empty" name="delete-close-s" slot="append" @on-click="emptyPasswordTemp"></h-icon>
                  <h-icon :name="passwdType === 'ciphertext' ? 'browse-colse' : 'browse'" slot="append"
                          @on-click="passwdTypeChange" size="18" style="padding-left:4px;"></h-icon>
                </h-input>
              </h-form-item>
              <!-- 密码登录 -->
              <h-form-item v-if="loginType == 1" prop="password"
                           :style="{'position': (passwordZindex === -1 && isChrome) ? 'absolute' : '','z-index':isChrome ? passwordZindex : ''}">
                <h-input name="password" :type="passwdType === 'ciphertext' ? 'password' : 'text'"
                         @keyup.enter.native.prevent="handleLogin" v-model="loginForm.password"
                         :autocomplete="!isChrome ? 'off' : 'new-password'" :placeholder="$t('m.i.common.password')" ref='passwloginFormord'
                         :readonly="readonlyInput" @on-focus="cancelReadOnly('focus')" @on-blur="cancelReadOnly('blur')">
                  <img src="@/assets/pwd.png" alt="" slot="prepend">
                  <h-icon class="ipt-empty" name="delete-close-s" slot="append" @on-click="emptyPasswd"></h-icon>
                  <h-icon :name="passwdType === 'ciphertext' ? 'browse-colse' : 'browse'" slot="append"
                          @on-click="passwdTypeChange" size="18" style="padding-left:4px;"></h-icon>
                </h-input>
              </h-form-item>
              <!-- 验证码 -->
              <div v-if="loginHasValidateCode && loginType == 1">
                <h-row>
                  <h-col span="16" style="padding-right: 8px;">
                    <h-form-item prop="checkValidateCode">
                      <h-input name="checkValidateCode" type="text" @keyup.enter.native.prevent="handleLogin"
                               v-model="loginForm.checkValidateCode" autocomplete="off"
                               :placeholder="$t('m.i.common.checkcode')" ref='checkValidateCode'>
                        <h-icon name="key" slot="prepend" size="24"></h-icon>
                      </h-input>
                    </h-form-item>
                  </h-col>
                  <h-col span="8">
                    <s-identify :identifyCode="validateCode" ref='validateCode' @refreshCode="refreshCode"
                                class="validate-code"></s-identify>
                  </h-col>
                </h-row>
              </div>
              <!-- <h-form-item v-if="loginType == 2" prop="fingerprint">
                 <h-input name="fingerprint" type="text" @click.native.prevent="fingerprintF" v-model="loginForm.fingerprint" autocomplete="off" :placeholder="$t('m.i.common.fingerprint')" ref='fingerprint'>
                   <img src="@/assets/ft.png" slot="prepend">
                   <span v-show="hasFingerprintResult" slot="append">
                     <h-icon v-if="fingerprintResult == 1" name="right"></h-icon>
                     <h-icon v-else name="wrong"></h-icon>
                   </span>
                 </h-input>
               </h-form-item>
               手机号登录验证码 -->
              <h-form-item v-if="loginType == 3" prop="authCode">
                <h-input name="authCode" type="text" :class="[loginType == 3 ? 'login-pwd-type' : '']"
                         @keyup.enter.native="handleLogin" v-model="loginForm.authCode" autocomplete="off"
                         :placeholder="$t('m.i.common.checkcode')" ref='authCode'>
                  <div slot="append">
                    <h-icon class="ipt-empty" name="delete-close-s" @on-click="emptyCode"></h-icon>
                    <span class="send-pwd">{{$t("m.i.common.sendcheckcode")}}</span>
                  </div>
                </h-input>
              </h-form-item>
            </div>

            <div class="form-item-submit">
              <h-form-item style="margin-bottom: 0">
                <h-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="handleLogin">
                  {{$t("m.i.common.login")}}
                </h-button>
              </h-form-item>
            </div>
            <div class="verify-tip verify-bottom" v-show='respError'>
              <div class="verify-tip-arrow"></div>
              <div class="verify-tip-inner">{{respErrorInfo}}</div>
            </div>
          </h-form>
          <div class="login-type">
            <div class="login-type-head text-center">
              <span>————</span>
              <span>选择登录方式</span>
              <span>————</span>
            </div>
            <div class="login-type-content">
              <h-row>
                <h-col :xs="{ span: 4, offset: 4 }" :lg="{ span: 6, offset: 2 }">
                  <div class="login-type-content-pwd" :class="[loginType == 1 ? 'login-type-content-actived' : '']"
                       @click="chooseLoginType('1')">
                  </div>
                </h-col>
                <h-col :xs="{ span: 4, offset: 4 }" :lg="{ span: 6, offset: 2 }">
                  <div class="login-type-content-ft" :class="[loginType == 2 ? 'login-type-content-actived' : '']"
                       a="chooseLoginType('2')">
                  </div>
                </h-col>
                <h-col :xs="{ span: 4, offset: 4 }" :lg="{ span: 6, offset: 2 }">
                  <div class="login-type-content-ph" :class="[loginType == 3 ? 'login-type-content-actived' : '']"
                       a="chooseLoginType('3')">
                  </div>
                </h-col>
              </h-row>
            </div>
            <div class="login-type-content" style="margin-top:10%">
              <p :title='curpkg' @dblclick="copy">{{version}}</p>
              <input :value="curpkg" type="hidden"></input>
            </div>
            <div style="margin-top:5%;text-align: center">
              <span>请在IE10及以上或谷歌、火狐等浏览器使用</span>
            </div>
          </div>
        </div>

        <div class="login-form" v-else>
          <h-form autoComplete="off" :model="pwdForm" ref="pwdForm" label-position="left" class="card-box login-form"
                  :rules="validPwdRule">
            <!--<div class="login-form-wrapper">-->
              <div class='verify-tip1'>
                <div class="verify-tip-arrow"></div>
                <div class="verify-tip-top" style="color:#ff9600;">{{newUserTip}}</div>
              </div>
              <h-form-item prop="oldPassword" class="">
                <h-input name="oldPassword" type="password" @keyup.enter.native="updatePwd"
                         v-model="pwdForm.oldPassword" autocomplete="off"
                         placeholder="原密码" ref='oldPassword'>
                  <img src="@/assets/pwd.png" alt="" slot="prepend">
                </h-input>
              </h-form-item>
              <h-form-item prop="newPassword" class="">
                <h-input name="newPassword" type="password" @keyup.enter.native="updatePwd"
                         v-model="pwdForm.newPassword" autocomplete="off"
                         placeholder="新密码" ref='newPassword'>
                  <img src="@/assets/pwd.png" alt="" slot="prepend">
                </h-input>
              </h-form-item>
              <h-form-item prop="secondPassword" class="">
                <h-input name="secondPassword" type="password" @keyup.enter.native="updatePwd"
                         v-model="pwdForm.secondPassword" autocomplete="off"
                         placeholder="确认密码" ref='secondPassword'>
                  <img src="@/assets/pwd.png" alt="" slot="prepend">
                </h-input>
                <div class="verify-tip verify-bottom" v-show='inputError'>
                  <div class="verify-tip-arrow"></div>
                  <div class="verify-tip-inner">{{inputErrorInfo}}</div>
                </div>
              </h-form-item>
            <!--</div>-->
            <div class="form-item-submit" style='padding:0 5%;'>
              <h-form-item style="margin-bottom: 0">
                <h-button type="primary" style="width:45%;margin-right:5%" :loading="loading"
                          @click.native.prevent="updatePwd">
                  修改
                </h-button>
                <h-button type="primary" style="width:45%;" :loading="loading" @click.native.prevent="back">
                  返回
                </h-button>
              </h-form-item>
            </div>
            <div class="verify-tip verify-bottom" v-show='respError'>
              <div class="verify-tip-arrow"></div>
              <div class="verify-tip-inner">{{respErrorInfo}}</div>
            </div>
          </h-form>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
  import fetch from "@/api/httpFetch.js";
  import { getKeys } from "@/api/login.js";
  import { post, handleGotoPage, getBusinessParameter } from "@/api/bizApi/commonUtil.js";

  export default {
    name: "login",
    components: {
      SIdentify: () => import(/* webpackChunkName: "components/SIdentify" */`@/components/SIdentify`)
    },
    data() {
      const validatePass = (rule, value, callback) => {
        if (!value) {
          callback(new Error(this.$t("m.i.common.passwordMsg_1")));
        }
        if (value.length < 6) {
          callback(new Error(this.$t("m.i.common.pswdLength")));
        } else if (value.length > 18) {
          callback(new Error("密码不能大于18位"));
        } else {
          callback();
        }
      };
      const validateNewPass = (rule, value, callback) => {
        if (!value) {
          callback(new Error(this.$t("m.i.common.passwordMsg_1")));
        }
        if (value === this.pwdForm.oldPassword) {
          callback(new Error("新旧密码不能相同"));
        }
        if (value.length < 6 || value.length > 18) {
          callback(new Error("密码长度为6-18位"));
        }
        let reg = this.checkRule;
        if (reg.test(value)) {
          callback();
        } else {
          callback(new Error(this.checkRuleNotice));
        }
      };
      const validateSecondPass = (rule, value, callback) => {
        if (!value) {
          callback(new Error("密码不能为空"));
        }
        if (this.pwdForm.newPassword != value) {
          callback(new Error("您两次输入的密码不一致"));
        } else {
          callback();
        }
      };

      const validateUserName = (rule, value, callback) => {
        if (value === null || value === "") {
          callback(new Error("用户名不能为空"));
        }
        let re = /^[a-zA-Z0-9]{1,20}$/;
        if (re.test(value)) {
          callback();
        } else {
          callback(new Error("用户号为小于等于20位的数字或字母组成"));
        }
      };
      const validateCode = (rule, value, callback) => {
        if (this.loginType === 1 && !value) {
          this.refreshCode();
          callback(new Error(this.$t("m.i.common.checkCodeMsg_1")));
        }
        if (this.validateCode.toLowerCase() != value.toLowerCase()) {
          this.refreshCode();
          callback(new Error(this.$t("m.i.common.checkCodeMsg_2")));
        } else {
          callback();
        }
      };
      return {
        //业务参数：每页显示条数,默认为10
        pageSize : "10",
        logoUrl: "",
        //单点登录
        loginCas: false,
        remePswd: "",
        loginHasValidateCode: false, //是否输入验证码
        validateCode: "", //随机验证码
        loginForm: {
          username: "",
          password: "",
          authCode: "",
          checkValidateCode: "",
          tempPassword: ""
        },
        pwdForm: {
          oldPassword: "",
          newPassword: "",
          secondPassword: ""
        },
        // 表单校验规则
        validRule: {
          username: [{ validator: validateUserName, trigger: "blur" }],
          password: [{ validator: validatePass, trigger: "blur" }],
          checkValidateCode: [{ validator: validateCode, trigger: "blur" }]
        },
        validPwdRule: {
          oldPassword: [{ validator: validatePass, trigger: "blur" }],
          newPassword: [{ validator: validateNewPass, trigger: "blur" }],
          secondPassword: [{ validator: validateSecondPass, trigger: "blur" }]
        },
        loading: false,
        showDialog: false,
        respError: false,
        respErrorInfo: "",
        inputError: false,
        inputErrorInfo: "",
        loginType: 1,
        firstLogin: false,
        newUserTip: "",
        userNo: "",
        reqUrl: "/sm/auth/login",
        version: "",
        curpkg: "",
        checkRule: /^(?![^A-Za-z]+$)(?![^0-9]+$)(?![^\\|\\&\\$\\%\\@\\*\\#\\_\\-\\!\\=]+$).{6,18}$/,
        checkRuleNotice: "密码为6-18位，必须包含数字、字母和特殊符号",
        passwdType: "ciphertext",
        //控制密码自动不填充
        isChrome: navigator.userAgent.indexOf("Chrome") >= 0,
        isFF: navigator.userAgent.indexOf("Firefox") >= 0,
        passwordTempRules: [{ test: validatePass, trigger: "blur" }],
        tempPasswordZindex: 1001,
        passwordZindex: -1,
        tempPassword: "",
        readonlyInput: false
      };
    },
    watch: {
      loginForm: {
        handler: function() {
          this.respError = false;
          this.inputError = false;
          this.loading = false;
        },
        deep: true
      },
      pwdForm: {
        handler: function() {
          this.respError = false;
          this.inputError = false;
        },
        deep: true
      }
    },
    methods: {
      handleTabChange(optType) {
        if (optType === 'username') {
          if (this.isChrome && this.tempPasswordZindex !== -1) {
            this.$refs.passwTempFormord.focus();
          } else {
            this.$refs.passwloginFormord.focus();
          }
        } else if (optType === 'tempPassword') {
          if (this.tempPasswordZindex !== -1) {
            this.$refs.passwTempFormord.blur();
          }
        }
      },
      passwordTempChange(event) {
        if (event.currentTarget.form[1].value !== "") {//通过浏览器进行自动填充
          this.tempPasswordZindex = -1;
          this.passwordZindex = 1001;
          this.loginForm.password = "";
          this.loginForm.tempPassword = "";
          this.$refs.passwloginFormord.focus();
        } else {
          this.loginForm.password = event.currentTarget.value;
          this.loginForm.tempPassword = event.currentTarget.value;
        }
      },
      emptyPasswordTemp() {
        this.loginForm.tempPassword = "";
        this.loginForm.password = "";
        this.$refs.passwTempFormord.focus();
      },
      cancelReadOnly(optType) {
        if (this.isFF) {
          if (optType === 'focus') {
            this.readonlyInput = false;
            this.$refs.passwloginFormord.$el.getElementsByTagName('input')[0].style.backgroundColor = '';
            this.$refs.passwloginFormord.$el.getElementsByTagName('input')[0].style.color = '#333333';
          } else {
            this.$refs.passwloginFormord.$el.getElementsByTagName('input')[0].style.backgroundColor = 'transparent';
            this.$refs.passwloginFormord.$el.getElementsByTagName('input')[0].style.color = '#333333';
            this.readonlyInput = true;
          }
        }
      },
      // 清空验证码
      emptyCode() {
        this.loginForm.authCode = "";
        this.$refs.authCode.focus();
      },
      // 清空用户名
      emptyName() {
        this.loginForm.username = "";
        this.$refs.username.focus();
      },
      // 清空密码
      emptyPasswd() {
        this.loginForm.password = "";
        this.$refs.passwloginFormord.focus();
      },
      //切换密文和明文
      passwdTypeChange() {
        this.passwdType = this.passwdType === "ciphertext" ? "plaintext" : "ciphertext";
      },
      // 修改密码校验
      validPwdForm() {
        let oldPassword = this.pwdForm.oldPassword;
        let newPassword = this.pwdForm.newPassword;
        let secondPassword = this.pwdForm.secondPassword;
        if (oldPassword == "" || newPassword == "" || secondPassword == "") {
          this.inputError = true;
          this.inputErrorInfo = "密码不能为空";
          return false;
        }
        let re = this.checkRule;
        if (oldPassword.length < 6 || !re.test(newPassword) || !re.test(secondPassword)) {
          this.inputError = true;
          this.inputErrorInfo = this.checkRuleNotice;
          return false;
        }
        if (newPassword != secondPassword) {
          this.inputError = true;
          this.inputErrorInfo = "您两次输入的密码不一致";
          return false;
        }
        if (oldPassword == newPassword) {
          this.inputError = true;
          this.inputErrorInfo = "新旧密码不能相同";
          return false;
        }
        return true;
      },
      // 修改密码
      updatePwd() {
        // if(!this.validPwdForm()){
        //   return ;
        // }
        this.$refs.pwdForm.validate((valid) => {
          if (valid) {
            let oldPassword = this.pwdForm.oldPassword;
            let newPassword = this.pwdForm.newPassword;
            return new Promise((resolve, reject) => {
              getKeys().then(res => {
                res = res.data.retData;
                let key1 = res.key1;
                let key2 = res.key2;
                let key3 = res.key3;
                oldPassword = BizSecurity.DES.encrypt(oldPassword, key1, key2, key3);
                newPassword = BizSecurity.DES.encrypt(newPassword, key1, key2, key3);
                let userNo = BizSecurity.DES.encrypt(this.userNo, key1, key2, key3);
                const data = {
                  pwd: oldPassword,
                  password: newPassword,
                  userNo: userNo,
                  key3: key3
                };
                this.$refs.pwdForm.resetFields();
                fetch.post("/sm/auth/login/updatePwd", data).then(res => {
                  if (res) {
                    let result = res.data;
                    if (result.retCode === "000000") {
                      this.firstLogin = false;
                      this.inputError = false;
                      this.inputErrorInfo = "";
                    } else {
                      this.respError = true;
                      this.respErrorInfo = result.retMsg;
                    }
                  }
                  resolve();
                });

              });
            });
          }
        });
      },
      // 返回登录页面
      back() {
        this.$refs.pwdForm.resetFields();
        this.firstLogin = false;
        this.inputError = false;
        this.respError = false;
        this.inputErrorInfo = "";
      },
      showMainindex() {
        return post({ paramKey: "is_show_home_page" }, "/sm/auth/systemParameter/findSystemParameter").then(res => {
          let isShowMainindex = "1";
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              if (res.data.retMsg === "0") {
                isShowMainindex = "0";
              }
            }
          }
          window.sessionStorage.setItem("isShowMainindex", isShowMainindex);
        });
      },
      handleLogin() {
        // if(!this.validator()){
        //   return;
        // }
        this.$refs.loginForm.validate((valid) => {
          if (valid) {
            this.loading = true;
            // window.sessionStorage.setItem("currUserId", this.loginForm.username);
            this.$store.dispatch("Login", this.loginForm).then((res) => {
              // return_code: 0  登录成功
              this.loading = false;
              this.loadBankInfo();
              // 新用户第一次登录
              if (res.retCode == "0BE229904016") {
                this.firstLogin = true;
                this.userNo = this.loginForm.username;
                this.newUserTip = this.loginForm.username + " :您是新用户,请修改初始密码!";
                // this.$refs.loginForm.resetFields();
              } else if (res.retCode == "0BE229904018") {
                this.firstLogin = true;
                this.userNo = this.loginForm.username;
                this.newUserTip = this.loginForm.username + " :您密码已过期，请修改密码!";
                // this.$refs.loginForm.resetFields();
              } else if (res.retCode == "000000") {
                this.showMainindex().then(() => {
                  if (res.retCode == "000000") {
                    if (window.isIE) {
                      /* 跳转至ie特有页面indexcommon */
                      this.$router.push({ path: "/indexcommon" });
                    } else {
                      this.$router.push({ path: "/mainIndex" });
                    }
                  } else {
                    this.respErrorInfo = res.retMsg;
                    this.$refs.username.focus();
                    this.respError = true;
                  }
                });
                getBusinessParameter({paramKey:"pc.default_page_size"}, this.getPageSizeSuccessCallBack, this.getPageSizeFailCallBack);
              } else {
                this.respErrorInfo = res.retMsg;
                this.$refs.username.focus();
                this.respError = true;
              }
            }).catch(err => {
              // 请求出错
              this.$hMessage.error(this.$t("m.i.common.loginErr"));
              this.loading = false;
              if (this.loginHasValidateCode && this.loginType === 1) {
                this.createCode();
              }
            });
          } else {
            return false;
          }
        });
      },
      refreshCode() {
        this.createCode();
      },
      nameBlur() {
        if (this.loginForm.username == "") {
          this.respErrorInfo = this.$t("m.i.common.userNameMsg_1");
          this.respError = true;
        } else {
          fetch.get("/getSecurityKey.json").then(response => {
            if (response) {
              var key1 = response.data.key1;
              var key2 = response.data.key2;
              var key3 = response.data.key3;
              var loginName = BizSecurity.DES.encrypt(this.loginForm.username, key1, key2, key3);
              fetch.post("/checkUserNameOrPwd.json", { flag: 1, loginName: loginName }).then(res => {
                if (res) {
                  var data = res.data;
                  if (data.return_code != "0") {
                    this.respErrorInfo = data.return_info;
                    this.respError = true;
                  }
                }
              });
            }
          });
        }
      },
      copy() {
        var oInput = document.createElement("input");
        oInput.value = this.curpkg;
        document.body.appendChild(oInput);
        oInput.select();//选择对象
        document.execCommand("copy");//执行浏览器复制命令
        document.body.removeChild(oInput);
        this.$msgTip.success(this, { info: "版本信息复制成功" });

      },
      pwdBlur() {
        if (this.loginForm.password == "") {
          this.inputErrorInfo = this.$t("m.i.common.passwordMsg_1");
          this.inputError = true;
        } else {
          if (this.loginForm.username == "") return;
          fetch.get("/getSecurityKey.json").then(response => {
            if (response) {
              var key1 = response.data.key1;
              var key2 = response.data.key2;
              var key3 = response.data.key3;
              var loginName = BizSecurity.DES.encrypt(this.loginForm.username, key1, key2, key3);
              var password = BizSecurity.DES.encrypt(this.loginForm.password, key1, key2, key3);
              fetch.post("/checkUserNameOrPwd.json", {
                flag: 2,
                loginName: loginName,
                password: password
              }).then(res => {
                if (res) {
                  var data = res.data;
                  if (data.return_code != "0") {
                    this.inputErrorInfo = data.return_info;
                    this.inputError = true;
                  }
                }
              });
            }
          });
        }
      },
      /*生成验证码*/
      createCode() {
        let code = "";
        //验证码的长度
        let codeLength = 4;
        //随机数
        let random = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
        for (let i = 0; i < codeLength; i++) {
          //循环操作
          let index = Math.floor(Math.random() * 36);//取得随机数的索引（0~35）
          code += random[index];//根据索引取得随机数加到code上
        }
        this.validateCode = code;//把code值赋给验证码
      },
      //选择登录方式
      chooseLoginType(type) {
        this.loginType = type;
      },
      handleAutoLogin(requestInfo) {
        this.$store.dispatch("AutoLogin", requestInfo).then((res) => {
          this.$loadingbox.close();
          if (res.retCode !== "000000" || res.retCode === "0BE229904064" || res.retCode === "0BE229904067") {
            this.$hMessage.error(res.retMsg ? res.retMsg : this.$t("m.i.common.loginErr"));
            return
          }
          this.loadBankInfo().then(() => {
            this.showMainindex().then(() => {
              if (res.retCode == "000000") {
                //判断是否对接bbsp
                if (Object.keys(this.$route.query).length > 0 && !!this.$route.query.token && !!this.$route.query.url) {
                  window.LOCAL_CONFIG.isFrame = true;
                  handleGotoPage(this, "sidebar", { path: requestInfo.param.url, isFrame: true });
                } else {
                  window.LOCAL_CONFIG.isFrame = false;
                  if (window.isIE) {
                    /* 跳转至ie特有页面indexcommon */
                    this.$router.push({ path: "/indexcommon" });
                  } else {
                    this.$router.push({ path: "/mainIndex" });
                  }
                }
              } else {
                this.respErrorInfo = res.retMsg;
                this.respError = true;
              }
            });
          });
        }).catch(err => {
          // 请求出错
          this.$hMessage.error(this.$t("m.i.common.loginErr"));
          this.$loadingbox.close();
        });
      },
      loadBankInfo() {
        let bankName = window.sessionStorage.getItem("bankName");
        let isLoadBankInfo = null;
        if (typeof(bankName) === "string" && bankName !== "" && bankName !== "default") {
          import(/* webpackChunkName: "components/[request]"  */`@/components/bank/${bankName}/index`).catch(err => {});
          import(/* webpackChunkName: "banks/auditFlow/[request]"  */`@/api/bank/auditFlow/${bankName}AuditFlow`).then(module => {
            this._setAuditFlowMap(module.default);
          }).catch(err => {});
          import(/* webpackChunkName: "banks/printUrl/[request]"  */`@/api/bank/printUrl/${bankName}PrintUrl`).then(module => {
            this._setPrintUrlMap(module.default);
          }).catch(err => {});
          isLoadBankInfo = import(/* webpackChunkName: "banks/[request]"  */`@/api/bank/${bankName}Index`).then(module => {
            this._setRouterMap(module.default);
          }).catch(err => {});
          import(/* webpackChunkName: "banks/mainIndex/[request]"  */`@/api/bank/mainIndex/${bankName}MainIndex`).then(module => {
            this._setMainIndexMap(module.default);
          }).catch(err => {});
        }
        return isLoadBankInfo == null ? new Promise(resolve => {
          resolve();
        }) : isLoadBankInfo;
      },
      getPageSizeSuccessCallBack(res) {
        if (res.data.retData != null || res.data.retData.length > 0) {
          this.pageSize = res.data.retData;
          window.sessionStorage.setItem("pageSize", this.pageSize);
        }
      },
      getPageSizeFailCallBack(res) {
        window.sessionStorage.setItem("pageSize", this.pageSize);
        this.$msgTip.error(this, { info: res.data.retMsg });
      },
      createdFunc() {
        console.info("单点登录")
        if (Object.keys(this.$route.query).length > 0 && !!this.$route.query.userNo && !!this.$route.query.password) {
          //单点登录，外围送用户名和密码的情况
          window.sessionStorage.setItem("isNeedAutoLoad", "0");
          this.loginCas = true;
          this.$loadingbox.open({
            title: "界面加载中，请稍后..."
          });
          let params = {};
          params = {  userNo: this.$route.query.userNo, password: this.$route.query.password };
          this.handleAutoLogin({ param: params, requestUrl: "/sm/auth/login/singleSignOnLogin" });
        } else if (Object.keys(this.$route.query).length > 0 && this.$route.query.loginType === "cas") {
          //单点登录，外围访问后台进行重定向
          window.sessionStorage.setItem("isNeedAutoLoad", "0");
          if (this.$route.query.casServerLoginUrl) {
            window.sessionStorage.setItem("casServerLoginUrl", this.$route.query.casServerLoginUrl);
          }
          this.loginCas = true;
          window.LOCAL_CONFIG.isCasLogout = true;
          this.$loadingbox.open({
            title: "界面加载中，请稍后..."
          });
          this.handleAutoLogin({ param: {}, requestUrl: "/casclient/loginInfo" });
        } else if(Object.keys(this.$route.query).length > 0 && this.$route.query.loginNo) {
          window.sessionStorage.setItem("isNeedAutoLoad", "0");
          this.loginCas = true;
          window.LOCAL_CONFIG.isCasLogout = true;
          this.handleAutoLogin({param: {loginNo: this.$route.query.loginNo}, requestUrl: "/sm/auth/login/authorize"});
        }
      }
    },
    created() {
      window.sessionStorage.setItem("isNeedAutoLoad", "0");
      window.sessionStorage.setItem("isRegistMsgBox", "1");
      document.getElementsByTagName("html")[0].className = window.LOCAL_CONFIG.THEME;
      document.body.className = "login";
      post({loading: false}, "/sm/auth/login/queryVersion").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            let obj = res.data.retData;
            this.version = obj.version;
            this.curpkg = obj.curpkg;
            this.checkRule = eval("/" + obj.checkRule + "/");
            this.checkRuleNotice = obj.checkRuleNotice;
            let bankName = obj.bankName;
            document.getElementsByTagName("html")[0].className = document.getElementsByTagName("html")[0].className.concat(" " + bankName);
            this.loginHasValidateCode = obj.loginHasValidateCode === "1";
            if (this.loginHasValidateCode && this.loginType === 1) {
              this.createCode();
            }
            window.sessionStorage.setItem("bankName", bankName);
            if (typeof (bankName) === "string" && bankName !== "" && bankName !== "default") {
              import(`@/views/bizViews/banks/${bankName}/style/style.scss`).catch(err => {});
              try {
                this.logoUrl = require(`@/assets/${bankName}/logo-login.png`);
              } catch (e) {
                this.logoUrl = require(`@/assets/logo-login.png`);
              }
            } else {
              this.logoUrl = require(`@/assets/logo-login.png`);
            }
            let isCustomLogin = obj.isCustomLogin;
            if(isCustomLogin == '1' && typeof (bankName) === "string" && bankName !== "" && bankName !== "default") {//跳转到个性化登录界面
              import(/* webpackChunkName: "banks/[request]/login"  */`@/views/bizViews/banks/${bankName}/login.vue`).then(module => {
                let loginRoute = [{
                  path: `/${bankName}/login`,
                  component: this._getLoginComponentByUrl(`/${bankName}/login`),
                }];
                this.$store.dispatch("setRouters", loginRoute).then(() => {
                  this.$router.addRoutes(loginRoute);
                  this.$router.push({ path: `/${bankName}/login` });
                });
              }).catch(err => {
              });
            }
          }
        }
      }).catch(err => {
        this.logoUrl = require(`@/assets/logo-login.png`);
      });

      //判断同一浏览器下是否已登录用户，在已登录用户的浏览器上，再次打开登录页面时，应自动跳过登录页进入首页面
      post({}, "/sm/auth/login/userLoginByToken").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            if(res.data.retData.autoLogin === "1") {
              this.loginCas = true;
              this.$loadingbox.open({
                title: "界面加载中，请稍后..."
              });
              if (Object.keys(this.$route.query).length > 0) {
                this.createdFunc();
              } else {
                this.handleAutoLogin({ param: { code: res.data.retData.autoLogin }, requestUrl: "/sm/auth/login/userLoginByToken" });
              }
            } else {
              this.createdFunc();
            }
          }
        }
      }).catch(err => {
        this.$hMessage.error(err);
        this.createdFunc();
      });
    },
    mounted() {
      if (this.isFF) {
        this.readonlyInput = true;
        this.$refs.passwloginFormord.$el.getElementsByTagName('input')[0].style.backgroundColor = 'transparent';
        this.$refs.passwloginFormord.$el.getElementsByTagName('input')[0].style.color = '#333333';
      }
    },
    destroyed() {
      document.body.className = "";
    }
  };
</script>
<style type="text/css" scoped>
  .validate-code {
    cursor: pointer;
  }
</style>
