const getters = {
  token: state => state.user.token,
  optAuths: state => state.user.optAuths,
  lock: state => state.app.lock,
  sidebar: state => state.app.sidebar,
  activeIndex: state => state.app.activeIndex,
  menusRoot: state => state.app.menusRoot, //有多个子系统
  menusNoRoot: state => state.app.menusNoRoot,
  visitedViews: state => state.app.visitedViews,
  mSidebar: state =>state.app.mSidebar,
  needKeepAliveList: state => state.app.needKeepAliveList,
  userInfo: state => state.user.userInfo,
  isLoading:state => state.app.isLoading,
  activeMenuName: state => state.app.activeMenuName,
  menuItems: state => state.app.menuItems,
  isNeedReLogin: state => state.user.isNeedReLogin,
  curEmbedMenu: state => state.app.curEmbedMenu,
  // addRouters: state => state.permission.addRouters,
  // searchRoute: state => state.permission.searchRoute,
  // openedRouterList:state => state.permission.openedRouterList
}
export default getters
