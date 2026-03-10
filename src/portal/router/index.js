import Vue from 'vue'
import Router from 'vue-router'
import {constantRouterMap} from './constantRouterMap.js'

Vue.use(Router)

// 修复重复点击菜单会抛出 "NavigationDuplicated" 错误。
// vue-router 在 push/replace 时如果目标与当前路由相同会返回一个 rejected promise，
// 对于菜单快速双击尤其容易触发。我们在原型上包裹一层，默认为空处理。
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) {
    return originalPush.call(this, location, onResolve, onReject);
  }
  return originalPush.call(this, location).catch(err => {
    if (err && err.name === 'NavigationDuplicated') {
      return err;
    }
    throw err;
  });
};

/* 常量路由 */



const router = new Router({
  // mode: 'history',
  scrollBehavior: () => ({y: 0}),
  routes: constantRouterMap
})

export default router
