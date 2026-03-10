/* wangyn18853: 判断是否IE */
// let isIE = navigator.userAgent.indexOf("MSIE") >= 0 || navigator.userAgent.indexOf("Trident") >= 0  ? true : false
let isIE = false;
window.isIE = isIE;
// window.LOCAL_CONFIG.isFrame = isIE
// window.LOCAL_CONFIG.BANK_NAME = window.sessionStorage.getItem("bankName");
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// 开发theme时修改main.scss中引入的custom.scss
import "h_ui/dist/h_ui.min.css";
// import './style/font/iconfont.js';
import "./style/main.scss";
// import "babel-polyfill";
import Vue from "vue";
import App from "./App";
import router from "./router";
import store from "./store";
import hui from "./api/huiImport";
// import hui from 'h_ui/dist/h_ui.min.js';
// import hui from 'h_ui/dist/h_ui.js'
Vue.use(hui);
import plugins from "./plugins";

Vue.use(plugins);

import { permission, getAuditComponentByUrl, setRouterMap, getPrintComponentByUrl, setAuditFlowMap, setPrintUrlMap, getLoginComponentByUrl, mergeLoginIndex, setMainIndexMap, getMainIndexByUrl } from "/src/portal/store/modules/permission";

store.registerModule("permission", permission);
Vue.prototype._getAuditComponentByUrl = getAuditComponentByUrl;
Vue.prototype._getPrintComponentByUrl = getPrintComponentByUrl;
Vue.prototype._getLoginComponentByUrl = getLoginComponentByUrl;
Vue.prototype._mergeLoginIndex = mergeLoginIndex;
Vue.prototype._getMainIndexByUrl = getMainIndexByUrl;
Vue.prototype._setRouterMap = setRouterMap;
Vue.prototype._setAuditFlowMap = setAuditFlowMap;
Vue.prototype._setPrintUrlMap = setPrintUrlMap;
Vue.prototype._setMainIndexMap = setMainIndexMap;

// import(/* webpackChunkName: "components/common" */`./components/bemp/index.js`);
import(/* webpackChunkName: "components/common" */`./components/bemp/index.js`).then(() => {
  let bankName = window.sessionStorage.getItem("bankName");
  if(typeof(bankName) === 'string' && bankName !== "" && bankName !== 'default') {
    import(/* webpackChunkName: "components/[request]"  */`/src/portal/components/bank/${bankName}/index`).catch(err => {});
  }
});
import(/* webpackChunkName: "components/common" */`./components/bopp/index.js`).catch(err => {});

//引入银行票据图标库
import "./style/font/iconfont.css";
//引入富文本编辑器
// import kindeditor from 'kindeditor';
// import 'kindeditor/themes/default/default.css';
// import 'kindeditor/kindeditor-all-min.js';
// import 'kindeditor/lang/zh-CN.js';
import VueI18n from "vue-i18n";

Vue.use(VueI18n);// 通过插件的形式挂载

//引入个性化银行样式、国际化文件
let bankName = window.sessionStorage.getItem("bankName");
if(typeof(bankName) === 'string' && bankName !== "" && bankName !== 'default') {
  import(`/src/portal/views/bizViews/banks/${bankName}/style/style.scss`).catch(err => {});
  import(/* webpackChunkName: "banks/locale/[request]"  */`/src/portal/views/bizViews/banks/${bankName}/locale/lang/zh-CN.js`).then((info) => {
    const mergeZH = Object.assign(window.zh_cn, info.default); //合并个性化中文语言包
    Vue.locale("zh-CN", mergeZH);
  }).catch(err => {});
}

