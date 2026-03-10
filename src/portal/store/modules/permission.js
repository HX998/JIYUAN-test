// import {constantRouterMap} from '../../router/constantRouterMap.js'
import Layout from '../../views/frame/Layout.vue'
import AppMain from '@/views/frame/AppMain.vue'
import routerMap from '@/api/index.js';
import auditFlowMap from '@/api/auditFlow.js';
import printUrlMap from '@/api/printUrl.js';
import loginIndexMap from '@/api/loginIndex.js';
import mainIndexMap from '@/api/mainIndex.js';
import boppMap from '@/api/bopp/index.js'
// import zhLocale from "h_ui/dist/locale/zh-CN";
// const routerMap = import(/* webpackChunckName:"common/routerMap" */'@/api/index.js');
// Vue.prototype._routerMap = routerMap
//合并bopp的router
Object.assign(routerMap,boppMap)

export function setRouterMap(bankRouterMap) {
  Object.assign(routerMap, bankRouterMap);
}

export function getRouterComponentByUrl (url) {
  if (url != '') return routerMap[url] ? routerMap[url] : false
  return false
}

export function setAuditFlowMap(bankAuditFlowMap) {
  Object.assign(auditFlowMap, bankAuditFlowMap);
}

export function getAuditComponentByUrl (url) {
  if (url != '') return auditFlowMap[url] ? auditFlowMap[url] : false
  return false
}

export function setPrintUrlMap(bankPrintUrlMap) {
  Object.assign(printUrlMap, bankPrintUrlMap);
}

export function getPrintComponentByUrl (url) {
  if (url != '') return printUrlMap[url] ? printUrlMap[url] : false
  return false
}

export function mergeLoginIndex (bankName) {
  if(typeof(bankName) === 'string' && bankName !== "" && bankName !== 'default'){
    import(/* webpackChunkName: "banks/loginIndex/[request]"  */`@/api/bank/loginIndex/${bankName}LoginIndex`).then(module => {
      setLoginIndexMap(module.default);
    }).catch(err => {});
  }
}

export function getLoginComponentByUrl (url) {
  if (url != '') return loginIndexMap[url] ? loginIndexMap[url] : false
  return false
}

export function setLoginIndexMap(bankLoginIndexMap) {
  Object.assign(loginIndexMap, bankLoginIndexMap);
}

export function setMainIndexMap(bankMainIndexMap) {
  Object.assign(mainIndexMap, bankMainIndexMap);
}

export function getMainIndexByUrl (url) {
  if (url != '') return mainIndexMap[url] ? mainIndexMap[url] : false
  return false
}

export const permission = {
  state: {
    // routers: constantRouterMap,
    addRouters: [],
    searchRoute: [],
    openedRouterList: [
      {
        path: '/',
      },
      {
        path: '/mainIndex'
      },
      {
        path: '/indexcommon'
      }
    ],
    // _routerMap: routerMap
  },
  getters: {
      addRouters: state => state.addRouters,
      searchRoute: state => state.searchRoute,
      openedRouterList:state => state.openedRouterList,
      // _routerMap: state => state.routerMap
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      // state.routers = [...constantRouterMap.concat(routers)]
      state.addRouters = [...routers]
    },
    SEARCH_ROUTE: (state, data) => {
      state.searchRoute = data
    },
    DELETE_ALL_OPENEDlIST: (state) => {
      state.openedRouterList = []
    },
  },
  actions: {
    GenerateRoutesByMenusOfIE  ({commit}, menu) {
      // let arr =JSON.parse(window.sessionStorage.getItem('routerInxList'))
      // data = data && data.length > 0 ? getCurData(data,arr) : []
      return new Promise(resolve => {
        mergeMenus().then(() => {
          let route = []
          // ie下能进入此项，均是正常路由渲染
          let menuId = menu.path.substring(menu.path.lastIndexOf('\/')+1,menu.path.length)
          route.push({
            path: menu.path,
            name: menu.title,
            meta: {
              icon: menu.icon,
              hidden: menu.hidden,
              // comName: menu.isKeepAlive ? menu.comName : '' //id字段唯一
              comName: (menu.isKeepAlive || window.LOCAL_CONFIG.isAllKeepAlive) ? menuId : '',
              id: menuId,
              findId : menu.id // 用于tabs切换时可以定位到菜单栏
            },
            redirect: menu.redirect,
            //  component: r => require.ensure([], () => r(require('@/views/'+ newCpmponent + '.vue')))
            component: routerMap[menu.path]
            // component: () => import(/* webpackChunkName:"common/mainIndex" */'@/views/mainIndex.vue')
          })
          commit('SET_ROUTERS', route)
          resolve()
        })
      });
    },
    // 根据服务端菜单生成路由
    GenerateRoutesByMenus ({commit}, data) {
      // let arr =JSON.parse(window.sessionStorage.getItem('routerInxList'))
      // data = data && data.length > 0 ? getCurData(data,arr) : []
      return new Promise(resolve => {
        mergeMenus().then(() => {
          let route = []
          let accessedRouters = filterRouterByMenus([], data, []);
          window.LOCAL_CONFIG.isFrame = data[0].isFrame !== undefined ? data[0].isFrame : window.LOCAL_CONFIG.isFrame;
          let allRouter = [...accessedRouters]
          if (!!data[0].isEmbed) { // 嵌入其他系统，只展示界面
            route = [{
              path: '/',
              component: AppMain,
              redirect: '/bbspLogin',
              children: allRouter
            }]
          } else if (window.LOCAL_CONFIG.isUcf || window.LOCAL_CONFIG.isFrame) { // ucf中不嵌套外层菜单Layout
            route = [{
              path: '/',
              component: AppMain,
              redirect: '/mainIndex',
              children: allRouter
            }]
          } else {
          // 初始化页面配置
            route = [{
              path: '/',
              component: Layout,
              redirect: '/mainIndex',
              children: allRouter
            }]
          //  commit('SEARCH_ROUTE', accessedRouters)
          }

          commit('SET_ROUTERS', route)
          resolve()
        })
      });
    },
    delAllOpenedList: ({commit})=> {
      commit('DELETE_ALL_OPENEDlIST')
    },
    setRouters: ({commit}, routers) => {
      commit('SET_ROUTERS', routers)
    }
  }
}
export default permission
let rootId = ''
/**
 * 根据后台传回的可用menus,递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param router
 * @param menus
 */
