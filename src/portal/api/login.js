// import fetch from './httpFetch.js'
import Cookies from 'js-cookie'
let key1, key2, key3
require('../utils/BizSecurity.js')
import axios from 'axios'
import config from "./config";
const fetch = axios.create(config);

fetch.interceptors.response.use(response => {
  // ie中res.data返回为string类型，chorme为obj类型
  if (response.data && typeof response.data == 'string') {
    response.data = JSON.parse(response.data)
  }
  if(response.data && response.data.data){//兼容IAR模式 20180915 add by 周智星
    response.data = response.data.data.length === 1 ? response.data.data[0] : response.data.data;
  }
  return response
});

// 登录-获取key
export function getKeys () {
  return fetch.get('/sm/auth/login/getSecurityKey')
}
export function reLogin (username, password) {
   let loginName
  let resCode = 'bizSign'
  let bizEncryptFalg = '3DES'
  let opCode = 'bizSignIn2'
  let sessionId = Cookies.get('Admin-Token')
  return new Promise((resolve, reject) => {
    getKeys().then(res => {
      res = res.data.retData
      key1 = res.key1
      key2 = res.key2
      key3 = res.key3
      loginName = BizSecurity.DES.encrypt(username, key1, key2, key3)
      password = BizSecurity.DES.encrypt(password, key1, key2, key3)
      const data = {
        loginName,
        password,
        resCode,
        bizEncryptFalg,
        opCode,
        key1,
        key2,
        key3
      }
      resolve(fetch.post('/sm/auth/login/userLogin', data))
    }).catch(err => {
      reject(err)
    })
  })
}
export function login (username, password, checkValidateCode, redisKey, loginType, checkcode, userInfo) {
  let loginName
  let resCode = 'bizSign'
  let bizEncryptFalg = '3DES'
  let opCode = 'bizSignIn2'
  let sessionId = Cookies.get('checkCode-token')
  return new Promise((resolve, reject) => {
    getKeys().then(res => {
      res = res.data.retData
      key1 = res.key1
      key2 = res.key2
      key3 = res.key3
      loginName = BizSecurity.DES.encrypt(username, key1, key2, key3)
      password = BizSecurity.DES.encrypt(password, key1, key2, key3)
      checkValidateCode = BizSecurity.DES.encrypt(checkValidateCode, key1, key2, key3)
      redisKey = BizSecurity.DES.encrypt(redisKey, key1, key2, key3)
      loginType = loginType ? BizSecurity.DES.encrypt(loginType, key1, key2, key3) : "";
        let userNo = loginName;
        const data = {
          userNo,
          password,
          checkValidateCode,
          redisKey,
          loginType,
          checkcode,
          resCode,
          bizEncryptFalg,
          opCode,
          key1,
          key2,
          key3
        };
        if (userInfo.extraParams) {
          for (let obj in userInfo.extraParams) {
            if (userInfo.extraParams.hasOwnProperty(obj)) {
              data[obj] = userInfo.extraParams[obj];
            }
          }
        }
        let loginUrl = userInfo.loginUrl ? userInfo.loginUrl : "/sm/auth/login/userLogin";
        resolve(fetch.post(loginUrl, data))
    }).catch(err => {
      reject(err)
    })

  })
}
export function singleSignOnLogin(userInfo) {
  console.log("in post");
  return fetch.post('/sm/auth/login/singleSignByUserNoOnLogin', userInfo)
}
export function getMenuList(token) {
  return fetch.post("/sm/auth/authority/queryAuthority")
}
export function changePwd(oldPassword, newPassword) {
  let sessionId = Cookies.get('Admin-Token')
  return new Promise((resolve, reject) => {
    getKeys().then(res => {
      res = res.data.retData
      let key1 = res.key1
      let key2 = res.key2
      let key3 = res.key3
      oldPassword = BizSecurity.DES.encrypt(oldPassword, key1, key2, key3)
      newPassword = BizSecurity.DES.encrypt(newPassword, key1, key2, key3)
      let userNo = window.sessionStorage.getItem("userName");
      userNo = BizSecurity.DES.encrypt(userNo, key1, key2, key3)
      const data = {
        pwd:oldPassword,
        password:newPassword,
        userNo:userNo,
        key3:key3
      }
      resolve(fetch.post('/sm/auth/login/updatePwd',data))
    })
  }).catch(err => {
    reject(err)
  })
}

export function changePwdSceneLogined(oldPassword, newPassword) {
  let sessionId = Cookies.get('Admin-Token')
  return new Promise((resolve, reject) => {
    getKeys().then(res => {
      res = res.data.retData
      let key1 = res.key1
      let key2 = res.key2
      let key3 = res.key3
      oldPassword = BizSecurity.DES.encrypt(oldPassword, key1, key2, key3)
      newPassword = BizSecurity.DES.encrypt(newPassword, key1, key2, key3)
      let userNo = window.sessionStorage.getItem("userName");
      userNo = BizSecurity.DES.encrypt(userNo, key1, key2, key3)
      const data = {
        pwd:oldPassword,
        password:newPassword,
        userNo:userNo,
        key3:key3
      }
      resolve(fetch.post('/sm/auth/login/updatePwdSceneLogined',data))
    })
  }).catch(err => {
    reject(err)
  })
}

export function logout() {
 let userNo =  window.sessionStorage.getItem('userName');
  return fetch.post("/sm/auth/login/loginOut",{userNo:userNo})
}

export function autoLogin(autoLogin) {
  return fetch.post(autoLogin.requestUrl, autoLogin.param)
}

export function autoLogout(userNo) {
  userNo = userNo ? userNo : window.sessionStorage.getItem('userName');
  return fetch.post("/sm/auth/login/loginOut",{userNo:userNo})
}

export function checkDefPwd() {
  return fetch.post("/bizframe/user/checkDefaultPwd.json")
}