Vue.config.productionTip = false;
// 设置语言
Vue.config.lang = "zh-CN";
import zhLocale from "h_ui/dist/locale/zh-CN";
// import enLocale from 'h_ui/dist/locale/en-US';
import zh_cn from "../static/locale/lang/zh-CN";
// 加上票付通的语言包
import bopp_zh_cn from "../static/locale/lang/bopp/zh-CN"
// 多语言配置--打包后可以自定义设置
window.zh_cn = Object.assign(zh_cn, zhLocale, bopp_zh_cn); //将我们项目中的语言包与h_ui的语言包进行合并   // 中文语言包
// const mergeZH = Object.assign(window.zh_cn, zhLocale); //将我们项目中的语言包与h_ui的语言包进行合并   // 中文语言包
// const mergeEN = Object.assign(window.en_us, zhLocale); // 英文语言包
Vue.locale("zh-CN", window.zh_cn);
// Vue.locale('en-US', mergeEN);
import { getMenuList } from "./api/login.js";
import fetch from "./api/httpFetch.js";

Vue.prototype.$http = fetch;
Vue.prototype.LOCAL_CONFIG = window.LOCAL_CONFIG;
// 注入全局组件
import HDatagrid from "./components/HDatagrid.vue";
import HPanel from "./components/HPanel.vue";
import HDatatree from "./components/HDatatree.vue";
import HDelay from "./components/HDelay.vue";

Vue.component("h-datagrid", HDatagrid);
Vue.component("h-panel", HPanel);
Vue.component("h-datatree", HDatatree);
Vue.component("h-delay", HDelay);
// import SpreadSheet from './plugins/report/spread-sheet/SpreadSheet';
// Vue.component('spread-sheet', SpreadSheet);
// // 引进日期格式控件
// let moment = import(/* webpackChunkName: "moment" */`moment`);
import moment from "moment";

Vue.prototype.$moment = moment;
//全局提示信息
import msgTip from "/src/portal/utils/msgTip.js";
Vue.prototype.$msgTip = msgTip;
// 字典的获取
import { getDictListByGroups, getDictValueFromMap, post } from "/src/portal/api/bizApi/commonUtil";

Vue.prototype.getDictListByGroups = getDictListByGroups;
Vue.prototype.getDictValueFromMap = getDictValueFromMap;
import { deepClone } from "/src/portal/utils/index";

Vue.prototype.deepClone = deepClone;
// 开启调试
Vue.config.debug = true;
// 引入打印封装
import * as print from "/src/portal/utils/print/LodopFuncs.js";

Vue.prototype.$print = print;
/****************************/
const whiteList = ["/login", "/bbspLogin", "/logout", "/singleSignOnLogin"];

import { handleAutoLogin, setRoutesByMenus } from "/src/portal/api/bizApi/handleAutoLogin";

// import optColum from './api/optColum.js';
// Vue.use(optColum);
import { PageCommonUtils } from "/src/portal/utils/pageUtils.js";

import HMsgBox from "/src/portal/components/HMsgBox";
import msgBoxInstance from "/src/portal/utils/msgBoxInstance.js";

