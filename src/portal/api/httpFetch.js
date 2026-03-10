import axios from 'axios'
import config from './config'
import store from '../store'
// import router from '../router'
// import hui from 'h_ui/dist/h_ui.min.js'
import hMsgBox from "h_ui/dist/lib/MsgBox.js";
import hMessage from "h_ui/dist/lib/Message.js";
// import qs from 'qs'
import {covertObj} from "@/api/bizApi/commonUtil";
import Cookies from "js-cookie";

const httpFetch = axios.create(config);

// request拦截器
httpFetch.interceptors.request.use(config => {
  if(config.data && config.data.loading){
    showFullScreenLoading()
  }
  let isUnderscore= window.LOCAL_CONFIG.isUnderscore+"";
  if(isUnderscore==="true"&&config.data){//兼容微服务方式
    let newData = {};
    covertObj(config.data,newData,false);
    config.data = newData
  }
  let isIE = navigator.userAgent.indexOf("MSIE") >= 0 || navigator.userAgent.indexOf("Trident") >= 0  ? true : false;
  if (isIE && config.method === 'get') {
    config.params = {
      t: Date.parse(new Date().toString()) / 1000,
      ...config.params
    }
  }
  return config
}, error => {
  tryHideFullScreenLoading();
  Promise.reject(error)
});
httpFetch.interceptors.response.use(response => {
   tryHideFullScreenLoading();
  // ie中res.data返回为string类型，chorme为obj类型
  if (response.data && typeof response.data == 'string') {
    response.data = JSON.parse(response.data)
  }
  if(response.data && response.data.data){//兼容IAR模式 20180915 add by 周智星
    response.data = response.data.data.length === 1 ? response.data.data[0] : response.data.data;
  }
  if (response.data && (response.data.retCode === 9008 || response.data.retCode === 9007 || response.data.retCode === 9006|| response.data.retCode === 9005 || response.data.retCode === 9004) || !response) {
    let text = '';
    if (document.getElementsByTagName('html')[0].className === '') {
      document.getElementsByTagName('html')[0].className = 'theme-default'
    }
    let flag =true;
    let return_code = response.data.retCode;
    if (return_code === 9008) {
      text = '对不起,您缺少访问权限';
      hMsgBox.confirm({
        title: "权限验证",
        content: text
      })
    } else if (return_code === 9006) {
      text = '页面已经失效,请重新登录';
      flag = false
    } else if (return_code === 9007) {
      text = '会话已失效,请重新登录';
      flag = false
    }else if (return_code === 9004) {
      text = '您已被踢出,请重新登录';
      flag = false
    }else if (return_code === 9005) {
      text = '您已在别地方登录,请重新登录';
      flag = false
    }  else {
      text = '当前服务端登录验证出错,请重新登录';
      flag = false
    }
    if(!flag){
      store.dispatch('IsNeedReLogin', {isRelogin: true, msgBoxInstance: hMsgBox});
      hMsgBox.warning({
        title: "确认登录",
        content: text,
        onOk: () => {
            if (window.isIE) {
              let messageData = {
                type: 'reLogin',
              }
              window.parent.postMessage(messageData, '*')
            } else {
              // store.dispatch('Logout').then(() => {
                // router.push({ path: '/login' })
              let casServerLoginUrl = window.sessionStorage.getItem("casServerLoginUrl");
              clearSession();
              if (window.LOCAL_CONFIG.isCasLogout) {
                if (casServerLoginUrl) {
                  window.location.href = casServerLoginUrl
                } else {
                  window.location.href = window.LOCAL_CONFIG.API_HOME + "/casLogout"
                }
              } else {
                location.reload();
              }
              // })
            }
        }
      })
    }
    // if (response.data && response.data.retCode === -5) {
    //   //锁屏状态，不能请求
    //   hMessage.info('请解锁！');
    //   store.dispatch('lockscreen');
    // }
  } else if (response.data && response.data.retCode === -5) {
    //锁屏状态，不能请求
    hMessage.info('请解锁！');
    store.dispatch('lockscreen');
  } else {
    return response
  }
}, error => {
  tryHideFullScreenLoading();
  if (error && error.response) {
    switch (error.response.status) {
      case 400:
        error.message = "请求错误(400)";
        break;
      case 401:
        error.message = "未授权，请重新登录(401)";
        break;
      case 403:
        error.message = "拒绝访问(403)";
        break;
      case 404:
        error.message = "请求出错(404)";
        if (!!error.response.data) {
          let response = typeof error.response.data === 'object' ? error.response.data : JSON.parse(error.response.data);
          if (response.retCode !== "000000") {
            hMessage.warning(response.retMsg ? response.retMsg : error.message)
          }
        } else {
          hMessage.warning(error.message)
        }
        break;
      case 408:
        error.message = "请求超时(408)";
        break;
      case 500:
        error.message = "服务器错误(500)";
        break;
      case 501:
        error.message = "服务未实现(501)";
        break;
      case 502:
        error.message = "网络错误(502)";
        break;
      case 503:
        error.message = "服务不可用(503)";
        break;
      case 504:
        error.message = "网络超时(504)";
        break;
      case 505:
        error.message = "HTTP版本不受支持(505)";
        break;
      default:
        error.message = `连接出错(${error.response.status})!`;
    }
  } else {
    let isUnderscore= window.LOCAL_CONFIG.isUnderscore+"";
    if (isUnderscore === "true") {
      hMessage.error("请求超时或登录超时,请稍后再试！")
    }
  }
  Promise.reject(error)
});
let needLoadingRequestCount = 0;
export function showFullScreenLoading() {
  if (needLoadingRequestCount === 0) {
     store.state.app.isLoading=true;
  }
  needLoadingRequestCount++;
}
export function tryHideFullScreenLoading() {
  if (needLoadingRequestCount <= 0) {
    return;
  }
  needLoadingRequestCount--;
  if (needLoadingRequestCount === 0) {
    setTimeout(tryCloseLoading, 300);
  }
}
const tryCloseLoading = () => {
  if (needLoadingRequestCount === 0) {
    store.state.app.isLoading=false;
  }
};
function clearSession() {
  Cookies.remove('Admin-Token');
  Cookies.remove('lock');
  Cookies.remove('menusType');
  Cookies.remove('JSESSIONID');
  window.sessionStorage.clear();
  window.localStorage.clear();
}
export default httpFetch
