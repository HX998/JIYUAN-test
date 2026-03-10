import Cookies from 'js-cookie'
// let isIE = navigator.userAgent.indexOf("MSIE") >= 0 || navigator.userAgent.indexOf("Trident") >= 0  ? true : false
let isIE = false;
const app = {
  state: {
    lock: "",
    activeIndex: 0, // 当前激活根菜单
    sidebar: { // 是否展开菜单栏
      /* !+Cookies.get('sidebarStatus') 会将其他数字转换为false, 将数字0转换为true */
      opened: !+Cookies.get('sidebarStatus')
    },
    menusRoot: [], // 有多个子系统
    menusNoRoot: [], // 仅有一个系统[没有头部菜单],
    visitedViews: [{name: '首页', path: '/mainIndex', id: 'mainIndex'}], // 已打开视图
    mSidebar: {
      /* !+Cookies.get('mSidebarStatus') 会将其他数字转换为false, 将数字0转换为true */
      opened: false
    },
    needKeepAliveList: [],
    isLoading:false,
    iframeList: [{name: '首页', path: '/mainIndex', id: 'mainIndex', isActive: true}],
    curOpenTag: {},
    isIE: isIE,
    activeMenuName: {}, // 当前激活菜单信息
    menuItems: [],     //记录已展开菜单
    curEmbedMenu: {}   //记录当前打开的嵌入菜单路径
  },
  getters: {
    isIE: state => state.isIE,
    iframeList: state => state.iframeList
  },
  mutations: {
    LOCKSCREEN: state=> {
      state.lock = true
      Cookies.set('lock', true)
    },
    UNLOCKSCREEN: state => {
      state.lock = false
      Cookies.set('lock', false)
    },
    TOGGLE_SIDEBAR: state => {
      state.sidebar.opened = !state.sidebar.opened;
      if (state.sidebar.opened) {
        Cookies.set('sidebarStatus', 0);
      } else {
        Cookies.set('sidebarStatus', 1);
      }
    },
    TOGGLE_MSIDEBAR: state => {
      state.mSidebar.opened = !state.mSidebar.opened;
    },
    ACTIVE_ROOTINDEX: (state, index) => {
      state.activeIndex = index;
    },
    SET_MENUS_ROOT: (state, data) => {
      state.menusRoot = data;
    },
    SET_MENUS_NO_ROOT: (state, data) => {
      state.menusNoRoot = data;
    },
    ADD_VISITED_VIEWS: (state, view) => {
      let flag = state.visitedViews.some(v => {
        if(view.connectMode === "embed") {
          if(v.embedPath) {
            return v.embedPath.substring(v.embedPath.indexOf("url")).split("=")[1] === view.embedPath.substring(view.embedPath.indexOf("url")).split("=")[1];
          }
        } else {
          return v.path === view.path;
        }
      });
      if (flag) return;
      let visitedView = {
        name: view.name,
        path: view.path,
        id: view.connectMode !== "embed" ? view.meta.id : view.id,
        findId: view.connectMode !== "embed" ? view.meta.findId : view.findId,
        parentId: view.parentId,
        activeIndex: state.activeIndex,
      };
      if(view.connectMode === "embed") {
        visitedView.connectMode = view.connectMode;
        visitedView.embedPath = view.embedPath;
      }
      state.visitedViews.push(visitedView);
    },
    DEL_CUR_VISITED_VIEWS: (state, view) => {
      let index;
      /* entires返回一个迭代器，它返回数组的键/值对。 */
      /* for of循环功能相似，不同的是每次循环它提供的不是序号而是值。 */
      for (const [i, v] of state.visitedViews.entries()) {
        if(view.connectMode === "embed") {
          if (v.embedPath && v.embedPath.substring(v.embedPath.indexOf("url")).split("=")[1] === view.embedPath.substring(v.embedPath.indexOf("url")).split("=")[1]) {
            index = i;
            break;
          }
        } else {
          if (v.path === view.path) {
            index = i;
            break;
          }
        }
      }
      state.visitedViews.splice(index, 1);
    },
    DEL_ALL_VISITED_VIEWS: (state, view) => {
      state.visitedViews = [{name: '首页', path: '/mainIndex', id: 'mainIndex'}]
    },
    DEL_OTHER_VISITED_VIEWS: (state, view) => {
      state.visitedViews = [{name: '首页', path: '/mainIndex', id: 'mainIndex'}, view]
    },
    ADD_KEEP_ALIVE: (state, comName) => {
      if (state.needKeepAliveList.indexOf(comName) >= 0) return;
      state.needKeepAliveList.push(comName);
    },
    DEL_KEEP_ALIVE: (state, comName) => {
      let idx = state.needKeepAliveList.indexOf(comName);
      if (idx >= 0) {
        state.needKeepAliveList.splice(idx, 1);
      }
    },
    DEL_OTHER_KEEP_ALIVE: (state, comName) => {
      state.needKeepAliveList = ['home', comName]
    },
    DEL_ALl_KEEP_ALIVE: (state) => {
      state.needKeepAliveList = ['home']
    },
    ADD_FRAME: (state, frame) => {
      let isExist = false;
      state.iframeList.forEach((v, i) => {
        if (v.id == frame.id) {
          v.isActive = true;
          isExist = true;
        } else {
          v.isActive = false;
        }
      });
      if (isExist) return;
      frame.isActive = true;
      state.iframeList.push({
        name: frame.title,
        path: frame.path,
        id: frame.id,
        isActive: true
      });
    },
    DEL_FRAME: (state, frame) => {
      let index;
      for (const [i, v] of state.iframeList.entries()) {
        if (v.id === frame.id) {
          index = i;
          break;
        }
      }
      state.iframeList.splice(index, 1);
    },
    HIDE_FRAME: (state, frame) => {
      state.iframeList.forEach((v, i) => {
        v.isActive = false;
      });
    },
    SET_CUR_OPEN_TAG: (state, tag) => {
      state.curOpenTag = tag;
    },
    ACTIVE_MENU_NAME: (state, menuInfo) => {
      state.activeMenuName = menuInfo;
    },
    ADD_MENU_ITEMS: (state, menuItem) => {
      let isExist = state.menuItems.some((item, index) => {
        if (item.curMenu == menuItem.curMenu) {
          state.menuItems[index].scrollTop = menuItem.scrollTop;
          return true;
        }
      });
      if (!isExist) {
        state.menuItems.push(menuItem);
      }
    },
    DEL_CUR_MENU_ITEMS: (state, menuItem) => {
      let index;
      /* entires返回一个迭代器，它返回数组的键/值对。 */
      /* for of循环功能相似，不同的是每次循环它提供的不是序号而是值。 */
      for (const [i, v] of state.menuItems.entries()) {
        if (v.curMenu === menuItem.curMenu) {
          index = i;
          break;
        }
      }
      if (!!index) {
        state.menuItems.splice(index, 1);
      }
    },
    DEL_OTHER_MENU_ITEMS: (state, menuItem) => {
      let curMenuItem;
      for (const [i, v] of state.menuItems.entries()) {
        if (v.curMenu === menuItem.curMenu) {
          curMenuItem = v;
          break;
        }
      }
      if (!!curMenuItem) {
        state.menuItems = [curMenuItem];
      }
    },
    DEL_ALL_MENU_ITEMS: (state) => {
      state.menuItems = [];
    },
    CUR_EMBED_MENU: (state, curEmbedMenu) => {
      state.curEmbedMenu = curEmbedMenu;
    },
  },
  actions: {
    addRouteKeepAlive: ({ commit }, comName) => {
      commit('ADD_KEEP_ALIVE', comName);
    },
    refreshCurPage: ({ commit }, comName) => {
      commit('DEL_KEEP_ALIVE', comName);
    },
    delOtherKeepAlive: ({ commit }, comName) => {
      commit('DEL_OTHER_KEEP_ALIVE', comName);
    },
    delAllKeepAlive: ({ commit }) => {
      commit('DEL_ALl_KEEP_ALIVE');
    },
    lockscreen: ({ commit }) => {
      commit('LOCKSCREEN');
    },
    unlockscreen: ({ commit }) => {
      commit('UNLOCKSCREEN');
    },
    ToggleSidebar: ({ commit }) => {
      commit('TOGGLE_SIDEBAR');
    },
    ToggleMSidebar: ({ commit }) => {
      commit('TOGGLE_MSIDEBAR');
    },
    ActiveRootIndex({ commit }, data) {
      commit('ACTIVE_ROOTINDEX', data);
    },
    GenerateMenuByMenus({ commit }, data) {
      let menus = JSON.parse(window.sessionStorage.getItem('menus'));
      if (menus && menus.length > 0 && data && data.length > 0) {
        // menusType: '0' 无topMenu
        // menusType: '1' 有topMenu
        if (Cookies.get('menusType') == "1") {
          commit('SET_MENUS_ROOT', data);
        } else {
          commit('SET_MENUS_ROOT', data);
        }
      } else {
        if (data && data.length >= 0) {
          // menu.parentCode === 'BIZFRAME //头部根路径
          let newMenu = data.filter(menu => {
            return !menu.hidden && menu.parentId == window.LOCAL_CONFIG.MENUS_ROOT_NAME;
          });
          if (newMenu.length > 0) {
            window.sessionStorage.setItem('menus', JSON.stringify(newMenu));
            Cookies.set('menusType', '1');
            commit('SET_MENUS_ROOT', newMenu);
          } else {
            Cookies.set('menusType', '0');
            // commit('SET_MENUS_NO_ROOT', newMenu)
            window.sessionStorage.setItem('menus', JSON.stringify(data));
            commit('SET_MENUS_NO_ROOT', data);
          }
        }
      }
    },
    addVisitedViews: ({ commit }, view) => {
      commit('ADD_VISITED_VIEWS', view);
    },
    delCurVisitedViews: ({ commit }, view) => {
      commit('DEL_CUR_VISITED_VIEWS', view);
    },
    delAllVisitedViews: ({ commit }, view) => {
      commit('DEL_ALL_VISITED_VIEWS', view);
    },
    delOtherVisitedViews: ({ commit }, view) => {
      commit('DEL_OTHER_VISITED_VIEWS', view);
    },
    addFrame: ({ commit }, iframe) => {
      commit('ADD_FRAME', iframe);
    },
    hideFrame: ({ commit }, iframe) => {
      commit('HIDE_FRAME', iframe);
    },
    delCurFrame: ({ commit }, iframe) => {
      commit('HIDE_FRAME', iframe);
    },
    setCurOpenTag: ({ commit }, tag) => {
      commit('SET_CUR_OPEN_TAG', tag);
    },
    setActiveMenuName: ({ commit }, menuInfo) => {
      commit('ACTIVE_MENU_NAME', menuInfo);
    },
    addMenuItems: ({ commit }, menuItem) => {
      commit('ADD_MENU_ITEMS', menuItem);
    },
    delMenuItems: ({ commit }, menuItem) => {
      commit('DEL_CUR_MENU_ITEMS', menuItem);
    },
    delOtherMenuItems: ({ commit }, menuItem) => {
      commit('DEL_OTHER_MENU_ITEMS', menuItem);
    },
    delAllMenuItems: ({ commit }) => {
      commit('DEL_ALL_MENU_ITEMS');
    },
    setCurEmbedMenu: ({ commit }, curEmbedMenu) => {
      commit('CUR_EMBED_MENU', curEmbedMenu);
    },
  }
};
export default app;