/* wangyn18853: 判断是否IE */
if (isIE) {
  Vue.prototype.PageCommonUtils = PageCommonUtils;
  let baseMsgBox = Vue.extend(hui.MsgBox);
  let hMsgBox = {
    extends: baseMsgBox, //继承组件
    props: {
      maskClosable: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        isRealVisible: false
      };
    },
    computed: { //可以覆盖继承的属性
      isMsgBoxStatus() {
        return this.value;
      }
    },
    watch: {
      isMsgBoxStatus(val) {
        val ? this.PageCommonUtils.openMask() : this.PageCommonUtils.closeMask();
      }
    }
  };
  Vue.component("h-msg-box", hMsgBox);
} else {
  if(window.sessionStorage.getItem("isRegistMsgBox") !== "0" && window.sessionStorage.getItem("isTransfer") != null) {
    registMsgBox(window.sessionStorage.getItem("isTransfer") !== "0");
  }
  post({ code: "1", loading: false }, "/sm/auth/login/queryVersion").then(res => {
    //在type为daterange时,是否取消两个日期面板之间的联动，默认联动
    let isNeedLinkPanels = false;
    //是否将弹层放置于body内，true-全局遮罩，false-部分遮罩
    let isTransfer = true;
    let isOpenI9 = true;
    if (res) {
      let retCode = res.data.retCode;
      if (retCode === "000000") {
        isNeedLinkPanels = res.data.retData.isNeedLinkPanels === "1";
        isTransfer = !res.data.retData.isTransfer || res.data.retData.isTransfer === "1";
        isOpenI9 = !res.data.retData.isOpenI9 || res.data.retData.isOpenI9 === "1";
        window.sessionStorage.setItem("bankName", res.data.retData.bankName);
        window.sessionStorage.setItem("isCustomLogin", res.data.retData.isCustomLogin);
        let licenseMac=res.data.retData.licenseMac;
        window.sessionStorage.setItem("licenseMac", licenseMac);
      }
    }
    let hDatePicker = {
      extends: hui.DatePicker, //继承组件
      props: {
        autoPlacement: {
          type: Boolean,
          default: true
        },
        unlinkPanels: {
          type: Boolean,
          default:  isNeedLinkPanels
        }
      }
    };
    Vue.component("h-date-picker", hDatePicker);
    if(window.sessionStorage.getItem("isRegistMsgBox") !== "0" && window.sessionStorage.getItem("isTransfer") == null) {
      window.sessionStorage.setItem("isTransfer", isTransfer ? "1" : "0");
      registMsgBox(isTransfer);
    }
    window.sessionStorage.setItem("isOpenI9", isOpenI9 ? "1" : "0");
  }).catch(err => {
    let hDatePicker = {
      extends: hui.DatePicker, //继承组件
      props: {
        autoPlacement: {
          type: Boolean,
          default: true
        }
      }
    };
    Vue.component("h-date-picker", hDatePicker);

    let hMsgBox = {
      extends: hui.MsgBox, //继承组件
      props: {
        maskClosable: {
          type: Boolean,
          default: false
        },
        maximize: {
          type: Boolean,
          default: true
        }
      },
      data() {
        return {
          isRealVisible: false
        };
      }
    };
    Vue.component("h-msg-box", hMsgBox);
  });

  let hInput = {
    extends: hui.hInput, //继承组件
    props: {
      titleShow: {
        type: Boolean,
        default: true
      },
      lengthByByte: {
        type: Boolean,
        default: true
      },
      filterRE: {
        type: [Object, RegExp],
        default() {
          return /[^\w`·~!@#$%^……&*()-——_=+\[\]{}\\|;:'"’”,.<>/?‘’“”\s\u4e00-\u9fa5\uFF00-\uFFEF\u2E80-\u2EFF\u3000-\u303F\u31C0-\u31EF\u3200-\u32FF\uFE10-\uFE1F\uFE30-\uFE4F]/g
        }
      }
    }
  };
  Vue.component("h-input", hInput);

  let hTypefield = {
    extends: hui.hTypefield, //继承组件
    props: {
      divided: {
        type: Boolean,
        default: true
      }
    }
  };
  Vue.component("h-typefield", hTypefield);
}
window.sessionStorage.setItem("isIE", isIE);

//阻止空格、enter事件对按钮的影响
document.onkeydown=function(event){
  if (event.key !== undefined) {
    if(event.key == "Enter") {
      event.preventDefault();
    }
    if (event.key == " "|| event.key == "Enter") {
      if (event.target.nodeName=="BUTTON"){
        return false
      }
    }
  } else if (event.keyCode !== undefined) {
    if(event.keyCode == 13) {
      event.preventDefault();
    }
    if (event.keyCode == 13||event.keyCode == 32) {
      if (event.target.nodeName=="BUTTON"){
        return false
      }
    }
  }
}

Vue.mixin({
  beforeRouteLeave: function(to, from, next) {
    // if (from && from.meta.isKeepAlive && to.meta.isKeepAlive && from.meta.isKeepAlive>to.meta.isKeepAlive)
    if (from.path !== "/mainIndex" && store.getters.needKeepAliveList.indexOf(from.meta.comName) < 0 && this.$options.name !== "layout") {//此处判断是如果返回上一层，你可以根据自己的业务更改此处的判断逻辑，酌情决定是否摧毁本层缓存。
      // Object.assign(this.$data,this.$options.data())
      if (this.$vnode && this.$vnode.data.keepAlive) {
        if (this.$vnode.parent && this.$vnode.parent.componentInstance && this.$vnode.parent.componentInstance.cache) {
          if (this.$vnode.componentOptions) {
            var key = this.$vnode.key == null
              ? this.$vnode.componentOptions.Ctor.cid + (this.$vnode.componentOptions.tag ? `::${this.$vnode.componentOptions.tag}` : "")
              : this.$vnode.key;
            var cache = this.$vnode.parent.componentInstance.cache;
            var keys = this.$vnode.parent.componentInstance.keys;
            if (cache[key]) {
              if (keys.length) {
                var index = keys.indexOf(key);
                if (index > -1) {
                  keys.splice(index, 1);
                }
              }
              delete cache[key];
            }
          }
        }
      }
      this.$destroy();
    }
    next();
  }
});

/* 页面刷新前进行权限校验 */
router.beforeEach((to, from, next) => {
  /* 开启页面加载进度提示 */
  // if (window.parent) window.LOCAL_CONFIG.isFrame = true
  // if (isIE) window.LOCAL_CONFIG.isFrame = true
  hui.hLoadingBar.start();
  if (window.LOCAL_CONFIG.isToken) {
    if (store.getters.token && store.getters.userInfo != null) { //有token且用户信息不为空，证明已登录
      if (Object.keys(to.query).length > 0 && to.query.bbspIsLogout) {//同一标签页下，bbsp带缓存访问bemp时显示登录页
        store.dispatch("Logout").then(() => {
          location.reload();
        });
        return;
      }
      if (Object.keys(to.query).length > 0 && !!to.query.isNeedKeepAlive) {//通过bbsp对接登录
        if (to.meta.isKeepAlive && to.meta.comName) {
          store.dispatch('addRouteKeepAlive', to.meta.comName)
        }
      }
      if (Object.keys(to.query).length > 0 && !!to.query.token) {
        window.sessionStorage.setItem("isNeedAutoLoad", "1");
        //通过bbsp对接登录，只嵌套界面内容
        let url = decodeURIComponent(to.path);
        if (url.indexOf("//") !== -1) {
          url = url.substr(1);
        }
        let isNeedReLogin = to.query.userNo !== store.getters.userInfo.userNo;
        if (to.path === "/bbspLogin" || to.path === "/login") {
          next();
        } else if (isNeedReLogin) {
          handleAutoLogin(store, router, {
            param: { token: to.query.token, userNo: to.query.userNo, url: url },
            requestUrl: "/sm/auth/login/securityByToken"
          });
        } else {
          let param = { token: to.query.token, userNo: to.query.userNo, url: url };
          if (!!to.query.identifiedMenu) {
            param.identifiedMenu = to.query.identifiedMenu;
          }
          setRoutesByMenus(store, router, { param: param });
          hui.hLoadingBar.finish();
        }
      } else if ((to.path === '/login' && Object.keys(to.query).length > 0 && !!to.query.token) || from.path === '/login' && Object.keys(from.query).length > 0 && !!from.query.token) {
        //通过bbsp对接登录，链接跳转到新标签
        window.sessionStorage.setItem("isNeedAutoLoad", "1");
        next()
      } else if (to.path === "/login") {
        next({ path: "/" });
      } else if (to.path === "/logout") {
        next();
      } else {
        let menus = JSON.parse(window.sessionStorage.getItem("menus"));
        if (Array.isArray(store.getters.searchRoute) && store.getters.searchRoute.length == 0 && (!isIE || isIE && !window.parent)) {
          store.commit("SEARCH_ROUTE", getSerachRoute(menus));
        }
        if (menus && menus.length >= 0 && store.getters.addRouters.length > 0) {
          if (to.matched.length === 0) {
            from.path ? next({ path: from.path }) : next({ path: "/" });
          } else {
            next();
          }
        } else if (menus && menus.length >= 0 && store.getters.addRouters.length == 0) {
          store.dispatch("GenerateMenuByMenus", menus);
          if (to.path == "/" || to.path == "/mainIndex" || to.path == "/indexcommon" || to.path == "/bbspLogin") {
            post({ userNo: store.getters.userInfo.userNo }, "/sm/auth/login/userLoginByToken").then(res => {
              if (res && res.data.retCode === "000000" && res.data.retData.autoLogin === "1") {
                store.dispatch("AutoLogin", { param: { code: res.data.retData.autoLogin }, requestUrl: "/sm/auth/login/userLoginByToken" }).then((res) => {
                  initMenuList();
                  mergeMainIndex(to, next);
                }).catch(err => {
                  // 请求出错
                  hui.hMessage.error("登录错误：" + err);
                  mergeMainIndex(to, next);
                });
              } else {
                mergeMainIndex(to, next);
              }
            }).catch(err => {
              hui.hMessage.error("登录错误：" + err);
              mergeMainIndex(to, next);
            });
          } else {
            // 刷新后保存当前打开的页面路径并进行注册，否则跳转至mainIndex
            let curMenu = JSON.parse(window.sessionStorage.getItem("curMenu"));
            // 或全局查找
            if (curMenu) {
              if(curMenu.connectMode === "embed") {
                store.dispatch("setCurEmbedMenu", {
                  connectMode: curMenu.connectMode,
                  findId: curMenu.id,
                  id: curMenu.path.substring(curMenu.path.lastIndexOf("\/") + 1, curMenu.path.length),
                  parentId: curMenu.parentId,
                  name: curMenu.title,
                  path: curMenu.path,
                  embedPath: curMenu.embedPath
                });
              }
              post({ userNo: store.getters.userInfo.userNo }, "/sm/auth/login/userLoginByToken").then(res => {
                if (res && res.data.retCode === "000000" && res.data.retData.autoLogin === "1") {
                  store.dispatch("AutoLogin", { param: { code: res.data.retData.autoLogin }, requestUrl: "/sm/auth/login/userLoginByToken" }).then((res) => {
                    initMenuList();
                    initCurMenu(to, next, curMenu);
                  }).catch(err => {
                    // 请求出错
                    hui.hMessage.error("登录错误：" + err);
                    initCurMenu(to, next, curMenu);
                  });
                } else {
                  initCurMenu(to, next, curMenu);
                }
              }).catch(err => {
                hui.hMessage.error("登录错误：" + err);
                initCurMenu(to, next, curMenu);
              });
              // if (window.isIE) {
              //   store.dispatch("GenerateRoutesByMenusOfIE", curMenu).then(() => {
              //     router.addRoutes(store.getters.addRouters);
              //     // 路由未定义
              //     next({ ...to });
              //   });
              // } else {
              //   store.dispatch("GenerateRoutesByMenus", [curMenu]).then(() => {
              //     router.addRoutes(store.getters.addRouters);
              //     // 路由未定义
              //     next({ ...to });
              //   });
              // }
            } else {
              next("/");
            }
            // curMenu = undefined
          }

          // let curChild = getChild(to.fullPath)
          // let inx =[]
          // if(curChild==''){
          //   inx=[0]
          // }else{
          //   let curinx = JSON.parse(window.sessionStorage.getItem('inxPath')).indexOf(curChild)
          //   curinx=curinx==-1?0:curinx
          //   inx.push(curinx)
          // }
          // window.sessionStorage.setItem('routerInxList',JSON.stringify(inx))
          // store.dispatch('GenerateRoutesByMenus',menus).then(() => {
          //   router.addRoutes(store.getters.addRouters)
          //   // 路由未定义
          //   next({...to})

          // })
          menus = undefined;
        } else {
          initMenuList(() => {
            next({...to})
          });
          // getMenuList(store.getters.token).then(res => {
          //   if (res && res.data.retCode !== "000000") {
          //     hui.hMessage.error({content: res.data.retMsg ? res.data.retMsg : "获取菜单失败，请重新登录！", duration: 5})
          //   }
          //   res.data = res && res.data.retData ? res.data.retData : [];
          //   if (res && res.data) {
          //     // 根据权限生成对应菜单
          //     let data = (res.data instanceof Array) ? res.data : [res.data];
          //     store.dispatch("GenerateMenuByMenus", data);
          //     if (Array.isArray(store.getters.searchRoute) && store.getters.searchRoute.length == 0 && (!isIE || isIE && !window.parent)) {
          //       store.commit("SEARCH_ROUTE", getSerachRoute(data));
          //     }
          //     // 在sidebaritem中每次点击生成路由~，首次加载跳转至mainIndex
          //     next({ ...to });
          //     // 根据权限生成路由
          //     // window.sessionStorage.setItem('routerInxList',JSON.stringify([0]))
          //     // setIndexAndPath(data)
          //     // store.dispatch('GenerateRoutesByMenus', data).then(() => {
          //     //   router.addRoutes(store.getters.addRouters)
          //     //   // 路由未定义
          //     //   let aaa = [...to]
          //     //   next({...to})
          //     // })
          //     // store.dispatch('GenerateRoutesByMenus', []).then(() => {
          //     //   router.addRoutes(store.getters.addRouters)
          //     //   // 路由未定义
          //     //   next({...to})
          //     // })
          //   }
          // }).catch(err => {
          //   console.log(err);
          //   hui.hMessage.error("网络通信失败,服务器异常" + err)
          // });
        }
      }
    } else {
      if (Object.keys(to.query).length > 0 && !!to.query.isNeedKeepAlive) {//通过bbsp对接登录，登录界面会话失效
        next({ path: "/bbspLogin" });
        hui.hLoadingBar.finish();
      } else if (Object.keys(to.query).length > 0 && !!to.query.token) {//通过bbsp对接登录
        window.sessionStorage.setItem("isNeedAutoLoad", "1");
        //通过bbsp对接登录
        if (to.path === "/bbspLogin" || to.path === "/login" || to.path.indexOf("/login") !== -1) {
          if (to.path.indexOf("/login") !== -1 && store.getters.addRouters.length === 0) {
            let loginRoute = [{
              path: to.path,
              component: getLoginComponentByUrl(to.path),
            }];
            store.dispatch("setRouters", loginRoute).then(() => {
              router.addRoutes(loginRoute);
              next({ ...to });
            });
            return
          }
          next();
        } else {
          let url = decodeURIComponent(to.path);
          if (url.indexOf("//") !== -1) {
            url = url.substr(1);
          }
          handleAutoLogin(store, router, {
            param: { token: to.query.token, userNo: to.query.userNo, url: url },
            requestUrl: "/sm/auth/login/securityByToken"
          });
        }
      } else if (whiteList.indexOf(to.path) !== -1) {
        next();
      } else if (whiteList.indexOf(to.path.substring(to.path.lastIndexOf("/"))) !== -1) {//用于个性化界面登录
        post({ code: "1", loading: false }, "/sm/auth/login/queryVersion").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let obj = res.data.retData;
              let bankName = obj.bankName;
              let isCustomLogin = obj.isCustomLogin;
              let isSingleLogin = obj.isSingleLogin;
              window.sessionStorage.setItem("bankName", bankName);
              window.sessionStorage.setItem("isCustomLogin", isCustomLogin);
              window.sessionStorage.setItem("isSingleLogin", isSingleLogin);
              let licenseMac=obj.licenseMac;
              window.sessionStorage.setItem("licenseMac", licenseMac);
              mergeLoginIndex(bankName);
              if (typeof (bankName) === 'string' && bankName !== "" && bankName !== 'default' && (isCustomLogin === '1' || isSingleLogin === '1')) {
                import(/* webpackChunkName: "banks/[request]/login"  */`/src/portal/views/bizViews/banks/${bankName}/login.vue`).then(module => {
                  if (store.getters.addRouters.length === 0) {
                    let loginRoute = [{
                      path: to.path,
                      component: getLoginComponentByUrl(to.path),
                    }];
                    store.dispatch("setRouters", loginRoute).then(() => {
                      router.addRoutes(loginRoute);
                      next({...to});
                    });
                  } else {
                    next();
                  }
                }).catch(err => {
                  if (store.getters.addRouters.length === 0) {
                    let loginRoute = [{
                      path: to.path,
                      component: getLoginComponentByUrl(to.path),
                    }];
                    store.dispatch("setRouters", loginRoute).then(() => {
                      router.addRoutes(loginRoute);
                      next({...to});
                    });
                  } else {
                    next();
                  }
                });
              }
              else {
                if (store.getters.addRouters.length === 0) {
                  let loginRoute = [{
                    path: to.path,
                    component: getLoginComponentByUrl(to.path),
                  }];
                  store.dispatch("setRouters", loginRoute).then(() => {
                    router.addRoutes(loginRoute);
                    next({...to});
                  });
                } else {
                  next();
                }
              }
            }
          }
        }).catch(err => {
          if (store.getters.addRouters.length === 0) {
            let loginRoute = [{
              path: to.path,
              component: getLoginComponentByUrl(to.path),
            }];
            store.dispatch("setRouters", loginRoute).then(() => {
              router.addRoutes(loginRoute);
              next({...to});
            });
          } else {
            next();
          }
        });
      } else {
        window.sessionStorage.clear();
        window.localStorage.clear();
        next("./login");
        hui.hLoadingBar.finish();
      }
    }
  } else if (!window.LOCAL_CONFIG.isToken && window.LOCAL_CONFIG.menus) {
    if (store.getters.addRouters.length == 0) {
      store.dispatch("GenerateMenuByMenus", window.LOCAL_CONFIG.menus);
      store.dispatch("GenerateRoutesByMenus", window.LOCAL_CONFIG.menus).then(() => {
        router.addRoutes(store.getters.addRouters);
        // 路由未定义
        next({ ...to });
      });
    } else {
      next();
    }
  } else {
    next();
  }
});
router.afterEach(() => {
  hui.hLoadingBar.finish();
});
let serachRoutes = [];

function getSerachRoute(data) {
  for (let i in data) {
    if (data[i].children) {
      getSerachRoute(data[i].children);
    } else {
      if (typeof(data[i].path) == "string") {
        serachRoutes.push({ name: data[i].title, path: data[i].path, id: data[i].id, parentId: data[i].parentId });
      }
    }
  }
  return serachRoutes;
}

function registMsgBox(isTransfer) {
  if(isTransfer) {
    let hMsgBox = {
      extends: hui.MsgBox, //继承组件
      props: {
        maskClosable: {
          type: Boolean,
          default: false
        },
        maximize: {
          type: Boolean,
          default: true
        }
      },
      data() {
        return {
          isRealVisible: false
        };
      }
    };
    Vue.component("h-msg-box", hMsgBox);
  } else {
    let hMsgBox = {
      extends: HMsgBox,
      props: {
        transfer: {
          type: Boolean,
          default: isTransfer
        },
        scrollable:{
          type: Boolean,
          default: true
        }
      },
      mounted() {
        if(!this.transfer) {
          if(document.querySelector('.window-operate') !== null) {
            this.targetNode = document.querySelector('.window-operate');
          } else {
            this.targetNode = document.querySelector('#appMain').children[0];
          }
        }
      }
    };
    Vue.component("h-msg-box", hMsgBox);
    Vue.prototype.$hMsgBox = msgBoxInstance;
    Vue.prototype.$messagebox.setTransfer(false);
  }
}

function initMenuList(callback) {
  getMenuList(store.getters.token).then(res => {
    if (res && res.data.retCode !== "000000") {
      hui.hMessage.error({content: res.data.retMsg ? res.data.retMsg : "获取菜单失败，请重新登录！", duration: 5})
    }
    res.data = res && res.data.retData ? res.data.retData : [];
    if (res && res.data) {
      // 根据权限生成对应菜单
      let data = (res.data instanceof Array) ? res.data : [res.data];
      store.dispatch("GenerateMenuByMenus", data);
      if (Array.isArray(store.getters.searchRoute) && store.getters.searchRoute.length == 0 && (!isIE || isIE && !window.parent)) {
        store.commit("SEARCH_ROUTE", getSerachRoute(data));
      }
      if (callback instanceof Function) {
        callback();
      }
    }
  }).catch(err => {
    console.log(err);
    hui.hMessage.error("网络通信失败,服务器异常" + err)
  });
}

function initCurMenu(to, next, curMenu) {
  if (window.isIE) {
    store.dispatch("GenerateRoutesByMenusOfIE", curMenu).then(() => {
      router.addRoutes(store.getters.addRouters);
      // 路由未定义
      next({ ...to });
    });
  } else {
    store.dispatch("GenerateRoutesByMenus", [curMenu]).then(() => {
      router.addRoutes(store.getters.addRouters);
      // 路由未定义
      next({ ...to });
    });
  }
}

function mergeMainIndex(to, next) {
  let bankName = window.sessionStorage.getItem("bankName");
  if(to.path == "/mainIndex" && typeof(bankName) === 'string' && bankName !== "" && bankName !== 'default') {
    import(/* webpackChunkName: "banks/mainIndex/[request]"  */`/src/portal/api/bank/mainIndex/${bankName}MainIndex`).then(module => {
      setMainIndexMap(module.default);
      next();
    }).catch(err => {
      next();
    });
  } else {
    next();
  }
}

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  store,
  template: "<App/>",
  components: { App }
});

// if (window.HTMLElement) {
//   if (Object.getOwnPropertyNames(HTMLElement.prototype).indexOf('dataset') === -1) {
//       Object.defineProperty(HTMLElement.prototype, 'dataset', {
//           get: function () {
//               var attributes = this.attributes; //获取节点的所有属性
//               var name = [],
//                   value = []; //定义两个数组保存属性名和属性值
//               var obj = {}; //定义一个空对象
//               for (var i = 0; i < attributes.length; i++) { //遍历节点的所有属性
//                   if (attributes[i].nodeName.slice(0, 5) == 'data-') { //如果属性名的前面5个字符符合"data-"
//                       // 取出属性名的"data-"的后面的字符串放入name数组中
//                       name.push(attributes[i].nodeName.slice(5));
//                       //取出对应的属性值放入value数组中
//                       value.push(attributes[i].nodeValue);
//                   }
//               }
//               for (var j = 0; j < name.length; j++) { //遍历name和value数组
//                   obj[name[j]] = value[j]; //将属性名和属性值保存到obj中
//               }
//               return obj; //返回对象
//           }
//       });
//   }
// }
// function setIndexAndPath(data) {
//   setTimeout(()=>{
//     let arr=[]
//     data.forEach((item,inx)=>{
//       while(!item.path&&item.children&&item.children.length>0){
//         item = item.children[0]
//       }
//       console.log(item.path);
//       arr.push(getChild(item.path))
//     })
//     window.sessionStorage.setItem('inxPath',JSON.stringify(arr))
//   },0);
// }
// function getChild(str) {
//   if(!str) return ''
//   let curChild = ''
//   let child = ['/be/','/bm/','/ce/','/pc/','/pe/','/pl/','/shcpe/','/sm/']
//   for (var i = child.length - 1; i >= 0; i--) {
//     if(str.indexOf(child[i])!=-1){
//       curChild = child[i]
//       break;
//     }
//   }
//   return curChild
// }

