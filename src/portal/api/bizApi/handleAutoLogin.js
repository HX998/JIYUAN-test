import hMessage from "h_ui/dist/lib/Message.js";
import hSpin from "h_ui/dist/lib/Spin.js";
import { post } from "@/api/bizApi/commonUtil.js";

/**
 * 用于bbsp对接自动登录
 * @param store
 * @param router
 * @param requestInfo
 * param  token：用户信息，userNo: 当前登录用户，url：菜单路径
 * requestUrl   解析token，自动登录，"sm/auth/login/securityByToken"
 */
export function handleAutoLogin(store, router, requestInfo) {
  if (!!window.sessionStorage.getItem("bankName")) {
    autoLogin(store, router, requestInfo);
  } else {
    post({loading: false}, "/sm/auth/login/queryVersion").then(res => {
      if (res) {
        let retCode = res.data.retCode;
        if (retCode === "000000") {
          let obj = res.data.retData;
          let bankName = obj.bankName;
          window.sessionStorage.setItem("bankName", bankName);

          hSpin.show();
          autoLogin(store, router, requestInfo);
        }
      }
    });
  }
}

/**
 *
 * @param store
 * @param router
 * @param requestInfo
 * param    token：用户信息，userNo: 当前登录用户，url：菜单路径
 * requestUrl   解析token，自动登录，"sm/auth/login/securityByToken"
 */
export function setRoutesByMenus(store, router, requestInfo) {
  let item = { path: requestInfo.param.url, isFrame: true, isEmbed: true, identifiedMenu: requestInfo.param.identifiedMenu };
  window.sessionStorage.setItem("curMenu", JSON.stringify(item));
  let isOpened = store.getters.openedRouterList.some(child => {
    let flag = (item.path === child.path);
    return flag;
  });
  if (window.isIE) {
    // 打开新的iframe页面
    store.dispatch("setCurOpenTag", item);
    store.dispatch("addFrame", item);
  } else {
    // if (isOpened) {
    //   router.push({ path: item.path, query: { isNeedKeepAlive: "true" } });
    // } else {
      store.dispatch("GenerateMenuByMenus", [{ path: item.path }]);
      if (item.path === '/bbspLogin') {
        router.push({ path: item.path, query: { isNeedKeepAlive: "true" } });
        return;
      }
      store.dispatch("GenerateRoutesByMenus", [item]).then((res) => {
        router.addRoutes(store.getters.addRouters);
        // 路由未定义
        if (!!requestInfo.param.identifiedMenu) {
          router.push({ path: item.path, query: { isNeedKeepAlive: "true", identifiedMenu: requestInfo.param.identifiedMenu } });
        } else {
          router.push({ path: item.path, query: { isNeedKeepAlive: "true" } });
        }
      })
    // }
  }
}

function autoLogin(store, router, requestInfo) {
  store.dispatch("AutoLogin", requestInfo).then((res) => {
    hSpin.hide();
    loadBankInfo().then(() => {
      if (res.retCode == "000000") {
        //对接bbsp
        window.LOCAL_CONFIG.isFrame = true;
        setRoutesByMenus(store, router, requestInfo);
      } else {
        hSpin.hide();
        hMessage.error(res.retMsg);
      }
    });
  }).catch(err => {
    // 请求出错
    hMessage.error("登录错误：" + err);
    hSpin.hide();
  });
}

function loadBankInfo() {
  let bankName = window.sessionStorage.getItem("bankName");
  let isLoadBankInfo = null;
  if (typeof(bankName) === "string" && bankName !== "" && bankName !== "default") {
    import(/* webpackChunkName: "components/[request]"  */`@/components/bank/${bankName}/index`).catch(err => {});
    import(/* webpackChunkName: "banks/auditFlow/[request]"  */`@/api/bank/auditFlow/${bankName}AuditFlow`).then(module => {
      // this._setAuditFlowMap(module.default);
    }).catch(err => {
    });
    import(/* webpackChunkName: "banks/printUrl/[request]"  */`@/api/bank/printUrl/${bankName}PrintUrl`).then(module => {
      // this._setPrintUrlMap(module.default);
    }).catch(err => {
    });
    isLoadBankInfo = import(/* webpackChunkName: "banks/[request]"  */`@/api/bank/${bankName}Index`).then(module => {
      // _this._setRouterMap(module.default);
    }).catch(err => {
    });
    import(/* webpackChunkName: "banks/mainIndex/[request]"  */`@/api/bank/mainIndex/${bankName}MainIndex`).then(module => {
    }).catch(err => {});
  }
  return isLoadBankInfo == null ? new Promise(resolve => {
    resolve();
  }) : isLoadBankInfo;
}
