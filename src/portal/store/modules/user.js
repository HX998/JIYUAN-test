import {singleSignOnLogin, login, autoLogin, logout, autoLogout } from '../../api/login'
import Cookies from 'js-cookie'
import hMsgBox from "h_ui/dist/lib/MsgBox";

const user = {
  state: {
    user:'',
    userInfo: JSON.parse(window.sessionStorage.getItem('userInfo')),
    token: Cookies.get('Admin-Token'),
    optAuths: [],
    isNeedReLogin: {}
  },
  mutations: {
    LOGIN_SUCCESS: () => {
      //console.log('登录成功')
    },
    LOGOUT_USER: state => {
      state.userInfo = ''
    },
    LOGIN_USER: (state,userInfo) => {
      state.userInfo = userInfo
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_OPT_AUTHS: (state, optAuths) => {
      state.optAuths = optAuths
    },
    IS_NEED_RELOGIN: (state, isNeedReLogin) => {
      state.isNeedReLogin = isNeedReLogin
    }
  },
  actions: {
    // 登录
    // 将token信息保存
    Login ({commit}, userInfo) {
      const username = userInfo.username.trim()
      const checkValidateCode = userInfo.checkValidateCode ? userInfo.checkValidateCode.trim() : "";
      const redisKey = userInfo.redisKey ? userInfo.redisKey.trim() : "";
      return new Promise((resolve, reject) => {
         login(username, userInfo.password, checkValidateCode, redisKey, userInfo.loginType, userInfo.checkcode, userInfo).then(response => {
          const data = response.data
          // return_code: 0  登录成功
          // return_code: -1 用户名错误
          // return_code: -2 密码错误
          if (data && data.retCode == "000000") {
            let nData = data.retData;
            let sessionId = nData.sessionId ;
            setSessionStorageAndCookies(commit, sessionId, username, nData)
          }
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 认证
    singlesignOnLogin ({commit}, userInfo) {
      console.log(userInfo);

      return new Promise((resolve, reject) => {
        singleSignOnLogin(userInfo).then(response => {

          const data = response.data
          console.log("111",data)
          // return_code: 0  登录成功
          // return_code: -1 用户名错误
          // return_code: -2 密码错误

          if (data && data.retCode == "000000") {
            const username =  data.retData.userInfo.userName
            let nData = data.retData;
            let sessionId = nData.sessionId ;
            setSessionStorageAndCookies(commit, sessionId, username, nData)
          }
          resolve(data)
        }).catch(error => {
          console.log("222")
          reject(error)
        })
      })
    },
    // cas 跳转 调用
    // 将token信息保存
    AutoLogin ({commit}, requestInfo) {
      return new Promise((resolve, reject) => {
        autoLogin(requestInfo).then(response => {
          const data = response.data;
          if (data && data.retCode == "000000") {
            let nData = data.retData;
            let sessionId = nData.sessionId ;
            setSessionStorageAndCookies(commit, sessionId, nData.userInfo.userNo, nData)
          }
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 登出
    // 将浏览器保存的token及权限清除
    Logout ({commit, state}) {
      return new Promise((resolve, reject) => {
        logout().then(response => {
          if (!response || response.data.retCode == "000000") {
            let casServerLoginUrl = window.sessionStorage.getItem("casServerLoginUrl");
            removeSessionStorageAndCookies(commit);
            if (window.LOCAL_CONFIG.isCasLogout) {
              getCasLoginUrl(casServerLoginUrl);
            } else {
              resolve()
            }
          } else {
            hMsgBox.warning({
              title: "提示",
              content: response.data.retMsg,
              onOk: () => {
                if (window.isIE) {
                  let messageData = {
                    type: 'reLogin',
                  }
                  window.parent.postMessage(messageData, '*')
                } else {
                  let casServerLoginUrl = window.sessionStorage.getItem("casServerLoginUrl");
                  removeSessionStorageAndCookies(commit);
                  if (casServerLoginUrl) {
                    getCasLoginUrl(casServerLoginUrl);
                  } else {
                    location.reload();
                  }
                }
              }
            })
          }
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 自动退出，将浏览器保存的token及权限清除
    AutoLogout ({commit, state}, userNo) {
      return new Promise((resolve, reject) => {
        autoLogout(userNo).then(response => {
          if (!response || response.data.retCode == "000000") {
            let casServerLoginUrl = window.sessionStorage.getItem("casServerLoginUrl");
            removeSessionStorageAndCookies(commit);
            if (window.LOCAL_CONFIG.isCasLogout) {
              getCasLoginUrl(casServerLoginUrl);
            } else {
              resolve()
            }
          } else {
            hMsgBox.warning({
              title: "提示",
              content: response.data.retMsg,
              onOk: () => {
                if (window.isIE) {
                  let messageData = {
                    type: 'reLogin',
                  }
                  window.parent.postMessage(messageData, '*')
                } else {
                  removeSessionStorageAndCookies(commit);
                }
              }
            })
          }
        }).catch(err => {
          reject(err)
        })
      })
    },
    ReLogin ({commit, state}) {
      let casServerLoginUrl = window.sessionStorage.getItem("casServerLoginUrl");
      removeSessionStorageAndCookies(commit);
      if (window.LOCAL_CONFIG.isCasLogout) {
        getCasLoginUrl(casServerLoginUrl);
      } else {
        location.reload();
      }
    },
    IsNeedReLogin({commit}, isNeedReLogin) {
      commit('IS_NEED_RELOGIN', isNeedReLogin)
    },
    ClearTokenAndUser({commit}) {
      commit('SET_TOKEN', "");
      commit('LOGOUT_USER', "");
    }
  }
}

function setSessionStorageAndCookies(commit, sessionId, username, nData) {
  Cookies.set('Admin-Token', sessionId);
  // Cookies.set('sidebarStatus', 1)
  window.sessionStorage.setItem('userInfo', JSON.stringify(nData.userInfo));
  window.sessionStorage.setItem('userName', username);
  window.sessionStorage.setItem("sysStatus", nData.sysStatus);
  window.sessionStorage.setItem('workDate', nData.workDate);
  window.sessionStorage.setItem('preWorkDate', nData.preWorkDate);
  commit('SET_TOKEN', sessionId);
  commit('SET_OPT_AUTHS', nData.optAuths);
  commit('LOGIN_USER', nData.userInfo);
}
function removeSessionStorageAndCookies(commit) {
  commit('SET_TOKEN', '')
  commit('LOGOUT_USER', '');
  Cookies.remove('Admin-Token')
  Cookies.remove('lock')
  Cookies.remove('menusType')
  Cookies.remove('JSESSIONID')
  window.sessionStorage.clear();
  window.localStorage.clear();
}
function getCasLoginUrl(casServerLoginUrl) {
  if (casServerLoginUrl) {
    window.location.href = casServerLoginUrl
  } else {
    window.location.href = window.LOCAL_CONFIG.API_HOME + "/casLogout"
  }
}
export default user