function filterRouterByMenus (router, menus, parentName) {
  if(menus && menus.length > 0) {
    for (let menu of menus) {
      // 将每个路由的rootId保存，用于切换子系统
      if (menu.parentId == window.LOCAL_CONFIG.MENUS_ROOT_NAME) rootId = menu.id
      if (menu.children && menu.children.length > 0) {
        filterRouterByMenus(router, menu.children)
      } else {
        let newparam =  !menu.path ||  menu.path.indexOf('http') >=0 ? menu.path : ''
        // let newCpmponent =!menu.path || menu.path.indexOf('http') >=0 ? 'mainIndex':'bizViews'+menu.path
        let newCpmponent =!menu.path || menu.path.indexOf('http') >=0 ? 'mainIndex': menu.path
        let arr = menu.path ? menu.path.split('/#'):[,'mainIndex']
        menu.path = (menu.path && menu.path.indexOf('http') >=0) ? arr[1] : (menu.path? menu.path:'');
        let menuId = menu.path.substring(menu.path.lastIndexOf('\/')+1,menu.path.length)
        if (!!menu.identifiedMenu) {
          menuId = menuId + Math.floor(Math.random() * 100);
        }
        permission.state.openedRouterList.push(menu);
        router.push({
          path: menu.path,
          name: menu.title,
          query:menu.connectMode === "embed" ? { embedPath: menu.embedPath.substring(menu.embedPath.indexOf("url")).split("=")[1] } : {},
          meta: {
             icon: menu.icon,
             hidden: menu.hidden,
             param: newparam,
             optRight: menu.optRight,
             isKeepAlive: menu.isKeepAlive || window.LOCAL_CONFIG.isAllKeepAlive,
             // comName: menu.isKeepAlive ? menu.comName : '' //id字段唯一
             comName: (menu.isKeepAlive || window.LOCAL_CONFIG.isAllKeepAlive) ? menuId : '',
             rootId: rootId,
             id: menuId,
             // 用于tabs切换时可以定位到菜单栏
             findId : menu.id,
             parentId: menu.parentId,
             path: menu.path,
             title: menu.title,
             connectMode: menu.connectMode
           },
          redirect: menu.redirect,
          //  component: r => require.ensure([], () => r(require('@/views/'+ newCpmponent + '.vue')))
          component: menu.connectMode === "embed" ? () => import(/* webpackChunkName: "embed/embedMenuMain" */`@/views/embed/embedMenuMain.vue`) : routerMap[newCpmponent]
        })
      }
    }
  }

  return router
}

/**
 * 用于合并个性化菜单路径
 */
function mergeMenus() {
  let bankName = window.sessionStorage.getItem("bankName");
  let bankMenus = null;
  if(typeof(bankName) === 'string' && bankName !== "" && bankName !== 'default'){
    // import(/* webpackChunkName: "components/[request]"  */`@/components/bank/${bankName}/index`).catch(err => {});
    import(/* webpackChunkName: "banks/auditFlow/[request]"  */`@/api/bank/auditFlow/${bankName}AuditFlow`).then(module => {
      setAuditFlowMap(module.default);
    }).catch(err => {});
    import(/* webpackChunkName: "banks/printUrl/[request]"  */`@/api/bank/printUrl/${bankName}PrintUrl`).then(module => {
      setPrintUrlMap(module.default);
    }).catch(err => {});
    bankMenus = import(/* webpackChunkName: "banks/[request]"  */`@/api/bank/${bankName}Index`).then(module => {
      setRouterMap(module.default);
    }).catch(err => {});
    import(/* webpackChunkName: "banks/mainIndex/[request]"  */`@/api/bank/mainIndex/${bankName}MainIndex`).then(module => {
      setMainIndexMap(module.default);
    }).catch(err => {});
  }
  return bankMenus == null ? new Promise(resolve => { resolve() }) : bankMenus;
}

// function getCurData(data,arr) {
//   let curArr = []
//   arr.forEach(item=>{
//     curArr.push(data[item])
//   })
//   return curArr
// }
